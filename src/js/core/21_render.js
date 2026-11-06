// ================= RENDER =================
const glow=(()=>{const c=mk(64,64),g=c.getContext('2d');const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,190,90,.9)');gr.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return c})();
function darkness(){const h=S.t/60;if(h>=6.5&&h<17)return 0;if(h>=17&&h<19)return(h-17)/2*.62;if(h>=5&&h<6.5)return(6.5-h)/1.5*.62;return .62}
let qBlink=0;
function questNPC(id){const x2=questNPC2(id);if(x2)return x2;switch(id){case'ariana':case'nicolas':case'matias':if(qs('barra')===1&&!S.met[id])return 1;if(id==='ariana'&&fiestaReady()&&!qs('fiesta'))return 1;if(id==='nicolas'&&hasI('cargador'))return 1;if(id==='matias'&&S.f.dogFollow)return 1;return 0;
  case'papa':return qs('visita')===1&&!S.f.vPapa;case'mama':return(qs('visita')===1&&!S.f.vMama)||(qs('visita')===2&&!qs('tortillas'))||(qs('tortillas')===1&&hasI('tortillas'));case'marta':return!qs('gallo')&&qs('barra')===2||hasI('kiki');case'rosa':return qs('visita')===1&&!S.f.vGift&&!hasI('queque')&&!hasI('coca')||(qs('tortillas')===1&&!hasI('tortillas'));}return 0}
function render(dt){if(COMBAT){drawCombat();return}qBlink+=dt;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0d0b12';ctx.fillRect(0,0,VW,VH);if(!S)return;
  const m=MAPS[P.map];if(HD_ON&&m.hdDirty)hdEnsure(m);ctx.imageSmoothingEnabled=false;const cx=Math.round(cam.x*Z)/Z,cy=Math.round(cam.y*Z)/Z;
  ctx.setTransform(Z,0,0,Z,-cx*Z,-cy*Z);
  const sx=Math.max(0,Math.floor(cx)),sy=Math.max(0,Math.floor(cy)),sw=Math.min(m.w*T-sx,Math.ceil(VW/Z)+2),sh=Math.min(m.h*T-sy,Math.ceil(VH/Z)+2);
  if(sw>0&&sh>0){if(m.base2)ctx.drawImage(m.base2,sx*HDK,sy*HDK,sw*HDK,sh*HDK,sx,sy,sw,sh);else ctx.drawImage(m.base,sx,sy,sw,sh,sx,sy,sw,sh)}
  // pickups
  for(const p of PICKS){if(p.map!==P.map||!p.cond()||(p.kind==='none'||p.kind==='bottle'))continue;const X=p.x*T+8,Y=p.y*T+9;if(p.kind==='tazo'){R(ctx,'#8cc6d4',X-3,Y-1,1,7);R(ctx,'#8cc6d4',X+3,Y-1,1,7);R(ctx,'#bfe9f2',X-2,Y-1,5,7);R(ctx,'#e8fbff',X-3,Y-1,7,1);R(ctx,'#a5d6e2',X-2,Y+1,5,1);R(ctx,'#a5d6e2',X-2,Y+3,5,1);R(ctx,'#ffffff',X-2,Y,1,4);R(ctx,'#d64545',X-2,Y-4,4,3);R(ctx,'#3a2a1e',X-1,Y-3,2,1)}else{R(ctx,'#1d1a24',X-4,Y,8,3);R(ctx,'#e8e8e8',X-3,Y,6,1)}}
  drawActivities(ctx,qBlink);zoneGround(ctx);
  // entities
  const list=ENTS.filter(e=>e.map===P.map&&(e.kind!=='animal'||animalActive(e)||(e.special==='firulais'&&S.f.dogFollow)));list.push(P);if(HD_ON&&typeof carProxies==='function')carProxies(list,P.map);if(typeof progProxies==='function')progProxies(list,P.map);list.sort((a,b)=>a.y-b.y);
  if(HD_ON){for(const e of list)npcTick(e);hdShadows(m,list,cx,cy)}
  for(const e of list){if(e.kind==='carv'){e.draw(ctx);continue}const X=Math.round(e.x),Y=Math.round(e.y-(e.zl||0));R(ctx,'rgba(0,0,0,.25)',X-5,Y-2,10,3);R(ctx,'rgba(0,0,0,.18)',X-6,Y-1,12,1);
    if(e.kind==='animal'){if(HD_ON){const d=aniDraw(e);ctx.drawImage(d.img,X+d.x,Y+d.y,d.w,d.h)}else{const s=animSpr(e.type,e.col,e.fr,e.dir===2);ctx.drawImage(s,X-(s.width>>1),Y-s.height+1)}}
    else{const c=e===P?CH.player:e.c;if(e===P)heroDraw(ctx,X,Y,e);else if(HD_ON&&e.c){const d=npcDraw(e);ctx.drawImage(d.img,X+d.x,Y+d.y,d.w,d.h)}else ctx.drawImage(sprite(c,e.dir,e.fr),X-9,Y-25);if(e.kind==='npc'&&(questNPC(c.id)||S.activities.delivery===c.id)){const b=Math.round(Math.sin(qBlink*5)*1.5);R(ctx,'#1d1a24',X-2,Y-36+b,5,9);R(ctx,'#f2c94c',X-1,Y-35+b,3,5);R(ctx,'#f2c94c',X-1,Y-29+b,3,2)}}}
  if(P.map==='ext'&&bus.active){const X=Math.round(bus.x),Y=21*T-14;R(ctx,'rgba(0,0,0,.25)',X+2,Y+26,84,4);R(ctx,'#1d1a24',X-1,Y-1,90,28);R(ctx,'#f4f4f4',X,Y,88,26);R(ctx,'#2a6fb0',X,Y+14,88,5);R(ctx,'#d6453c',X,Y+19,88,2);for(let i=0;i<6;i++)R(ctx,'#5b7c99',X+6+i*13,Y+3,10,9);R(ctx,'#5b7c99',X+80,Y+3,7,12);R(ctx,'#2a2a30',X+12,Y+23,10,5);R(ctx,'#2a2a30',X+64,Y+23,10,5);R(ctx,'#f2c94c',X+85,Y+19,3,3)}
  if(sw>0&&sh>0){if(m.top2)ctx.drawImage(m.top2,sx*HDK,sy*HDK,sw*HDK,sh*HDK,sx,sy,sw,sh);else ctx.drawImage(m.top,sx,sy,sw,sh,sx,sy,sw,sh)}
  zoneAir(ctx);
  // fiesta lights
  if(S.f.fiestaOn&&P.map==='ext'){for(let i=0;i<14;i++){const X=35*T+i*16,Y=27*T-2+Math.sin(i*.9)*4;R(ctx,['#d6453c','#f2c94c','#7bd16b','#3f7fd1'][(i+Math.floor(qBlink*3))%4],X,Y,3,3)}}
  ctx.setTransform(1,0,0,1,0,0);
  if(HD_ON)hdLight(m,cx,cy);else{
  // rain
  if(S.rain&&!m.interior){ctx.fillStyle='rgba(40,60,90,.18)';ctx.fillRect(0,0,VW,VH);ctx.strokeStyle='rgba(200,220,255,.55)';ctx.lineWidth=Math.max(1,Z/3);ctx.beginPath();for(let i=0;i<90;i++){const x=(hsh(i,Math.floor(qBlink*20))*VW),y=(hsh(Math.floor(qBlink*20),i)*VH);ctx.moveTo(x,y);ctx.lineTo(x-Z*2,y+Z*6)}ctx.stroke()}
  // night
  let a=darkness();if(m.interior)a*=.45;if(S.rain&&!m.interior)a=Math.max(a,.15);
  if(a>0.01){lctx.globalCompositeOperation='source-over';lctx.clearRect(0,0,lcv.width,lcv.height);lctx.fillStyle=`rgba(12,16,48,${a})`;lctx.fillRect(0,0,lcv.width,lcv.height);lctx.globalCompositeOperation='destination-out';
    const lights=m.lights.slice();if(S.f.fiestaOn&&!m.interior)lights.push({x:39.5*T,y:29*T,r:110});lights.push({x:P.x,y:P.y-8,r:26});
    for(const l of lights){const X=(l.x-cx)*Z/4,Y=(l.y-cy)*Z/4,r=l.r*Z/4;if(X<-r||Y<-r||X>lcv.width+r||Y>lcv.height+r)continue;const gr=lctx.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');lctx.fillStyle=gr;lctx.fillRect(X-r,Y-r,r*2,r*2)}
    ctx.imageSmoothingEnabled=true;ctx.drawImage(lcv,0,0,VW,VH);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a*.5;
    for(const l of lights){if(!l.pole&&!m.interior)continue;const X=(l.x-cx)*Z,Y=(l.y-cy)*Z,r=l.r*Z*.6;ctx.drawImage(glow,X-r,Y-r,r*2,r*2)}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.imageSmoothingEnabled=false}}
  zoneScreen(ctx,cx,cy);
  if(m.interior&&m.b&&m.b.kind==='shop')shopFX(ctx,m,cx,cy);
  if(mode!=='menu')drawHUD()}
let hudT=0;
function drawHUD(){hudT++;if(hudT%6)return;const hh=hour(),mm=Math.floor(S.t%60),en=Math.round(E().en);$('#hTime').textContent=(hh%12||12)+':'+String(mm).padStart(2,'0');$('#hAmpm').textContent=hh<12?'a. m.':'p. m.';$('#hDay').textContent='Día '+S.day;$('#hRain').classList.toggle('hidden',!S.rain);$('#hMoney').textContent=fmtC(S.money);const eb=$('#hEn');eb.style.width=en+'%';eb.className=en<20?'low':en<45?'mid':'';$('#hEnN').textContent=en;const m=MAPS[P.map];$('#loc').textContent=mapLabel(m);
  const act=QORDER.find(q=>qs(q)===1);$('#qhint').textContent=hudHint(act);
  drawMini();if(bigOpen())drawBigMap()}

