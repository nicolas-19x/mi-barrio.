// ================= BASICS =================
const T=16;
const $=s=>document.querySelector(s);
const cv=$('#c'),ctx=cv.getContext('2d');
const lcv=document.createElement('canvas'),lctx=lcv.getContext('2d');
let DPR=1,VW=0,VH=0,Z=4;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);VW=Math.floor(innerWidth*DPR);VH=Math.floor(innerHeight*DPR);cv.width=VW;cv.height=VH;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';
  Z=Math.max(2,Math.min(VW,VH)/(T*10.5));if(Math.max(VW,VH)/(T*Z)>24)Z=Math.max(VW,VH)/(T*24);Z=Math.max(2,Math.round(Z/2)*2);
  // Resolución interna: con Z>2 cada píxel del arte HD ocupaba Z/2 × Z/2 píxeles del lienzo. Se dibuja con Z=2
  // (un píxel del arte = un píxel del lienzo) y el navegador lo agranda sin suavizar (image-rendering:pixelated).
  // Se ve igual y pinta 4 veces menos píxeles (9 veces menos con Z=6); DPR baja en la misma proporción para lo que mide en pantalla.
  if(Z>2){const k=Z/2;DPR/=k;VW=Math.floor(innerWidth*DPR);VH=Math.floor(innerHeight*DPR);Z=2;cv.width=VW;cv.height=VH}
  lcv.width=Math.ceil(VW/4);lcv.height=Math.ceil(VH/4)}
addEventListener('resize',resize);resize();
function hsh(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function shade(hex,a){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=a<0?0:255,p=Math.abs(a);r=Math.round((f-r)*p+r);g=Math.round((f-g)*p+g);b=Math.round((f-b)*p+b);return'rgb('+r+','+g+','+b+')'}
const R=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
function disc(g,c,cx,cy,r){for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy));R(g,c,cx-w,cy+dy,w*2+1,1)}}
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const D4=[[1,0],[-1,0],[0,1],[0,-1]];
const DV=[[0,1],[0,-1],[-1,0],[1,0]];

