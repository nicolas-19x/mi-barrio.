// ================= PUNTARENAS EN GRANDE: EL PASEO DE LOS TURISTAS, LA PLAYA, EL MAR Y LOS LUGARES ESCONDIDOS =================
// Mapa 'playa' de 128×50 casillas (1 casilla ≈ 1 m). De norte a sur: fachadas del puerto, acera, el Paseo con tránsito,
// el bulevar (almendros, bancas, faroles, chinamos y las letras), el muro con gradas, la playa larga y el golfo.
// Al oeste un manglar con un trillo escondido; al este, pasando las piedras, una caleta; el muelle largo con lanchas.
// El mar se pinta quieto en el fondo (profundidad por color) y se anima encima: la orilla que va y viene con espuma,
// las olas, los destellos del sol según la hora, las boyas y los reflejos de noche.
var PZW=128,PZH=50;
// clases de casilla (PZ.k): 0 sólido · 1 calle · 2 acera/bulevar · 3 arena · 4 agua · 6 piedra · 7 manglar · 8 edificio · 9 muro
//                           10 trillo · 11 gradas · 12 monte · 13 piedras planas
var PZ={k:null,objs:[],cars:[],carT:[0,0],lanes:[{y:7,dir:-1},{y:9,dir:1}],boats:[],sec:{},t:0,bubT:0};
var PZ_BOYA=39;                                  // de esta fila para abajo ya no se puede nadar
var PZ_PIER={x0:89,x1:91,y0:16,y1:43,tx0:85,tx1:95,ty0:44,ty1:46};   // el muelle (franja y la T del final)
var PZ_STAIRS=[24,46,66,104];                   // gradas del muro (2 casillas de ancho)
var PZ_ARRIVE=[4,5];
function pzShoreH(X){return(30+1.1*Math.sin(X/288)+.6*Math.sin(X/137.6+1)+(X>3700?-.6:0))*32}   // orilla en píxeles HD
function pzShore(x){return pzShoreH(x*2)/2}                                                      // en píxeles del mundo
function pzK(tx,ty){if(tx<0||ty<0||tx>=PZW||ty>=PZH)return 0;return PZ.k[ty*PZW+tx]}
function pzInPier(tx,ty){return(tx>=PZ_PIER.x0&&tx<=PZ_PIER.x1&&ty>=PZ_PIER.y0&&ty<=PZ_PIER.y1)||(tx>=PZ_PIER.tx0&&tx<=PZ_PIER.tx1&&ty>=PZ_PIER.ty0&&ty<=PZ_PIER.ty1)}
var PZ_TRAIL=[[16,21],[15,21],[14,21],[14,22],[13,22],[12,22],[12,23],[11,23],[10,23],[10,24],[9,24],[9,25],[8,25]];
var PZ_ROCKPATH=[[112,19],[113,19],[113,20],[114,20],[115,20]];
var PZ_SECRETS={
  manglar:{x:6,y:25,n:'El claro del manglar',d:'Un claro escondido entre los mangles, con un tronco viejo mirando al estero.',lx:6,ly:27},
  muelle:{x:90,y:19,n:'Debajo del muelle',d:'La sombra fresca debajo del muelle, con un tronco atravesado entre los pilotes.',lx:90,ly:20},
  caleta:{x:121,y:24,n:'La caleta de las piedras',d:'Una caletita del otro lado de las piedras, con un almendro y un tronco mirando al golfo.',lx:121,ly:26}};
// ---------------------------------------------------------------- el mapa
function genPlaya(){const W=PZW,H=PZH,m=newMap('playa',W,H,'Puntarenas');PZ.k=new Uint8Array(W*H);m.objs=[];PZ.objs=m.objs;
  const K=(x,y,k)=>{if(x<0||y<0||x>=W||y>=H)return;PZ.k[y*W+x]=k};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const sea=y*T+8>pzShore(x*T+8)-2;let k;
    if(y<4)k=(x>=38&&x<=40)||(x>=74&&x<=76)?1:8;else if(y<6)k=2;else if(y<11)k=1;
    else if(x<=15){k=sea&&y>=33?4:7}
    else if(x>=112&&x<=115){k=y<=35?6:4}
    else if(x>=116){k=y<=16?12:(sea?4:3);if(x===127&&y<=34)k=6}
    else if(y<=15)k=2;else if(y===16)k=9;else k=sea?4:3;
    K(x,y,k)}
  for(const sx of PZ_STAIRS){K(sx,16,11);K(sx+1,16,11)}
  for(const[x,y]of PZ_TRAIL)K(x,y,10);for(let y=23;y<=27;y++)for(let x=3;x<=8;x++)if(!(x===3&&(y===23||y===27)))K(x,y,10);
  for(const[x,y]of PZ_ROCKPATH)K(x,y,13);
  for(let y=16;y<=PZ_PIER.y1;y++)for(let x=PZ_PIER.x0;x<=PZ_PIER.x1;x++)if(y===16)K(x,y,9);
  for(let y=PZ_PIER.ty0;y<=PZ_PIER.ty1;y++)for(let x=PZ_PIER.tx0;x<=PZ_PIER.tx1;x++)K(x,y,4);
  PZ.g=PZ.k.slice();   // el suelo sin los objetos (para pintar)
  // objetos (casillas sólidas)
  const O=(type,x,y,w,h,extra,solid)=>{const o=Object.assign({type,x,y,w,h},extra||{});m.objs.push(o);if(solid!==false)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)K(i,j,0);return o};
  O('chinamo',33,11,3,2,{txt:'CHURCHILLS',col:'#ef6f8a',col2:'#f6efe2',goods:'ch'});O('chinamo',56,11,3,2,{txt:'PIPAS FRÍAS',col:'#4fb37a',col2:'#f6efe2',goods:'pipa'});
  O('chinamo',78,11,3,2,{txt:'GRANIZADOS',col:'#3f8fd1',col2:'#f6efe2',goods:'gran'});O('chinamo',99,11,3,2,{txt:'CEVICHE',col:'#f2a03a',col2:'#f6efe2',goods:'cev'});
  O('letras',46,13,9,1);
  m.almendros=[[20,12],[29,12],[41,12],[61,12],[71,12],[85,12],[95,12],[108,12],[118,19]];
  m.palms=[[19,19],[37,18],[61,19],[82,18],[100,20],[108,19],[124,20]];
  for(const[x,y]of m.almendros)K(x,y,0);for(const[x,y]of m.palms)K(x,y,0);
  m.faroles=[];for(let x=18;x<=110;x+=9){if(m.objs.some(o=>o.type==='chinamo'&&x>=o.x-1&&x<=o.x+o.w))continue;m.faroles.push([x,11])}
  for(let y=19;y<=42;y+=6){m.faroles.push([89,y,1]);m.faroles.push([91,y,2])}
  for(const x of[22,27,37,59,68,83,93,102,110])O('banca',x,14,1,1);
  // la playa: sombrillas, toallas, castillos, el chunche de la banana y la silla del salvavidas
  for(const[x,y,c]of[[28,22,'#e8524a'],[50,24,'#2a6fb0'],[76,22,'#f2c94c'],[96,24,'#4fb37a'],[86,26,'#ef6f8a'],[105,23,'#e8524a']])O('sombrilla',x,y,1,1,{c},false);
  O('salvavidas',73,19,1,1);O('castillo',44,27,1,1,{},false);for(const[x,y]of[[29,23],[87,27],[51,25]])O('hielera',x,y,1,1,{},false);O('radio',85,27,1,1,{},false);
  O('banana',66,28,3,1,{},true);O('ruedas',62,20,1,1,{},false);
  // troncos de los lugares escondidos
  O('tronco',5,26,3,1,{s:'manglar'});O('tronco',89,19,3,1,{s:'muelle',under:1},false);O('tronco',120,25,3,1,{s:'caleta'});
  // lanchas amarradas (sólidas para el que nada)
  PZ.boats=[{x:93,y:32,w:4,h:2,name:'LA PERLA',col:'#f4f4f0',band:'#d6453c',big:1},{x:84.5,y:36,w:3,h:2,name:'DELFÍN',col:'#f2f0e8',band:'#2a6fb0'},{x:69,y:34,w:3,h:2,name:'YEISON',col:'#f4f2ea',band:'#f2c94c',ban:1}];
  for(const b of PZ.boats)for(let j=Math.floor(b.y);j<b.y+b.h;j++)for(let i=Math.floor(b.x);i<b.x+b.w;i++)if(!pzInPier(i,j))K(i,j,0);
  // m.s: lo que no se puede pisar (para los vecinos el agua también es sólida)
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=PZ.k[y*W+x];const walk=k===1||k===2||k===3||k===10||k===11||k===13;setT(m,x,y,k===1?1:k===2||k===11?2:k===4?37:k===3||k===10||k===13?6:37,walk?0:1)}
  for(let y=16;y<=PZ_PIER.y1+3;y++)for(let x=PZ_PIER.x0;x<=PZ_PIER.x1;x++)if(pzInPier(x,y))m.s[y*W+x]=1;   // el muelle: lo maneja el jugador aparte
  for(const sx of PZ_STAIRS){m.noPath.add(16*W+sx);m.noPath.add(16*W+sx+1)}
  m.lights=[];for(const[x,y,s]of m.faroles)m.lights.push({x:x*T+(s===1?2:s===2?14:8),y:y*T+(s?4:6),r:s?54:72,pole:1});
  for(const o of m.objs)if(o.type==='chinamo')m.lights.push({x:(o.x+1.5)*T,y:(o.y+2)*T,r:46});
  m.walk=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!m.s[y*W+x]&&(PZ.k[y*W+x]===3||PZ.k[y*W+x]===2)&&y>=11)m.walk.push([x,y]);
  const Z=(id,name,x,y,look,o)=>zPed('playa',x,y,Object.assign({id,name},look),Object.assign({stat:1,reach:26,d0:0},o||{}));
  Z('z_olga','Doña Olga',34,13,{hair:'moño',hairColor:'#2b1a10',skin:'#8d5524',shirt:'#ef6f8a',pants:'#2d3346',acc:'aretes',accColor:'#f2c94c'},{talk:olgaTalk});
  Z('z_pipero','Pipero',57,13,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f4f4f4',pants:'#3a3a42',acc:'sombrero',accColor:'#e9dcb5'},{talk:piperoTalk});
  Z('z_chalo','Don Chalo',90,45,{hair:'calvo',hairColor:'#cfcfcf',skin:'#8d5524',shirt:'#2a6fb0',pants:'#e9dcb5',acc:'sombrero',accColor:'#c9a860'},{talk:chaloTalk,d0:0,pier:1});
  Z('z_turista','Turista gringo',33,25,{hair:'corto',hairColor:'#e8c070',skin:'#f6d0b8',shirt:'#f2c94c',pants:'#2a6fb0',acc:'lentes',accColor:'#2a2a30'},{talk:e=>say(e.c,pick(['Hello! Eh… ¿pura vida? I love this place!','¿Dónde está el… churchill? Everybody says churchill.','Me quemé mucho. Very red. Like a… camarón?']))});
  Z('z_chiquita','Chiquita del puerto',45,28,{hair:'cola',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#e85d75',pants:'#2a8f6a'},{talk:e=>say(e.c,pick(['¿Usted es de Chepe? Se nota, va todo blanquito.','Mi papá es pescador. Dice que el mar está bravo hoy.','¡Vamos a hacer un castillo de arena!']))});
  if(typeof pzPeople==='function')pzPeople(m);
  renderMap(m);pzCarsInit();return m}
// ---------------------------------------------------------------- el arte (estilo B)
// Luz de la tarde desde el oeste, como en el barrio: lo iluminado tira a cálido, la sombra a morado frío.
const PZ_BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16),pzD=(x,y)=>PZ_BAY[((y&3)<<2)|(x&3)];
// (versiones escalares: se llaman millones de veces al pintar el mapa, así que no crean arreglos nuevos)
var PZ_O=[0,0,0];
function pzSandPx(X,Y,sh,nn){const n=nn!==undefined?nn:hdVN(X,Y,40,3),r=hdr(X,Y);let R=222+n*12,G=203+n*10,B=160+n*8,f=1;
  const rip=Math.sin(X*.09+Y*.42+n*7);if(rip>.82)f=1.04;else if(rip<-.86)f=.95;
  const n2=hdr(X>>3,(Y>>3)+977);if(n2>.8)f*=.97;if(r>.993){R+=(250-R)*.6;G+=(244-G)*.6;B+=(230-B)*.6}else if(r<.012)f*=.82;else if(r>.95)f*=1.035;else if(r<.05)f*=.97;
  R*=f;G*=f;B*=f;const d=sh-Y;if(d<64){const w=Math.max(0,1-d/64),q=w*w*.85+(w>.33?pzD(X,Y)*.06:0);R+=(176-R)*q;G+=(150-G)*q;B+=(112-B)*q;if(d<16&&r>.6){const k=.35*(1-d/16);R+=(196-R)*k;G+=(200-G)*k;B+=(196-B)*k}}
  PZ_O[0]=R;PZ_O[1]=G;PZ_O[2]=B;return PZ_O}
function pzSeaPx(X,Y,sh,nn,mm){const d=(Y-sh)/32,n=nn!==undefined?nn:hdVN(X,Y,26,13),r=hdr(X,Y);let t=Math.max(0,d)+(n-.5)*.9+(pzD(X,Y)-.5)*.5,R,G,B,u;
  if(t<1.2){u=Math.max(0,t)/1.2;R=118-52*u;G=206-36*u;B=196-16*u}else if(t<4.5){u=(t-1.2)/3.3;R=66-28*u;G=170-42*u;B=180-20*u}else{u=Math.min(1,(t-4.5)/8);R=38-12*u;G=128-36*u;B=160-26*u}
  let f=1;if(d<2.5&&Math.sin(X*.07+Math.sin(Y*.05)*3+Y*.3)>.9)f=1.08;
  const n2=mm!==undefined?mm:hdVN(X*.6,Y*1.8,18,4);if(n2>.72)f*=1.07+(n2-.72)*.4;else if(n2<.2)f*=.94;if(r>.985)f*=1.18;
  PZ_O[0]=Math.min(255,R*f);PZ_O[1]=Math.min(255,G*f);PZ_O[2]=Math.min(255,B*f);return PZ_O}
function pzPavePx(X,Y){const row=Math.floor(Y/6),ox=(row&1)*6,bx=Math.floor((X+ox)/12),mx=(X+ox)%12,my=Y%6;const r=hdr(X,Y),h=hsh(bx,row);
  const band=((Y>>5)===13);if(mx===0||my===0)return band?[150,140,128]:[146,116,100];
  let c=band?(h<.5?[214,204,184]:[200,190,170]):h<.4?[176,104,84]:h<.8?[190,122,96]:[206,184,152];const f=.93+hdVN(X,Y,30,6)*.1+(r-.5)*.04;c=hdS(c,f);if(my===1)c=hdS(c,1.06);if(my===5||mx===11)c=hdS(c,.92);
  const w=hdVN(X,Y,70,9);if(w>.7)c=hdMix(c,[160,146,128],.3*(w-.7)/.3+.1);if(r>.985)c=hdS(c,.84);return c}
function pzMudPx(X,Y){const n=hdVN(X,Y,24,17),r=hdr(X,Y);let c=[92+n*16,80+n*12,62+n*8];if(hdVN(X,Y,50,21)>.7)c=hdMix(c,[64,86,86],.55);if(r>.95)c=hdS(c,1.15);if(r<.04)c=[56,46,36];return c}
function pzGrassPx(X,Y){const n=hdVN(X,Y,22,7)*.6+hdVN(X,Y,7,3)*.4,r=hdr(X,Y);let c=hdMix([58,96,52],[118,150,70],n);if(r>.95)c=hdS(c,1.18);if(r<.06)c=hdS(c,.78);return c}
function pzRock(b,cx,cy,rx,ry,seed,wet){const base=hdMix([126,112,98],[104,98,100],hsh(seed,1));
  hdEll(b,cx+3,cy+ry*.55,rx+2,ry*.5,[20,30,40],.3);
  for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const u=(x+.5-cx)/rx,v=(y+.5-cy)/ry,dd=u*u+v*v+hdVN(x,y,6,seed)*.35-.17;if(dd>1)continue;
    const lit=-(u*.8+v*.6);let f=lit>.35?1.22:lit>.05?1.06:lit>-.35?.9:.72;if(dd>.82)f*=.86;let c=hdS(base,f);if(lit<-.35)c=hdMix(c,[70,72,104],.25);else if(lit>.35)c=hdMix(c,[236,206,160],.12);
    const r=hdr(x,y);if(r>.975)c=hdS(c,1.08);else if(r<.02)c=hdS(c,.86);const cr=hdVN(x,y,5,seed+9);if(cr>.8&&lit<.3)c=hdS(c,.78);if(wet&&v>.25)c=hdMix(c,[52,58,62],.45*(v-.25)/.75);if(wet&&v>.55&&hsh(x*3+seed,y)<.05)c=[200,196,180];hdP(b,x,y,c)}
  hdP(b,cx-rx*.35,cy-ry*.45,[236,226,206]);hdP(b,cx-rx*.35+1,cy-ry*.45,[214,204,186])}
function pzWood(b,x,y,w,h,base,vert){const R=hdRamp(base,6);for(let j=0;j<h;j++)for(let i=0;i<w;i++){const gr=vert?Math.sin((x+i)*.9+hdVN(x+i,y+j,8,3)*4):Math.sin((y+j)*.9+hdVN(x+i,y+j,8,3)*4);let k=3+(gr>.6?1:gr<-.7?-1:0);if(hdr(x+i,y+j)>.94)k++;hdP(b,x+i,y+j,R[Math.max(0,Math.min(5,k))])}}
function pzLog(b,X,Y,W){hdEll(b,X+W/2+4,Y+18,W/2+4,5,[20,24,30],.35);
  for(let i=0;i<W;i++)for(let j=0;j<14;j++){const v=(j-7)/7,lit=-v;let c=hdS([150,112,80],lit>.4?1.2:lit>-.1?1:lit>-.6?.8:.62);const g=Math.sin(i*.35+hdVN(X+i,Y+j,10,5)*5);if(g>.85)c=hdS(c,.82);if(hdr(X+i,Y+j)>.95)c=hdS(c,1.15);if(v<-.6)c=hdMix(c,[200,190,170],.25);hdP(b,X+i,Y+4+j,c)}
  for(const ex of[X,X+W-1])for(let j=0;j<14;j++){const rr=Math.abs(j-7);hdP(b,ex,Y+4+j,rr<2?[208,170,120]:rr<5?[188,150,104]:[150,112,80])}
  hdR(b,X+W*.3,Y+3,6,2,[110,86,60]);hdR(b,X+W*.6,Y+16,4,2,[90,70,50])}
function pzFacade(b,bx,bw,o,EM){const X=bx*HT,W=bw*HT,seed=bx*31+7,wall=o.wall,wc=hdC(wall),RH=24,FY=RH,GY=FY+52,BY=4*HT;
  if(o.zinc)hdRoofZinc(b,X,0,W,RH+4,o.roof,seed,o.painted);else hdCh_flatRoof(b,X,0,W,RH+4,o.roof,seed);
  if(!o.zinc){if(W>140)hdCh_tank(b,X+W-36,2);hdCh_ac(b,X+12+((hsh(seed,3)*(W-50))|0),4)}
  if(o.wood){for(let j=0;j<BY-FY;j++)for(let i=0;i<W;i++){const Y=FY+j,row=(j/6)|0;let f=.94+.1*Math.sin(((j%6)/6)*Math.PI)+(hdr(X+i,Y)-.5)*.05;if(j%6===5)f=.7;hdP(b,X+i,Y,hdS(wc,f))}
    for(let i=0;i<W;i+=48)hdR(b,X+i,FY,3,BY-FY,hdS(wc,.82))}
  else hdPlaster(b,X,FY,W,BY-FY,wall,seed);
  hdR(b,X,FY,W,5,hdS(wc,1.14));hdR(b,X,FY+5,W,2,hdS(wc,.7));hdShadeBand(b,X,FY+7,W,6,.22,.02);hdShadeBand(b,X+W-6,FY,6,BY-FY,0,.2);
  // segundo piso: ventanas, balcones de madera o hierro
  const nw=Math.max(1,Math.floor(W/56));for(let i=0;i<nw;i++){const wx=X+(W/nw)*(i+.5)-10;const r=hdWindow(b,wx,FY+12,20,18,{frame:o.frame||'#f2ead8',style:'vidrio',curtain:i%2?'#c9b58f':o.curt||'#9fb79a',noDrip:1});EM.push({k:'win',x:r.x,y:r.y,w:r.w,h:r.h});if(o.balc)hdBalcony(b,wx-3,FY+35,26)}
  // planta baja: toldo, rótulo, vitrina y puerta
  if(o.sign)hdSurSign(b,X+8,GY-14,W-16,12,o.signBg||'#1e1a24',o.sign,o.signFg||'#f2c94c');
  hdCh_awning(b,X+4,GY,W-8,9,o.aw1||'#d6453c',o.aw2||'#f2ede0',seed);hdShadeBand(b,X+4,GY+12,W-8,8,.32,.04);
  const dw=26,dx=X+(o.doorL?14:W-dw-14);hdDoor(b,dx,GY+16,dw,BY-GY-20,o.door||'#6b4a2b',o.metal?'metal':'');
  const vx=o.doorL?dx+dw+12:X+12,vw=W-dw-40;if(vw>20){hdCh_win(b,vx,GY+18,vw,22,{frame:'#2a2a30',mull:true});EM.push({k:'shop',x:vx,y:GY+18,w:vw,h:22})}
  if(o.pot)hdPlantPot(b,X+W-12,BY-4,true);if(o.lamp)hdLamp(b,dx-8,GY+20);
  hdR(b,X,BY-3,W,3,hdS(wc,.55))}
function pzChinamo(b,o,EM){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,c=hdC(o.col);
  hdEll(b,X+W/2+6,Y+H+2,W/2+6,6,[20,20,30],.3);
  pzWood(b,X+6,Y+18,W-12,H-24,'#8a6a4a',true);hdR(b,X+4,Y+H-24,W-8,18,[240,234,220]);hdR(b,X+4,Y+H-24,W-8,2,[255,252,244]);hdR(b,X+4,Y+H-8,W-8,2,hdS(c,.7));
  for(let i=0;i<W-8;i++)hdP(b,X+4+i,Y+H-14,((i/6)|0)%2?c:hdC(o.col2));
  // mercadería en el mostrador
  const g=o.goods;for(let i=0;i<5;i++){const gx=X+14+i*((W-28)/4);
    if(g==='pipa'){hdEll(b,gx,Y+H-28,5,5,[96,150,62]);hdEll(b,gx-1,Y+H-29,3,2,[140,190,90])}
    else if(g==='ch'){hdR(b,gx-3,Y+H-34,7,9,[236,236,240]);hdEll(b,gx,Y+H-35,4,3,[[240,120,150],[250,240,200],[120,200,120],[240,200,80],[230,90,90]][i])}
    else if(g==='gran'){hdR(b,gx-3,Y+H-34,7,9,[226,240,246]);hdEll(b,gx,Y+H-35,4,3,[[220,60,70],[90,160,230],[250,200,60],[120,200,110],[240,140,60]][i])}
    else{hdR(b,gx-4,Y+H-32,8,7,[236,236,226]);hdEll(b,gx,Y+H-33,3,2,[[240,200,120],[220,90,80],[120,180,90],[240,220,200],[250,210,90]][i])}}
  hdSurSign(b,X+6,Y+4,W-12,12,'#1e1a24',o.txt,'#f2c94c');EM.push({k:'shop',x:X+8,y:Y+H-34,w:W-16,h:12})}
function pzChinamoTop(tg,o){const X=o.x*HT,W=o.w*HT,Y=o.y*HT,b=hdBuf(W+16,30),c=hdC(o.col),c2=hdC(o.col2);
  for(let y=0;y<22;y++)for(let x=0;x<W+16;x++){const st=((x/10)|0)%2,f=1.1-.24*y/22;hdP(b,x,y,hdS(st?c2:c,f))}
  for(let x=0;x<W+16;x++){const st=((x/10)|0)%2,L=3+Math.round(3*Math.sin(((x%10)/10)*Math.PI));for(let j=0;j<L;j++)hdP(b,x,22+j,hdS(st?c2:c,.9-j*.05))}
  hdR(b,0,0,W+16,2,hdS(c,.55));tg.drawImage(hdToCanvas(b),X-8,Y-14)}
function pzLetras(b,o){const L='PUNTARENAS',cs=[[214,69,60],[242,201,76],[42,111,176],[79,179,122],[239,111,138]],X=o.x*HT+6,Y=o.y*HT-18;
  for(let i=0;i<L.length;i++){const lx=X+i*28,c=cs[i%5];hdEll(b,lx+16,Y+44,16,5,[20,20,30],.3);
    hdR(b,lx+3,Y+6,24,34,hdS(c,.62));hdR(b,lx,Y+2,24,34,hdS(c,.85));hdR(b,lx+2,Y+4,20,30,c);hdR(b,lx+2,Y+4,20,2,hdS(c,1.25));hdR(b,lx+2,Y+4,2,30,hdS(c,1.12));
    hdTextS(b,lx+7,Y+11,L[i],[255,255,255],2,hdS(c,.55))}}
function pzSombrilla(tg,b,o){const cx=o.x*HT+16,cy=o.y*HT+4,c=hdC(o.c);
  // en el suelo: sombra, toalla y palo
  hdEll(b,cx+12,cy+30,24,9,[40,40,60],.22);const tw=[[230,90,90],[60,140,200],[240,200,70],[240,240,236]][(o.x+o.y)%4];hdR(b,cx-18,cy+24,22,12,tw);for(let i=0;i<22;i+=4)hdR(b,cx-18+i,cy+24,2,12,hdS(tw,.85));hdR(b,cx-1,cy+6,2,26,[150,150,156]);
  // la tela, arriba de la gente
  const sb=hdBuf(56,34);for(let y=0;y<30;y++)for(let x=0;x<56;x++){const u=(x-28)/27,v=(y-14)/14;if(u*u+v*v>1)continue;const a=Math.atan2(v,u),seg=Math.floor((a+Math.PI)/(Math.PI/5));let col=seg%2?c:[250,248,240];const lit=-(u*.7+v*.7);col=hdS(col,lit>.3?1.12:lit>-.3?1:.82);if(u*u+v*v>.86)col=hdS(col,.8);hdP(sb,x,y,col)}
  hdEll(sb,28,14,2,2,[90,90,96]);tg.drawImage(hdToCanvas(sb),cx-28,cy-10)}
function pzSalvavidas(b,tg,o){const X=o.x*HT,Y=o.y*HT;hdEll(b,X+20,Y+30,18,6,[30,30,50],.25);for(const lx of[X+4,X+26])hdR(b,lx,Y-10,3,38,[236,236,232]);hdR(b,X+4,Y+10,25,3,[214,69,60]);
  const s=hdBuf(40,30);hdR(s,4,8,32,6,[240,236,228]);hdR(s,4,14,32,3,[214,69,60]);hdR(s,6,0,4,10,[236,236,232]);hdR(s,30,0,4,10,[236,236,232]);hdR(s,2,-2,36,3,[214,69,60]);hdText(s,9,18,'CRUZ',[214,69,60]);tg.drawImage(hdToCanvas(s),X-4,Y-30)}
function pzBananaPaint(b,o){const X=o.x*HT,Y=o.y*HT;hdEll(b,X+48,Y+26,50,7,[30,40,50],.25);
  for(let i=0;i<92;i++){const t=i/91,r=10-Math.abs(t-.5)*8;for(let j=-r;j<=r;j++){const v=j/r,lit=-v;hdP(b,X+4+i,Y+16+j,hdS([246,206,48],lit>.4?1.15:lit>-.3?1:.78))}}
  hdEll(b,X+96,Y+12,7,6,[246,206,48]);hdEll(b,X+97,Y+11,3,2,[255,240,150]);for(const sx of[24,44,64,84]){hdR(b,X+sx,Y+5,3,6,[40,40,46]);hdR(b,X+sx-3,Y+4,9,2,[60,60,66])}hdR(b,X+4,Y+20,90,2,[200,150,30])}
function pzCastillo(b,o){const X=o.x*HT,Y=o.y*HT;hdEll(b,X+18,Y+26,18,5,[60,50,40],.25);for(const[dx,h]of[[2,12],[12,18],[24,12]]){hdR(b,X+dx,Y+24-h,9,h,[214,184,130]);hdR(b,X+dx,Y+24-h,9,2,[236,212,160]);hdR(b,X+dx+7,Y+24-h,2,h,[186,156,108]);for(let k=0;k<9;k+=3)hdR(b,X+dx+k,Y+22-h,2,2,[214,184,130])}hdR(b,X+15,Y+2,1,6,[90,70,50]);hdR(b,X+16,Y+2,5,3,[214,69,60])}
function pzBanca(b,o){hdBench(b,o.x*HT,o.y*HT)}
function pzFarolTop(tg,x,y,side){const b=hdBuf(26,96);hdR(b,11,14,4,82,[48,52,58]);hdR(b,11,14,1,82,[90,96,104]);hdR(b,9,90,8,4,[40,42,48]);
  hdR(b,4,10,18,3,[48,52,58]);for(const lx of[4,18]){hdR(b,lx-2,12,6,7,[40,42,48]);hdR(b,lx-1,13,4,5,[255,232,170])}hdEll(b,13,8,4,3,[48,52,58]);
  const X=x*HT+(side===1?2:side===2?22:16)-13,Y=y*HT+(side?8:12)-90;tg.drawImage(hdToCanvas(b),X,Y)}
function hdPlaya(m){const W=m.w*HT,H=m.h*HT,b=hdBuf(W,H),EM=m.hdEmit=[],t0=performance.now();
  // suelo por píxel
  const d=b.d,SHA=new Float32Array(W);for(let X=0;X<W;X++)SHA[X]=pzShoreH(X);PZ.tm={};let tq=performance.now();
  // ruido suave por fila, muestreado cada 4 píxeles e interpolado (es lo que más costaba)
  const NS=new Float32Array(W),NA=new Float32Array(W),NB=new Float32Array(W);
  const rowN=(arr,f)=>{let p=f(0);for(let X=0;X<W;X+=4){const q=f(Math.min(W-1,X+4));for(let i=0;i<4&&X+i<W;i++)arr[X+i]=p+(q-p)*i/4;p=q}};
  for(let Y=0;Y<H;Y++){const ty=Y>>5;if(ty>=16){rowN(NS,X=>hdVN(X,Y,40,3));rowN(NA,X=>hdVN(X,Y,26,13));rowN(NB,X=>hdVN(X*.6,Y*1.8,18,4))}
    for(let X=0;X<W;X++){const tx=X>>5,k=PZ.g[ty*PZW+tx],sh=SHA[X];if(k===8)continue;let c;
      if(k===3||k===4||k===0&&ty>=17&&tx>15&&tx<112){c=Y>sh?pzSeaPx(X,Y,sh,NA[X],NB[X]):pzSandPx(X,Y,sh,NS[X])}
      else if(k===1)c=hdAsphPx(X,Y);
      else if(k===2)c=ty<6?hdSidePx(X,Y):pzPavePx(X,Y);
      else if(k===7||k===10){c=Y>sh-10?pzSeaPx(X,Y,sh-20):pzMudPx(X,Y);if(k===10&&Y<sh-10)c=hdMix(c,[150,126,96],.35)}
      else if(k===12)c=pzGrassPx(X,Y);
      else if(k===6||k===13)c=Y>sh?pzSeaPx(X,Y,sh):pzSandPx(X,Y,sh+40);
      else if(k===9||k===11)c=[180,176,166];
      else c=ty>=17?(Y>sh?pzSeaPx(X,Y,sh):pzSandPx(X,Y,sh)):ty>=11?pzPavePx(X,Y):[120,116,110];
      const i=(Y*W+X)<<2;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255}}
  PZ.tm.suelo=Math.round(performance.now()-tq);tq=performance.now();
  // calle: cordones, rayas, zebras
  hdR(b,0,6*HT,W,3,[150,146,138]);hdR(b,0,6*HT-2,W,2,[204,200,190]);hdR(b,0,11*HT-3,W,3,[150,146,138]);hdR(b,0,11*HT,W,2,[214,210,200]);
  for(let x=0;x<W;x++){if(((x/24)|0)%2===0){hdP(b,x,8*HT+14,[232,196,70]);hdP(b,x,8*HT+15,[214,176,56])}hdP(b,x,6*HT+8,[226,224,214],.6);hdP(b,x,11*HT-9,[226,224,214],.6)}
  for(const zx of[30,63,100])for(let i=0;i<2*HT;i+=8)hdR(b,zx*HT+i,6*HT+5,5,5*HT-10,[232,230,222],.88);
  for(const sx of[38,74])hdR(b,sx*HT,0,3*HT,4*HT,[0,0,0],0);
  // muro del bulevar y gradas
  for(let X=16*HT;X<112*HT;X++){const Y0=16*HT;const tx=X>>5;if(PZ_STAIRS.some(s=>tx===s||tx===s+1))continue;for(let j=0;j<32;j++){let c;if(j<9){c=hdS([206,202,190],1+(hdr(X,Y0+j)-.5)*.08);if(j===0)c=[232,228,218]}else{c=hdS([150,146,138],.92+hdVN(X,Y0+j,14,2)*.14);if(j>24)c=hdMix(c,[90,110,84],(j-24)/10);if(((X>>4)+(j>>3))%7===0&&hdr(X,j)>.6)c=hdS(c,.88)}hdP(b,X,Y0+j,c)}}
  for(const s of PZ_STAIRS){const X0=s*HT,Y0=16*HT;for(let k=0;k<4;k++){hdR(b,X0,Y0+k*8,2*HT,6,[214,210,198]);hdR(b,X0,Y0+k*8+6,2*HT,2,[150,146,136])}hdR(b,X0-3,Y0-8,3,40,[170,166,156]);hdR(b,X0+2*HT,Y0-8,3,40,[170,166,156])}
  for(const ex of[16*HT-4,112*HT]){hdR(b,ex,11*HT,4,6*HT,[176,170,158]);hdR(b,ex,11*HT,1,6*HT,[214,208,196])}   // remates del bulevar
  // fachadas del puerto
  const FAC=[[0,5,{wall:'#f2d46a',roof:'#9a9a96',zinc:1,wood:1,sign:'SODA EL PUERTO',aw1:'#2a8f6a'}],[5,7,{wall:'#9fd0e0',roof:'#c9c4b8',balc:1,sign:'HOTEL BRISAS DEL GOLFO',signBg:'#2a4f7a',signFg:'#ffffff',aw1:'#2a6fb0',doorL:1,lamp:1}],
    [12,6,{wall:'#f0ece0',roof:'#a8a49c',sign:'SUPER EL FARO',aw1:'#c0473b',metal:1}],[18,5,{wall:'#8fc49a',roof:'#a03c2c',zinc:1,painted:1,wood:1,curt:'#f2c94c',pot:1}],
    [23,8,{wall:'#f6b28a',roof:'#c9c4b8',balc:1,sign:'MARISQUERÍA EL PELÍCANO',aw1:'#2a6fb0',aw2:'#f6efe2',lamp:1}],[31,7,{wall:'#4a6f9a',roof:'#8a8a86',zinc:1,sign:'BAR LA DERIVA',signBg:'#2a1e16',signFg:'#ffb860',aw1:'#1e3a5a',aw2:'#d6c6a0',doorL:1,lamp:1}],
    [41,6,{wall:'#f6d8e2',roof:'#bcb6aa',sign:'HELADOS',aw1:'#e85d9a',pot:1}],[47,8,{wall:'#e8e2d0',roof:'#c0bab0',balc:1,sign:'HOTEL TIERRA DEL MAR',signBg:'#7a3a2a',signFg:'#fff0d0',aw1:'#7a3a2a',doorL:1}],
    [55,5,{wall:'#c6e0a8',roof:'#9a9a96',zinc:1,wood:1,curt:'#e85d75'}],[60,7,{wall:'#ffd9a0',roof:'#b0aaa0',sign:'SODA LA ABUELA',aw1:'#d6453c',lamp:1}],[67,7,{wall:'#a8c8e8',roof:'#9a9a96',zinc:1,sign:'ALQUILER DE BICIS',aw1:'#2a8f6a',metal:1}],
    [77,6,{wall:'#f4f0e4',roof:'#bcb6aa',sign:'FARMACIA',signBg:'#2a8f6a',signFg:'#ffffff',aw1:'#2a8f6a'}],[83,8,{wall:'#e9b4d0',roof:'#c0bab0',balc:1,sign:'CABINAS LA CONCHA',aw1:'#9a4a8a',doorL:1}],
    [91,6,{wall:'#f2d46a',roof:'#a03c2c',zinc:1,painted:1,wood:1,sign:'PESCADERÍA',aw1:'#2a6fb0'}],[97,9,{wall:'#bfe4dc',roof:'#c0bab0',balc:1,sign:'HOTEL EL MUELLE',signBg:'#1e4a5a',signFg:'#ffffff',aw1:'#1e4a5a',lamp:1}],
    [106,6,{wall:'#f0a070',roof:'#9a9a96',zinc:1,sign:'RESTAURANTE',aw1:'#c0473b'}],[112,8,{wall:'#e8e4d6',roof:'#a8a49c',sign:'MINISÚPER',aw1:'#2a6fb0',metal:1}],[120,8,{wall:'#9ad0b0',roof:'#a03c2c',zinc:1,painted:1,wood:1,pot:1}]];
  for(const[x,w,o]of FAC)pzFacade(b,x,w,o,EM);
  for(const sx of[38,74]){const X=sx*HT;for(let Y=0;Y<4*HT;Y++)for(let x=0;x<3*HT;x++)hdP(b,X+x,Y,hdAsphPx(X+x,Y));hdShadeBand(b,X,0,3*HT,4*HT,.25,0);hdR(b,X,0,4,4*HT,[150,146,138]);hdR(b,X+3*HT-4,0,4,4*HT,[150,146,138])}
  // manglar: raíces zancudas en el borde y en el trillo
  for(let n=0;n<420;n++){const x=hsh(n,3)*16*HT,y=11*HT+hsh(3,n)*22*HT;const tx=x>>5,ty=y>>5;if(pzK(tx,ty)!==7)continue;for(let a=0;a<4;a++){const ang=Math.PI*(.15+.7*hsh(n,a)),L=8+hsh(a,n)*10;for(let t=0;t<L;t++){const px=x+Math.cos(ang)*t*(a%2?1:-1),py=y+Math.sin(ang)*t*.6-Math.sin(t/L*Math.PI)*6;hdP(b,px,py,t<2?[60,46,34]:[96,74,52])}}}
  // piedras: la punta del este, el pie del muelle y unas sueltas
  for(let n=0;n<80;n++){const x=112*HT+hsh(n,5)*4*HT,y=11*HT+hsh(5,n)*25*HT,tx=x>>5,ty=y>>5;if(pzK(tx,ty)!==6)continue;pzRock(b,x,y,14+hsh(n,7)*14,10+hsh(n,8)*8,n,y>pzShoreH(x)-20)}
  for(const[x,y]of PZ_ROCKPATH){const X=x*HT,Y=y*HT;hdEll(b,X+16,Y+18,15,11,[166,158,146]);hdEll(b,X+14,Y+15,12,8,[190,182,168]);hdEll(b,X+11,Y+13,5,3,[214,206,192])}
  for(let n=0;n<30;n++){const x=127*HT+hsh(n,9)*30,y=17*HT+n*16;pzRock(b,x,y,16,12,n+300,y>pzShoreH(x)-20)}
  for(const[x,y]of[[18,29],[58,31],[110,30],[87,31]])pzRock(b,x*HT,y*HT,10,7,x,1);
  // detalles de la arena: algas, conchas, cocos, huellas
  for(let x=17*HT;x<126*HT;x+=3){const s=pzShoreH(x),y=s-34-Math.sin(x/90)*8;if(hsh(x,1)<.4){hdP(b,x,y,[72,86,52]);hdP(b,x+1,y+1,[96,104,60])}}
  for(let n=0;n<260;n++){const x=17*HT+hsh(n,11)*109*HT,s=pzShoreH(x),y=17*HT+12+hsh(11,n)*(s-17*HT-20);const tx=x>>5,ty=y>>5;if(pzK(tx,ty)!==3)continue;const k=hsh(n,12);
    if(k<.5){hdP(b,x,y,[248,236,226]);hdP(b,x+1,y,[230,200,190]);hdP(b,x,y+1,[210,180,170])}else if(k<.7){hdEll(b,x,y,2,1.4,[236,220,204]);hdP(b,x,y,[250,240,230])}else if(k<.78){hdEll(b,x+1,y+3,5,2,[60,50,40],.3);hdEll(b,x,y,4,4,[120,88,52]);hdEll(b,x-1,y-1,2,2,[150,116,74])}else if(k<.86){hdLine(b,x,y,x+10,y+2,[150,120,86],1,2)}}
  for(let p=0;p<14;p++){let x=20*HT+hsh(p,21)*100*HT,y=17*HT+20;const dx=(hsh(p,22)-.5)*1.2;for(let s=0;s<40;s++){x+=dx*8+(s%2?4:-4);y+=12;if(y>pzShoreH(x)-12)break;if(pzK(x>>5,y>>5)!==3)continue;hdEll(b,x,y,1.6,2.4,[196,170,126],.8);hdP(b,x,y-1,[176,150,110],.6)}}
  // el muelle: tablones, barandas y pilotes
  const PX=PZ_PIER.x0*HT,PW=(PZ_PIER.x1-PZ_PIER.x0+1)*HT,PY0=16*HT-4,PY1=(PZ_PIER.y1+1)*HT;
  // debajo del muelle: sombra fresca y pilotes (el tablado de encima se dibuja aparte, ver pzDeckDraw)
  hdM(b,PX,16*HT,PW,(PZ_BOYA-16)*HT,[.62,.64,.74]);for(let y=17*HT;y<PZ_BOYA*HT;y+=3*HT)for(const px of[PX+2,PX+PW-8]){const w=y>pzShoreH(px);hdEll(b,px+3,y+14,5,3,[0,0,0],.3);hdR(b,px,y-8,6,22,w?[70,62,52]:[96,78,58]);hdR(b,px,y-8,2,22,[130,108,80]);if(w)hdEll(b,px+3,y+14,6,2,[220,240,240],.5)}
  for(const o of m.objs)if(o.type==='tronco'&&o.under)pzLog(b,o.x*HT+4,o.y*HT,o.w*HT-8);
  pzDeck(b,PX,PZ_BOYA*HT,PW,PY1-PZ_BOYA*HT);pzDeck(b,PZ_PIER.tx0*HT,PZ_PIER.ty0*HT,(PZ_PIER.tx1-PZ_PIER.tx0+1)*HT,3*HT);
  // objetos
  for(const o of m.objs){if(o.type==='chinamo')pzChinamo(b,o,EM);else if(o.type==='letras')pzLetras(b,o);else if(o.type==='banca')pzBanca(b,o);else if(o.type==='banana')pzBananaPaint(b,o);else if(o.type==='castillo')pzCastillo(b,o);
    else if(o.type==='tronco'&&!o.under)pzLog(b,o.x*HT,o.y*HT,o.w*HT-8);else if(typeof pzProp==='function'&&pzProp(b,o)){}else if(o.type==='ruedas'){const X=o.x*HT,Y=o.y*HT;hdEll(b,X+16,Y+20,12,4,[40,40,50],.25);for(let k=0;k<3;k++){hdEll(b,X+10+k*6,Y+16-k*2,7,5,[30,30,34]);hdEll(b,X+10+k*6,Y+15-k*2,4,2.4,[90,90,96])}}}
  for(const[x,y]of m.almendros)if(y<16){const X=x*HT-4,Y=y*HT+2;hdEll(b,X+24,Y+30,22,5,[20,20,30],.25);hdR(b,X,Y,40,30,[176,170,158]);hdR(b,X,Y,40,3,[214,208,196]);hdR(b,X,Y+24,40,6,[140,134,124]);hdR(b,X+38,Y,2,30,[150,144,134]);
    for(let j=4;j<24;j++)for(let i=3;i<37;i++){const n=hdVN(X+i,Y+j,6,x);hdP(b,X+i,Y+j,n>.62?hdS([70,110,50],.9+hdr(X+i,Y+j)*.3):[84,64,46].map(v=>v*(.9+hdr(X+i,Y+j)*.2)))}
    for(let k=0;k<6;k++){const fx=X+6+hsh(k,x)*28,fy=Y+6+hsh(x,k)*14;hdP(b,fx,fy,[236,96,120]);hdP(b,fx+1,fy,[250,140,160])}}
  PZ.tm.detalles=Math.round(performance.now()-tq);tq=performance.now();
  // capa de arriba (la copa del manglar se pinta en un búfer del tamaño del manglar, no del mapa)
  const top=mk(W,H),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;const tb=hdBuf(18*HT,36*HT);
  // copa del manglar: racimos de hojas con luz de arriba a la izquierda; se abre en el trillo y en el claro
  const MG=[[18,38,28],[26,52,32],[34,68,38],[46,88,44],[64,110,52],[88,134,62],[118,158,76]];
  const open=(tx,ty)=>{const k=pzK(tx,ty);return k===10};
  for(let gy=10*HT;gy<36*HT;gy+=5)for(let gx=-8;gx<17*HT+10;gx+=5){const jx=gx+(hsh(gx,gy)*6|0)-3,jy=gy+(hsh(gy,gx)*6|0)-3;const tx=jx>>5,ty=jy>>5;
    const k=pzK(Math.max(0,tx),ty);if(k!==7&&!(tx>=16&&tx<=16&&ty>=11&&ty<33&&!open(15,ty)&&hsh(gx,gy*3)<.45))continue;
    const sh=pzShoreH(jx);if(jy>sh+22)continue;
    // cerca del trillo o el claro solo se ponen racimos en el borde
    let nearOpen=99;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(tx+dx,ty+dy)){const cx=(tx+dx)*HT+16,cy=(ty+dy)*HT+16;nearOpen=Math.min(nearOpen,Math.max(Math.abs(jx-cx),jy<cy?Math.abs(jy-cy)*.62:Math.abs(jy-cy)))}
    if(nearOpen<16+hsh(jx,jy)*8)continue;
    const r=4+hsh(jx*3,jy)*4;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const dd=(x*x+y*y)/(r*r);if(dd>1)continue;const lit=-(x+y)/(2*r)+(hdVN(jx,jy,40,31)-.5)*.6;
      let kk=Math.round(3+lit*3.2+(hsh(jx+x,jy+y)-.5)*.9);if(dd>.7&&y>0)kk-=1;hdP(tb,jx+x,jy+y,MG[Math.max(0,Math.min(6,kk))])}}
  for(let n=0;n<160;n++){const x=hsh(n,71)*16*HT,y=11*HT+hsh(71,n)*21*HT;if(pzK(x>>5,y>>5)!==7)continue;hdP(tb,x,y,[150,170,80]);hdP(tb,x+1,y,[120,150,70])}   // hojas nuevas
  tg.drawImage(hdToCanvas(tb),0,0);
  // monte al este
  {const eb=hdBuf(13*HT,7*HT);for(let n=0;n<30;n++){const x=hsh(n,51)*12*HT+16,y=10+hsh(51,n)*5*HT;hdBush(eb,x,y,n,hsh(n,52)<.3)}tg.drawImage(hdToCanvas(eb),115*HT,11*HT-10)}
  PZ.tm.manglar=Math.round(performance.now()-tq);tq=performance.now();
  for(const o of m.objs){if(o.type==='chinamo')pzChinamoTop(tg,o);else if(o.type==='sombrilla')pzSombrilla(tg,b,o);else if(o.type==='salvavidas')pzSalvavidas(b,tg,o)}
  for(const[x,y]of m.almendros){const sp=hdTreeSprite(x*7+y*3,y<16?1:0,y<16?.78:.66,false);tg.drawImage(hdToCanvas(sp.c),x*HT+16-sp.ax,y*HT+30-sp.ay)}
  for(const[x,y]of m.palms){const sp=hdPalmSprite(x*13+y);tg.drawImage(hdToCanvas(sp.c),x*HT+16-sp.ax,y*HT+30-sp.ay)}
  for(const[x,y,s]of m.faroles)pzFarolTop(tg,x,y,s);
  // el muelle por debajo: lo que tapa al que se mete debajo (se dibuja aparte, solo cuando hace falta)
  PZ.deckImg=pzDeckImg();
  PZ.tm.arriba=Math.round(performance.now()-tq);tq=performance.now();const base=hdToCanvas(b);PZ.tm.subir=Math.round(performance.now()-tq);m.hdMs=Math.round(performance.now()-t0);return{base,top}}
function pzDeck(b,X,Y,W,H){hdR(b,X+W,Y+6,10,H,[10,30,50],.28);
  for(let y=0;y<H;y++){const row=(y/7)|0,gap=y%7===6;for(let x=0;x<W;x++){const wx=X+x,wy=Y+y;if(gap){hdP(b,wx,wy,[60,46,34]);continue}const h=hsh(row,(x/48)|0);
      let c=hdS(h<.33?[164,122,84]:h<.66?[150,110,76]:[176,134,94],.94+hdVN(wx,wy,12,row)*.1+(y%7===0?.08:0));if(hdr(wx,wy)>.96)c=hdS(c,.82);if((x%48)===0&&y%7<6)c=hdS(c,.7);hdP(b,wx,wy,c)}}
  for(const ex of[X,X+W-4]){hdR(b,ex,Y,4,H,[120,88,58]);hdR(b,ex,Y,1,H,[176,138,96]);for(let y=Y;y<Y+H;y+=32){hdR(b,ex,y,4,6,[96,70,46]);hdR(b,ex+1,y,2,2,[200,170,120])}}}
function pzDeckImg(){const W=(PZ_PIER.x1-PZ_PIER.x0+1)*HT+8,H=(PZ_BOYA-16)*HT+4,b=hdBuf(W,H);pzDeck(b,4,0,W-8,H);
  for(let y=6;y<H;y+=32)for(let x=0;x<W;x+=8)if(x<10||x>W-12)hdR(b,x,y-6,2,10,[90,66,44]);   // baranda
  return hdToCanvas(b)}
// ---------------------------------------------------------------- caminar, nadar, el muelle por arriba y por debajo
// El jugador tiene dos niveles cerca del muelle: arriba del tablado (P.deck) o abajo, en la arena o nadando.
// Del bulevar (fila ≤ 15) se sube al muelle; por las gradas del muro se baja a la playa.
var PZ_MOVER=null;
function pzWater(tx,ty){return pzK(tx,ty)===4}
function pzPileHit(x,y){if(x<PZ_PIER.x0*T-4||x>(PZ_PIER.x1+1)*T+4||y<17*T-8||y>PZ_BOYA*T)return false;for(let py=17*T;py<PZ_BOYA*T;py+=3*T)for(const px of[PZ_PIER.x0*T+1,(PZ_PIER.x1+1)*T-4])if(x>px-1&&x<px+4&&y>py-3&&y<py+5)return true;return false}
function pzBlockedP(x,y){const tx=Math.floor(x/T),ty=Math.floor(y/T);if(tx<0||ty<0||tx>=PZW||ty>=PZH)return true;const k=pzK(tx,ty);
  const v=typeof riding==='function'&&riding();if(v)return!(k===1||k===2);
  if(ty>=16&&pzInPier(tx,ty)){if(P.deck)return false;if(ty===16)return true;if(ty>=PZ_BOYA)return true;return pzPileHit(x,y)}
  if(P.deck&&ty>=16&&k!==11)return true;
  if(k===4)return ty>=PZ_BOYA;
  return!(k===1||k===2||k===3||k===10||k===11||k===13)}
{const _fb=feetBlocked;feetBlocked=function(m,x,y){if(PZ_MOVER===P&&m&&m.id==='playa'&&PZ.k){return pzBlockedP(x-5,y-4)||pzBlockedP(x+5,y-4)||pzBlockedP(x-5,y-.5)||pzBlockedP(x+5,y-.5)}return _fb(m,x,y)}}
{const _mv=moveEnt;moveEnt=function(e,dx,dy){if(e!==P||P.map!=='playa')return _mv(e,dx,dy);if(P.swim){dx*=.5;dy*=.5}if(typeof pzDrunkMove==='function'){const r=pzDrunkMove(dx,dy);dx=r[0];dy=r[1]}
  PZ_MOVER=P;try{return _mv(e,dx,dy)}finally{PZ_MOVER=null}}}
function pzLevelTick(){const tx=Math.floor(P.x/T),ty=Math.floor((P.y-2)/T);if(ty<=15)P.deck=true;else if(pzK(tx,ty)===11)P.deck=false;else if(P.deck&&!pzInPier(tx,ty))P.deck=false;
  const sw=!P.deck&&!riding()&&P.y>pzShore(P.x)+5&&pzWater(tx,Math.floor(P.y/T));if(sw&&!P.swim){P.swimT=0;beep(240,.12,'sine',.03,120);if(!PZS().nado){PZS().nado=1;toast('🌊 ¡Al agua! Nadás más despacio. No pasés de las boyas.')}}P.swim=sw}
function PZS(){const p=PGS();if(!p.pz)p.pz={sec:{},nado:0};return p.pz}
// ---------------------------------------------------------------- el tránsito del Paseo de los Turistas
// Carros, taxis rojos, buses, motos, pickups y bicis. En el Paseo se va despacio: frenan por el que cruza, pitan y gritan.
var PZ_YELL=['¡Diay, mae! ¡La calle no es playa!','¡Fíjese, joven!','¡Upe! ¡Cuidado!','¡Póngase vivo, mae!','¡Ay, Dios! ¡Por poquito!'];
function pzNewCar(L,x){const r=Math.random(),type=r<.28?'car':r<.5?'taxi':r<.66?'moto':r<.78?'pickup':r<.9?'bus':'bici';const len=type==='bici'?16:VEH_LEN[type];
  const c={type,lane:L,x:x!=null?x:(L.dir>0?-len-20:PZW*T+20),len,v:{taxi:58,car:52,bus:40,moto:66,pickup:48,bici:30}[type]*rnd(.9,1.12),sp:0,col:pick(VEH_COL),hk:0,wait:0,wd:0,bob:rnd(0,6),yell:0};
  c.sp=c.v;if(type==='bus'){c.extra=pick(['PUNTARENAS','EL ROBLE','CHACARITA','BARRANCA','ESPARZA'])+'|'+pick(['#2a8f6a','#2a6fb0','#c0473b','#e2b33a']);c.col=pick(['#ecebe4','#f2f2ee','#e9e2cf'])}
  if(type==='pickup')c.extra=Math.random()<.5?'platano':'sacos';if(type==='moto')c.extra=pick(['#e07a2c','#2a8f6a','#c0473b','#f2c94c']);if(type==='bici')c.shirt=pick(['#d23038','#2e6fd1','#f2c94c','#f4f4f4','#2e9e6b']);return c}
function pzCarsInit(){PZ.cars=[];for(const L of PZ.lanes)for(let x=10;x<PZW*T;x+=rnd(260,520))PZ.cars.push(pzNewCar(L,x))}
function pzCarsTick(dt){const onRoad=mode==='play'&&P.y>6*T&&P.y<11*T+4;
  for(let i=0;i<2;i++){const L=PZ.lanes[i];PZ.carT[i]-=dt;if(PZ.carT[i]<=0){PZ.carT[i]=rnd(2.5,6);const near=PZ.cars.some(c=>c.lane===L&&(L.dir>0?c.x<60:c.x>PZW*T-80));if(!near&&PZ.cars.length<16)PZ.cars.push(pzNewCar(L))}}
  for(const c of PZ.cars){const L=c.lane,ly=L.y*T+10,front=L.dir>0?c.x+c.len:c.x;let stop=false;const inLane=onRoad&&Math.abs(P.y-ly)<12,d=(P.x-front)*L.dir;
    if(inLane&&d>-c.len&&d<56){stop=true;if(!c.hk&&d<40){c.hk=1;pzHonk(c);if(!c.yell){c.yell=1;pzBub(c,pick(PZ_YELL))}}}
    for(const o of PZ.cars){if(o===c||o.lane!==L)continue;const gap=L.dir>0?o.x-(c.x+c.len):c.x-(o.x+o.len);if(gap>-4&&gap<14){stop=true;break}}
    const pv=c.sp;c.sp=stop?Math.max(0,c.sp-220*dt):Math.min(c.v,c.sp+60*dt);c.brake=c.sp<pv-.5;c.x+=c.sp*L.dir*dt;c.wd+=c.sp*dt;c.bob+=dt*(4+c.sp*.05);
    if(!stop){c.wait=0;if(c.sp>c.v*.8){c.hk=0;c.yell=0}}else if(c.sp<1){c.wait+=dt;if(c.wait>3&&!c.hk2){c.hk2=1;pzHonk(c)}}
    if(inLane&&c.sp>12&&P.x>c.x-2&&P.x<c.x+c.len+2){P.y+=P.y<ly?-4:4;if(!c.bmp){c.bmp=1;pzBub(c,'¡Ey! ¡Casi me lo llevo, mae!');beep(160,.08,'square',.03)}}else c.bmp=0}
  PZ.cars=PZ.cars.filter(c=>c.x>-160&&c.x<PZW*T+160)}
function pzHonk(c){if(c.type==='bici'){beep(1800,.05,'triangle',.02);setTimeout(()=>beep(1800,.05,'triangle',.02),90);return}if(typeof honk==='function')honk(c)}
function pzBub(c,txt){if(BUBS.length>2)return;const L=c.lane;BUBS.push({car:c,e:{map:'playa',get x(){return c.x+c.len/2},get y(){return L.y*T+6}},txt,t:2.6})}
function pzBiciDraw(g,c){const L=c.lane,Yb=L.y*T+16,X=Math.round(c.x),fl=L.dir<0;g.save();if(fl){g.translate(X*2+c.len,0);g.scale(-1,1)}
  const k=Math.floor(c.wd/3)%2;g.fillStyle='rgba(0,0,0,.25)';g.fillRect(X+1,Yb-1,15,2);g.fillStyle='#1d1a24';for(const wx of[3,13]){g.beginPath();g.arc(X+wx,Yb-3.5,3,0,7);g.fill()}g.fillStyle='#8f8a80';for(const wx of[3,13])g.fillRect(X+wx-.5,Yb-4,1,1);
  g.fillStyle='#c0473b';g.fillRect(X+4,Yb-6,8,1);g.fillRect(X+8,Yb-9,1,4);g.fillStyle=c.shirt;g.fillRect(X+6,Yb-15,4,6);g.fillStyle='#2d3346';g.fillRect(X+6,Yb-9,3,2);g.fillRect(X+7+(k?1:0),Yb-7,1,3);g.fillStyle='#8d5524';g.fillRect(X+7,Yb-19,4,4);g.fillStyle='#1c1c1c';g.fillRect(X+7,Yb-19,4,1);g.fillStyle='#8d5524';g.fillRect(X+10,Yb-13,3,1);g.restore()}
function pzCarLights(){const h=S.t/60,night=h<5.8||h>18.2||S.rain;const out=[];if(!night)return out;for(const c of PZ.cars){if(c.type==='bici')continue;const fx=c.lane.dir>0?c.x+c.len:c.x;out.push({x:fx+c.lane.dir*14,y:c.lane.y*T+12,r:c.type==='moto'?26:38,car:1})}return out}
// ---------------------------------------------------------------- el mar vivo
// Se pinta encima del fondo, solo en lo que se ve: la orilla que sube y baja con espuma, la línea de reventazón,
// las ondas que vienen, destellos del sol (más hacia el oeste en la tarde), las boyas y las lanchas meciéndose.
function pzSeaT(){return(performance.now()/1000)}
function pzSwash(x,t){return 7+6*Math.sin(t*.85+x*.011+Math.sin(x*.0047)*2)+2*Math.sin(t*1.9+x*.05)}
function pzSea(g,cx,cy){const t=pzSeaT(),x0=Math.max(0,Math.floor(cx)-2),x1=Math.min(PZW*T,Math.ceil(cx+VW/Z)+2),y0=cy,y1=cy+VH/Z,h=S.t/60;
  const sun=hdSun(),amb=hdAmbient(h),lum=(amb[0]+amb[1]+amb[2])/3;
  // orilla
  for(let x=x0;x<x1;x+=1){if(x<16*T&&x>0){}const s=pzShore(x);if(s<y0-20||s>y1+30)continue;const tx=x>>4;if(tx<=15&&pzK(tx,Math.floor((s-6)/T))===7)continue;
    const r=pzSwash(x,t),r2=pzSwash(x,t-.6),top=s-r;
    g.fillStyle='rgba(150,120,86,.28)';g.fillRect(x,s-Math.max(r,r2)-3,1,Math.max(0,Math.max(r,r2)-r)+3);
    g.fillStyle='rgba(126,206,200,.55)';g.fillRect(x,top+1.5,1,r+2);
    const f=hsh(x,Math.floor(t*3))>.25;g.fillStyle=f?'rgba(250,252,246,.95)':'rgba(220,244,240,.8)';g.fillRect(x,top,1,1.5);if(hsh(x*3,Math.floor(t*2))>.6){g.fillStyle='rgba(255,255,255,.7)';g.fillRect(x,top+2,1,.5)}}
  // reventazón y ondas que vienen
  for(let k=0;k<6;k++){const ph=(t*.16+k/6)%1;for(let x=x0-(x0%2);x<x1;x+=2){const s=pzShore(x),y=s+8+(1-ph)*(28+k*10)+Math.sin(x*.03+k*2+t*.4)*2.2;if(y<y0||y>y1)continue;if(y>PZ_BOYA*T+60)continue;
      const n=Math.sin(x*.045+k*1.7+t*.5)+Math.sin(x*.013-k+t*.2);if(n<.5)continue;const a=(1-ph)*.55*(k<2?1:.6)*(n-.5);g.fillStyle='rgba(236,250,248,'+a.toFixed(2)+')';g.fillRect(x,y,2,.5)}}
  for(let k=0;k<7;k++){const yy=Math.floor(y0/24)*24+k*24+((t*6)%24);for(let x=x0-(x0%4);x<x1;x+=4){const s=pzShore(x);if(yy<s+40)continue;const n=Math.sin(x*.021+yy*.3+t*.7)+Math.sin(x*.057-yy+t*.3);if(n<1.1)continue;g.fillStyle='rgba(180,226,236,'+((n-1.1)*.3).toFixed(2)+')';g.fillRect(x,yy+Math.sin(x*.05+t)*1.5,4,.5)}}
  // destellos del sol
  if(sun&&sun.a>.02&&!S.rain){const late=h>14?Math.min(1,(h-14)/3.5):0,n=40+late*80;const fr=Math.floor(t*7);
    for(let i=0;i<n;i++){const u=hsh(i,fr),v=hsh(fr,i*3);let x=x0+u*(x1-x0);if(late>.2&&hsh(i,7)<late*.7)x=x0+(x1-x0)*(.55+.45*u);const y=y0+v*(y1-y0),s=pzShore(x);if(y<s+14)continue;
      const tx=x>>4,ty=y>>4;if(pzK(tx,ty)!==4&&!pzInPier(tx,ty))continue;g.fillStyle=late>.5?'rgba(255,226,160,.9)':'rgba(255,255,250,.9)';const L=1+hsh(i,i)*2.5;g.fillRect(x,y,L,.5);if(L>2.5)g.fillRect(x+L/2-.5,y-.5,.5,1.5)}}
  // boyas
  for(let bx=17*T;bx<112*T;bx+=6*T){if(bx<x0-10||bx>x1+10)continue;const by=PZ_BOYA*T+Math.sin(t*1.4+bx*.01)*1.2;if(by<y0-10||by>y1+10)continue;
    g.fillStyle='rgba(30,60,80,.35)';g.fillRect(bx-3,by+2,7,2);g.fillStyle='#e8622c';g.beginPath();g.arc(bx,by,3,0,7);g.fill();g.fillStyle='#ff9a5c';g.fillRect(bx-2,by-2,2,1);g.fillStyle='#f4f4f0';g.fillRect(bx-3,by,6,1);
    g.fillStyle='rgba(240,250,250,.55)';g.fillRect(bx-4+Math.sin(t*2+bx)*.5,by+3,8,.5);
    g.fillStyle='rgba(240,236,220,.45)';for(let k=4;k<6*T-4;k+=3)g.fillRect(bx+k,by+.5+Math.sin(t*1.4+(bx+k)*.01)*1.2,1.5,.5)}
  // el tablado del muelle (cuando no estás debajo)
  if(!pzUnder())pzDeckDraw(g,1)}
function pzUnder(){return P.map==='playa'&&!P.deck&&P.x>PZ_PIER.x0*T-10&&P.x<(PZ_PIER.x1+1)*T+10&&P.y>16*T&&P.y<PZ_BOYA*T+8}
function pzDeckDraw(g,a){if(!PZ.deckImg)return;g.save();g.globalAlpha=a;g.imageSmoothingEnabled=false;const img=PZ.deckImg;g.drawImage(img,PZ_PIER.x0*T-2,16*T-2,img.width/2,img.height/2);g.restore()}
// lanchas amarradas: se mecen y dejan una estela suave
var PZ_BOATC={};
function pzBoatImg(b){const k=b.name;if(PZ_BOATC[k])return PZ_BOATC[k];const W=b.w*HT+12,H=b.h*HT+16,s=hdBuf(W,H),hull=hdC(b.col),band=hdC(b.band),cy=Math.round(H*.42),HW=H*.3;
  const hw=x=>{const u=x/(W-4);return u<.04?HW*.9:u<.62?HW:HW*Math.pow(Math.max(0,(1-u)/.38),.75)};
  // costado del casco (vista 3/4): franja de color y blanco debajo de la borda
  for(let x=2;x<W-2;x++){const w=hw(x);if(w<.5)continue;const y0=Math.round(cy+w),hh=Math.max(2,Math.round(9*Math.min(1,w/HW*1.4)));for(let j=0;j<hh;j++){let c=j<3?band:hdS(hull,.92-j*.03);if(j===0)c=hdS(band,1.15);hdP(s,x,y0+j,c)}hdP(s,x,y0+hh,[20,40,60],.5)}
  for(let x=2;x<W-2;x++){const w=hw(x);for(let y=Math.floor(cy-w);y<=cy+w;y++){const e=Math.abs(y-cy)/Math.max(1,w);let c;
      if(e>.78||x<5)c=e>.9?hdS(hull,1.08):hdS(hull,.86);else{c=((y+200)%5===0)?[122,92,64]:[150,116,82];if(hdr(x,y)>.9)c=hdS(c,.9)}hdP(s,x,y,c)}}
  for(let x=W*.18;x<W*.58;x+=W*.13)hdR(s,x,cy-HW+5,4,HW*2-10,[200,190,170]);                          // bancas
  hdR(s,0,cy-6,8,12,[56,58,64]);hdR(s,0,cy-6,8,2,[110,112,118]);hdR(s,2,cy+5,3,7,[40,40,44]);          // motor
  if(b.big){hdR(s,W*.22,cy-HW-6,W*.36,4,[236,236,230]);for(const px of[W*.22,W*.58-2])hdR(s,px,cy-HW-4,2,HW*2+2,[210,210,206]);hdR(s,W*.22,cy-HW-6,W*.36,1,hdS(band,1.2))}  // toldo
  if(b.ban){hdR(s,W*.62,cy-2,10,4,[240,200,60])}
  hdText(s,10,cy+HW+2,b.name.slice(0,9),[255,255,255]);
  PZ_BOATC[k]=hdToCanvas(s);return PZ_BOATC[k]}
function pzBoatDraw(g,b){const t=pzSeaT(),img=pzBoatImg(b),bob=Math.sin(t*1.3+b.x)*1.2,X=b.x*T-4,Y=b.y*T-6+bob;
  g.fillStyle='rgba(16,50,72,.3)';g.beginPath();g.ellipse(X+img.width/4+2,b.y*T+b.h*T/2+4,img.width/4+3,img.height/6,0,0,7);g.fill();
  g.drawImage(img,X,Y,img.width/2,img.height/2);g.fillStyle='rgba(240,252,252,.6)';for(let i=0;i<5;i++){const a=t*1.3+i;g.fillRect(X+4+i*((img.width/2-8)/4)+Math.sin(a)*1,b.y*T+b.h*T+2+Math.sin(a*1.7),3,.5)}}
// ---------------------------------------------------------------- nadar: el jugador (y quien sea) se ve con el agua al pecho
function pzSwimDraw(g,img,X,Y,sw,sh,moving){const t=pzSeaT(),bob=Math.sin(t*3+X*.1)*.7,cut=Math.round(sh*.5);
  g.drawImage(img,0,0,img.width,img.height*(cut/sh),X-sw/2,Y-cut-3+bob,sw,cut);
  if(moving){const k=Math.floor(t*6)%2;g.fillStyle='#e0a070';g.fillRect(X+(k?-7:5),Y-6+bob,2,2);g.fillStyle='rgba(255,255,255,.8)';g.fillRect(X+(k?-8:6),Y-4+bob,3,1)}
  g.fillStyle='rgba(90,180,190,.55)';g.fillRect(X-sw/2+1,Y-4+bob,sw-2,2);
  g.fillStyle='rgba(240,252,252,.85)';const r=6+Math.sin(t*4)*1;g.fillRect(X-r,Y-3+bob,r*2,.5);g.fillRect(X-r-1,Y-2.5+bob,1,.5);g.fillRect(X+r,Y-2.5+bob,1,.5);
  if(moving){g.fillStyle='rgba(240,252,252,.6)';g.fillRect(X-2,Y-1,4,.5);g.fillRect(X-3,Y+1,6,.5)}}
{const _hd=heroDraw;heroDraw=function(g,X,Y,e){if(e===P&&P.map==='playa'&&P.swim){const img=heroSprite(e.dir,e.moving?Math.floor((e.hf||0))%6:6,CH.player.shirt);pzSwimDraw(g,img,X,Y,18,29,e.moving);return}return _hd(g,X,Y,e)}}
{const _nd=npcDraw;npcDraw=function(e){const d=_nd(e);if(d&&e&&e.map==='playa'&&e.swim){return{img:d.img,x:d.x,y:d.y,w:d.w,h:d.h,swim:1}}if(d&&e&&e.kid)return{img:d.img,x:-7,y:-22,w:14,h:23};return d}}
{const _ed=hdEntDraw;hdEntDraw=function(e){if((e===P&&P.map==='playa'&&(P.swim||P.deck&&pzUnderDeckY(P)))||e.swim)return null;return _ed(e)}}
function pzUnderDeckY(e){return false}
// el dibujo de los vecinos que nadan: se intercepta el drawImage del render con un proxy
hookAfter('progProxies',function(list,map){if(map!=='playa'||!PZ.k)return;
  for(const c of PZ.cars)list.push({kind:'carv',map,x:c.x+c.len/2,y:c.lane.y*T+16,draw:g=>c.type==='bici'?pzBiciDraw(g,c):vehDraw(g,c)});
  for(const b of PZ.boats)list.push({kind:'carv',map,x:b.x*T,y:(b.y+b.h)*T-2,draw:g=>pzBoatDraw(g,b)});
  for(let i=list.length-1;i>=0;i--){const e=list[i];if(e.kind==='carv'||e===P||!e.swim||!e.c)continue;list[i]={kind:'carv',map,x:e.x,y:e.y,draw:g=>{const d=npcDraw(e);pzSwimDraw(g,d.img,Math.round(e.x),Math.round(e.y),d.w,d.h,e.moving)}}}
  if(typeof pzMoreProxies==='function')pzMoreProxies(list,map)});
// ---------------------------------------------------------------- capas extra: suelo, aire, luz y sombras
hookAfter('zoneGround',function(g){if(P.map!=='playa'||!PZ.k)return;const cx=Math.round(cam.x*Z)/Z,cy=Math.round(cam.y*Z)/Z;pzSea(g,cx,cy);if(typeof pzGround==='function')pzGround(g,cx,cy)});
hookAfter('zoneAir',function(g){if(P.map!=='playa'||!PZ.k)return;if(pzUnder()){pzDeckDraw(g,.58)}if(typeof pzAir==='function')pzAir(g)});
hookBefore('hdLight',function(m){if(!m||m.id!=='playa')return;if(!m.lights0)m.lights0=m.lights.slice();m.lights=m.lights0.concat(pzCarLights())});
hookAfter('hdLight',function(m,cx,cy){if(!m||m.id!=='playa')return;const h=S.t/60,amb=hdAmbient(h),lum=(amb[0]+amb[1]+amb[2])/3,night=Math.max(0,Math.min(1,(.9-lum)/.7));if(night<.05)return;
  ctx.save();ctx.setTransform(Z,0,0,Z,-cx*Z,-cy*Z);ctx.globalCompositeOperation='lighter';const t=pzSeaT(),x0=cx,x1=cx+VW/Z;
  // la luna sobre el golfo y los faroles del muelle que se reflejan
  const mx=cx+VW/Z*.7;for(let i=0;i<40;i++){const y=cy+VH/Z*(.2+hsh(i,3)*.8);const s=pzShore(mx);if(y<s+20)continue;const w=(2+hsh(i,Math.floor(t*4))*8)*(.6+.4*(y-cy)/(VH/Z));ctx.fillStyle='rgba(200,214,255,'+(.22*night).toFixed(2)+')';ctx.fillRect(mx-w/2+Math.sin(t+i)*3,y,w,.5)}
  for(const[x,y,s]of MAPS.playa.faroles){if(!s)continue;const lx=x*T+(s===1?2:14);if(lx<x0-20||lx>x1+20)continue;if(y*T<pzShore(lx)+4)continue;for(let k=0;k<7;k++){ctx.fillStyle='rgba(255,190,110,'+(.35*night*(1-k/7)).toFixed(2)+')';ctx.fillRect(lx-2+Math.sin(t*2+k)*1.5,y*T+10+k*3,4,.5)}}
  for(const c of PZ.cars){if(c.type==='bici')continue;const d=c.lane.dir,fx=d>0?c.x+c.len:c.x,yy=c.lane.y*T+(c.type==='bus'?-4:c.type==='moto'?2:4);ctx.globalAlpha=night*.5;const gr=ctx.createLinearGradient(fx,0,fx+d*46,0);gr.addColorStop(0,'rgba(255,244,200,.8)');gr.addColorStop(1,'rgba(255,244,200,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(fx,yy-2);ctx.lineTo(fx+d*46,yy-10);ctx.lineTo(fx+d*46,yy+12);ctx.lineTo(fx,yy+3);ctx.fill();ctx.globalAlpha=1}
  ctx.restore()});
hookFilter('hdCasters',function(C,m){if(!m||m.id!=='playa'||C._pz)return C;C._pz=1;
  for(const[x,y]of m.almendros)C.trees.push({x:x*T+8,y:y*T+15,hc:30*.62,rx:12,ry:6});for(const[x,y]of m.palms)C.trees.push({x:x*T+8,y:y*T+15,palm:1,hc:50,rx:15,ry:8});
  for(const[x,y,s]of m.faroles)C.poles.push({x:x*T+(s===1?2:s===2?14:8),y:y*T+14,h:44});
  C.boxes.push({x:0,y:T,w:PZW*T,h:3*T-6,hg:30});for(const o of m.objs){if(o.type==='chinamo')C.boxes.push({x:o.x*T+2,y:o.y*T+8,w:o.w*T-4,h:o.h*T-10,hg:16});if(o.type==='letras')C.boxes.push({x:o.x*T+3,y:o.y*T+4,w:o.w*T-6,h:4,hg:14})}
  return C});
// ---------------------------------------------------------------- cada cuadro
hookAfter('update',function(dt){if(P.map!=='playa'||!PZ.k)return;
  if(mode==='play'&&!fading){pzLevelTick();pzCarsTick(dt);pzSecretTick();pzBubTick(dt);if(typeof pzTick==='function')pzTick(dt)}
  else pzBubTick(dt)});
function pzBubTick(dt){if(mode==='play')for(const e of ENTS){if(!e.z||!e.sh||e.map!=='playa')continue;e.shT-=dt;if(e.shT<=0){e.shT=rnd(7,15);if(BUBS.length<2&&Math.hypot(e.x-P.x,e.y-P.y)<170&&!e.talking)BUBS.push({e,txt:pick(e.sh),t:2.8})}}
  for(const b of BUBS)b.t-=dt;BUBS=BUBS.filter(b=>b.t>0&&b.e.map===P.map&&(!b.car||PZ.cars.includes(b.car)||P.map!=='playa'))}
// al cargar una partida guardada en la playa vieja, o en un lugar que ya no se puede pisar
hookAfter('startGame',function(){if(P.map!=='playa')return;ensureMap('playa');const tx=Math.floor(P.x/T),ty=Math.floor((P.y-2)/T);P.deck=ty<=15||pzInPier(tx,ty);
  PZ_MOVER=P;const bad=feetBlocked(MAPS.playa,P.x,P.y);PZ_MOVER=null;if(bad){P.x=PZ_ARRIVE[0]*T+8;P.y=PZ_ARRIVE[1]*T+12;P.deck=true;snapCam()}if(!PZ.cars.length)pzCarsInit()});
// ---------------------------------------------------------------- los lugares escondidos
function pzSecretTick(){const s=PZS();for(const k in PZ_SECRETS){if(s.sec[k])continue;const q=PZ_SECRETS[k];if(Math.hypot(P.x-(q.x*T+8),P.y-(q.y*T+8))<40){s.sec[k]=1;beepSeq([659,784,988,1318]);toast('🌴 Lugar escondido: '+q.n+' ('+Object.keys(s.sec).length+'/3)');saveGame()}}}
for(const k in PZ_SECRETS){const q=PZ_SECRETS[k];ACT_POINTS.push({map:'playa',x:q.lx,y:q.ly,label:'Sentarse en el tronco',cond:()=>!P.swim&&!riding()&&(k!=='muelle'||!P.deck),run(){afterD(()=>pzSit(k))}})}
// ---------------------------------------------------------------- escenas de pantalla completa (tronco, lancha, banana)
// Una capa propia con un lienzo de baja resolución (180 px de alto) ampliado nítido. Mientras está abierta no se dibuja el mundo.
var PZV={on:false,c:null,g:null,W:320,H:180,raf:0,kind:'',draw:null,key:null,tap:null};
function pzOvOpen(kind,o){let d=$('#pzov');if(!d){d=document.createElement('div');d.id='pzov';d.style.cssText='position:fixed;inset:0;z-index:18;background:#0a0e2a;touch-action:none;user-select:none;-webkit-user-select:none';
    const c=document.createElement('canvas');c.style.cssText='position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated';d.appendChild(c);
    const cap=document.createElement('div');cap.className='vcap';cap.id='pzcap';cap.style.cssText='position:absolute;left:50%;transform:translateX(-50%);top:calc(10px + env(safe-area-inset-top));display:flex;flex-direction:column;align-items:center;background:rgba(20,16,28,.72);border-radius:10px;padding:6px 14px;text-align:center;pointer-events:none;color:#f4ead2';d.appendChild(cap);
    const bt=document.createElement('div');bt.id='pzbtn';bt.style.cssText='position:absolute;left:8px;right:8px;bottom:calc(12px + env(safe-area-inset-bottom));display:flex;gap:8px;flex-wrap:wrap;justify-content:center';d.appendChild(bt);
    d.addEventListener('pointerdown',e=>{if(PZV.tap&&e.target.tagName!=='BUTTON')PZV.tap(e)});document.body.appendChild(d)}
  d.style.display='block';const c=d.querySelector('canvas');const asp=innerWidth/Math.max(1,innerHeight);if(asp>=1.1){PZV.H=180;PZV.W=Math.min(420,Math.round(180*asp))}else{PZV.W=200;PZV.H=Math.min(460,Math.round(200/asp))}c.width=PZV.W;c.height=PZV.H;
  Object.assign(PZV,{on:true,c,g:c.getContext('2d'),kind,draw:o.draw,key:o.key||null,tap:o.tap||null,t0:performance.now()});PZV.g.imageSmoothingEnabled=false;
  pzOvCap(o.cap||'',o.sub||'');pzOvBtns(o.btns||[]);$('#dialog').style.zIndex=30;mode='pzv';for(const k in KEYS)KEYS[k]=0;$('#touch').classList.add('hidden');$('#prompt').classList.add('hidden');
  const loop=()=>{if(!PZV.on)return;try{PZV.draw&&PZV.draw((performance.now()-PZV.t0)/1000)}catch(e){console.error(e)}PZV.raf=requestAnimationFrame(loop)};cancelAnimationFrame(PZV.raf);PZV.raf=requestAnimationFrame(loop)}
function pzOvCap(t,s){const c=$('#pzcap');if(!c)return;c.style.display=t?'flex':'none';c.innerHTML='<b style="font-size:16px;letter-spacing:.05em;color:#f2c94c">'+esc(t)+'</b>'+(s?'<span style="font-size:12px;opacity:.9">'+esc(s)+'</span>':'')}
function pzOvBtns(list){const b=$('#pzbtn');if(!b)return;b.innerHTML='';for(const x of list){const e=document.createElement('button');e.textContent=x.t;if(x.alt)e.className='alt';e.onclick=ev=>{ev.stopPropagation();if(mode==='dialog')return;x.f()};b.appendChild(e)}}
function pzOvClose(){PZV.on=false;cancelAnimationFrame(PZV.raf);const d=$('#pzov');if(d)d.style.display='none';$('#dialog').style.zIndex='';if(mode==='pzv')mode='play';PZV.draw=PZV.key=PZV.tap=null;showTouch()}
hookAfter('closeDialog',function(){if(PZV.on&&mode==='play'){mode='pzv';$('#touch').classList.add('hidden')}});
{const _r=render;render=function(dt){if(PZV.on)return;return _r(dt)}}
addEventListener('keydown',e=>{if(mode!=='pzv'||!PZV.on||e.repeat)return;const k=e.key.toLowerCase();if(PZV.key&&PZV.key(k)!==false)return;if(k==='escape'||k==='e'||k==='enter'||k===' ')pzSitEnd()});
addEventListener('keyup',e=>{if(PZV.on&&PZV.keyUp)PZV.keyUp(e.key.toLowerCase())});
// ---------------------------------------------------------------- el golfo pintado (sirve para el tronco y la lancha)
var PZ_SKY=[[0,[10,14,36],[18,24,54],[34,40,76]],[4.8,[10,14,36],[20,26,58],[40,44,80]],[5.6,[40,48,96],[120,96,130],[236,150,110]],[6.4,[80,130,200],[170,190,214],[246,214,170]],[8,[64,134,214],[130,184,228],[196,224,238]],
  [15,[70,136,212],[136,186,226],[206,226,236]],[16.6,[86,134,200],[176,188,206],[250,214,158]],[17.5,[70,78,150],[214,120,130],[255,150,70]],[18.1,[44,44,110],[170,80,110],[250,110,70]],[18.8,[24,26,70],[70,50,100],[150,70,80]],[19.6,[12,16,40],[22,28,60],[40,44,80]],[24,[10,14,36],[18,24,54],[34,40,76]]];
function pzSkyAt(h){for(let i=1;i<PZ_SKY.length;i++){const a=PZ_SKY[i-1],b=PZ_SKY[i];if(h<=b[0]){const t=(h-a[0])/(b[0]-a[0]);return[hdMix(a[1],b[1],t),hdMix(a[2],b[2],t),hdMix(a[3],b[3],t)]}}return PZ_SKY[0].slice(1)}
function pzSunPos(W,H,h){const hz=Math.round(H*.5);if(h<5.9||h>18.45)return null;const u=(h-6)/12.4,e=Math.sin(Math.PI*Math.max(0,Math.min(1,u)));return{x:W*(.08+.84*u),y:hz-e*H*1.25+2,low:Math.max(0,1-e*3)}}
function pzGulf(W,H,h,o){o=o||{};const b=hdBuf(W,H),hz=o.hz||Math.round(H*.5),sky=pzSkyAt(h),amb=hdAmbient(h),sun=pzSunPos(W,H,h),night=h<5.6||h>19.2;
  for(let y=0;y<hz;y++){const t=y/hz;for(let x=0;x<W;x++){let c=t<.55?hdMix(sky[0],sky[1],t/.55):hdMix(sky[1],sky[2],(t-.55)/.45);const q=(pzD(x,y)-.5)*6;c=[c[0]+q,c[1]+q,c[2]+q];
      if(sun){const dx=x-sun.x,dy=y-sun.y,d=Math.hypot(dx,dy*1.4);if(d<46){const k=(1-d/46)**2*(.5+sun.low*.6);c=hdMix(c,sun.low>.3?[255,190,110]:[255,246,220],k)}}hdP(b,x,y,c)}}
  if(night)for(let i=0;i<70;i++){const x=hsh(i,1)*W,y=hsh(1,i)*hz*.8;hdP(b,x,y,hsh(i,2)<.2?[255,255,236]:[190,200,230])}
  // nubes bajas
  for(let n=0;n<7;n++){const cx=hsh(n,61+Math.floor(S.day%5))*W,cy=hz*(.18+hsh(61,n)*.6),w=20+hsh(n,62)*40;for(let i=0;i<w;i++){const th=2+Math.sin(i/w*Math.PI)*3;for(let j=0;j<th;j++){const lit=j<1;let c=hdMix(sky[1],[250,246,240],.55);if(h>16.5&&h<19)c=lit?[255,200,150]:hdMix(sky[1],[200,110,120],.6);if(night)c=hdMix(sky[1],[60,64,96],.5);hdP(b,cx+i,cy-j,c,.85)}}}
  if(sun&&sun.y<hz+4){for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++){if(x*x+y*y>42)continue;if(sun.y+y>=hz)continue;hdP(b,sun.x+x,sun.y+y,sun.low>.3?[255,214,140]:[255,252,236])}}
  if(night||h<6.2||h>18.2){const mx=W*.28,my=hz*.32;for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++)if(x*x+y*y<=17)hdP(b,mx+x,my+y,(x+2)*(x+2)+y*y<10?[150,160,190]:[236,236,226])}
  // la península de Nicoya y la isla San Lucas, con bruma
  const hzc=sky[2];const land=(x0,x1,amp,seed,haze)=>{for(let x=Math.max(0,x0|0);x<Math.min(W,x1);x++){const u=(x-x0)/(x1-x0),e=Math.sin(u*Math.PI)**.6;const hh=Math.round(amp*e*(.6+.4*hdVN(x*3,seed,9,seed))+1);
      for(let j=0;j<hh;j++){const y=hz-1-j;let c=hdMix(hdS([70,96,84],amb[1]),hzc,haze);if(j>hh-2)c=hdS(c,1.08);hdP(b,x,y,c)}}};
  land(W*.32,W*1.15,o.near?16:11,7,.55);land(-W*.1,W*.36,7,3,.62);land(W*.14,W*.26,6,11,.42);
  // el mar
  const sea0=hdMix(hdMix([60,132,164],hzc,.5),sky[1],.2),sea1=hdMix([24,74,108],sky[0],.25);
  for(let y=hz;y<H;y++){const t=(y-hz)/(H-hz);for(let x=0;x<W;x++){let c=hdMix(sea0,sea1,Math.min(1,Math.pow(t,.7)*1.2));const k=.55+.45;c=[c[0]*(.5+.5*amb[0]),c[1]*(.5+.5*amb[1]),c[2]*(.5+.5*amb[2])];if(pzD(x,y)>.82&&t<.3)c=hdS(c,1.06);if(((x+(y*7))%11)===0&&hdr(x,y)>.5)c=hdS(c,1.12);hdP(b,x,y,c)}}
  return{b,hz,sun,night,amb}}
function pzGulfAnim(g,G,W,H,t,h){const hz=G.hz,fr=Math.floor(t*8),sun=G.sun;
  for(let k=0;k<26;k++){const y=hz+2+((k*7+t*3)%(H-hz-2));const a=.15+.3*(y-hz)/(H-hz);g.fillStyle='rgba(200,236,240,'+a.toFixed(2)+')';const x=(hsh(k,3)*W+t*(4+k%3))%W;g.fillRect(x,Math.floor(y),3+((y-hz)/(H-hz))*10,1)}
  let px=null,col='255,236,190';if(sun&&sun.y<hz+2){px=sun.x;col=sun.low>.3?'255,180,100':'255,250,230'}else if(G.night||h<6.2||h>18.2){px=W*.28;col='210,220,255'}
  if(px!==null)for(let i=0;i<60;i++){const v=hsh(i,fr),y=hz+1+Math.floor(v*v*(H-hz-1)),spread=2+(y-hz)*.5;const x=px+(hsh(fr,i)-.5)*spread*2;g.fillStyle='rgba('+col+','+(.5+hsh(i,i)*.5).toFixed(2)+')';g.fillRect(Math.floor(x),y,1+Math.floor(hsh(i,2)*3),1)}}
// ---------------------------------------------------------------- sentarse en el tronco
function pzSitPaint(k){const W=PZV.W,H=PZV.H,h=S.t/60,G=pzGulf(W,H,h,{hz:Math.round(H*.48)}),b=G.b,amb=G.amb,L=c=>[c[0]*amb[0],c[1]*amb[1],c[2]*amb[2]],ari=PLAYA&&PLAYA.ari;
  const blob=(cx,cy,r,col,seed)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const d=(x*x+y*y)/(r*r)+hdVN(cx+x,cy+y,4,seed)*.4-.2;if(d>1)continue;const lit=-(x+y)/(2*r);hdP(b,cx+x,cy+y,L(hdS(col,lit>.25?1.25:lit>-.2?1:.72)))}};
  // primer plano: arena
  for(let y=Math.round(H*.74);y<H;y++)for(let x=0;x<W;x++){const c=hdS([200,176,132],.9+hdr(x,y)*.15-(y-H*.74)/H*.4);hdP(b,x,y,L(c))}
  for(let x=0;x<W;x++){const y=Math.round(H*.74)+Math.round(Math.sin(x*.08+S.t*.01)*1.5);hdP(b,x,y,L([236,246,246]));hdP(b,x,y+1,L([200,220,220]))}
  if(k==='caleta'){for(const[cx,cy,r]of[[16,H*.82,26],[44,H*.9,18],[W-20,H*.8,30],[W-50,H*.92,16]]){for(let y=-r;y<=r;y++)for(let x=-r*1.3;x<=r*1.3;x++){const u=x/(r*1.3),v=y/r;if(u*u+v*v>1)continue;const lit=-(u*.8+v*.6);hdP(b,cx+x,cy+y,L(hdS([128,118,106],lit>.3?1.2:lit>-.3?.95:.7)))}}
    for(let i=0;i<70;i++)hdLine(b,0,6+i*.4,30+i*1.8,4+Math.sin(i)*6,L([70,52,36]),1,1);for(let n=0;n<60;n++)blob(10+hsh(n,1)*W*.4,hsh(1,n)*H*.25,4+hsh(n,2)*4,hsh(n,3)<.25?[200,80,50]:[70,120,56],n)}
  else if(k==='muelle'){for(let y=0;y<Math.round(H*.17);y++)for(let x=0;x<W;x++){const gap=(x%14)===0;hdP(b,x,y,L(gap?[230,220,190]:hdS([84,64,46],.8+hdr(x,y)*.25)))}
    for(const px of[W*.1,W*.9,W*.36,W*.66])for(let y=0;y<H*.8;y++){const w=px<W*.2||px>W*.8?9:4;for(let i=0;i<w;i++){const sh=i<w*.3?1.15:i>w*.7?.7:.9;let c=hdS([96,72,50],sh);if(y>H*.46&&y<H*.52)c=hdMix(c,[60,80,70],.5);hdP(b,px+i,y,L(c))}}}
  else{for(let n=0;n<140;n++){const side=hsh(n,7)<.5,x=side?hsh(n,8)*W*.22:W-hsh(n,8)*W*.22,y=hsh(8,n)*H*.95;blob(x,y,3+hsh(n,9)*5,[52,96,48],n)}
    for(let n=0;n<50;n++)blob(hsh(n,17)*W,hsh(17,n)*H*.14,3+hsh(n,9)*5,[44,84,44],n+99);
    for(let i=0;i<10;i++){const x0=hsh(i,4)<.5?hsh(i,5)*W*.2:W-hsh(i,5)*W*.2;for(let t=0;t<30;t++){const a=t/30;hdP(b,x0+(a*14)*(x0<W/2?1:-1),H*.62+Math.sin(a*Math.PI)*-10+a*30,L([84,62,42]))}}}
  // el tronco y ustedes de espaldas
  const ly=Math.round(H*.86);for(let x=Math.round(W*.18);x<W*.82;x++)for(let j=0;j<9;j++){const v=(j-4)/4;hdP(b,x,ly+j,L(hdS([140,104,72],v<-.4?1.2:v<.3?1:.72)))}
  const who=(x,shirt,hair,long)=>{const s=hdC(shirt),hc=hdC(hair);for(let y=0;y<16;y++)for(let i=-7;i<=7;i++){if(Math.abs(i)>5+y*.15)continue;hdP(b,x+i,ly-15+y,L(hdS(s,i<-2?1.12:i>3?.78:.95)))}
    for(let y=-6;y<=5;y++)for(let i=-5;i<=5;i++)if(i*i+y*y<=27)hdP(b,x+i,ly-22+y,L(hdS(hc,i<-1&&y<0?1.4:.9)));if(long)for(let y=0;y<11;y++)for(let i=-3;i<=3;i++)if(Math.abs(i)<3.5-y*.2)hdP(b,x+i,ly-17+y,L(hdS(hc,i<0?1.3:1)))};
  who(Math.round(W*(ari?.44:.5)),'#c8232c','#2a1810',0);if(ari)who(Math.round(W*.57),(CH.ariana&&CH.ariana.shirt)||'#8fc8e8','#16100c',1);
  return G}
function pzSit(k){const q=PZ_SECRETS[k];if(PLAYA&&PLAYA.ari){const a=ENTS.find(e=>e.tmp==='playa');if(a&&Math.hypot(a.x-P.x,a.y-P.y)>90){a.x=P.x+10;a.y=P.y}}
  let G=null,cvs=null;const paint=()=>{G=pzSitPaint(k);cvs=hdToCanvas(G.b)};
  pzOvOpen('sit',{cap:q.n,sub:pzHoraTxt(),draw:t=>{if(!cvs)paint();const g=PZV.g;g.drawImage(cvs,0,0);pzGulfAnim(g,G,PZV.W,PZV.H,t,S.t/60)},
    btns:[{t:'⏳ Esperar una hora',alt:1,f(){passTime(60);enAdd(3);paint();pzOvCap(q.n,pzHoraTxt());if(typeof pzSitHour==='function')pzSitHour(k)}},{t:'Levantarse',f(){pzSitEnd()}}]});
  PZS().sits=(PZS().sits||0)+1;progStat('pzTronco');enAdd(4);
  const solo=['Te sentás en el tronco. Solo se oyen las olas y, a lo lejos, una moto del Paseo.','Aquí nadie te pregunta nada. El mar va y viene, como si respirara.','Te quitás las tenis y metés los pies en la arena tibia. Esto es vida.'];
  say(null,q.d);say(null,pick(solo));if(typeof pzSitTalk==='function')pzSitTalk(k);runDialog()}
function pzSitEnd(){if(mode==='dialog')return;pzOvClose();saveGame()}
function pzHoraTxt(){const hh=hour(),mm=Math.floor(S.t%60);return(hh%12||12)+':'+String(mm).padStart(2,'0')+(hh<12?' a. m.':' p. m.')}
