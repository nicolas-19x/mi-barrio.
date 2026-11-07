// ================= PUNTARENAS · FIESTA Y EXTRAS: EMBORRACHARSE (SIN MANEJAR), LA GOMA, LOGROS Y ARIANA EN LOS LUGARES ESCONDIDOS =================
// La borrachera vive en S.f.borr {lvl, t, mx:{d,v}} y baja sola (un nivel cada 45 minutos del juego). Desde 2 ya no se maneja:
// el juego te frena; si igual te la jugás, el retén de la Ruta 27 (o el del barrio) te hace la prueba y te multa.
var PZ_BORR_TXT=[[0,''],[2,'alegre'],[4,'picado'],[6,'bolo'],[8,'hasta el queque']];
function pzDrunkLvl(){const b=S&&S.f&&S.f.borr;if(!b||!b.lvl)return 0;const now=totalMinutes();if(now>b.t){b.lvl=Math.max(0,b.lvl-(now-b.t)/45);b.t=now}return b.lvl}
function pzDrunkName(l){let n='';for(const[k,t]of PZ_BORR_TXT)if(l>=k)n=t;return n}
function pzDrink(kind,who){pzDrunkLvl();const b=S.f.borr||(S.f.borr={lvl:0,t:totalMinutes()});b.t=totalMinutes();const add={birra:1.2,guaro:2.2,chili:1.6}[kind]||1;b.lvl+=add;if(!b.mx||b.mx.d!==S.day)b.mx={d:S.day,v:0};b.mx.v=Math.max(b.mx.v,b.lvl);
  enAdd(kind==='birra'?3:1);progStat('pzTrago');const l=b.lvl;
  const T1={birra:['Una Imperial bien fría, sudando en la mano. El primer trago sabe a vacaciones.','La birra está tan fría que te duele la frente. Perfecto.'],guaro:['Un guaro con fresco de cas. Te quema la garganta y te calienta el alma.','¡Uff! El guaro baja como fuego. Te sale un «¡ahhh!» sin querer.'],chili:['Un chiliguaro: guaro con chile y limón. Pica arriba y pica abajo.']}[kind]||['Salud.'];
  say(null,pick(T1));
  if(l>=9)return afterD(pzDesmayo);
  if(l>=6)say(null,pick(['El piso de la playa se mueve un poquito. ¿O es el mar? Ya no sabés.','Te reís solo de un chiste que nadie contó.','Le contás a un desconocido que lo querés mucho. Él también te quiere.']));
  else if(l>=4)say(null,pick(['Ya andás picado. Todo te parece chistosísimo.','Sentís la cara caliente y los cachetes dormidos.']));
  toast('🍺 Andás '+(pzDrunkName(l)||'tranquilo')+(l>=2?' · no podés manejar':''));
  if(PLAYA&&PLAYA.ari){if(l>=6){relAdd('ar',-.5);say('ariana',pick(['Ya, ya, suave… que después no te puedo cargar hasta el carro.','Mirá, te quiero, pero bolo sos insoportable 😂. Tomá agua.']))}else if(l>=3)say('ariana',pick(['¡Salud! …Pero de manejar ni hablar, ¿eh?','Esa es la última, ¿verdad? …¿Verdad?']));else say('ariana','¡Salud! 🍻')}
  saveGame()}
function pzSober(n){const b=S.f.borr;if(!b)return;b.lvl=Math.max(0,b.lvl-n)}
function pzDesmayo(){fadeDo(()=>{passTime(180);const lost=Math.round(S.money*rnd(.1,.3)/100)*100;if(lost>0)spend(lost,'Antojos');PZM.lost=lost;if(P.map==='playa'){P.x=86*T+8;P.y=24*T+12;P.deck=false;P.swim=false}S.f.borr.lvl=5;E().en=Math.max(5,E().en-20);progStat('pzDesmayo')},
  ()=>{say(null,'Abrís un ojo. Tenés arena en la boca, una chancleta que no es tuya y el sol de frente. Pasaron como tres horas.');if(PZM.lost)say(null,'La billetera está más liviana: te faltan '+fmtC(PZM.lost)+'. Nadie vio nada, claro.');
    say(fillChar({id:'z_pz_parlante',name:'Brayan',skin:'#8d5524',hair:'corto',hairColor:'#1c1c1c',shirt:'#d23038',pants:'#2a2a30',acc:'gorra',accColor:'#26262e',v:1}),'¡Upe, revivió! Mae, usted se durmió abrazado a mi hielera. Fue lo más lindo que he visto.');
    if(PLAYA&&PLAYA.ari){relAdd('ar',-2);say('ariana','…No me hablés. Bueno, sí, tomá agua. Me asustaste mucho, ¿sabés?')}runDialog();saveGame()})}
// el bar del Paseo
ACT_POINTS.push({map:'playa',x:32,y:4,label:'Entrar al Bar La Deriva',cond:()=>!riding(),run(){const h=S.t/60;if(h<11&&h>=3)return say(null,'El Bar La Deriva abre a las once. Por la ventana se ve a Don Kiko barriendo.');
  const K=fillChar({id:'z_pz_kiko',name:'Don Kiko',skin:'#b97a4a',hair:'calvo',hairColor:'#cfcfcf',shirt:'#2a4f7a',pants:'#2a2a30',acc:'bigote',v:1});
  say(K,pick(['Pase adelante, joven. Aquí la birra está fría y la música está vieja, como debe ser.','¡Bienvenido a La Deriva! Desde el 78 sirviendo al Puerto.']),[
    {t:'Una birra (₡1 800)',f(){if(S.money<1800)return say(K,'Diay, no le alcanza.');spend(1800,'Antojos');pzDrink('birra')}},
    {t:'Un guaro con fresco de cas (₡2 500)',f(){if(S.money<2500)return say(K,'No le alcanza, joven.');spend(2500,'Antojos');pzDrink('guaro')}},
    {t:'Un chiliguaro (₡2 000)',f(){if(S.money<2000)return say(K,'No le alcanza.');spend(2000,'Antojos');pzDrink('chili')}},
    {t:'Un chifrijo (₡4 500)',f(){if(S.money<4500)return say(K,'No le alcanza.');spend(4500,'Antojos');enAdd(22);pzSober(1);say(null,'Frijoles, chicharrón, arroz, pico de gallo y tortillitas. La base de cualquier noche buena. +22⚡')}},
    {t:'Un vaso de agua (₡500)',f(){if(S.money<500)return;spend(500,'Antojos');pzSober(.6);enAdd(2);say(K,'Así me gusta. El que toma agua amanece vivo.')}},{t:'Nada, gracias'}])}});
// caminar torcido y la pantalla que se mece
{const _mv=moveEnt;moveEnt=function(e,dx,dy){if(e===P&&P.map!=='playa'&&(dx||dy)){const r=pzDrunkMove(dx,dy);dx=r[0];dy=r[1]}return _mv(e,dx,dy)}}
function pzDrunkMove(dx,dy){const l=pzDrunkLvl();if(l<1.5||(!dx&&!dy)||riding())return[dx,dy];const k=Math.min(1,(l-1.5)/6),t=performance.now()/1000,s=Math.sin(t*1.3)*Math.sin(t*.7+1)+Math.sin(t*3.1)*.25,L=Math.hypot(dx,dy);
  return[dx+(-dy/L)*s*k*L*1.1,dy+(dx/L)*s*k*L*1.1]}
var PZ_WOB=0;
hookAfter('render',function(){const l=S&&S.f&&S.f.borr?pzDrunkLvl():0,c=$('#c');if(l>2.2&&mode!=='menu'){const t=performance.now()/1000,a=Math.min(1,(l-2.2)/6);c.style.transform='rotate('+(Math.sin(t*.8)*a*1.4).toFixed(2)+'deg) translate('+(Math.sin(t*1.25)*a*6).toFixed(1)+'px,'+(Math.sin(t*.9+1)*a*3).toFixed(1)+'px) scale('+(1+a*.04).toFixed(3)+')';PZ_WOB=1}
  else if(PZ_WOB){c.style.transform='';PZ_WOB=0}});
var PZ_BOLO=['Le querés decir algo serio, pero te sale «¡Mae, lo quiero mucho!».','Te tropezás con tu propio pie y lo disimulás como si fuera un paso de baile.','*hip*','Hablás más fuerte de lo normal. Bastante más fuerte.','Le preguntás la hora tres veces seguidas.'];
hookBefore('interact',function(){if(mode!=='play'||fading||!target)return;if((target.type==='ped'||target.type==='npc')&&pzDrunkLvl()>=3.5&&Math.random()<.45)say(null,pick(PZ_BOLO))});
// la goma del día siguiente
hookAfter('ecoDay',function(){const b=S.f.borr;if(b&&b.mx&&b.mx.d===S.day-1&&b.mx.v>=4)S.f.goma=S.day;if(S.f.licSusp&&S.day>=S.f.licSusp.day){PGS().lic[S.f.licSusp.k]=1;toast('🪪 Te devolvieron la licencia. Ahora sí, nada de guaro al volante.');delete S.f.licSusp}});
hookAfter('update',function(dt){if(mode!=='play'||fading||!S||!S.f)return;
  if(S.f.goma===S.day&&S.f.gomaOk!==S.day&&hour()>=5){S.f.gomaOk=S.day;const e=E();e.en=Math.max(0,e.en-25);progStat('pzGoma');setTimeout(()=>toast('🤕 Amaneciste de goma: la cabeza te late y la luz te duele. −25⚡. Agua, pinto y paciencia.'),600)}
  if(S.f.pzRetPend&&P.map==='ext'){delete S.f.pzRetPend;pzReten('la Ruta 27, en Atenas')}
  // manejar tomado en el barrio o en Chepe: tarde o temprano sale un retén
  const v=typeof riding==='function'&&riding();if(v&&VM[v.m].motor&&pzDrunkLvl()>=2&&P.map!=='playa'){PZM.retT=(PZM.retT||0)+dt;if(PZM.retT>25){PZM.retT=0;if(Math.random()<.35)pzReten(P.map==='chepe'?'la Avenida Segunda':'la entrada del barrio')}}});
function pzReten(donde){const v=typeof riding==='function'&&riding();const c=v?VM[v.m]:null;const O=fillChar({id:'z_pz_transito',name:'Oficial de Tránsito',skin:'#8d5524',hair:'corto',hairColor:'#1c1c1c',shirt:'#2d3a6e',pants:'#2a2a30',acc:'gorra',accColor:'#2d3a6e',v:1});
  mode='dialog';for(const k in KEYS)KEYS[k]=0;const multa=280000,paga=Math.min(S.money,multa);
  say(null,'🚔 Retén en '+donde+'. Un oficial te hace la seña con la linterna.');say(O,'Buenas noches. Licencia y… sople aquí, por favor. Fuerte.');
  say(null,'El alcoholímetro pita feo. El oficial ni se sorprende.');say(O,'Usted anda tomado, joven. Eso es multa de ₡280 000, la licencia suspendida y el vehículo no se mueve hasta que venga alguien sobrio.');
  if(paga)spend(paga,'Multas');say(null,'Pagás '+fmtC(paga)+(paga<multa?' (todo lo que tenías; el resto te lo cobran con el marchamo)':'')+'.');
  if(c&&c.lic&&PGS().lic[c.lic]){PGS().lic[c.lic]=0;S.f.licSusp={k:c.lic,day:S.day+3};say(null,'Te suspenden la licencia por tres días.')}
  if(v){progDismount(true)}delete S.f.borrDrive;progStat('pzReten');say(O,'Tiene suerte de que lo paramos nosotros y no un poste. Váyase caminando y tome agua.');runDialog();saveGame()}
// no se maneja tomado
{const _pm=progMount;progMount=function(v){const c=VM[v.m],l=pzDrunkLvl();if(!c||!c.motor||l<2||S.f.borrDrive||(PLAYA&&PLAYA.ariDrive))return _pm(v);
  const ch=[{t:'Esperar a que se me pase (~'+Math.ceil((l-1.5)*45/60*10)/10+' h)',f(){afterD(()=>fadeDo(()=>{passTime(Math.ceil((l-1.5)*45));pzDrunkLvl()},()=>{toast('😌 Ya se te pasó. Ahora sí podés manejar.');saveGame()}))}}];
  if(P.map==='playa'&&PLAYA&&PLAYA.ari&&(S.f.arRel||0)>=10)ch.push({t:'Que maneje '+N('ariana'),f(){PLAYA.ariDrive=1;say('ariana','Dame esas llaves. Vos te vas de copiloto y calladito. …Bueno, podés poner música.');relAdd('ar',1);afterD(()=>_pm(v))}});
  ch.push({t:'Manejar así (te la jugás)',f(){S.f.borrDrive=1;toast('⚠️ Manejar tomado: hay retenes y la multa es de ₡280 000');afterD(()=>_pm(v))}},{t:'Mejor no'});
  say(null,'Mae, así no. Andás '+(pzDrunkName(l)||'tomado')+'. Con guaro no se maneja.',ch);runDialog()}}
{const _pt=playaTrip;playaTrip=function(to){const l=pzDrunkLvl();if(to==='ext'&&l>=2&&!S.f.borrDrive&&!(PLAYA&&PLAYA.ariDrive)){
    const ch=[{t:'Esperar a que se me pase',f(){afterD(()=>fadeDo(()=>{passTime(Math.ceil((l-1.5)*45));pzDrunkLvl()},()=>{toast('😌 Ya se te pasó.');saveGame()}))}}];
    if(PLAYA&&PLAYA.ari&&(S.f.arRel||0)>=10)ch.push({t:'Que maneje '+N('ariana'),f(){PLAYA.ariDrive=1;say('ariana','Yo manejo. Vos dormite, que roncás bonito.');afterD(()=>_pt(to))}});
    ch.push({t:'Manejar así (te la jugás)',f(){S.f.borrDrive=1;S.f.pzRetPend=1;afterD(()=>_pt(to))}},{t:'Quedarme un rato más'});
    say(null,'Son dos horas por la Ruta 27 y andás '+(pzDrunkName(l)||'tomado')+'. Así no se maneja.',ch);return runDialog()}
  if(to==='ext'&&S.f.borrDrive&&l>=2)S.f.pzRetPend=1;
  return _pt(to)}}
hookAfter('playaEnd',function(){delete S.f.borrDrive});
// nadar bolo
hookAfter('update',function(dt){if(P.map!=='playa'||!P.swim||mode!=='play')return;const l=pzDrunkLvl();if(l>=5){enAdd(-dt*.3);if(!PZM.boloW){PZM.boloW=1;toast('🥴 Nadar bolo es la peor idea del mundo. Salí del agua.')}}else PZM.boloW=0});
// ---------------------------------------------------------------- Ariana en los lugares escondidos
var PZ_ARI_SIT={
  manglar:{q:'¿Cómo encontraste este lugar? Parece de película… o de película de miedo, todavía no sé.',c:[['«Lo encontré buscando un lugar solo para nosotros»',3,'…Ay. No me digás eso así, que me pongo roja. Bueno, ya me puse roja.'],['«Seguí un trillo de cangrejos»',1,'¡Jajaja! Sos un explorador. Un explorador de cangrejos.']]},
  muelle:{q:'Aquí abajo el mar suena diferente… como si estuviéramos adentro de una caracola gigante.',c:[['Contarle un secreto',3,'Yo de chiquita quería ser bióloga marina. Dejé el colegio para ayudar en la casa… pero todavía me sé el nombre de todos los peces.'],['Quedarse callados oyendo el mar',2,'Ella recuesta la cabeza en tu hombro. Arriba pasa gente por el muelle y nadie sabe que están aquí.']]},
  caleta:{q:'Saltamos piedras como chiquillos para llegar aquí. Valió la pena. Esto es como tener el mar para nosotros solos.',c:[['«Algún día nos venimos a vivir a la playa»',2,'¿Me lo prometés? …No, no me lo prometás. Hacelo y ya.'],['Tirar piedritas al mar',1,'Tu piedra rebota tres veces. La de ella, siete. «Práctica», dice, y se ríe.']]}};
function pzSitTalk(k){const ari=PLAYA&&PLAYA.ari;
  if(!ari){say(null,{manglar:'Entre los mangles se oyen los cangrejos caminando. El estero huele a sal y a hojas mojadas.',muelle:'Arriba retumban los pasos de la gente en el muelle. Aquí abajo, nadie sabe que existís.',caleta:'Del otro lado de las piedras, el Paseo ni se oye. Solo el mar, un almendro y vos.'}[k]);return}
  const s=PZS();s.ariSit=s.ariSit||{};const A=PZ_ARI_SIT[k];
  if(!s.ariSit[k]){s.ariSit[k]=1;say('ariana',A.q,A.c.map(([t,r,ans])=>({t,f(){relAdd('ar',r);if(ans.startsWith('Ella')||ans.startsWith('Tu piedra'))say(null,ans);else say('ariana',ans)}})))}
  else say('ariana',pick(['Me gusta que aquí nadie nos encuentra.','Si me quedo dormida, me despertás para el atardecer, ¿sí?','Contame algo que nunca le hayas contado a nadie.','Shhh… oí las olas.']))}
function pzSitHour(k){const h=S.t/60;if(!(PLAYA&&PLAYA.ari))return;if(h>=17.2&&h<18.8){progStat('pzAriSunset');relAdd('ar',2);say('ariana','Mirá… el sol se está metiendo en el mar. Nunca había visto un atardecer así, desde un lugar escondido, con alguien que…');say('ariana','…con vos. Ya. Lo dije.',[{t:'Darle un beso',f(){relAdd('ar',3);say(null,'El cielo se pone naranja, después rosado. Ninguno de los dos se acuerda después de qué color se puso al final.')}},{t:'Abrazarla',f(){relAdd('ar',2);say(null,'Se quedan abrazados hasta que salen las primeras estrellas sobre el golfo.')}}]);runDialog()}
  else if(h>=19||h<5){say('ariana','Mirá cuántas estrellas. En el barrio con las luces no se ven ni la mitad.');runDialog()}}
// ---------------------------------------------------------------- logros
LOGROS.push(['pzSecretos','🌴','Lugares escondidos','Encontrá los tres lugares escondidos de Puntarenas.',()=>!!(S.f.pg&&S.f.pg.pz&&Object.keys(S.f.pg.pz.sec||{}).length>=3),6],
  ['pzGol','⚽','Gol en la playa','Meté un gol en la mejenga de los chamacos.',()=>stat('pzGol')>0,2],
  ['pzBanana','🍌','Jinete de banana','Aguantá todas las curvas de la banana sin caerte.',()=>stat('pzBananaFull')>0,3],
  ['pzDelfin','🐬','Delfines del golfo','Mirá delfines en el paseo en lancha.',()=>stat('pzDelfin')>0,3],
  ['pzBoyas','🟠','Hasta las boyas','Nadá hasta las boyas de Puntarenas.',()=>stat('pzBoyas')>0,1],
  ['pzGoma','🤕','Goma de playa','Amanecé de goma después de una noche en el Puerto.',()=>stat('pzGoma')>0,1],
  ['pzAri','💛','Atardecer escondido','Mirá el atardecer con Ariana desde un lugar escondido.',()=>stat('pzAriSunset')>0,4]);
