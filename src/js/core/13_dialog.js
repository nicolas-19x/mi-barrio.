// ================= DIALOG =================
let DQ=[],dcur=null,dTyped=0,dTimer=0,dsel=0,AFTER=[],talkEnt=null;
let mode='menu';
function say(who,text,choices){DQ.push({who,text,choices})}
function afterD(f){AFTER.push(f)}
function runDialog(){if(!DQ.length){if(AFTER.length){const a=AFTER;AFTER=[];a.forEach(f=>f());if(DQ.length)return runDialog()}return}mode='dialog';$('#dialog').classList.remove('hidden');$('#prompt').classList.add('hidden');$('#touch').classList.add('hidden');nextLine()}
function nextLine(){if(!DQ.length){if(AFTER.length){const a=AFTER;AFTER=[];a.forEach(f=>f());if(DQ.length)return nextLine()}return closeDialog()}
  dcur=DQ.shift();dTyped=0;dTimer=0;dsel=0;const c=dcur.who==='you'?CH.player:typeof dcur.who==='string'?CH[dcur.who]:dcur.who;
  $('#dname').textContent=c?c.name:(dcur.who===null?'':'');$('#dname').style.display=c?'':'none';drawPortrait($('#portrait'),c);$('#portrait').style.display=c?'':'none';
  $('#dtext').textContent='';$('#dchoices').innerHTML='';$('#dmore').style.visibility='hidden';if(!c)$('#dtext').style.fontStyle='italic';else $('#dtext').style.fontStyle=''}
function showChoices(){const box=$('#dchoices');box.innerHTML='';if(!dcur.choices){$('#dmore').style.visibility='visible';return}
  dcur.choices.forEach((ch,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+ch.t;b.onclick=e=>{e.stopPropagation();choose(i)};if(i===dsel)b.classList.add('sel');box.appendChild(b)})}
function updDialog(dt){if(!dcur)return;if(dTyped<dcur.text.length){dTimer+=dt*48;const n=Math.min(dcur.text.length,Math.floor(dTimer));if(n>dTyped){if(Math.floor(n/3)>Math.floor(dTyped/3)&&dcur.who)uiType(dcur.who==='you'?520:380+(hsh(dcur.text.length,1)*200));dTyped=n;$('#dtext').textContent=dcur.text.slice(0,n);if(n>=dcur.text.length)showChoices()}}}
function advance(){if(!dcur)return;if(dTyped<dcur.text.length){dTyped=dcur.text.length;$('#dtext').textContent=dcur.text;showChoices();return}if(dcur.choices)return;nextLine()}
function choose(i){if(!dcur||!dcur.choices||dTyped<dcur.text.length)return;const ch=dcur.choices[i];if(!ch)return;uiSfx('select');const rest=DQ;DQ=[];say('you',ch.t);if(ch.f)ch.f();DQ=DQ.concat(rest);nextLine()}
function closeDialog(){dcur=null;$('#dialog').classList.add('hidden');if(talkEnt){talkEnt.talking=false;talkEnt=null}if(mode==='dialog')mode='play';showTouch();saveGame()}
function selMove(d){if(!dcur||!dcur.choices)return;dsel=(dsel+d+dcur.choices.length)%dcur.choices.length;showChoices()}

