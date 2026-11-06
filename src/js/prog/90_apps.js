// ================= PROGRESO · APPS DEL CELULAR =================
// Pestaña «📱 Apps»: Marketplace, la agencia, COSEVI, RTV y marchamo, INS, Pedidos Mae, Mis vehículos
// (y las de las otras fases: Mi negocio, Banco, Metas, Logros).
var APPS;
function appReg(a){(APPS=APPS||[]).push(a)}
function progApps(){let h='<div class="pg-apps">';for(const a of APPS){if(a.cond&&!a.cond())continue;const badge=a.badge?a.badge():0;
    h+=`<button class="pg-app" data-app="${a.id}" style="--ac:${a.c}"><span class="pg-ic">${a.ic}</span><b>${a.n}</b>${badge?`<i class="ph-dot">${badge}</i>`:''}</button>`}
  return h+'</div><p class="note" style="margin-top:10px">Todo lo que comprás y hacés aquí ayuda a crecer: tu casa, tus vehículos, tu negocio y tu nombre en el barrio.</p>'}
function appOpen(id){const a=APPS.find(x=>x.id===id);if(!a)return;if(typeof UI!=='undefined')UI.kind='phone';openPanel('📱 '+a.n,'<div class="ph">'+a.html()+'<div class="row" style="margin-top:10px"><button class="alt" data-app="home">◀ Volver a las apps</button></div></div>');if(typeof UI!=='undefined')UI.kind=null;appBind(a)}
function appBind(a){const b=$('#pbody');b.querySelectorAll('[data-app]').forEach(x=>x.onclick=()=>{if(x.dataset.app==='home'){PHV.tab='apps';PHV.th=null;phRender()}else appOpen(x.dataset.app)});
  b.querySelectorAll('[data-act]').forEach(x=>x.onclick=()=>{const[k,arg]=x.dataset.act.split(':');a.act&&a.act(k,arg,x)})}
{const _pb=phBind;phBind=function(){_pb();const b=$('#pbody');b.querySelectorAll('[data-app]').forEach(x=>x.onclick=()=>appOpen(x.dataset.app))}}
const vName=v=>VM[v.m].ic+' '+VM[v.m].n;
const pgBar=(v,c)=>`<div class="eco-bar"><i style="width:${Math.round(v)}%;background:${c||'var(--ui-leaf,#3fa66b)'}"></i></div>`;
function vWhere(v){if(v.dep)return'en el depósito de Tránsito';if(v.id===PGS().ride)return'la vas manejando';const m=v.map==='ext'?(Math.hypot(v.x-HOME_PARK.x,v.y-HOME_PARK.y)<60?'frente a tu casa':v.y>52*T?'en la Calle 3':'en el barrio'):v.map==='chepe'?'en Chepe':v.map==='hoyo'?'en El Hoyo 😬':'¿?';return m}
// ---- Mis vehículos ----
appReg({id:'veh',n:'Mis vehículos',ic:'🚗',c:'#2a6fb0',badge:()=>PGS().veh.filter(v=>!v.gone&&(v.varado||v.dep)).length,html(){const p=PGS(),vs=p.veh.filter(v=>!v.gone);
  if(!vs.length)return'<p>Todavía no tenés ningún vehículo. Buscá en el <b>Marketplace</b> o en la <b>agencia</b>.</p><div class="row"><button data-app="mk">🛒 Marketplace</button><button data-app="ag">🏍 Agencia</button></div>';
  return vs.map(v=>{const c=VM[v.m],pap=vPapeles(v);return`<div class="qitem"><b>${vName(v)}</b><p>Placa ${v.placa} · ${vWhere(v)}${v.varado?' · <b style="color:#ff9b8f">varada</b>':''}</p>
    ${c.motor?'<p>⛽ Gasolina '+Math.round(v.gas*100)+'%</p>'+pgBar(v.gas*100,'#e2b33a'):''}<p>🔧 Estado ${Math.round(v.cond)}%</p>${pgBar(v.cond)}
    ${c.motor?`<p class="note">Marchamo hasta el día ${p.mar[v.id]||'—'} · RTV hasta el día ${p.rtv[v.id]||'—'}${p.seg[v.id]?' · 🛡 asegurada':''}${pap.length?' · <b style="color:#ff9b8f">'+pap.map(x=>({lic:'sin licencia',mar:'marchamo vencido',rtv:'RTV vencida',hot:'¿robada?'}[x])).join(', ')+'</b>':''}</p>`:''}
    <div class="row">${v.varado||v.cond<30?`<button data-act="grua:${v.id}">🚛 Llamar la grúa (₡12 000)</button>`:''}<button class="alt" data-act="vender:${v.id}">Vender</button></div></div>`}).join('')},
 act(k,id){const v=vOf(id);if(!v)return;
  if(k==='grua'){if(S.money<12000)return toast('Te faltan '+fmtC(12000-S.money));spend(12000,'Grúa');if(PGS().ride===v.id)progDismount(true);v.map='ext';if(S.f.kevinHelp){v.x=41.5*T;v.y=60*T+10}else{v.x=HOME_PARK.x;v.y=HOME_PARK.y}v.dir=3;toast('🚛 La grúa la llevó '+(S.f.kevinHelp?'al Taller El Abuelo':'a tu casa'));appOpen('veh')}
  if(k==='vender'){const c=VM[v.m];if(c.hot){say(null,'Nadie te compra una moto sin papeles. Bueno… el Chino te la recibe en ₡8 000.',[{t:'Vendérsela al Chino',f(){v.gone=1;earn(8000,'Venta de vehículos')}},{t:'Mejor no'}]);closePanel();runDialog();return}
    const val=Math.round(c.price*.55*(.5+v.cond/200)/500)*500;askYes('Vender '+c.n,'¿Venderla por '+fmtC(val)+'? Alguien del Marketplace la recoge hoy mismo.',()=>{if(PGS().ride===v.id)progDismount(true);v.gone=1;earn(val,'Venta de vehículos');toast('💸 Vendida en '+fmtC(val))},'Sí, vender')}}});
// ---- Marketplace ----
appReg({id:'mk',n:'Marketplace',ic:'🛒',c:'#3fa66b',html(){const l=mkListings();return'<p class="note">Anuncios del día. Mañana salen otros.</p>'+l.map((x,i)=>{const c=VM[x.m];return`<div class="qitem"><b>${c.ic} ${c.n} · ${fmtC(x.price)}</b><p>«${esc(x.txt)}»</p><p class="note">${esc(x.who)} · estado ${x.cond}%</p>${x.sold?'<p><b>Vendido</b></p>':`<button class="green" data-act="buy:${i}">Comprar (te la llevan a la casa)</button>`}</div>`}).join('')},
 act(k,i){const x=mkListings()[+i];if(!x||x.sold)return;if(k==='buy'){const v=vBuy(x.m,'entrega',x.price,{cond:x.cond,gas:VM[x.m].motor?.4:0});if(v){x.sold=1;if(VM[x.m].motor){PGS().mar[v.id]=S.day+(10+((Math.random()*14)|0));PGS().rtv[v.id]=S.day+(6+((Math.random()*12)|0))}appOpen('mk')}}}});
// ---- agencia ----
const AG=[['bici_r'],['moto_n',1],['carro',1],['pickup',1]];
appReg({id:'ag',n:'Agencia del Valle',ic:'🏍',c:'#c0473b',html(){return'<p class="note">Motos y Autos del Valle · «Su sueño sobre ruedas, a cómodas cuotas».</p>'+AG.map(([m,cr])=>{const c=VM[m],prima=Math.round(c.price*.25/500)*500,cuota=Math.round(c.price*.75*1.18/12/50)*50;
  return`<div class="qitem"><b>${c.ic} ${c.n} · ${fmtC(c.price)}</b><p>${m==='carro'?'Seminuevo de agencia, revisado y con garantía de 3 meses.':m==='pickup'?'Doble tracción, palangana grande. Para trabajos pesados y mudanzas.':m==='moto_n'?'0 km, 150 cc, frenos de disco. Rápida y gasta poquito.':'Liviana y rápida, ideal para repartir.'}</p>
  <div class="row"><button data-act="cash:${m}">Pagar de contado</button>${cr?`<button class="green" data-act="cred:${m}">Crédito: prima ${fmtC(prima)} + 12 cuotas de ${fmtC(cuota)}/semana</button>`:''}</div></div>`}).join('')},
 act(k,m){const c=VM[m];if(k==='cash'){if(vBuy(m,'entrega',c.price))appOpen('veh')}
  if(k==='cred'){const prima=Math.round(c.price*.25/500)*500,cuota=Math.round(c.price*.75*1.18/12/50)*50;askYes('Crédito de la agencia','Prima de '+fmtC(prima)+' hoy y 12 cuotas semanales de '+fmtC(cuota)+'. Si te atrasás 3 cuotas, se la llevan.',()=>{const v=vBuy(m,'entrega',prima);if(v){PGS().cred.push({v:v.id,left:12,cuota,next:S.day+7,mora:0});toast('🏦 Crédito aprobado. Primera cuota el día '+(S.day+7))}},'Firmar el crédito')}}});
// ---- COSEVI: licencias, multas, depósito ----
const QUIZ=[['Llegás a una rotonda. ¿Quién tiene la prioridad?',['Los que ya van dentro de la rotonda','El que pite más fuerte','El bus, siempre'],0],
 ['La luz amarilla del semáforo significa…',['Precaución: detenerse si es seguro','Acelerar antes de que cambie','Que el semáforo está descompuesto'],0],
 ['Velocidad máxima frente a una escuela:',['25 km/h','60 km/h','La que aguante la moto'],0],
 ['¿El acompañante en moto debe usar casco?',['Sí, siempre','Solo de noche','Solo si es la suegra'],0],
 ['Si tomaste guaro en una fiesta…',['No manejo: pido taxi o que maneje otro','Manejo despacito','Me tomo un café y listo'],0],
 ['Un peatón está cruzando por la zebra:',['Le cedo el paso','Le pito para que se apure','Le paso cerquita para que aprenda'],0],
 ['¿Se puede usar el celular mientras se maneja?',['No, solo con manos libres','Sí, si es WhatsApp','Sí, en las presas'],0]];
function licExam(tipo){const p=PGS(),fee=tipo==='moto'?15000:25000;if(p.lic[tipo])return toast('Ya tenés esa licencia');if(p.licT===S.day)return toast('Ya hiciste un examen hoy. Volvé mañana.');if(S.money<fee)return toast('Te faltan '+fmtC(fee-S.money));
  spend(fee,'Trámites');p.licT=S.day;closePanel();const qs=shuf(QUIZ.slice()).slice(0,4);let ok=0;const insp=fillChar({id:'z_cosevi',name:'Examinadora del COSEVI',hair:'moño',hairColor:'#2b1a10',skin:'#c68642',shirt:'#f4f4f4',pants:'#2d3346',acc:'anteojos',v:1});
  say(insp,'Buenas. Examen teórico de manejo para '+(tipo==='moto'?'moto (A2)':'carro (B1)')+'. Son cuatro preguntas. Necesita tres buenas. Concéntrese.');
  const ask=i=>{if(i>=qs.length){const pass=ok>=3;if(pass){fadeDo(()=>passTime(90),()=>{p.lic[tipo]=1;say(insp,'Teórico aprobado ('+ok+'/4). Y la prueba práctica… bueno, solo tumbó un cono. Aprobado. Felicidades.');say(null,'🪪 ¡Ya tenés licencia de '+(tipo==='moto'?'moto':'carro')+'!');if(typeof progRep==='function')progRep(3,'Sacaste la licencia');runDialog()})}else say(insp,'Sacó '+ok+'/4. Así no, joven. Estudie el manual y vuelva mañana. El pago no se devuelve, eso sí.');return}
    const[q,o,c]=qs[i],ord=shuf([0,1,2]);say(insp,(i+1)+'. '+q,ord.map(j=>({t:o[j],f(){if(j===c)ok++;afterD(()=>{ask(i+1)})}})))};ask(0);runDialog()}
appReg({id:'cosevi',n:'COSEVI',ic:'🪪',c:'#2d3a6e',badge:()=>PGS().tram.length+PGS().veh.filter(v=>v.dep&&!v.gone).length,html(){const p=PGS();let h='<h3>Licencias</h3>';
  for(const[t,n,fee]of[['moto','Licencia de moto (A2)',15000],['carro','Licencia de carro (B1)',25000]])h+=`<div class="qitem"><b>${n}</b><p>${p.lic[t]?'✅ La tenés':'Examen teórico y práctico · '+fmtC(fee)}</p>${p.lic[t]?'':`<button class="green" data-act="lic:${t}">Hacer el examen</button>`}</div>`;
  h+='<h3>Multas y deudas</h3>'+(p.tram.length?p.tram.map((t,i)=>`<div class="qitem"><b>${esc(t.n)}</b><p>${fmtC(t.amt)} · día ${t.day}</p><button data-act="pay:${i}">Pagar</button></div>`).join(''):'<p class="note">No tenés multas. ¡Así se maneja!</p>');
  const dep=p.veh.filter(v=>v.dep&&!v.gone);if(dep.length)h+='<h3>Depósito de Tránsito</h3>'+dep.map(v=>`<div class="qitem"><b>${vName(v)}</b><p>Para sacarla: ₡8 000 de bodegaje${vPapeles(v).filter(x=>x!=='rtv').length?' · primero tenés que tener licencia y marchamo al día':''}.</p><button data-act="dep:${v.id}">Sacarla del depósito</button></div>`).join('');return h},
 act(k,a){const p=PGS();if(k==='lic')licExam(a);if(k==='pay'){const t=p.tram[+a];if(!t)return;if(S.money<t.amt)return toast('Te faltan '+fmtC(t.amt-S.money));spend(t.amt,'Multas');p.tram.splice(+a,1);toast('Pagado');appOpen('cosevi')}
  if(k==='dep'){const v=vOf(a);if(!v)return;if(vPapeles(v).filter(x=>x!=='rtv').length)return toast('Primero: licencia y marchamo al día');if(S.money<8000)return toast('Te faltan '+fmtC(8000-S.money));spend(8000,'Multas');v.dep=0;v.map='ext';v.x=HOME_PARK.x;v.y=HOME_PARK.y;toast('🚛 Te la dejaron frente a tu casa');appOpen('cosevi')}}});
// ---- RTV y marchamo ----
appReg({id:'rtv',n:'RTV y marchamo',ic:'🔧',c:'#e2b33a',cond:()=>PGS().veh.some(v=>!v.gone&&VM[v.m].motor),badge:()=>PGS().veh.filter(v=>!v.gone&&VM[v.m].motor&&((PGS().mar[v.id]||0)<S.day||(PGS().rtv[v.id]||0)<S.day)).length,html(){const p=PGS();
  return p.veh.filter(v=>!v.gone&&VM[v.m].motor).map(v=>{const c=VM[v.m],mv=(p.mar[v.id]||0)<S.day,rv=(p.rtv[v.id]||0)<S.day,rf=c.k==='moto'?7000:12000;
   return`<div class="qitem"><b>${vName(v)} · ${v.placa}</b><p>Marchamo: ${mv?'<b style="color:#ff9b8f">vencido</b>':'al día hasta el día '+p.mar[v.id]} · RTV: ${rv?'<b style="color:#ff9b8f">vencida</b>':'al día hasta el día '+p.rtv[v.id]}</p>
   <div class="row"><button data-act="mar:${v.id}">Pagar marchamo (${fmtC(c.mar)})</button><button data-act="rtv:${v.id}">Cita de RTV (${fmtC(rf)})</button></div></div>`}).join('')+'<p class="note">El marchamo dura 28 días y la RTV 21. La RTV solo se pasa si el vehículo está al 55% o más.</p>'},
 act(k,id){const p=PGS(),v=vOf(id);if(!v)return;const c=VM[v.m];
  if(k==='mar'){if(c.hot)return toast('🚫 Esa placa no existe en el sistema…');if(S.money<c.mar)return toast('Te faltan '+fmtC(c.mar-S.money));spend(c.mar,'Marchamo');p.mar[v.id]=Math.max(S.day,p.mar[v.id]||0)+28;toast('🧾 Marchamo pagado');appOpen('rtv')}
  if(k==='rtv'){const rf=c.k==='moto'?7000:12000;if(c.hot)return toast('🚫 En la RTV piden los papeles… y no los tenés');if(S.money<rf)return toast('Te faltan '+fmtC(rf-S.money));spend(rf,'RTV');closePanel();
    fadeDo(()=>passTime(120),()=>{if(v.cond>=55){p.rtv[v.id]=S.day+21;say(null,'✅ RTV aprobada. El técnico le pegó la calcomanía y te dijo: «Esa '+(c.k==='moto'?'moto':'máquina')+' está bien cuidada».')}else say(null,'❌ RTV rechazada: «Frenos gastados, una luz quemada y una fuga de aceite». Arreglala en el taller y volvé.');runDialog()})}}});
// ---- INS: seguros ----
appReg({id:'ins',n:'INS Seguros',ic:'🛡',c:'#3f7fd1',cond:()=>PGS().veh.some(v=>!v.gone),html(){const p=PGS();return'<p class="note">Cubre robo (te devuelve el 70%) y choques (solo pagás el deducible). Se cobra cada 7 días.</p>'+p.veh.filter(v=>!v.gone).map(v=>{const amt=VM[v.m].k==='bici'?800:VM[v.m].k==='moto'?2500:5000;
  return`<div class="qitem"><b>${vName(v)}</b><p>${p.seg[v.id]?'🛡 Asegurada · '+fmtC(amt)+' por semana':'Sin seguro · '+fmtC(amt)+' por semana'}</p><button class="${p.seg[v.id]?'alt':'green'}" data-act="seg:${v.id}">${p.seg[v.id]?'Cancelar seguro':'Asegurarla'}</button></div>`}).join('')},
 act(k,id){const p=PGS(),v=vOf(id);if(!v)return;if(VM[v.m].hot)return toast('🚫 El INS no asegura vehículos sin papeles');p.seg[id]=!p.seg[id];toast(p.seg[id]?'🛡 Asegurada':'Seguro cancelado');appOpen('ins')}});
// ---- Pedidos Mae ----
appReg({id:'ped',n:'Pedidos Mae',ic:'📦',c:'#f2994a',html(){const p=PGS(),j=p.job;let h=`<p>⭐ Calificación: ${(p.jobs.stars||5).toFixed(1)} · ${p.jobs.n} pedidos entregados · pago +${Math.round(Math.min(.6,p.jobs.n*.01)*100)}% por experiencia</p>`;
  if(j)h+=`<div class="qitem"><b>Pedido en curso</b><p>${j.st==='pick'?'Recogé en '+j.from.n:'Llevalo a '+j.to.n} · ${fmtC(j.pay)}</p><button class="alt" data-act="cancel">Cancelar pedido</button></div>`;
  else h+=`<p class="note">Recogés en un negocio del barrio y lo llevás a una casa antes de que se enfríe. Necesitás bici o moto.</p><button class="green" data-act="take">Tomar un pedido</button>`;return h},
 act(k){if(k==='take')jobStart();if(k==='cancel'){PGS().job=null;PGS().jobs.stars=Math.max(1,(PGS().jobs.stars||5)-.4);toast('Pedido cancelado (bajó tu calificación)');appOpen('ped')}}});
// estilos de las apps
{const st=document.createElement('style');st.textContent=`.pg-apps{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:10px}
.pg-app{--b:var(--ac);--bt:#fff;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 10px;border-radius:16px;font-size:12px;text-shadow:0 1px 0 rgba(0,0,0,.4)}
.pg-app .pg-ic{font-size:28px;line-height:1;filter:drop-shadow(0 2px 0 rgba(0,0,0,.3))}.pg-app b{font-weight:800;line-height:1.1}.pg-app .ph-dot{top:-6px;right:-4px}`;document.head.appendChild(st)}
