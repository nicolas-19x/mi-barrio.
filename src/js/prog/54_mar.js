// ================= PUNTARENAS · EL MAR: NADAR, EL SOL, EL PASEO EN LANCHA Y LA BANANA =================
// Nadar: en el agua se va más despacio, cansa, no se pasa de las boyas y, si te quedás sin energía, el salvavidas te saca.
// El sol de 10 a. m. a 3 p. m. quema si no te pusiste bloqueador (la gorra ayuda). Ariana también se mete.
var PZM={swimT:0,sol:0,solDay:-1,warn:0,ariT:0};
hookAfter('update',function(dt){if(P.map!=='playa'||!PZ.k||mode!=='play'||fading)return;const h=S.t/60;
  // nadar cansa
  if(P.swim){PZM.swimT+=dt;enAdd(-dt*(P.moving?.32:.14));if(P.y>(PZ_BOYA-1)*T&&!PZS().boyas){PZS().boyas=1;progStat('pzBoyas');toast('🟠 Llegaste a las boyas. Hasta aquí se puede.')}
    if(E().en<10&&PZM.warn<1){PZM.warn=1;toast('😮‍💨 Te estás cansando. Salí del agua a descansar.')}
    if(E().en<=1)return pzRescate();
    if((h>=19||h<5)&&!PZM.night){PZM.night=1;toast('🌙 De noche el mar da miedo… y no hay salvavidas.')}}
  else{if(PZM.swimT>8){enAdd(4);toast('🌊 Saliste del agua como nuevo.');progStat('pzNado')}PZM.swimT=0;PZM.warn=0}
  // el sol
  if(PZM.solDay!==S.day){PZM.solDay=S.day;PZM.sol=0;PZM.burn=0}
  const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T),open=ty>=17&&!pzUnder()&&!MAPS.playa.objs.some(o=>o.type==='sombrilla'&&Math.abs(P.x-(o.x*T+8))<18&&Math.abs(P.y-(o.y*T+14))<14);
  if(h>=10&&h<15&&!S.rain&&open&&!(PLAYA&&PLAYA.bloq)&&!PZM.burn){PZM.sol+=dt*(PZS().gorra?.55:1)*(P.swim?1.25:1);
    if(PZM.sol>70&&!PZM.solW){PZM.solW=1;toast('☀️ El sol está pegando duro. ¿Bloqueador? El pipero vende.')}
    if(PZM.sol>130){PZM.burn=1;S.f.cojo=Math.max(S.f.cojo||0,totalMinutes()+14*60);PZS().quemado=(PZS().quemado||0)+1;toast('🦐 ¡Te quemaste! Quedaste rojo como camarón. Vas a andar como robot hasta mañana.');if(PLAYA&&PLAYA.ari)setTimeout(()=>{if(mode==='play'){say('ariana','¡Diay! ¡Estás rojísimo! Te dije que te echaras bloqueador. Vení, yo te unto aloe en la noche.');runDialog()}},400)}}
  // Ariana nada con vos
  const a=PLAYA&&PLAYA.ari?ENTS.find(e=>e.tmp==='playa'):null;if(a){const atx=Math.floor(a.x/T),aty=Math.floor(a.y/T);a.swim=P.swim&&pzK(atx,aty)===4&&a.y>pzShore(a.x)+5;
    if(a.swim&&P.swim){PZM.ariT+=dt;if(PZM.ariT>18){PZM.ariT=0;relAdd('ar',.3);if(BUBS.length<2)BUBS.push({e:a,txt:pick(['¡Te reto a llegar a esa boya!','¡No me salpiqués! …Bueno, guerra.','¡Una medusa! …No, era una bolsa.','¡Qué rica el agua!','¡Mirá, un pelícano!']),t:2.6})}}}});
function pzRescate(){mode='dialog';for(const k in KEYS)KEYS[k]=0;say(null,'Las piernas ya no te dan. Tragás agua, manoteás… y una mano te agarra del brazo.');
  say(fillChar({id:'z_pz_salva',name:'Salvavidas Andrés',skin:'#8d5524',hair:'corto',hairColor:'#1c1c1c',shirt:'#d6453c',pants:'#d6453c',acc:'gorra',accColor:'#d6453c',v:1}),'¡Tranquilo, tranquilo, ya lo tengo! ¡Respire! …Mae, el mar no es piscina. Cuando se cansa, se sale.');
  AFTER.push(()=>fadeDo(()=>{passTime(30);P.x=Math.min(110,Math.max(18,P.x/T))*T;P.y=24*T+12;P.swim=false;P.deck=false;E().en=Math.max(E().en,15);progStat('pzRescate')},()=>{toast('🛟 Te sacó el salvavidas. Descansá un rato.');saveGame()}));runDialog()}
// ---------------------------------------------------------------- el capitán y el paseo en lancha
function pzWilberTalk(e){const h=S.t/60,ari=PLAYA&&PLAYA.ari,n=ari?2:1,cost=10000*n;
  if(h<7||h>=18)return say(e.c,'Ya no salimos, joven. El golfo de noche es para los pescadores. Mañana desde las siete.');
  say(e.c,'¡Buenas! Capitán Wílber, a la orden. En La Perla lo llevo una hora por el golfo: la isla San Lucas, los pelícanos y, si Dios quiere, los delfines.',[
    {t:'Paseo en lancha'+(ari?' para los dos':'')+' ('+fmtC(cost)+' · 1 h)',f(){if(S.money<cost)return say(e.c,'Diay, no le alcanza. Son diez rojos por cabeza, con chaleco incluido.');spend(cost,'Paseo');afterD(()=>pzLancha())}},
    {t:'¿Hay delfines de verdad?',f(){say(e.c,'Hay días que salen veinte. Hay días que salen cero. El mar no firma contrato, joven.')}},{t:'Ahorita no'}])}
function pzLancha(){const ari=PLAYA&&PLAYA.ari,h0=S.t/60,dol=Math.random()<.72;let G=null,cvs=null,stage=-1;const W=PZV.W;
  const CAP=['Salimos del muelle. Puntarenas se va quedando atrás, con sus almendros y sus letras de colores.','Una fila de pelícanos pasa rasando el agua, sin mover las alas.','La isla San Lucas: la vieja cárcel entre los árboles. El capitán cuenta historias de presos y fantasmas.',dol?'¡DELFINES! Tres, cuatro, cinco… saltan al lado de la lancha. Todos gritan.':'Ni un delfín hoy. El capitán se encoge de hombros: «El mar no firma contrato».','El sol pega en el agua y todo brilla. De vuelta al Puerto.'];
  const SB={pel:[],dol:[],spray:[]};
  pzOvOpen('lancha',{cap:'Paseo por el golfo',sub:'La Perla · Capitán Wílber',btns:[{t:'Saltar',alt:1,f(){fin()}}],key:k=>{if(k==='escape'||k==='enter')fin();return true},
    draw:t=>{const g=PZV.g,Wd=PZV.W,H=PZV.H;if(!cvs){G=pzGulf(Wd,H,S.t/60,{hz:Math.round(H*.42),near:1});cvs=hdToCanvas(G.b)}
      const st=Math.min(4,Math.floor(t/6));if(st!==stage){stage=st;pzOvCap('Paseo por el golfo',CAP[st]);if(st===3&&dol){beepSeq([880,1046,1318]);for(let i=0;i<5;i++)SB.dol.push({x:Wd*(.15+i*.16),t0:t+.3+i*.55})}if(st===1)for(let i=0;i<6;i++)SB.pel.push({x:-20-i*9,y:H*.3+i*3,t0:t})}
      g.drawImage(cvs,0,0);const hz=G.hz;
      // la isla que se acerca y se va
      const ix=Wd*(1.1-t/34),iw=60+Math.max(0,10-Math.abs(t-15))*6;g.fillStyle='rgba(54,84,70,.95)';g.beginPath();g.ellipse(ix,hz,iw/2,10+Math.max(0,8-Math.abs(t-15))*1.2,0,Math.PI,0);g.fill();g.fillStyle='rgba(80,112,84,.9)';for(let i=0;i<8;i++){g.beginPath();g.arc(ix-iw/3+i*iw/12,hz-6-Math.sin(i)*2,4,0,7);g.fill()}
      if(Math.abs(t-15)<6){g.fillStyle='#d8cfc0';g.fillRect(ix-6,hz-8,10,6);g.fillStyle='#a8978a';g.fillRect(ix-6,hz-3,10,1)}
      pzGulfAnim(g,G,Wd,H,t*2.2,S.t/60);
      // el agua que pasa rápido
      for(let i=0;i<40;i++){const y=hz+4+hsh(i,1)*(H-hz-4),sp=1+(y-hz)/(H-hz)*6,x=(hsh(1,i)*Wd*2-t*30*sp)%(Wd+40);g.fillStyle='rgba(230,248,250,'+(.25+.4*(y-hz)/(H-hz)).toFixed(2)+')';g.fillRect((x+Wd+40)%(Wd+40)-20,Math.floor(y),2+sp*2,1)}
      // pelícanos
      for(const p of SB.pel){const x=p.x+(t-p.t0)*22,y=p.y+Math.sin((t-p.t0)*1.2+p.x)*1.5;if(x>Wd+20)continue;g.fillStyle='#3a3630';g.fillRect(x-4,y,9,1);g.fillRect(x-1,y-1,3,2);g.fillStyle='#d8b060';g.fillRect(x+2,y,3,1)}
      // delfines
      for(const d of SB.dol){const u=(t-d.t0)/1.1;if(u<0||u>1)continue;const x=d.x+u*24,y=hz+16-Math.sin(u*Math.PI)*16;g.fillStyle='#5a6a7a';g.save();g.translate(x,y);g.rotate((u-.5)*1.6);g.fillRect(-6,-1.5,12,3);g.fillRect(-2,-3.5,3,2);g.fillRect(-8,-2.5,2,1);g.fillRect(-8,.5,2,1);g.fillStyle='#c8d2dc';g.fillRect(-4,1,8,1);g.restore();if(u>.9)for(let k=0;k<5;k++)SB.spray.push({x:x+rnd(-3,3),y:hz+16,vy:-rnd(10,24),t:0})}
      for(const s of SB.spray){s.t+=1/60;s.y+=s.vy/60;s.vy+=50/60;g.fillStyle='rgba(255,255,255,.8)';g.fillRect(s.x,s.y,1,1)}SB.spray=SB.spray.filter(s=>s.t<.8);
      // la proa de la lancha y ustedes
      const bob=Math.sin(t*2.4)*2,by=H-34+bob;g.fillStyle='#e8e6de';g.beginPath();g.moveTo(Wd*.22,H);g.lineTo(Wd*.5,by);g.lineTo(Wd*.78,H);g.fill();g.fillStyle='#d6453c';g.beginPath();g.moveTo(Wd*.24,H);g.lineTo(Wd*.5,by+4);g.lineTo(Wd*.76,H);g.lineTo(Wd*.72,H);g.lineTo(Wd*.5,by+8);g.lineTo(Wd*.28,H);g.fill();
      g.fillStyle='#9a7450';g.beginPath();g.moveTo(Wd*.32,H);g.lineTo(Wd*.5,by+10);g.lineTo(Wd*.68,H);g.fill();
      const who=(x,shirt,hair,lng)=>{g.fillStyle='#f07a2a';g.fillRect(x-6,H-22+bob,12,14);g.fillStyle=shirt;g.fillRect(x-4,H-20+bob,8,4);g.fillStyle=hair;g.beginPath();g.arc(x,H-27+bob,5,0,7);g.fill();if(lng)g.fillRect(x-2.5,H-27+bob,5,10)};
      who(Wd*(ari?.44:.5),'#c8232c','#2a1810',0);if(ari)who(Wd*.57,(CH.ariana&&CH.ariana.shirt)||'#8fc8e8','#16100c',1);
      if(Math.random()<.3)SB.spray.push({x:Wd*.5+rnd(-30,30),y:by+rnd(0,10),vy:-rnd(5,15),t:0});
      if(t>30.5)fin()}});
  let done=false;function fin(){if(done)return;done=true;pzOvClose();fadeDo(()=>{passTime(60);P.x=90.5*T;P.y=34*T;P.deck=true},()=>{progStat('pzLancha');if(dol)progStat('pzDelfin');
    say(null,dol?'Bajás de la lancha con las piernas de gelatina y una sonrisa de oreja a oreja. ¡Delfines de verdad!':'Bajás de la lancha con olor a sal y el pelo tieso. No hubo delfines, pero la isla valió la pena.');
    if(ari){relAdd('ar',dol?3:2);say('ariana',dol?'¡¿VISTE?! ¡Uno me miró! Te juro que me miró. Esto no se me va a olvidar nunca.':'Aunque no salieron… estar ahí en medio del mar con vos fue lindísimo.')}
    enAdd(-4);runDialog();saveGame()})}}
// ---------------------------------------------------------------- la banana
// Te jalan a toda velocidad con chaleco. En cada curva la flecha te dice para dónde echarte: si no te echás a tiempo, salís volando.
// Cuando alguien se cae, la lancha para: hay que nadar (tocar rápido) y volverse a montar. Al final, la vuelta grande tira a todos.
// Cuando todos están arriba, se regresa a la orilla.
function pzYeisonTalk(e){const ari=PLAYA&&PLAYA.ari,cost=6000*(ari?2:1),h=S.t/60;
  if(h<8||h>=17.5)return say(e.c,'Ya guardamos la banana, mae. Mañana desde las ocho, cuando el mar está planchadito.');
  say(e.c,'¡Mae! ¿Una vuelta en la banana? Con chaleco, la lancha te jala a toda mecha y en las curvas… agárrese. '+(ari?'Para los dos, ':'')+fmtC(cost)+'.',[
    {t:'¡Montarse en la banana! ('+fmtC(cost)+')',f(){if(S.money<cost)return say(e.c,'Uy, mae, no le alcanza.');if(typeof pzDrunkLvl==='function'&&pzDrunkLvl()>=6)return say(e.c,'No, mae, usted está muy bolo. Se me ahoga y yo pierdo la licencia. Vuelva sobrio.');spend(cost,'Paseo');afterD(()=>pzBanana())}},
    {t:'¿Cómo es la cosa?',f(){say(e.c,'Cuando vea la flecha, se echa para ese lado (←/→ o los botones). Si se cae, nade (espacio o tocar rápido) y móntese otra vez. Cuando todos estemos arriba, seguimos.')}},{t:'Mejor no'}])}
function pzBanana(){const ari=PLAYA&&PLAYA.ari,W=()=>PZV.W,H=()=>PZV.H;let G=null,cvs=null;
  const R=[{me:1,shirt:'#c8232c',hair:'#2a1810',on:1},...(ari?[{ari:1,shirt:(CH.ariana&&CH.ariana.shirt)||'#8fc8e8',hair:'#16100c',lng:1,on:1}]:[]),{shirt:'#f4f4f4',hair:'#e8c070',on:1},{shirt:'#2e9e6b',hair:'#1c1c1c',on:1}];
  const B={st:'go',t:0,curves:0,next:2.2,arrow:0,dir:0,win:0,lean:0,swim:0,ok:0,fell:0,spl:[],msg:'',msgT:0,spd:1,ended:0};
  const fly=r=>{r.on=0;r.fly=0;r.sw=0;r.vx=rnd(30,60)*(Math.random()<.5?-1:1);r.vy=-rnd(50,80);r.fx=0;r.fy=0;beep(300,.2,'sawtooth',.03,120)};
  const say2=(m)=>{B.msg=m;B.msgT=2};
  const curve=final=>{B.arrow=0;const dir=B.dir;for(const r of R){if(!r.on)continue;if(r.me){if(final||B.lean!==dir){fly(r);B.fell++;say2(final?'¡LA VUELTA GRANDE! ¡Todos al agua!':'¡Salís volando!')}else{B.ok++;say2('¡Aguantaste! 💪')}}else if(final||Math.random()<.32)fly(r)}
    if(R.some(r=>!r.on))B.st='swim';B.curves++};
  const press=d=>{if(B.st==='go'&&B.arrow&&B.win>0)B.lean=d};
  const tapSwim=()=>{if(B.st!=='swim')return;const me=R.find(r=>r.me);if(me&&!me.on&&me.fly>.9){me.sw=Math.min(1,me.sw+.13);beep(260+me.sw*200,.04,'triangle',.02)}};
  pzOvOpen('banana',{cap:'La banana',sub:'Echate para el lado de la flecha',btns:innerWidth<560?[{t:'◀',f(){press(-1)}},{t:'🏊 Nadar',alt:1,f(){tapSwim()}},{t:'▶',f(){press(1)}}]:[{t:'◀ Izquierda',f(){press(-1)}},{t:'🏊 Nadar',alt:1,f(){tapSwim()}},{t:'Derecha ▶',f(){press(1)}}],
    key:k=>{if(k==='arrowleft'||k==='a')press(-1);else if(k==='arrowright'||k==='d')press(1);else if(k===' '||k==='e'||k==='enter')tapSwim();return true},
    tap:e=>{if(B.st==='swim')tapSwim();else press(e.clientX<innerWidth/2?-1:1)},
    draw:t=>{const g=PZV.g,Wd=W(),Hh=H(),dt=1/60;if(!cvs){G=pzGulf(Wd,Hh,S.t/60,{hz:Math.round(Hh*.36)});cvs=hdToCanvas(G.b)}g.drawImage(cvs,0,0);const hz=G.hz;B.t+=dt;
      pzGulfAnim(g,G,Wd,Hh,t*1.5,S.t/60);
      const moving=B.st==='go'||B.st==='home';B.spd+=((moving?1:0)-B.spd)*dt*1.5;
      for(let i=0;i<46;i++){const y=hz+4+hsh(i,4)*(Hh-hz-4),sp=1+(y-hz)/(Hh-hz)*7,x=((hsh(4,i)*Wd*3-t*40*sp*B.spd)%(Wd+40)+Wd+40)%(Wd+40)-20;g.fillStyle='rgba(230,248,250,'+(.2+.45*(y-hz)/(Hh-hz)).toFixed(2)+')';g.fillRect(x,Math.floor(y),2+sp*2*B.spd,1)}
      // la lógica
      if(B.st==='go'){B.next-=dt;if(!B.arrow&&B.next<=0){if(B.curves>=4){B.dir=Math.random()<.5?-1:1;B.arrow=1;B.win=1.1;B.final=1;B.lean=0;say2('¡Ahí viene la vuelta grande!')}else{B.dir=Math.random()<.5?-1:1;B.arrow=1;B.win=Math.max(.75,1.15-B.curves*.1);B.lean=0}beep(B.dir<0?520:660,.08,'square',.025)}
        if(B.arrow){B.win-=dt;if(B.win<=0)curve(B.final)}}
      else if(B.st==='swim'){let all=1;for(const r of R){if(r.on)continue;all=0;if(r.fly<1){r.fly+=dt*1.6;r.fx+=r.vx*dt;r.fy+=r.vy*dt;r.vy+=150*dt;if(r.fly>=1){for(let k=0;k<12;k++)B.spl.push({x:Wd*.4+r.fx,y:Hh*.72,vx:rnd(-20,20),vy:-rnd(20,50),t:0});beep(120,.15,'triangle',.03)}}
          else{if(!r.me)r.sw=Math.min(1,r.sw+dt*rnd(.25,.45));if(r.sw>=1){r.on=1;beep(500,.06,'triangle',.02)}}}
        const me=R.find(r=>r.me);if(me&&!me.on&&me.fly>=1&&!B.hint){B.hint=1;say2('¡Nadá! Tocá rápido o espacio')}
        if(all){B.hint=0;if(B.final){B.st='home';say2('¡Ahora sí, todos arriba! A la orilla');B.homeT=4}else{B.st='go';B.next=rnd(1.8,3.2);say2('¡Todos arriba! ¡Seguimos!')}}}
      else if(B.st==='home'){B.homeT-=dt;if(B.homeT<=0&&!B.ended){B.ended=1;fin()}}
      // la lancha que jala y la cuerda
      const sway=B.arrow?Math.sin(t*10)*1.5:0,lean=B.arrow&&B.st==='go'?B.dir:0,by=Hh*.72,bx=Wd*.4,lx=Wd*.82,ly=Hh*.62;
      g.fillStyle='#f4f2ea';g.fillRect(lx-18,ly-4,40,8);g.fillStyle='#2a6fb0';g.fillRect(lx-18,ly+2,40,3);g.fillStyle='#3a3a40';g.fillRect(lx-22,ly-6,6,8);g.fillStyle='#8a6a4a';g.fillRect(lx-6,ly-12,6,8);g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<6;i++)g.fillRect(lx-26-i*5-B.spd*hsh(i,Math.floor(t*8))*6,ly+3+hsh(i,2)*3,4,1);
      g.strokeStyle='#e8dcc0';g.lineWidth=1;g.beginPath();g.moveTo(lx-22,ly);g.quadraticCurveTo((lx+bx)/2,ly+6+sway,bx+38,by-4);g.stroke();
      // la banana
      g.save();g.translate(bx,by);g.rotate(lean*.08+sway*.01);g.fillStyle='rgba(20,50,70,.3)';g.fillRect(-36,6,80,4);
      for(let i=-36;i<40;i++){const r=5-Math.abs(i)/76*3;g.fillStyle='#f2c22e';g.fillRect(i,-r,1,r*2);g.fillStyle='#ffe27a';g.fillRect(i,-r,1,1.5);g.fillStyle='#c8921e';g.fillRect(i,r-1.5,1,1.5)}
      g.fillStyle='#f2c22e';g.beginPath();g.arc(42,-3,4,0,7);g.fill();
      // los que van montados
      R.forEach((r,i)=>{if(!r.on)return;const x=-26+i*18,yy=-6+(B.st==='go'?Math.sin(t*9+i)*1:0);g.fillStyle='#f07a2a';g.fillRect(x-4,yy-11,8,10);g.fillStyle=r.shirt;g.fillRect(x-3,yy-10,6,3);g.fillStyle=r.hair;g.beginPath();g.arc(x+lean*1.5,yy-14,3.5,0,7);g.fill();if(r.lng)g.fillRect(x-3.5+lean*1.5,yy-14,7,6);g.fillStyle='#e0a070';g.fillRect(x+3,yy-6,3,1.5)});
      g.restore();
      // los que van volando o nadando
      for(const r of R){if(r.on)continue;let x,y;if(r.fly<1){x=bx+r.fx;y=by-10+r.fy}else{const tx=bx-26+R.indexOf(r)*18,sx=bx+r.fx;x=sx+(tx-sx)*r.sw;y=by+2+Math.sin(t*5+x)*1}
        g.fillStyle='#f07a2a';g.fillRect(x-4,y-5,8,(r.fly<1?10:6));g.fillStyle=r.hair;g.beginPath();g.arc(x,y-8,3.5,0,7);g.fill();if(r.fly>=1){g.fillStyle='rgba(240,252,252,.85)';g.fillRect(x-7,y+1,14,1)}
        if(r.me&&r.fly>=1){g.fillStyle='rgba(20,16,28,.7)';g.fillRect(x-12,y-22,24,4);g.fillStyle='#f2c94c';g.fillRect(x-11,y-21,22*r.sw,2)}}
      for(const s of B.spl){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=90*dt;g.fillStyle='rgba(255,255,255,.85)';g.fillRect(s.x,s.y,1.5,1.5)}B.spl=B.spl.filter(s=>s.t<1);
      if(B.st==='go'&&Math.random()<.5)B.spl.push({x:bx-36+rnd(-2,2),y:by+3,vx:-rnd(10,30),vy:-rnd(5,20),t:.4});
      // la flecha
      if(B.arrow){const k=B.win%.3<.15;g.fillStyle=k?'#f2c94c':'#ffffff';const ax=Wd/2+B.dir*30,ay=hz-26;g.beginPath();g.moveTo(ax+B.dir*14,ay);g.lineTo(ax,ay-10);g.lineTo(ax,ay-4);g.lineTo(ax-B.dir*12,ay-4);g.lineTo(ax-B.dir*12,ay+4);g.lineTo(ax,ay+4);g.lineTo(ax,ay+10);g.fill();
        if(B.lean){g.fillStyle=B.lean===B.dir?'#7bd16b':'#e8524a';g.fillRect(Wd/2-20,ay+14,40,3)}}
      if(B.msgT>0){B.msgT-=dt;g.font='bold 10px Trebuchet MS, sans-serif';g.textAlign='center';g.fillStyle='rgba(20,16,28,.75)';const tw=g.measureText(B.msg).width+12;g.fillRect(Wd/2-tw/2,Hh*.17,tw,14);g.fillStyle='#f4ead2';g.fillText(B.msg,Wd/2,Hh*.17+10)}}});
  function fin(){pzOvClose();const full=B.fell===0&&B.ok>=4;fadeDo(()=>{passTime(30);P.x=70*T+8;P.y=27*T+12;P.deck=false;P.swim=false},()=>{progStat('pzBanana');if(full)progStat('pzBananaFull');enAdd(-6);
    say(null,full?'Aguantaste todas las curvas sin caerte. Solo la vuelta grande te tiró. Yeison te choca la mano: «¡Mae, usted es de aquí!»':B.fell>3?'Te caíste '+B.fell+' veces. Tragaste medio golfo de Nicoya y te reís como chiquito.':'Salís de la banana empapado, con el chaleco torcido y la panza adolorida de la risa.');
    if(ari){relAdd('ar',2);say('ariana',pick(['¡Jajaja! ¡Volaste como dos metros! Lo tengo grabado en la memoria para siempre.','¡Otra vez, otra vez! …Bueno, mejor mañana, que me tragué un pescado.','¡Me agarraste la mano cuando nos caímos! …Bueno, yo te la agarré a vos.']))}runDialog();saveGame()})}}
// los dos que faltaban: el capitán de La Perla en el muelle y Yeison al lado de la banana
hookAfter('pzPeople',function(m){
  zPed('playa',91,33,{id:'z_pz_wilber',name:'Capitán Wílber',hair:'corto',hairColor:'#cfcfcf',skin:'#8d5524',shirt:'#f4f4f4',pants:'#2d3a6e',acc:'gorra',accColor:'#2d3a6e'},{stat:1,reach:26,d0:3,pier:1,talk:pzWilberTalk,sh:['¡Paseos al golfo, la isla San Lucas!','¡Delfines, delfines!']});
  zPed('playa',69,27,{id:'z_pz_yeison',name:'Yeison de la banana',hair:'corto',hairColor:'#1c1c1c',skin:'#6b3e1e',shirt:'#f2c94c',pants:'#2a6fb0',acc:'lentes',accColor:'#2a2a30'},{stat:1,reach:26,d0:0,talk:pzYeisonTalk,sh:['¡La banana, la banana!','¡Súbase, que no muerde!']})});
