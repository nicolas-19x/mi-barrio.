// ---------- luz: sol, sombras, ambiente por hora, noche y lluvia ----------
const HD_AMB=[[0,.15,.19,.38],[4.6,.15,.19,.38],[5.4,.36,.32,.5],[6.1,.8,.66,.68],[6.9,.98,.9,.84],[8.5,1,.99,.96],[12,1,1,1],[14.6,1,.97,.92],[16.2,1,.89,.76],[17.2,1,.8,.62],[17.9,.82,.6,.56],[18.5,.5,.42,.54],[19.3,.24,.25,.44],[20,.15,.19,.38],[24,.15,.19,.38]];
function hdAmbient(h){for(let i=1;i<HD_AMB.length;i++){const a=HD_AMB[i-1],b=HD_AMB[i];if(h<=b[0]){const t=(h-a[0])/(b[0]-a[0]);return[a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t]}}return[.15,.19,.38]}
function hdSun(){const h=S.t/60,t=(h-6)/12;if(t<=0.01||t>=.99)return null;const el=Math.max(.16,Math.sin(Math.PI*t)*1.22);const k=Math.min(1.8,1/Math.tan(el));
  let a=h<6.6?(h-6)/.6:h>17.5?Math.max(0,(18.15-h)/.65):1;a*=(.26+.1*Math.abs(Math.cos(Math.PI*t)));if(S.rain)a*=.2;
  return{dx:-Math.cos(Math.PI*t)*k,dy:.14*k,a}}
const HDSH={c:null,g:null};const HD_SIL=new WeakMap();
function hdSil(img){let s=HD_SIL.get(img);if(s)return s;s=mk(img.width,img.height);const g=s.getContext('2d');g.drawImage(img,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#000';g.fillRect(0,0,s.width,s.height);HD_SIL.set(img,s);return s}
function hdHull(pts){pts=pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
  for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
  up.pop();lo.pop();return lo.concat(up)}
function hdCasters(m){if(m.hdCast)return m.hdCast;const C={boxes:[],trees:[],poles:[],foot:[]};
  if(m.id==='hoyo'){for(const o of m.objs)if(o.type==='rancho'||o.type==='pulpaReja'||o.type==='cantina')C.boxes.push({x:o.x*T,y:o.y*T+T,w:o.w*T,h:o.h*T-T,hg:18})}
  if(m.id==='chepe'){for(const bd of CHB)C.boxes.push({x:bd.x*T,y:bd.y*T+T*1.5,w:bd.w*T,h:bd.h*T-T*1.5,hg:bd.id==='teatro'?46:40});
    C.boxes.push({x:MERC.x*T,y:MERC.y*T+T,w:MERC.w*T,h:MERC.h*T-T,hg:30});for(const s of CHS)C.boxes.push({x:s.x*T,y:34*T+4,w:s.w*T,h:6*T-4,hg:22});
    for(const t of HDCH_TREES){C.trees.push({x:t.tx*T+8,y:t.ty*T+15,hc:30*(t.sp.h/112),rx:t.sp.w/4.6,ry:t.sp.w/8})}
    for(const o of m.objs){if(o.type==='farol')C.poles.push({x:o.x*T+8,y:o.y*T+14,h:30});else if(o.type==='farolS')C.poles.push({x:o.x*T+8,y:o.y*T+14,h:46})}}
  if(m.id==='ext'){for(const b of BUILD){const two=b.id==='casa_ariana'||b.id==='casa_papas'||b.id==='casa_extra3'||b.id==='casa_sur2';C.boxes.push({x:b.x*T,y:b.y*T+T*1.5,w:b.w*T,h:b.h*T-T*1.5,hg:two?32:24});C.foot.push([b.x*T-2,b.y*T,b.w*T+4,b.h*T])}
    for(const t of HD_TREES){const bx=t.tx*T+8,by=t.ty*T+15;if(t.palm)C.trees.push({x:bx,y:by,palm:1,hc:50,rx:15,ry:8});else C.trees.push({x:bx,y:by,hc:30*(t.sp.h/112),rx:t.sp.w/4.6,ry:t.sp.w/8})}
    for(const[x,y]of POLES)C.poles.push({x:x*T+8,y:y*T+14,h:52});
    for(const o of m.objs){if(o.type==='kiosco')C.boxes.push({x:o.x*T,y:o.y*T+8,w:o.w*T,h:o.h*T-10,hg:16});if(o.type==='busstop')C.boxes.push({x:o.x*T,y:o.y*T,w:o.w*T,h:T,hg:14})}}
  m.hdCast=C;return C}
function hdEntDraw(e){if(e.kind==='carv')return null;if(e===P&&typeof progRideImg==='function'){const r=progRideImg();if(r)return r}if(e===P)return{img:heroSprite(e.dir,heroFrame(e),CH.player.shirt),x:-9,y:-27,w:18,h:29};
  if(e.kind==='animal'){if(typeof aniDraw==='function')return aniDraw(e);const s=animSpr(e.type,e.col,e.fr,e.dir===2);return{img:s,x:-(s.width>>1),y:-s.height+1,w:s.width,h:s.height}}
  if(typeof npcDraw==='function'){const d=npcDraw(e);if(d)return d}
  return{img:sprite(e.c,e.dir,e.fr),x:-9,y:-25,w:18,h:26}}
function hdShadows(m,list,cx,cy){const sun=m.interior?null:hdSun();if(!sun||sun.a<.01)return;
  const w=Math.ceil(VW/2),h=Math.ceil(VH/2);if(!HDSH.c||HDSH.c.width!==w||HDSH.c.height!==h){HDSH.c=mk(w,h);HDSH.g=HDSH.c.getContext('2d')}
  const g=HDSH.g;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);g.imageSmoothingEnabled=false;g.setTransform(Z/2,0,0,Z/2,-cx*Z/2,-cy*Z/2);g.fillStyle='#000';g.strokeStyle='#000';
  const C=hdCasters(m),vx=sun.dx,vy=sun.dy,x0=cx-80,x1=cx+VW/Z+80,y0=cy-80,y1=cy+VH/Z+120;
  for(const b of C.boxes){if(b.x+b.w<x0-b.hg*2.3||b.x>x1+b.hg*2.3||b.y+b.h<y0||b.y>y1)continue;const ox=vx*b.hg,oy=vy*b.hg;
    const pts=[[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]];const hull=hdHull(pts.concat(pts.map(p=>[p[0]+ox,p[1]+oy])));g.beginPath();hull.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.fill()}
  for(const t of C.trees){if(t.x<x0-90||t.x>x1+90||t.y<y0||t.y>y1+40)continue;const ex=t.x+vx*t.hc,ey=t.y+vy*t.hc;
    g.lineWidth=t.palm?2:4;g.beginPath();g.moveTo(t.x,t.y);g.lineTo(ex,ey);g.stroke();g.beginPath();
    if(t.palm){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.moveTo(ex,ey);g.lineTo(ex+Math.cos(a)*t.rx,ey+Math.sin(a)*t.ry)}g.lineWidth=3;g.stroke()}
    else{g.ellipse(ex,ey,t.rx*(1+Math.abs(vx)*.12),t.ry,0,0,Math.PI*2);g.fill()}}
  g.lineWidth=1.5;for(const p of C.poles){if(p.x<x0-120||p.x>x1+120||p.y<y0||p.y>y1)continue;g.beginPath();g.moveTo(p.x,p.y);const ex=p.x+vx*p.h,ey=p.y+vy*p.h;g.lineTo(ex,ey);g.stroke();g.beginPath();g.moveTo(ex-10,ey);g.lineTo(ex+10,ey);g.stroke()}
  for(const e of list){if(e.x<x0||e.x>x1||e.y<y0||e.y>y1)continue;const d=hdEntDraw(e);if(!d||!d.img)continue;const X=Math.round(e.x),Y=Math.round(e.y);
    g.save();g.transform(1,0,-vx,-vy,vx*Y,(1+vy)*Y);g.drawImage(hdSil(d.img),X+d.x,Y+d.y,d.w,d.h);g.restore()}
  g.globalCompositeOperation='destination-out';for(const f of C.foot)g.fillRect(f[0],f[1],f[2],f[3]);g.globalCompositeOperation='source-over';
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=sun.a;ctx.imageSmoothingEnabled=false;
  // sombra azulada (tinte frío) en vez de negra
  ctx.globalCompositeOperation='multiply';ctx.drawImage(HDSH.c,0,0,VW,VH);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=sun.a*.35;ctx.drawImage(HDSH.c,0,0,VW,VH);
  ctx.restore()}
const HD_LCOL={pole:[255,170,80],lamp:[255,214,150],win:[255,196,120],int:[255,222,168],player:[255,236,200]};
function hdLight(m,cx,cy){const h=S.t/60;let amb=hdAmbient(h);
  if(m.interior){const n=1-Math.min(1,(amb[0]+amb[1]+amb[2])/3);amb=[Math.max(amb[0],.93-n*.5),Math.max(amb[1],.9-n*.5),Math.max(amb[2],.86-n*.42)]}
  if(S.rain&&!m.interior)amb=[amb[0]*.7,amb[1]*.74,amb[2]*.84];
  const lum=(amb[0]+amb[1]+amb[2])/3,night=Math.max(0,Math.min(1,(.9-lum)/.7));
  // capa de luz: ambiente + luces sumadas, luego se multiplica sobre la escena
  if(lum<.995||amb[2]<.97){const W=lcv.width,H=lcv.height,k=Z/4;lctx.globalCompositeOperation='source-over';lctx.globalAlpha=1;
    lctx.fillStyle=`rgb(${amb[0]*255|0},${amb[1]*255|0},${amb[2]*255|0})`;lctx.fillRect(0,0,W,H);
    if(night>.02){lctx.globalCompositeOperation='lighter';const lights=m.lights.concat(m.id==='chepe'&&typeof CARLIGHTS!=='undefined'?CARLIGHTS:[]);if(S.f&&S.f.fiestaOn&&!m.interior)lights.push({x:39.5*T,y:29*T,r:110,fiesta:1});lights.push({x:P.x,y:P.y-8,r:24,player:1});
      for(const e of(m.id==='ext'?HD_EMIT:m.hdEmit||[])){if(e.k==='door')continue;if(!hdWinOn(e))continue;lights.push({x:(e.x+e.w/2)/2,y:(e.y+e.h)/2+6,r:e.k==='shop'?44:26,win:1})}
      for(const l of lights){const X=(l.x-cx)*k,Y=(l.y-cy)*k,r=l.r*k*(l.pole?1.35:1.1);if(X<-r||Y<-r||X>W+r||Y>H+r)continue;
        const c=l.pole?HD_LCOL.pole:l.win?HD_LCOL.win:l.player?HD_LCOL.player:m.interior?HD_LCOL.int:HD_LCOL.lamp,it=(l.player?.35:l.win?.6:1)*night;
        const gr=lctx.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},${it})`);gr.addColorStop(.55,`rgba(${c[0]},${c[1]},${c[2]},${it*.45})`);gr.addColorStop(1,'rgba(0,0,0,0)');lctx.fillStyle=gr;lctx.fillRect(X-r,Y-r,r*2,r*2)}}
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;ctx.globalCompositeOperation='multiply';ctx.drawImage(lcv,0,0,VW,VH);ctx.restore()}
  // tarde dorada: un velo cálido muy suave en las luces
  if(!m.interior&&h>15.5&&h<18.6&&!S.rain){const t=h<17.3?(h-15.5)/1.8:Math.max(0,(18.6-h)/1.3);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.35*t;ctx.fillStyle='#ffb060';ctx.fillRect(0,0,VW,VH);ctx.restore()}
  // de noche: ventanas encendidas y halos
  if(night>.05){ctx.save();ctx.setTransform(Z,0,0,Z,-cx*Z,-cy*Z);ctx.globalCompositeOperation='lighter';
    {for(const e of(m.id==='ext'?HD_EMIT:m.hdEmit||[])){if(e.k==='door'||!hdWinOn(e))continue;const X=e.x/2,Y=e.y/2;if(X>cx+VW/Z||X+e.w/2<cx||Y>cy+VH/Z||Y+e.h/2<cy)continue;
        ctx.globalAlpha=night*(e.k==='shop'?.55:.45);ctx.fillStyle=e.k==='shop'?'#ffd890':'#ffb860';ctx.fillRect(X,Y,e.w/2,e.h/2)}}
    if(m.id==='chepe'&&typeof carGlow==='function')carGlow(ctx,night);
    ctx.globalAlpha=night*.55;for(const l of m.lights){if(!l.pole&&!m.interior)continue;const r=l.r*.55;ctx.drawImage(glow,l.x-r,l.y-r-(l.pole?22:0),r*2,r*2)}
    ctx.restore()}
  // lluvia: gotas en diagonal + salpicaduras en el suelo
  if(S.rain&&!m.interior){ctx.save();ctx.setTransform(1,0,0,1,0,0);const f=Math.floor(qBlink*24);ctx.strokeStyle='rgba(205,220,245,.38)';ctx.lineWidth=Math.max(1,Z/4);ctx.beginPath();
    for(let i=0;i<150;i++){const x=hsh(i,f)*VW*1.1,y=hsh(f,i)*VH,L=Z*(3+hsh(i,i)*3);ctx.moveTo(x,y);ctx.lineTo(x-L*.35,y+L)}ctx.stroke();
    ctx.fillStyle='rgba(220,232,250,.45)';for(let i=0;i<70;i++){const x=hsh(i*3,f)*VW,y=hsh(f,i*3)*VH,s=Math.max(1,Z/2);ctx.fillRect(x-s,y,s,s);ctx.fillRect(x+s,y,s,s);ctx.fillRect(x,y-s,s,s)}
    ctx.restore()}}
function hdWinOn(e){const h=S.t/60;if(e.k==='shop')return h>=6&&h<21.5;const seed=hsh((e.x|0)+S.day*7,(e.y|0));if(h>=23||h<5)return seed<.12;if(h>=21.5)return seed<.4;return seed<.75}
