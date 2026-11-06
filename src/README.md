# Código fuente de Mi Barrio

El juego se juega desde **un solo archivo**, `Mi_Barrio.html`, sin servidor ni instalación.
Ese archivo **se arma** a partir de los módulos de esta carpeta:

```
python3 build.py           # arma Mi_Barrio.html desde src/
python3 build.py --check   # dice si Mi_Barrio.html está al día con src/
```

Regla de oro: **se edita en `src/` y después se corre `build.py`**. Si se edita a mano `Mi_Barrio.html`,
el próximo `build.py` borra ese cambio.

## Cómo está organizado

```
src/
  template.html      Esqueleto HTML: menús, HUD, paneles, lienzos. Los marcadores /*@@CSS@@*/ y //@@JS@@ se rellenan al armar.
  manifest.txt       Orden en que se juntan los archivos de JavaScript (el orden importa: es un solo script).
  css/base.css       Estilos base del juego.
  css/ui.css         Sistema de interfaz: botones, ventanas, tapitas, celular, avisos.
  js/core/           El motor y el contenido original, en el mismo orden de siempre (una sección por archivo):
                     00-05 datos básicos, personajes, sprites y mapas · 06-12 minimapa, estado, entidades, actividades, audio y mirador
                     13-18 diálogos, conversaciones, romance, economía, pulpería, historias · 19-23 flujo, update, render, viajes, barrio 2
                     24 música (quitada; ver más abajo) · 25-33 prólogo y La Mona · 34 arranque · 35 bucle principal
  js/hd/             Arte en estilo B (pixel art HD dibujado por código). 00_core trae las herramientas de dibujo
                     (hdBuf, hdP, hdR, hdEll, hdPlaster, hdRoofZinc, hdRoofTeja, hdWindow, hdTreeSprite…). data_*.js son datos generados.
  js/prog/           Progresión y sistemas nuevos: mapa sur y El Hoyo, vehículos, casa, negocio, soda, metas, desbloqueos,
                     La Vieja del puente, magnate, mirador y el puro de Carlillos. 00_hooks.js es el registro de ganchos.
  js/ui/ui.js        Sonidos de interfaz, animaciones de salida y ajustes de paneles.
  js/net/net.js      Multijugador por red local (habla con server/server.js).
  tools/arte/        Herramientas y prototipos en Python con que se generaron los datos de arte (no entran al juego).
```

Dentro del HTML, cada grupo conserva sus marcadores (`// <HD>`, `// <PROG>`, `// <UI>`, `// <NET>`) para ubicarlos.
**Importante sobre el orden:** el bloque HD se evalúa temprano; `prog/`, `ui/` y `net/` se evalúan al final, cuando el barrio
ya se generó. Por eso, en `prog/`, lo que se use durante el arranque tiene que ser `function` o `var`, no `const`/`let`
de nivel superior.

## Extender sin romper: los ganchos (`js/prog/00_hooks.js`)

En vez de reescribir una función del juego, un sistema nuevo se engancha:

```js
hookAfter('ecoDay', function(){ ... });           // cada noche, después de la economía del día
hookAfter('startGame', function(){ ... });        // al empezar o cargar partida
hookAfter('update', function(dt){ ... });         // cada cuadro
hookBefore('ecoDay', function(){ ... });          // antes
hookFilter('metas', function(lista){ ...; return lista });   // modificar lo que devuelve (metas, casaHTML…)
```

El orden es el mismo que tenían los envoltorios encadenados: primero los «antes» (el último registrado corre primero),
luego la función original, luego «después» y filtros en el orden en que se registraron.

## Recetas rápidas

- **Un NPC nuevo del barrio:** `zPed(mapa, x, y, {id, name, hair, skin, shirt, pants, acc}, {stat:1, talk: e => say(e.c, '…')})`
  dentro de la generación del mapa (por ejemplo `genSur` en `js/prog/00_mapa.js`). El aspecto sale solo con el arte HD.
- **Un personaje principal con conversación:** sus datos van en los personajes (`js/core/02_characters.js`), su horario en `SCHED`,
  y su conversación es `TALK.<id> = function(){ … }`. Para agregarle algo sin tocar lo que ya dice, envolvé `TALK.<id>`
  como hacen `js/prog/60_mona.js` y `85_puro.js`: tu parte y después `afterD(() => original())`.
- **Una misión:** agregala a `QUESTS` (`{t:'Título', d:() => 'pista de qué hacer'}`) y a `QORDER`; se activa con `startQ(id)`
  y se cierra con `doneQ(id)`. Ejemplo completo: `QUESTS.mona` en `js/prog/60_mona.js`.
- **Un lugar donde interactuar:** `ACT_POINTS.push({map, x, y, label, cond: () => true, run(){ … }})`.
- **Una app del celular:** `appReg({id, n, ic, c, html(){ return '…' }, act(accion, arg){ … }})` (ver `js/prog/90_apps.js`).
- **Un mapa nuevo:** `newMap(id, w, h, nombre)` + `setT` para el suelo + `renderMap(m)`; se registra en `ensureMapP`
  (ver `genPlaya` en `js/prog/50_desbloq.js`). Para el arte HD, envolvé `renderMapHD` como hace la playa.
- **Un logro:** `LOGROS.push([id, icono, nombre, descripción, () => condición, puntosDeRespeto])`.
- **Algo que pase cada noche:** `hookAfter('ecoDay', …)`.

## La música

La música integrada se quitó a pedido (se va a rehacer de otra forma). Lo que queda listo para conectarla después:
`OPT.music` y `OPT.musicVol` siguen en las opciones guardadas, y el prólogo marca con `proMus({id, vol, lp})` qué ambiente
debería sonar en cada momento. Los efectos de sonido (`beep`, `uiSfx`, los del prólogo) no se tocaron.

## Lo que no hay que cambiar sin cuidado

- La forma de los datos guardados en `localStorage` (partida, opciones, personajes): las partidas existentes dependen de ella.
- Los mensajes del multijugador (`js/net/net.js` y `server/server.js` tienen que hablar igual).
- Los identificadores HTML que usa el código (`#panel`, `#pbody`, `#dialog`, `#vcan`, `data-a="…"`, etc.).

## Pruebas de equivalencia (`tools/pruebas/`)

Para comprobar que un cambio técnico (limpieza, reorganización) **no altera el juego**:

```
npm i playwright acorn acorn-walk           # una vez
node src/tools/pruebas/equivalencia.js /ruta/absoluta/viejo.html viejo.json
node src/tools/pruebas/equivalencia.js /ruta/absoluta/nuevo.html nuevo.json
node src/tools/pruebas/comparar.js viejo.json nuevo.json      # IDÉNTICOS o la lista de pasos distintos
node src/tools/pruebas/textos.js viejo.js nuevo.js            # (el <script> extraído) textos que desaparecen o aparecen
```

`equivalencia.js` recorre 53 pasos (barrio de día y de noche con lluvia, interiores, Chepe, Mercado, El Hoyo, la playa,
la iglesia, todas las apps del celular, conversaciones, mirador, minijuego de copos, economía de 12 días, bus, guardar y
continuar) con el reloj y el azar fijos y el audio apagado, y guarda una huella de cada pantalla y del estado del juego.
Un par de píxeles (el minimapa y la escena del bus) varían entre corridas del mismo archivo: comparar contra dos corridas.

## Rendimiento en celular (`tools/pruebas/rendimiento.js`)

```
node src/tools/pruebas/rendimiento.js /ruta/absoluta/Mi_Barrio.html 4 salida.json
```

Simula un celular (pantalla 390×844, escala 3, toque y el CPU 4 veces más lento) y mide, en el barrio, Chepe, el Mercado,
El Hoyo, la playa y el bus, los cuadros por segundo y los milisegundos de trabajo por cuadro. Sirve para comparar antes y después.
Las cifras absolutas no son las de un celular real (aquí el lienzo se pinta sin tarjeta gráfica), pero las comparaciones sí valen.

Dos reglas que salieron de medir:
- El lienzo principal se dibuja con `Z=2`: un píxel del arte HD es un píxel del lienzo, y el navegador lo agranda sin suavizar
  (ver `resize` en `js/core/01_basics.js`). Lo que mida tamaños en pantalla tiene que usar `DPR` y `Z`, no números fijos.
- Mientras el bus (`mode='trip'`) o el mirador (`mode='view'`) tapan la pantalla, el mundo no se dibuja (`js/core/35_loop.js`).

## Alturas y techo del templete (`js/prog/86_templete.js`)

- Cualquier personaje puede tener altura con `e.zl` (en píxeles del mundo): el pie y la sombra se dibujan `zl` píxeles más arriba
  (`render` y `hdShadows`). Hoy solo la usa el jugador al subir al templete, pero sirve para tarimas, camiones, etc.
- El jugador pisa la escalinata y la plataforma del templete: `moveEnt` se envuelve y una casilla sólida del templete se puede
  pisar si el punto cae en `tplIn(sx,sy)`. Bloquean las columnas, las mejillas de la escalera, el hueco del sótano y el borde.
  `tplElev` da el alto del suelo (cinco gradas y plataforma) y `tplTick` lo suaviza y hace sonar un clic por grada.
- Para que el techo tape a quien está debajo, el templete guarda la profundidad de cada píxel (`b.dep`, la Y de la escena × 4).
  Después de cada personaje que se cruza con el templete se le dibuja encima, recortado a su silueta, lo que queda más cerca
  de la cámara que él (`tplOverlay`, enganchado a `progProxies`). Funciona igual con vecinos que pasan por detrás.
