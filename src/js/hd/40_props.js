// ---------- objetos del barrio ----------
function hdBench(b,X,Y){const WD=['#4a2e1e','#6e4428','#8e5a34','#a87040','#c48a52'].map(hdC),CO=['#7e776a','#968e80','#aaa292','#c4bcac','#d8d2c4'].map(hdC);
  hdR(b,X+4,Y+24,28,3,[30,40,30],.3);
  for(const lx of[X+5,X+24])for(let y=Y+8;y<Y+24;y++)for(let i=0;i<4;i++)hdP(b,lx+i,y,CO[4-i]);
  for(let x=X+2;x<X+30;x++){hdP(b,x,Y+6,WD[3]);hdP(b,x,Y+7,WD[2]);hdP(b,x,Y+9,WD[3]);hdP(b,x,Y+10,WD[2]);for(const y of[Y+14,Y+17,Y+20]){hdP(b,x,y,WD[4]);hdP(b,x,y+1,WD[3])}}
  hdR(b,X+2,Y+22,28,1,WD[0])}
function hdGoal(b,X,Y,h,left){const P=[244,244,240],PS=[196,196,200];const fx=left?X+10:X+20,bx=left?X+2:X+28;
  for(let y=Y+2;y<Y+h-4;y+=3)for(let x=Math.min(fx,bx);x<=Math.max(fx,bx);x++)hdP(b,x,y,[220,220,226],.45);
  for(let x=Math.min(fx,bx);x<=Math.max(fx,bx);x+=3)for(let y=Y+2;y<Y+h-4;y++)hdP(b,x,y,[220,220,226],.35);
  hdR(b,fx,Y-6,3,h+2,P);hdR(b,fx+2,Y-6,1,h+2,PS);hdR(b,Math.min(fx,bx),Y-6,Math.abs(fx-bx)+3,2,P);hdR(b,Math.min(fx,bx),Y+h-6,Math.abs(fx-bx)+3,2,P);hdR(b,bx,Y-4,2,h,PS)}
function hdKiosco(b,X,Y,W,H){ // puesto del parque: piso, mostrador y bancas (el toldo va arriba)
  hdR(b,X+4,Y+12,W-8,H-14,[196,186,164]);for(let i=X+4;i<X+W-4;i+=8)hdR(b,i,Y+12,1,H-14,[170,160,140]);
  hdR(b,X+10,Y+H-30,W-20,16,[232,224,206]);hdR(b,X+10,Y+H-30,W-20,2,[250,246,236]);hdR(b,X+10,Y+H-16,W-20,2,[150,140,124]);
  for(let i=0;i<4;i++){const c=[[214,69,69],[242,201,76],[123,182,97],[63,127,209]][i];hdR(b,X+16+i*16,Y+H-36,8,6,c);hdR(b,X+16+i*16,Y+H-36,8,1,hdS(c,1.3))}
  for(const px of[X+8,X+W-11])hdR(b,px,Y+20,3,H-22,[176,52,44])}
function hdKioscoTop(g,X,Y,W){const b=hdBuf(W+16,34);for(let y=0;y<26;y++)for(let x=0;x<W+16;x++){const st=((x/8)|0)%2,f=1.08-.22*y/26;hdP(b,x,y,hdS(st?[232,220,196]:[192,71,59],f))}
  for(let x=0;x<W+16;x++){const st=((x/8)|0)%2,L=4+Math.round(3*Math.sin(((x%8)/8)*Math.PI));for(let j=0;j<L;j++)hdP(b,x,26+j,hdS(st?[214,200,176]:[160,52,44],.95-j*.04))}
  hdR(b,0,0,W+16,2,[120,40,32]);g.drawImage(hdToCanvas(b),X-8,Y-22)}
function hdBusStop(b,X,Y,W){hdR(b,X,Y+2,W,26,[176,170,158]);hdR(b,X,Y+2,W,1,[206,200,188]);
  hdR(b,X+4,Y+4,W-8,8,[120,140,150]);for(let i=X+4;i<X+W-4;i+=16)hdR(b,i,Y+4,2,8,[70,80,86]);   // panel trasero
  for(let x=X+10;x<X+W-10;x++){hdP(b,x,Y+16,[168,112,64]);hdP(b,x,Y+17,[140,90,52]);hdP(b,x,Y+19,[168,112,64]);hdP(b,x,Y+20,[140,90,52])}
  for(const lx of[X+14,X+W-16])hdR(b,lx,Y+21,2,6,[60,60,62]);
  hdR(b,X+W-8,Y-26,3,52,[42,111,176]);hdR(b,X+W-8,Y-26,1,52,[90,150,210])}
function hdBusStopTop(g,X,Y,W){const b=hdBuf(W+8,26);for(let y=0;y<14;y++)for(let x=0;x<W+8;x++)hdP(b,x,y,hdS([140,150,156],1.08-.25*y/14));hdR(b,0,13,W+8,3,[88,96,100]);
  for(let i=6;i<W;i+=24)hdR(b,i,16,3,10,[80,86,90]);g.drawImage(hdToCanvas(b),X-4,Y-14);
  const s=hdBuf(18,12);hdR(s,0,0,18,12,[244,234,210]);hdR(s,0,0,18,1,[255,250,236]);hdR(s,0,11,18,1,[160,150,130]);hdText(s,3,3,'BUS',[42,111,176]);g.drawImage(hdToCanvas(s),X+W-15,Y-36)}
function hdSignpost(b,X,Y,txt){hdR(b,X+15,Y+8,3,22,[96,66,40]);hdR(b,X+15,Y+8,1,22,[130,92,58]);const w=Math.max(30,hdTextW(txt)+8);hdR(b,X+16-w/2,Y-2,w,12,[196,157,108]);hdR(b,X+16-w/2,Y-2,w,1,[220,186,140]);hdR(b,X+16-w/2,Y+9,w,1,[120,88,56]);
  hdText(b,X+16-w/2+4,Y+1,txt,[60,36,20])}
// postes de concreto con cruceta (lo de abajo va al suelo, lo alto al lienzo de arriba)
function hdPoleTop(g,x,y,seed){const b=hdBuf(48,112),cx=24;
  for(let j=8;j<112;j++)for(let i=0;i<6;i++){const c=[[226,220,204],[204,196,180],[178,170,154],[160,152,136],[134,126,112],[110,104,92]][i];hdP(b,cx-3+i,j,j%26===0?hdS(c,.85):c)}
  for(let i=4;i<44;i++){hdP(b,i,12,[122,90,58]);hdP(b,i,13,[92,64,40]);hdP(b,i,14,[64,44,28])}for(const ix of[7,16,32,41]){hdR(b,ix-1,8,3,4,[220,228,232]);hdP(b,ix,7,[250,252,252])}
  if(hsh(seed,1)<.4){for(let j=26;j<46;j++)for(let i=0;i<10;i++)hdP(b,cx+3+i,j,[[184,188,188],[170,174,174],[154,158,158],[140,144,144],[126,130,130],[114,118,118],[104,108,108],[96,100,100],[88,92,92],[80,84,84]][i]);hdR(b,cx+3,26,10,1,[214,218,218])}
  if(hsh(seed,2)<.55){for(let t=0;t<16;t++){hdP(b,cx+3+t*.6,48+t,[74,78,78]);hdP(b,cx+4+t*.6,48+t,[46,50,50])}hdR(b,cx+8,62,11,5,[90,94,94]);hdR(b,cx+9,67,9,1,[240,224,160])}
  hdR(b,cx-3,70,6,6,[230,206,70]);hdR(b,cx-3,73,6,3,[40,40,40]);   // placa del ICE
  g.drawImage(hdToCanvas(b),x-cx,y-104)}
function hdCables(g,m){g.save();g.lineWidth=1;const rows={};for(const[x,y]of POLES)(rows[y]=rows[y]||[]).push(x*HT+16);
  for(const y in rows){const xs=rows[y].sort((a,c)=>a-c),Y=+y*HT+16-96;
    for(let k=0;k<3;k++){g.strokeStyle=k===2?'rgba(40,36,38,.9)':'rgba(22,20,24,.92)';g.beginPath();for(let i=0;i<xs.length-1;i++){const a=xs[i]-16+k*13,c=xs[i+1]-16+k*13;if(c-a>16*HT)continue;g.moveTo(a,Y);g.quadraticCurveTo((a+c)/2,Y+16+k*2,c,Y)}g.stroke()}}
  g.restore()}
// ---------- detalles: flores, macetas, eras, tendedero ----------
function hdDetails(b,m){
  for(let i=0;i<36;i++){const x=2+Math.floor(hsh(i,41)*58),y=2+Math.floor(hsh(i,53)*39);if(ti(m,x,y)!==0)continue;const X=x*HT+6,Y=y*HT+10;
    for(let j=0;j<5;j++){const fx=X+((hsh(i,j)*20)|0),fy=Y+((hsh(j,i)*12)|0);hdR(b,fx,fy+2,1,4,[60,110,56]);const c=j%2?[242,201,76]:[241,147,180];hdP(b,fx-1,fy,c);hdP(b,fx+1,fy,c);hdP(b,fx,fy-1,c);hdP(b,fx,fy+1,c);hdP(b,fx,fy,[255,240,180])}}
  for(const bd of BUILD)hdPlantPot(b,(bd.x+bd.w-1)*HT+8,(bd.y+bd.h)*HT+26,true);
  for(let i=0;i<3;i++){const X=(3+i*2)*HT,Y=7*HT;hdR(b,X,Y+4,32,26,[74,54,40]);hdR(b,X+2,Y+6,28,22,[110,80,58]);for(let j=0;j<4;j++){hdR(b,X+3,Y+8+j*5,26,2,[86,62,46]);for(let k=0;k<6;k++){const px=X+5+k*4,py=Y+7+j*5;hdP(b,px,py,[92,150,70]);hdP(b,px-1,py-1,[120,176,84]);hdP(b,px+1,py-1,[70,126,58])}}}
  const lx0=10*HT,ly=5*HT;hdR(b,lx0,ly,3,40,[111,85,62]);hdR(b,lx0+4*HT,ly,3,40,[111,85,62]);hdLine(b,lx0+2,ly+5,lx0+4*HT,ly+5,[230,220,200]);
  for(let i=0;i<5;i++){const c=[[244,234,210],[241,147,180],[115,201,223],[214,69,69],[123,182,97]][i];const x=lx0+10+i*22;hdR(b,x,ly+6,16,18,c);hdR(b,x,ly+6,16,2,hdS(c,1.1));hdR(b,x+14,ly+8,2,16,hdS(c,.8));hdR(b,x+4,ly+3,1,4,[200,170,120]);hdR(b,x+11,ly+3,1,4,[200,170,120])}}
function hdPropsBase(B,m){
  for(const o of m.objs){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT;
    if(o.type==='bench'){hdBench(B,X,Y);HD_OBJ_HD.add('bench')}
    else if(o.type==='goal'){hdGoal(B,X,Y,H,o.x<50);HD_OBJ_HD.add('goal')}
    else if(o.type==='kiosco'){hdKiosco(B,X,Y,W,H);HD_OBJ_HD.add('kiosco')}
    else if(o.type==='busstop'){hdBusStop(B,X,Y,W);HD_OBJ_HD.add('busstop')}
    else if(o.type==='sign'){hdSignpost(B,X,Y,o.x<40?'MIRADOR':'SE VENDE');HD_OBJ_HD.add('sign')}}
  HD_DONE.objs=true;
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++)if(ti(m,tx,ty)===7)hdBush(B,tx*HT+16,ty*HT+16,tx*31+ty,true);
  hdDetails(B,m);HD_DONE.details=true;
  hdBorder(B,m);
  for(const[x,y]of POLES){hdEll(B,x*HT+17,y*HT+30,6,2,[40,36,34],.35);hdR(B,x*HT+13,y*HT+22,8,8,[150,144,132]);hdR(B,x*HT+13,y*HT+22,8,1,[190,184,170])}
  // troncos de los árboles (base) — copas arriba
  HD_TREES.length=0;for(const[x,y]of TREES){if(x===0||y===0||x===m.w-1||y===m.h-1)continue;const sd=x*37+y*101;
    if(hsh(x,y)<.35){const sp=hdPalmSprite(sd);HD_TREES.push({palm:1,sp,x:x*HT+16-sp.ax,y:y*HT+30-sp.ay,tx:x,ty:y})}
    else{const kind=hsh(y,x)<.4?0:(hsh(x*3,y)<.5?1:2),s=.92+hsh(x,y*3)*.26,sp=hdTreeSprite(sd,kind,s,kind===0);const ox=x*HT+16-sp.ax,oy=y*HT+30-sp.ay;hdBlit(B,sp.t,ox,oy);HD_TREES.push({palm:0,sp,x:ox,y:oy,tx:x,ty:y})}}
  HD_DONE.trees=true}
const HD_TREES=[];
function hdTop(tg,m){tg.imageSmoothingEnabled=false;
  for(const t of HD_TREES)tg.drawImage(hdToCanvas(t.sp.c),t.x,t.y);
  for(const o of m.objs){const X=o.x*HT,Y=o.y*HT,W=o.w*HT;if(o.type==='busstop')hdBusStopTop(tg,X,Y,W);if(o.type==='kiosco')hdKioscoTop(tg,X,Y,W)}
  for(const[x,y]of POLES)hdPoleTop(tg,x*HT+16,y*HT+28,x*7+y);
  hdCables(tg,m);
  hdHomeTop(tg);hdEntradaTop(tg)}
