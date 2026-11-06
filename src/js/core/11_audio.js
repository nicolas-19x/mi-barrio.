// ================= AUDIO =================
let AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function beep(f,d,type,v,slide){if(!OPT.sound)return;const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,a.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(slide,a.currentTime+d);g.gain.setValueAtTime(v||.04,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+d+.02)}
function beepSeq(fs){fs.forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.035),i*90))}
let ambT=2;
function ambient(dt){ambT-=dt;if(ambT>0)return;if(curZone()!=='barrio'){ambT=zAmbient();return}if(P.map!=='ext'){ambT=4;return}
  if(S.rain){ambT=.2;beep(rnd(200,900),.03,'triangle',.006);return}
  if(isNight()){ambT=rnd(.4,1.2);for(let i=0;i<3;i++)setTimeout(()=>beep(4200,.03,'square',.008),i*60)}else{ambT=rnd(2,5);const f=rnd(1800,2800);beep(f,.08,'sine',.02,f*1.4);setTimeout(()=>beep(f*1.1,.08,'sine',.02,f*.8),120)}}

