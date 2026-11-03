# Plan: multijugador local (LAN) para «Mi Barrio»

Meta: varias personas, cada una en su celular y conectadas a la misma red wifi, exploran **el mismo barrio al mismo tiempo**, se ven caminar, entran a las mismas casas y tiendas, y se hablan o hacen gestos en tiempo real.

Este documento es el plan listo para empezar a implementarlo en la próxima sesión, sin tener que volver a investigar. Todo lo marcado como **Decisión** ya está tomado (se puede cambiar, pero no hace falta preguntar para arrancar).

---

## 1. Qué hay hoy (resumen técnico que importa)

- Todo vive en un solo archivo, `Mi_Barrio.html` (~950 KB), sin servidor.
- Hay un único jugador global: `const P={kind:'player',map,x,y,dir,...}` (línea ~1677). Muchísimo código asume que solo existe `P` (cámara, `findTarget`, puertas, diálogos, minijuegos).
- Las demás cosas del mundo son entidades en `ENTS` (`kind:'npc' | 'ped' | 'animal'`). Se mueven en `update(dt)`: `updNPC`, `updPed`/`updZPed`, `updAnimal`. Cada entidad tiene `map` (`'ext'` o el id de un interior), `x`, `y`, `dir`.
- El tiempo es `S.t` (minutos del día, avanza `dt*2`), `S.day`, `S.rain`. El bus es el objeto `bus`. Las posiciones de los NPC salen de `placeNPCs()` / `locFor(c)` según hora y misiones.
- El progreso del jugador (dinero, misiones, inventario) está en `S`, guardado en `localStorage` (`saveGame`).
- Dibujo: `render()` ordena `list` de entidades; los personajes HD salen de `npcSprite(c,dir,fi)` y `heroSprite(dir,fi,shirt)` (el héroe acepta color de camiseta). Las sombras salen de `hdShadows(m,list,cx,cy)`.
- Ya hay joystick táctil y botón A, o sea que ya se juega bien en celular.

Consecuencia: **no conviene convertir `P` en una lista de jugadores**. Es mucho código tocado y mucho riesgo. Los demás jugadores serán entidades nuevas `kind:'remote'` dentro de `ENTS`, como si fueran NPC controlados desde afuera.

---

## 2. Arquitectura elegida

### Decisión 1: un servidor liviano en la red local que hace de «cartero»

Un navegador no puede abrir un puerto para que otros celulares se conecten. Hace falta algo que escuche. Opciones evaluadas:

| Opción | Ventaja | Problema |
|---|---|---|
| **A. Servidor Node (WebSocket) en la LAN** ← elegida | Funciona siempre, baja latencia (~10-30 ms), sirve también el HTML, un solo comando para arrancar | Alguien tiene que correr `node server.js` (PC, o celular con Termux) |
| B. WebRTC sin servidor (emparejar con códigos QR) | Cero instalación | Emparejar escaneando QR en ambos sentidos es pesado, falla con muchos celulares y con algunos wifi (candidatos mDNS), 3+ jugadores es incómodo |
| C. Servicio en la nube | Funciona fuera de casa | Deja de ser «LAN», cuesta, y depende de internet |

Se hace la **A**, y la **B** queda como mejora opcional al final (fase 5).

**Cómo se usa (objetivo de experiencia):**
1. Una persona corre `node server/server.js` (en una compu, o en su celular con Termux). Imprime algo como `Abrí en el celular: http://192.168.1.23:8080` y un código QR.
2. Cada celular abre esa dirección. El servidor entrega `Mi_Barrio.html`, así que no hay que copiar archivos a cada celular.
3. En el menú principal aparece **«Multijugador»**: «Crear sala» o «Unirse» (código de 4 letras). Se elige nombre y color de camiseta.
4. Todos entran al mismo barrio.

**Servidor sin dependencias:** que arranque con solo `node server.js`, sin `npm install` (en Termux y en celulares eso ahorra problemas). Implementa un handshake WebSocket mínimo con `http` + `crypto` (solo mensajes de texto, unas ~100 líneas). Si da problemas, plan B: usar el paquete `ws`.

### Decisión 2: el mundo lo simula un «anfitrión», el servidor solo reenvía

Reescribir la lógica del juego en Node para que el servidor mande es inviable (el juego es un solo archivo enorme con la lógica pegada al dibujo). En cambio:

- El servidor **no sabe nada del juego**: crea salas, reparte ids y reenvía mensajes (como un chat).
- El **anfitrión** (el primero en crear la sala) corre la simulación normal del mundo: NPC, peatones, animales, bus, reloj, lluvia.
- El anfitrión manda una **foto del mundo** unas 8-10 veces por segundo. Los invitados la reciben y **no ejecutan** la IA de NPC: solo interpolan posiciones.
- Cada jugador mueve **su propio personaje localmente** (sin esperar al servidor, no hay lag al caminar) y manda su posición a los demás.
- **Si el anfitrión se desconecta**, el servidor nombra anfitrión al jugador más antiguo. Como ese celular venía recibiendo la foto del mundo, ya tiene todo y sigue la simulación desde ahí (migración barata).

Es confianza total entre amigos en la misma red: no hay anti-trampas ni cuentas.

### Decisión 3: qué se comparte y qué es personal

| Compartido (lo manda el anfitrión) | Personal (cada celular lo guarda) |
|---|---|
| Hora del día, día, lluvia | Dinero, inventario |
| Posición y movimiento de NPC, peatones, animales | Misiones e historia (`S.q`, `S.f`) |
| El bus (llegada y salida) | Partida guardada en su propio `localStorage` |
| Quién está en qué lugar (para verse) | Apariencia elegida |

Así cada quien sigue su propia historia dentro de un barrio compartido. No hay que sincronizar la lógica de misiones (que es la parte más enredada del juego). Se acepta que dos jugadores vean a un mismo NPC en el mismo sitio pero cada uno tenga un diálogo según **su** progreso.

---

## 3. Protocolo de mensajes (JSON por WebSocket)

Compacto, un mensaje = un objeto con `t` (tipo). Frecuencias pensadas para wifi doméstico.

**Cliente → servidor**
- `{t:'create', name, look}` → crea sala; responde `welcome`.
- `{t:'join', room, name, look}` → entra a una sala.
- `{t:'pos', map, x, y, dir, mv, f}` → mi posición. ~10 Hz, y solo si cambió (o un latido cada 1 s). `mv`: ¿camina?; `f`: cuadro de animación o fase.
- `{t:'emote', k}` / `{t:'chat', m}` → gestos y mensajes cortos.
- `{t:'npcTalk', id, on}` → avisar que estoy hablando con ese NPC (los demás lo ven «ocupado»).
- Solo anfitrión: `{t:'world', ...}` (abajo).

**Servidor → cliente**
- `{t:'welcome', id, room, host, players:[{id,name,look}]}`
- `{t:'join', p}` / `{t:'leave', id}` / `{t:'host', id}` (cambio de anfitrión)
- Reenvío de `pos`, `emote`, `chat`, `npcTalk` con el `id` del emisor.
- `{t:'world', ...}` reenviado a los invitados.

**Foto del mundo (`world`, ~8 Hz, solo anfitrión)**
```
{ t:'world', s:{ t: S.t, day: S.day, rain: S.rain },
  e:[ [id, map, x, y, dir, estado, hf], ... ],   // NPC, peatones y animales (id estable)
  bus:{ a, x, stop } }
```
Con ~60 entidades pesa unos 2-3 KB por foto: se puede mandar sin problema por wifi. Optimización simple: enviar solo las que se movieron, y una foto completa cada 2 s.

**Estado de cada entidad remota en el invitado:** guardar las dos últimas fotos y dibujar con ~120 ms de retraso interpolando (suaviza el movimiento). Si `map` cambia o el salto es grande, teletransportar en seco.

---

## 4. Cambios concretos en `Mi_Barrio.html`

Todo el código de red va en **un bloque nuevo** `// <NET> ... // </NET>`, inyectado igual que el bloque HD con un script idempotente (`inject.py`), para no ensuciar el resto.

1. **Entidades remotas.** `{kind:'remote', id, name, c, map, x, y, dir, hf, _st, tx, ty}` dentro de `ENTS`.
   - Dibujo: reutilizar `npcSprite` (con la apariencia que mandó cada jugador) o `heroSprite(dir,fi,shirt)` con su color de camiseta. **MVP: `heroSprite` + etiqueta con el nombre encima.**
   - Entran a `hdShadows` y al orden de profundidad como cualquier NPC (revisar `render()`, `list`).
   - Solo se dibujan si `e.map===P.map`.
2. **`update(dt)`** (línea ~3478): 
   - Anfitrión: todo igual + envía `world`.
   - Invitado: saltarse `updNPC`, `updPed`, `updAnimal`, `placeNPCs`, avance de `S.t` y de `bus`; en su lugar aplicar la foto interpolada. Seguir ejecutando `npcTick` para la animación de caminar.
   - Todos: enviar `pos` del propio `P`.
3. **Reloj y clima.** Mientras está conectado, el invitado sobrescribe `S.t`, `S.day`, `S.rain` con los del anfitrión (sin disparar `ecoDay()` ni eventos duplicados). Al desconectarse, vuelve a correr solo.
4. **Interacción.** En `findTarget`/`targetLabel`/`interact` (línea ~3342): si el jugador remoto más cercano está a menos de ~24 px, ofrecer **«Saludar»** (emote) y abrir un menú de gestos. El menú de gestos: 👋 saludar, 😂, ⚽ «¿mejenga?», 👍, ❓. Se dibuja como burbuja sobre la cabeza unos 3 s.
5. **Chat corto.** Botón de chat en la interfaz táctil (teclado del celular) y mensajes en burbuja sobre el personaje. Con filtro de longitud (60 caracteres) y límite de frecuencia.
6. **NPC ocupado.** Si `npcTalk` indica que otro jugador habla con ese NPC, el NPC se queda quieto y se muestra «(hablando con X)». El invitado no puede iniciar diálogo con él hasta que `on:false`.
7. **Menú principal.** Botón «Multijugador» → pantalla con: crear sala / unirse con código, nombre, color de camiseta (reutilizar el selector del editor de personaje), lista de jugadores conectados, indicador de ping.
8. **Pausas y celular.** El navegador del celular congela las pestañas en segundo plano: en `visibilitychange` avisar «volví» y pedir foto completa. Usar `navigator.wakeLock` para que la pantalla no se apague.
9. **Guardado.** El invitado **no guarda** el mundo compartido; solo su progreso personal (`S`) como siempre.
10. **Minijuegos y combate.** Quedan como están (individuales). Mientras un jugador está en combate/penales/bus a Chepe se marca como «ocupado» y los demás lo ven desaparecer del barrio (como si hubiera entrado a una casa).

### Casos borde que ya hay que tener en mente
- Viajar a Chepe: los demás no pueden seguirlo (`map` distinto), así que se ve como «salió». Opcional más adelante: que el mapa de Chepe también sea compartido.
- Dos jugadores intentan la misma misión/objeto: cada quien tiene su `S`, no hay conflicto.
- Dos celulares con la misma cuenta guardada: cada uno su `localStorage`, no interfieren.
- Muchos jugadores: techo recomendado **6** (4 cómodo). El costo es dibujar sprites extra, trivial.

---

## 5. Fases de implementación (en este orden)

Cada fase termina con algo **probado** y se puede subir a la rama sin romper el modo de un jugador.

**Fase 0 — Servidor y sala (medio día)**
- `server/server.js` (sin dependencias): sirve `Mi_Barrio.html` y WebSocket, salas por código de 4 letras, asigna ids, reenvía mensajes, elige anfitrión, imprime IP local + QR en consola.
- `server/README.md`: cómo correrlo en PC y en Termux, y qué hacer si el wifi aísla a los clientes (usar el hotspot de un celular).
- Prueba: dos clientes de prueba intercambian mensajes.

**Fase 1 — Presencia (verse caminando) (1 día)**
- Bloque `<NET>`, pantalla Multijugador, entidades `remote`, envío/recepción de `pos`, interpolación, nombre sobre la cabeza, interiores (solo se ven si están en el mismo `map`).
- Prueba con 2-3 pestañas de Playwright: A camina, B lo ve moverse en tiempo real y entran juntos a una casa.

**Fase 2 — Mundo compartido (1-2 días)**
- Anfitrión envía `world`; invitados dejan de simular NPC y aplican la foto. Reloj, lluvia, bus, animales sincronizados.
- Migración de anfitrión.
- Prueba: A y B ven al mismo NPC en el mismo lugar; al cerrar A, B sigue sin saltos raros.

**Fase 3 — Interacción social (1 día)**
- Emotes, burbujas de chat, «Saludar», NPC ocupado, lista de jugadores, avisos «X se unió / se fue».

**Fase 4 — Cosas para hacer juntos (opcional, 2+ días)**
- Mejenga/penales entre dos jugadores reales (hoy el rival es IA).
- Pasar dinero/objetos entre jugadores.
- Chepe compartido, fiesta del barrio compartida.

**Fase 5 — Pulido (1 día)**
- Reconexión automática, indicador de ping, ajuste de frecuencias según la calidad de la red, y opcional modo sin servidor con WebRTC + QR.

---

## 6. Pruebas

- **Automáticas (Playwright, ya usado en este proyecto):** levantar `server.js`, abrir 2-3 páginas, verificar: ids únicos, posiciones llegan, interpolación sin saltos, cambio de anfitrión, reconexión, que el modo de un jugador sigue igual (`full.js` existente debe seguir sin errores y a 60 FPS).
- **Con red mala:** opción en el servidor para meter retardo/pérdida artificial (p. ej. 80 ms, 5 %) y ver que el movimiento no se ve a tirones.
- **Manual en celulares reales:** 2 celulares en el mismo wifi, y otra vez con el hotspot de uno de ellos.

### Criterios de «terminado»
- Dos celulares ven al otro caminar con menos de ~200 ms de retraso.
- NPC y hora coinciden en ambos.
- Salir de la sala o cerrar el navegador no rompe a los demás.
- El juego de un solo jugador sigue funcionando exactamente igual.

---

## 7. Riesgos y cómo se manejan

| Riesgo | Mitigación |
|---|---|
| El wifi de la casa/escuela aísla a los dispositivos entre sí | Documentar el uso del hotspot del celular; mensaje claro si el cliente no logra conectar |
| iOS/Android duermen la pestaña | `wakeLock` + reenganche al volver (`visibilitychange` + foto completa) |
| Código del juego asume un solo jugador en muchos sitios | Los remotos son entidades aparte; no se toca `P` |
| El archivo crece (~+30 KB) | Bloque `<NET>` compacto; sin librerías externas |
| NPC con lógica por misión que difiere entre jugadores | Posición del NPC la decide solo el anfitrión; el diálogo usa el progreso de cada quien |
| Desfase entre relojes | Se sobrescribe `S.t` con el del anfitrión en cada foto |

---

## 8. Valores por defecto asumidos (cambiar solo si hace falta)

- Quien corre el servidor: una compu o el celular de alguien con Termux (`pkg install nodejs`).
- Progreso: **individual** por jugador; lo compartido es el mundo y la hora.
- Máximo de jugadores por sala: 6.
- Apariencia remota: el muñeco del héroe con el color de camiseta y el nombre que elija cada quien.
- Solo el barrio (`ext`) y sus interiores se comparten en la primera versión; Chepe y los minijuegos siguen siendo individuales.

---

## 9. Primeros pasos para la próxima sesión

1. Leer este documento.
2. Crear `server/server.js` y `server/README.md` (Fase 0) y probarlo con un cliente de prueba.
3. Crear el bloque `<NET>` e inyectarlo con un script idempotente (mismo patrón que `inject.py` del bloque HD).
4. Avanzar fase por fase, probando con Playwright en cada una y haciendo commit en la rama `ccr-ab2778bc-9bjz20`.
