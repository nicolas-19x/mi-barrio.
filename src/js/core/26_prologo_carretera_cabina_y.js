// ================= PRÓLOGO · carretera, cabina y juego =================
// Variantes: 0 = prólogo completo (carro). 1..4 = pesadillas que vuelven (moto), ligadas a la historia de Carlillos.
const PRO_END=4000,PRO_PEAJE=900,PRO_PUENTE=1490,PRO_RARO=2520,PRO_RW=4.2,PRO_CAMH=1.35,PRO_BR=[1470,1615];
const proBz=z=>Math.round(PRO_RARO+(z-4300)*.8);
function proTrack(v){const T={curves:[],objs:[],cars:[],ev:[]},r=pRng(4242+v),P=proSprites();
 const C=(a,b,k)=>T.curves.push([a,b,k]),O=(z,x,img,o)=>{const ob=Object.assign({z,x,img},o||{});T.objs.push(ob);return ob};
 [[120,420,.0024],[470,820,-.003],[1000,1230,.0034],[1260,1440,-.0042],[1680,1880,-.0055],[1920,2120,.0062],[2160,2340,-.0058],[2370,2500,.0045],
  [proBz(4400),proBz(4880),.0032],[proBz(4980),proBz(5460),-.0036],[proBz(5560),proBz(5900),.0024]].forEach(c=>C(...c));
 const enPuente=z=>z>PRO_BR[0]-25&&z<PRO_BR[1]+25;
 // orillas
 for(let z=40;z<PRO_END+200;z+=r()*14+12){if(enPuente(z))continue;const raro=z>PRO_RARO+120,side=r()<.5?-1:1;
  if(raro){if(r()<.55)O(z,side*(6.2+r()*1.5),P.posteB);else if(r()<.5)O(z,side*(9+r()*6),P.tree[(r()*3)|0]);else O(z,side*(8+r()*5),r()<.5?P.plat:P.cana)}
  else{const k=r();if(k<.42)O(z,side*(8+r()*8),P.tree[(r()*3)|0]);else if(k<.58)O(z,side*(7.5+r()*5),P.plat);else if(k<.7)O(z,side*(7+r()*4),P.cana);else if(k<.86)O(z,side*(6.4+r()),P.poste);else O(z,side*(10+r()*10),P.tree[(r()*3)|0])}}
 for(let z=30;z<PRO_RARO;z+=26){if(Math.abs(z-PRO_PEAJE)<60||enPuente(z))continue;O(z,-5.1,P.post);O(z+13,5.1,P.post)}
 // rótulos
 O(160,6.6,sprSign(['SAN JOSE','45 KM']));O(450,-6.8,sprSign(['PEAJE','500 M']));
 O(1400,6.8,sprSignPuente());O(1660,6.8,sprSign(['PENDIENTE','PELIGROSA','USE FRENO','DE MOTOR'],'#f2c230','#1d1a24'));O(2050,-6.8,sprSign(['CURVAS','PELIGROSAS'],'#f2c230','#1d1a24'));
 O(proBz(4600),6.8,sprSign(['LA ENTRADA','300 M']));
 // peaje (solo en el prólogo completo)
 if(!v){O(PRO_PEAJE,0,P.techo,{ho:4.6,self:.5});T.caseta=O(PRO_PEAJE,.4,P.caseta,{self:.25});T.cin=O(PRO_PEAJE+.9,-1.1,P.casetaIn,{self:1,ho:1.6});
  T.chepe=O(PRO_PEAJE+.45,-1.1,null,{person:'chepe',ho:1});O(PRO_PEAJE,-10.5,P.casetaOff);O(PRO_PEAJE,9,P.casetaOff)}
 // el Puente de la Vieja: baranda de piedra, faroles y la vieja sentada
 const bar=sprBaranda(),far=sprFarol();for(let z=PRO_BR[0];z<=PRO_BR[1];z+=2.1){O(z,PRO_RW+.95,bar);O(z+.4,-PRO_RW-.95,bar)}
 for(const z of[PRO_BR[0],PRO_BR[0]+70,PRO_BR[1]]){O(z,PRO_RW+1.8,far,{self:.7});O(z,-PRO_RW-1.8,far,{self:.7})}
 
 // ojos de La Mona entre el monte (en las pesadillas que vuelven se acercan)
 const ojos=sprOjos();[[proBz(4700),-9],[proBz(5300),8],[proBz(5850),-6.5]].forEach(([z,x],i)=>{if(!v&&i<2||v&&i<v)O(z,x,ojos,{self:1,ho:1.4})});
 // el barrio que se mete en la carretera
 O(proBz(4985),-7.2,P.chino,{ho:2.6,self:.7});
 T.kev=O(proBz(5560),5.4,null,{person:'kevin'});
 O(proBz(5010),1.6,P.carre,{obst:1});O(proBz(5720),-1.2,P.sillon,{obst:1});O(proBz(5880),2.3,P.carre,{obst:1});O(proBz(5800),-2.6,P.carre,{obst:1});
 [[5150,1],[5260,3],[5370,9]].forEach(([z,n])=>{for(let i=0;i<n;i++)O(proBz(z)+i*2.2,-4+r()*8,null,{ani:'gallo',vx:(r()<.5?-1:1)*(1.4+r()*1.8),obst:1,fr:r()})});
 O(proBz(5470),-3,null,{ani:'perro',vx:2.6,obst:1});O(proBz(5490),3.5,null,{ani:'perro',vx:-2.2,obst:1});
 T.tapia=O(PRO_END,0,sprTapia(v===2?'HONDA 78':'AQUI NO',v===2?'SE VENDE 8333-1978':''),{wall:1,self:.55});
 if(v===4)T.kev2=O(PRO_END-1.5,PX0(),null,{person:'kevin',wave:1,self:.4});
 // tráfico
 const car=(z,x,vv,img,o)=>T.cars.push(Object.assign({z,x,v:vv,img,w:img.mw},o||{}));
 if(!v){car(230,2.1,13,P.trailer,{tr:1});car(620,-2.1,-21,P.carF[0]);car(1090,2.1,12,P.trailer,{tr:1});car(1330,-2.1,-22,P.carF[1])}
 car(1900,2.1,10,P.trailer,{tr:1});car(2060,2.1,15,P.carB[1]);car(2240,2.1,9,P.trailer,{tr:1});car(2420,2.1,14,P.carB[2]);
 [1960,2160,2380].forEach((z,i)=>car(z,-2.1,-(20+i*2),P.carF[i%3]));
 T.objs.sort((a,b)=>a.z-b.z);return T}
function PX0(){return PRO?PRO.x:2.1}
function proCurve(z){if(!PRO)return 0;let k=0;for(const[a,b,c]of PRO.T.curves)if(z>a&&z<b)k+=c*Math.sin((z-a)/(b-a)*Math.PI);return k}

// ---------- colores con luz de focos y neblina ----------
const PCOL=new Map();
function pHex(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]}
function pMix(base,lit,fog,fogc){const k=base+'|'+lit+'|'+fog+'|'+fogc;let s=PCOL.get(k);if(s)return s;const b=pHex(base),f=pHex(fogc),L=lit/8,F=fog/10;
 s='rgb('+b.map((v,i)=>Math.round(Math.min(255,v*L)*(1-F)+f[i]*F)).join(',')+')';PCOL.set(k,s);return s}
function pLerpHex(a,b,t){const A=pHex(a),B=pHex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}

// ---------- cabina ----------
function proLayout(W,H,moto){const L={W,H,moto};L.dashH=Math.round(H*.3);L.dashTop=H-L.dashH;L.roof=Math.max(9,Math.round(H*.045));
 L.wR=Math.min(58,Math.round(L.dashH*.95));L.wx=Math.round(W*.31);L.wy=H+Math.round(L.dashH*(H>W?-.18:.22));
 L.gY=L.dashTop+Math.round(L.dashH*.11);L.gR=Math.max(7,Math.round(L.dashH*.1));L.g1=L.wx-L.gR-3;L.g2=L.wx+L.gR+3;
 L.rx=Math.round(W*.56);L.ry=L.dashTop+Math.round(L.dashH*.2);L.rw=Math.max(32,Math.round(W*.15));
 L.mx=Math.round(W/2);L.my=L.roof+1;L.mw=Math.max(40,Math.round(W*.2));
 L.wp=[[Math.round(W*.2),L.dashTop+1],[Math.round(W*.58),L.dashTop+1]];L.wl=Math.round(W*.46);
 if(moto){L.barY=H-Math.round(H*(H>W?.17:.2));L.dashTop=L.barY-6}else carLayout(L);
 return L}
function proCabin(L){if(!L.moto)return carCabin(L);const{W,H}=L,c=mk(W,H),g=c.getContext('2d'),p=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x|0,y|0,w||1,h||1)},r=pRng(99);
 if(L.moto){const by=L.barY;
  // tanque
  for(let y=by+8;y<H;y++){const hw=Math.round((W*.2)*Math.sqrt(Math.max(0,1-Math.pow((H+20-y)/(H+20-by-8),2))));p('#9e1420',W/2-hw,y,hw*2);p('#c8202e',W/2-hw+2,y,Math.max(0,hw-6));p('#e8505a',W/2-hw+4,y,2);p('#e9e3cf',W/2-2,y,4);p('#5a0a12',W/2+hw-3,y,3)}
  // manubrio
  for(let x=Math.round(W*.04);x<W-Math.round(W*.04);x++){const u=(x-W/2)/(W/2),y=Math.round(by-Math.pow(Math.abs(u),2)*10);p('#2a2c30',x,y,1,4);p('#c9ced6',x,y,1,1);p('#7d838c',x,y+3,1,1)}
  [[Math.round(W*.04),-1],[W-Math.round(W*.04)-18,1]].forEach(([x])=>{p('#141217',x,by-13,18,8);for(let i=0;i<18;i+=3)p('#26232c',x+i,by-13,1,8);p('#5a3a24',x+3,by-15,12,4);p('#7a5232',x+4,by-15,10,1)});
  // espejos
  [[Math.round(W*.12),-1],[Math.round(W*.88),1]].forEach(([mx,s])=>{pLine(g,mx-s*2,by-12,mx,by-46,'#7d838c',2);pDisk(p,mx,by-54,11,(x,y,dx,dy)=>p(dx*dx+dy*dy>80?'#1a1a1e':'#3a4252',x,y));pDisk(p,mx,by-54,8,(x,y,dx,dy)=>p(dx+dy<-4?'#5a6478':'#2c3444',x,y))});
  // faro con velocímetro
  pDisk(p,W/2,by-6,15,(x,y,dx,dy)=>p(dx*dx+dy*dy>170?'#9aa1aa':'#1b1d22',x,y));pDisk(p,W/2,by-6,11,(x,y)=>p('#e9e3cf',x,y));
  for(let i=0;i<=8;i++){const a=Math.PI*(.85+i*.1625);p('#1d1a24',W/2+Math.round(Math.cos(a)*9),by-6+Math.round(Math.sin(a)*9))}
  return c}
 const dt=L.dashTop;
 // techo y retrovisor
 p('#0e0c13',0,0,W,L.roof);p('#1a1722',0,L.roof-2,W,1);for(let x=2;x<W;x+=5)p('#15121b',x,Math.round(L.roof/2),2,1);
 // parales
 for(let y=L.roof;y<dt;y++){const u=(y-L.roof)/(dt-L.roof),w=Math.round(W*(.15-.1*u));p('#110f16',0,y,w);p('#2a2533',w-1,y,1);p('#110f16',W-w,y,w);p('#2a2533',W-w,y,1)}
 // tablero
 for(let y=dt-1;y<H;y++)p(y<dt+1?'#34303f':y<dt+3?'#25222e':'#1a1821',0,y,W);
 for(let i=0;i<W*L.dashH/14;i++)p(r()<.5?'#1e1c26':'#16141c',(r()*W)|0,dt+3+((r()*L.dashH)|0));
 // capota de los relojes
 for(let x=L.g1-L.gR-6;x<=L.g2+L.gR+6;x++){const u=(x-L.wx)/(L.g2-L.g1+L.gR*2+12)*2,h=Math.round(8*Math.sqrt(Math.max(0,1-u*u)));p('#1c1a24',x,dt-h,1,h);p('#34303f',x,dt-h,1,1)}
 [[L.g1,'KM/H'],[L.g2,'TEMP']].forEach(([gx,lb])=>{pDisk(p,gx,L.gY,L.gR,(x,y,dx,dy)=>p(dx*dx+dy*dy>(L.gR-1)*(L.gR-1)?'#3c3846':'#07120d',x,y));
  for(let i=0;i<=10;i++){const a=Math.PI*(.75+i*.15);p(i%5?'#2f7a52':'#7fe0a8',gx+Math.round(Math.cos(a)*(L.gR-2)),L.gY+Math.round(Math.sin(a)*(L.gR-2)))}});
 // radio
 p('#0d0c11',L.rx-2,L.ry-2,L.rw+4,16);p('#24212c',L.rx-2,L.ry-2,L.rw+4,1);p('#061008',L.rx,L.ry,L.rw,9);[2,L.rw-8].forEach(x=>{pDisk(p,L.rx+x+3,L.ry+12,2,(xx,yy)=>p('#3a3646',xx,yy))});
 // guantera y puerta del copiloto
 p('#14121a',Math.round(W*.72),dt+Math.round(L.dashH*.35),Math.round(W*.25),1);p('#2a2533',Math.round(W*.72),dt+Math.round(L.dashH*.35)+1,Math.round(W*.25),1);
 // retrovisor
 p('#0a090d',L.mx-L.mw/2-1,L.my,L.mw+2,11);p('#1a2030',L.mx-L.mw/2+1,L.my+2,L.mw-2,7);p('#28324a',L.mx-L.mw/2+2,L.my+2,L.mw/3,1);p('#0a090d',L.mx-1,0,3,L.my);
 return c}
const PWH={};
function proWheel(L,ang){const q=Math.round(ang*20)/20,k=L.wR+'|'+q;if(PWH[k])return PWH[k];const R=L.wR,S=R*2+8,c=mk(S,S),g=c.getContext('2d'),p=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w||1,h||1)},cx=S/2,cy=S/2,t=Math.max(4,Math.round(R/9));
 const sk=(CH.player&&CH.player.skin)||'#d9a066',sh=(CH.player&&CH.player.shirt)||'#3f7fd1';
 for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const d=Math.sqrt(x*x+y*y);if(d<=R&&d>=R-t){const a=Math.atan2(y,x)-q;const top=Math.sin(a)<-.6;p(d>R-1.2?'#07060a':top?'#3e384c':(d<R-t+1.2?'#0b0a0f':'#221e2a'),cx+x,cy+y)}}
 for(const sa of[Math.PI,0,Math.PI/2]){const a=sa+q;for(let rr=6;rr<R-t;rr++){const x=Math.round(cx+Math.cos(a)*rr),y=Math.round(cy+Math.sin(a)*rr);p('#121017',x-2,y-2,4,4);p('#221f2a',x-2,y-2,4,1)}}
 pDisk(p,cx,cy,Math.round(R*.28),(x,y,dx,dy)=>p(dx+dy<-3?'#2a2633':'#141218',x,y));
 for(const ha of[-2.45,-.7]){const a=ha+q,hx=Math.round(cx+Math.cos(a)*(R-t/2)),hy=Math.round(cy+Math.sin(a)*(R-t/2));
  pDisk(p,hx,hy,Math.max(4,Math.round(R/9)),(x,y,dx,dy)=>p(dx+dy<-1?shade(sk,.1):sk,x,y));p(shade(sk,-.25),hx-2,hy+2,5,1);
  const ex=hx+(ha<-1.5?-1:1)*R*.95,ey=S;pLine(g,hx,hy+3,ex,ey,sh,Math.max(5,Math.round(R/7)));pLine(g,hx+(ha<-1.5?2:-2),hy+3,ex+(ha<-1.5?2:-2),ey,shade(sh,-.25),2)}
 return PWH[k]=c}

// ---------- audio propio del prólogo ----------
function proAudio(){const a=ac();if(!a)return null;const out=a.createGain();out.gain.value=OPT.sound?.9:0;out.connect(a.destination);
 const nz=()=>{const s=a.createBufferSource();s.buffer=mNoise();s.loop=true;s.start();return s},f=(type,fr,q)=>{const x=a.createBiquadFilter();x.type=type;x.frequency.value=fr;if(q)x.Q.value=q;return x},gn=v=>{const g=a.createGain();g.gain.value=v;return g};
 const A={a,out,nodes:[]};const o1=a.createOscillator(),o2=a.createOscillator();o1.type='sawtooth';o2.type='square';o1.frequency.value=38;o2.frequency.value=38.6;A.ef=f('lowpass',300,1.2);A.eg=gn(0);o1.connect(A.ef);o2.connect(A.ef);A.ef.connect(A.eg);A.eg.connect(out);o1.start();o2.start();A.o1=o1;A.o2=o2;
 const rn=nz();A.rg=gn(0);rn.connect(f('highpass',1600)).connect(A.rg);A.rg.connect(out);
 const sn=nz();A.sg=gn(0);sn.connect(f('bandpass',2300,.8)).connect(A.sg);A.sg.connect(out);
 const wn=nz();A.wf=f('lowpass',420);A.wg=gn(0);wn.connect(A.wf).connect(A.wg);A.wg.connect(out);
 const d1=a.createOscillator(),d2=a.createOscillator();d1.type='sine';d2.type='triangle';d1.frequency.value=55;d2.frequency.value=58.2;A.dg=gn(0);d1.connect(A.dg);d2.connect(A.dg);A.dg.connect(out);d1.start();d2.start();A.d2=d2;
 A.nodes=[o1,o2,rn,sn,wn,d1,d2];return A}
function proSet(param,v,tc){if(!PRO||!PRO.A)return;param.setTargetAtTime(v,PRO.A.a.currentTime,tc||.15)}
function proSfx(k,v){const A=PRO&&PRO.A;if(!A)return;const a=A.a,t=a.currentTime,o=(type,f0,f1,d,vol,delay)=>{const x=a.createOscillator(),g=a.createGain();x.type=type;x.frequency.setValueAtTime(f0,t+(delay||0));if(f1)x.frequency.exponentialRampToValueAtTime(f1,t+(delay||0)+d);g.gain.setValueAtTime(vol,t+(delay||0));g.gain.exponentialRampToValueAtTime(.0001,t+(delay||0)+d);x.connect(g);g.connect(A.out);x.start(t+(delay||0));x.stop(t+(delay||0)+d+.05)},
 n=(type,fr,d,vol,q,delay)=>{const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=mNoise();fl.type=type;fl.frequency.value=fr;if(q)fl.Q.value=q;g.gain.setValueAtTime(vol,t+(delay||0));g.gain.exponentialRampToValueAtTime(.0001,t+(delay||0)+d);s.connect(fl);fl.connect(g);g.connect(A.out);s.start(t+(delay||0),Math.random());s.stop(t+(delay||0)+d+.05)};
 v=v||1;
 if(k==='tick'){n('bandpass',900,.06,.05*v,3);o('sine',1400,900,.08,.012*v)}
 else if(k==='crash'){n('lowpass',900,.5,.5*v);o('sine',90,40,.4,.35*v);n('highpass',3000,.25,.15*v)}
 else if(k==='golpe'){n('lowpass',600,.25,.3*v);o('square',120,60,.15,.08*v)}
 else if(k==='screech'){n('bandpass',3200,1.4,.22,6);o('sawtooth',2600,2200,1.3,.035)}
 else if(k==='horn'){o('square',311,0,.7,.05);o('square',392,0,.7,.04)}
 else if(k==='coin'){o('square',1318,0,.07,.04);o('square',1760,0,.12,.04,.07)}
 else if(k==='clack'){n('bandpass',1500,.08,.2,4);o('square',200,120,.1,.05)}
 else if(k==='thunder'){n('lowpass',160,3.2,.5);n('lowpass',420,1.2,.25)}
 else if(k==='squawk'){o('sawtooth',900,1500,.12,.05);o('sawtooth',1300,700,.18,.04,.1)}
 else if(k==='ladrido'){o('square',300,200,.09,.06);o('square',320,210,.1,.06,.16)}
 else if(k==='latido'){o('sine',62,40,.18,.4);o('sine',58,38,.2,.3,.22)}
 else if(k==='clap'){n('bandpass',1800,.12,.4,1.2)}
 else if(k==='rumble'){n('lowpass',220,.25,.18)}
 else if(k==='tos'){n('lowpass',320,.22,.4);o('sawtooth',62,28,.22,.09);n('lowpass',260,.18,.3,0,.12)}
 else if(k==='crank'){o('sawtooth',52,78,.55,.07);o('square',104,150,.55,.02);n('bandpass',900,.55,.1,2)}
 else if(k==='raspa'){n('bandpass',2600,.55*v,.26,9);n('bandpass',4100,.45*v,.14,12,.08);o('sawtooth',1900,2300,.4*v,.012)}
 else if(k==='vidrio'){n('highpass',3600,.2,.4*v);o('sine',2900,1700,.3,.06*v);o('sine',4100,2600,.2,.03*v,.05)}
 else if(k==='shatter'){n('highpass',2400,1.3,.7);n('lowpass',520,.6,.6);for(let i=0;i<10;i++)o('sine',2500+Math.random()*3500,0,.15+Math.random()*.3,.035,Math.random()*.9)}
 else if(k==='grito'){o('sawtooth',560,1350,1.1,.08);o('square',590,1300,1.1,.035);n('bandpass',1600,1.1,.2,2.5);o('sawtooth',300,180,1.2,.05,.3)}
 else if(k==='ruge'){o('sawtooth',36,120,1.4,.12);o('square',72,180,1.4,.04);n('lowpass',700,1.2,.25)}
 else if(k==='boom'){o('sine',58,22,1.4*v,.7);o('sine',90,30,.6,.35*v);n('lowpass',140,1.1,.6*v)}
 else if(k==='paso'){n('bandpass',650,.07,.38*v,1.4);n('lowpass',260,.06,.3*v);n('highpass',3000,.04,.08*v,0,.02)}
 else if(k==='respira'){n('bandpass',780*v,.45,.1*v,2.2);n('bandpass',1250,.35,.05*v,3,.08)}
 else if(k==='zumbido'){o('sine',220,110,1.8,.05);o('sine',233,116,1.8,.05)}}

// ---------- arranque ----------
function askYes(title,msg,yes,yesTxt){openPanel(title,'<p style="margin:0 0 12px">'+esc(msg)+'</p><div class="row"><button id="aqY" class="red">'+esc(yesTxt||'Sí')+'</button><button id="aqN" class="alt">Cancelar</button></div>',mode==='menu'?'menu':undefined);
 $('#aqY').onclick=()=>{closePanel();yes()};$('#aqN').onclick=()=>closePanel()}
function proStart(v,done){try{proStart0(v,done)}catch(err){console.error(err);try{if(PRO){cancelAnimationFrame(PRO.raf);PRO=null}}catch(e){}$('#pro').classList.add('hidden');$('#pcap').classList.add('hidden');mode='menu';done&&done()}}
function proStart0(v,done){proSprites();const fromMode=mode;mode='prologo';ac();
 ['#menu','#hud','#touch','#panel','#prompt'].forEach(s=>{const e=$(s);if(e)e.classList.add('hidden')});
 const el=$('#pro');el.classList.remove('hidden','pwhite');$('#pfade').style.opacity=0;
 PRO={v,done,fromMode,t:0,state:'intro',pos:v?PRO_RARO-150:0,spd:0,x:2.1,steer:0,st:0,brake:0,gear:0,temp:0,hot:0,fail:v>0&&v<4,moto:v>0,
  sky:0,shake:0,flash:0,white:0,pitch:0,ds:1,dsT:1,ap:null,cap:null,capQ:[],timers:[],parts:[],drops:[],rain:v?0:1,wip:0,wipA:0,wipDir:1,wipP:1.7,
  mus:null,said:{},near:0,face:-1,hint:'',hintT:0,hit:0,mirror:0,lightT:5,fin:0,ptr:new Map()};
 PRO.T=proTrack(v);PRO.bridge=PRO_BR;PRO.T.ev=proEvents(v);PRO.T.ev.sort((a,b)=>a.z-b.z);PRO.evI=0;
 // la carretera arranca: solo los eventos y carros que vienen después de la posición inicial
 PRO.T.ev=PRO.T.ev.filter(e=>e.z>=PRO.pos);PRO.T.cars=PRO.T.cars.filter(c=>c.z>PRO.pos+40||c.v<0&&c.z>PRO.pos);
 proResize();PRO.A=proAudio();
 $('#pbtns').classList.remove('hidden');$('#pKey').classList.add('hidden');$('#pBrake').classList.toggle('hidden',PRO.fail);$('#pBrake').classList.remove('dead');$('#pGear').classList.toggle('hidden',!PRO.fail);$('#pchoice').classList.add('hidden');$('#pcap').classList.add('hidden');
 let seen=0;try{seen=localStorage.getItem(PRO_SEEN)}catch(e){}$('#pSkip').classList.toggle('hidden',!(v||seen));
 let last=performance.now();const step=now=>{if(!PRO||PRO.fin)return;const dt=Math.min(.05,(now-last)/1000);last=now;try{proTick(dt);if(PRO&&!PRO.fin)proDraw()}catch(err){console.error(err)}if(PRO&&!PRO.fin)PRO.raf=requestAnimationFrame(step)};PRO.raf=requestAnimationFrame(step)}
function proResize(){if(!PRO)return;const[W0,H0]=vSize(),W=W0,H=Math.round(H0*(H0>W0?1:1));const c=$('#pcan');c.width=W;c.height=H;PRO.W=W;PRO.H=H;PRO.L=proLayout(W,H,PRO.moto);PRO.cab=proCabin(PRO.L);
 PRO.F=Math.min(H*.95,W*1.5);PRO.ROWX=new Float32Array(H+2);PRO.ROWZ=new Float32Array(H+2);
 const ms=[];let s=7;for(let i=0;i<640;i++){s=s*16807%2147483647;ms.push(s/2147483647)}PRO.mt=ms}
addEventListener('resize',()=>{if(PRO)proResize()});
function proEnd(){if(!PRO)return;const P=PRO;$('#pcap').classList.remove('gl');P.fin=1;cancelAnimationFrame(P.raf);
 if(P.A){try{P.A.out.gain.setTargetAtTime(0,P.A.a.currentTime,.08);setTimeout(()=>{P.A.nodes.forEach(n=>{try{n.stop()}catch(e){}});try{P.A.out.disconnect()}catch(e){}},500)}catch(e){}}
 if(!P.v)try{localStorage.setItem(PRO_SEEN,'1')}catch(e){}
 PRO=null;$('#pro').classList.add('hidden');$('#pcap').classList.add('hidden');mode=P.fromMode==='prologo'?'menu':P.fromMode;if(P.done)P.done()}
function proSkip(){if(!PRO)return;const d=PRO.done;PRO.done=null;proEnd();d&&d()}

// ---------- subtítulos, pistas y temporizadores ----------
function proSay(who,txt,dur){PRO.capQ.push({who,txt,dur:dur||Math.max(2.2,txt.length*.065)})}
function proAfter(s,fn){PRO.timers.push({t:PRO.t+s,fn})}
function proHint(t,d){PRO.hint=t;PRO.hintT=d||4;const h=$('#phint');h.textContent=t;h.classList.toggle('on',!!t);if(!t)PRO.hintT=0}
function proMus(m){PRO.mus=m}
function proYou(){return(N('player')||'Alex')}
function proShort(){return proYou().split(' ')[0]}

// ---------- los eventos del guion ----------
function proEvents(v){const E=[],at=(z,fn)=>E.push({z,fn});const P=()=>PRO;
 if(!v){
  at(0,()=>{proAfter(1.4,()=>{proSay('ARIANA · sin abrir los ojos','Mor… ¿ya casi?');proSay(proYou(),'Ya casi. Dormite.')});proAfter(6,()=>proHint(TOUCH?'Tocá la izquierda o la derecha de la pantalla para moverte':'Usá ← → para moverte · Espacio para frenar',6))});
  at(110,()=>{proSay('RADIO','…y para los que vienen manejando a esta hora, cuidadito con la neblina.',3.6);proSay('RADIO','Les dejo un bolerito para el camino.',2.4);proAfter(6,()=>proMus({id:'bolero',vol:.42,lp:1900}))});
  at(190,()=>{if(!P().said.pasar){P().said.pasar=1;proHint('Para pasar el tráiler, tirate al otro carril. Ojo con los que vienen de frente.',5)}});
  at(560,()=>proHint('Mantené «Frenar» para bajar la velocidad.',4));
  at(PRO_PEAJE-130,()=>{P().ap='peaje'});
  at(1060,()=>{P().pitchT=-.03});
  at(1380,()=>{proSay('ARIANA · dormida','…mor… no pare…',2.2)});
  at(PRO_PUENTE-60,()=>monaStall());
 }else{
  at(PRO_RARO-150,()=>{P().pitchT=-.05;proAfter(1,()=>{
   if(v===1){proSay('','Ya no vas en el carro. Vas en una moto vieja, roja. Ariana va atrás, abrazada a vos.',4.2);proSay('ARIANA · dormida','…no dejés que la vendan.',2.6)}
   else if(v===2){proSay('','Otra vez la moto. Otra vez la bajada. Entre el monte, dos brasas te siguen.',3.8)}
   else if(v===3){proSay('','La moto suena distinta. Como si alguien la hubiera cuidado mucho tiempo.',3.6)}
   else{proSay('','La bajada. La neblina. La moto. Pero esta vez algo se siente distinto.',3.6);proAfter(4,()=>proHint('Esta vez los frenos sí sirven. Mantené «Frenar».',5))}})});
  if(v<4)at(PRO_RARO-149,()=>proAfter(.1,()=>proHint('Sin frenos. Mantené «Bajar marcha» con cuidado: calienta el motor.',5)));
 }
 at(PRO_RARO,()=>proRaro());
 at(proBz(4600),()=>{if(!v)proHint('',0)});
 at(proBz(4720),()=>{const p=P();p.T.cars.push({z:p.pos+260,x:-2.1,v:-12,img:proSprites().bus,w:2.6,bus:1,self:.35})});
 at(proBz(5120),()=>{proSfx('squawk')});
 at(proBz(5590),()=>{const p=P();if(v===3){proSay('VOZ DE UN SEÑOR MAYOR','Esa moto es lo único que le voy a dejar al muchacho.',3.4);proSay('VOZ DE UN SEÑOR MAYOR','Cuídemela, ¿oyó?',2.4)}
  else if(v===4){proSay('CARLILLOS · a lo lejos','¡Frene, mopri! ¡Usted puede!',2.6)}
  else{p.radioTxt='FRENESE MAE';proSay(v?'VOZ EN EL VIENTO':'VOZ EN LA RADIO','…usted ya pasó por aquí.',2.4);proSay(v?'VOZ EN EL VIENTO':'VOZ EN LA RADIO','Usted sabe cómo termina.',2.4);proSay(v?'VOZ EN EL VIENTO':'VOZ EN LA RADIO','Frénese, mae. Frénese.',2.6)}});
 if(!v)at(proBz(5660),()=>{P().mirror=2.2;proSfx('zumbido')});
 return E}
function proFreno(){const p=PRO;p.fail=1;p.brake=0;proSfx('screech');p.warn=1;$('#pBrake').classList.add('dead');
 proSay('','El pedal del freno se va hasta el fondo.',2.4);proSay(proYou()+' · entre dientes','No, no, no, no…',1.8);proSay('ARIANA · dormida','…no dejés que la vendan.',2.6);proSay(proYou(),'¿Qué?',1.4);proSay('','Ella sigue dormida. Como si nada hubiera pasado.',2.6);
 proAfter(2.4,()=>{$('#pBrake').classList.add('hidden');$('#pGear').classList.remove('hidden');proHint('Mantené «Bajar marcha»: frena un poco, pero calienta el motor.',6)})}
function proRaro(){const p=PRO;p.raro=1;p.wipP=.85;proMus(p.v===4?{id:'noche',vol:.4,lp:2400}:{id:'noche',vol:.32,lp:800});proSet(p.A&&p.A.dg.gain,.05,1.5);p.radioTxt='3:33'}

// ---------- entrada ----------
function proKey(k){if(!PRO)return;if(k==='enter'||k==='k')monaCrank();if(k===' '&&!PRO.fail)PRO.brake=1;if(k==='shift'&&PRO.fail)PRO.gear=1;if(PRO.choice&&(k==='arrowleft'||k==='a'))proChoose(-1);if(PRO.choice&&(k==='arrowright'||k==='d'))proChoose(1);if(k==='escape'&&!$('#pSkip').classList.contains('hidden'))proSkip()}
addEventListener('keyup',e=>{if(!PRO)return;const k=e.key.toLowerCase();if(k===' ')PRO.brake=0;if(k==='shift')PRO.gear=0});
function proPtr(){const c=$('#pcan');const upd=()=>{if(!PRO)return;let s=0;PRO.ptr.forEach(v=>s+=v);PRO.st=Math.max(-1,Math.min(1,s))};
 c.addEventListener('pointerdown',e=>{if(!PRO)return;e.preventDefault();const r=c.getBoundingClientRect();PRO.ptr.set(e.pointerId,e.clientX<r.left+r.width/2?-1:1);upd();if(PRO.choice)proChoose(e.clientX<r.left+r.width/2?-1:1)});
 c.addEventListener('pointermove',e=>{if(!PRO||!PRO.ptr.has(e.pointerId))return;const r=c.getBoundingClientRect();PRO.ptr.set(e.pointerId,e.clientX<r.left+r.width/2?-1:1);upd()});
 const off=e=>{if(!PRO)return;PRO.ptr.delete(e.pointerId);upd()};['pointerup','pointercancel','pointerleave'].forEach(t=>c.addEventListener(t,off));
 const hold=(id,key)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(PRO)PRO[key]=1});['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,()=>{if(PRO)PRO[key]=0}))};
 hold('#pBrake','brake');hold('#pGear','gear');$('#pKey').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();monaCrank()});
 $('#pL').addEventListener('click',()=>proChoose(-1));$('#pR').addEventListener('click',()=>proChoose(1));$('#pSkip').addEventListener('click',()=>proSkip())}
function proChoose(s){const p=PRO;if(!p||!p.choice)return;p.choice=0;p.side=s;$('#pchoice').classList.add('hidden');proSfx('tick',2);p.endT=p.t}

// ---------- lógica ----------
function proTick(dtR){const p=PRO;p.t+=dtR;p.ds+=(p.dsT-p.ds)*Math.min(1,dtR*4);const dt=dtR*p.ds;
 for(let i=p.timers.length-1;i>=0;i--)if(p.t>=p.timers[i].t){const f=p.timers[i].fn;p.timers.splice(i,1);f();if(PRO!==p)return}
 // subtítulos
 if(p.cap){p.cap.t+=dtR;const n=Math.min(p.cap.txt.length,Math.floor(p.cap.t*38));$('#ptxt').textContent=p.cap.txt.slice(0,n);if(p.cap.t>p.cap.dur){p.cap=null;if(!p.capQ.length)$('#pcap').classList.add('hidden')}}
 if(!p.cap&&p.capQ.length){p.cap=p.capQ.shift();p.cap.t=0;$('#pwho').textContent=p.cap.who;$('#pwho').classList.toggle('hidden',!p.cap.who);$('#pcap').classList.remove('hidden');$('#pcap').classList.toggle('narr',!p.cap.who)}
 if(p.hintT>0){p.hintT-=dtR;if(p.hintT<=0)$('#phint').classList.remove('on')}
 if(p.state==='intro'){if(p.t>4.6){p.state='drive';p.t0=p.t}proAud(dtR);return}
 // eventos por distancia
 while(p.T.ev.length&&p.pos>=p.T.ev[0].z){const e=p.T.ev.shift();e.fn();if(PRO!==p)return}
 const P=proSprites(),k=proCurve(p.pos+3);
 // velocidad
 let tgt=p.v?30:26;if(p.pos>PRO_PEAJE+100)tgt=p.fail?46:32;if(p.raro)tgt=p.v===4?30:38;
 let acc=p.spd<tgt?(p.fail?3.2:4.2):-2;
 if(p.brake&&!p.fail)acc=-11;
 if(p.fail){p.hot=Math.max(0,p.hot-dt);if(p.gear&&!p.hot){acc=Math.min(acc,-4.5);p.temp+=dt*.3}else p.temp=Math.max(0,p.temp-dt*.14);if(p.temp>=1){p.temp=.85;p.hot=3.2;proSfx('golpe',.5);proHint('¡El motor se recalentó! Esperá un toque.',2.5)}}
 if(p.ap==='peaje'){const d=PRO_PEAJE-7-p.pos;if(d<=.3){p.spd=0;p.ap='stop';proPeaje()}else{tgt=Math.min(tgt,Math.sqrt(2*5*Math.max(0,d)));acc=p.spd>tgt?-9:2;p.x+=(1.55-p.x)*Math.min(1,dt*1.5)}}
 if(p.ap==='stall'){acc=-6;p.x+=(1.6-p.x)*Math.min(1,dt*1.2);if(p.spd<.5){p.spd=0;monaStop()}}
 if(p.ap==='stop'||p.ap==='wait')acc=0,p.spd=0;
 if(p.ap==='go'){acc=3.5}
 if(p.ending)proEndTick(dt,dtR);
 if(p.mona)monaTick(dtR);
 p.spd=Math.max(0,p.spd+acc*dt);
 // dirección
 const ctl=!p.ap||p.ap==='go';p.steer+=((ctl?p.st:0)+(ctl?((KEYS.arrowright||KEYS.d?1:0)-(KEYS.arrowleft||KEYS.a?1:0)):0)-p.steer)*Math.min(1,dt*7);p.steer=Math.max(-1,Math.min(1,p.steer));
 if(Math.abs(p.steer)>.3&&!p.said.steer){p.said.steer=1;if(p.hint.startsWith('Toc')||p.hint.startsWith('Us'))p.hintT=Math.min(p.hintT,.6)}
 if(ctl&&!p.sideLock)p.x+=p.steer*(2+p.spd*.13)*dt-k*p.spd*p.spd*.42*dt;
 if(p.sideLock)p.x+=(p.sideLock-p.x)*Math.min(1,dt*1.2);
 const off=Math.abs(p.x)>PRO_RW+.5;if(off&&!p.ap){p.spd=Math.max(8,p.spd-7*dt);p.shake=Math.max(p.shake,.18);if(Math.random()<dt*8)proSfx('rumble')}p.x=Math.max(-7,Math.min(7,p.x));
 p.pos+=p.spd*dt;p.sky-=k*p.spd*dt*260;p.pitch+=((p.pitchT||0)+(p.raro?Math.sin(p.t*.7)*.012:0)-p.pitch)*Math.min(1,dt*1.5);
 // tráfico y obstáculos
 for(const c of p.T.cars){c.z+=c.v*dt;const rel=c.z-p.pos;if(c.hit>0)c.hit-=dt;
  if(!c.hit&&rel>.3&&rel<3.9&&Math.abs(c.x-p.x)<c.w/2+.85){c.hit=1.2;proSfx('crash',c.v<0?1:.6);p.shake=c.v<0?.8:.5;p.flash=.15;
   if(c.v>0){p.pos=c.z-4;p.spd=Math.min(p.spd,c.v*.7);if(c.tr)proSfx('horn')}else{p.spd*=.35;p.x+=p.x>c.x?1.8:-1.8;c.x-=p.x>c.x?.6:-.6}
   proMurmur()}
  if(!c.passed&&rel<0&&c.v>0){c.passed=1;if(Math.abs(c.x-p.x)<2.3&&p.spd>c.v+6)proMurmur(1)}}
 p.T.cars=p.T.cars.filter(c=>c.z>p.pos-30&&c.z<p.pos+900);
 for(const o of p.T.objs){if(o.z<p.pos-5)continue;if(o.z>p.pos+260)break;
  if(o.ani){o.x+=o.vx*dt;if(Math.abs(o.x)>9)o.vx*=-1;o.fr=(o.fr||0)+dt*6}
  if(o.obst&&!o.hit){const rel=o.z-p.pos,w=o.ani?.6:o.img.mw/2+.6;if(rel>.2&&rel<2.6&&Math.abs(o.x-p.x)<w){o.hit=1;p.spd*=.74;p.shake=.4;p.flash=.08;
   if(o.ani==='gallo'){proSfx('squawk');for(let i=0;i<14;i++)p.parts.push({x:p.W/2+(Math.random()-.5)*30,y:p.L.dashTop-30,vx:(Math.random()-.5)*120,vy:-40-Math.random()*90,life:1.2,col:Math.random()<.5?'#c8582a':'#1d2a5a',s:2})}
   else if(o.ani==='perro'){proSfx('ladrido');o.vx*=3}else proSfx('golpe');proMurmur()}}}
 // luces de tormenta (en la bajada)
 if(p.pos>PRO_PEAJE+150&&!p.raro&&!p.v&&!p.mona){p.lightT-=dt;if(p.lightT<=0){p.lightT=7+Math.random()*7;p.flash=.35;p.bolt=.25;proAfter(.6+Math.random()*.6,()=>proSfx('thunder'))}}
 if(p.bolt>0)p.bolt-=dtR;
 // final
 const zr=p.T.tapia.z-p.pos;
 if(!p.ending&&zr<110)proEndStart();
 // parabrisas
 p.wip+=dtR/p.wipP*(p.freezeW?0:1);const wa=.5-.5*Math.cos(p.wip*Math.PI*2),prevA=p.wipA;p.wipA=wa;
 const dir=Math.sign(wa-prevA);if(dir&&dir!==p.wipDir){p.wipDir=dir;if(!p.moto)proSfx('tick')}
 if(!p.moto){const rate=p.rain*(p.raro?16:26);if(Math.random()<rate*dtR)for(let i=0;i<2;i++)if(p.drops.length<160)p.drops.push({x:Math.random()*p.W,y:p.L.roof+Math.random()*(p.L.dashTop-p.L.roof),s:Math.random()<.25?2:1,vy:0,l:0});
  const a0=.07*Math.PI+prevA*.82*Math.PI,a1=.07*Math.PI+wa*.82*Math.PI,lo=Math.min(a0,a1)-.04,hi=Math.max(a0,a1)+.04;
  p.drops=p.drops.filter(d=>{d.l+=dtR;if(d.s===2&&d.l>1.2)d.vy+=dtR*6;d.y+=d.vy*dtR;if(d.y>p.L.dashTop)return false;
   for(const[px,py]of p.L.wp){const dx=d.x-px,dy=py-d.y,dist=Math.hypot(dx,dy),an=Math.atan2(dy,dx);if(dist<p.L.wl&&an>=lo&&an<=hi)return false}return true})}
 for(const q of p.parts){q.x+=q.vx*dtR;q.y+=q.vy*dtR;q.vy+=q.g!==undefined?q.g*dtR:160*dtR;q.life-=dtR}p.parts=p.parts.filter(q=>q.life>0);
 if(p.hot>0&&Math.random()<dtR*14)p.parts.push({x:p.W/2+(Math.random()-.5)*p.W*.4,y:p.L.dashTop-2,vx:(Math.random()-.5)*20,vy:-30-Math.random()*20,g:-10,life:1.4,col:'#b0aab8',s:3+Math.random()*3|0,smoke:1});
 p.shake=Math.max(0,p.shake-dtR*1.6);p.flash=Math.max(0,p.flash-dtR*1.8);if(p.mirror>0)p.mirror-=dtR;
 proAud(dtR)}
function proMurmur(near){const p=PRO;if(p.t-(p.mT||-9)<7)return;p.mT=p.t;const L=near?['Despacio…','Mmm… despacio, mor…']:['¿Qué fue eso…?','Mmm…','…despacio…'];proSay('ARIANA · dormida',L[(Math.random()*L.length)|0],1.8)}
function proAud(dt){const p=PRO,A=p.A;if(!A)return;const s=p.spd,end=p.silence;
 proSet(A.o1.frequency,30+s*2.3+(p.gear&&p.fail?22:0));proSet(A.o2.frequency,30.6+s*2.31+(p.gear&&p.fail?22:0));proSet(A.ef.frequency,220+s*14);proSet(A.eg.gain,end||p.engineOff?0:p.ap==='stall'?(Math.random()<.45?.015:.1):p.state==='intro'?0:.05+s*.0018);
 proSet(A.rg.gain,end?0:p.moto?.012:p.rain*.035);proSet(A.wg.gain,end?0:.02+s*.0016);proSet(A.wf.frequency,300+s*18);
 proSet(A.sg.gain,end?0:p.state==='intro'?.03:p.raro?.02+(p.radioTxt==='FRENESE MAE'?.03:0):(p.pos<300&&!p.v?.012:0));
 if(p.raro)proSet(A.d2.frequency,58.2+Math.sin(p.t*.6)*2.4,.5)}
// ---------- peaje: Don Chepe ----------
function proPeaje(){const p=PRO;p.ap='wait';proMus(null);proAfter(.6,()=>{proSfx('coin');proSay('DON CHEPE · recibe las monedas sin verlas','Gracias.',1.6)});
 proAfter(2.6,()=>{proSay('DON CHEPE · se inclina hacia la ventana','Bienvenido al barrio, mae.',2.6)});
 proAfter(5.4,()=>{proSay(proYou(),'¿Al qué?',1.5)});
 proAfter(7,()=>{proSay('DON CHEPE · sin sonreír','Y oiga… no pare en el Puente de la Vieja. Pase de largo, pase lo que pase.',3.6)});
 proAfter(11,()=>{proSfx('clack');p.T.caseta.img=proSprites().casetaUp});
 proAfter(11.7,()=>{p.T.chepe.gone=1;p.T.caseta.img=proSprites().casetaOff;p.T.cin.gone=1;proSfx('zumbido');p.flash=.12});
 proAfter(12.7,()=>{p.ap='go';proAfter(2.2,()=>{p.ap=null})})}
// ---------- el final contra la tapia ----------
function proEndStart(){const p=PRO;p.ending=1;p.endT0=p.t;proHint('',0);
 if(p.v===4){p.fail=0;if(p.T.kev2)p.T.kev2.x=p.x;$('#pGear').classList.add('hidden');$('#pBrake').classList.remove('hidden','dead');proHint('¡Frená!',3);return}
 p.dsT=.28;p.choice=1;$('#pchoice').classList.remove('hidden');$('#pbtns').classList.add('hidden');proSfx('latido');
 proAfter(2.8,()=>{if(p.choice)proChoose(Math.random()<.5?-1:1)})}
function proEndTick(dt,dtR){const p=PRO,zr=p.T.tapia.z-p.pos;
 if(p.v===4){if(zr<65&&!p.brake)p.spd=Math.max(0,p.spd-12*dt);if(p.brake)p.spd=Math.max(0,p.spd-10*dt);if(zr<26)p.spd=Math.max(0,Math.min(p.spd,(zr-17)*2));
  if(p.spd<.4&&!p.stopped){p.stopped=1;p.ap='stop';proHint('',0);$('#pbtns').classList.add('hidden');proMus({id:'noche',vol:.25,lp:3500});proSet(p.A&&p.A.dg.gain,0,1);
   proAfter(.8,()=>{proSay('CARLILLOS','¡Diay, mopri! ¿Ve que sí se podía frenar?',2.8);proSay('CARLILLOS','Ahí nos vemos en el barrio.',2.2)});
   proAfter(6.4,()=>{proSfx('clap');p.flash=.3});proAfter(7.4,()=>{p.white=.01;p.whiteRate=.7});proAfter(9.4,()=>proEnd())}
  return}
 if(p.side&&!p.sideLock){p.sideLock=p.side*3.2}
 if(p.side&&!p.endB&&p.t-p.endT>1){p.endB=1;p.silence=1;proMus(null);p.freezeW=0;p.wipP=2.4;p.dsT=.06;proSfx('latido');proAfter(1.1,()=>proSfx('latido'))}
 if(p.endB){p.spd=0;const tg=p.T.tapia.z-7;p.pos+=(tg-p.pos)*Math.min(1,dtR*.5)}
 if(p.endB&&p.face<0&&p.t-p.endT>1.6){p.face=0;p.faceT=p.t}
 if(p.face>=0){const ft=p.t-p.faceT;p.face=ft<1.1?0:ft<1.7?1:2;
  if(ft>1.9&&!p.said.desp){p.said.desp=1;proSay('ARIANA',proShort()+'. Despertate.',2.2)}
  if(ft>4.3&&!p.crashed){p.crashed=1;p.capQ=[];p.cap=null;$('#pcap').classList.add('hidden');proSfx('crash',1.4);p.white=1;p.whiteRate=0;p.shake=1;proAfter(1.8,()=>proEnd())}}}

// ---------- dibujo ----------
function proDraw(){const p=PRO,c=$('#pcan'),g=c.getContext('2d'),W=p.W,H=p.H,L=p.L;g.imageSmoothingEnabled=false;
 if(p.state==='intro'){g.fillStyle='#000';g.fillRect(0,0,W,H);const t=p.t,txt=p.v?'3:33 A. M.':'RUTA 27 - 2:51 A. M.';const n=Math.max(0,Math.min(txt.length,Math.floor((t-.8)*9)));
  if(n){const tc=mk(txt.length*4+2,8);cText(tc.getContext('2d'),txt.slice(0,n),1,1,5,'#e9e3cf','left');const s=W>260?3:2;g.globalAlpha=t>3.8?Math.max(0,1-(t-3.8)/.8):1;g.drawImage(tc,Math.round(W/2-txt.length*2*s),Math.round(H/2-4*s),tc.width*s,tc.height*s);g.globalAlpha=1}
  if(Math.floor(t*1.6)%2===0&&t>.3)proPx(g,'#3a3646',W/2+txt.length*2*(W>260?3:2)+4,H/2-8,3,12);return}
 const sx=p.shake?(Math.random()-.5)*p.shake*6|0:0,sy=p.shake?(Math.random()-.5)*p.shake*4|0:0;g.save();g.translate(sx,sy);
 const raro=p.raro?Math.min(1,(p.pos-PRO_RARO)/180):0;
 const hor=Math.round(H*(L.moto?.42:.38)+p.pitch*H+(L.moto?p.steer*0:0));
 const fogc=pLerpHex(p.v===4&&p.stopped?'#2a2440':'#161c34',p.v===4?'#30305a':'#3a1f4c',raro),amb=p.bolt>0?6:Math.round(1+raro*1.3),fogFar=p.v?(115-raro*15):(p.pos<PRO_PEAJE+100?170:135)-raro*40;
 // cielo
 for(let y=0;y<=hor;y++){const u=y/hor;g.fillStyle=pLerpHex(pLerpHex('#02030a','#0a0414',raro),fogc,Math.pow(u,2.2));g.fillRect(0,y,W,1)}
 if(p.bolt>0){g.fillStyle='rgba(200,210,255,'+(p.bolt*1.6)+')';g.fillRect(0,0,W,hor)}
 // montañas en dos capas con luces de pueblitos
 for(let layer=0;layer<2;layer++){const off=p.sky*(layer?.6:.3),amp=layer?H*.05:H*.08,base=hor-(layer?2:6),col=pLerpHex(layer?'#0a0d1a':'#04060c',fogc,layer?.35:.08);g.fillStyle=col;
  for(let x=0;x<W;x+=2){const i=Math.floor((x+off)/6)&511,j=(i+1)&511,u=((x+off)/6)%1,h=(p.mt[i+layer*7]*(1-u)+p.mt[j+layer*7]*u)*amp+(layer?0:Math.sin((x+off)*.01)*amp*.6);g.fillRect(x,Math.round(base-h),2,Math.round(h)+3)}
  if(layer===0&&!raro){for(let i=0;i<46;i++){const x=Math.floor((p.mt[i*5]*W*3-off)%(W))+(W)*(p.mt[i*5]*W*3-off<0?1:0);const y=hor-2-Math.round(p.mt[i*5+1]*H*.05);g.fillStyle=p.mt[i*5+2]<.7?'#e8c870':'#f4f2e8';if(Math.sin(p.t*3+i)>-.7)g.fillRect((x+W)%W,y,1,1)}}}
 // carretera por líneas
 const F=p.F,yTop=hor+1,y0=L.moto?H-1:Math.min(H-1,L.dashTop+3);let dx=0,ddx=0,pz=PRO_CAMH*F/(y0+1-hor);
 for(let y=y0;y>hor;y--){const z=PRO_CAMH*F/(y-hor),dz=z-pz;pz=z;const zw=p.pos+z,kk=proCurve(zw);ddx+=kk*dz;dx+=ddx*dz;p.ROWX[y]=dx;p.ROWZ[y]=z;
  const sc=F/z,cx=W/2+(dx-p.x)*sc,hl=Math.max(0,1.3-z/(p.moto?30:40))*(p.hlK==null?1:p.hlK),lit=Math.min(8,Math.round(amb+hl*7)),fg=Math.min(10,Math.max(0,Math.round((z-14)/(fogFar-14)*10)));
  const br=Math.max(0,Math.min(1,(zw-PRO_RARO)/220)),alt=Math.floor(zw/7)%2,alt2=Math.floor(zw/3.2)%2;
  const grass=br>.5?(alt2?'#6a655e':'#5e5952'):(alt?'#2b5226':'#24481f'),road=br>.5?(alt?'#3d3946':'#38343f'):(alt?'#45474f':'#41434b');
  let gcol=grass;if(p.bridge&&zw>p.bridge[0]-8&&zw<p.bridge[1]+8){const wv=Math.floor(zw*1.7+p.t*2)%5===0;gcol=wv?'#3a5f8c':(alt?'#16263e':'#112036')}
  g.fillStyle=pMix(gcol,lit,fg,fogc);g.fillRect(0,y,W,1);
  const rw=PRO_RW*sc,sh=(PRO_RW+1.1)*sc;g.fillStyle=pMix(br>.5?(alt2?'#c8b040':'#d8d0c0'):'#55575d',lit,fg,fogc);g.fillRect(Math.round(cx-sh),y,Math.round(sh*2),1);
  g.fillStyle=pMix(road,lit,fg,fogc);g.fillRect(Math.round(cx-rw),y,Math.round(rw*2),1);
  if(hl>.25){g.fillStyle=pMix(br>.5?'#4a4656':'#55585f',Math.min(8,lit+1),fg,fogc);g.fillRect(Math.round(cx-rw*.25+(-p.x*.0)),y,Math.round(rw*.5),1)}
  const lw=Math.max(1,Math.round(.14*sc));if(br<.85){g.fillStyle=pMix('#e8e8e0',lit,fg,fogc);g.fillRect(Math.round(cx-(PRO_RW-.35)*sc),y,lw,1);g.fillRect(Math.round(cx+(PRO_RW-.35)*sc-lw),y,lw,1)}
  if(Math.floor(zw/4.5)%2===0){g.fillStyle=pMix(br>.5?'#d8c8a0':'#f2c230',lit,fg,fogc);g.fillRect(Math.round(cx-lw/2),y,lw,1)}}
 p.rowTop=hor+1;p.rowBot=y0;
 // cosas en la carretera, de lejos a cerca
 const vis=[];const P=proSprites();
 for(const o of p.T.objs){const zr=o.z-p.pos;if(zr<1.4)continue;if(zr>fogFar*1.15)break;if(o.gone)continue;vis.push([zr,o,0])}
 for(const cc of p.T.cars){const zr=cc.z-p.pos;if(zr>1.4&&zr<fogFar*1.15)vis.push([zr,cc,1])}
 vis.sort((a,b)=>b[0]-a[0]);
 for(const[zr,o,isCar]of vis){let img=o.img;
  if(o.person){if(o.gone)continue;const ch=o.person==='chepe'?(PSP.chepeC||(PSP.chepeC=fillChar({id:'pro_chepe',name:'Don Chepe',hair:'corto',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#3f7fd1',pants:'#3b3b3b',acc:'lentes',accColor:'#222',v:1}))):CH.kevin;
   if(!ch)continue;const wave=o.wave||(o.person==='kevin'&&zr<45);const key='pp'+o.person+wave;img=PSP[key]||(PSP[key]=sprPersona(ch,wave))}
  if(o.ani){img=P[o.ani][Math.floor(o.fr||0)%2]}
  if(!img)continue;
  const sy=hor+PRO_CAMH*F/zr,iy=Math.round(sy);let rdx;if(iy<=p.rowBot&&iy>hor)rdx=p.ROWX[iy];else rdx=p.ROWX[p.rowBot];
  const sc=F/zr,cx=W/2+(rdx+o.x-p.x)*sc,dw=img.mw*sc,dh=dw*img.height/img.width;if(cx+dw<0||cx-dw>W)continue;
  const hl=Math.max(0,1.3-zr/(p.moto?30:40))*(p.hlK==null?1:p.hlK),lit=Math.min(1,amb/8+hl*.9+(o.self||0)),fg=Math.max(0,Math.min(1,(zr-14)/(fogFar-14)));
  let im=pDim(img,(1-lit)*.85,'#04050a');im=pDim(im,fg,fogc);
  const X=Math.round(cx-dw/2),Y=Math.round(sy-dh-(o.ho||0)*sc);g.drawImage(im,X,Y,Math.round(dw),Math.round(dh));
  if(img.lit){g.globalCompositeOperation='lighter';g.globalAlpha=Math.max(.15,1-fg*.8);g.drawImage(img.lit,X,Y,Math.round(dw),Math.round(dh));g.globalAlpha=1;g.globalCompositeOperation='source-over'}
  if(img.lights)for(const[lx,ly,lc]of img.lights){const gx=X+lx/img.width*dw,gy=Y+ly/img.height*dh,rr=Math.max(2,dw*(img.big?.22:.14));proGlow(g,gx,gy,rr,lc,(1-fg*.85)*(img.big?.9:.75));
   if(!p.moto||1){const len=Math.min(H-gy,rr*5);for(let i=0;i<len;i+=2){g.globalAlpha=(1-i/len)*.28*(1-fg);g.fillStyle=lc;g.fillRect(Math.round(gx-rr*.25),Math.round(sy+i),Math.max(1,Math.round(rr*.5)),2)}g.globalAlpha=1}}
  if(o.person==='kevin'&&zr<60&&Math.random()<.2)p.parts.push({x:cx+dw*.25,y:Y+dh*.2,vx:4,vy:-14,g:-4,life:1.4,col:'#8e889c',s:Math.max(1,Math.round(dw*.12)),smoke:1})}
 // lluvia que cae
 if(p.rain&&!p.moto||p.moto){g.fillStyle=p.raro?'rgba(190,150,220,.35)':'rgba(150,170,210,.38)';for(let i=0;i<(p.moto?40:60);i++){const x=((i*53.7+p.t*(i%3?70:110)*.6)%(W+40))-20,y=((i*97.3+p.t*(260+(i%5)*40))%(L.dashTop-hor+40))+hor-30;g.fillRect(Math.round(W-x),Math.round(y),1,3)}}
 // partículas (humo, plumas)
 for(const q of p.parts){g.globalAlpha=Math.min(1,q.life)*(q.smoke?.55:1);g.fillStyle=q.col;g.fillRect(Math.round(q.x),Math.round(q.y),q.s,q.s)}g.globalAlpha=1;
 if(p.moto)proDrawMoto(g);else proDrawCar(g);
 // flash, blanco y viñeta
 if(p.flash>0){g.fillStyle='rgba(255,255,255,'+Math.min(.8,p.flash)+')';g.fillRect(0,0,W,H)}
 if(raro){g.fillStyle='rgba(60,10,70,'+(.12*raro)+')';g.fillRect(0,0,W,H)}
 proVignette(g);
 if(p.face>=0)proDrawFace(g);
 g.restore();
 proPost(g);
 if(p.white){if(p.whiteRate)p.white=Math.min(1,p.white+p.whiteRate/60);g.fillStyle='rgba(255,255,255,'+p.white+')';g.fillRect(0,0,W,H)}}
function proPx(g,c,x,y,w,h){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)}
const PGLOW={};function proGlow(g,x,y,r,col,a){const k=col;let s=PGLOW[k];if(!s){s=mk(32,32);const gg=s.getContext('2d'),gr=gg.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,col);gr.addColorStop(.25,col+'aa');gr.addColorStop(1,col+'00');gg.fillStyle=gr;gg.fillRect(0,0,32,32);PGLOW[k]=s}
 g.globalCompositeOperation='lighter';g.globalAlpha=Math.max(0,Math.min(1,a));g.drawImage(s,Math.round(x-r*2),Math.round(y-r*2),Math.round(r*4),Math.round(r*4));g.globalAlpha=1;g.globalCompositeOperation='source-over'}
let PVIG=null;function proVignette(g){const{W,H}=PRO;if(!PVIG||PVIG.width!==W||PVIG.height!==H){PVIG=mk(W,H);const gg=PVIG.getContext('2d'),gr=gg.createRadialGradient(W/2,H*.45,Math.min(W,H)*.3,W/2,H*.45,Math.max(W,H)*.75);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.6)');gg.fillStyle=gr;gg.fillRect(0,0,W,H)}g.drawImage(PVIG,0,0)}
function proClock(){const p=PRO;if(p.v)return'3:33';const m=Math.min(42,Math.floor(p.pos/(PRO_RARO/42)));const mm=51+m,h=2+Math.floor(mm/60);return h+':'+String(mm%60).padStart(2,'0')}
function proDrawCar(g){return carDraw(g);const p=PRO,L=p.L,W=p.W,H=p.H;
 // gotas en el parabrisas
 for(const d of p.drops){g.fillStyle=p.raro?'#cdb6e6':'#c6d6ec';g.globalAlpha=.75;g.fillRect(Math.round(d.x),Math.round(d.y),d.s,d.s);g.globalAlpha=.6;g.fillStyle='#202638';g.fillRect(Math.round(d.x),Math.round(d.y)+d.s,d.s,1);if(d.vy>0){g.globalAlpha=.25;g.fillStyle='#c6d6ec';g.fillRect(Math.round(d.x),Math.round(d.y)-3,1,3)}}g.globalAlpha=1;
 // limpiaparabrisas
 const a=.07*Math.PI+p.wipA*.82*Math.PI;for(const[px,py]of L.wp){const tx=px+Math.cos(a)*L.wl,ty=py-Math.sin(a)*L.wl;pLine(g,px,py,tx,ty,'#07060a',2);pLine(g,px+Math.cos(a)*L.wl*.15,py-Math.sin(a)*L.wl*.15,tx,ty,'#15131b',1)}
 // reflejo del tablero en el vidrio
 g.globalAlpha=.06;g.fillStyle='#7fe0a8';g.fillRect(L.g1-L.gR,L.dashTop-24,L.gR*4+6,10);g.globalAlpha=1;
 // Ariana dormida
 const ari=p.ariAwake?(PSP.ariA||(PSP.ariA=sprAriSleep(1))):(PSP.ariS||(PSP.ariS=sprAriSleep())),br=Math.round(Math.sin(p.t*1.4)*.6+.4),as=p.H>p.W?1.75:1.25;
 const aw=Math.round(ari.width*as),ah=Math.round(ari.height*as),ax=p.H>p.W?W-Math.round(aw*.86):W-aw-Math.round(W*.045),ay=L.dashTop-Math.round(ah*.66)+br;
 g.drawImage(p.cab,0,0);g.save();g.beginPath();g.rect(0,0,W,L.dashTop-1);g.clip();g.drawImage(pDim(ari,p.raro?.4:.5,'#05060c'),ax,ay,aw,ah);
 g.globalAlpha=.16;g.fillStyle='#7fe0a8';g.fillRect(ax+Math.round(8*as),ay+Math.round(20*as),Math.round(10*as),Math.round(6*as));g.globalAlpha=1;g.restore();
 // retrovisor: a veces hay alguien atrás
 if(p.mirror>0&&Math.sin(p.t*30)>-.6){const mx=L.mx-L.mw/2+L.mw*.62,my=L.my+3;proPx(g,'#c8102e',mx-3,my,7,2);proPx(g,'#e8b88a',mx-2,my+2,5,3);proPx(g,'#1d1a24',mx-1,my+3,1,1);proPx(g,'#1d1a24',mx+1,my+3,1,1)}
 // pinito
 const sw=Math.sin(p.t*1.9)*.18-p.steer*.35+proCurve(p.pos)*40,pino=PSP.pino,px0=L.mx,py0=L.my+11;pLine(g,px0,py0,px0+Math.sin(sw)*6,py0+6,'#d9d3c4',1);
 for(let r=0;r<pino.height;r++){const off=Math.round(Math.sin(sw)*(6+r));g.drawImage(pDim(pino,.35,'#05060c'),0,r,pino.width,1,px0-5+off,py0+6+r,pino.width,1)}
 // relojes
 const kmh=p.spd*3.6,ang1=Math.PI*(.75+Math.min(1,kmh/180)*1.5),ang2=Math.PI*(.75+Math.min(1,.35+p.temp*.65)*1.5);
 pLine(g,L.g1,L.gY,L.g1+Math.cos(ang1)*(L.gR-3),L.gY+Math.sin(ang1)*(L.gR-3),'#ff6a3a',1);pLine(g,L.g2,L.gY,L.g2+Math.cos(ang2)*(L.gR-3),L.gY+Math.sin(ang2)*(L.gR-3),p.temp>.75?'#ff2a2a':'#ff6a3a',1);proPx(g,'#d0d0d0',L.g1,L.gY,1,1);proPx(g,'#d0d0d0',L.g2,L.gY,1,1);
 // testigo del freno
 if(p.warn&&Math.floor(p.t*3)%2===0){const wx=L.wx-3,wy=L.gY+L.gR-4;pDisk((c,x,y,w,h)=>proPx(g,c,x,y,w||1,h||1),wx+3,wy+2,3,(x,y)=>proPx(g,'#ff2a2a',x,y,1,1));proPx(g,'#1d0505',wx+3,wy,1,3);proPx(g,'#1d0505',wx+3,wy+4,1,1);proGlow(g,wx+3,wy+2,5,'#ff2a2a',.6)}
 // reloj LCD y radio
 const clk=p.raro&&Math.floor(p.t*2)%3===0?'3:33':proClock();const cw=clk.length*4+3;proPx(g,'#061008',L.wx-cw/2,L.gY+L.gR+2,cw,7);cText(g,clk,L.wx,L.gY+L.gR+3,5,p.raro?'#ff5aa0':'#5cff9a');
 let rt=p.pos<300&&!p.v?'AM 610':p.mus&&p.mus.id==='bolero'?'AM 610 ♪':'AM 610';if(p.raro)rt=p.radioTxt==='FRENESE MAE'?('FRENESE MAE   '.repeat(3)).substr(Math.floor(p.t*6)%14,Math.floor(p.L.rw/4)):(Math.random()<.3?'3:33':'- - -');
 rt=rt.replace('♪','');cText(g,rt,L.rx+L.rw/2,L.ry+2,5,p.raro?'#ff5aa0':'#5cff9a');
 // volante
 const wh=proWheel(L,p.steer*.55);g.drawImage(wh,L.wx-wh.width/2,L.wy-wh.height/2)}
function proDrawMoto(g){const p=PRO,L=p.L,W=p.W,H=p.H,lean=Math.round(p.steer*3);
 // brazos de Ariana alrededor de la cintura
 const ari=CH.ariana||{shirt:'#e85d75',skin:'#c68e5e'};
 g.save();g.translate(lean,0);g.drawImage(p.cab,0,0);
 for(const s of[-1,1]){const x0=s<0?0:W,len=W*.22;for(let i=0;i<len;i++){const x=Math.round(x0-s*i),y=Math.round(H-34+Math.pow(i/len,2)*8);proPx(g,shade(ari.shirt,-.2),x,y,1,10);proPx(g,ari.shirt,x,y,1,4);proPx(g,'#0b0910',x,y-1,1,1);proPx(g,'#0b0910',x,y+10,1,1)}const hx=Math.round(x0-s*len);proPx(g,'#0b0910',hx-(s>0?7:1),H-31,9,8);proPx(g,ari.skin,hx-(s>0?6:0),H-30,7,6);proPx(g,shade(ari.skin,-.25),hx-(s>0?6:0),H-25,7,1)}
 // espejo derecho: Ariana atrás
 const mr=PSP.ariM||(PSP.ariM=sprAriMirror()),mx=Math.round(W*.88),my=L.barY-54;g.drawImage(pDim(mr,.35,'#05060c'),mx-8,my-7);
 if(p.mirror>0)proPx(g,'#c8102e',mx-6,my-6,4,2);
 // velocímetro
 const kmh=p.spd*3.6,a=Math.PI*(.85+Math.min(1,kmh/160)*1.3);pLine(g,W/2,L.barY-6,W/2+Math.cos(a)*8,L.barY-6+Math.sin(a)*8,'#d6221e',1);
 cText(g,'3:33',W/2,L.barY-1,5,'#1d1a24');
 if(p.warn||p.fail)if(Math.floor(p.t*3)%2===0&&p.v<4){proPx(g,'#ff2a2a',W/2-2,L.barY-14,4,3);proGlow(g,W/2,L.barY-13,5,'#ff2a2a',.5)}
 if(p.temp>.75){proPx(g,'#ff8a2a',W/2+5,L.barY-14,3,3)}
 g.restore()}
function proDrawFace(g){const p=PRO,W=p.W,H=p.H,f=PSP['af'+p.face]||(PSP['af'+p.face]=sprAriFace(p.face)),ft=p.t-p.faceT,al=Math.min(1,ft/.9);
 g.fillStyle='rgba(4,3,8,'+(al*.82)+')';g.fillRect(0,0,W,H);const s=Math.max(2,Math.floor(Math.min(W*.62/f.width,H*.5/f.height))),dw=f.width*s,dh=f.height*s;
 g.globalAlpha=al;g.drawImage(pDim(f,.2,'#1a1030'),Math.round(W/2-dw/2),Math.round(H*.42-dh/2),dw,dh);g.globalAlpha=1;
 const fx=PSP.faceFx||(PSP.faceFx=(()=>{const c=mk(64,64),gg=c.getContext('2d'),gr=gg.createLinearGradient(0,64,0,0);gr.addColorStop(0,'rgba(127,224,168,.22)');gr.addColorStop(.5,'rgba(127,224,168,0)');gg.fillStyle=gr;gg.fillRect(0,0,64,64);return c})());
 g.globalAlpha=al;g.globalCompositeOperation='source-atop';g.globalCompositeOperation='source-over';g.globalAlpha=1}

