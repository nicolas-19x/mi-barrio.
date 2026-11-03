# Notas para retomar «Mi Barrio»

Léelo entero antes de tocar nada. Después, responde la **prueba de lectura** del final.

## Qué es el proyecto
- Juego en una sola página: `Mi_Barrio.html` (~980 KB). Canvas 2D, sin librerías externas.
- Estilo visual «B» (cinematográfico, tipo Eastward): arte HD dibujado por código, sin imágenes externas.
- Rama de trabajo: **`ccr-ab2778bc-9bjz20`**. Commitear y subir solo ahí. No abrir PR si no lo piden.
- Commits: terminar el mensaje con `Co-Authored-By: ...` y `Claude-Session: https://claude.ai/code/session_015uL8vRLoU87HCsa932nRq1`. No poner nombres de modelo en commits ni PRs.

## Estado actual (HEAD `c129aa4`)
1. **Arte HD completo** del barrio, casas, pulpería, tiendas, interiores, luz (día, noche, lluvia), animales y personajes.
2. **Ariana** tiene modelo propio (`03376ee`): tez clara `#e3b597`, pelo negro lacio `#1e1614`, blusa celeste. Sus datos van en `hd/data_ariana.js` (`ARID`) y en `npcAri()` / `ariSprite()` dentro del bloque HD de `Mi_Barrio.html`. Pendiente: la cara de perfil se ve mal.
3. **Multijugador LAN** (`c129aa4`), fases 0 a 3:
   - `server/server.js`: servidor sin dependencias. Puerto por defecto **8080**. Salas de 4 letras. Máximo **6** jugadores por sala.
   - En el juego: bloque `// <NET> ... // </NET>` dentro de `Mi_Barrio.html`. Constante `NET_DELAY=130`. Función `netOverlay()` dibuja nombres y burbujas.
   - Un celular (el anfitrión) simula el mundo y lo manda ~9 veces por segundo. Los demás interpolan.
   - Probado con Playwright (2 y 3 navegadores): posiciones exactas, NPC iguales, chat, gestos, cambio de anfitrión, reconexión.
   - Pendiente: probar en celulares reales, y la fase 4 (mejenga o penales entre jugadores, pasar plata u objetos, Chepe compartido).
   - Documentos: `PLAN_MULTIJUGADOR.md` (plan) y `server/README.md` (instrucciones de uso).

## Pendientes de arte
- Ariana: cara de perfil.
- NPC peores (lista ordenada): Don Chito (16) y Don Fito (37) (calvos con bigote), lentes (Randall, Oficinista, Don Chepe, Doña Lin, Doña Tere, Doña Lidia, Doña Rosa, Doña Cecilia), Don Alexander (4), barba de Don Memo (39), sombreros de Don Toño y Don Wálter, gorras, moños blancos, Turista (27), Don Tavo (44), y el cuerpo igual para todos.
- **El usuario todavía no eligió cuál NPC retocar.** No empezar uno sin preguntar.
- Pendientes más grandes: escena del bus en estilo B (`drawTrip`), y rediseño de los edificios de Chepe (hoy solo tienen remasterizado EPX).

## Cómo probar
- Scripts de prueba en la carpeta de trabajo de la sesión anterior (`scratchpad/t/`): `full.js` (un jugador: sin errores, 60 FPS de noche con lluvia), `crowd.js`, `allnpc.js` (hoja de todos los personajes).
- Multijugador: `scratchpad/net/t/mp.js` y `mp2.js` (levantan el servidor solos en puertos de prueba).
- Regenerar el HD: `hd/inject.py` (idempotente). Regenerar NPC: `mk/npcbake.py` y luego `mk/npcexport.py`. Ariana: `mk/ariexport.py`. Multijugador: `server/...` y `inject_net.py` (en la carpeta de scratchpad, bloque `net/net.js`).
- Si cambias `Mi_Barrio.html`, corre `full.js` antes de commitear.

## Reglas de trabajo con el usuario
- Responder en **español** (Costa Rica, tuteo con «vos»/«usted» como el usuario).
- Mostrar capturas antes de decir que algo quedó bien. Enviarlas con SendUserFile.
- No cambiar el juego sin que el usuario lo pida. Para cambios grandes, presentar plan primero.

---

## Prueba de lectura (responder ANTES de trabajar)

Contesta estas preguntas **ejecutando comandos** (`git log`, `grep`), no de memoria. Si no puedes comprobar algo, dilo.

1. ¿Cuál es el hash corto del último commit de la rama, y cuál es su mensaje?
2. ¿Qué valor tiene `NET_DELAY` y en qué archivo y bloque está?
3. ¿Qué puerto usa el servidor por defecto y cuántos jugadores caben por sala?
4. ¿Qué color de piel tiene Ariana y qué función decide si se usa su modelo propio?
5. ¿Cuál es el nombre de la rama de trabajo?

**Respuestas correctas hoy:** 1) `c129aa4`, «Multijugador local (LAN): servidor sin dependencias, salas, barrio compartido, gestos y chat». 2) `130`, en `Mi_Barrio.html`, bloque `// <NET>`. 3) `8080`, y `6`. 4) `#e3b597`, `npcAri()`. 5) `ccr-ab2778bc-9bjz20`.

Si respondes algo que no coincide con el repo, o si el repo no tiene `NOTAS_PARA_RETOMAR.md`, **estás en otro repositorio o te confundiste**: detente y avisa al usuario antes de tocar código.
