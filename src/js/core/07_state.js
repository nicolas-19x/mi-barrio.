// ================= STATE =================
let S=null;
// ACTIVITY_RULES_START
const ACTIVITY_RULES={
 cropReady:(plot,now)=>Boolean(plot&&plot.watered&&now-plot.planted>=180),
 canDaily:(last,day)=>last!==day,
 penaltyGoal:(aim,keeper)=>Math.abs(aim-keeper)>.22&&Math.abs(aim)<.92,
 penaltyReward:goals=>goals>=3?1200:0,
 penaltyBonus:goals=>goals>=5?1300:goals>=4?600:0,
 penaltyZone:(x,y)=>x<114||x>366?'wide':y<52?'over':y<=66?'bar':(x<126||x>354)?'post':'goal',
 keeperSaves:(kx,ky,tx,ty,aw,ah)=>Math.abs(tx-kx)<aw&&Math.abs(ty-ky)<ah,
 deliveryReward:()=>800,
 recycleReward:()=>150,
 cropValue:()=>250,
 tazoValue:()=>400,
 tazoBonus:()=>1000,
 canShoot:(opted,status,ammo,cooldown,reload)=>Boolean(opted&&status==='active'&&ammo>0&&cooldown<=0&&reload<=0),
 reloadAmmo:(ammo,reserve,size)=>{const n=Math.max(0,Math.min(size-ammo,reserve));return[ammo+n,reserve-n]},
 hostile:(a,b)=>a!==b
};
const WEAPONS={pistola:{name:'Pistola',size:6,reserve:54,cooldown:.3,reload:1.1,speed:340,damage:34,spread:.025},compacta:{name:'Compacta',size:12,reserve:72,cooldown:.13,reload:1.5,speed:360,damage:20,spread:.07}};
// ACTIVITY_RULES_END
function activityState(){return{plots:[null,null,null],recycled:{},delivery:null,deliveryDay:0,penaltyDay:0,stats:{inlaw:0,harvest:0,recycle:0,delivery:0,cook:0,penalties:0},badges:{}}}
function newState(){return{map:'casa_jugador',x:7*T+8,y:6*T+12,dir:0,t:8*60,day:1,money:5000,q:{},f:{sec:{}},inv:{},met:{},per:'',activities:activityState()}}
function saveGame(){if(!S||!S.started)return;S.map=P.map;S.x=P.x;S.y=P.y;S.dir=P.dir;try{localStorage.setItem(KS,JSON.stringify(S))}catch(e){}}
function loadGame(){try{const s=JSON.parse(localStorage.getItem(KS)||'null');if(s&&s.q){const d=newState();return Object.assign(d,s,{f:Object.assign({sec:{}},s.f),activities:Object.assign(activityState(),s.activities,{stats:Object.assign(activityState().stats,s.activities?.stats),badges:Object.assign({},s.activities?.badges)})})}}catch(e){}return null}
let OPT={sound:true,music:true,musicVol:.6};try{Object.assign(OPT,JSON.parse(localStorage.getItem(KO)||'{}'))}catch(e){}
const saveOpt=()=>localStorage.setItem(KO,JSON.stringify(OPT));
const hour=()=>Math.floor(S.t/60);
function period(){const h=hour();return h>=6&&h<12?'m':h>=12&&h<17?'t':h>=17&&h<21?'e':'n'}
const isNight=()=>{const h=hour();return h>=19||h<5};
const qs=id=>S.q[id]||0;
const hasI=id=>(S.inv[id]||0)>0;
function addI(id,n=1){S.inv[id]=(S.inv[id]||0)+n;toast('+ '+itemName(id))}
function remI(id){if(S.inv[id]>0)S.inv[id]--;if(!S.inv[id])delete S.inv[id]}
const ITEMS={cafe:['Café molido','Bolsita de café para chorrear. Huele a mañana.'],tapadulce:['Tapa de dulce','Para el agua dulce de la tarde.'],huevos:['Cartón de huevos','Doce huevos de patio. Con cuidado.'],queque:['Queque de naranja','Recién horneado. Huele a domingo.'],coca:['Gaseosa de 3 litros','Para compartir... o no.'],tortillas:['Paquete de tortillas','Tortillas palmeadas de la pulpería.'],cargador:['Cargador','Un cable enrollado con cinta adhesiva.'],tazo:['Tazo de botella','Media botella de 3 L, partida a la mitad y con la tapa con hueco puesta. Clásico de recreo.'],kiki:['Kiki, el gallo','Te mira con desconfianza.'],fresco:['Fresco de cas','Ácido y frío. Se puede tomar.'],chicle:['Confites y chicles','Un puñito de confites y un chicle de menta. A alguien le podría gustar.'],gallopinto:['Gallo pinto envuelto','Con natilla. Se puede comer.'],tomate:['Tomates de la huerta','Para cocinar o vender en la pulpería.'],picadillo:['Picadillo casero','Preparado por vos con tomates frescos.'],paquete:['Mandado de la pulpería','Un pedido sellado para entregar a domicilio.'],pandepina:['Pan de piña','Suave, con jalea de piña encima. Se puede comer.'],queso:['Queso Turrialba','Fresco, salado y rechinón. Se puede comer.'],salchichon:['Salchichón','Para el gallo pinto o el bocadillo. Se puede comer.'],natilla:['Natilla','Natilla casera en tarrito, espesa y cremosa.'],natillab:['Natilla de bolsa','La de bolsita, para acompañar cualquier cosa.'],pozuelo:['Galletas Pozuelo','Un paquete de las de siempre. Se puede comer.'],frescoleche:['Fresco Leche','Bolsita de fresco de leche bien frío. Se puede tomar.'],imperial:['Imperial sin alcohol','La del aguilucho, pero sin alcohol. Se puede tomar.'],tazos:['Tazos de colección','Sobrecito sorpresa. ¿Te saldrá el dorado?']};
const itemName=id=>id==='cargador'?'Cargador de '+N('nicolas'):ITEMS[id][0];
const QUESTS={
 barra:{t:'Saludar a la barra',d:()=>`Encontrá y saludá a ${N('ariana')}, ${N('nicolas')} y ${N('matias')}. (${['ariana','nicolas','matias'].filter(i=>S.met[i]).length}/3)`},
 visita:{t:'La visita',d:()=>!S.f.vGift?`Los papás de tu novia, ${N('papa')} y ${N('mama')}, te esperan en su casa (la celeste grande). Podés pasar antes a la pulpería por algo para llevar.`:`Llevás: ${S.f.vGift==='nada'?'las manos vacías':itemName(S.f.vGift)}. Hablá con ${N('papa')}${S.f.vPapa?' ✓':''} y con ${N('mama')}${S.f.vMama?' ✓':''}.`},
 tortillas:{t:'Tortillas para la cena',d:()=>`${N('mama')} necesita un paquete de tortillas de la pulpería.`+(hasI('tortillas')?' Ya lo tenés: llevaselo.':'')},
 firulais:{t:'Firulais se voló la tapia',d:()=>`El perro de ${N('matias')} se escapó por el trillo de tierra detrás de las casas.`+(S.f.dogFollow?' Te viene siguiendo: llevalo con '+N('matias')+'.':'')},
 cargador:{t:'El cargador perdido',d:()=>`${N('nicolas')} perdió su cargador. Cree que lo dejó en la parada del bus.`+(hasI('cargador')?' ¡Ya lo tenés!':'')},
 gallo:{t:'¡Atrapen a Kiki!',d:()=>`Kiki, el gallo de ${N('marta')}, anda suelto en el parque. Es rápido: acorralalo.`+(hasI('kiki')?' Lo tenés: devolvéselo.':'')},
 fiesta:{t:'Fiesta del barrio',d:()=>`${N('ariana')} organizó una fiesta en el parque, junto al kiosco. Llegá después de las 6 p. m.`},
};
const QORDER=['barra','visita','tortillas','firulais','cargador','gallo','fiesta'];
function startQ(id){if(qs(id))return;S.q[id]=1;toast('Nueva misión: '+QUESTS[id].t);beepSeq([523,659,784]);saveGame()}
function doneQ(id){if(qs(id)===2)return;S.q[id]=2;toast('✔ Misión completada: '+QUESTS[id].t);saveGame();
  if(id==='barra')afterD(()=>{say(null,'Te vibra el celular. Es tu novia: «¿Ya te acordaste que hoy vas a saludar a mis papás? 😅 Llevá algo, ¿ok?»');say(null,'Ahora tenés un botón de «Celular» para chatear con ella.');arSeen();phMsg('ariana','¿Ya te acordaste que hoy vas a saludar a mis papás? 😅 Llevá algo, ¿ok?',{key:'ar_visita',ctx:{}});startQ('visita')});
  if(fiestaReady()&&!qs('fiesta')&&id!=='fiesta')afterD(()=>{say(null,`Te llega un mensaje de ${N('ariana')}: «¡Vení a buscarme, tengo una idea!»`);phMsg('ariana','¡Vení a buscarme, tengo una idea! 🎉')})}
const fiestaReady=()=>['visita','tortillas','firulais','cargador'].every(q=>qs(q)===2);
function secret(k,txt){if(S.f.sec[k])return;S.f.sec[k]=1;toast('★ Secreto encontrado: '+txt+' ('+Object.keys(S.f.sec).length+'/5)');beepSeq([784,988,1318]);saveGame()}

