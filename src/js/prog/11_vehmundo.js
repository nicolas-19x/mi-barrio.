// ================= PROGRESO · VEHÍCULOS EN EL MUNDO =================
// Comprar, echar gasolina, el taller de Carlillos, manejar a Chepe, retenes, trámites (COSEVI, RTV,
// marchamo, INS), robos de noche, crédito de la agencia, choques y el trabajo de repartidor.
function vMotorNear(r){const rv=riding();if(rv&&VM[rv.m].motor)return rv;const v=nearVeh();if(v&&VM[v.m].motor&&Math.hypot(v.x-P.x,v.y-P.y)<(r||60))return v;const p=S&&S.f&&S.f.pg;if(!p)return null;
  for(const x of p.veh)if(!x.gone&&x.map===P.map&&VM[x.m].motor&&Math.hypot(x.x-P.x,x.y-P.y)<(r||60))return x;return null}
function anyVehNear(r){const v=riding();if(v)return v;const p=S&&S.f&&S.f.pg;if(!p)return null;for(const x of p.veh)if(!x.gone&&x.map===P.map&&Math.hypot(x.x-P.x,x.y-P.y)<(r||60))return x;return null}
// ---------------------------------------------------------------- comprar
function vBuy(m,how,price,extra){const c=VM[m];if(S.money<price){toast('Te faltan '+fmtC(price-S.money));return null}spend(price,'Vehículos');const v=vAdd(m,extra);
  if(how==='entrega'){toast(c.ic+' ¡'+c.n+' comprada! Te la dejaron frente a tu casa.')}PGS().stats.vehBuys=(PGS().stats.vehBuys||0)+1;if(typeof progRep==='function')progRep(4,'Compraste '+c.n);saveGame();return v}
function mkListings(){const p=PGS();if(p.mk&&p.mk.day===S.day)return p.mk.l;const r=(a,b)=>a+Math.round(Math.random()*(b-a)/500)*500;
  const sellers=['Don Rigo (Desamparados)','Kendall, Alajuela','La niña Yuli','Mauricio «el Chele»','Doña Teresa de Moravia','Un mae de Pavas'],l=[];
  l.push({m:'bici',price:r(14000,22000),cond:r(55,90),txt:'Vendo bici montañera, poco uso, solo le falta aire a las llantas. Negociable 🙏',who:pick(sellers)});
  l.push({m:'moto_u',price:r(62000,88000),cond:r(45,85),txt:'Moto 125 al día, marchamo y RTV pagados. Gasta poquísimo. Ocupo la plata 😔',who:pick(sellers)});
  if(Math.random()<.6)l.push({m:'carro',price:r(240000,320000),cond:r(40,80),txt:'Corollita 96, un tanque de guerra. Aire no tiene, pero las ventanas bajan. Recibo moto como parte de pago.',who:pick(sellers)});
  if(Math.random()<.4)l.push({m:'bici_r',price:r(30000,42000),cond:r(70,95),txt:'Bici de ruta, liviana, para ir a la UCR en 10 minutos. Precio fijo.',who:pick(sellers)});
  p.mk={day:S.day,l};return l}
// ---------------------------------------------------------------- gasolinera
function bombaTalk(){const v=vMotorNear(90);if(!v){say(pistero(),pick(['¿Qué tal, joven? Aquí vendemos gasolina… pero usted viene a pata. ¿Le vendo un fresco?','Pura vida. Cuando tenga moto o carro, aquí le llenamos el tanque.']),[{t:'Comprar un fresco (₡700)',f(){if(S.money<700)return say(null,'No te alcanza.');spend(700,'Antojos');enAdd(5);toast('🥤 +5⚡')}},{t:'Nada, gracias'}]);return}
  const c=VM[v.m],need=Math.max(0,1-v.gas),L=Math.round(need*c.tank*10)/10,full=Math.round(L*GAS_L/50)*50;
  const pist=pistero();
  if(L<.2){say(pist,'Joven, ese tanque está lleno. ¿Le reviso el aire de las llantas? Es gratis.',[{t:'Sí, porfa',f(){v.cond=Math.min(100,v.cond+2);say(pist,'Listo, como nuevas. Pura vida.')}},{t:'No, gracias'}]);return}
  say(pist,pick(['¿Lleno o cuánto le echo, joven?','Buenas, ¿súper o regular? Bueno, aquí todo es súper. ¿Cuánto le pongo?']),[
    {t:'Llenar el tanque ('+L+' L · '+fmtC(full)+')',f(){fillGas(v,1,full)}},
    {t:'Echarle ₡5 000',f(){fillGas(v,Math.min(1,v.gas+5000/GAS_L/c.tank),5000)}},
    {t:'Echarle ₡2 000',f(){fillGas(v,Math.min(1,v.gas+2000/GAS_L/c.tank),2000)}},{t:'Nada'}])}
function fillGas(v,to,cost){if(S.money<cost){say(null,'No te alcanza. Te faltan '+fmtC(cost-S.money)+'.');return}spend(cost,'Gasolina');v.gas=to;if(v.push&&!v.varado){v.push=0;if(riding()===v)engineOn(v)}beep(300,.4,'sawtooth',.01,200);
  say(pistero(),pick(['Listo, mae. ¿Le limpio el parabrisas? Ah no, es moto. Jaja.','Ahí está. Con eso llega a Cartago y se devuelve. Bueno, casi.','Pura vida. Maneje con cuidado, que la Calle 3 tiene huecos de leyenda.']))}
// ---------------------------------------------------------------- taller de Carlillos
function tallerTalk(){const kv=N('kevin');if(!S.f.kevinHelp){say(null,'El local está cerrado. En la cortina dice «SE ALQUILA» y alguien pintó «KVN» con spray.');say(null,'Tal vez '+kv+' tenga planes con este local… si lo ayudás con lo suyo.');return}
  const v=anyVehNear(110),p=PGS(),ch=[];
  if(v){const c=VM[v.m],miss=100-v.cond,cost=Math.round((c.k==='bici'?40:c.motor&&c.k==='moto'?160:320)*miss/50)*50;
    if(miss>3)ch.push({t:'Arreglar la '+(c.k==='bici'?'bici':c.k==='moto'?'moto':'máquina')+' ('+fmtC(cost)+' · queda al 100%)',f(){if(S.money<cost)return say(CH.kevin,'Diay, mae, no le alcanza. Venga cuando tenga, aquí no fío… bueno, a usted un poquito sí.');spend(cost,'Taller');fadeDo(()=>{passTime(c.k==='bici'?40:120);v.cond=100;v.varado=0;v.push=0},()=>{say(CH.kevin,pick(['Quedó como nueva. Bueno, como nueva no, pero anda. Mi abuelo diría que hasta suena bonito.','Le cambié una pieza que estaba hecha leña. Ahora sí, a darle.']));runDialog()})}});
    if(c.motor)ch.push({t:'Cambio de aceite (₡4 500 · +15%)',f(){if(S.money<4500)return say(null,'No te alcanza.');spend(4500,'Taller');v.cond=Math.min(100,v.cond+15);say(CH.kevin,'Aceite nuevo, mae. Eso alarga la vida del motor más que rezar.')}});
    ch.push({t:'Pintarla de otro color (₡'+(c.k==='bici'?'6 000':'15 000')+')',f(){afterD(()=>paintMenu(v,c.k==='bici'?6000:15000))}})}
  if(!p.veh.some(x=>x.m==='moto_u'&&x.fromK)&&!p.kSold)ch.push({t:'Ver la moto que '+kv+' tiene a la venta',f(){say(CH.kevin,'Es una Toro 125 que le compré a un señor de Desamparados. Le hice todo: frenos, cadena, carburador. Se la dejo en ₡60 000, papeles al día. A otro se la vendo en ochenta.',[{t:'Comprarla (₡60 000)',f(){const nv=vBuy('moto_u','taller',60000,{map:'ext',x:41.5*T,y:60*T+10,dir:0,cond:92,gas:.5,fromK:1});if(nv){p.kSold=1;say(CH.kevin,'¡Eso, mae! Cuídemela. Y póngase casco, que la cabeza no tiene repuesto.')}}},{t:'Ahorita no'}])}});
  ch.push({t:'Solo saludar'});
  say(CH.kevin||null,v?pick(['¡Mae! ¿Qué le pasó a esa '+(VM[v.m].k==='bici'?'bici':'máquina')+'? Déjeme ver…','Diay, ¿qué ocupa? Aquí se arregla de todo menos el corazón.']):'Bienvenido al Taller El Abuelo, mae. Traiga la bici o la moto y se la dejo como nueva.',ch)}
function paintMenu(v,cost){const cols=[['Rojo','#c0473b'],['Azul','#2a6fb0'],['Negro','#2a2a30'],['Blanco','#e8e8e6'],['Verde','#2a8f6a'],['Amarillo','#e2b33a']];
  say(CH.kevin,'¿De qué color la quiere?',cols.slice(0,4).map(([n,c])=>({t:n,f(){if(S.money<cost)return say(null,'No te alcanza.');spend(cost,'Taller');v.col=c;VSP.clear();say(CH.kevin,'Quedó tuanis, mae. Ahora sí la reconocen en todo el barrio.')}})))}
// ---------------------------------------------------------------- manejar a Chepe (y de vuelta)
function driveTrip(to){const v=riding();if(!v)return;const c=VM[v.m];
  if(!c.motor){const e=E();if(e.en<40){say(null,'En bici hasta Chepe son como dos horas de subidas. Con esa energía no llegás ni a la esquina.');return}}
  if(c.motor&&v.gas<.16){say(null,'Con esa gasolina no llegás. Echale en el servicentro de la Calle 3.');return}
  const from=P.map;fadeDo(()=>{const mins=c.motor?rnd(22,34):rnd(95,125);passTime(Math.round(mins));if(c.motor)v.gas=Math.max(0,v.gas-(c.k==='moto'?.16:.12));else E().en-=35;v.cond=Math.max(0,v.cond-3);v.km+=9000;
    if(to==='chepe'){ensureMap('chepe');P.map='chepe';P.x=3*T+8;P.y=12*T+12;P.dir=3}else{P.map='ext';P.x=2*T+8;P.y=21*T+8;P.dir=3}v.map=P.map;v.x=P.x;v.y=P.y;CARS=[];CBUS=null},
   ()=>{DQ=[];const ev=[];
    if(!c.motor)say(null,'Llegás a '+(to==='chepe'?'Chepe':'el barrio')+' sudado como pollo en bolsa, pero con las piernas de acero. −35⚡');
    else{const r=Math.random();if(r<.25)say(null,'La General Cañas estaba hecha un parqueo. Pura presa. Hasta un vendedor de copos pasó más rápido que vos.');else if(r<.4){say(null,'¡PUM! Te comiste un hueco del tamaño de una piscina. La '+(c.k==='moto'?'moto':'máquina')+' sonó feo.');v.cond=Math.max(0,v.cond-8)}else if(r<.5&&S.rain)say(null,'Aguacero de la tarde en plena autopista. Llegás empapado hasta los calzones.');else say(null,pick(['Viaje tranquilo. Un motorizado te pasó haciendo zigzag entre los carros. Típico.','Por la radio sonaba «Pura vida» y el sol te pegaba de frente. Buen viaje.']))}
    if(to==='chepe'&&c.motor&&Math.random()<.32)afterD(()=>reten(v,'chepe'));runDialog()})}
// ---------------------------------------------------------------- retén de Tránsito
function vPapeles(v){const p=PGS(),c=VM[v.m],out=[];if(c.lic&&!p.lic[c.lic])out.push('lic');if(c.motor&&(p.mar[v.id]||0)<S.day)out.push('mar');if(c.motor&&(p.rtv[v.id]||0)<S.day)out.push('rtv');if(c.hot)out.push('hot');return out}
function reten(v,where){const p=PGS(),c=VM[v.m],mal=vPapeles(v);const of=fillChar({id:'z_transito',name:'Oficial de Tránsito',hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#2d3a6e',pants:'#2a2a30',acc:'gorra',accColor:'#2d3a6e',v:1});
  say(null,'🚔 ¡Retén! Un oficial de Tránsito te hace señas con la linterna para que te orillés.');say(of,'Buenas, joven. Licencia, marchamo y la RTV, por favor.');
  if(!mal.length){say(of,'Todo en orden. Siga con cuidado. Y use las direccionales, que no son de adorno.');if(typeof progRep==='function')progRep(1);return}
  let multa=0;const lines=[];if(mal.includes('lic')){multa+=20000;lines.push('manejar sin licencia')}if(mal.includes('mar')){multa+=15000;lines.push('marchamo vencido')}if(mal.includes('rtv')){multa+=8000;lines.push('RTV vencida')}
  if(mal.includes('hot')){say(of,'Mmm… este número de chasis está reportado como robado. Joven, bájese de la moto.');say(null,'Te tienen media hora en la patrulla mientras confirman. La moto se la lleva la grúa: era robada y la vas a perder.');
    v.gone=1;if(p.ride===v.id){p.ride=null;engineOff()}multa+=10000;passTime(90);say(of,'Usted tiene suerte de que le creamos que no sabía. La próxima, compre con papeles. Multa de '+fmtC(10000)+'.');}
  else{say(of,'Usted anda con '+lines.join(', ')+'. Le tengo que hacer el parte: '+fmtC(multa)+'.');
    if(mal.includes('lic')||mal.includes('mar')){say(of,'Y el vehículo se va para el depósito hasta que pague. Lo puede sacar por el celular, en la app de COSEVI.');v.dep=1;if(p.ride===v.id){p.ride=null;engineOff()}v.map='__dep'}}
  p.tram.push({k:'multa',n:'Multa de Tránsito ('+(lines.join(', ')||'moto robada')+')',amt:multa,day:S.day});toast('🧾 Multa: '+fmtC(multa)+' (pagala en COSEVI)');
  if(phOn('mama'))phQueue('mama','Mijo, ¿cómo así que lo paró Tránsito? 😠 Ponga los papeles al día, que una multa de esas es un clavo.',4)}
// ---------------------------------------------------------------- choque con el tránsito de Chepe
function progOnHit(c){const v=riding();if(!v)return false;const k=VM[v.m].k;TRAF.hitCD=30;BUBS=[];c.sp=0;c.wait=-6;beep(1000,.3,'sawtooth',.03,220);setTimeout(()=>beep(80,.3,'square',.06),160);
  if(k==='bici'||k==='moto'){v.cond=Math.max(0,v.cond-(k==='bici'?25:40));progDismount(true);return false}   // se cae: sigue la escena del atropello
  mode='dialog';v.cond=Math.max(0,v.cond-30);const seg=PGS().seg[v.id],cost=seg?10000:45000;
  setTimeout(()=>{DQ=[];say(null,'¡CRASH! Un '+({taxi:'taxi',car:'carro',pickup:'pickup',moto:'motorizado',bus:'bus'}[c.type])+' y tu '+(k==='pickup'?'pickup':'carro')+' se besan en plena Avenida Segunda. Nadie salió herido, pero los dos carros sí.');
    say(fillChar({id:'z_chofer',name:'El otro chofer',hair:'corto',hairColor:'#2a1810',skin:'#b97a4a',shirt:'#5b7fa6',pants:'#2d3346',v:1}),pick(['¡Diay, mae! ¿Usted no ve o qué? ¡Me hizo leña la puerta!','¡Pa\' qué sirven los espejos, joven! ¡No se mueva que ya llamé al INS!']));
    say(null,seg?'Llega el inspector del INS en una moto blanca. Como tenés seguro, solo pagás el deducible: '+fmtC(cost)+'.':'Llega el inspector del INS. Sin seguro, toca pagar el arreglo del otro: '+fmtC(cost)+'. Duele en el alma.');
    AFTER.push(()=>{const pay=Math.min(cost,Math.max(0,S.money));if(pay)spend(pay,'Choques');if(pay<cost)PGS().tram.push({k:'deuda',n:'Arreglo del choque (debés)',amt:cost-pay,day:S.day});passTime(70);saveGame()});runDialog()},500);return true}
{const _h=carHit;carHit=function(c){if(typeof progOnHit==='function'&&progOnHit(c))return;return _h(c)}}
// ---------------------------------------------------------------- de noche: robos, cuotas, vencimientos
function vSafe(v){const atHome=v.map==='ext'&&Math.hypot(v.x-HOME_PARK.x,v.y-HOME_PARK.y)<60;const coch=typeof U==='function'&&U('cochera');
  if(atHome&&coch)return 0;let r={bici:.22,moto:.14,carro:.07,pickup:.07}[VM[v.m].k];if(atHome)r=U('verja')?r*.15:r*.35;if(v.map==='hoyo')r*=2.4;if(v.map==='chepe')r*=1.6;if(VM[v.m].k==='bici'&&PGS().candado)r*=.3;return r}
function progNight(){const p=S&&S.f&&S.f.pg;if(!p)return;
  for(const v of p.veh){if(v.gone||v.dep||v.id===p.ride)continue;if(Math.random()<vSafe(v)){v.gone=1;const c=VM[v.m];const seg=p.seg[v.id];const back=seg?Math.round(c.price*.7):0;if(back)earn(back,'Seguro INS');
      toast('🚨 ¡Se robaron tu '+c.n+'!'+(back?' El INS te devolvió '+fmtC(back)+'.':''));if(phOn('mama'))phQueue('mama','Mijo 😢 la vecina dice que vio unos carajillos llevándose su '+(c.k==='bici'?'bici':'moto')+' anoche. Para la otra déjela adentro o compre candado.',3);if(typeof progStat==='function')progStat('robos')}}
  for(const cr of p.cred){if(cr.left<=0)continue;if(S.day>=cr.next){cr.next=S.day+7;if(S.money>=cr.cuota){spend(cr.cuota,'Cuotas');cr.left--;toast('🏦 Cuota del crédito: '+fmtC(cr.cuota)+' ('+cr.left+' restantes)')}else{cr.mora=(cr.mora||0)+1;toast('⚠️ No te alcanzó para la cuota del crédito. Mora '+cr.mora+'/3');
      if(cr.mora>=3){const v=vOf(cr.v);if(v){v.gone=1;if(p.ride===v.id){p.ride=null;engineOff()}}cr.left=0;toast('🏦 La agencia te quitó el vehículo por no pagar las cuotas.')}}}}
  for(const v of p.veh){if(v.gone||!VM[v.m].motor)continue;if((p.mar[v.id]||0)===S.day)toast('🧾 Hoy vence el marchamo de '+VM[v.m].n);if((p.rtv[v.id]||0)===S.day)toast('🔧 Hoy vence la RTV de '+VM[v.m].n)}
  for(const[id,on]of Object.entries(p.seg))if(on){const v=vOf(id);if(!v||v.gone){delete p.seg[id];continue}if(S.day%7===0){const amt=VM[v.m].k==='bici'?800:VM[v.m].k==='moto'?2500:5000;if(S.money>=amt)spend(amt,'Seguro INS');else{delete p.seg[id];toast('⚠️ Se canceló el seguro del INS por falta de pago')}}}}
hookAfter('ecoDay',function(){try{progNight()}catch(e){console.error(e)}});
// ---------------------------------------------------------------- puntos de interacción en el mapa
function pistero(){return PISTERO||(PISTERO=fillChar({id:'z_pistero',name:'Mainor, el pistero',hair:'corto',hairColor:'#1c1c1c',skin:'#b97a4a',shirt:'#c0473b',pants:'#2d3346',acc:'gorra',accColor:'#c0473b',v:1}))}
var PISTERO=null;
ACT_POINTS.push(
 {map:'ext',x:64,y:59,label:'Bomba · echar gasolina',run:bombaTalk},{map:'ext',x:67,y:59,label:'Bomba · echar gasolina',run:bombaTalk},
 {map:'ext',x:69,y:57,label:'Mini súper del servicentro',run(){say(fillChar({id:'z_cajera',name:'Cajera del súper',hair:'cola',hairColor:'#2b1a10',skin:'#e0ac69',shirt:'#c0473b',pants:'#2d3346',v:1}),'Buenas, ¿qué se le ofrece? Tenemos galones para gasolina, candados y meneítos.',[
   {t:'Candado para bici (₡3 500)',f(){if(PGS().candado)return say(null,'Ya tenés uno.');if(S.money<3500)return say(null,'No te alcanza.');spend(3500,'Vehículos');PGS().candado=1;toast('🔒 Candado: tu bici se roban mucho menos')}},
   {t:'Galón de gasolina (₡3 200)',f(){const v=anyVehNear(400)||PGS().veh.find(x=>!x.gone&&VM[x.m].motor);if(!v)return say(null,'No tenés nada que echarle.');if(S.money<3200)return say(null,'No te alcanza.');spend(3200,'Gasolina');v.gas=Math.min(1,v.gas+3.8/VM[v.m].tank);if(v.push&&!v.varado)v.push=0;toast('⛽ +'+Math.round(3.8/VM[v.m].tank*100)+'%')}},
   {t:'Un meneíto (₡400)',f(){if(S.money<400)return;spend(400,'Antojos');enAdd(3)}},{t:'Nada'}])}},
 {map:'ext',x:41,y:59,label:'Taller El Abuelo',run:tallerTalk},
 {map:'ext',x:1,y:21,label:'Tomar la carretera a San José',cond:()=>!!riding()&&!riding().push,run:()=>driveTrip('chepe')},
 {map:'chepe',x:1,y:10,label:'Manejar de vuelta al barrio',cond:()=>!!riding()&&!riding().push,run:()=>driveTrip('ext')});
function progMotosHoyo(e){const p=PGS();say(e.c,'Mop, aquí tengo motos a precio de amigo. Esta azul se la dejo en ₡32 000. Papeles… bueno, papeles se consiguen. ¿Qué dice?',[
  {t:'Comprarla (₡32 000)',f(){const v=vBuy('moto_h','hoyo',32000,{map:'hoyo',x:38*T,y:14*T+8,dir:3,cond:70,gas:.3});if(v){say(e.c,'Ahí está. Si alguien pregunta, usted no me conoce.');setTimeout(()=>toast('📱 '+N('kevin')+': «Mae, ¿le compró al Chino? 😬 Cuidado con los retenes»'),4000)}}},
  {t:'«¿Y si es robada?»',f(){say(e.c,'¿Robada? Ay, mop, qué feo pensar así. Digamos que… cambió de dueño rápido.')}},{t:'No, gracias'}])}
// ---------------------------------------------------------------- repartidor: «Pedidos Mae»
const JOB_FROM=[{n:'la Pulpería La Bendición',x:22,y:18},{n:'Pollolandia',x:76,y:18},{n:'el Súper Chino',x:67,y:18},{n:'la Soda Mi Barrio',x:23,y:60,c:()=>typeof progSodaLv==='function'&&progSodaLv()>0}];
const JOB_CLIENT=[['Doña Flory','moño'],['Don Chepe','calvo'],['La niña Sofi','cola'],['Maikol','corto'],['Doña Hilda','moño'],['Bryan','corto'],['Doña Cecilia','largo'],['El profe Rojas','corto'],['Yuliana','largo'],['Don Toño','calvo']];
function jobStart(){const p=PGS(),v=riding()||PGS().veh.find(x=>!x.gone&&x.map===P.map&&Math.hypot(x.x-P.x,x.y-P.y)<200);if(!PGS().veh.some(x=>!x.gone&&(VM[x.m].k==='bici'||VM[x.m].k==='moto'))){toast('📦 Para repartir necesitás bici o moto');return}
  const froms=JOB_FROM.filter(f=>!f.c||f.c()),f=pick(froms),homes=BUILD.filter(b=>b.kind==='house'&&b.id!=='casa_jugador'),h=pick(homes);
  const dist=Math.hypot(h.dx-f.x,h.dy-f.y),lim=Math.round(40+dist*2.2),pay=Math.round((600+dist*14)*(1+Math.min(.6,p.jobs.n*.01))/50)*50;
  p.job={from:{map:'ext',x:f.x,y:f.y,n:f.n},to:(()=>{const c=pick(JOB_CLIENT);return{map:'ext',x:h.dx,y:h.dy+1,n:'la casa de '+c[0],who:c[0],hair:c[1],b:h.id}})(),st:'pick',t:0,lim,pay};toast('📦 Pedido: recogelo en '+f.n+' · paga '+fmtC(pay));closePanel()}
function progJobTick(dt){const j=S&&S.f&&S.f.pg&&S.f.pg.job;const hud=$('#pgJob');if(!j){hud.classList.add('hidden');return}if(mode==='play')j.t+=dt*(j.st==='drop'?1:0);
  const tg=j.st==='pick'?j.from:j.to,left=Math.max(0,j.lim-j.t);hud.classList.toggle('hidden',mode!=='play');hud.innerHTML='📦 '+(j.st==='pick'?'Recogé en '+tg.n:'Llevalo a '+tg.n+' · ⏱ '+Math.ceil(left)+' s');
  if(P.map===tg.map&&Math.hypot(P.x-(tg.x*T+8),P.y-(tg.y*T+8))<26){if(j.st==='pick'){j.st='drop';beep(880,.06,'triangle',.03);toast('📦 Pedido recogido. ¡Volando!')}
    else{const late=j.t>j.lim,stars=late?(j.t>j.lim*1.5?1:3):5,tip=late?0:Math.round(j.pay*(.1+Math.random()*.3)/50)*50,pay=j.pay+tip;earn(pay,'Repartos');const p=PGS();p.jobs.n++;p.jobs.stars=((p.jobs.stars||5)*.8+stars*.2);p.job=null;
      say(fillChar({id:'z_cliente',name:tg.who||tg.n.replace('la casa de ',''),hair:tg.hair||'corto',hairColor:'#2b1a10',skin:pick(['#e0ac69','#c68642','#8d5524']),shirt:pick(['#e85d75','#7bb661','#3fb6b0','#f2c94c']),pants:'#2d3346',v:1}),
        late?pick(['¡Diay, se tardó un montón! La comida ya está fría… Bueno, gracias.','Mae, pensé que se había perdido. Ni modo.']):pick(['¡Al fin! Ya me estaba comiendo las uñas. Tome, la propina.','¡Qué rápido! Usted sí es bueno. ¿Y la salsita? …Ah, ahí está. Pura vida.','¡Muchas gracias, joven! Dios me lo bendiga.']));
      say(null,'+'+fmtC(pay)+(tip?' (incluye '+fmtC(tip)+' de propina)':'')+' · '+'★'.repeat(stars)+'☆'.repeat(5-stars)+' · '+p.jobs.n+' pedidos entregados.');runDialog();if(typeof progRep==='function')progRep(1)}}}
function progJobProxies(list,map){const j=S.f.pg.job;if(!j)return;const tg=j.st==='pick'?j.from:j.to;if(tg.map!==map)return;
  list.push({kind:'carv',map,x:tg.x*T+8,y:tg.y*T+40,draw:g=>{const b=Math.sin(qBlink*5)*2,X=tg.x*T+8,Y=tg.y*T-18+b;g.fillStyle='#14101c';g.beginPath();g.moveTo(X-6,Y-1);g.lineTo(X+6,Y-1);g.lineTo(X,Y+7);g.fill();g.fillStyle=j.st==='pick'?'#f2c94c':'#57d17a';g.beginPath();g.moveTo(X-4,Y);g.lineTo(X+4,Y);g.lineTo(X,Y+5);g.fill()}})}
{const c=document.createElement('div');c.id='pgJob';c.className='chip hidden';c.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top) + 8px);z-index:19;pointer-events:none;font-size:13px';document.body.appendChild(c)}
// ---------------------------------------------------------------- en cada cuadro
hookAfter('update',function(dt){if(!S||!S.started)return;try{progVehTick(dt);progJobTick(dt)}catch(e){console.error(e)}});
