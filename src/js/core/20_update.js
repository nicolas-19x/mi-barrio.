// ================= UPDATE =================
function updNPC(n,dt){if(n.talking){n.fr=0;return}const m=MAPS[n.map];let moving=false;
  if(n.steps&&n.steps.length){const st=n.steps[0];if(st.tele){n.map=st.tele;n.x=st.x*T+8;n.y=st.y*T+12;n.steps.shift();n.path=null;return}
    if(!n.path){const[sx,sy]=tileOf(n);n.path=bfs(m,sx,sy,st.x,st.y);if(!n.path){n.x=st.x*T+8;n.y=st.y*T+12;n.steps.shift();return}}
    if(!n.path.length){n.steps.shift();n.path=null;return}moving=follow(n,dt,46)}
  else if(n.path&&n.path.length){moving=follow(n,dt,26)}
  else{n.wt-=dt;if(n.wt<=0){n.wt=rnd(2,6);const h=n.home;if(h&&h.map===n.map&&Math.random()<.6){const tx=h.x+Math.round(rnd(-2,2)),ty=h.y+Math.round(rnd(-1,1));const[sx,sy]=tileOf(n);const p=bfs(m,sx,sy,tx,ty);if(p&&p.length<8)n.path=p}else if(Math.random()<.4)n.dir=Math.floor(Math.random()*4)}
    if(P.map===n.map&&Math.hypot(P.x-n.x,P.y-n.y)<36)faceTo(n,P)}
  n.anim+=moving?dt*7:0;n.fr=moving?1+(Math.floor(n.anim)%2):0}
function follow(n,dt,sp){const[tx,ty]=n.path[0];const gx=tx*T+8,gy=ty*T+12;const dx=gx-n.x,dy=gy-n.y,d=Math.hypot(dx,dy);if(d<1.5){n.x=gx;n.y=gy;n.path.shift();return true}const s=Math.min(d,sp*dt);n.x+=dx/d*s;n.y+=dy/d*s;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0);return true}
function updPed(e,dt){if(e.talking){e.fr=0;return}const m=MAPS.ext;if(!e.path||!e.path.length){e.wt-=dt;e.fr=0;if(e.wt<=0){const[sx,sy]=tileOf(e);for(let i=0;i<5&&(!e.path||!e.path.length);i++){const s=pick(SIDEW);e.path=bfs(m,sx,sy,s[0],s[1])}e.wt=rnd(1,4)}return}
  follow(e,dt,30);e.anim+=dt*6;e.fr=1+(Math.floor(e.anim)%2)}
function updAnimal(e,dt){if(!animalActive(e)){if(e.special!=='firulais'||!S.f.dogFollow)return}
  let vx=0,vy=0;
  if(e.special==='firulais'&&S.f.dogFollow){if(e.map!==P.map){e.map=P.map;e.x=P.x;e.y=P.y}const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy);if(d>90){e.x=P.x;e.y=P.y}else if(d>20){vx=dx/d*80;vy=dy/d*80}}
  else if(e.special==='kiki'){const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy);if(P.map==='ext'&&d<44){vx=dx/d*58;vy=dy/d*58}else{e.wt-=dt;if(e.wt<=0){e.wt=rnd(.5,2);e.vx=rnd(-20,20);e.vy=rnd(-20,20)}vx=e.vx;vy=e.vy}}
  else if(e.special==='cadejos'){e.dir=dirTo(e,P);return}
  else{e.wt-=dt;if(e.wt<=0){e.wt=rnd(1,4);const go=Math.random()<.6;e.vx=go?rnd(-1,1)*(e.type==='dog'?30:18):0;e.vy=go?rnd(-1,1)*18:0;if(Math.hypot(e.x-e.ox*T,e.y-e.oy*T)>70){e.vx=(e.ox*T-e.x)*.4;e.vy=(e.oy*T-e.y)*.4}}vx=e.vx;vy=e.vy}
  const mv=(vx||vy)&&moveEnt(e,vx*dt,vy*dt);if(vx)e.dir=vx<0?2:3;e.anim+=mv?dt*8:0;e.fr=mv?Math.floor(e.anim)%2:0;
  if(e.special==='kiki'&&!mv&&(vx||vy))e.wt=0}
let cam={x:0,y:0},saveT=0,lastTarget='';
function camTarget(){const m=MAPS[P.map],vw=VW/Z,vh=VH/Z;let x=P.x-vw/2,y=P.y-12-vh/2;const mw=m.w*T,mh=m.h*T;x=mw<vw?(mw-vw)/2:Math.max(0,Math.min(mw-vw,x));y=mh<vh?(mh-vh)/2:Math.max(0,Math.min(mh-vh,y));return[x,y]}
function snapCam(){const[x,y]=camTarget();cam.x=x;cam.y=y}
function update(dt){
  if(COMBAT){updateCombat(dt);return}
  if(mode==='play'&&!fading){S.t+=dt*2;if(S.t>=1440){S.t-=1440;S.day++;ecoDay()}if(S.rain){S.rain-=dt*2;if(S.rain<0)S.rain=0}checkPeriod();phoneTick(dt);ecoTick(dt);zoneTick(dt);asaltoTick(dt);
    let ix=(KEYS.arrowright||KEYS.d?1:0)-(KEYS.arrowleft||KEYS.a?1:0),iy=(KEYS.arrowdown||KEYS.s?1:0)-(KEYS.arrowup||KEYS.w?1:0);
    if(joy.id!==null&&Math.hypot(joy.x,joy.y)>.2){ix=joy.x;iy=joy.y}
    const L=Math.hypot(ix,iy);P.moving=L>.1;if(P.moving){const k=Math.min(1,L)/L*(KEYS.shift?110:76)*dt;moveEnt(P,ix*k,iy*k);P.dir=Math.abs(ix)>Math.abs(iy)?(ix<0?2:3):(iy<0?1:0);const pa=Math.floor(P.anim);P.anim+=dt*8;if(Math.floor(P.anim)!==pa&&Math.floor(P.anim)%2===0)beep(110,.03,'triangle',.012)}
    P.fr=P.moving?1+(Math.floor(P.anim)%2):0;P.hf=P.moving?(P.hf||0)+dt*Math.min(1,L)*(KEYS.shift?110:76)/28*6:0;if(doorCD>0)doorCD-=dt;checkDoors();miradorTick();
    target=findTarget();const lab=targetLabel(target);if(lab!==lastTarget){lastTarget=lab;$('#prompt').innerHTML=TOUCH?esc(lab):'<kbd>E</kbd>'+esc(lab);$('#btnA').textContent=lab?lab.split(' ')[0].replace(/[:,.]$/,''):'A'}$('#prompt').classList.toggle('hidden',!lab);
    if(qs('fiesta')===1&&!S.f.fiestaOn&&P.map==='ext'&&(hour()>=18||hour()<3)&&P.x>33*T&&P.x<59*T&&P.y>25*T&&P.y<34*T)runFiesta();
    saveT+=dt;if(saveT>12){saveT=0;saveGame()}ambient(dt)}
  if(mode==='dialog')updDialog(dt);
  if(mode==='panel'&&SPORT)updateSport(dt);
  // bus
  const h=hour();if(BUS_H.includes(h)&&bus.last!==h+S.day*100&&!bus.active){bus.last=h+S.day*100;bus.active=true;bus.x=-90;bus.stop=0;bus.honked=false}
  if(bus.active){const stopX=20*T;if(bus.x<stopX&&bus.x+90*dt>=stopX&&!bus.stop){bus.stop=3;if(P.map==='ext'&&Math.abs(P.x-stopX)<300){beep(330,.25,'sawtooth',.03);setTimeout(()=>beep(262,.3,'sawtooth',.03),280)}}
    if(bus.stop>0)bus.stop-=dt;else bus.x+=90*dt;if(bus.stop<0)bus.stop=-1;if(bus.x>MAPS.ext.w*T+40)bus.active=false}
  for(const e of ENTS){if(e.kind==='npc')updNPC(e,dt);else if(e.kind==='ped'){if(e.z)updZPed(e,dt);else updPed(e,dt)}else updAnimal(e,dt)}
  const[tx,ty]=camTarget();const k=1-Math.exp(-dt*8);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
  if(!$('#editor').classList.contains('hidden')){prevT+=dt;drawPrev()}}

