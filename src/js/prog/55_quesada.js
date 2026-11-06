// ---------- Ciudad Quesada, San Carlos: el parque (paso 1) ----------
// El arte está en hd/94_quesada.js. Por ahora solo el parque y sus calles; la catedral, el viaje y los vecinos vienen después.
// Acceso de prueba mientras no hay viaje: abrir el juego con #quesada al final de la dirección (Mi_Barrio.html#quesada).
function genQuesada(){const W=40,H=36,m=newMap('quesada',W,H,'Ciudad Quesada');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=8,s=0;
    if(y<=2){t=4;s=1}                                                   // jardín de la catedral (por ahora cerrado)
    else if(y===35||x===0||x===39){t=2;s=1}                              // borde del mapa
    else if((y>=4&&y<=5)||(y>=33&&y<=34)||(x>=1&&x<=2)||(x>=37&&x<=38))t=1;   // Calle Central, calle sur y avenidas
    else if(y===3||y===6||y===32||x===3||x===36)t=2;                     // aceras
    setT(m,x,y,t,s)}
  const sol=(x,y,w,h)=>{for(let j=y;j<y+(h||1);j++)for(let i=x;i<x+(w||1);i++)setT(m,i,j,ti(m,i,j),1)};
  const k=QS.kiosko;sol(k[0],k[1],k[2],k[3]);m.objs.push({type:'kioscoQ',x:k[0],y:k[1],w:k[2],h:k[3]});
  for(let y=8;y<14;y++)for(let x=16;x<24;x++)if(qsPoolD(x*32+16,y*32+16)<16)sol(x,y);   // estanque de la fuente
  for(const[x,y]of QS.trees)sol(x,y);for(const[x,y]of QS.lamps.concat(QS.slamps))sol(x,y);for(const[x,y]of QS.benches)sol(x,y);
  for(const[x,y,v]of QS.cars)v?sol(x,y,1,2):sol(x,y,2,1);
  sol(6,23,2,2);sol(8,27,2,2);sol(15,23,2,2);sol(13,28);sol(15,28);            // juegos infantiles
  for(const[x,y]of QS.lamps)m.lights.push({x:x*T+8,y:y*T+14,r:60,pole:1});
  for(const[x,y]of QS.slamps)m.lights.push({x:x*T+8,y:y*T+14,r:72,pole:1});
  m.lights.push({x:QS.ki.x/2,y:QS.ki.y/2-8,r:58});
  m.walk=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!solidT(m,x,y)&&(ti(m,x,y)===8||ti(m,x,y)===2))m.walk.push([x,y]);
  renderMap(m);return m}
{const _e=ensureMapP;ensureMapP=function(id){if(id==='quesada'&&!MAPS.quesada)genQuesada();return _e(id)}}
{const _r=renderMapHD;renderMapHD=function(m){if(m&&m.id==='quesada'){if(!HD_ON)return;const r=hdQuesada(m);m.base2=r.base;m.top2=r.top;return}return _r(m)}}
hookFilter('mapLabel',function(r,m){return m&&m.id==='quesada'?'Ciudad Quesada · Parque':r});
// minimapa: el mismo dibujo del mapa, en chiquito (como la playa)
{const _dm=drawMini;drawMini=function(){const m=MAPS[P.map];if(!m||m.id!=='quesada')return _dm();const mc=$('#mini');if(!mc)return;const g=mc.getContext('2d'),src=m.base2||m.base;if(!src)return;
  const W=mc.width,H=mc.height,k=Math.max(W/(m.w*T),H/(m.h*T));g.fillStyle='#14101c';g.fillRect(0,0,W,H);g.imageSmoothingEnabled=true;const dw=m.w*T*k,dh=m.h*T*k,ox=Math.min(0,Math.max(W-dw,W/2-P.x*k)),oy=Math.min(0,Math.max(H-dh,H/2-P.y*k));
  g.drawImage(src,ox,oy,dw,dh);g.fillStyle='#fff';g.beginPath();g.arc(ox+P.x*k,oy+P.y*k,3.5,0,7);g.fill();g.fillStyle='#e8524a';g.beginPath();g.arc(ox+P.x*k,oy+P.y*k,2.2,0,7);g.fill()}}
// acceso de prueba: Mi_Barrio.html#quesada
function quesadaPrueba(){if(!/quesada/i.test(location.hash||''))return;ensureMap('quesada');P.map='quesada';P.x=20*T+8;P.y=23*T+12;P.dir=1;snapCam();toast('🌳 Parque de Ciudad Quesada (acceso de prueba)')}
if(/quesada/i.test(location.hash||''))hookAfter('startGame',quesadaPrueba);   // solo con #quesada: en el juego normal no se engancha nada
ACT_POINTS.push({map:'quesada',x:20,y:32,label:'Volver al barrio',run(){say(null,'Por ahora esta es una visita de prueba: el viaje a San Carlos llega en el próximo paso.',[
  {t:'Volver al barrio',f(){fadeDo(()=>{P.map='ext';P.x=24*T+8;P.y=23*T+12;P.dir=0;snapCam()})}},{t:'Quedarme un rato'}])}});
