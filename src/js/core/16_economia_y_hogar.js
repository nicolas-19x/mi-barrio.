// ================= ECONOMÍA Y HOGAR =================
const ECOV={cur:''};let ecoCat='';
const fmtC=n=>'₡'+Math.round(n).toLocaleString('es-CR').replace(/,/g,' ');
function E(){const f=S.f;if(!f.eco)f.eco={en:100,nb:S.day+6,grace:S.day+3,bills:[],cut:{},jobs:{pulp:{h:0,d:0},chap:{h:0,d:0},free:{h:0,d:0}},up:{},obra:null,log:{day:S.day,in:0,out:0,inn:{},outn:{}},hist:[],eggs:0,mango:0,mfruit:0,ham:0,pint:null,intro:0};return f.eco}
const U=id=>(S&&S.f&&S.f.eco&&S.f.eco.up[id])||0;
function ecoLog(d){try{if(!S||!S.f||!S.f.eco||!d)return;const L=S.f.eco.log;if(d>0){L.in+=d;const k=ecoCat||'Otros';L.inn[k]=(L.inn[k]||0)+d}else{L.out-=d;const k=ecoCat||'Compras';L.outn[k]=(L.outn[k]||0)-d}}catch(e){}}
const spend=(n,cat)=>{ecoCat=cat;S.money-=n;ecoCat=''},earn=(n,cat)=>{ecoCat=cat;S.money+=n;ecoCat=''};
function ecoHook(s){let m=s.money;Object.defineProperty(s,'money',{get(){return m},set(v){const d=v-m;m=v;ecoLog(d)},enumerable:true,configurable:true})}

// ---------- catálogo de mejoras ----------
const HUP={
 techo:{n:'Techo',ic:'🏠',cat:'Estructura',lv:[{n:'Zinc nuevo',c:9000,d:3,t:'Sacás el zinc oxidado y ponés láminas nuevas. Adiós goteras y manchas de óxido.'},{n:'Techo de teja',c:20000,d:4,req:['techo',1],t:'Teja de barro, fresquita y bonita. La casa se ve de otro nivel.'}]},
 piso:{n:'Piso de cerámica',ic:'🟫',cat:'Estructura',lv:[{n:'Cerámica',c:12000,d:3,t:'Se acabó el piso de madera crujiente. Cerámica clarita en toda la casa.'}]},
 verja:{n:'Verja y portón',ic:'🚪',cat:'Estructura',lv:[{n:'Verja de lanza',c:7000,d:2,t:'Una verja blanca al frente. Los perros ajenos ya no entran como Pedro por su casa.'},{n:'Portón y jardineras',c:15000,d:3,req:['verja',1],t:'Portón con lámparas y jardineras con flores. Pura vida.'}]},
 cama:{n:'Colchón ortopédico',ic:'🛏',cat:'Cuartos y muebles',lv:[{n:'Cama nueva',c:6000,d:1,t:'Dormís mejor y amanecés con más energía (+20⚡).'}]},
 refri:{n:'Refri y cocina nuevos',ic:'🧊',cat:'Cuartos y muebles',lv:[{n:'Refri y cocina de gas',c:14000,d:2,t:'Comés más barato en casa: la comida diaria baja 20%.'}]},
 sala:{n:'Sala con tele plana',ic:'📺',cat:'Cuartos y muebles',lv:[{n:'Sofá y tele plana',c:11000,d:2,t:'Las siestas cunden más (+10⚡).'}]},
 compu:{n:'Escritorio y compu',ic:'💻',cat:'Cuartos y muebles',lv:[{n:'Rincón de trabajo',c:16000,d:2,t:'Con internet, podés hacer trabajo freelance desde casa.'}]},
 tanque:{n:'Tanque de agua',ic:'💧',cat:'Servicios',lv:[{n:'Tanque elevado',c:9000,d:2,t:'El recibo del agua baja 25%.'}]},
 solar:{n:'Paneles solares',ic:'☀️',cat:'Servicios',lv:[{n:'2 paneles',c:18000,d:3,req:['techo',1],t:'El recibo de la luz baja 35%.'},{n:'4 paneles',c:20000,d:3,req:['solar',1],t:'El recibo de la luz baja 65%.'}]},
 internet:{n:'Internet de fibra',ic:'📶',cat:'Servicios',lv:[{n:'Fibra óptica',c:5000,d:1,t:'Instalación. Suma un recibo semanal de internet (₡2 500).'}]},
 huerta2:{n:'Huerta ampliada',ic:'🌱',cat:'Exterior',lv:[{n:'+3 parcelas',c:6000,d:1,t:'Otra hilera de parcelas para sembrar. Más tomates, más plata.'}]},
 gallinero:{n:'Gallinero',ic:'🐔',cat:'Exterior',lv:[{n:'4 gallinas',c:8000,d:2,req:['verja',1],t:'Huevos todos los días; los vendés a los vecinos.'},{n:'8 gallinas',c:12000,d:2,req:['gallinero',1],t:'El doble de gallinas, el doble de huevos.'}]},
 mango:{n:'Árbol de mango',ic:'🥭',cat:'Exterior',lv:[{n:'Mango',c:4000,d:1,t:'Siembra de un palo de mango. Tarda unos días en dar fruta.'}]},
 hamaca:{n:'Hamaca',ic:'🏝',cat:'Exterior',lv:[{n:'Hamaca',c:3500,d:1,t:'Siesta en la hamaca: +20⚡ una vez al día.'}]}};
const HCATS=['Estructura','Cuartos y muebles','Servicios','Exterior'];
const PINT=['#e9dcb5','#f3afc0','#a6d8cb','#a9c8ef','#f6c69f','#cde6a8','#efe9dc','#d6b6d9'];
const HOME_SOLID=[[9,5],[10,5],[5,3],[6,3],[11,9]];
const mangoStage=()=>{const e=E();if(!e.mango)return 0;const a=S.day-e.mango;return a<3?1:a<7?2:3};

// ---------- tiempo ----------
function passTime(min){S.t+=min;while(S.t>=1440){S.t-=1440;S.day++;ecoDay()}checkPeriod()}
function ecoTick(dt){const e=E();e.en=Math.min(100,e.en+dt*2/15);if(e.en<20&&!e.lowW){e.lowW=1;toast('⚡ Andás cansado: descansá o dormí')}if(e.en>=30)e.lowW=0}

// ---------- día nuevo ----------
function foodCost(){return S.day<=E().grace?0:Math.round(700*(U('refri')?.8:1)/50)*50}
function ecoDay(){const e=E();if(typeof fiadoDay==='function')fiadoDay();
 if(e.obra&&S.day>=e.obra.fin){const o=e.obra;e.obra=null;if(o.id==='pintura')e.pint=o.color;else{e.up[o.id]=o.lv;if(o.id==='mango')e.mango=S.day;if(o.id==='huerta2'&&S.activities.plots.length<6)while(S.activities.plots.length<6)S.activities.plots.push(null)}
  toast('🔨 ¡Obra lista: '+(o.id==='pintura'?'pintura nueva':HUP[o.id].lv[o.lv-1].n)+'!');e.doneMsg=(o.id==='pintura'?'Pintura nueva':HUP[o.id].lv[o.lv-1].n);applyHome()}
 const fc=foodCost();if(fc>0){const p=Math.min(fc,Math.max(0,S.money));if(p)spend(p,'Comida');e.fed=p>=fc?1:0;if(!e.fed)toast('No te alcanzó para la comida completa…')}else e.fed=1;
 e.hist.push({d:S.day-1,in:e.log.in,out:e.log.out,outn:e.log.outn,inn:e.log.inn});if(e.hist.length>7)e.hist.shift();e.log={day:S.day,in:0,out:0,inn:{},outn:{}};
 if(S.day>=e.nb){e.nb+=7;genBills()}
 for(const b of e.bills){if(b.paid)continue;if(S.day>b.due&&!b.late){b.late=1;b.amt=Math.round(b.amt*1.1);toast('⚠ Recibo vencido: '+b.n+' (+10%)')}if(S.day>b.due+1&&!e.cut[b.k]){e.cut[b.k]=1;toast(cutMsg(b.k))}}
 const hens=[0,4,8][U('gallinero')]+(S.f.martaHen&&U('gallinero')?1:0);if(hens)e.eggs=Math.min(30,e.eggs+Math.round(hens*(.6+.3*hsh(S.day,7))));
 if(mangoStage()===3&&S.day%2===0)e.mfruit=Math.min(12,e.mfruit+3);
 if(S.rain&&U('techo')===0&&Math.random()<.5){/* gotera */}
 applyHomeLight()}
function genBills(){const e=E(),mk2=(k,n,amt)=>e.bills.push({id:S.day+k,k,n,amt:Math.round(amt/50)*50,due:S.day+4,paid:0,late:0});
 mk2('luz','Recibo de la luz',3200*(.92+.2*hsh(S.day,3))*(1-[0,.35,.65][U('solar')]));mk2('agua','Recibo del agua',1800*(.95+.15*hsh(S.day,5))*(1-(U('tanque')?.25:0)));if(U('internet'))mk2('internet','Internet',2500);
 zCuotas(e,mk2);toast('🧾 Llegaron los recibos');if(typeof phOn==='function'&&phOn('mama'))phMsg('mama','Mijo, ya deben haber llegado los recibos. Pague a tiempo, que si no le cortan la luz y eso es un clavo. Dios lo bendiga 🙏')}
const billsDue=()=>E().bills.filter(b=>!b.paid);
function payBill(id){const e=E(),b=e.bills.find(x=>String(x.id)===String(id));if(!b||b.paid)return;if(S.money<b.amt){toast('No te alcanza');return}spend(b.amt,'Recibos');b.paid=1;if(!e.bills.some(x=>!x.paid&&x.k===b.k))e.cut[b.k]=0;toast('Pagado: '+b.n);beep(660,.06,'trian');saveGame()}

// ---------- mejoras ----------
function upNext(id){const l=HUP[id].lv[U(id)];return l||null}
function reqOk(l){return!l.req||U(l.req[0])>=l.req[1]}
function startObra(id,self,color){const e=E();if(e.obra){toast('Ya hay una obra en marcha');return}let l,cost,days;
 if(id==='pintura'){l={n:'Pintura'};cost=3000;days=1}else{l=upNext(id);if(!l||!reqOk(l))return;cost=l.c;days=l.d}
 if(self){if(jLv('chap')<1){toast('Necesitás ser Capataz con Don Alexander');return}cost=Math.round(cost*.75);days+=1;if(e.en<25){toast('Estás muy cansado para la obra');return}}
 if(S.money<cost){toast('Te faltan '+fmtC(cost-S.money));return}
 if(S.f.kevinHelp&&id!=='pintura')cost=Math.round(cost*.9);if(S.money<cost){toast('Te faltan '+fmtC(cost-S.money));return}spend(cost,'Mejoras de la casa');if(self)e.en-=25;e.obra={id,lv:id==='pintura'?0:U(id)+1,fin:S.day+days,color:color||null};applyHome();toast('🔨 Obra iniciada: lista en '+days+(days>1?' días':' día'));saveGame()}

// ---------- trabajos ----------
const JOBS={pulp:{n:'Pulpería de Doña Rosa',en:9,lv:[['Ayudante',450,0],['Dependiente',600,12],['Encargado',800,40]]},
 chap:{n:'Chapea con Don Alexander',en:13,lv:[['Peón',500,0],['Capataz',700,14],['Maestro de obra',950,40]]},
 free:{n:'Freelance desde la compu',en:6,lv:[['Novato',800,0],['Diseñador/a',1100,10],['Profesional',1500,30]]}};
const jLv=k=>{const h=E().jobs[k].h;let l=0;JOBS[k].lv.forEach((x,i)=>{if(h>=x[2])l=i});return l};
const SEV={
 pulp:[{x:'Entra un chiquillo con ₡200 y pide una bolsa de Pozuelo. Le faltan ₡150.',a:['Ponerle los ₡150 de tu bolsa',()=>{spend(150,'Propinas y regalos');earn(400,'Propina');say('rosa','Vi lo que hizo, mijo. Dios se lo pague. Tome esto por buen corazón.')}],b:['Cobrarle completo',()=>say('rosa','Las reglas son las reglas... aunque a mí me dio pena.')]},
  {x:'Se te cae una caja de huevos. Plaf. Medio piso hecho tortilla.',a:['Reponerlos de tu bolsa (₡600)',()=>{spend(600,'Propinas y regalos');earn(500,'Propina');say('rosa','Eso es tener palabra. Tome, para el cafecito.')}],b:['Esconder la caja y silbar',()=>{spend(300,'Multas');say('rosa','¡Ave María! ¿Y esos huevos, mijo? Se los descuento.')}]},
  {x:'Doña Marta llega a pedir fiado otra vez, con la sonrisa de siempre.',a:['Apuntárselo en el cuaderno',()=>{earn(200,'Propina');say('rosa','Usted sí es buen muchacho. Marta siempre me paga... eventualmente.')}],b:['Pedirle que pague',()=>say('rosa','Bueno, ya veremos si vuelve. Es la tercera vez este mes.')]}],
 chap:[{x:'Entre el monte sale una culebra enorme. Don Alexander ni se mueve.',a:['Espantarla con el machete',()=>{relAdd('op',.2);earn(300,'Propina');say('papa','Así se hace. Firme y sin gritar. Tome, es suyo.')}],b:['Salir corriendo gritando',()=>{say('papa','Ja... ja. Al principio todos corren. Siga chapeando, que la culebra tiene más miedo que usted.')}]},
  {x:'A media mañana, Don Alexander saca una botellita de café y dos tortillas.',a:['Aceptarlas y charlar un rato',()=>{relAdd('op',.25);say('papa','Poca gente me conversa parejo. Se aprende más escuchando que hablando.')}],b:['Seguir chapeando sin parar',()=>{earn(250,'Propina');say('papa','Trabajador. Pero el que no descansa no rinde. Tome, por el empeño.')}]},
  {x:'Se traba el machete en una raíz gruesa. Hay que decidir rápido.',a:['Pedirle ayuda a Don Alexander',()=>{relAdd('op',.1);say('papa','Así. Preguntando se llega a Roma. Mire cómo se hace.')}],b:['Jalar con toda la fuerza',()=>{spend(200,'Multas');say('papa','¡Cuidado! Casi se mocha un dedo. La próxima, con calma.')}]}],
 free:[{x:'El cliente quiere "un cambio chiquitito": el logo en otro color. Y otro. Y otro.',a:['Aceptar los cambios gratis',()=>{earn(400,'Propina');say(null,'El cliente quedó tan feliz que te dejó propina por SINPE.')}],b:['Cobrar el tiempo extra',()=>{say(null,'Aceptó a regañadientes. Mejor cobrar que regalar.')}]},
  {x:'Se va la luz del barrio justo cuando ibas a guardar el archivo.',a:['Rezar y revisar el autoguardado',()=>{earn(300,'Propina');say(null,'¡Estaba guardado! Dios existe y el autoguardado también.')}],b:['Rehacer todo de memoria',()=>{spend(250,'Multas');say(null,'Perdiste una hora, pero quedó mejor que antes.')}]}]};
function shiftEvent(k,lvBefore){const e=E(),J=JOBS[k],nl=jLv(k);if(nl>lvBefore){say(null,'🎖 ¡Te ascendieron a '+J.lv[nl][0]+'! Ahora ganás '+fmtC(J.lv[nl][1])+' la hora.')}
 const ev=SEV[k];if(hsh(S.day,k.length*9)<.7){const v=ev[Math.floor(hsh(S.day,k.length*3+1)*ev.length)%ev.length];say(null,v.x,[{t:v.a[0],f:v.a[1]},{t:v.b[0],f:v.b[1]}])}runDialog()}
function doShift(k,h){const e=E(),J=JOBS[k],L=J.lv[jLv(k)],cost=J.en*h,pay=Math.round(L[1]*h*(k==='chap'&&S.f.yucaGift?1.1:1)),lvB=jLv(k);
 if(e.en<cost+5){say(null,'Estás muy cansado para '+h+' horas de trabajo. Dormí, comé algo o descansá en la hamaca.');return}
 if(e.jobs[k].d===S.day){say(null,'Ya trabajaste hoy aquí. Mañana otra vez.');return}
 if(hour()+h>21){say(null,'Ya es muy tarde para un turno de '+h+' horas.');return}
 fadeDo(()=>{passTime(h*60);e.en-=cost;e.jobs[k].h+=h;e.jobs[k].d=S.day;earn(pay,J.n);if(k==='chap')relAdd('op',.1);toast('+ '+fmtC(pay)+' · −'+cost+'⚡')},()=>{say(null,'Trabajaste '+h+' horas como '+L[0].toLowerCase()+'. Ganaste '+fmtC(pay)+'.');shiftEvent(k,lvB);saveGame()})}
function jobMenu(k,who){if(k==='pulp'){pulpMenu(who);return}const J=JOBS[k],L=J.lv[jLv(k)];say(who,'¿Cuántas horas puede echarle?',[{t:'3 horas ('+fmtC(L[1]*3)+')',f(){afterD(()=>{doShift(k,3);runDialog()})}},{t:'5 horas ('+fmtC(L[1]*5)+')',f(){afterD(()=>{doShift(k,5);runDialog()})}},{t:'Mejor otro día'}])}
function wrapJob(id,k,okf,line){const o=TALK[id]||(()=>genericTalk(CH[id]));TALK[id]=function(){const eb=E().jobs[k];if(eb.d===S.day&&(k!=='chap'||(S.f.opinion||0)>=-.5)){say(id,id==='rosa'?'Ya trabajó hoy conmigo, mijo. Descanse, que mañana hay más pulpería.':'Hoy ya me ayudó. Mañana madrugamos otra vez.');afterD(()=>o());return}if(!okf()&&eb.d!==S.day&&(hour()<6||hour()>18)){say(id,hour()<6?'¡Ni los gallos se han levantado! Venga cuando amanezca, de 6 de la mañana en adelante.':'Ya es muy tarde para un turno, mijo. Mañana temprano.');afterD(()=>o());return}if(okf()){const L=JOBS[k].lv[jLv(k)];say(id,line,[{t:'Pedir turno ('+L[0]+' · '+fmtC(L[1])+'/h)',f(){jobMenu(k,id)}},{t:'Solo conversar',f(){o()}}]);return}o()}}
wrapJob('rosa','pulp',()=>hour()>=6&&hour()<=18&&E().jobs.pulp.d!==S.day,'Mire, mi amor, ¿anda con ganas de trabajar? Aquí siempre se necesita una mano.');
wrapJob('papa','chap',()=>hour()>=6&&hour()<=17&&E().jobs.chap.d!==S.day&&(S.f.opinion||0)>=-.5,'Muchacho, hay un lote que chapear. Pago justo, pero se trabaja de verdad. Al que madruga, Dios lo ayuda.');
const _furnTalk=furnTalk;
furnTalk=function(o,m){const mine=m.id==='casa_jugador';
 if(o.act==='shop'&&NPC.rosa&&NPC.rosa.map==='pulperia'&&!mine){TALK.rosa();return}
 if(mine&&o.act==='table'){say(null,'Sobre la mesa tenés tus libretas.',[{t:'Libreta de la casa',f(){afterD(()=>openCasa())}},{t:'Libreta de gastos',f(){afterD(()=>openFin())}},{t:'Nada'}]);return}
 if(mine&&o.act==='compu'){const e=E();if(!U('internet')){say(null,'La compu está lista, pero sin internet no hay trabajo. Contratá la fibra en la libreta de la casa.');return}if(e.cut.luz||e.cut.internet){say(null,'No hay '+(e.cut.luz?'luz':'internet')+'. Pagá el recibo para trabajar.');return}if(hour()<7||hour()>19){say(null,'Ya es muy tarde para trabajar; ahí se atrasa el sueño.');return}const L=JOBS.free.lv[jLv('free')];if(e.jobs.free.d===S.day){say(null,'Hoy ya trabajaste. Mañana hay más clientes.');return}say(null,'Abrís la compu. Hay mensajes de clientes esperando.',[{t:'Trabajar 3 horas ('+fmtC(L[1]*3)+')',f(){afterD(()=>{doShift('free',3);runDialog()})}},{t:'Trabajar 5 horas ('+fmtC(L[1]*5)+')',f(){afterD(()=>{doShift('free',5);runDialog()})}},{t:'Ahora no'}]);return}
 if(mine&&o.act==='tv'&&E().cut.luz){say(null,'No hay luz. La tele no enciende.');return}
 _furnTalk(o,m)};
// ---------- gallinero / hamaca / mango ----------
ACT_POINTS.push(
 ...[3,4,5].map(i=>({map:'ext',x:3+(i-3)*2,y:9,label:'Huerta · parcela '+(i+1),run:()=>gardenTalk(i),cond:()=>U('huerta2')>0})),
 {map:'ext',x:9,y:6,label:'Gallinero',cond:()=>U('gallinero')>0,run(){const e=E();if(!e.eggs){say(null,'Las gallinas cacarean, pero todavía no hay huevos. Mañana.');return}const n=e.eggs,v=n*140;say(null,'Hay '+n+' huevos frescos. Los vendés a los vecinos por '+fmtC(v)+'.',[{t:'Recoger y vender',f(){e.eggs=0;earn(v,'Gallinero');toast('+ '+fmtC(v)+' (huevos)')}},{t:'Dejarlos'}])}},
 {map:'ext',x:5,y:4,label:'Hamaca',cond:()=>U('hamaca')>0,run(){const e=E();if(e.ham===S.day){say(null,'Ya te echaste la siesta de hoy. Hay que trabajar también.');return}say(null,'La hamaca se mece con la brisa. Hora de descansar un ratito.',[{t:'Echarse una siesta',f(){afterD(()=>fadeDo(()=>{e.ham=S.day;passTime(60);e.en=Math.min(100,e.en+20);toast('⚡ +20 · '+fmtTime())}))}},{t:'Mejor no'}])}},
 {map:'ext',x:11,y:10,label:'Palo de mango',cond:()=>mangoStage()>0,run(){const e=E(),st=mangoStage();if(st<3){say(null,st===1?'El palito de mango todavía es un bebé. Hay que tenerle paciencia.':'El mango ya agarró cuerpo. Faltan unos días para la fruta.');return}if(!e.mfruit){say(null,'Hay flores, pero todavía no hay mangos maduros.');return}const n=e.mfruit,v=n*160;say(null,'¡Mangos maduros! '+n+' listos para vender a '+fmtC(160)+' cada uno.',[{t:'Cosechar y vender',f(){e.mfruit=0;earn(v,'Mango');toast('+ '+fmtC(v)+' (mangos)')}},{t:'Dejarlos madurar'}])}});

// ---------- aplicar cambios a la casa ----------
function applyHomeLight(){}
function applyHome(){const e=E(),b=BMAP.casa_jugador;if(!b)return;if(!b.o0)b.o0={wall:b.wall,roof:b.roof,floor:b.floor};
 b.wall=e.pint||b.o0.wall;b.roof=[b.o0.roof,'#cfd6db','#b4553c'][U('techo')];b.newRoof=U('techo')>0;b.floor=U('piso')?12:b.o0.floor;
 b.fx={verja:U('verja'),solar:U('solar'),tanque:U('tanque'),obra:!!e.obra,gall:U('gallinero'),ham:U('hamaca'),mango:mangoStage(),h2:U('huerta2')};
 const m=MAPS.ext;for(const[x,y]of HOME_SOLID)m.s[y*m.w+x]=0;
 if(U('gallinero'))for(const[x,y]of[[9,5],[10,5]])m.s[y*m.w+x]=1;if(U('hamaca'))for(const[x,y]of[[5,3],[6,3]])m.s[y*m.w+x]=1;if(mangoStage())m.s[9*m.w+11]=1;
 if(U('huerta2'))while(S.activities.plots.length<6)S.activities.plots.push(null);
 const im=genInt(b),w=im.w,mark=(t,v)=>{const o=im.objs.find(o=>o.type===t);if(o)o.v=v};
 if(U('cama'))mark('bed',1);if(U('refri')){mark('fridge',1);mark('stove',1)}if(U('sala')){mark('tv',1);mark('sofa',1)}
 if(U('compu')){im.objs.push({type:'desk',x:1,y:6,w:2,h:1,act:'compu'});im.s[6*w+1]=1;im.s[6*w+2]=1}
 renderMap(im);renderMap(m);if(typeof genMini==='function'){genMini();MM.big=null}}
const _drawObj=drawObj;
drawObj=function(g,o,m){const X=o.x*T,Y=o.y*T,W=o.w*T,H=o.h*T;
 if(o.type==='desk'){R(g,'rgba(0,0,0,.2)',X,Y+13,W,3);R(g,'#7a5233',X,Y+4,W,10);R(g,'#8a6a45',X,Y+4,W,2);R(g,'#2a2a30',X+5,Y-8,13,10);R(g,'#6fb5e8',X+6,Y-7,11,8);R(g,'#9fd0f2',X+7,Y-6,4,2);R(g,'#2a2a30',X+10,Y+2,5,2);R(g,'#d9d9d9',X+4,Y+7,12,3);R(g,'#f2c94c',X+24,Y-2,4,6);R(g,'#8a6a45',X+25,Y+4,2,2);return}
 if(o.v){_drawObj(g,o,m);
  if(o.type==='bed'){R(g,'#2f6fbf',X+2,Y+12,W-4,H-14);for(let i=0;i<H-14;i+=5)R(g,'#3f86dd',X+2,Y+12+i,W-4,2);R(g,'#ffffff',X+3,Y+3,W-6,5);R(g,'#dfe8f4',X+3,Y+7,W-6,2);R(g,'#f2c94c',X+4,Y+H-7,W-8,2)}
  else if(o.type==='fridge'){R(g,'#cfd6da',X+1,Y-12,14,28);R(g,'#aab2b7',X+1,Y-1,14,1);R(g,'#6c747a',X+11,Y-9,1,6);R(g,'#6c747a',X+11,Y+3,1,8);R(g,'#8fd0e8',X+3,Y-9,5,2)}
  else if(o.type==='stove'){R(g,'#25252b',X,Y,16,16);R(g,'#4a4a52',X+1,Y+9,14,6);R(g,'#7a7a82',X+3,Y+11,10,1);for(const bx of[3,10]){R(g,'#111',X+bx,Y+2,4,4);R(g,'#4fa3e0',X+bx+1,Y+3,2,2)}}
  else if(o.type==='tv'){R(g,'#5c3d24',X,Y+8,W,8);R(g,'#0c0c10',X+2,Y-8,W-4,16);R(g,'#2d5f9a',X+4,Y-6,W-8,12);R(g,'#6fb5e8',X+5,Y-5,10,3);R(g,'#f2c94c',X+W-12,Y+1,5,3)}
  else if(o.type==='sofa'){R(g,'#566070',X,Y+2,W,12);R(g,'#6e7a8c',X+2,Y+4,W/2-3,8);R(g,'#6e7a8c',X+W/2+1,Y+4,W/2-3,8);R(g,'#3f4856',X,Y+12,W,2);R(g,'#f2c94c',X+3,Y+4,4,4)}
  return}
 _drawObj(g,o,m)};
function drawHome(g){if(!S||!S.f||!S.f.eco)return;const b=BMAP.casa_jugador,fx=b&&b.fx;if(!fx)return;const X=b.x*T,Y=b.y*T,W=b.w*T,e=S.f.eco;
 for(let i=0;i<fx.solar*2;i++){const px=X+8+i*24,py=Y+6;R(g,'#223a60',px,py,20,12);R(g,'#4f78b5',px+1,py+1,18,10);R(g,'#223a60',px+7,py+1,1,10);R(g,'#223a60',px+13,py+1,1,10);R(g,'#223a60',px+1,py+6,18,1);R(g,'#a9cdf2',px+2,py+2,3,1)}
 if(fx.tanque){const tx=X+W-26,ty=Y+30;R(g,'#4a4a50',tx+2,ty+14,2,12);R(g,'#4a4a50',tx+16,ty+14,2,12);R(g,'#1d4f91',tx,ty,20,16);R(g,'#2f74c4',tx+1,ty+1,18,5);R(g,'#16396b',tx,ty+15,20,1);R(g,'#7fbbf5',tx+3,ty+2,4,1)}
 if(fx.verja){for(let x=1;x<=9;x++){if(x===5)continue;const px=x*T,py=18*T;R(g,'#e9e4d6',px,py+3,T,2);R(g,'#e9e4d6',px,py+10,T,2);for(let i=1;i<T;i+=4){R(g,'#f6f3ea',px+i,py+1,2,13);R(g,'#d0cabb',px+i+1,py+1,1,13)}}
  if(fx.verja>1){for(const px of[4*T+11,6*T-2]){R(g,'#8f8a7e',px,18*T-3,5,19);R(g,'#6f6a60',px,18*T-3,1,19);R(g,'#f7e04b',px,18*T-6,5,4);R(g,'#fff6a8',px+1,18*T-5,3,2)}
   for(const px of[1*T,9*T]){R(g,'#9b523f',px+1,17*T+8,14,7);R(g,'#7a3f2f',px+1,17*T+14,14,1);for(let j=0;j<4;j++){R(g,'#3f8a3e',px+2+j*3,17*T+4,1,5);R(g,j%2?'#f2c94c':'#f193b4',px+1+j*3,17*T+2,3,3)}}}}
 if(fx.obra){R(g,'rgba(60,120,200,.6)',X+W/2,Y+2,W/2-2,52);R(g,'rgba(40,90,170,.7)',X+W/2,Y+2,W/2-2,2);for(let i=0;i<W;i+=8){R(g,(i/8)%2?'#14101c':'#f7c531',X+i,Y+b.h*T-6,8,4)}
  R(g,'#f4ead2',1*T+1,17*T+2,14,9);R(g,'#d64545',1*T+1,17*T+2,14,2);g.fillStyle='#14101c';g.font='bold 4px monospace';g.textAlign='left';g.textBaseline='top';g.fillText('OBRA',1*T+3,17*T+5);
  for(const cx of[2*T+2,8*T+2]){R(g,'#f2873a',cx,17*T+8,5,7);R(g,'#fff',cx+1,17*T+10,3,1)}}
 if(fx.h2)for(let i=0;i<3;i++){const px=(3+i*2)*T+8,py=9*T+8;R(g,'#72513d',px-6,py+3,12,2);R(g,'#5b402f',px-6,py+5,12,1);R(g,'#8a6a45',px-7,py,1,6);R(g,'#8a6a45',px+6,py,1,6)}
 if(fx.gall){const gx=9*T,gy=5*T;R(g,'rgba(0,0,0,.2)',gx+1,gy+13,31,4);R(g,'#8a5a2b',gx+2,gy+4,14,10);R(g,'#6b4a2b',gx+2,gy+10,14,1);R(g,'#b8442f',gx,gy,18,5);R(g,'#8e2f26',gx,gy+4,18,1);R(g,'#2a1e14',gx+7,gy+7,5,7);
  R(g,'rgba(225,225,225,.45)',gx+18,gy+5,13,9);for(let i=0;i<13;i+=3)R(g,'rgba(255,255,255,.6)',gx+18+i,gy+5,1,9);R(g,'#6b4a2b',gx+18,gy+3,1,11);R(g,'#6b4a2b',gx+30,gy+3,1,11);
  const n=fx.gall>1?4:2;for(let i=0;i<n;i++){const hx=gx+20+(i%2)*6,hy=gy+9+((i/2)|0)*0+(i>1?-3:0);R(g,'#f4f4f4',hx,hy,4,3);R(g,'#d64545',hx+3,hy-1,1,1);R(g,'#f2994a',hx+4,hy+1,1,1)}}
 if(fx.ham){const hx=5*T,hy=3*T;R(g,'rgba(0,0,0,.18)',hx,hy+14,32,3);R(g,'#6b4a2b',hx,hy+2,2,13);R(g,'#6b4a2b',hx+30,hy+2,2,13);for(let i=0;i<28;i++){const off=Math.round(Math.sin(i/27*Math.PI)*5);R(g,i%6<3?'#d64545':'#f2c94c',hx+2+i,hy+4+off,1,3);R(g,'#4a3a2c',hx+2+i,hy+3+off,1,1)}}
 if(fx.mango){const mx=11*T+8,my=9*T+16;R(g,'rgba(0,0,0,.2)',mx-6,my-2,12,4);if(fx.mango===1){R(g,'#6b4a2b',mx-1,my-8,2,8);R(g,'#58a64c',mx-4,my-12,8,5);R(g,'#7cc86a',mx-2,my-13,3,2)}else{R(g,'#6b4a2b',mx-2,my-14,4,14);R(g,'#56391f',mx-2,my-14,1,14)}}}
function drawHomeTop(tg){if(!S||!S.f||!S.f.eco)return;const st=mangoStage();if(st<2)return;const mx=11*T+8,my=9*T+16,r=st===2?9:13;disc(tg,'#2e6e33',mx,my-18,r);disc(tg,'#3f8a3e',mx-3,my-21,r-4);disc(tg,'#58a64c',mx-5,my-24,Math.max(2,r-9));if(st===3&&S.f.eco.mfruit>0)for(let i=0;i<6;i++)R(tg,i%2?'#f2994a':'#f2c94c',mx-9+i*4,my-16+(i%3)*3,3,3)}

// ---------- paneles ----------
function jobLine(k){const J=JOBS[k],e=E(),lv=jLv(k),L=J.lv[lv],nx=J.lv[lv+1];return`<div class="qitem"><b>${J.n}</b><p>${L[0]} · ${fmtC(L[1])}/h · ${e.jobs[k].h} h trabajadas · ⚡${J.en}/h${nx?` · próximo: ${nx[0]} a las ${nx[2]} h`:' · ¡nivel máximo!'}</p></div>`}
function finHTML(){const e=E(),L=e.log,out=Object.entries(L.outn).map(([k,v])=>k+' '+fmtC(v)).join(' · '),inn=Object.entries(L.inn).map(([k,v])=>k+' '+fmtC(v)).join(' · ');
 let h=`<div class="qitem"><b>👛 Saldo: ${fmtC(S.money)}</b><p>⚡ Energía: ${Math.round(e.en)}/100 · Comida diaria: ${foodCost()?fmtC(foodCost()):'gratis por ahora'}</p><div class="eco-bar"><i style="width:${Math.round(e.en)}%"></i></div></div>`;
 h+=`<div class="qitem"><b>Hoy</b><p>Entró ${fmtC(L.in)}${inn?' ('+inn+')':''}<br>Salió ${fmtC(L.out)}${out?' ('+out+')':''}</p></div>`;
 const bs=billsDue();h+=`<h3>Recibos</h3>`;
 if(!bs.length)h+=`<p class="note">No tenés recibos pendientes. Los próximos llegan el día ${e.nb}.</p>`;
 else{h+=bs.map(b=>`<div class="qitem"><b>${b.k==='luz'?'💡':b.k==='agua'?'🚰':'📶'} ${b.n} · ${fmtC(b.amt)}</b><p>${b.late?'<b style="color:#d6453c">VENCIDO</b>':'Vence el día '+b.due}${e.cut[b.k]?' · <b style="color:#d6453c">servicio cortado</b>':''}</p><button data-eco="pay:${b.id}">Pagar por SINPE</button></div>`).join('');if(bs.length>1)h+=`<button data-eco="payall" class="green">Pagar todos (${fmtC(bs.reduce((s,b)=>s+b.amt,0))})</button>`}
 h+=`<h3>Trabajos</h3>`+['pulp','chap','free'].map(jobLine).join('')+`<p class="note">Pedí turno hablando con Doña Rosa (pulpería) o Don Alexander (chapea). El freelance se hace en la compu de tu casa.</p>`;
 if(e.hist.length)h+=`<h3>Últimos días</h3>`+e.hist.slice().reverse().map(x=>`<p class="note">Día ${x.d}: +${fmtC(x.in)} / −${fmtC(x.out)} (neto ${x.in-x.out>=0?'+':''}${fmtC(x.in-x.out)})</p>`).join('');
 return h+`<div class="row" style="margin-top:8px"><button data-eco="casa">🏠 Libreta de la casa</button></div>`}
function openFin(){ECOV.cur='fin';openPanel('Finanzas',finHTML())}
function casaHTML(){const e=E(),all=Object.keys(HUP),done=all.reduce((s,k)=>s+U(k),0),tot=all.reduce((s,k)=>s+HUP[k].lv.length,0);
 let h=`<div class="qitem"><b>🏠 Tu casa: ${done}/${tot} mejoras</b><div class="eco-bar"><i style="width:${Math.round(done/tot*100)}%"></i></div><p>Saldo: ${fmtC(S.money)}</p></div>`;
 if(e.obra){const o=e.obra,n=o.id==='pintura'?'Pintura':HUP[o.id].lv[o.lv-1].n;h+=`<div class="qitem"><b>🔨 Obra en marcha: ${n}</b><p>Termina el día ${o.fin} (faltan ${Math.max(0,o.fin-S.day)}). Una obra a la vez.</p></div>`}
 const jc=jLv('chap')>=1;
 for(const cat of HCATS){h+=`<h3>${cat}</h3>`;for(const id of all.filter(k=>HUP[k].cat===cat)){const H=HUP[id],l=upNext(id);
  if(!l){h+=`<div class="qitem"><b>${H.ic} ${H.n} ✔</b><p>${H.lv[H.lv.length-1].n}</p></div>`;continue}
  const ok=reqOk(l),req=l.req?HUP[l.req[0]].n+(HUP[l.req[0]].lv.length>1?' (nivel '+l.req[1]+')':''):'';
  h+=`<div class="qitem"><b>${H.ic} ${H.n}${H.lv.length>1?' · nivel '+(U(id)+1):''}: ${l.n}</b><p>${l.t}</p><p class="note">${fmtC(Math.round(l.c*(S.f.kevinHelp?.9:1)))}${S.f.kevinHelp?' (con ayuda de Carlillos)':''} · ${l.d} día${l.d>1?'s':''}${ok?'':' · requiere '+req}</p>`+(ok&&!e.obra?`<button data-eco="up:${id}" ${S.money<l.c?'class="alt"':''}>Contratar</button>`+(jc?` <button data-eco="upself:${id}" class="alt">Hacerlo vos (${fmtC(Math.round(l.c*.75))}, +1 día)</button>`:''):'')+`</div>`}}
 h+=`<h3>Pintura</h3><div class="qitem"><p>Repintá toda la casa por ${fmtC(3000)} (1 día).</p><div class="eco-sw">${PINT.map(c=>`<button data-eco="paint:${c}" style="background:${c}" title="${c}"></button>`).join('')}</div></div>`;
 return h+`<div class="row" style="margin-top:8px"><button data-eco="fin">💰 Finanzas</button></div>`}
function openCasa(){ECOV.cur='casa';openPanel('Libreta de la casa',casaHTML())}
function ecoRerender(){if(ECOV.cur==='phone'&&typeof phRender==='function')phRender();else if(ECOV.cur==='casa')openCasa();else openFin()}
function ecoAct(a){const[k,v]=a.split(':');
 if(k==='fin'){openFin();return}if(k==='hist'){openHist();return}if(k==='casa'){openCasa();return}
 if(k==='pay'){payBill(v);ecoRerender();return}
 if(k==='payall'){billsDue().forEach(b=>payBill(b.id));ecoRerender();return}
 if(k==='up'||k==='upself'){startObra(v,k==='upself');ecoRerender();return}
 if(k==='paint'){startObra('pintura',false,v+(a.split(':')[2]||''));ecoRerender();return}}
addEventListener('click',ev=>{const b=ev.target&&ev.target.closest&&ev.target.closest('[data-eco]');if(b)ecoAct(b.dataset.eco)});
function ecoSummary(){const e=E(),h=e.hist[e.hist.length-1];if(h)say(null,'☀ Nuevo día. Ayer entró '+fmtC(h.in)+' y salió '+fmtC(h.out)+(Object.keys(h.outn||{}).length?' ('+Object.entries(h.outn).map(([k,v])=>k+' '+fmtC(v)).join(', ')+')':'')+'. Energía: '+Math.round(e.en)+'⚡');
 if(e.doneMsg){say(null,'🔨 Terminó la obra: '+e.doneMsg+'. Ya se nota el cambio.');e.doneMsg=null}
 const bs=billsDue();if(bs.length)say(null,'🧾 Recibos pendientes: '+bs.map(b=>b.n+' '+fmtC(b.amt)+(b.late?' (VENCIDO)':' (vence día '+b.due+')')).join(', ')+'. Se pagan en Finanzas.');
 if(!e.fed)say(null,'Anoche no pudiste comer bien y amanecés sin fuerzas.');
 if(e.eggs>0||e.mfruit>0)say(null,'Afuera hay '+(e.eggs?e.eggs+' huevos':'')+(e.eggs&&e.mfruit?' y ':'')+(e.mfruit?e.mfruit+' mangos':'')+' esperando.');runDialog()}
