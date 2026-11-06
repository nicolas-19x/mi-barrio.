// ================= ROMANCE: RELACIÓN + CELULAR + MANDADOS =================
const nowM=()=>S.day*1440+S.t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuf=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
const fmtM=m=>{const t=Math.floor(((m%1440)+1440)%1440),h=Math.floor(t/60),mi=t%60;return(h%12||12)+':'+String(mi).padStart(2,'0')+(h<12?' a. m.':' p. m.')};
const noEmoji=s=>String(s).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,'').replace(/\s+([.,!?])/g,'$1').replace(/\s{2,}/g,' ').trim();
const cap1=s=>s.charAt(0).toUpperCase()+s.slice(1);
const AR_TIERS=['Dolida','Tibia','Contenta','Enamorada','Inseparables'];
const OP_TIERS=['Desconfía','Serio','Te tolera','Te respeta','Ya es de la casa'];
const LU_TIERS=['Preocupada','Amable','Te quiere','Como un hijo'];
const arTierOf=r=>r<-5?0:r<5?1:r<15?2:r<30?3:4;
const opTierOf=o=>o<0?0:o<1?1:o<2.5?2:o<4?3:4;
const luTierOf=l=>l<0?0:l<2?1:l<5?2:3;
const arTier=()=>arTierOf(S.f.arRel||0),opTier=()=>opTierOf(S.f.opinion||0),luTier=()=>luTierOf(S.f.luRel||0);
const WHO={ar:{key:'arRel',lim:[-20,45],tiers:AR_TIERS,of:arTierOf,id:'ariana',ic:'💛'},op:{key:'opinion',lim:[-3,6],tiers:OP_TIERS,of:opTierOf,id:'papa',ic:'🧔'},lu:{key:'luRel',lim:[-2,8],tiers:LU_TIERS,of:luTierOf,id:'mama',ic:'🍲'}};
function relAdd(k,n){const w=WHO[k],old=S.f[w.key]||0,nv=clamp(+(old+n).toFixed(2),w.lim[0],w.lim[1]);S.f[w.key]=nv;const d=nv-old;
 if(k==='ar'&&d)S.f.arM=null;
 if(k==='ar'?Math.abs(d)>=1:Math.abs(d)>=.5)toast((d>0?w.ic+' +':'💔 −')+(Math.round(Math.abs(d)*10)/10)+' · '+N(w.id));
 const a=w.of(old),b=w.of(nv);if(b>a)setTimeout(()=>toast('★ '+N(w.id)+': '+w.tiers[b]),900);else if(b<a)setTimeout(()=>toast('▼ '+N(w.id)+': '+w.tiers[b]),900);
 if(k==='op'&&nv>=4&&!S.f.opHome){S.f.opHome=1;phQueue('ariana',`MAE. ¿QUÉ LE HICISTE A MI PAPÁ? Acaba de decirle a mi mamá que sos «buen muchacho». ¡Con esas palabras! 😭💛`,4);relAdd('ar',3)}}
function arHurt(why,n){S.f.arWhy=why;relAdd('ar',-n);S.f.arM=null;S.f.arSoft=0}
const MOODS={alegre:'de buen humor',chistosa:'con ganas de bromear',pensativa:'pensativa',cansada:'cansada',romantica:'cariñosa',molesta:'molesta'};
function arMood(){const f=S.f;if(f.arM&&f.arM.d===S.day)return f.arM.m;let m;const x=hsh(S.day,41);
 if(f.arWhy||(f.arRel||0)<-5)m='molesta';else if(S.rain&&x<.5)m='pensativa';else if(arTier()>=3&&x<.28)m='romantica';else m=x<.4?'alegre':x<.62?'chistosa':x<.8?'cansada':'pensativa';
 f.arM={d:S.day,m};return m}
const AR_LIKES={queque:'el queque de naranja',pandepina:'el pan de piña con jalea',fresco:'un fresco de cas bien frío',chicle:'los confites con chicle de menta'};
const AR_SHORT={queque:'Queque de naranja',pandepina:'Pan de piña',fresco:'Fresco de cas',chicle:'Confites y chicle'};
function arLike(){if(!S.f.arLike)S.f.arLike=['queque','pandepina','fresco','chicle'][Math.floor(Math.random()*4)];return S.f.arLike}
const arSeen=()=>{S.f.arLast=S.day};

// ---------- estado del celular ----------
const PHV={open:0,th:null,tab:'chats'};
let phAcc=0,phDL='';
function PH(){const f=S.f;if(!f.ph)f.ph={th:{},un:{},wait:{},ped:[],q:[],sent:{},ld:S.day,st:{},known:{},cl:{},lastErr:{}};const p=f.ph;
 for(const k of['ariana','mama','papa']){if(!p.th[k])p.th[k]=[];if(p.un[k]==null)p.un[k]=0}
 for(const k of['th','un','wait','sent','known','cl','lastErr','st'])if(!p[k])p[k]={};if(!p.ped)p.ped=[];if(!p.q)p.q=[];
 for(const k of['ped','fail','dates','tests','gifts','dichos'])if(p.st[k]==null)p.st[k]=0;return p}
const phOn=k=>k==='ariana'?qs('barra')===2:k==='mama'?!!PH().luNum:k==='papa'?!!PH().papaNum:false;
const phVisible=()=>PHV.open&&$('#panel')&&!$('#panel').classList.contains('hidden')&&$('#ptitle').textContent==='Celular';
const totalUn=()=>{const u=PH().un;return(u.ariana||0)+(u.mama||0)+(u.papa||0)};
function phBadge(){const b=$('#phBadge');if(!b)return;const n=S&&S.started?totalUn():0;b.textContent=n||'';b.style.display=n?'inline-block':'none'}
function phMsg(who,text,ask){const p=PH();p.th[who].push({me:0,t:text,d:S.day,m:Math.floor(S.t)});if(p.th[who].length>60)p.th[who].shift();
 if(!(phVisible()&&PHV.th===who))p.un[who]++;
 if(ask)p.wait[who]={key:ask.key,ctx:ask.ctx||{},at:nowM()};
 if(!(phVisible()&&PHV.th===who)){toast('📱 '+N(who)+': '+(text.length>44?text.slice(0,42)+'…':text));beepSeq([988,1318])}
 phBadge();if(phVisible())phRender()}
function phMe(who,text){const p=PH();p.th[who].push({me:1,t:text,d:S.day,m:Math.floor(S.t)})}
function phQueue(who,text,delay,ask){if(!phOn(who)&&who!=='ariana')PH();PH().q.push({at:nowM()+(delay==null?rnd(2,7):delay),who,text,ask:ask||null})}
const ASKS={};
function phChoose(who,i){const p=PH(),w=p.wait[who];if(!w||!ASKS[w.key])return;const opts=ASKS[w.key](w.ctx),ch=opts[i];if(!ch)return;p.wait[who]=null;phMe(who,ch.t);
 if(ch.a)relAdd('ar',ch.a);if(ch.o)relAdd('op',ch.o);if(ch.l)relAdd('lu',ch.l);if(who==='ariana')arSeen();
 if(ch.f)ch.f(w.ctx);let r=ch.r;if(r&&typeof r==='object'&&!Array.isArray(r))r=r[w.ctx.mood]||r._;if(Array.isArray(r))r=pick(r);if(typeof r==='function')r=r(w.ctx);
 if(r)phQueue(who,r,rnd(1,4));beep(700,.05,'square',.03);saveGame();phRender()}
function phLeft(who){const p=PH(),sk='left_'+who;if(p.sent[sk])return;p.sent[sk]=1;
 if(who==='ariana'){arHurt('visto',1);phQueue('ariana',pick([`ok 🙄`,`visto. ya vi que lo viste 😶`,`jaja bueno, ahí me contás... algún día`]),1)}
 else if(who==='mama'){relAdd('lu',-.15);phQueue('mama',`No se preocupe, mijo, ya sé que anda ocupado. Dios lo cuide. 🙏`,1)}
 else{relAdd('op',-.25);phQueue('papa',`Nada. Olvídelo. — A.`,1)}}

// ---------- mandados ----------
const PEDS=[
 {id:'lu1',who:'mama',item:'tortillas',n:1,pay:700,hrs:6,t:()=>`Mijo, ¿me hace un favorcito? Se me acabaron las tortillas y la cena no se hace sola. ¿Me trae un paquete de la pulpería? 🙏`},
 {id:'lu2',who:'mama',item:'pandepina',n:2,pay:900,hrs:5,t:()=>`Ocupo dos panes de piña para el cafecito de las tres, que vienen visitas. Se lo agradezco, mi amor ❤`},
 {id:'lu3',who:'mama',item:'queso',n:1,pay:1000,hrs:6,t:()=>`Un queso Turrialba, mijo, del fresquito, para las tortillas con natilla. Dios se lo pague.`},
 {id:'lu4',who:'mama',item:'natilla',n:1,pay:800,hrs:6,t:()=>`¿Me trae una natilla? Es que ${N('papa')} no come el gallo pinto sin natilla y se acabó. ¡No le diga que se lo conté! 🤫`},
 {id:'lu5',who:'mama',item:'tomate',n:3,pay:1400,hrs:14,t:()=>`Si le sobran tomates de la huerta, tráigame tres para el picadillo, mi amor. Los de la huerta saben a tomate de verdad. Si no, no importa.`},
 {id:'lu6',who:'mama',item:'cafe',n:1,pay:900,hrs:5,t:()=>`Se me acabó el café y yo sin café no respondo 😅 Una bolsita, mijo, por lo que más quiera.`},
 {id:'lu7',who:'mama',item:'tapadulce',n:1,pay:900,hrs:5,c:()=>S.rain||period()==='t'||period()==='e',t:()=>`Con esta lluvia pide agua dulce con queso. ¿Me trae una tapa de dulce de la pulpería, mijo?`},
 {id:'lu8',who:'mama',item:'huevos',n:1,pay:1000,hrs:6,t:()=>`Un cartón de huevos para las tortas de mañana, mi amor. Que no se le quiebren en el camino, ¿ah?`},
 {id:'lu9',who:'mama',item:'pozuelo',n:1,pay:700,hrs:6,t:()=>`Vienen ${N('marta')} y sus nietos y no tengo ni una galleta en la casa. ¿Me trae unas Pozuelo? 😬`},
 {id:'ca1',who:'papa',item:'salchichon',n:1,pay:800,hrs:6,t:()=>`Salchichón. Para el gallo pinto de mañana. Antes de que se haga tarde. — Alexander`},
 {id:'ca2',who:'papa',item:'imperial',n:2,pay:1100,hrs:6,t:()=>`Dos imperiales sin alcohol. El doctor dice «sin». El doctor no manda en mi sed. Bien frías. — A.`},
 {id:'ca3',who:'papa',item:'cafe',n:1,pay:900,hrs:6,t:()=>`Café molido. Del bueno. Si no hay, no regrese. — Alexander`},
 {id:'ca4',who:'papa',item:'picadillo',n:1,pay:1800,hrs:16,c:()=>(S.f.opinion||0)>=2,t:()=>`Dicen que usted cocina. Tráigame un picadillo hecho por sus propias manos. A ver si es cierto. — Alexander`},
 {id:'ca5',who:'papa',item:'tomate',n:2,pay:900,hrs:12,t:()=>`Dos tomates de la huerta. Los de la pulpería saben a agua. — A.`},
 {id:'ca6',who:'papa',item:'tapadulce',n:1,pay:800,hrs:6,t:()=>`Una tapa de dulce. La tarde está para agua dulce. — A.`},
 {id:'ar1',who:'ariana',item:'*like',n:1,pay:0,hrs:5,t:()=>PH().known.like?`mae, traeme mi antojo de siempre 😌 vos sabés cuál`:`mae, traeme mi antojo de siempre 😌 (sí, tenés que acordarte)`},
 {id:'ar2',who:'ariana',item:'fresco',n:1,pay:0,hrs:5,c:()=>period()==='t'||period()==='e',t:()=>`me estoy derritiendo 🥵 traeme un fresco de cas bien frío y te perdono lo que sea`},
 {id:'ar3',who:'ariana',item:'queque',n:1,pay:1800,hrs:7,t:()=>`hoy es cumple de mi tía y se me olvidó el regalo 😭 ¿me salvás con un queque de naranja? yo te lo pago`},
 {id:'ar4',who:'ariana',item:'chicle',n:1,pay:0,hrs:5,t:()=>`ando sin aliento jajaja traeme unos confites con chicle de menta, urgente 🍬`},
 {id:'ar5',who:'ariana',item:'pozuelo',n:1,pay:300,hrs:6,t:()=>`mae me dio hambre estudiando 😩 traeme unas galletas Pozuelo y quedamos a mano`}];
const pedActive=who=>PH().ped.filter(d=>d.who===who&&!d.done&&!d.fail);
const pedItemName=d=>(d.n>1?d.n+' × ':'')+itemName(d.item);
const pedReady=who=>pedActive(who).some(d=>(S.inv[d.item]||0)>=d.n);
function pedAvail(d){const it=d.item==='*like'?arLike():d.item;if(typeof CATALOG!=='undefined'&&CATALOG.some(c=>c.id===it)){try{return shopOffer(it).avail}catch(e){return true}}return true}
function pedPick(who){const p=PH(),c=PEDS.filter(d=>d.who===who&&(!d.c||d.c())&&pedAvail(d)&&((p.lastErr[d.id]||-9)<S.day-3));return c.length?pick(c):null}
function pedNew(d){const p=PH(),item=d.item==='*like'?arLike():d.item;if(p.ped.some(x=>x.k===d.id&&!x.done&&!x.fail))return null;
 let pay=d.pay;if(pay>0&&typeof PRICES!=='undefined'&&PRICES[item])pay=Math.max(pay,Math.round((PRICES[item]*d.n+350)/100)*100);
 const o={k:d.id,who:d.who,item,n:d.n,pay,t0:nowM(),due:nowM()+d.hrs*60,done:0,fail:0};p.ped.push(o);p.lastErr[d.id]=S.day;
 const act=p.ped.filter(x=>!x.done&&!x.fail),old=p.ped.filter(x=>x.done||x.fail).slice(-6);p.ped=old.concat(act);toast('📝 Nuevo mandado de '+N(d.who));phBadge();return o}
function pedFail(d){d.fail=1;PH().st.fail++;
 if(d.who==='ariana'){arHurt('mandado',2);phQueue('ariana',pick([`ya no hace falta 🙄 me conseguí otra cosa`,`no te preocupés. de verdad. (sí te preocupás)`,`olvidalo. ya lo resolví yo, como siempre.`]),1)}
 else if(d.who==='mama'){relAdd('lu',-.4);relAdd('op',-.1);phQueue('mama',`Mijo, no se preocupe, ya fue ${N('papa')} a buscarlo. Pero la próxima avíseme si no puede, ¿sí? Dios lo bendiga.`,1)}
 else{relAdd('op',-.7);phQueue('papa',`Resuelto. Fui yo. A mi edad. Palabra que no se cumple... no es palabra. — Alexander`,1)}
 phBadge();if(phVisible())phRender()}
function pedDeliver(d){const id=d.who,p=PH();for(let i=0;i<d.n;i++)remI(d.item);d.done=1;p.st.ped++;
 if(id!=='ariana'){S.activities.stats.inlaw=(S.activities.stats.inlaw||0)+1;checkBadges()}
 const left=(d.due-nowM())/(d.due-d.t0),fast=left>.5,hand=d.item==='tomate'||d.item==='picadillo';const kd='pd_'+id;p.sent[kd]=(p.sent[kd]||0)+1;const DM=p.sent[kd]===1?1:p.sent[kd]===2?.5:.25;if(DM<1)toast('Ya ayudaste bastante hoy: pesa menos');
 if(d.pay){S.money+=d.pay;toast('+ ₡'+d.pay)}
 if(id==='ariana'){arSeen();const fav=d.k==='ar1'&&d.item===arLike();relAdd('ar',(2.5+(fast?1:0)+(fav?1:0))*DM);if(fav)arLearn('like');
  say(id,pick([`¡Mae, sos un amor! Justo lo que ocupaba.`,`¡Ay, gracias! Me salvaste la tarde.`,`Mirá vos, sí sirvés para algo 😏`]));
  say(id,fav?`Mi antojo de siempre. ${PH().known.like?'Te acordaste':'Hasta eso adivinaste'}... qué tierno 🥹`:fast?`Y rapidísimo. Me impresionás.`:`Tardaste, pero llegaste. Eso cuenta, ¿eh?`);
  if(d.pay)say(id,`Tomá, para que no digás que te exploto: ₡${d.pay}.`)}
 else if(id==='mama'){relAdd('lu',(1+(fast?.4:0)+(hand?.3:0)+(d.item==='natilla'?.6:0))*DM);relAdd('op',.2*DM);
  say(id,pick([`¡Ay, Dios se lo pague, mijo! Mire qué bueno es.`,`¡Qué dicha tener quien ayude! Gracias, mi amor.`,`¡Bendito sea, justo lo que me faltaba!`]));
  say(id,hand?`¿Y esto es de la huerta suya? Mire qué bonito. Se nota el cariño.`:fast?`Y qué rapidito, ni tuve que preguntar dos veces.`:`Ya casi me daba pena pedirle otra vez. Gracias, mi amor.`);
  if(d.pay)say(id,`Tome su platita. No se la regalo, se la gana.`)}
 else{relAdd('op',(.8+(fast?.4:0)+(hand?.5:0)+(d.k==='ca4'?.8:0))*DM);
  say(id,d.k==='ca4'?`Hmm... ¿Esto lo hizo usted? ...Siéntese. Coma conmigo.`:pick([`Hmm. Está bien.`,`...Correcto.`,`Cumplió. Eso es lo que cuenta.`]));
  say(id,hand?`Con sus propias manos. No está mal. No está nada mal.`:fast?`Rápido. Eso se aprecia.`:`Tarde, pero cumplió. Más vale tarde que nunca.`);
  const dd=pick(DICHOS);say(id,`Como dice el dicho: «${dd.a} ${dd.c}».`);if(d.pay)say(id,`Tenga. Mi palabra y ₡${d.pay}.`)}
 if(Math.random()<.45)phQueue(id,id==='ariana'?pick([`gracias, de verdad 💛`,`me hacés falta cuando no estás 😌`]):id==='mama'?`Mijo, que Dios le multiplique. Venga a comer cuando quiera. ❤`:`Gracias. — A.`,rnd(8,25));
 saveGame();phBadge()}
function pedTry(id){const r=pedActive(id).find(d=>(S.inv[d.item]||0)>=d.n);if(r){pedDeliver(r);return true}return false}
function pedRemind(id){const l=pedActive(id)[0];if(!l)return;const left=Math.max(0,l.due-nowM());
 say(id,id==='ariana'?`¿Y mi mandado? Eran ${pedItemName(l)}. Tengo hasta las ${fmtM(l.due)} ...o sea, vos tenés.`:id==='mama'?`¿Anda buscando lo mío, mijo? Era ${pedItemName(l)}. Sin prisa... bueno, antes de las ${fmtM(l.due)}`:`El mandado: ${pedItemName(l)}. Antes de las ${fmtM(l.due)} — ${left<90?'El tiempo corre.':'Sin vueltas.'}`)}
function pedOffer(who,cb){const id=who;if(pedActive(who).length){pedRemind(id);return}
 const d=pedPick(who);if(who==='papa'&&opTier()<2){say(id,pick([`No ocupo nada. Cuando ocupe, aviso.`,`Los mandados se los pido a quien conozco. Y a usted todavía lo estoy conociendo.`]));return}
 if(!d){say(id,who==='mama'?`Ahora no, mi amor. Gracias por preguntar. ¡Qué bueno es!`:who==='ariana'?`mmm... ahora no se me ocurre nada. disfrutá el rato libre 😌`:`Nada por ahora.`);return}
 say(id,noEmoji(d.t()),[{t:`Cuente conmigo`,f(){pedNew(d);say(id,who==='papa'?`Antes de las ${fmtM(nowM()+d.hrs*60)} No me falle.`:who==='mama'?`¡Dios se lo pague! Tiene hasta las ${fmtM(nowM()+d.hrs*60)}, mijo.`:`Tenés hasta las ${fmtM(nowM()+d.hrs*60)} Después... diay, ya sabés 😏`)}},{t:`Ahora no puedo`,f(){if(who==='papa')relAdd('op',-.2);else if(who==='mama')relAdd('lu',-.2);else relAdd('ar',-.5);say(id,who==='papa'?`Ajá.`:who==='mama'?`No se preocupe, mijo. Ya buscaré quién.`:`Bueno... qué pena. Otro día.`)}}])}

// ---------- hilos: respuestas ----------
ASKS.ped=c=>{const d=PEDS.find(x=>x.id===c.id),w=d.who,acc=()=>pedNew(d);
 if(w==='mama')return[
  {t:`Ya voy, doña Lucía 🙏`,l:.1,f:acc,r:()=>`Dios se lo pague, mijo. Tiene hasta las ${fmtM(nowM()+d.hrs*60)} ❤`},
  {t:`¿Y qué gano yo? jaja`,l:.1,f:acc,r:()=>`¡Ay, mijo! Mi bendición y ₡${d.pay}. Antes de las ${fmtM(nowM()+d.hrs*60)} 😄`},
  {t:`Hoy no puedo, perdóneme`,l:-.2,r:`No se preocupe, mi amor. Ya buscaré quién.`}];
 if(w==='papa')return[
  {t:`Cuente conmigo, don Alexander.`,o:.15,f:acc,r:()=>`Antes de las ${fmtM(nowM()+d.hrs*60)} No me falle. — A.`},
  {t:`Ya mismo salgo. Palabra de hombre.`,o:.25,f:acc,r:`Eso. Las palabras se miden por lo que hacen las manos. — A.`},
  {t:`Ahorita no puedo, don Alexander.`,o:-.3,r:`Ajá. — A.`}];
 return[
  {t:`Ya voy, mi reina 👑`,a:.5,f:acc,r:{chistosa:`jaja mi reina dice que más te vale que llegués rápido 😏`,_:()=>`gracias 💛 tenés hasta las ${fmtM(nowM()+d.hrs*60)}`}},
  {t:`Diay, recordame cuál es 😅`,a:d.id==='ar1'&&!PH().known.like?-.5:0,f:acc,r:()=>d.id==='ar1'?(PH().known.like?`jaja ya te lo dije, ¿sos pescado? 😂`:(arLearn('like'),`¿EN SERIO? 😳 ${cap1(AR_LIKES[arLike()])}, mae. APUNTALO.`)):`jaja. ${cap1(noEmoji(d.t()))}`},
  {t:`Hoy no puedo, perdoname`,a:-1,r:`ay. qué pena. bueno... otro día 🥲`}]};
ASKS.ar_visita=c=>[
 {t:`Ya sé, ya sé. Llevo algo, tranquila 😅`,a:.5,r:`jaja eso espero. Un queque de naranja es garantía. Mi papá es un tema serio.`},
 {t:`¿Tus papás muerden?`,a:.3,r:`mi mamá solo si no te comés el gallo pinto. mi papá... mide en silencio. ¡suerte!`},
 {t:`Ay, Dios mío... ya voy`,a:.2,r:`jajaja respirá. todo va a salir bien. creo 🙏`}];
const AR_MORN={alegre:[`buenos días, dormilón ☀️ ¿ya te levantaste o seguís roncando?`,`¡Pura vida, nuevo día! Hoy amanecí con ganas de que pase algo chiva 😄`,`mae, soñé con un queque de naranja gigante y me desperté con hambre 🤤`],
 chistosa:[`Buenos días. Dato curioso: el gallo de doña Marta me despertó a las 4:30. Quiero justicia ⚖️🐓`,`Te levanté con un mensaje y no con un gallo. Estás en deuda conmigo jaja`],
 pensativa:[`buenos días... amanecí media pensativa, ¿vos?`,`hay neblinita en el barrio, se siente para tomar café y no hablar con nadie. Pero te escribo a vos 🙂`],
 cansada:[`uf, buenos días. dormí fatal. si me ves hoy con cara de zombi no me juzgués 😮‍💨`,`mae necesito café y un abrazo, en ese orden ☕`],
 romantica:[`buenos días, mi amor 💛 soñé que me llevabas a ver las estrellas a la parada. ya sé que suena cursi`,`hoy tengo un buen presentimiento. creo que es porque existís 😌`],
 molesta:[`...`,`buenos días. (ando brava, ya sabés por qué)`]};
ASKS.ar_m=c=>[
 {t:`Buenos días, preciosa ☀️`,a:c.mood==='molesta'?.3:1,r:{alegre:`jaja buenos días 💛 así sí da gusto despertar`,chistosa:`uy, qué formal. mi gallo no avisa tan bonito 😂`,pensativa:`gracias... eso me hacía falta 🙂`,cansada:`gracias. ahora sí abro los ojos del todo ☕`,romantica:`buenos días, mi vida 💛 ya me hiciste el día`,molesta:`...buenos días. no creás que con eso se arregla todo.`,_:`buenos días 🙂`}},
 {t:`¿Dormilona vos? Ya son las siete 😂`,a:(c.mood==='chistosa'||c.mood==='alegre')?1:-.7,r:{alegre:`¡mentira! llevo despierta desde las seis. bueno... las 6:45 😅`,chistosa:`¿yo? el gallo de doña Marta es el dormilón: canta a las cuatro y se duerme a las cinco 🐓`,cansada:`no empecemos 😒 dormí pésimo`,molesta:`qué gracioso. ya, no.`,_:`jaja, qué gracioso. ni tanto 🙄`}},
 {t:`Buenas. ¿Hoy hay plan?`,a:.5,r:`mmm, déjame ver qué se me ocurre 😏 ya te aviso`},
 {t:`(dejar en visto)`,a:-.5,r:null}];
const AR_CHAT=[
 {m:`mae, pregunta seria: ¿cuál es la mejor hora para comerse un helado de palito? yo digo que las 3 de la tarde, bajo el sol 🍦`,o:[{t:`Las 3. Sin duda.`,a:.7,r:`¡LO SABÍA! alguien con criterio 😭💛`},{t:`Cualquier hora es buena si es contigo`,a:1,r:`ay no 🥹 qué cursi. me gustó.`},{t:`Los helados son para después de la mejenga`,a:.3,r:`jajaja claro, futbolero. 🙄⚽`}]},
 {m:`dime con quién andás y te diré quién sos, dice mi papá. ¿con quién andás hoy?`,o:[{t:`Con vos, en mi cabeza 😌`,a:1,r:`jajaja ya, parate. 💛`},{t:`Con Nicolás, perdido como siempre`,a:.2,r:`entonces sos medio perdido también 😂`},{t:`Con nadie, ando solo y feliz`,a:-.3,r:`ay, qué solitario 😒`}]},
 {m:`hoy me da pereza todo 🥱 ¿me convencés de salir de la casa?`,o:[{t:`Voy a buscarte con un helado`,a:1,r:`ahí sí. te espero 😏`},{t:`Quedate, mae, descansá`,a:.4,r:`tenés razón. hoy me merezco el sillón.`},{t:`Es que sos medio perezosa, ¿no?`,a:-.8,r:`¡ey! ¿perezosa yo? 😤 vos hablás.`}]},
 {m:`mi mamá me preguntó si «el muchacho» come bien. le dije que sí. no me hagás quedar mal 😅`,o:[{t:`Como rey, doña Lucía me engorda`,a:.6,r:`jaja eso sí. es su misión en la vida 😂`},{t:`Hoy solo gallo pinto, pero con natilla`,a:.5,r:`natilla: el pase VIP al corazón de mi mamá 😌`},{t:`Yo cocino mejor que ella`,a:-1,r:`...no lo repitás ni en broma. 😳`}]}];
ASKS.ar_chat=c=>AR_CHAT[c.i].o.map(x=>Object.assign({},x));
ASKS.ar_n=c=>[
 {t:`Ayudé a medio barrio 😅`,a:.5,r:`siempre tan buena gente. por eso... bueno, por eso 😌`},
 {t:`Pensando en vos`,a:c.mood==='molesta'?-.3:1,r:{molesta:`...ajá. pensar no es lo mismo que aparecer.`,romantica:`ay, mi amor 💛 yo también`,_:`cursi... pero me gustó 🥹`}},
 {t:`A dormir temprano, mañana madrugo`,a:.2,r:`buenas noches entonces 🌙 que sueñes con queque.`},
 {t:`(dejar en visto)`,a:-.4,r:null}];
ASKS.ar_date=c=>{const L=DATE_LOCS[c.loc],mk=(day)=>()=>{S.f.date={day,h:c.h,loc:c.loc,st:'on'}};
 return[{t:`Dale, ahí estoy a las ${fmtM(c.h*60)} 😌`,a:.5,f:mk(S.day),r:{romantica:`te voy a estar esperando con una sonrisa 💛 puntual, ¿ok?`,_:`¡tuanis! en ${L.s}, a las ${fmtM(c.h*60)} puntual, ¿ok? 😌`}},
  {t:`Mejor mañana, a la misma hora`,a:-.2,f:mk(S.day+1),r:`bueno, pero mañana no hay excusas 😏 ya está agendado.`},
  {t:`Jajaja ¿y quién paga?`,a:(c.mood==='chistosa'||c.mood==='alegre')?.8:-.6,f:mk(S.day),r:{alegre:`jaja ¡el que llegue primero! aquí te espero 😄`,chistosa:`el que pierda la mejenga de penales 😂 nos vemos a las ${fmtM(c.h*60)}`,_:`ay, mae... qué manera de arruinar el ambiente 🙄 pero igual andá.`}},
  {t:`Hoy no puedo, perdoname`,a:-.7,r:`ay. qué pena. otro día entonces.`}]};
ASKS.ar_sorry=c=>[
 {t:`Perdoname, soy un bruto 🥺`,a:1,f:()=>{S.f.arSoft=1},r:`no me convence un mensaje... pero se agradece. hablame en persona, ¿ok?`},
 {t:`Ay, no es para tanto`,a:-1.5,r:`...ok. bueno. ya veo.`},
 {t:`(no responder)`,a:-.3,r:null}];
ASKS.lu_chat=c=>[
 {t:`Sí, doña Lucía, ya almorcé. Gracias.`,l:.2,r:`Dios lo bendiga. Mire que usted está muy flaquito. 😤`},
 {t:`Todavía no 😅`,l:.4,r:`Pues venga a la casa que hay olla de carne. No acepto un no por respuesta. ❤`},
 {t:`Estoy a dieta`,l:-.15,r:`¡Qué dieta ni qué dieta, mijo! La dieta es para después de diciembre. 😤`}];
ASKS.ca_m=c=>[
 {t:`Cierto, don Alexander. Ya estoy en pie.`,o:.25,r:`Hmm. Se aprende. — A.`},
 {t:`A las cinco y media solo madrugan los gallos.`,o:-.3,r:`Los gallos y los hombres de provecho. — A.`},
 {t:`Y camarón que se duerme, se lo lleva la corriente 😄`,o:.55,f:()=>{PH().cl.dichos=1},r:`Ja. Veo que escuchó. — A.`}];
ASKS.ca_dicho=c=>{const D=DICHOS[c.i];return c.o.map(j=>({t:j===0?D.c:D.w[j-1],o:j===0?.5:-.2,f:()=>{if(j===0){PH().st.dichos++;PH().cl.dichos=1}},r:j===0?`Correcto. ${D.m} — A.`:`No. Era «${D.a} ${D.c}». — A.`}))};
ASKS.ca_hi=c=>[
 {t:`Buenas, don Alexander. ¿Cómo va la canoa del techo?`,o:opTier()>=2?.3:-.1,r:opTier()>=2?`Goteando. Como siempre. Pero ya la reparé a medias. — A.`:`Bien. — A.`},
 {t:`Don Alexander, ¿qué opina del partido de ayer?`,o:.2,r:`Esa defensa necesita padre y madre. — A.`}];

// ---------- celular: interfaz ----------
const pedAllActive=()=>PH().ped.filter(d=>!d.done&&!d.fail).length;
function openPhone(){PHV.th=null;PHV.tab='chats';phRender()}
function phRender(){PHV.open=1;ECOV.cur='phone';const un=totalUn(),pa=pedAllActive();let h='<div class="ph"><div class="ph-tabs">'+[['chats','💬 Chats'],['rel','💞 Relaciones'],['ped','📝 Mandados'],['fin','🏦 SINPE'],['apps','📱 Apps']].map(([k,l])=>`<button class="${(PHV.tab===k&&!PHV.th)?'on':''}" data-pt="${k}">${l}${k==='chats'&&un?`<i class="ph-dot">${un}</i>`:''}${k==='ped'&&pa?`<i class="ph-dot">${pa}</i>`:''}</button>`).join('')+'</div>';
 h+=PHV.th?phThread(PHV.th):PHV.tab==='chats'?phList():PHV.tab==='rel'?phRel():PHV.tab==='fin'?finHTML():PHV.tab==='apps'&&typeof progApps==='function'?progApps():phPeds();h+='</div>';
 openPanel('Celular',h);phBind();phBadge()}
function phList(){const p=PH();const ks=['ariana','mama','papa'].filter(phOn);
 if(!ks.length)return`<p>Tu celular está en silencio. Primero saludá a la barra por el barrio.</p>`;
 return ks.map(k=>{const th=p.th[k],last=th[th.length-1],u=p.un[k]||0;
  return`<button class="ph-row" data-th="${k}"><canvas class="ph-av" width="64" height="64" data-av="${k}"></canvas><span style="flex:1;min-width:0"><b>${esc(N(k))}</b>${u?`<i class="ph-dot" style="position:static;margin-left:6px">${u}</i>`:''}<span class="ph-pv">${last?(last.me?'Vos: ':'')+esc(last.t):'Sin mensajes todavía'}</span></span></button>`}).join('')+'<p class="note">Los mensajes llegan según la hora del día. No los dejés en visto.</p>'}
const QUICK={
 ariana:[{k:'hi',t:`Buenos días ☀️ ¿cómo amaneciste?`,c:()=>hour()<13,a:.4,r:{alegre:`¡bien! y mejor ahora que me escribís 💛`,cansada:`cansada, pero con ganas de verte ☕`,molesta:`...bien.`,_:`bien, ¿y vos? 🙂`}},
  {k:'miss',t:`Te extraño 💛`,c:()=>arTier()>=2,a:.8,r:{molesta:`...ya hablamos de eso.`,romantica:`y yo a vos, mi amor 💛 no sabés cuánto`,_:`ay, qué tierno 🥹 yo también`}},
  {k:'plan',t:`¿Qué hacés hoy?`,a:.2,r:`mmm, nada especial. ¿por qué? ¿tenés algo en mente? 😏`},
  {k:'need',t:`¿Necesitás algo de la pulpería?`,f:()=>askPed('ariana')}],
 mama:[{k:'need',t:`Doña Lucía, ¿ocupa algún mandado?`,f:()=>askPed('mama')},{k:'hi',t:`Doña Lucía, ¿cómo amaneció?`,l:.25,r:`¡Bendito sea Dios! Aquí, con la olla en el fuego como siempre. ¿Y usted, mijo? ❤`}],
 papa:[{k:'need',t:`Don Alexander, ¿se le ofrece algo?`,f:()=>askPed('papa')},{k:'hi',t:`Buenas, don Alexander. ¿Cómo va la canoa del techo?`,o:()=>opTier()>=2?.3:-.1,r:()=>opTier()>=2?`Goteando. Como siempre. Pero ya la reparé a medias. — A.`:`Bien. — A.`}]};
function askPed(who){const p=PH();
 if(pedActive(who).length){phQueue(who,who==='ariana'?`ya te pedí uno, mae. terminá ese primero 😒`:who==='mama'?`Ya le encargué uno, mijo. Termine ese primero. ❤`:`Ya tiene uno. Termínelo. — A.`,1);return}
 if(who==='papa'&&opTier()<2){phQueue(who,`No ocupo nada. Cuando ocupe, aviso. — A.`,2);return}
 const d=pedPick(who);if(!d){phQueue(who,who==='ariana'?`mmm, ahora no se me ocurre nada 😌`:who==='mama'?`Ahora no, mi amor. Gracias por preguntar. ❤`:`Nada por ahora. — A.`,1);return}
 phQueue(who,d.t(),rnd(1,3),{key:'ped',ctx:{id:d.id}})}
function phQuick(who,k){const p=PH(),q=QUICK[who].find(x=>x.k===k),sk='q_'+who+k;if(!q||p.sent[sk])return;p.sent[sk]=1;phMe(who,q.t);
 const num=v=>typeof v==='function'?v():v;if(q.a)relAdd('ar',num(q.a));if(q.l)relAdd('lu',num(q.l));if(q.o)relAdd('op',num(q.o));if(who==='ariana')arSeen();
 if(q.f)q.f();let r=q.r;if(r&&typeof r==='object')r=r[who==='ariana'?arMood():'_']||r._;if(typeof r==='function')r=r();if(r)phQueue(who,r,rnd(1,4));beep(700,.05,'square',.03);saveGame();phRender()}
function phThread(who){const p=PH(),th=p.th[who];p.un[who]=0;let h=`<div class="row" style="align-items:center;gap:8px;margin-bottom:6px"><button class="alt" data-back="1">‹ Chats</button><canvas class="ph-av" width="64" height="64" data-av="${who}" style="width:34px;height:34px"></canvas><b>${esc(N(who))}</b><span class="note" style="margin:0">${esc(who==='ariana'?AR_TIERS[arTier()]:who==='papa'?OP_TIERS[opTier()]:LU_TIERS[luTier()])}</span></div><div class="ph-msgs">`;
 let ld=-1;if(!th.length)h+='<div class="ph-day">Sin mensajes todavía</div>';
 for(const m of th){if(m.d!==ld){ld=m.d;h+=`<div class="ph-day">Día ${m.d}</div>`}h+=`<div class="bub ${m.me?'me':'them'}">${esc(m.t)}<small>${fmtM(m.m)}</small></div>`}
 h+='</div>';
 for(const d of pedActive(who))h+=`<div class="qitem"><b>📝 ${esc(pedItemName(d))}</b><p>Antes de las ${fmtM(d.due)} · ${d.pay?'₡'+d.pay+' · ':''}Está en: ${esc(locLabel(locFor(CH[who]))||'—')}${(S.inv[d.item]||0)>=d.n?' · <b>¡Ya lo tenés! Llevaselo.</b>':''}</p></div>`;
 const w=p.wait[who];
 if(w&&ASKS[w.key]){h+='<div class="ph-rep">'+ASKS[w.key](w.ctx).map((o,i)=>`<button data-rep="${i}">${esc(o.t)}</button>`).join('')+'</div>'}
 else{const qs2=QUICK[who].filter(q=>!p.sent['q_'+who+q.k]&&(!q.c||q.c()));if(qs2.length)h+='<div class="ph-rep"><small class="note" style="margin:0">Escribirle:</small>'+qs2.map(q=>`<button data-q="${q.k}">${esc(q.t)}</button>`).join('')+'</div>'}
 return h}
const HINTS=[
 {k:'madrugar',who:'op',t:()=>`${N('papa')} valora la puntualidad: entregá sus mandados rápido y se lo agradece.`,say:()=>`Te doy un consejo: mi papá mide a la gente por la puntualidad. Si te pide algo, hacelo rápido. «Al que madruga Dios lo ayuda», siempre dice.`},
 {k:'dichos',who:'op',t:()=>`${N('papa')} adora los dichos: si completás uno bien, se le ilumina la cara.`,say:()=>`Mi papá ama los dichos. Si te suelta uno a medias y vos lo completás bien, se le ilumina la cara. Si lo completás mal... mejor ni pensés.`},
 {k:'comida',who:'lu',t:()=>`${N('mama')} se ofende si le rechazás comida.`,say:()=>`Mi mamá se ofende si le rechazás comida. Aunque ya hayás comido, aceptá un poquito. Es ley.`},
 {k:'huerta',who:'op',t:()=>`${N('papa')} desconfía de todo lo que no sea de la tierra: llevale algo de tu huerta.`,say:()=>`Mi papá desconfía de todo lo que no venga de la tierra. Si le llevás algo de tu huerta, hasta sonríe. Bueno, casi.`},
 {k:'escuchar',who:'op',t:()=>`Cuando ${N('papa')} cuenta de la finca, no lo interrumpás.`,say:()=>`Cuando mi papá cuenta cosas de la finca, no lo interrumpás. Dejalo hablar. Es su manera de decir que te quiere.`},
 {k:'natilla',who:'lu',t:()=>`Con natilla se gana el corazón de ${N('mama')}.`,say:()=>`Con natilla ganás el corazón de mi mamá. Siempre. Llevale natilla.`},
 {k:'futbol',who:'op',t:()=>`A ${N('papa')} no le digás que no ves fútbol.`,say:()=>`Un detalle: no le digás a mi papá que no ves fútbol. No lo dice, pero lo siente como ofensa personal.`}];
const AR_FACTS=[
 {k:'like',tier:1,s:()=>`Su antojo: ${AR_LIKES[arLike()]}`,tell:()=>{const l=arLike();return[`¿Querés saber mi debilidad en la pulpería? ${cap1(AR_LIKES[l])}. Si me ves de mal humor, ahí está la solución. Pero no te lo dije, ¿ok?`]}},
 {k:'dream',tier:2,s:()=>`Quiere abrir una soda: «Donde ${N('ariana')}»`,tell:()=>[`Un día voy a abrir una soda en el barrio. Con mesitas de madera, casado a buen precio y una pizarra con el menú. «Donde ${N('ariana')}», se va a llamar.`,`Ni mi mamá lo sabe... bueno, mi mamá sí, pero solo porque lee mi cuaderno.`]},
 {k:'fear',tier:2,s:()=>`Le tiene respeto al gallo Kiki`,tell:()=>[`¿Un secreto tonto? Le tengo respeto a Kiki, el gallo de ${N('marta')}. Una vez me persiguió desde la pulpería hasta mi casa. Casi pierdo una chancleta.`]},
 {k:'abu',tier:3,s:()=>`Sus abuelos tenían finca en Zarcero; le dan miedo los truenos de octubre`,tell:()=>[`Mis abuelos tenían una finca en Zarcero. Yo pasaba las vacaciones ahí, entre cipreses podados y vacas.`,`Mi abuela me enseñó a hacer tamales y a no tenerle miedo a las tormentas. Bueno... a los truenos de octubre todavía les tengo un poquito.`]}];
function arLearn(k){const p=PH();if(p.known[k])return;p.known[k]=1;toast('💡 Aprendiste algo de '+N('ariana'))}
const AR_QS={
 like:{q:()=>`A ver, pregunta de examen: ¿cuál es mi antojo favorito de la pulpería?`,ok:()=>AR_SHORT[arLike()],bad:()=>Object.keys(AR_SHORT).filter(k=>k!==arLike()).map(k=>AR_SHORT[k])},
 dream:{q:()=>`¿Qué quiero abrir algún día?`,ok:()=>`Una soda en el barrio`,bad:()=>[`Una barbería`,`Una finca de café`,`Un taller de bicicletas`]},
 fear:{q:()=>`¿A quién le tengo muchísimo respeto?`,ok:()=>`Al gallo Kiki`,bad:()=>[`A Firulais`,`Al Cadejos`,`A las gallinas del vecino`]},
 abu:{q:()=>`¿Dónde quedaba la finca de mis abuelos?`,ok:()=>`En Zarcero`,bad:()=>[`En Guanacaste`,`En Sarapiquí`,`En Turrialba`]}};
function phRel(){const p=PH(),card=k=>{const w=WHO[k],v=S.f[w.key]||0,pct=Math.round((v-w.lim[0])/(w.lim[1]-w.lim[0])*100);return`<div class="ph-meter ${v<0?'neg':''}"><span style="width:${pct}%"></span></div>`};
 let h=`<div class="qitem"><b>💛 ${esc(N('ariana'))} · ${AR_TIERS[arTier()]}</b>${card('ar')}<p>${arTier()>=2||S.f.arM?'Hoy anda '+MOODS[arMood()]+'.':'Todavía no la conocés lo suficiente para leerle el ánimo.'}${S.f.arWhy?' Algo la tiene dolida.':''}</p>`;
 const kn=AR_FACTS.filter(f=>p.known[f.k]);h+=kn.length?'<p><b>Lo que sabés de ella:</b></p><ul style="margin:4px 0 0 18px;padding:0">'+kn.map(f=>`<li>${esc(f.s())}</li>`).join('')+'</ul>':'<p>Todavía no sabés casi nada de sus gustos. Preguntale.</p>';
 const d=dateOn();if(d)h+=`<p>💌 Cita: ${d.day===S.day?'hoy':'mañana'} a las ${fmtM(d.h*60)} · ${DATE_LOCS[d.loc].s}</p>`;h+='</div>';
 if(p.luNum){h+=`<div class="qitem"><b>🍲 ${esc(N('mama'))} · ${LU_TIERS[luTier()]}</b>${card('lu')}`;const hh=HINTS.filter(x=>x.who==='lu'&&p.cl[x.k]);if(hh.length)h+='<ul style="margin:6px 0 0 18px;padding:0">'+hh.map(x=>`<li>${esc(x.t())}</li>`).join('')+'</ul>';h+='</div>'}
 h+=`<div class="qitem"><b>🧔 ${esc(N('papa'))} · ${OP_TIERS[opTier()]}</b>${card('op')}`;const hp=HINTS.filter(x=>x.who==='op'&&p.cl[x.k]);h+=hp.length?'<ul style="margin:6px 0 0 18px;padding:0">'+hp.map(x=>`<li>${esc(x.t())}</li>`).join('')+'</ul>':'<p>Es difícil de leer. Preguntale a su hija cómo tratarlo.</p>';h+='</div>';
 return h}
function phPeds(){const p=PH(),act=p.ped.filter(d=>!d.done&&!d.fail).sort((a,b)=>a.due-b.due),old=p.ped.filter(d=>d.done||d.fail).slice(-5).reverse();let h='';
 h+=act.length?act.map(d=>`<div class="qitem"><b>▶ ${esc(pedItemName(d))} para ${esc(N(d.who))}</b><p>Antes de las ${fmtM(d.due)}${d.pay?' · ₡'+d.pay:''} · Ahora está en: ${esc(locLabel(locFor(CH[d.who]))||'—')}${(S.inv[d.item]||0)>=d.n?' · <b>¡Ya lo tenés!</b>':''}</p></div>`).join(''):'<p>No tenés mandados pendientes. Los pedidos llegan por mensaje, o preguntale a tus suegros en persona.</p>';
 if(old.length)h+='<h3>Recientes</h3>'+old.map(d=>`<div class="qitem ${d.done?'done':''}"><b>${d.done?'✔':'✖'} ${esc(pedItemName(d))} · ${esc(N(d.who))}</b></div>`).join('');
 h+=`<p class="note">Entregados: ${p.st.ped} · Fallados: ${p.st.fail} · Citas: ${p.st.dates} · Regalos: ${p.st.gifts} · Dichos completados: ${p.st.dichos}</p>`;return h}
function phBind(){const b=$('#pbody');b.querySelectorAll('[data-pt]').forEach(x=>x.onclick=()=>{PHV.tab=x.dataset.pt;PHV.th=null;phRender()});
 b.querySelectorAll('[data-th]').forEach(x=>x.onclick=()=>{PHV.th=x.dataset.th;PH().un[PHV.th]=0;phRender()});
 b.querySelectorAll('[data-back]').forEach(x=>x.onclick=()=>{PHV.th=null;phRender()});
 b.querySelectorAll('[data-rep]').forEach(x=>x.onclick=()=>phChoose(PHV.th,+x.dataset.rep));
 b.querySelectorAll('[data-q]').forEach(x=>x.onclick=()=>phQuick(PHV.th,x.dataset.q));
 b.querySelectorAll('canvas[data-av]').forEach(c=>{try{drawPortrait(c,CH[c.dataset.av])}catch(e){}});
 const m=b.querySelector('.ph-msgs');if(m)m.scrollTop=m.scrollHeight}

// ---------- citas ----------
const DATE_LOCS={parque:{l:'el parque, en la banca junto al kiosco',s:'el parque'},pulperia:{l:'la pulpería, a comprar helados y hablar paja',s:'la pulpería'},parada:{l:'la parada del bus, a ver cómo se va la tarde',s:'la parada'}};
const dateOn=()=>{const d=S.f.date;return d&&d.st==='on'?d:null};
const dateOk=()=>S.f.dateLast!==S.day&&S.day-(S.f.dateLast||-9)>=2&&!dateOn();
function dateAt(){const d=dateOn();if(!d)return null;const st=d.day*1440+d.h*60,n=nowM();return n>=st-45&&n<=st+180?d:null}
function dateLoc(c){if(!S||!S.f||c.id!=='ariana')return null;const d=dateAt();return d?d.loc:null}
function dateTick(now){const d=dateOn();if(!d)return;const st=d.day*1440+d.h*60;
 if(!d.rem&&now>=st-60&&now<st){d.rem=1;phMsg('ariana',`recordá que a las ${fmtM(st)} te espero en ${DATE_LOCS[d.loc].s} 😌 puntual, ¿ok?`)}
 if(now>st+180){d.st='miss';S.f.dateLast=S.day;arHurt('planton',6);phQueue('ariana',`te esperé dos horas. dos. no sé qué decirte 🙂`,3)}
 const k=dateLoc(CH.ariana||{id:'x'})||'';if(k!==phDL){phDL=k;placeNPCs(false)}}
function capDay(key,max){const f=S.f;if(!f.cap||f.cap.d!==S.day)f.cap={d:S.day};f.cap[key]=(f.cap[key]||0)+1;return f.cap[key]<=max}
function arDate(d){const id='ariana',now=nowM(),st=d.day*1440+d.h*60,delta=now-st,k=delta<=0?'early':delta<=30?'ok':delta<=90?'late':'vlate',ds={s:{early:3,ok:2,late:0,vlate:-2}[k]},L=DATE_LOCS[d.loc];
 d.st='done';S.f.dateLast=S.day;arSeen();
 say(null,{parque:`El kiosco del parque tiene luces de colores. ${N('ariana')} está sentada en la banca, balanceando los pies.`,pulperia:`${N('ariana')} te espera junto a la nevera de helados de la pulpería, con el cabello recogido y una sonrisa nerviosa.`,parada:`La parada está tranquila. ${N('ariana')} te guardó un lugar en la banca, bajo el poste de luz.`}[d.loc]);
 say(id,{early:`¡Llegaste antes! Mirá vos. Eso no se ve todos los días.`,ok:`¡Llegaste! Y a tiempo. Ya me estaba preocupando.`,late:`Llegaste... ya casi me iba. Más vale tarde que nunca, dice mi papá. Pero dice «más vale» con tono de reproche.`,vlate:`Una hora y media, ${N('player')}. Una hora y media. Me comieron los zancudos, ¿sabés?`}[k]);
 const fin=()=>{const s=ds.s,g=s>=8?'great':s>=5?'good':s>=2?'meh':'bad',gain={great:7,good:4.5,meh:2,bad:-1.5}[g];
  say(id,{great:`Fue una de las mejores noches que he tenido en este barrio. Y mirá que acá pasa de todo. Gracias.`,good:`La pasé muy bien, mae. De verdad. Hay que repetirlo.`,meh:`Estuvo... bien. Un poco rara, quizás. No importa. Gracias por venir.`,bad:`Bueno... gracias por venir. Supongo. Creo que me voy a la casa.`}[g]);
  if(g==='great'||g==='good')say(null,`${N('ariana')} te toma de la mano por un segundo. Después se hace la loca y mira hacia otro lado. El barrio entero parece de buen humor.`);
  afterD(()=>{relAdd('ar',gain);const p=PH();p.st.dates++;S.f.arM=null;if(g==='great'||g==='bad')phQueue('ariana',g==='great'?`no puedo dejar de sonreír. ya, ya, no lo digás 🙈💛`:`mae... hablamos mañana, ¿ok? 🙂`,10);saveGame();placeNPCs(false)})};
 const b3=()=>{const ks=Object.keys(PH().known).filter(x=>AR_QS[x]);if(ks.length&&Math.random()<.9){arTest(ks,ok=>{ds.s+=ok?3:-1;fin()});return}
  say(id,`¿Sabés qué es lo que más me gusta de estar con vos?`,[{t:`¿Que te hago reír?`,f(){ds.s+=1;say(id,`Eso también. Pero no.`);fin()}},{t:`¿Que te escucho?`,f(){ds.s+=2;say(id,`...sí. Eso. Que me escuchás. No es tan común.`);fin()}},{t:`No sé, decime vos`,f(){say(id,`Que no tenés que fingir. Aunque a veces me gustaría que lo intentaras un poco 😏`);fin()}}])};
 const b2=()=>say(id,period()==='t'?`Qué antojo de algo dulce, ¿no?`:`Me está dando hambre, ¿a vos?`,[
  {t:`Invitarla a comer algo (₡1200)`,f(){if(S.money>=1200){S.money-=1200;ds.s+=2;toast('- ₡1200');say(id,`¡Mae, qué detalle! Yo pago la próxima... ¡mentira, no pago 😄!`)}else{ds.s-=1;S.f.fiado=(S.f.fiado||0)+1200;say(id,`...¿te anotaron en el cuaderno de fiados? 😂 qué romántico. Y qué humillante, creo.`)}b3()}},
  {t:`Compartir algo de la mochila`,f(){const it=['queque','pandepina','fresco','chicle','pozuelo','gallopinto','natilla'].find(hasI);if(it){remI(it);const lk=it===arLike();if(lk)arLearn('like');ds.s+=lk?3:2;say(id,lk?`¡¡Mi antojo!! ¿Cómo sabías? 🥹`:`¡Qué bien! ${itemName(it)}. Uno siempre debería andar comida en la mochila, es de gente precavida.`)}else{say(id,`...¿tu mochila está vacía? Diay, mae. Mañana la llenamos.`)}b3()}},
  {t:`Nada, estoy bien así, solo conversando`,f(){ds.s+=1;say(id,`Eso también está bien. A veces solo hablar es lo mejor.`);b3()}}]);
 const b1=()=>say(id,`¿De qué hablamos?`,[
  {t:`De tus planes. Siempre tenés uno, ¿cuál es el grande?`,f(){if(PH().known.dream){ds.s+=2;say(id,`¡Te acordás! La soda, mae... mesitas de madera, menú de pizarra. ${N('player')}, me estás enamorando 😳`)}else{ds.s+=1;arLearn('dream');say(id,`Un día quiero abrir una soda en el barrio. Casado a ₡2500 y un cartel que diga «Donde ${N('ariana')}». ¿Qué tal?`)}b2()}},
  {t:`De ${N('papa')} y sus dichos`,f(){if((S.f.opinion||0)>=2){ds.s+=2;say(id,`¡Jaja! Ayer me soltó «a cada chancho le llega su sábado» solo porque se me quemó el arroz. Pero de vos habla bien, ¿sabías?`)}else{say(id,`Ay, mae... mejor no hablemos de mi papá en una cita 😅 me pongo tensa. Ya te va a agarrar cariño. Creo.`)}b2()}},
  {t:`Del barrio y sus chismes`,f(){const m=arMood();if(m==='chistosa'||m==='alegre'){ds.s+=2;say(id,`¡Uy, ahora sí! ¿Supiste que Kiki le puso el pico a Don Beto en la parada? Dicen que el bus salió dos minutos tarde por el chisme 😂`)}else{ds.s+=1;say(id,`Jaja, sí... el barrio no se cansa de dar de qué hablar.`)}b2()}}]);
 b1()}
function arTest(ks,cb){const k=ks[Math.floor(Math.random()*ks.length)],Q=AR_QS[k],id='ariana',opts=shuf([{t:Q.ok(),ok:1}].concat(shuf(Q.bad()).slice(0,3).map(t=>({t,ok:0}))));
 say(id,Q.q(),opts.map(o=>({t:o.t,f(){const p=PH();if(o.ok){p.st.tests++;relAdd('ar',1.5);say(id,pick([`¡Sí! Sabía que me escuchabas 🥹`,`¡Correcto! Diay, mae, me estás sorprendiendo.`,`Exacto. Punto para vos. Y no es fácil que yo regale puntos.`]))}else{relAdd('ar',-1.5);say(id,pick([`...no. No es eso. Te lo había contado, ¿sabés? 🙂`,`Ay, mae. En serio. Apuntalo.`,`Mmm. No. Ya sé que no estabas poniendo atención.`]));say(id,`Era: ${Q.ok()}.`)}if(cb)cb(!!o.ok)}})))}
function arInvite(cb){const id='ariana',m=arMood();
 if(m==='cansada'||m==='molesta'){say(id,m==='cansada'?`Hoy no, mae... estoy hecha polvo. Preguntame otro día, ¿sí?`:`No. Ni se te ocurra.`);cb&&cb();return}
 if(!dateOk()){say(id,`Ya salimos hace poco, ¿no? Un poquito de aire, mae. Hay que dejar que se extrañe 😌`);cb&&cb();return}
 say(id,`¿A dónde me querés llevar?`,Object.keys(DATE_LOCS).map(k=>({t:cap1(DATE_LOCS[k].s),f(){const same=hour()<17,day=same?S.day:S.day+1;S.f.date={day,h:18,loc:k,st:'on'};say(id,`¡Tuanis! ${cap1(DATE_LOCS[k].s)}, ${same?'hoy':'mañana'} a las ${fmtM(18*60)} ¡Puntual, ¿ok?! 😌`);cb&&cb()}})))}
const GIFT_BASE={queque:2,pandepina:2,fresco:1.5,chicle:1,pozuelo:1,natilla:.5,gallopinto:1.5,picadillo:3,tomate:1,tazo:1.5};
function arGift(cb){const id='ariana',ks=Object.keys(S.inv).filter(k=>GIFT_BASE[k]!=null);if(!ks.length){say(id,`¿Con qué? ¿Con tus buenas intenciones? 😂`);cb&&cb();return}
 say(id,`¿Para mí? ¿Qué trajiste?`,ks.map(k=>({t:itemName(k),f(){const fav=k===arLike(),first=S.f.giftDay!==S.day;S.f.giftDay=S.day;let g=GIFT_BASE[k]*(fav?2:1)*(first?1:.25);if(S.f.arWhy)g*=.4;remI(k);PH().st.gifts++;relAdd('ar',g);
  if(fav){arLearn('like');say(id,`¡¡Mi antojo favorito!! ¿Cómo supiste? 🥹`)}
  else say(id,{tomate:`¿Tomates de la huerta? Qué romántico, mae. Y qué práctico: ya sé qué hacer de almuerzo.`,picadillo:`¿Hiciste picadillo? ¿VOS? ¡Mi mamá no te lo va a creer!`,tazo:`¡Un tazo! Mae, me volvés a la escuela. Qué nostalgia.`}[k]||pick([`¡Qué detalle, mae! Gracias.`,`Ay, qué lindo. No tenías que... pero qué bueno que sí.`]));
  if(!first)say(id,`Y ya me regalaste algo hoy. No hay que abusar... pero no me quejo 😏`);
  if(S.f.arWhy)say(id,`Esto no arregla lo que pasó, ¿ok? Pero se agradece.`);
  cb&&cb()}})).concat([{t:`Mejor no, era una broma`,f(){say(id,`Qué pesado. 😒`);cb&&cb()}}]))}
const WHYT={visto:`dejaste mis mensajes en visto`,planton:`me dejaste plantada esperándote`,mandado:`no me hiciste el mandado cuando te lo pedí`,descuido:`desaparecés días enteros sin saber nada de vos`,cita:`la última cita no estuvo bien`};
const SORRY={visto:`Tenés razón, debí responderte. Perdoname.`,planton:`Debí llegar a la cita o avisarte. Perdoname de verdad.`,mandado:`Me comprometí y no cumplí. Perdoname.`,descuido:`No he estado presente. Quiero estarlo más.`,cita:`Quiero hacerlo mejor. Perdoname.`};
function arSorry(cb){const id='ariana',w=S.f.arWhy;if(!w){say(id,`No estoy molesta, tonto. ¿Por qué lo preguntás?`);cb&&cb();return}
 say(id,`Mirá... sí, estoy molesta. ${cap1(WHYT[w])}.`,shuf([
  {t:SORRY[w],f(){relAdd('ar',3+(S.f.arSoft?1:0));S.f.arWhy=null;S.f.arSoft=0;S.f.arM=null;say(id,`Está bien, mae. Gracias por decírmelo así, de frente. No me lo volvás a hacer, ¿ok?`);say(id,pick([`Ya, ya. Vení acá.`,`Pura vida. Se acabó el drama.`]));cb&&cb()}},
  {t:`Ay, no es para tanto`,f(){relAdd('ar',-2);say(id,`¿«No es para tanto»? Mirá, ${N('player')}... mejor dejémoslo hasta aquí por hoy.`);cb&&cb()}},
  {t:`¿Y si te perdono yo a vos?`,f(){relAdd('ar',-1);say(id,`...¿perdón? Qué cara tenés.`);cb&&cb()}}]))}
function arHello(){const m=arMood(),f=S.f,p=period(),L=[],n=N('player');
 if(f.arWhy)return pick({visto:[`...ah, mirá quién apareció. Mis mensajes llegaron, ¿verdad? Los viste, ¿verdad?`],planton:[`${n}. Dos horas. Te esperé dos horas.`],mandado:[`Ah, hola. ¿Se te perdió mi mandado por el camino?`],descuido:[`¿Y vos quién sos? Hace días que no sé nada de vos.`],cita:[`...hola.`]}[f.arWhy]||[`...hola.`]);
 if(f.dateLast===S.day&&f.date&&f.date.st==='done')L.push(`Todavía me duran las mariposas de hoy... no se lo digás a nadie 🙈`);
 L.push(...{alegre:[`¡Mae! Qué dicha verte, hoy está el día tuanis.`,`¡Pura vida! ¿Venís a alegrarme el día o ya lo alegré yo sola?`],chistosa:[`¡Oíme, ${n}! El gallo de doña Marta me dio una mirada de odio esta mañana. Creo que sabe cosas.`,`Justo estaba pensando en un chiste malo. ¿Querés escucharlo? Mejor no.`],pensativa:[`Hola... estaba mirando el cielo. Es bonito pensar sin hacer nada.`,`Ay, hola. Hoy ando de esas tardes de pensar en la vida. No hagás caso.`],cansada:[`Hola... ay, qué cansancio. Hoy me levanté con la guitarra desafinada.`,`Mae, dormí como tres horas. Si me ves bostezando, no es por vos.`],romantica:[`Hola, mi amor. Qué bueno verte justo ahora.`,`Mirá quién viene... el culpable de mi buen humor.`],molesta:[`Hola.`,`...ah. Hola.`]}[m]);
 if(p==='n')L.push(`Qué linda la noche. Los grillos están a todo volumen, ¿oís?`);if(S.rain)L.push(`¡Qué aguacero, mae! Se me mojaron las tenis nuevas. Típico.`);
 if(arTier()>=3)L.push(`Mi mamá preguntó por vos. Creo que le caés mejor que yo 😂`);if((f.opinion||0)>=2.5)L.push(`Mi papá dijo tu nombre sin fruncir el ceño. Un milagro.`);
 return pick(L)}
function arHow(cb){const id='ariana',m=arMood(),L={alegre:`Mejor que nunca. Hoy hasta el zinc canta, ¿viste?`,chistosa:`Bien, aunque creo que desayuné chiste en vez de gallo pinto.`,pensativa:`Media pensativa... a veces me pasa. ¿Vos te quedás mirando el techo sin motivo?`,cansada:`Hecha polvo, mae. El cuerpo me pide siesta y la vida me pide planes.`,romantica:`Ahora mejor 💛 desde que llegaste.`,molesta:`Bien. (No, no estoy bien, pero tampoco voy a explicarlo.)`}[m],FIT={alegre:[1,.2,.3],chistosa:[.8,.3,.4],pensativa:[.2,1,.8],cansada:[0,1,.5],romantica:[.5,.5,1.4],molesta:[-.3,.2,-.6]}[m];
 const rep=i=>{const ok=FIT[i]>=.8,cap=capDay('how',2);if(cap)relAdd('ar',FIT[i]);say(id,ok?pick([`Qué bien me entendés, mae. De verdad.`,`Eso era justo lo que necesitaba oír.`]):FIT[i]<0?pick([`...no es lo que quería, pero bueno.`,`Mmm. No es el momento, ${N('player')}.`]):pick([`Bueno... gracias, supongo.`,`Jaja, tiene su gracia.`]));cb&&cb()};
 say(id,L,[{t:`Qué bueno, me alegra`,f(){rep(0)}},{t:`Descansá, mae. ¿Querés que te traiga algo?`,f(){rep(1)}},{t:`Darle un abrazo`,f(){rep(2)}}])}
function arTell(cb){const id='ariana',t=arTier(),p=PH(),f=AR_FACTS.find(x=>!p.known[x.k]&&x.tier<=t);
 if(!f){say(id,`Ya te conté lo más importante... por ahora. Queda mucho por saber, pero no todo de una vez, ¿no?`);cb&&cb();return}
 f.tell().forEach(l=>say(id,l));arLearn(f.k);relAdd('ar',.6);cb&&cb()}
function arParents(cb){const id='ariana',p=PH(),h=HINTS.find(x=>!p.cl[x.k]);
 if(h&&Math.random()<.8){p.cl[h.k]=1;say(id,h.say());toast('💡 Nueva pista sobre '+N(h.who==='lu'?'mama':'papa'));cb&&cb();return}
 const o=opTier();say(id,pick(o>=3?[`Mi papá te quiere, aunque jamás lo diga. Lo sé porque te saluda con la cabeza. A los que no quiere, ni eso.`,`Mi mamá dice que ya sos «de la casa». Eso es el máximo honor.`]:o>=1?[`Mi papá está tanteándote. Dale tiempo, que es como el café: se cuela despacio.`,`A mi mamá ya la conquistaste. Mi papá... en proceso.`]:[`Mi papá todavía no está convencido, pero no es personal. Es su estilo.`,`Ay, mae. Si mi papá no te saluda es porque no te tiene confianza. Todavía.`]));cb&&cb()}
function arBye(){const id='ariana';if(capDay('bye',1))relAdd('ar',.2);say(id,pick(arTier()>=3?[`Nos vemos, mi amor. Pura vida.`,`Cuidate, ¿ok? Y escribime.`]:[`Dale, nos vemos. ¡Pura vida!`,`¡Chao, mae! Cuidate.`]))}
function arMenu(first){const id='ariana',t=arTier(),ch=[],back=()=>arMenu();
 ch.push({t:`¿Cómo andás hoy?`,f(){arHow(back)}});
 ch.push({t:`¿Qué se cuenta?`,f(){arChatter(back)}});
 ch.push({t:`Contame algo de vos`,f(){arTell(back)}});
 ch.push({t:`Hablemos de tus papás`,f(){arParents(back)}});
 if(S.f.arWhy)ch.push({t:`Tenemos que hablar...`,f(){arSorry(back)}});
 if(Object.keys(S.inv).some(k=>GIFT_BASE[k]!=null))ch.push({t:`Tengo algo para vos`,f(){arGift(back)}});
 if(t>=2&&dateOk())ch.push({t:`¿Salimos a algún lado?`,f(){arInvite(back)}});
 ch.push({t:`¿Necesitás algo?`,f(){pedOffer('ariana');back()}});
 ch.push({t:`Solo pasaba a saludar`,f(){arBye()}});
 say(id,first?arHello():pick([`¿Algo más?`,`Decime.`,`¿Y qué más?`]),ch)}

// ---------- los suegros ----------
const DICHOS=[
 {a:'Al que madruga',c:'Dios lo ayuda',w:['se le enfría el café','le canta el gallo de doña Marta'],m:'El que se levanta temprano, rinde más.'},
 {a:'Camarón que se duerme',c:'se lo lleva la corriente',w:['se queda sin cena','sale en las noticias'],m:'El que se descuida, pierde la oportunidad.'},
 {a:'A cada chancho',c:'le llega su sábado',w:['le toca su lavada','le sale una mejenga'],m:'Tarde o temprano a todos nos llega el turno.'},
 {a:'Perro huevero',c:'aunque le quemen el hocico',w:['no cambia de ladrido','vive con el rabo entre las patas'],m:'La costumbre no se quita ni con castigo.'},
 {a:'Más vale pájaro en mano',c:'que cien volando',w:['que un gallo en el techo','que pollo sin pagar'],m:'Mejor lo seguro que lo incierto.'},
 {a:'Del dicho al hecho',c:'hay mucho trecho',w:['sobra mucho dicho','se cae el techo'],m:'Prometer es fácil; cumplir cuesta.'},
 {a:'Cuando el río suena',c:'piedras trae',w:['es que va a llover','hay que cruzar a pata'],m:'Si hay rumor, algo de cierto hay.'},
 {a:'El que a buen árbol se arrima',c:'buena sombra lo cobija',w:['buen mango se come','nunca pasa calor'],m:'Con buena compañía, te va bien.'},
 {a:'A caballo regalado',c:'no se le mira el colmillo',w:['no se le pone montura','se le da zacate'],m:'Lo regalado no se critica.'},
 {a:'No hay mal',c:'que por bien no venga',w:['que dure cien años','que no pase el bus'],m:'De lo malo a veces sale algo bueno.'},
 {a:'En casa de herrero',c:'cuchillo de palo',w:['martillo prestado','clavo torcido'],m:'A veces el experto no tiene lo suyo.'},
 {a:'Barriga llena',c:'corazón contento',w:['pie descalzo','bolsillo vacío'],m:'Con la comida servida, todo mejora.'},
 {a:'Más sabe el diablo',c:'por viejo que por diablo',w:['por callado que por cojo','por aguacero que por vivo'],m:'La experiencia vale más que la astucia.'},
 {a:'El que nada debe',c:'nada teme',w:['bien duerme y mal come','se sienta en la banca'],m:'Con la conciencia limpia no hay miedo.'}];
const CAR_STORIES=[
 [`Cuando yo cogía café en Tarrazú, a las cuatro de la mañana ya andábamos con la canasta al hombro. Hacía un frío que se le metía a uno en los huesos.`,`Mi taita decía: «el café no se recoge con prisa, se recoge con paciencia, grano a grano». Así es la vida.`,`Un día me caí por una ladera con la canasta llena. Perdí media cosecha, pero aprendí a bajar con cuidado.`],
 [`Mi suegro tenía una finca en Zarcero. Ahí conocí a la mamá de Ariana. Yo llegué a ayudar con las vacas y me quedé por la hija del patrón.`,`Él me puso a ordeñar a las cinco de la mañana. Pensé que me quería matar. Después entendí que me estaba probando.`,`A los tres años me dio su bendición. Y un machete. El machete lo conservo.`],
 [`Cuando era muchacho, uno se iba a pata hasta la escuela, a tres kilómetros, y se llegaba con la tarea hecha.`,`Si llovía, la maestra nos secaba con una toalla y nos daba agua dulce caliente. Eso sí era un lujo.`,`Hoy hay bus, pero nadie llega a tiempo. Antes no había bus, y llegábamos antes del sol.`]];
function carHello(){const t=opTier(),L=t>=4?[`Vaya, hombre, siéntese aquí en el corredor. Hoy hay fresco de cas y sin prisa.`,`Muchacho. Qué bueno que vino. Hoy no hay nada que arreglar... bueno, la canoa.`]:t>=3?[`Buenas, muchacho. Pase, pase.`,`Ah, usted. Siga, siga. Ya sabe dónde está el café.`]:t>=2?[`Buenas. ¿Qué anda haciendo por aquí?`,`Hmm. Buenas. Ya casi lo reconozco sin fruncir el ceño.`]:t>=1?[`Buenas. Siga.`,`Buenas. Lo estoy observando, muchacho. No es personal. Es costumbre.`]:[`...Buenas.`,`Mmm. Usted otra vez.`];return pick(L)}
function carChat(){const id='papa',t=opTier();if(capDay('cchat',1))relAdd('op',.1);
 const pools=[
  [`La casa no se arregla sola. Hoy toca revisar la canoa del techo.`,`Salí a caminar. El doctor dice que es bueno para el corazón. La señora dice que es para que no me duerma en el sillón.`,`Mucha lluvia para tan poca gente con juicio.`,`El que mucho abarca poco aprieta, muchacho. Acuérdese.`,`Las cosas bien hechas llevan su tiempo. Como el café.`],
  [`Cada cosa en su lugar y un lugar para cada cosa. Así se vive tranquilo.`,`El aguacero de octubre es fuerte, pero el café lo agradece. A uno también le toca aguantar para dar fruto.`,`¿Sabe qué es lo peor? La gente que habla mucho y siembra poco.`],
  [`Mi suegro decía: «el que no arriesga no gana, pero el que se arriesga sin pensar pierde la finca».`,`Usted ya no es visita. Eso es raro que yo lo diga.`,`Hay que cuidar lo que importa, muchacho. La plata va y viene; la palabra se queda.`],
  [`Si Ariana lo escogió, algo bueno vio. Y yo, que la crié con mis defectos, confío en su criterio.`,`Esta es su casa. No lo digo de todos. A los demás les digo «buenas» y ya.`,`Mi mejor cosecha no fue el café. Fue esa muchacha. Cuídela.`]];
 const o=opTier();const a=pools[Math.min(3,Math.max(0,o>=4?3:o>=3?2:o>=2?1:0))];
 if(Math.random()<.4){say(id,`¿Vio el partido de anoche? Esa defensa es un desastre.`,[{t:`¡Totalmente!`,f(){relAdd('op',.4);learnHint('futbol');say(id,`¡Por fin alguien con criterio en esta familia!`)}},{t:`Yo no veo fútbol`,f(){relAdd('op',-.4);say(id,`...¿Cómo dijo?`);say(null,N(id)+' se queda viéndote en silencio durante cinco largos segundos.')}}]);return}
 say(id,pick(a))}
function learnHint(k){const p=PH();if(!p.cl[k]){p.cl[k]=1}}
function carStory(){const id='papa',i=(S.f.carSt||0)%CAR_STORIES.length;S.f.carSt=(S.f.carSt||0)+1;const L=CAR_STORIES[i];
 say(id,L[0]);say(id,L[1],[{t:`(Escuchar en silencio)`,f(){PH().cl.escuchar=1;relAdd('op',.45);say(id,L[2]);say(id,`...Pocos muchachos escuchan. Eso se aprecia.`)}},{t:`Eso me recuerda cuando yo...`,f(){relAdd('op',-.45);say(id,`...Como le iba diciendo.`);say(null,`${N(id)} entrecierra los ojos. Algo se enfrió.`)}},{t:`¿Y qué pasó después, don Alexander?`,f(){relAdd('op',.25);say(id,L[2])}}])}
function carDicho(){const id='papa',i=Math.floor(Math.random()*DICHOS.length),D=DICHOS[i],o=shuf([0,1,2]);
 say(id,`Complete, muchacho: «${D.a}...»`,o.map(j=>({t:j===0?D.c:D.w[j-1],f(){const ok=j===0,cap=capDay('dicho',3);
  if(ok){PH().st.dichos++;PH().cl.dichos=1;if(cap)relAdd('op',.5);say(id,pick([`Correcto.`,`Hmm. Alguien le enseñó bien.`,`Así es.`]));say(id,D.m)}else{if(cap)relAdd('op',-.2);say(id,`No. Era «${D.a} ${D.c}».`);say(id,D.m)}}})))}
function carAri(cb){const id='papa';say(id,`¿De Ariana chiquita? Era una pelotita de energía. Siempre organizando a los primos para jugar «a la fiesta».`);
 say(id,`Pasaba las vacaciones en la finca de mis suegros, en Zarcero, y le tenía miedo a los truenos de octubre. Se escondía debajo de la cama con un gato.`);arLearn('abu');relAdd('op',.1);cb&&cb()}
function carMenu(first){const id='papa',t=opTier(),ch=[],back=()=>carMenu();
 ch.push({t:`¿Cómo anda, don Alexander?`,f(){carChat();back()}});
 ch.push({t:`Cuénteme algo de la finca`,f(){if(t<2)say(id,`Otro día. Esas historias no se le cuentan a cualquiera.`);else carStory();back()}});
 ch.push({t:`Complete el dicho`,f(){carDicho();back()}});
 ch.push({t:`¿Se le ofrece algún mandado?`,f(){pedOffer('papa');back()}});
 if(t>=3)ch.push({t:`Cuénteme de Ariana de chiquita`,f(){carAri(back)}});
 ch.push({t:`Con su permiso, me voy`,f(){say(id,t>=3?`Vaya con Dios, muchacho. Y salude a la muchacha.`:`Vaya.`)}});
 say(id,first?carHello():pick([`¿Algo más?`,`Diga.`]),ch)}
function lucHello(){const t=luTier(),L=t>=3?[`Ya es de la casa, mijo. Ni pregunte, sírvase.`,`Dios lo bendiga, hijo. Lo estaba esperando para probar mi sopa negra.`]:t>=2?[`¡Mi muchacho! Ya hasta me hace falta cuando no viene.`,`Mire que está flaco. Venga, que hay olla de carne.`]:t>=1?[`¡Ay, mijo! Qué dicha verlo. ¿Ya comió?`,`Venga, siéntese, que acabo de chorrear café.`]:[`Buenas, mijo. ¿Cómo está?`,`Ay, mijo... pase, pase.`];if(S.rain)L.push(`¡Qué aguacero, mijo! Venga, séquese, que se resfría.`);return pick(L)}
function lucFood(cb){const id='mama';say(id,pick([`¿Quiere un cafecito con pan? Acabo de chorrear.`,`Le serví un platito de gallo pinto. No me diga que no.`,`Acabo de sacar unas tortillas. Calientitas. Siéntese.`]),[{t:`Con gusto, doña Lucía`,f(){if(capDay('food',1)){relAdd('lu',.4);learnHint('comida')}say(id,`¡Así me gusta! Los muchachos que comen son los que crecen.`);cb&&cb()}},{t:`Ya comí, gracias`,f(){say(id,`Un poquito siquiera, mijo. Para el camino.`,[{t:`Bueno, un poquito`,f(){relAdd('lu',.2);say(id,`¿Ve? Si no cuesta nada.`);cb&&cb()}},{t:`De verdad no, gracias`,f(){relAdd('lu',-.4);say(id,`...Bueno. Está bien. Si cambia de idea, aquí queda.`);say(null,`${N(id)} baja la mirada, un poco dolida. Aquí nadie rechaza comida.`);cb&&cb()}}])}}])}
function lucKitchen(cb){const id='mama';if(!capDay('cocina',1)){say(id,`Ya me ayudó hoy, mi amor. No me lo vaya a cansar.`);cb&&cb();return}
 say(id,`Ay, ¿me ayuda con la cocina? ¡Qué dicha! A ver, escoja.`,[{t:`Picar cebolla y chile dulce`,f(){relAdd('lu',.4);say(id,`No llore, que es solo cebolla. ¡Mire qué bonito le queda el picadillo!`);if(luTier()>=2&&Math.random()<.5){arLearn('like');say(id,`Ahí donde me ve, a esa muchacha desde chiquita le encanta ${AR_LIKES[arLike()]}. Pero no le diga que se lo conté.`)}cb&&cb()}},{t:`Moler el café`,f(){relAdd('lu',.4);say(id,`Ese olor... Dios mío. Mi suegra molía el café así, con paciencia.`);cb&&cb()}},{t:`Lavar los trastos`,f(){relAdd('lu',.3);say(id,`Bendito sea Dios por los muchachos que lavan trastos. Se ganó un cielo.`);cb&&cb()}}])}
function lucAri(cb){const id='mama',t=luTier();
 if(t>=2&&!PH().known.like){arLearn('like');say(id,`A esa muchacha desde chiquita le encanta ${AR_LIKES[arLike()]}. Pero no le diga que se lo conté.`);cb&&cb();return}
 say(id,pick(t>=2?[`Ariana habla mucho de usted. Con esa sonrisita que pone cuando cree que nadie la ve.`,`Mire, mijo: si ella llega de mal humor, no la presione. Dele su espacio y un antojo. Siempre funciona.`]:[`Es buena muchacha, mi Ariana. Tiene su carácter, eso sí. Sale a su padre.`,`Cuídela, ¿sí? Es de las que cuando quieren, quieren de verdad.`]));cb&&cb()}
function lucMenu(first){const id='mama',ch=[],back=()=>lucMenu();
 ch.push({t:`¿Cómo amaneció, doña Lucía?`,f(){if(capDay('lchat',1))relAdd('lu',.1);say(id,pick(luTier()>=2?[`Con la olla en el fuego y el corazón contento, mijo. ¿Y usted?`,`Dios es muy bueno, mijo. Acabo de rezar por todos ustedes.`]:[`Bien, gracias a Dios. Aquí, ocupada, como siempre.`,`Bien, mijo. Con el dolor de la rodilla, pero no me quejo.`]));if(Math.random()<.5)lucFood(back);else back()}});
 ch.push({t:`Ayudarle en la cocina`,f(){lucKitchen(back)}});
 ch.push({t:`¿Ocupa algún mandado?`,f(){pedOffer('mama');back()}});
 ch.push({t:`Preguntar por Ariana`,f(){lucAri(back)}});
 ch.push({t:`Con su permiso, me voy`,f(){say(id,pick([`Vaya con Dios, mijo. Y coma.`,`Cuídese, mi amor. Venga cuando quiera.`]))}});
 say(id,first?lucHello():pick([`¿Algo más, mijo?`,`Dígame, mi amor.`]),ch)}

// ---------- programación de mensajes ----------
function phDay(){const f=S.f;if(qs('barra')===2&&f.arLast==null)f.arLast=S.day;
 if(qs('barra')===2&&f.arLast!=null&&S.day-f.arLast>=3&&(f.arRel||0)>-10){arHurt('descuido',1);f.arLast=S.day-1;phQueue('ariana',pick([`¿estás vivo? tres días sin saber nada de vos 😒`,`mae... ya ni me saludás en la calle. ¿qué hice? 🥺`]),20)}}
function phSchedule(p,now,h){const f=S.f,Z=p.sent;
 if((qs('tortillas')===2||qs('visita')===2||S.f.vMama||S.met.mama)&&!p.luNum){p.luNum=1;phQueue('mama',`Mijo, aquí le dejo mi número por si ocupo algo, o por si usted ocupa comida 😄 Dios lo bendiga. — Lucía`,3)}
 if(p.luNum&&!p.papaNum&&(f.opinion||0)>=1.5&&!Z.cnum){Z.cnum=1;p.papaNum=1;phQueue('mama',`Mijo, no le diga que fui yo, pero ${N('papa')} me pidió que le pasara su número. Le va a escribir. Respóndale rápido y con respeto, que a él le gusta eso 🙏`,2);phQueue('papa',`Es Alexander. Guarde el número. No es para tonterías. — A.`,28)}
 if(phOn('ariana')){const mood=arMood();
  if(f.arWhy&&h>=10&&h<20&&!Z.ars&&!p.wait.ariana){Z.ars=1;phMsg('ariana',pick({visto:[`vi que me dejaste en visto. no pasa nada. (sí pasa)`],planton:[`ni siquiera apareciste.`],mandado:[`ya no hace falta lo que te pedí. gracias por nada.`],descuido:[`ya ni te acordás de que existo, ¿verdad?`],cita:[`la cita estuvo rara, ¿no?`]}[f.arWhy]||[`...`]),{key:'ar_sorry',ctx:{mood}})}
  else if(h>=7&&h<11&&!Z.arm&&!p.wait.ariana){Z.arm=1;phMsg('ariana',pick(AR_MORN[mood]),{key:'ar_m',ctx:{mood}})}
  else if(h>=13&&h<17&&!Z.ara&&!p.wait.ariana&&!f.arWhy){Z.ara=1;
   if(arTier()>=2&&dateOk()&&mood!=='cansada'&&hsh(S.day,17)<.55){const loc=['parque','pulperia','parada'][Math.floor(hsh(S.day,19)*3)];phMsg('ariana',{parque:`mae, ¿vamos al parque hoy a las 6? me muero por sentarme en la banca del kiosco 🌇`,pulperia:`tengo antojo de helado y de conversar. ¿nos vemos en la pulpería a las 6? 🍦`,parada:`¿te animás a ir a la parada a ver cómo se va la tarde? es mi plan favorito (no le digás a nadie) 🌅`}[loc],{key:'ar_date',ctx:{loc,h:18,mood}})}
   else if(!pedActive('ariana').length&&hsh(S.day,13)<.6){const d=pedPick('ariana');if(d)phMsg('ariana',d.t(),{key:'ped',ctx:{id:d.id}});else{const i=(f.arChatI=(f.arChatI||0)+1)%AR_CHAT.length;phMsg('ariana',AR_CHAT[i].m,{key:'ar_chat',ctx:{i}})}}
   else{const i=(f.arChatI=(f.arChatI||0)+1)%AR_CHAT.length;phMsg('ariana',AR_CHAT[i].m,{key:'ar_chat',ctx:{i}})}}
  else if(h>=20&&h<22&&!Z.arn&&!p.wait.ariana&&(S.day%2===0||mood==='romantica')){Z.arn=1;phMsg('ariana',pick([`buenas noches 🌙 ¿qué hiciste hoy?`,`ya me voy a dormir... ¿cómo te fue hoy? 🌙`]),{key:'ar_n',ctx:{mood}})}}
 if(phOn('mama')&&h>=9&&h<17&&!Z.lu&&!p.wait.mama&&!pedActive('mama').length){Z.lu=1;
  if(hsh(S.day,5)<.7){const d=pedPick('mama');if(d)phMsg('mama',d.t(),{key:'ped',ctx:{id:d.id}});else phMsg('mama',`Mijo, ¿ya almorzó? Mire que está muy flaquito 😤`,{key:'lu_chat',ctx:{}})}
  else phMsg('mama',`Mijo, ¿ya almorzó? Mire que está muy flaquito 😤`,{key:'lu_chat',ctx:{}})}
 if(phOn('papa')&&!Z.ca&&((h>=5&&h<9)||(h>=17&&h<20))&&S.day-(p.caLast==null?-9:p.caLast)>=2&&!p.wait.papa){Z.ca=1;p.caLast=S.day;
  if(opTier()>=2&&!pedActive('papa').length&&hsh(S.day,9)<.5){const d=pedPick('papa');if(d){phMsg('papa',d.t(),{key:'ped',ctx:{id:d.id}});return}}
  if(h<9)phMsg('papa',`Buenos días. Son las ${fmtM(now)} Al que madruga Dios lo ayuda. — Alexander`,{key:'ca_m',ctx:{}});
  else{const i=Math.floor(Math.random()*DICHOS.length);phMsg('papa',`Complete, muchacho: «${DICHOS[i].a}...» — A.`,{key:'ca_dicho',ctx:{i,o:shuf([0,1,2])}})}}}
function phoneTick(dt){if(!S||!S.started)return;phAcc+=dt;if(phAcc<1.2)return;phAcc=0;const p=PH(),now=nowM(),h=hour();
 if(p.ld!==S.day){p.ld=S.day;p.sent={};phDay()}
 if(p.q.length){const due=p.q.filter(m=>m.at<=now);if(due.length){p.q=p.q.filter(m=>m.at>now);due.forEach(m=>phMsg(m.who,m.text,m.ask))}}
 for(const who of['ariana','mama','papa']){const w=p.wait[who];if(w&&now-w.at>(who==='ariana'?270:360)){p.wait[who]=null;if(w.key!=='ped')phLeft(who);if(phVisible())phRender()}}
 for(const d of p.ped)if(!d.done&&!d.fail&&now>d.due)pedFail(d);
 dateTick(now);phSchedule(p,now,h);phBadge()}

// ---------- integración con misiones y HUD ----------
function questExtras(){if(!S.f.ph&&qs('barra')!==2)return'';const p=PH();let h='';const d=dateOn();
 if(d)h+=`<div class="qitem"><b>💌 Cita con ${esc(N('ariana'))}</b><p>${d.day===S.day?'Hoy':'Mañana'} a las ${fmtM(d.h*60)} · ${esc(DATE_LOCS[d.loc].l)}. Llegá puntual.</p></div>`;
 for(const x of p.ped.filter(x=>!x.done&&!x.fail))h+=`<div class="qitem"><b>📝 Mandado de ${esc(N(x.who))}</b><p>${esc(pedItemName(x))} antes de las ${fmtM(x.due)}${x.pay?' · ₡'+x.pay:''}${(S.inv[x.item]||0)>=x.n?' · ¡Ya lo tenés!':''}</p></div>`;
 return h}
function hudHint(act){const d=dateOn();if(d){const st=d.day*1440+d.h*60,n=nowM();if(n>=st-180&&n<=st+60)return`💛 Cita: ${fmtM(st)} · ${DATE_LOCS[d.loc].s}`}
 if(curZone()!=='barrio')return zHint();
 const p=S.f.ph;if(p){const a=p.ped.filter(x=>!x.done&&!x.fail).sort((x,y)=>x.due-y.due)[0];if(a)return`📝 ${pedItemName(a)} → ${N(a.who)} (${fmtM(a.due)})`}
 return act?'▶ '+QUESTS[act].t:'Explorá el barrio'}
function questNPC2(id){if(!S||!S.f)return 0;if(id==='ariana'&&dateAt())return 1;if(S.f.ph&&(id==='ariana'||id==='mama'||id==='papa')&&pedReady(id))return 1;return 0}

const TALK={
 ariana(){const id='ariana';
  if(qs('barra')===1&&!S.met[id]){meet(id);say(id,`¡Diay, ${N('player')}! Por fin salís de la casa. Ya creía que te habías mudado al sillón.`,[
   {t:'Pura vida, ¿y vos qué?',f(){S.f.arRel=(S.f.arRel||0)+1;say(id,'Aquí, planeando el fin de semana. Siempre hay algo que hacer en este barrio, solo hay que buscarlo.')}},
   {t:'Ando buscando a la barra',f(){say(id,`${N('matias')} debe andar por su casa, la verde menta. Y ${N('nicolas')}... ese aparece donde menos uno se lo espera.`)}},
   {t:'¿Me estabas esperando?',f(){S.f.arRel=(S.f.arRel||0)+1;say(id,'¿Yo? Jamás. Solo pasaba... por casualidad... frente a tu casa... tres veces. ¡Es broma!')}}]);return}
  if(fiestaReady()&&!qs('fiesta')){say(id,'¡Oíme! Hoy le ayudaste a medio barrio. ¿Sabés qué merece eso?',[
   {t:'¿Una siesta?',f(){say(id,'¡No! ¡Una fiesta! Esta noche en el parque, al lado del kiosco. Yo le aviso a todo el mundo.');startQ('fiesta')}},
   {t:'¿Un fresco de cas?',f(){say(id,'Eso también. ¡Pero mejor una fiesta del barrio! Hoy en la noche, en el parque. Yo invito.');startQ('fiesta')}}]);say(id,'Llegá después de las seis. ¡No me quedés mal!');return}
  if(qs('fiesta')===1){say(id,hour()>=18||hour()<3?'¡Ya está empezando! Andá al parque, al kiosco.':'Todavía estoy organizando. Después de las seis en el parque, ¿ok?');return}
  const opts=[];
  if(S.rain)opts.push(()=>say(id,'¡Qué aguacero! Se me mojaron las tenis nuevas. Típico: salgo sin sombrilla y se cae el cielo.'));
  if(isNight())opts.push(()=>say(id,'De noche el barrio se ve más bonito, con los postes encendidos y los grillos.',[{t:'Sí, muy tranquilo',f(){say(id,'Aunque el perro de enfrente no opina igual. Ladra hasta a la luna.')}},{t:'A mí me da miedo el Cadejos',f(){say(id,'¡Ja! Dicen que sale por el trillo de atrás de las casas, ya tarde... pero solo se les aparece a los que andan en malos pasos.')}}]));
  if(qs('visita')===2)opts.push(()=>{const g=S.f.vGift;say(id,g==='queque'?'Me contaron que llevaste queque a donde tus suegros. ¡Quedaste como rey!':g==='coca'?'¿Llevaste una gaseosa de tres litros a la visita? Práctico. Muy práctico.':'¿Fuiste con las manos vacías a donde tus suegros? Valiente. O inconsciente.')});
  if(hasI('tazo'))opts.push(()=>say(id,'¡¿Eso es un tazo?! De botella de tres litros, cortado con la tapa puesta. Yo tenía casi la colección completa de chiquita... hasta que ' + N('kevin') + ' me la ganó. Ese te los compra.'));
  if(S.f.fiestaDone)opts.push(()=>say(id,'Todavía me duelen los pies de bailar en la fiesta. ¡Valió la pena!'));
  opts.push(()=>say(id,'Te tengo una pregunta seria.',[{t:'Decime',f(){say(id,'¿Gallo pinto con natilla o con huevo?',[{t:'Natilla',f(){S.f.pinto='natilla';say(id,'Gente de bien. Sabía que podía confiar en vos.')}},{t:'Huevo',f(){S.f.pinto='huevo';say(id,'Respetable. Clásico. Sin sorpresas.')}},{t:'Las dos',f(){S.f.pinto='ambos';say(id,'Eso se llama tener ambición. Me gusta.')}}])}},{t:'Me asustás',f(){say(id,'Tranqui, no es nada grave... todavía.')}}]));
  opts.push(()=>say(id,'¿Sabías que la pulpería de '+N('rosa')+' tiene más años que todos nosotros juntos? Ahí compraba mi abuela... dice la leyenda.'));
  opts.push(()=>say(id,period()==='t'?'Vine a ver la mejenga. Bueno, a ver a los que juegan mejenga y se caen.':'Hoy amanecí con ganas de hacer algo distinto. ¿Se te ocurre algo?',[{t:'Caminar por el barrio',f(){say(id,'Buena idea. Siempre se encuentra uno algo nuevo... o a alguien.')}},{t:'Ir a comprar algo a la pulpería',f(){say(id,'¡Un helado de palito! Me leíste la mente.')}}]));
  rot(id,opts)()},
 nicolas(){const id='nicolas';
  if(qs('barra')===1&&!S.met[id]){meet(id);say(id,'¡Mae! Justo te andaba buscando. Bueno, no, pero ya que estás aquí...');say(id,'Se me perdió el cargador del celular. Creo que lo dejé en la parada del bus. Tengo 3% de batería y mucha ansiedad.',[
   {t:'Tranqui, yo te lo busco',f(){S.f.nicRel=1;say(id,'¡Sos lo máximo! Si lo encontrás, te invito a un fresco.');startQ('cargador')}},
   {t:'¿Y yo qué gano?',f(){say(id,'Mi eterna gratitud... y un fresco de cas. Trato justo.');startQ('cargador')}}]);return}
  if(qs('cargador')===1&&hasI('cargador')){remI('cargador');say(id,'¡MI CARGADOR! Pensé que no lo volvía a ver. Le había hecho hasta un funeral mental.');say(id,'Tomá, lo prometido.');addI('fresco');S.f.cargDone=1;afterD(()=>doneQ('cargador'));return}
  if(qs('cargador')===1){say(id,'¿Y el cargador? Revisá la parada, debajo de la banca. Tengo 2%... ahora 1%... ¡apurate!');return}
  if(period()==='n'&&nicLoc()==='parada'&&!S.f.sec.estrellas){say(id,'Shh... vení, sentate. ¿Ves esa estrella al lado del poste?',[{t:'¿Cuál?',f(){say(id,'Esa. La que parpadea. Desde chiquillo me siento aquí a verla cuando no puedo dormir. No le contés a nadie, tengo una reputación de payaso que cuidar.')}},{t:'Es un avión, mae',f(){say(id,'...Bueno, es mi avión favorito entonces. Me siento aquí a verlo cuando no puedo dormir.')}}]);afterD(()=>secret('estrellas','Las estrellas de '+N('nicolas')));return}
  const L=nicLoc();const opts=[
   ()=>say(id,'¿Sabés por qué el bus nunca llega? Porque siempre está «por llegar».'),
   ()=>say(id,'Estoy pensando en poner un negocio: lavado de carros en época lluviosa. Cero inversión, la lluvia hace todo.',[{t:'Genio',f(){say(id,'Lo sé. El mundo no está listo.')}},{t:'Eso no tiene sentido',f(){say(id,'Por eso nadie lo ha hecho. ¡Oportunidad!')}}]),
   ()=>say(id,L==='parada'?'Aquí esperando el bus. O que pase algo interesante. Lo que llegue primero.':L==='parque'?'Haciendo cardio... mental. Viendo a otros correr.':L==='calle'?'Patrullando. Alguien tiene que cuidar el barrio.':'En la casa, haciéndome el ocupado para que no me pongan a lavar platos.')];
  if(S.f.cargDone)opts.push(()=>say(id,'Gracias otra vez por el cargador. Ahora mi mamá me puede llamar para regañarme. Gran logro.'));
  if(S.rain)opts.push(()=>say(id,'¡Mirá ese aguacero! Ya te dije: mi negocio de lavado de carros se está haciendo solo.'));
  if(qs('visita')===2&&(S.f.opinion||0)<1)opts.push(()=>say(id,'Me contaron que '+N('papa')+' te miró feo. Tranqui, a mí también me ve así y ni siquiera ando con la hija.'));
  rot(id,opts)()},
 matias(){const id='matias';
  if(qs('barra')===1&&!S.met[id]){meet(id);say(id,'Ah, ¡qué hubo, primo! Perdón, ando preocupado.');say(id,'Firulais se volvió a volar la tapia. Creo que se fue por el trillo de tierra, atrás de las casas. ¿Me ayudás a buscarlo?',[
   {t:'Claro, yo lo traigo',f(){say(id,'¡Gracias! Es blanco, orejón y le encanta meterse donde no debe.');startQ('firulais')}},
   {t:'¿Otra vez? Bueno, dale',f(){say(id,'Sí... es la tercera vez este mes. Tiene alma de aventurero.');startQ('firulais')}}]);return}
  if(qs('firulais')===1){if(S.f.dogFollow){say(id,'¡FIRULAIS! ¡Perro malcriado, vení aquí!');say(null,'Firulais se tira panza arriba frente a '+N('matias')+' como si nada hubiera pasado.');say(id,'Gracias, primo. Te debo una. Si querés, cuando esté en el parque, jugamos una mejenga.');S.f.dogFollow=0;S.f.dogHome=1;afterD(()=>doneQ('firulais'))}
   else say(id,'¿Nada de Firulais? Buscalo por el trillo de tierra detrás de las casas. Si le hablás, te sigue.');return}
  if(qs('firulais')===2&&NPC.matias&&NPC.matias.loc==='parque'){say(id,'¡Primo! ¿Echamos unos penales? Yo tapo.',[
   {t:'¡Dale!',f(){say(id,'¿A dónde vas a tirar?',['izquierda','centro','derecha'].map(s=>({t:'Tiro a la '+s.replace('a la centro','al centro'),f(){const g=pick(['izquierda','centro','derecha']);if(g===s){S.f.saves=(S.f.saves||0)+1;say(id,'¡LA TAPÉ! Como Keylor en sus mejores tiempos.')}else{S.f.goals=(S.f.goals||0)+1;say(id,'¡GOOOOL! Me tiré a la '+g+'... qué vergüenza.')}say(null,'Marcador acumulado — Goles: '+(S.f.goals||0)+' · Atajadas de '+N('matias')+': '+(S.f.saves||0))}})))}},
   {t:'Ahora no',f(){say(id,'Va, aquí estoy cuando quieras.')}}]);return}
  const opts=[()=>say(id,'Primo, ¿te acordás cuando nos subimos al palo de mango del vecino? Bueno, yo tampoco, pero suena a algo que habríamos hecho.'),
   ()=>say(id,'Firulais anda tranquilo hoy. Sospechoso. Muy sospechoso.'),
   ()=>say(id,isNight()?'Ya casi me voy a dormir. Mañana hay que madrugar, o eso dicen.':'Hoy está para una mejenga en la tarde. ¿Te apuntás?',isNight()?null:[{t:'Me apunto',f(){say(id,'Pasate por el parque en la tarde. Yo llevo la bola.')}},{t:'Mejor no, me canso',f(){say(id,'Primo... tenés veintitantos, no ochenta.')}}])];
  if(qs('visita')===2)opts.push(()=>say(id,'¿Y? ¿Cómo te fue con los suegros? ¡Contame todo!',[{t:'Bien, creo',f(){say(id,(S.f.opinion||0)>=2?'¡Eso! Dicen que '+N('papa')+' ya anda hablando bien de vos.':'«Creo» no suena muy seguro, primo.')}},{t:N('papa')+' me miró feo',f(){say(id,'Así ve a todo el mundo. Dicen que hasta al cartero le hizo una entrevista.')}}]));
  rot(id,opts)()},
 papa(){const id='papa';
  if(qs('visita')===1&&!S.f.vPapa){const g=visGift();if(g!=='nada')remI(g);S.f.vGift=g;S.f.vPapa=1;let op=g==='queque'?1:g==='coca'?0.5:0;
   say(id,g==='queque'?'Hmm... ¿queque de naranja? Mi favorito. Bueno. Pase, pase.':g==='coca'?'Una gaseosa de tres litros. Práctico. Bien. Póngala en la refri.':'Buenas... ¿Y las manos? ...Es broma. Bueno, no tanto. Pase.');
   say(id,'Dígame una cosa, ¿usted a qué se dedica?',[
    {t:'Estudio y trabajo',f(){op+=1;S.f.opinion=op;say(id,'Hmm. Eso está bien. La gente trabajadora se reconoce.')}},
    {t:'Pues... a ver qué sale',f(){S.f.opinion=op;say(id,'«A ver qué sale». Ajá. Interesante filosofía.')}},
    {t:'A hacer feliz a su hija',f(){op+=1;S.f.opinion=op;say(id,'¡Ja! Buena respuesta. Cursi, pero buena.')}}]);
   checkVisita();return}
  const o=S.f.opinion||0;
  if(qs('visita')!==2){say(id,qs('visita')===1?'Buenas. Ya hablamos. Vaya salude a la señora.':'Buenas. Mi hija dice que usted vendrá de visita... algún día.');return}
  const opts=[()=>say(id,o>=2?'¡Hombre! Pase adelante cuando quiera. Ya es de la casa.':o>=1?'Buenas. Siga, siga, está en su casa.':'Mmm. Usted es el de las manos vacías... digo, buenas.'),
   ()=>say(id,'¿Vio el partido de anoche? Esa defensa es un desastre.',[{t:'¡Totalmente!',f(){S.f.opinion=(S.f.opinion||0)+.5;say(id,'¡Por fin alguien con criterio en esta familia!')}},{t:'Yo no veo fútbol',f(){S.f.opinion=(S.f.opinion||0)-.5;say(id,'...¿Cómo dijo?');say(null,N('papa')+' se queda viéndote en silencio durante cinco largos segundos.')}}]),
   ()=>say(id,period()==='e'?'Salí a caminar. El doctor dice que es bueno para el corazón. La señora dice que es para que no me duerma en el sillón.':'La casa no se arregla sola. Hoy toca revisar la canoa del techo.')];
  rot(id,opts)()},
 mama(){const id='mama';
  if(qs('visita')===1&&!S.f.vMama){S.f.vMama=1;say(id,'¡Ay, qué dicha que vino! Pase, pase, está en su casa. ¿Ya comió?',[
   {t:'Sí, gracias',f(){say(id,'Igual le sirvo un cafecito con pan. No me desprecie.')}},
   {t:'La verdad no',f(){S.f.ate=1;say(id,'¡Ya mismo le sirvo gallo pinto! Siéntese ahí. Y no me diga que no.');afterD(()=>{if(!S.f.gpGiven){S.f.gpGiven=1;addI('gallopinto')}})}}]);
   say(id,'Yuca se hace el serio, pero se puso camisa planchada porque usted venía. No le diga que le conté.');
   checkVisita();return}
  if(qs('visita')===2&&!qs('tortillas')){say(id,'¿Me hace un favorcito? Vaya a la pulpería y me trae un paquete de tortillas para la cena. Se me olvidaron, ¡con la emoción de la visita!',[{t:'Claro, ya vuelvo',f(){say(id,'¡Qué amor! Dígale a '+N('rosa')+' que son para mí.');startQ('tortillas')}},{t:'¿Calientitas?',f(){say(id,'¡Claro que calientitas! Usted sí sabe.');startQ('tortillas')}}]);return}
  if(qs('tortillas')===1&&hasI('tortillas')){remI('tortillas');say(id,'¡Mis tortillas! Usted sí es un amor. Tome, para el bus.');S.money+=1000;toast('+ ₡1000');afterD(()=>doneQ('tortillas'));return}
  if(qs('tortillas')===1){say(id,'¿Y las tortillas, mi amor? En la pulpería las tienen.');return}
  const opts=[()=>say(id,'¿Ya comió? Lo veo flaco. Venga cuando quiera, aquí siempre hay comida.'),
   ()=>say(id,(S.f.opinion||0)>=1?'Yuca anda diciendo que usted es buena gente. Bueno, dijo «no está tan mal», que en su idioma es lo mismo.':'No se preocupe por Yuca. Así es con todo el mundo. Ya se le va a ablandar.'),
   ()=>say(id,S.f.pinto?'Me contaron que a usted le gusta el gallo pinto con '+(S.f.pinto==='ambos'?'natilla y huevo':S.f.pinto)+'. ¡Ya sé qué hacerle la próxima vez!':'Ayer hice arroz con pollo para un regimiento. ¿Quiere llevarse un poquito?'),
   ()=>say(id,S.rain?'¡Ay, qué aguacero! ¿No se mojó? Séquese bien, que se resfría.':'Qué lindo está el día para tender ropa.')];
  rot(id,opts)()},
 rosa(){shopTalk(true)},
 marta(){const id='marta';
  if(!qs('gallo')){say(id,'¡Ay, mi amor, qué dicha que pasa! Kiki, mi gallo, se me escapó otra vez. Seguro anda en el parque correteando palomas.',[{t:'Yo se lo traigo',f(){say(id,'¡Bendito! Cuidado, es rapidísimo y muy orgulloso.');startQ('gallo')}},{t:'¿Un gallo en el parque?',f(){say(id,'Él se cree dueño del parque. Ayúdeme a traerlo, ¿sí?');startQ('gallo')}}]);return}
  if(qs('gallo')===1&&hasI('kiki')){remI('kiki');say(id,'¡KIKI! Mi rey. ¡Gracias! Tome, una pequeña recompensa.');S.money+=1500;toast('+ ₡1500');S.f.kikiBack=1;afterD(()=>doneQ('gallo'));return}
  if(qs('gallo')===1){say(id,'Kiki está en el parque, seguro. Acorrálelo contra la tapia, así no se escapa.');return}
  say(id,rot('martaG',['Kiki ya está en el patio, cantando a las cuatro de la mañana como siempre.','¿Quiere un cafecito? Acabo de chorrear.','Usted es muy buena gente. Su familia lo crió bien.']))},
 beto(){const id='beto';if(qs('cargador')===1&&!S.f.cargGot){say(id,'¿Un cargador? Vi un cable enrollado debajo de la banca de la parada. Pensé que era una culebra.');return}
  say(id,rot('beto',['El bus sale cada tres horas. Bueno, más o menos. Depende del tráfico, del clima y de mi humor.','Veinte años manejando esta ruta. Me sé cada hueco de la calle de memoria.','Si ve a alguien corriendo detrás del bus, ese soy yo cuando me dejo las llaves.']),[{t:'¿A qué hora pasa el próximo?',f(){const n=BUS_H.find(h=>h>hour());say(id,n?'Por ahí de las '+fmtH(n)+'. Más o menos.':'Hoy ya no. Mañana a las 7, si Dios quiere.')}},{t:'Que le vaya bien',f(){say(id,'Igualmente. Con cuidado al cruzar.')}}])},
 kevin(){const id='kevin',f=S.f,atE=NPC.kevin&&NPC.kevin.loc==='entrada';
  say(null,atE?pickR(KV_INTRO):pickR(['Carlillos está en la parada con la gorra para atrás, silbándole a todo lo que pasa.','Carlillos camina con las manos en las bolsas y la pinta de quien no tiene prisa ni planes.']));
  if(hasI('tazo')){say(id,'¡¿Eso son tazos?! De botella de tres litros, cortados a la mitad y con la tapa con hueco puesta... Sos de los buenos, no voy a mentir.',[
   {t:'Te los vendo',f(){const n=S.inv.tazo;delete S.inv.tazo;const p=ACTIVITY_RULES.tazoValue();S.money+=n*p;S.f.tazoSold=(S.f.tazoSold||0)+n;toast('Tazos · + ₡'+n*p);say(id,'que coronadota, digales loco');if((S.f.tazoSold||0)>=3){S.money+=ACTIVITY_RULES.tazoBonus();toast('Colección completa · + ₡'+ACTIVITY_RULES.tazoBonus());say(id,'¡LOS TRES! Sos el único que me ha armado la colección completa. Tomá un extra, pero no le digas a mi mamá.')}else say(id,'Negocio hecho. Van '+(S.f.tazoSold||0)+'/3 de mi colección. Si encontrás más, sabés dónde ando.')}},{t:'Son míos',f(){say(id,'Qué picho... Bueno, si cambiás de opinión, aquí ando. Yo no ruego... mucho.')}}]);return}
  if(hasI('chicle')&&!S.f.kevinTip){say(id,'¿Eso es un chicle? ¿Me lo regalás?',[{t:'Tomá',f(){remI('chicle');S.f.kevinTip=1;say(id,'¡Gracias! Te cuento un secreto: escondí tres tazos por el barrio, de botella de tres litros cortada. Uno en la cuneta frente a la casa de '+N('matias')+', otro detrás de la casa rosada y otro en un arbusto del parque.')}},{t:'No, es mío',f(){say(id,'Tacaño... Bueno, si cambiás de opinión, aquí estoy.')}}]);return}
  if(!f.kvMet){f.kvMet=1;say(id,'¿Diay? ¿Usted es el nuevo del barrio? Tranquilo, mopri, aquí nadie muerde… si yo no quiero.');say(id,'Carlillos. Para servirle. O para no servirle, depende del día.');kvAdd(.5)}
  if(f.kvD!==S.day){f.kvD=S.day;f.kvR=clamp((f.kvR||0)+.2,-3,12)}
  const o=[];
  if(f.kvAnt===1&&hasI('papitas')&&hasI('coca'))o.push({t:'Darle las papitas y la gaseosa',f(){remI('papitas');remI('coca');f.kvAnt=2;say(id,'¡AY, MAE! ¡Usted es un santo! ¡Un santo del barrio!');say(null,'Carlillos abre las papitas con los dientes y se toma media gaseosa de un solo trago.');say(id,'Le debo una. Y Carlillos paga sus deudas: si alguien lo molesta de noche por la entrada, usted diga que es mi mopri.');kvAdd(2.5)}});
  if(hasI('pollo'))o.push({t:'Compartirle pollo de Pollolandia',f(){remI('pollo');say(id,'Papito.. ahora sí me saco el menudo perrito, calidad de bajonazo');kvAdd(1.5);enAdd(10)}});
  o.push({t:'¿Qué hubo, Carlillos?',f(){say(id,rot('kevin2',KV_LINES))}});
  if(!f.kvAnt)o.push({t:'¿Ocupás algo?',f(){f.kvAnt=1;say(id,'Mae, ¿sabe qué ocupo? Tengo un hambre que me como un caballo con todo y jinete.');say(id,'¿Me hace un favor? Tráigame unas papitas y una gaseosa grande del súper chino. Yo le pago… después. Palabra de Carlillos.')}});
  else if(f.kvAnt===1&&!(hasI('papitas')&&hasI('coca')))o.push({t:'Lo de las papitas',f(){say(id,'¿Y mis papitas? Mae, me estoy muriendo aquí. Papitas y una gaseosa grande. Del chino, que la pulpería es carísima.')}});
  o.push({t:'¿Qué vendés?',f(){kvShop()}});
  o.push({t:'¿Es peligrosa la entrada?',f(){say(id,kvR()>=3?'Para usted ya no, mopri. Usted es de los míos. Si alguien le dice algo, diga mi nombre.':'De día, no. De noche… depende de quién sea usted. Y usted todavía no es nadie aquí, con todo respeto.')}});
  o.push({t:'Nada, nos vemos',f(){say(id,rot('kevin3',['Suave, mopri.','Pura vida. Cuídese de los chapulines.','Diay, suave pues. Aquí estoy, como siempre.']))}});
  say(id,rot('kevinG',['¿Qué hay, mopri?','Diay, ¿qué me cuenta?','Upe, ¿qué se le perdió por aquí?','¿Qué más, mae? Todo tuanis, ¿o qué?']),o)}
};
// ---------- reemplazo de las conversaciones con la novia y los suegros ----------
function arChatter(cb){const id='ariana',o=[];
 if(S.rain)o.push(()=>say(id,'¡Qué aguacero! Se me mojaron las tenis nuevas. Típico: salgo sin sombrilla y se cae el cielo.'));
 if(isNight())o.push(()=>say(id,'De noche el barrio se ve más bonito, con los postes encendidos y los grillos.',[{t:'Sí, muy tranquilo',f(){say(id,'Aunque el perro de enfrente no opina igual. Ladra hasta a la luna.')}},{t:'A mí me da miedo el Cadejos',f(){say(id,'¡Ja! Dicen que sale por el trillo de atrás de las casas, ya tarde... pero solo se les aparece a los que andan en malos pasos.')}}]));
 if(qs('visita')===2)o.push(()=>{const g=S.f.vGift;say(id,g==='queque'?'Me contaron que llevaste queque a donde mis papás. ¡Quedaste como rey!':g==='coca'?'¿Llevaste una gaseosa de tres litros a la visita? Práctico. Muy práctico.':'¿Fuiste con las manos vacías a donde mis papás? Valiente. O inconsciente.')});
 if(hasI('tazo'))o.push(()=>say(id,'¡¿Eso es un tazo?! De botella de tres litros, cortado con la tapa puesta. Yo tenía casi la colección completa... hasta que '+N('kevin')+' me la ganó. Ese te los compra.'));
 if(S.f.fiestaDone)o.push(()=>say(id,'Todavía me duelen los pies de bailar en la fiesta. ¡Valió la pena!'));
 o.push(()=>say(id,'Te tengo una pregunta seria.',[{t:'Decime',f(){say(id,'¿Gallo pinto con natilla o con huevo?',[{t:'Natilla',f(){S.f.pinto='natilla';say(id,'Gente de bien. Sabía que podía confiar en vos.')}},{t:'Huevo',f(){S.f.pinto='huevo';say(id,'Respetable. Clásico. Sin sorpresas.')}},{t:'Las dos',f(){S.f.pinto='ambos';say(id,'Eso se llama tener ambición. Me gusta.')}}])}},{t:'Me asustás',f(){say(id,'Tranqui, no es nada grave... todavía.')}}]));
 o.push(()=>say(id,'¿Sabías que la pulpería de '+N('rosa')+' tiene más años que todos nosotros juntos? Ahí compraba mi abuela... dice la leyenda.'));
 o.push(()=>say(id,period()==='t'?'Vine a ver la mejenga. Bueno, a ver a los que juegan mejenga y se caen.':'Hoy amanecí con ganas de hacer algo distinto. ¿Se te ocurre algo?',[{t:'Caminar por el barrio',f(){say(id,'Buena idea. Siempre se encuentra uno algo nuevo... o a alguien.')}},{t:'Ir a comprar algo a la pulpería',f(){say(id,'¡Un helado de palito! Me leíste la mente.')}}]));
 rot('arChat',o)();cb&&cb()}
TALK.ariana=function(){const id='ariana';
 if(qs('barra')===1&&!S.met[id]){meet(id);say(id,`¡Diay, ${N('player')}! Por fin salís de la casa. Ya creía que te habías mudado al sillón.`,[
   {t:'Pura vida, ¿y vos qué?',f(){relAdd('ar',1);say(id,'Aquí, planeando el fin de semana. Siempre hay algo que hacer en este barrio, solo hay que buscarlo.')}},
   {t:'Ando buscando a la barra',f(){say(id,`${N('matias')} debe andar por su casa, la verde menta. Y ${N('nicolas')}... ese aparece donde menos uno se lo espera.`)}},
   {t:'¿Me estabas esperando?',f(){relAdd('ar',1);say(id,'¿Yo? Jamás. Solo pasaba... por casualidad... frente a tu casa... tres veces. ¡Es broma!')}}]);return}
 if(fiestaReady()&&!qs('fiesta')){say(id,'¡Oíme! Hoy le ayudaste a medio barrio. ¿Sabés qué merece eso?',[
   {t:'¿Una siesta?',f(){say(id,'¡No! ¡Una fiesta! Esta noche en el parque, al lado del kiosco. Yo le aviso a todo el mundo.');startQ('fiesta')}},
   {t:'¿Un fresco de cas?',f(){say(id,'Eso también. ¡Pero mejor una fiesta del barrio! Hoy en la noche, en el parque. Yo invito.');startQ('fiesta')}}]);say(id,'Llegá después de las seis. ¡No me quedés mal!');return}
 if(qs('fiesta')===1){say(id,hour()>=18||hour()<3?'¡Ya está empezando! Andá al parque, al kiosco.':'Todavía estoy organizando. Después de las seis en el parque, ¿ok?');return}
 arSeen();const d=dateAt();if(d){arDate(d);return}
 if(pedTry(id))return;
 pedRemind(id);
 const ks=Object.keys(PH().known).filter(k=>AR_QS[k]);
 if(arTier()>=2&&ks.length&&!S.f.arWhy&&Math.random()<.3&&capDay('test',1)){say(id,arHello());arTest(ks,()=>arMenu());return}
 arMenu(1)};
TALK.papa=function(){const id='papa';
 if(qs('visita')===1&&!S.f.vPapa){const g=visGift();if(g!=='nada')remI(g);S.f.vGift=g;S.f.vPapa=1;let op=g==='queque'?1:g==='coca'?0.5:0;
   say(id,g==='queque'?'Hmm... ¿queque de naranja? Mi favorito. Bueno. Pase, pase.':g==='coca'?'Una gaseosa de tres litros. Práctico. Bien. Póngala en la refri.':'Buenas... ¿Y las manos? ...Es broma. Bueno, no tanto. Pase.');
   say(id,'Dígame una cosa, ¿usted a qué se dedica?',[
    {t:'Estudio y trabajo',f(){op+=1;S.f.opinion=op;say(id,'Hmm. Eso está bien. La gente trabajadora se reconoce.')}},
    {t:'Pues... a ver qué sale',f(){S.f.opinion=op;say(id,'«A ver qué sale». Ajá. Interesante filosofía.')}},
    {t:'A hacer feliz a su hija',f(){op+=1;S.f.opinion=op;say(id,'¡Ja! Buena respuesta. Cursi, pero buena.')}}]);
   checkVisita();return}
 if(qs('visita')!==2){say(id,qs('visita')===1?'Buenas. Ya hablamos. Vaya salude a la señora.':'Buenas. Mi hija dice que usted vendrá de visita... algún día.');return}
 if(pedTry(id))return;
 pedRemind(id);
 carMenu(1)};
TALK.mama=function(){const id='mama';
 if(qs('visita')===1&&!S.f.vMama){S.f.vMama=1;say(id,'¡Ay, qué dicha que vino! Pase, pase, está en su casa. ¿Ya comió?',[
   {t:'Sí, gracias',f(){say(id,'Igual le sirvo un cafecito con pan. No me desprecie.')}},
   {t:'La verdad no',f(){S.f.ate=1;say(id,'¡Ya mismo le sirvo gallo pinto! Siéntese ahí. Y no me diga que no.');afterD(()=>{if(!S.f.gpGiven){S.f.gpGiven=1;addI('gallopinto')}})}}]);
   say(id,'Yuca se hace el serio, pero se puso camisa planchada porque usted venía. No le diga que le conté.');
   checkVisita();return}
 if(qs('visita')===2&&!qs('tortillas')){say(id,'¿Me hace un favorcito? Vaya a la pulpería y me trae un paquete de tortillas para la cena. Se me olvidaron, ¡con la emoción de la visita!',[{t:'Claro, ya vuelvo',f(){say(id,'¡Qué amor! Dígale a '+N('rosa')+' que son para mí.');startQ('tortillas')}},{t:'¿Calientitas?',f(){say(id,'¡Claro que calientitas! Usted sí sabe.');startQ('tortillas')}}]);return}
 if(qs('tortillas')===1&&hasI('tortillas')){remI('tortillas');say(id,'¡Mis tortillas! Usted sí es un amor. Tome, para el bus.');S.money+=1000;toast('+ ₡1000');relAdd('lu',1);afterD(()=>doneQ('tortillas'));return}
 if(qs('tortillas')===1){say(id,'¿Y las tortillas, mi amor? En la pulpería las tienen.');return}
 if(pedTry(id))return;
 pedRemind(id);
 lucMenu(1)};
// ---------- chismes del barrio sobre tu relación ----------
function gossip(id){const f=S.f,t=arTier(),A=N('ariana'),L=[],pd=PH();
 if(id==='nicolas'){
  if(f.arWhy==='planton')L.push(`¿Vos dejaste plantada a ${A}? Mae... estuvo dos horas ahí. Los zancudos le hicieron compañía.`);
  if(f.dateLast===S.day&&f.date&&f.date.st==='done')L.push(`Me dicen que anduviste en una cita con ${A}. Yo no vi nada. Bueno, vi todo.`);
  if(t>=3)L.push(`Mae, ${A} anda sonriendo sola por la calle. Eso es culpa tuya, ¿verdad?`);
  if(t<=1)L.push(`¿Pasó algo con ${A}? Ayer la vi con cara de limón.`);
  if(opTier()>=3)L.push(`Dicen que ${N('papa')} habló bien de vos. Eso es más raro que un bus puntual.`);
  if(pd.st.ped>=3)L.push(`Mae, ya sos el mandadero oficial de tus suegros. Te falta el uniforme.`)}
 if(id==='matias'){
  if(opTier()>=3)L.push(`Primo, ${N('papa')} me saludó con la cabeza. A mí. Gracias a vos. Ya me siento parte de la familia.`);
  if(opTier()<=1&&qs('visita')===2)L.push(`Primo, con ${N('papa')} hay que ir con paciencia. A mí me tomó dos años que me dijera «buenas».`);
  if(f.arWhy)L.push(`Primo... ${A} anda medio brava. No te voy a decir qué le pasa, pero andá y hablale.`);
  if(t>=4)L.push(`Primo, se nota que ${A} y vos van en serio. Cuando se casen, yo hago la mejenga de la boda.`);
  if(pd.st.dichos>=3)L.push(`¿Es verdad que le contestás los dichos a ${N('papa')}? Primo, sos un héroe.`)}
 if(id==='rosa'){
  if(pd.st.ped>=2)L.push(`${N('mama')} me contó que usted le anda ayudando con los mandados. ¡Qué muchacho tan bueno!`);
  if(t>=2)L.push(`${A} compró dos helados ayer y no eran para ella sola... ¡no digo nada, pero digo!`);
  if(f.dateLast===S.day&&f.date&&f.date.st==='done')L.push(`Con permiso, mi amor, pero toda la cuadra sabe que usted y ${A} andaban en el parque. Yo no dije nada. Bueno, dije poquito.`);
  if(f.arWhy)L.push(`Mi amor, ${A} pasó por aquí con cara de pocos amigos. Algo hizo usted, ¿verdad?`)}
 if(!L.length)return false;f['gos_'+id]=S.day;say(id,pick(L));return true}
['nicolas','matias','rosa'].forEach(k=>{const o=TALK[k];TALK[k]=function(){if(qs('barra')===2&&S.f['gos_'+k]!==S.day&&Math.random()<.45)gossip(k);o()}});
const nicLoc=()=>NPC.nicolas&&NPC.nicolas.loc;
const PRICES={cafe:1800,tapadulce:700,huevos:1200,queque:2500,coca:1800,tortillas:500,fresco:600,chicle:150,pandepina:800,queso:1500,salchichon:1200,natilla:900,natillab:600,pozuelo:400,frescoleche:700,imperial:1000,tazos:300};
function shopTalk(person){const id=person&&on('rosa')?'rosa':null;const ch=[];ch.push({t:'🛒 Ver productos',f(){openShop(id,'todo')}});
  if(qs('visita')===1&&!S.f.vPapa&&!hasI('queque')&&!hasI('coca')){ch.push({t:'Queque de naranja (₡2500)',f(){buy('queque',id)}});ch.push({t:'Gaseosa de 3 litros (₡1800)',f(){buy('coca',id)}})}
  if(qs('tortillas')===1&&!hasI('tortillas'))ch.push({t:'Tortillas (₡900)',f(){buy('tortillas',id)}});
  ch.push({t:'Mandados del día',f(){deliveryTalk(id)}});
  if(hasI('tomate'))ch.push({t:'Vender tomates (₡250 cada uno)',f(){const n=S.inv.tomate;delete S.inv.tomate;S.money+=n*ACTIVITY_RULES.cropValue();say(id,'¡Qué fresquitos! Aquí tiene ₡'+n*250+'.');saveGame()}});
  ch.push({t:id?'Solo pasaba a saludar':'Nada por ahora',f(){if(id)say(id,rot('rosaC',['¡Siempre es bueno ver caras conocidas! Fíjese que el hijo de la vecina se fue a estudiar a San José. ¡Cómo pasa el tiempo!','Aquí, peleando con el proveedor de pan. Llegó tarde otra vez.','Dicen que la vecina de la esquina tiene un novio nuevo. Yo no digo nada... pero digo.'].concat(S.f.fiado?['Y no se me olvide lo del cuaderno, ¿eh? ₡'+S.f.fiado+' anotados.']:[])))}});
  if(id)say(id,qs('visita')===1&&!S.f.vGift?'¡Buenas! ¿Va para donde los suegros? Lleve algo, no llegue con las manos vacías. ¿Qué le doy?':'¡Buenas, buenas! ¿Qué se le ofrece hoy?',ch);
  else say(null,'No hay nadie en el mostrador. Hay un cuaderno y una nota: «Deje la plata aquí». ¿Qué tomás?',ch)}
function buy(item,id){const p=PRICES[item];if(S.money>=p){S.money-=p}else{S.f.fiado=(S.f.fiado||0)+p;if(id)say(id,'¿No le alcanza? Tranquilo, se lo apunto en el cuaderno. Me debe ₡'+S.f.fiado+'.');else say(null,'No te alcanza. Anotás tu nombre en el cuaderno de fiados.')}
  addI(item);if(id&&S.money>=0)say(id,item==='queque'?'Buena elección. Este queque abre puertas, ¡se lo digo yo!':item==='tortillas'?'Calientitas, recién llegadas. Salúdeme a Lucía.':'Aquí tiene. ¡Que le aproveche!')}
function animalTalk(e){
  if(e.special==='firulais'){S.f.dogFollow=1;say(null,'Firulais te huele, mueve la cola como helicóptero y empieza a seguirte.');toast('Firulais te sigue');return}
  if(e.special==='kiki'){addI('kiki');say(null,'¡Lo atrapaste! Kiki protesta con un «¡kikirikí!» indignado, pero se deja cargar.');return}
  if(e.special==='cadejos'){say(null,'Un perro negro enorme te observa con ojos rojos como brasas. El aire se pone frío.');say(null,'Parpadeás... y ya no está. Solo queda el olor a tierra mojada.');afterD(()=>secret('cadejos','El Cadejos'));return}
  if(e.type==='dog')say(null,rot(e.name,[e.name+' mueve la cola. Le rascás la oreja y se tira panza arriba.',e.name+' te trae un palito. Lo tirás y se va feliz.','¡Guau! '+e.name+' te saluda como si no te viera hace años.']));
  else say(null,rot(e.name,[e.name+' te ignora olímpicamente.',e.name+' se restriega contra tu pierna. Un honor.','Miau. '+e.name+' te mira como juzgando tus decisiones de vida.']))}
function pedTalk(e){say(e.c,rot(e.c.id,[timeHi()+'.','¿Cómo le va? Aquí, haciendo mandados.','¡Qué calor! O qué frío. Este clima no se decide.','¿Va para la pulpería? Dígale a la señora que ya le pago.',
 'Mañana me toca madrugar al EBAIS a sacar cita. A las cinco de la mañana ya hay fila. ¡Qué despiche!','¿Ya vio que en el chino el arroz está más barato? Pero no le diga a Doña Rosa, que se pone brava.',
 'Ese Carlillos… buen muchacho, pero se junta con el diablo y con el monte.','Llévese sombrilla, que a las dos se cae el cielo. Como todos los días.','Se fue el agua otra vez. Tengo tres baldes llenos por si acaso. Uno aprende.',
 'Mi compadre sacó una refri en Gollo «sin prima». Ya va por la cuota cuarenta. La refri ya se le dañó.','La Sele no clasifica si no se ponen las pilas. Ya lo dije y lo sostengo.',
 '¿Le cuento? A mi sobrino lo asaltaron en la entrada. Le quitaron hasta los tenis. Él volvió en medias, todo digno.','Los domingos en Pollolandia hay más gente que en misa. Y la gente sale igual de feliz.']))}
function furnTalk(o,m){const mine=m.id==='casa_jugador';
  switch(o.act){
  case'bed':if(!mine){say(null,'No es tu cama. Mejor no.');break}say(null,isNight()?'¿Dormir hasta mañana?':'¿Echar una siestita?',[{t:'Sí',f(){afterD(()=>sleep())}},{t:'No',f(){}}]);break;
  case'night':if(mine&&!S.f.sec.diario){say(null,'En la mesita hay un diario viejo tuyo. Una página dice: «Cuando sea grande voy a conocer a todo el barrio».');say(null,'Parece que lo estás cumpliendo.');afterD(()=>secret('diario','Tu diario viejo'))}else say(null,'Una lamparita y un rosario. Todo en su lugar.');break;
  case'tv':say(null,rot('tv',['Están dando el partido de la Sele. ¡Casi gol!','Pasan una telenovela. Alguien descubre que su gemelo malvado es... su otro gemelo.','Noticias: «Se esperan aguaceros en la tarde». Como todos los días.']));break;
  case'fridge':if(mine&&!S.f.fridgeGot){S.f.fridgeGot=1;say(null,'Hay natilla, medio limón y... ¡un gallo pinto envuelto!');addI('gallopinto')}else say(null,rot('fr',['Natilla, tortillas y un pichel de fresco. Lo típico.','Hay un tupper misterioso. Mejor no abrirlo.']));break;
  case'stove':if(mine)cookTalk();else say(null,'Huele a café chorreado.');break;case'counter':say(null,'Un pichel, un pan y una cafetera de chorreador.');break;
  case'sofa':say(null,'Un sillón con la forma exacta de alguien que ve mucha tele.');break;case'table':say(null,'Mantel de cuadros rojos. Clásico.');break;
  case'shop':shopTalk(!!(NPC.rosa&&NPC.rosa.map==='pulperia'));break;case'bread':openShop(shopClerk(),'mandados');break;case'candy':openShop(shopClerk(),'golosinas');break;case'crate':say(null,'Una caja de frutas: naranjas, mangos y unos limones mandarina.');break;
  case'shelf':openShop(shopClerk(),'mandados');break;
  case'drinks':openShop(shopClerk(),'golosinas');break;case'sacks':say(null,'Sacos de arroz y frijoles. Vendidos por kilo.');break;
  }}
