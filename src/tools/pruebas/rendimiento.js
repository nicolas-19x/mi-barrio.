// Mide el rendimiento en condiciones parecidas a un celular: pantalla 390x844 (escala 3), toque, y CPU más lenta.
// Uso: node src/tools/pruebas/rendimiento.js /ruta/absoluta/Mi_Barrio.html [lentitudCPU=4] [salida.json]
// Para cada escena: cuadros por segundo reales y milisegundos de trabajo por cuadro (promedio y percentil 95).
const {chromium}=require('playwright'),fs=require('fs');
const FILE=process.argv[2],RATE=+(process.argv[3]||4),OUT=process.argv[4]||'';
const ESC=[
 ['barrio_dia','P.map="ext";P.x=20*T;P.y=22*T;S.t=10*60;S.rain=0;snapCam()'],
 ['barrio_noche_lluvia','P.map="ext";P.x=40*T;P.y=22*T;S.t=21*60;S.rain=60;snapCam()'],
 ['barrio_sur','P.map="ext";P.x=48*T;P.y=73*T;S.t=12*60;S.rain=0;snapCam()'],
 ['chepe_dia','ensureMap("chepe");P.map="chepe";P.x=12*T;P.y=12*T;S.t=11*60;S.rain=0;snapCam()'],
 ['chepe_noche_lluvia','ensureMap("chepe");P.map="chepe";P.x=12*T;P.y=12*T;S.t=20*60;S.rain=60;snapCam()'],
 ['mercado','ensureMap("mercado");P.map="mercado";P.x=10*T;P.y=8*T;S.t=11*60;S.rain=0;snapCam()'],
 ['hoyo','ensureMap("hoyo");P.map="hoyo";P.x=22*T;P.y=6*T;snapCam()'],
 ['playa','ensureMap("playa");P.map="playa";P.x=12*T;P.y=8*T;snapCam()'],
 ['bus_dia','__clr();P.map="ext";P.x=20*T;P.y=21*T;S.t=10*60;S.rain=0;startTrip("chepe")'],
 ['bus_noche','__clr();if(TRIP){TRIP.done=1;cancelAnimationFrame(TRIP.raf);TRIP=null;$("#trip").classList.add("hidden")}mode="play";P.map="ext";P.x=20*T;P.y=21*T;S.t=19.5*60;startTrip("chepe")'],
];
(async()=>{const b=await chromium.launch({args:['--disable-gpu-vsync','--disable-frame-rate-limit']});
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
 await ctx.route(/^https?:/,r=>r.abort());
 await ctx.addInitScript(()=>{window.__SAVE_AUTO=true;try{window.AudioContext=undefined;window.webkitAudioContext=undefined}catch(e){}
  window.__clr=()=>{for(let i=0;i<80&&(mode==='dialog'||!$('#dialog').classList.contains('hidden'));i++){DQ.length=0;AFTER.length=0;closeDialog()}if(!$('#panel').classList.contains('hidden'))closePanel();mode='play'};
  // Tiempo de trabajo de cada cuadro (todo lo que corre dentro de requestAnimationFrame)
  window.__FT=[];const raf=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=cb=>raf(t=>{const a=performance.now();cb(t);window.__FT.push(performance.now()-a)});
  window.__FR=[];const tick=t=>{window.__FR.push(t);raf(tick)};raf(tick)});
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto('file://'+FILE);await pg.waitForTimeout(1500);
 await pg.evaluate('startGame(true);__clr()');await pg.waitForTimeout(800);
 const cdp=await ctx.newCDPSession(pg);await cdp.send('Emulation.setCPUThrottlingRate',{rate:RATE});
 const res=[];
 for(const[name,code]of ESC){try{await pg.evaluate(code)}catch(e){errs.push(name+': '+e.message)}
  await pg.waitForTimeout(1500);await pg.evaluate('__FT.length=0;__FR.length=0');await pg.waitForTimeout(4000);
  const r=await pg.evaluate(()=>{const ft=__FT.slice().sort((a,b)=>a-b),fr=__FR,n=fr.length,fps=n>1?(n-1)*1000/(fr[n-1]-fr[0]):0;
   const avg=ft.reduce((a,b)=>a+b,0)/Math.max(1,ft.length),p95=ft[Math.floor(ft.length*.95)]||0;return{fps:+fps.toFixed(1),ms:+avg.toFixed(2),p95:+p95.toFixed(2),n:ft.length,mode,map:P.map}});
  res.push(Object.assign({name},r));console.log(name.padEnd(20),'fps',String(r.fps).padStart(5),' trabajo/cuadro ms',String(r.ms).padStart(6),' p95',String(r.p95).padStart(6),' ',r.mode,r.map)}
 if(OUT)fs.writeFileSync(OUT,JSON.stringify({rate:RATE,res,errs},null,1));
 if(errs.length)console.log('errores:',errs.slice(0,5).join(' | '));await b.close()})();
