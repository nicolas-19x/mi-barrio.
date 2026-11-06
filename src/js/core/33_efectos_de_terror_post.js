// ================= efectos de terror (post-proceso del prólogo) =================
const PGR=[];
function proGrain(W,H,i){const k=W+'x'+H+'|'+i;if(PGR[k])return PGR[k];const c=mk(W,H),g=c.getContext('2d'),d=g.createImageData(W,H),D=d.data,r=pRng(91+i*7);
 for(let j=0;j<W*H;j++){const v=r();if(v<.22){const b=v<.11?0:255;D[j*4]=b;D[j*4+1]=b;D[j*4+2]=b;D[j*4+3]=110}}g.putImageData(d,0,0);return PGR[k]=c}
let PTMP=null;
function proPost(g){const p=PRO;if(!p)return;const W=p.W,H=p.H,m=p.mona,dt=1/60;
 // golpe de zoom
 if(p.punch>0){if(!PTMP||PTMP.width!==W||PTMP.height!==H)PTMP=mk(W,H);const tg=PTMP.getContext('2d');tg.clearRect(0,0,W,H);tg.drawImage(g.canvas,0,0);const z=1+.09*p.punch;
  g.drawImage(PTMP,Math.round(W/2-W*z/2),Math.round(H*.42-H*.42*z),Math.round(W*z),Math.round(H*z));p.punch=Math.max(0,p.punch-dt*3.5)}
 // falla tipo VHS: franjas corridas y canales de color separados
 if(p.glitch>0){const k=p.glitch,n=3+Math.round(k*9);if(!PTMP||PTMP.width!==W)PTMP=mk(W,H);const tg=PTMP.getContext('2d');tg.clearRect(0,0,W,H);tg.drawImage(g.canvas,0,0);
  for(let i=0;i<n;i++){const y=(Math.random()*H)|0,h=2+((Math.random()*10*k)|0),off=Math.round((Math.random()-.5)*20*k);g.drawImage(PTMP,0,y,W,h,off,y,W,h)}
  if(k>.25){const sh=Math.max(1,Math.round(3*k)),img=g.getImageData(0,0,W,H),s=img.data,o=new Uint8ClampedArray(s);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,xr=Math.min(W-1,x+sh),xb=Math.max(0,x-sh);s[i]=o[(y*W+xr)*4];s[i+2]=o[(y*W+xb)*4+2]}g.putImageData(img,0,0)}
  if(Math.random()<.5*k){g.fillStyle='rgba(255,255,255,'+(.08+.12*k)+')';g.fillRect(0,(Math.random()*H)|0,W,1)}
  p.glitch=Math.max(0,p.glitch-dt*2.4)}
 // destello subliminal: su cara en negativo, dos o tres cuadros
 if(p.subl>0&&m&&m.l3){g.fillStyle='#000';g.fillRect(0,0,W,H);const L=m.l3,s=Math.min(W/L.width,H/L.height)*1.9,ex=(L.eyes[0][0]+L.eyes[1][0])/2,ey=L.eyes[0][1];
  g.drawImage(L,Math.round(W/2-ex*s),Math.round(H*.4-ey*s),Math.round(L.width*s),Math.round(L.height*s));g.globalCompositeOperation='difference';g.fillStyle='#fff';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';
  g.globalCompositeOperation='multiply';g.fillStyle='#ffd0d0';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';p.subl--}
 // grano y viñeta que late con el corazón
 if(p.grain>0){g.globalAlpha=p.grain;g.drawImage(proGrain(W,H,(Math.random()*3)|0),0,0);g.globalAlpha=1}
 if(m&&m.pulse!=null&&m.st!=='gone'){const pu=m.pulse||0;const gr=g.createRadialGradient(W/2,H*.4,Math.min(W,H)*(.32-.08*pu),W/2,H*.4,Math.max(W,H)*.7);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba('+Math.round(40*pu)+',0,0,'+(.55+.3*pu)+')');g.fillStyle=gr;g.fillRect(0,0,W,H);m.pulse=Math.max(0,pu-dt*2.2)}}
// luz de la escena: estrobo rojo del testigo, oscuridad, relámpago
function monaLight(dt){const p=PRO,m=p.mona;if(!m||!(m.st==='fall'||m.st==='press'))return'norm';
 m.strT=(m.strT||0)-dt;if(m.strT<=0){const r=Math.random();m.lit=r<.42?'dark':r<.78?'red':'norm';m.strT=m.lit==='dark'?.25+Math.random()*.55:m.lit==='red'?.07+Math.random()*.16:.1+Math.random()*.25;if(m.lit==='norm'&&Math.random()<.3)p.glitch=Math.max(p.glitch||0,.35)}
 return m.lit}

