// ---------- Templete del Parque Central: escalinata, plataforma, techo y físicas ----------
// El templete se puede subir. Para el jugador, la huella del templete deja de ser un bloque sólido de casillas y pasa a ser
// el suelo real de la escena (ver hd/87_parque.js): se sube por la escalinata del frente (cinco gradas), se camina por la
// plataforma y por debajo de la cúpula, se pasa entre las seis columnas por los arcos y se puede rodear el techo por la orilla.
// Bloquean: las columnas, las mejillas (los muros de los lados de la escalera), el hueco del sótano y el borde de la plataforma.
//
// Coordenadas: la «escena» del templete es un plano de suelo visto con K=0.5 (hd/87_parque.js). Un punto del mundo (x,y) en
// píxeles de juego pasa a la escena como sx=(x-cx)*2, sy=(y-cy)*(2/K). El alto (z) se dibuja subiendo al personaje z/2 píxeles.
//
// Para que el personaje desaparezca bajo el techo no hay capas fijas: cada píxel del templete guarda su profundidad (Y de la
// escena). Después de dibujar a cada personaje que se cruza con el templete, se le dibuja encima, recortado a su silueta,
// lo que del templete queda más cerca de la cámara que él. Sirve igual para el jugador y para los vecinos que pasan por detrás.
var TPLC={m:null,o:null,id:null,cv:null,tread:-1,CA:.0};
var TPL_MARG=5;                        // margen (en unidades de escena) para que el suelo donde está parado no lo tape
function tplObj(){const m=MAPS.chepe;if(!m)return null;if(TPLC.m!==m){TPLC.m=m;TPLC.o=m.objs.find(o=>o.type==='templete')||null}return TPLC.o&&TPLC.o._hd?TPLC.o:null}
function tplScn(o,wx,wy){const k=o._hd;return[(wx-(k.X+TPL.CX)/2)*2,(wy-(k.Y+TPL.GY)/2)*(2/TPL.K)]}
// ¿se puede pisar este punto de la escena? (escalinata y plataforma, menos las columnas)
function tplIn(sx,sy){
  if(sx>=-31&&sx<=31&&sy>=88&&sy<=134)return true;                       // escalinata (con un poco de plataforma)
  if(sx*sx+sy*sy>97*97)return false;                                     // borde de la plataforma
  for(let i=0;i<6;i++){const a=i*TPL.SEG,cx=82*Math.cos(a),cy=82*Math.sin(a);if((sx-cx)*(sx-cx)+(sy-cy)*(sy-cy)<144)return false}   // columnas
  return true}
// alto del suelo en ese punto (unidades de escena): 25 la plataforma y cinco gradas de 5, 9, 13, 17 y 21
function tplElev(sx,sy){
  if(sx>=-31&&sx<=31&&sy>=88&&sy<=134){if(sy<100)return 25;return sy>=130?0:sy>=124?5:sy>=118?9:sy>=112?13:sy>=106?17:21}
  return tplIn(sx,sy)?25:0}
const tplTreadOf=(sx,sy)=>(sx>=-31&&sx<=31&&sy>=88&&sy<=134)?(sy<100?6:sy>=130?0:sy>=124?1:sy>=118?2:sy>=112?3:sy>=106?4:5):(tplIn(sx,sy)?6:0);
// colisión del jugador: igual que feetBlocked, pero una casilla sólida del templete se puede pisar si es suelo del templete
function tplBlocked(m,o,x,y){for(const[cx,cy]of[[x-5,y-4],[x+5,y-4],[x-5,y-.5],[x+5,y-.5]]){
    if(!solidT(m,Math.floor(cx/T),Math.floor(cy/T)))continue;const s=tplScn(o,cx,cy);if(!tplIn(s[0],s[1]))return true}return false}
{const _mv=moveEnt;moveEnt=function(e,dx,dy){
  const o=e===P&&P.map==='chepe'?tplObj():null;if(!o||(typeof riding==='function'&&riding()))return _mv(e,dx,dy);
  const m=MAPS.chepe;let moved=false;
  if(dx&&!tplBlocked(m,o,e.x+dx,e.y)){e.x+=dx;moved=true}
  if(dy&&!tplBlocked(m,o,e.x,e.y+dy)){e.y+=dy;moved=true}
  return moved}}
// altura del jugador (e.zl, en píxeles del mundo): sube y baja suave, y suena un clic en cada grada
function tplTick(dt){
  const o=P.map==='chepe'?tplObj():null;
  if(!o||(typeof riding==='function'&&riding())){if(P.zl)P.zl=0;TPLC.tread=-1;return}
  const s=tplScn(o,P.x,P.y-2),tz=tplElev(s[0],s[1])/2;
  P.zl=P.zl||0;const dz=tz-P.zl;P.zl=Math.abs(dz)<.04?tz:P.zl+dz*(1-Math.exp(-dt*22));
  const t=tplTreadOf(s[0],s[1]);
  if(t!==TPLC.tread){if(TPLC.tread>=0&&P.moving&&typeof beep==='function')beep(190+t*38,.04,'triangle',.016);TPLC.tread=t}}
hookAfter('update',function(dt){tplTick(dt)});
// el que se cruza con el templete: se le dibuja encima lo que queda delante de él
function tplOverlay(g,o,e){const k=o._hd,b=k.b,W=b.w,H=b.h,D=b.dep,zl=e.zl||0,SC=2/TPL.K,
    Ye=Math.round(((e.y-1)-(k.Y+TPL.GY)/2)*SC*4+TPL_MARG*4),
    bx0=Math.max(0,Math.floor((e.x-14)*2-k.X)),bx1=Math.min(W,Math.ceil((e.x+14)*2-k.X)),by0=Math.max(0,Math.floor((e.y-zl-42)*2-k.Y)),by1=Math.min(H,Math.ceil((e.y-zl+6)*2-k.Y)),w=bx1-bx0,h=by1-by0;
  if(w<=0||h<=0)return;
  if(!TPLC.id){TPLC.id=new ImageData(64,112);TPLC.cv=mk(64,112)}
  const dd=TPLC.id.data,sd=b.d;dd.fill(0);let any=false;
  for(let y=by0;y<by1;y++){let i=y*W+bx0,j=(y-by0)*64*4;for(let x=bx0;x<bx1;x++,i++,j+=4){if(D[i]>Ye){const s=i<<2;if(!sd[s+3])continue;dd[j]=sd[s];dd[j+1]=sd[s+1];dd[j+2]=sd[s+2];dd[j+3]=sd[s+3];any=true}}}
  if(!any)return;
  TPLC.cv.getContext('2d').putImageData(TPLC.id,0,0,0,0,w,h);g.imageSmoothingEnabled=false;
  g.drawImage(TPLC.cv,0,0,w,h,(k.X+bx0)/2,(k.Y+by0)/2,w/2,h/2)}
hookAfter('progProxies',function(list,map){
  if(map!=='chepe')return;const o=tplObj();if(!o)return;const k=o._hd,wx0=k.X/2,wy0=k.Y/2,ww=k.b.w/2,wh=k.b.h/2,n=list.length;
  for(let i=0;i<n;i++){const e=list[i];if(e.kind==='carv'||e.map!=='chepe')continue;const zl=e.zl||0;
    if(e.x+14<wx0||e.x-14>wx0+ww||e.y-zl+6<wy0||e.y-zl-42>wy0+wh)continue;
    list.push({kind:'carv',map,x:e.x,y:e.y+.02,draw:g=>tplOverlay(g,o,e)})}});
