// ================= SISTEMA DE INTERFAZ =================
// Todo lo de la interfaz pasa por aquí: sonidos (uiSfx), tipos de ventana (tapita + acento), animación de
// salida (copias «fantasma» que se desvanecen mientras la ventana real ya está cerrada, así la lógica del
// juego nunca espera a una animación), toques en botones, notificaciones y la pantalla de pausa.
if(OPT.ui===undefined)OPT.ui=true;if(OPT.uiVol==null)OPT.uiVol=.7;
const UI={last:{},pend:[],flushT:0,bus:null,busCtx:null,kind:null,lastAny:0};
// ---------------------------------------------------------------- sonido: marimba y campanita sintetizadas
const UI_PRI={quest:9,warn:7,confirm:7,open:6,close:5,cancel:5,notify:4,select:3,tap:2,interact:2,back:2};
const UI_SND={
 tap:[['m',784,0,.12,.16]],
 interact:[['m',659,0,.13,.15]],
 select:[['m',1175,0,.09,.11]],
 open:[['m',523,0,.16,.17],['m',784,.055,.24,.17]],
 close:[['m',784,0,.12,.13],['m',523,.05,.2,.12]],
 cancel:[['m',440,0,.13,.14],['m',349,.055,.22,.12]],
 confirm:[['m',659,0,.13,.17],['m',880,.055,.14,.17],['m',1319,.11,.34,.14]],
 warn:[['m',494,0,.16,.17],['m',466,.1,.28,.15]],
 notify:[['b',1319,0,.42,.07],['b',988,.085,.55,.07]],
 quest:[['m',523,0,.2,.17],['m',659,.075,.2,.17],['m',784,.15,.2,.17],['m',1047,.225,.6,.2],['b',2093,.23,.9,.035],['b',1568,.3,.8,.03]],
};
function uiBus(){const a=ac();if(!a)return null;if(!UI.bus||UI.busCtx!==a){const g=a.createGain(),lp=a.createBiquadFilter(),c=a.createDynamicsCompressor();
  lp.type='lowpass';lp.frequency.value=5200;c.threshold.value=-18;c.ratio.value=3.5;c.attack.value=.003;c.release.value=.12;g.connect(lp).connect(c).connect(a.destination);UI.bus=g;UI.busCtx=a}
  UI.bus.gain.value=.9*OPT.uiVol;return UI.bus}
function uiNote(kind,f,t0,dur,vol){const a=UI.busCtx,bus=UI.bus;
  const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(f,t0);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.005);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g).connect(bus);o.start(t0);o.stop(t0+dur+.03);
  const o2=a.createOscillator(),g2=a.createGain();o2.type='sine';o2.frequency.setValueAtTime(f*(kind==='m'?3.93:2.76),t0);   // parcial de marimba / de campana
  const d2=kind==='m'?dur*.22:dur*.7,v2=kind==='m'?vol*.32:vol*.5;g2.gain.setValueAtTime(0,t0);g2.gain.linearRampToValueAtTime(v2,t0+.003);g2.gain.exponentialRampToValueAtTime(.0001,t0+d2);
  o2.connect(g2).connect(bus);o2.start(t0);o2.stop(t0+d2+.03)}
function uiPlay(name){if(!OPT.sound||!OPT.ui||OPT.uiVol<=0)return;const a=ac();if(!a||!uiBus())return;const def=UI_SND[name];if(!def)return;
  const t=a.currentTime+.005,det=1+(Math.random()-.5)*.025;   // pequeña variación: no suena idéntico cada vez
  for(const [k,f,dt,dur,v] of def)uiNote(k,f*det,t+dt,dur,v)}
// pide un sonido; si en el mismo instante llegan varios (clic + ventana que se abre) suena solo el más importante
function uiSfx(name){if(!UI_SND[name])return;UI.pend.push(name);if(!UI.flushT)UI.flushT=setTimeout(uiFlush,0)}
function uiFlush(){UI.flushT=0;const now=performance.now();let best=null;for(const n of UI.pend)if(!best||UI_PRI[n]>UI_PRI[best])best=n;UI.pend.length=0;if(!best)return;
  if(now-(UI.last[best]||0)<90)return;if(best==='notify'&&now-UI.lastAny<300)return;   // la notificación no se encima sobre otro sonido
  UI.last[best]=now;UI.lastAny=now;uiPlay(best)}
// tecleo de los diálogos: suave, con la voz de cada quien
function uiType(f){if(!OPT.sound||!OPT.ui)return;const a=ac();if(!a||!uiBus())return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();
  o.type='triangle';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.82,t+.04);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.05);
  o.connect(g).connect(UI.bus);o.start(t);o.stop(t+.07)}
// ---------------------------------------------------------------- toques: sonido + destello en el punto tocado
function uiSoundFor(b){if(b.disabled||b.getAttribute('aria-disabled')==='true')return null;
  const a=b.dataset.a,tx=(b.textContent||'').trim();
  if(a==='closePanel'||a==='closeEditor'||a==='closeVista'||b.id==='aqN'||b.id==='netX'||b.id==='netChatX'||/^(Cerrar|Cancelar|Volver|Listo|✕|Salir|Atrás|No\b)/i.test(tx))return'close';
  if(b.classList.contains('red'))return'warn';
  if(b.classList.contains('green'))return'confirm';
  if(b.closest('#dchoices,#tevb'))return'select';
  if(b.closest('.stabs,.ph-tabs,.opts,.sw,.eco-sw,.cg-bar')||b.classList.contains('ech'))return'select';
  if(b.id==='btnA')return'interact';
  return'tap'}
function uiPress(e){const b=e.target.closest&&e.target.closest('button');if(!b||b.disabled)return;
  const r=b.getBoundingClientRect();if(r.width){b.style.setProperty('--px',((e.clientX-r.left)/r.width*100).toFixed(0)+'%');b.style.setProperty('--py',((e.clientY-r.top)/r.height*100).toFixed(0)+'%')}
  b.classList.remove('ui-flash');void b.offsetWidth;b.classList.add('ui-flash');
  if(b.id!=='btnA'){const s=uiSoundFor(b);if(s){uiSfx(s);b._uiS=performance.now()}}
  if(b.classList.contains('cap')){b.classList.remove('ui-flip');void b.offsetWidth;b.classList.add('ui-flip')}}
document.addEventListener('pointerdown',uiPress,true);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;
  if(!b._uiS||performance.now()-b._uiS>700){const s=uiSoundFor(b);if(s&&b.id!=='btnA')uiSfx(s)}b._uiS=0;
  if(b.classList.contains('green')){b.classList.remove('ui-ok');void b.offsetWidth;b.classList.add('ui-ok')}},true);
document.addEventListener('animationend',e=>{const t=e.target;if(t.classList){if(e.animationName==='uiFlash')t.classList.remove('ui-flash');else if(e.animationName==='uiOk')t.classList.remove('ui-ok');else if(e.animationName==='uiCap')t.classList.remove('ui-flip');else if(e.animationName==='uiRingA')t.classList.remove('ui-ring')}},true);
// botón A: anillo al tocar
{const A=$('#btnA');if(A){A.addEventListener('pointerdown',()=>{A.classList.add('ui-down');A.classList.remove('ui-ring');void A.offsetWidth;A.classList.add('ui-ring')});
  for(const ev of['pointerup','pointercancel','pointerleave'])A.addEventListener(ev,()=>A.classList.remove('ui-down'))}}
{const J=$('#joy');if(J){J.addEventListener('pointerdown',()=>J.classList.add('ui-on'));for(const ev of['pointerup','pointercancel'])J.addEventListener(ev,()=>J.classList.remove('ui-on'))}}
// deslizadores: la parte llena sigue al valor
function uiRange(i){const mn=+i.min||0,mx=+i.max||100;i.style.setProperty('--v',((i.value-mn)/(mx-mn)*100)+'%')}
document.addEventListener('input',e=>{if(e.target.type==='range')uiRange(e.target)},true);
// ---------------------------------------------------------------- tipos de ventana: tapita, acento y detalle propio
const UI_ICON={
 quest:'<rect x="2" y="2" width="8" height="10"/><rect x="4" y="1" width="4" height="2"/><rect x="4" y="5" width="4" height="1" class="d"/><rect x="4" y="7" width="4" height="1" class="d"/><rect x="4" y="9" width="3" height="1" class="d"/><rect x="3" y="5" width="1" height="1" class="d"/><rect x="3" y="7" width="1" height="1" class="d"/>',
 bag:'<rect x="5" y="0" width="2" height="1"/><rect x="4" y="1" width="1" height="2"/><rect x="7" y="1" width="1" height="2"/><rect x="3" y="3" width="6" height="1"/><rect x="2" y="4" width="8" height="8"/><rect x="2" y="6" width="8" height="1" class="d"/><rect x="5" y="6" width="2" height="2" class="d"/><rect x="4" y="9" width="4" height="1" class="d"/>',
 phone:'<rect x="3" y="0" width="6" height="1"/><rect x="3" y="11" width="6" height="1"/><rect x="2" y="1" width="1" height="10"/><rect x="9" y="1" width="1" height="10"/><rect x="3" y="8" width="6" height="1"/><rect x="5" y="9" width="2" height="1" class="d"/><rect x="4" y="2" width="1" height="1" class="d"/>',
 map:'<rect x="1" y="3" width="3" height="8"/><rect x="4" y="2" width="4" height="8"/><rect x="8" y="3" width="3" height="8"/><rect x="2" y="8" width="1" height="1" class="d"/><rect x="3" y="7" width="1" height="1" class="d"/><rect x="5" y="6" width="1" height="1" class="d"/><rect x="6" y="5" width="1" height="1" class="d"/><rect x="9" y="4" width="1" height="1" class="d"/><rect x="9" y="5" width="1" height="1" class="d"/>',
 board:'<rect x="4" y="1" width="4" height="1"/><rect x="2" y="2" width="8" height="1"/><rect x="1" y="3" width="10" height="6"/><rect x="2" y="9" width="8" height="1"/><rect x="4" y="10" width="4" height="1"/><rect x="5" y="4" width="2" height="2" class="d"/><rect x="2" y="6" width="1" height="1" class="d"/><rect x="9" y="6" width="1" height="1" class="d"/><rect x="4" y="8" width="1" height="1" class="d"/><rect x="7" y="8" width="1" height="1" class="d"/>',
 settings:'<rect x="5" y="0" width="2" height="2"/><rect x="5" y="10" width="2" height="2"/><rect x="0" y="5" width="2" height="2"/><rect x="10" y="5" width="2" height="2"/><rect x="2" y="2" width="2" height="2"/><rect x="8" y="2" width="2" height="2"/><rect x="2" y="8" width="2" height="2"/><rect x="8" y="8" width="2" height="2"/><rect x="3" y="3" width="6" height="6"/><rect x="5" y="5" width="2" height="2" class="d"/>',
 confirm:'<rect x="5" y="1" width="2" height="7"/><rect x="4" y="2" width="4" height="4"/><rect x="5" y="9" width="2" height="2"/>',
 shop:'<rect x="1" y="3" width="10" height="2"/><rect x="2" y="5" width="8" height="6"/><rect x="3" y="1" width="1" height="2"/><rect x="8" y="1" width="1" height="2"/><rect x="4" y="0" width="4" height="1"/><rect x="4" y="7" width="1" height="2" class="d"/><rect x="7" y="7" width="1" height="2" class="d"/>',
 note:'<rect x="5" y="0" width="2" height="12"/><rect x="0" y="5" width="12" height="2"/><rect x="3" y="3" width="6" height="6"/><rect x="5" y="5" width="2" height="2" class="d"/>',
 net:'<rect x="1" y="3" width="4" height="4"/><rect x="7" y="3" width="4" height="4"/><rect x="0" y="8" width="6" height="4"/><rect x="6" y="8" width="6" height="4"/><rect x="2" y="4" width="2" height="2" class="d"/><rect x="8" y="4" width="2" height="2" class="d"/>',
};
function uiKindFor(title){const t=(title||'').toLowerCase();
  if(UI.kind){const k=UI.kind;UI.kind=null;return k}
  if($('#panel').classList.contains('sport-fullscreen'))return'sport';
  if($('#panel .box').classList.contains('shopbox'))return'shop';
  if(/misiones|historias|medallas/.test(t))return'quest';
  if(/mochila/.test(t))return'bag';
  if(/celular|mensaje|chat|sinpe/.test(t))return'phone';
  if(/mapa/.test(t))return'map';
  if(/opciones|ajustes/.test(t))return'settings';
  if(/vida de barrio|tablón|mandado|huerta|reciclaje|finanzas|mi casa|cargo/.test(t))return'board';
  return'note'}
function uiBadge(kind,el){const ic=UI_ICON[kind]||UI_ICON.note;const s='<span class="ui-badge" aria-hidden="true"><svg viewBox="0 0 12 12" shape-rendering="crispEdges">'+ic+'</svg></span>';
  const old=el.querySelector(':scope>.ui-badge');if(old)old.remove();el.insertAdjacentHTML('afterbegin',s)}
{const _o=openPanel;openPanel=function(title,html,from){const P_=$('#panel'),was=P_.classList.contains('hidden');_o(title,html,from);
  const k=uiKindFor(title);P_.dataset.kind=k;if(k!=='sport')uiBadge(k,$('#ptitle'));setTimeout(uiModal,0);
  P_.querySelectorAll('input[type=range]').forEach(uiRange);
  if(was&&k!=='sport')uiSfx(k==='confirm'?'warn':'open');uiModal()}}
{const _c=closePanel;closePanel=function(){const was=!$('#panel').classList.contains('hidden');_c();if(was)uiSfx('close');uiModal()}}
{const _a=askYes;askYes=function(...args){UI.kind='confirm';const r=_a(...args);UI.kind=null;return r}}
// opciones: sección de sonidos de interfaz (sin tocar las opciones que ya existían)
{const _op=openOptions;openOptions=function(){_op();const body=$('#pbody');if(!body)return;
  const sec=document.createElement('div');sec.className='ui-sec';
  sec.innerHTML='<h4>Sonidos de la interfaz</h4><div class="ui-switch"><span>Botones, ventanas y avisos</span><button id="oUi" class="'+(OPT.ui?'green':'alt')+'" aria-pressed="'+(OPT.ui?'true':'false')+'">'+(OPT.ui?'Sí':'No')+'</button></div>'+
   '<label for="oUiV" style="display:block;font-size:13px;font-weight:700;margin:8px 0 2px">Volumen de la interfaz</label><input id="oUiV" type="range" min="0" max="100" value="'+Math.round(OPT.uiVol*100)+'">';
  body.insertBefore(sec,body.children[1]||null);
  // agrupar lo que ya había: sonido/música arriba como sección
  const first=body.firstElementChild;if(first&&first.classList.contains('row')&&!first.closest('.ui-sec')){const s0=document.createElement('div');s0.className='ui-sec';s0.innerHTML='<h4>Sonido</h4>';body.insertBefore(s0,first);s0.appendChild(first)}
  const ui=$('#oUi'),uv=$('#oUiV');uiRange(uv);
  ui.onclick=()=>{OPT.ui=!OPT.ui;saveOpt();ui.className=OPT.ui?'green':'alt';ui.textContent=OPT.ui?'Sí':'No';ui.setAttribute('aria-pressed',OPT.ui?'true':'false');if(OPT.ui)setTimeout(()=>uiSfx('confirm'),30)};
  let tt=0;uv.oninput=()=>{OPT.uiVol=uv.value/100;saveOpt();if(UI.bus)UI.bus.gain.value=.9*OPT.uiVol;const n=performance.now();if(n-tt>140){tt=n;UI.last.select=0;uiSfx('select')}}}}
// ---------------------------------------------------------------- salida animada (fantasmas)
const UI_GHOST=['#panel','#menu','#editor','#dialog','#netBox'];
function uiGhost(el){if(!el.isConnected||document.hidden)return;const g=el.cloneNode(true);g.classList.remove('hidden');g.classList.add('ui-ghost');g.setAttribute('aria-hidden','true');g.inert=true;
  g.querySelectorAll('[id]').forEach(n=>{n.dataset.gid=n.id;n.removeAttribute('id')});
  const oc=el.querySelectorAll('canvas'),gc=g.querySelectorAll('canvas');oc.forEach((c,i)=>{try{const k=gc[i].getContext('2d');k.drawImage(c,0,0)}catch(e){}});
  el.parentNode.insertBefore(g,el.nextSibling);let done=false;const kill=()=>{if(done)return;done=true;g.remove()};
  g.addEventListener('animationend',e=>{if(e.target===g)kill()});setTimeout(kill,320)}
{const mo=new MutationObserver(recs=>{for(const r of recs){const el=r.target;if(el.classList.contains('ui-ghost'))continue;const was=(r.oldValue||'').split(/\s+/).includes('hidden');
  if(!was&&el.classList.contains('hidden'))uiGhost(el)}uiModal()});
  for(const s of UI_GHOST){const el=$(s);if(el)mo.observe(el,{attributes:true,attributeFilter:['class'],attributeOldValue:true})}
  setTimeout(()=>{const nb=$('#netBox');if(nb&&!nb._uiObs){nb._uiObs=1;mo.observe(nb,{attributes:true,attributeFilter:['class'],attributeOldValue:true})}},0)}
function uiModal(){const open=['#panel','#editor','#netBox'].some(s=>{const e=$(s);return e&&!e.classList.contains('hidden')&&!e.classList.contains('sport-fullscreen')});document.body.classList.toggle('ui-modal',open);const pn=$('#panel');document.body.classList.toggle('ui-sport',!!pn&&!pn.classList.contains('hidden')&&pn.classList.contains('sport-fullscreen'))}
// ---------------------------------------------------------------- notificaciones
{const box=$('#toast');new MutationObserver(recs=>{for(const r of recs)for(const d of r.addedNodes){if(d.nodeType!==1||d._ui)continue;d._ui=1;const t=d.textContent||'';
  if(/^✔ Misión completada: /.test(t)){d.classList.add('tq');const n=t.replace(/^✔ Misión completada: /,'');d.textContent='';const s=document.createElement('small');s.textContent='MISIÓN COMPLETADA';const b=document.createElement('b');b.textContent=n;d.append(s,b);uiSfx('quest');continue}
  if(/^(✔|✅|🎉|★|🏅|¡)/.test(t))d.classList.add('t-ok');else if(/^(⚠|❌|⛔|🚫|📶|😬|💢)/.test(t))d.classList.add('t-warn');else if(/^(💰|₡|🪙|💵)/.test(t))d.classList.add('t-money');else if(/^(👋|🚪|🏠|💬|👥)/.test(t))d.classList.add('t-net');else if(/^(🎶|🎵|ℹ|💡|🌧|☂)/.test(t))d.classList.add('t-info');
  if(!/^🎶|^🎵/.test(t))uiSfx('notify')}}).observe(box,{childList:true})}
// ---------------------------------------------------------------- texto de interacción: aparece con un saltito al cambiar
{const pr=$('#prompt');let last='';new MutationObserver(()=>{const t=pr.textContent;if(t&&t!==last&&!pr.classList.contains('hidden')){pr.classList.remove('ui-pop');void pr.offsetWidth;pr.classList.add('ui-pop')}last=t}).observe(pr,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']})}
// ---------------------------------------------------------------- pausa con resumen (el menú principal se reutiliza)
{const mb=$('#menu .box'),mbt=$('#menu .mbtns');if(mb&&mbt){const d=document.createElement('div');d.id='uiPause';d.innerHTML='<div class="ui-ribbon">EN PAUSA</div><div class="ui-stats" id="uiStats"></div>';mb.insertBefore(d,mbt)}
  const nt=$('#menu .note');if(nt)nt.innerHTML='<span class="ui-pc"><kbd>WASD</kbd> caminar · <kbd>E</kbd> hablar · <kbd>J</kbd> misiones · <kbd>I</kbd> mochila · <kbd>M</kbd> mapa · <kbd>Esc</kbd> pausa</span><span class="ui-touch">Joystick a la izquierda para caminar · botón A para hablar y usar</span>'}
function uiPauseInfo(){const st=$('#uiStats');if(!st||!S)return;const h=Math.floor(S.t/60),m=Math.floor(S.t%60),ap=h<12?'a. m.':'p. m.',h12=((h+11)%12)+1;
  const loc=(MAPS[P.map]&&MAPS[P.map].name)||($('#loc')&&$('#loc').textContent)||'';
  st.innerHTML='<div class="ui-stat"><small>Hora</small><b>'+h12+':'+String(m).padStart(2,'0')+' '+ap+'</b></div><div class="ui-stat"><small>Día</small><b>'+S.day+'</b></div><div class="ui-stat"><small>Plata</small><b>₡'+(S.money||0).toLocaleString('es-CR')+'</b></div>'+(loc?'<div class="ui-stat"><small>Lugar</small><b>'+esc(loc)+'</b></div>':'')}
{const _p=pauseGame;pauseGame=function(){_p();$('#menu').classList.add('paused');uiPauseInfo();uiSfx('open')}}
{const _s=startGame;startGame=function(f){$('#menu').classList.remove('paused');return _s(f)}}
addEventListener('keydown',e=>{if(e.key==='Escape'&&mode==='menu'&&S&&S.started&&$('#panel').classList.contains('hidden')&&$('#editor').classList.contains('hidden')&&!$('#menu').classList.contains('hidden')){const b=$('#bCont');if(b&&!b.classList.contains('hidden')){e.preventDefault();b.click()}}});
{const _n=netUI;netUI=function(){_n();const h=document.querySelector('#netBox .box>h2');if(h&&!h.querySelector('.ui-badge')){h.textContent=h.textContent.replace(/^👥\s*/,'');uiBadge('net',h)}}}
