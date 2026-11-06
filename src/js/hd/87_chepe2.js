// ---------- San José en estilo B: edificios, Mercado, parque y bulevar pintados en HD ----------
// Mismo idioma que el barrio: luz de la tarde desde el oeste, rampas de varios tonos, texturas gastadas.
function hdCh_flatRoof(b,x,y,w,h,col,seed){const c=hdC(col);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=x+i,Y=y+j,n=hdVN(X,Y,22,seed),n2=hdVN(X,Y,7,seed+5);let f=.9+n*.12+(hdr(X,Y)-.5)*.05;if(n2>.8)f-=.05;
    if(i<5||j<5||i>=w-5)f=1.12-(Math.min(i,j,w-1-i)<2?0:.05);if(i>=5&&j>=5&&i<w-5&&(i<8||j<8))f*=.8;   // pretil y su sombra
    if(j>=h-3)f=.6;hdP(b,X,Y,hdS(c,f))}
  for(let n=0;n<w*h/2600;n++){const px=x+12+hsh(seed,n)*(w-30),py=y+12+hsh(n,seed)*(h-28);hdEll(b,px,py,7+hsh(n,3)*10,3+hsh(3,n)*4,hdS(c,.78),.55)}   // charcos y manchas
  for(let i=x+10;i<x+w-10;i+=34)hdDrip(b,i,y+h-3,3,10,i)}
function hdCh_tank(b,x,y){hdEll(b,x+9,y+14,10,5,[20,20,24],.3);hdEll(b,x+8,y+9,8,8,[34,34,40]);hdEll(b,x+7,y+8,6,6,[52,52,60]);hdEll(b,x+8,y+8,3,3,[24,24,28]);hdP(b,x+5,y+4,[110,110,120]);hdP(b,x+6,y+4,[90,90,100])}
function hdCh_ac(b,x,y){hdR(b,x+1,y+11,18,3,[20,20,24],.3);hdR(b,x,y,18,12,[208,210,212]);hdR(b,x,y,18,1,[236,238,240]);hdR(b,x+17,y,1,12,[150,152,156]);hdEll(b,x+6,y+6,4,4,[120,124,128]);hdEll(b,x+6,y+6,2,2,[70,72,76]);for(let k=y+2;k<y+11;k+=2)hdR(b,x+12,k,4,1,[160,162,166])}
function hdCh_awning(b,x,y,w,h,c1,c2,seed){const A=hdC(c1),B2=hdC(c2);hdR(b,x+2,y+h+2,w,4,[20,16,20],.28);
  for(let i=0;i<w;i++){const s=((i/10)|0)%2,c=s?B2:A;for(let j=0;j<h;j++){const f=.82+.3*(j/h)-(.05*Math.sin(i*.6));hdP(b,x+i,y+j,hdS(c,f))}
    const sc=((i%10)<5?1:0)+(i%10===4||i%10===5?1:0);for(let j=0;j<2+sc;j++)hdP(b,x+i,y+h+j,hdS(s?B2:A,.75))}
  hdR(b,x,y,w,2,hdS(A,.6));hdR(b,x,y+2,w,1,hdS(A,1.15))}
function hdCh_column(b,x,y,w,h,col){const c=hdC(col||'#f4eedf');hdR(b,x+w,y+3,3,h-6,[0,0,0],.12);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const u=i/(w-1);let f=1.08-.38*u+(u<.18?.06:0);if((i===2||i===w-3)&&j>6&&j<h-6)f*=.9;hdP(b,x+i,y+j,hdS(c,f))}
  hdR(b,x-2,y,w+4,4,hdS(c,1.1));hdR(b,x-2,y+3,w+4,1,hdS(c,.75));hdR(b,x-2,y+h-4,w+4,4,hdS(c,.96));hdR(b,x-2,y+h-1,w+4,1,hdS(c,.68))}
function hdCh_win(b,x,y,w,h,o){o=o||{};const fr=hdC(o.frame||'#efe9dc');
  if(o.arch){hdEll(b,x+w/2,y+2,w/2+2,w/2+2,fr);}
  hdR(b,x-2,y-2,w+4,h+4,fr);hdR(b,x+w+1,y-2,1,h+4,hdS(fr,.78));
  const gl=o.lit?[[255,214,140],[240,170,90]]:[[150,184,206],[58,74,92]];
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const t=j/h;let c=hdMix(gl[0],gl[1],Math.min(1,t*1.4));if(!o.lit&&((i+j*.6)%14)<2)c=hdS(c,1.22);hdP(b,x+i,y+j,c)}
  if(o.arch)for(let j=-w/2;j<0;j++)for(let i=0;i<w;i++){const dx=i+.5-w/2,dy=j+.5;if(dx*dx+dy*dy<(w/2)*(w/2))hdP(b,x+i,y+j+2,hdMix(gl[0],[180,200,214],.3))}
  if(o.mull!==false){hdR(b,x+(w>>1),y,1,h,fr);if(h>14)hdR(b,x,y+(h*.45|0),w,1,fr)}
  if(o.curtain){const cc=hdC(o.curtain);for(let j=0;j<h;j++){const ww=Math.max(2,(w*.26)|0);for(let i=0;i<ww;i++){hdP(b,x+i,y+j,hdS(cc,.85+.1*Math.sin(i*1.5)));hdP(b,x+w-1-i,y+j,hdS(cc,.8))}}}
  hdR(b,x-3,y+h+2,w+6,2,hdS(fr,.9));hdShadeBand(b,x-3,y+h+4,w+6,3,.25,.04);return{x,y,w,h}}
// ---- edificios de la Avenida Segunda ----
function hdCityB(b,bd,EM){const X=bd.x*HT,Y=bd.y*HT,W=bd.w*HT,H=bd.h*HT,fH=112,rH=H-fH,FY=Y+rH,seed=bd.x*13+7,gy=FY+70;
  const wall=bd.wall;
  // techo
  if(bd.id==='teatro'){const c=hdC('#7d8a94');for(let j=0;j<rH;j++)for(let i=0;i<W;i++){const X2=X+i,Y2=Y+j,row=(j/6)|0,ox=(row&1)*6;let f=.86+.16*(j/rH)+(((i+ox)%12)<1?-.18:0)+(j%6===0?-.12:0)+(hdr(X2,Y2)-.5)*.06;if(i<4||i>=W-4)f=1.06;hdP(b,X2,Y2,hdS(c,f))}
    const cx=X+W/2;for(let j=0;j<44;j++){const ww=80-j*.4;for(let i=0;i<ww;i++){const u=i/ww;hdP(b,cx-ww/2+i,Y+14+j,hdS([88,150,132],.78+.42*Math.sin(u*Math.PI)*(1-j/80)+(i%8<1?-.12:0)))}}
    for(let i=-30;i<34;i+=12)hdR(b,cx+i,Y+22,6,22,[200,232,224]);hdR(b,cx-42,Y+56,84,4,[60,104,92]);hdR(b,cx-2,Y+4,5,12,[214,176,82]);hdEll(b,cx+.5,Y+4,4,4,[236,200,96]);
    hdR(b,X,FY-6,W,6,[150,158,164]);hdR(b,X,FY-6,W,1,[190,198,204])}
  else{hdCh_flatRoof(b,X,Y,W,rH,bd.roof,seed);
    hdCh_tank(b,X+W-40,Y+14);if(W>200)hdCh_tank(b,X+24,Y+20);hdCh_ac(b,X+16+((hsh(seed,1)*(W-60))|0),Y+rH-34);if(W>260)hdCh_ac(b,X+W/2+40,Y+30);
    if(hsh(seed,2)<.7)hdDish(b,X+W/2-20,Y+18);hdR(b,X+W/2+6,Y+8,2,28,[40,40,44]);hdR(b,X+W/2-4,Y+14,22,2,[40,40,44]);hdR(b,X+W/2-1,Y+20,16,2,[40,40,44])}
  // fachada: revoque y cornisa
  hdPlaster(b,X,FY,W,fH,wall,seed);const wc=hdC(wall);
  hdR(b,X,FY,W,6,hdS(wc,1.12));hdR(b,X,FY+6,W,2,hdS(wc,.7));hdShadeBand(b,X,FY+8,W,8,.22,.02);
  hdR(b,X,Y+H-4,W,4,hdS(wc,.6));hdR(b,X,FY+62,W,4,hdS(wc,1.08));hdR(b,X,FY+66,W,2,hdS(wc,.72));
  hdShadeBand(b,X+W-6,FY,6,fH,0,.22);
  const win=(x,y,w,h,o)=>{const r=hdCh_win(b,x,y,w,h,o);EM.push({k:'win',x:r.x,y:r.y,w:r.w,h:r.h});return r},shop=(x,y,w,h)=>EM.push({k:'shop',x,y,w,h});
  switch(bd.id){
  case'teatro':{const cx=X+W/2;
    // frontón con estatuas
    for(let j=0;j<30;j++){const ww=180-j*5.8;hdR(b,cx-ww/2,FY-2-j,ww,1,hdS([236,222,190],1.04-j*.006))}hdR(b,cx-92,FY-2,184,3,[196,178,140]);
    for(let j=6;j<22;j++){const ww=130-j*6;if(ww>0)hdR(b,cx-ww/2,FY-2-j+8,ww,1,[214,198,160])}
    for(const[sx,dy]of[[cx-88,0],[cx-2,-26],[cx+84,0]]){hdR(b,sx,FY-40+dy,7,16,[96,92,74]);hdEll(b,sx+3.5,FY-43+dy,3,3,[96,92,74]);hdR(b,sx+1,FY-38+dy,2,12,[130,124,100])}
    hdTextS(b,cx-hdTextW('TEATRO NACIONAL')*1,FY+12,'TEATRO NACIONAL',[120,92,52],2,[255,246,220]);
    for(let i=0;i<9;i++){const px=X+24+i*((W-58)/8);hdCh_column(b,px,FY+26,10,74,'#f6f0e2')}
    for(let i=0;i<8;i++){const px=X+38+i*((W-58)/8);win(px,FY+40,14,22,{arch:true,frame:'#efe6cf',lit:false});hdDoor(b,px-1,FY+70,16,28,'#6b4a2b')}
    hdR(b,X+8,Y+H-10,W-16,4,[226,218,202]);hdR(b,X+4,Y+H-6,W-8,4,[204,196,180]);hdR(b,X+4,Y+H-6,W-8,1,[240,234,222]);
    for(const lx of[X+12,X+W-20]){hdR(b,lx+3,FY+58,2,38,[34,32,36]);hdR(b,lx,FY+50,8,10,[34,32,36]);hdR(b,lx+1,FY+52,6,6,[250,220,140]);EM.push({k:'shop',x:lx+1,y:FY+52,w:6,h:6})}
    break}
  case'hotel':{for(const ry of[FY+14,FY+40])for(let i=0;i<5;i++){const wx=X+18+i*62;win(wx,ry,22,16,{frame:'#f2ead8',curtain:i%2?'#c9b58f':'#9fb79a'});hdBalcony(b,wx-2,ry+21,26)}
    hdCh_awning(b,X+6,gy-6,W-12,12,'#2f7a52','#f2ede0',seed);hdShadeBand(b,X+6,gy+8,W-12,8,.3,.04);
    const gw=60;for(const wx of[X+16,X+W-16-gw]){win(wx,gy+12,gw,24,{frame:'#2a2a30',mull:true});shop(wx,gy+12,gw,24)}
    hdDoor(b,X+W/2-16,gy+8,32,40,'#6b4a2b');EM.push({k:'shop',x:X+W/2-14,y:gy+14,w:28,h:10});
    hdR(b,X+W-30,FY+10,18,56,[192,71,59]);hdR(b,X+W-30,FY+10,18,2,[230,120,100]);'HOTEL'.split('').forEach((ch,i)=>hdText(b,X+W-24,FY+15+i*10,ch,[255,240,200],[110,30,24]));
    break}
  case'soda':{for(let i=0;i<3;i++){const wx=X+18+i*76;win(wx,FY+18,28,20,{frame:'#f6efe0',curtain:'#e9b3c2'});for(let k=0;k<4;k++)hdEll(b,wx+3+k*7,FY+43,3,2.5,[[242,147,180],[242,201,76],[123,182,97],[214,69,69]][k])}
    for(let i=0;i<W-20;i+=14){hdLine(b,X+10+i,FY+52,X+17+i,FY+56,[60,60,64]);hdR(b,X+12+i,FY+56,8,7,[[214,69,69],[63,127,209],[244,244,244],[242,201,76]][(i/14|0)%4])}
    hdCh_awning(b,X+6,gy-6,W-12,12,'#c0473b','#f4f0e6',seed);
    hdR(b,X+16,gy+10,W-32,30,[44,32,26]);hdR(b,X+16,gy+28,W-32,7,[196,158,108]);hdR(b,X+16,gy+28,W-32,1,[230,196,150]);shop(X+16,gy+10,W-32,18);
    for(let i=0;i<6;i++){const sx=X+26+i*36;hdR(b,sx,gy+36,10,4,[200,60,50]);hdR(b,sx+4,gy+40,2,8,[90,90,96]);hdR(b,sx+2,gy+16,8,6,[244,244,244]);hdR(b,sx+3,gy+15,6,2,[120,80,50])}
    hdR(b,X+W-70,FY+22,56,22,[30,26,34]);hdR(b,X+W-70,FY+22,56,2,[70,64,76]);hdTextS(b,X+W-62,FY+29,'SODA',[242,201,76],2);
    hdR(b,X+10,gy+18,4,22,[30,26,34]);break}
  case'banco':{for(let j=0;j<60;j++)for(let i=0;i<W-12;i++){const X2=X+6+i,Y2=FY+10+j,col=(i%24),t=j/60;let c=col<2?[30,48,70]:hdMix([120,160,196],[40,70,108],Math.min(1,t*1.3+(col/24)*.2));if(((i+j*.7)%40)<3&&col>=2)c=hdS(c,1.25);if(j===29||j===30)c=[200,210,218];hdP(b,X2,Y2,c)}
    for(let i=0;i<W-12;i+=24)EM.push({k:'win',x:X+8+i,y:FY+10,w:22,h:28});
    hdR(b,X+W/2-62,gy-6,124,16,[26,46,74]);hdR(b,X+W/2-62,gy-6,124,2,[70,100,140]);hdTextS(b,X+W/2-24,gy-3,'BANCO',[255,255,255],2);
    win(X+16,gy+16,80,24,{frame:'#c7ced4',mull:true});shop(X+16,gy+16,80,24);
    hdR(b,X+W/2-20,gy+12,40,36,[200,214,226]);hdR(b,X+W/2-18,gy+14,17,32,[130,170,206]);hdR(b,X+W/2+1,gy+14,17,32,[120,160,198]);EM.push({k:'shop',x:X+W/2-18,y:gy+14,w:36,h:32});
    const ax=X+W-74;hdR(b,ax,gy+10,30,38,[40,40,46]);hdR(b,ax+5,gy+14,20,12,[100,220,140]);hdR(b,ax+7,gy+30,16,5,[150,154,160]);hdR(b,ax+2,gy+2,26,8,[242,201,76]);hdText(b,ax+5,gy+3,'ATM',[30,30,34]);
    hdR(b,X+6,Y+H-14,W-12,10,[150,160,168]);hdR(b,X+6,Y+H-14,W-12,1,[200,206,212]);break}
  case'almacen':{const wc2=hdS(wc,.92);for(let j=FY+10;j<FY+62;j+=6)for(let i=((j/6)|0)%2?0:12;i<W;i+=24){hdR(b,X+i,j,23,5,hdS(wc2,.95+hsh(i,j)*.12));hdR(b,X+i,j+5,24,1,hdS(wc,.62))}
    for(let i=0;i<6;i++)win(X+22+i*82,FY+20,26,22,{frame:'#e8dcc4',curtain:i%2?'#d8c8a8':undefined});
    const sw=150;hdR(b,X+W/2-sw/2,gy-12,sw,20,[28,74,150]);hdR(b,X+W/2-sw/2,gy-12,sw,2,[90,140,210]);hdR(b,X+W/2-sw/2,gy+6,sw,2,[247,198,0]);hdTextS(b,X+W/2-hdTextW('LA ECONOMÍA'),gy-9,'LA ECONOMÍA',[247,210,40],2);
    for(let i=0;i<3;i++){const wx=X+18+i*168;hdR(b,wx-2,gy+12,126,38,[226,220,206]);hdR(b,wx,gy+14,122,32,[210,226,234]);shop(wx,gy+14,122,32);
      for(let k=0;k<9;k++){const c=[[214,69,69],[63,127,209],[123,182,97],[242,153,74],[42,42,48],[242,147,180]][(k+i)%6];hdR(b,wx+6+k*13,gy+24+((k*5)%7),9,16,c);hdR(b,wx+6+k*13,gy+24+((k*5)%7),9,2,hdS(c,1.3))}
      hdR(b,wx,gy+14,122,3,[255,255,255],.35)}
    // valla en la azotea
    const vx=X+70,vy=Y+10;hdR(b,vx+20,vy+44,4,22,[40,40,44]);hdR(b,vx+136,vy+44,4,22,[40,40,44]);hdR(b,vx,vy,160,46,[244,244,240]);hdR(b,vx+4,vy+4,152,38,[42,143,106]);hdEll(b,vx+28,vy+23,12,12,[242,201,76]);hdTextS(b,vx+50,vy+16,'PURA VIDA',[255,255,255],2,[20,90,60]);
    break}
  default:{win(X+22,FY+20,26,22,{frame:'#e8e2d4'});hdDoor(b,X+28,gy+8,30,40,'#5c3d24');hdR(b,X+10,gy-12,76,14,[244,234,210]);hdText(b,X+18,gy-8,'SE ALQUILA',[192,71,59])}}}
// ---- Mercado Central ----
function hdMercado(b,EM){const X=MERC.x*HT,Y=MERC.y*HT,W=MERC.w*HT,H=MERC.h*HT,fH=112,rH=H-fH,FY=Y+rH;
  const bay=128,midY=Y+Math.round(rH*.46),band=40,cols=['#a95c40','#9c5238','#8d8f90','#a2593c','#9b9d9c','#a95c40','#9c5238'];
  for(let s=0;s<W;s+=bay){const c=hdC(cols[((s/bay)|0)%cols.length]),bi=(s/bay)|0;
    for(let j=0;j<rH;j++)for(let i=0;i<bay&&s+i<W;i++){const X2=X+s+i,Y2=Y+j,u=i/bay,left=u<.5;
      let f=left?.9+.2*(u*2):.66+.12*(1-(u-.5)*2);f*=(i%6<2?1.1:i%6<4?.98:.86);
      if(((j+bi*7)%46)<2)f*=.72;                                   // traslape de láminas
      f*=.95+hdr(X2,Y2)*.07+(hdVN(X2,Y2,30,bi)-.5)*.1;
      if(i<3||i>=bay-3)f=.42+(i===1||i===bay-2?.12:0);            // canoa entre naves
      hdP(b,X2,Y2,hdS(c,f))}
    // linterna de ventilación sobre la cumbrera
    for(let j=4;j<rH-6;j++){const X2=X+s+bay/2-9;for(let i=0;i<18;i++){let f=i<3||i>14?.6:(i<9?1.2:.9);if(j%8<2)f*=.7;hdP(b,X2+i,Y+j,hdS(c,f))}}
    // lucernarios (paneles traslúcidos) sueltos, no franjas
    for(const sx of[s+22,s+bay-44])for(let k=0;k<3;k++){const yy=Y+12+k*((rH-40)/3)+((hsh(bi,k)*10)|0);if(Math.abs(yy+15-midY)<band/2+16)continue;
      for(let j=0;j<26;j++)for(let i=0;i<22;i++){const X2=X+sx+i,Y2=yy+j;hdP(b,X2,Y2,hdMix([170,204,212],[232,242,240],(i%6)/10+hdr(X2,Y2)*.12),.88)}hdR(b,X+sx,yy,22,1,[255,255,255],.5);hdR(b,X+sx,yy+25,22,1,[40,40,40],.4)}
    // óxido
    for(let n=0;n<10;n++){const rx=X+s+6+((hsh(s,n)*(bay-12))|0),ry=Y+((hsh(n,s)*(rH-30))|0),L=8+hsh(s+n,2)*28;for(let t=0;t<L;t++){hdP(b,rx,ry+t,[124,62,26],.55*(1-t/L));hdP(b,rx+1,ry+t,[150,80,34],.3*(1-t/L))}}
    for(let n=0;n<3;n++)hdEll(b,X+s+16+hsh(bi,n+9)*(bay-32),Y+20+hsh(n+9,bi)*(rH-40),5,3,[70,96,52],.6)}   // hojas en las canoas
  // techo transversal (pasillo central) que cruza todas las naves
  for(let j=0;j<band;j++){const f=j<band*.45?1.12-.1*(j/(band*.45)):.7+.08*((j-band*.45)/(band*.55));for(let i=0;i<W;i++){const X2=X+i;let ff=f*(j%5<1?.82:1)*(.95+hdr(X2,midY+j)*.07);hdP(b,X2,midY-band/2+j,hdS([150,74,48],ff))}}
  hdR(b,X,midY-band/2,W,2,[200,120,86]);hdR(b,X,midY+band/2,W,3,[40,26,22],.45);hdR(b,X,midY-1,W,2,[220,140,100]);
  // palomas y aire acondicionado sobre el techo
  for(let n=0;n<6;n++){const px=X+30+hsh(n,77)*(W-60),py=Y+10+hsh(77,n)*(rH-30);hdEll(b,px,py,3,2,[120,124,134]);hdP(b,px+2,py-1,[60,62,70])}
  hdCh_ac(b,X+W-60,Y+rH-40);hdCh_ac(b,X+40,Y+rH-40);
  hdR(b,X,FY-8,W,8,[60,40,34]);hdR(b,X,FY-8,W,2,[110,80,64]);hdShadeBand(b,X,FY,W,10,.3,.02);
  hdPlaster(b,X,FY,W,fH,'#e8c67e',91);hdR(b,X,FY,W,10,[63,125,90]);hdR(b,X,FY,W,2,[110,170,130]);hdR(b,X,FY+10,W,2,[40,90,62]);hdR(b,X,Y+H-4,W,4,[150,120,74]);
  const dX=MERC.dx*HT+16;
  for(let ax=X+20;ax<X+W-48;ax+=72){if(Math.abs(ax+24-dX)<60)continue;
    hdR(b,ax-4,FY+30,56,74,[63,125,90]);hdEll(b,ax+24,FY+34,28,26,[63,125,90]);
    hdR(b,ax,FY+34,48,70,[42,30,24]);hdEll(b,ax+24,FY+36,24,22,[42,30,24]);for(let j=0;j<10;j++)hdR(b,ax+2,FY+40+j*6,44,1,[60,44,36]);
    hdR(b,ax+2,FY+84,44,14,[196,157,108]);hdR(b,ax+2,FY+84,44,2,[230,196,150]);
    for(let k=0;k<7;k++)hdEll(b,ax+7+k*6,FY+82-(k%2)*3,3.2,3,[[242,153,74],[123,182,97],[214,69,69],[242,201,76],[242,147,180]][(k+ax)%5]);
    EM.push({k:'shop',x:ax,y:FY+40,w:48,h:40})}
  hdR(b,dX-40,FY+20,80,88,[63,125,90]);hdEll(b,dX,FY+26,40,32,[63,125,90]);hdR(b,dX-34,FY+26,68,82,[36,26,20]);hdEll(b,dX,FY+28,34,28,[36,26,20]);
  for(let i=0;i<6;i++)hdR(b,dX-30+i*12,FY+40,2,68,[90,70,52]);EM.push({k:'shop',x:dX-30,y:FY+30,w:60,h:70});
  hdR(b,dX-94,FY+12,188,22,[30,26,34]);hdR(b,dX-94,FY+12,188,2,[80,72,90]);hdTextS(b,dX-hdTextW('MERCADO CENTRAL'),FY+16,'MERCADO CENTRAL',[242,201,76],2);
  hdText(b,dX-hdTextW('1880')/2,FY+40,'1880',[220,186,130]);
  for(const[cx,col]of[[dX-60,[242,153,74]],[dX+46,[123,182,97]]]){hdR(b,cx,FY+88,20,16,[138,106,69]);hdR(b,cx,FY+88,20,2,[180,144,100]);for(let k=0;k<3;k++)hdEll(b,cx+4+k*6,FY+87,3,3,col)}}
// ---- tiendas del bulevar (sur): techos y fachada que mira al norte ----
function hdSouth(b,s,EM){const X=s.x*HT,Y=34*HT,W=s.w*HT,H=6*HT,seed=s.x*7+3;
  if(hdIsTeja(s.roof))hdRoofTeja(b,X,Y,W,H,s.roof,seed);else hdRoofZinc(b,X,Y,W,H,s.roof,seed,hsh(seed,1)<.5);
  const c=hdC(s.c);hdR(b,X,Y,W,16,hdS(c,.55));hdR(b,X,Y,W,2,hdS(c,.8));for(let i=12;i<W-16;i+=44){hdR(b,X+i,Y+4,16,7,[250,232,160]);EM.push({k:'shop',x:X+i,y:Y+4,w:16,h:7})}
  hdR(b,X+W-1,Y,1,H,[20,16,20],.4);hdCh_ac(b,X+W-40,Y+50);if(hsh(seed,2)<.6)hdCh_tank(b,X+24,Y+70)}
function hdSouthTop(tg,s){const X=s.x*HT+6,Y=34*HT,W=s.w*HT-12,b=hdBuf(W,52);
  hdCh_awning(b,0,20,W,14,s.c,'#f4f0e6',s.x);const tw=hdTextW(s.n)*2+20,sx=Math.round(W/2-tw/2);hdR(b,sx,0,tw,20,[30,26,34]);hdR(b,sx,0,tw,2,[80,72,90]);hdTextS(b,sx+10,4,s.n,[255,246,214],2);
  tg.drawImage(hdToCanvas(b),X,Y-36)}
// ---- objetos de la ciudad ----
function hdCityObj(b,o,m){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT;
  switch(o.type){
  case'bench':hdBench(b,X,Y);break;
  case'busstop':hdBusStop(b,X,Y,W);break;
  case'templete':{hdEll(b,X+W/2,Y+H-18,W/2+4,20,[20,20,24],.25);
    for(let j=0;j<H-30;j++){const ww=W-8-Math.max(0,(j-(H-60))*.6);hdR(b,X+W/2-ww/2,Y+20+j,ww,1,hdS([214,206,190],.92+.1*(j/(H-30))))}
    for(let k=0;k<3;k++){hdR(b,X+18+k*4,Y+H-14+k*4,W-36-k*8,4,hdS([206,198,182],1.06-k*.08));hdR(b,X+18+k*4,Y+H-14+k*4,W-36-k*8,1,[236,230,216])}
    for(let i=0;i<7;i++){const cx=X+16+i*((W-40)/6);hdCh_column(b,cx,Y+28,8,H-62,'#fbf8f0')}
    hdR(b,X+W/2-30,Y+H-48,60,10,[150,110,70]);break}
  case'marimba':{hdR(b,X+6,Y+16,4,16,[70,48,30]);hdR(b,X+W-10,Y+16,4,16,[70,48,30]);hdR(b,X+2,Y+8,W-4,10,[122,75,42]);hdR(b,X+2,Y+8,W-4,2,[160,108,66]);
    for(let i=0;i<14;i++){hdR(b,X+4+i*4,Y+4,3,8,i%2?[214,150,82]:[178,118,62]);hdR(b,X+4+i*4,Y+4,3,1,[240,190,120])}for(let i=0;i<7;i++)hdR(b,X+6+i*8,Y+18,3,8+(i%3)*2,[58,42,30]);break}
  case'kioscoP':{hdR(b,X+4,Y+H-8,W,8,[20,20,24],.25);hdR(b,X+4,Y+12,W-8,H-16,[47,122,82]);hdR(b,X+4,Y+12,4,H-16,[80,160,112]);
    for(let i=0;i<5;i++){const c=[[244,244,244],[214,69,69],[242,201,76],[127,195,232],[242,147,180]][i];hdR(b,X+10+i*9,Y+30+(i%2)*4,7,16,c);hdR(b,X+11+i*9,Y+33+(i%2)*4,5,1,[40,40,40])}hdR(b,X+8,Y+20,W-16,8,[30,26,34]);hdText(b,X+10,Y+21,'NOTICIAS',[242,201,76]);break}
  case'taxis':{hdR(b,X+14,Y-6,4,32,[42,42,48]);break}
  case'farol':case'farolS':{hdEll(b,X+16,Y+26,8,3,[20,20,24],.3);hdR(b,X+11,Y+16,10,12,[38,38,44]);hdR(b,X+11,Y+16,10,2,[70,70,78]);hdR(b,X+14,Y+2,4,16,[46,46,52]);break}
  case'jardinera':{hdR(b,X+2,Y+24,W,6,[20,20,24],.25);hdR(b,X,Y+4,W,22,[190,182,166]);hdR(b,X,Y+4,W,3,[220,214,200]);hdR(b,X+4,Y+8,W-8,10,[90,62,40]);hdR(b,X,Y+24,W,2,[140,134,120]);break}
  case'basurero':{hdEll(b,X+16,Y+26,9,3,[20,20,24],.3);hdR(b,X+8,Y+4,16,22,[47,122,82]);hdR(b,X+8,Y+4,3,22,[90,170,120]);hdR(b,X+6,Y+2,20,4,[36,99,67]);for(let k=Y+8;k<Y+24;k+=4)hdR(b,X+11,k,12,1,[36,90,62]);break}
  case'copos':{hdR(b,X+4,Y+24,W-4,6,[20,20,24],.25);hdR(b,X+4,Y+4,W-8,20,[244,244,244]);hdR(b,X+4,Y+4,W-8,2,[255,255,255]);hdR(b,X+4,Y+16,W-8,4,[42,111,176]);
    hdEll(b,X+12,Y+26,4,4,[40,40,46]);hdEll(b,X+W-12,Y+26,4,4,[40,40,46]);hdText(b,X+W/2-hdTextW('COPOS')/2,Y+7,'COPOS',[192,71,59]);
    hdR(b,X+10,Y-8,20,12,[200,236,250]);hdR(b,X+12,Y-6,16,8,[255,255,255]);for(let i=0;i<3;i++)hdR(b,X+36+i*6,Y-6,4,12,[[214,69,69],[242,201,76],[242,153,74]][i]);break}
  }}
function hdCityObjTop(tg,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT;
  if(o.type==='farol'){const b=hdBuf(32,70);hdR(b,14,14,4,58,[46,46,52]);hdR(b,15,14,1,58,[90,90,98]);for(const dx of[-1,1]){hdLine(b,16,20,16+dx*10,14,[46,46,52],1,2);const lx=16+dx*10-4;hdR(b,lx,2,9,12,[38,38,44]);hdR(b,lx+1,4,7,8,[250,222,140]);hdR(b,lx-1,0,11,3,[38,38,44])}
    hdR(b,13,8,6,8,[38,38,44]);hdR(b,14,9,4,6,[250,222,140]);tg.drawImage(hdToCanvas(b),X,Y-44)}
  else if(o.type==='farolS'){const b=hdBuf(40,100);hdR(b,14,6,4,96,[126,132,138]);hdR(b,14,6,1,96,[170,176,182]);hdR(b,14,4,24,4,[126,132,138]);hdR(b,26,6,12,5,[42,42,48]);hdR(b,28,10,8,2,[250,240,190]);tg.drawImage(hdToCanvas(b),X,Y-70)}
  else if(o.type==='taxis'){const b=hdBuf(32,22);hdR(b,1,0,30,18,[242,201,76]);hdR(b,1,0,30,2,[255,232,140]);hdR(b,1,16,30,2,[180,140,40]);hdText(b,5,6,'TAXI',[30,26,34]);tg.drawImage(hdToCanvas(b),X,Y-20)}
  else if(o.type==='templete'){const cx=W/2,b=hdBuf(W+20,90);
    for(let i=0;i<9;i++){const ww=W+12-i*22,yy=60-i*7;if(ww<10)break;for(let j=0;j<8;j++)for(let k=0;k<ww;k++){const u=k/ww;hdP(b,cx+10-ww/2+k,yy+j,hdS(i%2?[84,140,128]:[98,158,144],.8+.4*Math.sin(u*Math.PI)*(1-j/16)+(k%10<1?-.1:0)))}}
    hdR(b,4,66,W+12,6,[54,96,86]);hdR(b,4,66,W+12,1,[130,190,176]);for(let k=10;k<W+10;k+=16)hdR(b,k,72,8,4,[240,236,226]);
    hdR(b,cx+8,0,4,12,[214,176,82]);hdEll(b,cx+10,2,4,4,[240,204,100]);tg.drawImage(hdToCanvas(b),X-10,Y-40)}
  else if(o.type==='jardinera'){const b=hdBuf(W,24);for(let i=0;i<W/6;i++){const cx=4+i*6+hsh(i,o.x)*3;hdEll(b,cx,14,6,7,i%2?[62,128,58]:[76,150,66]);hdEll(b,cx-1,11,3,3,[110,180,90])}for(let i=0;i<5;i++)hdR(b,6+((hsh(i,o.x)*(W-12))|0),6+((hsh(o.x,i)*10)|0),3,3,[[242,147,180],[242,201,76],[244,244,244]][i%3]);tg.drawImage(hdToCanvas(b),X,Y-6)}
  else if(o.type==='copos'){const b=hdBuf(80,60);hdR(b,40,20,2,40,[120,120,128]);for(let i=0;i<9;i++){const w2=78-Math.abs(i-4)*0;for(let k=0;k<9;k++)hdR(b,i*9,12+Math.abs(i-4)*2,9,10-Math.abs(i-4),[[214,69,69],[244,244,244],[242,201,76]][i%3])}
    for(let k=0;k<80;k++)hdP(b,k,10+Math.abs((k/9|0)-4)*2,[255,255,255],.5);tg.drawImage(hdToCanvas(b),X+W/2-40,Y-46)}
  else if(o.type==='busstop')hdBusStopTop(tg,X,Y,W);
  else if(o.type==='kioscoP'){const b=hdBuf(W+12,20);for(let j=0;j<14;j++)hdR(b,0,j,W+12,1,hdS([36,99,67],1.1-j*.03));hdR(b,0,12,W+12,3,[242,201,76]);hdR(b,2,0,W+8,1,[100,180,130]);tg.drawImage(hdToCanvas(b),X-6,Y-4)}}
// ---- ensamblado ----
const HDCH_TREES=[];
function hdChepe2(m){const W=m.w*HT,H=m.h*HT,b=hdBuf(W,H),EM=[];
  // suelo (igual que antes: asfalto, aceras, adoquines, parque)
  const map={30:14,31:2,32:2,33:1,34:1,5:8};const mt=new Uint8Array(m.t.length);for(let i=0;i<m.t.length;i++){const v=m.t[i];mt[i]=map[v]!==undefined?map[v]:v}
  const mm={w:m.w,h:m.h,t:mt,s:m.s,interior:false,id:'chepe_v'};hdGround(b,mm);hdTileEdges(b,mm);hdRoad(b,mm);
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){const t=ti(m,tx,ty),X=tx*HT,Y=ty*HT;
    if(t===30){const blv=ty>=28&&ty<=33,pea=tx>=22&&tx<=25&&!blv;
      for(let j=0;j<2;j++)for(let i=0;i<2;i++){const v=hsh(tx*2+i,ty*2+j),red=blv?((ty===28&&j===0)||(ty===33&&j===1)||(ty===30&&j===1)||(ty===31&&j===0)):pea?((tx===22&&i===0)||(tx===25&&i===1)):false;
        const dia=blv&&(ty===30||ty===31)&&((tx*2+i)%14===0);const c=hdC(dia?'#8f4a37':red?(v<.5?'#b8644c':'#ad5c45'):(v<.33?'#cdbfa9':v<.66?'#c4b59d':'#d3c6b0'));
        const bx=X+i*16,by=Y+j*16;for(let yy=0;yy<16;yy++)for(let xx=0;xx<16;xx++){let f=.96+hdr(bx+xx,by+yy)*.06+(hdVN(bx+xx,by+yy,18,5)-.5)*.08;if(xx===0||yy===0)f=.7;else if(yy===1||xx===1)f*=1.1;else if(yy===15||xx===15)f*=.86;hdP(b,bx+xx,by+yy,hdS(c,f))}}
      if(hsh(tx*3,ty)<.1)hdEll(b,X+8+hsh(tx,ty)*16,Y+8+hsh(ty,tx)*16,4,3,[110,100,86],.25)}
    else if(t===32){for(let j=0;j<4;j++)for(let i=0;i<4;i++){const v=hsh(tx*4+i,ty*4+j),c=v<.5?[221,212,194]:[212,202,182];const bx=X+i*8,by=Y+j*8;
        for(let yy=0;yy<8;yy++)for(let xx=0;xx<8;xx++){let f=.95+hdr(bx+xx,by+yy)*.06;if(xx===7||yy===7)f=.74;else if(xx===0||yy===0)f=1.07;hdP(b,bx+xx,by+yy,hdS(c,f))}}}
    else if(t===34&&ty===m.cl&&tx%2===0){for(let i=3;i<28;i++)for(const jj of[12,13,18,19]){const r=hdr(X+i,Y+jj);if(r>.05)hdP(b,X+i,Y+jj,hdS([226,190,72],.8+r*.24),r>.16?.92:.45)}}
    else if(t===33){for(let k=0;k<4;k++){const w=hsh(tx,ty*4+k)<.25?18:28;for(let j=0;j<4;j++)for(let i=0;i<w;i++){const r=hdr(X+2+i,Y+2+k*8+j);if(r>.05)hdP(b,X+2+i,Y+2+k*8+j,hdS([226,222,208],.85+r*.15))}}}}
  // fila del fondo (detrás de la Avenida Segunda): azoteas de la cuadra siguiente
  for(let x=0;x<W;x+=96){const h=18+hsh(x,1)*10;hdCh_flatRoof(b,x,0,96,32,['#7d7a75','#8a857c','#76726c'][(x/96|0)%3],x);hdR(b,x,28,96,4,[50,46,44])}
  for(const bd of CHB)hdCityB(b,bd,EM);hdMercado(b,EM);for(const s of CHS)hdSouth(b,s,EM);
  for(const o of m.objs)hdCityObj(b,o,m);
  // árboles del parque: tronco en la base, copa arriba
  HDCH_TREES.length=0;for(const[x,y]of m.trees){const sd=x*37+y*101,kind=hsh(y,x)<.5?1:2,s=.95+hsh(x,y*3)*.2,sp=hdTreeSprite(sd,kind,s,false);const ox=x*HT+16-sp.ax,oy=y*HT+30-sp.ay;hdBlit(b,sp.t,ox,oy);HDCH_TREES.push({sp,x:ox,y:oy,tx:x,ty:y})}
  m.hdEmit=EM;
  const base=hdToCanvas(b);
  const top=mk(W,H),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;
  for(const o of m.objs)hdCityObjTop(tg,o);for(const s of CHS)hdSouthTop(tg,s);
  for(const t of HDCH_TREES)tg.drawImage(hdToCanvas(t.sp.c),t.x,t.y);
  return{base,top}}
