// ================= CHARACTERS =================
const HAIRS=[['corto','Corto'],['largo','Largo'],['rizos','Rizos'],['moño','Moño'],['cola','Cola'],['calvo','Calvo']];
const ACCS=[['ninguno','Ninguno'],['gorra','Gorra'],['lentes','Lentes de sol'],['anteojos','Anteojos'],['aretes','Aretes'],['bigote','Bigote'],['barba','Barba'],['sombrero','Sombrero'],['collar','Collar']];
const PERS=[['alegre','Alegre'],['bromista','Bromista'],['tranquilo','Tranquilo/a'],['serio','Serio/a'],['cariñosa','Cariñoso/a'],['conversadora','Conversador/a'],['timido','Tímido/a']];
const HAIRC=['#1c1c1c','#2a1810','#5a3a1e','#8b5a2b','#c8a24a','#e8d27a','#b5462f','#8a8a8a','#d8d8d8','#3b6fd1','#d14f8f','#2e9e6b'];
const SKINC=['#f6d3b3','#f1c27d','#e0ac69','#d9a066','#c68e5e','#b97a4a','#8d5524','#5c3a21'];
const CLOTHC=['#e85d75','#d64545','#f2994a','#f2c94c','#7bb661','#2e9e6b','#3fb6b0','#3f7fd1','#35477d','#2d3346','#f0e6d2','#e8e8e8','#4a4a52','#7a4b2a','#c2577a','#5b7fa6'];
const DEF_CHARS=[
{id:'player',core:1,name:'Alex',role:'Vos (jugador)',hair:'corto',hairColor:'#3b2416',skin:'#d9a066',shirt:'#3f7fd1',pants:'#2d3346',acc:'ninguno',accColor:'#d64545',desc:'Vive en el barrio desde siempre.',pers:'alegre',home:'casa_jugador'},
{id:'ariana',core:1,name:'Ariana',role:'Amiga del barrio',hair:'largo',hairColor:'#1e1614',skin:'#e3b597',shirt:'#86b4d8',pants:'#2e3a5c',acc:'aretes',accColor:'#e6c060',desc:'Siempre tiene un plan para el fin de semana.',pers:'alegre',home:'casa_ariana'},
{id:'nicolas',core:1,name:'Nicolás',role:'Amigo bromista',hair:'corto',hairColor:'#1c1c1c',skin:'#d9a066',shirt:'#2e9e6b',pants:'#4a4a52',acc:'gorra',accColor:'#d64545',desc:'Aparece donde uno menos se lo espera.',pers:'bromista',home:'casa_nicolas'},
{id:'matias',core:1,name:'Matías',role:'Tu primo',hair:'rizos',hairColor:'#5a3a1e',skin:'#e0ac69',shirt:'#f2994a',pants:'#2d3a6e',acc:'ninguno',accColor:'#d64545',desc:'Tranquilo, futbolero y dueño de un perro escapista.',pers:'tranquilo',home:'casa_matias'},
{id:'papa',core:1,name:'Don Alexander',role:'Papá de tu novia',hair:'corto',hairColor:'#f2f2f2',skin:'#f3d3b6',shirt:'#5b7fa6',pants:'#3b3b3b',acc:'bigote',machete:1,accColor:'#e4e4e4',desc:'Alexander García, pero en todo el barrio le dicen «Yuca». Serio por fuera, buena gente por dentro.',pers:'serio',home:'casa_papas'},
{id:'mama',core:1,name:'Doña Lucía',role:'Mamá de tu novia',hair:'moño',hairColor:'#2b1a10',skin:'#c98b5c',shirt:'#c2577a',pants:'#4b3b5b',acc:'collar',accColor:'#f5c542',desc:'Nadie sale de su casa con hambre.',pers:'cariñosa',home:'casa_papas'},
{id:'rosa',name:'Doña Rosa',role:'Pulpera',hair:'cola',hairColor:'#8a8a8a',skin:'#c68e5e',shirt:'#f0e6d2',pants:'#7a4b2a',acc:'lentes',accColor:'#d64545',desc:'Atiende la pulpería y sabe todo lo que pasa.',pers:'conversadora',home:'pulperia'},
{id:'marta',name:'Doña Marta',role:'Vecina',hair:'moño',hairColor:'#d8d8d8',skin:'#e0ac69',shirt:'#7bb661',pants:'#5a4632',acc:'ninguno',accColor:'#d64545',desc:'Tiene un gallo que se cree perro guardián.',pers:'cariñosa',home:'casa_marta'},
{id:'beto',name:'Don Beto',role:'Chofer de bus',hair:'corto',hairColor:'#3a3a3a',skin:'#8d5524',shirt:'#e8e8e8',pants:'#2d3a6e',acc:'sombrero',accColor:'#d9b36c',desc:'Maneja el bus del barrio hace años.',pers:'tranquilo',home:'parada'},
{id:'kevin',name:'Carlillos',role:'El mae de la entrada',hair:'corto',hairColor:'#e3c56b',skin:'#e8b88a',shirt:'#2a2a30',pants:'#4a5a7a',acc:'gorra',accColor:'#c8102e',tattoos:1,desc:'Vive en la entrada, huele a monte y sabe todo lo que pasa en el barrio. Dicen que es malo. Dicen.',pers:'bromista',home:'casa_vecino'},
];
const SCHED={ariana:{m:'home',t:'parque',e:'pulperia',n:'home'},nicolas:{m:'home',t:'calle',e:'parque',n:'parada'},matias:{m:'home',t:'parque',e:'home',n:'home'},papa:{m:'home',t:'home',e:'calle',n:'home'},mama:{m:'home',t:'pulperia',e:'home',n:'home'},kevin:{m:'home',t:'entrada',e:'entrada',n:'parada'},beto:{m:'home',t:'home',e:'home',n:'calle'}};
const KC='mibarrio_chars_v1',KS='mibarrio_save_v1',KO='mibarrio_opt_v1';
let CHARS=[],CH={};
function fillChar(c){return Object.assign({name:'Vecino',role:'Vecino/a',hair:'corto',hairColor:'#2a1810',skin:'#d9a066',shirt:'#7bb661',pants:'#2d3346',acc:'ninguno',accColor:'#d64545',desc:'',pers:'alegre',home:'calle',tattoos:0,enabled:true},c)}
function loadChars(){let st=[];try{st=JSON.parse(localStorage.getItem(KC)||'[]')}catch(e){st=[]}
  CHARS=DEF_CHARS.map(d=>{const s=st.find(x=>x.id===d.id)||{};const c=Object.assign({enabled:true},d,s);c.id=d.id;c.core=d.core;if(c.core)c.enabled=true;if(c.id==='ariana'&&c.skin==='#c68e5e'&&c.shirt==='#e85d75'&&c.hairColor==='#2a1810')Object.assign(c,{hairColor:d.hairColor,skin:d.skin,shirt:d.shirt,pants:d.pants,accColor:d.accColor});return c});
  st.filter(s=>s.custom).forEach(s=>CHARS.push(fillChar(s)));
  {const k=CHARS.find(c=>c.id==='kevin');if(k&&k.name==='Kevin')k.name='Carlillos';if(k&&k.role==='El maliante del barrio')Object.assign(k,{role:'El mae de la entrada',desc:DEF_CHARS.find(d=>d.id==='kevin').desc,home:'casa_vecino',shirt:'#2a2a30',accColor:'#c8102e',hairColor:'#e3c56b'})}
  CHARS.forEach(c=>c.v=1);CH={};CHARS.forEach(c=>CH[c.id]=c)}
function saveChars(){try{localStorage.setItem(KC,JSON.stringify(CHARS.map(c=>{const o=Object.assign({},c);delete o.v;return o})))}catch(e){}}
const N=id=>CH[id]?CH[id].name:id;
const on=id=>CH[id]&&CH[id].enabled;

