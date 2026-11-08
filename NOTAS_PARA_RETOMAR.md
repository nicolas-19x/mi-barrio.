# Notas para retomar «Mi Barrio»

Léelo entero antes de tocar nada. Después, responde la **prueba de lectura** del final.

## Qué es el proyecto
- Juego en una sola página: `Mi_Barrio.html` (~1,36 MB), armado desde `src/`. Canvas 2D, sin librerías externas.
- Estilo visual «B» (cinematográfico, tipo Eastward): arte HD dibujado por código, sin imágenes externas.
- Rama de trabajo: **`ccr-ab2778bc-9bjz20`**. Commitear y subir solo ahí. No abrir PR si no lo piden.
- Commits: terminar el mensaje con `Co-Authored-By: ...` y `Claude-Session: https://claude.ai/code/session_015uL8vPafria5S3vB1dGR5X`. No poner nombres de modelo en commits ni PRs.

## Cómo está organizado el código
- **Se edita en `src/` y se arma con `python3 build.py`** (que escribe `Mi_Barrio.html`). `python3 build.py --check` dice si el HTML está al día. Si se edita el HTML a mano, el próximo build lo pisa.
- La guía completa está en **`src/README.md`**: qué hay en cada carpeta (`js/core` motor y contenido original por secciones, `js/hd` arte estilo B, `js/prog` progresión, `js/ui`, `js/net`, `css/`), y recetas para agregar NPC, misiones, apps, mapas y logros.
- El HTML armado conserva los marcadores `// <HD>`, `// <PROG>`, `// <UI>`, `// <NET>`. HD se evalúa **temprano**; PROG/UI/NET al **final**, cuando el barrio ya se generó: en `prog/`, lo que se use al arrancar tiene que ser `function` o `var`, no `const`/`let` de nivel superior.
- Para engancharse a funciones del juego se usan los **ganchos** de `js/prog/00_hooks.js`: `hookAfter('ecoDay', fn)`, `hookBefore`, `hookFilter('metas', fn)`. Conservan el orden de los viejos envoltorios encadenados. Otras funciones todavía se envuelven a mano `{const _x=fn;fn=function(){…}}`. Ojo: `spend` y `earn` son `const`, no se pueden envolver.
- **Música: se quitó a pedido del usuario** (se rehará después). Quedan `OPT.music`/`OPT.musicVol` en las opciones guardadas y las marcas `proMus(...)` del prólogo; los efectos de sonido siguen.
- Para comprobar que un cambio técnico no altera el juego: la herramienta de equivalencia (Playwright con reloj y azar fijos que compara huellas de 53 pantallas y del estado guardado entre dos HTML) se describe en `src/README.md` → sección de pruebas.

## Estado actual
1. **Arte HD completo**: barrio, casas, tiendas, interiores, luz (día, noche, lluvia), animales, personajes, Chepe, Mercado Central, bus en perspectiva y tránsito con atropellos.
2. **Mapa ampliado hacia el sur** (84×84): Calle 3, Parroquia San Isidro (con interior), plaza con fuente, servicentro La Pasada, Taller El Abuelo, lote «SE VENDE», casas nuevas y **El Hoyo** (callejón vigilado por El Chiqui y Pelón; contraseña «Tata»).
3. **Progresión** (bloque PROG, estado en `S.f.pg`, se obtiene con `PGS()`):
   - F1 Vehículos (`VM`): bici, bici de ruta, motos, Corollita del 96 y La Bestia. Licencia (examen tico en la app COSEVI), gasolina, taller, marchamo, RTV, retenes, robos, crédito, repartidor «Pedidos Mae».
   - F2 Casa: cochera, tallercito, segundo piso, terraza, decoración (`DECO`) con puntos de comodidad (`comfort()`), inquilino en el cuarto de arriba.
   - F3 Negocio: carrito de copos (se le compra a Doña Mireya en Chepe; minijuego `srvStart(COPO_CFG)`), **Soda Mi Barrio** en el lote (Don Rigo, Doña Chela de cocinera, permiso sanitario), y la app CoopeBarrio R.L. (ahorro, préstamo, tanda de Doña Rosa). Lotería con Don Fello en la plaza (Chances martes y viernes, Nacional el domingo). Prestamista Don Mauro en El Hoyo.
   - F4 Respeto del barrio (`progRep`, `REPLV`, 6 niveles), logros (`LOGROS`) y la app **Metas**.
   - F5 Viaje a **Puntarenas** manejando. Fiesta en la terraza. (Puntarenas se rehízo en grande: ver el punto 9.) **Asociación de Vecinos** (app): turnos, donaciones, elecciones y proyectos que se ven en el mapa (rótulos de vigilado, alumbrado, basureros, mural de carreta, play).
   - F8 La soda crece (`prog/45_soda.js`): la soda tiene 5 niveles (`SODA_LV`), nombre propio (`sodaNombre()`, sale en el rótulo HD), 5 mejoras (`SODA_SUP`), **Ariana como cocinera** (`NEG().ari` = `'emp'` empleada con ₡6 000/día o `'socia'` con 30% de ganancias; vende +35%/+50%; trabaja de día en la soda vía `LOC.soda` y un `locFor` envuelto; inventa recetas `RECS` que aparecen en el minijuego), catering (`CAT_T`, desde el nivel 4) y franquicias (`FRANQ`, nivel 4 y fama ≥ 40). Todo se maneja en la app **Mi soda** (`appReg({id:'soda'})`). Ojo: `hd/inject.py` ahora acepta que el parche de `carProxies` ya esté aplicado (usa `marker`).
   - F7 Magnate (`MAG()`, estado en `S.f.pg.mag`): app **Empresas** (`EMP`: empanadas, feria, lavacar, taxi, ferretería, sucursal de la soda, ruta de buses, finca de café, hotel en Puntarenas; 3 niveles, gerente), **Bienes raíces** (10 casas vacías del barrio en `PROPS`, con inquilinos, remodelación y rótulo en el mapa; más lote en Guanacaste, apartamento en Escazú y acciones), **Patrimonio** (`patrimonio()`, títulos hasta «Magnate de Costa Rica»), **Fundación** (`FUND`: comedor y cancha sintética en El Hoyo, becas, escuela, hogar de ancianos) y **Diseño del barrio** (`DIS`, solo el presidente de la Asociación: pone bancas, árboles, faroles, etc. en la casilla de enfrente; nunca deja una puerta sin paso).
4. **Historia secundaria «La Vieja del puente»** (`prog` → `MONA()`, estado en `S.f.mona`, misión `mona` en `QUESTS`). Cierra el prólogo de La Mona. Arranca con un mensaje de Ariana a las 3:33 (cariño ≥15 y pesadilla de la moto cerrada, o día 12). Pistas: Don Chepe (banca de la plaza, era el del peaje), Doña Chela en El Hoyo (Doña Eulalia y su hijo Rafa, muerto en 1978 corriendo con el Tata) y Don Alexander (solo si su opinión es «Te respeta»: él manejaba el taxi rojo en 2009). Ariana no se sube si manejás mal (choques + multas). Escena en el puente (`monaPuente`, lienzo `#monaCv`) con tres finales: `paz` (llamarla «Doña Eulalia»), `misterio` y `huida` (se reintenta a los 5 días). El final `paz` sigue con la estampita para Don Alexander (`S.f.monaPaz`).
5. **Multijugador LAN**: `server/server.js` (puerto **8080**, salas de 4 letras, máximo **6** por sala). `NET_DELAY=130`. Ahora cada jugador manda su vehículo (`rv` en el mensaje `pos`) y los demás lo ven manejando.
6. **Ariana**: modelo propio (`npcAri()` / `ariSprite()`), tez `#e3b597`, pelo negro lacio, blusa celeste.

7. **Ciudad Quesada**: parque y catedral en estilo B, **sacado del juego por ahora** y guardado en `src/guardado/quesada/` (ver su LEEME).

8. **Varias partidas**: 6 ranuras, botón «Guardar partida» en pausa y panel «Partidas» en el menú (`prog/05_partidas.js`). **El juego ya NO guarda solo**: `saveGame()` solo marca `SAVE_DIRTY` y escribe únicamente cuando lo llama `partGuardar` (que prende `SAVE_OK`) o si `SAVE_AUTO` es true (las pruebas lo prenden con `window.__SAVE_AUTO=true`). Lo que se hace después del último guardado se pierde al recargar. Hay un aviso «Sin guardar» en la esquina (tocarlo guarda) y el navegador pregunta al cerrar con cambios; al empezar una vida nueva se hace un primer guardado.

9. **Puntarenas en grande** (`prog/52_puntarenas.js` mapa, arte y mar · `53_playa_gente.js` gente · `54_mar.js` nadar, lancha y banana · `55_fiesta_playa.js` borrachera, logros y Ariana):
   - Mapa `playa` de 128×50: fachadas del puerto, Paseo de los Turistas con tránsito (`PZ.cars`: carros, taxis, buses, motos, pickups, bicis), bulevar con almendros, bancas, faroles, chinamos y letras PUNTARENAS; muro con gradas; playa larga; muelle con T y lanchas; manglar al oeste y caleta al este. La clase de cada casilla está en `PZ.k` (y el suelo sin objetos en `PZ.g`).
   - El mar se pinta quieto en el fondo y se anima encima en `pzSea` (orilla con espuma, ondas, destellos según la hora, boyas; de noche luna y faroles reflejados en `hookAfter('hdLight')`).
   - El jugador tiene dos niveles cerca del muelle (`P.deck`): arriba del tablado o abajo (el tablado se dibuja aparte, `pzDeckDraw`). Nadar: `P.swim`, más lento, cansa, no pasa de las boyas (`PZ_BOYA`), el salvavidas te saca si te quedás sin energía, el sol quema de 10 a 3 sin bloqueador.
   - 3 lugares escondidos con tronco (`PZ_SECRETS`: claro del manglar por un trillo, debajo del muelle, la caleta pasando las piedras), con escena de pantalla completa (`pzSit`, capa `#pzov` de `pzOvOpen`) y conversaciones de Ariana.
   - ~35 personas: familias, pareja de luna de miel, fumadores con humo (`e.smoke`), pescadores con caña, bañistas (`e.swim`), salvavidas, vendedores que caminan (copos, mango, ceviche, lotería con «tiempos» que se juegan en la noche, gorras y lentes), perros y la mejenga 3 contra 3 con bola que se patea (`PZP`).
   - Paseo en lancha con el Capitán Wílber (`pzLancha`) y la banana con Yeison (`pzBanana`, minijuego). Bar La Deriva en la acera norte.
   - Borrachera (`S.f.borr`, `pzDrunkLvl()`): camina torcido, la pantalla se mece, goma al día siguiente; desde nivel 2 no se maneja (`progMount` y `playaTrip` envueltos: esperar, que maneje Ariana o «te la jugás» con retén, multa de ₡280 000 y licencia suspendida 3 días).
   - 7 logros nuevos (`pzSecretos`, `pzGol`, `pzBanana`, `pzDelfin`, `pzBoyas`, `pzGoma`, `pzAri`). El estado de la playa vive en `S.f.pg.pz` (`PZS()`).
   - Pintar el mapa tarda ~0,6 s en una compu (unos 2-3 s en un celular lento) y se hace durante el fundido del viaje.

## Pendientes
- Probar el multijugador en celulares reales.
- Ariana: la cara de perfil.
- NPC con peor arte (Don Chito, Don Fito, los de lentes, sombreros y gorras): **el usuario todavía no eligió cuál retocar**. Preguntar antes.
- Ideas sin hacer: ir a la playa en bus, mejenga entre jugadores, pasar plata entre jugadores.
- Visto al pasar (no se tocó): hay dos `chaloTalk` (el de las raspaditas de Chepe y el pescador de Puntarenas); como gana el último, el Don Chalo de Chepe usa la conversación del pescador. También hay dos `carAri`.

## Cómo probar
- Con Playwright (ya instalado): abrir `file:///home/user/mi-barrio./Mi_Barrio.html`, llamar `startGame(true)` y cerrar diálogos. Revisar que no haya `pageerror`.
- Para los minijuegos de atención: `SRV`, `srvClick('sir:fresa')`, `srvClick('go')`.
- Multijugador: `PORT=8092 node server/server.js` y abrir dos páginas en `http://localhost:8092/`.
- Antes de commitear: extraer el `<script>` y correr `node --check`, y revisar 60 FPS de noche con lluvia.

## Reglas de trabajo con el usuario
- Responder en **español** de Costa Rica.
- Mostrar capturas antes de decir que algo quedó bien.
- No cambiar el juego sin que el usuario lo pida. Para cambios grandes, presentar plan primero.
- Siempre la esencia tica y el estilo B.

---

## Prueba de lectura (responder ANTES de trabajar)

Contesta estas preguntas **ejecutando comandos** (`git log`, `grep`), no de memoria. Si no puedes comprobar algo, dilo.

1. ¿Cuál es el hash corto del commit que agregó el viaje a Puntarenas?
2. ¿Qué valor tiene `NET_DELAY` y en qué bloque está?
3. ¿Cómo se llama la cocinera que se puede contratar para la soda, y en qué mapa vive?
4. ¿Qué contraseña piden los vigilantes para entrar a El Hoyo?
5. ¿Cuál es el nombre de la rama de trabajo?
6. ¿Con qué comando se arma `Mi_Barrio.html` y en qué archivo está el registro de ganchos (`hookAfter`)?

**Respuestas correctas:** 1) `da3dec5`. 2) `130`, bloque `// <NET>`. 3) Doña Chela, en `hoyo` (El Hoyo). 4) «Tata». 5) `ccr-ab2778bc-9bjz20`. 6) `python3 build.py` (y `--check` para verificar); `src/js/prog/00_hooks.js`.

Si respondes algo que no coincide con el repo, o si el repo no tiene `NOTAS_PARA_RETOMAR.md`, **estás en otro repositorio o te confundiste**: detente y avisa al usuario antes de tocar código.
