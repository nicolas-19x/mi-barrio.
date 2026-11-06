// ---------- Ciudad Quesada, San Carlos: el parque (paso 1, remasterizado a escala grande) ----------
// El arte está en hd/94_quesada.js. Por ahora solo el parque y sus calles; la catedral, el viaje y los vecinos vienen después.
// Acceso de prueba mientras no hay viaje: botón «Ciudad Quesada (prueba)» en el menú (o Mi_Barrio.html#quesada).
function genQuesada(){const W=QS.W,H=QS.H,m=newMap('quesada',W,H,'Ciudad Quesada');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=8,s=0;
    if(y<=4){t=4;s=1}                                                         // jardín de la catedral (por ahora cerrado)
    else if(y===57||x===0||x===63){t=2;s=1}                                    // borde del mapa
    else if((y>=6&&y<=8)||(y>=54&&y<=56)||(x>=1&&x<=3)||(x>=60&&x<=62))t=1;     // Calle Central, calle sur y avenidas
    else if(y===5||y===9||y===53||x===4||x===59)t=2;                           // aceras
    setT(m,x,y,t,s)}
  const sol=(x,y,w,h)=>{for(let j=y;j<y+(h||1);j++)for(let i=x;i<x+(w||1);i++)setT(m,i,j,ti(m,i,j),1)},
    solHD=(x0,y0,x1,y1)=>sol(Math.floor(x0/32),Math.floor(y0/32),Math.floor((x1-1)/32)-Math.floor(x0/32)+1,Math.floor((y1-1)/32)-Math.floor(y0/32)+1);
  const k=QS.kiosko;sol(k[0],k[1],k[2],k[3]);m.objs.push({type:'kioscoQ',x:k[0],y:k[1],w:k[2],h:k[3]});
  for(let y=12;y<22;y++)for(let x=26;x<40;x++)if(qsPoolD(x*32+16,y*32+16)<24)sol(x,y);   // estanque de la fuente
  for(const[x,y]of QS.trees)sol(x,y);for(const[x,y]of QS.lamps.concat(QS.slamps))sol(x,y);for(const[x,y]of QS.benches)sol(x,y);for(const[x,y]of QS.bins)sol(x,y);
  for(const[x,y,v]of QS.cars)v?sol(x,y,1,2):sol(x,y,2,1);
  for(const e of qsEquip())solHD(...e[4]);                                    // juegos infantiles
  solHD(611,1080,766,1094);solHD(834,1080,967,1094);                           // murito verde (con paso al medio)
  for(const[x,y]of QS.lamps)m.lights.push({x:x*T+8,y:y*T+14,r:64,pole:1});
  for(const[x,y]of QS.slamps)m.lights.push({x:x*T+8,y:y*T+14,r:84,pole:1});
  m.lights.push({x:QS.ki.x/2,y:QS.ki.y/2-10,r:84});
  m.walk=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!solidT(m,x,y)&&(ti(m,x,y)===8||ti(m,x,y)===2))m.walk.push([x,y]);
  renderMap(m);return m}
{const _e=ensureMapP;ensureMapP=function(id){if(id==='quesada'&&!MAPS.quesada)genQuesada();return _e(id)}}
{const _r=renderMapHD;renderMapHD=function(m){if(m&&m.id==='quesada'){if(!HD_ON)return;const r=hdQuesada(m);m.base2=r.base;m.top2=r.top;return}return _r(m)}}
hookFilter('mapLabel',function(r,m){return m&&m.id==='quesada'?'Ciudad Quesada · Parque':r});
// minimapa: el mismo dibujo del mapa, en chiquito (como la playa)
{const _dm=drawMini;drawMini=function(){const m=MAPS[P.map];if(!m||m.id!=='quesada')return _dm();const mc=$('#mini');if(!mc)return;const g=mc.getContext('2d'),src=m.base2||m.base;if(!src)return;
  const W=mc.width,H=mc.height,k=Math.max(W/(m.w*T),H/(m.h*T))*1.6;g.fillStyle='#14101c';g.fillRect(0,0,W,H);g.imageSmoothingEnabled=true;const dw=m.w*T*k,dh=m.h*T*k,ox=Math.min(0,Math.max(W-dw,W/2-P.x*k)),oy=Math.min(0,Math.max(H-dh,H/2-P.y*k));
  g.drawImage(src,ox,oy,dw,dh);g.fillStyle='#fff';g.beginPath();g.arc(ox+P.x*k,oy+P.y*k,3.5,0,7);g.fill();g.fillStyle='#e8524a';g.beginPath();g.arc(ox+P.x*k,oy+P.y*k,2.2,0,7);g.fill()}}
// acceso de prueba: botón en el menú (y también Mi_Barrio.html#quesada). Se quita cuando haya viaje de verdad.
function quesadaIr(){ensureMap('quesada');P.map='quesada';P.x=32*T+8;P.y=36*T+12;P.dir=1;snapCam();toast('🌳 Parque de Ciudad Quesada (acceso de prueba)')}
{const mb=document.querySelector('#menu .mbtns');if(mb){const b=document.createElement('button');b.id='bQues';b.className='alt';b.textContent='🌳 Ciudad Quesada (prueba)';mb.appendChild(b);
  b.onclick=()=>{if(!(S&&S.started))startGame(!loadGame());else{$('#menu').classList.add('hidden');$('#hud').classList.remove('hidden');mode='play';showTouch()}quesadaIr()}}}
if(/quesada/i.test(location.hash||''))hookAfter('startGame',quesadaIr);
ACT_POINTS.push({map:'quesada',x:32,y:53,label:'Volver al barrio',run(){say(null,'Por ahora esta es una visita de prueba: el viaje a San Carlos llega en el próximo paso.',[
  {t:'Volver al barrio',f(){fadeDo(()=>{P.map='ext';P.x=24*T+8;P.y=23*T+12;P.dir=0;snapCam()})}},{t:'Quedarme un rato'}])}});
