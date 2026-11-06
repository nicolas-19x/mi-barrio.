// ================= VIAJES: LA CHANCHA Y SAN JOSÉ =================
// Cada destino es una "zona": un mapa exterior (m.zone) con sus propios interiores.
// El barrio es la zona 'barrio'. Para sumar un destino: una entrada en ROUTES, un generador de mapa y ensureMap().
const zoneOf=id=>{const m=MAPS[id];return(m&&m.zone)||'barrio'};
const curZone=()=>zoneOf(P.map);
function TR(){const f=S.f;if(!f.tr)f.tr={trips:0,seen:{},enc:{},gift:{},estatua:0};return f.tr}
function ensureMap(id){if(!MAPS[id]&&(id==='chepe'||id==='mercado'))genChepe()}
const intName=id=>{const m=MAPS[id];return m&&m.zone?m.name:bName(id)};
function mapLabel(m){if(m.zone==='chepe')return m.interior?m.name:'Chepe · '+chepeArea(P.x/T,P.y/T);return m.interior?bName(m.id):'El barrio'}
function enAdd(n){const e=E();e.en=clamp(e.en+n,0,100)}
function zBuy(price,cb){if(S.money<price){say(null,'No te alcanza. Te faltan '+fmtC(price-S.money)+'.');return}spend(price,'Chepe');beep(880,.05,'square',.03);cb()}

// ---------- San José: plano ----------
// Norte: Avenida Segunda con teatro, hotel, soda, banco y almacén. Centro: Parque Central y Mercado Central.
// Sur: el bulevar peatonal de la Avenida Central con tiendas.
const CHW=64,CHH=40;
const CHB=[
 {id:'esquina',x:0,y:1,w:3,h:7,wall:'#9fb3c0',roof:'#7d7a75'},
 {id:'teatro',x:3,y:1,w:16,h:7,wall:'#ecdfc2',roof:'#8d979c'},
 {id:'hotel',x:19,y:1,w:10,h:7,wall:'#d8c6a3',roof:'#878279'},
 {id:'soda',x:29,y:1,w:8,h:7,wall:'#f0cf6a',roof:'#838078'},
 {id:'banco',x:37,y:1,w:11,h:7,wall:'#aebdc8',roof:'#7b8086'},
 {id:'almacen',x:48,y:1,w:16,h:7,wall:'#b8704f',roof:'#86807a'}];
const CHS=[{x:0,w:11,n:'FARMACIA',c:'#2f8f5b',roof:'#9aa1a6'},{x:11,w:9,n:'ZAPATERÍA',c:'#c0473b',roof:'#a3604a'},{x:20,w:12,n:'CINE',c:'#3a3f8f',roof:'#8a8f96'},
 {x:32,w:10,n:'PANADERÍA',c:'#d9822b',roof:'#a8573f'},{x:42,w:10,n:'LIBRERÍA',c:'#2a6fb0',roof:'#959a9e'},{x:52,w:12,n:'ROPA',c:'#8e3b8a',roof:'#a3604a'}];
const MERC={x:28,y:14,w:28,h:14,dx:41,dy:27};
const CH_TREES=[[8,14],[19,14],[3,26],[19,26],[8,25],[15,14],[61,25]];
function chepeArea(x,y){if(y<13)return'Avenida Segunda';if(y>=28)return'Avenida Central';if(x<22)return'Parque Central';if(x<26)return'Calle peatonal';if(x>=58)return'Plazoleta';return'Mercado Central'}

function genChepe(){
 const W=CHW,H=CHH,m=newMap('chepe',W,H,'San José');m.zone='chepe';m.cl=10;m.trees=CH_TREES;
 const F=(x0,y0,x1,y1,t,s)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)setT(m,x,y,t,s?1:0)};
 F(0,0,W-1,H-1,31,1);
 F(1,8,W-2,8,2);F(1,9,W-2,11,34);F(1,12,W-2,12,2);           // Avenida Segunda
 for(const cx of[11,12,23,24])F(cx,9,cx,11,33);              // pasos de cebra
 F(1,13,21,27,8);F(1,19,21,19,32);F(11,13,11,27,32);F(6,16,16,23,32);F(1,13,6,13,2); // Parque Central
 F(22,12,25,27,30);                                          // calle peatonal
 F(26,13,57,13,2);F(26,14,27,27,2);F(56,14,57,27,2);         // aceras del mercado
 F(58,13,62,27,32);                                          // plazoleta
 F(1,28,W-2,33,30);                                          // Avenida Central (bulevar)
 F(MERC.x,MERC.y,MERC.x+MERC.w-1,MERC.y+MERC.h-1,31,1);
 setT(m,MERC.dx,MERC.dy,31,0);m.doors.push({x:MERC.dx,y:MERC.dy,to:'mercado',cond:()=>S.t>=390&&S.t<1080,closed:'🔒 El Mercado Central ya cerró. Abre a las 6:30 a. m.'});m.noPath.add(MERC.dy*W+MERC.dx);
 for(let y=8;y<=33;y++){const a=ti(m,1,y),b=ti(m,W-2,y);setT(m,0,y,a===8||a===32?5:a,1);setT(m,W-1,y,b===32?5:b,1)}
 for(let y=13;y<=27;y++){setT(m,0,y,5,1);setT(m,W-1,y,5,1)}
 for(const[x,y]of CH_TREES)setT(m,x,y,ti(m,x,y),1);
 const O=(type,x,y,w=1,h=1,o,solid=true)=>{m.objs.push(Object.assign({type,x,y,w,h},o||{}));if(solid)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)m.s[j*W+i]=1};
 O('busstop',2,13,4,1);O('templete',8,17,7,5);O('marimba',8,22,2,1);
 for(const[x,y]of[[7,23],[15,23],[3,18],[19,18],[3,24],[19,24],[61,21]])O('bench',x,y);
 for(const[x,y]of[[6,16],[16,16],[6,23],[16,23]]){O('farol',x,y);m.lights.push({x:x*T+8,y:y*T-14,r:66,pole:1})}
 O('kioscoP',59,16,2,2);O('taxis',61,13);
 for(let x=4;x<W-2;x+=8){O('farol',x,28);m.lights.push({x:x*T+8,y:28*T-14,r:70,pole:1})}
 for(let x=8;x<W-2;x+=8){O('farol',x,33);m.lights.push({x:x*T+8,y:33*T-14,r:70,pole:1})}
 for(const x of[16,30,44,54]){O('farolS',x,12,1,1,null,false);m.lights.push({x:x*T+8,y:11*T,r:76,pole:1})}
 for(const x of[6,18,34,50])O('jardinera',x,31,2,1);
 for(const[x,y]of[[10,30],[26,30],[46,30],[58,30],[14,32],[40,32],[54,32]])O('bench',x,y);
 for(const[x,y]of[[21,29],[38,32],[57,29]])O('basurero',x,y);
 O('copos',28,31,2,1);
 for(const b of CHB)if(b.id!=='esquina')m.lights.push({x:(b.x+b.w/2)*T,y:8*T,r:Math.min(60,b.w*5)});
 m.lights.push({x:(MERC.dx+.5)*T,y:28*T,r:60},{x:34*T,y:28*T,r:44},{x:48*T,y:28*T,r:44});
 for(const s of CHS)m.lights.push({x:(s.x+s.w/2)*T,y:34*T,r:40});
 m.walk=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=ti(m,x,y);if((t===2||t===30||t===32)&&!solidT(m,x,y))m.walk.push([x,y])}
 m.zdraw=(g,ph)=>ph==='pre'?chepePre(g,m):ph==='base'?chepeObjs(g,m):chepeTop(g,m);
 renderMap(m);genMercado();chepePeople();chepePigeons();return m}

// ---------- Mercado Central (interior) ----------
const MPUESTOS=[
 {k:'soda',x:1,y:3,w:7,lab:'SODA YOLI'},{k:'sorbetera',x:9,y:3,w:4,lab:'HELADOS'},{k:'cafe',x:14,y:3,w:4,lab:'CAFÉ'},{k:'chicharron',x:19,y:3,w:6,lab:'CHICHARRONES'},
 {k:'hierbas',x:2,y:5,w:6,h:3,lab:'HIERBAS'},{k:'flores',x:10,y:5,w:6,h:3,lab:'FLORES'},{k:'recuerdos',x:18,y:5,w:6,h:3,lab:'RECUERDOS'},
 {k:'frutas',x:1,y:12,w:5,h:3,lab:'FRUTAS',rev:1},{k:'granos',x:7,y:12,w:5,h:3,lab:'GRANOS',rev:1},{k:'artesania',x:15,y:12,w:5,h:3,lab:'ARTESANÍA',rev:1},{k:'pescado',x:21,y:12,w:4,h:3,lab:'MARISCOS',rev:1}];
function genMercado(){const W=26,H=16,m=newMap('mercado',W,H,'Mercado Central');m.zone='chepe';m.interior=true;
 m.b={wall:'#e2c98f',floor:36,kind:'mercado'};m.wallFace=shade('#e2c98f',.2);m.door={dx:MERC.dx,dy:MERC.dy};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const wall=y<2||x===0||x===W-1||y===H-1;setT(m,x,y,wall?10:36,wall)}
 setT(m,13,15,13,0);m.noPath.add(15*W+13);m.exit={x:13,y:15};m.entry={x:13,y:14};m.out={map:'chepe',x:MERC.dx,y:MERC.dy+1};
 for(const p of MPUESTOS){const h=p.h||1;m.objs.push(Object.assign({type:'puesto',h},p));for(let j=p.y;j<p.y+h;j++)for(let i=p.x;i<p.x+p.w;i++)m.s[j*W+i]=1}
 for(const x of[4,11,16,22])m.lights.push({x:x*T,y:4*T,r:64});for(const x of[4,13,21])m.lights.push({x:x*T,y:10*T,r:70});
 m.walk=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(ti(m,x,y)===36&&!solidT(m,x,y)&&y>=4)m.walk.push([x,y]);
 m.zdraw=(g,ph)=>ph==='base'?mercadoBase(g,m):ph==='top'?mercadoTop(g,m):0;
 renderMap(m);return m}

// ---------- baldosas de ciudad ----------
function drawCityTile(g,m,x,y,t,r){const X=x*T,Y=y*T;
 const asph=()=>{R(g,'#45484e',X,Y,T,T);for(let i=0;i<6;i++)R(g,r(i,4)<.5?'#50535a':'#3c3f45',X+((r(i,5)*15)|0),Y+((r(i,6)*15)|0),1,1);
  const sd=(a,b)=>ti(m,a,b)===2;if(sd(x,y-1)){R(g,'#2c2f34',X,Y,T,3);R(g,'#6b6f75',X,Y+3,T,1)}if(sd(x,y+1)){R(g,'#2c2f34',X,Y+13,T,3);R(g,'#6b6f75',X,Y+12,T,1)}};
 switch(t){
 case 30:{R(g,'#a3947f',X,Y,T,T);const blv=y>=28&&y<=33,pea=x>=22&&x<=25&&!blv;
  for(let j=0;j<2;j++)for(let i=0;i<2;i++){const v=hsh(x*2+i,y*2+j);
   const red=blv?((y===28&&j===0)||(y===33&&j===1)||(y===30&&j===1)||(y===31&&j===0)):pea?((x===22&&i===0)||(x===25&&i===1)):false;
   const dia=blv&&(y===30||y===31)&&((x*2+i)%14===0);
   const c=dia?'#8f4a37':red?(v<.5?'#b8644c':'#ad5c45'):(v<.33?'#cdbfa9':v<.66?'#c4b59d':'#d3c6b0');
   const bx=X+i*8,by=Y+j*8;R(g,c,bx+1,by+1,7,7);R(g,shade(c,.12),bx+1,by+1,7,1);R(g,shade(c,-.12),bx+1,by+7,7,1)}
  if(r(3,3)<.13)R(g,'#8a7e6e',X+((r(4,4)*11)|0)+2,Y+((r(5,5)*11)|0)+2,2,2);
  if(r(6,6)<.05)R(g,'#6f8c46',X+((r(7,7)*12)|0)+2,Y+((r(8,8)*12)|0)+2,2,1);
  break}
 case 32:{R(g,'#c4b9a3',X,Y,T,T);for(let j=0;j<4;j++)for(let i=0;i<4;i++){const v=hsh(x*4+i,y*4+j);R(g,v<.5?'#ddd4c2':'#d4cab6',X+i*4,Y+j*4,3,3)}
  const gr=(a,b)=>{const v=ti(m,a,b);return v===8||v===5};if(gr(x,y-1))R(g,'#b3a891',X,Y,T,1);if(gr(x,y+1))R(g,'#b3a891',X,Y+15,T,1);if(gr(x-1,y))R(g,'#b3a891',X,Y,1,T);if(gr(x+1,y))R(g,'#b3a891',X+15,Y,1,T);break}
 case 34:asph();if(y===m.cl&&x%2===0){R(g,'#e8c547',X+2,Y+6,11,1);R(g,'#e8c547',X+2,Y+9,11,1)}
  if(r(9,9)<.035){R(g,'#2f3136',X+3,Y+4,9,6);R(g,'#25272b',X+5,Y+5,5,3);R(g,'#5a5d63',X+3,Y+10,9,1)}
  else if(r(10,10)<.03){disc(g,'#33363b',X+8,Y+8,4);disc(g,'#3e4147',X+8,Y+8,3);R(g,'#2b2d31',X+6,Y+7,5,1);R(g,'#2b2d31',X+6,Y+9,5,1)}break;
 case 33:asph();for(let i=0;i<4;i++){const w=hsh(x,y*4+i)<.25?9:14;R(g,'#e3dfd2',X+1,Y+1+i*4,w,2)}break;
 case 31:R(g,'#2b2730',X,Y,T,T);break;
 case 37:{R(g,'#7d7972',X,Y,T,T);for(let j=0;j<4;j++)for(let i=0;i<2;i++){const ox=(j%2)*4;R(g,hsh(x*2+i,y*4+j)<.5?'#8b877f':'#85817a',X+i*8+ox-((j%2)?4:0)+1,Y+j*4+1,7,3)}R(g,'#a29d94',X,Y,T,2);if(r(2,2)<.3)R(g,'#5e7a4a',X+((r(3,3)*12)|0),Y+12,3,2);break}
 case 39:for(let j=0;j<2;j++)for(let i=0;i<2;i++){const c=(x*2+i+y*2+j)%2?'#ecebe6':'#e0ded7';R(g,c,X+i*8,Y+j*8,8,8);R(g,'#cfccc4',X+i*8+7,Y+j*8,1,8);R(g,'#cfccc4',X+i*8,Y+j*8+7,8,1)}break;
 case 40:for(let j=0;j<2;j++)for(let i=0;i<2;i++){const c=(x*2+i+y*2+j)%2?'#e9e2d4':'#b84a3e';R(g,c,X+i*8,Y+j*8,8,8);R(g,shade(c,.1),X+i*8,Y+j*8,8,1)}break;
 case 36:{for(let j=0;j<2;j++)for(let i=0;i<2;i++){const c=(x*2+i+y*2+j)%2?'#cbbd9f':'#bba98a';R(g,c,X+i*8,Y+j*8,8,8);R(g,shade(c,-.1),X+i*8,Y+j*8+7,8,1);R(g,shade(c,-.1),X+i*8+7,Y+j*8,1,8)}
  if(r(2,2)<.18)R(g,'rgba(80,60,40,.18)',X+((r(3,3)*9)|0),Y+((r(4,4)*9)|0),5,4);break}
 }}

// ---------- edificios ----------
function cWin(g,x,y,w,h,o){o=o||{};R(g,o.f||'#efe9dc',x-1,y-1,w+2,h+2);R(g,o.gl||'#4f6f8c',x,y,w,h);R(g,o.hl||'#86a9c6',x+1,y+1,Math.max(1,w>>2),Math.max(1,h>>2));
 if(o.mull!==false){R(g,o.f||'#efe9dc',x+(w>>1),y,1,h)}if(o.sh){R(g,o.sh,x-3,y-1,2,h+2);R(g,o.sh,x+w+1,y-1,2,h+2)}if(o.sill)R(g,o.sill,x-2,y+h+1,w+4,2)}
const PXF={"A": "010101111101101", "B": "110101110101110", "C": "011100100100011", "D": "110101101101110", "E": "111100110100111", "F": "111100110100100", "G": "011100101101011", "H": "101101111101101", "I": "111010010010111", "J": "001001001101010", "K": "101101110101101", "L": "100100100100111", "M": "101111111101101", "N": "101111111111101", "O": "010101101101010", "P": "111101111100100", "Q": "010101101110011", "R": "110101110101101", "S": "011100010001110", "T": "111010010010010", "U": "101101101101111", "V": "101101101101010", "W": "101101111111101", "X": "101101010101101", "Y": "101101010010010", "Z": "111001010100111", "0": "111101101101111", "1": "010110010010111", "2": "110001010100111", "3": "110001010001110", "4": "101101111001001", "5": "111100110001110", "6": "011100111101111", "7": "111001010010010", "8": "111101111101111", "9": "111101111001110", ".": "000000000000010", "-": "000000111000000", ":": "000010000010000", ",": "000000000010100", "!": "010010010000010", "¡": "010000010010010", "?": "110001010000010", "₡": "011110100110011", "'": "010010000000000"};
// Letras de 3×5 píxeles para los rótulos: se ven nítidas a cualquier zoom, a diferencia de una fuente del sistema a 5 px.
function cText(g,t,x,y,sz,col,al){const sc=sz>=8?2:1,s=String(t).toUpperCase(),w=s.length*4*sc-sc,AC={'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','Ñ':'N','Ü':'U'};
 let X=Math.round(al==='left'?x:al==='right'?x-w:x-w/2);const Y=Math.round(y)+1;g.fillStyle=col;
 for(const ch of s){const base=AC[ch]||ch,gp=PXF[base];if(gp)for(let i=0;i<15;i++)if(gp[i]==='1')g.fillRect(X+(i%3)*sc,Y+((i/3)|0)*sc,sc,sc);
  if(ch==='Ñ')g.fillRect(X,Y-sc,3*sc,sc);else if(AC[ch])g.fillRect(X+2*sc,Y-sc,sc,sc);X+=4*sc}}
function roofJunk(g,b,X,Y,W,rH){const k=b.x*7+b.w;
 // tanque de agua
 const tx=X+W-22-((hsh(k,1)*10)|0),ty=Y+6;R(g,'rgba(0,0,0,.22)',tx+2,ty+12,14,4);R(g,'#1f2328',tx,ty+2,14,12);R(g,'#3b414a',tx,ty,14,4);R(g,'#2a2f36',tx+1,ty+4,1,9);
 // aire acondicionado
 const ax=X+8+((hsh(k,2)*20)|0),ay=Y+rH-22;R(g,'rgba(0,0,0,.2)',ax+1,ay+8,13,3);R(g,'#d5d8da',ax,ay,12,9);for(let i=1;i<11;i+=2)R(g,'#a9adb0',ax+i,ay+2,1,5);
 // antena
 const nx=X+W/2|0;R(g,'#2a2a30',nx,Y+3,1,14);R(g,'#2a2a30',nx-4,Y+6,9,1);R(g,'#2a2a30',nx-3,Y+9,7,1);
 if(hsh(k,3)<.6){disc(g,'#d9dcdf',X+16,Y+10,4);R(g,'#8a8f94',X+16,Y+10,4,1)}}
function drawCityB(g,b){const X=b.x*T,Y=b.y*T,W=b.w*T,H=b.h*T,fH=56,rH=H-fH,FY=Y+rH;
 R(g,b.roof,X,Y,W,rH);for(let i=0;i<W;i+=8)for(let j=0;j<rH-4;j+=8)R(g,shade(b.roof,hsh(i+b.x,j)<.5?.05:-.05),X+i,Y+j,8,8);
 R(g,shade(b.roof,.3),X,Y,W,2);R(g,shade(b.roof,.18),X,Y,2,rH);R(g,shade(b.roof,-.25),X+W-2,Y,2,rH);R(g,shade(b.roof,-.45),X,FY-3,W,3);
 if(b.id!=='teatro')roofJunk(g,b,X,Y,W,rH);
 R(g,b.wall,X,FY,W,fH);R(g,shade(b.wall,.2),X,FY,W,2);R(g,shade(b.wall,-.3),X,Y+H-2,W,2);R(g,shade(b.wall,-.12),X,FY+33,W,2);
 const gy=FY+36;// planta baja: 36..54
 switch(b.id){
 case'teatro':{// techo de pizarra con linterna de cobre, frontón, columnas y estatuas
  for(let j=2;j<rH-4;j+=4)R(g,shade(b.roof,j%8?.06:-.04),X+2,Y+j,W-4,1);
  const cx=X+W/2;R(g,'#4f8a7c',cx-18,Y+8,36,18);R(g,'#6aa595',cx-18,Y+8,36,2);for(let i=-14;i<16;i+=6)R(g,'#bfe0d6',cx+i,Y+12,3,10);R(g,'#3a6b5f',cx-18,Y+25,36,2);
  // frontón
  for(let i=0;i<14;i++)R(g,'#e3d4b3',cx-40+i*3,FY-i,80-i*6,1);R(g,'#c9b994',cx-40,FY-1,80,1);
  for(const sx of[cx-44,cx-2,cx+40]){R(g,'#5d5a4a',sx,FY-20+(sx===cx-2?-6:0),4,9);disc(g,'#5d5a4a',sx+2,FY-22+(sx===cx-2?-6:0),2)}
  cText(g,'TEATRO NACIONAL',cx,FY+3,6,'#6b5a3a');
  for(let i=0;i<8;i++){const px=X+18+i*((W-40)/7);R(g,'rgba(0,0,0,.15)',px+4,FY+11,2,40);R(g,'#f8f3e6',px,FY+11,5,40);R(g,'#d9cfb9',px+4,FY+11,1,40);R(g,'#fffaf0',px-1,FY+10,7,2);R(g,'#d9cfb9',px-1,FY+50,7,2)}
  for(let i=0;i<7;i++){const px=X+24+i*((W-40)/7);R(g,'#6b4a2b',px,FY+38,9,14);R(g,'#8a6a45',px+1,FY+39,3,12);R(g,'#8a6a45',px+5,FY+39,3,12);R(g,'#2b3a4a',px+1,FY+16,7,12);R(g,'#f0e6cf',px,FY+15,9,1)}
  R(g,'#d8d0bf',X+8,Y+H-4,W-16,2);R(g,'#c7bfae',X+6,Y+H-2,W-12,2);
  for(const lx of[X+8,X+W-11]){R(g,'#2a2a30',lx+1,FY+30,1,18);R(g,'#2a2a30',lx-1,FY+26,5,5);R(g,'#f7d77a',lx,FY+27,3,3)}
  break}
 case'hotel':{for(const ry of[FY+6,FY+20])for(let i=0;i<5;i++){const wx=X+10+i*31;cWin(g,wx,ry,12,10,{gl:'#3f5f78',sh:'#3f7d5a',mull:true});R(g,'#2a2a30',wx-3,ry+11,18,1);for(let k=0;k<18;k+=3)R(g,'#2a2a30',wx-3+k,ry+8,1,4)}
  R(g,'#3f7d5a',X+4,gy-4,W-8,3);for(let i=0;i<W-8;i+=6)R(g,i%12?'#f4f4f4':'#3f7d5a',X+4+i,gy-1,6,6);R(g,'rgba(0,0,0,.18)',X+4,gy+5,W-8,2);
  cWin(g,X+10,gy+8,30,12,{gl:'#55707f'});cWin(g,X+W-42,gy+8,30,12,{gl:'#55707f'});R(g,'#6b4a2b',X+W/2-8,gy+5,16,15);R(g,'#f2c94c',X+W/2+4,gy+12,2,2);
  R(g,'#c0473b',X+W-14,FY+4,8,26);for(let i=0;i<5;i++)cText(g,'HOTEL'[i],X+W-10,FY+5+i*5,5,'#fff7d6');
  break}
 case'soda':{for(let i=0;i<3;i++){const wx=X+10+i*38;cWin(g,wx,FY+8,14,11,{gl:'#5b7894',sill:'#9b523f'});for(let j=0;j<3;j++)R(g,j%2?'#f193b4':'#f2c94c',wx-1+j*5,FY+19,3,2)}
  R(g,'#8e8a80',X+4,FY+27,W-8,1);for(let i=0;i<6;i++)R(g,['#d64545','#3f7fd1','#f4f4f4','#f2c94c'][i%4],X+8+i*8,FY+28,5,4);
  for(let i=0;i<W-8;i+=6)R(g,i%12?'#f4f4f4':'#c0473b',X+4+i,gy-3,6,5);R(g,'#2a1e14',X+8,gy+3,W-16,16);R(g,'#c49d6c',X+8,gy+12,W-16,4);
  for(let i=0;i<5;i++){R(g,'#f4f4f4',X+14+i*20,gy+9,6,3);R(g,'#8a5a2b',X+15+i*20,gy+8,4,1)}
  R(g,'#1d1a24',X+W-30,gy-15,24,10);cText(g,'SODA',X+W-18,gy-14,6,'#f2c94c');
  break}
 case'banco':{R(g,'#2c4d72',X+4,FY+4,W-8,28);for(let i=0;i<W-8;i+=12){R(g,'#3d6894',X+4+i,FY+4,10,28);R(g,'#7fa9d2',X+6+i,FY+6,2,8)}R(g,'#aebdc8',X+4,FY+17,W-8,2);
  R(g,'#1f3550',X+W/2-30,gy-6,60,9);cText(g,'BANCO',X+W/2,gy-5,7,'#ffffff');
  cWin(g,X+8,gy+5,40,14,{gl:'#6f93b2',mull:false});R(g,'#bcd3e6',X+W/2-9,gy+4,18,16);R(g,'#7fa9d2',X+W/2-8,gy+5,7,14);R(g,'#7fa9d2',X+W/2+1,gy+5,7,14);
  const ax=X+W-40;R(g,'#2a2a30',ax,gy+2,16,18);R(g,'#57d17a',ax+3,gy+4,10,6);R(g,'#8a8f94',ax+4,gy+12,8,3);R(g,'#f2c94c',ax+2,gy-3,12,4);
  break}
 case'almacen':{for(let j=FY+3;j<FY+33;j+=4)for(let i=(j>>2)%2?0:6;i<W;i+=12)R(g,shade(b.wall,-.1),X+i,j,11,1);
  for(let i=0;i<6;i++)cWin(g,X+12+i*40,FY+10,14,12,{gl:'#4c6a80',sill:'#7a3f2c'});
  R(g,'#1f4e9c',X+W/2-36,gy-9,72,11);R(g,'#f7c600',X+W/2-36,gy+1,72,1);cText(g,'MONGE',X+W/2,gy-7,6,'#f7c600');
  for(let i=0;i<3;i++){const wx=X+10+i*84;R(g,'#efe9dc',wx-1,gy+3,62,17);R(g,'#dfe9ee',wx,gy+4,60,15);for(let k=0;k<8;k++)R(g,['#d64545','#3f7fd1','#7bb661','#f2994a','#2a2a30','#f193b4'][(k+i)%6],wx+3+k*7,gy+10+((k*3)%4),5,8)}
  // valla publicitaria en la azotea
  const vx=X+40,vy=Y+4;R(g,'#2a2a30',vx+10,vy+20,2,10);R(g,'#2a2a30',vx+66,vy+20,2,10);R(g,'#f4f4f4',vx,vy,80,22);R(g,'#2a8f6a',vx+2,vy+2,76,18);disc(g,'#f2c94c',vx+14,vy+11,6);cText(g,'PURA VIDA',vx+50,vy+8,6,'#ffffff');
  break}
 default:{cWin(g,X+12,FY+10,14,12,{gl:'#5b7894'});R(g,'#5c3d24',X+14,gy+2,18,18);R(g,'#f4ead2',X+6,gy-10,36,7);cText(g,'SE ALQUILA',X+24,gy-9,5,'#c0473b')}}
}
function drawMercado(g){const X=MERC.x*T,Y=MERC.y*T,W=MERC.w*T,H=MERC.h*T,fH=56,rH=H-fH,FY=Y+rH;
 // techos a dos aguas de zinc, en serie
 for(let s=0;s<W;s+=64){const sx=X+s,c=(s/64)%2?'#a6583f':'#9a5038';R(g,c,sx,Y,64,rH);for(let i=0;i<64;i+=3){R(g,shade(c,.2),sx+i,Y,1,rH);R(g,shade(c,-.12),sx+i+1,Y,1,rH)}
  R(g,shade(c,.45),sx+30,Y,4,rH);R(g,'rgba(190,220,225,.75)',sx+10,Y+12,10,rH-28);R(g,'rgba(190,220,225,.75)',sx+44,Y+12,10,rH-28);R(g,shade(c,-.45),sx+63,Y,1,rH)}
 R(g,'rgba(0,0,0,.28)',X,FY-4,W,4);
 // fachada
 const wall='#e6c47e';R(g,wall,X,FY,W,fH);R(g,'#3f7d5a',X,FY,W,5);R(g,'#2f5f45',X,FY+5,W,1);R(g,shade(wall,-.3),X,Y+H-2,W,2);
 const dX=MERC.dx*T+8;
 for(let ax=X+10;ax<X+W-24;ax+=36){if(Math.abs(ax+12-dX)<30)continue;R(g,'#2a1e14',ax,FY+18,24,34);disc(g,'#2a1e14',ax+12,FY+18,12);R(g,wall,ax-1,FY+5,26,7);
  for(let k=0;k<4;k++)R(g,['#f2994a','#7bb661','#d64545','#f2c94c','#f193b4'][(k+ax)%5],ax+3+k*5,FY+40+(k%2)*3,4,6);R(g,'#c49d6c',ax+2,FY+46,20,6);R(g,'#3f7d5a',ax-2,FY+52,28,2)}
 R(g,'#2a1e14',dX-18,FY+12,36,44);disc(g,'#2a1e14',dX,FY+14,18);R(g,'#3f7d5a',dX-20,FY+12,3,44);R(g,'#3f7d5a',dX+17,FY+12,3,44);
 R(g,'#1d1a24',dX-44,FY+5,88,10);cText(g,'MERCADO CENTRAL',dX,FY+6,7,'#f2c94c');cText(g,'1880',dX,FY+16,5,'#c49d6c');
 for(const[cx,col]of[[dX-30,'#f2994a'],[dX+24,'#7bb661']]){R(g,'#8a6a45',cx,FY+44,10,10);for(let k=0;k<3;k++)disc(g,col,cx+2+k*3,FY+44,2)}}
function drawSouthBase(g,s){const X=s.x*T,Y=34*T,W=s.w*T,H=6*T;
 R(g,s.roof,X,Y,W,H);for(let i=0;i<W;i+=3){R(g,shade(s.roof,.18),X+i,Y,1,H);R(g,shade(s.roof,-.12),X+i+1,Y,1,H)}R(g,shade(s.roof,-.4),X+W-1,Y,1,H);
 R(g,shade(s.c,-.35),X,Y,W,8);for(let i=6;i<W-8;i+=22)R(g,'#f7e4a0',i+X,Y+2,8,4);
 const k=s.x;R(g,'#2a2a30',X+W-18,Y+20,12,10);R(g,'#3b414a',X+W-18,Y+18,12,4);if(hsh(k,9)<.6){R(g,'#d5d8da',X+10,Y+30,12,8);for(let i=1;i<11;i+=2)R(g,'#a9adb0',X+10+i,Y+32,1,4)}}
function drawSouthTop(g,s){const X=s.x*T+3,Y=34*T,W=s.w*T-6;
 R(g,'rgba(0,0,0,.25)',X,Y-2,W,3);for(let i=0;i<W;i+=8)R(g,(i>>3)%2?'#f4f4f4':s.c,X+i,Y-8,Math.min(8,W-i),8);R(g,shade(s.c,.25),X,Y-8,W,1);
 for(let i=0;i<W;i+=8){R(g,(i>>3)%2?'#e6e6e6':shade(s.c,-.2),X+i,Y,Math.min(8,W-i),3);R(g,(i>>3)%2?'#e6e6e6':shade(s.c,-.2),X+i+2,Y+3,Math.min(4,W-i),1)}
 const tw=s.n.length*4+9;R(g,'#1d1a24',Math.round(X+W/2-tw/2),Y-18,tw,10);cText(g,s.n,X+W/2,Y-16,6,'#fff7d6')}

// ---------- objetos de la ciudad ----------
function cityObj(g,o){const X=o.x*T,Y=o.y*T,W=o.w*T,H=o.h*T;
 switch(o.type){
 case'templete':R(g,'rgba(0,0,0,.22)',X+2,Y+H-6,W,8);R(g,'#c9c2b2',X,Y+H-16,W,16);R(g,'#ddd6c6',X+2,Y+H-16,W-4,2);R(g,'#b4ad9c',X,Y+H-6,W,2);R(g,'#e9e3d5',X+4,Y+10,W-8,H-26);
  for(let i=0;i<6;i++){const cx=X+8+i*((W-20)/5);R(g,'#f6f2e8',cx,Y+8,5,H-24);R(g,'#d3ccbc',cx+4,Y+8,1,H-24)}break;
 case'marimba':R(g,'#5c3d24',X+2,Y+8,2,8);R(g,'#5c3d24',X+W-4,Y+8,2,8);R(g,'#7a4b2a',X,Y+4,W,5);for(let i=0;i<14;i++)R(g,i%2?'#c98a4a':'#a8703c',X+2+i*2,Y+2,2,4);for(let i=0;i<7;i++)R(g,'#3a2a1e',X+3+i*4,Y+9,2,4+(i%3));break;
 case'kioscoP':R(g,'rgba(0,0,0,.22)',X+2,Y+H-4,W,5);R(g,'#2f7a52',X+2,Y+6,W-4,H-8);R(g,'#246343',X,Y+2,W,6);R(g,'#f2c94c',X+4,Y+3,W-8,3);
  for(let i=0;i<5;i++)R(g,['#f4f4f4','#d64545','#f2c94c','#7fc3e8','#f193b4'][i],X+5+i*4,Y+16+(i%2)*2,4,8);R(g,'#1d1a24',X+4,Y+10,W-8,4);break;
 case'taxis':R(g,'#2a2a30',X+7,Y,2,16);R(g,'#f2c94c',X+1,Y-8,14,8);R(g,'#1d1a24',X+1,Y-8,14,1);cText(g,'TAXI',X+8,Y-7,5,'#1d1a24');break;
 case'farol':case'farolS':R(g,'rgba(0,0,0,.25)',X+4,Y+12,9,3);R(g,'#2a2a30',X+6,Y+8,4,6);R(g,'#3a3a42',X+7,Y,2,10);break;
 case'jardinera':R(g,'rgba(0,0,0,.2)',X+1,Y+12,W,4);R(g,'#b9b1a1',X,Y+2,W,12);R(g,'#d2cbbd',X,Y+2,W,2);R(g,'#5a3f2a',X+2,Y+4,W-4,6);break;
 case'basurero':R(g,'rgba(0,0,0,.2)',X+3,Y+12,11,3);R(g,'#2f7a52',X+4,Y+2,8,12);R(g,'#246343',X+3,Y+1,10,2);R(g,'#5fb07e',X+5,Y+4,1,8);break;
 case'copos':R(g,'rgba(0,0,0,.22)',X+2,Y+12,W-2,4);R(g,'#f4f4f4',X+2,Y+2,W-4,10);R(g,'#2a6fb0',X+2,Y+8,W-4,2);disc(g,'#2a2a30',X+6,Y+13,2);disc(g,'#2a2a30',X+W-6,Y+13,2);
  R(g,'#cfeefa',X+5,Y-4,10,6);R(g,'#ffffff',X+6,Y-3,8,4);for(let i=0;i<3;i++)R(g,['#d64545','#f2c94c','#f2994a'][i],X+18+i*3,Y-3,2,6);cText(g,'COPOS',X+W/2,Y+3,5,'#c0473b');break;
 }}
function cityObjTop(g,o){const X=o.x*T,Y=o.y*T,W=o.w*T;
 if(o.type==='farol'){R(g,'#3a3a42',X+7,Y-22,2,24);R(g,'#2a2a30',X+4,Y-28,8,7);R(g,'#f7d77a',X+5,Y-27,6,5);R(g,'#2a2a30',X+3,Y-29,10,2);R(g,'#2a2a30',X+7,Y-31,2,2)}
 else if(o.type==='farolS'){R(g,'#7d8288',X+7,Y-34,2,48);R(g,'#7d8288',X+7,Y-34,10,2);R(g,'#2a2a30',X+13,Y-33,7,3);R(g,'#f7efc0',X+14,Y-31,5,1)}
 else if(o.type==='templete'){const cx=X+W/2,yy=Y-8;R(g,'rgba(0,0,0,.18)',X+2,Y+12,W-4,4);R(g,'#3f6b63',X-2,yy+14,W+4,5);for(let i=0;i<8;i++){const w=W-6-i*10;R(g,i%2?'#5d8f86':'#6a9d93',cx-w/2,yy+14-i*3,w,3)}R(g,'#79aba1',cx-14,yy+8,10,2);R(g,'#d8b45a',cx-1,yy-14,3,6);disc(g,'#d8b45a',cx,yy-15,2)}
 else if(o.type==='jardinera'){for(let i=0;i<4;i++){disc(g,i%2?'#3f8a3e':'#4c9a47',X+5+i*7,Y+1,5)}R(g,'#f193b4',X+8,Y-2,2,2);R(g,'#f2c94c',X+20,Y,2,2)}
 else if(o.type==='copos'){R(g,'#7a7a82',X+W/2,Y-24,1,22);for(let i=0;i<9;i++)R(g,['#d64545','#f4f4f4','#f2c94c'][i%3],X+W/2-18+i*4,Y-28+Math.abs(i-4),4,4+(4-Math.abs(i-4)))}}
function chepePre(g,m){CHB.forEach(b=>drawCityB(g,b));drawMercado(g);CHS.forEach(s=>drawSouthBase(g,s));
 R(g,'#57524b',0,0,m.w*T,T);for(let i=0;i<m.w*T;i+=24){R(g,'#4a4640',i,4,14,8);R(g,'#2a2a30',i+16,0,1,10)}
 for(const[x,y]of m.trees){const X=x*T,Y=y*T;R(g,'rgba(0,0,0,.2)',X+1,Y+11,14,5);R(g,'#5e4128',X+5,Y-2,6,15);R(g,'#4b331f',X+5,Y-2,2,15);R(g,'#6d4c30',X+3,Y+11,10,3)}}
function chepeObjs(g,m){for(const o of m.objs)cityObj(g,o)}
function chepeTop(g,m){for(const o of m.objs)cityObjTop(g,o);CHS.forEach(s=>drawSouthTop(g,s));
 for(const[x,y]of m.trees){const X=x*T+8,Y=y*T;disc(g,'#245c2c',X,Y-12,17);disc(g,'#2e6e33',X-3,Y-15,14);disc(g,'#3f8a3e',X-5,Y-19,9);disc(g,'#58a64c',X-8,Y-23,3);for(let i=0;i<10;i++)R(g,'#6eb75a',X-12+((hsh(x+i,y)*24)|0),Y-26+((hsh(y+i,x)*22)|0),2,1)}
 R(g,'#7f8a90',2*T-2,13*T-10,4*T+4,6);R(g,'#a3acb2',2*T-2,13*T-10,4*T+4,2)}

// ---------- puestos del Mercado ----------
// Los puestos del fondo (rev) atienden de espaldas a la cámara: el vendedor queda delante del mostrador.
function drawPuesto(g,p,front){const X=p.x*T,Y=p.y*T,W=p.w*T,H=(p.h||1)*T,cy=p.rev?Y:Y+H-T;
 const shelfY=p.rev?Y+T:Y,goods=(gx,gy,gw,gh)=>puestoGoods(g,p.k,gx,gy,gw,gh);
 if(!front&&p.h>1){R(g,'#6b4a2b',X,shelfY,W,H-T);R(g,'#5c3d24',X,shelfY,W,2);goods(X+2,shelfY+3,W-4,H-T-6)}
 R(g,'rgba(0,0,0,.2)',X,cy+14,W,3);R(g,'#8a5a33',X,cy+4,W,11);for(let i=0;i<W;i+=8)R(g,'#7a4b2a',X+i,cy+5,1,10);R(g,'#c99a62',X,cy,W,5);R(g,'#dcb27c',X,cy,W,1);
 goods(X+2,cy-6,W-4,7)}
function puestoGoods(g,k,X,Y,W,H){const n=Math.max(1,(W/6)|0);
 for(let i=0;i<n;i++){const x=X+i*6,v=hsh(i,k.length);
  switch(k){
  case'soda':if(i%3===0){R(g,'#f4f4f4',x,Y+H-3,5,3);R(g,'#7a4b2a',x+1,Y+H-4,3,1)}else if(i%3===1){R(g,'#2a2a30',x,Y+H-6,5,6);R(g,'#4a4a52',x,Y+H-6,5,1)}break;
  case'sorbetera':if(i%2===0){R(g,'#8a6a45',x,Y+H-7,6,7);R(g,'#c9ccd0',x+1,Y+H-9,4,4);R(g,'#eef6fa',x+1,Y+H-3,4,1)}else{R(g,'#e0a34f',x+2,Y+H-5,2,5);disc(g,'#f6e7c8',x+3,Y+H-6,2)}break;
  case'cafe':R(g,'#c9a46a',x,Y+H-6,5,6);R(g,'#5a3a22',x+1,Y+H-6,3,2);if(i===1){R(g,'#c0473b',x,Y+H-9,5,4)}break;
  case'chicharron':R(g,'#d9a04a',x+1,Y,3,H-2);R(g,'#b67a2c',x+1,Y+H-3,3,1);break;
  case'hierbas':if(v<.5){R(g,'#3f8a3e',x,Y+1,5,H-2);R(g,'#58a64c',x+1,Y,2,2)}else{R(g,'rgba(220,240,250,.7)',x,Y+H-6,5,6);R(g,['#c0392b','#f2c94c','#7bb661','#8a5a2b'][i%4],x+1,Y+H-4,3,3)}break;
  case'flores':R(g,'#7f8a90',x,Y+H-4,5,4);disc(g,['#f2c94c','#d64545','#f4f4f4','#f193b4','#f2994a'][i%5],x+2,Y+H-6,2);R(g,'#3f8a3e',x+2,Y+H-4,1,2);break;
  case'recuerdos':if(i%2===0){R(g,['#d64545','#f2c94c','#2a6fb0'][i%3],x,Y+H-5,5,3);disc(g,'#f2994a',x+1,Y+H-1,1);disc(g,'#7bb661',x+4,Y+H-1,1)}else{R(g,['#7bb661','#f4f4f4','#d64545'][i%3],x,Y+1,5,6);R(g,'#1d1a24',x+1,Y+3,3,1)}break;
  case'frutas':disc(g,['#f2994a','#f2c94c','#e05d3a','#7bb661','#d64545'][i%5],x+2,Y+H-3,2);disc(g,['#e0a34f','#d64545','#f2c94c'][i%3],x+3,Y+H-6,2);break;
  case'granos':R(g,'#c9a46a',x,Y+H-6,5,6);R(g,['#f4f4f4','#2a2a30','#8e2f26','#f2c94c'][i%4],x+1,Y+H-6,3,2);break;
  case'artesania':if(i%2){disc(g,'#8a5a2b',x+2,Y+H-3,2)}else{R(g,['#d64545','#f2c94c','#2a6fb0'][i%3],x,Y+1,5,6);R(g,'#1d1a24',x+1,Y+3,1,1);R(g,'#1d1a24',x+3,Y+3,1,1)}break;
  case'pescado':R(g,'#dff1f6',x,Y+H-4,6,4);R(g,'#9fb3bf',x+1,Y+H-4,4,2);break;}}}
function puestoSign(g,o,Y){const w=o.lab.length*4+9,cx=Math.round(o.x*T+o.w*T/2);R(g,'#1d1a24',cx-(w>>1),Y,w,10);R(g,'#f4ead2',cx-(w>>1)+1,Y+1,w-2,8);cText(g,o.lab,cx,Y+2,5,'#7a2e1f')}
function mercadoBase(g,m){for(const o of m.objs)if(o.type==='puesto'){drawPuesto(g,o);if(o.y===3)puestoSign(g,o,T+2)}
 disc(g,'#f4f4f4',13.5*T,T+8,5);R(g,'#14101c',13.5*T,T+4,1,4);R(g,'#14101c',13.5*T,T+8,3,1)}
function mercadoTop(g,m){for(const o of m.objs){if(o.type!=='puesto'||o.y===3)continue;const Y=o.y*T-(o.rev?14:24),w=o.lab.length*4+9,cx=Math.round(o.x*T+o.w*T/2);
  R(g,'#2a2a30',cx-w/2+3,Y-6,1,6);R(g,'#2a2a30',cx+w/2-4,Y-6,1,6);puestoSign(g,o,Y)}
 for(const y of[4.6,9.6])for(let x=1;x<25;x++){R(g,'rgba(20,18,24,.6)',x*T,y*T,T,1);R(g,['#d64545','#f2c94c','#3f7fd1','#7bb661'][x%4],x*T+4,y*T+1,5,5)}
 for(const x of[4,11,16,22]){R(g,'#14101c',x*T,0,1,T*2+6);R(g,'#f7d77a',x*T-2,T*2+6,5,5)}}

// ---------- gente de Chepe ----------
Object.assign(ITEMS,{helado:['Helado de sorbetera','De leche y canela, del Mercado Central. Se derrite: mejor entregarlo hoy.'],culantro:['Culantro coyote y achiote','Del tramo de hierbas del Mercado Central.'],
 ramo:['Ramo de girasoles','Del tramo de flores del Mercado. Alegran cualquier casa.'],rosa:['Una rosa','Roja, sola y con espinas. Muy de telenovela.'],cafeb:['Café del Mercado','Bolsa de café de altura, tostado oscuro y molido ahí mismo.'],
 frijoles:['Bolsa de frijoles','Frijoles rojos del Mercado, seleccionados a mano. Para una olla de la abuela.'],mascara:['Máscara de diablito','Una mascarita de Boruca tallada y pintada a mano. Para colgar en la casa.'],carreta:['Carreta de recuerdo','Una carretica pintada a mano, de Sarchí. Para la casa.'],pancasero:['Pan casero','De la panadería de la Avenida Central. Se puede comer.']});
// SHOP_USE se declara más abajo en el archivo (sección de la pulpería): se completa cuando ya existe.
setTimeout(()=>{SHOP_USE.pancasero='Comer';SHOP_USE_MSG.pancasero='Pan casero todavía tibio. Te lo comés en tres mordiscos.'},0);
const ENC={helado:{item:'helado',t:'Un helado de sorbetera',where:'el tramo de helados del Mercado Central'},culantro:{item:'culantro',t:'Culantro coyote y achiote',where:'el tramo de hierbas del Mercado Central'}};
const CHEPE_LINES=['¡Voy tarde, mae, perdón!','¿Usted sabe dónde se agarra el bus para Desamparados?','Ese hueco de la esquina ya va a cumplir años.','¡Qué presa la de la Segunda! Diay, como siempre.',
 'Si va al Mercado, la soda del fondo es la buena.','Aquí todo el mundo anda con prisa y nadie llega a tiempo.','Me robaron la sombrilla. En Chepe. En pleno invierno. Una tragedia.','¿Ya vio la estatua de plata? Yo juro que una vez me guiñó el ojo.','Voy a sacar la cédula al Registro. Llevo tres intentos. Esta vez llevo almuerzo.','En la Avenida Central cuide el celular, que aquí los carteristas son artistas.','¿Usted sabe si el tren todavía pasa? Mi abuela dice que antes uno iba en tren a Puntarenas.'];
const MERC_LINES=['¡Qué caro está todo, Virgen santa!','Aquí venía con mi mamá cuando era chiquita.','¿Usted sabe dónde está el de las llaves? Me perdí entre los tramos.','El helado de sorbetera es sagrado. No acepto discusión.'];
function zPed(map,x,y,look,o){const c=fillChar(Object.assign({v:1,pants:'#2d3346'},look));const e=Object.assign({kind:'ped',z:1,c,map,x:x*T+8,y:y*T+12,dir:0,fr:0,anim:0,path:null,wt:rnd(.5,3),hx:x,hy:y,shT:rnd(2,9)},o||{});ENTS.push(e);return e}
function walkerTalk(e){say(e.c,S.rain&&Math.random()<.5?'Este aguacero no estaba en el pronóstico. Ni en mis planes.':rot(e.c.id,e.map==='mercado'?MERC_LINES:CHEPE_LINES))}
function chepePeople(){
 const W=(id,name,x,y,area,look)=>zPed('chepe',x,y,Object.assign({id,name},look),{wander:1,area,talk:walkerTalk,sp:rnd(26,36)});
 const blv=[2,61,28,33],park=[1,21,13,27];
 W('z_ofi','Oficinista',30,29,blv,{hair:'corto',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#f4f4f4',pants:'#2a2a30',acc:'lentes'});
 W('z_cole','Colegial',40,31,blv,{hair:'corto',hairColor:'#2a1810',skin:'#e0ac69',shirt:'#f4f4f4',pants:'#2d3a6e'});
 W('z_bolsas','Doña con bolsas',50,30,blv,{hair:'moño',hairColor:'#5a4a40',skin:'#d9a066',shirt:'#e85d75',pants:'#3a2e4c'});
 W('z_gorra','Mae de gorra',20,32,blv,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f2c94c',acc:'gorra',accColor:'#2a6fb0'});
 W('z_abuelo','Abuelito',5,20,park,{hair:'calvo',hairColor:'#d8d8d8',skin:'#b97a4a',shirt:'#a6d8cb',acc:'sombrero',accColor:'#e8dcc4'});
 W('z_cole2','Colegiala',15,25,park,{hair:'cola',hairColor:'#2a1810',skin:'#c68642',shirt:'#f4f4f4',pants:'#2d3a6e'});
 W('z_senora','Señora',24,16,[22,25,12,33],{hair:'largo',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#7bb661'});
 W('z_turista2','Turista',58,24,[58,62,13,33],{hair:'largo',hairColor:'#e8d18a',skin:'#f1c9a5',shirt:'#f2994a',acc:'sombrero',accColor:'#e8dcc4'});
 const ST=(id,name,x,y,look,talk,sh,o)=>zPed('chepe',x,y,Object.assign({id,name},look),Object.assign({stat:1,talk,sh},o||{}));
 ST('z_chalo','Don Chalo',16,30,{hair:'corto',hairColor:'#cfcfcf',skin:'#b97a4a',shirt:'#e8e8e8',pants:'#5a5f66',acc:'sombrero',accColor:'#c9a46a'},chaloTalk,['¡Raspadita, raspadita!','¡Lleve la suerte, joven!','¡Termina en siete, como su suerte!']);
 ST('z_mireya','Doña Mireya',30,31,{hair:'moño',hairColor:'#2b1a10',skin:'#c68642',shirt:'#f4f4f4',pants:'#2a6fb0',acc:'aretes',accColor:'#f2c94c'},mireyaTalk,['¡Copos, copos bien fríos!','¡Copo con leche y sirope!']);
 ST('z_estatua','Hombre de Plata',44,30,{hair:'calvo',hairColor:'#c9ced4',skin:'#b8bec6',shirt:'#9aa1a9',pants:'#8a9199',acc:'sombrero',accColor:'#c9ced4'},estatuaTalk,null,{d0:0});
 ST('z_walter','Don Wálter',10,22,{hair:'corto',hairColor:'#d8d8d8',skin:'#8d5524',shirt:'#f4f4f4',pants:'#2a2a30',acc:'sombrero',accColor:'#2a2a30'},walterTalk,['♪ ♫ ♪','¡Una piecita, una piecita!'],{d0:2});
 ST('z_tere','Doña Tere',14,23,{hair:'moño',hairColor:'#e8e8e8',skin:'#d9a066',shirt:'#d6b6d9',pants:'#3a2e4c',acc:'anteojos'},tereTalk,['Pruu, pruu…']);
 ST('z_kyle','Kyle',23,20,{hair:'corto',hairColor:'#e8d18a',skin:'#f1c9a5',shirt:'#7fc3e8',pants:'#8a6a45',acc:'gorra',accColor:'#3fa66b'},kyleTalk,['¿Dónde... el Teatro... dónde?','Excuse me… ¿perdón?']);
 ST('z_mario','Don Mario',59,12,{hair:'corto',hairColor:'#3a3a3a',skin:'#c68642',shirt:'#c8231e',pants:'#2a2a30',acc:'bigote'},marioTalk,['¡Taxi, taxi!','Rojito y con maría, joven.']);
 ST('z_guarda','Guarda del banco',40,8,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#2d3a6e',pants:'#2a2a30',acc:'gorra',accColor:'#1d2a4a'},guardaTalk,null,{d0:0});
 // Mercado
 const MV=(id,name,x,y,look,talk,sh)=>zPed('mercado',x,y,Object.assign({id,name},look),{stat:1,talk,sh,reach:38,d0:y===2||y===6?0:1});
 MV('z_yoli','Doña Yoli',4,2,{hair:'moño',hairColor:'#2b1a10',skin:'#c68642',shirt:'#f193b4',acc:'aretes',accColor:'#f2c94c'},yoliTalk,['¡Casados, pase adelante!','¡Gallo pinto con natilla!']);
 MV('z_fito','Don Fito',10,2,{hair:'calvo',hairColor:'#5a4a40',skin:'#e0ac69',shirt:'#f4f4f4',acc:'bigote'},fitoTalk,['¡Helados de sorbetera!']);
 MV('z_ceci','Doña Cecilia',15,2,{hair:'largo',hairColor:'#7a7a7a',skin:'#d9a066',shirt:'#8a5a2b',acc:'anteojos'},ceciTalk,['¡Café recién molido!']);
 MV('z_memo','Don Memo',21,2,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#d64545',acc:'barba'},memoTalk,['¡Chicharrones con yuca!']);
 MV('z_rigo','Don Rigo',4,6,{hair:'corto',hairColor:'#d8d8d8',skin:'#b97a4a',shirt:'#7bb661',acc:'sombrero',accColor:'#c9a46a'},rigoTalk,['¡Hierbas, achiote, culantro!']);
 MV('z_flor','Doña Flor',12,6,{hair:'rizos',hairColor:'#2b1a10',skin:'#8d5524',shirt:'#f2c94c'},florTalk,['¡Flores, flores!']);
 MV('z_chepe','Don Chepe',20,6,{hair:'corto',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#3f7fd1',acc:'lentes'},chepeTalk,['¡Recuerdos de Costa Rica!']);
 MV('z_lidia','Doña Lidia',9,13,{hair:'moño',hairColor:'#4a3a30',skin:'#d9a066',shirt:'#e8dcc4',acc:'anteojos'},lidiaTalk,['¡Frijoles, arroz, lentejas!']);
 MV('z_tavo','Don Tavo',17,13,{hair:'largo',hairColor:'#1c1c1c',skin:'#a8672f',shirt:'#c0473b',acc:'collar',accColor:'#f2c94c'},tavoTalk,['¡Máscaras de Boruca!']);
 MV('z_mari','Doña Marisol',23,13,{hair:'cola',hairColor:'#2b1a10',skin:'#c68642',shirt:'#3fb6b0',acc:'aretes',accColor:'#f4f4f4'},mariTalk,['¡Ceviche fresquito!']);
 MV('z_ana','Doña Ana',3,13,{hair:'cola',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#f2994a'},anaTalk,['¡Mango, pejibaye!']);
 for(const[i,x,y]of[[0,8,9],[1,17,10],[2,13,4]])zPed('mercado',x,y,{id:'z_comp'+i,name:['Señora','Muchacho','Abuela'][i],hair:['moño','corto','moño'][i],hairColor:['#3b2416','#1c1c1c','#e8e8e8'][i],skin:['#e0ac69','#8d5524','#d9a066'][i],shirt:['#3fb6b0','#d64545','#a9c8ef'][i]},{wander:1,area:[1,24,4,11],talk:walkerTalk,sp:22})}

function chaloTalk(e){const c=e.c;say(c,'¡Raspadita, joven! Quinientos colones y puede irse con diez rojos en la bolsa.',[
 {t:'Comprar una raspadita (₡500)',f(){zBuy(500,()=>{const r=Math.random();say(null,'Raspás con una moneda, despacito, como si eso ayudara…');
  if(r<.04){earn(10000,'Raspadita');say(c,'¡DIEZ ROJOS! ¡Diez mil colones! ¡Le dije que terminaba en siete!');beepSeq([784,988,1318,1568])}
  else if(r<.2){earn(1000,'Raspadita');say(c,'Mil colones. Recuperó la plata y le sobra pa\'l fresco. ¡Así se empieza!')}
  else say(c,rot('chalo',['«Siga participando». La suerte está calentando, joven.','Nada… Pero mire, ya estuvo cerquita. Eso cuenta.','Hoy no fue. Mañana termina en siete, se lo juro.']))})}},
 {t:'¿Cómo va la venta?',f(){say(c,rot('chalo2',['Cuarenta años vendiendo lotería en esta esquina. He visto pasar presidentes, papas y una vaca que se soltó del tope.','Lenta. La gente ya no cree en la suerte. Yo sí. Si no, ¿qué hago aquí?']))}},
 {t:'Hoy no, Don Chalo'}])}
function mireyaTalk(e){const c=e.c;say(c,'¿Un copito, mi amor? Con leche en polvo y leche condensada, como se come un copo. Lo demás es granizado de gringo.',[
 {t:'Un copo (₡1 000)',f(){zBuy(1000,()=>{enAdd(12);say(null,'Hielo raspado, sirope de kola, leche en polvo y un chorro de condensada. Te duele la cabeza de lo frío y no te importa. +12⚡')})}},
 {t:'¿Desde cuándo vende copos?',f(){say(c,'Treinta y dos años en esta misma esquina. Vi cuando hicieron el bulevar, vi cuando lo arreglaron y lo veré cuando lo vuelvan a romper.')}},
 {t:'Después, Doña Mireya'}])}
function estatuaTalk(e){const t=TR();say(null,'Un hombre pintado de plata de pies a cabeza. No parpadea. Ni respira, parece.',[
 {t:'Echarle ₡100 en el sombrero',f(){zBuy(100,()=>{t.estatua++;e.dir=pick([2,3]);
  if(t.estatua===1)say(null,'La estatua cobra vida: te hace una reverencia lentísima y se vuelve a congelar.');
  else if(t.estatua===2)say(null,'Esta vez te guiña un ojo. Una señora que pasa pega un grito del susto.');
  else{say(e.c,'(susurrando) Mae, ¿me hace un favor? Si ve venir a uno de la Municipalidad, me avisa. No tengo permiso.');say(null,'Y se congela otra vez, como si nada.')}})}},
 {t:'Hacerle muecas',f(){say(null,'Ni se inmuta. Un chiquito se pone a tu lado a hacerle muecas también. Gana la estatua.')}},{t:'Seguir caminando'}])}
function walterTalk(e){const c=e.c;say(c,'¿Una piecita, joven? La marimba es instrumento nacional, pero la gente pasa como si fuera un poste.',[
 {t:'Darle ₡200 para que toque',f(){zBuy(200,()=>{afterD(()=>{playMarimba();say(null,'Don Wálter toca una pieza alegre, de esas de turno de pueblo. Dos señoras se ponen a bailar frente al templete.');runDialog()})})}},
 {t:'¿Hace cuánto toca aquí?',f(){say(c,'Desde que mis hijos estaban en la escuela. Ahora ellos tienen hijos… y yo sigo aquí, con la misma marimba y el mismo sombrero.')}},{t:'Seguir'}])}
let FEED=null;
function tereTalk(e){const c=e.c;say(c,'Las palomas de este parque son más vivas que uno. Mire cómo lo están viendo.',[
 {t:'Comprarle maíz (₡200)',f(){zBuy(200,()=>{FEED={x:P.x,y:P.y,t:22};say(null,'Tirás un puño de maíz y medio parque de palomas te cae encima. Una se te para en el zapato.')})}},
 {t:'¿Viene todos los días?',f(){say(c,'Todos. Desde que enviudé. Ellas no hablan, pero tampoco preguntan. Eso se agradece.')}},{t:'Seguir'}])}
function kyleTalk(e){const c=e.c,t=TR();
 if(t.kyle===1){say(c,'¡Hey, amigo! El teatro es beautiful. Mármol, oro… ¡tuanis! ¿Se dice así?');return}
 if(t.kyle===2){say(c,'Llegué a una zapatería. Compré zapatos. No era el teatro. Pero son buenos zapatos.');return}
 say(c,'Eh… ¿hola? Sorry. ¿Dónde… está… el Teatro Nacional? Mi mapa dice «aquí», pero aquí es un parque.',[
 {t:'Al norte, cruzando la Avenida Segunda',f(){t.kyle=1;earn(1500,'Propinas');say(c,'¡Oh! ¡Pura vida, man! Tome, for the coffee. ¿Se dice «pa\'l café»?');say(null,'Kyle te da ₡1 500 y se va feliz… en la dirección correcta.')}},
 {t:'Al sur, por el bulevar',f(){t.kyle=2;say(c,'¡Muchas gracias!');say(null,'Kyle se va hacia el sur muy convencido. Te queda un cargo de conciencia chiquitito.')}},
 {t:'Mae, ni idea',f(){say(c,'No problem… le pregunto a la paloma.')}}])}
function marioTalk(e){const c=e.c,night=hour()>=22||hour()<5,price=night?8500:7000;
 say(c,'¿Taxi, joven? Rojito y con maría, como debe ser.'+(night?' A esta hora es tarifa nocturna.':''),[
 {t:'Al barrio ('+fmtC(price)+')',f(){if(S.money<price){say(c,'Diay, con eso no le llego ni a la rotonda. Lo siento.');return}afterD(()=>taxiHome(price))}},
 {t:'¿Cómo está la calle?',f(){say(c,rot('mario',['Presa en la Segunda, presa en la Central y presa en mi paciencia.','Tranquilo. Demasiado tranquilo. Ahorita algo pasa.']))}},{t:'Solo preguntaba'}])}
function guardaTalk(e){say(e.c,rot('guarda',['Buenas. Para entrar al banco: sin gorra y sin lentes oscuros, por favor.','Si va al cajero, cuidado con la plata. En Chepe hay mucho mae buzo.','Aquí, cuidando. Ocho horas de pie. Mis rodillas ya votaron en contra.']))}
function yoliTalk(e){const c=e.c,t=TR();say(c,t.yoli?'¡Volvió mi cliente favorito! ¿Qué le sirvo?':'¡Pase adelante, mi amor! Esta soda la abrió mi abuela en 1958. ¿Qué le sirvo?',[
 {t:'Un casado (₡2 800)',f(){zBuy(2800,()=>{t.yoli=1;enAdd(40);say(c,'Casado de bistec encebollado: arroz, frijoles, ensalada de repollo, maduro y picadillo de papa. Y el fresco de cas va por la casa.');say(null,'Comés como si fuera la última comida del mundo. +40⚡')})}},
 {t:'Gallo pinto con café (₡1 800)',f(){zBuy(1800,()=>{t.yoli=1;enAdd(25);say(null,'Gallo pinto con natilla, huevo frito y un café chorreado de los de verdad. +25⚡')})}},
 {t:'Solo un café (₡700)',f(){zBuy(700,()=>{enAdd(8);say(c,'Cafecito chorreado en bolsita de tela. Como Dios manda.')})}},{t:'Gracias, Doña Yoli'}])}
function fitoTalk(e){const c=e.c,t=TR(),enc=t.enc.helado&&!t.enc.helado.done;
 say(c,'Helado de sorbetera: leche, canela, clavo de olor y paciencia. La receta no se la doy ni a mi esposa.'+(enc?' ¿Es para la novia? Entonces llévelo rapidito, que el amor y el helado no esperan.':''),[
 {t:'Uno para llevar (₡1 200)',f(){zBuy(1200,()=>{addI('helado');t.heladoDay=S.day;say(c,'Se lo pongo en vasito con tapa. Si se le derrite, cuenta como batido.')})}},
 {t:'Uno para comer aquí (₡1 000)',f(){zBuy(1000,()=>{enAdd(8);say(null,'Frío, canela, infancia. +8⚡')})}},
 {t:'¿Se derrite rápido?',f(){say(c,'Si lo lleva en el bus… digamos que llega como fresco. Pero el detalle es el detalle.')}},{t:'Gracias'}])}
function ceciTalk(e){const c=e.c;say(c,'Café de altura, tostado oscuro, molido aquí mismo. ¡Huela eso!',[
 {t:'Bolsa de café (₡2 500)',f(){zBuy(2500,()=>{addI('cafeb');say(c,'Ese café le gana a cualquiera. Hasta a un suegro.')})}},
 {t:'Un cafecito chorreado (₡600)',f(){zBuy(600,()=>{enAdd(8);say(null,'Fuerte, caliente, sin azúcar. Te despierta hasta las ideas. +8⚡')})}},{t:'Gracias'}])}
function memoTalk(e){say(e.c,'Chicharrones con yuca y limón. Pa\' la goma no hay nada mejor.',[
 {t:'Una porción (₡1 500)',f(){zBuy(1500,()=>{enAdd(15);say(null,'Crujientes, salados, con limón mandarina. Te chupás los dedos sin vergüenza. +15⚡')})}},{t:'Gracias'}])}
function rigoTalk(e){const c=e.c,t=TR(),enc=t.enc.culantro&&!t.enc.culantro.done;
 say(c,'Culantro coyote, achiote, sábila, hierbabuena, tilo para los nervios… ¿Qué busca?'+(enc?' Por la cara, a usted lo mandaron.':''),[
 {t:'Culantro coyote y achiote (₡1 500)',f(){zBuy(1500,()=>{addI('culantro');say(c,'Para un arroz de fiesta. Salude a quien lo mandó.')})}},
 {t:'¿Algo para los nervios?',f(){say(c,'Tilo. Y apagar el celular un rato. Lo segundo es gratis.')}},{t:'Gracias'}])}
function florTalk(e){const c=e.c;say(c,'Girasoles, rosas, lirios… ¿Para quién son? Por la cara, para alguien especial.',[
 {t:'Ramo de girasoles (₡3 500)',f(){zBuy(3500,()=>{addI('ramo');say(c,'Los girasoles siempre buscan la luz. Como uno cuando está enamorado.')})}},
 {t:'Una rosa (₡1 000)',f(){zBuy(1000,()=>{addI('rosa');say(c,'Una sola rosa dice más que un ramo. O eso dicen los que no tienen plata.')})}},{t:'Solo estoy viendo'}])}
function chepeTalk(e){const c=e.c;say(c,'Carretas pintadas a mano, hamacas, camisetas de «Pura vida»… Todo hecho en Sarchí, menos las camisetas, que vienen de quién sabe dónde.',[
 {t:'Una carreta de recuerdo (₡2 000)',f(){zBuy(2000,()=>{addI('carreta');say(c,'Para que se acuerde de Chepe cada vez que la vea.')})}},{t:'Solo estoy viendo'}])}
function lidiaTalk(e){const c=e.c;say(c,'Frijoles rojos, negros, arroz de grano largo, lentejas, garbanzos… Todo escogido a mano, que aquí no se vende gato por liebre.',[
 {t:'Bolsa de frijoles (₡1 800)',f(){zBuy(1800,()=>{addI('frijoles');say(c,'Póngalos en remojo desde la noche. Y no les eche sal hasta el final, que se ponen duros.')})}},
 {t:'¿Cuál es la diferencia entre rojos y negros?',f(){say(c,'Los rojos son de domingo y los negros de martes. Así de fácil. Y el gallo pinto de verdad se hace con los de ayer, nunca con los recién cocinados.')}},{t:'Gracias, Doña Lidia'}])}
function tavoTalk(e){const c=e.c;say(c,'Estas máscaras las tallan en Boruca, en la zona sur. Cada diablito lleva su cara y su historia. No es ningún souvenir de aeropuerto.',[
 {t:'Máscara de diablito (₡4 500)',f(){zBuy(4500,()=>{addI('mascara');say(c,'Cuélguela donde la vea cada mañana. Dicen que espanta lo malo… y a los suegros metiches.')})}},
 {t:'¿Qué representan los diablitos?',f(){say(c,'Cada febrero, en la fiesta de los Diablitos, los indígenas bruncas pelean contra los españoles, representados por el toro. El toro siempre gana. Y todos lo saben: es pura memoria.')}},{t:'Solo estoy viendo'}])}
function mariTalk(e){const c=e.c;say(c,'Corvina, camarones, pulpo, mejillones… Lo que llegó hoy de Puntarenas, todavía huele a mar.',[
 {t:'Un vasito de ceviche (₡2 200)',f(){zBuy(2200,()=>{enAdd(14);say(null,'Corvina cruda en limón, con cilantro, cebolla morada y un golpe de chile. Con galleta soda. Te sentís capaz de correr una maratón. +14⚡')})}},
 {t:'¿Cómo sé si el pescado está fresco?',f(){say(c,'Ojos brillantes, agallas rojas y que no huela a pescado. Si huele a pescado, no es fresco. Eso lo aprende uno rápido.')}},{t:'Gracias'}])}
function anaTalk(e){say(e.c,'¡Mango verde con sal y limón, pejibayes calientitos, cas, guanábana! ¿Qué se le antoja?',[
 {t:'Mango con sal y limón (₡800)',f(){zBuy(800,()=>{enAdd(6);say(null,'Ácido, salado y picante. Se te arruga la cara de felicidad. +6⚡')})}},
 {t:'Pejibayes con mayonesa (₡1 000)',f(){zBuy(1000,()=>{enAdd(10);say(null,'Pejibayes cocinados con su chorrito de mayonesa. Puro domingo. +10⚡')})}},{t:'Gracias'}])}

// ---------- lugares con los que se interactúa ----------
ACT_POINTS.push(
 {map:'ext',x:22,y:23,get label(){return bus.active&&bus.stop>0?'Subir a La Chancha':'Parada: tomar La Chancha'},run:()=>openRoutes()},
 {map:'chepe',x:4,y:12,label:'Parada de La Chancha',run:()=>openRoutes()},
 {map:'chepe',x:10,y:8,label:'Teatro Nacional',run(){const h=hour();say(null,'El Teatro Nacional. Mármol, pan de oro y unos ángeles pintados en el techo que parecen vivos.',[
  {t:'Ver la cartelera',f(){say(null,'«Hoy: Orquesta Sinfónica Nacional, 8:00 p. m. Entrada general ₡6 000».')}},
  ...(h>=19&&h<21?[{t:'Comprar entrada y ver el concierto (₡6 000)',f(){zBuy(6000,()=>{afterD(()=>fadeDo(()=>{passTime(120);enAdd(10)},()=>{say(null,'Dos horas de música bajo los ángeles del techo. Salís con la piel de gallina y sin poder explicarlo. +10⚡');runDialog()}))})}}]:[]),
  {t:'Seguir'}])}},
 {map:'chepe',x:33,y:8,label:'Soda: ventanilla',run(){say(null,'Por la ventanilla sale olor a empanada recién hecha.',[{t:'Café y empanada de frijol (₡1 200)',f(){zBuy(1200,()=>{enAdd(12);say(null,'La empanada quema, el café también. Así es como tiene que ser. +12⚡')})}},{t:'Seguir'}])}},
 {map:'chepe',x:44,y:8,label:'Cajero automático',run(){say(null,'El cajero dice: «Saldo disponible: '+fmtC(S.money)+'». Abajo, en letra chiquitica: «Gracias por preferirnos».');say(null,'La plata la andás toda en la bolsa, pero igual da gusto verla en pantalla.')}},
 {map:'chepe',x:56,y:8,label:'Monge: vitrina',run(){say(null,'En la vitrina de Monge hay teles, refris, una moto y un Santa Claus inflable. En pleno octubre.');say(null,'Un vendedor sale disparado de la puerta: «¡Caballero! ¿Ya conoce nuestro crédito? ¡Con la pura cédula!». Le decís que ya tenés Gollo en el barrio. Se ofende un poquito.')}},
 {map:'chepe',x:59,y:18,label:'Kiosco de periódicos',run(){say(null,'Titulares de hoy: '+rot('periodico',['«Hueco de la esquina cumple cinco años: vecinos le hacen fiesta».','«Pronóstico: sol en la mañana y aguacero a las dos. Como siempre».','«Récord: bus llega a la hora exacta y los pasajeros no lo pueden creer».','«La Sele se prepara para la eliminatoria; la afición pide calma (no la tiene)».']))}},
 {map:'chepe',x:5,y:33,label:'Farmacia',run(){say(null,'En la vitrina dice «Se toma la presión gratis». Hay una fila de señores esperando, todos con la presión alta de tanto esperar.')}},
 {map:'chepe',x:26,y:33,label:'Cartelera del cine',run(){say(null,'En cartelera: «Rápido y Pura Vida 9», «El Cadejos: la venganza» y «Amor en la Sabana» (romántica, con tope incluido).',[
  {t:'Ver una película (₡3 500)',f(){zBuy(3500,()=>{afterD(()=>fadeDo(()=>passTime(110),()=>{say(null,'Elegiste «El Cadejos: la venganza». Es malísima. La disfrutaste muchísimo.');if(phOn('ariana'))phQueue('ariana','¿fuiste al cine SIN MÍ? 😤 ya veremos',10);runDialog()}))})}},{t:'Seguir'}])}},
 {map:'chepe',x:37,y:33,label:'Panadería',run(){say(null,'Huele a pan casero, a cajeta y a mantequilla.',[
  {t:'Pan casero (₡700)',f(){zBuy(700,()=>addI('pancasero'))}},{t:'Una cajeta de leche (₡500)',f(){zBuy(500,()=>{enAdd(5);say(null,'Dulce hasta los dientes. +5⚡')})}},{t:'Seguir'}])}},
 {map:'chepe',x:47,y:33,label:'Librería',run(){say(null,'Hojeás un libro de leyendas ticas: la Segua, la Llorona, el Cadejos… Dicen que el Cadejos sale de noche a cuidar a los que andan solos.');say(null,'Te acordás del trillo de tierra del barrio. De noche. Hmm.')}});

// ---------- entregas en el barrio ----------
function zGive(id){const t=TR(),c=CH[id];if(!c)return false;const opts=[];
 if(id==='ariana'){
  if(hasI('helado'))opts.push({t:'Darle el helado de sorbetera',f(){remI('helado');const fresh=t.heladoDay===S.day,enc=t.enc.helado&&!t.enc.helado.done;if(enc)t.enc.helado.done=1;
   if(fresh){say(id,'¿¿Me trajiste helado de sorbetera?? 😭 ¡Del Mercado! ¡Y todavía está frío!');say(id,'Canela… sabe a cuando mi abuelo me llevaba a Chepe los sábados.');relAdd('ar',enc?4:2.5)}
   else{say(id,'Mae… esto ya es fresco de helado. 😂');say(id,'Pero me lo tomo igual, porque lo trajiste vos. Con pajilla.');relAdd('ar',1)}}});
  for(const k of['ramo','rosa'])if(hasI(k))opts.push({t:k==='ramo'?'Darle el ramo de girasoles':'Darle la rosa',f(){remI(k);const n=t.gift.ar=(t.gift.ar||0)+1;
   say(id,k==='ramo'?'¿Girasoles? ¿Para mí? 🌻 Ya sabía yo que debajo de esa cara de mae había un poeta.':'Una rosa. Con espinas y todo. Muy de telenovela… pero me encantó.');relAdd('ar',(k==='ramo'?3:1.5)/Math.min(3,n))}})}
 if(hasI('pollo')&&(id==='ariana'||id==='papa'||id==='mama')&&t.polloD!==S.day)opts.push({t:'Llevarle pollo de Pollolandia',f(){remI('pollo');t.polloD=S.day;
  if(id==='ariana'){say(id,'¿Pollolandia? 😍 Vos sí sabés cómo llegarme. Esto es mejor que flores. Bueno, igual de bueno. Bueno, mejor.');relAdd('ar',2)}
  else if(id==='papa'){say(id,'¿Pollo frito? …No le diga a Lucía que me comí tres piezas antes de la cena.');relAdd('op',.5)}
  else{say(id,'¡Ay, mijo, qué detalle! Hoy no cocino. Llame a Ariana, que comemos todos juntos.');relAdd('lu',.8)}}});
 if(id==='mama'&&hasI('culantro'))opts.push({t:'Darle el culantro y el achiote',f(){remI('culantro');const enc=t.enc.culantro&&!t.enc.culantro.done;if(enc)t.enc.culantro.done=1;
  say(id,'¡Ay, bendito sea Dios! Con esto el arroz me queda como el de mi mamá.');if(enc){say(id,'Tome, mijo, para el pasaje. No me diga que no, que me ofendo.');earn(1000,'Encargos');toast('+ ₡1 000')}relAdd('lu',1)}});
 if(id==='papa'&&hasI('cafeb')&&!t.cafeP)opts.push({t:'Darle el café del Mercado',f(){remI('cafeb');t.cafeP=1;say(id,'¿Café del Mercado? A ver… (lo huele un rato largo) Hmm.');say(id,'Eso sí es café. No esa agua de calcetín que venden en el súper. Gracias, muchacho.');relAdd('op',.6)}});
 if(!opts.length)return false;
 opts.push({t:'Nada, solo pasaba a saludar',f(){const fn=TALK[id];if(fn)fn();else genericTalk(c)}});
 say(id,id==='ariana'?'¿Y esa cara? ¿Qué escondés ahí atrás? 👀':id==='mama'?'¡Mijo! ¿Cómo le fue en Chepe?':'Buenas.',opts);return true}
function zQuests(){if(!S)return'';const t=TR();let h='';
 if(S.f.kvAnt===1)h+=`<div class="qitem"><b>🍟 Antojo de ${esc(N('kevin'))}</b><p>Papitas y una gaseosa grande del súper chino. ${hasI('papitas')&&hasI('coca')?'Ya las tenés: llevaselas a la entrada.':'Carlillos «paga después».'}</p></div>`;
 if(!t.trips)h+=`<div class="qitem"><b>? Rumor</b><p>Dicen que La Chancha de ${esc(N('beto'))} llega hasta San José. Esperala en la parada del barrio.</p></div>`;
 for(const k in t.enc){const e=t.enc[k];if(e.done)continue;const D=ENC[k];h+=`<div class="qitem"><b>🛒 Encargo de ${esc(N(e.who))}</b><p>${esc(D.t)}. ${hasI(D.item)?'Ya lo tenés: llevaselo.':'Se consigue en '+D.where+'.'}</p></div>`}
 return h}
function zHint(){const t=TR();for(const k in t.enc){const e=t.enc[k];if(!e.done&&!hasI(ENC[k].item))return'🛒 Encargo: '+ENC[k].t+' · Mercado Central'}
 const h=hour();if(h>=18&&h<21)return'🚌 Último bus al barrio: 9:00 p. m.';if(h>=21||h<6)return'🚕 Ya no hay bus: taxis en la Avenida Segunda';return'Explorá San José'}
function zTargets(add){const t=TR(),blink=Math.floor(qBlink*3)%2;add('chepe',4*T+8,12*T,'#73c9df',3,hour()>=19);
 if(blink)for(const k in t.enc){const e=t.enc[k];if(!e.done&&!hasI(ENC[k].item))add('mercado',0,0,'#f2c94c',3.5,true)}}

// ---------- vida en la calle: carros, palomas, globos de texto ----------
let CARS=[],PIGS=[],BUBS=[],CBUS=null,carT=[0,0];
const LANES=[{y:9,dir:-1},{y:11,dir:1}];
function chepePigeons(){PIGS=[];const sp=(n,x0,x1,y0,y1)=>{for(let i=0;i<n;i++){const x=rnd(x0,x1)*T,y=rnd(y0,y1)*T;PIGS.push({x,y,hx:[x0,x1],hy:[y0,y1],st:0,t:rnd(0,3),z:0,vx:0,vy:0,pk:rnd(0,6)})}};sp(9,30,56,28.6,33.4);sp(7,6.5,16.5,22.5,23.6);sp(4,22.5,25.5,14,26)}
function newCar(lane,x){const r=Math.random(),type=r<.35?'taxi':r<.7?'car':r<.85?'bus':'moto';const len={taxi:30,car:30,bus:62,moto:16}[type];
 return{type,lane,x:x!=null?x:(lane.dir>0?-len-10:CHW*T+10),len,v:{taxi:72,car:66,bus:52,moto:86}[type]*rnd(.9,1.1),sp:0,col:pick(['#3f7fd1','#e8e8e8','#2a2a30','#7bb661','#c0c4c8','#f2c94c','#8e3b8a']),hk:0,wait:0}}
function carsTick(dt){if(HD_ON&&typeof carsTickB==='function')return carsTickB(dt);for(let i=0;i<2;i++){const L=LANES[i];carT[i]-=dt;if(carT[i]<=0&&!(i===1&&CBUS)){carT[i]=rnd(1.8,4.2);const first=CARS.filter(c=>c.lane===L).sort((a,b)=>L.dir>0?a.x-b.x:b.x-a.x)[0];
  if(!first||(L.dir>0?first.x>60:first.x<CHW*T-90))CARS.push(newCar(L))}}
 for(const c of CARS){const L=c.lane,ly=L.y*T+10,front=L.dir>0?c.x+c.len:c.x;let stop=false;
  if(P.map==='chepe'&&Math.abs(P.y-4-ly)<12){const d=(P.x-front)*L.dir;if(d>-6&&d<26)stop=true}
  for(const o of CARS){if(o===c||o.lane!==L)continue;const gap=L.dir>0?o.x-(c.x+c.len):c.x-(o.x+o.len);if(gap>-4&&gap<10){stop=true;break}}
  if(CBUS&&L.dir>0){const gap=CBUS.x-(c.x+c.len);if(gap>-4&&gap<12)stop=true}
  c.sp=stop?Math.max(0,c.sp-260*dt):Math.min(c.v,c.sp+90*dt);c.x+=c.sp*L.dir*dt;
  if(stop&&c.sp<1){c.wait+=dt;if(c.wait>1&&!c.hk&&P.map==='chepe'){c.hk=1;beep(c.type==='bus'?220:392,.14,'square',.02);setTimeout(()=>beep(c.type==='bus'?196:330,.18,'square',.02),150)}}else{c.wait=0;if(!stop)c.hk=0}}
 CARS=CARS.filter(c=>c.x>-120&&c.x<CHW*T+120)}
function pigeonsTick(dt){const fed=FEED&&P.map==='chepe';for(const p of PIGS){const d=Math.hypot(p.x-P.x,p.y-P.y);
 if(p.st===0){p.pk+=dt*(3+Math.random()*3);p.t-=dt;
  if(fed&&Math.hypot(p.x-FEED.x,p.y-FEED.y)<170){const tx=FEED.x+Math.sin(p.pk*.3+p.hx[0])*14,ty=FEED.y+6+Math.cos(p.pk*.2+p.hy[0])*6,dx=tx-p.x,dy=ty-p.y,L=Math.hypot(dx,dy);if(L>3){p.x+=dx/L*34*dt;p.y+=dy/L*34*dt;p.f=dx<0}}
  else if(P.map==='chepe'&&d<24&&!fed){p.st=1;p.t=rnd(2,3.5);const a=Math.atan2(p.y-P.y,p.x-P.x)+rnd(-.6,.6);p.vx=Math.cos(a)*90;p.vy=Math.sin(a)*40-30;p.f=p.vx<0;if(Math.random()<.3)beep(rnd(900,1300),.04,'triangle',.008)}
  else if(p.t<=0){p.t=rnd(.8,3);if(Math.random()<.6){p.x=clamp(p.x+rnd(-10,10),p.hx[0]*T,p.hx[1]*T);p.y=clamp(p.y+rnd(-5,5),p.hy[0]*T,p.hy[1]*T);p.f=Math.random()<.5}}}
 else{p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z=Math.min(26,p.z+40*dt);p.vy+=8*dt;
  if(p.t<=0){const tx=rnd(p.hx[0],p.hx[1])*T,ty=rnd(p.hy[0],p.hy[1])*T;const dx=tx-p.x,dy=ty-p.y,L=Math.hypot(dx,dy)||1;p.vx=dx/L*70;p.vy=dy/L*70;p.f=p.vx<0;if(L<12||p.t<-4){p.st=0;p.z=0;p.t=rnd(1,3);p.x=tx;p.y=ty}}}}
 if(FEED){FEED.t-=dt;if(FEED.t<=0)FEED=null}}
function zoneTick(dt){if(curZone()!=='chepe')return;
 if(P.map==='chepe'){carsTick(dt);pigeonsTick(dt);if(CBUS){if(CBUS.st==='stop'){CBUS.t-=dt;if(CBUS.t<=0){CBUS.st='go';beep(330,.25,'sawtooth',.02)}}else{CBUS.v=Math.min(95,(CBUS.v||0)+50*dt);CBUS.x+=CBUS.v*dt;if(CBUS.x>CHW*T+40)CBUS=null}}}
 for(const e of ENTS){if(!e.z||!e.sh||e.map!==P.map)continue;e.shT-=dt;if(e.shT<=0){e.shT=rnd(7,15);if(BUBS.length<2&&Math.hypot(e.x-P.x,e.y-P.y)<160&&!e.talking)BUBS.push({e,txt:pick(e.sh),t:2.8})}}
 for(const b of BUBS)b.t-=dt;BUBS=BUBS.filter(b=>b.t>0&&b.e.map===P.map)}
function zAmbient(){if(!OPT.sound)return 3;const r=Math.random();
 if(P.map==='mercado'){for(let i=0;i<3;i++)setTimeout(()=>beep(rnd(170,280),.06,'triangle',.006),i*110);return rnd(.8,2)}
 if(r<.3){beep(392,.1,'square',.01);setTimeout(()=>beep(330,.12,'square',.01),130)}else if(r<.5)beep(900,.35,'sawtooth',.004,420);else if(r<.75)beep(320,.16,'sine',.012,270);
 return rnd(1.4,3.6)}
function drawChancha(g,X,Yb){const Y=Yb-28;R(g,'rgba(0,0,0,.25)',X+2,Yb-2,86,4);R(g,'#1d1a24',X-1,Y-1,90,28);R(g,'#f4f4f4',X,Y,88,26);R(g,'#2a6fb0',X,Y+14,88,5);R(g,'#d6453c',X,Y+19,88,2);
 for(let i=0;i<6;i++)R(g,'#4f6f8c',X+6+i*13,Y+3,10,8);R(g,'#bfe0ff',X+80,Y+3,6,10);R(g,'#f2c94c',X+84,Y+20,3,3);for(const wx of[14,70]){disc(g,'#1d1a24',X+wx,Y+26,4);disc(g,'#8f8a80',X+wx,Y+26,2)}
 R(g,'#1d1a24',X+30,Y-7,30,7);g.fillStyle='#f2c94c';g.font='bold 5px monospace';g.textAlign='center';g.textBaseline='top';g.fillText('LA CHANCHA',X+45,Y-6)}
function drawCar(g,c){const L=c.lane,Yb=L.y*T+15,X=Math.round(c.x),fl=L.dir<0;g.save();if(fl){g.translate(X*2+c.len,0);g.scale(-1,1)}
 R(g,'rgba(0,0,0,.25)',X+2,Yb-2,c.len-2,3);
 if(c.type==='bus'){const Y=Yb-22;R(g,'#1d1a24',X-1,Y-1,c.len+2,22);R(g,'#ecebe4',X,Y,c.len,20);R(g,'#2a8f6a',X,Y+12,c.len,4);for(let i=0;i<5;i++)R(g,'#3f5f78',X+4+i*11,Y+3,8,7);R(g,'#bfe0ff',X+c.len-6,Y+3,5,9);R(g,'#f2c94c',X+c.len-3,Y+16,2,2);for(const wx of[10,c.len-12]){disc(g,'#1d1a24',X+wx,Yb-1,4);disc(g,'#8f8a80',X+wx,Yb-1,2)}}
 else if(c.type==='moto'){const Y=Yb-14;disc(g,'#1d1a24',X+3,Yb-2,3);disc(g,'#1d1a24',X+13,Yb-2,3);R(g,'#c0473b',X+3,Y+6,10,4);R(g,'#2a2a30',X+6,Y,4,7);disc(g,c.col,X+8,Y-1,3);R(g,'#2a2a30',X+10,Y+3,3,2)}
 else{const Y=Yb-14,col=c.type==='taxi'?'#c8231e':c.col;R(g,'#1d1a24',X-1,Y+4,c.len+2,9);R(g,col,X,Y+5,c.len,7);R(g,shade(col,.25),X,Y+5,c.len,1);R(g,'#1d1a24',X+7,Y-1,15,7);R(g,col,X+8,Y,13,6);R(g,'#9fc7e0',X+9,Y+1,5,4);R(g,'#9fc7e0',X+15,Y+1,5,4);
  if(c.type==='taxi'){R(g,'#f2c94c',X+12,Y-3,5,2);R(g,'#f2c94c',X+11,Y+7,3,3);R(g,'#f2c94c',X+12,Y+6,1,1)}R(g,'#f7efc0',X+c.len-2,Y+7,2,2);R(g,'#d6453c',X,Y+7,1,2);for(const wx of[7,c.len-7]){disc(g,'#1d1a24',X+wx,Yb-2,3);disc(g,'#8f8a80',X+wx,Yb-2,1)}}
 g.restore()}
function drawPigeon(g,p,air){const X=Math.round(p.x),Y=Math.round(p.y-p.z);g.save();if(p.f){g.translate(X*2,0);g.scale(-1,1)}
 if(!air){const pk=Math.floor(p.pk)%4===0?1:0;R(g,'rgba(0,0,0,.2)',X-2,Y+1,6,1);R(g,'#8e949c',X-3,Y-3,6,3);R(g,'#6f767e',X-4,Y-3,2,2);R(g,'#5f8f80',X+2,Y-4+pk,2,2);R(g,'#7a8088',X+3,Y-5+pk*2,2,2);R(g,'#2a2a30',X+4,Y-5+pk*2,1,1);R(g,'#d98a8a',X-1,Y,1,1);R(g,'#d98a8a',X+1,Y,1,1)}
 else{const w=Math.floor(qBlink*14)%2;R(g,'rgba(0,0,0,.15)',X-2,Math.round(p.y)+1,5,1);R(g,'#8e949c',X-2,Y-2,6,3);R(g,'#7a8088',X+3,Y-3,2,2);R(g,'#a3a9b0',X-3,Y-(w?5:0),5,2);R(g,'#a3a9b0',X,Y-(w?5:0),4,2)}
 g.restore()}
function zoneGround(g){if(P.map!=='chepe')return;if(HD_ON&&typeof zoneGroundB==='function')zoneGroundB(g);else{for(const c of CARS)drawCar(g,c);if(CBUS)drawChancha(g,Math.round(CBUS.x),11*T+15)}for(const p of PIGS)if(p.st===0)drawPigeon(g,p,false)}
function zoneAir(g){if(P.map!=='chepe')return;for(const p of PIGS)if(p.st===1)drawPigeon(g,p,true)}
function zoneScreen(g,cx,cy){if(!BUBS.length)return;g.save();const fs=Math.round(11*DPR);g.font='bold '+fs+'px "Trebuchet MS",sans-serif';g.textAlign='center';g.textBaseline='middle';
 for(const b of BUBS){const X=(b.e.x-cx)*Z,Y=(b.e.y-32-cy)*Z,w=g.measureText(b.txt).width+12*DPR,h=fs+10*DPR;g.globalAlpha=Math.min(1,b.t/.4);
  g.fillStyle='#14101c';g.fillRect(X-w/2-2*DPR,Y-h/2-2*DPR,w+4*DPR,h+4*DPR);g.fillStyle='#f4ead2';g.fillRect(X-w/2,Y-h/2,w,h);
  g.fillStyle='#14101c';g.beginPath();g.moveTo(X-5*DPR,Y+h/2);g.lineTo(X+5*DPR,Y+h/2);g.lineTo(X,Y+h/2+7*DPR);g.fill();g.fillText(b.txt,X,Y+DPR)}
 g.restore()}
function updZPed(e,dt){if(e.talking){e.fr=0;return}const m=MAPS[e.map];if(!m)return;
 if(e.wander){if(!e.path||!e.path.length){e.fr=0;e.wt-=dt;if(e.wt>0)return;e.wt=rnd(1.5,5);const[sx,sy]=tileOf(e),a=e.area;
   for(let i=0;i<8;i++){const s=pick(m.walk);if(s[0]<a[0]||s[0]>a[1]||s[1]<a[2]||s[1]>a[3])continue;const p=bfs(m,sx,sy,s[0],s[1]);if(p&&p.length&&p.length<36){e.path=p;break}}return}
  follow(e,dt,e.sp||30);e.anim+=dt*6;e.fr=1+(Math.floor(e.anim)%2);return}
 e.fr=0;if(P.map===e.map&&Math.hypot(P.x-e.x,P.y-e.y)<42&&e.c.id!=='z_estatua')faceTo(e,P);else{e.wt-=dt;if(e.wt<=0){e.wt=rnd(3,8);e.dir=e.d0!=null&&Math.random()<.75?e.d0:pick([0,2,3])}}}
function playMarimba(){const N5=[392,523,659,784,659,523,587,698,880,784,659,523,587,659,523,392,523,659,523];N5.forEach((f,i)=>setTimeout(()=>{beep(f,.22,'triangle',.03);beep(f*2,.08,'sine',.008)},i*170+(i%3===0?40:0)))}

// ---------- minimapa de Chepe ----------
const ZMM={};
// Minimapa de Chepe: mismo lenguaje visual que el del barrio (texturas, sombras, fachadas con ventanas, toldos y techos de zinc).
function zmm(s){if(ZMM[s])return ZMM[s];const m=MAPS.chepe;if(!m)return null;const c=mk(m.w*s,m.h*s),g=c.getContext('2d');g.imageSmoothingEnabled=false;
 const q=(col,x,y,w,h)=>R(g,col,Math.round(x*s),Math.round(y*s),Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*s)));
 const px=(col,X,Y,w,h)=>R(g,col,Math.round(X),Math.round(Y),w||1,h||1),e=Math.max(1,s>>2);
 const spk=(x,y,base,a,b,n)=>{q(base,x,y,1,1);for(let i=0;i<n;i++)px(hsh(x*5+i,y*7+i)<.5?a:b,x*s+hsh(x*7+i,y*13)*(s-1),y*s+hsh(x*3+i,y*11+2)*(s-1))};
 const dens=Math.max(2,(s*s)>>3),side=t=>t===2;
 // suelo
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const t=ti(m,x,y);
  switch(t){
  case 30:{const blv=y>=28&&y<=33,band=blv&&(y===30||y===31),edge=blv&&(y===28||y===33),pea=!blv&&(x===22||x===25);
   q(band?'#c27a5f':edge||pea?'#d3ab92':'#d6c9b2',x,y,1,1);if(s>=6){q(band?'#b06a50':'#c4b59d',x,y+.9,1,.1);q(band?'#b06a50':'#c4b59d',x+.9,y,.1,1)}
   if(band&&x%7===0)q('#8f4a37',x+.3,y+.3,.4,.4);if(hsh(x,y)<.1)px('#9a8d7a',x*s+hsh(y,x)*(s-1),y*s+hsh(x+1,y)*(s-1));break}
  case 32:q('#ddd4c2',x,y,1,1);if(s>=6){q('#cfc5b0',x+.5,y,.08,1);q('#cfc5b0',x,y+.5,1,.08)}
   {const gr=(a,b)=>{const v=ti(m,a,b);return v===8||v===5};if(gr(x,y-1))q('#b3a891',x,y,1,.12);if(gr(x,y+1))q('#b3a891',x,y+.88,1,.12);if(gr(x-1,y))q('#b3a891',x,y,.12,1);if(gr(x+1,y))q('#b3a891',x+.88,y,.12,1)}break;
  case 2:q('#c9c2b2',x,y,1,1);q('#aea796',x,y+.86,1,.14);q('#aea796',x+.86,y,.14,1);break;
  case 34:case 33:{spk(x,y,'#474a51','#53565c','#3d4046',Math.max(1,dens>>1));if(side(ti(m,x,y-1))){q('#2a2d32',x,y,1,.2);q('#6b6f75',x,y+.2,1,.06)}if(side(ti(m,x,y+1)))q('#2a2d32',x,y+.8,1,.2);
   if(t===33)for(let i=0;i<4;i++)q('#ece8dc',x+.08,y+.06+i*.25,.84,.13);else if(y===m.cl&&x%2===0){q('#e8c547',x+.1,y+.36,.8,.1);q('#e8c547',x+.1,y+.56,.8,.1)}break}
  case 8:spk(x,y,'#66b152','#5aa047','#78c262',dens);if(hsh(x+5,y+5)<.12)px(['#f7e04b','#f28ab2','#ffffff'][Math.floor(hsh(x,y)*3)%3],x*s+hsh(x+7,y)*(s-1),y*s+hsh(x,y+7)*(s-1),Math.max(1,s>>2),Math.max(1,s>>2));break;
  case 5:spk(x,y,'#2e6e33','#245c2c','#3a8240',dens);break;
  default:q('#3b3540',x,y,1,1)}}
 // sombra de los edificios del norte sobre la acera
 q('rgba(0,0,0,.22)',0,8,m.w,.3);q('rgba(0,0,0,.18)',MERC.x,MERC.y+MERC.h,MERC.w,.25);
 // franja superior de techos lejanos
 q('#57524b',0,0,m.w,1);for(let x=0;x<m.w;x+=2)q(x%4?'#4a4640':'#625c54',x,.2,1.4,.6);
 // edificios del norte
 const roofTex=(b,rH)=>{q(b.roof,b.x,b.y,b.w,rH);for(let i=0;i<b.w;i+=2)for(let j=0;j<rH;j+=2)if(hsh(b.x+i,j)<.5)q(shade(b.roof,.06),b.x+i,b.y+j,2,2);
  q(shade(b.roof,.32),b.x,b.y,b.w,.15);q(shade(b.roof,.18),b.x,b.y,.15,rH);q(shade(b.roof,-.3),b.x+b.w-.15,b.y,.15,rH);q(shade(b.roof,-.45),b.x,b.y+rH-.25,b.w,.25)};
 const win=(x,y,col)=>{q('#efe9dc',x-.08,y-.08,.66,.66);q(col||'#4f6f8c',x,y,.5,.5);if(s>=6)px('#8bb3d1',x*s,y*s)};
 for(const b of CHB){const rH=b.h-3.5,fy=b.y+rH;roofTex(b,rH);
  q(b.wall,b.x,fy,b.w,3.5);q(shade(b.wall,.22),b.x,fy,b.w,.15);q(shade(b.wall,-.28),b.x,b.y+b.h-.3,b.w,.3);
  if(b.id!=='teatro'){q('#1f2328',b.x+b.w-1.8,b.y+.6,1,.9);q('#3b414a',b.x+b.w-1.8,b.y+.6,1,.25);q('#d5d8da',b.x+.6,b.y+rH-1.4,.9,.6)}
  switch(b.id){
  case'teatro':{const cx=b.x+b.w/2;q('#4f8a7c',cx-1.2,b.y+.6,2.4,1.4);q('#6aa595',cx-1.2,b.y+.6,2.4,.25);for(let i=-1;i<=1;i++)q('#bfe0d6',cx+i*.7-.1,b.y+.9,.2,.9);
   for(let i=0;i<5;i++)q('#e3d4b3',cx-2.6+i*.5,fy-.25*(i+1),5.2-i,.25);q('#5d5a4a',cx-.15,fy-1.7,.3,.4);
   for(let i=0;i<8;i++)q('#fbf7ec',b.x+1.2+i*((b.w-2.4)/7),fy+.7,.32,2.3);for(let i=0;i<7;i++)q('#6b4a2b',b.x+1.55+i*((b.w-2.4)/7),fy+2.3,.5,.8);q('#d8d0bf',b.x+.5,b.y+b.h-.3,b.w-1,.3);break}
  case'hotel':for(let i=0;i<5;i++){win(b.x+.9+i*1.9,fy+.5);win(b.x+.9+i*1.9,fy+1.5)}for(let i=0;i<b.w;i+=.5)q((i*2)%2?'#f4f4f4':'#3f7d5a',b.x+i,fy+2.4,.5,.35);q('#c0473b',b.x+b.w-.9,fy+.3,.4,1.6);break;
  case'soda':for(let i=0;i<3;i++)win(b.x+.8+i*2.4,fy+.6);for(let i=0;i<b.w;i+=.5)q((i*2)%2?'#f4f4f4':'#c0473b',b.x+i,fy+2.1,.5,.35);q('#2a1e14',b.x+.6,fy+2.5,b.w-1.2,.8);break;
  case'banco':q('#2c4d72',b.x+.3,fy+.3,b.w-.6,1.7);for(let i=0;i<b.w-.6;i+=.8)q('#3d6894',b.x+.3+i,fy+.3,.6,1.7);q('#1f3550',b.x+b.w/2-1.9,fy+2.1,3.8,.5);q('#bcd3e6',b.x+b.w/2-.5,fy+2.6,1,.8);q('#57d17a',b.x+b.w-2.4,fy+2.6,.6,.4);break;
  case'almacen':for(let j=0;j<3.2;j+=.5)for(let i=(j*2)%2?0:.4;i<b.w;i+=.8)q(shade(b.wall,-.1),b.x+i,fy+j,.7,.06);for(let i=0;i<6;i++)win(b.x+.8+i*2.5,fy+.6);
   for(let i=0;i<3;i++){q('#dfe9ee',b.x+.6+i*5.2,fy+2.3,3.8,.9);for(let k=0;k<5;k++)q(['#d64545','#3f7fd1','#7bb661','#f2994a','#f193b4'][(k+i)%5],b.x+.9+i*5.2+k*.7,fy+2.6,.4,.5)}
   q('#2a8f6a',b.x+2.6,b.y+.3,5,1.3);q('#f4f4f4',b.x+2.6,b.y+.3,5,.15);disc(g,'#f2c94c',Math.round((b.x+3.5)*s),Math.round((b.y+.95)*s),Math.max(1,Math.round(s*.35)));break;
  default:win(b.x+.8,fy+.6);q('#5c3d24',b.x+.9,fy+2.2,1.1,1.1)}}
 // Mercado Central
 {const M=MERC,rH=M.h-3.5,fy=M.y+rH;for(let i=0;i<M.w;i+=4){const col=(i/4)%2?'#a6583f':'#9a5038';q(col,M.x+i,M.y,4,rH);for(let k=0;k<4;k+=.5)q(shade(col,(k*2)%2?.15:-.1),M.x+i+k,M.y,.2,rH);
   q(shade(col,.45),M.x+i+1.85,M.y,.3,rH);q('rgba(190,220,225,.7)',M.x+i+.6,M.y+.8,.6,rH-1.8);q('rgba(190,220,225,.7)',M.x+i+2.8,M.y+.8,.6,rH-1.8);q(shade(col,-.45),M.x+i+3.92,M.y,.08,rH)}
  q('rgba(0,0,0,.28)',M.x,fy-.25,M.w,.25);q('#e6c47e',M.x,fy,M.w,3.5);q('#3f7d5a',M.x,fy,M.w,.35);q(shade('#e6c47e',-.3),M.x,M.y+M.h-.15,M.w,.15);
  for(let ax=M.x+.6;ax<M.x+M.w-1.5;ax+=2.25){if(Math.abs(ax+.75-(M.dx+.5))<1.8)continue;q('#2a1e14',ax,fy+1,1.5,2.4);q('#2a1e14',ax+.2,fy+.8,1.1,.3);q(['#f2994a','#7bb661','#d64545','#f2c94c'][Math.round(ax)%4],ax+.2,fy+2.6,1.1,.4)}
  q('#2a1e14',M.dx-.6,fy+.7,2.2,2.8);q('#3f7d5a',M.dx-.75,fy+.7,.15,2.8);q('#3f7d5a',M.dx+1.6,fy+.7,.15,2.8);q('#1d1a24',M.dx-2.2,fy+.3,5.4,.6);q('#f2c94c',M.dx-1.9,fy+.45,4.8,.25)}
 // locales del sur: techos de zinc y toldos rayados hacia el bulevar
 for(const sh of CHS){q(sh.roof,sh.x,34,sh.w,6);for(let i=0;i<sh.w;i+=.5)q(shade(sh.roof,(i*2)%2?.15:-.08),sh.x+i,34.6,.2,5.4);q(shade(sh.roof,-.4),sh.x+sh.w-.1,34,.1,6);
  for(let i=0;i<sh.w-.4;i+=.5)q((i*2)%2?'#f4f4f4':sh.c,sh.x+.2+i,33.75,.5,.6);q(shade(sh.c,-.3),sh.x+.2,34.35,sh.w-.4,.15);q('#1f2328',sh.x+sh.w-1.6,36,1,.8)}
 // objetos
 for(const o of m.objs){const X=o.x,Y=o.y;switch(o.type){
  case'templete':q('rgba(0,0,0,.2)',X+.3,Y+o.h-.4,o.w,.5);q('#d9d2c2',X,Y,o.w,o.h);q('#c9c2b2',X,Y+o.h-.6,o.w,.6);for(let i=0;i<4;i++){const w=o.w-1.2-i*1.2;q(i%2?'#5d8f86':'#6a9d93',X+(o.w-w)/2,Y+.6+i*.55,w,o.h-1.8-i*1.1)}
   q('#79aba1',X+o.w/2-1,Y+1,1,.3);disc(g,'#d8b45a',Math.round((X+o.w/2)*s),Math.round((Y+o.h/2-.2)*s),Math.max(1,s>>2));break;
  case'busstop':q('rgba(0,0,0,.2)',X,Y+.75,o.w,.25);q('#2a6fb0',X,Y+.1,o.w,.5);q('#f4f4f4',X,Y+.1,o.w,.1);q('#dcdcdc',X+.2,Y+.6,.1,.3);q('#dcdcdc',X+o.w-.3,Y+.6,.1,.3);break;
  case'kioscoP':q('rgba(0,0,0,.2)',X+.2,Y+o.h-.2,o.w,.3);q('#2f7a52',X,Y,o.w,o.h);q('#246343',X,Y,o.w,.4);q('#f2c94c',X+.2,Y+.15,o.w-.4,.15);for(let i=0;i<4;i++)q(['#f4f4f4','#d64545','#7fc3e8','#f2c94c'][i],X+.2+i*.42,Y+1.2,.3,.5);break;
  case'bench':q('#8a6a45',X+.1,Y+.35,.8,.35);q('#6b4f30',X+.1,Y+.7,.8,.1);break;
  case'farol':case'farolS':q('rgba(0,0,0,.25)',X+.35,Y+.55,.35,.15);q('#2a2a30',X+.4,Y+.2,.25,.4);q('#f7d77a',X+.4,Y+.1,.25,.2);break;
  case'jardinera':q('#b9b1a1',X,Y+.2,o.w,.65);for(let i=0;i<o.w*2;i++)q(i%2?'#3f8a3e':'#4c9a47',X+i*.5+.05,Y+.15,.4,.45);px('#f193b4',(X+.6)*s,(Y+.25)*s);break;
  case'basurero':q('#2f7a52',X+.3,Y+.2,.4,.6);break;
  case'copos':q('#f4f4f4',X+.1,Y+.15,o.w-.2,.6);q('#2a6fb0',X+.1,Y+.6,o.w-.2,.12);for(let i=0;i<4;i++)q(['#d64545','#f4f4f4','#f2c94c','#d64545'][i],X+.2+i*.4,Y-.3,.4,.3);break;
  case'taxis':q('#2a2a30',X+.45,Y,.1,.8);q('#f2c94c',X+.1,Y-.2,.8,.4);break;
  case'marimba':q('#7a4b2a',X,Y+.25,o.w,.45);for(let i=0;i<o.w*3;i++)q(i%2?'#c98a4a':'#a8703c',X+i/3,Y+.25,.25,.3);break}}
 // árboles
 for(const[x,y]of m.trees){const cx=Math.round(x*s+s/2),cy=Math.round(y*s+s/2-s*.25),r=Math.max(2,Math.round(s*.95));q('rgba(0,0,0,.22)',x-.3,y+.4,1.6,.5);
  disc(g,'#245c2c',cx,cy,r);disc(g,'#2e6e33',cx-1,cy-1,Math.max(1,r-1));disc(g,'#3f8a3e',cx-Math.round(s*.3),cy-Math.round(s*.35),Math.max(1,Math.round(r*.5)));px('#6eb75a',cx-Math.round(s*.45),cy-Math.round(s*.55))}
 ZMM[s]=c;return c}
function drawBigZone(cvs){const s=MM.bs,g=cvs.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(zmm(s),0,0);
 const dk=darkness();if(dk>0){g.fillStyle='rgba(12,12,44,'+(dk*.5).toFixed(2)+')';g.fillRect(0,0,cvs.width,cvs.height)}
 const txt=(t,x,y,sz,col)=>{g.font='bold '+sz+'px monospace';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=3;g.strokeStyle='#14101c';g.strokeText(t,x*s,y*s);g.fillStyle=col||'#f4ead2';g.fillText(t,x*s,y*s)};
 txt('Teatro Nacional',11,4,9,'#f2c94c');txt('Hotel',24,4,8);txt('Soda',33,4,8);txt('Banco',42.5,4,8);txt('Monge',56,4,8);txt('Avenida Segunda',36,10.5,8,'#e8c547');
 txt('Parque Central',13,15.4,9,'#d8f0c8');txt('Templete',11.5,19.5,8,'#ffd0c8');txt('Mercado Central',42,19,10,'#f2c94c');txt('Calle peatonal',24,23,7,'#f4ead2');txt('Parada',4,14.6,8,'#bfe0ff');txt('Taxis',60.5,11.4,8,'#f2c94c');
 txt('Avenida Central (bulevar)',32,30.8,9,'#ffd9c2');txt('Farmacia',5.5,36.5,8);txt('Cine',26,36.5,8);txt('Panadería',37,36.5,8);txt('Librería',47,36.5,8);
 const tg=mmTargets();for(const t of tg){const p=mmTo(t.mp,t.x,t.y,s);if(p)mmDot(g,p[0],p[1],t.c,t.r+1.6)}
 const pp=mmTo(P.map,P.x,P.y,s);if(pp){g.save();g.translate(pp[0],pp[1]);g.scale(1.5,1.5);g.translate(-pp[0],-pp[1]);mmPlayer(g,pp[0],pp[1]);g.restore();txt('Vos',pp[0]/s,pp[1]/s-2.3,9,'#fff')}}

// ---------- rutas y mapa de Costa Rica ----------
const ROUTES={
 barrio:{n:'Tu barrio',ll:[-84.05,10.07],open:1},
 chepe:{n:'San José',ll:[-84.08,9.93],open:1,fare:550,ride:45},
 puntarenas:{n:'Puntarenas',ll:[-84.83,9.98],hint:'El paseo de los turistas y un churchill al atardecer.'},
 turrialba:{n:'Turrialba',ll:[-83.68,9.9],lo:[3,8,'left'],hint:'Queso, finca y el volcán de fondo.'},
 limon:{n:'Limón',ll:[-83.03,9.99],hint:'Caribe, calypso y rice and beans.'},
 liberia:{n:'Liberia',ll:[-85.44,10.63],hint:'Sabaneros, topes y calor del bueno.'}};
const CR_POLY=[[-85.70,11.07],[-85.60,11.20],[-84.90,10.95],[-84.68,11.08],[-84.35,10.95],[-84.20,10.79],[-83.95,10.71],[-83.70,10.90],[-83.65,10.93],
 [-83.40,10.45],[-83.22,10.20],[-83.03,10.00],[-82.85,9.80],[-82.70,9.70],[-82.56,9.57],
 [-82.85,9.45],[-82.93,9.20],[-82.85,9.00],[-82.93,8.85],[-82.83,8.50],[-82.89,8.03],
 [-82.98,8.30],[-83.12,8.62],[-83.30,8.60],[-83.33,8.45],[-83.30,8.38],[-83.50,8.40],[-83.68,8.55],[-83.73,8.68],[-83.62,8.90],
 [-83.75,9.10],[-83.95,9.30],[-84.16,9.43],[-84.40,9.53],[-84.63,9.62],[-84.65,9.80],[-84.83,9.98],[-84.95,10.08],[-85.18,10.20],
 [-85.10,10.02],[-84.98,9.85],[-84.95,9.72],[-85.11,9.56],[-85.35,9.75],[-85.55,9.88],[-85.68,10.00],[-85.80,10.18],[-85.86,10.36],[-85.75,10.58],[-85.85,10.72],[-85.95,10.88]];
const NI_POLY=[[-86.2,11.6],[-83.3,11.6],[-83.65,10.93],[-83.70,10.90],[-83.95,10.71],[-84.20,10.79],[-84.35,10.95],[-84.68,11.08],[-84.90,10.95],[-85.60,11.20],[-85.70,11.07],[-86.2,11.25]];
const PA_POLY=[[-82.56,9.57],[-82.85,9.45],[-82.93,9.20],[-82.85,9.00],[-82.93,8.85],[-82.83,8.50],[-82.89,8.03],[-82.2,7.8],[-82.2,9.4]];
const CR_RIDGE=[[-85.45,10.92],[-85.0,10.62],[-84.6,10.35],[-84.2,10.15],[-83.85,9.98],[-83.5,9.62],[-83.15,9.25],[-82.95,8.9]];
const CR_VOLC=[[-84.70,10.46],[-84.23,10.20],[-83.85,9.98],[-83.77,10.03],[-85.32,10.83]];
const crP=(lon,lat)=>[6+(lon+86)*60,6+(11.3-lat)*60];
let CRIMG=null;
function crBase(){if(CRIMG)return CRIMG;const W=228,H=216,c=mk(W,H),g=c.getContext('2d');
 const poly=(pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach(([a,b],i)=>{const[x,y]=crP(a,b);i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.fill()};
 poly(NI_POLY,'#00ff00');poly(PA_POLY,'#00ff00');poly(CR_POLY,'#ff0000');
 const src=g.getImageData(0,0,W,H).data,kind=new Uint8Array(W*H);for(let i=0;i<W*H;i++){const r=src[i*4],gg=src[i*4+1],a=src[i*4+3];kind[i]=a<128?0:r>gg?1:2}
 const K=(x,y)=>x<0||y<0||x>=W||y>=H?0:kind[y*W+x];
 const ridge=CR_RIDGE.map(([a,b])=>crP(a,b));const rd=(x,y)=>{let best=1e9;for(let i=0;i<ridge.length-1;i++){const[ax,ay]=ridge[i],[bx,by]=ridge[i+1],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);best=Math.min(best,Math.hypot(x-ax-t*dx,y-ay-t*dy))}return best};
 const out=g.createImageData(W,H),o=out.data,hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const C={sea:hex('#2f69ad'),sea2:hex('#3473b9'),shal:hex('#4f93d4'),foam:hex('#a9d6f0'),land:hex('#6fb556'),land2:hex('#64a84d'),mid:hex('#4f8f43'),hi:hex('#7a7a4e'),peak:hex('#8f8466'),coast:hex('#e2d39a'),nb:hex('#a7a88f'),nb2:hex('#9a9b82'),nbe:hex('#7f8070')};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=K(x,y),i=(y*W+x)*4;let col;
  if(k===0){let near=0;for(let d=1;d<=3&&!near;d++)if(K(x+d,y)||K(x-d,y)||K(x,y+d)||K(x,y-d))near=d;col=near===1?C.foam:near?C.shal:((x*3+y*5)%17===0||(hsh(x,y)<.04))?C.sea2:C.sea}
  else if(k===2){col=(!K(x+1,y)||!K(x-1,y)||!K(x,y+1)||!K(x,y-1))?C.nbe:hsh(x,y)<.5?C.nb:C.nb2}
  else{const edge=!K(x+1,y)||!K(x-1,y)||!K(x,y+1)||!K(x,y-1);const d=rd(x,y)+(hsh(x,y)-.5)*3;col=edge?C.coast:d<3?C.peak:d<7?C.hi:d<13?C.mid:hsh(x>>1,y>>1)<.5?C.land:C.land2}
  o[i]=col[0];o[i+1]=col[1];o[i+2]=col[2];o[i+3]=255}
 g.putImageData(out,0,0);
 const[lx,ly]=crP(-84.85,10.5);R(g,'#4f93d4',lx-4,ly-1,8,3);R(g,'#4f93d4',lx-2,ly-2,5,1);
 for(const[a,b]of CR_VOLC){const[x,y]=crP(a,b).map(Math.round);R(g,'#5a4a3c',x-2,y,5,1);R(g,'#5a4a3c',x-1,y-1,3,1);R(g,'#f4f4f4',x,y-2,1,1)}
 const lab=(t,x,y,col,sz)=>{g.font=(sz||6)+'px monospace';g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(t,x,y)};
 lab('NICARAGUA',70,10,'#5b5c4e');lab('PANAMÁ',214,150,'#5b5c4e');lab('Océano Pacífico',70,170,'#bfe0ff');lab('Mar Caribe',196,60,'#bfe0ff');
 CRIMG=c;return c}
function drawCR(cv,from){if(!cv)return;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(crBase(),0,0);
 const pt=k=>crP(...ROUTES[k].ll).map(Math.round);const[bx,by]=pt('barrio'),[sx,sy]=pt('chepe');
 g.fillStyle='#f2c94c';for(let i=0;i<=6;i++){const x=Math.round(bx+(sx-bx)*i/6),y=Math.round(by+(sy-by)*i/6);if(i%2===0)g.fillRect(x,y,1,1)}
 const txt=(t,x,y,col,al)=>{g.font='bold 6px monospace';g.textAlign=al||'center';g.textBaseline='middle';g.fillStyle='#14101c';for(const[a,b]of[[-1,0],[1,0],[0,-1],[0,1]])g.fillText(t,x+a,y+b);g.fillStyle=col;g.fillText(t,x,y)};
 for(const k in ROUTES){const r=ROUTES[k];if(r.open)continue;const[x,y]=pt(k),lo=r.lo||[0,-7];R(g,'#14101c',x-2,y-2,5,5);R(g,'#8a8f94',x-1,y-1,3,3);txt(r.n,x+lo[0],y+lo[1],'#c9ccd0',lo[2])}
 R(g,'#14101c',sx-3,sy-3,7,7);R(g,'#d6453c',sx-2,sy-2,5,5);R(g,'#ffb0a8',sx-1,sy-2,1,1);txt('San José',sx-3,sy+8,'#ffffff','right');
 R(g,'#14101c',bx-3,by-3,7,7);R(g,'#f2c94c',bx-2,by-2,5,5);txt('Tu barrio',bx-4,by-8,'#f2c94c','right');
 const[px,py]=from==='barrio'?[bx,by]:[sx,sy];R(g,'#14101c',px+4,py-12,11,8);R(g,'#f4f4f4',px+5,py-11,9,5);R(g,'#2a6fb0',px+5,py-8,9,1);R(g,'#4f6f8c',px+6,py-10,2,2);R(g,'#4f6f8c',px+9,py-10,2,2);R(g,'#1d1a24',px+6,py-5,2,1);R(g,'#1d1a24',px+11,py-5,2,1)}
function nextBus(z){const now=S.t;if(z==='barrio'){if(bus.active&&bus.stop>0)return{now:1,at:now};for(const h of BUS_H)if(h*60>now)return{at:h*60};return null}
 for(let h=6;h<=21;h++)if(h*60>now)return{at:h*60};return null}
const fmtWait=w=>w<60?w+' min':Math.floor(w/60)+' h'+(w%60?' '+w%60+' min':'');
function openRoutes(){if(mode!=='play')return;const z=curZone(),to=z==='barrio'?'chepe':'barrio',R0=ROUTES.chepe,nb=nextBus(z),pase=hasI('pase_bus');
 const from=z==='barrio'?'Tu barrio':'San José',dest=z==='barrio'?'San José (Chepe)':'Tu barrio';let sched,btns='';
 if(!nb){sched=z==='barrio'?'El último bus del día ya salió (7:00 p. m.). Mañana el primero pasa a las 7:00 a. m.':'El último bus al barrio ya salió (9:00 p. m.).';
  if(z==='chepe')btns=`<button class="green" id="rTaxi">🚕 Taxi rojo (${fmtC(8500)})</button><button class="alt" id="rDawn">Esperar el primer bus (6:00 a. m.)</button>`}
 else{const w=Math.round(nb.at-S.t);sched=nb.now?'¡La Chancha está en la parada ahorita mismo!':`Próximo bus: ${fmtM(nb.at)} (en ${fmtWait(w)}).`;
  btns=`<button class="green" id="rGo">${nb.now?'Subir':'Esperar y subir'} · ${pase?'gratis con el pase':fmtC(R0.fare)}</button>`}
 const back=z==='barrio'?'De vuelta desde Chepe: cada hora, de 6:00 a. m. a 9:00 p. m.':'Del barrio a Chepe: 7 y 10 a. m.; 1, 4 y 7 p. m.';
 const locked=Object.values(ROUTES).filter(r=>!r.open).map(r=>`<span title="${esc(r.hint)}">🔒 ${esc(r.n)}</span>`).join('');
 openPanel('🚌 La Chancha',`<canvas id="crmap" width="228" height="216"></canvas><div class="qitem"><b>${esc(from)} → ${esc(dest)}</b><p>Pasaje ${fmtC(R0.fare)}${pase?' (con el pase de Don Beto: gratis)':''} · unos ${R0.ride} min de viaje.</p><p>${sched}</p><p class="note" style="margin:4px 0 0">${back}</p></div><div class="row">${btns}</div><p class="note">Otras rutas, próximamente:</p><div class="rlock">${locked}</div>`);
 drawCR($('#crmap'),z);
 const go=$('#rGo');if(go)go.onclick=()=>boardBus(to,nb.now?0:Math.round(nb.at-S.t));
 const tx=$('#rTaxi');if(tx)tx.onclick=()=>{if(S.money<8500){toast('No te alcanza para el taxi');return}closePanel();taxiHome(8500)};
 const dw=$('#rDawn');if(dw)dw.onclick=()=>waitDawn()}
function boardBus(to,wait){closePanel();if(wait>0)fadeDo(()=>{passTime(wait);toast('⏳ Esperaste '+fmtWait(wait)+' en la parada')},()=>startTrip(to));else startTrip(to)}
function waitDawn(){closePanel();const until=S.t<360?360-S.t:1440-S.t+360;
 fadeDo(()=>{passTime(until);enAdd(-35);toast('🥶 Pasaste la noche en la parada. −35⚡');if(phOn('ariana')){phMsg('ariana','¿¿dónde estás?? te escribí mil veces 😟 avisame cuando llegués');relAdd('ar',-1)}},()=>startTrip('barrio'))}
function taxiHome(price){spend(Math.min(price,S.money),'Taxi');fadeDo(()=>{const b=BMAP.casa_jugador;P.map='ext';P.x=b.dx*T+8;P.y=(b.dy+1)*T+12;P.dir=0;passTime(30);BUBS=[];saveGame()},
 ()=>{say(null,'Don Mario te deja frente a la casa. «Pura vida, joven. Y cuídese, que la noche es traicionera».');runDialog()})}

// ---------- el viaje: escena dentro del bus ----------
const TRIP_EV=[
 {id:'vendor',txt:'Se sube un señor con un canasto: «¡Lleve las melcochas, lleve! Tres por quinientos, para el camino».',ch:[
  {t:'Comprar melcochas (₡500)',f(){if(S.money<500)return'No te alcanza. El señor te mira con lástima y sigue de largo.';spend(500,'Antojos');enAdd(6);return'Te comés una. Se te pega en las muelas los próximos diez minutos. +6⚡'}},
  {t:'No, gracias',f(){return'«Diay, usted se lo pierde», dice, y sigue por el pasillo cantando la oferta.'}}]},
 {id:'hen',txt:'A la señora del asiento de adelante se le suelta la gallina. Medio bus pega un grito.',ch:[
  {t:'Atrapar la gallina',f(){return Math.random()<.6?'¡La agarrás en el aire! La señora te echa la bendición y te regala un pedazo de queque.':'La gallina te pasa entre las piernas. Al final la atrapa un chiquito. Aplausos para él.'}},
  {t:'Hacerse el dormido',f(){return'Cerrás los ojos. Se oyen alas, gritos y a Don Beto: «¡Ese animal paga pasaje!».'}}]},
 {id:'hueco',auto:2.6,txt:'¡PUM! La Chancha cae en un hueco del tamaño de una piscina. Todo el bus pega un brinco.'},
 {id:'beto',txt:'Don Beto sube la radio: «…y el tránsito en la autopista, como siempre: a vuelta de rueda».',ch:[
  {t:'«¿Cuánto lleva manejando esta ruta?»',f(){return'«Veinte años, mae. Me sé cada hueco. A algunos hasta les puse nombre».'}},
  {t:'«¡Súbale, Don Beto!»',f(){return'Suena una cumbia. Medio bus canta. La otra mitad finge que no.'}}]},
 {id:'sleep',txt:'Un colegial se queda dormido en tu hombro. Ronca bajito.',ch:[
  {t:'Dejarlo dormir',f(){return'Es un acto de bondad. También se te durmió el brazo.'}},
  {t:'Moverse un poquito',f(){return'Se despierta asustado: «¿Ya pasamos la iglesia?». Nadie le contesta.'}}]},
 {id:'guitar',txt:'Se sube un muchacho con una guitarra: «Buenas, damas y caballeros. No vengo a robar, vengo a cantar».',ch:[
  {t:'Darle ₡200',f(){if(S.money<200)return'Le das una sonrisa. Es lo que hay.';spend(200,'Antojos');return'Te dedica la última estrofa. Desafinadísima y hermosa.'}},
  {t:'Mirar por la ventana',f(){return'Canta igual. Hay gente que nació para el bus.'}}]}];
let TRIP=null;
function pickTripEvents(first){const pool=TRIP_EV.filter(e=>e.id!=='beto'||CH.beto);let a=shuf(pool);
 if(first)a=[TRIP_EV[0],a.find(e=>e.id!=='vendor')];else a=a.slice(0,2);return a.map((e,i)=>Object.assign({at:i?.64:.27},e))}
const PAX_LOOKS=[{hair:'moño',hairColor:'#e8e8e8',skin:'#d9a066',shirt:'#a9c8ef'},{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f2c94c',acc:'gorra',accColor:'#d64545'},{hair:'cola',hairColor:'#2a1810',skin:'#c68642',shirt:'#f4f4f4',pants:'#2d3a6e'},
 {hair:'largo',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#7bb661'},{hair:'calvo',hairColor:'#cfcfcf',skin:'#b97a4a',shirt:'#e85d75',acc:'sombrero',accColor:'#c9a46a'},{hair:'rizos',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#3fb6b0'}];
function tripPax(W){const n=W>=300?4:3,gap=W/n,out=[],pi=Math.floor((n-1)/2),idx=shuf(PAX_LOOKS.map((_,i)=>i));
 for(let i=0;i<n;i++){const k=idx[i];out.push({x:Math.round(gap*(i+.5)),player:i===pi,c:i===pi?CH.player:(Math.random()<.85?fillChar(Object.assign({id:'tpax'+k,v:1},PAX_LOOKS[k])):null)})}return out}
const VEND=fillChar({id:'tvend',v:1,hair:'corto',hairColor:'#3a3a3a',skin:'#b97a4a',shirt:'#e8dcc4',pants:'#5a5f66',acc:'sombrero',accColor:'#c9a46a'});
const GUIT=fillChar({id:'tguit',v:1,hair:'rizos',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#2a2a30',pants:'#3a5f8f'});
function startTrip(to){const t=TR(),from=curZone(),fare=hasI('pase_bus')?0:ROUTES.chepe.fare;let pay;
 if(!fare)pay='Don Beto ve el pase y te hace seña: «Pase, mae».';else if(S.money>=fare){spend(fare,'Pasajes');pay='Pagaste '+fmtC(fare)+' de pasaje.'}else pay='No te alcanzaba: Don Beto te dejó subir fiado.';
 t.trips++;
 if(to==='chepe'&&!t.encGiven){t.encGiven=1;
  if(phOn('ariana')){t.enc.helado={who:'ariana',day:S.day};phQueue('ariana','¿vas para Chepe? 👀 si pasás por el Mercado traeme un helado de sorbetera porfa 🥺 aunque llegue medio derretido',8)}
  if(phOn('mama')){t.enc.culantro={who:'mama',day:S.day};phQueue('mama','Mijo, si va al Mercado Central me hace el favor y me trae culantro coyote y achiote. Allá sale más barato. Dios se lo pague.',16)}}
 const[W,H]=vSize(),c=$('#tcan');c.width=W;c.height=H;
 TRIP={from,to,t0:S.t,ride:ROUTES.chepe.ride,p:0,dur:16,t:0,u:0,W,H,bump:0,evs:pickTripEvents(t.trips===1),evI:0,ev:null,res:null,done:0,pax:tripPax(W)};
 mode='trip';$('#prompt').classList.add('hidden');showTouch();
 $('#ttitle').textContent='🚌 La Chancha · '+(from==='barrio'?'Barrio → San José':'San José → Barrio');$('#tev').classList.add('hidden');$('#trip').classList.remove('hidden');
 toast(pay);beep(262,.3,'sawtooth',.03);setTimeout(()=>beep(330,.3,'sawtooth',.03),300);
 let last=performance.now();const step=now=>{if(!TRIP||TRIP.done)return;const dt=Math.min(.05,(now-last)/1000);last=now;tripTick(dt);if(TRIP&&!TRIP.done){drawTrip();TRIP.raf=requestAnimationFrame(step)}};TRIP.raf=requestAnimationFrame(step)}
function tripTick(dt){const tp=TRIP;tp.t+=dt;tp.u+=dt*(tp.ev&&tp.ev.id==='hueco'?50:115);tp.bump=Math.max(0,tp.bump-dt*1.4);
 if(!tp.ev){tp.p=Math.min(1,tp.p+dt/tp.dur);const nx=tp.evs[tp.evI];if(nx&&tp.p>=nx.at){tp.evI++;showTripEv(nx)}if(tp.p>=1){finishTrip();return}}
 else if(tp.ev.auto&&tp.res==null){tp.evT-=dt;if(tp.evT<=0)endTripEv()}
 $('#ttime').textContent=fmtM(tp.t0+tp.p*tp.ride)+' · faltan unos '+Math.max(1,Math.round((1-tp.p)*tp.ride))+' min';$('#tprog').style.width=(tp.p*100).toFixed(1)+'%'}
function showTripEv(ev){const tp=TRIP;tp.ev=ev;tp.res=null;tp.evT=ev.auto||0;tp.evS=tp.t;if(ev.id==='hueco'){tp.bump=1;beep(110,.35,'sawtooth',.05,55)}else beep(523,.06,'square',.02);
 $('#tevt').textContent=ev.txt;const b=$('#tevb');b.innerHTML='';(ev.ch||[]).forEach((c,i)=>{const bt=document.createElement('button');bt.textContent=(i+1)+'. '+c.t;bt.onclick=()=>tripChoose(i);b.appendChild(bt)});$('#tev').classList.remove('hidden')}
function tripChoose(i){const tp=TRIP;if(!tp||!tp.ev||tp.res!=null||!tp.ev.ch)return;const c=tp.ev.ch[i];if(!c)return;beep(660,.05);tp.res=c.f()||'';$('#tevt').textContent=tp.res;
 const b=$('#tevb');b.innerHTML='';const bt=document.createElement('button');bt.textContent='Seguir';bt.onclick=endTripEv;b.appendChild(bt)}
function endTripEv(){const tp=TRIP;if(!tp)return;tp.ev=null;tp.res=null;$('#tev').classList.add('hidden')}
function tripKey(k){const tp=TRIP;if(!tp)return;if(tp.ev&&tp.ev.ch&&tp.res==null){if(/^[1-4]$/.test(k))tripChoose(+k-1);return}if(tp.ev&&(k==='enter'||k===' '||k==='e'))return endTripEv();if(k==='escape')skipTrip()}
function skipTrip(){const tp=TRIP;if(!tp||tp.done)return;tp.ev=null;$('#tev').classList.add('hidden');tp.p=1;finishTrip()}
function finishTrip(){const tp=TRIP;if(!tp||tp.done)return;tp.done=1;cancelAnimationFrame(tp.raf);
 fadeDo(()=>{$('#trip').classList.add('hidden');$('#tev').classList.add('hidden');TRIP=null;passTime(tp.ride);enAdd(-4);
  if(tp.to==='chepe'){ensureMap('chepe');P.map='chepe';P.x=4*T+8;P.y=12*T+12;P.dir=0;CARS=CARS.filter(c=>c.lane.dir<0);CBUS={x:16,st:'stop',t:2.4}}
  else{P.map='ext';P.x=24*T+8;P.y=23*T+12;P.dir=0}
  const d=ENTS.find(e=>e.special==='firulais');if(d&&S.f.dogFollow){d.map=P.map;d.x=P.x;d.y=P.y+2}
  BUBS=[];mode='play';showTouch();saveGame()},()=>arrival(tp.to))}
function arrival(to){const t=TR();
 if(to==='chepe'){if(!t.seen.chepe){t.seen.chepe=1;say(null,'San José. Chepe. El centro huele a pan recién horneado, a humo de bus y a un aguacero que todavía no cae.');say(null,'La Chancha te deja en la Avenida Segunda, frente al Parque Central. Al este está el Mercado Central y, al sur, el bulevar de la Avenida Central.');say(null,'Ojo: el último bus de vuelta al barrio sale a las 9:00 p. m.');runDialog()}else toast('🚌 Llegaste a Chepe')}
 else{toast('🏡 De vuelta en el barrio');if(!t.seen.back){t.seen.back=1;say(null,'La Chancha te deja en la parada del barrio. Después de Chepe, aquí todo se mueve más despacio. Hasta el aire.');runDialog()}}}
function drawTrip(){if(HD_ON&&typeof drawTripHD==='function')return drawTripHD();const tp=TRIP;if(!tp)return;const W=tp.W,H=tp.H,cv0=$('#tcan');if(cv0.width!==W){cv0.width=W;cv0.height=H}const g=cv0.getContext('2d');g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;
 const mins=tp.t0+tp.p*tp.ride,h=(((mins%1440)+1440)%1440)/60,[sk1,sk2]=vSkyAt(h),nt=vNight(h),q=tp.from==='barrio'?tp.p:1-tp.p;
 const sh=Math.round(Math.sin(tp.t*29)*.6+tp.bump*Math.sin(tp.t*53)*4),wy0=Math.round(H*.16),wy1=Math.round(H*.58),wh=wy1-wy0;
 const tint=c=>vcss(vmix(vmix(c,sk2,.22),[14,18,44],nt*.68)),lit=()=>vcss(vmix([60,70,90],[255,214,120],nt));
 g.fillStyle='#14101c';g.fillRect(0,0,W,H);g.save();g.translate(0,sh);
 // cielo y lejanía
 const gr=g.createLinearGradient(0,wy0,0,wy1);gr.addColorStop(0,vcss(sk1));gr.addColorStop(1,vcss(sk2));g.fillStyle=gr;g.fillRect(0,wy0-6,W,wh+12);
 if(nt>.3)for(let i=0;i<40;i++){g.fillStyle=vcss([240,240,255],nt*(.3+.6*hsh(i,7)));g.fillRect((hsh(i,3)*W)|0,wy0+((hsh(i,5)*wh*.45)|0),1,1)}
 g.fillStyle=tint('#6d8fb5');for(let x=0;x<W;x++){const X=x+tp.u*.05,y=(wy0+wh*.36-9*Math.sin(X*.018)-6*Math.sin(X*.047+1.3)-3*Math.sin(X*.11))|0;g.fillRect(x,y,1,wy1-y+6)}
 g.fillStyle=tint('#5b8a5e');for(let x=0;x<W;x++){const X=x+tp.u*.13,y=(wy0+wh*.55-6*Math.sin(X*.03+2)-4*Math.sin(X*.07))|0;g.fillRect(x,y,1,wy1-y+6)}
 // capa media: campo → autopista → ciudad
 const yG=Math.round(wy0+wh*.74),gq=clamp((q-.3)/.5,0,1);g.fillStyle=tint(vmix('#5c9e48','#7b8576',gq));
 g.fillRect(0,yG,W,wy1-yG+6);
 const o=tp.u*.45,sp=26;for(let k=Math.floor(o/sp)-1;k<Math.floor((o+W)/sp)+2;k++){const x=Math.round(k*sp-o),v=hsh(k,13),b=q+(hsh(k,11)-.5)*.2;
  if(b<.36){if(v<.4){const wc=pick2(hsh(k,4),['#e9dcb5','#f3afc0','#a6d8cb','#a9c8ef','#f6c69f']),rc=pick2(hsh(k,5),['#a3acb2','#b07a52','#8f9aa1']);g.fillStyle=tint(wc);g.fillRect(x,yG-11,20,11);g.fillStyle=tint(rc);g.fillRect(x-2,yG-16,24,6);g.fillStyle=nt>.5?lit():tint('#4f6f8c');g.fillRect(x+4,yG-8,4,4);g.fillRect(x+13,yG-8,4,4)}
   else{for(let i=0;i<3;i++){g.fillStyle=tint('#2f6b35');g.fillRect(x+i*8,yG-6,7,6);g.fillStyle=tint('#c0392b');g.fillRect(x+i*8+2,yG-4,1,1);g.fillRect(x+i*8+5,yG-3,1,1)}if(v>.85){g.fillStyle=tint('#8b6a43');g.fillRect(x+10,yG-26,2,26);g.fillStyle=tint('#3f8a3e');g.fillRect(x+4,yG-30,14,4);g.fillRect(x+7,yG-32,8,3)}}}
  else if(b<.66){if(v<.3){g.fillStyle=tint('#3a3a42');g.fillRect(x+6,yG-14,2,14);g.fillRect(x+20,yG-14,2,14);g.fillStyle=tint('#f4f4f4');g.fillRect(x,yG-30,28,16);g.fillStyle=tint(pick2(hsh(k,6),['#d6453c','#2a6fb0','#2a8f6a','#f2994a']));g.fillRect(x+1,yG-29,26,14);g.fillStyle=tint('#f4f4f4');g.fillRect(x+4,yG-25,14,2);g.fillRect(x+4,yG-21,9,2)}
   else if(v<.6){g.fillStyle=tint('#2e6e33');g.fillRect(x+4,yG-10,12,10);g.fillRect(x+6,yG-14,8,4)}}
  else{const bh=Math.round(16+hsh(k,8)*wh*.5),bw=22;g.fillStyle=tint(pick2(hsh(k,9),['#b5b0a6','#9fa8b0','#c9b79c','#8f9aa1','#d8c7a8']));g.fillRect(x,yG-bh,bw,bh);
   for(let wy=yG-bh+3;wy<yG-4;wy+=6)for(let wx=x+3;wx<x+bw-3;wx+=6){g.fillStyle=nt>.4&&hsh(wx,wy+k)<.6?lit():tint('#5b7894');g.fillRect(wx,wy,3,3)}
   if(v<.25){g.fillStyle=tint('#1d1a24');g.fillRect(x+2,yG-bh-6,18,6);g.fillStyle=nt>.4?'#f2c94c':tint('#f2c94c');g.fillRect(x+4,yG-bh-4,14,2)}}}
 // calle y capa cercana
 g.fillStyle=tint('#3e4147');g.fillRect(0,wy1-7,W,13);g.fillStyle=tint('#e8c547');const lo=(tp.u*1.6)%24;for(let x=-lo;x<W;x+=24)g.fillRect(Math.round(x),wy1-3,12,1);
 if(q>.33&&q<.7){g.fillStyle=tint('#9aa1a9');g.fillRect(0,wy1-12,W,2);g.fillStyle=tint('#6f767e');const po=(tp.u*1.5)%16;for(let x=-po;x<W;x+=16)g.fillRect(Math.round(x),wy1-12,2,6)}
 const no=tp.u*1.5,psp=110;for(let k=Math.floor(no/psp);k<Math.floor((no+W)/psp)+2;k++){const x=Math.round(k*psp-no);g.fillStyle=tint(q>.66?'#5a5f66':'#7a5a3a');g.fillRect(x,wy0+4,3,wh);g.fillRect(x-6,wy0+8,15,2);
  if(q>.66){g.fillStyle=nt>.4?'#f7e7a0':tint('#c9ccd0');g.fillRect(x+3,wy0+6,6,2)}
  g.strokeStyle=vcss(vmix([30,28,34],sk2,.1),.8);g.lineWidth=1;g.beginPath();g.moveTo(x-5,wy0+9);g.quadraticCurveTo(x+psp/2,wy0+20,x+psp-5,wy0+9);g.stroke()}
 if(S.rain){g.fillStyle='rgba(30,44,70,.25)';g.fillRect(0,wy0,W,wh);g.fillStyle='rgba(200,220,255,.55)';for(let i=0;i<50;i++){const x=(hsh(i,Math.floor(tp.t*12))*W)|0,y=wy0+((hsh(i+5,Math.floor(tp.t*12))*wh)|0);g.fillRect(x,y,1,4);g.fillRect(x+1,y+4,1,2)}}
 // interior del bus
 const n=W>=300?3:2,ww=W/n,wall='#d8d2c0',wallD='#b9b2a0';
 g.fillStyle='#4a4743';g.fillRect(0,0,W,wy0-10);g.fillStyle='#625e58';g.fillRect(0,wy0-10,W,3);g.fillStyle=wall;g.fillRect(0,wy0-7,W,7);
 for(let i=0;i<n;i++){const x=Math.round(i*ww);g.fillStyle=wall;g.fillRect(x-5,wy0-7,10,wh+12);g.fillStyle=wallD;g.fillRect(x+3,wy0-7,2,wh+12);g.fillStyle='#14101c';g.fillRect(x+5,wy0,1,wh);g.fillRect(x-6,wy0,1,wh);
  for(const[cx,cy]of[[x+5,wy0],[x+5,wy1-1]])g.fillRect(cx,cy,2,1);for(const[cx,cy]of[[x-7,wy0],[x-7,wy1-1]])g.fillRect(cx,cy,2,1)}
 g.fillStyle=wall;g.fillRect(W-5,wy0-7,5,wh+12);
 const ads=['PROHIBIDO FUMAR','CEDA EL ASIENTO','NO HABLE CON EL CHOFER'];g.font='bold 5px monospace';g.textAlign='center';g.textBaseline='top';
 for(let i=0;i<n;i++){const cx=Math.round(i*ww+ww/2),t=ads[i%3],tw=t.length*4+6;g.fillStyle='#f4ead2';g.fillRect(cx-tw/2,wy0-28,tw,9);g.fillStyle='#14101c';g.fillRect(cx-tw/2,wy0-28,tw,1);g.fillStyle='#c0473b';g.fillText(t,cx,wy0-26)}
 g.fillStyle='#c9ccd0';g.fillRect(0,wy0-16,W,2);for(let x=14;x<W;x+=34){const sw=Math.round(Math.sin(tp.t*2.2+x)*1.5+sh*.5);g.fillStyle='#2a2a30';g.fillRect(x,wy0-14,1,6);g.fillRect(x-2+sw,wy0-8,5,1);g.fillRect(x-2+sw,wy0-8,1,5);g.fillRect(x+2+sw,wy0-8,1,5);g.fillRect(x-2+sw,wy0-4,5,1)}
 g.fillStyle=wallD;g.fillRect(0,wy1,W,6);g.fillStyle=wall;g.fillRect(0,wy1+6,W,H);
 const fy=Math.round(H*.86),sy=wy1+10;
 for(const p of tp.pax){const x=p.x;g.fillStyle='#24497d';g.fillRect(x-17,sy-26,7,fy-sy+26);g.fillStyle='#3a6cb0';g.fillRect(x-17,sy-26,7,2);g.fillStyle='#c9ccd0';g.fillRect(x-16,sy-30,5,4);
  if(p.c){const dy=Math.round(Math.sin(tp.t*29+x)*.5);if(HD_ON)g.drawImage(hdCharImg(p.c,3,6),0,0,36,42,x-12,sy-36+dy,36,42);else g.drawImage(sprite(p.c,3,0),0,0,18,19,x-12,sy-34+dy,36,38);if(p.player&&Math.floor(tp.t*2)%2===0){g.fillStyle='#f2c94c';g.fillRect(x+5,sy-42,5,2);g.fillRect(x+6,sy-40,3,1);g.fillRect(x+7,sy-39,1,1)}}
  g.fillStyle='#2f5f9e';g.fillRect(x-14,sy+4,26,fy-sy-4);g.fillStyle='#3a6cb0';g.fillRect(x-14,sy+4,26,2)}
 g.fillStyle='#3a3a40';g.fillRect(0,fy,W,H-fy);for(let x=0;x<W;x+=4){g.fillStyle='#33333a';g.fillRect(x,fy+3,2,H-fy)}g.fillStyle='#e8c547';g.fillRect(0,fy,W,2);
 // lo que pasa en el pasillo
 const ev=tp.ev,ea=ev?tp.t-tp.evS:0;
 if(ev&&ev.id==='vendor'){const x=Math.round(W-14-ea*18%(W+30));drawCharAt(g,VEND,2,Math.floor(ea*5)%3,x-27,fy-74,54,78);g.fillStyle='#8a6a45';g.fillRect(x+6,fy-38,16,10);g.fillStyle='#e0a34f';g.fillRect(x+8,fy-41,12,3)}
 if(ev&&ev.id==='guitar'){const x=Math.round(W*.82);drawCharAt(g,GUIT,2,0,x-27,fy-74,54,78);g.fillStyle='#8a5a2b';g.fillRect(x-14,fy-40,16,10);g.fillStyle='#5c3d24';g.fillRect(x-24,fy-37,12,3);if(Math.floor(tp.t*3)%2){g.fillStyle='#f4ead2';g.fillRect(x-30,fy-60,3,5);g.fillRect(x-28,fy-62,3,1)}}
 if(ev&&ev.id==='hen'){const x=Math.round(W/2+Math.sin(ea*3.2)*W*.36),hy=fy-26-Math.abs(Math.sin(ea*9))*10;g.drawImage(animSpr('hen','#f4f4f4',Math.floor(ea*8)%2,Math.cos(ea*3.2)<0),x-24,Math.round(hy),48,42)}
 if(ev&&ev.id==='sleep'){const pp=tp.pax.find(p=>p.player);if(pp){g.fillStyle='#f4ead2';g.font='bold 9px monospace';for(let i=0;i<3;i++){const t2=(ea*.8+i*.33)%1;g.globalAlpha=1-t2;g.fillText('z',pp.x-22-i*4,sy-44-t2*16)}g.globalAlpha=1}}
 if(ev&&ev.id==='beto'&&Math.floor(tp.t*3)%2){g.fillStyle='#f2c94c';g.fillRect(W-24,wy0-36,3,6);g.fillRect(W-22,wy0-38,4,2);g.fillRect(W-16,wy0-32,3,6);g.fillRect(W-14,wy0-34,4,2)}
 g.restore()}


