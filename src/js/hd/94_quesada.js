// ================= CIUDAD QUESADA (San Carlos): el parque, en estilo B =================
// Referencias (fotos del usuario, vista con el norte arriba):
//  · Al norte, cruzando la Calle Central, la Catedral de Ciudad Quesada (va en el próximo paso; por ahora su jardín y su reja).
//  · Frente a la catedral, la única fuente del parque: estanque de dos lóbulos, borde celeste, piedras de río y baranda,
//    sobre una plaza de adoquín rojizo con cordón verde.
//  · Al centro, unida a la plaza de la fuente por una «cintura», la plaza clara del kiosco: kiosco redondo de cúpula blanca y
//    baja, columnas blancas con basas y capiteles verdes, piso de mosaico y escalinatas con baranda verde y balaustres blancos.
//  · Senderos de concreto con franja amarilla salen en estrella desde el kiosco.
//  · Al suroeste, dos juegos infantiles separados por un sendero: uno de caucho de colores en ondas y otro azul con
//    estrellas, columpios verdes y tobogán azul. Árboles grandes de copa redonda (sin palmeras).
//  · Alrededor: avenidas al este y al oeste con carros estacionados, y una calle al sur.
// Medidas en píxeles HD del mapa (32 por casilla).
const QS={W:40,H:36,park:[128,224,1152,1024],
  fu:{x:640,y:352,r:116},ki:{x:640,y:596,r:136},lob:[[604,352,40],[682,358,47]],
  paths:[[96,596,1184,596],[640,596,640,1060],[640,596,110,214],[640,596,1170,214],[640,596,1170,1060],[368,596,368,1060]],pw:22,
  ondas:[166,684,346,980],estrellas:[392,684,604,980],
  trees:[[6,12,0,1.85],[5,16,1,1.7],[5,20,0,1.8],[13,8,1,1.6],[27,9,0,1.65],[33,12,1,1.95],[34,16,0,1.7],[31,24,1,1.95],[25,29,0,1.9],[35,27,1,1.75],[21,30,0,1.6]],
  lamps:[[10,17],[29,17],[13,15],[27,15],[24,24],[10,20],[31,20]],
  benches:[[7,17],[32,17],[26,20],[22,23],[15,9],[25,9]],
  cars:[[2,9,1,'#e8e8e4'],[2,12,1,'#c0392b'],[2,15,1,'#9aa3ab'],[2,22,1,'#23242a'],[2,25,1,'#e8e8e4'],[2,28,1,'#2f5fa8'],
        [37,8,1,'#9aa3ab'],[37,11,1,'#7a1f2a'],[37,14,1,'#e8e8e4'],[37,21,1,'#c0392b'],[37,24,1,'#23242a'],[37,27,1,'#e8e8e4'],
        [8,33,0,'#e8e8e4'],[13,33,0,'#2f5fa8'],[25,33,0,'#c0392b'],[30,33,0,'#9aa3ab']],
  slamps:[[10,3],[30,3]],
  kiosko:[17,17,6,3]};
const qsSmin=(a,b,k)=>{const h=Math.max(0,Math.min(1,.5+.5*(b-a)/k));return b+(a-b)*h-k*h*(1-h)};
function qsSeg(px,py,s){const ax=s[0],ay=s[1],dx=s[2]-ax,dy=s[3]-ay,L2=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/L2)),qx=ax+dx*t-px,qy=ay+dy*t-py;
  return[Math.sqrt(qx*qx+qy*qy),t*Math.sqrt(L2),(dx*(py-ay)-dy*(px-ax))]}
const qsPoolD=(X,Y)=>{const a=QS.lob[0],c=QS.lob[1];return qsSmin(Math.hypot(X-a[0],Y-a[1])-a[2],Math.hypot(X-c[0],Y-c[1])-c[2],14)};
const qsPlazaD=(X,Y)=>{const d1=Math.hypot(X-QS.fu.x,Y-QS.fu.y)-QS.fu.r,d2=Math.hypot(X-QS.ki.x,Y-QS.ki.y)-QS.ki.r;return[qsSmin(d1,d2,48),d1<d2]};
// ---- suelo del parque: plazas, fuente, senderos y juegos ----
function qsGround(b){const[x0,y0,x1,y1]=QS.park,d=b.d,W=b.w,put=(X,Y,c)=>{const k=(Y*W+X)<<2;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255},get=(X,Y)=>{const k=(Y*W+X)<<2;return[d[k],d[k+1],d[k+2]]};
  const ONDAS=[[214,58,56],[44,98,204],[124,70,170],[238,190,50],[52,160,84],[226,92,140],[40,150,200]];
  for(let Y=y0;Y<y1;Y++)for(let X=x0;X<x1;X++){const n=hdr(X,Y);let c=null;
    const[dp,fuente]=qsPlazaD(X,Y);
    if(dp<0){
      if(dp>-5){const k=dp>-2?1.18:.9;c=hdS([52,112,98],k*(.94+n*.1))}                       // cordón pintado de verde
      else if(fuente){const dq=qsPoolD(X,Y);
        if(dq<-7){const L1=QS.lob[0],L2=QS.lob[1],e=Math.min(1,-dq/34),r=Math.sin(X*.21+Math.sin(Y*.13)*2)+Math.sin(Y*.27-X*.07);   // agua
          c=hdMix([150,222,232],[62,160,196],e);if(r>1.45)c=hdMix(c,[236,250,250],.55);else if(r<-1.5)c=hdS(c,.9);
          if(((X>>3)+(Y>>3))%2===0)c=hdS(c,1.03);if(n>.992)c=[250,255,255];
          for(const L of[L1,L2]){const dd=Math.hypot(X-L[0],Y-L[1]+2);if(dd<4)c=hdMix(c,[244,252,252],.7*(1-dd/4))}}
        else if(dq<-1){const top=Y<QS.fu.y;c=hdS([62,146,206],(top?1.12:.86)+n*.06)}                    // borde celeste
        else if(dq<12){const[id,e]=sjoStone(X*1.1,Y*1.6,4.2),v=hsh(id,3),base=v<.3?[150,146,138]:v<.6?[122,112,100]:v<.85?[176,170,158]:[96,90,86];  // piedras de río
          c=e<.7?[58,52,48]:hdS(base,.86+hsh(id,5)*.24+(e>1.6?.08:0))}
        else{const row=(Y/6)|0,off=(row&1)*6,mort=(X+off)%12===0||Y%6===0,bi=hsh(((X+off)/12)|0,row);                  // adoquín rojizo
          c=mort?[78,52,48]:hdS(bi<.3?[128,70,58]:bi<.62?[114,64,56]:bi<.9?[140,82,66]:[98,60,54],.92+n*.12-(hdVN(X,Y,26,8)>.66?.1:0))}}
      else{const u=X&15,v=Y&15,j=u===0||v===0;c=j?[150,146,140]:hdS(hsh(X>>4,Y>>4)<.5?[202,198,190]:[192,188,180],.95+n*.08-(hdVN(X,Y,30,3)>.7?.06:0))}}  // losas claras del kiosco
    else{
      // juegos infantiles
      for(const[k,R]of[['ondas',QS.ondas],['estrellas',QS.estrellas]]){if(X<R[0]||X>=R[2]||Y<R[1]||Y>=R[3])continue;const bx=X-R[0],by=Y-R[1],edge=Math.min(bx,by,R[2]-1-X,R[3]-1-Y);
        if(edge<4){c=k==='ondas'?hdS([36,82,180],edge<1?.7:1.05):hdS([46,136,78],edge<1?.7:1.05);break}
        if(k==='ondas'){const v=bx+22*Math.sin(by/46+bx/90)+10*Math.sin(by/17),bi=Math.floor(v/30),f=v/30-bi;c=ONDAS[((bi%7)+7)%7];if(f<.04)c=hdS(c,1.18)}
        else{const cx=R[0]+150,cy=R[1]+215,dd=Math.hypot(X-cx,Y-cy);c=dd<52?[54,150,92]:dd<62?[204,58,58]:[34,58,150];
          const sx=((bx+20)%54)-27,sy=((by+(((bx+20)/54|0)%2)*27)%54)-27,a=Math.atan2(sy,sx),rr=Math.hypot(sx,sy),st=6+3.2*Math.cos(5*a);if(rr<st&&dd>62)c=[240,196,52]}
        c=hdS(c,.9+n*.16);if(hdr(X*3,Y*7)>.97)c=hdS(c,1.2);break}
      if(!c){let best=1e9,bs=null;for(const s of QS.paths){const r=qsSeg(X,Y,s);if(r[0]<best){best=r[0];bs=r}}
        if(best<QS.pw){const along=bs[1],side=bs[2]>0;c=hdS([204,200,190],.93+n*.1-(hdVN(X,Y,22,11)>.72?.07:0));
          if(along%30<1.2)c=hdS(c,.82);if(best>QS.pw-8&&best<QS.pw-3&&side){c=hdS([218,182,58],.92+n*.12);if(((X+Y)%3)===0)c=hdS(c,1.12)}
          if(best>QS.pw-1.5)c=hdS(c,.78)}
        else if(best<QS.pw+3)c=hdS(get(X,Y),.86)}
      if(!c&&dp<5)c=hdS(get(X,Y),.84+dp*.03)}
    if(c)put(X,Y,c)}}
// ---- kiosco: mismo motor de rayos del templete (ver hd/87_parque.js), con su propia escena ----
const QK={K:.5,KW:192,KH:214,CX:96,GY:150,split:162};
const QK_PAL={blanco:tplRamp([[0,'#363948'],[.3,'#7c8190'],[.6,'#c9ccd0'],[.82,'#ebebe6'],[1,'#fffdf4']],12),
  verde:tplRamp([[0,'#13241f'],[.35,'#2c5248'],[.62,'#4b7f71'],[.84,'#79a898'],[1,'#b9d6c8']],12),
  piedra:tplRamp([[0,'#232228'],[.4,'#56555b'],[.7,'#8f8b86'],[1,'#c8c2b6']],12),
  mosaico:tplRamp([[0,'#3a3638'],[.4,'#7b7470'],[.7,'#c2b8a8'],[1,'#f0e8d8']],12),
  grada:tplRamp([[0,'#38373f'],[.4,'#78767a'],[.7,'#b4aea4'],[1,'#ece4d4']],12),
  cupula:tplRamp([[0,'#3d4152'],[.3,'#80858f'],[.58,'#c6c8c8'],[.8,'#e6e6e0'],[1,'#fffef6']],12)};
function qkScene(){const P=[],nz=(x,y,z,d)=>{const n=Math.hypot(x,y,z);return[x/n,y/n,z/n,d/n]};
  const box=(x0,x1,y0,y1,z0,z1,m,o)=>P.push(Object.assign({k:'poly',m,bx:[x0,x1],bb:[x0,x1,y0,y1,z0,z1],pl:[[1,0,0,x1],[-1,0,0,-x0],[0,1,0,y1],[0,-1,0,-y0],[0,0,1,z1],[0,0,-1,-z0]]},o||{}));
  const cyl=(cx,cy,R,z0,z1,m,o)=>P.push(Object.assign({k:'cyl',cx,cy,R,z0,z1,m,bx:[cx-R,cx+R],bb:[cx-R,cx+R,cy-R,cy+R,z0,z1]},o||{}));
  cyl(0,0,80,-2,14,'piedra');
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,cx=64*Math.cos(a),cy=64*Math.sin(a);
    cyl(cx,cy,6,14,78,'blanco');cyl(cx,cy,8.2,14,22,'verde');cyl(cx,cy,9.2,14,16.5,'verde');cyl(cx,cy,8.2,70,78,'verde')}
  cyl(0,0,72,78,88,'viga');cyl(0,0,75,85.5,89,'viga');
  P.push({k:'dome',R:70,H:32,zc:89,m:'cupula',bx:[-70,70],bb:[-70,70,-70,70,89,121]});
  cyl(0,0,4,120,125,'remate');
  // escalinatas al norte (hacia la fuente y la catedral) y al sur, con sus muros de baranda en rampa
  for(const sg of[-1,1]){for(let i=0;i<3;i++){const y0=60,y1=80+7*(i+1);if(sg>0)box(-21,21,y0,y1,0,14-3.5*(i+1),'grada',{yf:y1});else box(-21,21,-y1,-y0,0,14-3.5*(i+1),'grada',{yf:-y1})}
    for(const sx of[-1,1]){const x0=sx<0?-27:21,x1=sx<0?-21:27;P.push({k:'poly',m:'muro',bx:[x0,x1],bb:[x0,x1,sg>0?68:-102,sg>0?102:-68,0,14],
      pl:[[1,0,0,x1],[-1,0,0,-x0],sg>0?[0,1,0,102]:[0,1,0,-68],sg>0?[0,-1,0,-68]:[0,-1,0,102],[0,0,1,14],[0,0,-1,0],nz(0,sg*.5,1,54)]})}}
  for(const p of P){const q=p.bb;p.sy0=QK.GY+QK.K*q[2]-q[5]-1;p.sy1=QK.GY+QK.K*q[3]-q[4]+1}
  return P}
function qkShade(p,h,X,Y,Z,px,py,lit,amb){const r=Math.hypot(X,Y),nz=h[3],tex=(s,a)=>(hdVN(px,py,s,13)-.5)*a+(hdr(px,py)-.5)*a*.6;let pal,n=0;
  switch(p.m){
  case'cupula':{pal=QK_PAL.cupula;const e=Math.max(0,(Z-89)/32),ph=Math.atan2(Y,X);n=tex(6,.06);const st=hdVN(ph*70*.9+30,e*2,4.5,17);if(st>.62&&e<.85)n-=(st-.62)*.4*(1-e);if(e<.18)n-=(.18-e)*.6;break}
  case'blanco':case'viga':pal=QK_PAL.blanco;n=tex(4,.05);if(p.m==='viga'&&Z<80)n-=.06;break;
  case'verde':pal=QK_PAL.verde;n=tex(3,.05);break;
  case'remate':pal=QK_PAL.piedra;break;
  case'piedra':case'muro':pal=QK_PAL.piedra;n=tex(3,.08);if(nz<.5){const row=Math.floor((Z+2)/5),off=(row&1)*7,u=Math.atan2(Y,X)*80;if(((u+off)%14+14)%14<1||((Z+2)%5)<.7)n-=.14}
    if(nz>.5&&p.m==='piedra'&&r<77){pal=QK_PAL.mosaico;const u=Math.floor((X+200)/7),v=Math.floor((Y+200)/7),d=((X+200)%7+7)%7,e=((Y+200)%7+7)%7;n=((u+v)&1)?.1:-.05;if(Math.abs(d-e)<.8||Math.abs(d+e-7)<.8)n-=.16;if(d<.6||e<.6)n-=.08}break;
  case'grada':pal=QK_PAL.grada;n=tex(4,.06);if(nz>.5){if(Math.abs(p.yf-Y)<1.3)n+=.12;const u=((X+300)%8+8)%8;if(Math.abs(u-4)<.8)n-=.1}else n-=.05;break;
  default:pal=QK_PAL.blanco}
  return[pal,amb+lit+n]}
function hdKioscoQ(){const S=QK,W=S.KW,H=S.KH,b=hdBuf(W,H),P=qkScene(),L=TPL.L,K=S.K,dl=Math.hypot(1,K),d=[0,-1/dl,-K/dl],T_=new Float32Array(W*H).fill(1e9),SH=P.slice().sort((a,c)=>(c.m==='cupula')-(a.m==='cupula'));
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){const x=px+.5-S.CX,s=py+.5-S.GY,sy=py+.5,o=[x,600,K*600-s];let best=null,bp=null;
    for(const p of P){if(x<p.bx[0]-.5||x>p.bx[1]+.5||sy<p.sy0||sy>p.sy1)continue;const h=tplIsect(p,o,d);if(h&&(!best||h[0]<best[0])){best=h;bp=p}}
    const tg=o[2]/(K/dl),gy=o[1]+tg*d[1];
    if(!best||tg<best[0]){const rr=Math.hypot(x,gy);let ao=0;if(rr>80)ao=.32*Math.max(0,1-(rr-81)/7);if(Math.abs(gy)>80&&Math.abs(gy)<104&&Math.abs(x)<28)ao=Math.max(ao,.25*Math.max(0,1-Math.abs(Math.abs(x)-27)/4));if(ao>.01)hdP(b,px,py,[20,14,22],ao);continue}
    T_[py*W+px]=best[0];const X=o[0]+best[0]*d[0],Y=o[1]+best[0]*d[1],Z=o[2]+best[0]*d[2],nd=best[1]*L[0]+best[2]*L[1]+best[3]*L[2];
    let lit=0;if(nd>0){let sh=false;const so=[X+best[1]*.05+L[0]*.05,Y+best[2]*.05+L[1]*.05,Z+best[3]*.05+L[2]*.05];for(const p of SH){if(!tplBox(so,L,p.bb))continue;if(tplIsect(p,so,L)){sh=true;break}}if(!sh)lit=nd*.66}
    const r=Math.hypot(X,Y);let amb=.36*(.8+.2*best[3]);if(r<70&&Z>13.9&&Z<89)amb*=.6;
    const[pal,v]=qkShade(bp,best,X,Y,Z,px,py,lit,amb),N=pal.length,k=Math.max(0,Math.min(N-1,Math.floor(v*1.08*(N-1)+.5+TPL_BAYER[(py&3)*4+(px&3)]*.9)));hdP(b,px,py,pal[k])}
  const D=b.d,mul=(i,f)=>{D[i]*=f;D[i+1]*=f;D[i+2]*=f};
  for(let py=1;py<H-1;py++)for(let px=1;px<W-1;px++){const i=py*W+px,t=T_[i];if(t>=1e9)continue;for(const u of[T_[i-1],T_[i+1],T_[i-W],T_[i+W]])if(u<t-7){mul(i<<2,.8);break}
    if(T_[i+W]>=1e9&&D[((i+W)<<2)+3]<200)mul(i<<2,.78)}
  // barandas de las escalinatas: balaustres blancos y pasamanos verde (como en la foto)
  const pt=(x,y,z)=>[S.CX+x,S.GY+K*y-z],G=QK_PAL.verde,Wb=QK_PAL.blanco;
  for(const sg of[-1,1])for(const sx of[-1,1]){const x=24*sx,top=y=>14-Math.max(0,Math.abs(y)-80)*.5;
    for(let yy=70;yy<=101;yy+=4){const y=yy*sg,[p0,p1]=pt(x,y,top(y)),hgt=9;for(let k=1;k<hgt;k++){const w=k<2||k>hgt-3?1:k===4?2:1;hdR(b,Math.round(p0)-(w>1?1:0),Math.round(p1-k),w+1,1,Wb[k===4?10:8])}}
    const[a0,a1]=pt(x,70*sg,top(70)+10),[b0,b1]=pt(x,101*sg,top(101)+10);hdLine(b,a0,a1+1,b0,b1+1,G[2],1,2);hdLine(b,a0,a1-1,b0,b1-1,G[6],1,2);hdLine(b,a0,a1-2,b0,b1-2,G[9],1,1)}
  return b}
function hdKioscoQSplit(){const b=hdKioscoQ(),s=QK.split,W=b.w,lo=hdBuf(W,b.h-s),hi=hdBuf(W,s);hi.d.set(b.d.subarray(0,s*W*4));lo.d.set(b.d.subarray(s*W*4));
  return{lo,hi,X:QS.ki.x-QK.CX,Y:QS.ki.y-QK.GY,b}}
// sombra del sol del kiosco (en unidades del mundo) y recorte de su silueta
function qkSombra(g,vx,vy){const gx=QS.ki.x/2,gy=QS.ki.y/2,E=(x,y,rx,ry)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()};
  for(let h=0;h<=7;h+=2.3)E(gx+vx*h,gy+vy*h,40,20);
  g.lineWidth=6;for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,cx=gx+32*Math.cos(a),cy=gy+16*Math.sin(a);g.beginPath();g.moveTo(cx+vx*7,cy+vy*7);g.lineTo(cx+vx*39,cy+vy*39);g.stroke()}
  for(let h=39;h<=44.5;h+=1.8)E(gx+vx*h,gy+vy*h,37.5,18.7);
  for(let h=44.5;h<60;h+=2.2){const r=35*Math.sqrt(Math.max(0,1-((h-44.5)/16)**2));E(gx+vx*h,gy+vy*h,r,r*.5)}}
// ---- objetos pequeños (sprites en búfer) ----
function qsLampSpr(){const b=hdBuf(16,74),M=[[22,22,26],[46,48,54],[84,88,96]];
  hdR(b,4,70,8,4,M[0]);hdR(b,4,70,8,1,M[2]);for(let y=14;y<70;y++){hdP(b,7,y,M[2]);hdP(b,8,y,M[1]);hdP(b,9,y,M[0])}
  hdEll(b,8,9,6,6,[200,204,206]);hdEll(b,7,8,4.4,4.4,[236,238,236]);hdEll(b,6,7,2,2,[255,255,252]);hdR(b,4,2,9,2,M[1]);hdR(b,6,1,5,1,M[2]);hdR(b,6,14,4,2,M[0]);return b}
function qsBench(b,X,Y){const B=[[22,52,120],[40,92,190],[70,128,224],[120,170,240]],L=[[30,30,36],[60,60,68]];
  hdR(b,X+1,Y+13,32,3,[20,16,24],.25);hdR(b,X+3,Y+8,2,6,L[0]);hdR(b,X+29,Y+8,2,6,L[0]);
  for(let i=0;i<3;i++){hdR(b,X,Y+i*3,34,2,B[2-i>0?2:1]);hdR(b,X,Y+i*3,34,1,B[3])}hdR(b,X,Y+9,34,2,B[1]);hdR(b,X,Y+9,34,1,B[2])}
function qsCar(b,cx,cy,vert,col,seed){const c=hdC(col),w=vert?26:50,h=vert?50:26,x=Math.round(cx-w/2),y=Math.round(cy-h/2);
  hdR(b,x+2,y+3,w,h,[18,14,20],.32);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const ex=Math.min(i,w-1-i),ey=Math.min(j,h-1-j);if(ex+ey<3)continue;const u=i/(w-1);let f=1.12-.34*u;if(ex<1||ey<1)f*=.72;hdP(b,x+i,y+j,hdS(c,f))}
  const gl=[[38,58,84],[80,120,160]];
  if(vert){hdR(b,x+3,y+10,w-6,8,gl[0]);hdR(b,x+4,y+11,6,2,gl[1]);hdR(b,x+3,y+34,w-6,6,gl[0]);hdR(b,x+4,y+18,w-8,16,hdS(c,1.08));hdR(b,x+2,y+20,2,12,gl[0]);hdR(b,x+w-4,y+20,2,12,gl[0]);
    hdR(b,x+3,y+1,4,2,[250,246,210]);hdR(b,x+w-7,y+1,4,2,[250,246,210]);hdR(b,x+3,y+h-3,4,2,[200,40,40]);hdR(b,x+w-7,y+h-3,4,2,[200,40,40])}
  else{hdR(b,x+10,y+3,8,h-6,gl[0]);hdR(b,x+11,y+4,2,6,gl[1]);hdR(b,x+34,y+3,6,h-6,gl[0]);hdR(b,x+18,y+4,16,h-8,hdS(c,1.08));hdR(b,x+20,y+2,12,2,gl[0]);hdR(b,x+20,y+h-4,12,2,gl[0]);
    hdR(b,x+1,y+3,2,4,[250,246,210]);hdR(b,x+1,y+h-7,2,4,[250,246,210]);hdR(b,x+w-3,y+3,2,4,[200,40,40]);hdR(b,x+w-3,y+h-7,2,4,[200,40,40])}}
// torre de juegos: techo de toldo, plataforma, poste y tobogán
function qsTower(roof,slide,flip){const b=hdBuf(64,92),R=hdC(roof),Sl=hdC(slide),P=[[230,230,226],[180,182,186]];
  hdR(b,10,86,44,4,[20,16,24],.22);for(const x of[14,46]){hdR(b,x,40,4,48,P[1]);hdR(b,x,40,2,48,P[0])}
  hdR(b,10,56,44,6,[150,110,70]);hdR(b,10,56,44,1,[200,160,110]);for(let x=12;x<52;x+=6)hdR(b,x,46,2,10,P[0]);hdR(b,10,44,44,2,P[0]);
  for(let j=0;j<22;j++){const ww=44-j*2;for(let i=0;i<ww;i++){const u=i/ww;hdP(b,10+j+i,22-j*.9+14,hdS(R,(((i/5)|0)%2?1:.82)*(1.1-.25*u)))}}hdR(b,30,10,4,6,P[1]);
  const sx=flip?6:46;for(let k=0;k<26;k++){const xx=flip?sx-k*.9:sx+k*.9,yy=58+k;hdR(b,Math.round(xx),Math.round(yy),10,3,hdS(Sl,1.05-k*.012));hdR(b,Math.round(xx),Math.round(yy),10,1,hdS(Sl,1.3))}
  return b}
function qsSwing(){const b=hdBuf(100,64),G=[[30,90,50],[52,140,74],[100,190,110]];
  for(const cx of[18,82]){for(let t=0;t<=40;t++){const a=Math.PI*t/40,x=cx+14*Math.cos(a),y=60-48*Math.sin(a);hdR(b,Math.round(x),Math.round(y),3,3,G[t<20?2:1]);hdP(b,Math.round(x)+2,Math.round(y)+2,G[0])}}
  hdR(b,18,11,64,3,G[1]);hdR(b,18,11,64,1,G[2]);for(const sx of[34,62]){hdLine(b,sx,14,sx-3,46,[150,150,156],1,1);hdLine(b,sx+8,14,sx+11,46,[150,150,156],1,1);hdR(b,sx-4,46,16,3,[30,30,34])}
  return b}
// partir un sprite alto: lo de abajo va al suelo del mapa y lo de arriba a la capa que tapa a quien pasa por detrás
function qsTall(b,tg,s,ox,oy,keep){const cut=Math.max(0,s.h-keep),W=s.w;if(cut>0){const hi=hdBuf(W,cut);hi.d.set(s.d.subarray(0,cut*W*4));tg.drawImage(hdToCanvas(hi),ox,oy)}
  const lo=hdBuf(W,s.h-cut);lo.d.set(s.d.subarray(cut*W*4));hdBlit(b,lo,ox,oy+cut)}
// ---- ensamblado del mapa ----
function hdQuesada(m){const W=m.w*HT,H=m.h*HT,b=hdBuf(W,H),EM=[];m.hdEmit=EM;
  hdGround(b,m);hdTileEdges(b,m);hdRoad(b,m);qsGround(b);
  // Calle Central y calles: línea amarilla discontinua y paso de cebra frente a la fuente
  for(let x=0;x<W;x++)if((x>>4)%2===0)for(const yy of[159,1087])if(ti(m,x>>5,yy>>5)===1){hdP(b,x,yy,[228,190,60]);hdP(b,x,yy+1,[200,166,50])}
  for(let y=0;y<H;y++)if((y>>4)%2===0)for(const xx of[63,1215])if(ti(m,xx>>5,y>>5)===1){hdP(b,xx,y,[228,190,60]);hdP(b,xx+1,y,[200,166,50])}
  for(let x=578;x<702;x+=14)for(let y=132;y<188;y++)for(let k=0;k<8;k++){const r=hdr(x+k,y);if(r>.06)hdP(b,x+k,y,hdS([232,230,222],.85+r*.15))}
  // jardín y reja de la catedral (la catedral va en el próximo paso)
  for(let i=0;i<44;i++){const x=10+i*29+hsh(i,3)*10,y=38+hsh(3,i)*30,C=[[150,30,40],[196,64,40],[120,28,48],[214,150,40]];for(let k=0;k<9;k++)hdEll(b,x+hsh(i,k)*16-8,y+hsh(k,i)*10-5,4,3,hdS(C[(i+k)%4],.85+hsh(k,i*2)*.3))}
  hdR(b,0,88,W,8,[150,48,44]);hdR(b,0,88,W,2,[190,80,70]);hdR(b,0,94,W,2,[100,30,28]);
  for(let x=2;x<W;x+=7){hdR(b,x,62,2,26,[26,26,30]);hdP(b,x,61,[60,60,66]);hdP(b,x+1,60,[26,26,30])}hdR(b,0,66,W,2,[30,30,34]);hdR(b,0,80,W,2,[30,30,34]);
  for(const gx of[576,700]){hdR(b,gx,54,6,42,[30,30,34]);hdR(b,gx,54,6,2,[80,80,88])}
  // fuente: baranda alrededor del estanque
  const rail=[[220,224,226],[160,166,170]];for(let Y=290;Y<430;Y++)for(let X=540;X<760;X++){const dq=qsPoolD(X,Y);if(Math.abs(dq-14)<.6){hdP(b,X,Y-11,rail[0]);hdP(b,X,Y-10,rail[1]);if(((X*7+Y*3)%23)===0)hdR(b,X,Y-10,1,10,rail[1])}}
  // juegos infantiles: torres con tobogán y columpios
  const top=mk(W,H),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;
  qsTall(b,tg,qsTower('#f2f2ee','#d8352f',0),6*32-12,23*32-40,40);qsTall(b,tg,qsTower('#ef8fb6','#d8352f',1),8*32-14,27*32-40,40);
  qsTall(b,tg,qsTower('#e23f36','#2f7ad8',0),16*32-20,23*32-40,40);qsTall(b,tg,qsSwing(),13*32-4,27*32-20,28);
  // carros estacionados, bancas y faroles
  for(const[cx,cy,v,col]of QS.cars)qsCar(b,cx*32+16,cy*32+(v?32:16),v,col,cx*31+cy);
  for(const[x,y]of QS.benches)qsBench(b,x*32-1,y*32+12);
  const LS=qsLampSpr();for(const[x,y]of QS.lamps.concat(QS.slamps)){const ox=x*32+8,oy=y*32+28-72;qsTall(b,tg,LS,ox,oy,26);EM.push({k:'lamp',x:ox+2,y:oy+3,w:12,h:12})}
  // kiosco
  const kq=hdKioscoQSplit();m._qk=kq;hdBlit(b,kq.lo,kq.X,kq.Y+QK.split);tg.drawImage(hdToCanvas(kq.hi),kq.X,kq.Y);
  // árboles grandes de copa redonda: tronco en el suelo, copa arriba
  m._qsTrees=[];for(const[x,y,kind,s]of QS.trees){const sp=hdTreeSprite(x*37+y*101,kind,s,false),ox=x*HT+16-sp.ax,oy=y*HT+30-sp.ay;hdBlit(b,sp.t,ox,oy);tg.drawImage(hdToCanvas(sp.c),ox,oy);m._qsTrees.push({x,y,sp})}
  return{base:hdToCanvas(b),top}}
// casters de sombra del sol para este mapa (ver hdCasters en hd/50_light.js)
function qsCasters(m,C){for(const t of m._qsTrees||[])C.trees.push({x:t.x*T+8,y:t.y*T+15,hc:30*(t.sp.h/112),rx:t.sp.w/4.6,ry:t.sp.w/8});
  for(const[x,y]of QS.lamps.concat(QS.slamps))C.poles.push({x:x*T+8,y:y*T+14,h:28});
  for(const[cx,cy,v]of QS.cars)C.boxes.push(v?{x:cx*T+2,y:cy*T+4,w:12,h:24,hg:8}:{x:cx*T+2,y:cy*T+2,w:24,h:12,hg:8});
  C.fx=C.fx||[];C.fx.push({draw:qkSombra,cut(g){const k=m._qk;if(!k)return;if(!k.sil){const b=k.b,c=mk(b.w,b.h),x=c.getContext('2d'),im=x.createImageData(b.w,b.h);for(let i=0;i<b.w*b.h;i++)if(b.d[i*4+3]>=200)im.data[i*4+3]=255;x.putImageData(im,0,0);k.sil=c}
    g.imageSmoothingEnabled=false;g.drawImage(k.sil,0,0,k.b.w,k.b.h,k.X/2,k.Y/2,k.b.w/2,k.b.h/2)}})}
