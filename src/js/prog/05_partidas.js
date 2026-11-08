// ---------- Varias partidas guardadas (ranuras) ----------
// La gracia del juego es vivir distintas vidas: cada ranura guarda su partida (S) y sus personajes (KC) por aparte.
// La partida activa se sigue guardando en KS como siempre (autoguardado incluido); después de cada saveGame se copia a su ranura.
// Cambiar de partida recarga la página: así la vida anterior no deja nada pegado (mapas pintados, vecinos, estados de sistemas).
var PART_NOM_PEND='',PART_LOCK=0,PART_N=6,PART_KEY='mibarrio_slot_',PART_ACT='mibarrio_slot_act',PART_BOOT='mibarrio_boot';
function partGet(n){try{return JSON.parse(localStorage.getItem(PART_KEY+n)||'null')}catch(e){return null}}
function partAct(){try{return+(localStorage.getItem(PART_ACT)||0)}catch(e){return 0}}
function partSetAct(n){try{localStorage.setItem(PART_ACT,String(n))}catch(e){}}
function partFree(){for(let n=1;n<=PART_N;n++)if(!partGet(n))return n;return 0}
// la partida que ya existía (de antes de las ranuras) pasa a la ranura 1
(function(){try{let hay=false;for(let n=1;n<=PART_N;n++)if(localStorage.getItem(PART_KEY+n)){hay=true;break}
  const s=localStorage.getItem(KS);if(!hay&&s){localStorage.setItem(PART_KEY+1,JSON.stringify({nombre:'Partida 1',s,c:localStorage.getItem(KC),meta:partMetaDe(JSON.parse(s)),t:Date.now()}));partSetAct(1)}}catch(e){}})();
function partMetaDe(s){if(!s)return{};let lugar='';try{const m=MAPS[s.map];lugar=m?mapLabel(m):''}catch(e){}
  return{dia:s.day||1,plata:s.money||0,hora:s.t||0,lugar,quien:(CH&&CH.player&&CH.player.name)||'',veh:(s.f&&s.f.pg&&s.f.pg.veh?s.f.pg.veh.filter(v=>!v.gone).length:0)}}
// guardar la partida actual en una ranura (si no se dice, en la activa; si no hay activa, en la primera libre)
function partGuardar(n,silencio){if(!S||!S.started)return false;PART_LOCK++;SAVE_OK++;try{saveGame()}finally{PART_LOCK--;SAVE_OK--}n=n||partAct()||partFree();if(!n){if(!silencio)toast('⚠️ No hay ranuras libres: borrá una o guardá encima de otra.');return false}
  const old=partGet(n);const nom=(old&&old.nombre)||PART_NOM_PEND||('Partida '+n);PART_NOM_PEND='';try{localStorage.setItem(PART_KEY+n,JSON.stringify({nombre:nom,s:localStorage.getItem(KS),c:localStorage.getItem(KC),meta:partMetaDe(S),t:Date.now()}));partSetAct(n)}
  catch(e){if(!silencio)toast('⚠️ No se pudo guardar: el navegador se quedó sin espacio.');return false}
  if(!silencio)toast('💾 Partida guardada en «'+nom+'»');return true}
// GUARDADO MANUAL: el juego ya no guarda solo. Lo que pasa después del último «Guardar partida» no cuenta: si recargás o cerrás, volvés a ese punto.
// (saveGame() solo marca «cambios sin guardar»; ver core/07_state.js). Al empezar una vida nueva se hace un primer guardado para que exista la partida.
hookAfter('startGame',function(fresh){if(fresh&&S&&S.started&&!PART_LOCK){const n=partAct()||partFree();if(n)partGuardar(n,true)}});
function partBotonGuardar(){const n=partAct()||partFree();if(n&&!partGet(n))partNombre('Nombre de la partida','Partida '+n,v=>{PART_NOM_PEND=v;closePanel();partGuardar(n)},()=>closePanel());else partGuardar(0)}
// aviso fijo mientras haya cambios sin guardar (tocarlo guarda) y pregunta del navegador al cerrar
(function(){const d=document.createElement('button');d.id='sinGuardar';d.textContent='💾 Sin guardar · tocá para guardar';d.className='alt hidden';
  d.style.cssText='position:fixed;left:8px;top:calc(150px + env(safe-area-inset-top));z-index:9;font-size:12px;padding:5px 9px;border-radius:12px;opacity:.9';document.body.appendChild(d);
  d.onclick=()=>{if(mode==='play')partBotonGuardar()};
  hookAfter('update',function(){const v=!!(S&&S.started&&SAVE_DIRTY&&mode==='play');if(v!==!d.classList.contains('hidden'))d.classList.toggle('hidden',!v)});
  addEventListener('beforeunload',e=>{if(S&&S.started&&SAVE_DIRTY&&!PART_LOCK){e.preventDefault();e.returnValue=''}})})();
hookAfter('startGame',function(fresh){if(!fresh)SAVE_DIRTY=false;setTimeout(()=>toast(window.__SIN_ALMACEN?'⚠️ Este navegador no deja guardar: la partida se pierde al cerrar. Abrí el HTML en tu navegador para guardar de verdad.':'💾 El juego no guarda solo: usá «Guardar partida» (menú) o el aviso de la esquina.'),3500)});
// cargar una ranura: se copia a KS (y los personajes a KC) y se arranca de cero con la página recargada
function partCargar(n){const p=partGet(n);if(!p)return;PART_LOCK=1;if(S)S.started=false;   // que nada vuelva a guardar la vida anterior antes de recargar
  try{localStorage.setItem(KS,p.s);if(p.c)localStorage.setItem(KC,p.c);else localStorage.removeItem(KC);partSetAct(n);sessionStorage.setItem(PART_BOOT,'cargar')}catch(e){PART_LOCK=0;toast('⚠️ No se pudo cargar la partida.');return}
  location.reload()}
// empezar una vida nueva en una ranura (con el prólogo, como siempre); los personajes de la partida actual se mantienen
function partNueva(n,nombre){PART_LOCK=1;try{localStorage.removeItem(KS);localStorage.removeItem(PART_KEY+n);partSetAct(n);sessionStorage.setItem(PART_BOOT,'nueva');sessionStorage.setItem(PART_BOOT+'_nom',nombre||'')}catch(e){}
  if(S&&S.started){S.started=false;location.reload()}else{try{sessionStorage.removeItem(PART_BOOT);sessionStorage.removeItem(PART_BOOT+'_nom')}catch(e){}PART_LOCK=0;PART_NOM_PEND=nombre||'';proStart(0,()=>{proWake=1;startGame(true)})}}
function partBorrar(n){try{localStorage.removeItem(PART_KEY+n);if(partAct()===n){localStorage.removeItem(PART_ACT);if(!(S&&S.started))localStorage.removeItem(KS)}}catch(e){}}
// al arrancar la página: si venimos de «Cargar» o «Nueva», seguir solos
(function(){let a=null;try{a=sessionStorage.getItem(PART_BOOT);sessionStorage.removeItem(PART_BOOT);PART_NOM_PEND=sessionStorage.getItem(PART_BOOT+'_nom')||'';sessionStorage.removeItem(PART_BOOT+'_nom')}catch(e){}
  if(a==='cargar')setTimeout(()=>startGame(false),0);else if(a==='nueva')setTimeout(()=>proStart(0,()=>{proWake=1;startGame(true)}),0)})();
// ---- pedir un nombre: al crear una partida, al guardarla por primera vez y al renombrarla ----
function partNombre(titulo,def,ok,no){openPanel(titulo,`<p class="note">Por ejemplo: «El magnate», «Vida tranquila», «Con Ariana».</p><input id="pNom" maxlength="28" value="${esc(def)}" style="width:100%;font-size:16px;padding:8px"><div class="row" style="margin-top:12px"><button class="green" id="pNomOk">Listo</button><button class="alt" id="pNomNo">Cancelar</button></div>`);
  const i=$('#pNom');setTimeout(()=>{try{i.focus();i.select()}catch(e){}},50);
  const fin=()=>ok((i.value||'').trim().slice(0,28)||def);i.onkeydown=e=>{if(e.key==='Enter')fin()};$('#pNomOk').onclick=fin;$('#pNomNo').onclick=()=>(no||partPanel)()}
// ---- el panel de partidas ----
function partFecha(t){if(!t)return'';const d=new Date(t),p=v=>String(v).padStart(2,'0');return p(d.getDate())+'/'+p(d.getMonth()+1)+' '+p(d.getHours())+':'+p(d.getMinutes())}
function partPanel(modoNueva){const act=partAct(),jugando=!!(S&&S.started);let h=modoNueva?'<p class="note">Elegí en qué ranura empezar la vida nueva. Las demás partidas no se tocan.</p>':'<p class="note">Cada ranura es una vida distinta. El juego NO guarda solo: lo que hagás después de guardar no cuenta hasta que toqués «Guardar». Con «Guardar aquí» la copiás a otra ranura.</p>';
  for(let n=1;n<=PART_N;n++){const p=partGet(n),m=(p&&p.meta)||{},esAct=n===act;
    h+=`<div class="qitem"><b>${p?'📁 '+esc(p.nombre):'▫️ Ranura '+n+' (vacía)'}${esAct&&p?' · <span style="color:#7bd16b">activa</span>':''}</b>`;
    if(p)h+=`<p>${m.quien?esc(m.quien)+' · ':''}Día ${m.dia} · ${fmtC(m.plata||0)}${m.lugar?' · '+esc(m.lugar):''}${m.veh?' · '+m.veh+' vehículo'+(m.veh>1?'s':''):''}</p><p class="note">Guardada el ${partFecha(p.t)}</p>`;
    h+='<div class="row">';
    if(modoNueva)h+=`<button class="${p?'red':'green'}" data-pn="${n}">${p?'Empezar aquí (borra esta)':'Empezar aquí'}</button>`;
    else{if(p&&!(esAct&&jugando))h+=`<button class="green" data-pc="${n}">Jugar</button>`;if(jugando)h+=`<button class="alt" data-pg="${n}">${esAct?'Guardar':'Guardar aquí'}</button>`;
      if(p)h+=`<button class="alt" data-pr="${n}">Nombre</button><button class="red" data-pb="${n}">Borrar</button>`;if(!p&&!jugando)h+=`<button class="green" data-pn="${n}">Nueva vida aquí</button>`}
    h+='</div></div>'}
  openPanel(modoNueva?'Nueva partida':'Partidas guardadas',h);const pb=$('#pbody'),on=(a,f)=>pb.querySelectorAll('[data-'+a+']').forEach(b=>b.onclick=()=>f(+b.dataset[a]));
  on('pc',n=>{const go=()=>partCargar(n);if(jugando)askYes('Cambiar de partida','La partida actual se guarda antes de cambiar. ¿Ir a «'+partGet(n).nombre+'»?',()=>{partGuardar(0,true);go()},'Sí, cambiar');else go()});
  on('pg',n=>{const p=partGet(n);const go=()=>{if(p){partGuardar(n);partPanel()}else partNombre('Nombre de la partida','Partida '+n,v=>{PART_NOM_PEND=v;partGuardar(n);partPanel()})};if(p&&n!==act)askYes('Guardar encima','«'+p.nombre+'» se va a reemplazar con la partida actual. ¿Seguro?',go,'Sí, reemplazar');else go()});
  on('pn',n=>{const p=partGet(n);const go=()=>partNombre('Nombre de la nueva partida','Partida '+n,v=>{closePanel();partNueva(n,v)},()=>partPanel(true));if(p)askYes('Nueva partida','Se borra «'+p.nombre+'» para empezar ahí una vida nueva. ¿Seguro?',go,'Sí, borrar y empezar');else go()});
  on('pb',n=>{const p=partGet(n);askYes('Borrar partida','¿Borrar «'+p.nombre+'» para siempre?',()=>{partBorrar(n);refreshMenu();partPanel(modoNueva)},'Sí, borrar')});
  on('pr',n=>{const p=partGet(n);partNombre('Nombre de la partida',p.nombre,v=>{p.nombre=v;try{localStorage.setItem(PART_KEY+n,JSON.stringify(p))}catch(e){}partPanel()})})}
// ---- botones del menú: «Partidas», «Guardar partida» y «Nueva partida» que pregunta la ranura ----
(function(){const mb=document.querySelector('#menu .mbtns');if(!mb)return;
  const bP=document.createElement('button');bP.id='bPart';bP.className='alt';bP.textContent='📂 Partidas';
  const bG=document.createElement('button');bG.id='bGuardar';bG.className='green';bG.textContent='💾 Guardar partida';
  const nv=mb.querySelector('[data-a="new"]');if(nv){nv.insertAdjacentElement('afterend',bP);mb.querySelector('#bCont').insertAdjacentElement('afterend',bG);
    nv.removeAttribute('data-a');nv.onclick=()=>{if(!(S&&S.started)&&!loadGame()){const n=partAct()||partFree();if(n){partNombre('Nombre de la nueva partida','Partida '+n,v=>{closePanel();partNueva(n,v)},()=>closePanel());return}}partPanel(true)}}
  else mb.appendChild(bP);
  bP.onclick=()=>partPanel(false);bG.onclick=()=>partBotonGuardar()})();
hookAfter('refreshMenu',function(){const g=$('#bGuardar');if(g)g.classList.toggle('hidden',!(S&&S.started))});
setTimeout(()=>{try{refreshMenu()}catch(e){}},0);
