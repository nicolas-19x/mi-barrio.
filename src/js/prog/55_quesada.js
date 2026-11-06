// ---------- Ciudad Quesada, San Carlos: el parque (paso 1, remasterizado a escala grande) ----------
// El arte está en hd/94_quesada.js. Por ahora solo el parque y sus calles; la catedral, el viaje y los vecinos vienen después.
// Acceso de prueba mientras no hay viaje: botón «Ciudad Quesada (prueba)» en el menú (o Mi_Barrio.html#quesada).
function genQuesada(){const W=QS.W,H=QS.H,O=QS.oy,m=newMap('quesada',W,H,'Ciudad Quesada');
  const inHD=(x,y,R)=>x*32+16>=R[0]&&x*32+16<R[1]&&y*32+16>=R[2]&&y*32+16<R[3];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=8,s=0;const yo=y-O;
    if(y===H-1||x===0||x===63){t=2;s=1}                                               // borde del mapa
    else if((x>=1&&x<=3)||(x>=60&&x<=62))t=1;                                          // avenidas (llegan hasta arriba)
    else if(x===4||x===59)t=2;                                                         // aceras de las avenidas
    else if(yo<5){                                                                     // terreno de la catedral (detrás de la reja)
      t=4;s=1;
      if(inHD(x,y,QC.porch)&&y>=17)  {t=2;s=0}                                         // atrio
      if(x>=28&&x<=36&&y>=19&&y<=24) {t=2;s=0}                                         // escalinata y portón
      if(((x>=5&&x<=26)||(x>=38&&x<=46))&&y>=19&&y<=22){t=4;s=0}                       // jardín
      if(x>=47&&x<=58&&y>=2&&y<=22)  {t=1;s=0}}                                        // parqueo
    else if((yo>=6&&yo<=8)||(yo>=54&&yo<=56))t=1;                                       // Calle Central y calle sur
    else if(yo===5||yo===9||yo===53)t=2;                                               // aceras
    setT(m,x,y,t,s)}
  const sol=(x,y,w,h)=>{for(let j=y;j<y+(h||1);j++)for(let i=x;i<x+(w||1);i++)setT(m,i,j,ti(m,i,j),1)},
    solHD=(x0,y0,x1,y1)=>sol(Math.floor(x0/32),Math.floor(y0/32),Math.floor((x1-1)/32)-Math.floor(x0/32)+1,Math.floor((y1-1)/32)-Math.floor(y0/32)+1);
  const k=QS.kiosko;sol(k[0],k[1]+O,k[2],k[3]);m.objs.push({type:'kioscoQ',x:k[0],y:k[1]+O,w:k[2],h:k[3]});
  for(let y=12;y<22;y++)for(let x=26;x<40;x++)if(qsPoolD(x*32+16,y*32+16)<24)sol(x,y+O);   // estanque de la fuente
  for(const L of[QS.trees,QS.lamps,QS.slamps,QS.benches,QS.bins])for(const[x,y]of L)sol(x,y+O);
  for(const[x,y,v]of QS.cars)v?sol(x,y+O,1,2):sol(x,y+O,2,1);
  for(const e of qsEquip()){const r=e[4];solHD(r[0],r[1]+O*32,r[2],r[3]+O*32)}         // juegos infantiles
  solHD(611,1080+O*32,766,1094+O*32);solHD(834,1080+O*32,967,1094+O*32);             // murito verde (con paso al medio)
  for(const[x,y]of QC.cars)solHD(x+7,y-30,x+35,y+30);                                  // carros del parqueo
  m.objs.push({type:'catedral',x:18,y:2,w:29,h:15});
  for(const[x,y]of QS.lamps)m.lights.push({x:x*T+8,y:(y+O)*T+14,r:64,pole:1});
  for(const[x,y]of QS.slamps)m.lights.push({x:x*T+8,y:(y+O)*T+14,r:84,pole:1});
  m.lights.push({x:QS.ki.x/2,y:(QS.ki.y+O*32)/2-10,r:84});
  m.lights.push({x:QC.cx/2,y:QC.fy/2+20,r:130},{x:(QC.x0+60)/2,y:QC.fy/2+16,r:70},{x:(QC.x1-60)/2,y:QC.fy/2+16,r:70});   // la catedral iluminada
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
function quesadaIr(){ensureMap('quesada');P.map='quesada';P.x=32*T+8;P.y=(36+QS.oy)*T+12;P.dir=1;snapCam();toast('🌳 Parque de Ciudad Quesada (acceso de prueba)')}
{const mb=document.querySelector('#menu .mbtns');if(mb){const b=document.createElement('button');b.id='bQues';b.className='alt';b.textContent='🌳 Ciudad Quesada (prueba)';mb.appendChild(b);
  b.onclick=()=>{if(!(S&&S.started))startGame(!loadGame());else{$('#menu').classList.add('hidden');$('#hud').classList.remove('hidden');mode='play';showTouch()}quesadaIr()}}}
if(/quesada/i.test(location.hash||''))hookAfter('startGame',quesadaIr);
ACT_POINTS.push({map:'quesada',x:32,y:73,label:'Volver al barrio',run(){say(null,'Por ahora esta es una visita de prueba: el viaje a San Carlos llega en el próximo paso.',[
  {t:'Volver al barrio',f(){fadeDo(()=>{P.map='ext';P.x=24*T+8;P.y=23*T+12;P.dir=0;snapCam()})}},{t:'Quedarme un rato'}])}});
ACT_POINTS.push({map:'quesada',x:32,y:17,label:'Catedral de Ciudad Quesada',run(){say(null,'La Catedral de Ciudad Quesada. Arriba, la torre blanca con el reloj y la cruz en la punta; abajo, la franja roja y las columnas del pórtico.');
  say(null,'Desde aquí arriba se ve todo el parque: la fuente, el kiosco y los juegos de los güilas. Por ahora las puertas están cerradas.')}});
