// ================= CABINA DEL CARRO · arte sombreado por píxel =================
const CAR_R=(()=>{const R={
 plastic:['#050508','#0a0a0e','#111017','#18171f','#211f29','#2b2935','#373443','#454153'],
 fabric:['#070709','#0d0c11','#141319','#1c1a22','#25232d','#302d39','#3c3947','#4b4757'],
 chrome:['#08080b','#1c1c24','#33333f','#4f4f5e','#717183','#9696a8','#bdbdcd','#e6e6f2'],
 leather:['#030304','#070609','#0d0c10','#141218','#1c1a21','#25222b','#302c37','#3d3845'],
 glow:['#021009','#041d12','#08301e','#0e4a2e','#176a42','#26905a','#45b87a','#80e6aa'],
 seat:['#060507','#0c0a0e','#131017','#1b1720','#241f2a','#2f2936','#3b3443','#4a4252']};
 const o={};for(const k in R)o[k]=R[k].map(h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]});return o})();
function carRampFrom(hex,lo,hi){const n=parseInt(hex.slice(1),16),c=[n>>16,n>>8&255,n&255];return[-.82,-.68,-.54,-.4,-.26,-.12,.04,.18].map(a=>a*(a<0?lo||1:hi||1)).map(a=>{const f=a<0?0:255,q=Math.min(1,Math.abs(a));return c.map(v=>Math.round((f-v)*q+v))})}
function carPick(r,v,x,y){const n=r.length;let i=Math.round(Math.max(0,Math.min(1,v))*(n-1)+MBAYER[(y&3)*4+(x&3)]-.5);return r[i<0?0:i>n-1?n-1:i]}
function carBuf(W,H){const c=mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),D=img.data;
 return{c,g,img,D,put(x,y,rgb,a){x|=0;y|=0;if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*4;if(a==null||a>=1){D[i]=rgb[0];D[i+1]=rgb[1];D[i+2]=rgb[2];D[i+3]=255}else{const b=1-a;D[i]=D[i]*b+rgb[0]*a;D[i+1]=D[i+1]*b+rgb[1]*a;D[i+2]=D[i+2]*b+rgb[2]*a;D[i+3]=Math.max(D[i+3],a*255)}},done(){g.putImageData(img,0,0);return c}}}
function carNoise(x,y,s){const v=Math.sin(x*12.9898+y*78.233+(s||0)*3.7)*43758.5453;return v-Math.floor(v)}
// mezcla un color con el resplandor verde del tablero
function carTint(col,glow){if(glow<=0)return col;const G=[70,210,140],k=Math.min(.4,glow*.6);return[col[0]+(G[0]-col[0])*k*.3,col[1]+(G[1]-col[1])*k*.45,col[2]+(G[2]-col[2])*k*.32]}

function carLayout(L){const{W,H}=L,dt=L.dashTop,port=H>W;
 L.roof=Math.max(10,Math.round(H*(port?.05:.06)));
 L.stack={x0:Math.round(W*(port?.49:.47)),x1:Math.round(W*(port?.69:.62)),y0:dt+Math.round(L.dashH*.2)};
 L.vents={y:L.stack.y0,h:Math.max(7,Math.round(L.dashH*.11))};
 L.rx=L.stack.x0+2;L.rw=L.stack.x1-L.stack.x0-4;L.ry=L.vents.y+L.vents.h+5;
 L.mw=Math.min(100,Math.max(64,Math.round(W*.34)));L.mh=Math.max(16,Math.round(H*(port?.062:.09)));L.my=L.roof+2;L.mx=Math.round(W/2);
 L.pw=y=>{const u=Math.max(0,Math.min(1,(y-L.roof)/(dt-L.roof)));return Math.round(W*((port?.15:.1)-(port?.1:.065)*u))};
 return L}

// ---------- capa fija de la cabina ----------
function carCabin(L){const{W,H}=L,dt=L.dashTop,B=carBuf(W,H),R=CAR_R,put=B.put;
 const glowAt=(x,y)=>{let g=0;for(const gx of[L.g1,L.g2]){const d=Math.hypot(x-gx,(y-L.gY)*1.3);g+=Math.max(0,1-d/(L.gR*4))*.55}const dr=Math.hypot(x-(L.rx+L.rw/2),(y-L.ry-4)*1.6);g+=Math.max(0,1-dr/(L.rw*1.4))*.5;return g};
 // techo (tela) con luz de cortesía apagada
 for(let y=0;y<L.roof;y++)for(let x=0;x<W;x++){let v=.18+.12*(y/L.roof)+.08*(carNoise(x>>1,y,1)-.5);if(Math.abs(x-W/2)<9&&y>2&&y<6)v=.32;put(x,y,carPick(R.fabric,v,x,y))}
 for(let x=0;x<W;x++){put(x,L.roof-1,R.plastic[0]);put(x,L.roof,R.plastic[1])}
 // parasoles doblados
 for(const sd of[-1,1]){const x0=sd<0?L.pw(L.roof)+3:Math.round(W*.56),x1=sd<0?Math.round(W*.44):W-L.pw(L.roof)-3,h=Math.max(8,Math.round(H*.028));
  for(let y=L.roof+1;y<L.roof+1+h;y++)for(let x=x0;x<x1;x++){const q=(y-L.roof)/h;let v=.3-.18*q+.06*(carNoise(x,y,2)-.5);if(y===L.roof+h)v=.06;if((x-x0)%4===0&&(y===L.roof+2||y===L.roof+h-1))v+=.12;put(x,y,carPick(R.fabric,v,x,y))}
  if(sd>0){const cx=Math.round(x0+(x1-x0)*.6),cy=L.roof+2;for(let y=0;y<h-2;y++)for(let x=0;x<9;x++){const e=y===0||x===0||x===8;put(cx+x,cy+y,e?[180,150,70]:y<3?[120,150,190]:y<h-5?[200,190,170]:[90,110,150])}put(cx+4,cy+3,[240,230,200])}}
 // parales A con burlete de hule
 for(let y=L.roof;y<dt;y++){const w=L.pw(y);for(const sd of[-1,1])for(let i=0;i<w;i++){const x=sd<0?i:W-1-i,q=i/w,nx=(q-.62)*2.2;let v=.1+.28*Math.max(0,1-nx*nx)+.05*(carNoise(x>>1,y>>1,3)-.5);if(i>=w-2)v=.02;if(i===w-3)v=.42;put(x,y,carPick(R.fabric,v,x,y))}}
 // parlante tweeter en la base de cada paral
 for(const sd of[-1,1]){const cx=sd<0?Math.round(L.pw(dt-8)*.45):W-1-Math.round(L.pw(dt-8)*.45),cy=dt-7,r=Math.max(3,Math.round(L.pw(dt-8)*.32));for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const d=Math.hypot(x,y);if(d>r)continue;put(cx+x,cy+y,carPick(R.plastic,d>r-1?.42:((x+y)&1)?.08:.2,cx+x,cy+y))}}
 // tablero: superficie de arriba, filete y cara
 const th=Math.max(5,Math.round(L.dashH*.15));
 const hoodX0=L.g1-L.gR-8,hoodX1=L.g2+L.gR+8,hoodH=Math.max(7,Math.round(L.dashH*.1));
 for(let y=dt-hoodH-1;y<H;y++)for(let x=0;x<W;x++){
  let inHood=false,hv=0;if(x>=hoodX0&&x<=hoodX1){const u=(x-(hoodX0+hoodX1)/2)/((hoodX1-hoodX0)/2),hh=Math.round(hoodH*Math.sqrt(Math.max(0,1-u*u)));if(y>=dt-hh&&y<dt){inHood=true;hv=.18+.3*(1-(y-(dt-hh))/Math.max(1,hh))*(1-Math.abs(u)*.5)}}
  if(y<dt&&!inHood)continue;let v,ramp=R.plastic;
  if(inHood)v=hv;
  else if(y<dt+th){const q=(y-dt)/th;v=.36-.2*q;
   if(y>=dt+1&&y<=dt+2&&x>W*.18&&x<W*.82&&x%3!==0)v=.03;}
  else if(y<dt+th+2)v=y===dt+th?.5:.32;
  else{v=.13+.06*(carNoise(x>>1,y>>1,4)-.5)-.06*((y-dt)/L.dashH)}
  v+=.04*(carNoise(x,y,5)-.5);
  let col=carPick(ramp,v,x,y);col=carTint(col,glowAt(x,y)*(y>dt?1:.5));put(x,y,col)}
 // sombra de la capota sobre los relojes y biseles cromados
 for(const gx of[L.g1,L.g2]){for(let y=-L.gR-3;y<=L.gR+3;y++)for(let x=-L.gR-3;x<=L.gR+3;x++){const d=Math.hypot(x,y),X=gx+x,Y=L.gY+y;
   if(d<=L.gR-1){const g=.55*(1-d/L.gR);put(X,Y,carPick(R.glow,.05+g*.35+(y<-L.gR*.4?-.05:0),X,Y))}
   else if(d<=L.gR+1.2){const a=Math.atan2(y,x);put(X,Y,carPick(R.chrome,.35+.4*Math.max(0,-Math.sin(a))+.15*Math.cos(a),X,Y))}
   else if(d<=L.gR+3){put(X,Y,carPick(R.plastic,.04,X,Y))}}
  for(let i=0;i<=12;i++){const a=Math.PI*(.75+i*.125),r1=L.gR-2,r0=i%3?L.gR-3:L.gR-4;for(let r=r0;r<=r1;r++)put(Math.round(gx+Math.cos(a)*r),Math.round(L.gY+Math.sin(a)*r),i%3?[60,170,110]:[150,240,190])}}
 // consola central: ventilas con persianas, botón de emergencia, radio de casete
 const S=L.stack,V=L.vents;
 for(let y=S.y0-3;y<H;y++)for(let x=S.x0-2;x<=S.x1+2;x++){const e=x===S.x0-2||x===S.x1+2;put(x,y,carTint(carPick(R.plastic,e?.32:.1,x,y),glowAt(x,y)))}
 const vw=Math.round((S.x1-S.x0-4)/2);for(const vx of[S.x0,S.x0+vw+4])for(let y=V.y;y<V.y+V.h;y++)for(let x=vx;x<vx+vw;x++){const edge=y===V.y||y===V.y+V.h-1||x===vx||x===vx+vw-1;const slat=(y-V.y)%2===0;put(x,y,edge?carPick(R.chrome,.42,x,y):slat?carPick(R.plastic,.3,x,y):R.plastic[0])}
 {const hx=Math.round((S.x0+S.x1)/2),hy=V.y-5;for(let y=0;y<4;y++)for(let x=-y;x<=y;x++)put(hx+x,hy+y,[200,40,40]);put(hx,hy+1,[255,180,160])}
 for(let y=L.ry-2;y<L.ry+16;y++)for(let x=L.rx-2;x<L.rx+L.rw+2;x++){const e=y===L.ry-2||x===L.rx-2||x===L.rx+L.rw+1;put(x,y,e?carPick(R.chrome,.38,x,y):carPick(R.plastic,.06,x,y))}
 for(let y=L.ry;y<L.ry+9;y++)for(let x=L.rx;x<L.rx+L.rw;x++)put(x,y,[4,18,10]);
 for(let i=0;i<5;i++){const bx=L.rx+2+i*Math.round((L.rw-4)/5);for(let y=L.ry+11;y<L.ry+14;y++)for(let x=bx;x<bx+Math.round((L.rw-4)/5)-2;x++)put(x,y,carPick(R.plastic,y===L.ry+11?.45:.22,x,y))}
 // ranura del casete
 for(let x=L.rx+Math.round(L.rw*.2);x<L.rx+Math.round(L.rw*.8);x++)put(x,L.ry+15,R.plastic[0]);
 // guantera
 const gx0=Math.round(W*.73),gy0=dt+th+Math.round(L.dashH*.25);for(let x=gx0;x<W-L.pw(dt)+L.pw(dt);x++){put(x,gy0,R.plastic[0]);put(x,gy0+1,carPick(R.plastic,.28,x,gy0+1))}
 for(let x=gx0+6;x<gx0+16;x++)put(x,gy0+5,carPick(R.chrome,.5,x,gy0+5));
 // retrovisor con soporte; en el espejo: el vidrio de atrás y los apoyacabezas
 const mx=L.mx,my=L.my,mw=L.mw,mh=L.mh;
 for(let y=0;y<my;y++)for(let x=mx-2;x<=mx+2;x++)put(x,y,carPick(R.plastic,x===mx-2?.4:.15,x,y));
 for(let y=my;y<my+mh;y++)for(let x=mx-mw/2;x<mx+mw/2;x++){const X=Math.round(x),cx=Math.abs(x-mx)/(mw/2),cy=(y-my)/mh;if(cx>.96&&(cy<.15||cy>.85))continue;
  const fr=cx>.93||cy<.12||cy>.86;let col;
  if(fr)col=carPick(R.plastic,cy<.12?.5:.2,X,y);
  else{const rw=Math.abs(cy-.42)<.2&&cx<.8;let v=.12+(rw?.22:0)+.05*(1-cx);for(const hx of[-.45,.45]){const d=Math.hypot((x-mx)/(mw/2)-hx,(cy-.62)*1.6);if(d<.28)v=.05}
   col=carPick(R.chrome,v*.55,X,y);col=[col[0]*.7,col[1]*.75,col[2]*.95]}
  put(X,y,col)}
 return B.done()}

// ---------- volante de 3 rayos con costura, manos y mangas ----------
const CWH={};
function carWheel(L,ang){const q=Math.round(ang*24)/24,k=L.wR+'|'+q;if(CWH[k])return CWH[k];const R=L.wR,S=R*2+40,B=carBuf(S,S),cx=S/2,cy=S/2,t=Math.max(5,Math.round(R/8)),RR=CAR_R;
 const sk=(CH.player&&CH.player.skin)||'#d9a066',sh=(CH.player&&CH.player.shirt)||'#3f7fd1',SK=carRampFrom(sk,.9,.8),SH=carRampFrom(sh,1,.6);
 const Lt=[0,-.75,.66];
 // aro
 for(let y=-R-1;y<=R+1;y++)for(let x=-R-1;x<=R+1;x++){const d=Math.hypot(x,y);if(d>R||d<R-t)continue;const nr=((d-(R-t))/t-.5)*2,ph=Math.atan2(y,x),nz=Math.sqrt(Math.max(0,1-nr*nr)),nx=Math.cos(ph)*nr,ny=Math.sin(ph)*nr;
  let v=.16+.62*Math.max(0,nx*Lt[0]+ny*Lt[1]+nz*Lt[2])*(.45+.55*Math.max(0,-Math.sin(ph)));const a=ph-q;
  if(Math.abs(nr)<.2&&Math.sin(a)<-.2&&Math.round((a*R))%3===0)v+=.15;
  B.put(cx+x,cy+y,carPick(RR.leather,v,cx+x,cy+y))}
 // rayos y centro
 for(let y=-R+t;y<=R-t;y++)for(let x=-R+t;x<=R-t;x++){const ca=Math.cos(-q),sa=Math.sin(-q),u=x*ca-y*sa,w=x*sa+y*ca,d=Math.hypot(x,y);
  let on=false,v=0;const pad=Math.hypot(u/(R*.34),(w-R*.04)/(R*.27));
  if(pad<1){on=true;v=.22+.25*(1-pad)-(w>0?.08:0);if(Math.hypot(u/(R*.09),(w+R*.02)/(R*.055))<1)v=.6}
  else if(Math.abs(w-R*.06)<R*.11&&Math.abs(u)<R-t&&Math.abs(u)>R*.3){on=true;v=.16+(w<R*.0?.14:0)}
  else if(Math.abs(u)<R*.12&&w>R*.2&&w<R-t){on=true;v=.12+(u<0?.1:0)}
  if(on)B.put(cx+x,cy+y,carPick(RR.plastic,v,cx+x,cy+y))}
 // manos a las 10 y las 2, con dedos sobre el aro
 for(const ha of[-2.42,-.72]){const a=ha+q,hx=cx+Math.cos(a)*(R-t/2),hy=cy+Math.sin(a)*(R-t/2),hr=Math.max(5,Math.round(R/8.5));
  // manga y antebrazo hacia la orilla de la pantalla
  const ex=hx+(ha<-1.5?-1:1)*R*.9,ey=S,len=Math.hypot(ex-hx,ey-hy),aw=Math.max(5,Math.round(R/6.5));
  for(let i=0;i<len;i++){const tt=i/len,px=hx+(ex-hx)*tt,py=hy+3+(ey-hy)*tt,w=aw*(.8+tt*.5);for(let j=-w;j<=w;j++){const nx=j/w,px2=Math.round(px+j*.9),py2=Math.round(py);const fold=((i+Math.round(j*.3))%9)<1&&tt>.25;
    const skin=tt<.07;const v=.36+.5*Math.sqrt(Math.max(0,1-nx*nx))*(nx<0?1:.65)-(fold?.15:0);B.put(px2,py2,carPick(skin?SK:SH,v,px2,py2))}}
  // puño
  for(let y=-hr-2;y<=hr+2;y++)for(let x=-hr-2;x<=hr+2;x++){const d=Math.hypot(x/(hr+1.2),y/(hr*.95));if(d>1)continue;const nz=Math.sqrt(1-d*d);let v=.42+.5*Math.max(0,-y/hr*.6+nz*.6);
   const knuck=Math.abs(((Math.atan2(y,x)-a+6.283)%1.2))<.12&&d>.6;if(knuck)v-=.18;B.put(Math.round(hx+x),Math.round(hy+y),carPick(SK,v,Math.round(hx+x),Math.round(hy+y)))}
  for(let i=0;i<4;i++){const fa=a+Math.PI+(-.55+i*.37)*(ha<-1.5?1:-1),fx=hx+Math.cos(fa)*(hr*.9),fy=hy+Math.sin(fa)*(hr*.9);for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)if(x*x+y*y<=4)B.put(Math.round(fx+x),Math.round(fy+y),carPick(SK,.62-(y>0?.15:0),Math.round(fx+x),Math.round(fy+y)))}}
 return CWH[k]=B.done()}

// ---------- Ariana dormida en el asiento del copiloto ----------
const CARI={};
function carAri(fr,awake){const k=fr+'|'+(awake?1:0);if(CARI[k])return CARI[k];const ch=CH.ariana||{skin:'#c68e5e',hairColor:'#2a1810',shirt:'#e85d75',accColor:'#f5c542'};
 const W=92,H=128,B=carBuf(W,H),put=B.put,SK=carRampFrom(ch.skin,.95,.7),HR=carRampFrom(ch.hairColor,.9,2.2),SH=carRampFrom(ch.shirt,1,.5),SEAT=CAR_R.seat,BELT=carRampFrom('#4a4a52',1,.6);
 const br=fr?1:0,tilt=.32,hcx=44,hcy=38,cs=Math.cos(tilt),sn=Math.sin(tilt);
 const rot=(x,y)=>[(x-hcx)*cs+(y-hcy)*sn,-(x-hcx)*sn+(y-hcy)*cs];
 const light=(nx,ny,nz)=>{const key=Math.max(0,-.55*nx+.6*ny+.58*nz),rim=Math.max(0,.8*nx-.3*ny+.5*nz);return{v:.3+key*.5+rim*rim*.45,g:key*.18}};
 // apoyacabezas y respaldo del asiento
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const hd=Math.hypot((x-66)/20,(y-22)/18),bk=x>40&&y>40&&x<W;if(hd<1||bk&&((x-90)/52)**2+((y-130)/92)**2<1){const v=.12+.18*(hd<1?1-hd:.5)*(x>60?1:.6);put(x,y,carPick(SEAT,v,x,y))}}
 // pelo de atrás, largo, cayendo sobre el hombro
 for(let y=6;y<H;y++)for(let x=8;x<W;x++){const[u,v]=rot(x,y);const back=(u/23)**2+((v+2)/25)**2<1,fall=v>6&&u>-14-v*.12&&u<22+v*.05&&v<78;if(!back&&!fall)continue;
  const sheen=.5+.5*Math.sin(u*.55+v*.08),nz=back?Math.sqrt(Math.max(0,1-(u/23)**2-((v+2)/25)**2)):.5;const L=light(u/23,0,nz);let val=.08+L.v*.45+.12*sheen*(v<10?1:.5);if((Math.round(u+v*.15)%5)===0)val-=.06;
  put(x,y,carTint(carPick(HR,val,x,y),L.g*.5))}
 // cuello y hombros con la blusa
 for(let y=52;y<H;y++)for(let x=10;x<W-4;x++){const sh=((x-50)/44)**2+((y-92-br)/40)**2<1&&y>62+br,nk=Math.abs(x-46)<7&&y<70&&y>50;if(!sh&&!nk)continue;
  if(nk){const L=light((x-46)/7,.3,.8);put(x,y,carTint(carPick(SK,L.v*.75,x,y),L.g))}else{const nx=(x-50)/44,L=light(nx,-.2,Math.sqrt(Math.max(0,1-nx*nx)));put(x,y,carTint(carPick(SH,L.v*.8+((x+y)%7===0?-.05:0),x,y),L.g))}}
 // cinturón de seguridad en diagonal
 for(let y=56;y<H;y++){const cx=82-(y-56)*.62;for(let x=Math.round(cx-4);x<=Math.round(cx+4);x++){const e=x===Math.round(cx-4)||x===Math.round(cx+4);put(x,y+br,carPick(BELT,e?.5:.25+((y>>1)&1?.04:0),x,y+br))}}
 // cobija de cuadros sobre las piernas, con pliegues
 for(let y=104;y<H;y++)for(let x=6;x<W;x++){const fold=Math.sin(x*.18+y*.05)*.5+.5,k=((x>>2)+(y>>2))%2;let col=k?[120,26,38]:[26,36,82];if(x%4===0||y%4===0)col=[176,148,60];const v=.35+.4*fold;put(x,y+br,carTint([col[0]*v,col[1]*v,col[2]*v],.15))}
 // cara (3/4, ladeada contra la ventana)
 for(let y=10;y<66;y++)for(let x=16;x<72;x++){const[u,v]=rot(x,y);const e=(u/13)**2+((v-4)/17)**2;if(e>=1)continue;const nz=Math.sqrt(1-e),L=light(u/13,(v-4)/17,nz);let val=L.v*.95;
  if(u>7)val*=.75;let col=carPick(SK,val,x,y);
  // ojos cerrados (pestañas) o abiertos
  for(const[ex,ew]of[[-5.5,4],[4.5,3]]){if(Math.abs(u-ex)<ew&&Math.abs(v-1)<2.2){if(awake){const d=Math.hypot((u-ex)/ew,(v-1)/2);col=d<.45?[20,12,10]:d<1?[232,222,210]:col;if(Math.abs(v+1.2)<.6&&d<1.2)col=[20,14,16]}else{if(Math.abs(v-1.4-(u-ex)**2*.07)<.75)col=[22,12,14];else if(Math.abs(v-2.6)<.5&&Math.abs(u-ex)<ew*.8&&((Math.round(u*2))&1))col=[60,34,32]}}
   if(Math.abs(u-ex)<ew*.9&&Math.abs(v+3.6+(u-ex)**2*.05)<.6)col=carPick(HR,.15,x,y)}
  if(u>-.5&&u<1.2&&v>2&&v<9)col=carPick(SK,val*.62,x,y);if(Math.abs(v-9)<.6&&u>-3&&u<1)col=carPick(SK,val*.55,x,y);
  if(Math.abs(v-12.6)<1.1&&Math.abs(u+1)<3.6)col=awake?[60,14,22]:(v<12.6?[150,62,72]:[178,90,96]);if(Math.abs(v-12.6)<.4&&Math.abs(u+1)<3.8&&!awake)col=[90,30,38];if(awake&&Math.abs(v-13.2)<1.1&&Math.abs(u+1)<2.2)col=[40,8,14];
  if(Math.abs(u+8)<2.5&&Math.abs(v-7)<1.5)col=[col[0]*1.05+12,col[1]*.92,col[2]*.92];
  put(x,y,carTint(col,L.g*.8))}
 // flequillo y mechones sobre la cara
 for(let y=6;y<60;y++)for(let x=14;x<74;x++){const[u,v]=rot(x,y);const fringe=v<-6+Math.sin(u*.5)*1.5&&(u/14)**2+((v+1)/22)**2<1.15,lock=u>8&&u<14&&v>-8&&v<30;if(!fringe&&!lock)continue;
  const val=.12+.3*Math.max(0,Math.sin(u*.8+v*.2));put(x,y,carPick(HR,val+(lock&&u>11?.1:0),x,y))}
 // arete de argolla
 {const[ax,ay]=[hcx+Math.round(13*cs),hcy+Math.round(13*sn)+6];[[0,-3],[1,-3],[-1,-2],[2,-2],[-1,-1],[2,-1],[-1,0],[2,0],[0,1],[1,1]].forEach(([dx,dy],i)=>put(ax+dx,ay+dy,i<2?[255,236,160]:[214,166,52]))}
 // contorno suave
 const c=B.done();return CARI[k]=pOut(c,'#060508')}

// ---------- dibujo dinámico de la cabina del carro ----------
function carDraw(g){const p=PRO,L=p.L,W=p.W,H=p.H,dt=L.dashTop;if(p.mona||p.broken)monaWorld(g);
 // reflejos en el vidrio: banda del tablero, brillo diagonal y el reflejo de Ariana
 g.save();g.beginPath();g.rect(0,L.roof,W,dt-L.roof);g.clip();
 g.globalAlpha=.07;g.fillStyle='#7fe0a8';for(const gx of[L.g1,L.g2]){g.fillRect(gx-L.gR,dt-14,L.gR*2,3)}g.fillRect(L.rx,dt-9,L.rw,2);
 g.globalAlpha=.035;g.fillStyle='#c8d8ff';const sh=p.steer*6;for(let i=0;i<34;i++){g.fillRect(Math.round(W*.2+i*1.4+sh),L.roof+12+i*5,Math.round(W*.12),2)}
 
 // gotas con refracción y rastro
 const hol=p.broken&&p.mona&&p.mona.hole;for(const d of p.drops){const x=Math.round(d.x),y=Math.round(d.y);if(hol&&((x-hol[0])/hol[2])**2+((y-hol[1])/hol[3])**2<1)continue;if(d.vy>0){g.fillStyle='rgba(190,210,240,.18)';g.fillRect(x,y-6,1,6)}
  g.fillStyle='rgba(10,14,24,.55)';g.fillRect(x,y+d.s,d.s,1);g.fillRect(x+d.s,y,1,d.s);g.fillStyle=p.raro?'rgba(200,170,230,.5)':'rgba(170,190,225,.42)';g.fillRect(x,y,d.s,d.s);g.fillStyle='rgba(255,255,255,.9)';g.fillRect(x,y,1,1)}
 // plumillas: brazo metálico y hule
 const a=.07*Math.PI+p.wipA*.82*Math.PI;for(const[px,py]of L.wp){const tx=px+Math.cos(a)*L.wl,ty=py-Math.sin(a)*L.wl,mx=px+Math.cos(a)*L.wl*.18,my=py-Math.sin(a)*L.wl*.18;
  pLine(g,px,py,mx,my,'#121217',2);pLine(g,mx,my,tx,ty,'#050507',3);pLine(g,mx+Math.sin(a),my+Math.cos(a)-1,tx+Math.sin(a),ty+Math.cos(a)-1,'#3a3a46',1)}
 g.restore();
 // Ariana en el asiento (por debajo del tablero no se ve)
 const ari=carAri(Math.sin(p.t*1.4)>0?1:0,p.ariAwake),as=H>W?1:.7,aw=Math.round(ari.width*as),ah=Math.round(ari.height*as),ax=W-aw+Math.round(aw*.12),ay=dt-Math.round(ah*.78);
 g.save();g.beginPath();g.rect(0,0,W,dt);g.clip();g.drawImage(pDim(ari,(p.hlK!=null&&p.hlK<.5?.5:.28)+(p.raro?.1:0),'#05060c'),ax,ay,aw,ah);g.restore();
 for(const[px,py]of L.wp){g.fillStyle='#08080b';g.fillRect(px-2,py-1,5,3);g.fillStyle='#3a3a46';g.fillRect(px-1,py-1,2,1)}
 g.drawImage(p.cab,0,0);
 {const gx0=Math.round(L.mx-L.mw/2+3),gy0=L.my+2,gw=L.mw-6,gh=L.mh-4,ar=carAri(Math.sin(p.t*1.4)>0?1:0,p.ariAwake),dh=Math.round(gh*1.25),dw=Math.round(dh*62/56);
  g.save();g.beginPath();g.rect(gx0,gy0,gw,gh);g.clip();g.translate(Math.round(gx0+gw*.74+dw/2),Math.round(gy0-gh*.08));g.scale(-1,1);g.drawImage(pDim(ar,.22,'#06070e'),14,8,62,56,0,0,dw,dh);g.restore();
  g.fillStyle='rgba(60,80,130,.12)';g.fillRect(gx0,gy0,gw,gh);g.fillStyle='rgba(200,215,255,.12)';for(let i=0;i<gh;i++)g.fillRect(gx0+Math.round(gw*.18)+i,gy0+i,2,1);
  if(p.mona&&p.mona.mir>0&&PSP.muj){const im=PSP.muj[1],sh=Math.round(gh*1.5),sw=Math.round(sh*30/28);g.save();g.beginPath();g.rect(gx0,gy0,gw,gh);g.clip();g.drawImage(im,11,6,30,28,Math.round(gx0+gw*.3-sw/2),gy0-1,sw,sh);g.restore();proGlow(g,gx0+gw*.3,gy0+gh*.45,6,'#c8d0e0',.2)}
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(gx0,gy0+gh-1,gw,1)}
 // rosario y pinito colgando del retrovisor
 const sw=Math.sin(p.t*1.9)*.18-p.steer*.35+proCurve(p.pos)*40,px0=L.mx,py0=L.my+Math.max(11,Math.round(H*.032));
 for(let i=0;i<14;i++){const tt=i/13,bx=px0-4+Math.sin(sw)*(i*1.2)+Math.sin(tt*3.14)*-3,by=py0+i*1.4;g.fillStyle=i%4===3?'#d8c890':'#6a4a8a';g.fillRect(Math.round(bx),Math.round(by),1,1)}
 {const bx=Math.round(px0-4+Math.sin(sw)*17),by=py0+19;g.fillStyle='#d8c890';g.fillRect(bx,by,1,4);g.fillRect(bx-1,by+1,3,1)}
 const pino=PSP.pino;pLine(g,px0+2,py0,px0+2+Math.sin(sw)*6,py0+6,'#d9d3c4',1);
 for(let r=0;r<pino.height;r++){const off=Math.round(Math.sin(sw)*(6+r));g.drawImage(pDim(pino,.3,'#05060c'),0,r,pino.width,1,px0-3+off,py0+6+r,pino.width,1)}
 // agujas de los relojes
 const kmh=p.spd*3.6,ang1=Math.PI*(.75+Math.min(1,kmh/180)*1.5),ang2=Math.PI*(.75+Math.min(1,.35+p.temp*.65)*1.5);
 for(const[gx,an,c]of[[L.g1,ang1,'#ff7040'],[L.g2,ang2,p.temp>.75?'#ff2a2a':'#ff7040']]){pLine(g,gx,L.gY,gx+Math.cos(an)*(L.gR-3),L.gY+Math.sin(an)*(L.gR-3),c,1);proGlow(g,gx+Math.cos(an)*(L.gR-5),L.gY+Math.sin(an)*(L.gR-5),3,'#ff7040',.25);g.fillStyle='#c8c8d8';g.fillRect(gx,L.gY,1,1)}
 if(p.warn&&Math.floor(p.t*3)%2===0){const wx=L.g1-L.gR-6,wy=L.gY+L.gR+3;g.fillStyle='#ff2a2a';g.fillRect(wx-3,wy,6,4);g.fillStyle='#200404';g.fillRect(wx,wy,1,2);g.fillRect(wx,wy+3,1,1);proGlow(g,wx,wy+2,6,'#ff2a2a',.6)}
 const clk=p.raro&&Math.floor(p.t*2)%3===0?'3:33':proClock();{const cw=clk.length*4+3;g.fillStyle='#03100a';g.fillRect(Math.round(L.wx-cw/2),L.gY+L.gR+3,cw,7);cText(g,clk,L.wx,L.gY+L.gR+4,5,p.raro?'#ff5aa0':'#5cff9a')}
 let rt=p.mus&&p.mus.id==='bolero'?'AM 610':'AM 610';if(p.raro)rt=p.radioTxt==='FRENESE MAE'?('FRENESE MAE   '.repeat(3)).substr(Math.floor(p.t*6)%14,Math.floor(L.rw/4)):(Math.random()<.3?'3:33':'- - -');
 if(p.mona&&p.mona.st!=='gone')rt=Math.floor(p.t*2.5)%2?'NO PARE':'';
 cText(g,rt,L.rx+L.rw/2,L.ry+2,5,p.raro||p.mona&&p.mona.st!=='gone'?'#ff5aa0':'#5cff9a');
 // retrovisor: a veces hay alguien atrás
 if(p.mirror>0&&Math.sin(p.t*30)>-.6){const mx=L.mx-L.mw*.18,my=L.my+4;proPx(g,'#c8102e',mx-3,my,7,2);proPx(g,'#e8b88a',mx-2,my+2,5,3);proPx(g,'#1d1a24',mx-1,my+3,1,1);proPx(g,'#1d1a24',mx+1,my+3,1,1)}
 const wh=carWheel(L,p.steer*.55);g.drawImage(wh,L.wx-wh.width/2,L.wy-wh.height/2);if(p.mona)monaFront(g)}

