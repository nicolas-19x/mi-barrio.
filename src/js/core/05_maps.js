// ================= MAPS =================
const MAPS={};
function newMap(id,w,h,name){const m={id,w,h,name,t:new Uint8Array(w*h),s:new Uint8Array(w*h),objs:[],doors:[],lights:[],noPath:new Set(),interior:false};MAPS[id]=m;return m}
const ti=(m,x,y)=>(x<0||y<0||x>=m.w||y>=m.h)?255:m.t[y*m.w+x];
function setT(m,x,y,v,s){if(x<0||y<0||x>=m.w||y>=m.h)return;m.t[y*m.w+x]=v;if(s!==undefined)m.s[y*m.w+x]=s?1:0}
const solidT=(m,x,y)=>(x<0||y<0||x>=m.w||y>=m.h)?true:m.s[y*m.w+x]===1;
const BUILD=[
{id:'casa_jugador',x:2,y:11,w:7,h:6,wall:'#e9dcb5',roof:'#a3acb2',kind:'house',floor:11},
{id:'casa_matias',x:11,y:11,w:7,h:6,wall:'#a6d8cb',roof:'#b07a52',kind:'house',floor:12},
{id:'pulperia',x:19,y:11,w:7,h:6,wall:'#f3cd57',roof:'#c0473b',kind:'shop',floor:12},
{id:'casa_ariana',x:33,y:11,w:7,h:6,wall:'#f3afc0',roof:'#8f9aa1',kind:'house',floor:11},
{id:'casa_papas',x:42,y:11,w:8,h:6,wall:'#a9c8ef',roof:'#9a5a3c',kind:'house',floor:12},
{id:'casa_nicolas',x:53,y:11,w:6,h:6,wall:'#cde6a8',roof:'#a3acb2',kind:'house',floor:11},
{id:'casa_marta',x:3,y:27,w:7,h:6,wall:'#f6c69f',roof:'#b07a52',kind:'house',floor:12},
{id:'casa_vecino',x:12,y:27,w:7,h:6,wall:'#e8e3d3',roof:'#7f8a90',kind:'house',floor:11},
// Nuevas casas para ampliar el barrio hacia el este
{id:'super_chino',x:64,y:11,w:7,h:6,wall:'#f4f1e6',roof:'#9aa1a6',kind:'store',st:'chino',floor:12},
{id:'pollolandia',x:73,y:11,w:7,h:6,wall:'#f4ead2',roof:'#b8463c',kind:'store',st:'pollo',floor:12},
{id:'casa_extra3',x:64,y:27,w:7,h:6,wall:'#d6b6d9',roof:'#8f9aa1',kind:'house',floor:12},
{id:'casa_extra4',x:73,y:27,w:7,h:6,wall:'#e7d69a',roof:'#b07a52',kind:'house',floor:11},
// Nueva calle residencial al sur
{id:'casa_sur1',x:3,y:44,w:7,h:6,wall:'#b9cbe0',roof:'#a3acb2',kind:'house',floor:11},
{id:'casa_sur2',x:13,y:44,w:7,h:6,wall:'#d8b99b',roof:'#7f8a90',kind:'house',floor:12},
// La cuadra nueva (Calle 3), la iglesia y las casas frente a la plaza
{id:'casa_sur3',x:3,y:53,w:7,h:6,wall:'#f2e27a',roof:'#9a5038',kind:'house',floor:11},
{id:'casa_sur4',x:12,y:53,w:7,h:6,wall:'#a6d8cb',roof:'#a3acb2',kind:'house',floor:12},
{id:'iglesia',x:46,y:51,w:11,h:8,wall:'#f6f1e4',roof:'#b4553c',kind:'church',floor:12},
{id:'casa_sur5',x:74,y:53,w:7,h:6,wall:'#f3afc0',roof:'#7f8a90',kind:'house',floor:11},
{id:'casa_sur6',x:3,y:69,w:7,h:6,wall:'#cde6a8',roof:'#b07a52',kind:'house',floor:12},
{id:'casa_sur7',x:12,y:69,w:7,h:6,wall:'#e9dcb5',roof:'#9a5038',kind:'house',floor:11},
{id:'casa_sur8',x:64,y:69,w:7,h:6,wall:'#a9c8ef',roof:'#a3acb2',kind:'house',floor:12},
{id:'gollo',x:64,y:44,w:7,h:6,wall:'#e8eaec',roof:'#7f8a90',kind:'store',st:'gollo',floor:12},
{id:'ropa',x:74,y:44,w:7,h:6,wall:'#f6d7a7',roof:'#8f9aa1',kind:'store',st:'ropa',floor:12},
];
const BMAP={};BUILD.forEach(b=>BMAP[b.id]=b);
const OWN={casa_matias:'matias',casa_ariana:'ariana',casa_nicolas:'nicolas',casa_marta:'marta',casa_extra3:'nicolas',casa_extra4:'marta',casa_sur1:'matias',casa_sur2:'nicolas'};
function bName(id){if(STORES[id])return STORES[id].n;if(id==='casa_jugador')return'Tu casa';if(id==='pulperia')return'Pulpería La Bendición';if(id==='casa_papas')return'Casa de '+N('papa')+' y '+N('mama');if(id==='casa_vecino')return'Casa del vecino';return'Casa de '+N(OWN[id])}
const HS=[[4,6],[9,4],[5,8],[10,8]];
const LOC={
 parque:{map:'ext',sp:[[36,26],[44,29],[50,29],[37,32],[53,33],[47,33]],l:'Parque'},
 parada:{map:'ext',sp:[[18,23],[23,23],[20,23]],l:'Parada de bus'},
 calle:{map:'ext',sp:[[12,19],[34,23],[48,19],[9,35],[40,39],[20,39]],l:'Calle'},
 pulperia:{map:'pulperia',sp:[[7,3],[5,6],[9,7],[3,7]],l:'Pulpería'},
 entrada:{map:'ext',sp:[[35,50],[34,51],[36,49]],l:'La entrada'},
 fiesta:{map:'ext',sp:[[37,27],[41,27],[37,31],[41,31],[36,29],[42,29],[39,27],[39,31],[44,30],[45,28]],l:'Fiesta'},
};
BUILD.forEach(b=>{if(b.kind==='house')LOC[b.id]={map:b.id,sp:HS,l:null}});
const locLabel=k=>LOC[k]&&(LOC[k].l||bName(k));
const EDIT_LOCS=['casa_jugador','casa_matias','casa_ariana','casa_papas','casa_nicolas','casa_marta','casa_vecino','pulperia','parque','parada','calle'];
const TREES=[[3,3],[7,5],[12,2],[16,6],[21,3],[24,7],[35,4],[39,7],[45,3],[49,6],[55,4],[58,8],[9,8],[19,9],[2,25],[11,25],[24,26],[21,29],[24,31],[20,33],[34,26],[34,30],[41,25],[44,32],[57,26],[57,33],[5,41],[15,41],[25,41],[40,41],[50,41],[57,41],[60,30],[60,26],[63,4],[70,6],[78,4],[81,8],[62,34],[71,35],[80,34],[24,48],[31,51],[45,48],[56,52],[82,49]];
const POLES=[[7,19],[16,19],[25,19],[38,19],[48,19],[58,19],[64,19],[77,19],[10,23],[25,23],[40,23],[70,23],[8,35],[17,35],[24,35],[66,35],[77,35]];
function genExt(){const W=84,H=84,m=newMap('ext',W,H,'El barrio ampliado');
  for(let x=0;x<W;x++){for(const y of[20,21,22,36,37,38])setT(m,x,y,1);for(const y of[19,23,35,39])setT(m,x,y,2)}
  for(let y=19;y<=39;y++){for(let x=28;x<=30;x++)setT(m,x,y,1);if(ti(m,27,y)!==1)setT(m,27,y,2);if(ti(m,31,y)!==1)setT(m,31,y,2)}
  for(let y=1;y<=18;y++)for(let x=27;x<=31;x++)setT(m,x,y,6);
  // park
  for(let y=24;y<=34;y++)for(let x=32;x<=59;x++){const edge=y===24||y===34||x===32||x===59;setT(m,x,y,edge?4:8,edge)}
  for(const[x,y]of[[32,29],[45,34],[52,34],[32,30]])setT(m,x,y,8,0);
  for(let y=26;y<=31;y++)for(let x=46;x<=56;x++)setT(m,x,y,15);
  // buildings
  for(const b of BUILD){b.dx=b.x+(b.w>>1);b.dy=b.y+b.h-1;
    for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)setT(m,x,y,20,1);
    setT(m,b.dx,b.dy,20,0);m.doors.push({x:b.dx,y:b.dy,to:b.id});m.noPath.add(b.dy*W+b.dx);
    const yard=b.y+b.h,fy=yard+1;
    for(let x=b.x-1;x<=b.x+b.w;x++){setT(m,x,yard,14,0);if(x===b.dx||(b.kind==='shop'&&Math.abs(x-b.dx)<=1))setT(m,x,fy,14,0);else setT(m,x,fy,4,1)}
    for(let y=b.y+2;y<=yard;y++){setT(m,b.x-1,y,4,1);setT(m,b.x+b.w,y,4,1)}
    m.lights.push({x:(b.x+1)*T,y:(b.y+b.h)*T,r:34},{x:(b.x+b.w-1)*T,y:(b.y+b.h)*T,r:34});
  }
  // Caminos peatonales y zonas comunes de la ampliación
  for(let y=40;y<=43;y++){setT(m,6,y,2,0);setT(m,16,y,2,0);setT(m,67,y,2,0);setT(m,77,y,2,0)}
  for(let x=61;x<=82;x++){if(x%4===0)setT(m,x,25,7,0);if(x%5===0)setT(m,x,40,14,0)}
  // Bordes del mapa ampliado
  for(let x=0;x<W;x++){setT(m,x,0,5,1);setT(m,x,H-1,5,1)}for(let y=0;y<H;y++){setT(m,0,y,5,1);setT(m,W-1,y,5,1)}
  for(const[x,y]of TREES)setT(m,x,y,5,1);
  for(const[x,y]of[[34,33],[4,8],[50,9],[26,25],[17,25],[58,25]])setT(m,x,y,7,0);
  for(const[x,y]of POLES){setT(m,x,y,16,1);m.lights.push({x:x*T+8,y:y*T,r:60,pole:1})}
  // objects
  const O=(type,x,y,w,h)=>{m.objs.push({type,x,y,w,h});for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)setT(m,i,j,ti(m,i,j),1)};
  O('busstop',19,24,4,1);O('kiosco',38,28,3,3);O('bench',35,28,1,1);O('bench',43,27,1,1);O('bench',54,33,1,1);O('goal',46,28,1,2);O('goal',56,28,1,2);O('sign',29,2,1,1);
  O('bench',68,24,1,1);O('busstop',72,24,4,1);O('bench',79,31,1,1);O('kiosco',68,34,3,3);O('bench',75,40,1,1);O('sign',61,2,1,1);
  m.s[2*W+29]=0;
  carveEntrada(m);if(typeof genSur==='function')genSur(m);
  return m}
function genInt(b){if(b.kind==='store')return genStoreInt(b);if(b.kind==='church'&&typeof genChurchInt==='function')return genChurchInt(b);const w=14,h=10,m=newMap(b.id,w,h,'');m.interior=true;m.b=b;m.wallFace=shade(b.wall,.35);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const wall=y<2||x===0||x===w-1||y===h-1;setT(m,x,y,wall?10:b.floor,wall)}
  setT(m,7,9,13,0);m.noPath.add(9*w+7);m.exit={x:7,y:9};
  const F=(type,x,y,ww=1,hh=1,act)=>{m.objs.push({type,x,y,w:ww,h:hh,act});for(let j=y;j<y+hh;j++)for(let i=x;i<x+ww;i++)m.s[j*w+i]=1};
  if(b.kind==='shop'){for(let x=1;x<=12;x++)F(x===11||x===12?'fridgeR':'shelf',x,2,1,1,x>=11?'drinks':'shelf');F('counter',3,4,8,1,'shop');F('fridgeD',12,5,1,2,'drinks');F('sacks',1,6,1,2,'sacks');F('bread',1,4,1,1,'bread');F('candy',12,8,1,1,'candy');F('crate',1,8,1,1,'crate');m.deco=['sign','clock','posters','bulbs'];m.lights.push({x:4*T,y:3*T,r:60},{x:10*T,y:3*T,r:60},{x:7*T,y:7*T,r:70});}
  else{F('bed',1,2,2,3,'bed');F('night',3,2,1,1,'night');F('tv',6,2,2,1,'tv');F('counter',9,2,2,1,'counter');F('stove',11,2,1,1,'stove');F('fridge',12,2,1,1,'fridge');F('sofa',6,4,2,1,'sofa');F('table',10,6,2,1,'table');F('chair',9,6);F('chair',12,6);F('plant',1,8);F('plant',12,8);m.rug=[4,5,4,3];m.deco=['pic','clock','win']}
  m.lights.push({x:7*T,y:5*T,r:90});return m}

// ---------- static rendering ----------
function drawTile(g,m,x,y){const t=ti(m,x,y),X=x*T,Y=y*T,r=(a,b)=>hsh(x*17+a,y*31+b);
  const grass=(c1,c2,c3)=>{R(g,c1,X,Y,T,T);for(let i=0;i<12;i++){const gx=X+((r(i,1)*15)|0),gy=Y+((r(i,2)*14)|0);R(g,r(i,3)<.5?c2:c3,gx,gy,1,2);if(i%3===0)R(g,c3,gx-1,gy+1,1,1)}};
  const side=()=>{R(g,'#bdb6a6',X,Y,T,T);R(g,'#a59e8f',X,Y+T-1,T,1);R(g,'#a59e8f',X+T-1,Y,1,T);if(r(1,1)<.3)R(g,'#aaa393',X+((r(2,2)*12)|0),Y+((r(3,3)*12)|0),2,1)};
  switch(t){
  case 0:case 5:case 7:grass('#5c9e48','#4f8c3e','#6fb556');
    if(t===5){if(!m.interior&&(x===0||y===0||x===m.w-1||y===m.h-1)){disc(g,'#2e6e33',X+8,Y+8,9)}else{R(g,'rgba(0,0,0,.18)',X+2,Y+12,12,4);R(g,'#6b4a2b',X+6,Y+2,4,13);R(g,'#56391f',X+6,Y+2,1,13)}}
    if(t===7){disc(g,'#2f7a3a',X+8,Y+9,7);disc(g,'#3d9447',X+6,Y+7,4);R(g,'#f28ab2',X+10,Y+6,1,1);R(g,'#f28ab2',X+5,Y+11,1,1)}
    break;
  case 1:{R(g,'#4a4e55',X,Y,T,T);for(let i=0;i<5;i++)R(g,r(i,4)<.5?'#55595f':'#3f4248',X+((r(i,5)*15)|0),Y+((r(i,6)*15)|0),1,1);
    const s=(a,b)=>{const v=ti(m,a,b);return v===2||v===16};
    if(s(x,y-1)){R(g,'#2c2f34',X,Y,T,3);R(g,'#6b6f75',X,Y+3,T,1)}if(s(x,y+1)){R(g,'#2c2f34',X,Y+13,T,3);R(g,'#6b6f75',X,Y+12,T,1)}
    if(s(x-1,y)){R(g,'#2c2f34',X,Y,3,T)}if(s(x+1,y)){R(g,'#2c2f34',X+13,Y,3,T)}
    const inV=x>=28&&x<=30,inH=(y>=20&&y<=22)||(y>=36&&y<=38);
    if((y===21||y===37)&&!inV&&x%2===0)R(g,'#e8c547',X+2,Y+7,11,2);
    if(x===29&&!inH&&y%2===0&&y>19)R(g,'#e8c547',X+7,Y+2,2,11);
    if(inV&&(y===23||y===19||y===35||y===39)){for(let i=0;i<4;i++)R(g,'#d9d4c8',X+i*4,Y+3,2,10)}
    break}
  case 2:side();break;
  case 16:side();R(g,'rgba(0,0,0,.25)',X+4,Y+12,9,3);R(g,'#8f8a80',X+6,Y+6,4,9);break;
  case 6:R(g,'#b08a5c',X,Y,T,T);for(let i=0;i<6;i++)R(g,r(i,7)<.5?'#9c7749':'#c49d6c',X+((r(i,8)*15)|0),Y+((r(i,9)*15)|0),2,1);if(x===27||x===31)for(let i=0;i<4;i++)R(g,'#6fb556',X+(x===27?((r(i,2)*4)|0):12+((r(i,3)*4)|0)),Y+((r(i,4)*15)|0),1,2);break;
  case 8:grass('#66b152','#5aa047','#78c262');if(r(5,5)<.18)R(g,pick2(r(6,6),['#f7e04b','#f28ab2','#ffffff']),X+((r(7,7)*13)|0)+1,Y+((r(8,8)*13)|0)+1,2,2);break;
  case 15:R(g,(x>>1)%2?'#4b9a43':'#53a34a',X,Y,T,T);break;
  case 14:R(g,'#cdc6b6',X,Y,T,T);R(g,'#bdb5a3',X,Y+T-1,T,1);if(r(1,2)<.35)R(g,'#b3ab99',X+3,Y+((r(2,1)*12)|0),((r(3,3)*8)|0)+2,1);break;
  case 4:{const below=ti(m,x,y+1);if(y>=24&&y<=34&&x>=32&&x<=59)grass('#66b152','#5aa047','#78c262');else R(g,'#cdc6b6',X,Y,T,T);
    R(g,'#d9d2c2',X,Y+7,T,8);R(g,'#bfb7a6',X,Y+13,T,2);R(g,'#ece6d8',X,Y+7,T,1);R(g,'#2a2a30',X,Y+1,T,1);for(let i=0;i<6;i++)R(g,'#2a2a30',X+1+i*3,Y+1,1,6);void below;break}
  case 10:if(y===1&&x>0&&x<m.w-1){R(g,m.wallFace,X,Y,T,T);R(g,shade(m.b.wall,-.1),X,Y+12,T,4);R(g,shade(m.b.wall,-.3),X,Y+15,T,1)}else{R(g,'#5a4636',X,Y,T,T);R(g,'#6e5846',X,Y,T,2)}break;
  case 11:R(g,'#b5824f',X,Y,T,T);R(g,'#9c6c3e',X,Y+7,T,1);R(g,'#9c6c3e',X,Y+15,T,1);R(g,'#9c6c3e',X+((x%2)?4:11),Y,1,7);R(g,'#9c6c3e',X+((x%2)?10:3),Y+8,1,7);break;
  case 12:R(g,(x+y)%2?'#e8e1d1':'#cfc6b2',X,Y,T,T);break;
  case 13:R(g,m.b.floor===11?'#b5824f':'#e8e1d1',X,Y,T,T);R(g,'#a8432f',X+1,Y+2,14,12);R(g,'#c9614a',X+2,Y+3,12,10);R(g,'#f4ead2',X+7,Y+5,2,6);R(g,'#f4ead2',X+5,Y+9,6,1);R(g,'#f4ead2',X+6,Y+10,4,1);break;
  default:if(t>=30)drawCityTile(g,m,x,y,t,r);
  }}
function pick2(v,a){return a[Math.floor(v*a.length)%a.length]}
function drawBuilding(g,b){if(b.kind==='store')return drawStore(g,b);const X=b.x*T,Y=b.y*T,W=b.w*T,H=b.h*T,fH=T*2,rH=H-fH;
  R(g,b.wall,X,Y+rH,W,fH);R(g,shade(b.wall,-.25),X,Y+H-3,W,3);R(g,shade(b.wall,.15),X,Y+rH+2,W,1);
  R(g,b.roof,X-2,Y,W+4,rH+2);for(let i=0;i<W+4;i+=3){R(g,shade(b.roof,.22),X-2+i,Y,1,rH+2);R(g,shade(b.roof,-.15),X-1+i,Y,1,rH+2)}
  for(let ry=8;ry<rH;ry+=16)for(let rx=3;rx<W;rx+=12){R(g,shade(b.roof,-.45),X+rx,Y+ry,1,1);R(g,shade(b.roof,.4),X+rx,Y+ry-1,1,1)}
  R(g,shade(b.roof,.35),X-2,Y+2,W+4,1);R(g,shade(b.roof,-.4),X-2,Y+rH,W+4,3);
  if(!b.newRoof)for(let i=0;i<3;i++)R(g,'rgba(120,60,30,.35)',X+((hsh(b.x,i)*W)|0),Y+4+((hsh(i,b.y)*(rH-8))|0),3,2);
  const dX=b.dx*T,wy=Y+rH+7;
  const win=wx=>{R(g,'#efe9dc',wx-1,wy-1,18,13);R(g,'#4f6f8c',wx,wy,16,11);R(g,'#7ea3c2',wx+1,wy+1,5,3);for(let i=0;i<16;i+=4)R(g,'#222',wx+i+1,wy,1,11);R(g,'#222',wx,wy+5,16,1);R(g,shade(b.wall,-.3),wx-1,wy+12,18,1)};
  if(b.kind==='shop'){R(g,'#2a1e14',dX-14,Y+H-24,44,22);R(g,'#5a3a22',dX-14,Y+H-24,44,2);R(g,'#7a4b2a',dX-16,Y+H-10,4,8);
    for(let i=0;i<5;i++)R(g,['#d64545','#f2c94c','#7bb661','#3f7fd1','#f2994a'][i],dX-10+i*8,Y+H-18,5,6);
    R(g,'#c0473b',X+4,Y+rH+1,W-8,8);R(g,'#8e2f26',X+4,Y+rH+8,W-8,1);g.fillStyle='#fff7d6';g.font='bold 7px monospace';g.textAlign='center';g.textBaseline='top';g.fillText('PULPERÍA',X+W/2,Y+rH+1);
    win(X+5);win(X+W-21)}
  else{win(X+7);win(X+W-23);if(b.w>=8)win(X+28);
    R(g,'#5c3d24',dX+1,Y+H-25,14,23);R(g,'#7a5233',dX+2,Y+H-24,12,21);R(g,'#5c3d24',dX+4,Y+H-21,8,6);R(g,'#5c3d24',dX+4,Y+H-12,8,6);R(g,'#e8c547',dX+11,Y+H-14,2,2);
    // Wall cracks, flower boxes and gutter pipes remain cosmetic.
    R(g,shade(b.wall,-.4),X+3,Y+rH+6,1,15);R(g,shade(b.wall,.4),X+4,Y+rH+6,1,15);
    for(const wx of [X+7,X+W-23]){R(g,'#9b523f',wx,wy+13,16,3);for(let j=0;j<4;j++){R(g,'#3f8a3e',wx+2+j*4,wy+10,1,3);R(g,j%2?'#f2c94c':'#f193b4',wx+1+j*4,wy+9,3,2)}}
    R(g,'#f4ead2',dX+18,Y+H-26,6,4);R(g,'#3a6fb0',dX+19,Y+H-25,4,2)}
}
function drawObj(g,o,m){const X=o.x*T,Y=o.y*T,W=o.w*T,H=o.h*T;
  switch(o.type){
  case'busstop':R(g,'#7f8a90',X,Y,W,4);R(g,'#5f6a70',X,Y+4,W,10);R(g,'#8a6a45',X+4,Y+9,W-8,4);R(g,'#6b4a2b',X+6,Y+13,2,3);R(g,'#6b4a2b',X+W-8,Y+13,2,3);R(g,'#2a6fb0',X+W-3,Y-8,3,24);R(g,'#f4ead2',X+W-6,Y-12,9,6);g.fillStyle='#14101c';g.font='bold 5px monospace';g.textAlign='center';g.textBaseline='top';g.fillText('BUS',X+W-1.5,Y-11);break;
  case'kiosco':R(g,'rgba(0,0,0,.2)',X+2,Y+H-6,W-4,6);R(g,'#f4ead2',X+4,Y+10,W-8,H-14);for(let i=0;i<4;i++)R(g,'#c0473b',X+4+i*12,Y+10,3,H-14);
    for(let i=0;i<12;i++)R(g,i%2?'#c0473b':'#e8dcc4',X+i*4,Y,4,14);R(g,'#8e2f26',X,Y+13,W,2);R(g,'#8e2f26',X+W/2-2,Y-3,4,4);break;
  case'bench':R(g,'#8a6a45',X+1,Y+5,14,5);R(g,'#6b4a2b',X+1,Y+5,14,1);R(g,'#3a3a40',X+2,Y+10,2,4);R(g,'#3a3a40',X+12,Y+10,2,4);R(g,'#8a6a45',X+1,Y+1,14,3);break;
  case'goal':R(g,'#f4f4f4',X+6,Y,2,H);R(g,'#f4f4f4',X+2,Y,6,2);R(g,'#f4f4f4',X+2,Y+H-2,6,2);for(let i=2;i<H;i+=3)R(g,'rgba(255,255,255,.5)',X+2,Y+i,4,1);break;
  case'sign':R(g,'#6b4a2b',X+7,Y+4,2,12);R(g,'#c49d6c',X+1,Y,14,7);R(g,'#8a6a45',X+1,Y+6,14,1);R(g,'#14101c',X+3,Y+2,10,1);R(g,'#14101c',X+3,Y+4,7,1);break;
  case'bed':R(g,'#6b4a2b',X,Y,W,H);R(g,'#f4f4f4',X+2,Y+2,W-4,10);R(g,['#3f7fd1','#e85d75','#7bb661','#f2994a'][o.x%4],X+2,Y+12,W-4,H-14);R(g,shade('#3f7fd1',.2),X+2,Y+12,W-4,2);break;
  case'night':R(g,'#7a5233',X+2,Y+4,12,11);R(g,'#5c3d24',X+2,Y+9,12,1);R(g,'#f2c94c',X+6,Y-2,5,5);R(g,'#8a6a45',X+8,Y+3,1,2);break;
  case'tv':R(g,'#5c3d24',X,Y+8,W,8);R(g,'#2a2a30',X+4,Y-6,W-8,14);R(g,'#3f5f7a',X+6,Y-4,W-12,10);R(g,'#6f9fc2',X+7,Y-3,4,2);break;
  case'counter':R(g,'#d8d2c4',X,Y,W,6);R(g,'#a69e8c',X,Y+6,W,10);for(let i=0;i<W;i+=16)R(g,'#8f8775',X+i,Y+6,1,10);if(m&&m.b&&m.b.kind==='shop'){R(g,'#f4f4f4',X+8,Y-6,10,6);R(g,'#f2994a',X+9,Y-5,3,2);R(g,'#e0a34f',X+13,Y-5,4,3);/*gum jar*/R(g,'rgba(220,240,250,.8)',X+38,Y-9,9,9);for(let i=0;i<6;i++)R(g,['#d64545','#f2c94c','#7bb661','#f193b4'][i%4],X+39+(i*3)%7,Y-7+Math.floor(i/3)*3,2,2);R(g,'#c0473b',X+38,Y-10,9,2);/*cuaderno*/R(g,'#3f7fd1',X+58,Y-3,10,4);R(g,'#f4f4f4',X+59,Y-2,8,2);/*caja registradora*/R(g,'#2a2a30',X+96,Y-11,22,12);R(g,'#4a4a52',X+98,Y-9,18,5);R(g,'#7bd16b',X+99,Y-8,10,3);for(let i=0;i<4;i++)R(g,'#d8d2c4',X+99+i*4,Y-3,3,2);R(g,'#c0473b',X+112,Y-15,5,4)}else{R(g,'#e8e8e8',X+4,Y-2,6,3);R(g,'#8a5a2b',X+18,Y-4,5,5)}break;
  case'stove':R(g,'#ececec',X,Y,16,16);R(g,'#2a2a30',X+2,Y+2,5,5);R(g,'#2a2a30',X+9,Y+2,5,5);R(g,'#bfbfbf',X+1,Y+9,14,6);R(g,'#7a7a7a',X+3,Y-3,6,4);break;
  case'fridge':R(g,'#f4f4f4',X+1,Y-12,14,28);R(g,'#d0d0d0',X+1,Y-1,14,1);R(g,'#9a9a9a',X+12,Y-9,1,6);R(g,'#9a9a9a',X+12,Y+3,1,8);R(g,'#f2c94c',X+4,Y-8,3,3);break;
  case'sofa':R(g,'#9a4a3a',X,Y+2,W,12);R(g,'#b85a48',X+2,Y+4,W/2-3,8);R(g,'#b85a48',X+W/2+1,Y+4,W/2-3,8);R(g,'#7a3a2c',X,Y+12,W,2);break;
  case'table':R(g,'#7a5233',X,Y+2,W,12);R(g,'#f4ead2',X+2,Y+3,W-4,8);for(let i=0;i<W-4;i+=4)R(g,'#d64545',X+2+i,Y+3,2,8);R(g,'#ffffff',X+8,Y+4,6,5);R(g,'#ffffff',X+19,Y+4,6,5);R(g,'#8a5a2b',X+10,Y+5,2,2);break;
  case'chair':R(g,'#6b4a2b',X+3,Y+4,10,8);R(g,'#56391f',X+3,Y+12,2,3);R(g,'#56391f',X+11,Y+12,2,3);break;
  case'plant':R(g,'#b5562f',X+4,Y+9,8,6);disc(g,'#3d9447',X+8,Y+6,5);R(g,'#58a64c',X+5,Y+3,2,2);break;
  case'shelf':R(g,'#7a5233',X,Y-14,16,30);for(let s=0;s<3;s++){R(g,'#5c3d24',X,Y-14+s*10+8,16,2);for(let i=0;i<4;i++)R(g,['#d64545','#f2c94c','#7bb661','#3f7fd1','#f2994a','#e8e8e8'][(o.x*3+s*2+i)%6],X+1+i*4,Y-14+s*10+2,3,6)}break;
  case'fridgeD':R(g,'#c0473b',X,Y-8,16,40);R(g,'#bfe3f2',X+2,Y-5,12,33);for(let s=0;s<4;s++)for(let i=0;i<3;i++)R(g,['#6b3a1e','#f2994a','#7bd16b'][(s+i)%3],X+3+i*4,Y-4+s*8,2,6);break;
  case'fridgeR':R(g,'#2a6fb0',X,Y-14,16,30);R(g,'#cfeefa',X+2,Y-11,12,22);for(let s=0;s<3;s++)for(let i=0;i<3;i++)R(g,['#c0473b','#f4f4f4','#f2c94c','#6b3a1e'][(o.x+s+i)%4],X+3+i*4,Y-10+s*7,2,5);R(g,'#f4ead2',X+2,Y+12,12,3);break;
  case'bread':R(g,'#7a5233',X+1,Y+4,14,12);R(g,'#5c3d24',X+1,Y+9,14,1);R(g,'#e0a34f',X+2,Y+1,5,4);R(g,'#f2c94c',X+3,Y+1,3,1);R(g,'#e0a34f',X+8,Y,6,5);R(g,'#f2994a',X+9,Y,4,1);R(g,'#c98a3a',X+3,Y+6,10,3);break;
  case'candy':R(g,'#7a5233',X+2,Y+9,12,7);R(g,'rgba(220,240,250,.7)',X+3,Y-2,10,11);for(let i=0;i<8;i++)R(g,['#d64545','#f2c94c','#7bb661','#3f7fd1','#f193b4'][i%5],X+4+(i*3)%8,Y+1+Math.floor(i/3)*3,2,2);R(g,'#c0473b',X+3,Y-3,10,2);break;
  case'crate':R(g,'#c49d6c',X+1,Y+3,14,12);R(g,'#8a6a45',X+1,Y+8,14,1);R(g,'#8a6a45',X+1,Y+3,1,12);R(g,'#8a6a45',X+14,Y+3,1,12);for(let i=0;i<3;i++){disc(g,['#f2994a','#f2c94c','#7bb661'][i],X+4+i*4,Y+3,2)}break;
  case'sacks':R(g,'#c9a46a',X+1,Y+2,14,12);R(g,'#c9a46a',X+1,Y+18,14,12);R(g,'#8a6a45',X+4,Y+6,8,1);R(g,'#8a6a45',X+4,Y+22,8,1);g.fillStyle='#5c3d24';g.font='bold 4px monospace';g.textAlign='center';g.textBaseline='top';g.fillText('ARROZ',X+8,Y+8);g.fillText('FRIJOL',X+8,Y+24);break;
  }}
function renderMap(m){const base=mk(m.w*T,m.h*T),g=base.getContext('2d');
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)drawTile(g,m,x,y);
  if(m.id==='ext'){
    R(g,'#f4f4f4',46*T,26*T,1,6*T);R(g,'#f4f4f4',57*T-1,26*T,1,6*T);R(g,'#f4f4f4',46*T,26*T,11*T,1);R(g,'#f4f4f4',46*T,32*T-1,11*T,1);R(g,'#f4f4f4',51*T+8,26*T,1,6*T);
    g.strokeStyle='#f4f4f4';g.beginPath();g.arc(51*T+8,29*T,14,0,7);g.stroke();
    BUILD.forEach(b=>drawBuilding(g,b));drawHome(g)}
  if(m.zdraw)m.zdraw(g,'pre');
  if(m.interior){if(m.rug){const[x,y,w,h]=m.rug;R(g,'#8e3b4a',x*T,y*T,w*T,h*T);R(g,'#c9a46a',x*T+3,y*T+3,w*T-6,h*T-6);R(g,'#8e3b4a',x*T+6,y*T+6,w*T-12,h*T-12)}
    for(const d of m.deco||[]){if(d==='pic'){R(g,'#7a5233',4*T,T+1,18,13);R(g,'#7fc3e8',4*T+2,T+3,14,5);R(g,'#5c9e48',4*T+2,T+8,14,4);R(g,'#f2c94c',4*T+11,T+4,3,3)}
      if(d==='clock'){disc(g,'#f4f4f4',9*T+8,T+7,5);R(g,'#14101c',9*T+8,T+3,1,4);R(g,'#14101c',9*T+8,T+7,3,1)}
      if(d==='win'){R(g,'#efe9dc',2*T,T+1,14,11);R(g,'#7fc3e8',2*T+1,T+2,12,9);R(g,'#222',2*T+7,T+2,1,9)}
      if(d==='posters'){R(g,'#d64545',5*T,T-2,14,15);R(g,'#f4f4f4',5*T+2,T,10,5);R(g,'#f2c94c',5*T+2,T+7,10,2);R(g,'#2a6fb0',11*T+4,T-2,14,15);R(g,'#f4f4f4',11*T+6,T,10,4);R(g,'#7bb661',11*T+6,T+6,10,5);g.fillStyle='#14101c';g.font='bold 4px monospace';g.textAlign='left';g.textBaseline='top';g.fillText('SELE',11*T+7,T+6);R(g,'#f2c94c',7*T+4,T,16,10);g.fillStyle='#8e2f26';g.fillText('LOTO',7*T+6,T+2)}
      if(d==='bulbs'){for(const bx of[4,10])for(let i=0;i<3;i++){R(g,'#14101c',bx*T+7,i,1,6)}}
      if(d==='sign'){R(g,'#f4ead2',1*T,T,44,12);g.fillStyle='#8e2f26';g.font='bold 5px monospace';g.textAlign='left';g.textBaseline='top';g.fillText('HOY NO FÍO,',T+2,T+1);g.fillText('MAÑANA SÍ',T+2,T+6)}}}
  for(const o of m.objs)drawObj(g,o,m);
  if(m.id==='ext'){drawNeighborhoodDetails(g);drawEntrada(g);for(const o of m.objs)entradaObj(g,o)}
  if(m.zdraw)m.zdraw(g,'base');
  m.base=base;
  // top layer
  const top=mk(m.w*T,m.h*T),tg=top.getContext('2d');
  if(m.id==='ext'){
    for(const[x,y]of TREES){const X=x*T,Y=y*T;if(hsh(x,y)<.35){R(tg,'#8b6a43',X+7,Y-22,3,26);R(tg,'#7a5a36',X+7,Y-22,1,26);for(const[a,b]of[[-10,-4],[10,-4],[-8,4],[8,4],[0,-10]]){tg.strokeStyle='#3f8a3e';tg.lineWidth=3;tg.beginPath();tg.moveTo(X+8,Y-24);tg.quadraticCurveTo(X+8+a*.6,Y-30+b*.3,X+8+a,Y-22+b);tg.stroke()}disc(tg,'#8b5a2b',X+8,Y-24,2)}
      else{disc(tg,'#2e6e33',X+8,Y-6,12);disc(tg,'#3f8a3e',X+6,Y-9,9);disc(tg,'#58a64c',X+3,Y-13,4);if(hsh(y,x)<.4){R(tg,'#f2994a',X+12,Y-4,2,2);R(tg,'#f2c94c',X+2,Y-2,2,2)}}}
    for(const[x,y]of TREES){if(hsh(x,y)<.35)continue;for(let i=0;i<16;i++){const lx=x*T-2+Math.floor(hsh(x+i,y)*20),ly=y*T-18+Math.floor(hsh(y+i,x)*18);R(tg,i%3?'#4c9a47':'#6eb75a',lx,ly,2,1)}}
    drawHomeTop(tg);drawEntradaTop(tg);const rows={};for(const[x,y]of POLES){const X=x*T+8,Y=y*T;R(tg,'#8f8a80',X-2,Y-30,4,38);R(tg,'#6f6a60',X-2,Y-30,1,38);R(tg,'#6f6a60',X-8,Y-26,16,2);R(tg,'#d9d4c8',X+4,Y-24,5,2);(rows[y]=rows[y]||[]).push(X)}
    tg.strokeStyle='rgba(20,18,24,.85)';tg.lineWidth=1;for(const y in rows){const xs=rows[y].sort((a,b)=>a-b),Y=+y*T;for(let k=0;k<2;k++){tg.beginPath();for(let i=0;i<xs.length-1;i++){tg.moveTo(xs[i]-6+k*12,Y-25);tg.quadraticCurveTo((xs[i]+xs[i+1])/2,Y-14,xs[i+1]-6+k*12,Y-25)}tg.stroke()}}
    R(tg,'#7f8a90',19*T-2,24*T-10,4*T+4,6);R(tg,'#a3acb2',19*T-2,24*T-10,4*T+4,2);
  }
  if(m.zdraw)m.zdraw(tg,'top');
  m.top=top;renderMapHD(m)}
