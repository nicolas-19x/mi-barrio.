// ================= MÚSICA (quitada) =================
// La música del juego se quitó a propósito: se va a rehacer de otra forma. Aquí solo queda lo que usan los efectos:
// - mNoise(): búfer de ruido blanco para los sonidos del prólogo (motor, lluvia, latidos).
// - Pausar y retomar el audio de efectos cuando la pestaña se oculta.
// Para la música nueva siguen disponibles: OPT.music / OPT.musicVol (se guardan en las opciones) y las marcas
// del prólogo proMus({id,vol,lp}), que dicen qué ambiente debería sonar en cada momento.
let MNBUF=null;
function mNoise(){if(!MNBUF||MNBUF.ctx!==AC){const n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;MNBUF={ctx:AC,b}}return MNBUF.b}
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()});
