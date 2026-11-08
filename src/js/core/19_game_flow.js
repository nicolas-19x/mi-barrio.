// ================= GAME FLOW =================
let BUS_H=[7,10,13,16,19],bus={x:-200,active:false,stop:0,last:-1,honked:false};
const fmtH=h=>(h%12||12)+(h<12?' a. m.':' p. m.');
function fmtTime(){const h=hour(),m=Math.floor(S.t%60);return(h%12||12)+':'+String(m).padStart(2,'0')+(h<12?' a. m.':' p. m.')}
function checkPeriod(){const p=period();if(p!==S.per){const old=S.per;S.per=p;if(p==='m'&&S.f.fiestaOn)S.f.fiestaOn=0;if(p==='t'&&old&&Math.random()<.4)S.rain=80;placeNPCs(false)}}
function fadeDo(mid,after){const f=$('#fade');f.style.opacity=1;fading=true;setTimeout(()=>{mid&&mid();snapCam();f.style.opacity=0;setTimeout(()=>{fading=false;after&&after()},250)},260)}
let fading=false,doorCD=0;
function changeMap(map,x,y,dir){fadeDo(()=>{P.map=map;P.x=x;P.y=y;P.dir=dir;const d=ENTS.find(e=>e.special==='firulais');if(d&&S.f.dogFollow){d.map=map;d.x=x;d.y=y+1}doorCD=.5;beep(220,.08,'triangle',.05);saveGame()})}
function checkDoors(){if(doorCD>0)return;const m=MAPS[P.map];const[tx,ty]=tileOf(P);
  if(!m.interior){const d=m.doors.find(d=>d.x===tx&&d.y===ty);if(!d)return;if(d.cond&&!d.cond()){doorCD=1.5;toast(d.closed||'Está cerrado');P.y+=3;return}ensureMap(d.to);const e=MAPS[d.to].entry||{x:7,y:8};changeMap(d.to,e.x*T+8,e.y*T+12,1)}
  else if(m.exit&&tx===m.exit.x&&ty===m.exit.y){if(m.out){changeMap(m.out.map,m.out.x*T+8,m.out.y*T+12,0);return}const b=m.b;changeMap('ext',b.dx*T+8,(b.dy+1)*T+12,0)}}
let target=null;
function findTarget(){const m=MAPS[P.map];let best=null,bd=1e9;
  for(const a of ACT_POINTS){if(a.map!==P.map||(a.cond&&!a.cond()))continue;const d=Math.hypot(a.x*T+8-P.x,a.y*T+12-P.y);if(d<21&&d<bd){bd=d;best={type:'activity',a}}}
  if(best)return best;
  for(const e of ENTS){if(e.map!==P.map)continue;if(e.kind==='animal'&&!animalActive(e))continue;const d=Math.hypot(e.x-P.x,e.y-P.y);const lim=e.special==='kiki'?16:(e.reach||26);if(d<lim&&d<bd){bd=d;best={type:e.kind,e}}}
  if(!best)for(const p of PICKS){if(p.map!==P.map||!p.cond())continue;const d=Math.hypot(p.x*T+8-P.x,p.y*T+10-P.y);if(d<20&&d<bd){bd=d;best={type:'pick',p}}}
  if(!best){const[dx,dy]=DV[P.dir];const fx=Math.floor((P.x+dx*12)/T),fy=Math.floor((P.y-4+dy*12)/T);const o=m.objs.find(o=>o.act&&fx>=o.x&&fx<o.x+o.w&&fy>=o.y&&fy<o.y+o.h);if(o)best={type:'furn',o}}
  return best}
function targetLabel(t){if(!t)return'';if(t.type==='activity')return t.a.label;if(t.type==='npc'||t.type==='ped')return'Hablar con '+t.e.c.name;if(t.type==='animal')return t.e.special==='firulais'?'Llamar a Firulais':t.e.special==='kiki'?'¡Atrapar a Kiki!':t.e.special==='cadejos'?'¿Qué es eso?':'Acariciar a '+t.e.name;if(t.type==='pick')return t.p.lab;
  const L={bed:'Cama',night:'Mesita',tv:'Ver tele',fridge:'Abrir refri',stove:'Cocina',counter:'Desayunador',sofa:'Sillón',table:'Mesa',shop:'Comprar',shelf:'Ver estantes',drinks:'Refri de frescos',sacks:'Sacos',compu:'Compu'};return L[t.o.act]||'Mirar'}
function interact(){if(mode!=='play'||fading)return;const t=target;if(!t)return;uiSfx('interact');
  if(t.type==='activity'){t.a.run();runDialog();return}
  if(t.type==='npc'){const n=t.e;n.talking=true;talkEnt=n;faceTo(n,P);P.dir=dirTo(P,n);if(S.activities.delivery===n.c.id){deliver(n.c.id)}else if(!zGive(n.c.id)){const fn=TALK[n.c.id];if(fn)fn();else genericTalk(n.c)}}
  else if(t.type==='ped'){t.e.talking=true;talkEnt=t.e;if(t.e.c.id!=='z_estatua')faceTo(t.e,P);if(t.e.talk)t.e.talk(t.e);else pedTalk(t.e)}
  else if(t.type==='animal')animalTalk(t.e);else if(t.type==='pick')t.p.take();else furnTalk(t.o,MAPS[P.map]);
  runDialog()}
function dirTo(a,b){const dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0)}
function faceTo(e,o){e.dir=dirTo(e,o)}
// ---------- input ----------
const KEYS={};let joy={x:0,y:0,id:null};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();KEYS[k]=1;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)&&mode!=='menu'&&!(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))e.preventDefault();
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;if(e.repeat)return;
  if(mode==='prologo'){proKey(k);return}
  if(mode==='trip'){tripKey(k);return}
  if(mode==='view'){if(k==='escape'||k==='e'||k===' '||k==='enter'||k==='backspace')closeVista();else if(k==='t')vistaWait();return}
  if(mode==='combat'){if(k==='r'&&COMBAT)combatReload(COMBAT.p);else if(k==='escape')toggleCombatPause();return}
  if(mode==='dialog'){if(dcur&&dcur.choices&&dTyped>=dcur.text.length){if(k==='arrowup'||k==='w')selMove(-1);else if(k==='arrowdown'||k==='s')selMove(1);else if(/^[1-4]$/.test(k))choose(+k-1);else if(k==='enter'||k===' '||k==='e')choose(dsel)}else if(k==='enter'||k===' '||k==='e')advance();return}
  if(mode==='panel'&&SPORT&&(k===' '||k==='enter'||k==='e')){e.preventDefault();sportPress();return}
  if(mode==='play'){if(k==='e'||k===' '||k==='enter')interact();else if(k==='j')openQuests();else if(k==='i')openInv();else if(k==='shift')KEYS.shift=1;else if(k==='escape')pauseGame()}
  else if(mode==='panel'&&(k==='escape'||k==='j'||k==='i'))closePanel()});
addEventListener('keyup',e=>{KEYS[e.key.toLowerCase()]=0});
addEventListener('blur',()=>{for(const k in KEYS)KEYS[k]=0});
const joyEl=$('#joy'),knob=$('#knob');
joyEl.addEventListener('pointerdown',e=>{joy.id=e.pointerId;joyEl.setPointerCapture(e.pointerId);joyMove(e);ac()});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joy.id)joyMove(e)});
const joyEnd=e=>{if(e.pointerId!==joy.id)return;joy={x:0,y:0,id:null};knob.style.transform=''};
joyEl.addEventListener('pointerup',joyEnd);joyEl.addEventListener('pointercancel',joyEnd);
function joyMove(e){const r=joyEl.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const L=Math.hypot(dx,dy),M=50;if(L>M){dx*=M/L;dy*=M/L}knob.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/M;joy.y=dy/M}
$('#btnA').addEventListener('pointerdown',e=>{e.preventDefault();ac();if(mode==='play')interact();else if(mode==='combat'){combatTrigger=true;$('#btnA').setPointerCapture(e.pointerId)}});
$('#btnA').addEventListener('pointerup',()=>combatTrigger=false);$('#btnA').addEventListener('pointercancel',()=>combatTrigger=false);
$('#dialog').addEventListener('pointerdown',e=>{if(e.target.tagName==='BUTTON')return;advance()});
const TOUCH=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;document.body.classList.toggle('touch',TOUCH);
function showTouch(){$('#touch').classList.toggle('hidden',!(TOUCH&&(mode==='play'||mode==='combat')));if(mode==='combat')$('#btnA').textContent='Disparar'}
// ---------- UI ----------
// Los avisos salen de uno en uno; si se acumulan, cada uno dura menos para no tapar el juego.
const TQ=[];let tBusy=false;
function toast(t){if(TQ[TQ.length-1]===t)return;TQ.push(t);if(!tBusy)nextToast()}
function nextToast(){const t=TQ.shift();if(t==null){tBusy=false;return}tBusy=true;const box=$('#toast'),d=document.createElement('div');d.textContent=t;box.appendChild(d);
 const dur=TQ.length>2?1300:TQ.length?2000:2800;setTimeout(()=>{d.classList.add('out');setTimeout(()=>{d.remove();nextToast()},200)},dur)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;ac();const a=b.dataset.a;if(a==='closeVista')return closeVista();if(a==='vistaWait')return vistaWait();
  if(a==='continue'){if(S&&S.started)resumeGame();else startGame(false)}else if(a==='new'){const go=()=>proStart(0,()=>{proWake=1;startGame(true)});if(loadGame())askYes('Nueva partida','¿Empezar de nuevo? Se borrará el progreso actual (los personajes se mantienen).',go,'Sí, empezar de nuevo');else go()}
  else if(a==='editor')openEditor();else if(a==='closeEditor')closeEditor();else if(a==='options')openOptions();else if(a==='phone')openPhone();else if(a==='map')openMap();else if(a==='quests')openQuests();else if(a==='inv')openInv();else if(a==='activities')openActivities();else if(a==='pause')pauseGame();else if(a==='closePanel')closePanel();else if(a==='addChar')addChar()});
let panelFrom='play';
function openPanel(title,html,from){panelFrom=from||mode;$('#ptitle').textContent=title;$('#pbody').innerHTML=html;$('#panel').classList.remove('hidden');if(mode==='play')mode='panel';showTouch();$('#prompt').classList.add('hidden')}
function closePanel(){SPORT=null;$('#panel').classList.remove('sport-fullscreen');$('#panel .box').classList.remove('shopbox');$('#panel').classList.add('hidden');if(mode==='panel')mode='play';showTouch()}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function openQuests(){let h='';const act=QORDER.filter(q=>qs(q)===1),done=QORDER.filter(q=>qs(q)===2);
  if(!act.length&&!done.length)h+='<p>Todavía no tenés misiones.</p>';
  act.forEach(q=>h+=`<div class="qitem"><b>▶ ${esc(QUESTS[q].t)}</b><p>${esc(QUESTS[q].d())}</p></div>`);
  if(!qs('gallo')&&on('marta')&&qs('barra')===2)h+=`<div class="qitem"><b>? Rumor</b><p>Dicen que ${esc(N('marta'))} anda preocupada por algo.</p></div>`;
  done.forEach(q=>h+=`<div class="qitem done"><b>✔ ${esc(QUESTS[q].t)}</b></div>`);
  h+=questExtras();h+=zQuests();h+=`<p class="note">Secretos encontrados: ${Object.keys(S.f.sec).length}/5</p>`;openPanel('Misiones',h)}
function openInv(){let h=`<p><b>Plata:</b> ₡${S.money}${S.f.fiado?' · Fiado en la pulpería: ₡'+S.f.fiado:''}</p>`;const ks=Object.keys(S.inv);if(!ks.length)h+='<p>La mochila está vacía.</p>';
  ks.forEach(k=>{const use=SHOP_USE[k]||(k==='fresco'?'Tomar':(k==='gallopinto'||k==='picadillo')?'Comer':k==='chicle'?'Masticar':'');h+=`<div class="qitem row" style="justify-content:space-between"><div><b>${esc(itemName(k))} ×${S.inv[k]}</b><p>${esc(ITEMS[k][1])}</p></div>${use?`<button class="green" data-use="${k}">${use}</button>`:''}</div>`});
  openPanel('Mochila',h);$('#pbody').querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{const k=b.dataset.use;remI(k);if(k==='tazos'){const r=Math.random();toast(r<.08?'¡TAZO DORADO! El más difícil de todos.':r<.4?'Un tazo repetido... sirve para cambiar.':'¡Uno nuevo para la colección!');S.f.tazoCol=(S.f.tazoCol||0)+1}else toast(SHOP_USE_MSG[k]||(k==='fresco'?'¡Qué fresco más rico!':k==='gallopinto'?'Gallo pinto: energía para todo el día.':'Mascás el chicle. Menta pura.'));saveGame();openInv()})}
function openOptions(){openPanel('Opciones',`<div class="row" style="margin-bottom:10px"><button id="oSnd" class="${OPT.sound?'green':'alt'}">Sonido: ${OPT.sound?'Sí':'No'}</button></div>
 <div class="row" style="margin-bottom:10px"><button id="oPro" class="alt">🌫 Ver el prólogo otra vez</button></div>
 <p class="note">El progreso se guarda solo en este navegador.</p><div class="row"><button id="oDel" class="red">Borrar partida</button><button id="oChr" class="red">Restaurar personajes</button></div>`,'menu');
 $('#oSnd').onclick=()=>{OPT.sound=!OPT.sound;saveOpt();openOptions()};
 $('#oPro').onclick=()=>proReplay();
 $('#oDel').onclick=()=>askYes('Borrar partida','¿Borrar todo el progreso de la partida?',()=>{try{localStorage.removeItem(KS)}catch(e){}toast('Partida borrada');refreshMenu()},'Sí, borrar');
 $('#oChr').onclick=()=>askYes('Restaurar personajes','¿Volver los personajes a como venían?',()=>{try{localStorage.removeItem(KC)}catch(e){}loadChars();SPR.clear();ENTS=ENTS.filter(e=>e.kind!=='npc');NPC={};placeNPCs(true);toast('Personajes restaurados')},'Sí, restaurar')}
function refreshMenu(){$('#bCont').classList.toggle('hidden',!localStorage.getItem(KS)&&!(S&&S.started))}
function startGame(fresh){SPORT=null;activityMarker=null;const s=fresh?null:loadGame();S=s||newState();S.started=true;ecoStart();S.per='';ensureMap(S.map);if(!MAPS[S.map]){S.map='casa_jugador';S.x=7*T+8;S.y=6*T+12}P.map=S.map;P.x=S.x;P.y=S.y;P.dir=S.dir;
  ENTS.forEach(e=>{if(e.kind==='npc')e.loc=null});phDL='';PHV.open=0;PHV.th=null;checkPeriod();placeNPCs(true);snapCam();
  $('#menu').classList.add('hidden');$('#hud').classList.remove('hidden');mode='play';showTouch();phBadge();
  if(!s){if(proWake){proWake=0;proWakeScene()}else{say(null,'Sábado en el barrio. El sol pega en el zinc, huele a café chorreado y alguien tiene la radio a todo volumen.');say(null,'Es un buen día para salir a saludar a la barra.');afterD(()=>startQ('barra'))}runDialog()}saveGame()}
// Continuar desde el menú de pausa: se sigue donde ibas (no se recarga la partida guardada)
function resumeGame(){$('#menu').classList.add('hidden');$('#hud').classList.remove('hidden');mode='play';showTouch()}
function pauseGame(){saveGame();mode='menu';$('#hud').classList.add('hidden');$('#prompt').classList.add('hidden');showTouch();refreshMenu();$('#menu').classList.remove('hidden')}
// ---------- editor ----------
let eSel='player';
function openEditor(){$('#editor').classList.remove('hidden');renderEList();renderEForm()}
function closeEditor(){$('#editor').classList.add('hidden');saveChars();placeNPCs(true)}
function renderEList(){const L=$('#elist');L.innerHTML='';CHARS.forEach(c=>{const b=document.createElement('button');b.className='ech'+(c.id===eSel?' on':'')+(c.enabled?'':' off');const cn=mk(36,52);{const cg=cn.getContext('2d');cg.imageSmoothingEnabled=false;cg.drawImage(c.id==='player'?heroSprite(0,6,c.shirt):npcSprite(c,0,6),0,0,36,52,0,0,36,52)}b.appendChild(cn);const t=document.createElement('div');t.innerHTML=esc(c.name)+'<small>'+esc(c.role||'')+(c.enabled?'':' · desactivado')+'</small>';b.appendChild(t);b.onclick=()=>{eSel=c.id;renderEList();renderEForm()};L.appendChild(b)})}
let prevT=0;
function renderEForm(){const c=CH[eSel];if(!c){eSel='player';return renderEForm()}const F=$('#eform');
  const sw=(key,cols)=>`<div class="sw" data-k="${key}">${cols.map(x=>`<button style="background:${x}" data-v="${x}" class="${c[key]===x?'sel':''}" aria-label="${x}"></button>`).join('')}</div>`;
  const op=(key,arr)=>`<div class="opts" data-k="${key}">${arr.map(([v,l])=>`<button data-v="${v}" class="${c[key]===v?'sel':''}">${l}</button>`).join('')}</div>`;
  F.innerHTML=`<canvas id="prev" width="144" height="58"></canvas>
  <label class="f">Nombre</label><input type="text" id="fName" maxlength="20" value="${esc(c.name)}">
  <label class="f">Papel en el barrio</label><input type="text" id="fRole" maxlength="30" value="${esc(c.role||'')}">
  ${c.core?'':`<label class="f">Estado</label><div class="row"><button id="fEn" class="${c.enabled?'green':'alt'}">${c.enabled?'Activo en el barrio':'Desactivado'}</button>${c.custom?'<button id="fDel" class="red">Eliminar</button>':''}</div>`}
  <label class="f">Peinado</label>${op('hair',HAIRS)}
  <label class="f">Color de cabello</label>${sw('hairColor',HAIRC)}
  <label class="f">Tono de piel</label>${sw('skin',SKINC)}
  <label class="f">Camisa</label>${sw('shirt',CLOTHC)}
  <label class="f">Pantalón</label>${sw('pants',CLOTHC)}
  <label class="f">Accesorio</label>${op('acc',ACCS)}
  <label class="f">Color del accesorio</label>${sw('accColor',CLOTHC.concat(['#f5c542','#d9b36c']))}
  <label class="f">Tatuajes</label><button id="fTat" class="${c.tattoos?'green':'alt'}">${c.tattoos?'Con tatuajes':'Sin tatuajes'}</button>
  <label class="f">Personalidad</label>${op('pers',PERS)}
  <label class="f">Descripción</label><textarea id="fDesc" maxlength="160">${esc(c.desc||'')}</textarea>
  ${c.id==='player'?'':`<label class="f">Ubicación habitual</label><select id="fHome">${EDIT_LOCS.map(k=>`<option value="${k}" ${c.home===k?'selected':''}>${esc(locLabel(k))}</option>`).join('')}</select>${SCHED[c.id]?'<p class="note">Este personaje también sale a otros lugares según la hora del día.</p>':''}`}
  ${c.core?'<p class="note">Personaje principal de la historia: siempre está activo.</p>':''}`;
  const upd=()=>{c.v++;SPR.clear();saveChars();renderEList();drawPrev()};
  F.querySelectorAll('[data-k]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{c[g.dataset.k]=b.dataset.v;g.querySelectorAll('button').forEach(x=>x.classList.toggle('sel',x===b));upd()}));
  $('#fName').oninput=e=>{c.name=e.target.value.trim()||'Sin nombre';upd()};$('#fRole').oninput=e=>{c.role=e.target.value;saveChars();renderEList()};$('#fDesc').oninput=e=>{c.desc=e.target.value;saveChars()};
  if($('#fTat'))$('#fTat').onclick=()=>{c.tattoos=c.tattoos?0:1;upd();renderEForm()};
  if($('#fHome'))$('#fHome').onchange=e=>{c.home=e.target.value;saveChars()};
  if($('#fEn'))$('#fEn').onclick=()=>{c.enabled=!c.enabled;saveChars();renderEList();renderEForm()};
  if($('#fDel'))$('#fDel').onclick=()=>{if(!confirm('¿Eliminar a '+c.name+'?'))return;CHARS=CHARS.filter(x=>x!==c);delete CH[c.id];const n=NPC[c.id];if(n){ENTS=ENTS.filter(e=>e!==n);delete NPC[c.id]}eSel='player';saveChars();renderEList();renderEForm()};
  drawPrev()}
function drawPrev(){const cnv=$('#prev');if(!cnv)return;const g=cnv.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,144,58);const c=CH[eSel];if(!c)return;const fi=Math.floor(prevT*8)%6;[0,3,1,2].forEach((d,i)=>g.drawImage(c.id==='player'?heroSprite(d,fi,c.shirt):npcSprite(c,d,fi),i*36,0))}
function addChar(){const id='c'+Date.now().toString(36);const c=fillChar({id,custom:1,name:'Nuevo vecino',role:'Amigo/a',hairColor:pick(HAIRC),skin:pick(SKINC),shirt:pick(CLOTHC),pants:pick(CLOTHC),hair:pick(HAIRS)[0],home:'calle',v:1});CHARS.push(c);CH[id]=c;eSel=id;saveChars();renderEList();renderEForm()}

