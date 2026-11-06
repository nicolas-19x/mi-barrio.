// ================= CIUDAD QUESADA (San Carlos): el parque, en estilo B (remasterizado, escala grande) =================
// Referencias (fotos del usuario, norte arriba):
//  · Al norte, cruzando la Calle Central, la Catedral de Ciudad Quesada (próximo paso; por ahora su jardín y su reja).
//  · Frente a la catedral, la única fuente del parque: estanque de dos lóbulos, borde celeste, piedras de río y baranda,
//    sobre una plaza de adoquín rojizo con cordón verde.
//  · Al centro, unida a la plaza de la fuente por una «cintura», la plaza clara del kiosco: kiosco redondo de cúpula blanca,
//    columnas blancas con basas y capiteles verdes, piso de mosaico y escalinatas con baranda verde y balaustres blancos.
//  · Senderos de concreto con franja amarilla salen en estrella desde el kiosco.
//  · Al suroeste, dos juegos infantiles separados por un sendero: caucho de colores en ondas, y otro azul con estrellas,
//    columpios verdes, tobogán azul, mesas azules con sombrilla y un murito verde con piedras grandes.
//  · Árboles grandes de copa redonda (sin palmeras). Alrededor: avenidas con carros estacionados a los dos lados y una calle al sur.
// Escala: una casilla ≈ 1 m (la gente mide 1,7 casillas). Medidas en píxeles HD del mapa (32 por casilla).
const QS={W:64,H:78,oy:20,park:[160,320,1888,1696],   // oy: filas que la catedral agrega arriba (todo lo del parque va corrido oy casillas)
 
  fu:{x:1030,y:538,r:197},ki:{x:1030,y:952,r:231},lob:[[969,538,68],[1102,548,80]],
  paths:[[100,952,1960,952],[1030,952,1030,1750],[1030,952,120,296],[1030,952,1940,296],[1030,952,1940,1745],[568,952,568,1750]],pw:34,
  ondas:[224,1102,531,1605],estrellas:[609,1102,969,1605],
  trees:[[7,14,0,2.9],[6,20,1,2.6],[7,26,0,2.8],[17,12,1,2.7],[44,12,0,2.8],[54,15,1,3.1],[55,24,0,2.7],[56,35,1,3.0],[53,42,0,3.0],
         [42,48,1,3.0],[35,40,0,2.5],[24,19,1,2.3],[40,20,0,2.4]],
  lamps:[[13,27],[48,27],[22,17],[40,17],[34,40],[46,36],[15,32],[26,33],[25,25],[43,25]],
  slamps:[[14,5],[24,5],[46,5],[20,53],[44,53]],
  benches:[[9,27],[18,27],[44,27],[52,27],[10,31],[52,31],[26,13],[37,13],[27,33],[37,33],[50,40],[6,40],[6,45]],
  bins:[[12,31],[47,31],[30,34],[36,24]],
  cars:[],kiosko:[28,28,9,4]};
// carros estacionados: avenidas (verticales) a los dos lados y la calle sur (horizontales)
(()=>{const C=['#e8e8e4','#c0392b','#9aa3ab','#23242a','#2f5fa8','#7a1f2a','#e8e8e4','#d8d4c8','#3f6f4a','#9aa3ab'];let k=0;const add=(x,y,v)=>QS.cars.push([x,y,v,C[(k++*7+3)%C.length]]);
  for(const y of[12,15,18,24,35,38,41,47])add(3,y,1);for(const y of[13,20,27,33,44,49])add(1,y,1);
  for(const y of[11,14,21,25,32,39,45])add(60,y,1);for(const y of[16,19,28,36,42,48])add(62,y,1);
  for(const x of[10,16,22,36,42,50])add(x,54,0);for(const x of[13,28,46])add(x,56,0)})();
const qsSmin=(a,b,k)=>{const h=Math.max(0,Math.min(1,.5+.5*(b-a)/k));return b+(a-b)*h-k*h*(1-h)};
function qsSeg(px,py,s){const ax=s[0],ay=s[1],dx=s[2]-ax,dy=s[3]-ay,L2=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/L2)),qx=ax+dx*t-px,qy=ay+dy*t-py;
  return[Math.sqrt(qx*qx+qy*qy),t*Math.sqrt(L2),(dx*(py-ay)-dy*(px-ax))]}
const qsPoolD=(X,Y)=>{const a=QS.lob[0],c=QS.lob[1];return qsSmin(Math.hypot(X-a[0],Y-a[1])-a[2],Math.hypot(X-c[0],Y-c[1])-c[2],22)};
const qsPlazaD=(X,Y)=>{const d1=Math.hypot(X-QS.fu.x,Y-QS.fu.y)-QS.fu.r,d2=Math.hypot(X-QS.ki.x,Y-QS.ki.y)-QS.ki.r;return[qsSmin(d1,d2,80),d1<d2]};
// ---- suelo del parque: se pinta por capas, cada una solo en su recuadro ----
function qsGround(b){const[px0,py0,px1,py1]=QS.park,d=b.d,W=b.w,M=new Uint8Array(W*b.h),   // M: 1 sendero, 2 juegos, 3 plaza
  put=(X,Y,c)=>{const k=(Y*W+X)<<2;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255},get=(X,Y)=>{const k=(Y*W+X)<<2;return[d[k],d[k+1],d[k+2]]},
  mulP=(X,Y,f)=>{const k=(Y*W+X)<<2;d[k]*=f;d[k+1]*=f;d[k+2]*=f};
  // pasto: matojos, florcitas y partes peladas
  for(let i=0;i<9000;i++){const X=px0+((hsh(i,11)*(px1-px0))|0),Y=py0+((hsh(11,i)*(py1-py0))|0),v=hsh(i,5);
    if(v<.75){const L=2+((hsh(i,7)*3)|0),c=v<.4?[58,104,40]:[120,170,70];for(let t=0;t<L;t++)put(X+(t>1&&v<.2?1:0),Y-t,hdS(c,1-t*.06))}
    else if(v<.82){put(X,Y,[244,240,226]);put(X+1,Y,[236,226,140])}else if(v<.86)put(X,Y,[240,206,70])}
  for(let i=0;i<34;i++){const cx=px0+hsh(i,23)*(px1-px0),cy=py0+hsh(23,i)*(py1-py0),rx=14+hsh(i,2)*26,ry=rx*.45;
    for(let Y=(cy-ry)|0;Y<cy+ry;Y++)for(let X=(cx-rx)|0;X<cx+rx;X++){const u=(X-cx)/rx,v=(Y-cy)/ry,q=u*u+v*v+(hdVN(X,Y,7,4)-.5)*.6;if(q<1)put(X,Y,hdMix(get(X,Y),[150,132,94],.35*(1-q)))}}
  // senderos de losas: juntas, grietas, manchas, franja amarilla y zacate metido en el borde
  for(const s of QS.paths){const x0=Math.max(px0,Math.min(s[0],s[2])-QS.pw-4)|0,x1=Math.min(px1,Math.max(s[0],s[2])+QS.pw+4)|0,y0=Math.max(py0,Math.min(s[1],s[3])-QS.pw-4)|0,y1=Math.min(py1,Math.max(s[1],s[3])+QS.pw+4)|0;
    for(let Y=y0;Y<y1;Y++)for(let X=x0;X<x1;X++){const r=qsSeg(X,Y,s),dd=r[0];if(dd>=QS.pw)continue;const n=hdr(X,Y),along=r[1],across=QS.pw+(r[2]>0?-dd:dd);
      let c=hdS(((along/42)|0)%2?[206,202,192]:[198,194,184],.94+n*.09-(hdVN(X,Y,24,11)>.7?.08:0));
      if(along%42<1.3||Math.abs(across-QS.pw)<.7)c=hdS(c,.8);else if(along%42<2.4)c=hdS(c,1.06);
      if(dd>QS.pw-12&&dd<QS.pw-5&&r[2]>0){c=hdS([222,184,58],.92+n*.12);if((X%4===1)&&(Y%4===1))c=hdS(c,1.15);if((X%4===2)&&(Y%4===2))c=hdS(c,.82)}
      if(dd>QS.pw-2){c=hdS(c,.74);if(hsh(X,Y*3)<.25)c=[84,128,54]}
      if(hdr(X*5,Y*3)>.996)c=[88,86,84];put(X,Y,c);M[Y*W+X]=1}
    for(let k=0;k<14;k++){const t=hsh(k,s[0])*.96,sx=s[0]+(s[2]-s[0])*t,sy=s[1]+(s[3]-s[1])*t;let x=sx+(hsh(s[1],k)-.5)*40,y=sy+(hsh(k,s[3])-.5)*40;
      for(let j=0;j<16;j++){x+=hsh(k*9,j)-.5+.6;y+=hsh(j,k*9)-.5;const X=x|0,Y=y|0;if(X>0&&Y>0&&X<W&&Y<b.h&&M[Y*W+X]===1)mulP(X,Y,.78)}}}
  // juegos infantiles (caucho)
  const ONDAS=[[214,58,56],[44,98,204],[124,70,170],[238,190,50],[52,160,84],[226,92,140],[40,150,200]];
  for(const[k,R]of[['ondas',QS.ondas],['estrellas',QS.estrellas]])for(let Y=R[1]|0;Y<R[3];Y++)for(let X=R[0]|0;X<R[2];X++){const bx=X-R[0],by=Y-R[1],edge=Math.min(bx,by,R[2]-1-X,R[3]-1-Y),n=hdr(X,Y);let c;
    if(edge<6)c=k==='ondas'?hdS([36,82,180],edge<1.5?.68:edge<3?1.12:.96):hdS([46,136,78],edge<1.5?.68:edge<3?1.12:.96);
    else if(k==='ondas'){const v=bx+34*Math.sin(by/70+bx/140)+15*Math.sin(by/26),bi=Math.floor(v/48),f=v/48-bi;c=ONDAS[((bi%7)+7)%7];if(f<.03)c=hdS(c,1.2);else if(f>.97)c=hdS(c,.84)}
    else{const cx=R[0]+250,cy=R[1]+360,dd=Math.hypot(X-cx,Y-cy);c=dd<80?[54,150,92]:dd<96?[204,58,58]:[34,58,150];if(dd>=80&&dd<96&&((Math.atan2(Y-cy,X-cx)*8/Math.PI)&1))c=[230,200,60];
      const sx=((bx+30)%84)-42,sy=((by+(((bx+30)/84|0)%2)*42)%84)-42,a=Math.atan2(sy,sx),rr=Math.hypot(sx,sy),st=8+4.5*Math.cos(5*a);if(rr<st&&dd>96)c=rr<st-2?[244,204,60]:[200,150,40]}
    c=hdS(c,.9+n*.16);if(hdr(X*3,Y*7)>.97)c=hdS(c,1.18);if(edge>=6&&hdr(X*7,Y*11)>.993)c=hdS(c,.7);put(X,Y,c);M[Y*W+X]=2}
  // plazas unidas: la de la fuente (adoquín en espina de pescado) y la del kiosco (losas con cenefa)
  const bx0=(QS.fu.x-QS.ki.r-90)|0,bx1=(QS.fu.x+QS.ki.r+90)|0,by0=(QS.fu.y-QS.fu.r-8)|0,by1=(QS.ki.y+QS.ki.r+8)|0;
  for(let Y=by0;Y<by1;Y++)for(let X=bx0;X<bx1;X++){const[dp,fuente]=qsPlazaD(X,Y);if(dp>=8)continue;const n=hdr(X,Y);
    if(dp>=0){if(M[Y*W+X]!==1)mulP(X,Y,.8+dp*.025);continue}
    let c;
    if(dp>-7)c=hdS([52,112,98],(dp>-3?1.2:dp>-5?1:.78)*(.94+n*.1));                        // cordón pintado de verde
    else if(fuente){const u=X+Y,v=X-Y,bu=Math.floor(u/16),bv=Math.floor(v/8),hb=((bu+bv)&1)?((u%16+16)%16<1||(v%8+8)%8<1):((v%16+16)%16<1||(u%8+8)%8<1);
      const bi=hsh(bu*3+bv,bv*7-bu);c=hb?[78,52,48]:hdS(bi<.3?[128,70,58]:bi<.62?[114,64,56]:bi<.9?[140,82,66]:[98,60,54],.92+n*.12-(hdVN(X,Y,30,8)>.66?.1:0))}
    else{const rr=Math.hypot(X-QS.ki.x,Y-QS.ki.y);
      if(rr>QS.ki.r-34){const u=X&15,v=Y&15;c=(u===0||v===0)?[110,96,84]:hdS(hsh(X>>4,Y>>4)<.5?[168,112,84]:[150,98,74],.94+n*.1)}       // cenefa de ladrillo
      else{const u=X&23,v=Y&23,j=u===0||v===0;c=j?[150,146,140]:hdS(((X/24|0)+(Y/24|0))&1?[206,202,194]:[194,190,182],.95+n*.08-(hdVN(X,Y,34,3)>.72?.07:0));if(!j&&(u===12||v===12)&&hsh(X>>3,Y>>3)<.1)c=hdS(c,.86)}}
    put(X,Y,c);M[Y*W+X]=3}
  // fuente de dos lóbulos: agua con reflejos y monedas, borde celeste, piedras de río
  const fx0=(QS.lob[0][0]-QS.lob[0][2]-40)|0,fx1=(QS.lob[1][0]+QS.lob[1][2]+40)|0,fy0=(QS.fu.y-110)|0,fy1=(QS.fu.y+120)|0;
  for(let Y=fy0;Y<fy1;Y++)for(let X=fx0;X<fx1;X++){const dq=qsPoolD(X,Y);if(dq>=20)continue;const n=hdr(X,Y);let c;
    if(dq<-10){const e=Math.min(1,-dq/52),r=Math.sin(X*.15+Math.sin(Y*.09)*2.4)+Math.sin(Y*.19-X*.05);c=hdMix([156,226,236],[52,146,188],e);
      if(((X>>3)+(Y>>3))%2===0)c=hdS(c,1.03);if(r>1.5)c=hdMix(c,[238,252,252],.55);else if(r<-1.55)c=hdS(c,.88);
      if(Y<QS.fu.y-20&&dq<-30&&r>1.2)c=hdMix(c,[255,255,255],.25);
      const cn=hsh(X>>1,Y>>1);if(cn>.9975)c=[214,170,70];else if(cn>.9955)c=[196,196,190];else if(cn>.9945)c=[170,104,60];if(n>.993)c=[250,255,255]}
    else if(dq<-2){const top=Y<QS.fu.y;c=hdS([62,146,206],(dq<-8?1.25:top?1.1:.84)+n*.06)}
    else if(dq<18){const[id,e]=sjoStone(X*1.05,Y*1.5,5.5),v=hsh(id,3),base=v<.3?[150,146,138]:v<.6?[122,112,100]:v<.85?[176,170,158]:[96,90,86];
      c=e<.8?[52,46,44]:hdS(base,.84+hsh(id,5)*.26+(e>2.2?.1:0)-(e<1.4?.08:0))}
    else c=hdS(get(X,Y),.8);put(X,Y,c)}
  return M}
// ---- kiosco: mismo motor de rayos del templete (ver hd/87_parque.js), con su propia escena, a escala grande ----
const QK={K:.5,KW:316,KH:332,CX:158,GY:230,split:262,R:136,rc:109,zb:24,zc:130,zv:147,zd:151,Rd:119,Hd:54};
const QK_PAL={blanco:tplRamp([[0,'#363948'],[.3,'#7c8190'],[.6,'#c9ccd0'],[.82,'#ebebe6'],[1,'#fffdf4']],12),
  verde:tplRamp([[0,'#13241f'],[.35,'#2c5248'],[.62,'#4b7f71'],[.84,'#79a898'],[1,'#b9d6c8']],12),
  piedra:tplRamp([[0,'#232228'],[.4,'#56555b'],[.7,'#8f8b86'],[1,'#c8c2b6']],12),
  mosaico:tplRamp([[0,'#3a3638'],[.4,'#7b7470'],[.7,'#c2b8a8'],[1,'#f0e8d8']],12),
  grada:tplRamp([[0,'#38373f'],[.4,'#78767a'],[.7,'#b4aea4'],[1,'#ece4d4']],12),
  cupula:tplRamp([[0,'#3d4152'],[.3,'#80858f'],[.58,'#c6c8c8'],[.8,'#e6e6e0'],[1,'#fffef6']],12)};
function qkScene(){const S=QK,P=[],nz=(x,y,z,d)=>{const n=Math.hypot(x,y,z);return[x/n,y/n,z/n,d/n]};
  const box=(x0,x1,y0,y1,z0,z1,m,o)=>P.push(Object.assign({k:'poly',m,bx:[x0,x1],bb:[x0,x1,y0,y1,z0,z1],pl:[[1,0,0,x1],[-1,0,0,-x0],[0,1,0,y1],[0,-1,0,-y0],[0,0,1,z1],[0,0,-1,-z0]]},o||{}));
  const cyl=(cx,cy,R,z0,z1,m,o)=>P.push(Object.assign({k:'cyl',cx,cy,R,z0,z1,m,bx:[cx-R,cx+R],bb:[cx-R,cx+R,cy-R,cy+R,z0,z1]},o||{}));
  cyl(0,0,S.R,-2,S.zb,'piedra');cyl(0,0,S.R+3,-2,4,'piedra',{zoc:1});
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,cx=S.rc*Math.cos(a),cy=S.rc*Math.sin(a);
    cyl(cx,cy,10,S.zb,S.zc,'blanco');cyl(cx,cy,13.5,S.zb,S.zb+13,'verde');cyl(cx,cy,15.5,S.zb,S.zb+4,'verde');cyl(cx,cy,12,S.zb+17,S.zb+19,'verde');
    cyl(cx,cy,13.5,S.zc-12,S.zc,'verde');cyl(cx,cy,15.5,S.zc-3,S.zc,'verde')}
  cyl(0,0,S.rc+12,S.zc,S.zv,'viga');cyl(0,0,S.rc+13,S.zc,S.zc+3,'verde');cyl(0,0,S.rc+16,S.zv-3,S.zd,'viga');
  cyl(0,0,S.Rd+2,S.zd,S.zd+4,'viga');P.push({k:'dome',R:S.Rd,H:S.Hd,zc:S.zd+4,m:'cupula',bx:[-S.Rd,S.Rd],bb:[-S.Rd,S.Rd,-S.Rd,S.Rd,S.zd+4,S.zd+4+S.Hd]});
  cyl(0,0,7,S.zd+S.Hd+2,S.zd+S.Hd+9,'piedra');cyl(0,0,3,S.zd+S.Hd+9,S.zd+S.Hd+16,'piedra');
  // escalinatas al norte y al sur, con muros de baranda en rampa (tres gradas de 8)
  const y0=100,yr=S.R;for(const sg of[-1,1]){for(let i=0;i<3;i++){const y1=yr+12*(i+1);if(sg>0)box(-34,34,y0,y1,0,S.zb-8*(i+1),'grada',{yf:y1});else box(-34,34,-y1,-y0,0,S.zb-8*(i+1),'grada',{yf:-y1})}
    const sl=(S.zb-2)/36;for(const sx of[-1,1]){const x0=sx<0?-44:34,x1=sx<0?-34:44,ya=yr-14,yb=yr+37;P.push({k:'poly',m:'muro',bx:[x0,x1],bb:[x0,x1,sg>0?ya:-yb,sg>0?yb:-ya,0,S.zb],
      pl:[[1,0,0,x1],[-1,0,0,-x0],sg>0?[0,1,0,yb]:[0,1,0,-ya],sg>0?[0,-1,0,-ya]:[0,-1,0,yb],[0,0,1,S.zb],[0,0,-1,0],nz(0,sg*sl,1,S.zb+sl*yr)]})}}
  for(const p of P){const q=p.bb;p.sy0=S.GY+S.K*q[2]-q[5]-1;p.sy1=S.GY+S.K*q[3]-q[4]+1}
  return P}
function qkShade(p,h,X,Y,Z,px,py,lit,amb){const S=QK,r=Math.hypot(X,Y),nz=h[3],ph=Math.atan2(Y,X),tex=(s,a)=>(hdVN(px,py,s,13)-.5)*a+(hdr(px,py)-.5)*a*.6;let pal,n=0;
  switch(p.m){
  case'cupula':{pal=QK_PAL.cupula;const e=Math.max(0,(Z-S.zd-4)/S.Hd);n=tex(7,.06);const st=hdVN(ph*S.Rd*.8+30,e*2.4,5,17);if(st>.62&&e<.85)n-=(st-.62)*.42*(1-e);if(e<.14)n-=(.14-e)*.7;
    const seg=((ph/(Math.PI/8))%1+1)%1;if(e<.9&&(seg<.03||seg>.97))n-=.07;if(Math.abs(e-.45)<.012)n-=.06;break}       // juntas de la cúpula
  case'blanco':pal=QK_PAL.blanco;n=tex(4,.05);if(hdVN(px,py*.2,3,5)>.72)n-=.05;break;
  case'viga':pal=QK_PAL.blanco;n=tex(4,.05);if(Z<S.zv&&Z>S.zc+4){const u=ph*(S.rc+12);if(Z<S.zc+9&&((((u/6)|0)&1)===0))n-=.12}if(nz<-.5)n-=.1;break;   // dentellones
  case'verde':pal=QK_PAL.verde;n=tex(3,.05);break;
  case'piedra':case'muro':pal=QK_PAL.piedra;n=tex(3,.08);
    if(nz<.5){const row=Math.floor((Z+2)/8),off=(row&1)*9,u=ph*S.R;if(((u+off)%18+18)%18<1.1||((Z+2)%8)<.9)n-=.15;if(hsh(Math.floor((u+off)/18),row)>.8)n+=.05}
    if(nz>.5&&p.m==='piedra'&&!p.zoc){if(r<S.R-4){pal=QK_PAL.mosaico;const T_=12,u=Math.floor((X+400)/T_),v=Math.floor((Y+400)/T_),dx=((X+400)%T_+T_)%T_,dy=((Y+400)%T_+T_)%T_;
        n=((u+v)&1)?.1:-.04;if(Math.abs(dx-dy)<1||Math.abs(dx+dy-T_)<1)n-=.16;if(dx<.8||dy<.8)n-=.1;if(Math.hypot(dx-6,dy-6)<2.2)n+=.12;if(r>S.R-22)n=(((ph*S.R/8)|0)&1)?-.08:.06}
      else n+=.06}break;
  case'grada':pal=QK_PAL.grada;n=tex(4,.06);if(nz>.5){if(Math.abs(p.yf-Y)<1.6)n+=.13;const u=((X+300)%12+12)%12;if(Math.abs(u-6)<1)n-=.1;if(Math.hypot(u-6,((Y%6)+6)%6-3)<1.5)n-=.06}else n-=.05;break;
  default:pal=QK_PAL.blanco}
  return[pal,amb+lit+n]}
function hdKioscoQ(){const S=QK,W=S.KW,H=S.KH,b=hdBuf(W,H),P=qkScene(),L=TPL.L,K=S.K,dl=Math.hypot(1,K),d=[0,-1/dl,-K/dl],T_=new Float32Array(W*H).fill(1e9),SH=P.slice().sort((a,c)=>(c.m==='cupula')-(a.m==='cupula'));
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){const x=px+.5-S.CX,s=py+.5-S.GY,sy=py+.5,o=[x,900,K*900-s];let best=null,bp=null;
    for(const p of P){if(x<p.bx[0]-.5||x>p.bx[1]+.5||sy<p.sy0||sy>p.sy1)continue;const h=tplIsect(p,o,d);if(h&&(!best||h[0]<best[0])){best=h;bp=p}}
    const tg=o[2]/(K/dl),gy=o[1]+tg*d[1];
    if(!best||tg<best[0]){const rr=Math.hypot(x,gy);let ao=0;if(rr>S.R)ao=.34*Math.max(0,1-(rr-S.R-3)/10);if(Math.abs(gy)>S.R&&Math.abs(gy)<S.R+40&&Math.abs(x)<46)ao=Math.max(ao,.26*Math.max(0,1-Math.abs(Math.abs(x)-44)/6));if(ao>.01)hdP(b,px,py,[20,14,22],ao);continue}
    T_[py*W+px]=best[0];const X=o[0]+best[0]*d[0],Y=o[1]+best[0]*d[1],Z=o[2]+best[0]*d[2],nd=best[1]*L[0]+best[2]*L[1]+best[3]*L[2];
    let lit=0;if(nd>0){let sh=false;const so=[X+best[1]*.05+L[0]*.05,Y+best[2]*.05+L[1]*.05,Z+best[3]*.05+L[2]*.05];for(const p of SH){if(!tplBox(so,L,p.bb))continue;if(tplIsect(p,so,L)){sh=true;break}}if(!sh)lit=nd*.66}
    const r=Math.hypot(X,Y);let amb=.36*(.8+.2*best[3]);if(r<S.Rd&&Z>S.zb-.1&&Z<S.zd)amb*=.6;
    const[pal,v]=qkShade(bp,best,X,Y,Z,px,py,lit,amb),N=pal.length,k=Math.max(0,Math.min(N-1,Math.floor(v*1.08*(N-1)+.5+TPL_BAYER[(py&3)*4+(px&3)]*.9)));hdP(b,px,py,pal[k])}
  const D=b.d,mul=(i,f)=>{D[i]*=f;D[i+1]*=f;D[i+2]*=f};
  for(let py=1;py<H-1;py++)for(let px=1;px<W-1;px++){const i=py*W+px,t=T_[i];if(t>=1e9)continue;for(const u of[T_[i-1],T_[i+1],T_[i-W],T_[i+W]])if(u<t-9){mul(i<<2,.8);break}
    if(T_[i+W]>=1e9&&D[((i+W)<<2)+3]<200)mul(i<<2,.78)}
  // barandas: balaustres blancos torneados y pasamanos verde (como en la foto)
  const pt=(x,y,z)=>[S.CX+x,S.GY+K*y-z],G=QK_PAL.verde,Wb=QK_PAL.blanco,top=y=>S.zb-Math.max(0,Math.abs(y)-S.R)*((S.zb-2)/36);
  for(const sg of[-1,1])for(const sx of[-1,1]){const x=39*sx;
    for(const xo of[-3,3])for(let yy=S.R-12;yy<=S.R+36;yy+=6){const y=yy*sg,[p0,p1]=pt(x+xo,y,top(y)),hgt=15;for(let k=0;k<hgt;k++){const w=k<2||k>12?4:k===4||k===10?4:k>5&&k<9?3:2,X=Math.round(p0)-(w>>1),Y=Math.round(p1-k);
      hdR(b,X,Y,w,1,Wb[9]);hdP(b,X,Y,Wb[11]);hdP(b,X+w-1,Y,Wb[5])}}
    const[a0,a1]=pt(x,(S.R-12)*sg,top((S.R-12)*sg)+17),[b0,b1]=pt(x,(S.R+37)*sg,top((S.R+37)*sg)+17);hdLine(b,a0,a1+3,b0,b1+3,G[1],1,2);hdLine(b,a0,a1,b0,b1,G[5],1,3);hdLine(b,a0,a1-1,b0,b1-1,G[9],1,1)}
  return b}
function hdKioscoQSplit(){const b=hdKioscoQ(),s=QK.split,W=b.w,lo=hdBuf(W,b.h-s),hi=hdBuf(W,s);hi.d.set(b.d.subarray(0,s*W*4));lo.d.set(b.d.subarray(s*W*4));
  return{lo,hi,X:QS.ki.x-QK.CX,Y:QS.ki.y-QK.GY,b}}
// sombra del sol del kiosco (en unidades del mundo: la mitad del HD)
function qkSombra(g,vx,vy){const S=QK,gx=QS.ki.x/2,gy=(QS.ki.y+QS.oy*HT)/2,E=(x,y,rx,ry)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()},h=v=>v/2;
  for(let z=0;z<=h(S.zb);z+=3)E(gx+vx*z,gy+vy*z,S.R/2,S.R/4);
  g.lineWidth=10;for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,cx=gx+S.rc/2*Math.cos(a),cy=gy+S.rc/4*Math.sin(a);g.beginPath();g.moveTo(cx+vx*h(S.zb),cy+vy*h(S.zb));g.lineTo(cx+vx*h(S.zc),cy+vy*h(S.zc));g.stroke()}
  for(let z=h(S.zc);z<=h(S.zd);z+=2)E(gx+vx*z,gy+vy*z,(S.rc+16)/2,(S.rc+16)/4);
  for(let z=h(S.zd);z<h(S.zd+S.Hd);z+=2.5){const r=S.Rd/2*Math.sqrt(Math.max(0,1-((z-h(S.zd))/h(S.Hd))**2));E(gx+vx*z,gy+vy*z,r,r*.5)}}
// ---- objetos (sprites en búfer, con su luz desde el oeste) ----
function qsLampSpr(){const b=hdBuf(18,96),M=[[22,22,26],[46,48,54],[84,88,96],[120,124,132]];
  hdR(b,4,90,10,6,M[0]);hdR(b,4,90,10,1,M[3]);hdR(b,5,86,8,4,M[1]);for(let y=16;y<86;y++){hdP(b,7,y,M[3]);hdP(b,8,y,M[2]);hdP(b,9,y,M[1]);hdP(b,10,y,M[0])}
  hdR(b,6,40,6,2,M[1]);hdEll(b,9,10,7,7,[196,200,204]);hdEll(b,8,9,5.4,5.4,[234,236,234]);hdEll(b,7,7,2.4,2.4,[255,255,252]);hdR(b,4,2,11,2,M[1]);hdR(b,6,1,7,1,M[2]);hdR(b,7,16,4,2,M[0]);return b}
function qsStreetLamp(){const b=hdBuf(56,140),M=[[40,40,44],[70,72,78],[120,124,130]];for(let y=20;y<134;y++){hdP(b,27,y,M[2]);hdP(b,28,y,M[1]);hdP(b,29,y,M[0])}hdR(b,23,132,10,6,M[0]);
  for(const sg of[-1,1]){for(let t=0;t<22;t++){hdP(b,28+sg*t,22-t*.35,M[1]);hdP(b,28+sg*t,23-t*.35,M[0])}hdR(b,sg<0?2:44,12,11,4,M[0]);hdR(b,sg<0?3:45,15,9,2,[246,242,220])}return b}
function qsBench(b,X,Y){const B=[[22,52,120],[40,92,190],[70,128,224],[120,170,240]],L=[[30,30,36],[60,60,68]];
  hdR(b,X+1,Y+15,32,4,[20,16,24],.28);hdR(b,X+3,Y+9,3,7,L[0]);hdR(b,X+28,Y+9,3,7,L[0]);hdR(b,X+3,Y+9,1,7,L[1]);
  for(let i=0;i<3;i++){hdR(b,X,Y+i*3,34,2,B[1]);hdR(b,X,Y+i*3,34,1,B[3])}hdR(b,X,Y+10,34,3,B[1]);hdR(b,X,Y+10,34,1,B[2]);hdR(b,X,Y+12,34,1,B[0])}
function qsBin(b,X,Y){const G=[[24,70,46],[40,110,70],[80,160,110]];hdEll(b,X+8,Y+21,8,3,[20,16,24],.3);hdR(b,X+2,Y+4,12,17,G[1]);hdR(b,X+2,Y+4,3,17,G[2]);hdR(b,X+11,Y+4,3,17,G[0]);hdR(b,X+1,Y+2,14,3,G[0]);hdR(b,X+1,Y+2,14,1,G[2]);for(let y=Y+8;y<Y+20;y+=4)hdR(b,X+5,y,6,1,G[0])}
function qsCar(b,cx,cy,vert,col){const c=hdC(col),w=vert?28:60,h=vert?60:28,x=Math.round(cx-w/2),y=Math.round(cy-h/2),gl=[[34,52,76],[86,124,160],[150,186,210]];
  hdR(b,x+3,y+4,w,h,[18,14,20],.34);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const ex=Math.min(i,w-1-i),ey=Math.min(j,h-1-j);if(ex+ey<4)continue;const u=(vert?i/(w-1):j/(h-1));let f=1.14-.36*u+(hdr(x+i,y+j)-.5)*.03;if(ex<1||ey<1)f*=.66;else if(ex<2||ey<2)f*=.86;hdP(b,x+i,y+j,hdS(c,f))}
  if(vert){hdR(b,x+4,y+12,w-8,10,gl[0]);hdR(b,x+5,y+13,8,2,gl[2]);hdR(b,x+4,y+40,w-8,7,gl[0]);hdR(b,x+5,y+22,w-10,18,hdS(c,1.1));hdR(b,x+5,y+22,w-10,1,hdS(c,1.25));
    hdR(b,x+2,y+23,2,15,gl[1]);hdR(b,x+w-4,y+23,2,15,gl[0]);hdR(b,x+3,y+1,5,2,[250,246,210]);hdR(b,x+w-8,y+1,5,2,[250,246,210]);hdR(b,x+3,y+h-3,5,2,[200,40,40]);hdR(b,x+w-8,y+h-3,5,2,[200,40,40]);hdR(b,x+w/2-4,y+h-2,8,1,[40,40,46])}
  else{hdR(b,x+12,y+4,10,h-8,gl[0]);hdR(b,x+13,y+5,2,7,gl[2]);hdR(b,x+40,y+4,7,h-8,gl[0]);hdR(b,x+22,y+5,18,h-10,hdS(c,1.1));hdR(b,x+22,y+5,18,1,hdS(c,1.25));
    hdR(b,x+23,y+2,15,2,gl[1]);hdR(b,x+23,y+h-4,15,2,gl[0]);hdR(b,x+1,y+3,2,5,[250,246,210]);hdR(b,x+1,y+h-8,2,5,[250,246,210]);hdR(b,x+w-3,y+3,2,5,[200,40,40]);hdR(b,x+w-3,y+h-8,2,5,[200,40,40])}}
// torre de juegos: techo de toldo, baranda, plataforma, postes y tobogán
function qsTower(roof,slide,flip){const b=hdBuf(72,100),R=hdC(roof),Sl=hdC(slide),P=[[236,236,232],[186,188,192],[140,142,148]];
  hdR(b,10,94,52,5,[20,16,24],.24);for(const x of[14,54]){hdR(b,x,44,5,52,P[1]);hdR(b,x,44,2,52,P[0]);hdR(b,x+4,44,1,52,P[2])}
  hdR(b,10,62,56,7,[150,110,70]);hdR(b,10,62,56,1,[206,166,116]);hdR(b,10,68,56,1,[96,70,46]);for(let x=12;x<64;x+=6){hdR(b,x,48,2,14,P[0]);hdP(b,x+1,48,P[2])}hdR(b,10,46,56,3,P[0]);hdR(b,10,48,56,1,P[2]);
  for(let j=0;j<24;j++){const ww=56-j*2.2;for(let i=0;i<ww;i++){const u=i/ww;hdP(b,10+j*1.1+i,40-j*1.05,hdS(R,(((i/6)|0)%2?1:.8)*(1.12-.28*u)))}}hdR(b,36,8,4,8,P[1]);hdR(b,34,6,8,3,R);
  for(let y=70;y<94;y+=5){hdR(b,flip?52:16,y,10,2,[60,130,200])}
  const sx=flip?4:52;for(let k=0;k<30;k++){const xx=flip?sx-k*.95:sx+k*.95-12,yy=64+k;hdR(b,Math.round(xx),Math.round(yy),14,3,hdS(Sl,1.05-k*.012));hdR(b,Math.round(xx),Math.round(yy),14,1,hdS(Sl,1.32));hdR(b,Math.round(xx),Math.round(yy)+2,1,2,hdS(Sl,.7))}
  return b}
function qsSwing(){const b=hdBuf(124,76),G=[[30,90,50],[52,140,74],[100,190,110]];
  for(const cx of[20,104]){for(let t=0;t<=48;t++){const a=Math.PI*t/48,x=cx+16*Math.cos(a),y=72-58*Math.sin(a);hdR(b,Math.round(x),Math.round(y),4,4,G[t<24?2:1]);hdP(b,Math.round(x)+3,Math.round(y)+3,G[0])}}
  hdR(b,20,13,84,4,G[1]);hdR(b,20,13,84,1,G[2]);hdR(b,20,16,84,1,G[0]);for(const sx of[38,62,86]){hdLine(b,sx-6,17,sx-8,56,[156,156,162],1,1);hdLine(b,sx+6,17,sx+8,56,[156,156,162],1,1);hdR(b,sx-9,56,18,4,[30,30,34]);hdR(b,sx-9,56,18,1,[80,80,88])}
  return b}
function qsHouse(){const b=hdBuf(56,64),Wd=[[226,186,120],[200,156,96],[150,110,70]];hdR(b,6,58,44,5,[20,16,24],.24);hdR(b,8,26,40,34,Wd[0]);hdR(b,8,26,4,34,hdS(Wd[0],1.08));hdR(b,44,26,4,34,Wd[2]);
  for(let y=30;y<58;y+=5)hdR(b,8,y,40,1,Wd[1]);hdR(b,22,40,12,20,[60,40,30]);hdR(b,12,32,8,8,[90,150,200]);hdR(b,36,32,8,8,[90,150,200]);
  for(let j=0;j<20;j++){const ww=48-j*2.3;hdR(b,4+j*1.15,26-j,ww,1,hdS([214,58,56],1.05-j*.012))}return b}
function qsSpring(col){const b=hdBuf(24,30),C=hdC(col);hdEll(b,12,27,9,3,[20,16,24],.3);for(let y=16;y<27;y+=2)hdR(b,9,y,6,1,[170,170,176]);hdEll(b,12,10,9,7,C);hdEll(b,10,8,5,4,hdS(C,1.25));hdR(b,8,2,3,6,[40,40,46]);hdR(b,14,2,3,6,[40,40,46]);return b}
function qsCarousel(){const b=hdBuf(70,46),C=[[214,58,56],[238,190,50],[44,98,204],[52,160,84]];hdEll(b,35,38,32,8,[20,16,24],.26);
  for(let a=0;a<Math.PI*2;a+=.02){const k=Math.floor(a/(Math.PI/4))%4;for(let r=0;r<30;r++){const X=35+Math.cos(a)*r,Y=30+Math.sin(a)*r*.42;hdP(b,X,Y,hdS(C[k],r>27?.7:.95+.1*Math.cos(a+2.4)))}}
  for(let a=0;a<Math.PI*2;a+=Math.PI/4){const X=35+Math.cos(a)*22,Y=30+Math.sin(a)*9;hdR(b,X|0,(Y-12)|0,2,12,[200,200,206])}hdR(b,33,6,4,24,[160,160,168]);hdEll(b,35,8,18,5,[214,58,56]);hdEll(b,33,7,10,3,[236,100,90]);return b}
function qsDomeBars(){const b=hdBuf(70,50),R=[[200,50,46],[236,110,90]];hdEll(b,35,44,32,7,[20,16,24],.24);
  for(let k=0;k<7;k++){const a=Math.PI*k/6;for(let t=0;t<=60;t++){const u=Math.PI*t/60,X=35+Math.cos(u)*30*Math.cos(a)*.9+Math.cos(u)*0,Y=42-Math.sin(u)*36;hdP(b,35+Math.cos(u)*30*Math.cos(a),Y,R[k%2]);}}
  for(const h of[12,24,34]){const r=30*Math.cos(Math.asin(h/36));for(let x=-r;x<=r;x++)hdP(b,35+x,42-h,R[1])}return b}
function qsSeesaw(){const b=hdBuf(80,30),Y=[[230,190,50],[200,150,30]];hdR(b,4,24,72,4,[20,16,24],.24);hdR(b,36,14,8,12,[40,110,70]);hdLine(b,4,8,76,22,Y[0],1,4);hdLine(b,4,10,76,24,Y[1],1,1);for(const x of[8,70])hdR(b,x,x<40?4:18,4,6,[40,40,46]);return b}
function qsBars(){const b=hdBuf(80,58),R=[[200,50,46],[236,90,80]];for(const x of[4,72]){hdR(b,x,6,4,48,R[0]);hdR(b,x,6,1,48,R[1])}hdR(b,4,6,72,3,R[0]);hdR(b,4,6,72,1,R[1]);for(let x=10;x<72;x+=8)hdR(b,x,8,2,8,[230,230,226]);hdR(b,0,52,80,5,[20,16,24],.22);return b}
function qsPicnic(umb){const b=hdBuf(70,umb?96:36),o=umb?60:0,B=[[22,52,120],[40,92,190],[90,140,226]];
  if(umb){hdR(b,34,10,2,o+10,[200,200,206]);for(let j=0;j<16;j++){const ww=64-j*3.6;hdR(b,3+j*1.8,22-j,ww,1,hdS([40,110,210],(j%3?1:.86)*(1.1-j*.01)))}hdR(b,3,22,64,2,[24,70,150])}
  hdR(b,6,o+30,58,5,[20,16,24],.26);hdR(b,8,o+6,54,10,B[1]);hdR(b,8,o+6,54,2,B[2]);hdR(b,8,o+15,54,1,B[0]);for(const x of[14,52])hdR(b,x,o+16,3,12,B[0]);
  hdR(b,4,o+22,62,4,B[1]);hdR(b,4,o+22,62,1,B[2]);return b}
// partir un sprite alto: lo de abajo va al suelo del mapa y lo de arriba a la capa que tapa a quien pasa por detrás
function qsTall(b,tg,s,ox,oy,keep){const cut=Math.max(0,s.h-keep),W=s.w;if(cut>0){const hi=hdBuf(W,cut);hi.d.set(s.d.subarray(0,cut*W*4));tg.drawImage(hdToCanvas(hi),ox,oy)}
  const lo=hdBuf(W,s.h-cut);lo.d.set(s.d.subarray(cut*W*4));hdBlit(b,lo,ox,oy+cut)}
// piezas de los juegos: [sprite, x, y (esquina del sprite en HD), alto que queda en el suelo, rectángulo sólido en HD]
function qsEquip(){return[
  [qsTower('#f2f2ee','#d8352f',0),246,1116,40,[258,1166,312,1212]],[qsTower('#f2c94c','#2f7ad8',1),424,1116,40,[436,1166,490,1212]],[qsCarousel(),244,1290,30,[248,1306,310,1330]],
  [qsTower('#ef8fb6','#d8352f',1),390,1320,40,[402,1370,456,1416]],[qsHouse(),262,1470,30,[268,1500,312,1534]],
  [qsSpring('#e23f36'),360,1484,30,[362,1500,384,1514]],[qsSpring('#2f7ad8'),470,1530,30,[472,1546,494,1560]],[qsSpring('#52b04c'),466,1250,30,[468,1266,490,1280]],
  [qsTower('#e23f36','#2f7ad8',0),820,1124,40,[832,1174,886,1220]],[qsTower('#52b04c','#f2c94c',1),632,1124,40,[644,1174,698,1220]],[qsSwing(),640,1430,34,[640,1486,700,1506]],
  [qsBars(),850,1470,30,[850,1506,930,1526]],[qsDomeBars(),860,1270,30,[864,1300,926,1318]],[qsCarousel(),728,1310,30,[732,1326,794,1350]],
  [qsSeesaw(),690,1236,24,[694,1248,770,1264]],[qsPicnic(1),650,968,40,[654,1050,716,1060]],[qsPicnic(0),880,1036,36,[884,1050,950,1064]]]}
// ---- ensamblado del mapa ----
function hdQuesadaParque(m,M0){const W=m.w*HT,H=m.h*HT,b=hdBuf(W,H),EM=[];
  hdGround(b,m);hdTileEdges(b,m);hdRoad(b,m);
  // calles: línea amarilla discontinua, pasos de cebra, alcantarillas, tapas y cordón amarillo en las esquinas
  const cl=[[7*32,0],[55*32,0]],cv=[[2*32,1],[61*32,1]];
  for(const[yy]of cl)for(let x=0;x<W;x++)if((x>>4)%2===0&&ti(m,x>>5,yy>>5)===1){hdP(b,x,yy-1,[228,190,60]);hdP(b,x,yy,[200,166,50])}
  for(const[xx]of cv)for(let y=0;y<H;y++)if((y>>4)%2===0&&ti(m,xx>>5,y>>5)===1){hdP(b,xx-1,y,[228,190,60]);hdP(b,xx,y,[200,166,50])}
  const zebra=(x0,y0,w,h,hor)=>{for(let k=0;k<(hor?w:h);k+=16)for(let a=0;a<(hor?h:w);a++)for(let t=0;t<9;t++){const X=hor?x0+k+t:x0+a,Y=hor?y0+a:y0+k+t,r=hdr(X,Y);if(r>.07)hdP(b,X,Y,hdS([232,230,222],.84+r*.16))}};
  zebra(966,196,128,88,1);zebra(160,196,96,88,1);zebra(1792,196,96,88,1);zebra(160,1732,96,88,1);zebra(1792,1732,96,88,1);
  zebra(36,326,88,96,0);zebra(1924,326,88,96,0);zebra(36,1594,88,96,0);zebra(1924,1594,88,96,0);
  const grate=(X,Y,hor)=>{const w=hor?26:10,h=hor?10:26;hdR(b,X-1,Y-1,w+2,h+2,[70,70,74]);hdR(b,X,Y,w,h,[24,24,28]);for(let k=2;k<(hor?w:h);k+=3)hor?hdR(b,X+k,Y+1,1,h-2,[90,90,96]):hdR(b,X+1,Y+k,w-2,1,[90,90,96])};
  for(const y of[480,900,1320])grate(129,y,0),grate(1910,y,0);for(const x of[600,1400])grate(x,1700,1),grate(x,310,1);
  for(const[X,Y]of[[64,700],[1966,1250],[700,1760],[1300,224]]){hdEll(b,X,Y,12,7,[60,60,64]);hdEll(b,X,Y,10,5.6,[86,86,90]);for(let k=-8;k<=8;k+=4)hdR(b,X+k,Y-4,1,8,[60,60,64])}
  for(const[x0,y0,x1,y1]of[[128,312,256,318],[1792,312,1920,318],[128,1698,256,1704],[1792,1698,1920,1704]])hdR(b,x0,y0,x1-x0,y1-y0,[226,190,52]);
  // jardín y reja de la catedral (la catedral va en el próximo paso)
  for(let i=0;i<70;i++){if(i*29>820&&i*29<1210)continue;const x=12+i*29+hsh(i,3)*12,y=70+hsh(3,i)*50,C=[[150,30,40],[196,64,40],[120,28,48],[214,150,40]];for(let k=0;k<12;k++)hdEll(b,x+hsh(i,k)*20-10,y+hsh(k,i)*12-6,5,3.5,hdS(C[(i+k)%4],.85+hsh(k,i*2)*.3))}
  for(const[a,c]of[[0,856],[1204,W]]){hdR(b,a,146,c-a,14,[150,48,44]);hdR(b,a,146,c-a,2,[196,84,74]);hdR(b,a,156,c-a,4,[100,30,28]);hdR(b,a,110,c-a,3,[30,30,34]);hdR(b,a,136,c-a,3,[30,30,34])}
  for(let x=2;x<W;x+=8){if(x>848&&x<1204)continue;hdR(b,x,104,3,42,[26,26,30]);hdP(b,x+1,102,[70,70,76]);hdP(b,x+1,101,[26,26,30]);hdP(b,x,104,[60,60,66])}
  for(const gx of[846,1192]){hdR(b,gx,78,14,82,[30,30,34]);hdR(b,gx,78,14,3,[86,86,94]);hdR(b,gx+11,78,3,82,[16,16,18]);hdR(b,gx-2,74,18,5,[40,40,46])}
  for(const sg of[-1,1]){const x0=sg<0?860:1192;for(let t=0;t<44;t++){const X=x0+sg*-(t*.9),Y=110+t*.55;hdR(b,X|0,Y|0,2,32,[28,28,32]);if(t%6===0)hdR(b,X|0,(Y|0)-2,1,2,[70,70,76])}}   // portón abierto
  const M=qsGround(b);
  // tierra y hojarasca bajo las copas de los árboles
  for(const[x,y,,s]of QS.trees){const cx=x*32+16,cy=y*32+24,rx=44*s,ry=20*s;for(let Y=(cy-ry)|0;Y<cy+ry;Y++)for(let X=(cx-rx)|0;X<cx+rx;X++){if(X<0||Y<0||X>=W||Y>=H||M[Y*W+X])continue;
    const u=(X-cx)/rx,v=(Y-cy)/ry,q=u*u+v*v;if(q>1)continue;const k=(Y*W+X)<<2,f=1-.22*(1-q);b.d[k]*=f;b.d[k+1]*=f;b.d[k+2]*=f;if(hdr(X*3,Y*5)>.965){const lf=hsh(X,Y)<.5?[150,120,60]:[120,96,44];hdP(b,X,Y,lf)}}}
  // baranda tubular alrededor del estanque, con postes
  const rail=[[226,230,232],[164,170,174],[110,116,120]];for(let Y=(QS.fu.y-120)|0;Y<QS.fu.y+130;Y++)for(let X=(QS.lob[0][0]-110)|0;X<QS.lob[1][0]+110;X++){const dq=qsPoolD(X,Y);
    if(Math.abs(dq-22)<.6){hdP(b,X,Y-17,rail[0]);hdP(b,X,Y-16,rail[1]);hdP(b,X,Y-8,rail[1]);hdP(b,X,Y+1,[20,16,24]);if(((X*7+Y*3)%29)===0){hdR(b,X,Y-16,2,17,rail[1]);hdP(b,X,Y-16,rail[0]);hdP(b,X+1,Y-1,rail[2])}}}
  const top=mk(W,H),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;
  // chorros de la fuente (uno por lóbulo)
  for(const[lx,ly,lr]of QS.lob){const j=hdBuf(44,64);
    for(let y=8;y<60;y++){const t=(60-y)/52,w=1.6+t*2.2;for(let x=-w;x<=w;x++){const e=Math.abs(x)/w;hdP(j,22+x,y,e<.45?[248,254,255]:[206,236,246],.5+(1-e)*.45)}}
    for(let k=0;k<70;k++){const a=hsh(k,7)*Math.PI*2,r=3+hsh(7,k)*16,y=6+hsh(k,3)*16+r*.6;hdP(j,22+Math.cos(a)*r,y,[236,248,252],.85);if(k%3===0)hdP(j,22+Math.cos(a)*r,y+1,[190,226,240],.6)}
    for(let y=2;y<12;y++)for(let x=-6;x<=6;x++){const q=(x*x)/36+((y-7)*(y-7))/25;if(q<1&&hsh(x+40,y)<.75)hdP(j,22+x,y,[250,255,255],.8*(1-q))}
    hdBlit(b,j,lx-22,ly-58);
    for(let a=0;a<Math.PI*2;a+=.08){for(const[rr,al]of[[13,.75],[22,.45],[30,.25]]){const X=lx+Math.cos(a)*rr*(1+hsh(a*10|0,rr)*.15),Y=ly+Math.sin(a)*rr*.45;hdP(b,X,Y,[236,250,252],al)}}}
  // murito verde con piedras grandes junto a los juegos azules (como en la foto)
  {const y=1080;for(const[w0,w1]of[[611,766],[834,967]]){hdR(b,w0,y,w1-w0,14,[30,70,60]);hdR(b,w0,y,w1-w0,3,[60,110,96]);hdR(b,w0,y+13,w1-w0,2,[16,36,30])}for(let i=0;i<9;i++){const sx=622+i*38+hsh(i,4)*10;if(sx>752&&sx<850)continue;hdEll(b,sx,y-5,15,7,[132,128,120]);hdEll(b,sx-3,y-8,9,4,[170,166,156]);hdEll(b,sx+4,y-2,10,3,[96,92,88])}}
  // juegos, carros, bancas, basureros y faroles
  for(const[s,x,y,keep]of qsEquip())qsTall(b,tg,s,x,y,keep);
  for(const[cx,cy,v,col]of QS.cars)qsCar(b,cx*32+16,cy*32+(v?32:16),v,col);
  for(const[x,y]of QS.benches)qsBench(b,x*32-1,y*32+10);for(const[x,y]of QS.bins)qsBin(b,x*32+8,y*32+6);
  const LS=qsLampSpr();for(const[x,y]of QS.lamps){const ox=x*32+7,oy=y*32+30-96;qsTall(b,tg,LS,ox,oy,30);EM.push({k:'lamp',x:ox+2,y:oy+3,w:14,h:14})}
  const SL=qsStreetLamp();for(const[x,y]of QS.slamps){const ox=x*32-12,oy=y*32+30-140;qsTall(b,tg,SL,ox,oy,30);EM.push({k:'lamp',x:ox+2,y:oy+12,w:12,h:6},{k:'lamp',x:ox+44,y:oy+12,w:12,h:6})}
  // señales de ALTO en las esquinas del parque
  const alto=(X,Y)=>{const s=hdBuf(20,58);hdR(s,9,18,2,40,[110,114,120]);for(let j=0;j<18;j++){const ww=j<5?8+j*2:j>12?8+(17-j)*2:18;hdR(s,10-ww/2,j,ww,1,j%17===0?[240,240,240]:[196,32,36])}hdText(s,3,6,'ALTO',[250,250,250]);qsTall(b,tg,s,X,Y,24)};
  alto(126,250);alto(1894,250);alto(126,1636);alto(1894,1636);
  // kiosco
  const kq=hdKioscoQSplit();M0._qk=kq;hdBlit(b,kq.lo,kq.X,kq.Y+QK.split);tg.drawImage(hdToCanvas(kq.hi),kq.X,kq.Y);
  // árboles grandes de copa redonda: tronco en el suelo, copa arriba
  M0._qsTrees=[];for(const[x,y,kind,s]of QS.trees){const sp=hdTreeSprite(x*37+y*101,kind,s,false),ox=x*HT+16-sp.ax,oy=y*HT+30-sp.ay;hdBlit(b,sp.t,ox,oy);tg.drawImage(hdToCanvas(sp.c),ox,oy);M0._qsTrees.push({x,y,sp})}
  return{b,top,EM}}
// casters de sombra del sol para este mapa (ver hdCasters en hd/50_light.js)
function qsCasters(m,C){const oy=QS.oy;for(const t of m._qsTrees||[])C.trees.push({x:t.x*T+8,y:(t.y+oy)*T+15,hc:30*(t.sp.h/112),rx:t.sp.w/4.6,ry:t.sp.w/8});
  for(const[x,y]of QS.lamps)C.poles.push({x:x*T+8,y:(y+oy)*T+14,h:34});for(const[x,y]of QS.slamps)C.poles.push({x:x*T+8,y:(y+oy)*T+14,h:56});
  for(const[cx,cy,v]of QS.cars)C.boxes.push(v?{x:cx*T+1,y:(cy+oy)*T+2,w:14,h:30,hg:9}:{x:cx*T+1,y:(cy+oy)*T+1,w:30,h:14,hg:9});
  for(const e of qsEquip()){const r=e[4];C.boxes.push({x:r[0]/2,y:(r[1]+oy*HT)/2,w:(r[2]-r[0])/2,h:(r[3]-r[1])/2,hg:e[0].h/2-6})}
  for(const[x,y]of QC.cars)C.boxes.push({x:x/2-7,y:y/2-15,w:14,h:30,hg:9});
  C.boxes.push({x:QC.x0/2,y:QC.back/2,w:(QC.x1-QC.x0)/2,h:(QC.fy-QC.back)/2,hg:70},{x:(QC.cx-50)/2,y:(QC.fy-30)/2,w:50,h:14,hg:220});
  for(const B of QC.west)C.boxes.push({x:B[0]/2,y:B[1]/2,w:(B[2]-B[0])/2,h:(B[3]-B[1])/2,hg:40});
  C.fx=C.fx||[];C.fx.push({draw:qkSombra,cut(g){const k=m._qk;if(!k)return;if(!k.sil){const b=k.b,c=mk(b.w,b.h),x=c.getContext('2d'),im=x.createImageData(b.w,b.h);for(let i=0;i<b.w*b.h;i++)if(b.d[i*4+3]>=200)im.data[i*4+3]=255;x.putImageData(im,0,0);k.sil=c}
    g.imageSmoothingEnabled=false;g.drawImage(k.sil,0,0,k.b.w,k.b.h,k.X/2,k.Y/2,k.b.w/2,k.b.h/2)}})}
// ================= CATEDRAL DE CIUDAD QUESADA (al norte, cruzando la Calle Central, detrás de la reja) =================
// Referencias (fotos): fachada blanca crema; torre central alta y angosta con aletas verticales y ranuras oscuras, reloj
// arriba y cruz en la punta; frontón con ventanas altas que siguen la pendiente; franja roja de lado a lado; pórtico con
// columnas rojas y puertas oscuras; alas laterales más bajas con ventanas; techo de lámina roja; escalinata ancha de gradas
// grises con pasamanos negros; jardín con plantas de hojas rojas; parqueo al este. Medidas en píxeles HD del mapa completo.
const QC={cx:1030,fy:520,band:398,apex:230,back:70,mx0:760,mx1:1300,x0:600,x1:1460,wingTop:330,
  st:[872,1188,600,800],porch:[600,1460,528,600],park:[1500,1888,64,740],west:[[170,80,360,560],[380,120,580,560]],cars:[]};
(()=>{const rows=[132,332,532],xs=[];for(let x=1530;x<1870;x+=42)xs.push(x);let k=0;for(const y of rows)for(const x of xs){k++;if(hsh(k,9)<.62)QC.cars.push([x,y,['#e8e8e4','#c0392b','#9aa3ab','#23242a','#2f5fa8','#7a1f2a','#d8d4c8'][k%7]])}})();
function hdCatedral(b,EM){const S=QC,cr=hdC('#ece6d6'),red=hdC('#a8352c'),gEdge=x=>S.apex+Math.abs(x-S.cx)/((S.mx1-S.mx0)/2)*(S.band-S.apex-12),
  P=(X,Y,c)=>hdP(b,X,Y,c),n=(X,Y)=>(hdr(X,Y)-.5)*.06+(hdVN(X,Y,18,4)-.5)*.06;
  // vecinos al fondo (techos) y edificios del oeste
  hdRoofZinc(b,160,0,700,64,'#8e9498',31,false);hdRoofZinc(b,1220,0,300,64,'#9a5a46',32,true);
  for(const[i,B]of S.west.entries()){const[x0,y0,x1,y1]=B,col=i?'#2f8a86':'#a8433a';hdRoofZinc(b,x0,y0,x1-x0,y1-y0-96,col,40+i,true);hdR(b,x0,y1-96-6,x1-x0,6,[40,32,30]);
    hdPlaster(b,x0,y1-96,x1-x0,96,i?'#e6dcc4':'#d8e2e6',50+i);hdCh_awning(b,x0+6,y1-92,x1-x0-12,12,i?'#2f8a86':'#c0473b','#f4f0e6',x0);
    for(let x=x0+16;x<x1-40;x+=58){hdCh_win(b,x,y1-66,40,30,{frame:'#2a2a30',mull:true});EM.push({k:'shop',x,y:y1-66,w:40,h:30})}hdDoor(b,x1-44,y1-62,30,60,'#5c3d24');hdR(b,x0,y1-4,x1-x0,4,[110,104,96])}
  // ---- techos de lámina roja: la nave (a dos aguas) y las alas ----
  const R=hdC('#9e3a2e');
  for(let y=S.back;y<S.band;y++)for(let x=S.mx0;x<S.mx1;x++){if(y>=gEdge(x))continue;const left=x<S.cx,u=Math.abs(x-S.cx)/(S.cx-S.mx0);
    let f=left?1.12-.18*u:.7+.08*(1-u);if(y%6<1)f*=.88;else if(y%6<2)f*=1.05;if(Math.abs(x-S.cx)<3)f=1.25;if(y<S.back+4)f*=.7;if(x<S.mx0+3||x>S.mx1-4)f*=.75;
    f+=(hdr(x,y)-.5)*.05-(hdVN(x,y,30,6)>.72?.06:0);P(x,y,hdS(R,f))}
  for(const[w0,w1,sg]of[[S.x0,S.mx0,-1],[S.mx1,S.x1,1]])for(let y=S.back+50;y<S.wingTop;y++)for(let x=w0;x<w1;x++){const u=sg<0?(w1-x)/(w1-w0):(x-w0)/(w1-w0);let f=sg<0?1.06-.1*u:.74+.06*(1-u);if(y%6<1)f*=.88;if(y<S.back+54)f*=.7;P(x,y,hdS(R,f+(hdr(x,y)-.5)*.05))}
  // ---- alas laterales: pared, ventanas altas, franja roja arriba ----
  for(const[w0,w1]of[[S.x0,S.mx0],[S.mx1,S.x1]]){hdPlaster(b,w0,S.wingTop,w1-w0,S.fy-S.wingTop,'#ece6d6',w0);hdR(b,w0,S.wingTop,w1-w0,8,hdS(red,1.05));hdR(b,w0,S.wingTop,w1-w0,2,hdS(red,1.3));hdR(b,w0,S.wingTop+8,w1-w0,3,[0,0,0],.18);
    for(let x=w0+26;x<w1-30;x+=58){for(const[y0,h]of[[S.wingTop+22,46],[S.band+26,78]]){const r=hdCh_win(b,x,y0,26,h,{frame:'#f6f2e8',mull:true});EM.push({k:'win',x:r.x,y:r.y,w:r.w,h:r.h})}}}
  // ---- frontón principal con ventanas altas que siguen la pendiente ----
  for(let y=S.apex;y<S.band;y++)for(let x=S.mx0;x<S.mx1;x++){if(y<gEdge(x))continue;const e=y-gEdge(x);let c=hdS(cr,.98+n(x,y)+(x>S.cx?-.04:.02));if(e<4)c=hdS(cr,e<1.5?.7:1.1);P(x,y,c)}
  for(const sg of[-1,1])for(let i=0;i<5;i++){const xc=S.cx+sg*(84+i*44),top=gEdge(xc)+22,bot=S.band-12;if(bot-top<24)continue;const x=Math.round(xc-12);
    hdR(b,x-3,top-3,30,bot-top+6,hdS(cr,1.1));for(let y=top;y<bot;y++)for(let k=0;k<24;k++){const t=(y-top)/(bot-top);let c=hdMix([110,138,166],[34,46,62],Math.min(1,t*1.3+.1));if((k+y*.5)%17<2)c=hdS(c,1.25);if(k===12)c=hdS(cr,.9);P(x+k,y,c)}
    for(let y=top;y<bot;y++){const k=Math.round((y-top)/(bot-top)*10);hdR(b,sg<0?x+24-k:x,y,k,1,[0,0,0],.18)}hdR(b,x-3,bot+3,30,2,hdS(cr,.72));EM.push({k:'win',x,y:top,w:24,h:bot-top})}
  // ---- franja roja de lado a lado y sombra del alero del pórtico ----
  hdR(b,S.x0-10,S.band,S.x1-S.x0+20,16,red);hdR(b,S.x0-10,S.band,S.x1-S.x0+20,3,hdS(red,1.35));hdR(b,S.x0-10,S.band+13,S.x1-S.x0+20,3,hdS(red,.6));
  // ---- pórtico: pared en sombra, puertas y columnas rojas ----
  for(let y=S.band+16;y<S.fy;y++)for(let x=S.mx0;x<S.mx1;x++){const t=(y-S.band-16)/(S.fy-S.band-16);P(x,y,hdS(cr,.7+t*.12+n(x,y)))}
  for(const[x0,w,h]of[[S.cx-44,88,82],[S.cx-190,58,70],[S.cx+132,58,70]]){const y0=S.fy-h;hdR(b,x0-4,y0-4,w+8,h+4,hdS(cr,.92));for(let y=y0;y<S.fy;y++)for(let x=x0;x<x0+w;x++){const u=(x-x0)%(w/2);let c=hdS([86,52,36],.8+(u<3?.25:0)+(hdr(x,y*.2)-.5)*.1);if(y-y0<4)c=hdS(c,.7);P(x,y,c)}
    hdR(b,x0+w/2-1,y0,2,h,[40,24,18]);for(const yy of[y0+16,y0+h/2+6])for(const xx of[x0+6,x0+w/2+6])hdR(b,xx,yy,w/2-12,1,[60,36,26]);EM.push({k:'shop',x:x0,y:y0,w,h:12})}
  for(const x of[S.mx0+22,S.mx0+150,S.cx-110,S.cx+86,S.mx1-176,S.mx1-46]){hdR(b,x+24,S.band+16,8,S.fy-S.band-16,[0,0,0],.16);for(let y=S.band+16;y<S.fy;y++)for(let k=0;k<24;k++){const f=k<4?1.3:k>19?.66:1-.18*(k/24);P(x+k,y,hdS(red,f+n(x+k,y)))}hdR(b,x-2,S.fy-6,28,6,hdS(red,.75))}
  // ---- torre central: aletas verticales con ranuras, reloj y cruz ----
  const tw=y=>y>S.band?104:Math.round(78+26*(y-110)/(S.band-110)),secs=[S.band,350,292,236,178,120];
  for(let y=110;y<S.band;y++){const w=tw(y),x0=S.cx-w/2;hdR(b,x0+w,y,18,1,[0,0,0],.2)}                                   // sombra de la torre sobre la fachada
  for(let y=110;y<S.fy;y++){const w=tw(y),x0=Math.round(S.cx-w/2);for(let k=0;k<w;k++){const X=x0+k,inner=k>7&&k<w-8,sec=secs.findIndex(v=>y>=v);
      let c;const nearBand=secs.some(v=>Math.abs(y-v)<5);
      if(y>S.band+16){if(k<14||k>w-15)c=hdS(cr,k<14?1.06-.08*(k/14):.82);else continue}                                    // patas de la torre a los lados de la puerta
      else if(!inner||nearBand)c=hdS(cr,(k<7?1.12:k>w-8?.8:1.04)+(nearBand&&secs.some(v=>y>v-5&&y<v-2)?.1:0)+n(X,y)*.6);
      else if(y>=236&&y<292){c=hdS(cr,1.02+n(X,y)*.6)}                                                                    // panel liso del reloj
      else{const f=(k-8)%13;c=f<5?hdS(cr,f<1?1.15:f>3?.82:1):hdMix([60,64,76],[22,24,30],Math.min(1,(y%58)/40));if(f===5)c=hdS(c,.7)}
      P(X,y,c)}}
  {const cy=264,cx=S.cx;hdEll(b,cx,cy,17,17,[60,58,56]);hdEll(b,cx,cy,15,15,[248,246,238]);for(let a=0;a<12;a++){const A=a*Math.PI/6;hdP(b,cx+Math.cos(A)*12,cy+Math.sin(A)*12,[40,40,44])}
    hdLine(b,cx,cy,cx-6,cy-7,[30,30,34],1,2);hdLine(b,cx,cy,cx+9,cy-2,[30,30,34],1,1);EM.push({k:'lamp',x:cx-14,y:cy-14,w:28,h:28})}
  for(let y=84;y<112;y++){const w=Math.round(60-((112-y)/28)*30),x0=S.cx-w/2;for(let k=0;k<w;k++)P(x0+k,y,hdS(cr,(k<4?1.12:k>w-5?.8:1)+n(x0+k,y)*.6))}   // remate escalonado
  hdR(b,S.cx-4,18,8,68,hdS(cr,1.08));hdR(b,S.cx+2,18,2,68,hdS(cr,.78));hdR(b,S.cx-17,34,34,8,hdS(cr,1.08));hdR(b,S.cx-17,40,34,2,hdS(cr,.78));   // cruz
  hdR(b,S.cx-5,17,1,69,hdS(red,.9));hdR(b,S.cx-18,33,1,9,hdS(red,.9));
  // ---- atrio (piso), escalinata, muros y pasamanos ----
  const[px0,px1,py0,py1]=S.porch;hdR(b,S.x0-10,S.fy,S.x1-S.x0+20,8,[130,126,120]);hdR(b,S.x0-10,S.fy,S.x1-S.x0+20,2,[170,166,160]);
  for(let y=py0;y<py1;y++)for(let x=px0;x<px1;x++){const u=x%20,v=y%20;P(x,y,(u===0||v===0)?[150,146,140]:hdS(((x/20|0)+(y/20|0))&1?[210,204,192]:[196,190,180],.95+(hdr(x,y)-.5)*.08))}
  const[sx0,sx1,sy0,sy1]=S.st,NS=12,hs=(sy1-sy0)/NS;
  for(let i=0;i<NS;i++){const y=Math.round(sy0+i*hs),y1=Math.round(sy0+(i+1)*hs);for(let Y=y;Y<y1;Y++)for(let X=sx0;X<sx1;X++){const riser=Y-y>=hs-6;let c=riser?hdS([124,120,114],.92+(hdr(X,Y)-.5)*.1):hdS([186,182,174],.96+(hdr(X,Y)-.5)*.08);
      if(Y===y)c=hdS(c,1.18);if(!riser&&Math.abs(X-S.cx)<40)c=hdS(c,1.04);if(hdr(X*7,Y*3)>.994)c=[80,78,76];P(X,Y,c)}}
  for(const[w0,w1]of[[sx0-16,sx0],[sx1,sx1+16]]){hdPlaster(b,w0,sy0-8,w1-w0,sy1-sy0+8,'#ece6d6',w0);hdR(b,w0,sy0-8,w1-w0,4,[170,166,160]);hdR(b,w1-3,sy0-8,3,sy1-sy0+8,[0,0,0],.15)}
  for(const x of[sx0-8,S.cx,sx1+8]){hdR(b,x-1,sy0-18,3,sy1-sy0+10,[26,26,30]);hdR(b,x-1,sy0-18,1,sy1-sy0+10,[80,80,88]);for(let y=sy0-4;y<sy1;y+=34)hdR(b,x-1,y,3,16,[20,20,24])}
  // ---- jardín: plantas de hojas rojas a los lados de la escalinata y al pie de la fachada ----
  const C=[[150,30,40],[196,64,40],[120,28,48],[214,150,40],[90,130,60]];
  for(let i=0;i<90;i++){const left=i%2===0,x=left?S.x0+hsh(i,3)*(sx0-40-S.x0):sx1+40+hsh(i,3)*(S.x1-sx1-60),y=py1+14+hsh(3,i)*120;if(Math.abs(y-(py1+70))<10&&hsh(i,8)<.6)continue;
    for(let k=0;k<10;k++)hdEll(b,x+hsh(i,k)*18-9,y+hsh(k,i)*10-5,5,3.6,hdS(C[(i+k)%5],.85+hsh(k,i*2)*.3))}
  for(let x=S.x0;x<S.x1;x+=14){if(x>sx0-20&&x<sx1+20)continue;for(let k=0;k<4;k++)hdEll(b,x+hsh(x,k)*12,py0-6+hsh(k,x)*6,4,3,hdS(C[(x/14+k)%4|0],.9))}
  // ---- parqueo al este: líneas blancas y carros ----
  const[qx0,qx1,qy0,qy1]=S.park;for(const yr of[132,332,532]){for(let x=1510;x<1880;x+=42)hdR(b,x,yr-34,2,68,[220,218,210]);hdR(b,1510,yr+34,370,2,[220,218,210])}
  for(const[x,y,col]of S.cars)qsCar(b,x+21,y,1,col);
  hdR(b,qx0-8,qy0,8,qy1-qy0,[150,48,44]);hdR(b,qx0-8,qy0,2,qy1-qy0,[196,84,74]);
  // luces de la fachada de noche
  EM.push({k:'lamp',x:S.cx-50,y:S.fy+2,w:4,h:4},{k:'lamp',x:S.cx+46,y:S.fy+2,w:4,h:4})}
// el mapa completo: catedral arriba y el parque corrido oy casillas
function hdQuesada(m){const OY=QS.oy*HT,W=m.w*HT,H=m.h*HT,b=hdBuf(W,H),EM=[];m.hdEmit=EM;
  hdGround(b,m);hdTileEdges(b,m);
  const mm={w:m.w,h:m.h-QS.oy,t:m.t.subarray(QS.oy*m.w),s:m.s.subarray(QS.oy*m.w),interior:false,id:'quesada_p',objs:[],lights:[]};
  const pq=hdQuesadaParque(mm,m);b.d.set(pq.b.d,OY*W*4);for(const e of pq.EM){e.y+=OY;EM.push(e)}if(m._qk)m._qk.Y+=OY;
  hdCatedral(b,EM);
  const top=mk(W,H),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;tg.drawImage(pq.top,0,OY);
  return{base:hdToCanvas(b),top}}
