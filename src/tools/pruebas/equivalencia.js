// Recorre el juego de forma determinista (reloj y azar fijos) y saca una huella de cada pantalla y del estado.
const {chromium}=require('playwright'),crypto=require('crypto'),fs=require('fs');
const FILE=process.argv[2],OUT=process.argv[3],SHOTS=process.argv[4]||'';
const H=b=>crypto.createHash('sha1').update(b).digest('hex').slice(0,12);
const STEPS=[
 ['titulo',''],
 ['nuevo','startGame(true);__clr()'],
 ['casa_dia','P.map="casa_jugador";P.x=6*T;P.y=7*T;snapCam()'],
 ['barrio_dia','P.map="ext";P.x=8*T;P.y=20*T;S.t=10*60;S.rain=0;snapCam()'],
 ['caminar','KEYS.d=1'],['caminar2','KEYS.d=0;KEYS.s=1'],['caminar3','KEYS.s=0'],
 ['plaza_sur','P.x=48*T;P.y=73*T;snapCam()'],
 ['entrada_kevin','checkPeriod();placeNPCs(true);const k=NPC.kevin;P.map=k.map;P.x=k.x+30;P.y=k.y;snapCam()'],
 ['noche_lluvia','S.t=21*60;S.rain=60;P.map="ext";P.x=40*T;P.y=22*T;snapCam()'],
 ['pulperia','S.t=11*60;S.rain=0;ensureMap("pulperia");P.map="pulperia";P.x=5*T;P.y=6*T;snapCam()'],
 ['super','ensureMap("super_chino");P.map="super_chino";P.x=5*T;P.y=6*T;snapCam()'],
 ['chepe','ensureMap("chepe");P.map="chepe";P.x=12*T;P.y=12*T;snapCam()'],
 ['mercado','ensureMap("mercado");P.map="mercado";P.x=10*T;P.y=8*T;snapCam()'],
 ['hoyo','ensureMap("hoyo");P.map="hoyo";P.x=22*T;P.y=6*T;snapCam()'],
 ['playa','ensureMap("playa");P.map="playa";P.x=12*T;P.y=8*T;snapCam()'],
 ['iglesia','ensureMap("iglesia");P.map="iglesia";P.x=7*T;P.y=8*T;snapCam()'],
 ['celular','P.map="ext";P.x=8*T;P.y=20*T;snapCam();openPhone();PHV.tab="apps";phRender()'],
 ...['veh','mk','ag','cosevi','rtv','ins','ped','casa','neg','coope','metas','aso','emp','prop','patri','fund','dis','soda'].map(a=>['app_'+a,'appOpen("'+a+'")']),
 ['libreta','closePanel();openCasa()'],
 ['ariana','closePanel();mode="play";TALK.ariana();runDialog()'],
 ['ariana2','for(let i=0;i<3;i++){if(dcur){dTyped=dcur.text.length;if(dcur.choices)choose(0);else advance()}}'],
 ['kevin','__clr();TALK.kevin();runDialog()'],
 ['papa','__clr();TALK.papa();runDialog()'],
 ['mirador','__clr();S.t=17.9*60;openVista()'],['mirador_n','S.t=21.5*60'],['mirador_fin','closeVista()'],
 ['copos','__clr();NEG().cart=1;NEG().stock=20;srvStart(COPO_CFG,{busy:2,pat:22,stock:20,done:()=>{}})'],['copos2',''],['copos_fin','srvEnd(false);__clr()'],
 ['economia','S.money=3000000;NEG().soda=2;NEG().cook=1;APPS.find(a=>a.id==="ag").act("cash","moto_n");for(const k of Object.keys(EMP).slice(0,3))empComprar(k);propComprar("casa_sur3");for(let i=0;i<12;i++){S.day++;ecoDay()};__clr()'],
 ['bus','__clr();P.map="ext";P.x=20*T;P.y=21*T;startTrip("chepe")'],['bus2',''],
 ['guardar','__clr();if(typeof TRIP!=="undefined"&&TRIP){}saveGame()'],
];
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1100,height:680}});
 await ctx.route(/^https?:/,r=>r.abort());
 await ctx.addInitScript(()=>{let s=1234567;Math.random=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
   try{window.AudioContext=undefined;window.webkitAudioContext=undefined}catch(e){}
  window.fetch=()=>new Promise(()=>{});XMLHttpRequest.prototype.send=function(){};const fakeReq=()=>({result:null,error:null,onsuccess:null,onerror:null,onupgradeneeded:null});try{Object.defineProperty(window,'indexedDB',{value:{open:fakeReq,deleteDatabase:fakeReq},configurable:true})}catch(e){}
  HTMLMediaElement.prototype.play=function(){return new Promise(()=>{})};HTMLMediaElement.prototype.load=function(){};
  document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');st.textContent='*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}';document.head.appendChild(st)});
  window.__clr=()=>{for(let i=0;i<80&&(mode==='dialog'||!$('#dialog').classList.contains('hidden'));i++){DQ.length=0;AFTER.length=0;closeDialog()}if(!$('#panel').classList.contains('hidden'))closePanel();mode='play'}});
 const pg=await ctx.newPage();const T0=new Date('2026-01-01T12:00:00Z').getTime();await pg.clock.install({time:T0});await pg.clock.pauseAt(T0+50);const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto('file://'+FILE);await pg.clock.runFor(2500);const res=[];
 for(const[name,code]of STEPS){let err='';if(code)try{await pg.evaluate(code)}catch(e){err=String(e.message).split('\n')[0]}await pg.clock.runFor(900);
   const shot=await pg.screenshot();if(SHOTS)fs.writeFileSync(SHOTS+'/'+name+'.png',shot);
   const st=await pg.evaluate(()=>{try{return JSON.stringify(S)+'|'+mode+'|'+P.map+'|'+Math.round(P.x)+','+Math.round(P.y)}catch(e){return 'x'}});
   res.push({name,img:H(shot),st:H(st),err})}
 const ls=await pg.evaluate(()=>JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));res.push({name:'localStorage',img:'',st:H(ls),err:''});
 // recargar y continuar la partida guardada
 await pg.reload();await pg.clock.runFor(2500);let e2='';try{await pg.evaluate('startGame(false);__clr()')}catch(e){e2=e.message}await pg.clock.runFor(900);
 res.push({name:'continuar',img:H(await pg.screenshot()),st:H(await pg.evaluate(()=>JSON.stringify(S))),err:e2});
 fs.writeFileSync(OUT,JSON.stringify({res,errs},null,1));console.log(FILE.split('/').pop(),'pasos',res.length,'errores js',errs.length,errs.slice(0,3).join(' | '),'· pasos con excepción:',res.filter(r=>r.err).map(r=>r.name+': '+r.err).join(' ; '));await b.close()})();
