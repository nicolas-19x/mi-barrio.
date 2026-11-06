// ================= PRÓLOGO · conexión con el juego =================
ITEMS.pinito=['Llavero de pinito','Un arbolito de pino de los que se cuelgan del retrovisor. No sabés de dónde salió. Huele a carro viejo… y a neblina.'];
let proWake=0;
function proWakeScene(){
 say(null,'Te despertás de un brinco. Estás en tu cuarto, con la camisa empapada de sudor.');
 say(null,'Por la ventana entra sol. Canta un gallo, pasa un señor vendiendo aguacates con parlante y, a lo lejos, suena una marimba.');
 say(null,'En la mesita de noche hay algo que no reconocés: un llavero con un arbolito de pino.');
 say(null,'Y en el vidrio de la ventana hay cuatro rayones largos, como de uñas. Por fuera.');
 afterD(()=>{addI('pinito');
  say(null,'Te vibra el celular. Es '+N('ariana')+': «Buenos días, mor. ¿Por qué me escribiste a las 3:33 de la mañana? Solo dice: “no dejés que la vendan” 😅»');
  say(null,'No te acordás de haberle escrito nada.');
  say(null,'Sábado en el barrio. El sol pega en el zinc, huele a café chorreado y alguien tiene la radio a todo volumen.');
  say(null,'Es un buen día para salir a saludar a la barra.');afterD(()=>startQ('barra'))})}
// ---------- pesadillas que vuelven ----------
function proPendingDream(){if(!S||!S.f)return 0;const f=S.f,k=stS('kevin').n;
 if(!f.dr1&&k>=1)return 1;if(f.dr1&&!f.dr2&&(f.asaltos||0)>=1)return 2;if(f.dr2&&!f.dr3&&k>=3)return 3;if(f.dr3&&!f.dr4&&f.kevinHelp)return 4;return 0}
const proSleep0=sleep;
sleep=function(){if(isNight()){const d=proPendingDream();if(d){S.f['dr'+d]=1;saveGame();
  fadeDo(null,()=>proStart(d,()=>{$('#hud').classList.remove('hidden');mode='play';showTouch();proSleep0();setTimeout(()=>proDreamWake(d),800)}));return}}
 proSleep0()};
function proDreamWake(d){const kv=N('kevin');
 if(d===1){say(null,'Te despertás sudando. Otra vez la pesadilla de la carretera.');say(null,'Pero esta vez no era el carro: era una moto roja, vieja. Y '+N('ariana')+' iba atrás.');say(null,'«No dejés que la vendan»… ¿la moto?')}
 else if(d===2){say(null,'Te despertás de golpe. En la tapia de la pesadilla decía: «HONDA 78 · SE VENDE». Y un número: 8333-1978.');say(null,'Alguien en el barrio quiere vender esa moto.')}
 else if(d===3){say(null,'Te despertás con la voz de ese señor en la cabeza: «Esa moto es lo único que le voy a dejar al muchacho».');say(null,'Es el abuelo de '+kv+'. Seguro '+kv+' está pensando vender la moto para pagar el hospital.')}
 else{say(null,'Te despertás tranquilo. Por primera vez, la pesadilla terminó bien.');say(null,'La moto de '+kv+' no se vendió. Y algo te dice que esa pesadilla ya no va a volver.');afterD(()=>{toast('★ La pesadilla de la Ruta 27 · cerrada');beepSeq([523,659,784,1046])})}
 runDialog()}
// ---------- volver a verlo desde Opciones ----------
function proReplay(){const menuWas=!$('#menu').classList.contains('hidden'),hudWas=!$('#hud').classList.contains('hidden'),m0=mode==='panel'?'play':mode;closePanel();
 proStart(0,()=>{if(menuWas){$('#menu').classList.remove('hidden');mode='menu'}else{if(hudWas)$('#hud').classList.remove('hidden');mode=m0==='menu'?'menu':'play'}showTouch()})}
proPtr();

