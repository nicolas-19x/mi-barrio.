// ================= PROGRESO · DESBLOQUEOS: PUNTARENAS, FIESTA EN LA TERRAZA, ASOCIACIÓN DE VECINOS =================
// ---------------------------------------------------------------- Puntarenas
var PLAYA=null;   // estado del paseo actual (se arma al llegar)
// genPlaya y el arte del mapa están en 52_puntarenas.js
{const _e=ensureMapP;ensureMapP=function(id){if(id==='playa'&&!MAPS.playa)genPlaya();return _e(id)}}
{const _r=renderMapHD;renderMapHD=function(m){if(m&&m.id==='playa'){if(!HD_ON)return;const r=hdPlaya(m);m.base2=r.base;m.top2=r.top;return}return _r(m)}}
RIDE_MAPS.add('playa');
// el pintor HD (hdPlaya) está en 52_puntarenas.js
// los de la playa
function olgaTalk(e){say(e.c,'¡Churchills, churchills! El original de Puntarenas, mi amor: hielo, sirope de kola, leche en polvo, leche condensada, helado y fruta. Con todo, como Dios manda.',[
  {t:'Un churchill con todo (₡2 500)',f(){if(S.money<2500)return say(e.c,'No le alcanza, mi amor.');spend(2500,'Antojos');enAdd(18);say(null,'Te sirven un vaso gigante con una montaña de hielo, helado de vainilla, fruta, galleta y leche por todo lado. Te comés hasta la cuchara. +18⚡');PLAYA&&(PLAYA.ch=1);if(PLAYA&&PLAYA.ari){say('ariana','¡Esto es lo mejor del mundo! Mirá, tengo leche condensada hasta en la nariz.');relAdd('ar',1)}}},
  {t:'¿Usted inventó el churchill?',f(){say(e.c,'Ay no, eso fue un señor que se parecía a Winston Churchill, allá por los cuarentas. Yo solo lo hago mejor que todos.')}},{t:'Ahorita vuelvo'}])}
function piperoTalk(e){say(e.c,'¡Pipa fría, pipa fría! Recién bajada, mae. Y bloqueador, que ese sol de Puntarenas no perdona.',[
  {t:'Una pipa (₡800)',f(){if(S.money<800)return;spend(800,'Antojos');enAdd(8);say(null,'Le abre el hueco con el machete en tres golpes. Agua de pipa fría, con pajilla. La vida.')}},
  {t:'Bloqueador (₡2 000)',f(){if(S.money<2000)return;spend(2000,'Antojos');PLAYA&&(PLAYA.bloq=1);toast('🧴 Te untaste bloqueador. El sol ya no te va a hacer camarón.')}},{t:'Nada, gracias'}])}
function chaloTalk(e){const h=S.t/60;say(e.c,'Cuarenta años pescando en este muelle, joven. Aquí uno aprende a tener paciencia… y a mentir sobre el tamaño de los pescados.',[
  {t:'Alquilarle una cuerda y anzuelo (₡1 000 · 1 h)',f(){if(S.money<1000)return say(e.c,'Diay, sin plata no hay carnada.');if(E().en<10)return say(e.c,'Usted está muy cansado, vaya siéntese.');spend(1000,'Paseo');
    afterD(()=>fadeDo(()=>{passTime(60);enAdd(-6)},()=>{const r=Math.random(),c=r<.16?['un pargo rojo enorme',6000]:r<.42?['una corvina',3000]:r<.72?['tres sardinas',600]:r<.86?['una chancleta vieja',0]:['nada… pero nada',0];
      say(null,'Después de una hora de paciencia sacás '+c[0]+'.');if(c[1]){say(e.c,'¡Mire eso! Se lo compro en '+fmtC(c[1])+' para la marisquería de mi cuñado.',[{t:'Vendérselo',f(){earn(c[1],'Paseo');toast('🐟 +'+fmtC(c[1]))}},{t:'Mejor me lo llevo para la casa',f(){enAdd(10);say(null,'Mamá lo va a freír con ajo y limón. +10⚡ (en la cena).');if(typeof relAdd==='function')relAdd('lu',.5)}}])}else say(e.c,pick(['Así es la pesca. Hoy el mar se comió la carnada.','Ja, ja. Esa chancleta la boté yo en el 98.']));if(typeof progStat==='function')progStat('pesca');runDialog()}))}},
  ...(h>=16.5&&h<18.6?[{t:'Ver el atardecer desde el muelle',f(){afterD(()=>sunsetScene())}}]:[]),{t:'Solo pasaba a saludar'}])}
function sunsetScene(){fadeDo(()=>{P.x=90.5*T;P.y=45.6*T;P.dir=0;P.deck=true;if(S.t<17.4*60)S.t=17.4*60},()=>{say(null,'El sol se va hundiendo detrás del golfo de Nicoya. El cielo se pone naranja, después rosado, después morado. Las lanchas de los pescadores vuelven al puerto.');
  if(PLAYA&&PLAYA.ari){say('ariana','…Gracias por traerme. En serio. Hace años no veía el mar.');say('ariana','Prometeme que vamos a volver. Aunque sea en bus, aunque sea en cinco años.',[{t:'Te lo prometo',f(){relAdd('ar',3);say('ariana','Te voy a cobrar esa promesa, ¿eh?')}},{t:'Tomarle la mano sin decir nada',f(){relAdd('ar',4);say(null,'Ella no la suelta. Se quedan así hasta que sale la primera estrella.')}}])}
  else say(null,'Pensás en el barrio, en tu casa, en todo lo que has construido. No está nada mal para un mae que empezó sin un cinco.');
  PGS().stats.atardecer=(PGS().stats.atardecer||0)+1;if(typeof progRep==='function')progRep(2);runDialog()})}
// el mar ahora se nada de verdad (52_puntarenas.js)
ACT_POINTS.push({map:'playa',x:4,y:5,label:'Volver al barrio',cond:()=>!!riding()||!!(PLAYA&&PLAYA.v),run(){say(null,'¿Ya nos vamos? Son como dos horas y pico de vuelta por la Ruta 27.',[{t:'Sí, de vuelta al barrio',f(){afterD(()=>playaTrip('ext'))}},{t:'Un rato más'}])}});
// el viaje
function playaTrip(to){let v=riding();if(!v&&PLAYA&&PLAYA.v){v=PLAYA.v;if(!v.gone)progMount(v)}v=riding();if(!v)return say(null,'Necesitás tu vehículo.');const c=VM[v.m];
  if(!c.motor)return say(null,'¿A Puntarenas en bici? Son más de cien kilómetros, mae. Ni Andrey Amador.');
  if(to==='playa'){if(v.gas<.42)return say(null,'Con esa gasolina no llegás ni a Atenas. Llená el tanque en el servicentro.');if(S.money<1500)return say(null,'Necesitás al menos ₡1 500 para los peajes de la Ruta 27.')}
  else if(v.gas<.3){say(null,'El tanque está casi vacío. En la bomba del Puerto te llenan.',[{t:'Echar gasolina (₡'+Math.round((1-v.gas)*VM[v.m].tank*GAS_L).toLocaleString('es-CR')+')',f(){const cost=Math.round((1-v.gas)*VM[v.m].tank*GAS_L);if(S.money<cost)return say(null,'No te alcanza. Llamá a alguien… o rezá.');spend(cost,'Gasolina');v.gas=1;afterD(()=>playaTrip('ext'))}},{t:'Arriesgarse'}]);if(v.gas<.12)return;return runDialog()}
  const ari=to==='playa'&&PLAYA_INV;PLAYA_INV=0;
  fadeDo(()=>{passTime(Math.round(rnd(125,160)));v.gas=Math.max(0,v.gas-(c.k==='moto'?.34:.3));v.cond=Math.max(0,v.cond-5);v.km+=110000;spend(Math.min(S.money,1500),'Peajes');CARS=[];CBUS=null;
    if(to==='playa'){ensureMap('playa');P.map='playa';P.x=PZ_ARRIVE[0]*T+8;P.y=PZ_ARRIVE[1]*T+12;P.dir=3;P.deck=true;P.swim=false;pzCarsInit();PLAYA={v,ari,day:S.day};if(ari)playaAri()}
    else{P.map='ext';P.x=2*T+8;P.y=21*T+8;P.dir=3;playaEnd()}v.map=P.map;v.x=P.x;v.y=P.y},
   ()=>{if(to==='playa'){say(null,pick(['Ruta 27: tres peajes, un mirador y una presa en el puente de La Garita. Pero aquí estás.','Paraste en Orotina a comprar una bolsa de mangas con sal y limón. Llegás con la boca arrugada.','Bajando de Atenas se te tapan los oídos. Abrís la ventana y ya huele a mar.']));
      say(null,'🌴 Puntarenas. El Paseo de los Turistas, los almendros, el olor a sal y a churchill. Al fondo, el muelle y el golfo de Nicoya.');if(ari)say('ariana','¡EL MAR! ¡Mirá el mar! Ay, perdón, es que… hace años que no venía.');PGS().stats.playa=(PGS().stats.playa||0)+1;if(typeof progRep==='function')progRep(2)}
     else say(null,pick(['De vuelta en el barrio, con arena en los tenis y el corazón contento.','Llegás a la casa quemado del sol y feliz. Mamá pregunta si le trajiste churchill. No le trajiste.']));runDialog();saveGame()})}
let PLAYA_INV=0;
function playaAri(){const c=CH.ariana;if(!c)return;const e=zPed('playa',6,5,Object.assign({},c),{stat:1,tmp:'playa',talk:()=>say('ariana',pick(['¿Vamos al muelle a ver el atardecer? Dicen que es lo más lindo de aquí.','¿Me comprás un churchill? …Bueno, yo te compro uno a vos.','Esto parece un sueño. Gracias por invitarme.']))});e.follow=1}
function playaEnd(){for(let i=ENTS.length-1;i>=0;i--)if(ENTS[i].tmp==='playa')ENTS.splice(i,1);if(PLAYA&&PLAYA.ari){relAdd('ar',2);if(typeof phQueue==='function')phQueue('ariana','Ya llegué a la casa. Todavía tengo arena en el pelo 😂 Gracias por hoy. Fue el mejor día en mucho tiempo 💛')}PLAYA=null}
// Ariana sigue al jugador en la playa
hookAfter('update',function(dt){if(P.map!=='playa'||!PLAYA||!PLAYA.ari)return;const a=ENTS.find(e=>e.tmp==='playa');if(!a)return;const dx=P.x-a.x,dy=P.y-a.y,d=Math.hypot(dx,dy);
  if(d>24){const sp=Math.min(d-20,70*dt);const nx=a.x+dx/d*sp,ny=a.y+dy/d*sp;a.x=nx;a.y=ny;a.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0);a.anim=(a.anim||0)+dt*8;a.fr=Math.floor(a.anim)%4;a.moving=1}else{a.fr=0;a.moving=0}});
// la carretera ahora tiene dos destinos
{const ap=ACT_POINTS.find(a=>a.map==='ext'&&a.x===1&&a.y===21);if(ap){const run0=ap.run;ap.label='Tomar la carretera';ap.run=function(){const v=riding();if(!v||!VM[v.m].motor)return run0();
  const ch=[{t:'A San José (30 min)',f(){afterD(()=>driveTrip('chepe'))}},{t:'A Puntarenas, a la playa (2 h · ₡1 500 de peajes)',f(){
    const h=S.t/60;if(h>=15)return say(null,'Ya es muy tarde para ir a la playa. Mejor salí temprano otro día.');
    if(S.met&&S.met.ariana&&(S.f.arRel||0)>=8){say(null,'¿Le escribís a '+N('ariana')+' para que te acompañe?',[{t:'Invitar a '+N('ariana'),f(){if((S.f.arRel||0)>=14||Math.random()<.6){PLAYA_INV=1;say('ariana','¿¡A la playa!? ¡Dame cinco minutos que me pongo el vestido de baño! …Bueno, diez.')}else say('ariana','Ay, hoy no puedo, tengo que ayudarle a mi mamá con unas vueltas. ¡La próxima sí, porfa!');afterD(()=>playaTrip('playa'))}},{t:'Ir solo',f(){afterD(()=>playaTrip('playa'))}}])}
    else afterD(()=>playaTrip('playa'))}},{t:'Mejor no'}];say(null,'¿Para dónde agarrás?',ch)}}}
LOGROS.push(['playa','🌴','Puntarenas','Llegá a la playa en tu propio vehículo.',()=>stat('playa')>0,4],['atardecer','🌅','Atardecer en el muelle','Mirá el atardecer desde el muelle de Puntarenas.',()=>stat('atardecer')>0,3]);
// ---------------------------------------------------------------- fiesta en la terraza
function fiestaCasa(){const p=PGS(),h=S.t/60;if(!progTwoStory()||!U('terraza'))return say(null,'Para hacer fiesta primero necesitás la terraza.');if(h<17||h>=23)return say(null,'Las fiestas son de noche. Organizala entre las 5 y las 11 p. m.');
  if((p.fiesta||-99)>S.day-7)return say(null,'Ya hiciste fiesta esta semana. Los vecinos todavía se están recuperando.');if(S.money<15000)return say(null,'Para la comida y la bebida necesitás unos ₡15 000.');
  spend(15000,'Fiestas');p.fiesta=S.day;const cast=['ariana','nicolas','matias','kevin','rosa','mama'].filter(id=>CH[id]&&(id==='mama'||id==='rosa'||!S.met||S.met[id]));
  fadeDo(()=>{if(riding())progDismount(true);S.rain=0;if(S.t<19.5*60)S.t=19.5*60;P.map='ext';P.x=6*T+8;P.y=8*T+8;P.dir=0;const spots=[[4,7],[8,7],[5,9],[9,9],[3,8],[7,6]];cast.forEach((id,i)=>{const s=spots[i%spots.length];zPed('ext',s[0],s[1],Object.assign({},CH[id]),{stat:1,tmp:'fiesta',dir:0,reach:26,talk:()=>fiestaTalk(id)})});
    MAPS.ext.lights.push({x:6*T,y:7.5*T,r:90,pgFiesta:1});PGS().fiestaOn=1},()=>{
    say(null,'🎉 Lucecitas en la terraza, el parlante con cumbia y salsa, y una mesa con chifrijo, arroz con pollo, gallos de salchichón y un queque de tres leches.');
    if(hasD('sonido'))say(null,'El equipo de sonido retumba. Hasta Doña Rosa está moviendo el pie.');say(null,'Hablá con la gente. La fiesta dura hasta que el cuerpo aguante.');if(typeof progRep==='function')progRep(4+(comfort()>=26?2:0));runDialog()})}
const FIESTA_L={ariana:['¿Bailamos? …No, no sé bailar. Pero vos tampoco, así que estamos iguales.','Tu casa quedó preciosa. Nadie lo hubiera creído hace unos meses.'],nicolas:['Mae, la música la escogí yo. Por eso está buena.','¿Hay más chifrijo? Pregunto por un amigo. El amigo soy yo.'],matias:['Esta es la mejor fiesta del barrio desde el Mundial del 2014.','Brindo por vos, mae. Porque saliste adelante.'],kevin:['Diay, mop, ¡qué fiestón! ¿Y esa terraza? La hicieron bien, se nota que no la hice yo.','Si se le daña algo, me avisa. Pero hoy no, hoy se baila.'],rosa:['Mijo, qué bonito todo. Su mamá debe estar muy orgullosa.','Este arroz con pollo le quedó bueno… casi como el mío.'],mama:['Mi muchacho, con casa de dos pisos y fiesta en la terraza. Ay, se me sale una lágrima.','¿Ya comió? Coma, que está flaco.']};
function fiestaTalk(id){const k={ariana:'ar',mama:'lu'}[id];say(id,pick(FIESTA_L[id]||['¡Qué fiesta!']),[{t:'Bailar',f(){enAdd(-5);if(k)relAdd(k,1);say(null,pick(['Una cumbia, una salsa y un merengue. Terminás empapado de sudor y muerto de risa.','Pisás dos veces, pero nadie se da cuenta. O todos se dan cuenta y nadie dice nada.']))}},{t:'Brindar',f(){if(k)relAdd(k,.5);say(id,'¡Salud! ¡Pura vida!')}},{t:'Seguir circulando'}])}
function fiestaFin(){const p=S&&S.f&&S.f.pg;if(!p||!p.fiestaOn)return;p.fiestaOn=0;for(let i=ENTS.length-1;i>=0;i--)if(ENTS[i].tmp==='fiesta')ENTS.splice(i,1);const m=MAPS.ext;if(m)m.lights=m.lights.filter(l=>!l.pgFiesta);
  if(hasD('sonido')&&Math.random()<.3){toast('🚓 Un vecino llamó a la Fuerza Pública por el ruido. «Bajen eso, que es más de medianoche.» Multa de ₡10 000.');spend(Math.min(S.money,10000),'Multas')}else toast('🎉 La fiesta fue un éxito. Mañana todo el barrio va a hablar de eso.')}
hookBefore('ecoDay',function(){try{fiestaFin()}catch(e){}});
hookAfter('update',function(dt){const p=S&&S.f&&S.f.pg;if(p&&p.fiestaOn&&(S.t/60>=2.5&&S.t/60<6||P.map!=='ext'||P.y>16*T))fiestaFin()});
LOGROS.push(['fiesta','🎉','¡Fiestón!','Hacé una fiesta en tu terraza.',()=>(PGS().fiesta||0)>0,3]);
hookFilter('casaHTML',function(h){if(progTwoStory()&&U('terraza'))h+=`<h3>Fiesta en la terraza</h3><div class="qitem"><p>Invitá a los compas, a Doña Rosa y a tu mamá. Comida, música y lucecitas (₡15 000, de 5 a 11 p. m., una vez por semana).</p><button class="green" data-fiesta="1">🎉 Hacer una fiesta hoy</button></div>`;return h});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-fiesta]');if(!b)return;closePanel();fiestaCasa();runDialog()});
// ---------------------------------------------------------------- Asociación de Vecinos
const ASO_P={vigil:{n:'Barrio Vigilado',ic:'📢',c:25000,d:2,t:'Rótulos de «Barrio Vigilado» en las entradas y un chat de vecinos. Los robos bajan.'},
 luz:{n:'Alumbrado del callejón',ic:'💡',c:40000,d:3,t:'Faroles en el callejón y la Calle 3. De noche se ve todo y roban menos.'},
 basura:{n:'Jornada de limpieza',ic:'🧹',c:15000,d:1,t:'Basureros nuevos en la plaza y una jornada de limpieza con todo el barrio.'},
 mural:{n:'Mural de carreta típica',ic:'🎨',c:35000,d:3,t:'Un mural en la tapia de la plaza con los colores de una carreta de Sarchí.'},
 juegos:{n:'Play para los chiquitos',ic:'🛝',c:60000,d:4,t:'Columpios y tobogán en la plaza. Los chiquitos dejan de jugar en la calle.'}};
function ASO(){const p=PGS();if(!p.aso)p.aso={m:0,pres:0,f:0,done:{},obra:null,turno:-99,elec:-99};return p.aso}
const asoHas=k=>!!(S&&S.f&&S.f.pg&&S.f.pg.aso&&S.f.pg.aso.done[k]);
function asoNight(){const a=S&&S.f&&S.f.pg&&S.f.pg.aso;if(!a)return;if(a.obra&&S.day>=a.obra.fin){const k=a.obra.k;a.done[k]=S.day;a.obra=null;setTimeout(()=>{applyAso();renderMap(MAPS.ext)},60);
    setTimeout(()=>toast('🤝 ¡La Asociación terminó «'+ASO_P[k].n+'»! El barrio se ve mejor.'),2000);if(typeof progRep==='function')progRep(a.pres?10:6)}
  if(a.m&&!a.pres&&!a.obra){const k=Object.keys(ASO_P).find(x=>!a.done[x]&&a.f>=ASO_P[x].c);if(k){a.f-=ASO_P[k].c;a.obra={k,fin:S.day+ASO_P[k].d};setTimeout(()=>toast('🤝 La junta (presidida por Doña Rosa) aprobó «'+ASO_P[k].n+'». Empiezan mañana.'),3200)}}}
hookAfter('ecoDay',function(){try{asoNight()}catch(e){console.error(e)}});
function applyAso(){const m=MAPS.ext;if(!m)return;m.lights=m.lights.filter(l=>!l.aso);if(asoHas('luz'))for(const y of[67,71,75,79])m.lights.push({x:78*T+16,y:y*T,r:46,aso:1});
  if(asoHas('juegos'))for(let j=72;j<74;j++)for(let i=55;i<58;i++)m.s[j*m.w+i]=1;if(asoHas('mural'))for(let i=40;i<59;i++)m.s[77*m.w+i]=1}
hookAfter('startGame',function(){try{applyAso()}catch(e){}});
{const _vs=vSafe;vSafe=function(v){let r=_vs(v);if(v&&v.map==='ext'){if(asoHas('vigil'))r*=.6;if(asoHas('luz'))r*=.8}return r}}
// lo que se ve en el barrio
{const _sb=hdSurBase;hdSurBase=function(B,m){_sb(B,m);if(!S||!S.f||!S.f.pg||!S.f.pg.aso)return;
  if(asoHas('vigil'))for(const[x,y]of[[33,52],[77,65],[27,60]]){const X=x*HT,Y=y*HT;hdR(B,X+14,Y+4,3,28,[110,112,118]);hdSurSign(B,X-6,Y-10,44,18,'#f2c94c','VIGILADO','#1e1a24');hdText(B,X-2,Y+10,'ASOC. VECINOS',[30,26,30])}
  if(asoHas('basura'))for(const[x,y]of[[41,68],[56,68],[46,74],[60,74]]){const X=x*HT+20,Y=y*HT+8;hdEll(B,X+5,Y+16,7,3,[0,0,0],.25);hdR(B,X,Y,10,15,[42,111,176]);hdR(B,X-1,Y,12,3,[30,80,130]);hdR(B,X+3,Y+5,4,4,[240,240,240])}
  if(asoHas('juegos')){const X=55*HT,Y=72*HT;hdR(B,X-6,Y-4,3*HT+12,2*HT+8,[214,160,96]);for(let j=0;j<2*HT+8;j+=4)for(let i=0;i<3*HT+12;i+=5)if(hdr(X+i,Y+j)>.7)hdP(B,X-6+i,Y-4+j,[190,140,80]);
    hdR(B,X+4,Y+2,3,44,[214,69,60]);hdR(B,X+40,Y+2,3,44,[214,69,60]);hdR(B,X+4,Y+2,39,3,[214,69,60]);for(const sx of[X+14,X+30]){hdR(B,sx,Y+5,1,24,[60,60,66]);hdR(B,sx+5,Y+5,1,24,[60,60,66]);hdR(B,sx-1,Y+29,8,3,[42,111,176])}
    for(let k=0;k<26;k++)hdR(B,X+56+k*.6,Y+6+k*1.4,10,2,[242,201,76]);hdR(B,X+54,Y+2,14,6,[79,179,122]);hdR(B,X+56,Y+8,2,30,[150,150,156]);hdEll(B,X+70,Y+48,6,3,[0,0,0],.2)}
  if(asoHas('mural')){const X=40*HT,Y=77*HT,w=19*HT;hdR(B,X,Y-14,w,HT+14,[0,0,0],.15);hdR(B,X,Y-18,w,HT+10,[240,232,214]);hdR(B,X,Y-18,w,3,[200,190,170]);
    const cs=[[214,69,60],[242,201,76],[42,111,176],[79,179,122],[239,111,138],[240,140,60]];for(let i=0;i<10;i++){const cx=X+30+i*58,cy=Y-2;for(let r=16;r>0;r-=4)hdEll(B,cx,cy,r,r,cs[(i+r/4)%6]);for(let k=0;k<8;k++){const a=k*.785;hdLine(B,cx,cy,cx+Math.cos(a)*16,cy+Math.sin(a)*16,[30,26,30])}hdEll(B,cx,cy,3,3,[30,26,30])}
    for(let i=0;i<w;i+=8){const c=cs[(i/8|0)%6];hdR(B,X+i,Y-18,8,4,c);hdR(B,X+i,Y+HT-12,8,4,cs[((i/8|0)+3)%6])}}
  if(asoHas('luz'))for(const y of[67,71,75,79]){const X=78*HT+28,Y=y*HT;hdR(B,X,Y-6,4,8,[60,60,66]);hdEll(B,X+2,Y+3,4,3,[255,236,170])}}}
function asoTurno(){const a=ASO(),e=E();if(a.turno>S.day-7)return say(null,'Ya hicieron turno esta semana. Hay que dejar descansar a las señoras de los tamales.');if(e.en<25)return say(null,'Un turno cansa. Descansá primero.');a.turno=S.day;
  fadeDo(()=>{passTime(240);enAdd(-22)},()=>{const g=Math.round((15000+(PGS().rep||0)*60)*rnd(.8,1.25)/100)*100;a.f+=g;
    say(null,'🎪 ¡Turno en la plaza! Bingo, chicharrones, venta de arroz con leche, el palo encebado y una mascarada que asustó a todos los chiquitos.');say(null,pick(['Don Alexander ganó el bingo por tercera vez seguida. Ya hay quien dice que hace trampa.','La cimarrona tocó hasta las nueve. El barrio entero bailó «El Torito».','Se rifaron un cerdito. Lo ganó el diputado, que pasó «casualmente» por ahí.']));say(null,'La Asociación recogió '+fmtC(g)+' para los proyectos. Fondos: '+fmtC(a.f)+'.');
    if(typeof progRep==='function')progRep(3);runDialog();saveGame()})}
appReg({id:'aso',n:'Asociación',ic:'🤝',c:'#2a8f6a',html(){const a=ASO(),L=repLv();let h='';
  if(!a.m)return`<div class="qitem"><b>🤝 Asociación de Desarrollo de Mi Barrio</b><p>Los vecinos se organizan para arreglar el barrio: alumbrado, limpieza, juegos para los chiquitos… y hacen turnos para recoger plata.</p>${L>=1?`<button class="green" data-act="unir">Afiliarse (₡1 000)</button>`:'<p class="note">🔒 Necesitás ser «Conocido» en el barrio para que te acepten.</p>'}</div>`;
  h+=`<div class="qitem"><b>🤝 ${a.pres?'Sos el presidente de la Asociación':'Sos miembro de la Asociación'}</b><p>Fondos: <b>${fmtC(a.f)}</b>${a.obra?' · trabajando en «'+ASO_P[a.obra.k].n+'» (listo el día '+a.obra.fin+')':''}</p>${a.pres?'<p class="note">Como presidente, la Municipalidad pone el 40% de cada proyecto.</p>':'<p class="note">La junta escoge los proyectos cuando hay fondos.</p>'}
   <div class="row"><button data-act="don:5000">Donar ₡5 000</button> <button data-act="don:20000">Donar ₡20 000</button> <button class="green" data-act="turno">🎪 Organizar un turno</button></div></div>`;
  if(!a.pres)h+=`<div class="qitem"><b>🗳 Elecciones de la junta</b>${L>=4?`<p>Con tu respeto en el barrio podrías ganarle la presidencia a Doña Rosa.</p><button class="green" data-act="elec">Postularse a presidente</button>`:'<p class="note">🔒 Necesitás ser «Mae importante» para postularte.</p>'}</div>`;
  h+='<h3>Proyectos</h3>'+Object.entries(ASO_P).map(([k,p])=>{const c=a.pres?Math.round(p.c*.6):p.c;return`<div class="qitem"><b>${p.ic} ${p.n}${a.done[k]?' ✔':''}</b><p>${p.t}</p>${a.done[k]?'':`<p class="note">${fmtC(c)} · ${p.d} día${p.d>1?'s':''}</p>`+(a.pres&&!a.obra?`<button data-act="proy:${k}" ${a.f<c?'disabled':''}>Aprobar</button>`:'')}</div>`}).join('');return h},
 act(k,b){const a=ASO();
  if(k==='unir'){if(S.money<1000)return toast('No te alcanza');spend(1000,'Asociación');a.m=1;toast('🤝 Ahora sos miembro de la Asociación de Vecinos');if(typeof progRep==='function')progRep(2)}
  else if(k==='don'){const m=+b;if(S.money<m)return toast('No te alcanza');spend(m,'Asociación');a.f+=m;toast('🤝 Donaste '+fmtC(m)+'. Doña Rosa lo apuntó en el acta.');if(typeof progRep==='function')progRep(m>=20000?3:1)}
  else if(k==='turno'){closePanel();asoTurno();runDialog();return}
  else if(k==='elec'){if(a.elec>S.day-14)return toast('Las próximas elecciones son en '+(a.elec+14-S.day)+' días');a.elec=S.day;closePanel();const win=(PGS().rep||0)>=250&&Math.random()<.85;
    say(null,'🗳 Asamblea en el salón de la iglesia. Hay café, pan con natilla y mucha tensión.');say('rosa',win?'Mijo, la gente habló. Le paso el libro de actas… cuídelo como a un hijo.':'Gracias a todos por su voto de confianza… otra vez.');
    if(win){a.pres=1;say(null,'¡Ganaste por 7 votos! Don Alexander pidió recuento. Volviste a ganar por 7.');if(typeof progRep==='function')progRep(10)}else say(null,'Perdiste por 3 votos. Dicen que Doña Rosa trajo a toda la familia de Pérez Zeledón en buseta.');runDialog();return}
  else if(k==='proy'){const p=ASO_P[b],c=Math.round(p.c*.6);if(a.obra||a.f<c)return;a.f-=c;a.obra={k:b,fin:S.day+p.d};toast('🤝 Aprobaste «'+p.n+'». Listo el día '+a.obra.fin)}
  saveGame();appOpen('aso')}});
LOGROS.push(['aso','🤝','Junta directiva','Hacete miembro de la Asociación de Vecinos.',()=>!!(PGS().aso&&PGS().aso.m),2],['pres','🎖','Señor presidente','Ganá la presidencia de la Asociación.',()=>!!(PGS().aso&&PGS().aso.pres),8],['obras','🏗','Barrio nuevo','Terminá 3 proyectos de la Asociación.',()=>!!(PGS().aso&&Object.keys(PGS().aso.done).length>=3),6]);
// nombre del lugar y minimapa propio para Puntarenas y El Hoyo
{const _ml=mapLabel;mapLabel=function(m){if(m&&m.id==='playa')return'Puntarenas · Paseo de los Turistas';if(m&&m.id==='hoyo')return'El Hoyo';if(m&&m.id==='ext'&&P.y>52*T)return'El barrio · Calle 3';return _ml(m)}}
{const _dm=drawMini;drawMini=function(){const m=MAPS[P.map];if(!m||(m.id!=='playa'&&m.id!=='hoyo'))return _dm();const mc=$('#mini');if(!mc)return;const g=mc.getContext('2d'),src=m.base2||m.base;if(!src)return;
  const W=mc.width,H=mc.height,k=Math.max(W/(m.w*T),H/(m.h*T));g.fillStyle='#14101c';g.fillRect(0,0,W,H);g.imageSmoothingEnabled=true;const dw=m.w*T*k,dh=m.h*T*k,ox=Math.min(0,Math.max(W-dw,W/2-P.x*k)),oy=Math.min(0,Math.max(H-dh,H/2-P.y*k));
  g.drawImage(src,ox,oy,dw,dh);g.fillStyle='#fff';g.beginPath();g.arc(ox+P.x*k,oy+P.y*k,3.5,0,7);g.fill();g.fillStyle='#e8524a';g.beginPath();g.arc(ox+P.x*k,oy+P.y*k,2.2,0,7);g.fill()}}
