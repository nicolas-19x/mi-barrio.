// ================= NEIGHBORHOOD ACTIVITIES =================
const ACT_POINTS=[
 ...[0,1,2].map(i=>({map:'ext',x:3+i*2,y:7,label:'Huerta · parcela '+(i+1),run:()=>gardenTalk(i)})),
 {map:'ext',x:51,y:29,label:'Jugar penales',run:()=>startSport()},
 {map:'ext',x:20,y:23,label:'Tablón de mandados',run:()=>deliveryTalk(null)}
];
const LITTER=[[12,23],[26,22],[36,25],[42,33],[55,35],[22,39]];
LITTER.forEach(([x,y],i)=>PICKS.push({id:'rec'+i,map:'ext',x,y,kind:'bottle',lab:'Recoger reciclaje',cond:()=>S.activities.recycled[i]!==S.day,take(){S.activities.recycled[i]=S.day;S.activities.stats.recycle++;S.money+=ACTIVITY_RULES.recycleReward();toast('Reciclaje · + ₡150');checkBadges();saveGame()}}));
const BADGES=[['harvest','Manos verdes',3],['recycle','Barrio limpio',6],['delivery','De confianza',3],['cook','Sazón de casa',3],['penalties','La nueva promesa',1],['inlaw','Yerno ejemplar',6]];
function checkBadges(){for(const[k,label,n]of BADGES)if(S.activities.stats[k]>=n&&!S.activities.badges[k]){S.activities.badges[k]=1;toast('★ Medalla: '+label);beepSeq([659,880,1046])}}
function totalMinutes(){return S.day*1440+S.t}
function gardenTalk(i){const a=S.activities,p=a.plots[i];
 if(!p){say(null,'La tierra está lista. Hay semillas de tomate junto a la parcela.',[{t:'Sembrar tomates',f(){a.plots[i]={planted:totalMinutes(),watered:false};toast('Parcela '+(i+1)+' sembrada');saveGame()}},{t:'Volver luego'}]);return}
 if(!p.watered&&E().cut.agua){say(null,'No sale agua del tubo: el recibo está vencido. Pagalo en Finanzas.');return}
 if(!p.watered){say(null,'Los brotes necesitan agua.',[{t:'Regar la parcela',f(){p.watered=true;toast('¡Regado!');saveGame()}},{t:'Ahora no'}]);return}
 if(ACTIVITY_RULES.cropReady(p,totalMinutes())){say(null,'¡Los tomates están maduros!',[{t:'Cosechar',f(){addI('tomate',3);a.plots[i]=null;a.stats.harvest++;checkBadges();saveGame()}},{t:'Dejarlos un rato'}]);return}
 const left=Math.ceil(Math.max(0,180-(totalMinutes()-p.planted)));say(null,'Los tomates siguen creciendo. Faltan unos '+left+' minutos del barrio.');
}
function deliveryTalk(id){const a=S.activities;if(a.delivery){say(id,'El mandado es para '+N(a.delivery)+'. Buscalo en '+locLabel(locFor(CH[a.delivery]))+'.');return}
 if(!ACTIVITY_RULES.canDaily(a.deliveryDay,S.day)){say(id,'Ya hiciste el mandado de hoy. Mañana habrá otro pedido.');return}
 const dest=['mama','matias','ariana'][(S.day-1)%3];say(id,'Hay un pedido para '+N(dest)+'. Te pagan ₡800 por llevarlo.',[{t:'Aceptar mandado',f(){a.delivery=dest;addI('paquete');saveGame()}},{t:'Más tarde'}]);
}
function deliver(id){const a=S.activities;remI('paquete');a.delivery=null;a.deliveryDay=S.day;a.stats.delivery++;S.money+=ACTIVITY_RULES.deliveryReward();say(id,'¡Mi pedido! Muchas gracias por traerlo. Tomá ₡800.');checkBadges();saveGame()}
function cookTalk(){if(!hasI('tomate')){say(null,'Podés preparar picadillo con dos tomates de tu huerta. La cocina tiene los demás ingredientes.');return}if(S.inv.tomate<2){say(null,'Te falta un tomate: necesitás dos para el picadillo.');return}
 say(null,'El chorreador huele a café y la olla está lista.',[{t:'Cocinar picadillo (2 tomates)',f(){remI('tomate');remI('tomate');addI('picadillo');S.activities.stats.cook++;checkBadges();saveGame()}},{t:'Ahora no'}]);}
function openActivities(){const a=S.activities;
 let h='<div class="activity-grid"><button data-view="garden">🌱 Huerta</button><button data-view="jobs">📦 Mandados</button><button data-view="sport">⚽ Penales</button><button data-view="badges">★ Medallas</button><button data-eco="fin">💰 Finanzas</button><button data-eco="casa">🏠 Mi casa</button><button data-eco="hist">📖 Historias</button></div>';
 h+='<h3>Hoy en el barrio</h3><div class="qitem"><b>Huerta detrás de tu casa</b><p>'+a.plots.map((p,i)=>'Parcela '+(i+1)+': '+(!p?'vacía':!p.watered?'sin regar':ACTIVITY_RULES.cropReady(p,totalMinutes())?'lista para cosechar':'creciendo')).join(' · ')+'</p></div>';
 h+='<div class="qitem"><b>Mandado</b><p>'+(a.delivery?'Pedido para '+esc(N(a.delivery))+' · '+esc(locLabel(locFor(CH[a.delivery]))):a.deliveryDay===S.day?'Completado hoy':'Disponible en la pulpería o el tablón de la parada')+'</p></div>';
 h+='<div class="qitem"><b>Reciclaje</b><p>'+Object.values(a.recycled).filter(d=>d===S.day).length+'/6 recogidos hoy · ₡150 por botella</p></div>';
 openPanel('Vida de barrio',h);$('#pbody').querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=b.dataset.view;if(v==='badges')openBadges();else {closePanel();const dest=v==='garden'?[5,8]:v==='sport'?[51,30]:[20,23];openPanel(v==='garden'?'Huerta':v==='sport'?'Cancha del parque':'Mandados','<p>'+({garden:'Tres parcelas detrás de tu casa. Sembrá, regá y cosechá tomates; podés venderlos o cocinar en casa.',sport:'La bola te espera en el centro de la cancha del parque.',jobs:'Los pedidos están en la pulpería y en el tablón de la parada.'}[v])+'</p><p>Destino marcado en el minimapa.</p>');activityMarker=dest}});
}
let activityMarker=null;
function openBadges(){openPanel('Medallas del barrio',BADGES.map(([k,t,n])=>'<div class="qitem '+(S.activities.badges[k]?'done':'')+'"><b>'+(S.activities.badges[k]?'★ ':'◇ ')+t+'</b><p>'+Math.min(S.activities.stats[k],n)+' / '+n+'</p><div class="meter"><span style="width:'+Math.min(100,S.activities.stats[k]/n*100)+'%"></span></div></div>').join(''))}
// ---------- Penales: tanda de 5 con dirección + altura, portero que lee y aprende ----------
const PEN_LEVELS=['Aficionado','Mejenga','Liga menor','Primera','Leyenda'];
const PEN_CROWD=['#d6453c','#f2c94c','#3f7fd1','#f4ead2','#2e9e6b','#f193b4','#f2994a'];
const PEN_BANNER={goal:['¡GOOOOL!','#f2c94c'],save:['¡ATAJADA!','#7fc3e8'],post:['¡AL PALO!','#f4ead2'],bar:['¡AL TRAVESAÑO!','#f4ead2'],wide:['¡AFUERA!','#d6453c'],over:['¡POR ENCIMA!','#d6453c']};
const penTri=x=>{const f=((x%2)+2)%2;return f<1?f*2-1:3-f*2};
const penLevel=()=>Math.max(0,Math.min(4,S.f.penLevel||0));
let SPORT=null;
function startSport(){const near=P.map==='ext'&&Math.hypot(P.x-51*T,P.y-29*T)<80;if(!near)return;
 const lv=penLevel();
 SPORT={phase:'ready',t:0,time:0,lv,shot:0,goals:0,res:[],ax:0,ay:0,lx:0,ly:0,sx:1,sy:1,off:0,offY:0,clock:0,limit:5.5-lv*.4,ball:null,k:null,parts:[],shake:0,cheer:0,net:0,netX:240,netY:100,banner:null,hist:(S.f.penHist||[]).slice(-6),mark:null,final:null,fans:penFans(),chat:[],laugh:0};
 openPanel('Penales en el parque','<canvas id="sport" width="480" height="270"></canvas><p id="score"></p><div class="row"><button id="shoot" class="green">Prepará el tiro…</button><span id="sportResult" aria-live="polite"></span></div><p class="note">Tocá el campo, el botón o Espacio: primero fijá la dirección y después la altura. Los palos y el travesaño no perdonan, y el portero aprende de tus tiros. Los vecinos miran desde la tapia y no perdonan una.</p>'); $('#panel').classList.add('sport-fullscreen');
 $('#shoot').onclick=e=>{e.currentTarget.blur();sportPress()};
 $('#sport').addEventListener('pointerdown',e=>{e.preventDefault();sportPress()});
 sportUI();beep(2300,.18,'sine',.04);setTimeout(()=>beep(2300,.1,'sine',.04),220)}
function sportUI(){const f=SPORT;if(!f||!$('#score'))return;const b=$('#shoot');
 const lab={ready:'Prepará el tiro…',aimX:'Fijar dirección',aimY:'Fijar altura',flight:'…',result:'…',done:'↻ Otra tanda'}[f.phase];b.textContent=lab;b.disabled=!(f.phase==='aimX'||f.phase==='aimY'||f.phase==='done');
 $('#score').textContent='Tiro '+Math.min(5,f.shot+(f.phase==='done'?0:1))+' / 5 · '+f.goals+' goles · Nivel '+PEN_LEVELS[f.lv]}
function sportPress(){const f=SPORT;if(!f)return;ac();if(f.phase==='aimY'){const n=$('#panel .note');if(n)n.classList.add('gone')}
 if(f.phase==='aimX'){f.lx=f.ax;f.phase='aimY';f.t=0;beep(880,.05,'square',.04);sportUI()}
 else if(f.phase==='aimY'){f.ly=f.ay;beep(1100,.05,'square',.04);sportKick()}
 else if(f.phase==='done'){SPORT=null;startSport()}}
function sportKick(){const f=SPORT,L=f.lv;
 let tx=240+f.lx*150,ty=148-(f.ly+1)/2*112;
 const tr=2+L*2.5+(f.shot===4?3:0);tx+=rnd(-1,1)*tr;ty+=rnd(-1,1)*tr*.6;
 const zone=ACTIVITY_RULES.penaltyZone(tx,ty),T=.58-L*.03;
 // El portero: a veces lee tu tiro, si no, apuesta según tu costumbre
 const side=tx<216?-1:tx>264?1:0,hbT=ty<92?2:ty<122?1:0,pr=.1+L*.13+(f.shot>=3?.04:0);let s,hb;
 if(Math.random()<pr){s=side;hb=Math.random()<.35+L*.12?hbT:pick([0,1,1,2])}
 else{const l=f.hist.filter(v=>v<0).length,r=f.hist.filter(v=>v>0).length,bias=Math.min(.45,L*.09)*Math.sign(r-l);let wl=.44-bias*.5,wr=.44+bias*.5,w0=.12;if(bias<0){wl=.44-bias;wr=.44+bias}
  const x=Math.random()*(wl+w0+wr);s=x<wl?-1:x<wl+w0?0:1;hb=pick([0,1,1,2]);if(s===0&&hb===0)hb=1}
 f.k={s,hb,ky:[140,114,86][hb],react:Math.max(.05,.22-L*.025+rnd(-.03,.09)),dur:.36-L*.02,dx:70+L*9,armW:24+L*3,armH:26+L*2};
 f.hist.push(side);f.hist=f.hist.slice(-6);S.f.penHist=f.hist;
 f.ball={t:0,T,sx:240,sy:226,tx,ty,zone,x:240,y:226,gy:226,sc:9,vx:0,vy:0,gl:190,mode:'fly',spin:0,alpha:1};f.phase='flight';f.t=0;f.banner=null;f.mark=null;
 beep(110,.09,'triangle',.07,55);sportUI()}
function keeperAt(f,t){const k=f.k,p=Math.max(0,Math.min(1,(t-k.react)/k.dur)),e=1-Math.pow(1-p,2);return{x:240+k.s*k.dx*e,y:124+(k.ky-124)*e-Math.sin(p*Math.PI)*(k.hb===2?6:0),p,e}}
function sportLand(f){const b=f.ball,kp=keeperAt(f,b.T);
 const saved=b.zone==='goal'&&ACTIVITY_RULES.keeperSaves(kp.x,kp.y,b.tx,b.ty,f.k.armW,f.k.armH);
 const out=saved?'save':b.zone;f.res.push(out==='goal'?1:0);if(out==='goal')f.goals++;
 b.x=b.tx;b.y=b.ty;b.mode='phys';b.sc=5.5;f.mark={x:b.tx,y:b.ty,t:0};
 if(out==='goal'){b.vx=rnd(-14,14);b.vy=-22;b.gl=156;f.net=1;f.netX=b.tx;f.netY=b.ty;f.cheer=1.2;f.shake=.6;for(let i=0;i<46;i++)f.parts.push({x:b.tx,y:b.ty,vx:rnd(-110,110),vy:rnd(-190,-40),life:rnd(.9,1.6),c:pick(PEN_CROWD)});beep(523,.1,'square',.05);setTimeout(()=>beep(659,.1,'square',.05),90);setTimeout(()=>beep(784,.22,'square',.05),180)}
 else if(out==='save'){b.vx=(b.tx<kp.x?-1:1)*rnd(70,130);b.vy=-rnd(80,130);b.gl=186;f.shake=.35;beep(210,.16,'sawtooth',.06,120)}
 else if(out==='post'||out==='bar'){b.vx=out==='post'?(b.tx<240?1:-1)*rnd(50,90):rnd(-30,30);b.vy=out==='post'?-rnd(30,70):rnd(70,110);b.gl=190;f.shake=.7;beep(1250,.12,'triangle',.07,700)}
 else{b.mode='away';b.vx=(b.tx-b.sx)/b.T*.45;b.vy=(b.ty-b.sy)/b.T*.45;beep(150,.2,'triangle',.04,90)}
 f.out=out;penChat(f,out);f.banner={t:0,txt:PEN_BANNER[out][0],col:PEN_BANNER[out][1]};f.phase='result';f.t=0;
 S.activities.lastPen=out;$('#sportResult')&&($('#sportResult').textContent='');sportUI()}
function sportNext(f){f.shot++;
 if(f.shot>=5){sportFinish(f);return}
 f.phase='aimX';f.t=0;f.clock=0;f.banner=null;f.ball=null;f.k=null;f.mark=null;
 f.sx=1.1+f.lv*.28+f.shot*.06;f.sy=1.5+f.lv*.3+f.shot*.06;f.off=rnd(0,2);f.offY=rnd(0,2);sportUI()}
function sportFinish(f){const g=f.goals,first=ACTIVITY_RULES.canDaily(S.activities.penaltyDay,S.day);
 S.activities.stats.penalties+=g>=3?1:0;
 let reward=0;if(first){reward=ACTIVITY_RULES.penaltyReward(g);if(reward)reward+=ACTIVITY_RULES.penaltyBonus(g)}
 if(reward){S.money+=reward;S.activities.penaltyDay=S.day;toast('Penales · + ₡'+reward)}
 const best=S.f.penBest||0;if(g>best)S.f.penBest=g;
 let up='';if(g>=4&&f.lv<4){S.f.penLevel=f.lv+1;up=' · ¡Subís a nivel '+PEN_LEVELS[f.lv+1]+'!'}else if(g===0&&f.lv>0){S.f.penLevel=f.lv-1;up=' · Bajás a nivel '+PEN_LEVELS[f.lv-1]}
 f.final=g===5?'¡PERFECTO!':g>=3?'¡BUENA TANDA!':'SEGUÍ PRACTICANDO';f.banner={t:0,txt:f.final,col:g>=3?'#f2c94c':'#f4ead2'};f.phase='done';f.t=0;f.ball=null;f.k=null;
 if(g>=3){f.cheer=2;beepSeq([659,784,1046,1318])}
 checkBadges();saveGame();sportUI();
 const r=$('#sportResult');if(r)r.textContent=g+' goles'+(reward?' · + ₡'+reward:first?'':' · (ya cobraste hoy)')+up+(S.f.penBest?' · Récord '+S.f.penBest:'')}
function updateSport(dt){const f=SPORT,cvs=$('#sport');if(!f||!cvs)return;f.time+=dt;
 f.shake=Math.max(0,f.shake-dt*2.2);f.cheer=Math.max(0,f.cheer-dt*.5);f.net=Math.max(0,f.net-dt*.9);if(f.banner)f.banner.t+=dt;if(f.mark)f.mark.t+=dt;for(const c of f.chat)c.t+=dt;f.laugh=Math.max(0,f.laugh-dt);
 for(const p of f.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=380*dt;p.life-=dt}f.parts=f.parts.filter(p=>p.life>0);
 if(f.phase==='ready'){f.t+=dt;if(f.t>1){f.phase='aimX';f.t=0;f.clock=0;f.sx=1.1+f.lv*.28;f.sy=1.5+f.lv*.3;f.off=rnd(0,2);f.offY=rnd(0,2);sportUI()}}
 else if(f.phase==='aimX'||f.phase==='aimY'){f.t+=dt;f.clock+=dt;if(f.phase==='aimX')f.ax=penTri(f.t*f.sx+f.off);f.ay=penTri(f.t*f.sy+f.offY);if(f.clock>=f.limit){sportPress()}}
 else if(f.phase==='flight'){const b=f.ball;b.t+=dt;const u=Math.min(1,b.t/b.T);b.x=b.sx+(b.tx-b.sx)*u;b.gy=b.sy+(b.ty-b.sy)*u;b.y=b.gy-Math.sin(Math.PI*u)*12;b.sc=9-3.5*u;b.spin+=dt*18;if(u>=1)sportLand(f)}
 else if(f.phase==='result'||f.phase==='done'){f.t+=dt;const b=f.ball;if(b){b.spin+=dt*8*Math.abs(b.vx)/60;
   if(b.mode==='phys'){b.vy+=420*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y>b.gl){b.y=b.gl;b.vy=-b.vy*.35;b.vx*=.6}}
   else if(b.mode==='away'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.sc=Math.max(1,b.sc-dt*3);b.alpha=Math.max(0,b.alpha-dt*1.3)}}
  if(f.phase==='result'&&f.t>1.7)sportNext(f)}
 drawSport(cvs.getContext('2d'),f)}
// ---- Escena del barrio: fondo estático en caché + vecinos que miran la mejenga ----
let PEN_BG=null;
const PEN_CHAT={goal:['¡Qué golazo!','¡Mae, más guabero!','¡Qué guaba, mae!','¡Tuanis, qué tiro!','¡Eso, mae, pura vida!'],save:['¡Diay, diay, Matías!','JAJAJAJA ¡se la tapó!','¡Qué atajadón, jaja!','¡Ay, qué risa!'],post:['¡Uy, casi, mae!','¡Qué pecado!','¡Al palo, diay!'],bar:['¡Uy, casi!','¡Qué sufrimiento, mae!'],wide:['¡Qué bruto pa\' ser malo!','¡Eso fue a Cartago!','Diay, mae... ¡jajaja!','¡Qué pecado, mae!'],over:['¡Ahí va para Heredia!','¡Qué bruto pa\' ser malo!','¡Se perdió, mae!']};
const PEN_LAUGH=['JAJAJAJA','jajaja ¡ay no!','¡jajaja!','JA JA JA'];
function penFans(){const M=(id,o)=>fillChar(Object.assign({id,v:1,name:id},o));
 return[
  {c:M('pf_abuelo',{hair:'calvo',hairColor:'#d8d8d8',skin:'#b97a4a',shirt:'#f0e6d2',pants:'#7a4b2a',acc:'sombrero',accColor:'#d9b36c'}),x:26,y:154,dir:0,s:2,sit:'banca',ph:.3},
  {c:M('pf_dona',{hair:'moño',hairColor:'#8a8a8a',skin:'#e0ac69',shirt:'#c2577a',pants:'#4b3b5b',acc:'lentes'}),x:60,y:154,dir:0,s:2,sit:'banca',ph:1.9},
  {c:M('pf_cole1',{hair:'corto',hairColor:'#2a1810',skin:'#d9a066',shirt:'#9cc8ee',pants:'#2d3a6e'}),x:90,y:152,dir:3,s:1.5,ph:.9},
  {c:M('pf_cole2',{hair:'cola',hairColor:'#5a3a1e',skin:'#c68e5e',shirt:'#f4f4f4',pants:'#2d3a6e'}),x:106,y:154,dir:3,s:1.5,ph:2.6},
  {c:M('pf_cole3',{hair:'rizos',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#9cc8ee',pants:'#2d3a6e'}),x:388,y:153,dir:2,s:1.5,ph:3.4},
  {c:M('pf_cole4',{hair:'moño',hairColor:'#2b1a10',skin:'#f1c27d',shirt:'#f4f4f4',pants:'#2d3a6e',acc:'aretes',accColor:'#f2c94c'}),x:405,y:152,dir:2,s:1.5,ph:4.2},
  {c:M('pf_llanta',{hair:'corto',hairColor:'#c8a24a',skin:'#f1c27d',shirt:'#e74c3c',pants:'#2c3e50',acc:'gorra',accColor:'#2e86de'}),x:430,y:156,dir:0,s:2,sit:'llanta',ph:5.1},
  {c:M('pf_senora',{hair:'largo',hairColor:'#2a1810',skin:'#c98b5c',shirt:'#7bb661',pants:'#5a4632',acc:'collar',accColor:'#f5c542'}),x:458,y:156,dir:0,s:2,sit:'silla',ph:.6}]}
function penFanTop(a){return a.sit?a.y-50:a.y-Math.round(26*a.s)+1}
function penDrawFan(g,f,a){const c=a.c,x=a.x,y=a.y,s=a.s,laugh=f.laugh>0,jump=f.cheer>0?-Math.max(0,Math.sin(f.time*12+a.ph))*Math.min(a.sit?2:4,f.cheer*3):laugh?-Math.abs(Math.sin(f.time*22+a.ph))*2:0,idle=Math.sin(f.time*2+a.ph)>.92?-1:0,jx=laugh?Math.round(Math.sin(f.time*35+a.ph)):0,yy=Math.round(y+jump+idle);
 R(g,'rgba(0,0,0,.25)',x-13*(s/2)-4,y-2,26*(s/2)+8,4);
 if(!a.sit){drawCharAt(g,c,a.dir,0,x-Math.round(9*s)+jx,yy-Math.round(25*s),Math.round(18*s),Math.round(26*s));return}
 const sh=a.sit==='llanta'?11:14,sp=sprite(c,a.dir,0);
 if(a.sit==='banca'){R(g,'#5c3d24',x-21,y-sh+3,3,sh-3);R(g,'#5c3d24',x+18,y-sh+3,3,sh-3)}
 else if(a.sit==='silla'){R(g,'#ece6cf',x-12,y-48,24,22);R(g,'#c9c2ae',x-12,y-48,24,2);R(g,'#ece6cf',x-14,y-sh,28,3);R(g,'#c9c2ae',x-13,y-sh+3,2,sh-3);R(g,'#c9c2ae',x+11,y-sh+3,2,sh-3)}
 else{R(g,'#2a2a30',x-16,y-11,32,11);R(g,'#4a4a52',x-16,y-11,32,3);R(g,'#17171c',x-8,y-7,16,4)}
 g.drawImage(sp,0,0,18,19,x-18+jx,yy-sh-38,36,38);
 if(a.sit==='banca')R(g,'#8a6a45',x-24,y-sh,48,4);
 R(g,c.pants,x-10+jx,yy-sh,20,6);R(g,shade(c.pants,-.25),x-10+jx,yy-sh+5,20,1);R(g,c.pants,x-10+jx,yy-sh+6,7,sh-9);R(g,c.pants,x+3+jx,yy-sh+6,7,sh-9);R(g,'#2a2228',x-11+jx,y-3,9,3);R(g,'#2a2228',x+2+jx,y-3,9,3)}
function penChat(f,out){f.chat=[];if(!f.fans.length)return;const a=pick(f.fans);let t=pick(PEN_CHAT[out]);if(t.includes('Matías'))t=t.replace('Matías',N('matias'));f.chat.push({fan:a,txt:t,t:0});
 if(out==='save'||out==='wide'||out==='over'){f.laugh=1.6;const b=pick(f.fans.filter(x=>x!==a));if(b)f.chat.push({fan:b,txt:pick(PEN_LAUGH),t:.15})}}
// ---- Pantalla de penales en alta resolución (sin deformar, nítida en cualquier pantalla) ----
const PV={k:1,dpr:1,W:1,H:1,cw:1,ch:1,ox:0,oy:0,x0:0,y0:0,x1:480,y1:270};
function penView(cvs){const dpr=Math.min(window.devicePixelRatio||1,2),cw=Math.max(1,cvs.clientWidth||480),ch=Math.max(1,cvs.clientHeight||270),W=Math.round(cw*dpr),H=Math.round(ch*dpr);
 if(cvs.width!==W||cvs.height!==H){cvs.width=W;cvs.height=H}
 let k=Math.min(W/(cw<ch?300:360),H/238);if(k>=2&&k-Math.floor(k)<.3)k=Math.floor(k);
 const cy=cw<ch?150:139;
 Object.assign(PV,{k,dpr,W,H,cw,ch,ox:Math.round(W/2-240*k),oy:Math.round(H/2-cy*k)});
 PV.x0=-PV.ox/k;PV.y0=-PV.oy/k;PV.x1=(W-PV.ox)/k;PV.y1=(H-PV.oy)/k}
function penPal(){const h=((S.t/60)%24+24)%24;
 if(h>=5.5&&h<16)return{id:'dia',sky:['#3f93d6','#86c6ee','#d4ecf6'],far:'#a9cdb9',near:'#79ad8a',cloud:'#ffffff',cloudSh:'#d3e5f1',shadows:1};
 if(h>=16&&h<18)return{id:'tarde',sky:['#4f86c9','#e9b98a','#f7d9a2'],far:'#b8b494',near:'#8da477',cloud:'#fff1dc',cloudSh:'#e9c39a',sun:[392,40,'#ffd27a'],tint:'rgba(255,160,70,.10)',shadows:1};
 if(h>=18&&h<19.5)return{id:'ocaso',sky:['#1f2457','#a24f78','#f2945a'],far:'#6b5878',near:'#4c5266',cloud:'#f3a9a0',cloudSh:'#8a5470',sun:[392,46,'#ff8a4f'],tint:'rgba(80,40,110,.22)',lights:1};
 return{id:'noche',sky:['#050816','#101845','#22306a'],far:'#1b2840',near:'#121c2c',cloud:'#2a3560',cloudSh:'#1a2244',moon:[384,22],tint:'rgba(6,10,38,.48)',lights:1,stars:1}}
function penRR(g,x,y,w,h,r){r=Math.min(r,w/2,h/2);g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.quadraticCurveTo(x+w,y,x+w,y+r);g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath()}
function penChalk(g,x0,y0,x1,y1,w){const n=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/2));for(let i=0;i<n;i++){const h=hsh(i+(x0|0)*3,(y1|0)+i);if(h<.1)continue;const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;R(g,h<.3?'rgba(238,233,216,.55)':'#eee9d8',Math.round(x),Math.round(y),2,w||2)}}
function penBuildBg(pal){const k=PV.k,m=Math.ceil(10*k),c=mk(PV.W+m*2,PV.H+m*2),g=c.getContext('2d');c.m=m;
 const T0=gg=>{gg.setTransform(k,0,0,k,PV.ox+m,PV.oy+m);gg.imageSmoothingEnabled=false};T0(g);
 const X0=Math.floor(PV.x0)-12,X1=Math.ceil(PV.x1)+12,Y0=Math.floor(PV.y0)-12,Y1=Math.ceil(PV.y1)+12,XW=X1-X0;
 let L=null,lg=null;if(pal.lights){L=mk(c.width,c.height);lg=L.getContext('2d');T0(lg);lg.globalCompositeOperation='lighter'}
 const glow=(x,y,r,a,col)=>{if(!lg)return;col=col||'255,205,120';const gr=lg.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+col+','+a+')');gr.addColorStop(1,'rgba('+col+',0)');lg.fillStyle=gr;lg.fillRect(x-r,y-r,r*2,r*2)};
 // Cielo
 const sk=g.createLinearGradient(0,Math.min(Y0,-60),0,58);sk.addColorStop(0,pal.sky[0]);sk.addColorStop(.62,pal.sky[1]);sk.addColorStop(1,pal.sky[2]);g.fillStyle=sk;g.fillRect(X0,Y0,XW,80-Y0);
 if(pal.stars){const n=Math.round(XW*(56-Y0)/240);for(let i=0;i<n;i++){const x=X0+hsh(i,71)*XW,y=Y0+hsh(i,73)*(50-Y0),b=hsh(i,79);R(g,b>.85?'#ffffff':'rgba(220,230,255,'+(.3+b*.45).toFixed(2)+')',Math.round(x),Math.round(y),b>.94?2:1,b>.94?2:1)}}
 if(pal.sun){const[sx,sy,sc]=pal.sun,gr=g.createRadialGradient(sx,sy,0,sx,sy,80);gr.addColorStop(0,sc);gr.addColorStop(.15,sc);gr.addColorStop(.17,'rgba(255,215,150,.55)');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(sx-80,sy-80,160,160)}
 if(pal.moon){const[mx,my]=pal.moon,gr=g.createRadialGradient(mx,my,0,mx,my,46);gr.addColorStop(0,'rgba(220,230,255,.35)');gr.addColorStop(1,'rgba(220,230,255,0)');g.fillStyle=gr;g.fillRect(mx-46,my-46,92,92);g.fillStyle='#f3f0dc';g.beginPath();g.arc(mx,my,7,0,7);g.fill();g.fillStyle='#d6d1b8';g.beginPath();g.arc(mx+2,my+1,1.8,0,7);g.arc(mx-3,my-2,1.2,0,7);g.arc(mx-1,my+4,1,0,7);g.fill()}
 // Nubes
 const cloud=(x,y,s)=>{const P=[[0,3,7],[9,0,10],[20,2,8],[29,5,6],[13,5,8]];g.fillStyle=pal.cloudSh;for(const[a,b,r]of P){g.beginPath();g.arc(x+a*s,y+(b+2.5)*s,r*s,0,7);g.fill()}g.fillStyle=pal.cloud;for(const[a,b,r]of P){g.beginPath();g.arc(x+a*s,y+b*s,r*s,0,7);g.fill()}};
 g.globalAlpha=pal.stars?.55:.95;for(let row=0;;row++){const y=24-row*58;if(y<Y0-30)break;for(let xi=Math.floor((X0-60)/130);xi*130<X1+60;xi++){const h=hsh(xi,row*7+3);if(h<.38)continue;cloud(xi*130+hsh(xi,row+11)*60,y+hsh(row,xi+5)*16-8,.6+hsh(xi*3,row)*.55)}}g.globalAlpha=1;
 // Cerros con perspectiva atmosférica
 const ryF=x=>34-Math.abs(Math.sin(x*.011+1.3))*13-Math.sin(x*.033+2.6)*7,ryN=x=>46-Math.abs(Math.sin(x*.017+.4))*8-Math.sin(x*.05+1)*4;
 const ridge=(fn,col,col2)=>{g.beginPath();g.moveTo(X0,90);for(let x=X0;x<=X1+2;x+=2)g.lineTo(x,fn(x));g.lineTo(X1+2,90);g.closePath();const gr=g.createLinearGradient(0,14,0,60);gr.addColorStop(0,col);gr.addColorStop(1,col2);g.fillStyle=gr;g.fill()};
 ridge(ryF,shade(pal.far,.12),pal.far);
 for(let i=0;i<Math.round(XW/9);i++){const x=Math.round(X0+hsh(i,91)*XW),y=Math.round(ryF(x)+3+hsh(i,93)*10);if(y>ryN(x)-1)continue;if(pal.lights){R(g,hsh(i,97)<.7?'#ffd98a':'#fff4d0',x,y,1,1);if(hsh(i,99)<.12)glow(x,y,5,.5)}else{R(g,hsh(i,97)<.6?'#f4f0e6':'#d0846a',x,y,2,1)}}
 ridge(ryN,shade(pal.near,.08),shade(pal.near,-.12));
 // Casas con techo de zinc detrás de la tapia
 const HC=[['#e9dcb5','#a3acb2'],['#a6d8cb','#b07a52'],['#f3cd57','#c0473b'],['#f3afc0','#8f9aa1'],['#a9c8ef','#9a5a3c'],['#cde6a8','#a3acb2'],['#f6efe2','#6f8f6a']];
 for(let i=Math.floor((X0+12)/88)-1;i<=Math.ceil((X1+12)/88);i++){const X=-12+i*88,hv=hsh(i,41),Y=14+Math.round(hv*8),w=84,[wl,rf]=HC[((i%7)+7)%7];
  R(g,wl,X,Y+20,w,40);R(g,shade(wl,.12),X,Y+22,w,2);R(g,shade(wl,-.16),X,Y+46,w,14);R(g,'rgba(0,0,0,.2)',X,Y+20,w,3);
  R(g,rf,X-3,Y,w+6,22);for(let q=0;q<w+6;q+=3){R(g,shade(rf,.25),X-3+q,Y,1,22);R(g,shade(rf,-.18),X-2+q,Y,1,22)}R(g,shade(rf,.4),X-3,Y+1,w+6,1);R(g,shade(rf,-.45),X-3,Y+20,w+6,2);
  for(let r=0;r<4;r++)R(g,'rgba(120,60,30,.32)',X+((hsh(i,r)*w)|0),Y+3+r*5,2+(r%2),2);
  if(hv>.6){R(g,'#5b5f66',X+w-18,Y-10,1,11);R(g,'#5b5f66',X+w-24,Y-8,13,1);R(g,'#5b5f66',X+w-22,Y-5,9,1)}else if(hv<.2){R(g,'#2c4f7a',X+10,Y-9,14,10);R(g,'#3e6aa0',X+10,Y-9,14,2);R(g,'#1e3a5c',X+12,Y-1,1,2);R(g,'#1e3a5c',X+21,Y-1,1,2)}
  const wx=X+12+((hsh(i,5)*28)|0),wy=Y+27;R(g,'#f4efe3',wx-2,wy-2,22,17);R(g,shade(wl,-.35),wx-2,wy+15,22,1);
  if(pal.lights&&hsh(i,9)<.75){R(g,'#ffd98a',wx,wy,18,13);R(g,'#fff0c0',wx+2,wy+2,6,4);glow(wx+9,wy+6,26,.42)}else{R(g,'#4f6f8c',wx,wy,18,13);R(g,'#86abc8',wx+1,wy+1,6,3);R(g,'#86abc8',wx+1,wy+5,2,2)}
  R(g,'#2a2630',wx+8,wy,2,13);R(g,'#2a2630',wx,wy+6,18,1);R(g,hv<.5?'#d6453c':'#3f7fd1',wx,wy,3,10);R(g,hv<.5?'#d6453c':'#3f7fd1',wx+15,wy,3,10);
  if(i%2){R(g,'#9b523f',wx-1,wy+13,20,3);for(let j=0;j<5;j++){R(g,'#3f8a3e',wx+j*4,wy+10,3,3);R(g,j%2?'#f2c94c':'#f193b4',wx+1+j*4,wy+9,2,2)}}
  else{const lx=wx+26;R(g,'#e6dac3',lx,wy+5,30,1);for(let j=0;j<3;j++){const cl=['#f4ead2','#73c9df','#f193b4'][j];R(g,cl,lx+2+j*10,wy+6,7,9);R(g,shade(cl,-.2),lx+2+j*10,wy+13,7,2);R(g,'#8a8a8a',lx+4+j*10,wy+5,1,2)}}}
 // Árboles de mango y palmas
 const tree=(x,y,r)=>{R(g,'#5a3d24',x-2,y+8,5,30);R(g,'#7a5a36',x-2,y+8,2,30);disc(g,'#245a2b',x+1,y+3,r);disc(g,'#2e6e33',x,y,r-1);disc(g,'#3f8a3e',x-4,y-4,r-6);disc(g,'#58a64c',x-8,y-8,Math.max(3,r-14));for(let q=0;q<7;q++)R(g,'#6cbc5a',x-r+4+((hsh(x,q)*r*1.5)|0),y-r+5+((hsh(q,x)*r)|0),2,2);for(let q=0;q<4;q++)R(g,['#f2994a','#f2c94c','#e0802f','#f2b632'][q],x-10+((hsh(q,x+3)*20)|0),y+((hsh(x+3,q)*12)|0),3,3)};
 for(let i=Math.floor(X0/150)-1;i<=Math.ceil(X1/150);i++){if(hsh(i,67)<.8)tree(150*i+((hsh(i,61)*30)|0),34+((hsh(i,63)*8)|0),17+((hsh(i,69)*6)|0))}
 const palm=(x,y)=>{for(let i=0;i<34;i++){const xx=x+Math.round(Math.sin(i*.09)*3);R(g,i%4?'#8b6a43':'#6f5233',xx,y+i,4,1)}g.lineCap='round';const F=[[-16,-2],[16,-2],[-12,8],[12,8],[0,-12],[-7,-10],[8,-9]];g.strokeStyle='#2f7a34';g.lineWidth=3;for(const[a,b]of F){g.beginPath();g.moveTo(x+2,y);g.quadraticCurveTo(x+2+a*.5,y-8+b*.3,x+2+a,y+2+b);g.stroke()}g.strokeStyle='#58a64c';g.lineWidth=1.1;for(const[a,b]of F.slice(0,5)){g.beginPath();g.moveTo(x+2,y-1);g.quadraticCurveTo(x+2+a*.5,y-9+b*.3,x+2+a,y+1+b);g.stroke()}g.lineCap='butt';disc(g,'#6b4a2b',x+1,y+2,2);disc(g,'#6b4a2b',x+4,y+3,2)};
 for(let n=Math.floor((X0-22)/300);22+n*300<X1+20;n++)palm(22+n*300,24);
 // Postes, cables y reflectores
 const poles=[];for(let n=Math.floor((X0-84)/280)-1;84+n*280<X1+300;n++)poles.push(84+n*280);
 g.strokeStyle='rgba(20,18,24,.85)';g.lineWidth=.9;for(let i=0;i<poles.length-1;i++){const a=poles[i],b=poles[i+1];for(const kk of[0,1]){g.beginPath();g.moveTo(a+6-kk*12,12+kk*3);g.quadraticCurveTo((a+b)/2,26+kk*3,b+6-kk*12,12+kk*3);g.stroke()}}
 for(const X of poles){R(g,'#8f8a80',X-2,0,4,60);R(g,'#b4afa4',X-2,0,1,60);R(g,'#6f6a60',X+1,0,1,60);R(g,'#6f6a60',X-9,11,18,2);R(g,'#d9d4c8',X+5,9,3,2);R(g,'#d9d4c8',X-8,9,3,2);
  for(const s of[-1,1]){const lx=X+s*8-5;R(g,'#2f3238',lx,1,10,7);R(g,'#4a4e57',lx,1,10,1);R(g,pal.lights?'#fff6d6':'#c9cfd6',lx+1,6,8,2);if(lg){glow(lx+5,7,30,.85,'255,240,205');lg.save();const gr=lg.createLinearGradient(0,8,0,230);gr.addColorStop(0,'rgba(255,240,205,.10)');gr.addColorStop(1,'rgba(255,240,205,0)');lg.fillStyle=gr;const xc=X+(240-X)*.75;lg.beginPath();lg.moveTo(lx+2,8);lg.lineTo(lx+8,8);lg.lineTo(xc+110,230);lg.lineTo(xc-110,230);lg.closePath();lg.fill();lg.restore()}}}
 if(lg){lg.save();lg.translate(240,205);lg.scale(1,.3);const gr=lg.createRadialGradient(0,0,0,0,0,280);gr.addColorStop(0,'rgba(255,238,200,.26)');gr.addColorStop(1,'rgba(255,238,200,0)');lg.fillStyle=gr;lg.fillRect(-280,-280,560,560);lg.restore()}
 // Tapia de zinc pintado con base de bloques
 const tg=g.createLinearGradient(0,56,0,136);tg.addColorStop(0,'#8ad0c2');tg.addColorStop(1,'#5c9c90');g.fillStyle=tg;g.fillRect(X0,56,XW,82);
 for(let x=Math.floor(X0/6)*6;x<X1;x+=6){R(g,'rgba(40,95,85,.45)',x,59,1,77);R(g,'rgba(210,250,240,.35)',x+2,59,1,77);R(g,'rgba(40,95,85,.14)',x+3,59,2,77)}
 for(let x=Math.floor(X0/48)*48;x<X1;x+=48){R(g,'rgba(25,65,58,.55)',x,57,1,79);for(const ry of[62,98,130])R(g,'#3e6f67',x+2,ry,1,1)}
 for(let i=0;i<Math.round(XW/40);i++){const x=Math.round(X0+hsh(i,3)*XW),y=60+((hsh(3,i)*55)|0),h=10+((hsh(i,7)*18)|0),gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'rgba(150,80,40,.5)');gr.addColorStop(1,'rgba(150,80,40,0)');g.fillStyle=gr;g.fillRect(x,y,2,h)}
 for(let i=0;i<Math.round(XW/14);i++)R(g,'rgba(190,205,200,.55)',Math.round(X0+hsh(i,13)*XW),62+((hsh(13,i)*70)|0),1+((hsh(i,17)*3)|0),1);
 R(g,'#5f5e52',X0,55,XW,4);R(g,'#8b8a7a',X0,55,XW,1);R(g,'rgba(0,0,0,.25)',X0,59,XW,2);
 const bg2=g.createLinearGradient(0,136,0,152);bg2.addColorStop(0,'#c9c2b1');bg2.addColorStop(1,'#9f988a');g.fillStyle=bg2;g.fillRect(X0,136,XW,16);R(g,'rgba(0,0,0,.2)',X0,136,XW,1);
 for(let x=Math.floor(X0/14)*14;x<X1;x+=14){R(g,'#8f887a',x,137,1,7);R(g,'#8f887a',x+7,145,1,7)}R(g,'#8f887a',X0,144,XW,1);
 for(let i=0;i<Math.round(XW/5);i++)R(g,hsh(i,31)<.5?'#5c8a44':'#7aa356',Math.round(X0+hsh(i,29)*XW),148+((hsh(29,i)*4)|0),1+((hsh(i,37)*2)|0),1);
 // Murales y carteles
 g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 g.font='900 19px monospace';g.lineWidth=4.5;g.strokeStyle='#14101c';g.strokeText('BARRIO',60,82);{const gr=g.createLinearGradient(0,74,0,90);gr.addColorStop(0,'#ffc2d6');gr.addColorStop(1,'#e2608f');g.fillStyle=gr}g.fillText('BARRIO',60,82);
 R(g,'#14101c',14,95,92,4);R(g,'#2a6fb0',16,96,18,2);R(g,'#f4f4f4',34,96,10,2);R(g,'#d6453c',44,96,32,2);R(g,'#f4f4f4',76,96,10,2);R(g,'#2a6fb0',86,96,18,2);
 g.globalAlpha=.9;[['#2a6fb0',4],['#f4f4f4',4],['#d6453c',8],['#f4f4f4',4],['#2a6fb0',4]].reduce((y,[cl,h])=>{R(g,cl,150,y,54,h);return y+h},74);g.globalAlpha=1;for(let i=0;i<10;i++)R(g,'#7cc0b3',150+((hsh(i,53)*52)|0),74+((hsh(53,i)*23)|0),2,1);
 g.font='900 11px monospace';g.fillStyle='rgba(244,240,225,.8)';g.fillText('PURA VIDA',292,86);g.font='900 7px monospace';g.fillStyle='rgba(20,16,28,.55)';g.fillText('— la plaza —',292,97);
 R(g,'rgba(0,0,0,.25)',384,72,80,34);R(g,'#f4ead2',382,70,80,34);R(g,'#c0473b',382,70,80,8);R(g,'rgba(240,230,170,.85)',380,68,7,4);R(g,'rgba(240,230,170,.85)',457,68,7,4);g.fillStyle='#f4ead2';g.font='bold 7px monospace';g.fillText('FIESTA',422,74.5);g.fillStyle='#14101c';g.fillText('Sábado en el',422,86);g.fillText('parque · 6 pm',422,95);
 R(g,'#f2c94c',470,112,8,8);R(g,'#d6453c',471,114,6,2);
 if(X1>500){R(g,'#f4f4f4',520,78,58,26);R(g,'#d6453c',520,78,58,2);R(g,'#d6453c',520,102,58,2);g.fillStyle='#d6453c';g.font='bold 7px monospace';g.fillText('PROHIBIDO',549,86);g.fillText('BOTAR BASURA',549,95)}
 if(X0<-40){g.font='900 10px monospace';g.lineWidth=3;g.strokeStyle='#14101c';g.strokeText('SE VENDEN',-80,80);g.strokeText('COPOS ♥',-80,93);g.fillStyle='#f2c94c';g.fillText('SE VENDEN',-80,80);g.fillStyle='#73c9df';g.fillText('COPOS ♥',-80,93)}
 // Cancha
 const fg=g.createLinearGradient(0,152,0,Math.max(300,Y1));fg.addColorStop(0,'#4a8a3c');fg.addColorStop(.4,'#5ea64b');fg.addColorStop(1,'#70b858');g.fillStyle=fg;g.fillRect(X0,152,XW,Y1-152);
 {let y=152,h=5,n=0;while(y<Y1){if(n%2)g.fillStyle='rgba(255,255,240,.05)',g.fillRect(X0,y,XW,h);y+=h;h*=1.16;n++}}
 {const gr=g.createLinearGradient(0,152,0,166);gr.addColorStop(0,'rgba(0,0,0,.3)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(X0,152,XW,14)}
 const area=XW*(Y1-152);for(let i=0;i<Math.min(8000,area/60);i++){const x=Math.round(X0+hsh(i,11)*XW),y=152+Math.round(hsh(i,13)*(Y1-152)),far=y<195,h=hsh(i,17);R(g,far?(h<.5?'#437f37':'#5f9f4c'):(h<.5?'#4c8d3e':'#7cc262'),x,y,1,far?1:2);if(!far&&i%3===0)R(g,'#86ca6a',x+1,y-1,1,2)}
 const patch=(cx,cy,rw,rh,a)=>{g.save();g.translate(cx,cy);g.scale(1,rh/rw);const gr=g.createRadialGradient(0,0,0,0,0,rw);gr.addColorStop(0,'rgba(150,108,72,'+a+')');gr.addColorStop(.6,'rgba(146,104,70,'+(a*.85).toFixed(2)+')');gr.addColorStop(1,'rgba(150,108,72,0)');g.fillStyle=gr;g.fillRect(-rw,-rw,rw*2,rw*2);g.restore();
  for(let i=0;i<rw*.9;i++){const an=hsh(i,cx)*6.283,d=Math.sqrt(hsh(cy,i))*.75;R(g,hsh(i,i+cx)<.5?'#76573e':'#b6936a',Math.round(cx+Math.cos(an)*rw*d),Math.round(cy+Math.sin(an)*rh*d),hsh(i,3)<.3?2:1,1)}};
 patch(240,160,120,10,.9);patch(240,229,32,11,.95);patch(52,232,30,10,.6);patch(430,206,28,9,.55);patch(130,214,14,5,.5);patch(330,246,22,6,.4);
 for(let i=0;i<Math.min(400,area/1800);i++){const x=Math.round(X0+hsh(i,23)*XW),y=166+Math.round(hsh(i,29)*(Y1-170)),c2=['#f2c94c','#f193b4','#ffffff'][i%3];R(g,'#3c803d',x,y+2,1,3);R(g,c2,x-1,y,3,2)}
 penChalk(g,X0,153,X1,153);penChalk(g,96,153,70,198);penChalk(g,70,198,410,198);penChalk(g,410,198,384,153);
 penChalk(g,-34,153,-142,252);penChalk(g,514,153,622,252);penChalk(g,Math.max(X0,-142),252,Math.min(X1,622),252);
 for(let i=0;i<=40;i++){const t=i/40,x=(1-t)*(1-t)*80+2*(1-t)*t*240+t*t*400,y=(1-t)*(1-t)*252+2*(1-t)*t*280+t*t*252;if(hsh(i,7)>.1)R(g,'#eee9d8',Math.round(x),Math.round(y),2,2)}
 R(g,'rgba(0,0,0,.18)',236,230,9,2);disc(g,'#eee9d8',240,229,2);
 // Utilería: bici, cajón de frescos, hielera y botella
 g.lineCap='round';g.strokeStyle='#14101c';g.lineWidth=2;g.beginPath();g.arc(22,242,9,0,7);g.stroke();g.beginPath();g.arc(50,242,9,0,7);g.stroke();g.strokeStyle='#6b6578';g.lineWidth=.6;for(const cx of[22,50])for(let a=0;a<6;a++){g.beginPath();g.moveTo(cx,242);g.lineTo(cx+Math.cos(a)*8,242+Math.sin(a)*8);g.stroke()}
 g.strokeStyle='#d6453c';g.lineWidth=2;g.beginPath();g.moveTo(22,242);g.lineTo(32,230);g.lineTo(46,230);g.lineTo(50,242);g.moveTo(32,230);g.lineTo(40,242);g.lineTo(22,242);g.moveTo(46,230);g.lineTo(44,225);g.stroke();g.lineCap='butt';R(g,'#14101c',29,227,8,2);R(g,'#14101c',42,224,7,2);
 R(g,'rgba(0,0,0,.22)',408,247,40,4);R(g,'#c49d6c',410,230,34,18);R(g,'#d8b585',410,230,34,2);R(g,'#8a6a45',410,236,34,1);R(g,'#8a6a45',410,230,1,18);R(g,'#8a6a45',443,230,1,18);for(let i=0;i<4;i++){const cl=['#f2c94c','#d6453c','#7bb661','#f2994a'][i];R(g,cl,413+i*8,222,5,10);R(g,'rgba(255,255,255,.45)',414+i*8,223,1,7);R(g,'#14101c',414+i*8,220,3,2)}
 R(g,'rgba(0,0,0,.22)',448,251,26,3);R(g,'#2a6fb0',450,238,22,13);R(g,'#f4f4f4',450,236,22,4);R(g,'#d9d9d9',450,239,22,1);R(g,'#14101c',457,234,8,2);
 R(g,'#bce7ee',14,160,5,14);R(g,'#73c9df',15,164,3,8);R(g,'#d64545',14,158,5,3);
 c.light=L;return c}
// Arco con profundidad: marco delantero, trasero y red
const PG={fl:120,fr:360,ft:61,fb:152,bl:134,br:346,bt:70,bb:141};
function penNetPt(f,x,y){if(!(f.net>0))return[x,y];const G=PG,bx=G.bl+(f.netX-G.fl)/(G.fr-G.fl)*(G.br-G.bl),by=G.bt+(f.netY-G.ft)/(G.fb-G.ft)*(G.bb-G.bt),dx=x-bx,dy=y-by,d=Math.hypot(dx,dy)+.001,o=f.net*8*Math.exp(-d/32)*(.65+.35*Math.cos(f.time*22-d*.25));return[x+dx/d*o*.35,y-o*.5+dy/d*o*.2]}
function penGoalBack(g,f){const G=PG;
 g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.moveTo(G.fl,G.fb);g.lineTo(G.fr,G.fb);g.lineTo(G.br,G.bb);g.lineTo(G.bl,G.bb);g.closePath();g.fill();
 g.fillStyle='rgba(255,255,255,.07)';g.fillRect(G.bl,G.bt,G.br-G.bl,G.bb-G.bt);
 g.strokeStyle='#9c9584';g.lineWidth=1.6;g.beginPath();g.moveTo(G.bl,G.bb);g.lineTo(G.bl,G.bt);g.lineTo(G.br,G.bt);g.lineTo(G.br,G.bb);g.moveTo(G.fl,G.ft);g.lineTo(G.bl,G.bt);g.moveTo(G.fr,G.ft);g.lineTo(G.br,G.bt);g.moveTo(G.fl,G.fb);g.lineTo(G.bl,G.bb);g.moveTo(G.fr,G.fb);g.lineTo(G.br,G.bb);g.stroke();
 g.strokeStyle='rgba(248,244,230,.45)';g.lineWidth=.55;g.beginPath();const st=7;
 for(let x=G.bl;x<=G.br+.1;x+=st){for(let y=G.bt,j=0;y<=G.bb+.1;y+=3.5,j++){const[px,py]=penNetPt(f,x,y);j?g.lineTo(px,py):g.moveTo(px,py)}}
 for(let y=G.bt;y<=G.bb+.1;y+=st){for(let x=G.bl,j=0;x<=G.br+.1;x+=3.5,j++){const[px,py]=penNetPt(f,x,y);j?g.lineTo(px,py):g.moveTo(px,py)}}g.stroke();
 const side=(fx,bx)=>{g.beginPath();for(let i=0;i<=13;i++){const t=i/13;g.moveTo(fx,G.ft+(G.fb-G.ft)*t);g.lineTo(bx,G.bt+(G.bb-G.bt)*t)}for(let j=1;j<4;j++){const u=j/4,x=fx+(bx-fx)*u;g.moveTo(x,G.ft+(G.bt-G.ft)*u);g.lineTo(x,G.fb+(G.bb-G.fb)*u)}g.stroke()};
 g.strokeStyle='rgba(248,244,230,.32)';side(G.fl,G.bl);side(G.fr,G.br);
 g.beginPath();for(let i=0;i<=30;i++){const t=i/30;g.moveTo(G.fl+(G.fr-G.fl)*t,G.ft);g.lineTo(G.bl+(G.br-G.bl)*t,G.bt)}for(let j=1;j<3;j++){const u=j/3,y=G.ft+(G.bt-G.ft)*u;g.moveTo(G.fl+(G.bl-G.fl)*u,y);g.lineTo(G.fr+(G.br-G.fr)*u,y)}g.stroke();
 g.strokeStyle='rgba(248,244,230,.28)';g.lineWidth=.8;g.beginPath();g.moveTo(G.bl,G.bb);g.quadraticCurveTo(240,G.bb+6,G.br,G.bb);g.stroke()}
let PEN_GK=null;
function penGK(){const kc=CH.matias||CH.player;if(!PEN_GK||PEN_GK.src!==kc||PEN_GK.sv!==kc.v){PEN_GK=fillChar(Object.assign({},kc,{id:'pen_gk_'+kc.id,shirt:'#f2c94c',pants:'#1d1a24'}));PEN_GK.src=kc;PEN_GK.sv=kc.v}return PEN_GK}
function penGlove(g,x,y,s){R(g,'#14101c',x-1,y-1,s+2,s+2);R(g,'#f4f4f4',x,y,s,s);R(g,'#3fa66b',x,y+s-2,s,2);R(g,'#ffffff',x+1,y+1,2,1)}
function penKeeper(g,f,pal){const kc=penGK();let kp={x:240,y:124,p:0,e:0},rot=0,crouch=0;
 const act=f.k&&f.ball&&(f.phase==='flight'||f.phase==='result'),kt=act?(f.phase==='flight'?f.ball.t:f.ball.T+f.t):0;
 if(act){kp=keeperAt(f,kt);rot=f.k.s*kp.e*1.15}
 else if(f.phase==='ready'||f.phase==='aimX'||f.phase==='aimY'){kp.x=240+Math.sin(f.time*2.2)*7;kp.y=124+Math.abs(Math.sin(f.time*4.4))*-2;crouch=1}
 const lift=Math.max(0,124-kp.y);g.fillStyle='rgba(0,0,0,'+Math.max(.1,.3-lift*.004).toFixed(3)+')';g.beginPath();g.ellipse(kp.x,152,Math.max(8,15+kp.e*12-lift*.15),3,0,0,7);g.fill();
 const body=(p,r,a)=>{g.save();g.globalAlpha=a;g.translate(Math.round(p.x),Math.round(p.y));g.rotate(r);if(crouch)g.scale(1.04,.97);drawCharAt(g,kc,0,0,-18,-26,36,52);
  if(p.p>.05){R(g,kc.skin,-21,-24,3,16);R(g,kc.skin,18,-24,3,16);R(g,'#f2c94c',-21,-14,3,6);R(g,'#f2c94c',18,-14,3,6);penGlove(g,-24,-31,8);penGlove(g,16,-31,8)}else{penGlove(g,-22,-1,7);penGlove(g,15,-1,7)}g.restore()};
 if(act&&kp.p>0&&kp.p<1)for(const j of[2,1]){const q=keeperAt(f,kt-j*.035);body(q,f.k.s*q.e*1.15,.13/j)}
 body(kp,rot,1)}
function penPosts(g,f,pal){const vib=f.phase==='result'&&(f.out==='post'||f.out==='bar')?Math.sin(f.t*70)*Math.exp(-f.t*5)*1.4:0,vp=f.out==='post'?vib:0,vb=f.out==='bar'?vib:0,bt=f.ball?f.ball.tx:240;
 if(pal.shadows){g.fillStyle='rgba(0,0,0,.15)';for(const px of[117,356]){g.beginPath();g.moveTo(px,152);g.lineTo(px+7,152);g.lineTo(px+27,172);g.lineTo(px+20,172);g.closePath();g.fill()}g.fillRect(137,171,246,2.5)}
 const tube=(x,y,w,h,vert)=>{const gr=vert?g.createLinearGradient(x,0,x+w,0):g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#fbf8ee');gr.addColorStop(.3,'#ffffff');gr.addColorStop(.7,'#d6cfbb');gr.addColorStop(1,'#958d77');g.fillStyle=gr;g.fillRect(x,y,w,h);g.fillStyle='rgba(20,16,28,.6)';if(vert){g.fillRect(x-.6,y,.6,h);g.fillRect(x+w,y,.6,h)}else{g.fillRect(x,y-.6,w,.6);g.fillRect(x,y+h,w,.6)}};
 const lx=117+(bt<240?vp:0),rx=356+(bt>=240?vp:0);
 tube(lx,62,7,90,1);tube(rx,62,7,90,1);tube(117,58+vb,246,7,0);
 for(const px of[lx,rx])for(let i=0;i<5;i++)R(g,'rgba(168,100,60,.8)',px+1+((i*3)%4),68+i*17,2,3);for(let i=0;i<7;i++)R(g,'rgba(168,100,60,.8)',130+i*33,60+vb,3,2);
 R(g,'rgba(60,40,20,.4)',114,150,13,3);R(g,'rgba(60,40,20,.4)',353,150,13,3)}
function penShooter(g,f){let x=204,y=198,fr=0;
 if(f.phase==='ready'){const u=Math.min(1,f.t);x=192+12*u;y=212-14*u;fr=Math.floor(f.time*8)%2}
 else if(f.ball&&(f.phase==='flight'||f.phase==='result')){const u=f.phase==='flight'?Math.min(1,f.ball.t/.1):1;x=204+10*u;y=198-8*u;fr=f.phase==='flight'&&f.ball.t<.18?1:0}
 if(f.phase==='result'&&f.out==='goal')y-=Math.abs(Math.sin(f.t*9))*5*Math.max(0,1-f.t/1.6);
 const br=f.phase==='aimX'||f.phase==='aimY'?Math.sin(f.time*3)*.6:0;
 g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+20,Math.min(y+57,260),13,3.2,0,0,7);g.fill();
 drawCharAt(g,CH.player,1,fr,Math.round(x),Math.round(y+br),40,58)}
const PEN_PENT=[[Math.PI/2,0],[-Math.PI/2,0]];for(let i=0;i<5;i++){PEN_PENT.push([.4636,i*1.2566]);PEN_PENT.push([-.4636,i*1.2566+.6283])}
function penBall(g,x,y,r,spin){r=Math.max(2,r);
 g.fillStyle='#1d1a24';g.beginPath();g.arc(x,y,r+.8,0,7);g.fill();
 const gr=g.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r*1.05);gr.addColorStop(0,'#ffffff');gr.addColorStop(.55,'#efefeb');gr.addColorStop(1,'#b1b0bb');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();
 g.save();g.beginPath();g.arc(x,y,r,0,7);g.clip();g.fillStyle='#26222e';const tl=.45,ct=Math.cos(tl),st=Math.sin(tl);
 for(const[la,lo]of PEN_PENT){const Lo=lo+spin,X=Math.cos(la)*Math.sin(Lo),Y=-Math.sin(la),Z=Math.cos(la)*Math.cos(Lo),Y2=Y*ct-Z*st,Z2=Y*st+Z*ct;if(Z2<-.1)continue;
  const cx=x+X*r,cy=y+Y2*r,s=r*.36,an=Math.atan2(Y2,X),e1x=Math.cos(an),e1y=Math.sin(an),sq=Math.max(.25,Z2);g.beginPath();
  for(let q=0;q<5;q++){const a=q*1.2566+spin*.3,la2=Math.cos(a)*s*sq,lb=Math.sin(a)*s;const px=cx+e1x*la2-e1y*lb,py=cy+e1y*la2+e1x*lb;q?g.lineTo(px,py):g.moveTo(px,py)}g.closePath();g.fill()}
 const sh=g.createRadialGradient(x-r*.35,y-r*.4,r*.2,x,y,r*1.05);sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(.7,'rgba(40,40,70,0)');sh.addColorStop(1,'rgba(40,40,70,.38)');g.fillStyle=sh;g.fillRect(x-r,y-r,r*2,r*2);
 g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.ellipse(x-r*.4,y-r*.45,r*.22,r*.15,-.6,0,7);g.fill();g.restore()}
function penDrawBall(g,f,b){g.globalAlpha=b.alpha;const r=b.sc;
 if(b.mode==='fly'){(b.tr||(b.tr=[])).push([b.x,b.y]);if(b.tr.length>9)b.tr.shift()}else if(b.tr&&b.tr.length)b.tr.shift();
 if(b.tr&&b.tr.length>1){g.lineCap='round';for(let i=1;i<b.tr.length;i++){const a=i/b.tr.length;g.strokeStyle='rgba(255,255,255,'+(a*.35).toFixed(3)+')';g.lineWidth=r*1.5*a;g.beginPath();g.moveTo(b.tr[i-1][0],b.tr[i-1][1]);g.lineTo(b.tr[i][0],b.tr[i][1]);g.stroke()}g.lineCap='butt'}
 const gy=b.mode==='fly'?226+(154-226)*Math.min(1,b.t/b.T)+r*.8:b.mode==='phys'?b.gl+r*.6:b.y+r,h=Math.max(0,gy-b.y-r);
 g.fillStyle='rgba(0,0,0,'+Math.max(.06,.3-h*.004).toFixed(3)+')';g.beginPath();g.ellipse(b.x,gy,r*(1+h*.008),r*.32,0,0,7);g.fill();
 penBall(g,b.x,b.y,r,b.spin);g.globalAlpha=1}
function penFx(f){if(f._ph===f.phase)return;f._ph=f.phase;const P2=(x,y,vx,vy,life,c,t)=>f.parts.push({x,y,vx,vy,life,l0:life,c,t});
 if(f.phase==='flight'){for(let i=0;i<12;i++)P2(240+rnd(-7,7),231,rnd(-45,45),rnd(-70,-15),rnd(.35,.6),'#c9b08a','dust')}
 else if(f.phase==='result'&&f.ball){const b=f.ball,o=f.out;
  if(o==='goal'){for(const p of f.parts)if(!p.t){p.t='conf';p.l0=p.life}for(const a of f.fans)for(let i=0;i<7;i++)P2(a.x+rnd(-6,6),penFanTop(a)+8,rnd(-70,70),rnd(-230,-120),rnd(1.2,2),pick(PEN_CROWD),'conf')}
  else if(o==='save'){for(let i=0;i<16;i++)P2(b.tx+rnd(-4,4),b.ty+rnd(-4,4),rnd(-100,100),rnd(-100,30),rnd(.3,.55),'#f4efe0','dust')}
  else if(o==='post'||o==='bar'){for(let i=0;i<18;i++)P2(b.tx,b.ty,rnd(-170,170),rnd(-170,60),rnd(.2,.45),pick(['#fff6b0','#ffd35a','#ffffff']),'spark')}}}
function penAim(g,f){if(f.phase!=='aimX'&&f.phase!=='aimY')return;const t=f.time;
 g.lineCap='round';g.strokeStyle='rgba(20,16,28,.8)';g.lineWidth=5;g.beginPath();g.moveTo(90,46);g.lineTo(390,46);g.stroke();g.strokeStyle='rgba(244,234,210,.35)';g.lineWidth=2;g.stroke();g.strokeStyle='#3fa66b';g.beginPath();g.moveTo(126,46);g.lineTo(354,46);g.stroke();
 const tri=(x,y,col)=>{g.fillStyle='#14101c';g.beginPath();g.moveTo(x-6,y-8);g.lineTo(x+6,y-8);g.lineTo(x,y+1);g.closePath();g.fill();g.fillStyle=col;g.beginPath();g.moveTo(x-4,y-7);g.lineTo(x+4,y-7);g.lineTo(x,y-1);g.closePath();g.fill()};
 if(f.phase==='aimX'){const x=240+f.ax*150,gr=g.createLinearGradient(0,50,0,158);gr.addColorStop(0,'rgba(242,201,76,.5)');gr.addColorStop(1,'rgba(242,201,76,0)');g.fillStyle=gr;g.fillRect(x-5,50,10,108);
  g.strokeStyle='rgba(20,16,28,.7)';g.lineWidth=2.6;g.beginPath();g.moveTo(x,52);g.lineTo(x,158);g.stroke();g.setLineDash([4,3]);g.strokeStyle='#f2c94c';g.lineWidth=1.3;g.stroke();g.setLineDash([]);tri(x,46,'#f2c94c')}
 else{const lx=240+f.lx*150,yy=148-(f.ay+1)/2*112,tr=2+f.lv*2.5+(f.shot===4?3:0);
  g.strokeStyle='rgba(244,234,210,.45)';g.lineWidth=1;g.beginPath();g.moveTo(lx,52);g.lineTo(lx,158);g.stroke();tri(lx,46,'#f4ead2');
  const gr=g.createLinearGradient(80,0,400,0);gr.addColorStop(0,'rgba(242,201,76,0)');gr.addColorStop(.5,'rgba(242,201,76,.35)');gr.addColorStop(1,'rgba(242,201,76,0)');g.fillStyle=gr;g.fillRect(80,yy-3,320,6);
  g.setLineDash([2,4]);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1.3;g.beginPath();g.moveTo(240,220);g.quadraticCurveTo((240+lx)/2,Math.min(yy,220)-28,lx,yy);g.stroke();g.setLineDash([]);
  g.fillStyle='rgba(214,69,60,.16)';g.beginPath();g.ellipse(lx,yy,tr+4,(tr+4)*.6+2,0,0,7);g.fill();g.setLineDash([2,2]);g.strokeStyle='rgba(255,210,200,.6)';g.lineWidth=.8;g.stroke();g.setLineDash([]);
  const pr=8+Math.sin(t*10)*1.2;g.strokeStyle='#14101c';g.lineWidth=3.6;g.beginPath();g.arc(lx,yy,pr,0,7);g.stroke();g.strokeStyle='#ff5a4a';g.lineWidth=1.8;g.stroke();
  g.strokeStyle='#14101c';g.lineWidth=3;g.beginPath();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){g.moveTo(lx+a*(pr+2),yy+b*(pr+2));g.lineTo(lx+a*(pr+7),yy+b*(pr+7))}g.stroke();g.strokeStyle='#fff';g.lineWidth=1.4;g.stroke();
  g.fillStyle='#fff';g.beginPath();g.arc(lx,yy,1.4,0,7);g.fill()}
 g.lineCap='butt'}
function penBanner(g,f){const bn=f.banner;if(!bn)return;const x1=Math.min(1,bn.t*4),c1=1.70158,e=x1<1?1+(c1+1)*Math.pow(x1-1,3)+c1*Math.pow(x1-1,2):1,cy=108+Math.sin(f.time*9)*1.5,good=bn.col==='#f2c94c';
 g.save();g.translate(240,cy);
 if(good){g.save();g.rotate(f.time*.5);g.fillStyle='rgba(255,226,130,'+(.18*Math.min(1,bn.t*3)).toFixed(3)+')';for(let i=0;i<14;i++){g.beginPath();g.moveTo(0,0);g.arc(0,0,170,i*.4488,i*.4488+.2);g.closePath();g.fill()}g.restore()}
 g.scale(e,e);const sz=30;g.font='900 '+sz+'px monospace';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 g.lineWidth=8;g.strokeStyle='rgba(0,0,0,.35)';g.strokeText(bn.txt,0,3);g.lineWidth=6.5;g.strokeStyle='#14101c';g.strokeText(bn.txt,0,0);
 const gr=g.createLinearGradient(0,-sz/2,0,sz/2);gr.addColorStop(0,'#ffffff');gr.addColorStop(.45,bn.col);gr.addColorStop(1,shade(bn.col,-.25));g.fillStyle=gr;g.fillText(bn.txt,0,0);g.restore()}
function penHUD(g,f){const d=PV.dpr,u=d*Math.max(.9,Math.min(1.6,Math.min(PV.cw/420,PV.ch/300))),W=PV.W;
 const bw=Math.round(240*u),bh=Math.round(48*u),bx=Math.round(W/2-bw/2),by=Math.round(8*d);
 penRR(g,bx,by+3*u,bw,bh,9*u);g.fillStyle='rgba(0,0,0,.35)';g.fill();penRR(g,bx,by,bw,bh,9*u);g.fillStyle='rgba(18,14,28,.92)';g.fill();g.lineWidth=2*u;g.strokeStyle='#14101c';g.stroke();penRR(g,bx+2.5*u,by+2.5*u,bw-5*u,bh-5*u,7*u);g.lineWidth=u;g.strokeStyle='rgba(244,234,210,.14)';g.stroke();
 g.textBaseline='middle';g.font='bold '+Math.round(9.5*u)+'px monospace';g.textAlign='left';g.fillStyle='#f2c94c';g.fillText(f.phase==='done'?'FINAL':'TIRO '+Math.min(5,f.shot+1)+'/5',bx+11*u,by+13*u);
 g.textAlign='right';g.fillStyle='#cfc6b4';g.fillText(N('matias')+' · '+PEN_LEVELS[f.lv],bx+bw-11*u,by+13*u);
 for(let i=0;i<5;i++){const cx=bx+22*u+i*22*u,cy=by+33*u,r=7.5*u,v=f.res[i];g.fillStyle='#14101c';g.beginPath();g.arc(cx,cy,r+1.5*u,0,7);g.fill();g.fillStyle=v===1?'#3fa66b':v===0?'#d6453c':'#3a3448';g.beginPath();g.arc(cx,cy,r,0,7);g.fill();
  g.strokeStyle='#fff';g.lineWidth=2*u;g.lineCap='round';g.beginPath();if(v===1){g.moveTo(cx-3.5*u,cy);g.lineTo(cx-1*u,cy+3*u);g.lineTo(cx+4*u,cy-3*u)}else if(v===0){g.moveTo(cx-3*u,cy-3*u);g.lineTo(cx+3*u,cy+3*u);g.moveTo(cx+3*u,cy-3*u);g.lineTo(cx-3*u,cy+3*u)}g.stroke();g.lineCap='butt';
  if(i===f.shot&&f.phase!=='done'&&v===undefined){g.strokeStyle='rgba(242,201,76,'+(.6+Math.sin(f.time*6)*.4).toFixed(2)+')';g.lineWidth=2*u;g.beginPath();g.arc(cx,cy,r+3.5*u,0,7);g.stroke()}}
 g.textAlign='right';g.fillStyle='#f4ead2';g.font='900 '+Math.round(15*u)+'px monospace';g.fillText(String(f.goals),bx+bw-38*u,by+33*u);g.font='bold '+Math.round(8*u)+'px monospace';g.fillStyle='#cfc6b4';g.fillText(f.goals===1?'GOL':'GOLES',bx+bw-11*u,by+33.5*u);
 const hint={ready:'¡Póngase las pilas, mae!',aimX:'Tocá para fijar la DIRECCIÓN',aimY:'Ahora fijá la ALTURA',done:'Tocá para otra tanda'}[f.phase];
 if(hint){g.font='bold '+Math.round(11*u)+'px monospace';const tw=g.measureText(hint).width+26*u,ph=22*u,px=Math.round(W/2-tw/2),py=by+bh+7*u;penRR(g,px,py,tw,ph,ph/2);g.fillStyle='rgba(18,14,28,.82)';g.fill();g.lineWidth=1.5*u;g.strokeStyle='#14101c';g.stroke();g.textAlign='center';g.fillStyle=f.phase==='aimY'?'#ffb3a8':'#f4ead2';g.fillText(hint,W/2,py+ph/2-(f.phase.startsWith('aim')?1.5*u:0));
  if(f.phase==='aimX'||f.phase==='aimY'){const kk=Math.max(0,1-f.clock/f.limit),bw2=tw-24*u;g.fillStyle='rgba(255,255,255,.12)';g.fillRect(px+12*u,py+ph-6*u,bw2,2.5*u);g.fillStyle=kk>.35?'#3fa66b':kk>.15?'#f2c94c':'#d6453c';g.fillRect(px+12*u,py+ph-6*u,bw2*kk,2.5*u)}}}
function penCard(g,f){if(f.phase!=='done')return;const a=Math.min(1,f.t*2.5),rt=(($('#sportResult')||{}).textContent||'').split(' · '),l1=rt.slice(0,2).join(' · '),l2=rt.slice(2).join(' · ');
 g.save();g.globalAlpha=a;g.translate(240,186+(1-a)*8);g.font='bold 10px monospace';const w=Math.max(200,g.measureText(l1).width+30,(g.font='bold 8px monospace',g.measureText(l2).width+30));
 penRR(g,-w/2,-24+2,w,50,7);g.fillStyle='rgba(0,0,0,.35)';g.fill();penRR(g,-w/2,-24,w,50,7);g.fillStyle='rgba(18,14,28,.92)';g.fill();g.lineWidth=1.6;g.strokeStyle='#14101c';g.stroke();
 g.textAlign='center';g.textBaseline='middle';g.font='bold 10px monospace';g.fillStyle='#f2c94c';g.fillText(l1,0,-12);g.font='bold 8px monospace';g.fillStyle='#cfc6b4';if(l2)g.fillText(l2,0,1);
 g.globalAlpha=a*(.6+Math.sin(f.time*5)*.4);g.fillStyle='#f4ead2';g.font='bold 8.5px monospace';g.fillText('↻ Tocá para otra tanda',0,15);g.restore()}
function drawSport(g,f){const cvs=g.canvas;penView(cvs);const pal=penPal(),key=PV.W+'x'+PV.H+'|'+PV.k+'|'+pal.id;
 if(!PEN_BG||PEN_BG.key!==key){PEN_BG=penBuildBg(pal);PEN_BG.key=key}
 const k=PV.k,bg=PEN_BG;penFx(f);
 g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.fillStyle='#0d0b12';g.fillRect(0,0,PV.W,PV.H);
 const sh=f.shake,ox=sh?Math.round(rnd(-1,1)*sh*5):0,oy=sh?Math.round(rnd(-1,1)*sh*3):0;
 g.drawImage(bg,-bg.m+ox*k,-bg.m+oy*k);
 const WT=()=>{g.setTransform(k,0,0,k,PV.ox+ox*k,PV.oy+oy*k);g.imageSmoothingEnabled=false};WT();
 // Banderines que se mueven con el viento (y con la celebración)
 {const cols=['#2a6fb0','#f4f4f4','#d6453c','#f2c94c'],w=f.cheer>0?2.2:1,s0=Math.floor(PV.x0/80)-1,s1=Math.ceil(PV.x1/80);g.strokeStyle='rgba(30,26,34,.8)';g.lineWidth=.8;g.beginPath();for(let s=s0;s<=s1;s++){g.moveTo(s*80,60);g.quadraticCurveTo(s*80+40,74,s*80+80,60)}g.stroke();
  for(let s=s0;s<=s1;s++)for(let i=0;i<8;i++){const t=(i+.5)/8,x=s*80+t*80,y=60+Math.sin(Math.PI*t)*7,fl=Math.sin(f.time*4*w+x*.15)*1.6*w;g.fillStyle=cols[((i+s)%4+4)%4];g.beginPath();g.moveTo(x-3.2,y);g.lineTo(x+3.2,y);g.lineTo(x+fl*.6,y+7+Math.abs(fl)*.3);g.closePath();g.fill();g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.moveTo(x,y);g.lineTo(x+3.2,y);g.lineTo(x+fl*.6,y+7);g.closePath();g.fill()}}
 penGoalBack(g,f);
 const b=f.ball,inNet=b&&f.phase!=='flight'&&f.out==='goal';
 if(inNet)penDrawBall(g,f,b);
 for(const a of f.fans)penDrawFan(g,f,a);
 penKeeper(g,f,pal);penPosts(g,f,pal);
 const an=(type,col,x,y,fr,flip)=>{const s=animSpr(type,col,fr,flip);g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x,y+1,12,2.6,0,0,7);g.fill();g.drawImage(s,x-s.width,y-s.height*2+2,s.width*2,s.height*2)};
 const dogFr=Math.floor(f.time*2.5)%2;an('dog','#f4f4f4',150,214,f.cheer>0||f.laugh>0?dogFr:0,false);an('hen','#f4f4f4',350,208,Math.floor(f.time*3)%2,true);an('cat','#f2994a',96,184,0,false);
 penShooter(g,f);
 if(b&&!inNet)penDrawBall(g,f,b);else if(!b&&(f.phase==='ready'||f.phase==='aimX'||f.phase==='aimY')){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(240,233,9,2.8,0,0,7);g.fill();penBall(g,240,226,9,.3)}
 // Luz del momento del día
 if(pal.tint){g.fillStyle=pal.tint;g.fillRect(PV.x0-10,PV.y0-10,PV.x1-PV.x0+20,PV.y1-PV.y0+20)}
 if(bg.light){g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='lighter';g.drawImage(bg.light,-bg.m+ox*k,-bg.m+oy*k);g.globalCompositeOperation='source-over';WT()}
 // Partículas: polvo, chispas y papelitos
 for(const p of f.parts){const l=p.l0?Math.max(0,p.life/p.l0):Math.min(1,p.life);
  if(p.t==='dust'){g.globalAlpha=l*.55;g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,1.4+(1-l)*4,0,7);g.fill()}
  else if(p.t==='spark'){g.globalAlpha=l;g.strokeStyle=p.c;g.lineWidth=1.2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.03,p.y-p.vy*.03);g.stroke()}
  else{const w=Math.max(.6,3.4*Math.abs(Math.cos(f.time*9+p.vx)));g.save();g.translate(p.x,p.y);g.rotate(f.time*5+p.vy*.02);g.globalAlpha=Math.min(1,l*2);g.fillStyle=p.c;g.fillRect(-w/2,-1,w,2);g.restore()}}
 g.globalAlpha=1;
 if(f.mark&&f.mark.t<1.2){const a=1-f.mark.t/1.2,rr=4+f.mark.t*14;g.strokeStyle='rgba(242,201,76,'+(a*.9).toFixed(3)+')';g.lineWidth=1.6;g.beginPath();g.arc(f.mark.x,f.mark.y,rr,0,7);g.stroke();g.strokeStyle='rgba(255,255,255,'+(a*.6).toFixed(3)+')';g.lineWidth=.8;g.beginPath();g.arc(f.mark.x,f.mark.y,rr*.55,0,7);g.stroke()}
 penAim(g,f);
 if(f.phase==='result'&&f.out==='goal'&&f.t<.3){g.fillStyle='rgba(255,250,230,'+((.3-f.t)*1.4).toFixed(3)+')';g.fillRect(PV.x0-10,PV.y0-10,PV.x1-PV.x0+20,PV.y1-PV.y0+20)}
 // Globos de diálogo de los vecinos
 const drawn=[];for(const c of f.chat||[]){if(c.t>1.7)continue;g.font='bold 8.5px monospace';g.textAlign='center';g.textBaseline='middle';const tw=Math.ceil(g.measureText(c.txt).width)+12,pop=Math.min(1,c.t/.12),bx=Math.max(PV.x0+4,Math.min(PV.x1-tw-4,c.fan.x-tw/2)),by0=penFanTop(c.fan)-20-(1-pop)*4,by=drawn.reduce((y,d)=>bx<d[0]+d[2]+2&&bx+tw>d[0]-2&&Math.abs(y-d[1])<17?d[1]-19:y,by0),tx=Math.max(bx+7,Math.min(bx+tw-7,c.fan.x));
  g.globalAlpha=c.t>1.45?Math.max(0,(1.7-c.t)/.25):1;penRR(g,bx,by+1.5,tw,15,5);g.fillStyle='rgba(0,0,0,.3)';g.fill();penRR(g,bx,by,tw,15,5);g.fillStyle='#fbf3df';g.fill();g.lineWidth=1.3;g.strokeStyle='#14101c';g.stroke();
  g.beginPath();g.moveTo(tx-3,by+14.4);g.lineTo(tx,by+19);g.lineTo(tx+3,by+14.4);g.fillStyle='#fbf3df';g.fill();g.beginPath();g.moveTo(tx-3,by+15);g.lineTo(tx,by+19);g.lineTo(tx+3,by+15);g.stroke();
  g.fillStyle='#14101c';g.fillText(c.txt,bx+tw/2,by+7.8);g.globalAlpha=1;drawn.push([bx,by,tw])}
 penBanner(g,f);penCard(g,f);
 g.setTransform(1,0,0,1,0,0);
 {const vg=g.createRadialGradient(PV.W/2,PV.H/2,Math.min(PV.W,PV.H)*.38,PV.W/2,PV.H/2,Math.hypot(PV.W,PV.H)*.62);vg.addColorStop(0,'rgba(8,6,16,0)');vg.addColorStop(1,'rgba(8,6,16,.45)');g.fillStyle=vg;g.fillRect(0,0,PV.W,PV.H)}
 penHUD(g,f)}
function drawNeighborhoodDetails(g){
 // Pixel clusters and props are painted only; no collision tiles are changed.
 for(let i=0;i<36;i++){const x=2+Math.floor(hsh(i,41)*58),y=2+Math.floor(hsh(i,53)*39);if(ti(MAPS.ext,x,y)!==0)continue;const X=x*T+4,Y=y*T+6;for(let j=0;j<3;j++){R(g,'#3c803d',X+j*3,Y+3,1,3);R(g,j%2?'#f2c94c':'#f193b4',X+j*3-1,Y+1,3,2)}}
 for(const b of BUILD){const X=(b.x+b.w-1)*T,Y=(b.y+b.h)*T;R(g,'#824e3a',X+4,Y+8,7,6);R(g,'#c37855',X+4,Y+8,7,2);R(g,'#2f743b',X+7,Y+2,1,6);R(g,'#55a24c',X+3,Y+3,5,2);R(g,'#55a24c',X+8,Y+1,4,2)}
 // Garden beds on the open lawn behind the player's house.
 for(let i=0;i<3;i++){const X=(3+i*2)*T,Y=7*T;R(g,'#574032',X,Y+2,16,13);R(g,'#927051',X+1,Y+3,14,10);for(let j=0;j<3;j++)R(g,'#72513d',X+2,Y+4+j*3,12,1)}
 // Laundry in the back garden, away from the gate.
 R(g,'#6f553e',10*T,5*T,2,20);R(g,'#6f553e',14*T,5*T,2,20);R(g,'#e6dac3',10*T,5*T+3,66,1);for(let i=0;i<5;i++){R(g,['#f4ead2','#f193b4','#73c9df'][i%3],10*T+5+i*11,5*T+4,8,10);R(g,'#d1b586',10*T+6+i*11,5*T+2,1,3)}
}
function drawActivities(g,t){if(P.map!=='ext')return;
 for(let i=0;i<6;i++){const p=S.activities.plots[i];if(!p)continue;const X=(3+(i%3)*2)*T+8,Y=(i<3?7:9)*T+8,ready=ACTIVITY_RULES.cropReady(p,totalMinutes()),grown=totalMinutes()-p.planted>90;R(g,p.watered?'#506e59':'#72513d',X-6,Y+3,12,2);R(g,'#326f35',X,Y-(grown?7:2),1,grown?11:6);R(g,'#67b955',X-4,Y-(grown?5:1),4,2);R(g,'#4e9946',X+1,Y-(grown?7:3),4,2);if(ready){disc(g,'#d6453c',X-3,Y-4,2);disc(g,'#ed7253',X+3,Y-6,2)}}
 for(const[x,y]of LITTER){if(S.activities.recycled[LITTER.findIndex(v=>v[0]===x&&v[1]===y)]===S.day)continue;R(g,'#c5e8ea',x*T+6,y*T+5,4,7);R(g,'#73c9df',x*T+7,y*T+6,2,4);R(g,'#3f7fd1',x*T+7,y*T+3,2,2)}
 R(g,'#f4ead2',51*T+5,29*T+5,6,6);R(g,'#1d1a24',51*T+7,29*T+7,2,2);R(g,'#f2c94c',20*T+6,23*T+1,5,4);
 if(!isNight())for(let i=0;i<4;i++){const X=36*T+Math.sin(t*.7+i)*30+i*30,Y=26*T+Math.cos(t+i)*8;R(g,i%2?'#f193b4':'#f2c94c',Math.round(X),Math.round(Y),2,1);R(g,'#1d1a24',Math.round(X)+1,Math.round(Y)+1,1,2)}
}

