// ================= PROGRESO · RESPETO DEL BARRIO, LOGROS Y METAS =================
const REPLV=[[0,'Recién llegado','Nadie sabe bien quién sos.'],[20,'Conocido','Ya te saludan en la pulpería.'],[60,'Vecino de confianza','Te dejan las llaves cuando se van de viaje.',' La coope te presta ₡25 000 más.'],
 [130,'Gente del barrio','Te invitan a todos los turnos y rezos.',' Tu soda gana fama más rápido.'],[250,'Mae importante','Hasta el diputado te saluda en campaña.',' Podés presidir la Asociación de Vecinos.'],[450,'Leyenda del barrio','Van a ponerle tu nombre a la plaza.','']];
function repLv(r){r=r==null?(S&&S.f&&S.f.pg?S.f.pg.rep:0):r;let i=0;REPLV.forEach((x,k)=>{if(r>=x[0])i=k});return i}
function progRep(n,why){if(!S||!S.f)return;const p=PGS(),l0=repLv(p.rep);p.rep=Math.max(0,(p.rep||0)+n);const l1=repLv(p.rep);
  if(l1>l0){const L=REPLV[l1];setTimeout(()=>{toast('⭐ ¡Subiste de nivel en el barrio! Ahora sos «'+L[1]+'». '+L[2]+(L[3]||''));try{cashSound()}catch(e){}},900);if(typeof phQueue==='function'&&l1>=2)phQueue('mama',pick(['Mijo, Doña Rosa me contó lo bien que le va. ¡Qué orgullo! Ya no me tiene que pedir plata para el bus 😅','Me dijeron en la iglesia que usted es muy querido en el barrio. Así lo crié yo 🙏']))}
  logroCheck()}
function progStat(k,n){const st=PGS().stats;st[k]=(st[k]||0)+(n==null?1:n);logroCheck()}
const stat=k=>(S&&S.f&&S.f.pg&&S.f.pg.stats[k])||0;
// ---- logros ----
const LOGROS=[
 ['vehiculo','🚲','Sobre ruedas','Comprá tu primer vehículo.',()=>PGS().veh.length>0,3],
 ['licencia','🪪','Con papeles','Sacá una licencia en el COSEVI.',()=>PGS().lic.moto||PGS().lic.carro,4],
 ['carro','🚗','El Corollita','Tené un carro (o La Bestia).',()=>PGS().veh.some(v=>!v.gone&&VM[v.m].k==='carro'),6],
 ['chepe','🛣','A Chepe en lo propio','Llegá a Chepe manejando.',()=>stat('viajes')>0,3],
 ['repartos','📦','Pedidos Mae','Entregá 25 pedidos.',()=>PGS().jobs.n>=25,6],
 ['copos','🍧','El rey del copo','Vendé 100 copos.',()=>NEG().sold>=100,6],
 ['soda','🍛','Soda Mi Barrio','Abrí tu propia soda.',()=>NEG().soda>0,10],
 ['chela','👩‍🍳','Doña Chela, chef','Contratá a Doña Chela para tu soda.',()=>NEG().cook>0,5],
 ['segundo','🏗','Para arriba','Construí el segundo piso.',()=>U('segundo')>0,8],
 ['revista','🛋','Casa de revista','Llegá a «Casa de revista» en comodidad.',()=>typeof comfort==='function'&&comfort()>=34,8],
 ['inquilino','🏠','Casero','Alquilá el cuarto de arriba.',()=>!!PGS().inq,3],
 ['tanda','📓','La tanda','Cobrá una tanda de Doña Rosa.',()=>stat('tandas')>0,3],
 ['ahorro','🏦','Hormiguita','Cobrá un ahorro a plazo.',()=>stat('ahorros')>0,3],
 ['sindeuda','✅','Pagador puntual','Terminá de pagar un préstamo de la coope.',()=>(INV().buen||0)>0,5],
 ['loteria','🎟','¡Pegó la lotería!','Ganate un premio mayor con Don Fello.',()=>stat('premios')>0,8],
 ['hoyo','🕳','Bienvenido al Hoyo','Entrá a El Hoyo.',()=>!!S.f.hoyoVisto,4],
 ['atrop','🚑','Sobreviviente','Sobreviví a un atropello en Chepe.',()=>(S.f.atrop||0)>0,1],
 ['millon','💰','Millonario (en colones)','Juntá ₡1 000 000.',()=>S.money>=1000000,10],
 ['leyenda','👑','Leyenda del barrio','Llegá al nivel más alto de respeto.',()=>repLv()>=5,0]];
function logroCheck(){if(!S||!S.f||!S.f.pg)return;const p=PGS();for(const[id,ic,n,t,f,r]of LOGROS){if(p.logros[id])continue;let ok=false;try{ok=!!f()}catch(e){}if(!ok)continue;p.logros[id]=S.day;
  setTimeout(()=>{toast('🏆 Logro: '+ic+' '+n);beep(1046,.08,'triangle',.05);setTimeout(()=>beep(1568,.16,'triangle',.05),90)},400);if(r)progRep(r)}}
setInterval(()=>{if(typeof mode!=='undefined'&&mode==='play')logroCheck()},5000);
{const _dt=driveTrip;driveTrip=function(to){const r=_dt.apply(this,arguments);if(to==='chepe')progStat('viajes');return r}}
{const _q=doneQ;doneQ=function(id){const was=qs(id)===2;const r=_q.apply(this,arguments);if(!was)progRep(3);return r}}
{const _w=doShift;doShift=function(k,h){const d0=E().jobs[k].d;const r=_w.apply(this,arguments);if(E().jobs[k].d!==d0)progRep(h>=4?1:.5);return r}}
// ---- metas: qué sigue en tu vida ----
function metas(){const p=PGS(),n=NEG(),v=INV(),out=[],add=(ic,t,d,pr)=>out.push({ic,t,d,pr});
  if(!p.veh.length)add('🚲','Tu primera bici','Una bici montañera anda por ₡18 000 en la Agencia o el Marketplace (celular → Apps).',S.money/18000);
  else if(!p.lic.moto&&!p.lic.carro)add('🪪','Sacar licencia','Para motos y carros: examen teórico en el COSEVI (celular → Apps). ₡15 000 la de moto.',0);
  else if(!p.veh.some(x=>!x.gone&&VM[x.m].motor))add('🏍','Una moto','La moto de agencia cuesta ₡75 000. Con crédito pagás 25% de prima.',S.money/75000);
  else if(!p.veh.some(x=>!x.gone&&VM[x.m].k==='carro'))add('🚗','Un carro','El Corollita del 96 anda por ₡280 000. Ojo con el marchamo y la RTV.',S.money/280000);
  if(!n.cart)add('🍧','Un negocio propio','Doña Mireya vende copos en el bulevar de Chepe y anda vendiendo su carrito viejo.',S.money/15000);
  else if(!n.soda&&!n.obra)add('🍛','La soda','Vendé 40 copos y juntá ₡85 000 para montar una soda en el lote de la Calle 3.',Math.min(n.sold/40,S.money/85000));
  else if(n.soda&&!n.cook)add('👩‍🍳','Una cocinera','Doña Chela, la de las empanadas de El Hoyo, cocina como los ángeles.',0);
  else if(n.soda===1)add('🌇','Agrandar la soda','Una terracita con mesas: más clientes y el casado a ₡3 500. ₡60 000.',S.money/60000);
  const ups=['techo','cochera','segundo','terraza'].find(k=>!U(k));if(ups){const H=HUP[ups],l=H.lv[0];add(H.ic,H.n,l.t+' ('+fmtC(l.c)+' en la libreta de la casa)',S.money/l.c)}
  else if(comfort()<34)add('🛋','Una casa de revista','Decorá la casa (libreta de la casa → Decoración). Comodidad: '+comfort()+'/34.',comfort()/34);
  if(!v.ahorro.length&&S.money>=40000)add('🏦','Poner la plata a trabajar','En '+COOPE+' el ahorro a plazo da 3,5% en 28 días. Mejor que debajo del colchón.',1);
  const L=repLv(),nx=REPLV[L+1];if(nx)add('⭐','Respeto: «'+nx[1]+'»','Trabajá, ayudá, abrí negocios y cumplí con la gente. '+(p.rep|0)+'/'+nx[0]+' puntos.',(p.rep-REPLV[L][0])/(nx[0]-REPLV[L][0]));
  return out.slice(0,5)}
appReg({id:'metas',n:'Metas',ic:'🎯',c:'#f2c94c',html(){const p=PGS(),L=REPLV[repLv()],nx=REPLV[repLv()+1],got=LOGROS.filter(l=>p.logros[l[0]]).length;
  let h=`<div class="qitem"><b>⭐ ${L[1]}</b><p>${L[2]}</p>${nx?`<div class="eco-bar"><i style="width:${Math.round(Math.min(1,(p.rep-L[0])/(nx[0]-L[0]))*100)}%"></i></div><p class="note">${p.rep|0} de ${nx[0]} puntos para «${nx[1]}».${nx[3]?' Desbloquea:'+nx[3]:''}</p>`:'<p class="note">Llegaste a lo más alto. El barrio es tuyo.</p>'}</div>`;
  h+='<h3>Lo que sigue</h3>'+metas().map(m=>`<div class="qitem"><b>${m.ic} ${esc(m.t)}</b><p>${esc(m.d)}</p>${m.pr>0?`<div class="eco-bar"><i style="width:${Math.round(Math.min(1,m.pr)*100)}%"></i></div>`:''}</div>`).join('');
  h+=`<h3>Logros · ${got}/${LOGROS.length}</h3><div class="pg-logros">${LOGROS.map(([id,ic,n,t])=>{const d=p.logros[id];return`<div class="pg-logro${d?' on':''}" title="${esc(t)}"><span>${d?ic:'🔒'}</span><b>${esc(n)}</b><small>${d?'Día '+d:esc(t)}</small></div>`}).join('')}</div>`;return h}});
{const st=document.createElement('style');st.textContent=`.pg-logros{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:6px}.pg-logro{padding:8px 6px;border-radius:12px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.15);text-align:center;display:flex;flex-direction:column;gap:2px;opacity:.6}
.pg-logro span{font-size:22px}.pg-logro b{font-size:12px}.pg-logro small{font-size:10.5px;opacity:.8;line-height:1.25}.pg-logro.on{opacity:1;border:1px solid rgba(242,201,76,.6);background:rgba(242,201,76,.1)}`;document.head.appendChild(st)}
// ventajas por nivel
{const _n=negNight;negNight=function(){_n();const n=S&&S.f&&S.f.pg&&S.f.pg.neg;if(n&&n.soda&&repLv()>=3)n.fama=clamp(n.fama+.5,0,100)}}
// subir de respeto con lo que ya hacés en el juego: dormir en casa propia cuenta poquito, ayudar cuenta más
hookAfter('ecoDay',function(){try{logroCheck()}catch(e){}});
