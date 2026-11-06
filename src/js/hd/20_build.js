// ---------- casas, pulpería y tiendas ----------
function hdPlaster(b,x,y,w,h,col,seed){const c=hdC(col);for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=x+i,Y=y+j,r=hdr(X,Y),n=hdVN(X,Y,18,seed),n2=hdVN(X,Y,6,seed+9);
  let f=.92+n*.08+(r-.5)*.035;if(n2>.82)f-=.035;if(n2<.12)f+=.02;hdP(b,X,Y,[c[0]*f,c[1]*f*.995,c[2]*f*.985])}}
function hdDrip(b,x,y,w,len,seed){for(let i=0;i<w;i++){const l=(len*(.3+.7*hsh(x+i,seed)))|0;for(let t=0;t<l;t++)hdMP(b,x+i,y+t,[1-.1*(1-t/l),1-.1*(1-t/l),1-.08*(1-t/l)])}}
function hdShadeBand(b,x,y,w,h,s0,s1){for(let j=0;j<h;j++){const f=1-(s0+(s1-s0)*j/Math.max(1,h-1));hdM(b,x,y+j,w,1,[f,f,f*1.04])}}
function hdIsTeja(col){const c=hdC(col);return c[0]-c[2]>30&&c[0]<215}
function hdRoofZinc(b,x,y,w,h,col,seed,painted){const c=hdC(col),ridge=(h*.24)|0;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=x+i,Y=y+j,k=(i+seed)%6,cor=[1.12,1.05,.96,.84,.9,1.02][k];
    let f=j<ridge?.72+.12*(j/ridge):(1.02-.22*(j-ridge)/(h-ridge));if(j===ridge||j===ridge+1)f=1.18;
    const sheet=j>ridge&&((j-ridge)%22===0);let cc=hdS(c,f*cor*(.97+hdr(X,Y)*.05));if(sheet)cc=hdS(c,.62);hdP(b,X,Y,cc)}
  const rng=(a,bb)=>hsh(seed*31+a,bb);
  if(!painted)for(let n=0;n<w*h/420;n++){const rx=x+((rng(n,1)*w)|0),ry=y+ridge+((rng(n,2)*(h-ridge-8))|0),L=4+((rng(n,3)*16)|0);
    for(let t=0;t<L&&ry+t<y+h;t++){hdP(b,rx,ry+t,[138,74,36],.55*(1-t/L)+.12);hdP(b,rx+1,ry+t,[168,92,42],.35*(1-t/L))}}
  else for(let n=0;n<w*h/700;n++){const rx=x+((rng(n,4)*w)|0),ry=y+ridge+((rng(n,5)*(h-ridge-6))|0);hdR(b,rx,ry,3+((rng(n,6)*5)|0),2,hdS(c,.82),.6)}  // pintura descascarada
  for(let n=0;n<Math.max(1,w/60);n++){const rx=x+8+((rng(n,7)*(w-20))|0),ry=y+ridge+6+((rng(n,8)*(h-ridge-16))|0);  // piedras y parche
    if(rng(n,9)<.5){hdEll(b,rx+3,ry+2,3.2,2.2,[112,108,104]);hdP(b,rx+2,ry+1,[160,156,150]);hdR(b,rx+1,ry+4,6,1,[40,36,34],.4)}
    else{hdR(b,rx,ry,10,7,hdS(c,.9));hdR(b,rx,ry,10,1,hdS(c,1.15));for(let k=0;k<10;k+=3)hdP(b,rx+k,ry+3,[60,60,62])}}
  for(let i=6;i<w;i+=24)for(let j=ridge+6;j<h-3;j+=22)hdP(b,x+i+(seed%3),y+j,hdS(c,1.3));   // tornillos con arandela
}
function hdRoofTeja(b,x,y,w,h,col,seed){const c=hdC(col),ridge=(h*.22)|0;
  for(let j=0;j<h;j++){const row=((j-ridge)/7)|0,ox=(row&1)*5;for(let i=0;i<w;i++){const X=x+i,Y=y+j;let f;
    if(j<ridge)f=.7+.14*(j/ridge)+(((i+ox)%10)<5?.04:0);else if(j<ridge+3)f=1.12;
    else{const u=((i+ox)%10)/10,v=((j-ridge)%7)/7;f=(.84+.34*Math.sin(u*Math.PI))*(v>.78?.66:1)*(1.02-.14*(j-ridge)/(h-ridge))}
    let cc=hdS(c,f*(.95+hdr(X,Y)*.08));if(hsh(X*7+seed,Y*13)<.012)cc=[92,104,62];hdP(b,X,Y,cc)}}
  for(let n=0;n<w/18;n++){const rx=x+((hsh(seed,n)*w)|0),ry=y+ridge+6+((hsh(n,seed)*(h-ridge-10))|0);hdEll(b,rx,ry,3,2,[86,102,58],.75)}}   // musgo
function hdEave(b,x,y,w,roofCol){const c=hdC(roofCol);hdR(b,x,y,w,3,hdS(c,.5));hdR(b,x,y,w,1,hdS(c,.75));hdR(b,x,y+3,w,2,[150,150,148]);hdR(b,x,y+3,w,1,[190,190,186])}
function hdWindow(b,x,y,w,h,o){o=o||{};const fr=hdC(o.frame||'#efe9dc');
  hdR(b,x-2,y-2,w+4,h+4,fr);hdR(b,x-2,y-2,w+4,1,hdS(fr,1.06));hdR(b,x+w+1,y-2,1,h+4,hdS(fr,.8));
  if(o.style==='vidrio'){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const t=j/h;let c=t<.45?hdMix([168,196,214],[226,214,186],t*1.6):[64,78,92];if(i===((j*.5+w*.6)|0)%w||i===((j*.5+w*.6+1)|0)%w)c=hdS(c,1.25);hdP(b,x+i,y+j,c)}
    if(o.curtain){const cc=hdC(o.curtain);for(let j=0;j<h;j++){const ww=Math.max(2,(w*.32*(1-.5*Math.sin(Math.min(1,j/h)*Math.PI)))|0);for(let i=0;i<ww;i++){hdP(b,x+i,y+j,hdS(cc,.86+.14*Math.sin(i*1.4)));hdP(b,x+w-1-i,y+j,hdS(cc,.8+.14*Math.sin(i*1.4)))}}}
    hdR(b,x+(w>>1),y,1,h,fr)}
  else{for(let j=0;j<h;j++){const k=j%4,top=j<h*.55;const c=k===0?[60,56,64]:top?(k===1?[236,214,170]:k===2?[208,182,146]:[170,150,128]):(k===1?[200,184,160]:k===2?[164,148,132]:[120,110,104]);hdR(b,x,y+j,w,1,c)}
    hdR(b,x+(w>>1),y,1,h,fr)}
  if(o.reja){for(let i=2;i<w;i+=4){hdR(b,x+i,y-1,1,h+2,[30,26,26])}hdR(b,x,y+(h>>1),w,1,[30,26,26]);hdR(b,x,y+2,w,1,[30,26,26]);
    if(w>14)for(let i=4;i<w-2;i+=8){hdP(b,x+i+1,y+h-5,[30,26,26]);hdP(b,x+i,y+h-4,[30,26,26]);hdP(b,x+i+2,y+h-4,[30,26,26]);hdP(b,x+i+1,y+h-3,[30,26,26])}}
  hdR(b,x-3,y+h+2,w+6,2,hdS(fr,.92));hdR(b,x-3,y+h+2,w+6,1,hdS(fr,1.05));hdShadeBand(b,x-3,y+h+4,w+6,3,.28,.05);
  if(o.box){const bc=[150,82,58];hdR(b,x-1,y+h+4,w+2,5,bc);hdR(b,x-1,y+h+4,w+2,1,hdS(bc,1.25));hdShadeBand(b,x-1,y+h+9,w+2,2,.25,.05);
    for(let i=0;i<w;i+=2){const hh=2+((hsh(x+i,y)*4)|0);for(let k=0;k<hh;k++)hdP(b,x+i,y+h+3-k,k%2?[84,128,64]:[62,104,52]);if(hsh(i,x)<.35)hdP(b,x+i,y+h+1-hh,hsh(i,y)<.5?[236,96,120]:[244,206,72])}}
  if(!o.noDrip)hdDrip(b,x-1,y+h+4,w+2,8+((hsh(x,y)*10)|0),x+y);
  return{x:x,y:y,w:w,h:h}}
function hdDoor(b,x,y,w,h,col,style){const c=hdC(col);hdR(b,x-3,y-3,w+6,h+3,[222,214,198]);hdR(b,x-3,y-3,w+6,1,[240,234,222]);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const r=hdr(x+i,y+j);let f=.94+r*.08-(i===0?-.1:0)-(i===w-1?.2:0);hdP(b,x+i,y+j,hdS(c,f))}
  if(style==='metal'){for(let j=3;j<h-2;j+=4)hdR(b,x+2,y+j,w-4,1,hdS(c,.78));hdR(b,x+2,y+3,w-4,10,[160,190,206]);for(let i=x+3;i<x+w-3;i+=3)hdR(b,i,y+3,1,10,[30,28,30])}
  else{for(const[py,ph]of[[4,(h*.38)|0],[((h*.38)|0)+8,h-((h*.38)|0)-12]]){hdR(b,x+3,y+py,w-6,ph,hdS(c,.82));hdR(b,x+3,y+py,w-6,1,hdS(c,.66));hdR(b,x+3,y+py+ph-1,w-6,1,hdS(c,1.12));hdR(b,x+w-4,y+py,1,ph,hdS(c,1.06))}}
  hdR(b,x+w-5,y+(h>>1),2,3,[220,190,90]);hdP(b,x+w-5,y+(h>>1),[255,236,150]);
  hdR(b,x-4,y+h,w+8,3,[176,170,160]);hdR(b,x-4,y+h,w+8,1,[214,208,198]);   // grada
  return{x,y,w,h}}
function hdLamp(b,x,y){hdR(b,x,y,5,7,[40,36,34]);hdR(b,x+1,y+2,3,4,[250,232,170]);hdR(b,x+1,y-2,3,2,[60,56,54])}
function hdPipe(b,x,y0,y1){hdR(b,x,y0,3,y1-y0,[156,158,156]);hdR(b,x,y0,1,y1-y0,[196,198,196]);hdR(b,x+2,y0,1,y1-y0,[110,110,108]);for(let y=y0+12;y<y1;y+=26)hdR(b,x-1,y,5,2,[120,120,118])}
function hdMeter(b,x,y){hdR(b,x,y,9,12,[184,188,190]);hdR(b,x,y,9,1,[220,224,226]);hdR(b,x+2,y+2,5,4,[40,46,52]);hdR(b,x+3,y+3,2,1,[160,220,170]);hdR(b,x+8,y,1,12,[120,124,126]);hdR(b,x+4,y+12,1,8,[30,30,30])}
function hdDish(b,x,y){hdEll(b,x+7,y+6,7,6,[214,214,210]);hdEll(b,x+6,y+5,4,3.5,[238,238,234]);hdR(b,x+6,y+6,2,9,[90,90,92]);hdR(b,x+3,y+14,8,2,[70,70,72]);hdLine(b,x+7,y+6,x+12,y+1,[60,60,62])}
function hdBalcony(b,x,y,w){hdR(b,x-4,y,w+8,5,[226,220,208]);hdR(b,x-4,y,w+8,1,[244,240,232]);hdR(b,x-4,y+5,w+8,2,[160,154,142]);hdShadeBand(b,x-4,y+7,w+8,7,.32,.04);
  hdR(b,x-4,y-20,w+8,2,[30,26,28]);hdR(b,x-4,y-20,w+8,1,[84,78,80]);hdR(b,x-4,y-2,w+8,1,[30,26,28]);
  for(let i=-3;i<w+4;i+=5){hdR(b,x+i,y-20,1,19,[30,26,28]);hdP(b,x+i+1,y-15,[30,26,28]);hdP(b,x+i+2,y-14,[30,26,28]);hdP(b,x+i+2,y-13,[30,26,28]);hdP(b,x+i+1,y-12,[30,26,28])}}
function hdPlantPot(b,x,y,big){const pc=[168,90,60];const pw=big?12:8,ph=big?10:7;hdR(b,x,y-ph,pw,ph,pc);hdR(b,x,y-ph,pw,1,hdS(pc,1.3));hdR(b,x+pw-2,y-ph,2,ph,hdS(pc,.75));hdR(b,x+1,y,pw,2,[40,36,34],.35);
  for(let n=0;n<(big?26:14);n++){const a=-Math.PI*(.08+.84*hsh(x+n,y)),L=(big?7:4)+hsh(n,x)*(big?9:6);for(let t=0;t<L;t++){const px=x+pw/2+Math.cos(a)*t,py=y-ph-1+Math.sin(a)*t*.9;hdP(b,px,py,t>L*.6?[110,156,72]:t>L*.3?[78,128,58]:[56,98,46])}}
  if(hsh(x,y)<.5)for(let n=0;n<4;n++)hdP(b,x+2+((hsh(n,x)*(pw-2))|0),y-ph-4-((hsh(x,n)*5)|0),[234,84,110])}
// ---- veranera (buganvilla) para la casa de Ariana ----
function hdVeranera(b,x0,y0,w,h,seed){const MAG=[[90,22,64],[126,30,86],[168,40,110],[204,58,134],[228,94,160],[242,140,188]],LF=[[30,58,34],[44,82,48],[62,106,56],[90,134,64]];
  const blobs=[];for(let i=0;i<w*h/22;i++){const t=hsh(seed,i);const bx=x0+hsh(i,seed)*w,by=y0+h*Math.pow(t,.8);if(hsh(i*3,seed)<.55||by<y0+h*.6)blobs.push([bx,by])}
  blobs.sort((a,c)=>a[1]-c[1]);
  for(let n=0;n<blobs.length;n++){const[bx,by]=blobs[n],leafy=hsh(n,7)<.45,r=1.6+hsh(n,9)*1.4;
    for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const dd=(dx*dx+dy*dy)/(r*r);if(dd>=1)continue;const lit=-(dx+dy)/(2*r);
      if(leafy){const k=Math.max(0,Math.min(3,Math.round(1.5+lit*2.2+(hsh(n,dx+dy)-.5)*.8)));hdP(b,bx+dx,by+dy,LF[k])}
      else{const k=Math.max(0,Math.min(5,Math.round(3+lit*2.6+(hsh(n+dx,dy)-.5)*1)));hdP(b,bx+dx,by+dy,MAG[k])}}}}
// ---- rótulos ----
function hdSign(b,x,y,w,h,bg,txt,tc,opt){opt=opt||{};const c=hdC(bg);for(let j=0;j<h;j++)for(let i=0;i<w;i++){const r=hdr(x+i,y+j);hdP(b,x+i,y+j,hdS(c,.95+r*.07))}
  hdR(b,x,y,w,1,hdS(c,1.12));hdR(b,x,y+h-1,w,1,hdS(c,.7));if(opt.border){hdR(b,x,y,w,1,hdC(opt.border));hdR(b,x,y+h-1,w,1,hdC(opt.border));hdR(b,x,y,1,h,hdC(opt.border));hdR(b,x+w-1,y,1,h,hdC(opt.border))}
  const tw=hdTextW(txt);hdText(b,x+((w-tw)>>1),y+((h-7)>>1)+(opt.dy||0),txt,hdC(tc),opt.sh?hdC(opt.sh):null);hdShadeBand(b,x,y+h,w,4,.3,.05)}
const HD_EMIT=[];   // ventanas/vitrinas que se encienden de noche (coordenadas HD del mapa exterior)
function hdHouse(B,bd,m){if(bd.id==='pulperia')return hdPulperia2(B,bd);if(bd.kind==='church')return hdChurch(B,bd);const X=bd.x*HT,Y=bd.y*HT,W=bd.w*HT,H=bd.h*HT,dX=(bd.dx-bd.x)*HT,seed=(bd.x*7+bd.y*13)|0;
  const two=bd.id==='casa_ariana'||bd.id==='casa_papas'||bd.id==='casa_extra3'||bd.id==='pulperia'||bd.id==='casa_sur2'||bd.id==='casa_sur5'||(bd.id==='casa_jugador'&&typeof progTwoStory==='function'&&progTwoStory());
  const RH=two?72:100,FY=Y+RH+5;   // roof height, facade top
  // fachada
  hdPlaster(B,X,FY-6,W,H-RH,bd.wall,seed);
  const zc=hdS(hdC(bd.wall),.68);hdR(B,X,Y+H-12,W,12,zc);hdR(B,X,Y+H-12,W,1,hdS(zc,1.25));for(let i=0;i<W;i++){const r=hdr(X+i,Y+H-12);if(r<.3)hdP(B,X+i,Y+H-12+((r*30)|0)%12,hdS(zc,.85))}
  hdShadeBand(B,X,Y+H-4,W,4,.05,.32);
  // techo + alero
  if(hdIsTeja(bd.roof)&&bd.kind==='house')hdRoofTeja(B,X-4,Y,W+8,RH,bd.roof,seed);else hdRoofZinc(B,X-4,Y,W+8,RH,bd.roof,seed,bd.kind!=='house'||!!bd.newRoof);
  hdEave(B,X-4,Y+RH,W+8,bd.roof);hdShadeBand(B,X,Y+RH+5,W,9,.42,.04);
  hdPipe(B,X+W-6,Y+RH+5,Y+H-2);
  if(bd.kind==='shop')return hdPulperia(B,bd,X,Y,W,H,RH,FY,dX,seed);
  if(bd.kind==='store')return hdStoreFront(B,bd,X,Y,W,H,RH,FY,dX,seed);
  const doorW=22,doorH=two?44:50,doorX=X+dX+5,doorY=Y+H-doorH-2;
  const curtains=['#e8c4c8','#f0dca0','#c8dce8','#e8e0c8','#d8c8e8'];
  const wins=[];const lowY=two?Y+H-46:FY+18,lowH=two?24:30,lowW=28;
  const cols=[];for(let cx=X+14;cx+lowW<=X+W-10;cx+=lowW+20)cols.push(cx);
  for(const wx of cols){if(wx+lowW>doorX-8&&wx<doorX+doorW+8)continue;
    const st=hsh(seed,wx)<.55?'celosia':'vidrio';wins.push(hdWindow(B,wx,lowY,lowW,lowH,{style:st,reja:true,box:hsh(wx,seed)<.6,curtain:curtains[(seed+wx)%5]}))}
  if(two){const upY=FY+8,upH=24;for(const wx of cols){wins.push(hdWindow(B,wx,upY,lowW,upH,{style:hsh(wx*3,seed)<.5?'celosia':'vidrio',curtain:curtains[(seed+wx+2)%5],noDrip:false}))}
    // losa entre pisos
    hdR(B,X,FY+40,W,3,hdS(hdC(bd.wall),1.06));hdR(B,X,FY+43,W,1,hdS(hdC(bd.wall),.8));hdShadeBand(B,X,FY+44,W,4,.2,.03);
    if(bd.id==='casa_ariana'||bd.id==='casa_papas'){const bx=doorX-30,bw=doorW+60;hdR(B,bx+6,FY+6,bw-12,34,[244,238,226]);for(let j=0;j<30;j++)for(let i=0;i<bw-16;i++){const t=j/30;hdP(B,bx+8+i,FY+8+j,i<(bw-16)/2-1||i>(bw-16)/2?hdS(hdC(curtains[(seed+1)%5]),.86+.14*Math.sin(i*1.3)):[240,234,222])}
      wins.push({x:bx+8,y:FY+8,w:bw-16,h:30});hdBalcony(B,bx,FY+40,bw)}}
  const dr=hdDoor(B,doorX,doorY,doorW,doorH,['#7a4a2e','#5c3d24','#8a5a36','#3e6a5a','#7a2e2e'][seed%5],hsh(seed,3)<.25?'metal':'wood');
  hdLamp(B,doorX+doorW+6,doorY+4);hdR(B,doorX+doorW+5,doorY-8,9,5,[36,74,140]);hdR(B,doorX+doorW+6,doorY-7,7,3,[236,236,240]);   // número de casa
  if(hsh(seed,5)<.7)hdMeter(B,doorX-16,doorY+10);
  if(hsh(seed,6)<.45)hdDish(B,X+W-30,Y+RH-26);
  hdPlantPot(B,doorX-10,Y+H-3,true);if(hsh(seed,8)<.6)hdPlantPot(B,doorX+doorW+3,Y+H-3,false);
  if(bd.id==='casa_ariana'){hdVeranera(B,X+2,FY-2,30,H-RH-10,11);hdVeranera(B,doorX-34,FY+26,doorW+68,18,13)}
  for(const w of wins)HD_EMIT.push(Object.assign({k:'win',b:bd.id},w));HD_EMIT.push(Object.assign({k:'door',b:bd.id},dr))}
function hdPulperia(B,bd,X,Y,W,H,RH,FY,dX,seed){
  hdSign(B,X+6,FY+12,W-12,15,'#efe4c8','PULPERÍA LA BENDICIÓN','#c0302a',{sh:'#8a7a62',dy:1});
  const up=FY+0;for(const wx of[X+16,X+W-44])HD_EMIT.push(Object.assign({k:'win',b:bd.id},hdWindow(B,wx,up-2,28,12,{style:'celosia',noDrip:true})));
  // mostrador enrejado con productos
  const ox=X+46,oy=Y+H-56,ow=W-58,oh=40;hdR(B,ox-2,oy-2,ow+4,oh+4,[222,214,198]);hdR(B,ox,oy,ow,oh,[44,36,32]);
  const pal=[[208,58,48],[240,192,48],[48,112,192],[64,160,80],[240,128,48],[232,224,208],[160,64,160],[192,160,112],[96,192,208]];
  for(const sy of[oy+3,oy+13,oy+23]){hdR(B,ox+2,sy+8,ow-4,1,[106,74,48]);let x=ox+3;while(x<ox+ow-5){const w=2+((hsh(x,sy)*3)|0),h=3+((hsh(sy,x)*4)|0),c=pal[((hsh(x*3,sy)*9)|0)%9];hdR(B,x,sy+8-h,w,h,c);hdR(B,x,sy+8-h,1,h,hdS(c,1.25));x+=w+((hsh(x,sy*3)*2)|0)}}
  hdR(B,ox+4,oy+1,ow-8,1,[138,128,112]);for(let i=0,x=ox+6;x<ox+ow-8;x+=9,i++){const c=pal[i%9];hdR(B,x,oy+2,5,7,c);hdR(B,x,oy+2,5,1,[232,224,208])}   // tiritas colgando
  hdR(B,ox-2,oy+oh-6,ow+4,6,[176,138,90]);hdR(B,ox-2,oy+oh-6,ow+4,1,[216,176,122]);hdR(B,ox-2,oy+oh,ow+4,1,[90,58,34]);
  for(let x=ox+3;x<ox+ow;x+=6){if(x>ox+ow/2-14&&x<ox+ow/2+12)continue;hdR(B,x,oy-1,1,oh-6,[28,26,24])}hdR(B,ox,oy+8,ow,1,[28,26,24]);
  HD_EMIT.push({k:'shop',b:bd.id,x:ox,y:oy,w:ow,h:oh-6});
  const dr=hdDoor(B,X+12,Y+H-50,26,48,'#2e5a48','metal');HD_EMIT.push(Object.assign({k:'door',b:bd.id},dr));
  // cajas de refresco
  for(const[cy,cc]of[[Y+H-14,[200,48,48]],[Y+H-26,[232,176,32]]]){hdR(B,X+W-14,cy,12,12,cc);hdR(B,X+W-14,cy,12,1,hdS(cc,1.25));for(let i=1;i<12;i+=3)hdP(B,X+W-13+i,cy+2,[60,106,58])}}
function hdStoreFront(B,bd,X,Y,W,H,RH,FY,dX,seed){const st=bd.st,doorX=X+dX+4;
  if(st==='chino'){hdSign(B,X+4,FY+4,W-8,16,'#9e1b1b','MINISÚPER LA FORTUNA','#f7e04b',{border:'#d8b45a',dy:1});
    for(const lx of[X+8,X+W-16]){hdR(B,lx+3,FY+20,1,6,[40,36,34]);hdEll(B,lx+4,FY+31,5,6,[192,57,43]);hdR(B,lx+1,FY+26,7,1,[242,201,76]);hdR(B,lx+1,FY+36,7,1,[242,201,76])}
    const sx=X+16,sy=FY+34;HD_EMIT.push(Object.assign({k:'shop',b:bd.id},hdWindow(B,sx,sy,48,30,{style:'vidrio',reja:true,noDrip:true})));hdR(B,sx+4,sy+16,40,12,[244,244,244]);hdText(B,sx+6,sy+19,'OFERTA',[192,57,43]);
    // cortina metálica medio abierta
    const gx=doorX-14,gw=54,gy=FY+30;hdR(B,gx,gy,gw,Y+H-gy-2,[44,36,32]);for(let j=0;j<18;j+=2)hdR(B,gx,gy+j,gw,1,[136,146,150]);hdR(B,gx,gy+18,gw,1,[60,66,70]);
    for(let i=0;i<6;i++){const c=[[214,69,69],[242,201,76],[123,182,97],[63,127,209],[242,153,74],[230,230,230]][i];hdR(B,gx+5+i*8,gy+30,6,12,c);hdR(B,gx+5+i*8,gy+30,6,1,hdS(c,1.3))}
    HD_EMIT.push({k:'shop',b:bd.id,x:gx,y:gy+19,w:gw,h:Y+H-gy-21});return}
  if(st==='pollo'){hdR(B,X,FY+2,W,22,[214,41,31]);hdR(B,X,FY+24,W,3,[247,198,0]);hdText(B,X+((W-hdTextW('POLLOLANDIA'))>>1)-6,FY+9,'POLLOLANDIA',[247,198,0],[120,20,16]);
    hdEll(B,X+W-16,FY+12,6,5,[200,117,42]);hdEll(B,X+W-17,FY+11,3,2,[232,160,80]);hdR(B,X+W-11,FY+14,6,3,[244,234,210]);hdEll(B,X+W-4,FY+16,2,2,[244,234,210]);
    for(const gx of[X+8,X+W-70]){const r=hdWindow(B,gx,FY+38,60,30,{style:'vidrio',noDrip:true,frame:'#2a2a30'});HD_EMIT.push(Object.assign({k:'shop',b:bd.id},r));
      for(let t=0;t<2;t++){hdR(B,gx+8+t*28,FY+58,16,3,[214,41,31]);hdR(B,gx+14+t*28,FY+61,3,6,[60,40,30])}}
    const r=hdDoor(B,doorX,Y+H-48,24,46,'#2a2a30','metal');HD_EMIT.push(Object.assign({k:'door',b:bd.id},r));return}
  if(st==='ropa'){hdSign(B,X+6,FY+4,W-12,16,'#f4ead2','ROPA AMERICANA','#2a6fb0',{border:'#2a6fb0'});
    const ox=doorX-26,ow=80,oy=FY+30;hdR(B,ox,oy,ow,Y+H-oy-2,[42,30,20]);hdR(B,ox,oy+4,ow,1,[154,161,169]);
    for(let i=0;i<14;i++){const c=[[214,69,69],[63,127,209],[242,201,76],[123,182,97],[241,147,180],[142,59,138],[244,244,244]][i%7];hdR(B,ox+3+i*5,oy+6,4,20,c);hdR(B,ox+3+i*5,oy+6,1,20,hdS(c,1.25));hdR(B,ox+6+i*5,oy+6,1,20,hdS(c,.7))}
    HD_EMIT.push({k:'shop',b:bd.id,x:ox,y:oy,w:ow,h:Y+H-oy-2});
    const mx=X+14;hdEll(B,mx+7,FY+40,5,6,[232,213,189]);hdR(B,mx,FY+46,14,22,[74,106,154]);hdR(B,mx+1,FY+46,3,22,[100,136,184]);hdR(B,mx+6,FY+68,2,10,[42,42,48]);hdR(B,mx+2,FY+78,10,2,[42,42,48]);
    hdR(B,X+W-58,FY+34,52,14,[242,201,76]);hdText(B,X+W-55,FY+38,'TODO ₡1000',[192,57,43]);return}
  if(st==='gollo'){hdR(B,X,FY+2,W,24,[208,32,42]);hdR(B,X,FY+26,W,2,[255,255,255]);const gw=hdTextW('GOLLO')*2;
    {const tmp=hdBuf(hdTextW('GOLLO'),7);hdText(tmp,0,0,'GOLLO',[255,255,255]);for(let y=0;y<7;y++)for(let x=0;x<tmp.w;x++)if(tmp.d[((y*tmp.w+x)<<2)+3])hdR(B,X+((W-gw)>>1)+x*2,FY+7+y*2,2,2,[255,255,255])}
    const vx=X+6,vy=FY+34,vw=W-12,vh=36;hdR(B,vx,vy,vw,vh,[42,42,48]);for(let j=0;j<vh-2;j++)for(let i=0;i<vw-2;i++){hdP(B,vx+1+i,vy+1+j,j<12?[200,222,236]:[176,204,222])}
    hdR(B,vx+8,vy+8,34,20,[29,26,36]);hdR(B,vx+10,vy+10,30,16,[63,127,209]);hdR(B,vx+12,vy+12,10,4,[127,195,232]);
    hdR(B,vx+56,vy+6,18,28,[244,244,244]);hdR(B,vx+56,vy+17,18,1,[200,204,208]);hdR(B,vx+72,vy+9,1,6,[154,161,169]);
    hdR(B,vx+90,vy+20,30,8,[208,32,42]);hdEll(B,vx+94,vy+30,5,5,[29,26,36]);hdEll(B,vx+116,vy+30,5,5,[29,26,36]);hdR(B,vx+108,vy+15,6,5,[42,42,48]);
    hdR(B,X+W-76,vy+2,66,14,[247,198,0]);hdText(B,X+W-71,vy+6,'SIN PRIMA',[208,32,42]);
    HD_EMIT.push({k:'shop',b:bd.id,x:vx,y:vy,w:vw,h:vh});const r=hdDoor(B,doorX,Y+H-48,24,46,'#bfd6e6','metal');HD_EMIT.push(Object.assign({k:'door',b:bd.id},r));return}
}
function hdBuildingsBase(B,m){HD_EMIT.length=0;for(const bd of BUILD)hdHouse(B,bd,m);HD_DONE.buildings=true}
