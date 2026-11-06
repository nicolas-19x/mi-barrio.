// ================= LA MONA en el Puente de la Vieja · escena =================
function monaStall(){const p=PRO;p.ap='stall';p.mona={st:'stall',cranks:0};proMus(null);p.radioTxt='NO PARE';
 p.T.cars=p.T.cars.filter(c=>c.z<p.pos-30||c.z>PRO_BR[1]+300);$('#pBrake').classList.add('hidden');
 proSfx('tos');proAfter(.5,()=>proSfx('tos'));proSay('','El motor tose. Una vez. Dos.',2.2);proSay(proYou(),'No, no… aquí no. Aquí no.',2);
 // las capas pesadas se arman de a una, mientras el carro se detiene
 const L=p.L,W=p.W,WH=L.dashTop,sb=Math.min(1,WH/266*1.15),m=p.mona;
 const jobs=[()=>m.l1=monaArt(W,WH,{hx:W/2,hy:WH*.5,s:sb,open:.12,fog:.75,hands:[[-56,-2],[56,-2]],seed:7}),
  ()=>m.l2=monaArt(W,WH,{hx:W/2,hy:WH*.47,s:sb*1.26,open:.6,fog:.9,hands:[[-56,-4],[56,-4]],seed:7}),
  ()=>m.l3=monaArt(W,WH,{hx:W/2,hy:WH*.5,s:sb*1.55,open:1,fog:.5,red:.25,hands:[[-56,0],[56,0]],seed:7}),
  ()=>{const S=Math.round(300*sb);m.hand=monaArt(S,S,{hx:S/2,hy:S/2,s:1.65*sb,open:0,hands:[[0,-10]],only:'hands',kb:1.4,kt:.6,red:.25,seed:7})},
  ()=>{const mk2=()=>mk(W,WH);m.c1=mk2();monaCracks(m.c1.getContext('2d'),m.l1.palms.map(([x,y])=>[x,y-8*sb,.55]),.28,13,W,WH);
   m.c2=mk2();monaCracks(m.c2.getContext('2d'),[[(m.l2.eyes[0][0]+m.l2.eyes[1][0])/2,m.l2.eyes[0][1]-22*sb,1],...m.l2.palms.map(([x,y])=>[x,y-10*sb,.6])],.55,13,W,WH);
   m.sc=mk2();monaScratch(m.sc.getContext('2d'),m.l2.claws,46*sb,5);
   const hx=W/2,hy=WH*.5;m.hole=[hx,hy,52*sb*1.55*.95,40*sb*1.55*.95];m.c3=mk2();monaCracks(m.c3.getContext('2d'),[[hx,hy,1.5],...m.l3.palms.map(([x,y])=>[x,y-10*sb,.8])],.85,13,W,WH,m.hole)}];
 let i=0;const next=()=>{if(!PRO||PRO!==p||i>=jobs.length)return;try{jobs[i++]()}catch(e){console.error(e)}setTimeout(next,30)};setTimeout(next,60)}
function monaStop(){const p=PRO,m=p.mona;m.st='stop';p.ap='wait';p.engineOff=1;p.hlK=.45;p.grain=.07;m.pulse=0;if(p.T.vieja)p.T.vieja.gone=1;
 if(!PSP.muj)PSP.muj=[0,1,2,3,4].map(mujSprite);
 const wom=m.wom={z:p.pos+40,x:-.2,img:PSP.muj[0],self:.7};p.T.objs.push(wom);p.T.objs.sort((a,b)=>a.z-b.z);wom.gone=1;
 const show=(z,x)=>{wom.z=p.pos+z;wom.x=p.x+x-.3;wom.img=PSP.muj[0];wom.gone=0;p.T.objs.sort((a,b)=>a.z-b.z)};
 const dark=(d,fn)=>{m.dark=1;p.hlK=0;proSfx('zumbido',.6);proAfter(d,()=>{m.dark=0;p.hlK=.45;fn&&fn()})};
 proAfter(.3,()=>{proSay('','El carro se apaga en medio del puente. Solo se oye la lluvia.',3)});
 proAfter(3,()=>{show(24,-.2);proSay('','Hay alguien parado en media calle.',2.4)});
 proAfter(5,()=>{$('#pKey').classList.remove('hidden');proHint('¡Tocá «Arrancar»!',3)});
 proAfter(6.4,()=>dark(.55,()=>{}));proAfter(6.6,()=>show(12,.1));
 proAfter(8.8,()=>proSay('ARIANA · dormida','…mor… ¿quién es esa?',2));
 proAfter(10.4,()=>dark(1.3,()=>{m.mir=1.3;proSfx('zumbido');proAfter(1.4,()=>{proSay('','Adelante ya no hay nadie.',1.8)})}));proAfter(10.6,()=>{wom.gone=1});
 proAfter(14.4,()=>{show(34,-.3);m.run=1;m.rv=4;m.rf=0;m.rz=34;proSfx('respira');proSay('','Está corriendo hacia el carro.',2)})}
function monaTick(dt){const p=PRO,m=p.mona;if(!m)return;
 if(m.mir>0)m.mir-=dt;
 if(m.run){m.rv=Math.min(12,m.rv+dt*3.5);if(!m.hold){m.rz-=m.rv*dt;m.rf+=dt*(7+m.rv*.6)}if(Math.random()<dt*1.4&&!m.hold){m.hold=.08+Math.random()*.15}if(m.hold){m.hold-=dt;if(m.hold<=0)m.hold=0}
  const seq=[1,2,3,4,1,3,4,2],fr=seq[Math.floor(m.rf)%seq.length];if(fr!==m.lf){m.lf=fr;if(fr===1||fr===3)proSfx('paso',Math.min(1.4,.6+m.rv/12))}
  m.wom.img=PSP.muj[fr];m.wom.z=p.pos+m.rz;m.wom.x=p.x-.35+Math.sin(m.rf*.9)*.25;
  if(m.bt0==null||p.t-m.bt0>1.1){m.bt0=p.t;proSfx('respira',.8+m.rv/12)}
  if(m.rz<3.4){m.run=0;m.wom.gone=1;m.dark=1;p.hlK=0;p.silence=1;$('#pKey').classList.add('hidden');proAfter(.45,()=>{p.subl=2});
   proAfter(.9,()=>{proSfx('golpe',2);proSfx('crash',.8);p.shake=1.1;p.silence=0;proAfter(.35,()=>{m.dark=0;p.hlK=.25;monaFall()})})}}}
function monaFall(){const p=PRO,m=p.mona;if(!m.l1){proAfter(.3,monaFall);return}
 m.st='fall';m.ft=p.t;proSfx('vidrio',.8);p.shake=.7;m.beat=1;m.pulse=1;p.flash=.9;p.punch=1;p.glitch=1;p.grain=.16;proSfx('boom');proSfx('thunder');m.lit='norm';m.strT=.45;$('#pcap').classList.add('gl');
 if(p.A){proSet(p.A.dg.gain,.09,.6);proSet(p.A.d2.frequency,62,.5)}$('#pKey').classList.remove('hidden');
 proAfter(1.2,()=>proSay('ARIANA · dormida','Mmm…',1.4));
 proAfter(3.2,()=>{if(!m.l2)return;m.st='press';m.pt=p.t;proSfx('raspa',1.4);if(p.A)proSet(p.A.d2.frequency,96,2.5);proAfter(.5,()=>{proSfx('vidrio');p.shake=.5;p.punch=.6;p.glitch=.7});proAfter(1.2,()=>{proSfx('vidrio',1.2);p.shake=.7;p.punch=.8;p.glitch=.9;proSfx('boom',.6)});proAfter(2.4,()=>{p.subl=2;proSfx('grito',.5)})});
 proAfter(6.8,()=>{if(!m.l3)return;m.st='burst';m.bt=p.t;proSfx('grito');proSfx('shatter');proSfx('boom',1.2);p.shake=1.2;p.flash=.4;p.punch=1.3;p.glitch=1.3;p.subl=3;p.grain=.24;p.ariAwake=1;$('#pKey').classList.add('hidden');proAfter(.5,()=>proSay('ARIANA','¡¡MOR!!',1.2))});
 proAfter(8.5,()=>{m.black=1;p.silence=1});
 proAfter(9.8,()=>{m.st='gone';p.grain=0;p.glitch=0;$('#pcap').classList.remove('gl');if(p.A)proSet(p.A.dg.gain,0,1);p.broken=1;m.black=0;p.silence=0;p.engineOff=0;p.ariAwake=0;p.hlK=null;p.ap=null;p.spd=8;m.beat=0;proSfx('ruge');p.shake=.5;
  proSay('','El carro arranca solo. Ya no hay nadie.',2.6);proAfter(2.8,()=>proFreno())})}
function monaCrank(){const p=PRO;if(!p||!p.mona||p.mona.st==='burst'||p.mona.st==='gone')return;proSfx('crank');p.shake=Math.max(p.shake,.15);p.mona.cranks++;
 if(p.mona.cranks===3)proSay('','El motor no agarra.',1.6);if(p.mona.cranks===7)proSay(proYou(),'¡Vamos, vamos, vamos!',1.6)}
// lo que se ve del otro lado del vidrio (va entre la carretera y la cabina)
function monaWorld(g){const p=PRO,m=p.mona,L=p.L,W=p.W,WH=L.dashTop;
 g.save();g.beginPath();g.rect(0,L.roof,W,WH-L.roof);g.clip();
 if(m&&(m.st==='fall'||m.st==='press'||m.st==='burst')){
  let lay=m.l1,dy=0,al2=0;
  if(m.st==='fall'){const k=Math.min(1,(p.t-m.ft)/.42),e=k<1?1-Math.pow(1-k,3):1;dy=Math.round((1-e)*-WH*.75)+(k>=1?Math.round(Math.sin((p.t-m.ft)*2.2)*1.2):0)}
  if(m.st==='press'){al2=Math.min(1,(p.t-m.pt)/.45)}
  if(m.st==='burst')lay=m.l3;
  const jit=m.st==='burst'?Math.round((Math.random()-.5)*3):0,lt=monaLight(1/60),Lv=(c)=>lt==='dark'?pDim(c,.86,'#000000'):lt==='red'?pDim(c,.55,'#5a0008'):c;
  g.fillStyle=lt==='red'?'rgba(40,0,4,.78)':'rgba(0,0,0,.82)';g.fillRect(0,0,W,WH);
  g.drawImage(Lv(lay),jit,dy+jit);if(al2>0&&m.l2){g.globalAlpha=al2;g.drawImage(Lv(m.l2),0,0);g.globalAlpha=1}
  const cur=m.st==='burst'?m.l3:al2>.5?m.l2:m.l1,fl=.75+.25*Math.sin(p.t*9)+(Math.random()<.05?-.5:0);
  const ek=lt==='dark'?1.4:1;for(const[ex,ey]of cur.eyes){const yy=ey+(cur===m.l1?dy:0),sz=(cur===m.l3?1.55:cur===m.l2?1.26:1)*(p.L.dashTop/266);proGlow(g,ex,yy,7*sz,'#ff7a10',.55*fl*ek);proGlow(g,ex,yy,3,'#fff0a0',.6*fl);
   const fw=Math.round((26+18*fl)*sz);for(const[a,h]of[[.35,1],[.15,3]]){g.fillStyle='rgba(255,140,40,'+(a*fl*ek)+')';g.fillRect(Math.round(ex-fw),Math.round(yy-h/2),fw*2,h)}}
  g.fillStyle='rgba(130,160,200,.05)';g.fillRect(0,0,W,WH);
  if(m.st!=='burst'&&(m.st!=='fall'||p.t-m.ft>.42)&&m.c1)g.drawImage(m.c1,0,0);
  if(m.st==='press'){const k=Math.min(1,(p.t-m.pt)/1.4);if(m.sc){const hh=Math.round(WH*k);g.save();g.beginPath();g.rect(0,0,W,Math.round(WH*.25)+hh);g.clip();g.drawImage(m.sc,0,0);g.restore()}if(p.t-m.pt>.5&&m.c2)g.drawImage(m.c2,0,0)}
  if(m.st==='burst'&&m.c3)g.drawImage(m.c3,0,0)}
 else if(p.broken&&p.mona&&p.mona.c3)g.drawImage(p.mona.c3,0,0);
 if(m&&m.dark){g.fillStyle='rgba(0,0,0,.94)';g.fillRect(0,0,W,WH)}
 g.restore()}
// lo que se mete a la cabina (va encima del tablero)
function monaFront(g){const p=PRO,m=p.mona,L=p.L,W=p.W,H=p.H;if(!m)return;
 if(m.flick>0){m.flick-=1/60;p.hlK=Math.random()<.5?0:.3}
 if(m.st==='stall'){p.hlK=.35+Math.random()*.5}
 if(m.st==='burst'){const t=(p.t-m.bt)/.9;if(m.hand&&t>.12){const S=m.hand.width;g.save();g.translate(W*.34,L.dashTop*.6+Math.round((1-Math.min(1,(t-.12)*3))*-30));g.rotate(Math.PI*.9);g.drawImage(m.hand,-S/2,-S/2+8);g.restore()}
  monaShards(g,W/2,L.dashTop*.5,W,H,Math.min(1.1,t),4);g.fillStyle='rgba(150,0,10,'+(.1+.08*Math.sin(p.t*20))+')';g.fillRect(0,0,W,H)}
 if(m.beat&&Math.floor(p.t*1.15)!==m.lb){m.lb=Math.floor(p.t*1.15);proSfx('latido',.8);m.pulse=1}
 if(m.black){g.fillStyle='#000';g.fillRect(0,0,W,H)}}

