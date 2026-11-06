// ---------- el viaje en La Chancha, estilo B: vista desde adentro, en perspectiva ----------
// Cámara sentada en la última fila mirando al frente: pasillo, pasajeros de espaldas, Don Beto al volante,
// parabrisas con el camino de frente y ventanas laterales por donde el mundo pasa en 3D de verdad.
const TRIPHD={c:{}};
function tripSpr(key,w,h,fn){const k=key+'|'+w+'|'+h;let s=TRIPHD.c[k];if(s)return s;const b=hdBuf(Math.max(1,Math.round(w*2)),Math.max(1,Math.round(h*2)));fn(b,b.w,b.h);s=hdToCanvas(b);TRIPHD.c[k]=s;return s}
function tripHouse(seed){return tripSpr('hs'+seed,26,22,(b,w,h)=>{const wc=hdC(pick2(hsh(seed,4),['#e9dcb5','#f3afc0','#a6d8cb','#a9c8ef','#f6c69f','#f2e27a'])),rc=pick2(hsh(seed,5),['#a3acb2','#b07a52','#9a5038','#8f9aa1']);
  hdPlaster(b,4,16,w-8,h-16,'#'+wc.map(v=>(v|0).toString(16).padStart(2,'0')).join(''),seed);
  if(hdIsTeja(rc))hdRoofTeja(b,0,2,w,16,rc,seed);else hdRoofZinc(b,0,2,w,16,rc,seed,hsh(seed,7)<.5);
  hdR(b,10,24,8,7,[70,90,110]);hdR(b,10,24,8,1,[240,240,236]);hdR(b,13,24,1,7,[240,240,236]);hdR(b,w-18,22,8,h-22,hdS(wc,.55));hdR(b,4,h-2,w-8,2,[0,0,0],.25)})}
function tripBuilding(seed){return tripSpr('bd'+seed,24,40,(b,w,h)=>{const c=hdC(pick2(hsh(seed,9),['#b5b0a6','#9fa8b0','#c9b79c','#8f9aa1','#d8c7a8','#c4a48a']));
  hdPlaster(b,0,4,w,h-4,'#'+c.map(v=>(v|0).toString(16).padStart(2,'0')).join(''),seed);hdR(b,0,0,w,5,hdS(c,.7));hdR(b,0,4,w,1,hdS(c,1.15));hdR(b,0,4,3,h,hdS(c,1.1));
  for(let y=10;y<h-12;y+=9)for(let x=5;x<w-6;x+=8){hdR(b,x,y,5,6,[86,112,138]);hdR(b,x,y,5,1,[220,220,214]);hdP(b,x,y+1,[170,196,214])}
  hdR(b,2,h-11,w-4,9,[40,36,40]);hdR(b,3,h-10,w-6,6,[120,150,170]);const aw=hdC(pick2(hsh(seed,3),['#c0473b','#2a8f6a','#2a6fb0','#e2b33a']));hdR(b,1,h-14,w-2,3,aw)})}
function tripBillboard(seed){return tripSpr('bb'+seed,32,20,(b,w,h)=>{const c=hdC(pick2(hsh(seed,6),['#d6453c','#2a6fb0','#2a8f6a','#f2994a','#8e3b8a']));hdR(b,0,0,w,h-6,[244,244,240]);hdR(b,2,2,w-4,h-10,c);
  const t=pick2(hsh(seed,2),['PURA VIDA','CAFÉ','GALLO PINTO','TICO','SALSA','FUTBOL']);hdText(b,4,4,t,[255,255,255]);hdR(b,4,13,w*.5,2,[255,255,255]);hdR(b,6,h-6,2,6,[60,60,66]);hdR(b,w-8,h-6,2,6,[60,60,66])})}
function tripTree(seed){return tripSpr('tr'+seed,20,26,(b,w,h)=>{const palm=hsh(seed,1)<.35;if(palm){hdR(b,9,8,2,h-8,[120,92,60]);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;for(let t=0;t<9;t++)hdP(b,10+Math.cos(a)*t,8+Math.sin(a)*t*.5+t*t*.04,t>5?[90,150,70]:[60,120,58])}}
  else{hdR(b,9,14,3,h-14,[96,70,44]);hdEll(b,10,10,9,8,[44,96,48]);hdEll(b,8,8,6,5,[66,128,60]);hdEll(b,6,6,3,2,[110,170,90])}})}
function tripAd(txt,col){return tripSpr('ad'+txt,Math.ceil((hdTextW(txt)+12)/2),9,(b,w,h)=>{hdR(b,0,0,w,h,[250,244,228]);hdR(b,0,0,w,2,[255,255,250]);hdR(b,0,h-2,w,2,[190,180,160]);hdR(b,0,0,3,h,hdC(col));hdText(b,7,(h-7)>>1,txt,hdS(hdC(col),.85))})}
function tripLED(txt){return tripSpr('led'+txt,Math.ceil((hdTextW(txt)+10)/2),7,(b,w,h)=>{hdR(b,0,0,w,h,[16,14,18]);for(let y=1;y<h;y+=2)for(let x=1;x<w;x+=2)hdP(b,x,y,[40,30,20]);hdText(b,5,(h-7)>>1,txt,[255,160,40])})}
function tripSticker(txt,bg,fg){return tripSpr('st'+txt,Math.ceil((hdTextW(txt)+6)/2),5,(b,w,h)=>{hdR(b,0,0,w,h,hdC(bg));hdText(b,3,(h-7)>>1,txt,hdC(fg))})}
function tripSeats(tp){if(tp.seats)return tp.seats;const S_=[],rows=[4.3,3.5,2.7,1.95],looks=PAX_LOOKS.slice();
  rows.forEach((z,ri)=>{for(const side of[-1,1])for(const win of[1,0]){const player=ri===3&&side===1&&win===1;let c=null;
    if(player)c=CH.player;else if(Math.random()<.58){const l=looks[(Math.random()*looks.length)|0];c=fillChar(Object.assign({id:'tsx'+ri+side+win+((Math.random()*99)|0),v:1},l,{shirt:pick(['#a9c8ef','#f2c94c','#f4f4f4','#7bb661','#e85d75','#3fb6b0','#2a2a30','#c0473b',l.shirt])}))}
    S_.push({z,side,X:side*(win?.86:.54),c,player,ph:Math.random()*6,hy:Math.random()*.06})}});
  tp.seats=S_;return S_}
function drawTripHD(){const tp=TRIP;if(!tp)return;const W=tp.W,H=tp.H,cv=$('#tcan');if(cv.width!==W*2){cv.width=W*2;cv.height=H*2}
  const g=cv.getContext('2d');g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;
  const mins=tp.t0+tp.p*tp.ride,h=(((mins%1440)+1440)%1440)/60,[sk1,sk2]=vSkyAt(h),nt=vNight(h),q=tp.from==='barrio'?tp.p:1-tp.p,rain=!!S.rain;
  const portrait=H>W,f=W*(portrait?.82:.44),EYE=1.22,ROAD=-.95,vx=W/2,vy=Math.round(H*(portrait?.36:.4)),ZF=5.6,dist=tp.u*.12;
  const bump=tp.bump,sh=(Math.sin(tp.t*29)*.5+bump*Math.sin(tp.t*53)*5);
  const P3=(X,Y,Z)=>[vx+X*f/Z,vy+(EYE-Y)*f/Z];
  const night=nt,fog=c=>vcss(vmix(vmix(c,sk2,.12),[12,16,40],night*.72+(rain?.12:0)));
  const ic=(c,a)=>vcss(vmix(vmix(c,[70,58,64],.1),[26,24,40],night*.42),a);   // color de adentro según la hora
  const curve=Math.sin(tp.t*.16)*1.4+Math.sin(tp.t*.07+1)*.8,roadX=z=>-1.75+curve*z*z*.0025;
  g.fillStyle='#14101c';g.fillRect(0,0,W,H);g.save();g.translate(0,Math.round(sh*2)/2);
  // ================= AFUERA =================
  const sg=g.createLinearGradient(0,0,0,vy);sg.addColorStop(0,vcss(sk1));sg.addColorStop(1,vcss(sk2));g.fillStyle=sg;g.fillRect(0,-10,W,vy+10);
  if(night>.3)for(let i=0;i<60;i++){g.fillStyle=vcss([240,240,255],night*(.3+.6*hsh(i,7)));g.fillRect((hsh(i,3)*W)|0,((hsh(i,5)*vy*.85)|0),.5,.5)}
  if(night<.7&&!rain)for(let k=0;k<7;k++){const cx=((hsh(k,21)*W*1.5-tp.t*(1.5+k%3))%(W*1.5)+W*1.5)%(W*1.5)-W*.25,cy=vy*.12+hsh(21,k)*vy*.45,cw=26+hsh(k,22)*36;
    g.fillStyle=vcss(vmix([255,255,255],sk2,.2),.7*(1-night));for(let i=0;i<6;i++)g.fillRect(cx+i*cw/7,cy-Math.sin(i/5*Math.PI)*5,cw/3,5);g.fillStyle=vcss(vmix([190,200,224],sk2,.4),.45*(1-night));g.fillRect(cx,cy+4,cw,1.5)}
  const hx=curve*-26;   // montañas: se corren con la curva
  // (el color de cada cordillera es el mismo en todas las columnas: se pone una sola vez)
  g.fillStyle=fog(vmix([104,132,170],sk2,.4));for(let x=0;x<W;x+=.5){const X=x+hx,y=vy-10-16*Math.max(0,Math.sin(X*.012+.6))-6*Math.sin(X*.04+1.3)-2*Math.sin(X*.15);g.fillRect(x,y,.5,vy-y+1)}
  g.fillStyle=fog(vmix([80,124,78],[110,116,108],clamp((q-.4)*2,0,1)));for(let x=0;x<W;x+=.5){const X=x+hx*1.6,y=vy-4-6*Math.sin(X*.03+2)-3*Math.sin(X*.09);g.fillRect(x,y,.5,vy-y+1)}
  // suelo y calle (filas de pantalla → distancia)
  const gq=clamp((q-.3)/.45,0,1),cq=clamp((q-.66)/.2,0,1);
  // Las filas no se tapan entre sí, así que se dibujan por capas (zacate, calle, orillas, línea del centro):
  // queda igual que fila por fila, pero las filas seguidas del mismo color se juntan y el color cambia pocas veces.
  {const G1=vmix(vmix([96,156,70],[150,150,140],gq),[168,164,154],cq),G0=vmix(vmix([84,144,64],[138,138,128],gq),[168,164,154],cq),rows=[];
   let gc='',gy=0,gh=0;
   for(let y=vy+.5;y<H+12;y+=.5){const Zg=(EYE-ROAD)*f/(y-vy);if(Zg>260)continue;const band=Math.floor((Zg+dist)/2.4)%2;
     const c=fog(vmix(band?G1:G0,sk2,Math.min(.5,Zg/260)));if(c===gc&&y===gy+gh)gh+=.5;else{if(gh)g.fillRect(0,gy,W,gh);g.fillStyle=gc=c;gy=y;gh=.5}
     const rc=roadX(Zg),x0=vx+(rc-3.7)*f/Zg,x1=vx+(rc+3.7)*f/Zg;rows.push(y,Zg,rc,x0,x1,Math.max(.5,.12*f/Zg))}
   if(gh)g.fillRect(0,gy,W,gh);
   let rcs='';for(let i=0;i<rows.length;i+=6){const c=fog(vmix([66,68,74],sk2,Math.min(.45,rows[i+1]/300)));if(c!==rcs)g.fillStyle=rcs=c;g.fillRect(rows[i+3],rows[i],rows[i+4]-rows[i+3],.5)}
   g.fillStyle=fog([210,210,200]);for(let i=0;i<rows.length;i+=6){const y=rows[i],x0=rows[i+3],x1=rows[i+4],ew=rows[i+5];g.fillRect(x0,y,ew,.5);g.fillRect(x1-ew,y,ew,.5)}
   g.fillStyle=fog([232,197,71]);for(let i=0;i<rows.length;i+=6){const Zg=rows[i+1];if(Math.floor((Zg+dist)/3)%2===0){const ew=rows[i+5];g.fillRect(vx+rows[i+2]*f/Zg-ew/2,rows[i],ew,.5)}}}
  // objetos a los lados del camino, de lejos a cerca
  const objs=[],SP=7,K0=Math.floor(dist/SP);
  for(let i=0;i<28;i++){const idx=K0+i,Zw=idx*SP-dist;if(Zw<4.5||Zw>150)continue;const v=hsh(idx,13),side=hsh(idx,7)<.5?-1:1,bq=q+(hsh(idx,11)-.5)*.2,lat=roadX(Zw)+side*(5.6+hsh(idx,5)*7);
    if(bq<.36)objs.push({z:Zw,x:lat,t:v<.45?'house':v<.8?'tree':'fence',s:idx});else if(bq<.66)objs.push({z:Zw,x:roadX(Zw)+side*(5+hsh(idx,5)*3),t:v<.3?'bill':v<.6?'tree':'lamp',s:idx});
    else objs.push({z:Zw,x:roadX(Zw)+side*(6+hsh(idx,5)*4),t:v<.75?'bld':'lamp',s:idx})}
  for(let i=0;i<8;i++){const idx=Math.floor(dist/22)+i,Zw=idx*22-dist;if(Zw>1&&Zw<160)objs.push({z:Zw,x:roadX(Zw)+4.6,t:'pole',s:idx})}
  // carro que viene de frente
  const oc=(tp.t*.23)%1;if(oc<.55){const Zc=140*(1-oc/.55)+2;objs.push({z:Zc,x:roadX(Zc)-3.6,t:'car',s:Math.floor(tp.t*.23)})}
  objs.sort((a,b)=>b.z-a.z);let poleNear=0;
  for(const o of objs){const s=f/o.z,[sx,sy]=[vx+o.x*s,vy+(EYE-ROAD)*s];if(sx<-200||sx>W+200)continue;const fa=Math.min(.7,o.z/150);g.globalAlpha=1;
    const dimm=night>.4?.45:1,draw=(img,wm,hm)=>{const w=wm*s,hh=hm*s;g.drawImage(img,sx-w/2,sy-hh,w,hh)};
    g.save();if(night>.05||fa>.05){g.filter='none'}
    if(o.t==='house')draw(tripHouse(o.s&31),8,6.8);else if(o.t==='tree')draw(tripTree(o.s&15),5.5,7);
    else if(o.t==='bld')draw(tripBuilding(o.s&31),11,18+hsh(o.s,8)*12);else if(o.t==='bill'){draw(tripBillboard(o.s&15),9,5.6)}
    else if(o.t==='fence'){g.fillStyle=fog([120,92,60]);for(let k=0;k<4;k++)g.fillRect(sx-1.6*s+k*s,sy-1.1*s,Math.max(.5,.08*s),1.1*s);g.fillRect(sx-1.6*s,sy-.8*s,3.2*s,Math.max(.5,.06*s))}
    else if(o.t==='lamp'||o.t==='pole'){const hh=(o.t==='pole'?8:7)*s;g.fillStyle=fog(o.t==='pole'?[122,90,58]:[110,116,124]);g.fillRect(sx,sy-hh,Math.max(.5,.18*s),hh);g.fillRect(sx-1.2*s,sy-hh,2.4*s,Math.max(.5,.12*s));
      if(o.t==='lamp'&&night>.3){g.fillStyle='rgba(255,226,150,.9)';g.fillRect(sx-1.2*s,sy-hh,.6*s,.25*s)}if(o.t==='pole'&&o.z<14)poleNear=Math.max(poleNear,1-o.z/14)}
    else if(o.t==='car'){const w=1.9*s,hh=1.4*s,col=hdC(pick2(hsh(o.s,1),['#e8e8e8','#c8231e','#2e5fae','#26262c','#b9bec4']));g.fillStyle=fog(col);g.fillRect(sx-w/2,sy-hh,w,hh*.75);g.fillStyle=fog(hdS(col,.8));g.fillRect(sx-w*.38,sy-hh*1.25,w*.76,hh*.5);
      g.fillStyle=fog([60,80,100]);g.fillRect(sx-w*.32,sy-hh*1.18,w*.64,hh*.36);g.fillStyle=night>.3?'rgba(255,246,200,1)':fog([240,236,210]);g.fillRect(sx-w*.45,sy-hh*.55,w*.18,hh*.14);g.fillRect(sx+w*.27,sy-hh*.55,w*.18,hh*.14);
      if(night>.3){g.save();g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,240,190,.25)';g.beginPath();g.arc(sx,sy-hh*.5,w*1.2,0,6.283);g.fill();g.restore()}g.fillStyle='rgba(0,0,0,.35)';g.fillRect(sx-w/2,sy-1,w,1)}
    if(night>.05){g.globalCompositeOperation='multiply';g.fillStyle=vcss(vmix([255,255,255],[30,36,80],night*.75));const bb=o.t==='bld'?[11,30]:o.t==='house'?[8,7]:o.t==='bill'?[9,6]:[5.5,8];g.fillRect(sx-bb[0]*s/2,sy-bb[1]*s,bb[0]*s,bb[1]*s);g.globalCompositeOperation='source-over';
      if(o.t==='bld'||o.t==='house'){g.fillStyle='rgba(255,206,130,'+(night*.8)+')';for(let k=0;k<(o.t==='bld'?6:1);k++)if(hsh(o.s,k)<.6)g.fillRect(sx-bb[0]*s*.35+hsh(k,o.s)*bb[0]*s*.6,sy-bb[1]*s*(.2+hsh(o.s+k,2)*.7),.7*s,.8*s)}}
    if(fa>.02&&night<.4){g.fillStyle=vcss(sk2,fa*.55);const bb=o.t==='bld'?[11,30]:[8,8];g.fillRect(sx-bb[0]*s/2,sy-bb[1]*s,bb[0]*s,bb[1]*s)}
    g.restore()}
  // focos del bus en la calle (de noche)
  if(night>.35){g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(vx-.4*f/14,vy+(EYE-ROAD)*f/14,1,vx,vy+(EYE-ROAD)*f/14,f*.45);gr.addColorStop(0,'rgba(255,236,180,'+(night*.32)+')');gr.addColorStop(1,'rgba(255,236,180,0)');g.fillStyle=gr;g.fillRect(0,vy,W,H-vy);g.restore()}
  if(rain){g.fillStyle='rgba(40,54,80,.22)';g.fillRect(0,0,W,H)}
  // ================= ADENTRO =================
  const poly=(pts,fill)=>{g.fillStyle=fill;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()};
  const quadZ=(X0,X1,Y0,Y1,Z,fill)=>{const a=P3(X0,Y1,Z),b=P3(X1,Y0,Z);poly([[a[0],a[1]],[b[0],a[1]],[b[0],b[1]],[a[0],b[1]]],fill)};
  const wallQ=(X,Z0,Z1,Y0,Y1,fill)=>poly([P3(X,Y1,Z0),P3(X,Y1,Z1),P3(X,Y0,Z1),P3(X,Y0,Z0)],fill);
  const ZN=.42,WY0=1.02,WY1=1.86,PILL=[.42,1.3,2.1,2.9,3.7,4.42],XW=1.25;
  // techo y piso
  poly([P3(-XW,2.22,ZN),P3(XW,2.22,ZN),P3(XW,2.22,ZF),P3(-XW,2.22,ZF)],ic([214,210,198]));
  for(let z=.8;z<ZF;z+=.8){const a=P3(-XW,2.22,z),b=P3(XW,2.22,z);g.fillStyle=ic([170,164,150]);g.fillRect(a[0],a[1],b[0]-a[0],.6)}
  for(const tx of[-.46,.46]){poly([P3(tx-.07,2.215,ZN),P3(tx+.07,2.215,ZN),P3(tx+.07,2.215,ZF-.3),P3(tx-.07,2.215,ZF-.3)],night>.3?'rgba(255,246,220,.97)':ic([236,240,244]));
    if(night>.3){g.save();g.globalCompositeOperation='lighter';poly([P3(tx-.3,2.2,ZN),P3(tx+.3,2.2,ZN),P3(tx+.3,2.2,ZF-.3),P3(tx-.3,2.2,ZF-.3)],'rgba(255,240,200,.08)');g.restore()}}
  poly([P3(-XW,0,ZN),P3(XW,0,ZN),P3(XW,0,ZF),P3(-XW,0,ZF)],ic([52,50,56]));poly([P3(-.36,0,ZN),P3(.36,0,ZN),P3(.36,0,ZF),P3(-.36,0,ZF)],ic([64,64,72]));
  for(let z=.5;z<ZF;z+=.12){const a=P3(-.36,0,z),b=P3(.36,0,z);g.fillStyle=ic([48,48,56]);g.fillRect(a[0],a[1],b[0]-a[0],Math.max(.5,.03*f/z))}
  for(const ex of[-.36,.36]){const a=P3(ex,0,ZN),b=P3(ex,0,ZF);g.strokeStyle=ic([232,197,71]);g.lineWidth=1;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
  // paredes: panel bajo con franja, columnas entre ventanas, panel alto con rótulos
  const ads=[['PROHIBIDO FUMAR','#c0473b'],['CEDA EL ASIENTO','#2a6fb0'],['NO HABLE CON EL CHOFER','#c0473b'],['PURA VIDA','#2a8f6a'],['¡CUIDE SUS PERTENENCIAS!','#8e3b8a']];
  for(const side of[-1,1]){const X=side*XW;
    wallQ(X,ZN,ZF,0,WY0,ic([206,198,182]));wallQ(X,ZN,ZF,.62,.7,ic([42,111,176]));wallQ(X,ZN,ZF,.58,.62,ic([214,69,60]));wallQ(X,ZN,ZF,WY0-.06,WY0,ic([150,142,128]));
    wallQ(X,ZN,ZF,WY1,2.22,ic([196,190,176]));
    for(let i=0;i<PILL.length;i++){const z=PILL[i];wallQ(X,z-.09,z+.09,WY0,WY1,ic([186,180,166]));wallQ(X,z-.02,z+.02,WY0,WY1,ic([150,146,136]))}
    for(let i=0;i<PILL.length-1;i++){const z0=PILL[i]+.09,z1=PILL[i+1]-.09;wallQ(X,z0,z1,WY0,WY0+.035,'#1d1a22');wallQ(X,z0,z1,WY1-.035,WY1,'#1d1a22');wallQ(X,z0,z1,WY1-.27,WY1-.25,ic([140,146,152]));
      const a=ads[(i+(side>0?2:0))%ads.length],sp=tripAd(a[0],a[1]),zm=(z0+z1)/2;
      if(i>=2&&i<4){const zn=z0+.06,zf=z1-.06,pa=side>0?P3(X,2.17,zf):P3(X,2.17,zn),pb=side>0?P3(X,2.17,zn):P3(X,2.17,zf),pd=side>0?P3(X,1.93,zf):P3(X,1.93,zn),w0=sp.width/2,h0=sp.height/2;
        g.save();g.transform((pb[0]-pa[0])/w0,(pb[1]-pa[1])/w0,(pd[0]-pa[0])/h0,(pd[1]-pa[1])/h0,pa[0],pa[1]);g.globalAlpha=night>.4?.75:1;g.drawImage(sp,0,0,w0,h0);g.restore()}}
    if(side>0){wallQ(X,4.44,5.5,.05,WY1,'rgba(0,0,0,0)');wallQ(X,4.44,4.5,0,WY1,ic([160,154,140]));wallQ(X,4.97,5.0,0,WY1,ic([150,146,136]))}}   // puerta delantera
  // vidrio: reflejo, suciedad, gotas
  g.save();g.beginPath();for(const side of[-1,1])for(let i=0;i<PILL.length-1;i++){const z0=PILL[i]+.09,z1=PILL[i+1]-.09,pts=[P3(side*XW,WY1,z0),P3(side*XW,WY1,z1),P3(side*XW,WY0,z1),P3(side*XW,WY0,z0)];pts.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()}
  const wsA=P3(-1.15,2.02,ZF),wsB=P3(1.15,.78,ZF);g.rect(wsA[0],wsA[1],wsB[0]-wsA[0],wsB[1]-wsA[1]);g.clip();
  g.fillStyle='rgba(255,255,255,'+(.05+night*.05)+')';g.fillRect(0,0,W,H);if(night>.4){g.fillStyle='rgba(255,226,170,'+(night*.07)+')';g.fillRect(0,0,W,H)}
  if(rain)for(let d=0;d<140;d++){const dx=hsh(d,3)*W,dy=((hsh(3,d)*H+tp.t*(30+hsh(d,4)*40))%H);g.fillStyle='rgba(220,232,250,.55)';g.fillRect(dx,dy,.8,1.2);g.fillStyle='rgba(220,232,250,.2)';g.fillRect(dx-.2,dy-4,.4,4)}
  g.restore();
  // ---- frente: tablero, marco del parabrisas, flecos, espejo, rosario, calcomanías, letrero ----
  quadZ(-XW,XW,0,.78,ZF,ic([44,42,48]));quadZ(-XW,XW,2.02,2.22,ZF,ic([34,32,38]));quadZ(-XW,-1.15,.78,2.02,ZF,ic([34,32,38]));quadZ(1.15,XW,.78,2.02,ZF,ic([34,32,38]));
  {const a=P3(-1.15,2.02,ZF),b=P3(1.15,.78,ZF);g.strokeStyle='#121014';g.lineWidth=1.2;g.strokeRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);
    const pa=P3(-XW,.78,ZF-.25),pb=P3(XW,.86,ZF-.25);poly([[pa[0],pa[1]],[pb[0],pa[1]],[pb[0],pb[1]+3],[pa[0],pb[1]+3]],ic([58,56,62]));   // tablero
    const led=tripLED(tp.to==='chepe'?'SAN JOSÉ':'EL BARRIO'),lp=P3(0,2.16,ZF),lw=led.width/2*Math.min(1,(b[0]-a[0])*.45/(led.width/2));g.drawImage(led,lp[0]-lw/2,lp[1]-1,lw,led.height/2*lw/(led.width/2));
    const fl=['#d6453c','#f2c94c','#2a8f6a','#2a6fb0','#f193b4'];for(let x=a[0]+1,i=0;x<b[0]-1;x+=1.5,i++){const sw=Math.sin(tp.t*3+i*.7)*1.2+sh*.4;g.strokeStyle=fl[i%5];g.lineWidth=.8;g.beginPath();g.moveTo(x,a[1]+.5);g.lineTo(x+sw,a[1]+3.5);g.stroke()}
    const mp=P3(.12,1.95,ZF-.15),mw=.36*f/(ZF-.15),mh=.11*f/(ZF-.15);g.fillStyle='#1d1a22';g.fillRect(mp[0]-mw/2-.5,mp[1]-.5,mw+1,mh+1);g.fillStyle=vcss(vmix([150,170,190],sk2,.3));g.fillRect(mp[0]-mw/2,mp[1],mw,mh);
    const blink=(tp.t%4)<.15;g.fillStyle='#2a1a10';g.fillRect(mp[0]-mw*.22,mp[1]+mh*.25,mw*.44,mh*.18);g.fillStyle=blink?'#b97a4a':'#140a08';g.fillRect(mp[0]-mw*.16,mp[1]+mh*.5,mw*.08,mh*.2);g.fillRect(mp[0]+mw*.08,mp[1]+mh*.5,mw*.08,mh*.2);   // ojos de Don Beto
    const rs=Math.sin(tp.t*1.8)*2+sh*.8;g.strokeStyle='#8a5a2b';g.lineWidth=.5;g.beginPath();g.moveTo(mp[0],mp[1]+mh);g.quadraticCurveTo(mp[0]+rs*.5,mp[1]+mh+5,mp[0]+rs,mp[1]+mh+9);g.stroke();for(let k=0;k<5;k++){g.fillStyle='#c9a46a';g.fillRect(mp[0]+rs*k/5-.4,mp[1]+mh+2+k*1.6,.9,.9)}
    g.fillStyle='#f2c94c';g.fillRect(mp[0]+rs-.4,mp[1]+mh+8.5,.8,2.6);g.fillRect(mp[0]+rs-1.1,mp[1]+mh+9.2,2.2,.7);
    const st1=tripSticker('DIOS ES MI COPILOTO','#f4f4f4','#2a6fb0'),st2=tripSticker('PURA VIDA','#2a8f6a','#ffffff'),k1=Math.min(1,(b[0]-a[0])*.32/(st1.width/2));g.drawImage(st1,b[0]-st1.width/2*k1-2,b[1]-st1.height/2*k1-2,st1.width/2*k1,st1.height/2*k1);
    g.drawImage(st2,a[0]+2,b[1]-st2.height/2*k1-2,st2.width/2*k1,st2.height/2*k1);g.fillStyle='#2a6fb0';g.beginPath();g.arc(a[0]+6,a[1]+6,2.2,0,6.283);g.fill();g.fillStyle='#f4f4f4';g.fillRect(a[0]+5.5,a[1]+4.6,1,2.6);
    if(rain){for(const[px,ph]of[[-.5,0],[.45,.35]]){const pv=P3(px,.8,ZF-.02),ang=-Math.PI/2+Math.sin(tp.t*3.6+ph)*1.05,L=.95*f/ZF;g.strokeStyle='#121014';g.lineWidth=1;g.beginPath();g.moveTo(pv[0],pv[1]);g.lineTo(pv[0]+Math.cos(ang)*L,pv[1]+Math.sin(ang)*L);g.stroke()}}}
  // torniquete y cajita del pasaje
  {const p=P3(.62,.95,4.55),s=f/4.55;g.fillStyle=ic([150,156,162]);g.fillRect(p[0]-.05*s,p[1],.1*s,.95*s);for(let k=0;k<3;k++){const a=tp.t*.2+k*2.09;g.fillRect(p[0],p[1]+.1*s,Math.cos(a)*.3*s,.04*s)}g.fillStyle=ic([90,92,98]);g.fillRect(p[0]-.12*s,p[1]-.12*s,.24*s,.14*s)}
  // ---- Don Beto ----
  const drawPer=(c,dir,fi,X,Ytop,Z,crop,cutY)=>{let img;try{img=hdCharImg(c,dir|0,Math.max(0,fi|0)%7)}catch(e){return{x:0,y:0,sc:1}}const sc=Math.max(1,Math.round(2*.0284*f/Z))/2,p=P3(X,Ytop,Z),top=Math.round((p[1]-3*sc)*2)/2;let rows=crop||58;if(cutY!=null)rows=Math.max(1,Math.min(rows,Math.floor((cutY-top)/sc)));const w=36*sc;g.drawImage(img,0,0,36,rows,Math.round((p[0]-w/2)*2)/2,top,w,rows*sc);return{x:p[0],y:p[1],sc}};
  {const wp=P3(-.62,1.02,5.05),wr=.26*f/5.05;g.strokeStyle='#18161c';g.lineWidth=Math.max(1,.05*f/5.05);g.beginPath();g.ellipse(wp[0],wp[1],wr,wr*.38,0,0,6.283);g.stroke();
    const beto=CH.beto||VEND;drawPer(beto,1,6,-.62,1.4,4.9,44,P3(0,1.08,4.75)[1]);
    const a=P3(-.95,1.1,4.75),b=P3(-.3,.5,4.75);g.fillStyle=ic([40,90,150]);g.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);
    for(let y=a[1]+1;y<b[1]-1;y+=1.5)for(let x=a[0]+1;x<b[0]-1;x+=1.5){g.fillStyle=ic(((x+y)|0)%3?[196,150,96]:[150,104,62]);g.fillRect(x,y,1,1)}   // forro de bolitas
    if(tp.ev&&tp.ev.id==='beto'&&Math.floor(tp.t*3)%2){g.fillStyle='#f2c94c';const rp=P3(-.1,.9,5.2);g.fillRect(rp[0],rp[1]-8,1.5,4);g.fillRect(rp[0]+1,rp[1]-9,2,1);g.fillRect(rp[0]+5,rp[1]-6,1.5,4);g.fillRect(rp[0]+6,rp[1]-7,2,1)}}
  // ---- filas de asientos y pasajeros, de lejos a cerca, con lo que pasa en el pasillo ----
  const seats=tripSeats(tp),ev=tp.ev,ea=ev?tp.t-tp.evS:0,items=[];
  for(const st of seats)items.push({z:st.z,k:'seat',st});
  if(ev&&ev.id==='vendor'){const z=Math.max(1.0,4.5-ea*.42);items.push({z,k:'vendor',z0:z})}
  if(ev&&ev.id==='guitar')items.push({z:2.85,k:'guitar'});
  if(ev&&ev.id==='hen')items.push({z:2.5+Math.sin(ea*1.7)*1.2,k:'hen'});
  items.sort((a,b)=>b.z-a.z);
  const jolt=bump*Math.abs(Math.sin(tp.t*14))*.12;
  for(const it of items){if(it.k==='seat'){const st=it.st,side=st.side,x0=side>0?.38:-1.18,x1=side>0?1.18:-.38;
      if(st.c&&(st.X*side>.7||!seats.find(o=>o.z===st.z&&o.side===side&&o.X*side>.7&&o!==st)||true)){const bob=Math.sin(tp.t*29+st.ph)*.006+jolt;
        if(st.c&&(Math.abs(st.X)>.7)){const r=drawPer(st.player?CH.player:st.c,1,6,st.X,1.36+st.hy+bob,st.z+.18,40,P3(0,1.0,st.z)[1]);if(st.player){const bb=Math.sin(tp.t*5)*1.5,yy=r.y-r.sc*3-7+bb;g.fillStyle='#14101c';g.beginPath();g.moveTo(r.x-4.5,yy-1);g.lineTo(r.x+4.5,yy-1);g.lineTo(r.x,yy+5);g.closePath();g.fill();g.fillStyle='#f2c94c';g.beginPath();g.moveTo(r.x-3,yy);g.lineTo(r.x+3,yy);g.lineTo(r.x,yy+3.6);g.closePath();g.fill()}}}
      if(Math.abs(st.X)>.7){const aisle=seats.find(o=>o.z===st.z&&o.side===side&&Math.abs(o.X)<.7);if(aisle&&aisle.c)drawPer(aisle.c,1,6,aisle.X,1.36+aisle.hy+Math.sin(tp.t*29+aisle.ph)*.006+jolt,aisle.z+.18,40,P3(0,1.0,aisle.z)[1]);
        if(ev&&ev.id==='sleep'&&aisle&&st.player){const p=P3(aisle.X,1.6,aisle.z);g.fillStyle='#f4ead2';g.font='bold '+Math.max(5,Math.round(9*f/160))+'px monospace';for(let i=0;i<3;i++){const t2=(ea*.8+i*.33)%1;g.globalAlpha=1-t2;g.fillText('z',p[0]-i*4,p[1]-t2*16)}g.globalAlpha=1}
        // respaldo con tapete y agarradera
        const a=P3(x0,1.02,st.z),b=P3(x1,.38,st.z),V=['#1f3f78','#2a5296','#3466b0','#4a7cc4'];const w=b[0]-a[0],hh=b[1]-a[1];
        g.fillStyle=ic(hdC(V[1]));g.beginPath();g.moveTo(a[0],a[1]+hh*.12);g.quadraticCurveTo(a[0],a[1],a[0]+w*.1,a[1]);g.lineTo(b[0]-w*.1,a[1]);g.quadraticCurveTo(b[0],a[1],b[0],a[1]+hh*.12);g.lineTo(b[0],b[1]);g.lineTo(a[0],b[1]);g.closePath();g.fill();
        for(let k=1;k<6;k++){g.fillStyle=ic(hdC(V[k%2?0:2]));g.fillRect(a[0]+w*k/6,a[1]+hh*.3,Math.max(.5,w*.012),hh*.66)}g.fillStyle=ic(hdC(V[3]));g.fillRect(a[0]+w*.05,a[1]+hh*.03,w*.9,Math.max(.5,hh*.04));
        g.fillStyle=ic([244,240,230]);g.fillRect(a[0]+w*.14,a[1]+hh*.02,w*.72,hh*.24);g.fillStyle=ic([214,206,190]);for(let x=a[0]+w*.14;x<a[0]+w*.86;x+=Math.max(1,w*.04))g.fillRect(x,a[1]+hh*.26,Math.max(.5,w*.02),Math.max(.5,hh*.02));
        const ae=P3(side>0?.38:-.38,1.02,st.z),be=P3(side>0?.38:-.38,.38,st.z+.12);g.fillStyle=ic(hdC(V[0]));g.fillRect(Math.min(ae[0],be[0]),ae[1],Math.abs(be[0]-ae[0])+.5,be[1]-ae[1]);
        const ha=P3(x0+.08,1.08,st.z),hb=P3(x1-.08,1.08,st.z);g.strokeStyle=ic([200,206,212]);g.lineWidth=Math.max(.8,.035*f/st.z);g.beginPath();g.moveTo(ha[0],ha[1]+2);g.lineTo(ha[0],ha[1]);g.lineTo(hb[0],hb[1]);g.lineTo(hb[0],hb[1]+2);g.stroke();
        const pa=P3(side*.37,2.22,st.z-.04),pb=P3(side*.37,0,st.z-.04);g.fillStyle=ic([180,186,194]);g.fillRect(pa[0]-Math.max(.5,.02*f/st.z),pa[1],Math.max(1,.04*f/st.z),pb[1]-pa[1]);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(pa[0]-Math.max(.5,.02*f/st.z),pa[1],Math.max(.5,.012*f/st.z),pb[1]-pa[1])}}
    else if(it.k==='vendor'){const r=drawPer(VEND,0,Math.floor(ea*6)%6,.02,1.66,it.z0);const s=f/it.z0;g.fillStyle='#8a6a45';g.fillRect(r.x+.12*s,r.y+.62*s,.34*s,.18*s);g.fillStyle='#6a4a2c';g.fillRect(r.x+.12*s,r.y+.78*s,.34*s,.04*s);for(let i=0;i<4;i++){g.fillStyle='#e0a34f';g.fillRect(r.x+.14*s+i*.08*s,r.y+.56*s,.06*s,.07*s)}}
    else if(it.k==='guitar'){const r=drawPer(GUIT,0,6,.05,1.66,it.z);const s=f/it.z;g.fillStyle='#8a5a2b';g.beginPath();g.ellipse(r.x-.06*s,r.y+.72*s,.17*s,.12*s,.3,0,6.283);g.fill();g.fillStyle='#2a1a10';g.beginPath();g.arc(r.x-.06*s,r.y+.72*s,.04*s,0,6.283);g.fill();g.fillStyle='#5c3d24';g.save();g.translate(r.x-.06*s,r.y+.72*s);g.rotate(-.5);g.fillRect(0,-.02*s,.42*s,.04*s);g.restore();
      if(Math.floor(tp.t*3)%2){g.fillStyle='#f4ead2';g.fillRect(r.x+.3*s,r.y+.1*s,.04*s,.1*s);g.fillRect(r.x+.3*s,r.y+.08*s,.08*s,.03*s)}}
    else if(it.k==='hen'&&typeof aniSprite==='function'){const hs=aniSprite('hen','#f4f4f4',Math.floor(ea*12)%4,Math.cos(ea*2.4)<0),z=it.z,p=P3(Math.sin(ea*2.4)*.6,.25+Math.abs(Math.sin(ea*6))*.9,z),k=Math.max(1,Math.round(2*.04*f/z))/2;g.drawImage(hs,p[0]-hs.width/2*k,p[1]-hs.height*k,hs.width*k,hs.height*k);
      for(let i=0;i<4;i++){g.fillStyle='rgba(244,244,244,.85)';g.fillRect(p[0]+Math.sin(ea*7+i)*12,p[1]+((ea*30+i*13)%30),1.5,1)}}}
  // agarraderas colgantes del techo
  for(const side of[-1,1])for(let z=.9;z<4.6;z+=.6){const a=P3(side*.62,2.18,z),sw=Math.sin(tp.t*2.2+z*3)*.06+sh*.01,b=P3(side*.62+sw,1.92,z),r=Math.max(1,.05*f/z);g.strokeStyle=ic([60,60,68]);g.lineWidth=Math.max(.5,.012*f/z);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();g.strokeStyle=ic([228,228,222]);g.lineWidth=Math.max(.6,.018*f/z);g.beginPath();g.arc(b[0],b[1]+r,r,0,6.283);g.stroke()}
  {const a=P3(-.62,2.18,ZN),b=P3(-.62,2.18,ZF),c=P3(.62,2.18,ZN),d=P3(.62,2.18,ZF);g.strokeStyle=ic([200,206,212]);g.lineWidth=1.2;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.moveTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.stroke()}
  // luz de la tarde entrando por las ventanas (parpadea con los postes)
  const gold=Math.max(0,1-night*1.4)*clamp(h<12?0:(h-14)/3,0,1)*(rain?0:1);
  if(gold>.02){g.save();g.globalCompositeOperation='lighter';const al=gold*.16*(1-poleNear*.75);for(let i=1;i<PILL.length-1;i++){const z0=PILL[i]+.4,z1=PILL[i+1]+.4;poly([P3(1.2,0,z0),P3(1.2,0,z1),P3(.2,0,z1+.5),P3(.2,0,z0+.5)],'rgba(255,190,110,'+al+')');
      poly([P3(-1.24,1.86,z0+.6),P3(-1.24,1.86,z1+.6),P3(-1.24,1.0,z1+.9),P3(-1.24,1.0,z0+.9)],'rgba(255,200,120,'+al*.8+')')}g.restore()}
  if(ev&&ev.id==='hueco'){g.fillStyle='rgba(255,255,255,'+Math.max(0,.35-ea*.4)+')';g.fillRect(0,0,W,H)}
  // viñeta suave
  const vg=g.createRadialGradient(vx,vy,Math.min(W,H)*.3,vx,vy,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,6,16,.45)');g.fillStyle=vg;g.fillRect(0,-10,W,H+20);
  g.restore()}
