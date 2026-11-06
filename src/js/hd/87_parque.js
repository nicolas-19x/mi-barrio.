// ---------- Parque Central de San José: el templete y su alrededor, en estilo B ----------
// Referencias del templete real: es de 1944, obra del arquitecto catalán Víctor Sabater (art déco), de concreto armado,
// con planta circular, seis columnas monumentales y una cúpula semiesférica. Desde la restauración de 2017 está pintado
// de celeste, gris y café oscuro (antes era café con beis). Por dentro tiene un sótano redondo donde funcionó la
// Biblioteca Infantil Carmen Lyra (1971-1993), al que se bajaba por una escalerita desde afuera, junto al quiosco.
// Las escalinatas tenían farolas de metal. Alrededor: palmeras reales, guanacastes y los pericos que llegan a dormir.
//
// Cómo se pinta: el templete se arma con sólidos simples (cilindros, cajas, la cúpula y la arquería) y se lanza un rayo
// por píxel con la misma proyección del juego (el suelo se ve a la mitad de su fondo, lo vertical a tamaño real).
// Así la luz de la tarde (del oeste), las sombras propias y el sombreado con cambio de tono quedan coherentes entre las
// piezas. Después se cuantiza a rampas de color con tramado, como pixel art, y se le agregan los detalles finos.
const TPL={K:.5,KW:256,KH:300,MX:16,MY:104,CX:128,GY:200,SEG:Math.PI/3,beta:.155,zs:56,zc:85,
  L:(()=>{const l=[-.6,.42,.68],n=Math.hypot(l[0],l[1],l[2]);return l.map(v=>v/n)})(),
  pit:{x0:50,x1:84,y0:80,y1:116}};
function tplRamp(stops,n){const out=[];for(let i=0;i<n;i++){const t=i/(n-1);let k=0;while(k<stops.length-2&&t>stops[k+1][0])k++;
  const a=stops[k],b=stops[k+1],u=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));out.push(hdMix(hdC(a[1]),hdC(b[1]),u))}return out}
const TPL_PAL={
  domo:tplRamp([[0,'#1c2d4c'],[.28,'#35628c'],[.55,'#66a3c6'],[.78,'#9fd0e2'],[1,'#dcf1ee']],12),
  celeste:tplRamp([[0,'#24364f'],[.3,'#46708f'],[.58,'#80b4cc'],[.8,'#b6dbe5'],[1,'#f0f8f2']],12),
  gris:tplRamp([[0,'#2b2a35'],[.32,'#5f606c'],[.6,'#9fa0a0'],[.82,'#cdcac1'],[1,'#f3eee2']],12),
  cafe:tplRamp([[0,'#160e0c'],[.35,'#36231b'],[.62,'#5d3e2d'],[.84,'#856147'],[1,'#b5906c']],12),
  zoc:tplRamp([[0,'#1b1a20'],[.4,'#43424a'],[.7,'#74716d'],[1,'#ada79c']],12),
  piso:tplRamp([[0,'#2f2e37'],[.4,'#6b696e'],[.7,'#a9a398'],[1,'#e4ddcd']],12),
  grada:tplRamp([[0,'#37363f'],[.4,'#777577'],[.7,'#b5afa3'],[1,'#eee6d6']],12),
  pared:tplRamp([[0,'#1c1b21'],[.5,'#4c4b50'],[1,'#8e8a84']],12),
  metal:tplRamp([[0,'#0b0808'],[.5,'#2a201c'],[1,'#7a6456']],12),
  puerta:tplRamp([[0,'#110a08'],[.5,'#3a2217'],[1,'#8c5a3a']],12),
  vidrio:tplRamp([[0,'#6e5a3a'],[.5,'#e8cf96'],[1,'#fff8e4']],12)};
const TPL_BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>v/16-.47);
// ---- la escena: sólidos del templete ----
function tplScene(){const P=[],pl=(x,y,z,d)=>{const n=Math.hypot(x,y,z);return[x/n,y/n,z/n,d/n]};
  const box=(x0,x1,y0,y1,z0,z1,m,o)=>P.push(Object.assign({k:'poly',m,bx:[x0,x1],bb:[x0,x1,y0,y1,z0,z1],pl:[[1,0,0,x1],[-1,0,0,-x0],[0,1,0,y1],[0,-1,0,-y0],[0,0,1,z1],[0,0,-1,-z0]]},o||{}));
  const obox=(cx,cy,ang,a,b,z0,z1,m,o)=>{const c=Math.cos(ang),s=Math.sin(ang),dr=cx*c+cy*s,dt=-cx*s+cy*c,e=a+b;
    P.push(Object.assign({k:'poly',m,bx:[cx-e,cx+e],bb:[cx-e,cx+e,cy-e,cy+e,z0,z1],ang,cx,cy,a,b,pl:[[c,s,0,dr+a],[-c,-s,0,-(dr-a)],[-s,c,0,dt+b],[s,-c,0,-(dt-b)],[0,0,1,z1],[0,0,-1,-z0]]},o||{}))};
  const cyl=(cx,cy,R,z0,z1,m,o)=>P.push(Object.assign({k:'cyl',cx,cy,R,z0,z1,m,bx:[cx-R,cx+R],bb:[cx-R,cx+R,cy-R,cy+R,z0,z1]},o||{}));
  // podio (sótano por dentro), zócalo de piedra y borde de la plataforma
  cyl(0,0,97,-40,20,'podio');cyl(0,0,99,0,6,'zoc');cyl(0,0,100,20,25,'borde');
  // seis columnas monumentales, con basa y capitel escalonado (art déco)
  for(let i=0;i<6;i++){const a=i*TPL.SEG,cx=82*Math.cos(a),cy=82*Math.sin(a);
    obox(cx,cy,a,8,9,25,86,'col',{shaft:1});obox(cx,cy,a,10,11,25,31,'col');obox(cx,cy,a,10,11,83,88,'col');obox(cx,cy,a,11.5,12.5,88,92,'col')}
  // arquería entre columnas, friso, cornisa y cúpula
  P.push({k:'shell',Ri:76,Ro:87,z0:25,z1:95,m:'arco',bx:[-87,87],bb:[-87,87,-87,87,25,95]});
  cyl(0,0,91,95,107,'friso');cyl(0,0,95,107,111,'corn');
  P.push({k:'dome',R:90,H:56,zc:111,m:'domo',bx:[-90,90],bb:[-90,90,-90,90,111,167]});
  // escalinata del frente (gradas) con sus muros laterales en rampa
  for(let i=0;i<5;i++)box(-32,32,60,106+6*i,0,21-4*i,'grada',{st:i,yf:106+6*i});
  const sl=20/43;for(const sg of[-1,1]){const x0=sg<0?-40:32,x1=sg<0?-32:40;
    P.push({k:'poly',m:'mejilla',bx:[x0,x1],bb:[x0,x1,88,131,0,27],pl:[[1,0,0,x1],[-1,0,0,-x0],[0,1,0,131],[0,-1,0,-88],pl(0,sl,1,27+88*sl),[0,0,-1,0]]})}
  // escalerita del sótano (antigua Biblioteca Carmen Lyra), en la esquina del frente a la derecha
  const q=TPL.pit;box(q.x0,q.x1,q.y0-6,q.y0,-40,0,'pared',{door:1});box(q.x0-2,q.x0,q.y0,q.y1,-40,0,'pared');box(q.x1,q.x1+2,q.y0,q.y1,-40,0,'pared');
  box(q.x0,q.x1,q.y0,q.y0+6,-40,-25,'grada2');for(let j=0;j<4;j++)box(q.x0,q.x1,q.y1-6*(j+1),q.y1-6*j,-40,-5*(j+1),'grada2',{st:j,yf:q.y1-6*j});
  // farolas de metal al pie de la escalinata
  for(const sg of[-1,1]){const lx=46*sg,ly=124;cyl(lx,ly,3.4,0,4,'metal');cyl(lx,ly,1.5,0,41,'metal');box(lx-4,lx+4,ly-4,ly+4,41,51,'vidrio',{lamp:1});box(lx-5,lx+5,ly-5,ly+5,51,53,'metal');cyl(lx,ly,1,53,57,'metal')}
  for(const p of P){const q=p.bb;p.sy0=TPL.GY+TPL.K*q[2]-q[5]-1;p.sy1=TPL.GY+TPL.K*q[3]-q[4]+1}
  return P}
// ¿el rayo pasa por la caja envolvente? (descarte rápido)
function tplBox(o,d,q){let t0=1e-4,t1=1e9;for(let i=0;i<3;i++){const lo=q[i*2],hi=q[i*2+1],di=d[i],oi=o[i];
    if(di>-1e-12&&di<1e-12){if(oi<lo||oi>hi)return false;continue}let a=(lo-oi)/di,b=(hi-oi)/di;if(a>b){const t=a;a=b;b=t}if(a>t0)t0=a;if(b<t1)t1=b;if(t0>t1)return false}return true}
// ---- intersecciones rayo-sólido: devuelven [t, nx, ny, nz] ----
function tplCylIv(o,d,cx,cy,R){const ox=o[0]-cx,oy=o[1]-cy,a=d[0]*d[0]+d[1]*d[1];if(a<1e-12)return ox*ox+oy*oy<=R*R?[-1e9,1e9]:null;
  const b=ox*d[0]+oy*d[1],c=ox*ox+oy*oy-R*R,disc=b*b-a*c;if(disc<0)return null;const sq=Math.sqrt(disc);return[(-b-sq)/a,(-b+sq)/a]}
function tplArchZ(ph){const S=TPL.SEG,a=((ph%S)+S)%S,be=TPL.beta;if(a<be||a>S-be)return -1e9;const u=(a-be)/(S-2*be)*2-1;return TPL.zs+(TPL.zc-TPL.zs)*Math.sqrt(Math.max(0,1-u*u))}
function tplIsect(p,o,d){
  if(p.k==='poly'){let t0=-1e9,t1=1e9,ni=-1;const pl=p.pl;for(let i=0;i<pl.length;i++){const q=pl[i],den=q[0]*d[0]+q[1]*d[1]+q[2]*d[2],dist=q[3]-(q[0]*o[0]+q[1]*o[1]+q[2]*o[2]);
      if(den>-1e-12&&den<1e-12){if(dist<0)return null;continue}const t=dist/den;if(den<0){if(t>t0){t0=t;ni=i}}else if(t<t1)t1=t;if(t0>t1)return null}
    if(ni<0||t0<1e-4)return null;const q=pl[ni];return[t0,q[0],q[1],q[2]]}
  if(p.k==='cyl'){const iv=tplCylIv(o,d,p.cx,p.cy,p.R);if(!iv)return null;let t0=iv[0],t1=iv[1],n=0;
    if(d[2]>-1e-12&&d[2]<1e-12){if(o[2]<p.z0||o[2]>p.z1)return null}else{let za=(p.z0-o[2])/d[2],zb=(p.z1-o[2])/d[2],nz=-1;if(za>zb){const t=za;za=zb;zb=t;nz=1}if(za>t0){t0=za;n=nz}if(zb<t1)t1=zb}
    if(t0>t1||t0<1e-4)return null;if(n)return[t0,0,0,n];const x=o[0]+t0*d[0]-p.cx,y=o[1]+t0*d[1]-p.cy;return[t0,x/p.R,y/p.R,0]}
  if(p.k==='dome'){const s=p.R/p.H,ox=o[0],oy=o[1],oz=(o[2]-p.zc)*s,dx=d[0],dy=d[1],dz=d[2]*s;
    const a=dx*dx+dy*dy+dz*dz,b=ox*dx+oy*dy+oz*dz,c=ox*ox+oy*oy+oz*oz-p.R*p.R,disc=b*b-a*c;if(disc<0)return null;const sq=Math.sqrt(disc);let t0=(-b-sq)/a,t1=(-b+sq)/a,cap=0;
    if(dz>-1e-12&&dz<1e-12){if(oz<0)return null}else{const tz=-oz/dz;if(dz<0){if(tz<t1)t1=tz}else if(tz>t0){t0=tz;cap=1}}
    if(t0>t1||t0<1e-4)return null;if(cap)return[t0,0,0,-1];
    const x=ox+t0*dx,y=oy+t0*dy,z=(oz+t0*dz)/s,nx=x/(p.R*p.R),ny=y/(p.R*p.R),nz=z/(p.H*p.H),L=Math.hypot(nx,ny,nz);return[t0,nx/L,ny/L,nz/L]}
  if(p.k==='shell'){const rO=tplCylIv(o,d,0,0,p.Ro);if(!rO)return null;let zl=-1e9,zh=1e9;
    if(d[2]>-1e-12&&d[2]<1e-12){if(o[2]<p.z0||o[2]>p.z1)return null}else{let a=(p.z0-o[2])/d[2],b=(p.z1-o[2])/d[2];if(a>b){const t=a;a=b;b=t}zl=a;zh=b}
    const lo=Math.max(rO[0],zl),hi=Math.min(rO[1],zh);if(lo>hi)return null;const rI=tplCylIv(o,d,0,0,p.Ri),segs=[];
    if(rI&&rI[1]>lo&&rI[0]<hi){if(rI[0]>lo)segs.push([lo,Math.min(rI[0],hi),rO[0]>=zl?0:1]);if(rI[1]<hi)segs.push([Math.max(rI[1],lo),hi,2])}else segs.push([lo,hi,rO[0]>=zl?0:1]);
    for(const[s0,s1,tag]of segs){for(let t=Math.max(s0,1e-4);t<=s1+1e-6;t+=.45){const x=o[0]+t*d[0],y=o[1]+t*d[1],z=o[2]+t*d[2];if(z<tplArchZ(Math.atan2(y,x)))continue;
        const r=Math.hypot(x,y);if(t-s0<.46){if(tag===0)return[t,x/r,y/r,0];if(tag===2)return[t,-x/r,-y/r,0];return[t,0,0,d[2]<0?1:-1]}return[t,0,0,-1]}}
    return null}
  return null}
// ---- material y color de cada impacto ----
function tplShade(p,h,X,Y,Z,px,py,lit,amb){const r=Math.hypot(X,Y),ph=Math.atan2(Y,X),nz=h[3];let pal,v=amb+lit,n=0;
  const tex=(s,a)=>(hdVN(px,py,s,7)-.5)*a+(hdr(px,py)-.5)*a*.6;
  switch(p.m){
  case'domo':{pal=TPL_PAL.domo;const e=Math.max(0,(Z-111)/54);n=tex(6,.08);
    const st=hdVN(ph*90*.9+40,e*2.2,4.5,9);if(st>.64&&e<.8)n-=(st-.64)*.36*(1-e);          // chorreas de lluvia
    if(e<.16)n-=(.16-e)*.8*hdVN(ph*90,e*30,4,5);                                           // mugre en el arranque
    if(hdr(px*3,py*5)>.985)n+=.12;break}
  case'arco':pal=TPL_PAL.celeste;n=tex(5,.07);if(Z>88)n-=(Z-88)*.012;break;
  case'friso':{pal=TPL_PAL.gris;n=tex(5,.06);const u=ph*91;
    if(Z<99){if(((u/5)|0)%2)n+=.07;else n-=.05}                                              // dentellones
    else if(Z<105){const w=Math.abs(((u/7)%2+2)%2-1)*4+100.5;if(Math.abs(Z-w)<.9)n-=.16;else if(Math.abs(Z-w-1.4)<.6)n+=.06}   // zigzag art déco
    const st=hdVN(u*.5,3,3,21);if(st>.64)n-=(st-.64)*.5*((Z-95)/12);break}
  case'corn':pal=TPL_PAL.gris;n=tex(5,.05)+(nz>.5?.06:0);break;
  case'col':{pal=TPL_PAL.gris;n=tex(5,.06);
    if(p.shaft&&Math.abs(h[1]*Math.cos(p.ang)+h[2]*Math.sin(p.ang))>.9){const u=-(X-p.cx)*Math.sin(p.ang)+(Y-p.cy)*Math.cos(p.ang);   // estrías
      for(const g of[-4.5,0,4.5]){if(Math.abs(u-g)<.7)n-=.16;else if(Math.abs(u-g-1.2)<.6)n+=.06}}
    if(Z<36)n-=(36-Z)*.006;if(Z>80&&Z<84)n-=.08;break}
  case'podio':if(Z<0){pal=TPL_PAL.pared;n=tex(4,.08)}else{pal=TPL_PAL.cafe;n=tex(5,.07);if(Z>17)n-=.07;if(Z<9)n+=(9-Z)*.012}break;
  case'zoc':pal=TPL_PAL.zoc;n=tex(3,.12)+(hdr(px*7,py*3)>.9?.1:0)-(hdVN(px,py,9,3)>.7?.08:0);break;
  case'borde':if(nz>.5&&r<96.5){pal=TPL_PAL.piso;n=tex(3,.05)+(hdr(px*5,py*7)>.94?.07:hdr(px*5,py*7)<.05?-.07:0);
      const k=ph/(Math.PI/12),dk=Math.abs(k-Math.round(k))*r*Math.PI/12;if(dk<.6&&r>60)n-=.08;if(Math.abs(r-92)<.7||Math.abs(r-62)<.7)n-=.08}
    else{pal=TPL_PAL.gris;n=tex(4,.05)+(nz>.5?.04:0)}break;
  case'grada':case'grada2':{pal=TPL_PAL.grada;n=tex(4,.07);if(nz>.5){if(p.yf-Y<1.3)n+=.12;if(Math.abs(X-(p.m==='grada'?0:66))<11)n+=.04}else n-=.04;
    if(hdr(px*9,py*11)>.988)n-=.3;if(p.m==='grada2')n-=.06;break}
  case'mejilla':if(nz>.5){pal=TPL_PAL.gris;n=tex(4,.05)+.04}else{pal=TPL_PAL.cafe;n=tex(5,.07)}break;
  case'pared':pal=TPL_PAL.pared;n=tex(4,.08);
    if(p.door&&h[2]>.9){const q=TPL.pit;if(X>q.x0+6&&X<q.x0+22&&Z>-25&&Z<-3){pal=TPL_PAL.puerta;n=tex(4,.05);const dx=X-q.x0-6,dz=Z+25;
        if(dx<1||dx>15||dz>21)n-=.12;else if((Math.abs(dx-4)<.6||Math.abs(dx-11)<.6)&&dz<15)n-=.1;else if(dz>15&&dz<20&&((dx|0)%3===0))n-=.2;
        if(Math.abs(dx-13)<1&&Math.abs(dz-10)<1){pal=TPL_PAL.vidrio;n=.1}}}break;
  case'metal':pal=TPL_PAL.metal;n=tex(3,.04);break;
  case'vidrio':pal=TPL_PAL.vidrio;v=.55+lit*.5;n=(Math.abs(X%8)<.6?-.25:0);break;
  default:pal=TPL_PAL.gris}
  return[pal,v+n]}
// ---- pintar el templete en un búfer propio ----
function hdTempleteBuf(){const t0=performance.now(),S=TPL,W=S.KW,H=S.KH,b=hdBuf(W,H),P=tplScene(),L=S.L,K=S.K,dl=Math.hypot(1,K),d=[0,-1/dl,-K/dl];
  const T=new Float32Array(W*H).fill(1e9),q=S.pit,SH=P.filter(p=>p.m!=='vidrio').sort((a,c)=>(c.m==='domo'||c.m==='corn'||c.m==='friso')-(a.m==='domo'||a.m==='corn'||a.m==='friso'));
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){const x=px+.5-S.CX,s=py+.5-S.GY,o=[x,600,K*600-s];let best=null,bp=null;
    const sy=py+.5;for(const p of P){if(x<p.bx[0]-.5||x>p.bx[1]+.5||sy<p.sy0||sy>p.sy1)continue;const h=tplIsect(p,o,d);if(h&&(!best||h[0]<best[0])){best=h;bp=p}}
    // el suelo (z=0): transparente, salvo la sombrita de contacto; dentro del hueco del sótano el rayo sigue bajando
    const tg=o[2]/(K/dl),gy=o[1]+tg*d[1],inPit=x>q.x0&&x<q.x1&&gy>q.y0&&gy<q.y1;
    if(!inPit&&(!best||tg<best[0])){const r=Math.hypot(x,gy);let ao=0;
      if(r>97)ao=Math.max(ao,.34*Math.max(0,1-(r-99)/7));if(gy>100&&gy<137&&Math.abs(x)<44)ao=Math.max(ao,.3*Math.max(0,1-Math.min(Math.abs(Math.abs(x)-40),Math.abs(gy-131))/5));
      for(const sg of[-1,1]){const dd=Math.hypot(x-46*sg,(gy-124));if(dd<9)ao=Math.max(ao,.32*(1-dd/9))}
      if(ao>.01)hdP(b,px,py,[20,14,22],ao);continue}
    if(!best)continue;T[py*W+px]=best[0];
    const X=o[0]+best[0]*d[0],Y=o[1]+best[0]*d[1],Z=o[2]+best[0]*d[2],nd=best[1]*L[0]+best[2]*L[1]+best[3]*L[2];
    let lit=0;if(nd>0){let sh=false;const so=[X+best[1]*.05+L[0]*.05,Y+best[2]*.05+L[1]*.05,Z+best[3]*.05+L[2]*.05];
      for(const p of SH){if(!tplBox(so,L,p.bb))continue;if(tplIsect(p,so,L)){sh=true;break}}if(!sh)lit=nd*.66}
    const r=Math.hypot(X,Y);let amb=.34*(.8+.2*best[3]);if(r<88&&Z>24&&Z<96)amb*=.62;if(Z<0)amb*=.72+.28*Math.max(0,1+Z/40);
    const[pal,v]=tplShade(bp,best,X,Y,Z,px,py,lit,amb);const N=pal.length,k=Math.max(0,Math.min(N-1,Math.floor(v*1.08*(N-1)+.5+TPL_BAYER[(py&3)*4+(px&3)]*.9)));hdP(b,px,py,pal[k])}
  // contornos: el píxel lejano junto a uno cercano se oscurece (lectura clara de las piezas)
  const D=b.d,mul=(i,f)=>{D[i]*=f;D[i+1]*=f;D[i+2]*=f};
  for(let py=1;py<H-1;py++)for(let px=1;px<W-1;px++){const i=py*W+px,t=T[i];if(t>=1e9)continue;
    const nb=[T[i-1],T[i+1],T[i-W],T[i+W]];let far=false;for(const u of nb)if(u<t-7){far=true;break}if(far)mul(i<<2,.8);
    if(T[i+W]>=1e9&&D[((i+W)<<2)+3]<200)mul(i<<2,.78);if(T[i+1]>=1e9&&D[((i+1)<<2)+3]<200)mul(i<<2,.86)}
  hdTempleteDetalles(b);TPL.ms=Math.round(performance.now()-t0);return b}
// proyección de un punto del templete a su búfer
const tplPt=(x,y,z)=>[TPL.CX+x,TPL.GY+TPL.K*y-z];
function hdTempleteDetalles(b){const M=TPL_PAL.metal,pt=tplPt;
  // pasamanos de metal sobre los muros de la escalinata
  for(const sg of[-1,1]){const x=36*sg,top=y=>27-(y-88)*20/43+11;const[a0,a1]=pt(x,92,top(92)),[b0,b1]=pt(x,129,top(129));hdLine(b,a0,a1,b0,b1,M[2],1,1);hdLine(b,a0,a1-1,b0,b1-1,M[6],1,1);
    for(const y of[96,112,127]){const[p0,p1]=pt(x,y,top(y)-11),[q0,q1]=pt(x,y,top(y));hdLine(b,p0,p1,q0,q1,M[3],1,1)}}
  // baranda del hueco del sótano
  const q=TPL.pit;for(const[x,y]of[[q.x0,q.y1],[(q.x0+q.x1)/2,q.y1],[q.x1,q.y1],[q.x1,q.y0+2]]){const[p0,p1]=pt(x,y,0),[q0,q1]=pt(x,y,12);hdLine(b,p0,p1,q0,q1,M[3],1,1)}
  {const[a0,a1]=pt(q.x0,q.y1,12),[b0,b1]=pt(q.x1,q.y1,12);hdLine(b,a0,a1,b0,b1,M[4],1,1);hdLine(b,a0,a1+6,b0,b1+6,M[2],1,1);const[c0,c1]=pt(q.x1,q.y0+2,12);hdLine(b,b0,b1,c0,c1,M[4],1,1)}
  // palomas en la cornisa y en el borde de la plataforma, con sus manchas
  const pig=(x,y,z,f)=>{const[sx,sy]=pt(x,y,z),X=Math.round(sx),Y=Math.round(sy),s=f?-1:1,G=[[86,90,100],[124,130,140],[160,166,174]];
    for(let i=-3;i<=3;i++)for(let j=-3;j<=0;j++){if(Math.abs(i)+Math.abs(j+1.5)>4)continue;hdP(b,X+i*s,Y+j,j<-2?G[2]:i<0?G[1]:G[0])}
    hdP(b,X+3*s,Y-4,G[1]);hdP(b,X+4*s,Y-4,G[1]);hdP(b,X+4*s,Y-5,G[2]);hdP(b,X+5*s,Y-4,[30,28,32]);hdP(b,X+3*s,Y-3,[90,140,120]);hdP(b,X-4*s,Y-1,[70,74,82]);hdP(b,X-5*s,Y-1,[60,62,70]);
    hdP(b,X,Y+1,[200,120,120]);for(let k=0;k<4;k++)hdP(b,X-6+((hsh(X,k)*12)|0),Y+1+((hsh(k,Y)*2)|0),[236,234,226],.85)};
  for(const[a,f]of[[1.25,0],[1.9,1],[2.45,0]])pig(93*Math.cos(a),93*Math.sin(a),111,f);pig(98*Math.cos(.42),98*Math.sin(.42),25,1);
  for(const a of[1.25,1.9,2.45]){const[sx,sy]=pt(95*Math.cos(a),95*Math.sin(a),107);for(let k=0;k<3;k++){const X=Math.round(sx-3+hsh(a*9,k)*6);for(let j=0;j<2+((hsh(k,a*7)*4)|0);j++)hdP(b,X,Math.round(sy)+j,[226,224,214],.7-j*.12)}}
  // un grafiti viejo, medio borrado, en el podio (Chepe es Chepe)
  {const[sx,sy]=pt(97*Math.cos(2.5),97*Math.sin(2.5),13),C=[44,60,130];const pts=[[0,2],[2,0],[3,3],[5,0],[6,3],[8,1],[9,3],[11,0]];for(let i=1;i<pts.length;i++)hdLine(b,sx+pts[i-1][0],sy+pts[i-1][1],sx+pts[i][0],sy+pts[i][1],C,.45,1);hdLine(b,sx,sy+5,sx+11,sy+4,[150,40,40],.35,1)}}
// el templete partido en dos capas: lo bajo (la gente de enfrente pasa por delante) y lo alto (tapa al que pasa por detrás)
function hdTemplete(o){if(o._hd)return o._hd;const b=hdTempleteBuf(),S=TPL,split=S.MY+124,W=b.w;
  const lo=hdBuf(W,b.h-split),hi=hdBuf(W,split);hi.d.set(b.d.subarray(0,split*W*4));lo.d.set(b.d.subarray(split*W*4));
  const X=o.x*HT-S.MX,Y=o.y*HT-S.MY;o._hd={lo,hi,X,Y,split};return o._hd}
// ---- luces y sombra del templete (las farolas de la escalinata se encienden de noche) ----
function hdParqueExtras(m,EM){const o=m.objs.find(o=>o.type==='templete');if(!o)return;const S=TPL,X0=o.x*HT-S.MX,Y0=o.y*HT-S.MY;
  for(const sg of[-1,1]){const[sx,sy]=tplPt(46*sg,124,51);EM.push({k:'lamp',x:X0+sx-4,y:Y0+sy,w:8,h:10});
    if(!m._tplLuz){const[gx,gy]=tplPt(46*sg,124,0);m.lights.push({x:(X0+gx)/2,y:(Y0+gy)/2,r:46,pole:1})}}
  m._tplLuz=1}
// sombra del sol (la pinta hdShadows en unidades del mundo): podio, columnas, friso y cúpula
function tplSombra(g,o,vx,vy){const S=TPL,X0=o.x*HT-S.MX,Y0=o.y*HT-S.MY,gx=(X0+S.CX)/2,gy=(Y0+S.GY)/2,E=(x,y,rx,ry)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()};
  for(let h=0;h<=12.5;h+=3.1)E(gx+vx*h,gy+vy*h,48.5,24.2);
  g.lineWidth=8;for(let i=0;i<6;i++){const a=i*S.SEG,cx=gx+41*Math.cos(a),cy=gy+20.5*Math.sin(a);g.beginPath();g.moveTo(cx+vx*12.5,cy+vy*12.5);g.lineTo(cx+vx*47.5,cy+vy*47.5);g.stroke()}
  for(let h=47.5;h<=55.5;h+=2.6)E(gx+vx*h,gy+vy*h,47.5,23.7);
  for(let h=55.5;h<83.5;h+=2.8){const r=45*Math.sqrt(Math.max(0,1-((h-55.5)/28)**2));E(gx+vx*h,gy+vy*h,r,r*.5)}}
// ---- «SJO ¡VIVE!»: las letras de colores de la marca ciudad, a la par del templete ----
// La escultura del Parque Central (2017) medía 3,6 × 2,4 m: S, J y O grandes y traslapadas y, abajo, ¡VIVE! en letra gruesa.
// Aquí las letras van forradas de piedritas de colores (mosaico) sobre una base de concreto.
function sjoSpline(pts,n){const out=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([0,1].map(j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)))}}
  out.push(pts[pts.length-1]);return out}
function sjoMask(W,H,strokes,r,ox,oy){const m=new Uint8Array(W*H);for(const s of strokes)for(let i=0;i<s.length;i++){const a=s[i],b2=s[Math.min(i+1,s.length-1)],n=Math.ceil(Math.hypot(b2[0]-a[0],b2[1]-a[1])*2)+1;
    for(let k=0;k<=n;k++){const x=ox+a[0]+(b2[0]-a[0])*k/n,y=oy+a[1]+(b2[1]-a[1])*k/n;for(let yy=Math.floor(y-r);yy<=Math.ceil(y+r);yy++)for(let xx=Math.floor(x-r);xx<=Math.ceil(x+r);xx++){
      if(xx<0||yy<0||xx>=W||yy>=H)continue;if((xx+.5-x)**2+(yy+.5-y)**2<=r*r)m[yy*W+xx]=1}}}return m}
// mosaico: celdas irregulares (Voronoi) con su tono, y la pasta clara entre piedra y piedra
function sjoStone(x,y,s){const cx=Math.floor(x/s),cy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const gx=cx+i,gy=cy+j,px=(gx+.04+hsh(gx,gy*7)*.92)*s,py=(gy+.04+hsh(gx*5,gy)*.92)*s,d=(x-px)**2+(y-py)**2;if(d<d1){d2=d1;d1=d;id=gx*131+gy*977}else if(d<d2)d2=d}
  return[id,Math.sqrt(d2)-Math.sqrt(d1)]}
const sjoHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,v|0)).toString(16).padStart(2,'0')).join('');
function hdSjoBuf(){const W=144,H=112,b=hdBuf(W,H),CXs=W/2;
  const G=tplRamp([[0,'#2b2a35'],[.32,'#5f606c'],[.6,'#9fa0a0'],[.82,'#cdcac1'],[1,'#f3eee2']],12);
  // base de concreto con su sombra de contacto
  const bx0=CXs-60,bx1=CXs+60,bT=88,bF=96,bB=102;for(let x=bx0-3;x<bx1+3;x++)for(let y=bB;y<bB+4;y++)hdP(b,x,y,[20,14,22],.32*(1-(y-bB)/4));
  for(let y=bT;y<bB;y++)for(let x=bx0;x<bx1;x++){const top=y<bF,f=top?.84-(bF-y)*.012:.6-(y-bF)*.02,n=(hdVN(x,y,4,3)-.5)*.08+(hdr(x,y)-.5)*.05;
    let k=Math.round((f+n)*(G.length-1)+TPL_BAYER[(y&3)*4+(x&3)]*.8);if(y===bT||x===bx0)k+=2;if(y===bF)k+=1;if(y===bB-1||x===bx1-1)k-=2;hdP(b,x,y,G[Math.max(0,Math.min(11,k))])}
  // trazos de las letras grandes (S, J y O traslapadas)
  const S_=sjoSpline([[27,7],[21,2],[11,2],[4,7],[5,15],[13,20],[22,24],[28,30],[27,37],[19,42],[9,42],[3,37]],8),
    J_=[[[23,4],[23,30]],sjoSpline([[23,28],[21,37],[14,42],[7,41],[3,36]],8)],
    O_=sjoSpline(Array.from({length:25},(_,i)=>{const a=i/24*Math.PI*2;return[16+10.5*Math.cos(a),22+16*Math.sin(a)]}),3);
  const yS=24,L=[{m:sjoMask(W,H,[S_],5.6,CXs-43,yS),c:'#e0407c',dk:5},{m:sjoMask(W,H,[O_],5.6,CXs+10,yS),c:'#1fa39b',dk:5},{m:sjoMask(W,H,J_,5.6,CXs-20,yS),c:'#f4b331',dk:5,front:1}];
  // ¡VIVE! en letra gruesa (como la Arial Black de la marca), cada letra de un color
  const V=[[[0,1],[7,19],[14,1]]],vy=73,vx=CXs-39,VV=[
    {s:[[[1.6,11.5],[1.6,19]],[[1.6,3.2],[1.6,3.4]]],x:0,c:'#f07a2a'},{s:V,x:7,c:'#e23f36'},{s:[[[1.6,1.5],[1.6,19]]],x:26,c:'#2f6fd0'},
    {s:V,x:33,c:'#5fb544'},{s:[[[1.6,1.5],[1.6,19]],[[1.6,1.5],[11,1.5]],[[1.6,10],[9.5,10]],[[1.6,19],[11,19]]],x:52,c:'#8e4bb0'},{s:[[[1.6,1.5],[1.6,9]],[[1.6,17.4],[1.6,17.6]]],x:70,c:'#f4c430'}];
  for(const v of VV)L.push({m:sjoMask(W,H,v.s,3,vx+v.x,vy),c:v.c,dk:3,small:1});
  // cada letra: primero el canto de arriba, luego el frente con el mosaico de piedritas y un contorno oscuro
  for(const l of L){let x0=W,x1=0,y0=H,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(l.m[y*W+x]){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}l.bb=[Math.max(1,x0-1),Math.min(W-2,x1+1),Math.max(1,y0-1-l.dk),Math.min(H-2,y1+1)]}
  const paint=(l)=>{const[bx0,bx1,by0,by1]=l.bb,B=hdC(l.c),R=tplRamp([[0,'#1a1220'],[.35,sjoHex(hdS(B,.5))],[.62,l.c],[.85,sjoHex(hdMix(B,[255,250,236],.45))],[1,'#fffaf0']],12),m=l.m,ss=l.small?2.2:3,
      grout=hdMix(hdS(B,.55),[214,206,192],.45),gT=l.small?.28:.42;
    for(let s=l.dk;s>=1;s--)for(let y=by0;y<=by1;y++)for(let x=bx0;x<=bx1;x++){if(!m[y*W+x]||y-s<0)continue;const Y=y-s;if(m[Y*W+x]&&s<l.dk)continue;
      const[id,e]=sjoStone(x*1.3+50,Y*1.7+20,ss),v=.8+(hsh(id,3)-.5)*.14-(s===l.dk?.1:0);
      if(e<gT)hdP(b,x,Y,hdS(grout,1.05));else{const k=Math.round(v*11+TPL_BAYER[(Y&3)*4+(x&3)]*.8);hdP(b,x,Y,R[Math.max(0,Math.min(11,k))])}}
    for(let y=by0;y<=by1;y++)for(let x=bx0;x<=bx1;x++){if(!m[y*W+x])continue;const[id,e]=sjoStone(x,y,ss),r=hsh(id,7);let col;
      if(e<gT)col=hdS(grout,.86);
      else{const v=.6+(hsh(id,1)-.5)*(l.small?.12:.24)+(hsh(id,5)<.5?0:.03)-(hdVN(x,y,9,2)-.5)*.06,k=Math.max(0,Math.min(11,Math.round(v*11+TPL_BAYER[(y&3)*4+(x&3)]*.7)));col=R[k];
        if(!l.small&&r<.06)col=hdMix(col,[255,250,240],.5);else if(!l.small&&r>.965)col=hdMix(col,[40,34,60],.35);if(hsh(id,9)<.07&&e>1.1)col=hdS(col,1.22)}
      if(!m[(y-1)*W+x]||!m[y*W+x-1])col=hdS(col,1.12);if(!m[y*W+x+1]||!m[(y+1)*W+x])col=hdS(col,.7);hdP(b,x,y,col)}
    for(let y=by0;y<=by1;y++)for(let x=bx0;x<=bx1;x++){if(m[y*W+x])continue;if(m[y*W+x-1]||m[y*W+x+1]||m[(y-1)*W+x]||m[(y+1)*W+x])hdP(b,x,y,[26,20,30],l.small?.4:.55)}};
  for(const l of L)if(l.small)paint(l);for(const l of L)if(!l.small)paint(l);
  return b}
function hdSjo(o){if(o._hd)return o._hd;const b=hdSjoBuf(),split=72,W=b.w,lo=hdBuf(W,b.h-split),hi=hdBuf(W,split);hi.d.set(b.d.subarray(0,split*W*4));lo.d.set(b.d.subarray(split*W*4));
  o._hd={lo,hi,X:o.x*HT-8,Y:o.y*HT-72,split};return o._hd}
