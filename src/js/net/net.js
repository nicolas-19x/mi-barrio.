// ================= MULTIJUGADOR LAN =================
// Un servidor liviano (server/server.js) reenvía mensajes. El «anfitrión» (un celular) simula el mundo
// compartido (hora, lluvia, bus, NPC, peatones, animales) y lo manda ~9 veces por segundo; los demás
// solo interpolan. Cada quien mueve su propio personaje y guarda su propio progreso.
const NET={ws:null,on:false,id:0,room:'',host:0,rem:new Map(),locks:new Map(),bub:[],status:'',ping:0,
  name:'',shirt:'#d23038',server:'',lastPos:0,lastPosS:'',lastWorld:0,lastFull:0,lastPing:0,want:null,retry:0,retryT:0,leaving:false,
  hT:null,emap:null,emapN:-1,talkSent:null,away:false,wl:null,chat:false,emo:false,offs:new Map(),wcount:0};
const NET_DELAY=130,NET_SHIRTS=['#d23038','#2e6fd1','#2e9e6b','#f2b632','#8a4fd1','#f07f2e','#e85d9a','#26262e'];
const NET_EMO=['👋','😂','⚽','👍','❤️','❓','😮','🎉'];
(function(){try{const s=JSON.parse(localStorage.getItem('miBarrio_net')||'{}');NET.name=s.name||'';NET.shirt=s.shirt||'';NET.server=s.server||''}catch(e){}})();
function netSaveCfg(){try{localStorage.setItem('miBarrio_net',JSON.stringify({name:NET.name,shirt:NET.shirt,server:NET.server}))}catch(e){}}
const netHost=()=>NET.on&&NET.id===NET.host;
const netGuest=()=>NET.on&&NET.id!==NET.host;
function netSend(o){const w=NET.ws;if(w&&w.readyState===1)try{w.send(JSON.stringify(o))}catch(e){}}
function netURL(){let s=(NET.server||'').trim();
  if(!s){if(/^https?:$/.test(location.protocol)&&location.host)return(location.protocol==='https:'?'wss://':'ws://')+location.host;return null}
  s=s.replace(/^(https?|wss?):\/\//,'').replace(/\/.*$/,'');if(!/:\d+$/.test(s))s+=':8080';return'ws://'+s}
// ---------------------------------------------------------------- conexión
function netConnect(act,code){if(!NET.shirt)NET.shirt=(CH.player&&CH.player.shirt)||'#d23038';
  const url=netURL();if(!url){netStatus('Escribí la dirección del servidor (ej. 192.168.1.23:8080)');netUI();return}
  const re=!!(NET.want&&NET.want.re&&act==='join'&&NET.want.code===code);netClose(true);NET.leaving=false;NET.want={act,code,re};netStatus('Conectando…');
  let w;try{w=new WebSocket(url)}catch(e){netStatus('Dirección inválida');return}
  NET.ws=w;
  w.onopen=()=>{NET.retry=0;const look={shirt:NET.shirt};
    if(NET.want.act==='create')netSend({t:'create',name:NET.name,look});else netSend({t:'join',room:NET.want.code,name:NET.name,look,re:NET.want.re?1:0})};
  w.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(er){return}try{netMsg(m)}catch(er){console.error(er)}};
  w.onclose=()=>{if(NET.ws!==w)return;NET.ws=null;const was=NET.on;netDrop();if(was&&NET.want){NET.want.re=1;NET.want.act='join';NET.want.code=NET.room}
    if(NET.leaving||!NET.want)return;
    if(NET.retry<8){const d=Math.min(8000,700*Math.pow(1.7,NET.retry++));netStatus(was||(NET.want&&NET.want.re)?'Se cayó la conexión. Reconectando…':'No pude conectar. Reintentando…');
      if(was)toast('📶 Se perdió la conexión, reconectando…');clearTimeout(NET.retryT);NET.retryT=setTimeout(()=>{if(!NET.leaving&&NET.want)netConnect(NET.want.act,NET.want.code)},d)}
    else{netStatus('No se pudo conectar al servidor. ¿Está encendido y en la misma red wifi?');NET.want=null}
    netUI()};
  w.onerror=()=>{};netUI()}
function netClose(silent){const w=NET.ws;NET.ws=null;if(w){try{w.onclose=null;w.close()}catch(e){}}netDrop();if(!silent)netUI()}
function netLeave(){NET.leaving=true;NET.want=null;clearTimeout(NET.retryT);netSend({t:'leave'});netClose();netStatus('');toast('Saliste de la sala');netUI()}
// pasar a modo solitario: quitar remotos, soltar NPC, devolver la simulación local
function netDrop(){const was=NET.on;NET.on=false;
  for(const e of NET.rem.values())ENTS=ENTS.filter(x=>x!==e);NET.rem.clear();
  for(const [nid] of NET.locks)netUnlockEnt(nid);NET.locks.clear();
  netResumeLocal();NET.hT=null;NET.bub=[];if(was)netWake(false)}
function netResumeLocal(){for(const e of ENTS){if(e._nb){e._nb=null;if(e.kind==='npc'||e.kind==='ped'){e.steps=[];e.path=null;e.wt=1}}if(e._ws)e._ws=null}}
function netStatus(s){NET.status=s;const el=document.getElementById('netStatus');if(el)el.textContent=s}
// ---------------------------------------------------------------- mensajes
function netMsg(m){const now=performance.now();
  switch(m.t){
    case'welcome':{const re=!!NET.room&&NET.room===m.room;NET.on=true;NET.id=m.id;NET.room=m.room;NET.host=m.host;NET.want={act:'join',code:m.room,re:1};NET.retry=0;
      for(const p of m.players)netAddRemote(p);netStatus('');netWake(true);
      if(netGuest())for(const e of ENTS)e._ws=null;
      toast(re?'📶 Reconectado a la sala '+m.room:netHost()?'🏠 Sala '+m.room+' creada. Pasá el código a tus amigos.':'🏠 Entraste a la sala '+m.room);
      netAwayCheck(true);netUI();break}
    case'error':netStatus(m.msg||'Error');toast('⚠️ '+(m.msg||'Error'));NET.leaving=true;NET.want=null;netClose();netUI();break;
    case'left':break;
    case'join':netAddRemote(m.p);toast('👋 '+m.p.name+' se unió');netUI();break;
    case'leave':{const e=NET.rem.get(m.id);if(e){toast('🚪 '+e.name+' se fue');ENTS=ENTS.filter(x=>x!==e);NET.rem.delete(m.id)}
      for(const [nid,pid] of [...NET.locks])if(pid===m.id){NET.locks.delete(nid);netUnlockEnt(nid)}netUI();break}
    case'host':{const was=netHost();NET.host=m.id;
      if(netHost()&&!was){netResumeLocal();NET.lastFull=0;netSendWorld(true);toast('🏠 Ahora tu celular lleva el barrio')}
      else if(!netHost()&&was){for(const e of ENTS)e._ws=null}
      netUI();break}
    case'need':if(netHost())netSendWorld(true,m.id);break;
    case'pos':{const e=NET.rem.get(m.id);if(!e)break;const t=netTime(m.id,m.k,now);
      netPush(e,{t,m:m.m,x:m.x,y:m.y,d:m.d});e.mv=m.mv;e.busy=m.b||'';e.rv=m.rv||'';if(!e.seen){e.seen=1;e.map=m.m;e.x=m.x;e.y=m.y;e.dir=m.d}break}
    case'world':if(netGuest())netApplyWorld(m,now);break;
    case'emote':{const e=NET.rem.get(m.id);if(e)netBubble(e,m.k,true);break}
    case'chat':{const e=NET.rem.get(m.id);if(e){netBubble(e,m.m,false);if(e.map!==P.map)toast('💬 '+e.name+': '+m.m)}break}
    case'npcTalk':{if(m.on){NET.locks.set(m.n,m.id);if(netHost()){const n=netEnt(m.n),r=NET.rem.get(m.id);if(n){n.talking=true;n._lockT=performance.now();if(r)faceTo(n,r)}}}
      else{if(NET.locks.get(m.n)===m.id){NET.locks.delete(m.n);netUnlockEnt(m.n)}}break}
    case'away':{const e=NET.rem.get(m.id);if(e)e.away=m.v;netUI();break}
    case'look':{const e=NET.rem.get(m.id);if(e){e.shirt=m.look.shirt}break}
    case'pong':NET.ping=Math.round(now-m.k);netHud();break;
  }}
function netUnlockEnt(nid){if(!netHost())return;const n=netEnt(nid);if(n&&n!==talkEnt)n.talking=false}
// reloj de cada emisor → tiempo local (corrige la diferencia de relojes con el mínimo observado)
function netTime(src,k,now){if(typeof k!=='number')return now;const d=now-k;let o=NET.offs.get(src);if(o===undefined||d<o)o=d;else o+=Math.min(.5,(d-o)*.02);NET.offs.set(src,o);return k+o}
function netPush(e,s){const b=e._nb||(e._nb=[]);const last=b[b.length-1];
  if(last&&s.t-last.t>350)b.push(Object.assign({},last,{t:s.t-120}));   // venía quieto: no arrastrar el movimiento
  if(last&&s.t<=last.t)s.t=last.t+1;b.push(s);while(b.length>8)b.shift()}
function netInterp(e,now){const b=e._nb;if(!b||!b.length)return;const rt=now-NET_DELAY;
  while(b.length>2&&b[1].t<=rt)b.shift();
  let a=b[0],c=b[1];
  if(!c||rt<=a.t){netPlace(e,a,a,0);return}
  const k=Math.max(0,Math.min(1,(rt-a.t)/(c.t-a.t)));netPlace(e,a,c,k)}
function netPlace(e,a,c,k){
  if(a.m!==c.m||Math.hypot(c.x-a.x,c.y-a.y)>80){const s=k<1?a:c;e.map=s.m;e.x=s.x;e.y=s.y;e.dir=s.d;return}
  e.map=c.m;e.x=a.x+(c.x-a.x)*k;e.y=a.y+(c.y-a.y)*k;e.dir=k<.5?a.d:c.d;if(c.tk!==undefined)e.talking=!!c.tk}
// ---------------------------------------------------------------- jugadores remotos
function netAddRemote(p){if(!p||p.id===NET.id||NET.rem.has(p.id))return;
  const c=fillChar(Object.assign({},CH.player||{},{id:'remote'+p.id,name:p.name,v:1}));
  const e={kind:'remote',rid:p.id,name:p.name,shirt:(p.look&&p.look.shirt)||'#d23038',c,map:'__',x:-999,y:-999,dir:0,fr:0,anim:0,away:!!p.away,busy:'',reach:22};
  NET.rem.set(p.id,e);ENTS.push(e);return e}
function netBubble(e,txt,emo){NET.bub=NET.bub.filter(b=>b.e!==e);NET.bub.push({e,txt:String(txt),emo,t:emo?2.6:4.5})}
// ---------------------------------------------------------------- mundo compartido
function netEntId(e){if(e.kind==='npc')return'n'+e.c.id;if(e.kind==='ped'&&!e.z)return'p'+e.c.id;if(e.kind==='animal')return'a'+e.type+(e.name||'')+e.ox+','+e.oy;return null}
function netEnt(id){if(NET.emapN!==ENTS.length||!NET.emap){NET.emap=new Map();for(const e of ENTS){const k=netEntId(e);if(k)NET.emap.set(k,e)}NET.emapN=ENTS.length}const e=NET.emap.get(id);if(e&&ENTS.includes(e))return e;NET.emap=null;return null}
function netSendWorld(full,to){if(!S||!S.started)return;const now=performance.now();if(!full&&now-NET.lastFull>2000)full=true;if(full&&!to)NET.lastFull=now;
  const es=[];
  for(const e of ENTS){const id=netEntId(e);if(!id)continue;const tk=e.talking?1:0,x=Math.round(e.x*2)/2,y=Math.round(e.y*2)/2;const L=e._ws;
    if(!full&&L&&L[0]===e.map&&Math.abs(L[1]-x)<.5&&Math.abs(L[2]-y)<.5&&L[3]===e.dir&&L[4]===tk)continue;
    if(!to)e._ws=[e.map,x,y,e.dir,tk];es.push([id,e.map,x,y,e.dir,tk])}
  const m={t:'world',k:Math.round(now),s:[Math.round(S.t*100)/100,S.day,Math.round(S.rain*10)/10],b:[bus.active?1:0,Math.round(bus.x),Math.round(bus.stop*100)/100,bus.last],e:es};
  if(full)m.full=1;if(to)m.to=to;netSend(m)}
function netApplyWorld(m,now){if(!S||!S.started)return;const t=netTime('h'+NET.host,m.k,now);
  NET.hT={t:m.s[0],day:m.s[1],rain:m.s[2],at:now,first:!NET.hT};
  NET.bus={a:m.b[0],x:m.b[1],stop:m.b[2],last:m.b[3],at:now};
  for(const r of m.e){const e=netEnt(r[0]);if(!e)continue;if(e.special==='firulais'&&S.f.dogFollow)continue;
    if(!e._nb){e.map=r[1];e.x=r[2];e.y=r[3];e.dir=r[4]}netPush(e,{t,m:r[1],x:r[2],y:r[3],d:r[4],tk:r[5]})}}
// el invitado ajusta su reloj al del anfitrión (sin repetir eventos del día)
function netGuestTimePre(dt){const h=NET.hT;if(!h||!S||!S.started)return;const play=mode==='play'&&!fading&&!COMBAT;
  const tgt0=h.day*1440+h.t+(performance.now()-h.at)/1000*2;
  if(h.first){h.first=false;S.day=Math.floor(tgt0/1440);S.t=tgt0-S.day*1440;S.rain=h.rain;return}
  const cur=S.day*1440+S.t;
  if(Math.abs(tgt0-cur)>=30){const nd=Math.floor(tgt0/1440);if(nd>S.day&&nd-S.day<3)while(S.day<nd){S.day++;try{ecoDay()}catch(e){}}S.day=nd;S.t=tgt0-nd*1440;S.rain=h.rain;return}
  const tgt=Math.max(cur,tgt0),pre=play?Math.max(cur,tgt-dt*2):tgt;const nd=Math.floor(pre/1440);
  while(S.day<nd){S.day++;try{ecoDay()}catch(e){}}
  S.t=pre-S.day*1440;S.rain=h.rain}
function netGuestPost(){if(!S||!S.started)return;const h=NET.hT;if(h)S.rain=h.rain;const b=NET.bus;if(b){const el=(performance.now()-b.at)/1000;bus.active=!!b.a;bus.x=b.a&&b.stop<=0?b.x+90*el:b.x;bus.stop=b.stop;bus.last=b.last}}
// el anfitrión mueve el reloj aunque esté en un diálogo o en una tienda (el mundo no se congela para los demás)
function netHostTime(dt){if(!S||!S.started||(mode==='play'&&!fading))return;S.t+=dt*2;if(S.t>=1440){S.t-=1440;S.day++;try{ecoDay()}catch(e){}}if(S.rain){S.rain-=dt*2;if(S.rain<0)S.rain=0}}
// ---------------------------------------------------------------- estado local → red
function netBusy(){return COMBAT?'pleito':mode==='trip'?'bus':mode==='view'?'mirador':SPORT?'jugando':mode==='dialog'?'hablando':mode==='panel'?'ocupado':''}
function netTick(dt){if(!NET.on||!S||!S.started)return;const now=performance.now();
  if(now-NET.lastPos>=95){const rv=netRide(),s=[P.map,Math.round(P.x*2)/2,Math.round(P.y*2)/2,P.dir,P.moving?1:0,netBusy(),rv].join('|');
    if(s!==NET.lastPosS||now-NET.lastPos>1000){NET.lastPos=now;NET.lastPosS=s;netSend({t:'pos',k:Math.round(now),m:P.map,x:Math.round(P.x*2)/2,y:Math.round(P.y*2)/2,d:P.dir,mv:P.moving?1:0,b:netBusy(),rv})}}
  if(netHost()&&NET.rem.size&&now-NET.lastWorld>=110){NET.lastWorld=now;netSendWorld(false)}
  if(CH.player&&CH.player.shirt&&CH.player.shirt!==NET.shirt){NET.shirt=CH.player.shirt;netSaveCfg();netSend({t:'look',look:{shirt:NET.shirt}})}
  if(now-NET.lastPing>3000){NET.lastPing=now;netSend({t:'ping',k:Math.round(now)})}
  const te=talkEnt?netEntId(talkEnt):null;if(te!==NET.talkSent){if(NET.talkSent)netSend({t:'npcTalk',n:NET.talkSent,on:0});if(te)netSend({t:'npcTalk',n:te,on:1});NET.talkSent=te}
  // candados viejos (por si se perdió el aviso de soltar)
  if(netHost())for(const [nid] of NET.locks){const n=netEnt(nid);if(n&&n._lockT&&now-n._lockT>180000){NET.locks.delete(nid);netUnlockEnt(nid)}}
  netAwayCheck(false);
  for(const b of NET.bub)b.t-=dt;NET.bub=NET.bub.filter(b=>b.t>0&&ENTS.includes(b.e)||b.t>0&&b.e===P)}
function netAwayCheck(force){const a=!!(document.hidden||COMBAT||mode==='prologo'||(typeof PRO!=='undefined'&&PRO));if(a!==NET.away||force){NET.away=a;if(NET.on)netSend({t:'away',v:a})}}
document.addEventListener('visibilitychange',()=>{if(!NET.on)return;netAwayCheck(false);if(!document.hidden)netWake(true)});
async function netWake(on){try{if(on&&navigator.wakeLock&&!document.hidden){if(!NET.wl)NET.wl=await navigator.wakeLock.request('screen');NET.wl.addEventListener&&NET.wl.addEventListener('release',()=>{NET.wl=null})}else if(!on&&NET.wl){NET.wl.release();NET.wl=null}}catch(e){NET.wl=null}}
// ---------------------------------------------------------------- enganches al juego
{const _update=update;update=function(dt){
  if(NET.chat)for(const k in KEYS)KEYS[k]=0;
  if(netGuest())netGuestTimePre(dt);
  _update(dt);
  if(netHost())netHostTime(dt);
  if(netGuest())netGuestPost();
  netTick(dt)}}
{const _u=updNPC;updNPC=function(e,dt){if(netGuest()&&e._nb){netInterp(e,performance.now());return}return _u(e,dt)}}
{const _u=updPed;updPed=function(e,dt){if(netGuest()&&e._nb){netInterp(e,performance.now());return}return _u(e,dt)}}
{const _u=updAnimal;updAnimal=function(e,dt){if(e.kind==='remote'){netInterp(e,performance.now());return}if(netGuest()&&e._nb){netInterp(e,performance.now());return}return _u(e,dt)}}
{const _d=npcDraw;npcDraw=function(e){if(e.kind==='remote'){const r=netRideImg(e);if(r)return r;return{img:heroSprite(e.dir|0,npcFrame(e),e.shirt),x:-9,y:-27,w:18,h:29}}return _d(e)}}
// vehículos de los demás jugadores: modelo y color viajan con la posición
function netRide(){if(typeof riding!=='function')return'';const v=riding();return v&&v.map===P.map?v.m+','+v.col+(v.push?',p':''):''}
function netRideImg(e){if(!e.rv||typeof vSprite!=='function')return null;const[m,col,push]=e.rv.split(',');if(!VM[m]||push)return null;const bici=VM[m].k==='bici',mv=!!e.mv;e.wd=(e.wd||0)+(mv?1:0);
  const s=vSprite(m,col,e.dir|0,bici&&mv?Math.floor(e.wd/6)%4:Math.floor(e.wd/4)%5,push?null:bici?(mv?'walk':'sit'):'sit',e.shirt);const w=s.width/2,h=s.height/2;return{img:s,x:-w/2,y:-h+3,w,h}}
{const _l=targetLabel;targetLabel=function(t){if(t&&t.type==='remote')return'Saludar a '+t.e.name;return _l(t)}}
{const _f=findTarget;findTarget=function(){const t=_f();if(t&&t.type==='remote'&&(t.e.away||t.e.map!==P.map))return null;return t}}
{const _i=interact;interact=function(){if(mode!=='play'||fading)return _i();const t=target;
  if(t&&t.type==='remote'){faceTo(P,t.e);P.dir=dirTo(P,t.e);netEmote('👋');netEmoBar(true);return}
  if(t&&(t.type==='npc'||t.type==='ped')&&NET.on){const id=netEntId(t.e),who=id&&NET.locks.get(id);
    if(who&&who!==NET.id){const r=NET.rem.get(who);toast('💬 '+t.e.c.name+' está hablando con '+(r?r.name:'otra persona')+'. Esperá un toque.');return}}
  return _i()}}
{const _r=render;render=function(dt){_r(dt);if(NET.on||NET.bub.length)netOverlay()}}
// ---------------------------------------------------------------- dibujo: nombres y globitos
function netOverlay(){if(!S||COMBAT||mode==='menu')return;const cx=Math.round(cam.x*Z)/Z,cy=Math.round(cam.y*Z)/Z;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);const fs=Math.round(10*DPR+Z*.6);ctx.textAlign='center';ctx.textBaseline='bottom';
  const scr=e=>[(e.x-cx)*Z,(e.y-cy)*Z];
  for(const e of NET.rem.values()){if(e.map!==P.map||!ENTS.includes(e))continue;const[X,Y]=scr(e);const top=Y-30*Z;
    ctx.font='700 '+fs+'px "Trebuchet MS",Verdana,sans-serif';const lab=(e.away?'💤 ':'')+e.name+(e.busy&&e.busy!=='ocupado'?' · '+e.busy:'');const w=ctx.measureText(lab).width+fs*.8;
    ctx.globalAlpha=e.away?.6:.92;ctx.fillStyle='rgba(20,16,28,.82)';netRR(X-w/2,top-fs*1.35,w,fs*1.3,fs*.3);ctx.fill();
    ctx.fillStyle=e.shirt;ctx.fillRect(X-w/2+fs*.25,top-fs*.85,fs*.28,fs*.28);ctx.fillStyle='#f4ead2';ctx.fillText(lab,X+fs*.12,top-fs*.18);ctx.globalAlpha=1}
  // NPC ocupados con otro jugador
  if(NET.locks.size){ctx.font=Math.round(fs*1.1)+'px sans-serif';for(const [nid,pid] of NET.locks){if(pid===NET.id)continue;const n=netEnt(nid);if(!n||n.map!==P.map)continue;const[X,Y]=scr(n);ctx.fillText('💬',X,Y-30*Z)}}
  for(const b of NET.bub){const e=b.e;if(e.map!==P.map)continue;const[X,Y]=scr(e);const base=Y-(e.kind==='remote'?30*Z+fs*1.5:30*Z);const a=Math.min(1,b.t*2);ctx.globalAlpha=a;
    if(b.emo){const s=Math.round(fs*2.1);ctx.font=s+'px sans-serif';const bob=Math.sin((2.6-b.t)*8)*fs*.15;ctx.fillText(b.txt,X,base-bob)}
    else{ctx.font='700 '+fs+'px "Trebuchet MS",Verdana,sans-serif';const lines=netWrap(b.txt,fs*14);const lh=fs*1.25,w=Math.min(fs*15,Math.max(...lines.map(l=>ctx.measureText(l).width))+fs),h=lines.length*lh+fs*.5;
      ctx.fillStyle='#f4ead2';ctx.strokeStyle='#14101c';ctx.lineWidth=Math.max(2,DPR*2);netRR(X-w/2,base-h,w,h,fs*.4);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(X-fs*.4,base-1);ctx.lineTo(X,base+fs*.5);ctx.lineTo(X+fs*.4,base-1);ctx.fill();
      ctx.fillStyle='#14101c';lines.forEach((l,i)=>ctx.fillText(l,X,base-h+lh*(i+1)))}
    ctx.globalAlpha=1}
  ctx.restore()}
function netRR(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function netWrap(t,max){const ws=t.split(' '),out=[];let cur='';for(const w of ws){const n=cur?cur+' '+w:w;if(ctx.measureText(n).width>max&&cur){out.push(cur);cur=w}else cur=n}if(cur)out.push(cur);return out.slice(0,3)}
// ---------------------------------------------------------------- gestos y chat
function netEmote(k){netBubble(P,k,true);if(NET.on)netSend({t:'emote',k})}
function netChatSend(txt){txt=String(txt||'').replace(/\s+/g,' ').trim().slice(0,60);if(!txt)return;netBubble(P,txt,false);netSend({t:'chat',m:txt})}
function netEmoBar(show){NET.emo=show;$('#netEmo').classList.toggle('hidden',!show)}
function netChatBox(show){NET.chat=show;const b=$('#netChat');b.classList.toggle('hidden',!show);if(show){const i=$('#netChatIn');i.value='';setTimeout(()=>i.focus(),30)}else{try{$('#netChatIn').blur()}catch(e){}}}
// ---------------------------------------------------------------- interfaz
(function netBuildUI(){
  const css=document.createElement('style');css.textContent=`
#netBox .box{max-width:400px;width:100%;text-align:left}
#netBox h2{margin:0 0 8px}#netBox label{display:block;font-size:13px;font-weight:700;margin:10px 0 4px;opacity:.9}
#netBox input{font:inherit;width:100%;box-sizing:border-box;padding:8px;border:3px solid var(--ink);border-radius:6px;background:var(--paper);color:var(--ink)}
#netBox .sw{display:flex;gap:6px;flex-wrap:wrap}#netBox .sw button{width:34px;height:34px;padding:0;border-radius:50%}
#netBox .sw button.on{outline:3px solid #fff;outline-offset:2px}
#netBox .acts{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}#netBox .acts>*{flex:1}
#netBox .code{font-size:34px;font-weight:900;letter-spacing:8px;text-align:center;background:var(--paper);color:var(--ink);border:3px solid var(--ink);border-radius:8px;padding:6px;margin:6px 0}
#netBox .pl{margin:6px 0;padding:0;list-style:none}#netBox .pl li{padding:4px 0;display:flex;gap:8px;align-items:center}#netBox .pl i{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--ink)}
#netBox .st{min-height:18px;font-size:13px;color:#ffd27a;margin-top:8px}#netBox .small{font-size:12px;opacity:.8;margin-top:8px}
#netHud{position:fixed;top:calc(8px + env(safe-area-inset-top));right:12px;z-index:20;pointer-events:none;font-size:12px;white-space:nowrap}
#netBtns{position:fixed;right:14px;bottom:calc(150px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:8px;z-index:21}
#netBtns button{width:46px;height:46px;padding:0;font-size:22px;border-radius:50%}
#netEmo{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(120px + env(safe-area-inset-bottom));display:flex;gap:6px;z-index:22;background:rgba(20,16,28,.85);border:3px solid var(--ink);border-radius:10px;padding:6px;flex-wrap:wrap;justify-content:center;max-width:92vw}
#netEmo button{font-size:24px;padding:4px 8px;background:var(--paper)}
#netChat{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(120px + env(safe-area-inset-bottom));z-index:23;display:flex;gap:6px;width:min(460px,92vw)}
#netChat input{flex:1;font:inherit;font-size:16px;padding:8px;border:3px solid var(--ink);border-radius:6px;background:var(--paper);color:var(--ink);min-width:0}`;
  document.head.appendChild(css);
  const box=document.createElement('div');box.id='netBox';box.className='overlay hidden';box.innerHTML='<div class="box" id="netBoxIn"></div>';document.body.appendChild(box);
  const hud=document.createElement('div');hud.id='netHud';hud.className='chip hidden';document.body.appendChild(hud);
  const btns=document.createElement('div');btns.id='netBtns';btns.className='hidden';btns.innerHTML='<button class="alt" id="netBEmo" aria-label="Gestos">😀</button><button class="alt" id="netBChat" aria-label="Chat">💬</button>';document.body.appendChild(btns);
  const emo=document.createElement('div');emo.id='netEmo';emo.className='hidden';emo.innerHTML=NET_EMO.map(k=>'<button data-emo="'+k+'">'+k+'</button>').join('')+'<button data-emo="x" class="alt" aria-label="Cerrar">✕</button>';document.body.appendChild(emo);
  const ch=document.createElement('form');ch.id='netChat';ch.className='hidden';ch.innerHTML='<input id="netChatIn" maxlength="60" autocomplete="off" placeholder="Decí algo… (Enter)"><button class="green">Enviar</button><button type="button" class="alt" id="netChatX">✕</button>';document.body.appendChild(ch);
  ch.addEventListener('submit',e=>{e.preventDefault();netChatSend($('#netChatIn').value);netChatBox(false)});
  $('#netChatX').onclick=()=>netChatBox(false);
  $('#netChatIn').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();netChatBox(false)}e.stopPropagation()});
  emo.addEventListener('click',e=>{const b=e.target.closest('[data-emo]');if(!b)return;if(b.dataset.emo!=='x')netEmote(b.dataset.emo);netEmoBar(false)});
  $('#netBEmo').onclick=()=>netEmoBar(!NET.emo);$('#netBChat').onclick=()=>netChatBox(!NET.chat);
  const mb=document.querySelector('#menu .mbtns');if(mb){const b=document.createElement('button');b.id='bNet';b.className='alt';b.textContent='👥 Multijugador';mb.insertBefore(b,mb.children[2]||null);b.onclick=()=>{ac&&ac();openNet()}}
  addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;if(e.repeat||mode!=='play'||!NET.on)return;const k=(e.key||'').toLowerCase();
    if(k==='t'){e.preventDefault();netChatBox(true)}else if(k==='g'){netEmoBar(!NET.emo)}else if(NET.emo&&/^[1-8]$/.test(k)){netEmote(NET_EMO[+k-1]);netEmoBar(false)}});
  setInterval(()=>{netHud();const show=NET.on&&mode==='play'&&!COMBAT;const nb=$('#netBtns');nb.classList.toggle('hidden',!show);
    if(show){const ba=$('#btnA'),r=ba&&!$('#touch').classList.contains('hidden')?ba.getBoundingClientRect():null;if(r&&r.height){nb.style.bottom=Math.round(innerHeight-r.top+12)+'px';nb.style.right=Math.max(8,Math.round(innerWidth-r.right+(r.width-46)/2))+'px'}else{nb.style.bottom='';nb.style.right=''}}if(!show&&NET.emo)netEmoBar(false);if(!show&&NET.chat&&mode!=='play')netChatBox(false)},250);
})();
function netHud(){const h=$('#netHud');if(!h)return;const show=NET.on&&S&&S.started&&mode!=='menu'&&!COMBAT;h.classList.toggle('hidden',!show);if(!show)return;
  const mi=$('#mini');if(mi){const r=mi.getBoundingClientRect();if(r.height){h.style.top=Math.round(r.bottom+6)+'px';h.style.right=Math.max(6,Math.round(innerWidth-r.right))+'px'}}
  const n=NET.rem.size+1;h.textContent='🏠 '+NET.room+' · '+n+' en el barrio'+(netHost()?' · anfitrión':'')+(NET.ping?' · '+NET.ping+' ms':'')}
function openNet(){$('#netBox').classList.remove('hidden');netUI()}
function closeNet(){$('#netBox').classList.add('hidden')}
function netSetShirt(c){NET.shirt=c;if(CH.player&&CH.player.shirt!==c){CH.player.shirt=c;try{saveChars()}catch(e){}}netSaveCfg();if(NET.on)netSend({t:'look',look:{shirt:c}})}
function netUI(){const el=$('#netBoxIn');if(!el||$('#netBox').classList.contains('hidden'))return;if(!NET.shirt)NET.shirt=(CH.player&&CH.player.shirt)||'#d23038';
  const needSrv=!(/^https?:$/.test(location.protocol)&&location.host);const sw=(NET_SHIRTS.includes(NET.shirt)?NET_SHIRTS:[NET.shirt].concat(NET_SHIRTS.slice(0,7))).map(c=>'<button type="button" data-sh="'+c+'" class="'+(c===NET.shirt?'on':'')+'" style="background:'+c+'" aria-label="Color '+c+'"></button>').join('');
  if(NET.on){const pl=['<li><i style="background:'+NET.shirt+'"></i><b>'+esc(NET.name)+'</b> (vos)'+(netHost()?' · 🏠 anfitrión':'')+'</li>'].concat([...NET.rem.values()].map(e=>'<li><i style="background:'+e.shirt+'"></i>'+esc(e.name)+(NET.host===e.rid?' · 🏠 anfitrión':'')+(e.away?' · 💤':'')+'</li>')).join('');
    el.innerHTML='<h2>👥 Sala</h2><div class="small">Código para que tus amigos entren:</div><div class="code">'+NET.room+'</div>'+
      '<label>En el barrio ('+(NET.rem.size+1)+'/6)</label><ul class="pl">'+pl+'</ul>'+
      '<div class="acts"><button class="green" id="netPlay">'+(S&&S.started?'Volver al barrio':'Entrar al barrio')+'</button></div><div class="acts"><button class="red" id="netOut">Salir de la sala</button><button class="alt" id="netX">Cerrar</button></div>'+
      '<div class="st" id="netStatus">'+esc(NET.status)+'</div><div class="small">Cada quien guarda su propio progreso (plata, misiones). Lo compartido es el barrio, la hora y la gente.</div>';
    $('#netPlay').onclick=()=>{closeNet();if(!(S&&S.started)||mode==='menu'){const fresh=!loadGame();$('#menu').classList.add('hidden');startGame(fresh)}};
    $('#netOut').onclick=()=>netLeave();$('#netX').onclick=closeNet;return}
  el.innerHTML='<h2>👥 Multijugador (misma red wifi)</h2>'+
    '<label for="netName">Tu nombre</label><input id="netName" maxlength="16" value="'+esc(NET.name||(CH.player&&CH.player.name)||'')+'">'+
    '<label>Color de tu camiseta</label><div class="sw">'+sw+'</div>'+
    '<label for="netSrv">Servidor'+(needSrv?'':' (opcional)')+'</label><input id="netSrv" placeholder="'+(needSrv?'ej. 192.168.1.23:8080':esc(location.host))+'" value="'+esc(NET.server)+'">'+
    '<div class="acts"><button class="green" id="netNew">Crear sala</button></div>'+
    '<label for="netCode">¿Te pasaron un código?</label><div class="acts" style="margin-top:0"><input id="netCode" maxlength="4" placeholder="ABCD" style="text-transform:uppercase;letter-spacing:4px;font-weight:900"><button id="netJoin">Unirme</button></div>'+
    '<div class="acts"><button class="alt" id="netX">Cerrar</button></div><div class="st" id="netStatus">'+esc(NET.status)+'</div>'+
    '<div class="small">Alguien tiene que correr el servidor en una compu o celular de la misma red: <b>node server/server.js</b> y abrir la dirección que muestra.</div>';
  const rd=()=>{NET.name=($('#netName').value||'').trim().slice(0,16)||'Jugador';NET.server=($('#netSrv').value||'').trim();netSaveCfg()};
  el.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{rd();netSetShirt(b.dataset.sh);netUI()});
  $('#netNew').onclick=()=>{rd();NET.want=null;netConnect('create')};
  $('#netJoin').onclick=()=>{rd();const c=($('#netCode').value||'').trim().toUpperCase();if(!/^[A-Z]{4}$/.test(c)){netStatus('El código tiene 4 letras');return}NET.want=null;netConnect('join',c)};
  $('#netX').onclick=closeNet}
// salir de la sala al volver al menú no hace falta: la conexión sigue mientras el juego esté abierto
