# Ciudad Quesada (guardado, fuera del juego)

Mapa de Ciudad Quesada, San Carlos: el parque (fuente de dos lóbulos, kiosco, juegos infantiles, senderos) y la Catedral
de Ciudad Quesada, hecho a partir de fotos reales. Se sacó del juego por ahora; estos archivos no entran en `build.py`.

Para volver a ponerlo:
1. Mover `94_quesada.js` a `src/js/hd/` y `55_quesada.js` a `src/js/prog/`.
2. `python3 build.py`.
3. Se entra con el botón «Ciudad Quesada (prueba)» del menú (lo crea `55_quesada.js`).

Lo que el juego todavía tiene preparado para este mapa (no estorba sin él): en `hd/50_light.js`, `hdCasters` llama a
`qsCasters` si existe, y `hdShadows` dibuja las sombras extra de `C.fx`.
El último commit con Quesada dentro del juego es `86415e0`.
