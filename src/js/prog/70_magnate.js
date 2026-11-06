// ================= PROGRESO · DE EMPRENDEDOR A MAGNATE TICO =================
// Empresas que se compran y se mejoran, casas del barrio para alquilar, patrimonio con títulos,
// una fundación que cambia El Hoyo y, si sos presidente de la Asociación, el diseño del barrio.
function MAG(){const p=PGS();if(!p.mag)p.mag={emp:{},prop:{},inv:{},fund:{},dis:[],hist:[],ayer:0};return p.mag}
// ---------------------------------------------------------------- empresas
// d: ganancia diaria base (nivel 1) · up: costo de mejora · ev: eventos (buenos y malos)
const EMP={
 empanadas:{n:'Empanadas a domicilio',ic:'🥟',c:25000,d:[3500,5000],req:()=>NEG().cook?'':'Necesitás tener a Doña Chela de cocinera en la soda.',t:'Doña Chela hace las empanadas en la mañana y Chamaco las reparte en bici por el barrio.',
  ev:[['+','A la iglesia le encargaron 200 empanadas para el turno. ¡Pedidazo!',3],['-','Chamaco se comió media docena en el camino. «Era control de calidad, jefe.»',.6]]},
 feria:{n:'Tramo en la feria del agricultor',ic:'🥬',c:40000,d:[0,0],sab:[24000,36000],t:'Un tramo de verduras y frutas en la feria de los sábados. Solo deja plata los sábados, pero deja bien.',
  ev:[['+','Se acabaron los aguacates a las 7 de la mañana. Los vendiste al precio que quisiste.',1.6],['-','Llovió toda la mañana y la feria estuvo vacía.',.4]]},
 lavacar:{n:'Lavacar El Chorro',ic:'🚿',c:120000,d:[12000,18000],t:'Un lavacar a la par de la bomba. Lavado sencillo, encerado y aspirado. Los sábados se hace fila.',
  ev:[['-','El AyA cortó el agua todo el día. Ni un carro lavado.',0],['-','Un cliente reclamó un rayón en la puerta. Le pagaste la pintura.',.3],['+','Llegaron los buses de una excursión a lavar. ¡Día redondo!',2.2]]},
 taxi:{n:'Taxi rojo con placa',ic:'🚕',c:420000,d:[30000,40000],t:'Un taxi rojo con su placa del Consejo de Transporte Público. Contratás un chofer y te deja la cuota diaria.',
  ev:[['-','El chofer chocó contra un poste en Hatillo. Taller y deducible.',.1],['-','Hubo bloqueo en la General Cañas todo el día.',.4],['+','Fin de quincena: carreras todo el día.',1.7]]},
 ferreteria:{n:'Ferretería El Clavo Torcido',ic:'🔨',c:650000,d:[48000,60000],req:()=>repLv()>=2?'':'Necesitás ser «Vecino de confianza» para que los proveedores te den crédito.',t:'Clavos, cemento, láminas de zinc y la sabiduría de un dependiente que sabe de todo.',
  ev:[['+','Medio barrio está arreglando techos después del aguacero. Se vendió todo el zinc.',2],['-','Se perdió una caja de tornillos. Nadie sabe nada.',.7]]},
 sucursal:{n:'Soda Mi Barrio · sucursal Chepe',ic:'🍛',c:900000,d:[65000,85000],req:()=>progSodaLv()>=2?'':'Primero agrandá la soda del barrio (terracita con mesas).',t:'Una segunda soda en el centro de San José, cerca del Mercado. Casados para oficinistas.',
  ev:[['+','Salió en un programa de tele: «el mejor casado del centro». Fila hasta la esquina.',2.4],['-','El Ministerio de Salud pidió cambiar la campana de la cocina. Cerrado medio día.',.4]]},
 bus:{n:'Ruta de buses Barrio–San José',ic:'🚌',c:3000000,d:[190000,240000],req:()=>repLv()>=4?'':'Para una concesión de ruta necesitás ser «Mae importante».',t:'La concesión de la ruta del barrio. Contratás a Don Beto y a dos choferes más. Los buses se pintan con el nombre del barrio.',
  ev:[['-','La ARESEP no aprobó el aumento de la tarifa. Otro mes igual.',.6],['-','Un bus se varó en la Circunvalación en plena hora pico.',.4],['+','Inicio de clases: los buses van llenos hasta la puerta.',1.8]]},
 finca:{n:'Finca de café en Tarrazú',ic:'☕',c:5000000,d:[0,0],cos:[3500000,4800000],t:'Cuarenta manzanas de café de altura en Los Santos. Deja plata cada cosecha (cada 14 días).',
  ev:[['-','Llegó la roya a un lote del cafetal. Se perdió parte de la cosecha.',.5],['+','Un comprador de Japón pagó precio de especialidad por tu café.',1.9]]},
 hotel:{n:'Hotelito en Puntarenas',ic:'🏨',c:12000000,d:[560000,780000],req:()=>stat('playa')>0?'':'Primero tenés que conocer Puntarenas.',t:'Doce cuartos frente al Paseo de los Turistas, con piscina y vista al golfo.',
  ev:[['-','Temporada baja. Medio hotel vacío.',.5],['+','Semana Santa: todo lleno, hasta el cuarto de la escoba.',2.3],['-','Se dañó la bomba de la piscina.',.7]]}};
const EMP_LV=[1,1.5,2.3],EMP_UP=[0,.6,1.0];   // ganancia y costo por nivel
function empGan(id){const e=EMP[id],o=MAG().emp[id];if(!o)return 0;const r=e.d,base=r[0]+Math.random()*(r[1]-r[0]);return Math.round(base*EMP_LV[o.lv-1]/50)*50}
function empValor(id){const o=MAG().emp[id];if(!o)return 0;let v=EMP[id].c;for(let l=2;l<=o.lv;l++)v+=EMP[id].c*EMP_UP[l-1];return Math.round(v*.7)}
function empComprar(id){const e=EMP[id],m=MAG();if(m.emp[id])return;const why=e.req&&e.req();if(why)return toast('🔒 '+why);if(S.money<e.c)return toast('Te faltan '+fmtC(e.c-S.money));
  spend(e.c,'Empresas');m.emp[id]={lv:1,ger:0,dia:S.day,tot:0};toast(e.ic+' ¡'+e.n+' es tuya!');if(typeof progRep==='function')progRep(e.c>=1000000?6:3);saveGame()}
function empMejorar(id){const e=EMP[id],o=MAG().emp[id];if(!o||o.lv>=3)return;const c=Math.round(e.c*EMP_UP[o.lv]);if(S.money<c)return toast('Te faltan '+fmtC(c-S.money));spend(c,'Empresas');o.lv++;toast(e.ic+' '+e.n+' ahora es nivel '+o.lv);saveGame()}
function empGerente(id){const o=MAG().emp[id];if(!o)return;o.ger=o.ger?0:1;toast(o.ger?'👔 Contrataste gerente: menos sustos, pero se lleva el 15%':'👔 Despediste al gerente')}
function empVender(id){const m=MAG(),v=empValor(id);if(!m.emp[id])return;delete m.emp[id];earn(v,'Venta de empresas');toast('💼 Vendiste '+EMP[id].n+' en '+fmtC(v))}
// ---------------------------------------------------------------- bienes raíces
const PROPS=['casa_extra3','casa_extra4','casa_sur1','casa_sur2','casa_sur3','casa_sur4','casa_sur5','casa_sur6','casa_sur7','casa_sur8'];
const INQ_N=['la familia Mora','un profe de colegio','dos estudiantes de la UNA','Doña Marjorie y sus gatos','una pareja de recién casados','un señor gringo pensionado','la familia Quesada','un muchacho que trabaja en call center','unos nicas muy trabajadores','una enfermera del Calderón Guardia'];
function propPrecio(id){const b=BMAP[id];return Math.round((380000+(b.w*b.h-36)*9000+hsh(b.x,b.y)*160000)/1000)*1000}
function propValor(id){const o=MAG().prop[id];return o?Math.round(o.val):0}
function propRenta(id){const o=MAG().prop[id];return Math.round(propPrecio(id)*.2*(o&&o.rem?1.4:1)/500)*500}
function propComprar(id){const m=MAG();if(m.prop[id])return;const c=propPrecio(id);if(S.money<c)return toast('Te faltan '+fmtC(c-S.money));spend(c,'Propiedades');m.prop[id]={val:c,inq:null,busca:S.day+1+(Math.random()*3|0),next:0,rem:0,mora:0};
  toast('🏠 Compraste '+propNom(id)+'. Ya le pusiste el rótulo de «SE ALQUILA».');if(typeof progRep==='function')progRep(3);magRedraw();saveGame()}
function propNom(id){const n=PROPS.indexOf(id);return'la casa '+(id.startsWith('casa_sur')?'de la cuadra sur #'+id.slice(-1):'de la esquina #'+(n+1))}
function propRemodelar(id){const o=MAG().prop[id];if(!o||o.rem)return;const c=Math.round(propPrecio(id)*.28/1000)*1000;if(S.money<c)return toast('Te faltan '+fmtC(c-S.money));spend(c,'Propiedades');o.rem=1;o.val+=c*1.25;toast('🛠 Remodelaste '+propNom(id)+': cocina nueva, piso de cerámica y pintura. El alquiler sube 40%.')}
function propVender(id){const m=MAG(),v=propValor(id);if(!m.prop[id])return;delete m.prop[id];earn(v,'Venta de propiedades');toast('🏠 Vendiste '+propNom(id)+' en '+fmtC(v));magRedraw()}
// inversiones grandes fuera del barrio (plusvalía)
const INVS={guana:{n:'Lote en Guanacaste',ic:'🌵',c:1800000,t:'Un lote cerca de la playa. Si llega un hotel grande, vale oro.',vol:.02,mu:.006},
 escazu:{n:'Apartamento en Escazú',ic:'🏙',c:4500000,t:'Un apartamento para alquilar a extranjeros. Sube poco, pero renta ₡650 000 por semana.',vol:.004,mu:.002,renta:650000},
 acciones:{n:'Acciones en la Bolsa Nacional',ic:'📈',c:500000,t:'Sube y baja. A veces mucho, a veces te duele.',vol:.03,mu:.004}};
function invComprar(k){const m=MAG(),d=INVS[k];if(S.money<d.c)return toast('Te faltan '+fmtC(d.c-S.money));spend(d.c,'Inversiones');const o=m.inv[k]||(m.inv[k]={n:0,val:0,next:S.day+7});o.n++;o.val+=d.c;toast(d.ic+' Compraste: '+d.n)}
function invVender(k){const m=MAG(),o=m.inv[k];if(!o||!o.n)return;const v=Math.round(o.val/o.n);o.n--;o.val-=v;earn(v,'Inversiones');toast(INVS[k].ic+' Vendiste por '+fmtC(v));if(!o.n)delete m.inv[k]}
// ---------------------------------------------------------------- patrimonio
const TITULOS=[[0,'Mae del barrio','🧢'],[1000000,'Mae con plata','💵'],[5000000,'Empresario','💼'],[20000000,'Magnate del barrio','🏆'],[100000000,'Magnate de Costa Rica','👑']];
function patrimonio(){if(!S||!S.f||!S.f.pg)return 0;const m=MAG(),p=PGS();let v=S.money;
  const iv=p.inv||{};for(const a of(iv.ahorro||[]))v+=a.m;if(iv.cred)v-=iv.cred.cuota*iv.cred.left;if(iv.presta)v-=iv.presta.debe;
  for(const x of p.veh)if(!x.gone)v+=Math.round(VM[x.m].price*.55*(x.cond/100));
  for(const id in m.emp)v+=empValor(id);for(const id in m.prop)v+=propValor(id);for(const k in m.inv)v+=m.inv[k].val;v+=typeof sodaValor==='function'?sodaValor():0;return Math.round(v)}
function titulo(v){v=v==null?patrimonio():v;let t=TITULOS[0];for(const x of TITULOS)if(v>=x[0])t=x;return t}
// ---------------------------------------------------------------- la noche: empresas, alquileres, plusvalía
function magNight(){const m=S&&S.f&&S.f.pg&&S.f.pg.mag;if(!m)return;let tot=0;const ev=[];
  for(const id in m.emp){const e=EMP[id],o=m.emp[id];let g=empGan(id);
    if(e.sab)g=dow(S.day-1)===5?Math.round((e.sab[0]+Math.random()*(e.sab[1]-e.sab[0]))*EMP_LV[o.lv-1]):0;
    if(e.cos){if(S.day-o.dia>0&&(S.day-o.dia)%14===0)g=Math.round((e.cos[0]+Math.random()*(e.cos[1]-e.cos[0]))*EMP_LV[o.lv-1]);else g=0}
    if(id==='taxi'&&S.f.monaPaz&&o.yuca)g=Math.round(g*1.2);
    if(g&&Math.random()<.12){const x=pick(e.ev);if(x[0]==='-'&&o.ger&&Math.random()<.5){}else{g=Math.round(g*x[2]);ev.push(e.ic+' '+x[1])}}
    if(o.ger)g=Math.round(g*.85);o.tot+=g;tot+=g}
  for(const id in m.prop){const o=m.prop[id];o.val*=1+(.0006+(Math.random()-.5)*.002);
    if(!o.inq&&S.day>=o.busca){o.inq=pick(INQ_N);o.next=S.day+7;ev.push('🏠 '+o.inq[0].toUpperCase()+o.inq.slice(1)+' se pasaron a '+propNom(id)+'.')}
    else if(o.inq&&S.day>=o.next){o.next+=7;const r=Math.random();if(r<.08){o.mora++;ev.push('🏠 '+o.inq[0].toUpperCase()+o.inq.slice(1)+' no pagó esta semana. «Es que no ha caído la quincena».');if(o.mora>=3){ev.push('🏠 Después de tres semanas sin pagar, '+o.inq+' se fue. La casa quedó desocupada.');o.inq=null;o.mora=0;o.busca=S.day+2}}
      else if(r<.13){const c=Math.round(propRenta(id)*.6);tot-=c;ev.push('🏠 Se reventó un tubo en '+propNom(id)+'. Fontanero: '+fmtC(c)+'.')}
      else{tot+=propRenta(id);o.mora=0}}}
  for(const k in m.inv){const d=INVS[k],o=m.inv[k];o.val*=1+d.mu+(Math.random()-.5)*2*d.vol;if(d.renta&&S.day>=o.next){o.next+=7;tot+=d.renta*o.n}}
  if(Math.random()<.04&&m.inv.guana)ev.push('🌵 Rumor: una cadena hotelera anda comprando lotes en Guanacaste. Tu lote subió.'),m.inv.guana.val*=1.15;
  if(tot>0)earn(tot,'Empresas');else if(tot<0)spend(Math.min(S.money,-tot),'Propiedades');m.ayer=tot;
  const tt=titulo();if(!m.tit||TITULOS.findIndex(x=>x[1]===tt[1])>TITULOS.findIndex(x=>x[1]===m.tit)){if(m.tit)ev.push(tt[2]+' ¡Ahora sos «'+tt[1]+'»! Patrimonio: '+fmtC(patrimonio()));if(m.tit&&typeof progRep==='function')progRep(8);m.tit=tt[1]}
  const msgs=[];if(Object.keys(m.emp).length||Object.keys(m.prop).length)msgs.push('💼 Tus negocios y alquileres dejaron '+fmtC(tot)+' hoy');for(const[i,x]of msgs.concat(ev).entries())setTimeout(()=>toast(x),5500+i*2600);
  m.hist.push(patrimonio());if(m.hist.length>30)m.hist.shift()}
hookAfter('ecoDay',function(){try{magNight()}catch(e){console.error(e)}});
// ---------------------------------------------------------------- fundación: ayudar a la comunidad
const FUND={comedor:{n:'Comedor comunitario en El Hoyo',ic:'🍲',c:250000,t:'Almuerzo caliente todos los días para los chiquitos y los abuelitos del Hoyo. Doña Chela lo dirige.',req:()=>S.f.hoyoVisto?'':'Primero conocé El Hoyo.'},
 becas:{n:'Becas para 10 güilas del Hoyo',ic:'🎒',c:300000,t:'Uniformes, cuadernos, zapatos y pases de bus para que diez chiquitos no dejen el colegio.',req:()=>FUN().comedor?'':'Empezá por el comedor.'},
 cancha:{n:'Cancha sintética en El Hoyo',ic:'⚽',c:800000,t:'Cambiar la cancha de tierra por una sintética con luces. Mejengas de noche sin quebrarse un tobillo.',req:()=>FUN().comedor?'':'Empezá por el comedor.'},
 escuela:{n:'Arreglar la escuela del barrio',ic:'🏫',c:450000,t:'Techo nuevo, pupitres, pintura y una sala de computadoras.'},
 adultos:{n:'Hogar de ancianos de San Isidro',ic:'👵',c:350000,t:'Camas nuevas, una cocina industrial y paseos a la playa una vez al año.'}};
function FUN(){const m=MAG();return m.fund}
function fundDonar(k){const f=FUND[k],m=MAG();if(m.fund[k])return;const why=f.req&&f.req();if(why)return toast('🔒 '+why);if(S.money<f.c)return toast('Te faltan '+fmtC(f.c-S.money));spend(f.c,'Donaciones');m.fund[k]=S.day;
  toast(f.ic+' '+f.n+': ¡hecho!');if(typeof progRep==='function')progRep(Math.round(f.c/40000));fundAplicar();
  const msg={comedor:'Mijo, Doña Chela me contó lo del comedor. En la misa el padre dio gracias por usted. Yo me puse a llorar 🙏',becas:'Me dijeron que usted le pagó el colegio a unos güilas del Hoyo. Así se hace, mi amor. Lo que se da, se devuelve.',escuela:'¡La escuela quedó preciosa! Ahí estudiaste vos, ¿te acordás? 🏫',adultos:'Fui a ver a mi tía al hogar de ancianos y no me lo va a creer: tienen camas nuevas gracias a usted.',cancha:'Dice Carlillos que la cancha del Hoyo quedó mejor que la del Saprissa. Bueno, eso dice él 😂'}[k];if(msg&&typeof phQueue==='function')setTimeout(()=>phQueue('mama',msg),3000);
  if(k==='comedor'||k==='cancha')setTimeout(()=>{if(MAPS.hoyo)renderMap(MAPS.hoyo)},100);saveGame()}
function fundAplicar(){const m=S&&S.f&&S.f.pg&&S.f.pg.mag;if(!m)return;
  if(m.fund.comedor){S.f.hoyoPase=1;if(typeof hoyoGateSolid==='function')hoyoGateSolid();const L=['¡Usted es el del comedor! Pase adelante, mop, aquí es bienvenido.','Mi hija almuerza en el comedor todos los días. Dios se lo pague.','Ya no le decimos «el de allá arriba». Ahora es de aquí.'];for(const l of L)if(!HOYO_LINES.includes(l))HOYO_LINES.unshift(l)}
  if(m.fund.becas&&!HOYO_LINES.includes('Mi chamaco va al colegio con zapatos nuevos. ¡Va a ser ingeniero, dice!'))HOYO_LINES.unshift('Mi chamaco va al colegio con zapatos nuevos. ¡Va a ser ingeniero, dice!')}
hookAfter('startGame',function(){try{fundAplicar();disAplicar()}catch(e){console.error(e)}});
{const _h=hdHoyoMap;hdHoyoMap=function(m){const r=_h(m);const f=S&&S.f&&S.f.pg&&S.f.pg.mag&&S.f.pg.mag.fund;if(!f)return r;const g=r.base.getContext('2d');
  if(f.comedor){const o=m.objs.find(o=>o.type==='rancho'&&o.x===10&&o.y===8);if(o){const b=hdBuf(150,22);hdSurSign(b,2,2,146,18,'#2a8f6a','COMEDOR COMUNITARIO','#f4f0e6');g.drawImage(hdToCanvas(b),o.x*HT+8,(o.y+o.h)*HT-60)}}
  if(f.cancha){const o=m.objs.find(o=>o.type==='canchaH');if(o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,b=hdBuf(W,H);for(let j=4;j<H-4;j++)for(let i=4;i<W-4;i++)hdP(b,i,j,((i/24|0)%2)?[58,148,70]:[66,160,78]);
    hdR(b,4,4,W-8,2,[240,240,240]);hdR(b,4,H-6,W-8,2,[240,240,240]);hdR(b,4,4,2,H-8,[240,240,240]);hdR(b,W-6,4,2,H-8,[240,240,240]);hdR(b,W/2-1,4,2,H-8,[240,240,240]);hdEll(b,W/2,H/2,18,18,[240,240,240]);hdEll(b,W/2,H/2,16,16,[62,154,74]);
    for(const x of[4,W-14])hdR(b,x,H/2-18,10,36,[240,240,240]);g.drawImage(hdToCanvas(b),X,Y);for(const[x,y]of[[o.x,o.y],[o.x+o.w-1,o.y]])m.lights.some(l=>l.fund&&l.x===x*T)||m.lights.push({x:x*T,y:y*T,r:80,pole:1,fund:1})}}
  return r}}
// ---------------------------------------------------------------- diseño del barrio (presidente de la Asociación)
const DIS={banca:{n:'Banca de madera',ic:'🪑',c:8000},arbol:{n:'Árbol de almendro',ic:'🌳',c:12000},farol:{n:'Farol de hierro',ic:'🏮',c:15000},maceta:{n:'Jardinera con flores',ic:'🌺',c:5000},
 basurero:{n:'Basurero de reciclaje',ic:'♻️',c:4000},hidrante:{n:'Bebedero de agua',ic:'🚰',c:9000},busto:{n:'Busto tuyo en bronce',ic:'🗿',c:200000,req:()=>titulo()[0]>=20000000?'':'Solo un «Magnate del barrio» se puede dar ese lujo.'}};
function disFrente(){const[tx,ty]=tileOf(P),d=[[0,1],[0,-1],[-1,0],[1,0]][P.dir|0];return[tx+d[0],ty+d[1]]}
function disMotivo(x,y){const m=MAPS.ext;if(P.map!=='ext')return'Solo se puede en el barrio (afuera).';if(x<1||y<1||x>=m.w-1||y>=m.h-1)return'Muy en la orilla.';
  if(m.s[y*m.w+x])return'Ahí ya hay algo.';const t=ti(m,x,y);if(t===1)return'No se puede poner en media calle.';if(![0,2,6,8].includes(t))return'Ese suelo no sirve.';
  if(m.doors.some(d=>Math.abs(d.x-x)+Math.abs(d.y-y)<=1))return'Tapa una puerta.';if(MAG().dis.length>=40)return'Ya hay 40 cosas puestas. Quitá alguna.';return''}
function disAlcanza(m){const W=m.w,H=m.h,seen=new Uint8Array(W*H),q=[[40,21]];seen[21*W+40]=1;for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const k=ny*W+nx;if(seen[k]||m.s[k])continue;seen[k]=1;q.push([nx,ny])}}
  return m.doors.filter(d=>[[0,1],[0,-1],[1,0],[-1,0],[0,0]].some(([a,b])=>seen[(d.y+b)*W+d.x+a])).length}
function disPoner(k){const a=ASO(),d=DIS[k];if(!a.pres)return toast('🔒 Solo el presidente de la Asociación diseña el barrio');const why=d.req&&d.req();if(why)return toast('🔒 '+why);
  const[x,y]=disFrente(),mot=disMotivo(x,y);if(mot)return toast('🚫 '+mot);if(a.f<d.c)return toast('La Asociación no tiene fondos. Donale o hacé un turno.');
  const m=MAPS.ext,antes=disAlcanza(m);m.s[y*m.w+x]=1;if(disAlcanza(m)<antes){m.s[y*m.w+x]=0;return toast('🚫 Eso dejaría una casa o tienda sin paso.')}
  a.f-=d.c;const it={k,x,y};MAG().dis.push(it);disLuz(it);disPintar(it);beep(880,.06,'triangle',.04);toast(d.ic+' '+d.n+' puesto. Fondos: '+fmtC(a.f));if(typeof progRep==='function')progRep(k==='busto'?2:.5);saveGame()}
function disQuitar(){const[x,y]=disFrente(),m=MAG(),i=m.dis.findIndex(d=>d.x===x&&d.y===y);if(i<0)return toast('Enfrente tuyo no hay nada que hayás puesto vos.');const it=m.dis.splice(i,1)[0];
  const mp=MAPS.ext;mp.s[y*mp.w+x]=0;mp.lights=mp.lights.filter(l=>l.dis!==it.x+','+it.y);toast('Quitaste: '+DIS[it.k].n);fadeDo(()=>renderMap(MAPS.ext),null);saveGame()}
function disLuz(it){if(it.k==='farol')MAPS.ext.lights.push({x:it.x*T+8,y:it.y*T,r:58,pole:1,dis:it.x+','+it.y})}
function disAplicar(){const m=MAPS.ext,g=S&&S.f&&S.f.pg&&S.f.pg.mag;if(!m||!g)return;for(const it of g.dis){m.s[it.y*m.w+it.x]=1;if(!m.lights.some(l=>l.dis===it.x+','+it.y))disLuz(it)}}
function disSprite(k,seed){const b=hdBuf(32,48),Y=36;
  if(k==='banca'){hdEll(b,16,Y+5,14,3,[0,0,0],.25);hdR(b,3,Y-8,26,3,[150,100,60]);hdR(b,3,Y-3,26,3,[170,118,72]);for(const x of[5,25])hdR(b,x,Y-8,2,12,[60,56,54])}
  else if(k==='maceta'){hdEll(b,16,Y+4,12,3,[0,0,0],.25);hdR(b,5,Y-6,22,10,[168,90,60]);hdR(b,5,Y-6,22,2,[200,120,84]);for(let i=0;i<9;i++){hdEll(b,7+i*2.2,Y-8-(i%3),3,3,[60,140,60]);hdEll(b,7+i*2.2,Y-10-(i%2)*2,1.6,1.6,[[240,90,120],[250,220,80],[250,250,250]][i%3])}}
  else if(k==='basurero'){hdEll(b,16,Y+4,8,3,[0,0,0],.25);hdR(b,10,Y-12,12,16,[42,143,106]);hdR(b,9,Y-13,14,3,[30,110,80]);hdR(b,13,Y-7,6,5,[240,240,240])}
  else if(k==='hidrante'){hdEll(b,16,Y+4,8,3,[0,0,0],.25);hdR(b,12,Y-14,8,18,[150,154,160]);hdR(b,10,Y-15,12,3,[180,184,190]);hdR(b,19,Y-12,4,2,[120,124,130]);hdEll(b,21,Y-13,2,1,[120,190,240])}
  else if(k==='farol'){hdEll(b,16,Y+4,6,2,[0,0,0],.3);hdR(b,15,Y-34,3,38,[40,40,46]);hdR(b,11,Y-40,11,8,[40,40,46]);hdR(b,12,Y-39,9,6,[255,226,150]);hdR(b,13,Y-2,7,3,[40,40,46])}
  else if(k==='busto'){hdEll(b,16,Y+4,12,3,[0,0,0],.3);hdR(b,8,Y-10,16,14,[200,196,186]);hdR(b,7,Y-12,18,3,[220,216,206]);hdEll(b,16,Y-17,6,5,[150,110,60]);hdEll(b,16,Y-24,4.5,5,[170,126,70]);hdEll(b,15,Y-25,1.4,1.4,[120,86,44]);hdText(b,10,Y-5,'ALEX',[90,80,70])}
  else if(k==='arbol')hdEll(b,16,Y+3,14,5,[0,0,0],.25);
  return hdToCanvas(b)}
function disPintar(it){const m=MAPS.ext;if(!m.base2)return;const g=m.base2.getContext('2d');g.imageSmoothingEnabled=false;const X=it.x*HT,Y=it.y*HT;
  if(it.k==='arbol'){g.drawImage(disSprite('arbol'),X,Y-16);if(m.top2){const sp=hdTreeSprite(it.x*31+it.y*7,0,.6,false);m.top2.getContext('2d').drawImage(hdToCanvas(sp.c),X+16-sp.ax,Y+30-sp.ay)}}
  else if(it.k==='farol'){g.drawImage(disSprite('farol'),X,Y-16);if(m.top2){const t=m.top2.getContext('2d'),c=disSprite('farol');t.drawImage(c,0,0,32,24,X,Y-16,32,24)}}
  else g.drawImage(disSprite(it.k),X,Y-16)}
// plaquitas en las casas propias + lo diseñado, cada vez que se repinta el barrio
{const _r=renderMapHD;renderMapHD=function(m){const r=_r(m);if(m&&m.id==='ext'&&HD_ON&&m.base2&&S&&S.f&&S.f.pg&&S.f.pg.mag){const g=m.base2.getContext('2d'),mg=S.f.pg.mag;
  for(const id in mg.prop){const b=BMAP[id];if(!b)continue;const o=mg.prop[id],X=(b.dx+1)*HT+4,Y=(b.dy+1)*HT-30,s=hdBuf(56,40);hdR(s,26,14,3,26,[110,90,70]);hdSurSign(s,2,0,52,16,o.inq?'#2a8f6a':'#c0473b',o.inq?'ALQUILADA':'SE ALQUILA','#f4f0e6');g.drawImage(hdToCanvas(s),X,Y)}
  for(const it of mg.dis)disPintar(it)}return r}}
function magRedraw(){if(MAPS.ext&&HD_ON)setTimeout(()=>renderMap(MAPS.ext),30)}
// ---------------------------------------------------------------- apps
const fmtMil=v=>v>=1e6?'₡'+(v/1e6).toFixed(v>=1e7?0:1).replace('.',',')+' millones':fmtC(v);
appReg({id:'emp',n:'Empresas',ic:'🏢',c:'#2d3a6e',html(){const m=MAG();let h=`<div class="qitem"><b>💼 Ayer tus negocios dejaron ${fmtC(m.ayer||0)}</b><p class="note">Las ganancias caen cada noche. Un gerente evita la mitad de los sustos, pero cobra 15%.</p></div>`;
  for(const[id,e]of Object.entries(EMP)){const o=m.emp[id],why=!o&&e.req&&e.req();h+=`<div class="qitem"><b>${e.ic} ${e.n}${o?' · nivel '+o.lv:''}</b><p>${e.t}</p>`;
    if(o){h+=`<p class="note">Lleva ${fmtC(o.tot)} de ganancia · ${o.ger?'con gerente':'sin gerente'}${id==='taxi'&&o.yuca?' · lo maneja Don Alexander de día':''} · vale ${fmtC(empValor(id))}</p><div class="row">${o.lv<3?`<button data-act="up:${id}">Mejorar (${fmtMil(Math.round(e.c*EMP_UP[o.lv]))})</button> `:''}<button class="alt" data-act="ger:${id}">${o.ger?'Despedir gerente':'Contratar gerente'}</button> ${id==='taxi'&&S.f.monaPaz&&!o.yuca?`<button class="green" data-act="yuca:${id}">Que lo maneje Don Alexander</button> `:''}<button class="alt" data-act="ven:${id}">Vender</button></div>`}
    else h+=why?`<p class="note">🔒 ${why}</p>`:`<button class="green" data-act="buy:${id}" ${S.money<e.c?'disabled':''}>Comprar · ${fmtMil(e.c)}</button>`;h+='</div>'}return h},
 act(a,id){if(a==='buy')empComprar(id);else if(a==='up')empMejorar(id);else if(a==='ger')empGerente(id);else if(a==='ven')empVender(id);
  else if(a==='yuca'){MAG().emp.taxi.yuca=1;closePanel();say('papa','¿Que yo maneje su taxi? …De día, ¿verdad? De noche no.');say('papa','Treinta años manejando y quince sin tocar un volante. Diay… vamos a ver si todavía me acuerdo. Gracias, muchacho.');relAdd('op',1);runDialog();return}
  saveGame();appOpen('emp')}});
appReg({id:'prop',n:'Bienes raíces',ic:'🏘',c:'#b07a52',html(){const m=MAG();let h='<p class="note">Comprá casas del barrio, alquilalas por semana y remodelalas para cobrar más. Las casas suben de valor con el tiempo.</p><h3>Casas en venta en el barrio</h3>';
  for(const id of PROPS){const o=m.prop[id],c=propPrecio(id);h+=`<div class="qitem"><b>🏠 ${propNom(id)[0].toUpperCase()+propNom(id).slice(1)}</b>`;
    if(o)h+=`<p>${o.inq?'Inquilinos: '+o.inq+' · ':'Desocupada · '}alquiler ${fmtC(propRenta(id))}/semana${o.rem?' · remodelada':''} · vale ${fmtC(propValor(id))}</p><div class="row">${o.rem?'':`<button data-act="rem:${id}">Remodelar (${fmtC(Math.round(c*.28/1000)*1000)})</button> `}<button class="alt" data-act="ven:${id}">Vender</button></div>`;
    else h+=`<p>Alquiler esperado: ${fmtC(propRenta(id))} por semana.</p><button class="green" data-act="buy:${id}" ${S.money<c?'disabled':''}>Comprar · ${fmtC(c)}</button>`;h+='</div>'}
  h+='<h3>Inversiones grandes</h3>'+Object.entries(INVS).map(([k,d])=>{const o=m.inv[k];return`<div class="qitem"><b>${d.ic} ${d.n}${o?' ×'+o.n:''}</b><p>${d.t}</p>${o?`<p class="note">Vale ${fmtMil(Math.round(o.val))} (pagaste ${fmtMil(d.c*o.n)})</p>`:''}<div class="row"><button class="green" data-act="ibuy:${k}" ${S.money<d.c?'disabled':''}>Comprar · ${fmtMil(d.c)}</button>${o?` <button class="alt" data-act="isell:${k}">Vender uno</button>`:''}</div></div>`}).join('');return h},
 act(a,id){if(a==='buy')propComprar(id);else if(a==='rem')propRemodelar(id);else if(a==='ven')propVender(id);else if(a==='ibuy')invComprar(id);else if(a==='isell')invVender(id);saveGame();appOpen('prop')}});
appReg({id:'patri',n:'Patrimonio',ic:'👑',c:'#e2b33a',html(){const v=patrimonio(),t=titulo(v),i=TITULOS.indexOf(t),nx=TITULOS[i+1],m=MAG(),hs=m.hist.length?m.hist:[v],mx=Math.max(...hs,1),mn=Math.min(...hs,0);
  let h=`<div class="qitem"><b>${t[2]} ${t[1]}</b><p style="font-size:20px;margin:4px 0"><b>${fmtMil(v)}</b></p>${nx?`<div class="eco-bar"><i style="width:${Math.round(Math.min(1,(v-t[0])/(nx[0]-t[0]))*100)}%"></i></div><p class="note">Para «${nx[1]}» te faltan ${fmtMil(nx[0]-v)}.</p>`:'<p class="note">Más arriba ya no hay. Sos leyenda.</p>'}</div>`;
  h+=`<div class="qitem"><b>📈 Últimos ${hs.length} días</b><svg viewBox="0 0 300 70" style="width:100%;height:70px"><polyline fill="none" stroke="#f2c94c" stroke-width="2.5" points="${hs.map((x,j)=>Math.round(j/(Math.max(1,hs.length-1))*296+2)+','+Math.round(66-(x-mn)/(mx-mn||1)*60)).join(' ')}"/></svg></div>`;
  const p=PGS(),rows=[['💵 Efectivo',S.money],['🚗 Vehículos',p.veh.filter(x=>!x.gone).reduce((s,x)=>s+Math.round(VM[x.m].price*.55*x.cond/100),0)],['🏢 Empresas',Object.keys(m.emp).reduce((s,id)=>s+empValor(id),0)+(typeof sodaValor==='function'?sodaValor():0)],['🏘 Propiedades',Object.keys(m.prop).reduce((s,id)=>s+propValor(id),0)],['📈 Inversiones',Object.values(m.inv).reduce((s,o)=>s+o.val,0)]];
  h+='<div class="qitem">'+rows.map(r=>`<p style="display:flex;justify-content:space-between;margin:3px 0"><span>${r[0]}</span><b>${fmtMil(Math.round(r[1]))}</b></p>`).join('')+'</div>';return h}});
appReg({id:'fund',n:'Fundación',ic:'💚',c:'#3fa66b',html(){const m=MAG();return'<p class="note">Lo que el barrio te dio, devolvelo. Cada obra sube tu respeto y cambia la vida de alguien.</p>'+Object.entries(FUND).map(([k,f])=>{const d=m.fund[k],why=!d&&f.req&&f.req();
  return`<div class="qitem"><b>${f.ic} ${f.n}${d?' ✔':''}</b><p>${f.t}</p>${d?`<p class="note">Hecho el día ${d}.</p>`:why?`<p class="note">🔒 ${why}</p>`:`<button class="green" data-act="don:${k}" ${S.money<f.c?'disabled':''}>Donar ${fmtMil(f.c)}</button>`}</div>`}).join('')},
 act(a,k){if(a==='don')fundDonar(k);appOpen('fund')}});
appReg({id:'dis',n:'Diseño del barrio',ic:'📐',c:'#7d3c86',html(){const a=ASO();if(!a.pres)return'<div class="qitem"><b>📐 Diseño del barrio</b><p>Solo el presidente de la Asociación de Vecinos decide qué se pone en las calles y la plaza.</p><p class="note">🔒 Ganá la presidencia en la app Asociación (necesitás ser «Mae importante»).</p></div>';
  const[x,y]=disFrente(),mot=disMotivo(x,y),ya=MAG().dis.find(d=>d.x===x&&d.y===y);
  let h=`<div class="qitem"><b>📍 Enfrente tuyo: ${ya?DIS[ya.k].n:mot?'🚫 '+mot:'✔ espacio libre'}</b><p class="note">Caminá hasta donde querés poner algo, mirá hacia ese lugar y abrí esta app. Se paga con los fondos de la Asociación (${fmtC(a.f)}). Llevás ${MAG().dis.length}/40.</p>${ya?'<button class="alt" data-act="quitar">Quitarlo</button>':''}</div>`;
  h+=Object.entries(DIS).map(([k,d])=>{const why=d.req&&d.req();return`<div class="qitem row" style="justify-content:space-between;align-items:center"><b>${d.ic} ${d.n} · ${fmtC(d.c)}</b>${why?`<span class="note">🔒</span>`:`<button data-act="pon:${k}" ${mot||a.f<d.c?'disabled':''}>Poner aquí</button>`}</div>`}).join('');return h},
 act(a,k){if(a==='pon'){disPoner(k);closePanel();return}if(a==='quitar'){disQuitar();closePanel();return}}});
// ---------------------------------------------------------------- logros y metas
LOGROS.push(['emp1','🏢','Emprendedor','Comprá tu primera empresa.',()=>Object.keys(MAG().emp).length>0,3],['emp5','💼','Grupo empresarial','Tené 5 empresas a la vez.',()=>Object.keys(MAG().emp).length>=5,8],
 ['casero3','🏘','Casero del barrio','Tené 3 casas alquiladas.',()=>Object.values(MAG().prop).filter(o=>o.inq).length>=3,6],['millonario','💵','Mae con plata','Llegá a ₡1 millón de patrimonio.',()=>patrimonio()>=1e6,4],
 ['magnate','🏆','Magnate del barrio','Llegá a ₡20 millones de patrimonio.',()=>patrimonio()>=2e7,10],['magnatecr','👑','Magnate de Costa Rica','Llegá a ₡100 millones de patrimonio.',()=>patrimonio()>=1e8,20],
 ['comedor','🍲','El del comedor','Abrí el comedor comunitario del Hoyo.',()=>!!MAG().fund.comedor,6],['fund5','💚','Corazón de oro','Completá todas las obras de la fundación.',()=>Object.keys(FUND).every(k=>MAG().fund[k]),12],
 ['disenador','📐','Urbanista','Poné 10 cosas en el barrio como presidente.',()=>MAG().dis.length>=10,5]);
hookFilter('metas',function(out){const v=patrimonio(),t=titulo(v),nx=TITULOS[TITULOS.indexOf(t)+1],m=MAG();
  if(NEG().soda&&!Object.keys(m.emp).length)out.unshift({ic:'🏢',t:'Tu primera empresa',d:'Con la soda andando, ya podés invertir: Empresas en el celular (empanadas, feria, lavacar, taxi…).',pr:S.money/25000});
  else if(nx&&Object.keys(m.emp).length)out.unshift({ic:nx[2],t:'Ser «'+nx[1]+'»',d:'Patrimonio: '+fmtMil(v)+' de '+fmtMil(nx[0])+'. Comprá casas para alquilar y mejorá tus empresas.',pr:(v-t[0])/(nx[0]-t[0])});
  return out.slice(0,6)});
