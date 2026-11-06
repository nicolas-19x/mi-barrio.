// ================= MIRADOR: VER LA VISTA =================
// Panorama pixel-art del valle que cambia con la hora y la lluvia de la partida.
let VISTA=null,nearMirador=false;
const VSKY=[[0,'#0a0e2a','#1b2148'],[4.5,'#0f1538','#262a58'],[5.5,'#2f3f7e','#c9787a'],[6.5,'#5d8fd0','#f6b27a'],[8,'#5fa8e0','#c4e6f4'],[16,'#579fdb','#d3ebf2'],[17.5,'#4a6db8','#f2b07a'],[18.5,'#34408a','#ee7d58'],[19.5,'#1d2258','#7a4470'],[20.5,'#0e1236','#232552'],[24,'#0a0e2a','#1b2148']];
const vhx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const vmix=(a,b,t)=>{a=typeof a==='string'?vhx(a):a;b=typeof b==='string'?vhx(b):b;return a.map((v,i)=>Math.round(v+(b[i]-v)*t))};
const vcss=(c,al)=>al==null?'rgb('+c+')':'rgba('+c+','+al+')';
function vSeed(n){return()=>{n|=0;n=n+0x6D2B79F5|0;let t=Math.imul(n^n>>>15,1|n);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function vSkyAt(h){for(let i=0;i<VSKY.length-1;i++){const a=VSKY[i],b=VSKY[i+1];if(h>=a[0]&&h<b[0]){const t=(h-a[0])/(b[0]-a[0]);return[vmix(a[1],b[1],t),vmix(a[2],b[2],t)]}}return[vhx(VSKY[0][1]),vhx(VSKY[0][2])]}
const vNight=h=>h>=7&&h<=17?0:h>17&&h<20?(h-17)/3:h>=20||h<5?1:(7-h)/2;
const vWarm=h=>Math.max(0,1-Math.abs(h-18.3)/1.3)+Math.max(0,1-Math.abs(h-6)/1.1);
function vLayout(W){const r=vSeed(77),L={W},rp=()=>r()*6.28,p=[rp(),rp(),rp(),rp(),rp()];
  L.far=[];L.near=[];for(let x=0;x<=W;x++){L.far.push(54-13*Math.sin(x*.021+p[0])-7*Math.sin(x*.057+p[1])-3*Math.sin(x*.13+p[2]));L.near.push(70-6*Math.sin(x*.03+p[3])-4*Math.sin(x*.083+p[4]))}
  L.stars=[...Array(Math.round(W/2.5))].map(()=>({x:r()*W,y:r()*60,p:rp(),b:r()<.12}));
  L.clouds=[...Array(6)].map(()=>({x:r()*W*1.4,y:8+r()*34,w:18+r()*30,s:1.2+r()*2.4}));
  L.city=[];for(let x=W*.3;x<W*.97;){const w=2+Math.floor(r()*4),h=2+Math.floor(r()*(x>W*.55&&x<W*.8?11:6));L.city.push({x:Math.floor(x),w,h,c:r(),win:[...Array(Math.ceil(w*h/6))].map(()=>({dx:Math.floor(r()*w),dy:Math.floor(r()*h),p:rp()}))});x+=w+(r()<.3?1:0)}
  L.lights=[...Array(Math.round(W*.9))].map(()=>{const x=r()*W;return{x,y:90+5*Math.sin(x*.045+1)+(r()-.5)*9+r()*4,p:rp(),c:r()<.7?'#ffd77a':r()<.5?'#fff4d6':'#ff9a5a'}});
  L.fields=[...Array(7)].map(()=>({x:r()*W,y:80+r()*22,w:16+r()*30,h:4+r()*6}));
  L.cars=[...Array(5)].map((_,i)=>({x:r()*W,s:(i%2?-1:1)*(10+r()*12)}));
  L.trees=[...Array(16)].map(()=>({x:W*.06+r()*W*.4,y:108+r()*14,r:2+r()*2.5}));
  L.lamps=[W*.14,W*.3,W*.44].map(x=>({x,y:112}));
  const WALL=['#e9c46a','#f193b4','#8fd3c7','#f4ead2','#a7c957','#7fc3e8','#f2994a','#c9b1e6'],ROOF=['#9aa4a8','#a0583a','#4f8f8f','#b84a3a','#8c949a','#6a7a80'];
  L.houses=[];[[124,.6],[136,.8],[150,1.05]].forEach(([y,sc],row)=>{for(let x=-10-r()*10;x<W+10;){const w=Math.round((16+r()*16)*sc),wh=Math.round((6+r()*4)*sc),rh=Math.round((4+r()*4)*sc);L.houses.push({x:Math.round(x),y:y+Math.round(r()*4),w,wh,rh,row,wall:WALL[Math.floor(r()*WALL.length)],roof:ROOF[Math.floor(r()*ROOF.length)],flip:r()<.5,lit:r()<.65,ant:r()<.25,tank:r()<.15,wp:rp()});x+=w+Math.round(r()*5*sc)}});
  L.flies=[...Array(10)].map(()=>({x:r()*W,y:120+r()*40,p:rp()}));
  L.birds=[...Array(4)].map((_,i)=>({x:r()*W,y:22+r()*24,s:8+r()*8,p:rp()}));
  return L}
function vSize(){const a=innerWidth/Math.max(1,innerHeight);let W,H;if(a>=1.2){H=180;W=Math.round(Math.min(420,Math.max(240,H*a)))}else{W=200;H=Math.round(Math.min(380,Math.max(180,W/a)))}return[W,H]}
function openVista(){const[W,H]=vSize(),c=$('#vcan');c.width=W;c.height=H;VISTA={t:0,L:vLayout(W),W,H,goal:null,chirp:0,raf:0,night0:isNight()};mode='view';
  $('#vista').classList.remove('hidden');$('#prompt').classList.add('hidden');showTouch();vistaUI();beepSeq([523,659,784,1046]);
  if(VISTA.night0)setTimeout(()=>{if(VISTA)secret('mirador','El mirador de noche')},1800);
  let last=performance.now();const step=now=>{if(!VISTA)return;const dt=Math.min(.05,(now-last)/1000);last=now;vistaTick(dt);drawVista();VISTA.raf=requestAnimationFrame(step)};VISTA.raf=requestAnimationFrame(step)}
function closeVista(){if(!VISTA)return;cancelAnimationFrame(VISTA.raf);const sawNight=isNight();VISTA=null;$('#vista').classList.add('hidden');mode='play';showTouch();checkPeriod();
  if(sawNight)secret('mirador','El mirador de noche');saveGame()}
function vistaWait(){if(!VISTA||VISTA.goal!=null||S.t>=23*60-1)return;VISTA.goal=S.t+60;beep(440,.08,'sine',.03,660)}
function vistaUI(){const per={m:'Mañana',t:'Tarde',e:'Atardecer',n:'Noche'}[period()];$('#vtime').textContent='Día '+S.day+' · '+fmtTime()+' · '+per+(S.rain?' · lluvia':'');$('#vWait').disabled=VISTA.goal!=null||S.t>=23*60-1}
function vistaTick(dt){const V=VISTA;V.t+=dt;if(V.goal!=null){S.t=Math.min(V.goal,S.t+dt*30);if(S.t>=V.goal){V.goal=null;if(isNight())secret('mirador','El mirador de noche')}}
  if(S.rain){S.rain-=dt*.5;if(S.rain<0)S.rain=0}
  V.L.cars.forEach(c=>{c.x+=c.s*dt;if(c.x>V.W+6)c.x=-6;if(c.x<-6)c.x=V.W+6});V.L.birds.forEach(b=>{b.x+=b.s*dt;if(b.x>V.W+8)b.x=-8});
  V.chirp-=dt;if(V.chirp<=0){if(vNight(hour()+S.t%60/60)>.6){V.chirp=rnd(.5,1.4);for(let i=0;i<3;i++)setTimeout(()=>beep(4200,.03,'square',.006),i*60)}else{V.chirp=rnd(2.5,5);const f=rnd(1800,2600);beep(f,.08,'sine',.015,f*1.4)}}
  if(Math.floor(V.t*4)!==Math.floor((V.t-dt)*4))vistaUI()}
function drawVista(){const V=VISTA,L=V.L,W=V.W,H=V.H,g=$('#vcan').getContext('2d'),oy=H-180,t=V.t,h=S.t/60;
  const n=vNight(h),wm=Math.min(1,vWarm(h)),[top,bot]=vSkyAt(h),rain=Math.min(1,(S.rain||0)/20);
  const NIGHT='#0e1230',shade=(c,k=1)=>{let x=vmix(c,NIGHT,n*.8*k);if(wm)x=vmix(x,'#ff9a5a',wm*.16);if(rain)x=vmix(x,'#6a7280',rain*.3);return vcss(x)};
  const R=(c,x,y,w,hh)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(hh))};
  // cielo
  const gr=g.createLinearGradient(0,0,0,oy+80);gr.addColorStop(0,vcss(rain?vmix(top,'#5a6170',rain*.6):top));gr.addColorStop(1,vcss(rain?vmix(bot,'#8a909a',rain*.6):bot));g.fillStyle=gr;g.fillRect(0,0,W,H);
  if(n>.05)L.stars.forEach(s=>{const a=n*(1-rain)*(.45+.55*Math.sin(t*2+s.p*3));if(a>0)R(`rgba(255,250,230,${a.toFixed(2)})`,s.x,s.y*(oy+70)/60,s.b?2:1,s.b?2:1)});
  // sol y luna (detrás de las montañas)
  if(h>=5.6&&h<=18.6){const k=(h-5.6)/13,sx=W*.08+k*W*.84,sy=oy+70-Math.sin(Math.PI*k)*(58+oy*.6),low=1-Math.sin(Math.PI*k);g.fillStyle=`rgba(255,220,150,${(.25*(1-rain)).toFixed(2)})`;g.beginPath();g.arc(sx,sy,14,0,7);g.fill();g.fillStyle=vcss(vmix('#fff3c4','#ff8a4a',low*.8));g.beginPath();g.arc(sx,sy,7,0,7);g.fill()}
  const mh=h>=18?h-18:h<6?h+6:-1;if(mh>=0){const k=mh/12,mx=W*.1+k*W*.8,my=oy+72-Math.sin(Math.PI*k)*(56+oy*.6);g.fillStyle='rgba(230,235,255,.15)';g.beginPath();g.arc(mx,my,11,0,7);g.fill();g.fillStyle='#f4f1dc';g.beginPath();g.arc(mx,my,5,0,7);g.fill();R('#d8d3b8',mx-2,my-1,2,2);R('#d8d3b8',mx+1,my+2,1,1)}
  // nubes
  L.clouds.forEach(c=>{const x=((c.x+t*c.s)%(W*1.4))-W*.2,y=oy*.5+c.y,col=vcss(vmix(vmix('#ffffff',bot,.25+wm*.3),'#353a66',n*.85)),a=.85;g.fillStyle=col;g.globalAlpha=a;g.beginPath();g.ellipse(x,y,c.w/2,4,0,0,7);g.ellipse(x-c.w*.2,y-3,c.w*.22,4,0,0,7);g.ellipse(x+c.w*.15,y-4,c.w*.26,5,0,0,7);g.fill();g.globalAlpha=1});
  // montañas
  g.fillStyle=shade('#7d8fb5',1.05);g.beginPath();g.moveTo(0,H);L.far.forEach((y,x)=>g.lineTo(x,oy+y));g.lineTo(W,H);g.fill();
  g.fillStyle=shade('#4f7a5a');g.beginPath();g.moveTo(0,H);L.near.forEach((y,x)=>g.lineTo(x,oy+y));g.lineTo(W,H);g.fill();
  // ciudad a lo lejos
  L.city.forEach(b=>{const base=oy+L.near[Math.min(W,b.x)]+3;R(shade(vmix('#9aa3ad','#c9c2b4',b.c),.9),b.x,base-b.h,b.w,b.h);if(n>.3)b.win.forEach(w=>{if(Math.sin(t*.7+w.p*5)>-.6)R(`rgba(255,215,122,${(n*.95).toFixed(2)})`,b.x+w.dx,base-b.h+w.dy,1,1)})});
  // valle
  R(shade('#6f9a55'),0,oy+84,W,96);L.fields.forEach(f=>{R(shade('#5a8446'),f.x,oy+f.y,f.w,f.h);for(let i=0;i<f.h;i+=2)R(shade('#4b733a'),f.x,oy+f.y+i,f.w,1)});
  g.fillStyle=shade('#6f9a55');g.beginPath();g.moveTo(0,oy+84);L.near.forEach((y,x)=>{if(x%4===0)g.lineTo(x,oy+Math.min(84,y+6))});g.lineTo(W,oy+84);g.fill();
  if(n>.25)L.lights.forEach(l=>{const a=n*(.55+.45*Math.sin(t*3+l.p*7));g.fillStyle=l.c;g.globalAlpha=a;g.fillRect(Math.round(l.x),Math.round(oy+l.y),1,1);g.globalAlpha=1});
  // carretera y carros
  const rd=x=>oy+104+4*Math.sin(x*.025+1);for(let x=0;x<W;x+=2)R(shade('#5a5d60'),x,rd(x),2,2);
  L.cars.forEach((c,i)=>{const y=rd(c.x)-1;R(shade(['#d6453c','#f4ead2','#2a6fb0','#f2b632','#3fa66b'][i]),c.x,y,3,1);if(n>.35){R('#fff4c0',c.s>0?c.x+3:c.x-1,y,1,1);R('#ff4a3a',c.s>0?c.x-1:c.x+3,y,1,1)}});
  // parque
  g.fillStyle=shade('#8cc46a');g.beginPath();g.ellipse(W*.27,oy+116,W*.22,9,0,0,7);g.fill();
  R(shade('#7bb661'),W*.2,oy+112,24,8);R(shade('#f4f4f4',.7),W*.2,oy+112,24,1);R(shade('#f4f4f4',.7),W*.2,oy+119,24,1);R(shade('#f4f4f4',.7),W*.2+12,oy+112,1,8);
  L.trees.forEach(tr=>{R(shade('#6b4a2b'),tr.x,oy+tr.y,1,3);g.fillStyle=shade('#2f6e3f');g.beginPath();g.arc(tr.x,oy+tr.y-1,tr.r,0,7);g.fill();g.fillStyle=shade('#4f9a55');g.beginPath();g.arc(tr.x-.6,oy+tr.y-1.8,tr.r*.55,0,7);g.fill()});
  L.lamps.forEach(l=>{R(shade('#303638'),l.x,oy+l.y-6,1,6);if(n>.3){g.fillStyle=`rgba(255,215,122,${(.25*n).toFixed(2)})`;g.beginPath();g.arc(l.x,oy+l.y-6,5,0,7);g.fill();R('#ffe9a8',l.x,oy+l.y-7,1,1)}});
  // techos de zinc del barrio
  L.houses.forEach(b=>{const y=oy+b.y,k=b.row===2?.85:.95;R(shade(b.wall,k),b.x,y,b.w,b.wh);R('rgba(0,0,0,.15)',b.x,y,b.w,1);
    const ww=Math.max(2,Math.round(b.w*.18)),wy=y+Math.round(b.wh*.35),lit=n>.35&&b.lit&&Math.sin(t*.4+b.wp)>-.92;[.2,.62].forEach(f=>R(lit?'#ffd77a':shade('#2b3a4a',.6),b.x+Math.round(b.w*f),wy,ww,Math.max(2,Math.round(b.wh*.4))));
    if(lit){g.fillStyle=`rgba(255,215,122,${(.12*n).toFixed(2)})`;g.fillRect(b.x-2,wy-2,b.w+4,b.wh)}
    const ry=y-b.rh,dx=Math.round(b.rh*.6);g.fillStyle=shade(b.roof,k);g.beginPath();if(b.flip){g.moveTo(b.x-2,y);g.lineTo(b.x+b.w+2,y);g.lineTo(b.x+b.w+2-dx,ry);g.lineTo(b.x-2+dx*.3,ry)}else{g.moveTo(b.x-2,y);g.lineTo(b.x+b.w+2,y);g.lineTo(b.x+b.w+2-dx*.3,ry);g.lineTo(b.x-2+dx,ry)}g.fill();
    for(let x=b.x;x<b.x+b.w+2;x+=2)R(shade(vmix(b.roof,'#ffffff',.18),k),x,ry+1,1,b.rh-1);R(shade(vmix(b.roof,'#000000',.25),k),b.x-2,y-1,b.w+4,1);
    if(b.tank){R(shade('#2a6fb0',k),b.x+b.w*.6,ry-4,4,4);R(shade('#4f8fd0',k),b.x+b.w*.6,ry-4,4,1)}
    if(b.ant){R(shade('#303638',k),b.x+b.w*.3,ry-7,1,7);R(shade('#303638',k),b.x+b.w*.3-2,ry-6,5,1)}});
  // luciérnagas
  if(n>.5)L.flies.forEach(f=>{const a=Math.max(0,Math.sin(t*2+f.p*4));if(a>.2){g.fillStyle=`rgba(230,255,140,${(a*n).toFixed(2)})`;g.fillRect(Math.round(f.x+Math.sin(t*.6+f.p)*6),Math.round(oy+f.y+Math.cos(t*.8+f.p)*4),1,1)}});
  // pájaros
  if(n<.4&&!rain)L.birds.forEach(b=>{const x=Math.round(b.x),y=Math.round(oy*.6+b.y+Math.sin(t*1.5+b.p)*3),u=Math.sin(t*9+b.p)>0?-1:0;g.fillStyle='#1d1a24';g.fillRect(x-2,y+u,2,1);g.fillRect(x,y+1,1,1);g.fillRect(x+1,y+u,2,1)});
  // baranda del mirador
  R(shade('#72513d',.7),0,oy+166,W,14);R(shade('#9a7150',.7),0,oy+166,W,1);
  const rail=shade('#6b4a2b',.7),railHi=shade('#9a7150',.7);for(let x=4;x<W;x+=26){R(rail,x,oy+160,3,20);R(railHi,x,oy+160,1,20)}R(rail,0,oy+160,W,3);R(railHi,0,oy+160,W,1);R(rail,0,oy+170,W,2);
  const lx=W-18;R(shade('#303638',.6),lx,oy+128,2,52);R(shade('#303638',.6),lx-4,oy+128,6,2);if(n>.25){g.fillStyle=`rgba(255,215,122,${(.3*n).toFixed(2)})`;g.beginPath();g.arc(lx-3,oy+131,9,0,7);g.fill();R('#ffe9a8',lx-4,oy+130,2,2)}
  // lluvia
  if(rain){g.fillStyle=`rgba(60,70,90,${(.22*rain).toFixed(2)})`;g.fillRect(0,0,W,H);g.fillStyle=`rgba(200,215,235,${(.55*rain).toFixed(2)})`;for(let i=0;i<W*.8;i++){const x=(i*37.3+t*40)%(W+20)-10,y=(i*53.7+t*160)%H;g.fillRect(Math.round(x),Math.round(y),1,3)}}}
function miradorTick(){if(P.map!=='ext'){nearMirador=false;return}const d=Math.hypot(P.x/T-29.5,P.y/T-3);if(d<4){if(!nearMirador){nearMirador=true;toast('🌄 Llegaste al Mirador del Barrio · acercate al letrero para ver la vista')}}else if(d>7)nearMirador=false}

