// ================= BARRIO 2: TIENDAS, LA ENTRADA, ASALTOS Y KEVIN =================
// Tiendas del barrio (kind:'store'): fachada propia (drawStore) e interior propio (genStoreInt).
const STORES={
 super_chino:{n:'Minisúper La Fortuna',short:'Súper chino',aw:'#c0392b'},
 pollolandia:{n:'Pollolandia',short:'Pollolandia',aw:'#d6291f'},
 gollo:{n:'Gollo',short:'Gollo',aw:'#d0202a'},
 ropa:{n:'Ropa americana',short:'Ropa americana',aw:'#3f7fd1'}};
Object.assign(ITEMS,{papitas:['Papitas tostadas','Bolsa grande de papitas, sabor limón. Del súper chino.'],fideos:['Fideos instantáneos','Tres minutos y listo. La cena oficial de fin de quincena.'],
 pollo:['Caja de pollo frito','Ocho piezas de Pollolandia, todavía calientes. Huele a domingo en familia.'],dvd:['Película «original»','Una película recién salida del cine, en DVD. La portada está impresa en papel de cuaderno.'],
 gorra:['Gorra «Naik»','Una gorra de marca. Bueno, casi de marca: el logo está al revés.'],cargadork:['Cargador «nuevo»','Un cargador que Carlillos juró que es original. Viene sin caja y con un poquito de grasa.']});
setTimeout(()=>{Object.assign(SHOP_USE,{papitas:'Comer',fideos:'Comer',pollo:'Comer'});Object.assign(SHOP_USE_MSG,{papitas:'Crunch, crunch. Se te llenan los dedos de polvito de limón.',fideos:'Fideos con sobrecito de pollo. Sabe a fin de mes.',pollo:'Pollo frito crujiente. Te comés dos piezas y guardás el resto… mentira, te las comés todas.'})},0);
const kvR=()=>S.f.kvR||0;
function kvAdd(n){const o=kvR();S.f.kvR=clamp(+(o+n).toFixed(2),-3,12);if(Math.abs(n)>=.5)toast((n>0?'🤙 +':'👎 −')+Math.abs(n)+' · respeto de Carlillos');if(o<3&&S.f.kvR>=3)setTimeout(()=>toast('★ Carlillos: «Usted es de los míos»'),900)}

// ---------- fachadas ----------
function storeRoof(g,b,X,Y,W,rH){R(g,b.roof,X-2,Y,W+4,rH+2);for(let i=0;i<W+4;i+=3){R(g,shade(b.roof,.22),X-2+i,Y,1,rH+2);R(g,shade(b.roof,-.15),X-1+i,Y,1,rH+2)}
 R(g,shade(b.roof,.35),X-2,Y+2,W+4,1);R(g,shade(b.roof,-.4),X-2,Y+rH,W+4,3)}
function drawStore(g,b){const X=b.x*T,Y=b.y*T,W=b.w*T,H=b.h*T,fH=T*2,rH=H-fH,FY=Y+rH,dX=b.dx*T;
 storeRoof(g,b,X,Y,W,rH);R(g,b.wall,X,FY,W,fH);R(g,shade(b.wall,-.25),X,Y+H-3,W,3);
 if(b.st==='chino'){
  // rótulo rojo con borde dorado, faroles rojos y rejas en la ventana: el minisúper de toda esquina tica
  R(g,'#9e1b1b',X+2,FY-10,W-4,11);R(g,'#d8b45a',X+2,FY-10,W-4,1);R(g,'#d8b45a',X+2,FY,W-4,1);cText(g,'MINISÚPER LA FORTUNA',X+W/2,FY-8,5,'#f7e04b');
  R(g,'#d9d4c8',X,FY+1,W,fH-3);for(let i=0;i<W;i+=8)R(g,'#c9c3b5',X+i,FY+1,1,fH-3);
  R(g,'#5f6a70',dX-10,FY+4,30,26);for(let j=0;j<10;j+=2)R(g,'#7f8a90',dX-10,FY+4+j,30,1);R(g,'#2a1e14',dX-10,FY+14,30,16);for(let i=0;i<5;i++)R(g,['#d64545','#f2c94c','#7bb661','#3f7fd1','#f2994a'][i],dX-7+i*5,FY+20,3,7);
  const wx=X+6;R(g,'#efe9dc',wx-1,FY+6,26,18);R(g,'#4f6f8c',wx,FY+7,24,16);for(let i=0;i<24;i+=4)R(g,'#2a2a30',wx+i,FY+7,1,16);R(g,'#2a2a30',wx,FY+14,24,1);
  R(g,'#f4f4f4',wx+1,FY+16,22,7);cText(g,'OFERTA',wx+12,FY+16,4,'#c0392b');
  for(const lx of[X+3,X+W-8]){R(g,'#2a2a30',lx+2,FY-14,1,5);R(g,'#c0392b',lx,FY-10+12,6,7);R(g,'#f2c94c',lx+1,FY-10+12,4,1);R(g,'#f2c94c',lx+1,FY-10+18,4,1);R(g,'#d8b45a',lx+2,FY-10+19,2,2)}}
 else if(b.st==='pollo'){
  // franja roja con letras amarillas, ventanales con mesas adentro y una pierna de pollo como ícono
  R(g,'#d6291f',X,FY-2,W,12);R(g,'#f7c600',X,FY+9,W,2);cText(g,'POLLOLANDIA',X+W/2-4,FY+1,5,'#f7c600');
  disc(g,'#c8752a',X+W-12,FY+4,4);R(g,'#f4ead2',X+W-9,FY+6,4,2);disc(g,'#f4ead2',X+W-5,FY+7,1);
  R(g,'#f4ead2',X,FY+11,W,fH-14);const gx=(x,w)=>{R(g,'#2a2a30',x-1,FY+13,w+2,15);R(g,'#bfe0ff',x,FY+14,w,13);R(g,'#e8f4fb',x+1,FY+15,3,5);R(g,'#d6291f',x+3,FY+21,6,3);R(g,'#f7c600',x+w-9,FY+21,6,3)};gx(X+4,30);gx(X+W-34,30);
  R(g,'#2a2a30',dX+1,FY+12,14,18);R(g,'#bfe0ff',dX+2,FY+13,12,17);R(g,'#2a2a30',dX+7,FY+13,1,17)}
 else if(b.st==='ropa'){
  // rótulo pintado a mano, percheros en la acera y un maniquí con chaqueta de invierno en pleno verano
  R(g,'#f4ead2',X+3,FY-9,W-6,11);R(g,'#2a6fb0',X+3,FY-9,W-6,1);R(g,'#2a6fb0',X+3,FY+1,W-6,1);cText(g,'ROPA AMERICANA',X+W/2,FY-7,5,'#2a6fb0');
  R(g,'#2a1e14',dX-12,FY+6,40,24);for(let i=0;i<7;i++)R(g,['#d64545','#3f7fd1','#f2c94c','#7bb661','#f193b4','#8e3b8a','#f4f4f4'][i],dX-10+i*5,FY+10,4,12);R(g,'#9aa1a9',dX-11,FY+9,38,1);
  const mx=X+10;R(g,'#e8d5bd',mx+3,FY+6,6,6);R(g,'#4a6a9a',mx,FY+12,12,12);R(g,'#2a2a30',mx+5,FY+24,2,6);R(g,'#2a2a30',mx+2,FY+30,8,1);
  R(g,'#f2c94c',X+W-42,FY+8,39,9);cText(g,'TODO 1000',X+W-22,FY+10,4,'#c0392b')}
 else if(b.st==='gollo'){
  // tienda moderna: rótulo rojo con letras blancas, vitrina con tele, refri y moto, y el clásico «sin prima»
  R(g,'#d0202a',X,FY-4,W,13);R(g,'#ffffff',X,FY+8,W,1);cText(g,'GOLLO',X+W/2,FY-1,8,'#ffffff');
  R(g,'#e8eaec',X,FY+9,W,fH-12);R(g,'#2a2a30',X+3,FY+11,W-6,19);R(g,'#bfd6e6',X+4,FY+12,W-8,17);
  R(g,'#1d1a24',X+8,FY+14,20,12);R(g,'#3f7fd1',X+9,FY+15,18,10);R(g,'#7fc3e8',X+10,FY+16,6,3);
  R(g,'#f4f4f4',X+34,FY+13,10,16);R(g,'#c9ccd0',X+34,FY+19,10,1);R(g,'#9aa1a9',X+42,FY+15,1,3);
  R(g,'#d0202a',X+50,FY+21,16,5);disc(g,'#1d1a24',X+52,FY+27,3);disc(g,'#1d1a24',X+64,FY+27,3);R(g,'#2a2a30',X+60,FY+18,4,3);
  R(g,'#f7c600',X+W-38,FY+12,34,7);cText(g,'SIN PRIMA',X+W-21,FY+13,4,'#d0202a');
  R(g,'#bfe0ff',dX+1,FY+12,14,18);R(g,'#2a2a30',dX+1,FY+12,14,1);R(g,'#2a2a30',dX+8,FY+12,1,18)}}

// ---------- interiores ----------
function genStoreInt(b){const w=14,h=10,m=newMap(b.id,w,h,STORES[b.id].n);m.interior=true;m.b=Object.assign({},b,{floor:b.st==='pollo'?40:39});m.wallFace=shade(b.st==='pollo'?'#f4ead2':b.st==='gollo'?'#e8eaec':'#e6dcc2',.1);m.name=STORES[b.id].n;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const wall=y<2||x===0||x===w-1||y===h-1;setT(m,x,y,wall?10:m.b.floor,wall)}
 setT(m,7,9,13,0);m.noPath.add(9*w+7);m.exit={x:7,y:9};
 const F=(type,x,y,ww=1,hh=1,o)=>{m.objs.push(Object.assign({type,x,y,w:ww,h:hh},o||{}));for(let j=y;j<y+hh;j++)for(let i=x;i<x+ww;i++)m.s[j*w+i]=1};
 if(b.st==='chino'){for(let x=1;x<=12;x++)F('sShelf',x,2);F('sFridge',1,4,1,3);F('sGond',3,4,2,3);F('sGond',7,4,2,3);F('sCounter',10,7,3,1);m.lights.push({x:4*T,y:4*T,r:70},{x:10*T,y:6*T,r:70})}
 else if(b.st==='pollo'){F('pCounter',3,3,8,1);F('pTable',1,6,2,1);F('pTable',10,6,2,1);F('pTable',1,8,2,1);F('pTable',11,8,2,1);m.lights.push({x:7*T,y:3*T,r:80},{x:3*T,y:7*T,r:60},{x:11*T,y:7*T,r:60})}
 else if(b.st==='ropa'){F('rRack',1,3,4,1);F('rRack',9,3,4,1);F('rBin',2,6,2,1);F('rBin',10,6,2,1);F('rCurtain',12,1,1,1);F('rCounter',5,2,3,1);m.lights.push({x:4*T,y:4*T,r:70},{x:10*T,y:5*T,r:70})}
 else{for(let x=1;x<=12;x+=3)F('gTV',x,2,2,1);F('gFridge',1,4,1,2);F('gFridge',1,6,1,2);F('gSofa',4,5,3,1);F('gMoto',4,7,2,1);F('gDesk',9,7,3,1);m.lights.push({x:4*T,y:4*T,r:80},{x:10*T,y:5*T,r:80})}
 m.zdraw=(g,ph)=>ph==='base'?storeObjs(g,m):ph==='top'?storeTop(g,m):0;
 renderMap(m);return m}
function storeObjs(g,m){for(const o of m.objs){const X=o.x*T,Y=o.y*T,W=o.w*T,H=o.h*T;switch(o.type){
 case'sShelf':R(g,'#7a7f86',X,Y-14,16,30);for(let s=0;s<3;s++){R(g,'#5a5f66',X,Y-14+s*10+8,16,2);for(let i=0;i<4;i++)R(g,['#d64545','#f2c94c','#7bb661','#3f7fd1','#f2994a','#f4f4f4','#8e3b8a'][(o.x*5+s*3+i)%7],X+1+i*4,Y-14+s*10+2,3,6)}break;
 case'sFridge':R(g,'#2a2a30',X,Y-10,16,H+10);R(g,'#cfeefa',X+2,Y-8,12,H+4);for(let s=0;s<4;s++)for(let i=0;i<3;i++)R(g,['#c0473b','#3fa66b','#f2c94c','#6b3a1e'][(s+i)%4],X+3+i*4,Y-6+s*10,2,7);break;
 case'sGond':R(g,'rgba(0,0,0,.2)',X+2,Y+H-3,W,4);R(g,'#9aa1a9',X,Y,W,H);R(g,'#7f8a90',X+W/2-1,Y,2,H);for(let j=0;j<H;j+=6)for(let i=0;i<W;i+=5)R(g,['#f2c94c','#d64545','#f4f4f4','#7bb661','#f2994a','#3f7fd1'][((i+j+o.x)>>2)%6],X+1+i,Y+1+j,4,4);break;
 case'sCounter':R(g,'rgba(0,0,0,.2)',X,Y+13,W,3);R(g,'#c0392b',X,Y+3,W,12);R(g,'#e8dcc4',X,Y,W,4);R(g,'#2a2a30',X+4,Y-8,12,9);R(g,'#57d17a',X+6,Y-6,7,3);
  R(g,'#f2c94c',X+24,Y-7,8,8);R(g,'#f4f4f4',X+25,Y-9,6,3);R(g,'#2a2a30',X+26,Y-5,1,1);R(g,'#2a2a30',X+29,Y-5,1,1);R(g,'#f2c94c',X+31,Y-12,2,6);for(let i=0;i<3;i++)R(g,['#f2c94c','#d64545','#7bb661'][i],X+36+i*3,Y-4,2,4);break;
 case'pCounter':R(g,'rgba(0,0,0,.2)',X,Y+13,W,3);R(g,'#d6291f',X,Y+3,W,12);R(g,'#f7c600',X,Y+9,W,2);R(g,'#c9ccd0',X,Y,W,4);R(g,'#2a2a30',X+6,Y-8,12,9);R(g,'#57d17a',X+8,Y-6,7,3);
  for(let i=0;i<3;i++){R(g,'#c8752a',X+40+i*16,Y-5,10,6);R(g,'#e0a34f',X+41+i*16,Y-5,8,2)}R(g,'#f4f4f4',X+W-20,Y-9,14,10);R(g,'#d6291f',X+W-19,Y-8,12,3);break;
 case'pTable':R(g,'rgba(0,0,0,.2)',X+2,Y+12,W,4);R(g,'#f7c600',X,Y+2,W,10);R(g,'#ffd84a',X,Y+2,W,2);R(g,'#c0392b',X-3,Y+4,3,8);R(g,'#c0392b',X+W,Y+4,3,8);R(g,'#f4f4f4',X+6,Y+4,7,5);R(g,'#c8752a',X+7,Y+5,4,2);R(g,'#d6291f',X+W-10,Y+3,4,6);break;
 case'rRack':R(g,'#9aa1a9',X,Y+1,W,2);R(g,'#7f8a90',X+1,Y+3,1,12);R(g,'#7f8a90',X+W-2,Y+3,1,12);for(let i=0;i<W-6;i+=4)R(g,['#d64545','#3f7fd1','#f2c94c','#7bb661','#f193b4','#8e3b8a','#f4f4f4','#c8102e'][((i>>2)+o.x)%8],X+3+i,Y+3,3,10);break;
 case'rBin':R(g,'rgba(0,0,0,.2)',X,Y+12,W,4);R(g,'#c49d6c',X,Y+3,W,11);R(g,'#8a6a45',X,Y+3,W,2);for(let i=0;i<8;i++)R(g,['#d64545','#3f7fd1','#f2c94c','#7bb661','#f193b4'][i%5],X+2+(i*4)%(W-4),Y+1+(i%2)*2,4,4);R(g,'#f4f4f4',X+4,Y+7,W-8,5);cText(g,'500',X+W/2,Y+7,4,'#c0392b');break;
 case'rCurtain':R(g,'#8e3b8a',X,Y-6,W,30);for(let i=0;i<W;i+=3)R(g,'#a64ea2',X+i,Y-6,1,30);break;
 case'rCounter':R(g,'rgba(0,0,0,.2)',X,Y+13,W,3);R(g,'#7a5233',X,Y+3,W,12);R(g,'#8a6a45',X,Y,W,4);R(g,'#f4f4f4',X+6,Y-3,10,4);R(g,'#2a2a30',X+30,Y-6,10,7);break;
 case'gTV':R(g,'#2a2a30',X+1,Y-12,W-2,20);R(g,['#3f7fd1','#2e9e6b','#d6453c','#8e3b8a'][o.x%4],X+3,Y-10,W-6,15);R(g,'#ffffff55',X+4,Y-9,6,3);R(g,'#c9ccd0',X,Y+8,W,8);R(g,'#f7c600',X+4,Y+10,W-8,4);break;
 case'gFridge':R(g,'#f4f4f4',X+1,Y-8,14,H+6);R(g,'#c9ccd0',X+1,Y+4,14,1);R(g,'#9aa1a9',X+12,Y-4,1,6);R(g,'#9aa1a9',X+12,Y+7,1,8);R(g,'#f7c600',X+2,Y-6,6,4);break;
 case'gSofa':R(g,'rgba(0,0,0,.2)',X,Y+12,W,4);R(g,'#566070',X,Y+2,W,12);R(g,'#6e7a8c',X+2,Y+4,W/3-3,8);R(g,'#6e7a8c',X+W/3+1,Y+4,W/3-3,8);R(g,'#6e7a8c',X+2*W/3,Y+4,W/3-3,8);R(g,'#f7c600',X+W-12,Y-4,12,6);break;
 case'gMoto':R(g,'rgba(0,0,0,.2)',X,Y+12,W,3);disc(g,'#1d1a24',X+5,Y+10,4);disc(g,'#1d1a24',X+W-5,Y+10,4);disc(g,'#9aa1a9',X+5,Y+10,1);disc(g,'#9aa1a9',X+W-5,Y+10,1);R(g,'#d0202a',X+6,Y+3,W-12,6);R(g,'#2a2a30',X+10,Y,8,3);R(g,'#c9ccd0',X+W-8,Y-2,2,6);break;
 case'gDesk':R(g,'rgba(0,0,0,.2)',X,Y+13,W,3);R(g,'#7a5233',X,Y+3,W,12);R(g,'#8a6a45',X,Y,W,4);R(g,'#2a2a30',X+6,Y-8,12,9);R(g,'#6fb5e8',X+7,Y-7,10,6);R(g,'#f4f4f4',X+26,Y-2,10,3);R(g,'#d0202a',X+38,Y-6,5,6);break}}
 const wy=T+2;
 if(m.b.st==='chino'){R(g,'#9e1b1b',4*T,wy,5*T,10);cText(g,'AQUÍ NO SE FÍA',6.5*T,wy+2,5,'#f7e04b');R(g,'#f4f4f4',10*T,wy-1,22,12);R(g,'#c0392b',10*T,wy-1,22,3);cText(g,'31',10*T+11,wy+3,5,'#14101c')}
 if(m.b.st==='pollo'){for(const[x,a1,a2]of[[1,'COMBO','₡3200'],[11,'ALITAS','₡2800']]){R(g,'#1d1a24',x*T,wy-2,2*T,14);cText(g,a1,x*T+T,wy-1,5,'#f7c600');cText(g,a2,x*T+T,wy+6,5,'#ffffff')}}
 if(m.b.st==='ropa'){R(g,'#f4ead2',1*T,wy-1,4*T,11);cText(g,'NO SE CAMBIA',3*T,wy+2,5,'#c0392b');R(g,'#f4ead2',8*T,wy-1,3*T,11);cText(g,'NO SE FÍA',9.5*T,wy+2,5,'#2a6fb0')}
 if(m.b.st==='gollo'){R(g,'#d0202a',3*T,wy-1,8*T,12);cText(g,'¡LLÉVESELO HOY! SIN PRIMA',7*T,wy+2,5,'#ffffff')}}
function storeTop(g,m){if(m.b.st==='chino')for(const x of[3,7,11]){R(g,'#14101c',x*T+7,0,1,T*2+4);R(g,'#c0392b',x*T+3,T*2+4,9,10);R(g,'#f2c94c',x*T+4,T*2+4,7,1);R(g,'#f2c94c',x*T+4,T*2+13,7,1);R(g,'#d8b45a',x*T+7,T*2+14,1,4)}
 if(m.b.st==='pollo')for(const x of[3,7,11]){R(g,'#14101c',x*T+7,0,1,T*2+6);R(g,'#f7c600',x*T+4,T*2+6,7,4)}}
function storeVend(){const V=(map,id,name,x,y,look,talk,sh,o)=>zPed(map,x,y,Object.assign({id,name},look),Object.assign({stat:1,talk,sh,reach:34,d0:0},o||{}));
 V('super_chino','z_lin','Doña Lin',11,6,{hair:'cola',hairColor:'#1c1c1c',skin:'#f1d3b0',shirt:'#c0392b',acc:'anteojos'},linTalk,['¡Pase, amigo!','Arroz en oferta, ¡aproveche!']);
 V('super_chino','z_jaime','Jaime',12,5,{hair:'corto',hairColor:'#1c1c1c',skin:'#f1d3b0',shirt:'#f4f4f4',pants:'#2d3a6e'},jaimeTalk,['Mae, qué pereza la tarea…'],{d0:2});
 V('pollolandia','z_yendry','Yendry',6,2,{hair:'cola',hairColor:'#3b2416',skin:'#c68642',shirt:'#d6291f',acc:'gorra',accColor:'#f7c600'},yendryTalk,['¿Qué le damos, mi amor?']);
 V('pollolandia','z_cocina','Don Chito',9,2,{hair:'calvo',hairColor:'#3a3a3a',skin:'#8d5524',shirt:'#f4f4f4',acc:'bigote'},chitoTalk,['¡Pollo saliendo!']);
 zPed('pollolandia',2,7,{id:'z_fam',name:'Señora',hair:'moño',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#3fb6b0'},{stat:1,d0:0,talk:e=>say(e.c,rot('fam',['Aquí celebramos todos los cumpleaños de la familia. El queque lo traemos nosotros, eso sí.','Ese chiquito mío ya se comió seis piezas. Seis. No sé dónde las mete.']))});
 V('ropa','z_ivannia','Doña Ivannia',6,1.6,{hair:'rizos',hairColor:'#7a3a2a',skin:'#d9a066',shirt:'#f193b4',acc:'aretes',accColor:'#f2c94c'},ivanniaTalk,['¡Todo a mil, todo a mil!','¡Ropa traída de afuera!']);
 V('gollo','z_randall','Randall',10,6,{hair:'corto',hairColor:'#2a1810',skin:'#e0ac69',shirt:'#f4f4f4',pants:'#2a2a30',acc:'lentes'},randallTalk,['¡Sin prima, con solo la cédula!','¡Cuotas cómodas, mae!'])}
function linTalk(e){const c=e.c;say(c,S.f.linMet?rot('lin',['¡Amigo! ¿Qué ocupa hoy?','Hoy llegó arroz nuevo. Más barato que la pulpería, ¿eh? Pero no le diga a Doña Rosa.','¿Otra vez usted? Ya casi es de la familia. Casi.']):'¡Bienvenido, amigo! Aquí hay de todo: arroz, frijoles, galletas, gaseosa, pilas, chancletas… Si no lo tengo, no existe.',[
 {t:'Papitas tostadas (₡700)',f(){zBuy(700,()=>addI('papitas'))}},
 {t:'Gaseosa grande (₡1 100)',f(){zBuy(1100,()=>addI('coca'))}},
 {t:'Fideos instantáneos (₡400)',f(){zBuy(400,()=>{addI('fideos');say(c,'Fideos de pollo. Los más vendidos del barrio. Usted sabe por qué: a fin de mes todos somos iguales.')})}},
 {t:'Paquete de tortillas (₡650)',f(){zBuy(650,()=>addI('tortillas'))}},
 {t:'¿Me fía?',f(){say(c,'¡Jajaja! Aquí no se fía, amigo. Ni al presidente. Mire el rótulo.');say(null,'Detrás del mostrador hay un cartel rojo: «AQUÍ NO SE FÍA». Al lado, un gato dorado mueve la mano sin parar.')}}]);S.f.linMet=1}
function jaimeTalk(e){say(e.c,rot('jaime',['Mae, mi mamá me tiene aquí haciendo tarea y cuidando la caja al mismo tiempo. Eso es explotación infantil… pero con wifi.','¿Usted es bueno en mate? Tengo examen de ecuaciones el lunes y voy más perdido que turista en Chepe.','Mi mamá habla mandarín, yo hablo tico. Cuando nos peleamos, nadie gana.','Carlillos viene todos los días a preguntar si hay fideos vencidos. Mi mamá se los regala. Dice que le da lástima. Yo digo que le cae bien.']))}
function yendryTalk(e){const c=e.c;say(c,'¡Bienvenido a Pollolandia! ¿Para comer aquí o para llevar?',[
 {t:'Combo 2 piezas con papas (₡3 200)',f(){zBuy(3200,()=>{enAdd(35);say(null,'Dos piezas crujientes, papas, ensalada y una gaseosa con hielo hasta arriba. Quedás como boa. +35⚡')})}},
 {t:'Alitas picantes (₡2 800)',f(){zBuy(2800,()=>{enAdd(25);say(null,'Las alitas pican rico. Te tomás la gaseosa de un trago. +25⚡')})}},
 {t:'Caja de 8 piezas para llevar (₡7 500)',f(){zBuy(7500,()=>{addI('pollo');say(c,'Para llevar, ¿verdad? Le eché extra de salsa. No le diga a mi jefe.')})}},
 {t:'¿Cuál es el secreto del pollo?',f(){say(c,'Ni idea, mi amor. Yo solo cobro. El secreto lo sabe Don Chito y no se lo dice ni al cura.')}}])}
function chitoTalk(e){say(e.c,rot('chito',['¿El secreto del pollo? Amor, paciencia y aceite bien caliente. Lo demás es cuento.','Llevo veinte años friendo pollo. Ya no huelo a perfume, huelo a combo dos.','Los domingos esto se llena. Familias enteras, cumpleaños, novios en la primera cita… Aquí empezaron más matrimonios que en la iglesia.']))}
function randallTalk(e){const c=e.c,E2=E(),list=['sala','refri','compu','cama'].filter(id=>!U(id)&&!(E2.obra&&E2.obra.id===id));
 say(c,'¡Buenas, buenas! ¿Qué se va a llevar hoy? Aquí se lo lleva sin prima, solo con la cédula. ¡Facilito!',[
 ...list.slice(0,3).map(id=>{const l=HUP[id].lv[0],cuota=Math.ceil(l.c*1.65/8/50)*50;return{t:`${l.n} (${fmtC(l.c)} o 8 cuotas de ${fmtC(cuota)})`,f(){say(c,'¡Excelente escogencia! ¿De contado o en cuotas? Las cuotas son cómodas… para nosotros, je.',[
   {t:'De contado ('+fmtC(l.c)+')',f(){zBuy(l.c,()=>{gollPut(id);say(c,'¡Hoy mismo se lo llevamos a la casa! Gracias por preferir Gollo.')})}},
   {t:'A cuotas: 8 semanas de '+fmtC(cuota),f(){const e3=E();(e3.cuotas||(e3.cuotas=[])).push({id,n:l.n,amt:cuota,left:8});gollPut(id);say(c,'¡Listo! Firme aquí, aquí y aquí. La primera cuota le llega con los recibos de la semana.');say(null,'Al final vas a pagar '+fmtC(cuota*8)+' por algo que vale '+fmtC(l.c)+'. Randall sonríe como si te hubiera hecho un favor.')}},
   {t:'Mejor lo pienso'}])}}}),
 {t:'¿Qué es eso de «sin prima»?',f(){say(c,'Que no tiene que dar nada por adelantado. Usted se lo lleva hoy y lo paga poquito a poquito… durante un buen tiempito.');say(c,'Mire, en el barrio hay gente que todavía está pagando la tele del Mundial pasado. ¡Pero la disfrutaron!')}},
 {t:'Solo estoy viendo'}])}
const ROPA=[['Camiseta roja de la Sele','#c8102e',1500,'¡La de la Sele! Con esta puesta, hasta usted mete gol.'],['Camisa floreada de playa','#f2994a',1000,'Esa camisa grita «vacaciones en Puntarenas». A todo volumen.'],['Jacket de mezclilla','#4a6a9a',2000,'Para el frío de diciembre. O para verse malo como Carlillos.'],['Polo negra de «marca»','#2a2a30',1200,'Elegante. Si alguien pregunta, es de tienda.'],['Camiseta verde de Saprissa… digo, de equipo','#2e9e6b',1300,'Mejor no la use frente a un manudo. Por su seguridad.']];
function ivanniaTalk(e){const c=e.c;say(c,'¡Mi amor! Ropa americana, de la buena, traída de afuera. Todo a mil, casi todo. Lo que no está a mil está a quinientos. Y lo que no le quede… se lo regala a alguien.',[
 ...ROPA.slice(0,3).concat(S.f.ropaMas?ROPA.slice(3):[]).map(([n,col,pr,msg])=>({t:n+' ('+fmtC(pr)+')',f(){zBuy(pr,()=>{const p=CH.player;p.shirt=col;p.v=(p.v||1)+1;saveChars();say(c,msg);say(null,'Te cambiás detrás de la cortina morada. Te queda… diay, te queda.')})}})),
 ...(S.f.ropaMas?[]:[{t:'¿Tiene algo más?',f(){S.f.ropaMas=1;say(c,'Para usted siempre hay más. Venga, que acabo de abrir un paca nueva. Hable conmigo otra vez.')}}]),
 {t:'¿Cómo sabe si la ropa es buena?',f(){say(c,'Por el olor, mi amor. Si huele a paca, es buena. Si huele a perfume caro, alguien la devolvió. Y aquí no se devuelve nada.')}},{t:'Solo estoy viendo'}])}
function gollPut(id){const e=E();e.up[id]=1;applyHome();toast('🚚 Gollo te llevó: '+HUP[id].lv[0].n);saveGame()}
function zCuotas(e,mk2){for(const c of e.cuotas||[])if(c.left>0){mk2('cuota_'+c.id,'Cuota de Gollo: '+c.n,c.amt);c.left--}}
const cutMsg=k=>k.startsWith('cuota')?'📞 Llamó el cobrador de Gollo: «Su cuota está atrasada, caballero»':'⚡ Te cortaron '+(k==='luz'?'la luz':k==='agua'?'el agua':'el internet');

// ---------- la entrada ----------
const ENT={x0:32,x1:37,y0:40,y1:53};
function carveEntrada(m){const W=m.w;for(let y=40;y<=52;y++){setT(m,34,y,6,0);setT(m,35,y,6,0);setT(m,33,y,37,1);setT(m,36,y,37,1)}
 for(let y=48;y<=52;y++)for(let x=32;x<=37;x++)setT(m,x,y,6,0);for(let y=47;y<=53;y++){setT(m,31,y,37,1);setT(m,38,y,37,1)}for(let x=31;x<=38;x++)setT(m,x,53,37,1);
 setT(m,32,47,37,1);setT(m,37,47,37,1);
 m.objs.push({type:'sillon',x:32,y:49,w:2,h:1},{type:'estanon',x:37,y:51,w:1,h:1});for(const[x,y]of[[32,49],[33,49],[37,51]])m.s[y*W+x]=1}
function drawEntrada(g){
 // tapias con grafiti, basura y un foco quebrado
 const tags=[[32.5,47,'PURA VIDA','#f2c94c'],[36,44,'♥','#f193b4'],[33,43,'KVN','#3fb6b0'],[37.5,47,'MAE','#f2994a'],[38,50,'FE','#7bb661']];
 for(const[x,y,t,c]of tags){if(t==='♥'){R(g,c,x*T+4,y*T+5,3,2);R(g,c,x*T+8,y*T+5,3,2);R(g,c,x*T+4,y*T+7,7,2);R(g,c,x*T+6,y*T+9,3,2)}else cText(g,t,x*T+8,y*T+5,5,c)}
 for(const[x,y]of[[34,43],[35,47],[33,51]]){R(g,'#1d1a24',x*T+3,y*T+9,8,6);R(g,'#2f2f36',x*T+4,y*T+8,6,2)}
 R(g,'#d9d4c8',35*T+2,45*T+4,4,2);R(g,'#f4f4f4',34*T+9,50*T+6,3,4);
 R(g,'#f4ead2',36*T+2,39*T-3,26,9);R(g,'#2a2a30',36*T+2,39*T-3,26,1);cText(g,'ENTRADA',36*T+15,39*T-1,4,'#7a2e1f')}
function drawEntradaTop(g){const X=36*T+10,Y=44*T;R(g,'#5f5a52',X,Y-28,2,32);R(g,'#5f5a52',X-8,Y-28,10,2);R(g,'#2a2a30',X-11,Y-27,5,4);R(g,'#55524a',X-10,Y-26,3,2)}
function entradaObj(g,o){const X=o.x*T,Y=o.y*T;if(o.type==='sillon'){R(g,'rgba(0,0,0,.25)',X+1,Y+12,30,4);R(g,'#6b3f5a',X,Y+2,32,12);R(g,'#86557a',X+3,Y+4,12,7);R(g,'#86557a',X+17,Y+4,12,7);R(g,'#4f2c42',X,Y+12,32,2);R(g,'#c9b98f',X+22,Y+6,4,3);R(g,'#4f2c42',X,Y-2,32,4)}
 else if(o.type==='estanon'){R(g,'rgba(0,0,0,.25)',X+2,Y+12,13,4);R(g,'#4a5a6a',X+2,Y,12,14);R(g,'#5f7080',X+2,Y+3,12,1);R(g,'#5f7080',X+2,Y+9,12,1);R(g,'#1d1a24',X+3,Y,10,2)}}

// ---------- asaltos ----------
let ASL=null;
function asaltoTick(dt){if(mode!=='play'||fading||ASL||!S)return;const h=hour();if(!(h>=19||h<5)){S.f.asT=0;return}
 const tx=P.x/T,ty=P.y/T;let zone=null;
 if(P.map==='ext'&&tx>=ENT.x0&&tx<ENT.x1+1&&ty>=ENT.y0+.8&&ty<ENT.y1)zone='entrada';
 else if(P.map==='chepe'&&(h>=21||h<5)&&tx<22&&ty>13&&ty<28)zone='parque';
 if(!zone){S.f.asT=0;return}const nid=(h<5?S.day-1:S.day)+zone;if(S.f.asN===nid)return;
 S.f.asT=(S.f.asT||0)+dt;if(S.f.asT<(zone==='entrada'?1.4:5))return;S.f.asN=nid;startAsalto(zone)}
function startAsalto(zone){const looks=[{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#2a2a30',pants:'#3a4250',acc:'gorra',accColor:'#1c1c1c'},{hair:'corto',hairColor:'#3b2416',skin:'#c68642',shirt:'#4a4a52',pants:'#2a2a30',acc:'ninguno'}];
 const dir=DV[P.dir],ents=looks.map((l,i)=>{const c=fillChar(Object.assign({id:'z_chap'+i,name:'Chapulín',v:1},l));const e={kind:'ped',z:1,c,map:P.map,x:P.x+dir[0]*20+(i?14:-6),y:P.y+dir[1]*20+(i?4:0),dir:0,fr:0,anim:0,stat:1,wt:99,talk:()=>{}};faceTo(e,P);ENTS.push(e);return e});
 ASL={ents,zone};const ch=ents[0].c,k=NPC.kevin,kev=zone==='entrada'&&k&&k.map===P.map&&Math.hypot(k.x-P.x,k.y-P.y)<190;
 beep(220,.2,'sawtooth',.04,160);setTimeout(()=>beep(165,.3,'sawtooth',.04,120),200);
 say(null,'De la oscuridad salen dos maes con capucha y te cierran el paso. Uno tiene la mano metida en la jacket.');
 say(ch,zone==='entrada'?'Diay, mopri… ¿qué hora tiene?':'Quieto, mae. Tranquilito. ¿Qué anda en la bolsa?');
 const take=(f,why)=>{const loss=Math.round(S.money*f/50)*50;if(loss>0){spend(loss,'Asalto');toast('😰 Te quitaron '+fmtC(loss))}S.f.asaltos=(S.f.asaltos||0)+1;
  if(phOn('ariana'))phQueue('ariana',zone==='entrada'?'me dijo Doña Rosa que te asaltaron en la entrada 😰 ¿¿estás bien?? no pasés por ahí de noche, por favor':'¿¿te asaltaron en Chepe?? 😰 avisame que estás bien',12);return loss};
 if(kev){say('kevin','¡EPA! ¿Cuál es la vara con mi mopri? ¿Ah?');say(ch,'No, no, Carlillos, tranquilo… No sabíamos que era suyo, mae.');say('kevin','Ahora ya saben. Vuelen.');say(null,'Los chapulines se van caminando rápido, sin mirar para atrás. Carlillos se vuelve a sentar como si nada.');afterD(()=>{kvAdd(.5);endAsalto()});runDialog();setTimeout(()=>$('#prompt').classList.add('hidden'),0);return}
 say(null,'¿Qué hacés?',[
  {t:'Darles la plata, sin bronca',f(){const l=take(.5);say(ch,l?'Así me gusta. Sin bronca. Que pase buena noche, mopri.':'¿Nada? ¿Ni para el bus? Qué salado, mae… Váyase.')}},
  {t:'Salir corriendo',f(){if(Math.random()<.55){enAdd(-15);say(null,'Corrés como nunca en tu vida. Llegás a la calle con el corazón en la garganta. Se te cayó la dignidad, pero no la plata. −15⚡')}else{take(.7);say(null,'Te alcanzan en tres pasos. Por correr, te quitan más.')}}},
  {t:zone==='entrada'?'«Tranquilo, soy compa de Carlillos»':'«Mae, yo también soy de barrio»',f(){
   if(zone==='entrada'&&kvR()>=3){say(ch,'¿De Carlillos? Diay… perdón, mopri. No sabíamos. Siga tranquilo.');say(null,'Se hacen a un lado. Ser compa de Carlillos vale más que cualquier candado.')}
   else if(zone==='entrada'){take(.5);say(ch,'¿Carlillos? Jajaja, Carlillos ni sabe quién es usted. Buen intento.')}
   else if(Math.random()<.3)say(ch,'¿Ah sí? ¿De cuál barrio? …Bueno, váyase, pues. Hoy estoy de buenas.');else{take(.5);say(ch,'Todos somos de barrio, mae. Deme eso.')}}}]);
 afterD(endAsalto);runDialog();setTimeout(()=>$('#prompt').classList.add('hidden'),0)}
function endAsalto(){if(!ASL)return;ENTS=ENTS.filter(e=>!ASL.ents.includes(e));ASL=null;saveGame()}

// ---------- Carlillos ----------
function kvShop(){const id='kevin';say(id,'Mae, tengo de todo. Solo no pregunte de dónde salió.',[
 {t:'Película «original» (₡500)',f(){zBuy(500,()=>{addI('dvd');kvAdd(.4);say(id,'Recién salida del cine. Se ve a un mae parándose en medio de la pantalla, pero la historia está buenísima.')})}},
 {t:'Gorra «Naik» (₡2 000)',f(){zBuy(2000,()=>{addI('gorra');kvAdd(.4);say(id,'Original, original. Si alguien le dice que el logo está al revés, es que la está viendo mal.')})}},
 {t:'Cargador «nuevo» (₡1 500)',f(){zBuy(1500,()=>{addI('cargadork');kvAdd(.4);say(id,'Ese carga en una hora. O en tres. Depende de cómo lo mire.')})}},
 {t:'Nada, gracias'}])}
const KV_LINES=['Mae, anoche se fue la luz y yo pensé que me había quedado ciego. Lo más feo que me ha pasado en la vida.',
 'Doña Rosa no me deja entrar a la pulpería después de las seis. Dice que le espanto a la clientela. Yo digo que la clientela me espanta a mí.',
 'La policía pasó tres veces hoy. Yo los saludo, ellos me saludan. Somos como compas que no se quieren.',
 '¿Ve esa tapia? Yo la pinté. Me dijeron que eso es vandalismo. Yo le digo arte urbano.',
 'Ando más tranquilo que un perezoso en domingo. Literal.',
 'Mi mamá dice que me consiga un brete. Ya tengo: cuidar la entrada. No paga, pero es noble.',
 'Mae, ¿usted ha pensado que si los perros hablaran, el de Doña Marta sería el más chismoso del barrio?',
 'El chino del súper no me fía. Pero me regala los fideos que se vencen mañana. Eso es amistad.',
 'Si me ve los ojos rojos es alergia. Al polen. Del monte. Usted me entiende.',
 'Yo no soy malo, mopri. Yo soy de barrio. Es diferente.',
 'Una vez me hicieron una entrevista para el noticiero porque me asaltaron. A mí. En mi propia entrada. Todavía me da vergüenza.',
 'Dicen que el Cadejos sale por el trillo de noche. Yo lo vi una vez. O era un perro negro. O era el monte. Una de las tres.'];
const KV_INTRO=['Carlillos está tirado en el sillón viejo de la entrada, con los ojos rojos y una sonrisa de oreja a oreja. Huele a monte.',
 'Carlillos está recostado contra la tapia, con la gorra para atrás, viendo videos en un celular con la pantalla quebrada.',
 'Carlillos le da una jalada a lo que está fumando, te ve y lo esconde detrás de la espalda. Como si eso sirviera.',
 'Carlillos está sentado en la acera tirándole piedritas a una lata. Lleva veinte intentos. No le ha pegado a ninguna.'];


