// ================= HISTORIA SECUNDARIA · «LA VIEJA DEL PUENTE» =================
// Cierra el prólogo (La Mona en el Puente de la Vieja, 3:33, «no pare»). Depende de cómo jugás:
// el cariño de Ariana, la confianza de Don Alexander, lo que averigüés en el barrio y en El Hoyo, cómo manejás
// y lo que hagás en el puente. Tres finales: paz, misterio o huida (que se puede volver a intentar).
function MONA(){if(!S.f.mona)S.f.mona={st:0,cl:{},fin:'',retry:0,perdon:0,dia:0};return S.f.mona}
const monaOn=()=>!!(S&&S.f&&S.f.mona);
QUESTS.mona={t:'La Vieja del puente',d:()=>monaHint()};QORDER.push('mona');
function monaHint(){if(!monaOn())return'';const m=MONA(),c=m.cl;
  if((S.f.arRel||0)<5&&m.st<4)return N('ariana')+' anda distante. No es momento de hablar del puente: primero arreglá las cosas con ella.';
  if(m.st===1)return N('ariana')+' te escribió a las 3:33 de la mañana. Andá a hablar con ella.';
  if(m.st===2){const f=[];if(!c.chepe)f.push('Don Chepe, el señor del peaje, se sienta en la plaza de la Calle 3');if(c.chepe&&!c.yuca)f.push(N('papa')+' sabe algo, pero solo se lo va a contar a alguien en quien confíe');if(!c.eulalia)f.push('en El Hoyo vive gente que conoce esa carretera desde hace cincuenta años');
    return'Averiguá qué pasó en el Puente de la Vieja. '+(f.length?f.join('. ')+'.':'')}
  if(m.st===3)return m.retry>S.day?'Esa noche saliste huyendo. '+N('ariana')+' necesita unos días.':'Llevá a '+N('ariana')+' al Puente de la Vieja de madrugada, en tu carro o tu moto (salida de la carretera, entre 10 p. m. y 4 a. m.).';
  if(m.st===4)return'Volvieron del puente. '+(m.fin==='paz'?'Llevale a '+N('papa')+' la estampita de Doña Eulalia.':'');return''}
// ---------- arranque: el mensaje de las 3:33 ----------
function monaReady(){const f=S.f;return(f.arRel||0)>=15&&(f.dr4||S.day>=12)&&!(f.mona&&f.mona.st)}
hookAfter('ecoDay',function(){try{if(monaReady()){const m=MONA();m.st=1;m.dia=S.day;
  setTimeout(()=>{if(typeof phQueue==='function')phQueue('ariana','¿Estás despierto? Son las 3:33… Soñé con el puente otra vez. El de la Ruta 27, con neblina. Desde chiquita sueño con ese puente y nunca le he contado a nadie 😔');startQ('mona')},3500)}
  else if(monaOn()){const m=MONA();if(m.fin==='huida'&&Math.random()<.25)setTimeout(()=>toast('🌫 Soñaste con el puente. La señora de la bata te miraba desde la neblina.'),4200);
    else if(m.fin==='misterio'&&Math.random()<.08)setTimeout(()=>toast('🌫 Soñaste con el puente. Esta vez no daba miedo.'),4200)}}catch(e){console.error(e)}});
// ---------- Ariana ----------
{const _a=TALK.ariana;TALK.ariana=function(){if(!monaOn())return _a.apply(this,arguments);const m=MONA();
  if(m.st===1&&(S.f.arRel||0)>=5){m.st=2;
    say('ariana','¿Viste mi mensaje? Perdón por escribirte a esa hora… es que me despierto siempre igual. A las 3:33. Con el corazón a mil.');
    say('ariana','En el sueño voy dormida atrás de un carro. Hay neblina, un puente. Mi papá grita algo, frena… y en media calle hay una señora en bata. Después todo da vueltas.');
    say('ariana','Lo raro es que tengo una cicatriz aquí, en la ceja. Mi mamá dice que me caí de chiquita. Pero cada vez que le pregunto a mi papá, se va a chapear y no vuelve hasta la noche.',[
      {t:'«Yo también he soñado con ese puente»',f(){relAdd('ar',1);m.cl.sueno=1;say('ariana','…¿Qué? ¿Vos también? ¿Con la señora de la bata?');say(null,'Le contás de la Ruta 27, del peaje, del «no pare», del carro que se apaga en el puente.');say('ariana','Mor, eso no es casualidad. Ayudame a averiguar qué pasó. Por favor.')}},
      {t:'«Seguro es solo un sueño, mor»',f(){relAdd('ar',-1);say('ariana','…Sí. Seguro. Olvidalo.');say(null,'Se le apaga la cara. Mejor averiguás algo por tu cuenta.')}},
      {t:'«¿Querés que le preguntemos a alguien?»',f(){relAdd('ar',.5);say('ariana','No sé a quién. Mi papá no habla de eso. Pero vos conocés a todo el mundo en el barrio…')}}]);return}
  const ck=Object.keys(m.cl).filter(k=>k!=='sueno').sort().join(',');
  if(m.st===2&&ck&&m.arCk!==ck){const c=m.cl;m.arCk=ck;
    say('ariana','¿Averiguaste algo del puente?');if(c.chepe)say(null,'Le contás lo que dijo Don Chepe: el puente se llama así por una señora, y en el 2009 un taxi rojo del barrio se estrelló ahí.');
    if(c.eulalia)say(null,'Le contás lo de Doña Eulalia, la que camina el puente en bata desde que se le murió el hijo.');if(c.yuca)say(null,'Y le contás, con cuidado, lo que te confesó su papá.');
    if(c.yuca)say('ariana','…Entonces no me caí. Íbamos en el taxi de mi papá. Y él cargó eso solo todos estos años.');else say('ariana','Un taxi rojo… mi papá tenía un taxi rojo cuando yo era chiquita. Lo vendió de un día para otro.');
    if(c.yuca||c.eulalia){m.st=3;say('ariana','Quiero ir. Al puente. De madrugada, como esa noche. Pero esta vez despierta, y con vos manejando.');say('ariana','Si no lo veo con mis propios ojos, esto me va a seguir despertando toda la vida.');toast('🌫 Misión actualizada: llevá a '+N('ariana')+' al Puente de la Vieja')}
    else say('ariana','Todavía falta algo. Alguien tiene que saber quién es la señora de la bata.');return}
  const nota=m.arNota===S.day?null:m.st===3&&m.retry>S.day?pick(['Todavía no estoy lista para volver al puente. Dame unos días.','Esa noche me dejaste sola con el miedo. Ya se me va a pasar… creo.']):m.st===4&&m.fin==='paz'&&!m.epi?'¿Ya le diste la estampita a mi papá? Vamos juntos donde él.':null;
  if(nota){m.arNota=S.day;say('ariana',nota);const a=arguments,th=this;afterD(()=>_a.apply(th,a));return}
  return _a.apply(this,arguments)}}
// ---------- Don Chepe, el del peaje (plaza de la Calle 3) ----------
function chepePeajeTalk(e){const c=e.c,m=monaOn()?MONA():null;
  if(!m||m.st<2){say(c,pick(['Treinta y un años cobrando en el peaje de la Ruta 27, joven. De noche, casi siempre. Uno ve cosas.','Ahora me la paso aquí, viendo palomas. Es más tranquilo que la autopista.','¿Usted no es el muchacho que pasó una vez a las tres de la mañana? …No, debe ser otro. Todos se parecen de madrugada.']));return}
  if(!m.cl.chepe){m.cl.chepe=1;say(c,'¿El Puente de la Vieja? Ay, joven… ¿quién le habló de eso?');
    say(c,'Le dicen así por una señora, Doña Eulalia. Desde hace muchísimos años camina por ese puente de madrugada, en bata, rezando. Los choferes la ven entre la neblina y se asustan. Dicen que es La Mona.');
    say(c,'Yo a todos los que pasaban de madrugada les decía lo mismo: «No pare en el Puente de la Vieja. Pase de largo, pase lo que pase».');
    say(c,'Una madrugada del 2009 pasó un taxi rojo de este barrio. Iba un señor con una chiquita dormida atrás. No me hizo caso… o no le dio tiempo. Se estrelló contra la baranda.');
    say(c,'Gracias a Dios nadie se murió. Pero el señor nunca volvió a pasar por mi caseta. Pregúntele a Yuca. Él sabe más que yo.');
    if(m.cl.sueno)say(null,'«No pare en el Puente de la Vieja»: exactamente lo que te dijo en la pesadilla. Se te eriza la piel.');toast('🌫 Pista: el taxi rojo del 2009');saveGame();return}
  if(m.fin==='paz')return say(c,'Me contaron que Eulalia ya no camina el puente. Dicen que ahora duerme tranquila. Usted tuvo algo que ver, ¿verdad? Se le nota en la cara.');
  say(c,pick(['Si va para allá de madrugada, vaya despacio. Esa neblina no perdona.','Eulalia no es mala, joven. Es una mamá que no ha terminado de despedirse.']))}
// ---------- Doña Chela (El Hoyo) conoce a Eulalia ----------
{const _hc=hoyoChela;hoyoChela=function(e){if(!monaOn()||MONA().st!==2||MONA().cl.eulalia)return _hc(e);const m=MONA(),c=e.c;
  say(c,'Mijo, ¿quiere empanaditas? …Uy, qué cara. ¿Qué le pasa?',[{t:'¿Usted ha oído del Puente de la Vieja?',f(){m.cl.eulalia=1;
    say(c,'¿Que si he oído? Eulalia era mi comadre, mijo. Fuimos juntas a la escuela.');
    say(c,'En el setenta y ocho, a su hijo Rafa le dio por correr motos de madrugada en esa bajada con otro muchacho del barrio. Uno al que ya le decían «Tata».');
    say(c,'Rafa no frenó a tiempo. El Tata sí. Desde esa noche, Eulalia baja al puente a las tres y media, en bata, con el rosario. Dice que va a buscar a Rafa para que no se vaya solo.');
    say(c,'La gente le tiene miedo y le dice La Mona. Pero es una mamá, mijo. Nada más. Si la ve, llámela por su nombre. Hace años que nadie le dice «Eulalia».');
    say(null,'El Tata: el abuelo de '+N('kevin')+'. La Honda del setenta y ocho. Todo empieza a encajar.');toast('🌫 Pista: Doña Eulalia y su hijo Rafa');saveGame()}},{t:'Nada, Doña Chela. Deme una empanada',f(){_hc(e)}}])}}
// ---------- Doña Rosa: la leyenda de siempre ----------
{const _r=TALK.rosa;if(_r)TALK.rosa=function(){if(!monaOn()||MONA().st!==2||MONA().cl.rosa)return _r.apply(this,arguments);const m=MONA();m.cl.rosa=1;
  say('rosa','¿La Mona? Ay, mijo, mi abuela contaba que era una bruja de Barva que se untaba un ungüento a la medianoche y se volvía una mona peluda, con los ojos como brasas.');
  say('rosa','Y que si uno la ve en la carretera, no tiene que parar, porque se le monta en el carro. Así nos asustaban para que no anduviéramos de vagos de madrugada.');say('rosa','Ahora, si me pregunta a mí… la gente le dice «mona» a cualquier cosa que le da miedo entender.')}}
// ---------- Don Alexander: solo se lo cuenta a alguien en quien confía ----------
{const _p=TALK.papa;TALK.papa=function(){if(!monaOn())return _p.apply(this,arguments);const m=MONA();
  if(m.st===2&&m.cl.chepe&&!m.cl.yuca){const op=S.f.opinion||0;
    if(op<2.5){if(m.papaNo===S.day)return _p.apply(this,arguments);m.papaNo=S.day;say('papa','¿Quién le anda contando chismes del puente? Eso no es asunto suyo, muchacho.');toast('🧔 Don Alexander todavía no confía en vos para contarte eso (necesitás «Te respeta»). Ayudale en la chapea.');const a=arguments,th=this;afterD(()=>_p.apply(th,a));return}
    m.cl.yuca=1;say(null,N('papa')+' deja el machete recostado en la tapia y se sienta en la acera. Tarda en hablar.');
    say('papa','Yo manejaba un taxi rojo. Un Corolla. Esa noche venía de Puntarenas, de un viaje largo, con dos turnos encima. Ariana tenía nueve años y venía dormida atrás.');
    say('papa','A las tres y media, en el Puente de la Vieja, cabeceé. Un segundo nada más. Abrí los ojos y había una señora en bata en media calle.');
    say('papa','Tiré el volante. Nos estrellamos contra la baranda. Ariana se golpeó la ceja… Cuando me bajé, la señora ya no estaba. Como si nunca hubiera estado.');
    say('papa','Vendí el taxi esa misma semana. Nunca más manejé de noche. Y nunca le conté a Ariana. ¿Para qué? ¿Para que supiera que su papá casi la mata?',[
      {t:'«Usted la salvó, Don Alexander. Frenó por esa señora.»',f(){relAdd('op',.5);say('papa','…Eso me digo todas las noches. A veces me lo creo.')}},
      {t:'«Ariana merece saberlo.»',f(){say('papa','Tal vez. Pero que se lo cuente usted. A mí no me sale.')}},
      {t:'Quedarse callado a su lado',f(){relAdd('op',.3);say(null,'Se quedan un rato los dos en la acera, sin decir nada. Él te da una palmada en la espalda y vuelve al machete.')}}]);
    say('papa','Y por eso no me gusta que usted ande con mi hija en carro de madrugada. Ahora ya sabe por qué.');toast('🌫 Pista: el taxi de Don Alexander');saveGame();return}
  if(m.st===4&&m.fin==='paz'&&!m.epi){m.epi=1;monaEpilogo();return}
  return _p.apply(this,arguments)}}
// ---------- manejar con cuidado cuenta ----------
{const _h=progOnHit;progOnHit=function(c){const r=_h.apply(this,arguments);if(r&&typeof progStat==='function')progStat('choques');return r}}
{const _rt=reten;reten=function(v,where){const mal=vPapeles(v).length;const r=_rt.apply(this,arguments);if(mal&&typeof progStat==='function')progStat('multas');return r}}
function manejoMalo(){const s=PGS().stats;return(s.choques||0)+(s.multas||0)-(MONA().perdon||0)}
// ---------- la salida al puente (desde la carretera del barrio) ----------
{const ap=ACT_POINTS.find(a=>a.map==='ext'&&a.x===1&&a.y===21);if(ap){const run1=ap.run;ap.run=function(){const v=riding(),h=S.t/60,m=monaOn()?MONA():null;
  if(!m||m.st!==3||m.retry>S.day||!v||!VM[v.m].motor||!(h>=22||h<4))return run1();
  say(null,'Es de madrugada. '+N('ariana')+' te espera en la esquina con un suéter y cara de no haber dormido.',[{t:'Llevar a '+N('ariana')+' al Puente de la Vieja',f(){afterD(monaSalida)}},{t:'Otro destino',f(){afterD(run1)}}])}}}
function monaSalida(){const v=riding(),c=VM[v.m],p=PGS(),m=MONA();
  if(c.lic&&!p.lic[c.lic])return say('ariana','¿Sin licencia? ¿De madrugada? ¿Por la Ruta 27? Mor, no. Así no.');
  if(v.gas<.25)return say('ariana','Ese tanque está casi vacío. No quiero quedarme varada en ese puente… otra vez no.');
  const bad=manejoMalo();
  if(bad>=4){say('ariana','Mor… con todos los choques y las multas que llevás, me da miedo subirme con vos de madrugada. Perdón, pero es justo lo que más miedo me da en la vida.',[
    {t:'Prometerle que vas a manejar con cuidado',f(){m.perdon=(PGS().stats.choques||0)+(PGS().stats.multas||0);relAdd('ar',-1);say('ariana','…Está bien. Te creo. Pero si te veo jugando de vivo en la carretera, nos devolvemos.');afterD(monaViaje)}},{t:'Mejor otro día'}]);return}
  monaViaje()}
function monaViaje(){const v=riding(),c=VM[v.m],m=MONA(),papeles=vPapeles(v).length===0;
  fadeDo(()=>{passTime(Math.max(0,((24+3.5)*60-S.t)%1440-25));v.gas=Math.max(0,v.gas-.18);$('#hud').classList.add('hidden')},()=>{
    say(null,'Bajada de la Ruta 27. Pasaste el último peaje hace rato. La caseta de Don Chepe está apagada.');
    say('ariana',c.k==='moto'?'Agarrame fuerte la mano cuando lleguemos… bueno, no, agarrá el manubrio. Yo te agarro a vos.':'Poné música. Algo viejito. Un bolero.');
    if(!papeles)say('ariana','¿Y si nos para Tránsito sin los papeles al día? …Ay, mor. Concentrate.');
    afterD(()=>monaPuente());runDialog()})}
// ---------- la escena en el puente (cinemática sobre el juego) ----------
let MNS=null;
function mpCanvas(){let cv=$('#monaCv');if(!cv){cv=document.createElement('canvas');cv.id='monaCv';cv.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;opacity:0;transition:opacity .8s';document.body.insertBefore(cv,$('#dialog'))}return cv}
function monaPuente(){const cv=mpCanvas();MNS={t:0,stg:'bajada',fig:0,figX:0,spd:1,radio:'BOLERO',eyes:0,lights:1,hand:0,last:performance.now()};cv.style.opacity=1;mode='dialog';
  const loop=now=>{if(!MNS)return;const dt=Math.min(.05,(now-MNS.last)/1000);MNS.last=now;MNS.t+=dt;mpDraw(cv,dt);requestAnimationFrame(loop)};requestAnimationFrame(loop);
  say(null,'3:31 a. m. La neblina baja como algodón mojado. El rótulo aparece entre las luces: «PUENTE DE LA VIEJA».');
  say('ariana','Aquí es. Lo reconozco… lo reconozco todo.');
  afterD(()=>{MNS.radio='3:33';beep(180,.3,'sawtooth',.04);setTimeout(()=>{if(!MNS)return;MNS.radio='NO PARE';beep(140,.4,'square',.03)},500);setTimeout(()=>{if(!MNS)return;MNS.spd=0;MNS.lights=.45;beep(70,.5,'sawtooth',.05);
    say(null,'El reloj marca 3:33. La radio chilla «NO PARE». El motor tose una vez, dos… y se apaga en media calle del puente.');say('ariana','Así fue. Así fue esa noche…');
    afterD(()=>{MNS.stg='fig';say(null,'Entre la neblina, adelante, alguien camina despacio por la mitad del puente. Una bata clara. El pelo blanco suelto. Viene hacia el carro.');say('ariana','Mor… mor, es ella.',monaOpciones());runDialog()});runDialog()},1300)});
  runDialog()}
function monaOpciones(){const m=MONA(),o=[{t:'Darle al arranque y pasar de largo, como dijo Don Chepe',f(){afterD(monaHuida)}},{t:'Quedarte en el carro y abrazar a '+N('ariana'),f(){afterD(monaMisterio)}},{t:'Bajarte del carro',f(){afterD(monaBajar)}}];return o}
function monaHuida(){const m=MONA();MNS.stg='huida';beep(110,.2,'sawtooth',.05);setTimeout(()=>beep(130,.2,'sawtooth',.05),250);setTimeout(()=>{if(MNS){MNS.spd=1.8;MNS.lights=1;MNS.radio='- - -'}},700);
  say(null,'Le das al arranque como loco. A la tercera agarra. Pasás a la par de la figura sin mirarla y aceleras hasta salir de la neblina.');
  say('ariana','…');say('ariana','Igualito que mi papá. Huyendo de esto. Toda la vida huyendo de esto.');say(null,'No dice nada más en todo el camino. Ves en el espejo, por un segundo, dos brasas rojas entre el monte.');
  afterD(()=>monaFin('huida'));runDialog()}
function monaMisterio(){MNS.stg='pasa';MNS.hand=1;
  say(null,'Te quedás quieto. Le pasás el brazo a '+N('ariana')+'. Ella tiembla.');say(null,'La figura llega a la par de tu ventana. No le ves la cara: la neblina la tapa. Pone la mano en el vidrio un segundo… y sigue caminando hacia atrás del carro.');
  say(null,'Cuando volvés a ver por el espejo, ya no hay nadie. El carro arranca solo.');say('ariana','Nunca vamos a saber qué era eso, ¿verdad?');say('ariana','…Pero esta vez no estaba sola. Eso ya es distinto.');
  afterD(()=>monaFin('misterio'));runDialog()}
function monaBajar(){const m=MONA();MNS.stg='cerca';say(null,'Abrís la puerta. El frío de la neblina te entra hasta los huesos. La figura se detiene a unos pasos del carro.');
  if(!m.cl.eulalia){say(null,'Es una señora muy mayor, en bata, con un rosario en la mano. Te mira sin miedo.');say(fillChar({id:'z_eulalia',name:'La señora de la bata',hair:'largo',hairColor:'#e8e8e8',skin:'#d9b08c',shirt:'#e8e2d6',pants:'#e8e2d6',v:1}),'¿Ustedes también vienen a buscar a alguien?');
    say(null,'Antes de que podás contestar, se da la vuelta y se pierde en la neblina. No sabés su nombre. No sabés qué decirle.');afterD(()=>monaFin('misterio'));runDialog();return}
  say(null,'Es una señora muy mayor, en bata, con un rosario en la mano. Tiene los ojos rojos de tanto llorar, como dos brasas.',[{t:'«¿Doña Eulalia?»',f(){afterD(monaPaz)}},{t:'Quedarte callado',f(){afterD(monaMisterio)}}]);runDialog()}
function monaPaz(){const m=MONA(),eu=fillChar({id:'z_eulalia',name:'Doña Eulalia',hair:'largo',hairColor:'#e8e8e8',skin:'#d9b08c',shirt:'#e8e2d6',pants:'#e8e2d6',v:1});MNS.stg='paz';MNS.lights=.8;
  say(eu,'…Hace tantos años que nadie me llama por mi nombre. Todo el mundo me dice La Mona.');say(eu,'Vengo a buscar a mi Rafa. Para que no se vaya solo. Ya sé que no está, mijo. Pero una mamá no sabe dejar de venir.');
  say(null,N('ariana')+' se baja del carro. Doña Eulalia la mira largo rato, le toca la ceja con un dedo.');
  say(eu,'Vos sos la chiquita del taxi rojo. Tu papá frenó por mí. Se estrelló por no atropellarme. Yo estaba en media calle, como una tonta, rezando.');
  if(m.cl.yuca){say('ariana','Mi papá cree que fue su culpa. Lleva quince años cargando con eso.');say(eu,'Entonces dígale que no. Que la culpa fue mía. Y que gracias. Nunca le pude dar las gracias.')}
  else say(eu,'Dígale a tu papá que gracias. Que la culpa fue mía. Él va a entender.');
  say(null,'Doña Eulalia saca de la bata una estampita gastada de la Negrita y se la pone a '+N('ariana')+' en la mano.');say(eu,'Para él. Y ya váyanse, que ese puente es frío. Yo creo que hoy… hoy ya me voy a dormir.');
  say(null,'Se va caminando despacio hacia la orilla, sin rezar esta vez. La neblina empieza a levantar. Arriba, entre las nubes, se ve una estrella.');say('ariana','Mor… por primera vez en mi vida no tengo miedo de este puente.');
  afterD(()=>monaFin('paz'));runDialog()}
function monaFin(fin){const m=MONA(),cv=$('#monaCv');
  fadeDo(()=>{if(cv)cv.style.opacity=0;MNS=null;S.t=5*60+10;$('#hud').classList.remove('hidden');enAdd(-20)},()=>{
    if(fin==='huida'){m.fin='huida';m.retry=S.day+5;relAdd('ar',-2);say(null,'Dejás a '+N('ariana')+' en su casa. Se baja sin despedirse. La pesadilla no se terminó: solo la dejaste para otro día.');toast('🌫 «La Vieja del puente»: podés intentarlo de nuevo en unos días')}
    else{m.st=4;m.fin=fin;if(fin==='misterio'){relAdd('ar',2);doneQ('mona');say(null,'Amanece cuando llegan al barrio. '+N('ariana')+' se queda dormida en tu hombro, tranquila. Lo que había en el puente se quedó en el puente.');if(typeof progRep==='function')progRep(4)}
      else{relAdd('ar',4);say(null,'Llegan al barrio con el sol saliendo. '+N('ariana')+' aprieta la estampita contra el pecho todo el camino.');say('ariana','Mañana se la damos a mi papá. Juntos.')}}
    if(typeof phQueue==='function')setTimeout(()=>phQueue('ariana',fin==='huida'?'Llegué. Buenas noches.':fin==='paz'?'Gracias por no soltarme la mano. Te amo, mor 💛':'Ya en la casa. Gracias por quedarte conmigo. Todavía me tiemblan las piernas 😅'),6000);
    runDialog();saveGame()})}
function monaEpilogo(){const m=MONA();
  say(null,N('ariana')+' le pone la estampita a su papá en la mano. Él la reconoce al instante: la Negrita, gastada de tanto rezo.');say('ariana','Pa… ya sé lo del taxi. Y fuimos al puente. Doña Eulalia te manda a decir que gracias. Que la culpa fue de ella.');
  say(null,N('papa')+' se queda mudo. Después, por primera vez en todo el tiempo que lo conocés, Yuca llora. Abraza a su hija tan fuerte que la levanta del suelo.');
  say('papa','Perdóneme, mi amor. Perdóneme por no contarle.');say('ariana','No hay nada que perdonar, pa. Vos frenaste.');
  say('papa','Muchacho… venga acá.',[{t:'Acercarte',f(){say('papa','Usted se llevó a mi hija de madrugada a ese puente sin pedirme permiso.');say('papa','…Y me la devolvió más feliz de lo que yo la he visto en quince años. Desde hoy, usted es de la casa. Y punto.');relAdd('op',2);relAdd('ar',2)}}]);
  afterD(()=>{doneQ('mona');S.f.monaPaz=1;if(typeof progRep==='function')progRep(8);toast('★ La pesadilla de la Ruta 27 · cerrada para siempre');beepSeq([523,659,784,1046,1318])});runDialog()}
LOGROS.push(['vieja','🌫','La Vieja del puente','Descubrí la verdad del Puente de la Vieja.',()=>!!(S.f.mona&&S.f.mona.st===4),4],['eulalia','🕯','Doña Eulalia','Llamala por su nombre.',()=>!!S.f.monaPaz,6]);
// ---------- dibujo de la cinemática ----------
function mpDraw(cv,dt){const W=cv.width=innerWidth*Math.min(2,devicePixelRatio||1)|0,H=cv.height=innerHeight*Math.min(2,devicePixelRatio||1)|0,g=cv.getContext('2d'),m=MNS,t=m.t;
  const hz=H*.38,dash=H*.66;m.z=(m.z||0)+dt*m.spd*2.2;
  let sky=g.createLinearGradient(0,0,0,hz);sky.addColorStop(0,'#05070d');sky.addColorStop(1,m.stg==='paz'?'#2a3348':'#141a26');g.fillStyle=sky;g.fillRect(0,0,W,hz);
  if(m.stg==='paz'){g.fillStyle='#fff';g.globalAlpha=.6+Math.sin(t*3)*.3;g.fillRect(W*.7,H*.08,3,3);g.globalAlpha=1}
  g.fillStyle='#0b0e14';g.fillRect(0,hz,W,H-hz);
  // carretera en perspectiva
  const vx=W/2;g.fillStyle='#1b1d22';g.beginPath();g.moveTo(vx-W*.02,hz);g.lineTo(vx+W*.02,hz);g.lineTo(W*.95,H);g.lineTo(W*.05,H);g.fill();
  for(let i=0;i<14;i++){const z=((i-m.z%1)/14);const k=z*z,y=hz+(H-hz)*k,w=W*.005+W*.012*k;if(i%2)continue;g.fillStyle='#c9a84a';g.fillRect(vx-w/2,y,w,(H-hz)*.03*k+1)}
  // barandas del puente con postes que pasan
  for(const s of[-1,1]){g.strokeStyle='#5a5e66';g.lineWidth=Math.max(2,W*.004);g.beginPath();g.moveTo(vx+s*W*.025,hz-2);g.lineTo(vx+s*W*.5,dash);g.stroke();
    for(let i=0;i<10;i++){const z=((i-(m.z*1.4)%1)/10),k=z*z,x=vx+s*(W*.025+W*.48*k),y=hz+(dash-hz)*k;g.fillStyle='#6a6e76';g.fillRect(x-1,y-H*.06*k,Math.max(1,W*.006*k),H*.06*k)}}
  // luces del carro
  const L=m.lights*(m.spd===0?.6+.15*Math.sin(t*20)*(t%3<.2?1:0):1);const hl=g.createRadialGradient(vx,H*.62,10,vx,H*.55,W*.45);hl.addColorStop(0,`rgba(255,240,200,${.35*L})`);hl.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=hl;g.fillRect(0,hz,W,H-hz);
  // la figura
  if(m.stg!=='bajada'&&m.stg!=='huida'){m.fig=Math.min(1,m.fig+dt*(m.stg==='fig'?.12:m.stg==='cerca'||m.stg==='paz'?.25:.18));let k=.25+m.fig*.75;if(m.stg==='pasa')m.figX=Math.min(1,(m.figX||0)+dt*.15);
    const fx=vx+(m.stg==='pasa'?m.figX*W*.35:0),fy=hz+(dash-hz)*k*k*.85+H*.02,fh=H*.35*k,fw=fh*.32;g.globalAlpha=m.stg==='pasa'?Math.max(0,1-m.figX*1.2):.85;
    const bg=g.createLinearGradient(fx,fy-fh,fx,fy);bg.addColorStop(0,'#d8d4c8');bg.addColorStop(1,'rgba(200,196,186,.2)');g.fillStyle=bg;g.beginPath();g.moveTo(fx-fw*.25,fy-fh*.82);g.lineTo(fx+fw*.25,fy-fh*.82);g.lineTo(fx+fw*.6,fy);g.lineTo(fx-fw*.6,fy);g.fill();
    const sw=Math.sin(t*1.7)*fw*.05;g.fillStyle='rgba(214,210,200,.85)';for(const s2 of[-1,1]){g.beginPath();g.moveTo(fx+s2*fw*.22,fy-fh*.8);g.lineTo(fx+s2*fw*.42+sw,fy-fh*.42);g.lineTo(fx+s2*fw*.3+sw,fy-fh*.4);g.fill()}
    g.fillStyle='#d9b08c';g.beginPath();g.ellipse(fx,fy-fh*.9,fw*.17,fh*.08,0,0,7);g.fill();g.fillStyle='#ecebe6';g.beginPath();g.moveTo(fx-fw*.24,fy-fh*.93);g.quadraticCurveTo(fx,fy-fh*1.04,fx+fw*.24,fy-fh*.93);g.lineTo(fx+fw*.3+sw,fy-fh*.55);g.lineTo(fx+fw*.12,fy-fh*.62);g.lineTo(fx+fw*.15,fy-fh*.86);g.lineTo(fx-fw*.15,fy-fh*.86);g.lineTo(fx-fw*.12,fy-fh*.62);g.lineTo(fx-fw*.3+sw,fy-fh*.55);g.fill();g.fillStyle='#3a2a22';g.fillRect(fx-1,fy-fh*.62,2,fh*.12);
    if(m.stg==='cerca'||m.stg==='paz'){g.fillStyle=m.stg==='paz'?'rgba(150,60,50,.7)':'#ff3a2a';for(const s of[-1,1]){g.beginPath();g.arc(fx+s*fw*.07,fy-fh*.9,Math.max(1.5,fw*.025),0,7);g.fill()}}g.globalAlpha=1}
  // brasas en el monte al huir
  if(m.stg==='huida'&&t%4<1.2){g.fillStyle='#ff3a2a';for(const s of[-1,1]){g.beginPath();g.arc(W*.12+s*8,hz+H*.05,3,0,7);g.fill()}}
  // neblina
  {const fb=g.createLinearGradient(0,hz-H*.12,0,hz+H*.18);fb.addColorStop(0,'rgba(170,178,192,0)');fb.addColorStop(.5,`rgba(170,178,192,${m.stg==='paz'?.25:.5})`);fb.addColorStop(1,'rgba(170,178,192,0)');g.fillStyle=fb;g.fillRect(0,hz-H*.12,W,H*.3)}
  for(let i=0;i<9;i++){const fx=((i*W*.29+t*W*.025*(i%2?1:-1))%(W*1.4))-W*.2,fy=hz+H*.04*(i%5)-H*.04;const fg=g.createRadialGradient(fx,fy,0,fx,fy,W*.3);fg.addColorStop(0,`rgba(190,196,206,${m.stg==='paz'?.14:.3})`);fg.addColorStop(1,'rgba(190,196,206,0)');g.fillStyle=fg;g.fillRect(0,0,W,H)}
  // lluvia
  g.strokeStyle='rgba(180,196,220,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<70;i++){const x=(hsh(i,1)*W+t*60*(1+i%3))%W,y=(hsh(1,i)*H+t*H*1.4*(1+i%2))%H;g.moveTo(x,y);g.lineTo(x-3,y+14)}g.stroke();
  // tablero
  g.fillStyle='#07080b';g.beginPath();g.moveTo(0,dash);g.quadraticCurveTo(W/2,dash-H*.05,W,dash);g.lineTo(W,H);g.lineTo(0,H);g.fill();
  g.fillStyle='#0d0f14';g.fillRect(0,dash+H*.012,W,2);const rx=W/2-W*.08,ry=dash+H*.025,rw=W*.16,rh=H*.045;g.fillStyle='#1a1c22';g.fillRect(rx-6,ry-6,rw+12,rh+12);
  g.strokeStyle='#8a6a3a';g.lineWidth=2;g.beginPath();g.moveTo(W*.62,0);g.quadraticCurveTo(W*.63+Math.sin(t*1.3)*6,H*.12,W*.625+Math.sin(t*1.3)*8,H*.16);g.stroke();g.fillStyle='#c9a24a';g.fillRect(W*.62+Math.sin(t*1.3)*8-4,H*.16,8,10);g.fillStyle='#061008';g.fillRect(rx,ry,rw,rh);g.fillStyle=m.radio==='NO PARE'||m.radio==='3:33'?(t*4%2<1?'#ff5aa0':'#601028'):'#5cff9a';g.font=`bold ${rh*.6|0}px monospace`;g.textAlign='center';g.textBaseline='middle';g.fillText(m.radio,W/2,ry+rh/2);
  if(m.hand){g.fillStyle='rgba(255,255,255,.05)';g.fillRect(0,0,W,H)}
  const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');g.fillStyle=vg;g.fillRect(0,0,W,H)}
