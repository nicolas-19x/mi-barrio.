// ================= LA MONA · arte a resolución nativa =================
// Se dibuja píxel por píxel: relieve de la cara, luz que sube del capó mojado (cálida) y luz de luna (fría),
// todo reducido a paletas cortas con tramado ordenado para que se vea pixel art de verdad.
const MONA_RAMPS=(()=>{const R={
 furC:['#060509','#0d0b13','#17141f','#231f2e','#332d41','#463e57','#5e5572','#7a7090'],
 furW:['#080606','#120d0c','#1e1613','#2d201b','#3f2d24','#553c2e','#6e4f3b','#8b654a'],
 skinC:['#0b090d','#17131a','#26202a','#38303b','#4d434e','#655962','#81747b','#a39499'],
 skinW:['#100a08','#1f1410','#331f18','#4a2d22','#633e2e','#7f523c','#9e6a4e','#c08766'],
 scab:['#1a0c0c','#34161a','#4e2228','#6a3236','#86484a','#a26260','#be8078','#d8a090'],
 hair:['#020203','#06050a','#0c0a12','#14111c','#1e1a2a','#2b263c','#3c3654','#524b70'],
 tooth:['#140f07','#2e2412','#4f4124','#776640','#9e8d60','#c2b384','#ddd2a6','#f4edcc'],
 gum:['#080103','#170408','#2c0810','#460e1a','#621826','#7e2634','#9a3a46','#b8545e'],
 ember:['#140200','#3c0a00','#701a00','#a63204','#d6560c','#f4861e','#ffbc4a','#fff2b4'],
 scl:['#1c1410','#382a20','#5a4634','#7c644c','#9a8266','#b49e80','#ccb89a','#e2d2b4'],
 claw:['#010102','#060509','#0e0c13','#18151f','#24202e','#332e40','#474056','#625a74'],
 pad:['#1e1412','#3a2620','#5a3c32','#7a5446','#986c5a','#b48a74','#cea890','#e6c6aa']};
 const o={};for(const k in R)o[k]=R[k].map(h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]});return o})();
const MBAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
function monaArt(W,H,o){
 const c=mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),D=img.data,s=o.s,HX=o.hx,HY=o.hy,open=o.open||0,seed=o.seed||7,rng=pRng(seed*31+5);
 const kb=o.kb==null?1:o.kb,kt=o.kt==null?1:o.kt,red=o.red||0;
 const hash=(x,y)=>{const v=Math.sin(x*127.1+y*311.7+seed*17.3)*43758.5453;return v-Math.floor(v)};
 const vn=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,a=hash(ix,iy),b=hash(ix+1,iy),cc=hash(ix,iy+1),d=hash(ix+1,iy+1),ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);return a+(b-a)*ux+(cc-a)*uy+(a-b-cc+d)*ux*uy};
 const fbm=(x,y)=>vn(x,y)*.55+vn(x*2.13,y*2.13)*.3+vn(x*4.37,y*4.37)*.15;
 const RP=MONA_RAMPS;
 const pick=(ramp,v,x,y)=>{const n=ramp.length;let i=Math.round(v*(n-1)+MBAYER[(y&3)*4+(x&3)]-.5);return ramp[i<0?0:i>n-1?n-1:i]};
 const put=(x,y,rgb,a)=>{if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*4;if(a==null||a>=1){D[i]=rgb[0];D[i+1]=rgb[1];D[i+2]=rgb[2];D[i+3]=255}else{const b=1-a;D[i]=D[i]*b+rgb[0]*a;D[i+1]=D[i+1]*b+rgb[1]*a;D[i+2]=D[i+2]*b+rgb[2]*a;D[i+3]=Math.max(D[i+3],a*255)}};
 const U=x=>(x-HX)/s,V=y=>(y-HY)/s,X=u=>Math.round(HX+u*s),Y=v=>Math.round(HY+v*s);
 const Lb=[0,.72,.69],Lt=(()=>{const a=[-.55,-.72,.42],l=Math.hypot(...a);return a.map(v=>v/l)})();
 const light=(nx,ny,nz,amb)=>{const key=Math.max(0,nx*Lb[0]+ny*Lb[1]+nz*Lb[2])*kb,rim=Math.max(0,nx*Lt[0]+ny*Lt[1]+nz*Lt[2])*kt;return{v:(amb==null?.08:amb)+key*.78+rim*rim*.62,warm:key>rim*rim*.9}};
 const shadeMat=(mat,v,warm,x,y)=>{const r=mat==='hair'?RP.hair:mat==='fur'?(warm?RP.furW:RP.furC):mat==='skin'?(warm?RP.skinW:RP.skinC):RP[mat];let col=pick(r,Math.max(0,Math.min(1,v)),x,y);if(red>0){col=[Math.min(255,col[0]+red*70),col[1]*(1-red*.35),col[2]*(1-red*.4)]}return col};
 const ell=(u,v,cx,cy,rx,ry)=>{const dx=(u-cx)/rx,dy=(v-cy)/ry,d=dx*dx+dy*dy;return d<1?Math.sqrt(1-d):-1};

 const only=o.only;
 // ---------- cuerpo encorvado (hombros) ----------
 if(!only)for(let y=Y(40);y<H;y++)for(let x=X(-110);x<=X(110);x++){const u=U(x),v=V(y);
  let k=ell(u,v,0,104,72,46),k2=Math.max(ell(u,v,-44,76,30,26),ell(u,v,44,76,30,26));k=Math.max(k,k2);if(k<0)continue;
  const nx=(u)/90*(1-k)*1.4,ny=(v-90)/50*(1-k),nz=k;const L=light(nx,ny,nz,.04);const tex=.55+.7*fbm(u*.3,v*.07);put(x,y,shadeMat('fur',L.v*tex*.5,L.warm,x,y))}

 // ---------- brazos flacos que suben a las manos ----------
 const hands=o.hands||[[-66,20],[66,20]];
 const cap=(u,v,ax,ay,bx,by,r0,r1)=>{const vx=bx-ax,vy=by-ay,l2=vx*vx+vy*vy;let t=((u-ax)*vx+(v-ay)*vy)/l2;t=t<0?0:t>1?1:t;const px=ax+vx*t,py=ay+vy*t,d=Math.hypot(u-px,v-py),r=r0+(r1-r0)*t;return d<r?{t,d,r,ox:(u-px)/r,oy:(v-py)/r}:null};
 if(!only)for(const[hu,hv]of hands){const sd=Math.sign(hu),ax=sd*58,ay=118,bx=hu+sd*2,by=hv+12;
  for(let y=Y(hv);y<H;y++)for(let x=X(Math.min(ax,bx)-12);x<=X(Math.max(ax,bx)+12);x++){const u=U(x),v=V(y),q=cap(u,v,ax,ay,bx,by,10,6.5);if(!q)continue;
   const nz=Math.sqrt(Math.max(0,1-q.ox*q.ox-q.oy*q.oy));const L=light(q.ox,q.oy,nz,.05);const tex=.6+.6*fbm(u*.5+q.t*3,v*.15);
   const sinew=Math.abs(q.ox)<.18?1.15:1;put(x,y,shadeMat(q.t<.35&&fbm(u*.4,v*.4)>.45?'skin':'fur',L.v*tex*sinew*.9,L.warm,x,y))}}

 // ---------- cabeza: relieve ----------
 const headH=(u,v)=>{let h=-1,k;
  if((k=ell(u,v,0,-13,44,50))>=0)h=Math.max(h,k*40);
  if((k=ell(u,v,0,20,37,30))>=0)h=Math.max(h,k*35);
  for(const sx of[-26,26])if((k=ell(u,v,sx,3,16,13))>=0)h=Math.max(h,29+k*8);
  if((k=ell(u,v,0,23,26,21))>=0)h=Math.max(h,31+k*13);
  if(h<0)return-1;
  if(Math.abs(u)<39&&v>-26&&v<-8){const t=1-Math.abs(v+17)/9,w=1-(u/39)*(u/39);if(t>0)h+=8*t*w}
  for(const sx of[-17,17])if((k=ell(u,v,sx,-3,13,10))>=0)h-=13*k;
  for(const sx of[-27,27])if((k=ell(u,v,sx,18,9,11))>=0)h-=7*k;
  if((k=ell(u,v,0,9,7,7))>=0)h+=3*k;
  return h};
 // forma de la boca
 const mouthY=u=>31-10*(u/35)*(u/35),mouthH=u=>{const q=1-(u/35)*(u/35);return q<=0?0:1.1+open*13*Math.pow(q,.7)};
 const toothN=u=>Math.floor((u+36)/3.6);
 const tRand=i=>hash(i*7.3,3.1);
 const inEye=(u,v)=>{for(const sx of[-17,17]){const dx=(u-sx)/7.8,lid=1-dx*dx;if(lid<=0)continue;const dy=v+3;const top=-5.4*Math.pow(lid,.55),bot=4.4*Math.pow(lid,.7);if(dy>top&&dy<bot)return{sx,dx,dy,top,bot}}return null};
 const bx0=X(-52),bx1=X(52),by0=Y(-66),by1=Y(56);
 const HB=new Float32Array((bx1-bx0+3)*(by1-by0+3)).fill(-1),HW=bx1-bx0+3;
 for(let y=by0-1;y<=by1+1;y++)for(let x=bx0-1;x<=bx1+1;x++)HB[(y-by0+1)*HW+(x-bx0+1)]=headH(U(x),V(y));
 const hb=(x,y)=>{if(x<bx0-1||x>bx1+1||y<by0-1||y>by1+1)return-1;return HB[(y-by0+1)*HW+(x-bx0+1)]};
 // orejas (detrás)
 if(!only){for(const sx of[-46,46])for(let y=Y(-18);y<=Y(12);y++)for(let x=X(sx-9);x<=X(sx+9);x++){const u=U(x),v=V(y),k=ell(u,v,sx,-3,7.5,12);if(k<0)continue;const inner=ell(u,v,sx-Math.sign(sx)*1.5,-2,4,8)>=0;
  const L=light((u-sx)/7.5,(v+3)/12,k,.06);put(x,y,shadeMat(inner?'scab':'skin',L.v*(inner?.55:.9),L.warm,x,y))}
 for(let y=by0;y<=by1;y++)for(let x=bx0;x<=bx1;x++){const h=hb(x,y);if(h<0)continue;const u=U(x),v=V(y);
  const hl=hb(x-1,y),hr=hb(x+1,y),hu=hb(x,y-1),hd=hb(x,y+1);const dX=((hr<0?h-6:hr)-(hl<0?h-6:hl))/(2*s)*1/1,dY=((hd<0?h-6:hd)-(hu<0?h-6:hu))/(2*s);
  let nx=-dX,ny=-dY,nz=1.25;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
  const L=light(nx,ny,nz,.07);let v0=L.v,mat='fur';
  {let ao=0,k;for(const sx of[-17,17])if((k=ell(u,v,sx,-3,14,11))>=0)ao=Math.max(ao,k);for(const sx of[-27,27])if((k=ell(u,v,sx,18,10,12))>=0)ao=Math.max(ao,k*.6);if(Math.abs(u)<39&&v>-12&&v<-6)ao=Math.max(ao,.5*(1-(u/39)**2));v0*=1-.78*ao}
  const face=((u/31)*(u/31)+((v-10)/37)*((v-10)/37)<1)&&v>-29;
  if(face){mat='skin';
   // arrugas de la frente, bolsas de los ojos, surcos de la nariz a la boca
   if(v>-30&&v<-19&&((v+30)%3.4)<.8&&vn(u*.25,v)>.3)v0*=.55;
   for(const sx of[-17,17]){const d=((u-sx)/12)**2+((v-7)/5.5)**2;if(d>.7&&d<1&&v>4)v0*=.6}
   for(const sd of[-1,1]){const ax=sd*7,ay=14,bx=sd*29,by=27,t=((u-ax)*(bx-ax)+(v-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2);if(t>0&&t<1){const px=ax+(bx-ax)*t,py=ay+(by-ay)*t;if(Math.hypot(u-px,v-py)<.9)v0*=.5}}
   v0*=.9+.25*fbm(u*.6,v*.6);
   if(fbm(u*.18+3,v*.18)>.76&&Math.abs(u)>14){mat='scab';v0*=.7}
   const fr=(u/31)**2+((v-10)/37)**2;if(fr>.72){mat='fur';v0*=.5+.6*fbm(u*.4,v*.12)}}
  else{mat='hair';v0=(.12+.5*Math.max(0,Math.sin(u*1.1+fbm(u*.2,v*.05)*6)))*(.35+.65*(L.v))+(ny<-.3?.12*kt:0)}
  // fosas nasales
  for(const sd of[-1,1]){const d=((u-sd*5.5)/2.5)**2+((v-12.5)/4.2)**2;if(d<1){v0=.03*(1-d);mat='skin'}else if(d<1.6&&v<12)v0*=1.15}
  let col=shadeMat(mat,v0,L.warm,x,y);
  // ojos
  const E=inEye(u,v);if(E){const ex=u-E.sx,ey=v+3,ir=Math.hypot(ex,ey-.3);
   if(ir<1.15)col=[6,2,2];
   else if(ir<4.5){const vv=1-(ir-1.15)/3.35*.75+(ey<-1?.15:0);col=pick(RP.ember,Math.min(1,vv),x,y)}
   else{const vein=fbm(u*1.6,v*1.6)>.62&&Math.abs(E.dx)>.5;col=vein?pick(RP.gum,.6,x,y):pick(RP.scl,.45+.25*(1-Math.abs(E.dx))-(ey<0?.15:0),x,y)}
   if(ey-E.top<1.1)col=pick(RP.claw,.15,x,y);if(E.bot-ey<.8)col=pick(RP.skinW,.18,x,y)
   if(Math.abs(ex+1.6)<.6&&Math.abs(ey+1.8)<.6)col=[255,250,226]}
  // boca
  const my=mouthY(u),mh=mouthH(u);if(mh>0&&Math.abs(v-my)<mh+.9){const dv=v-my;
   if(Math.abs(dv)>mh)col=pick(RP.gum,.12,x,y);
   else{const top=-mh,bot=mh,ti=toothN(u),tr=tRand(ti),gap=((u+36)%3.6)<.55;const canine=Math.abs(Math.abs(u)-12)<2;
    const tl=(2.2+tr*2.6+open*2.4)*(canine?1.6:1),bl=(1.8+tRand(ti+40)*2.2+open*2)*(canine?1.4:1),gum=open>.25?1.3+open*1.4:0;
    const miss=tr>.86;
    if(dv<top+gum)col=pick(RP.gum,.45+.2*(dv-top)/Math.max(.5,gum),x,y);
    else if(dv<top+gum+tl&&!gap&&!miss){const tt=(dv-top-gum)/tl;col=pick(RP.tooth,(.85-tt*.45)*(tr<.2?.7:1)-(canine&&tt>.7?.1:0),x,y)}
    else if(dv>bot-bl&&!gap&&tRand(ti+40)<.9){const tt=(bot-dv)/bl;col=pick(RP.tooth,.75-tt*.4,x,y)}
    else if(dv>bot-bl-1.2&&open>.3)col=pick(RP.gum,.4,x,y);
    else col=pick(RP.gum,.05+(open>.4&&dv>mh*.35?.28:0),x,y)}}
  put(x,y,col)}}

 // ---------- pelo largo y mojado ----------
 const strands=[];for(let i=0;i<64;i++){const a=-Math.PI*(.06+.88*(i/63))+(rng()-.5)*.09,sx=Math.cos(a)*41,sy=-15+Math.sin(a)*47,side=Math.cos(a)<-.12?-1:Math.cos(a)>.12?1:0;
  const len=70+rng()*90,ph=rng()*6,clump=Math.floor(i/3);strands.push({sx,sy,side,len,ph,clump,face:side===0&&rng()<.3,w:rng()<.3?2.2:1.5})}
 const sx0=o.strandFace==null?1:o.strandFace;
 if(!only)for(const st of strands){let px=st.sx,py=st.sy;const sd=st.side||(st.sx<0?-1:1);
  for(let k=0;k<st.len;k+=.6){let x=st.sx+sd*(k<20?k*.55:11+(k-20)*.18)+Math.sin(k*.07+st.ph)*2.4+(st.side===0?sd*k*.08:0),y=st.sy+k*1.02;
   if(st.face&&st.side===0){if(!sx0)break;x=st.sx+Math.sin(k*.09+st.ph)*4+Math.sin(k*.23+st.ph*2)*1.4+sd*k*.12;if(k>70+st.ph*4)break}
   const face=((x/31)**2+((y-10)/37)**2<1)&&y>-29;if(face&&!st.face)continue;
   const xx=X(x),yy=Y(y),lit=.16+.42*Math.max(0,Math.sin(k*.11+st.ph))+.32*Math.min(1,k/120)*kb+(k<12?.18*kt:0);
   const r=Math.max(1,Math.round(st.w*s*.6));for(let dy=0;dy<r;dy++)for(let dx=0;dx<r;dx++)put(xx+dx,yy+dy,pick(RP.hair,Math.min(1,lit+(dx===0?.08:0)),xx+dx,yy+dy))}}

 // ---------- manos pegadas al vidrio ----------
 const claws=[];
 for(const[hu,hv]of hands){const sd=Math.sign(hu);const fingers=[[-104,40],[-84,44],[-64,41],[-44,33]].map(([a,l])=>[(sd>0?a:-180-a)*Math.PI/180,l]);
  fingers.push([(sd>0?-150:-30)*Math.PI/180,25]);
  const segs=[];fingers.forEach(([a,l],fi)=>{let x=hu+Math.cos(a)*8,y=hv+Math.sin(a)*8,aa=a;const n=3,pts=[[x,y]];for(let k=0;k<n;k++){const sl=l/n*(k===0?1.1:k===1?.95:.95);aa+=sd*(k?.16:.05)*(fi===4?-1:1);x+=Math.cos(aa)*sl;y+=Math.sin(aa)*sl;pts.push([x,y])}
   for(let k=0;k<n;k++)segs.push({ax:pts[k][0],ay:pts[k][1],bx:pts[k+1][0],by:pts[k+1][1],r0:k===0?3.1:k===1?2.6:2.3,r1:k===0?2.7:k===1?2.4:2.0,tip:k===n-1});
   const ca=aa+sd*.55*(fi===4?-1:1),ex=pts[n][0],ey=pts[n][1];claws.push({x0:ex+Math.cos(aa)*1.2,y0:ey+Math.sin(aa)*1.2,xm:ex+Math.cos(aa)*6,ym:ey+Math.sin(aa)*6,x1:ex+Math.cos(aa)*7+Math.cos(ca)*7,y1:ey+Math.sin(aa)*7+Math.sin(ca)*7,a:aa})});
  const bb=[hu-58,hv-58,hu+58,hv+20];
  for(let y=Y(bb[1]);y<=Y(bb[3]);y++)for(let x=X(bb[0]);x<=X(bb[2]);x++){const u=U(x),v=V(y);let best=null;
   const pk=ell(u,v,hu,hv+2,11,12);if(pk>=0)best={nx:(u-hu)/11*.6,ny:(v-hv)/12*.6,nz:pk,mat:'skin',crease:Math.abs((v-hv)-3.5+(u-hu)*.25)<.45&&Math.abs(u-hu)<8,pad:pk>.6};
   for(const f of segs){const q=cap(u,v,f.ax,f.ay,f.bx,f.by,f.r0,f.r1);if(!q)continue;const nz=Math.sqrt(Math.max(0,1-q.ox*q.ox-q.oy*q.oy));
    best={nx:q.ox,ny:q.oy,nz,mat:'skin',crease:q.t<.07,pad:f.tip&&q.t>.55,knob:q.t<.18}}
   if(!best)continue;const L=light(best.nx,best.ny,best.nz,.06);let vv=L.v*(.7+.35*fbm(u*.9,v*.9))*.62;if(best.crease)vv*=.4;if(best.knob)vv*=1.12;
   put(x,y,best.pad?pick(RP.pad,Math.min(1,vv*.7+.04),x,y):shadeMat(fbm(u*.3+5,v*.3)>.62?'scab':'skin',vv,L.warm,x,y))}}
 // garras
 for(const cl of claws){const n=18;for(let i=0;i<=n;i++){const t=i/n,mx=cl.xm==null?(cl.x0+cl.x1)/2:cl.xm,my=cl.ym==null?(cl.y0+cl.y1)/2:cl.ym,x=(1-t)*(1-t)*cl.x0+2*(1-t)*t*mx+t*t*cl.x1,y=(1-t)*(1-t)*cl.y0+2*(1-t)*t*my+t*t*cl.y1,w=(1-t)*2.5+.35;const xx=X(x),yy=Y(y),r=Math.max(1,Math.round(w*s*.55));
  for(let dy=-r+1;dy<r;dy++)for(let dx=-r+1;dx<r;dx++)put(xx+dx,yy+dy,pick(RP.claw,.25+(dx<0&&dy<0?.45:0)+t*.15,xx+dx,yy+dy))}}

 // ---------- el vidrio: vaho del aliento, huellas empañadas ----------
 const fog=o.fog==null?.8:o.fog;
 const fogAt=(x,y)=>{const u=U(x),v=V(y);let a=0;const d=((u/(34+open*6))**2+((v-(48+open*8))/(15+open*3))**2);if(d<1)a=Math.max(a,(1-d)*fog*(.55+.35*vn(u*.2,v*.2)));
  for(const[hu,hv]of hands){const e=((u-hu)/20)**2+((v-hv+6)/20)**2;if(e<1&&e>.45)a=Math.max(a,(1-e)*.5*fog)}return a};
 if(!only)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const a=fogAt(x,y);if(a<=.02)continue;if(MBAYER[(y&3)*4+(x&3)]<a*1.1)put(x,y,[196,210,228],.3)}
 g.putImageData(img,0,0);
 // babas
 if(!only&&open>.35){g.fillStyle='rgba(214,224,236,.75)';for(const u0 of[-22,-6,9,20]){const x=X(u0),y0=Y(mouthY(u0)-mouthH(u0)+3),y1=Y(mouthY(u0)+mouthH(u0)-2);if(y1>y0)g.fillRect(x,y0,1,y1-y0)}}
 if(!only)for(const u0 of[-33,31]){const x=X(u0),y0=Y(mouthY(u0)+1),len=Math.round((8+open*22)*s);g.fillStyle='rgba(206,218,232,.6)';g.fillRect(x,y0,1,len);g.fillStyle='rgba(230,238,248,.9)';g.fillRect(x-1,y0+len,2,2)}
 c.eyes=[[X(-17),Y(-3.3)],[X(17),Y(-3.3)]];c.claws=claws.map(cl=>[X(cl.x1),Y(cl.y1)]);c.palms=hands.map(([u,v])=>[X(u),Y(v)]);c.mouth=[X(0),Y(31)];
 return c}

// ---------- grietas tipo telaraña ----------
function monaCracks(g,pts,lv,seed,W,H,hole){const r=pRng(seed||3);const lines=[];const inHole=(x,y)=>hole&&((x-hole[0])/hole[2])**2+((y-hole[1])/hole[3])**2<1;
 for(const[cx,cy,str]of pts){const n=Math.round(7+lv*9*str),rays=[];
  for(let i=0;i<n;i++){let a=i/n*6.283+(r()-.5)*.5,x=cx,y=cy;const len=(14+r()*40)*(.35+lv*1.4)*str,ray=[[x,y]];
   for(let k=0;k<len;k+=3){a+=(r()-.5)*.35;x+=Math.cos(a)*3;y+=Math.sin(a)*3;ray.push([x,y])}rays.push(ray);
   for(let q=1;q<ray.length;q++)lines.push([ray[q-1],ray[q],1])}
  // anillos que unen los rayos
  const rings=Math.round(1+lv*3*str);for(let k=1;k<=rings;k++){for(let i=0;i<rays.length;i++){const A=rays[i],B=rays[(i+1)%rays.length],ia=Math.min(A.length-1,Math.round(k*A.length/(rings+1.3))),ib=Math.min(B.length-1,Math.round(k*B.length/(rings+1.3)));if(r()<.25)continue;
   const p0=A[ia],p1=B[ib],mx=(p0[0]+p1[0])/2+(r()-.5)*4,my=(p0[1]+p1[1])/2+(r()-.5)*4;lines.push([p0,[mx,my],.7],[[mx,my],p1,.7])}}}
 const L2=lines.filter(([a,b])=>!inHole(a[0],a[1])&&!inHole(b[0],b[1]));lines.length=0;lines.push(...L2);
 for(const[a,b]of lines)pLine(g,a[0]+1,a[1]+1,b[0]+1,b[1]+1,'rgba(0,0,0,.6)',1);
 for(const[a,b,k]of lines)pLine(g,a[0],a[1],b[0],b[1],k<1?'rgba(200,220,245,.75)':'rgba(236,244,255,.95)',1);
 if(hole){const n=40;let prev=null;for(let i=0;i<=n;i++){const a=i/n*6.283,j=.82+r()*.32,x=hole[0]+Math.cos(a)*hole[2]*j,y=hole[1]+Math.sin(a)*hole[3]*j;if(prev){pLine(g,prev[0]+1,prev[1]+1,x+1,y+1,'rgba(0,0,0,.7)',1);pLine(g,prev[0],prev[1],x,y,'rgba(240,248,255,1)',1)}prev=[x,y]}}
 for(const[cx,cy,str]of pts){if(inHole(cx,cy))continue;g.fillStyle='rgba(245,250,255,.9)';for(let i=0;i<10*str*lv;i++)g.fillRect(Math.round(cx+(r()-.5)*10*str),Math.round(cy+(r()-.5)*10*str),1,1)}}
// arañazos de garras bajando por el vidrio
function monaScratch(g,claws,len,seed){const r=pRng(seed||9);for(const[x0,y0]of claws){let x=x0,y=y0;const L=len*(.6+r()*.5);
 for(let k=0;k<L;k++){x+=(r()-.5)*.9;y+=1;g.fillStyle='rgba(0,0,0,.55)';g.fillRect(Math.round(x)+1,Math.round(y),1,1);g.fillStyle=k%7===3?'rgba(255,255,255,1)':'rgba(222,234,250,.9)';g.fillRect(Math.round(x),Math.round(y),1,1)}}}
// esquirlas que vuelan hacia la cámara
function monaShards(g,cx,cy,W,H,t,seed){const r=pRng(seed||4);
 for(let i=0;i<44;i++){const big=i<12,a=r()*6.283,d0=10+r()*34,sp=(.5+r()*1.4)*t,x=cx+Math.cos(a)*(d0+sp*W*.55),y=cy+Math.sin(a)*(d0+sp*H*.4)+t*t*24,sz=Math.round((big?9+r()*12:2+r()*5)*(.7+t*1.4));
  const k=r(),pts=[];for(let j=0;j<3+(r()*2|0);j++){const aa=j/4*6.283+r();pts.push([x+Math.cos(aa)*sz*(.5+r()*.6),y+Math.sin(aa)*sz*(.5+r()*.6)])}
  g.beginPath();g.moveTo(Math.round(pts[0][0]),Math.round(pts[0][1]));pts.slice(1).forEach(p=>g.lineTo(Math.round(p[0]),Math.round(p[1])));g.closePath();
  g.fillStyle=k<.5?'rgba(170,196,226,.38)':'rgba(220,236,255,.28)';g.fill();g.strokeStyle='rgba(0,0,0,.5)';
  for(let j=0;j<pts.length;j++){const p=pts[j],q=pts[(j+1)%pts.length];pLine(g,p[0],p[1],q[0],q[1],j===0?'rgba(255,255,255,.95)':'rgba(190,214,240,.7)',1)}}}

