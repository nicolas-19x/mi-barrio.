// ================= LA SODA CRECE: nombre propio, Ariana en la cocina, mejoras, catering y franquicias =================
const SODA_LV=[null,
 {n:'Soda',c:0,cl:22,tk:3700,mg:.24,done:'🍛 ¡Abrió tu soda! Ponele nombre y buscá quién cocine cuando no estés.'},
 {n:'Soda con terracita',c:60000,d:3,cl:30,tk:4200,mg:.24,done:'🌇 ¡La terracita quedó lista! Más mesas, más clientes.'},
 {n:'Soda con barra y cocina industrial',c:180000,d:4,cl:38,tk:4800,mg:.25,done:'🍳 ¡Cocina industrial y barra nuevas! Ya caben dos cocineras trabajando a la vez.'},
 {n:'Restaurante con salón de eventos',c:450000,d:6,cl:48,tk:5600,mg:.26,done:'🎉 ¡Salón de eventos listo! Ya podés recibir encargos de catering y soñar con franquicias.'},
 {n:'Soda insignia',c:1200000,d:8,cl:60,tk:6500,mg:.27,done:'👑 ¡Tu soda ya es una insignia del barrio! Bandera, fila al mediodía y todo.'}];
function sodaListo(l){if(l===1)NEG().nombrePend=1;return SODA_LV[l].done}
function sodaNombre(){const n=S&&S.f&&S.f.pg&&S.f.pg.neg;return(n&&n.nombre)||'Soda Mi Barrio'}
function sodaUp(k){const n=S&&S.f&&S.f.pg&&S.f.pg.neg;return!!(n&&n.sup&&n.sup[k])}
function recOn(k){const n=S&&S.f&&S.f.pg&&S.f.pg.neg;return!!(n&&n.rec&&n.rec[k])}
const SODA_SUP={letrero:{n:'Letrero de neón',ic:'💡',c:40000,t:'Se ve de lejos de noche: +8% de clientes.'},
 domicilio:{n:'Pedidos a domicilio',ic:'🛵',c:90000,t:'Chamaco y una moto de reparto: +12% de clientes.'},
 caja:{n:'Caja registradora y SINPE',ic:'💳',c:60000,t:'Aceptás tarjeta y SINPE Móvil: +5% de ticket.'},
 camara:{n:'Cámara de refrigeración',ic:'🧊',c:120000,t:'Nada se echa a perder: se acaban los días de nevera dañada.'},
 horno:{n:'Horno de leña',ic:'🔥',c:150000,t:'Platos con sabor a fogón: +8% de ticket y cada plato vale ₡250 más en el minijuego.'}};
const RECS={apollo:{n:'Arroz con pollo de la abuela',dias:3},chifri:{n:'Chifrijo de Ariana',dias:7},tres:{n:'Tres leches de Ariana',dias:12}};
const ARI_NOMBRES=['Soda Mi Barrio','Soda La Abuela','Soda El Buen Gusto','Soda El Sabor Tico','Soda Pura Vida','Soda Los Tres Hermanos','Soda Doña Chela'];
// ---------------------------------------------------------------- quién cocina
function sodaCook(){const n=NEG(),lv=n.soda||1;let ch=!!n.cook;const ar=n.ari;if(ch&&ar&&lv<3)ch=false;let q=0,sal=0;const who=[];
  if(ch){q=1;sal+=5000;who.push('Doña Chela')}
  if(ar){const a=ar==='socia'?1.5:1.35;sal+=ar==='emp'?6000:0;q=ch?a+.25:a;who.push('Ariana')}
  return{q,sal,who,ch,ar}}
function sodaDia(n){const lv=n.soda,L=SODA_LV[lv],c=sodaCook();
  let cl=L.cl*(.7+n.fama/120)*rnd(.8,1.2)*(S.rain?.85:1)*(1+(sodaUp('letrero')?.08:0)+(sodaUp('domicilio')?.12:0));cl=Math.round(cl*c.q);
  const tk=L.tk*(1+(sodaUp('horno')?.08:0)+(sodaUp('caja')?.05:0)+.02*Object.keys(n.rec).filter(k=>n.rec[k]).length);
  let g=Math.round(cl*tk*L.mg)-c.sal,extra='';
  if(!sodaUp('camara')&&Math.random()<.08){g-=9000;extra=' · se dañó la nevera y se perdió comida (−₡9 000)'}
  let parte=0;if(c.ar==='socia'&&g>0){parte=Math.round(g*.3);g-=parte;n.ariaGan=(n.ariaGan||0)+parte}
  n.earn+=g;n.ult={cl,g,dia:S.day};if(g>=0)earn(g,'Negocio');else spend(Math.min(S.money,-g),'Negocio');
  n.fama=clamp(n.fama+.25+(n.ari?.15:0),0,100);
  if(n.ari){n.ariDias++;n.ariAcc+=n.ari==='socia'?.25:.15;if(n.ariAcc>=1){n.ariAcc-=1;relAdd('ar',1)}
    for(const k in RECS)if(!n.rec[k]&&n.ariDias>=RECS[k].dias){n.rec[k]=1;setTimeout(()=>{toast('👩‍🍳 Ariana inventó una receta: «'+RECS[k].n+'». Ya está en el menú.');if(typeof phQueue==='function')phQueue('ariana',{apollo:'Mor, hoy probé el arroz con pollo como lo hacía mi abuela. Ya lo puse en el menú de la soda. ¡Quedó igualito! 🥹',chifri:'Mor, inventé un chifrijo con chicharrón crocante y pico de gallo. Los clientes se pelean por él 😂',tres:'Hoy hice mi tres leches. Mi mamá dice que ya me quedó mejor que la de ella. No le creás nada 😜'}[k])},9000)}
    if(Math.random()<.1&&typeof phQueue==='function')setTimeout(()=>phQueue('ariana',pick(['Hoy fuimos '+cl+' en la soda, mor. Me duelen los pies pero estoy feliz 🥰','Vino un señor y dijo que mi casado es el mejor de Costa Rica. Casi lloro 😭','Don Rigo pasó a ver y se quedó a almorzar. Dijo que así sí vale la pena alquilar el lote 😂','Se acabaron los frijoles a las dos de la tarde. Mañana compramos el doble.'])),11000)}
  return'🍛 '+n.nombre+': '+cl+' clientes · '+(g>=0?'ganancia ':'pérdida ')+fmtC(Math.abs(g))+(c.who.length?' (cocina '+c.who.join(' y ')+')':'')+(parte?' · la parte de Ariana: '+fmtC(parte):'')+extra}
// ---------------------------------------------------------------- nombre de la soda
function sodaNombrar(primera){const n=NEG(),ch=ARI_NOMBRES.slice(0,6).map(x=>({t:x,f(){n.nombre=x;sodaRerender();toast('🪧 Tu soda se llama «'+x+'»');checkLogros()}}));
  if(n.ari)ch.unshift({t:'Soda Alex y Ariana',f(){n.nombre='Soda Alex y Ariana';sodaRerender();toast('🪧 «Soda Alex y Ariana». Ella se va a morir de la emoción.');relAdd('ar',1);checkLogros()}});
  ch.push({t:'Escribir otro nombre…',f(){afterD(()=>{const v=prompt('Nombre de tu soda (máximo 18 letras):',n.nombre);if(v==null)return;const t=v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 '.-]/g,'').trim().slice(0,18);if(t.length<3)return toast('Muy cortito. Probá otra vez.');n.nombre=t;sodaRerender();toast('🪧 Tu soda se llama «'+t+'»');checkLogros()})}});
  say(null,primera?'🪧 Los maestros ya terminaron. Falta lo más importante: ¿cómo se va a llamar?':'¿Cómo querés que se llame tu soda?',ch);runDialog()}
function checkLogros(){if(typeof logroCheck==='function')logroCheck()}
// ---------------------------------------------------------------- Ariana: empleada o socia
function ariCont(rol){const n=NEG();if(!n.soda)return toast('Primero abrí la soda.');if((S.f.arRel||0)<8)return toast('💛 Ariana todavía no se siente lista para trabajar con vos (cariño ≥ 8).');
  closePanel();const prev=n.ari;
  if(!prev){say('ariana',rol==='emp'?'¿Yo, cocinera de tu soda? Mor… ¿vos sabés lo que me estás ofreciendo? Seis mil por día y el almuerzo. ¡Claro que sí! Pero con delantal bonito y sin que me grités como a Doña Chela.':'¿Socia? ¿Yo? ¿De la soda de los dos? …Mor, si se funde, nos fundimos juntos. Pero no se va a fundir, porque yo voy a cocinar como Dios manda.');
    say(null,rol==='emp'?'Ariana te abraza tan fuerte que te levanta del suelo. «Empiezo mañana a las seis», dice.':'Se le llenan los ojos de lágrimas. «Nadie me había creído tanto», susurra.');relAdd('ar',rol==='socia'?5:3);if(typeof progRep==='function')progRep(rol==='socia'?4:2)}
  else if(prev==='emp'&&rol==='socia'){say('ariana','¿Me estás ofreciendo ser socia? Mor… vení acá. No sabés lo que significa esto para mí.');relAdd('ar',2)}
  else if(prev==='socia'&&rol==='emp'){say('ariana','Ah… entonces ya no soy socia. Está bien, mor. Pero ahí me dolió un poquito.');relAdd('ar',-2)}
  n.ari=rol;placeNPCs(false);checkLogros();runDialog();saveGame()}
function ariDespedir(){const n=NEG();if(!n.ari)return;closePanel();say('ariana','…¿Me estás despidiendo? Mor, yo sé que es el negocio, pero esto me duele más de lo que pensás.');say('ariana','Bueno. Dejo el delantal en el gancho. Cualquier día de estos me vas a extrañar.');relAdd('ar',-4);n.ari='';placeNPCs(false);runDialog();saveGame()}
// Ariana trabaja en la soda de día (si la cocinera es ella)
{const _l=locFor;locFor=function(c){if(c.id==='ariana'&&S.f&&S.f.pg&&S.f.pg.neg&&S.f.pg.neg.ari&&S.f.pg.neg.soda&&!S.f.fiestaOn&&!dateLoc(c)){const p=period();if(p==='m'||p==='t')return'soda'}return _l(c)}}
if(typeof LOC!=='undefined'&&!LOC.soda)LOC.soda={map:'ext',sp:[[24,59]],l:'La soda'};
{const _a=TALK.ariana;TALK.ariana=function(){const n=NEG();if(!(n.ari&&NPC.ariana&&NPC.ariana.loc==='soda'&&P.map==='ext'))return _a.apply(this,arguments);const a=arguments,th=this;
  say('ariana',pick(['¡Mor! Pasá, que hoy la cosa está movida.','Ay, mor, hoy tengo las manos en la masa. Literal. ¿Qué querés?','Justo estaba pensando en vos. ¿Querés probar el arroz? Es el nuevo.']),[
   {t:'¿Cómo va la soda?',f(){const u=n.ult;say('ariana',u?'Ayer atendimos '+u.cl+' clientes y quedó '+(u.g>=0?'una ganancia de '+fmtC(u.g):'una pérdida de '+fmtC(-u.g))+'. La fama anda en '+Math.round(n.fama)+'.':'Todavía no tenemos números, mor. Dame un día.');if(n.ari==='socia')say('ariana','Y como soy tu socia, me toca opinar: hay que mejorar la cocina. Vení al celular y vemos.')}},
   {t:'Solo vine a verte',f(){if(n.visDia===S.day)return say('ariana','Mor, ya me viniste a ver hoy. ¡Dejá que trabaje, jaja!');n.visDia=S.day;relAdd('ar',.5);say('ariana',pick(['Qué lindo detalle. Ya me hiciste el día.','Me estás poniendo roja delante de los clientes. Gracias, mor 💛']))}},
   {t:'Conversar',f(){afterD(()=>_a.apply(th,a))}},{t:'Seguir con lo mío'}])}}
// ---------------------------------------------------------------- subir de nivel y mejoras
function sodaSubir(){const n=NEG(),l=(n.soda||0)+1;if(!n.soda||l>5||n.obra)return;const L=SODA_LV[l];if(S.money<L.c)return toast('Te faltan '+fmtC(L.c-S.money));spend(L.c,'Negocio');n.obra={fin:S.day+L.d,lv:l};toast('🏗 Obra: «'+L.n+'» lista el día '+n.obra.fin)}
function sodaMejora(k){const n=NEG(),u=SODA_SUP[k];if(n.sup[k])return;if(S.money<u.c)return toast('Te faltan '+fmtC(u.c-S.money));spend(u.c,'Negocio');n.sup[k]=1;toast(u.ic+' '+u.n+' instalado');checkLogros()}
function sodaValor(){const n=S&&S.f&&S.f.pg&&S.f.pg.neg;if(!n||!n.soda)return 0;let v=85000;for(let l=2;l<=n.soda;l++)v+=SODA_LV[l].c;let s=0;for(const k in n.sup)if(n.sup[k])s+=SODA_SUP[k].c;let f=0;for(const k in n.fr)f+=Math.round(FRANQ[k].c*.7);return Math.round(v*.7+s*.6+f)}
// ---------------------------------------------------------------- catering
const CAT_T=[['Cumpleaños de quince',60,160000,'Una quinceañera de Cartago quiere gallos, arroz con pollo y tres leches.'],['Turno comunal',80,150000,'La junta de la iglesia necesita almuerzos para toda la plaza.'],['Boda en Heredia',120,380000,'Ciento veinte invitados y un novio nervioso. Que el arroz no se pegue.'],['Graduación del colegio',70,190000,'Café, pan casero y gallos para los graduandos.'],['Velorio de Don Hernán',40,90000,'La familia necesita café, pan y empanadas. Todo muy serio y muy respetuoso.'],['Reunión del Concejo Municipal',30,120000,'El alcalde pidió casados «bien servidos» para los regidores.']];
function catOfertas(n){const c=n.cat;if(c.dia!==S.day){c.dia=S.day;c.l=[];const k=1+(Math.random()<.5?1:0)+(n.soda>=5?1:0);for(let i=0;i<k;i++){const t=pick(CAT_T);if(!c.l.some(x=>x.t===t[0]))c.l.push({t:t[0],pax:Math.round(t[1]*rnd(.85,1.2)/5)*5,pago:Math.round(t[2]*(.9+n.fama/250)*rnd(.9,1.15)/1000)*1000,d:t[3]})}}return c.l}
function catAceptar(i){const n=NEG(),o=n.cat.l[i];if(!o||n.soda<4||n.cat.act.length>=2)return toast(n.cat.act.length>=2?'Ya tenés dos encargos en marcha.':'No disponible.');const cost=o.pax*1100;if(S.money<cost)return toast('Te faltan '+fmtC(cost-S.money)+' para los ingredientes.');spend(cost,'Catering');n.cat.l.splice(i,1);n.cat.act.push(Object.assign({},o,{fin:S.day+2,cost}));toast('🍽 Encargo aceptado: «'+o.t+'». Se entrega en 2 días.')}
function catNight(n){const c=n.cat;if(!c||!c.act.length)return;for(const o of c.act.slice()){if(S.day<o.fin)continue;c.act.splice(c.act.indexOf(o),1);const cq=sodaCook().q||1,p=clamp(.52+cq*.12+n.fama/260+(n.ari==='socia'?.05:0),.4,.97);
    if(Math.random()<p){earn(o.pago,'Catering');n.earn+=o.pago-o.cost;n.cat.hechos++;n.fama=clamp(n.fama+3,0,100);setTimeout(()=>toast('🍽 ¡«'+o.t+'» fue un éxito! Cobraste '+fmtC(o.pago)+'. «¡Qué rico todo, ya los recomendé!»'),6500);if(typeof progRep==='function')progRep(3)}
    else{const m=Math.round(o.pago*.4);earn(m,'Catering');n.fama=clamp(n.fama-6,0,100);setTimeout(()=>toast('🍽 «'+o.t+'» salió regular: '+pick(['se acabó el arroz a medio evento','el pollo llegó frío','se quemaron los frijoles','faltaron platos'])+'. Solo te pagaron '+fmtC(m)+'.'),6500)}}}
// ---------------------------------------------------------------- franquicias
const FRANQ={cartago:{n:'Cartago',c:900000,r:[34000,48000],t:'La ciudad de la Virgen de los Ángeles: peregrinos con hambre todo el año.'},heredia:{n:'Heredia',c:1100000,r:[44000,60000],t:'La ciudad de las flores. Universitarios, profes y mucho café.'},alajuela:{n:'Alajuela',c:1400000,r:[58000,82000],t:'Cerca del aeropuerto, con el Juan Santamaría al fondo. Hambre de turistas y de choferes.'},
 liberia:{n:'Liberia',c:1900000,r:[85000,115000],t:'La ciudad blanca. Gallos con tortilla palmeada para guanacastecos.'},limon:{n:'Limón',c:2200000,r:[95000,135000],t:'Rice and beans, patí y casados con pescado frente al Caribe.'},sancarlos:{n:'San Carlos',c:2800000,r:[125000,170000],t:'Ciudad Quesada: lecheros, ganaderos y un hambre de cuidado.'},pz:{n:'Pérez Zeledón',c:3400000,r:[150000,205000],t:'El Valle de El General. Café, pejibaye y mucho trabajo.'}};
function franComprar(k){const n=NEG(),f=FRANQ[k];if(n.fr[k]||(n.soda||0)<4)return;if(n.fama<40)return toast('🔒 La marca todavía no es famosa: fama ≥ 40.');if(S.money<f.c)return toast('Te faltan '+fmtC(f.c-S.money));spend(f.c,'Franquicias');n.fr[k]={dia:S.day,tot:0};toast('🏪 ¡'+n.nombre+' abrió en '+f.n+'!');if(typeof progRep==='function')progRep(Math.round(f.c/250000)+2);checkLogros()}
function franVender(k){const n=NEG();if(!n.fr[k])return;const v=Math.round(FRANQ[k].c*.7);delete n.fr[k];earn(v,'Franquicias');toast('🏪 Vendiste la franquicia de '+FRANQ[k].n+' en '+fmtC(v))}
function franNight(n){let tot=0,msgs=[];for(const k in n.fr){const f=FRANQ[k],o=n.fr[k];let g=Math.round(rnd(f.r[0],f.r[1])*(.55+n.fama/160)*(n.ari==='socia'?1.1:1)*(1+.03*Math.max(0,n.soda-4)));
    if(Math.random()<.08){const r=Math.random();if(r<.5){const m=15000;spend(Math.min(S.money,m),'Franquicias');msgs.push('🏪 Inspección en '+f.n+': el Ministerio de Salud les puso una multa de '+fmtC(m)+'.')}else{g=Math.round(g*1.8);msgs.push('🏪 '+f.n+': '+pick(['llegó un bus de turistas','salieron en el periódico local','fue día de feria y se llenó']))}}
    o.tot+=g;tot+=g}
  if(tot>0){earn(tot,'Franquicias');n.earn+=tot;setTimeout(()=>toast('🏪 Tus franquicias dejaron '+fmtC(tot)+' hoy'),7500)}for(const[i,m]of msgs.entries())setTimeout(()=>toast(m),9500+i*2600)}
hookAfter('ecoDay',function(){try{const n=S.f.pg&&S.f.pg.neg;if(n&&n.v===1&&n.nombre!==undefined){catNight(n);franNight(n);
    if(n.ari&&(S.f.arRel||0)<-5){n.ari='';placeNPCs(false);setTimeout(()=>toast('💔 Ariana renunció a la soda. «Así no se puede trabajar, Alex».'),4000)}}}catch(e){console.error(e)}});
// ---------------------------------------------------------------- la app «Mi soda»
appReg({id:'soda',n:'Mi soda',ic:'🍛',c:'#c0473b',html(){const n=NEG();if(!n.soda)return'<div class="qitem"><b>🍛 Todavía no tenés soda</b><p>Vendé 40 copos con tu carrito y juntá ₡85 000. Llamá al 8701-2244 (Don Rigo, el lote de la Calle 3).</p></div>';
  const lv=n.soda,L=SODA_LV[lv],cook=sodaCook(),arOk=(S.f.arRel||0)>=8;let h=`<div class="qitem"><b>🪧 ${esc(n.nombre)}</b><p>${L.n} · nivel ${lv}/5 · fama ${Math.round(n.fama)}/100${n.obra?' · 🏗 en obra: «'+SODA_LV[n.obra.lv].n+'» (listo el día '+n.obra.fin+')':''}</p><p class="note">${n.ult?'Ayer: '+n.ult.cl+' clientes · '+(n.ult.g>=0?'+':'')+fmtC(n.ult.g):'Todavía sin números.'}${cook.who.length?' · cocina '+cook.who.join(' y '):' · ⚠️ sin cocinera: no abre sola'}</p><button class="alt" data-act="nom">Cambiar el nombre</button></div>`;
  h+='<h3>Cocineras</h3><div class="qitem"><b>👩‍🍳 Doña Chela</b><p>'+(n.cook?'Trabaja en tu soda · ₡5 000 al día.':'Todavía no la contrataste (hablá con ella en El Hoyo).')+'</p></div>';
  h+=`<div class="qitem"><b>💛 Ariana ${n.ari?'· '+(n.ari==='socia'?'socia (30% de las ganancias)':'empleada (₡6 000 al día)'):''}</b><p>${n.ari?'Cocina mejor que nadie: tus ventas suben '+(n.ari==='socia'?'50':'35')+'% y se le ocurren recetas nuevas. Trabaja de día en la soda.':'La mejor cocinera del barrio, y además tu novia. Con ella la soda vende 35-50% más y aprende recetas propias.'}</p>`;
  if(!arOk&&!n.ari)h+='<p class="note">🔒 Necesitás más cariño con Ariana (≥ 8) para que acepte.</p>';
  else h+=`<div class="row">${n.ari!=='emp'?`<button class="green" data-act="ari:emp">${n.ari?'Pasarla a empleada':'Contratarla como empleada'}</button>`:''} ${n.ari!=='socia'?`<button class="green" data-act="ari:socia">${n.ari?'Hacerla socia':'Hacerla socia'}</button>`:''} ${n.ari?'<button class="alt" data-act="ari:out">Despedirla</button>':''}</div>`;
  if(n.cook&&n.ari&&lv<3)h+='<p class="note">⚠️ Con la cocina chiquita solo cabe una cocinera. Cuando amplíes a nivel 3 trabajan las dos juntas.</p>';
  h+='</div>';
  const rec=Object.entries(RECS).map(([k,r])=>`${n.rec[k]?'✔':'🔒'} ${r.n}${n.rec[k]?'':' (Ariana, '+r.dias+' días en la cocina)'}`).join('<br>');h+=`<div class="qitem"><b>📖 Recetas de Ariana</b><p>${rec}</p><p class="note">Días que lleva cocinando: ${n.ariDias}.</p></div>`;
  h+='<h3>Hacer crecer la soda</h3>';
  if(lv<5){const N=SODA_LV[lv+1];h+=`<div class="qitem"><b>⬆️ ${N.n}</b><p>Más clientes y mejor ticket promedio. Obra de ${N.d} días.</p><button class="green" data-act="sub" ${n.obra||S.money<N.c?'disabled':''}>Construir · ${fmtC(N.c)}</button></div>`}else h+='<div class="qitem"><b>👑 Nivel máximo</b><p>Tu soda ya es una insignia.</p></div>';
  h+=Object.entries(SODA_SUP).map(([k,u])=>`<div class="qitem"><b>${u.ic} ${u.n}${n.sup[k]?' ✔':''}</b><p>${u.t}</p>${n.sup[k]?'':`<button data-act="mej:${k}" ${S.money<u.c?'disabled':''}>Instalar · ${fmtC(u.c)}</button>`}</div>`).join('');
  h+='<h3>Catering y eventos</h3>';
  if(lv<4)h+='<div class="qitem"><p class="note">🔒 Necesitás el salón de eventos (nivel 4).</p></div>';else{const of=catOfertas(n);h+=(n.cat.act.length?'<div class="qitem"><b>🍽 En marcha</b>'+n.cat.act.map(o=>`<p>${esc(o.t)} · ${o.pax} personas · se entrega el día ${o.fin} · ${fmtC(o.pago)}</p>`).join('')+'</div>':'')+(of.length?of.map((o,i)=>`<div class="qitem"><b>🍽 ${esc(o.t)} · ${o.pax} personas</b><p>${esc(o.d)}</p><p class="note">Pagan ${fmtC(o.pago)} · ingredientes por adelantado: ${fmtC(o.pax*1100)}</p><button data-act="cat:${i}" ${n.cat.act.length>=2||S.money<o.pax*1100?'disabled':''}>Aceptar encargo</button></div>`).join(''):'<div class="qitem"><p class="note">Hoy no llegó ningún encargo. Mañana salen otros.</p></div>')+`<p class="note">Encargos hechos: ${n.cat.hechos}.</p>`}
  h+='<h3>Franquicias</h3>';
  if(lv<4)h+='<div class="qitem"><p class="note">🔒 Primero el nivel 4 (salón de eventos).</p></div>';else h+=(n.fama<40?`<div class="qitem"><p class="note">🔒 La marca tiene que ser famosa para franquiciar: fama ≥ 40 (llevás ${Math.round(n.fama)}).</p></div>`:'')+Object.entries(FRANQ).map(([k,f])=>{const o=n.fr[k];return`<div class="qitem"><b>🏪 ${esc(n.nombre)} · ${f.n}${o?' ✔':''}</b><p>${f.t}</p>${o?`<p class="note">Ha dejado ${fmtC(o.tot)} · vale ${fmtC(Math.round(f.c*.7))}</p><button class="alt" data-act="fven:${k}">Vender</button>`:`<p class="note">Regalías diarias: ${fmtC(f.r[0])} a ${fmtC(f.r[1])} (según la fama).</p><button class="green" data-act="fcom:${k}" ${n.fama<40||S.money<f.c?'disabled':''}>Abrir · ${fmtC(f.c)}</button>`}</div>`}).join('');return h},
 act(a,k){if(a==='nom'){closePanel();sodaNombrar(false);return}if(a==='ari'){if(k==='out')ariDespedir();else ariCont(k);return}if(a==='sub')sodaSubir();else if(a==='mej')sodaMejora(k);else if(a==='cat')catAceptar(+k);else if(a==='fcom')franComprar(k);else if(a==='fven')franVender(k);saveGame();appOpen('soda')}});
// ---------------------------------------------------------------- metas y logros
LOGROS.push(['ari_coc','👩‍🍳','Ariana en la cocina','Contratá a Ariana en tu soda.',()=>!!NEG().ari,5],['soda_nom','🪧','Con nombre propio','Ponele nombre a tu soda.',()=>NEG().nombre!=='Soda Mi Barrio'&&NEG().nombre!==undefined&&!!NEG().soda,2],['soda5','👑','Soda insignia','Llevá la soda al nivel 5.',()=>NEG().soda>=5,10],
 ['catering','🍽','Chef de eventos','Cumplí 5 encargos de catering.',()=>(NEG().cat&&NEG().cat.hechos)>=5,6],['franq1','🏪','Primera franquicia','Abrí tu primera franquicia.',()=>Object.keys(NEG().fr||{}).length>=1,8],['franq4','🌎','Imperio del casado','Tené 4 franquicias abiertas.',()=>Object.keys(NEG().fr||{}).length>=4,14]);
hookFilter('metas',function(out){const n=NEG();if(n.soda){const a=[];
  if(!n.cook&&!n.ari)a.push({ic:'👩‍🍳',t:'Una cocinera',d:'Doña Chela (El Hoyo) o Ariana, si ya tenés confianza con ella. Con Ariana vendés mucho más.',pr:0});
  else if(!n.ari&&(S.f.arRel||0)>=8)a.push({ic:'💛',t:'Ariana en la cocina',d:'Ofrecele ser empleada o socia en Mi soda (celular). Cocina mejor que nadie y se le ocurren recetas.',pr:1});
  if(n.nombre==='Soda Mi Barrio')a.push({ic:'🪧',t:'Ponele nombre a tu soda',d:'En Mi soda (celular) → Cambiar el nombre. Sale en el rótulo del barrio.',pr:1});
  if(n.soda<5&&!n.obra){const N=SODA_LV[n.soda+1];a.push({ic:'⬆️',t:N.n,d:'La siguiente ampliación de la soda cuesta '+fmtC(N.c)+'.',pr:S.money/N.c})}
  else if(n.soda>=4&&n.fama>=40&&!Object.keys(n.fr).length)a.push({ic:'🏪',t:'Tu primera franquicia',d:'Cartago, Heredia, Alajuela… En Mi soda (celular).',pr:S.money/900000});
  out.unshift(...a)}return out.slice(0,7)});
