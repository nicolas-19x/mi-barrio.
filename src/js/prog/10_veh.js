// ================= PROGRESO · VEHÍCULOS =================
// Bici, motos, carro y pickup: se compran (Marketplace, agencia, El Hoyo, el taller), se manejan de verdad,
// gastan gasolina, se desgastan, se varan, pagan marchamo y RTV, ocupan licencia y se los pueden robar.
function PGS(){const f=S.f;if(!f.pg)f.pg={veh:[],ride:null,lic:{moto:0,carro:0},nid:1,mk:null,job:null,jobs:{n:0,stars:0},tram:[],seg:{},rtv:{},mar:{},cred:[],dep:null,logros:{},rep:0,decor:{},neg:{},inv:{},stats:{}};return f.pg}
const VM={
 bici:{n:'Bici montañera',ic:'🚲',k:'bici',price:18000,spd:1.6,motor:0,lic:null,range:0,mar:0,col:'#2a6fb0'},
 bici_r:{n:'Bici de ruta',ic:'🚴',k:'bici',price:38000,spd:1.85,motor:0,lic:null,range:0,mar:0,col:'#d6453c'},
 moto_u:{n:'Moto Toro 125 (usada)',ic:'🛵',k:'moto',price:75000,spd:2.25,motor:1,lic:'moto',range:15000,mar:9000,tank:9,col:'#c0473b'},
 moto_n:{n:'Moto Relámpago 150 (0 km)',ic:'🏍',k:'moto',price:160000,spd:2.5,motor:1,lic:'moto',range:17000,mar:12000,tank:11,col:'#2a2a30'},
 moto_h:{n:'Moto «de dudosa procedencia»',ic:'🛵',k:'moto',price:32000,spd:2.2,motor:1,lic:'moto',range:13000,mar:9000,tank:9,col:'#2a6fb0',hot:1},
 carro:{n:'Corollita del 96',ic:'🚗',k:'carro',price:280000,spd:2.55,motor:1,lic:'carro',range:22000,mar:28000,tank:40,col:'#e2b33a'},
 pickup:{n:'Pickup 4×4 «La Bestia»',ic:'🛻',k:'pickup',price:450000,spd:2.35,motor:1,lic:'carro',range:20000,mar:42000,tank:60,col:'#7d2a2a'}};
const GAS_L=780,HOME_PARK={map:'ext',x:7.4*T,y:17*T+11};
const vOf=id=>PGS().veh.find(v=>v.id===id);
const riding=()=>{const p=S&&S.f&&S.f.pg;return p&&p.ride?p.veh.find(v=>v.id===p.ride):null};
function vAdd(m,o){const p=PGS(),c=VM[m],v=Object.assign({id:'v'+(p.nid++),m,col:c.col,gas:c.motor?.6:0,cond:100,map:HOME_PARK.map,x:HOME_PARK.x,y:HOME_PARK.y,dir:3,km:0,placa:vPlaca()},o||{});p.veh.push(v);
  if(c.motor){p.rtv[v.id]=S.day+21;p.mar[v.id]=S.day+28}return v}
function vPlaca(){const L='BCDFGHJKLMNPRSTV';return L[(Math.random()*16)|0]+L[(Math.random()*16)|0]+L[(Math.random()*16)|0]+'-'+(100+((Math.random()*899)|0))}
// ---------------------------------------------------------------- sprites (HD, con el jugador montado)
const VSP=new Map();
function vHelmet(b,cx,cy,col,side){const c=hdC(col);hdEll(b,cx,cy,7.5,7,hdS(c,.75));hdEll(b,cx-1,cy-1,6.5,6,c);hdEll(b,cx-3,cy-3,2.5,2,hdS(c,1.4));
  if(side==='f'){hdR(b,cx-5,cy,10,4,[40,52,68]);hdR(b,cx-4,cy,3,1,[150,190,220])}else if(side==='r'){hdR(b,cx+1,cy-1,6,4,[40,52,68])}else if(side==='l'){hdR(b,cx-7,cy-1,6,4,[40,52,68])}}
function vSprite(m,col,dir,fr,rider,shirt){const k=m+col+dir+fr+(rider?'R'+(shirt||''):'');let s=VSP.get(k);if(s)return s;if(VSP.size>300)VSP.clear();
  const c=VM[m],K=c.k,side=dir>=2,flip=dir===2,R=hdRamp(col,7);let b,ox=0,oy=0;
  const hero=rider?heroSprite(side?3:dir,rider==='walk'?fr%6:6,shirt):null;
  if(K==='bici'){if(side){b=hdBuf(56,66);const w1=[12,56],w2=[44,56];hdEll(b,28,64,22,2,[0,0,0],.25);
      for(const[wx,wy]of[w1,w2]){for(let a=0;a<24;a++){const t=a/24*6.283;hdP(b,wx+Math.cos(t)*8,wy+Math.sin(t)*8,[30,30,34]);hdP(b,wx+Math.cos(t)*7,wy+Math.sin(t)*7,[60,60,66])}for(let s2=0;s2<4;s2++){const t=fr*.7+s2*.785;hdLine(b,wx-Math.cos(t)*6,wy-Math.sin(t)*6,wx+Math.cos(t)*6,wy+Math.sin(t)*6,[150,154,160])}}
      hdLine(b,12,56,26,44,R[4],1,2);hdLine(b,26,44,44,56,R[4],1,2);hdLine(b,26,44,40,42,R[5],1,2);hdLine(b,40,42,44,56,R[3],1,2);hdLine(b,26,44,24,38,R[3],1,2);hdR(b,20,36,9,3,[40,40,44]);hdLine(b,40,42,42,34,[60,60,66],1,2);hdR(b,38,32,8,2,[40,40,44]);
      if(hero)hdBlitC(b,hero,10,0);hdLine(b,40,40,42,34,[60,60,66],1,2)}
    else{b=hdBuf(36,66);hdEll(b,18,64,9,2,[0,0,0],.25);if(hero&&dir===1)hdBlitC(b,hero,0,0);hdR(b,16,46,4,18,[30,30,34]);hdR(b,17,46,2,18,[70,70,76]);hdR(b,6,dir===0?36:40,24,2,[50,50,56]);hdR(b,15,dir===0?36:40,6,10,R[4]);
      if(hero&&dir===0)hdBlitC(b,hero,0,0);if(dir===0){hdR(b,16,52,4,12,[30,30,34]);hdR(b,6,38,24,2,[50,50,56])}else{hdR(b,14,40,8,3,[40,40,44]);hdR(b,16,46,4,3,[200,40,40])}}}
  else if(K==='moto'){if(side){b=hdBuf(68,66);hdEll(b,34,64,28,2.5,[0,0,0],.28);vehWheel(b,13,55,9,fr);vehWheel(b,55,55,9,fr);
      hdLine(b,55,55,48,36,[90,92,98],1,2);hdR(b,24,44,22,10,[60,60,66]);hdR(b,26,46,8,6,[90,92,98]);hdLine(b,10,52,30,50,[150,154,160],1,2);   // motor y escape
      vehBody(b,22,34,30,10,col,4);hdR(b,14,36,14,5,[30,30,34]);hdR(b,14,36,14,1,[70,70,76]);hdR(b,52,40,9,6,hdS(hdC(col),.8));hdR(b,60,38,4,4,[255,246,200]);hdR(b,8,40,4,3,[200,40,40]);
      hdR(b,47,30,2,8,[60,60,66]);hdR(b,44,29,8,2,[40,40,44]);
      if(hero){hdBlitC(b,hero,12,2,40);vHelmet(b,30,11,col,'r');vehBody(b,22,34,30,10,col,4);hdR(b,46,30,6,2,[40,40,44])}}
    else{b=hdBuf(40,66);hdEll(b,20,64,11,2.5,[0,0,0],.28);if(dir===1){if(hero){hdBlitC(b,hero,2,2,40);vHelmet(b,20,11,col,'b')}hdR(b,15,44,10,20,[28,28,32]);hdR(b,13,38,14,8,hdS(hdC(col),.85));hdR(b,16,46,8,3,[200,40,40]);hdR(b,15,50,10,5,[240,240,230]);hdText(b,16,50,'CR',[40,40,46])}
      else{if(hero){hdBlitC(b,hero,2,2,40);vHelmet(b,20,11,col,'f')}hdR(b,15,46,10,18,[28,28,32]);hdR(b,12,38,16,10,col?hdC(col):[200,60,50]);hdR(b,12,38,16,2,hdS(hdC(col),1.3));hdEll(b,20,42,4,3,[255,246,200]);hdR(b,4,32,32,2,[50,50,56]);hdR(b,2,28,4,4,[180,190,200]);hdR(b,34,28,4,4,[180,190,200])}}}
  else{const L=K==='pickup';if(side){b=hdBuf(L?86:80,48);const W2=b.w;hdEll(b,W2/2,44,W2/2-6,3.5,[0,0,0],.3);vehBody(b,4,22,W2-8,16,col,5);
      for(let j=0;j<12;j++){const l=L?48:22,r=L?70:58;for(let i=Math.floor(l+(11-j)*.9);i<r-(11-j)*1.4;i++)hdP(b,i,11+j,R[j<2?6:j<6?5:4])}
      if(L){vehGlass(b,[[52,13],[62,13],[68,22],[52,22]],false);hdR(b,6,18,40,4,R[3]);hdR(b,6,18,40,1,R[6])}else{vehGlass(b,[[25,13],[40,13],[40,22],[19,22]],false);vehGlass(b,[[42,13],[52,13],[60,22],[42,22]],false);hdR(b,40,13,2,9,R[2])}
      if(rider){const hx=L?58:47;hdEll(b,hx,17,4,4,[196,140,96]);hdEll(b,hx-1,14,4,3,[40,30,26])}
      hdR(b,5,29,W2-10,1,R[6]);hdR(b,W2-8,24,4,4,[255,246,200]);hdR(b,3,24,3,4,[200,40,40]);hdR(b,2,32,6,5,[150,150,156]);hdR(b,W2-8,32,6,5,[150,150,156]);
      vehWheel(b,18,37,7,fr);vehWheel(b,W2-18,37,7,fr)}
    else{b=hdBuf(48,52);hdEll(b,24,49,22,3,[0,0,0],.3);vehBody(b,3,20,42,22,col,5);for(let j=0;j<12;j++)for(let i=8+(11-j)*.4;i<40-(11-j)*.4;i++)hdP(b,i,8+j,R[j<3?6:5]);
      vehGlass(b,[[10,10],[38,10],[40,20],[8,20]],dir===1);if(rider&&dir===0){hdEll(b,17,16,4,4,[196,140,96]);hdEll(b,17,13,4,3,[40,30,26])}
      if(dir===0){hdR(b,5,26,8,5,[255,246,200]);hdR(b,35,26,8,5,[255,246,200]);hdR(b,14,30,20,5,[60,60,66]);for(let i=16;i<34;i+=3)hdR(b,i,31,1,3,[120,120,126])}else{hdR(b,5,26,8,4,[200,40,40]);hdR(b,35,26,8,4,[200,40,40]);hdR(b,17,33,14,6,[240,240,230]);hdText(b,18,33,'CR',[40,40,46])}
      hdR(b,3,38,42,4,[60,60,66]);hdR(b,5,42,7,8,[26,26,30]);hdR(b,36,42,7,8,[26,26,30])}}
  s=hdToCanvas(b);if(flip){const f=mk(s.width,s.height),g=f.getContext('2d');g.translate(s.width,0);g.scale(-1,1);g.drawImage(s,0,0);s=f}VSP.set(k,s);return s}
function hdBlitC(b,cnv,ox,oy,maxRows){const g=cnv.getContext('2d'),d=g.getImageData(0,0,cnv.width,cnv.height).data;const rows=maxRows||cnv.height;
  for(let y=0;y<rows;y++)for(let x=0;x<cnv.width;x++){const i=(y*cnv.width+x)<<2;if(d[i+3]>10)hdP(b,ox+x,oy+y,[d[i],d[i+1],d[i+2]])}}
// imagen del jugador montado (para dibujar y para la sombra)
function progRideImg(){const v=riding();if(!v||v.map!==P.map)return null;const fr=Math.floor((v.wd||0)/4)%5;const s=vSprite(v.m,v.col,P.dir|0,VM[v.m].k==='bici'&&P.moving?Math.floor(P.hf||0):fr,VM[v.m].k==='bici'?(P.moving?'walk':'sit'):'sit',CH.player.shirt);
  const w=s.width/2,h=s.height/2;return{img:s,x:-w/2,y:-h+3,w,h}}
{const _hd=heroDraw;heroDraw=function(g,X,Y,e){const r=e===P&&progRideImg();if(r){g.drawImage(r.img,X+r.x,Y+r.y,r.w,r.h);return}return _hd(g,X,Y,e)}}
// vehículos estacionados (se ordenan con la gente)
function progProxies(list,map){const p=S&&S.f&&S.f.pg;if(!p)return;for(const v of p.veh){if(v.id===p.ride||v.map!==map||v.gone)continue;const s=vSprite(v.m,v.col,v.dir|0,0,null);
    list.push({kind:'carv',map,x:v.x,y:v.y,draw:g=>{g.drawImage(s,Math.round((v.x-s.width/4)*2)/2,Math.round((v.y-s.height/2+3)*2)/2,s.width/2,s.height/2);if(v.varado&&Math.floor(qBlink*2)%2){g.fillStyle='#f2c94c';g.fillRect(v.x-1,v.y-s.height/2-4,2,4)}}})}
  if(typeof progJobProxies==='function')progJobProxies(list,map)}
// ---------------------------------------------------------------- manejar
let ENG=null;
function engineOn(v){engineOff();const c=VM[v.m];if(!c.motor||!OPT.sound)return;const a=ac();if(!a)return;const o=a.createOscillator(),o2=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();
  o.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=380;g.gain.value=0;o.connect(f);o2.connect(f);f.connect(g).connect(a.destination);o.start();o2.start();ENG={o,o2,g,a,base:c.k==='moto'?52:38};}
function engineOff(){if(!ENG)return;try{ENG.g.gain.setTargetAtTime(0,ENG.a.currentTime,.05);const e=ENG;setTimeout(()=>{try{e.o.stop();e.o2.stop()}catch(x){}},300)}catch(e){}ENG=null}
function progMount(v){const c=VM[v.m];
  if(v.varado){say(null,'Está varada. Hay que llevarla al taller de '+N('kevin')+' o llamar la grúa por el celular.',[{t:'Empujarla (caminás despacio)',f(){afterD(()=>{PGS().ride=v.id;v.push=1;toast('🛵 Empujando… (V para soltarla)')})}},{t:'Dejarla'}]);runDialog();return}
  if(c.motor&&v.gas<=0.005){toast('⛽ Sin gasolina. Llevala empujada a la bomba o comprá un galón.');PGS().ride=v.id;v.push=1;return}
  if(v.dep){toast('🚔 Está en el depósito de Tránsito. Pagá la multa en el celular (COSEVI).');return}
  PGS().ride=v.id;v.push=0;P.dir=v.dir|0;if(c.motor){engineOn(v);beep(c.k==='moto'?140:90,.35,'sawtooth',.04,c.k==='moto'?260:160)}else beep(1200,.04,'triangle',.02);
  if(c.lic&&!PGS().lic[c.lic]&&!S.f.pgLicW){S.f.pgLicW=1;toast('⚠️ Sin licencia: en el barrio pasa, pero en Chepe los retenes no perdonan')}
  else toast(c.ic+' '+c.n+(c.motor?' · ⛽ '+Math.round(v.gas*100)+'%':''))}
function progDismount(silent){const v=riding();if(!v)return;const p=PGS();v.map=P.map;v.x=P.x;v.y=P.y;v.dir=P.dir|0;p.ride=null;v.push=0;engineOff();if(!silent)beep(500,.05,'triangle',.02)}
function nearVeh(){if(!S||!S.f||!S.f.pg)return null;let best=null,bd=26;for(const v of PGS().veh){if(v.gone||v.map!==P.map||v.id===PGS().ride)continue;const d=Math.hypot(v.x-P.x,v.y-P.y);if(d<bd){bd=d;best=v}}return best}
const RIDE_MAPS=new Set(['ext','chepe','hoyo']);
{const _mv=moveEnt;moveEnt=function(e,dx,dy){if(e===P){const v=riding();if(v){const c=VM[v.m];let k=v.push?.55:c.spd;if(KEYS.shift&&!v.push)k*=c.motor?1.12:1.18;dx*=k;dy*=k;
      const d=Math.hypot(dx,dy);v.wd=(v.wd||0)+d;v.km+=d;if(c.motor&&!v.push){v.gas=Math.max(0,v.gas-d/c.range);if(v.gas<=0){v.push=1;engineOff();toast('⛽ Se acabó la gasolina. Toca empujar…')}}
      v.cond=Math.max(0,v.cond-d/(c.motor?1100:1600))}}return _mv(e,dx,dy)}}
{const _cd=checkDoors;checkDoors=function(){const v=riding();if(v){const m=MAPS[P.map],[tx,ty]=tileOf(P);const door=m&&m.doors&&m.doors.find(d=>d.x===tx&&d.y===ty);if(door||(m&&m.interior)){progDismount(true);P.y-=2}}return _cd()}}
{const _f=findTarget;findTarget=function(){const t=_f();if(riding())return t;if(!t||t.type==='furn'){const v=nearVeh();if(v)return{type:'myveh',v}}return t}}
{const _l=targetLabel;targetLabel=function(t){if(t&&t.type==='myveh'){const c=VM[t.v.m];return(c.k==='carro'||c.k==='pickup'?'Subirse al ':'Montarse en la ')+(c.k==='bici'?'bici':c.k==='moto'?'moto':c.k==='pickup'?'pickup':'carro')}return _l(t)}}
{const _i=interact;interact=function(){if(mode!=='play'||fading)return _i();const t=target;if(t&&t.type==='myveh'){progMount(t.v);return}if(riding()&&t&&t.type!=='activity'){progDismount(true)}return _i()}}
addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;if(e.repeat||mode!=='play'||!S||!S.started)return;if((e.key||'').toLowerCase()==='v'){if(riding())progDismount();else{const v=nearVeh();if(v)progMount(v)}}});
// botón táctil para bajarse
{const b=document.createElement('button');b.id='pgRide';b.className='alt hidden';b.textContent='⏏ Bajarse';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--capS,46px) + 52px + env(safe-area-inset-bottom));z-index:21;font-size:14px;padding:8px 14px';document.body.appendChild(b);b.onclick=()=>progDismount()}
// estado en pantalla (gasolina y estado del vehículo)
{const c=document.createElement('div');c.id='pgVeh';c.className='chip hidden';c.style.cssText='position:fixed;left:8px;top:calc(env(safe-area-inset-top) + 8px);z-index:19;pointer-events:none;font-size:12px';document.body.appendChild(c)}
function progHud(){const v=riding(),el=$('#pgVeh'),bt=$('#pgRide');const show=!!(v&&mode==='play'&&!COMBAT);bt.classList.toggle('hidden',!(show&&TOUCH));el.classList.toggle('hidden',!show);if(!show)return;
  const c=VM[v.m],hl=$('#hudL');if(hl){const r=hl.getBoundingClientRect();el.style.top=Math.round(r.bottom+6)+'px'}
  el.innerHTML=c.ic+' '+c.n.split(' (')[0]+(c.motor?' · ⛽ '+Math.round(v.gas*100)+'%':'')+' · 🔧 '+Math.round(v.cond)+'%'+(v.push?' · <b style="color:#ff9b8f">empujando</b>':'')}
function progVehTick(dt){const v=riding();if(v){if(!RIDE_MAPS.has(P.map)){progDismount(true);return}const c=VM[v.m];
    if(ENG){const sp=P.moving?(KEYS.shift?1.4:1):0;ENG.o.frequency.setTargetAtTime(ENG.base*(1+sp*.9),ENG.a.currentTime,.08);ENG.o2.frequency.setTargetAtTime(ENG.base*.5*(1+sp*.9),ENG.a.currentTime,.08);ENG.g.gain.setTargetAtTime(OPT.sound?(.018+sp*.014):0,ENG.a.currentTime,.1)}
    if(c.motor&&!v.push&&P.moving&&v.cond<22&&Math.random()<dt*.05){v.varado=1;v.push=1;engineOff();beep(90,.5,'sawtooth',.05,40);say(null,pick(['¡Pff, pff… pum! Se le apagó y no quiere arrancar. Huele a quemado.','La '+(c.k==='moto'?'moto':'máquina')+' tose, tiembla y se muere en plena calle. Varado.']));say(null,'Toca empujarla hasta el taller de '+N('kevin')+' o llamar la grúa desde el celular.');runDialog()}}
  progHud()}
