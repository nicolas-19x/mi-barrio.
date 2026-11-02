# El barrio como reloj — diagnóstico y dirección creativa

> Documento de diseño del rediseño del barrio (mapa `ext` de `Mi_Barrio.html`).
> Antes / después: `docs/img/mapa_antes.png` → `docs/img/mapa_despues.png`.

## 1. Cómo estaba construido

| Área | Estado encontrado |
|---|---|
| **Composición** | Grilla rígida de 84×56: dos calles de lado a lado con raya amarilla de carretera, una vertical y tres filas de casas idénticas (7×6, misma verja, misma maceta, misma puerta café). El parque es un rectángulo cercado en el centro. |
| **Escala** | Las calles tienen proporción de carretera nacional, no de barrio: parten el mapa en franjas en vez de unirlo. Las casas sí tienen buena escala respecto al personaje. |
| **Caminos** | Las cuatro casas del sur dan la espalda a la calle y sus pasillos (x 6, 16, 67, 77) **terminan contra una pared**. Para entrar había que rodear la casa por el zacate. El portón del **súper chino daba contra un poste: la tienda era inaccesible**. Un punto de aparición de NPC estaba sobre otro poste. |
| **Puntos de interés** | Todos funcionales (tiendas, misiones, penales). Casi nada existe solo para ser mirado. |
| **Exploración** | Grandes vacíos sin contenido: la franja norte, el sur entero salvo la entrada, el costado este. Recorrerlos no da nada. |
| **Atmósfera** | Noche = un velo azul plano; el día es igual de 7 a. m. a 5 p. m. Sonido: pitidos genéricos. Solo 3 peatones al azar y 4 animales. Nada cambia con la hora salvo dónde están los NPC. |
| **Rendimiento** | Bien de día (fondo y capa superior precalculados). De noche, un degradado radial nuevo por cada foco y por cada cuadro (~50). |

## 2. Las cinco oportunidades de mayor impacto

| # | Oportunidad | Tipo |
|---|---|---|
| 1 | **El barrio no dice qué hora es.** Nada en la calle cambia entre las 8 a. m. y las 4 p. m.; no hay rutinas ajenas al jugador. | Rediseño de la experiencia |
| 2 | **Las casas no tienen dueño.** Diez fachadas clonadas; no se reconoce un lugar sin leer el minimapa. | Artística |
| 3 | **Vacíos y caminos que no llevan a nada.** Zonas muertas, pasillos ciegos, una tienda inaccesible. | Rediseño de la experiencia + técnica |
| 4 | **La luz y el sonido son planos.** Sin hora dorada, sin ventanas encendidas, sin lluvia en el suelo, sin paisaje sonoro tico. | Técnica + artística |
| 5 | **No hay historias para descubrir.** Todo lo que se cuenta llega por diálogo o mensaje. | Rediseño de la experiencia |

## 3. Dirección elegida: «el barrio es un reloj»

El jugador debe poder saber la hora, el clima y el ánimo del barrio **por lo que ve y oye en la calle**, sin mirar el HUD. Visualmente: barrio tico de clase trabajadora, denso e informal (zinc, rejas, tapias, veraneras, cables, cunetas, la construcción eterna). Tono: cálido, humor seco, nostalgia, nunca postal turística.

Reglas que se siguieron para que no fuera una colección de añadidos:

1. **Todo lo nuevo responde a una hora, a un dueño o a una historia.** Si un objeto no cumplía una de las tres, se descartó.
2. **Mostrar antes que explicar.** Las huellas de Firulais aparecen solo mientras la misión está activa; el guarda advierte de la entrada con su propia voz; las mecedoras repiten el chisme de lo que usted hizo.
3. **El ambiente nunca bloquea.** La gente nueva no tiene colisión, no guarda estado ni toca misiones; los globos solo salen en modo juego, como mucho dos a la vez.
4. **No tocar lo que funciona.** Se mantienen huellas, puertas, coordenadas de misiones, tiendas, horarios de NPC y la casa del jugador (que tiene su propio sistema de mejoras).

## 4. Qué se implementó

### Técnico
- **Luz con un solo sprite precalculado** en vez de un degradado nuevo por foco y por cuadro.
- **Postes que prenden al anochecer**, escalonados, con parpadeo al arrancar; el **foco quebrado de la entrada** titila (refuerza que de noche es zona de asaltos).
- **Corrección de bugs anteriores:** poste movido de `[67,19]` a `[69,19]` (el súper chino vuelve a ser accesible); aparición de NPC `[48,19]` → `[47,19]`.
- Paisaje sonoro procedural con ruido filtrado (Web Audio), respetando `OPT.sound`.

### Artístico
- **Calles de barrio:** asfalto con bacheo y grietas, cunetas con rejillas, tapas de alcantarilla, raya casi borrada solo en la principal, cebras gastadas, **muertos** pintados donde cruzan chiquitos.
- **Casas con dueño** (una idea por casa, ligada al personaje):
  - Matías: la bola desinflada en el techo, bandera morada, el hueco del perro en la tapia.
  - Ariana: veraneras fucsia sobre la verja.
  - Suegros: seto recortado y chayotera.
  - Nicolás: segundo piso con varillas oxidadas, bloques y moto.
  - Marta: «CUIDADO CON EL GALLO».
  - Casa de la mamá de Carlillos: «SE ARREGLAN CELULARES».
  - Vecinos nuevos con nombre propio: los Solano, Doña Fela, los Mora y Doña Tere. Antes había tres casas llamadas «Casa de Nicolás».
  - Rejas en todas las ventanas, tanques negros, antenas y Sky.
- **Hora del día:** tinte de amanecer rosado, hora dorada, hora azul; la noche profunda es un poco más oscura para que manden los focos y las ventanas.
- **Ventanas encendidas** que se van apagando según cada casa; televisores que parpadean en azul; los comercios cierran a su hora.
- **Lluvia que moja:** calle oscurecida, charcos en los baches (que reflejan los postes de noche) y salpicaduras; la calle tarda en secarse. Los vecinos sacan **paraguas**.

### Experiencia
- **Lugares nuevos para los vacíos:**
  - el **cafetal** con porós que sube hacia el mirador;
  - el **potrero** con cerca de púas y dos vacas (Lucerito y Canela);
  - el **salón comunal** con mural de Italia 90;
  - la **gruta** de la Virgen;
  - la **plaza de tierra** con marcos de tubo, palo de mango y la basura junto al rótulo que la prohíbe;
  - **alamedas** que llevan a las puertas de las casas del sur;
  - **trillos** gastados donde la gente corta camino.
- **Rutinas por hora (el reloj):**

  | Hora | Qué pasa |
  |---|---|
  | 5:30–8:30 | Don Chalo y el pan en bici, con bocina |
  | 6:30–9:30 | Doña Tere riega (no sale si llueve) |
  | 11:54–12:54, lunes a viernes | Salida de la escuela |
  | 12:30–4:30 | Carrito de copos (se puede comprar) |
  | 2:00–5:36 | **Mejenga en la plaza**: la bola se puede patear y los chiquitos reaccionan; se juega aunque llueva |
  | 5:30–9:30 | Mecedoras de Doña Fela con **chisme que reacciona** a misiones, asaltos y la relación con Carlillos |
  | 6:00 | Campanas a lo lejos |
  | 7:00–10:30, sábados | **Bingo** en el salón comunal |
  | 9:00 p. m.–5:00 a. m. | **Don Memo, el guarda** en bici con pito, que avisa si usted se acerca a la entrada |
  | Noche | Perros que se contestan en cadena |

- **Sonido por hora:** gallo y yigüirro al amanecer, chicharras al mediodía, grillos y perros de noche, lluvia que suena más fuerte en el zinc cuando usted está bajo techo.
- **Rincones para mirar** (opcionales, una línea cada uno):
  - la gruta, que cambia de noche;
  - la banca grabada «Yuca + Lucía · 1987»: los suegros de jóvenes;
  - la bola en el techo;
  - el rótulo del gallo;
  - el segundo piso eterno;
  - el mural;
  - el rótulo de la basura;
  - el canasto del cafetal.

### Fuera de alcance (ideas siguientes, no implementadas)
- **Cimarrona y mascarada los domingos:** es el gran acontecimiento pendiente; necesita arte de mascarada propio.
- Tamales los viernes y camión de la basura, que requieren un calendario semanal más completo.
- Colisión dinámica para el carrito de copos.

## 5. Cómo se comprobó

Scripts de Playwright con Chromium sin interfaz. Se usaron como herramientas de verificación y no forman parte del juego.

1. **Alcanzabilidad.** Búsqueda en anchura desde la puerta del jugador hasta cada puerta, punto de aparición, objeto recogible, punto de actividad, animal y acera de peatón.
   - Antes: 3 fallos (súper chino, NPC sobre poste y el marcador del kiosco, que es benigno).
   - Después: solo el del kiosco.
2. **Recorrido por horas.** 15 capturas fijas (lugar × hora × clima) antes y después; se confirma que cada rutina aparece y desaparece en su ventana.
3. **Día completo simulado.** 24 h de juego cambiando de lugar cada hora, con lluvia, un interior y San José: **0 errores**. Detectó y se corrigió un error de Web Audio (volumen 0 en rampas exponenciales).
4. **Interacciones.** Tazo, penales, copos (diálogo con 3 opciones), los rincones, Firulais, las vacas y el mapa grande responden.
5. **Rendimiento.** `render()` con vaciado forzado del pipeline (`getImageData`), 1280×800, rasterizado por software:
   - Día: sin cambio (~2,3 ms).
   - Noche: 8,7 → 9,4 ms (ventanas, velas, foco quebrado, bingo).
   - Amanecer y hora dorada: +1,6 ms solo en esas horas. Se eligió `overlay`, la mitad de coste que `soft-light`.
   - Todo queda dentro de 16,6 ms.
