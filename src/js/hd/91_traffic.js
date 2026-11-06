// ---------- tránsito de Chepe en estilo B: carros, taxis, pickups, motos y buses ----------
// Cada chofer tarda en reaccionar; en la zebra ceden, fuera de ella frenan tarde, pitan y gritan.
// Si te atropellan: escena, Cruz Roja, San Juan de Dios, horas perdidas, gastos y cojera.
const VEH={c:{}},PUFFS=[];let CARLIGHTS=[],TRAF={hitCD:0,shake:0};
const VEH_COL=['#2e5fae','#e8e8e6','#26262c','#5d9e57','#b9bec4','#e2b33a','#7d3c86','#9a2f2f','#3e6f78','#c46a2c'];
const VEH_LEN={car:36,taxi:36,pickup:40,moto:20,bus:72};
const ROUTES_BUS=['SABANA','MORAVIA','DESAMPA','GUADALUPE','ESCAZÚ','HEREDIA','PAVAS','TIBÁS'];
function vehWheel(b,cx,cy,r,fr){hdEll(b,cx,cy+1,r+1,r*.5,[0,0,0],.25);hdEll(b,cx,cy,r,r,[26,26,30]);hdEll(b,cx-.6,cy-.6,r-1.2,r-1.2,[44,44,50]);hdEll(b,cx,cy,r*.55,r*.55,[150,154,160]);hdEll(b,cx-.5,cy-.5,r*.4,r*.4,[196,200,206]);
  for(let k=0;k<5;k++){const a=fr*.63+k*1.2566;hdLine(b,cx,cy,cx+Math.cos(a)*r*.5,cy+Math.sin(a)*r*.5,[96,98,104])}hdEll(b,cx,cy,1.5,1.5,[60,62,68])}
function vehBody(b,x,y,w,h,col,rad){const R=hdRamp(col,7);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const cut=rad&&((i<rad&&j<rad&&(rad-i)**2+(rad-j)**2>rad*rad)||(i>=w-rad&&j<rad&&(i-(w-rad-1))**2+(rad-j)**2>rad*rad));if(cut)continue;
    const t=j/h;let k=t<.12?6:t<.3?5:t<.62?4:t<.82?3:2;if(i<2)k=Math.max(0,k-1);if(i>=w-2)k=Math.max(0,k-2);hdP(b,x+i,y+j,R[k])}}
function vehGlass(b,pts,dark){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.floor(Math.min(...xs)),x1=Math.ceil(Math.max(...xs)),y0=Math.floor(Math.min(...ys)),y1=Math.ceil(Math.max(...ys));
  const inside=(x,y)=>{let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inside(x+.5,y+.5)){const t=(y-y0)/Math.max(1,y1-y0);let c=hdMix(dark?[40,52,68]:[150,186,210],dark?[22,28,38]:[60,82,104],t);if(((x+y*.7)%16)<2.5)c=hdS(c,1.35);hdP(b,x,y,c)}}
function vehSprite(type,col,fr,extra){const k=type+col+fr+(extra||'');let s=VEH.c[k];if(s)return s;let b;
  if(type==='car'||type==='taxi'){b=hdBuf(76,44);const c=type==='taxi'?'#c8231e':col;
    hdEll(b,38,39,34,4,[0,0,0],.28);vehBody(b,4,18,68,16,c,5);
    const R=hdRamp(c,7);for(let j=0;j<12;j++){const l=20-j*.35,r=54+j*.1-(j<5?0:0);for(let i=Math.floor(l+(11-j)*.9);i<r-(11-j)*1.4;i++)hdP(b,i,7+j,R[j<2?6:j<6?5:4])}
    vehGlass(b,[[23,9],[38,9],[38,18],[17,18]],false);vehGlass(b,[[40,9],[50,9],[58,18],[40,18]],false);hdR(b,38,9,2,9,R[2]);
    hdR(b,5,25,66,1,R[6]);hdR(b,32,19,1,13,R[2]);hdR(b,50,19,1,13,R[2]);hdR(b,35,23,4,1,[220,220,220]);hdR(b,53,23,4,1,[220,220,220]);
    hdR(b,2,28,6,5,[150,150,156]);hdR(b,68,28,6,5,[150,150,156]);hdR(b,69,21,4,4,[255,246,200]);hdR(b,3,21,3,4,[200,40,40]);hdR(b,57,15,4,3,R[2]);
    if(type==='taxi'){hdR(b,28,3,16,5,[242,201,76]);hdR(b,28,3,16,1,[255,232,140]);hdText(b,29,4,'TAXI',[60,30,10]);for(let j=0;j<7;j++)hdR(b,40-j*.5,22+j,1+j,1,[242,201,76])}
    vehWheel(b,17,33,7,fr);vehWheel(b,59,33,7,fr)}
  else if(type==='pickup'){b=hdBuf(84,46);hdEll(b,42,41,37,4,[0,0,0],.28);vehBody(b,4,20,76,16,col,4);const R=hdRamp(col,7);
    for(let j=0;j<12;j++)for(let i=Math.floor(46+(11-j)*.5);i<68-(11-j)*1.2;i++)hdP(b,i,9+j,R[j<2?6:j<6?5:4]);vehGlass(b,[[50,11],[60,11],[66,20],[50,20]],false);
    hdR(b,4,16,40,4,R[3]);hdR(b,4,16,40,1,R[6]);hdR(b,4,16,2,20,R[2]);
    const cargo=extra==='platano';for(let i=0;i<5;i++){if(cargo){for(let k=0;k<4;k++)hdEll(b,9+i*7+k,13-k*.8,1.6,4,[k%2?236:212,k%2?210:190,60])}else{hdEll(b,10+i*7,13,4,4,[196,164,112]);hdR(b,7+i*7,10,6,1,[150,120,80])}}
    hdR(b,77,24,4,4,[255,246,200]);hdR(b,3,24,3,4,[200,40,40]);vehWheel(b,17,35,7,fr);vehWheel(b,64,35,7,fr)}
  else if(type==='moto'){b=hdBuf(44,46);hdEll(b,22,42,18,3,[0,0,0],.28);vehWheel(b,9,36,6,fr);vehWheel(b,35,36,6,fr);
    const Rc=hdRamp(col,7);hdLine(b,9,36,20,28,[60,60,66],1,2);hdLine(b,35,36,30,22,[60,60,66],1,2);hdR(b,14,27,16,6,Rc[4]);hdR(b,14,27,16,2,Rc[6]);hdR(b,17,32,8,5,[70,72,78]);hdR(b,31,21,4,3,[255,246,200]);hdR(b,6,30,3,2,[200,40,40]);
    const box=extra||'#e07a2c';hdR(b,2,14,12,12,hdC(box));hdR(b,2,14,12,2,hdS(hdC(box),1.3));hdR(b,3,19,10,2,[255,255,255]);   // caja del repartidor
    hdR(b,17,19,8,9,[40,46,70]);hdR(b,24,21,7,3,[40,46,70]);hdR(b,18,27,10,4,[50,54,70]);hdR(b,26,30,3,6,[30,30,36]);   // piloto
    hdEll(b,21,14,5,5,hdC(col));hdEll(b,20,13,3,3,hdS(hdC(col),1.3));hdR(b,23,13,4,3,[40,52,68])}
  else if(type==='bus'){b=hdBuf(148,62);hdEll(b,74,57,70,5,[0,0,0],.28);vehBody(b,3,6,142,44,col,6);const R=hdRamp(col,7);
    hdR(b,3,36,142,5,hdC(extra&&extra.split('|')[1]||'#2a8f6a'));hdR(b,3,41,142,2,[214,69,60]);
    for(let i=0;i<8;i++){vehGlass(b,[[12+i*15,12],[24+i*15,12],[24+i*15,26],[12+i*15,26]],false);if(hsh(i,col.length)<.6){hdEll(b,18+i*15,24,3,3,[50,40,40]);hdR(b,15+i*15,25,6,1,[90,70,60])}}
    vehGlass(b,[[132,10],[143,14],[143,30],[132,30]],false);hdR(b,126,12,4,30,[40,40,46]);hdR(b,124,8,18,6,[20,20,24]);hdText(b,125,8,(extra||'SABANA').split('|')[0].slice(0,3),[255,170,40]);
    hdR(b,8,1,48,6,[20,20,24]);hdText(b,10,1,(extra||'SABANA').split('|')[0],[255,170,40]);
    hdR(b,141,40,4,4,[255,246,200]);hdR(b,3,38,3,5,[200,40,40]);vehWheel(b,26,50,8,fr);vehWheel(b,120,50,8,fr)}
  else if(type==='chancha'){b=hdBuf(182,64);hdEll(b,91,59,86,5,[0,0,0],.3);vehBody(b,3,6,176,46,'#f2ede0',7);
    hdR(b,3,34,176,6,[42,111,176]);hdR(b,3,40,176,3,[214,69,60]);hdR(b,3,43,176,1,[242,201,76]);
    for(let i=0;i<9;i++){vehGlass(b,[[12+i*17,12],[25+i*17,12],[25+i*17,27],[12+i*17,27]],false);if(hsh(i,7)<.65){hdEll(b,19+i*17,25,3,3,[60,44,40]);hdR(b,16+i*17,26,6,1,[100,80,60])}}
    vehGlass(b,[[164,10],[178,15],[178,31],[164,31]],false);hdR(b,158,12,4,32,[40,40,46]);
    hdR(b,52,0,76,7,[30,26,34]);hdTextS(b,58,1,'LA CHANCHA',[242,201,76],1);for(let i=0;i<6;i++)hdEll(b,170-i*3,48,1,1,[60,60,66]);
    hdR(b,174,42,5,4,[255,246,200]);hdR(b,3,38,3,6,[200,40,40]);vehWheel(b,30,52,9,fr);vehWheel(b,148,52,9,fr);hdR(b,22,45,18,3,[40,40,46]);hdR(b,140,45,18,3,[40,40,46])}
  s=hdToCanvas(b);VEH.c[k]=s;return s}
function newCarB(lane,x){const r=Math.random(),type=r<.3?'car':r<.54?'taxi':r<.74?'moto':r<.86?'pickup':'bus';const len=VEH_LEN[type];
  const c={type,lane,x:x!=null?x:(lane.dir>0?-len-10:CHW*T+10),len,v:{taxi:74,car:66,bus:50,moto:92,pickup:60}[type]*rnd(.9,1.12),sp:0,col:pick(VEH_COL),hk:0,wait:0,seen:0,rt:{car:.22,taxi:.18,pickup:.25,moto:.32,bus:.3}[type],dec:{car:280,taxi:290,pickup:240,moto:300,bus:170}[type],wd:0,bob:rnd(0,6),yell:0};
  c.sp=c.v*.9;if(type==='bus'){const rr=pick(ROUTES_BUS);c.extra=rr+'|'+pick(['#2a8f6a','#2a6fb0','#c0473b','#e2b33a']);c.col=pick(['#ecebe4','#f2f2ee','#e9e2cf'])}
  if(type==='pickup')c.extra=Math.random()<.6?'platano':'sacos';if(type==='moto')c.extra=pick(['#e07a2c','#2a8f6a','#c0473b','#f2c94c']);return c}
const HONK_YELL=['¡Quítese, mae!','¡Diay! ¿Qué le pasa?','¡La acera es pa\' caminar, joven!','¡Muévase, que voy tarde!','¡Póngase vivo, mae!','¿Está sordo o qué?','¡Uy, casi me lo como!','¡Qué torta, carajillo!','¡Fíjese, por Dios santo!','¡Me lleva…! ¡Cuidado!'];
const MOTO_YELL=['¡UPE, UPE!','¡Pedido urgente, mae, abrase!','¡Voy volado!','¡Ojo, ojo, ojo!'];
const ZEBRA_OK=['Pase, joven 👍','Tranquilo, pase.','Dele, dele.','Pase, pase, con cuidado.'];
const CLOSE_CALL=['¡Upe!','¡Casi, mae!','¡Diay!','¡Uuuy!'];
function vehBub(c,txt){if(BUBS.length>2)return;const L=c.lane;BUBS.push({car:c,e:{map:'chepe',get x(){return c.x+c.len/2},get y(){return L.y*T+12-(c.type==='bus'?18:c.type==='moto'?4:6)}},txt,t:2.6})}
function onZebra(){const tx=Math.floor(P.x/T);return tx===11||tx===12||tx===23||tx===24}
function carsTickB(dt){if(TRAF.hitCD>0)TRAF.hitCD-=dt;
  for(let i=0;i<2;i++){const L=LANES[i];carT[i]-=dt;if(carT[i]<=0&&!(i===1&&CBUS)){carT[i]=rnd(1.5,3.8);const first=CARS.filter(c=>c.lane===L).sort((a,b)=>L.dir>0?a.x-b.x:b.x-a.x)[0];
    if(!first||(L.dir>0?first.x>70:first.x<CHW*T-110))CARS.push(newCarB(L))}}
  const inChepe=P.map==='chepe'&&mode==='play',zeb=inChepe&&onZebra(),onRoad=inChepe&&P.y>9*T&&P.y<12*T+4;
  for(const c of CARS){const L=c.lane,ly=L.y*T+10,front=L.dir>0?c.x+c.len:c.x;let stop=false,emerg=false;
    const inLane=onRoad&&Math.abs(P.y-ly)<10,d=(P.x-front)*L.dir;
    // la zebra: se ve desde lejos y se cede
    if(zeb&&Math.abs(P.y-ly)<28&&d>-4&&d<120){stop=true;if(c.sp<2&&c.wait>.6&&!c.yell&&Math.random()<.5){c.yell=1;vehBub(c,pick(ZEBRA_OK))}}
    // fuera de la zebra: el chofer tarda en reaccionar
    else if(inLane&&d>-c.len&&d<46){c.seen+=dt;if(c.seen>c.rt){stop=true;emerg=true;if(!c.hk){c.hk=1;honk(c);if(!c.yell){c.yell=1;vehBub(c,pick(c.type==='moto'?MOTO_YELL:HONK_YELL))}}}}
    else c.seen=0;
    for(const o of CARS){if(o===c||o.lane!==L)continue;const gap=L.dir>0?o.x-(c.x+c.len):c.x-(o.x+o.len);if(gap>-4&&gap<12){stop=true;break}}
    if(CBUS&&L.dir>0){const gap=CBUS.x-(c.x+c.len);if(gap>-4&&gap<14)stop=true}
    const pv=c.sp;c.sp=stop?Math.max(0,c.sp-(emerg?c.dec*1.2:c.dec*.7)*dt):Math.min(c.v,c.sp+(c.type==='moto'?140:80)*dt);c.brake=c.sp<pv-.5;c.x+=c.sp*L.dir*dt;c.wd+=c.sp*dt;c.bob+=dt*(4+c.sp*.05);
    if(c.sp>pv+.5&&Math.random()<dt*10)PUFFS.push({x:L.dir>0?c.x+2:c.x+c.len-2,y:ly+3,t:0,vx:-L.dir*8});
    if(stop&&c.sp<1){c.wait+=dt;if(c.wait>2.2&&!c.hk&&inChepe){c.hk=1;honk(c)}}else{c.wait=0;if(!stop){c.hk=0;if(c.sp>c.v*.8)c.yell=0}}
    // ¿choque?
    if(inLane&&TRAF.hitCD<=0&&P.x>c.x-3&&P.x<c.x+c.len+3){if(c.sp>26)return carHit(c);else if(c.sp>3){P.y+=P.y<ly?-3:3;if(!c.bmp){c.bmp=1;vehBub(c,'¡Ey! ¡Cuidado, mae!');beep(160,.08,'square',.03)}}}
    else c.bmp=0;
    // casi
    if(onRoad&&!inLane&&!c.close&&Math.abs(P.y-ly)<18&&Math.abs(P.x-(c.x+c.len/2))<c.len/2&&c.sp>45){c.close=1;vehBub(c,pick(CLOSE_CALL));beep(600,.05,'triangle',.02)}}
  CARS=CARS.filter(c=>c.x>-140&&c.x<CHW*T+140);BUBS=BUBS.filter(b=>!b.car||CARS.includes(b.car));
  for(const p of PUFFS){p.t+=dt;p.x+=p.vx*dt;p.y-=6*dt}for(let i=PUFFS.length-1;i>=0;i--)if(PUFFS[i].t>1.2)PUFFS.splice(i,1)}
function honk(c){const f=c.type==='bus'?196:c.type==='moto'?660:c.type==='taxi'?440:392;beep(f,.14,'square',.022);setTimeout(()=>beep(f*.84,.2,'square',.022),150)}
// dibujo: se mezclan con la gente según su altura en pantalla
function vehDraw(g,c){const L=c.lane,Yb=L.y*T+16,fl=L.dir<0,fr=Math.floor(c.wd/3)%5,s=vehSprite(c.type,c.col,fr,c.extra),w=s.width/2,h=s.height/2,bob=c.sp>5?Math.round(Math.sin(c.bob)*.5*2)/2:0;
  const X=Math.round((c.x+c.len/2-w/2)*2)/2,Y=Yb-h+bob;g.save();if(fl){g.translate(X*2+w,0);g.scale(-1,1)}g.drawImage(s,X,Y,w,h);
  if(c.brake||c.sp<2){g.fillStyle='rgba(255,40,30,.9)';const tx=X+1,ty=Y+h*(c.type==='bus'?.62:.5);g.fillRect(tx,ty,2,2);g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,60,40,.35)';g.fillRect(tx-3,ty-2,7,6)}
  g.restore()}
function carProxies(list,map){if(map!=='chepe')return;for(const c of CARS)list.push({kind:'carv',map,x:c.x+c.len/2,y:c.lane.y*T+16,draw:g=>vehDraw(g,c)});
  if(CBUS)list.push({kind:'carv',map,x:CBUS.x+45,y:11*T+16,draw:g=>{const s=vehSprite('chancha','#f2ede0',Math.floor((CBUS.x||0)/3)%5);g.drawImage(s,Math.round(CBUS.x),11*T+16-s.height/2,s.width/2,s.height/2)}})}
function zoneGroundB(g){for(const p of PUFFS){const a=Math.max(0,.45*(1-p.t/1.2)),r=2+p.t*4;g.fillStyle='rgba(180,180,186,'+a+')';g.beginPath();g.arc(p.x,p.y,r,0,6.283);g.fill()}
  CARLIGHTS=[];const h=S.t/60,night=h<5.8||h>18.2||S.rain;if(night)for(const c of CARS){const fx=c.lane.dir>0?c.x+c.len:c.x;CARLIGHTS.push({x:fx+c.lane.dir*14,y:c.lane.y*T+12,r:c.type==='moto'?26:38,car:1})}}
function carGlow(ctx,night){if(!night)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const c of CARS){const d=c.lane.dir,fx=d>0?c.x+c.len:c.x,y=c.lane.y*T+(c.type==='bus'?-4:c.type==='moto'?2:4);ctx.globalAlpha=night*.55;
    const gr=ctx.createLinearGradient(fx,0,fx+d*46,0);gr.addColorStop(0,'rgba(255,244,200,.8)');gr.addColorStop(1,'rgba(255,244,200,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(fx,y-2);ctx.lineTo(fx+d*46,y-10);ctx.lineTo(fx+d*46,y+12);ctx.lineTo(fx,y+3);ctx.fill();
    const bx=d>0?c.x:c.x+c.len;ctx.globalAlpha=night*.6;ctx.fillStyle='rgba(255,40,30,.8)';ctx.beginPath();ctx.arc(bx,y+2,c.brake?5:3,0,6.283);ctx.fill()}
  ctx.restore()}
// ---------- el atropello ----------
const HIT_DRIVER={taxi:['¡Virgen santísima, mae! ¡Usted se me tiró encima! ¿Está vivo? ¡Hable, hable!','¡Ay, no, no, no! ¡Diay, joven, ¿de dónde salió?! ¡Que alguien llame a la Cruz Roja!'],
 car:['¡Ay, Dios mío! ¡No lo vi, se lo juro por mi mamá!','¡Perdón, perdón! ¡Iba viendo el Waze, qué vergüenza! ¿Me oye?'],
 pickup:['¡Me lleva…! ¡Se me atravesó como un chancho en la calle! ¿Está bien, mae?','¡Ay, Diosito! ¡Y yo con la carga de plátanos! ¡Que alguien me ayude!'],
 moto:['¡UPE! ¡Perdón, mae, perdón! ¡Venía volado con un pedido!','¡Mae, ¿está bien?! ¡Se me salió la caja del pedido y todo! ¡Llamen al 911!'],
 bus:['¡Llamen a la Cruz Roja, rápido! ¡Todo el mundo quieto en el bus!','¡Diay, joven! ¡Yo frené con todo lo que tenía! ¿Está consciente?']};
const HIT_WITNESS=['Una señora con bolsas: «¡Yo lo vi todo! ¡Ese muchacho cruzó sin ver, pobrecito!»','Un vendedor de lotería: «Diay, mae… y usted que no compró la lotería hoy. Hoy sí era su día.»','Un señor ya está grabando con el celular. Mañana sale en Facebook: «Joven atropellado en la Segunda».','Un colegial grita: «¡Mae, se lo llevó puesto! ¡Qué salvajada!»'];
function carHit(c){TRAF.hitCD=30;BUBS=[];c.sp=0;c.hk=1;c.wait=-8;mode='dialog';for(const k in KEYS)KEYS[k]=0;
  beep(1100,.35,'sawtooth',.03,240);setTimeout(()=>{beep(70,.3,'square',.06);beep(110,.2,'triangle',.05)},180);
  const cv=$('#c'),t0=performance.now();const sk=()=>{const t=(performance.now()-t0)/1000;if(t>.6){cv.style.transform='';return}const a=10*(1-t/.6);cv.style.transform='translate('+(Math.random()-.5)*a+'px,'+(Math.random()-.5)*a+'px)';requestAnimationFrame(sk)};sk();
  const fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:#c0201a;opacity:.7;pointer-events:none;z-index:54;transition:opacity 1.4s';document.body.appendChild(fl);setTimeout(()=>{fl.style.opacity=0},60);setTimeout(()=>fl.remove(),1600);
  S.f.atrop=(S.f.atrop||0)+1;const n=S.f.atrop;
  setTimeout(()=>{DQ=[];say(null,'¡PUM! Todo se pone en cámara lenta: el parachoques, el cielo, una paloma que ni se inmutó.');
    say(fillChar({id:'zx'+Math.random().toString(36).slice(2,6),name:{taxi:'Taxista',car:'El chofer',pickup:'El del pickup',moto:'El repartidor',bus:'El chofer del bus'}[c.type],skin:'#b97a4a',hair:'corto',hairColor:'#2a1810',shirt:c.type==='taxi'?'#f4f4f4':'#5b7fa6',pants:'#2d3346',acc:c.type==='moto'?'gorra':'ninguno',accColor:'#e07a2c',v:1}),pick(HIT_DRIVER[c.type]||HIT_DRIVER.car));
    say(null,pick(HIT_WITNESS));say(null,'Se oye la sirena de la Cruz Roja cada vez más cerca… y después, nada.');
    AFTER.push(()=>carHospital(c,n));runDialog()},900)}
function carHospital(c,n){fadeDo(()=>{const lost=[];const mins=Math.round(rnd(300,460)+(n-1)*60);passTime(mins);
    const e=E();e.en=Math.min(e.en,12+Math.max(0,4-n)*2);
    const cost=Math.min(Math.max(0,S.money),3500+(n-1)*2500);if(cost)spend(cost,'Salud');
    if(hasI('helado')){remI('helado');lost.push('el helado de sorbetera (quedó embarrado en el asfalto)')}
    const pool=Object.keys(S.inv).filter(k=>!ENC[k]&&k!=='helado'&&k!=='pase_bus');if(pool.length&&Math.random()<.5){const k=pick(pool);remI(k);lost.push(itemName(k))}
    S.f.cojo=totalMinutes()+18*60;S.f.celQuebrado=1;
    P.map='chepe';P.x=3*T+8;P.y=14*T+10;P.dir=0;CARS=[];CBUS=null;
    TRAF.last={cost,lost,mins}},()=>{const L=TRAF.last||{cost:0,lost:[],mins:360};DQ=[];
    say(null,'Abrís los ojos. Luz blanca, olor a alcohol y un televisor pasando el noticiero. Estás en el Hospital San Juan de Dios.');
    say(fillChar({id:'zx'+Math.random().toString(36).slice(2,6),name:'Enfermera Marielos',skin:'#c68642',hair:'moño',hairColor:'#2b1a10',shirt:'#a9c8ef',pants:'#a9c8ef',acc:'ninguno',v:1}),n===1?'Buenas, mi amor. Tranquilo, no se me levante. Tiene un golpe en la cabeza y la pierna morada, pero gracias a Dios nada quebrado.':n===2?'¿Usted otra vez? ¡Ay, no! Ya le tengo la camilla con su nombre, mijo. Esta vez se dobló el tobillo.':'Mire, ya me sé hasta su número de cédula. El doctor quiere hablar con usted. Y no está contento.');
    say(fillChar({id:'zx'+Math.random().toString(36).slice(2,6),name:'Doctor Quesada',skin:'#e0ac69',hair:'calvo',hairColor:'#cfcfcf',shirt:'#f4f4f4',pants:'#2d3346',acc:'anteojos',v:1}),n===1?'Le hicimos placas. Usted tiene huesos de hierro, mae. Pero por favor: cruce por la zebra. En Chepe nadie frena por cortesía.':n===2?'Dos veces en el mismo mes. La próxima vez no le voy a poder decir «tuvo suerte». Use la zebra y mire para los dos lados.':'Joven, en este país se mueren casi dos personas al día en las calles. No quiero que usted sea una de ellas. Zebra. Semáforo. Siempre.');
    say(null,'Pasaron unas '+Math.round(L.mins/60)+' horas.'+(L.cost?' Entre pastillas, placas y el taxi se te fueron '+fmtC(L.cost)+'.':' No tenías ni un cinco: la trabajadora social te ayudó con las pastillas.')+(L.lost.length?' En el accidente perdiste '+L.lost.join(' y ')+'.':''));
    say(null,'Además se te quebró la pantalla del celular y vas a andar cojeando hasta mañana: caminás más despacio y no podés correr.');
    say(fillChar({id:'zx'+Math.random().toString(36).slice(2,6),name:'Oficial de Tránsito',skin:'#8d5524',hair:'corto',hairColor:'#1c1c1c',shirt:'#2d3a6e',pants:'#2a2a30',acc:'gorra',accColor:'#2d3a6e',v:1}),'Al chofer ya le hicimos el parte. Y a usted le aconsejo: la calle no es parque. Muchos no la cuentan.');
    say(null,'Te dan de alta. Salís cojeando hasta la parada del Parque Central.');
    if(phOn('mama'))phQueue('mama',n===1?'¡¿CÓMO QUE LO ATROPELLARON?! 😱 Me llamó la vecina, que lo vio en Facebook. ¡Ya voy con la tía Chela! No se me mueva de ahí. Y coma algo.':'Mijo… otra vez no. Yo no tengo corazón para esto 💔 Por favor cruce por la zebra, se lo pido por la Virgencita.',3);
    if(phOn('ariana'))phQueue('ariana','mae me dijeron q te atropellaron 😭😭 estás bien?? decime algo porfa',6);
    if(CH.papa&&phOn('papa'))phQueue('papa','Mijo, me contaron. En mis tiempos uno cruzaba la calle con miedo y respeto. Hágame caso: dos veces a cada lado.',14);
    runDialog();saveGame();toast('🩹 Andás cojeando hasta mañana')})}
// cojera: caminás más despacio mientras dure
{const _mv=moveEnt;moveEnt=function(e,dx,dy){if(e===P&&S&&S.f&&S.f.cojo&&S.f.cojo>totalMinutes()){const k=KEYS.shift?.45:.62;dx*=k;dy*=k}return _mv(e,dx,dy)}}
