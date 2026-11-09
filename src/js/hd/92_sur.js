// ---------- la cuadra nueva (al sur): iglesia, servicentro, taller de Carlillos, lote, plaza y callejón de El Hoyo ----------
function hdSurSign(b,x,y,w,h,bg,txt,fg,k){hdR(b,x-1,y-1,w+2,h+2,[24,20,26]);hdR(b,x,y,w,h,hdC(bg));hdR(b,x,y,w,2,hdS(hdC(bg),1.2));hdR(b,x,y+h-2,w,2,hdS(hdC(bg),.75));
  k=k||1;const tw=hdTextW(txt)*k;if(k>1)hdTextS(b,Math.round(x+w/2-tw/2),Math.round(y+h/2-3*k),txt,hdC(fg),k);else hdText(b,Math.round(x+w/2-tw/2),Math.round(y+(h-7)/2),txt,hdC(fg))}
// ---- iglesia: Parroquia San Isidro (blanca, campanario al centro, puertas de madera) ----
function hdChurch(B,bd){const X=bd.x*HT,Y=bd.y*HT,W=bd.w*HT,H=bd.h*HT,cx=X+W/2,RH=84,FY=Y+RH,seed=91;
  hdRoofTeja(B,X-6,Y+20,W+12,RH-14,'#b4553c',seed);hdEave(B,X-6,FY+6,W+12,'#b4553c');
  hdPlaster(B,X,FY+6,W,H-RH-6,'#f6f1e4',seed);hdR(B,X,FY+6,W,4,[255,252,244]);
  // zócalo celeste y gradas
  hdR(B,X,Y+H-26,W,14,[150,190,210]);hdR(B,X,Y+H-26,W,2,[190,220,232]);for(let k=0;k<3;k++){hdR(B,cx-70+k*6,Y+H-12+k*4,140-k*12,4,hdS([210,204,190],1.04-k*.06));hdR(B,cx-70+k*6,Y+H-12+k*4,140-k*12,1,[236,232,222])}
  // pilastras y ventanas en arco
  for(const px of[X+8,X+W-20,cx-58,cx+46])hdCh_column(B,px,FY+14,12,H-RH-44,'#fbf8f0');
  for(const wx of[X+34,X+W-56])hdCh_win(B,wx,FY+46,22,40,{arch:true,frame:'#e8dfcb',mull:true});
  // campanario
  const tw=78,tx=cx-tw/2,ty=Y-60;hdPlaster(B,tx,ty,tw,FY+10-ty,'#fbf7ec',seed+3);hdR(B,tx-4,ty-8,tw+8,10,[236,230,216]);hdR(B,tx-4,ty-8,tw+8,2,[255,252,244]);hdShadeBand(B,tx+tw-8,ty,8,FY+10-ty,0,.18);
  for(let j=0;j<26;j++){const ww=tw+8-j*3.2;hdR(B,cx-ww/2,ty-8-j,ww,1,hdS([180,86,60],1.04-j*.012))}hdR(B,cx-2,ty-56,5,24,[214,176,82]);hdR(B,cx-9,ty-48,19,4,[214,176,82]);hdP(B,cx,ty-56,[255,230,140]);
  hdEll(B,cx,ty+30,20,22,[60,46,40]);hdEll(B,cx,ty+30,16,18,[40,30,28]);hdEll(B,cx,ty+36,11,10,[214,176,82]);hdEll(B,cx-3,ty+33,5,4,[246,214,120]);hdR(B,cx-1,ty+46,3,6,[90,70,40]);   // campana
  hdEll(B,cx,ty+80,15,15,[60,58,62]);hdEll(B,cx,ty+80,12,12,[250,248,240]);hdR(B,cx,ty+70,1,10,[30,26,30]);hdR(B,cx,ty+80,8,1,[30,26,30]);   // reloj
  hdEll(B,cx,FY+40,16,16,[200,190,170]);hdEll(B,cx,FY+40,13,13,[90,140,190]);for(let a=0;a<8;a++)hdLine(B,cx,FY+40,cx+Math.cos(a*.785)*12,FY+40+Math.sin(a*.785)*12,[230,210,120]);   // rosetón
  // puerta principal de madera en arco
  const dw=40,dh=64,dx=cx-dw/2,dy=Y+H-26-dh;hdR(B,dx-6,dy-6,dw+12,dh+6,[226,218,200]);hdEll(B,cx,dy,dw/2+6,22,[226,218,200]);
  for(let j=0;j<dh;j++)for(let i=0;i<dw;i++){const r=hdr(dx+i,dy+j);let c=hdS([116,72,42],.9+r*.1-(i===dw/2|0?.3:0));if(j%14<1)c=hdS(c,.8);hdP(B,dx+i,dy+j,c)}
  for(let j=-18;j<0;j++)for(let i=0;i<dw;i++){const u=i+.5-dw/2;if(u*u+j*j<(dw/2)**2)hdP(B,dx+i,dy+j,hdS([116,72,42],.82+hdr(dx+i,dy+j)*.1))}
  hdR(B,cx-5,dy+30,3,4,[214,176,82]);hdR(B,cx+3,dy+30,3,4,[214,176,82]);
  hdTextS(B,cx-hdTextW('PARROQUIA SAN ISIDRO')/2,FY+16,'PARROQUIA SAN ISIDRO',[120,92,52],1);
  for(const lx of[dx-24,dx+dw+16]){hdR(B,lx+3,dy+20,2,30,[34,32,36]);hdR(B,lx,dy+12,8,10,[34,32,36]);hdR(B,lx+1,dy+14,6,6,[250,220,140]);HD_EMIT.push({k:'shop',b:'iglesia',x:lx+1,y:dy+14,w:6,h:6})}
  HD_EMIT.push({k:'win',b:'iglesia',x:cx-13,y:FY+27,w:26,h:26})}
// ---- lote baldío con rótulo SE VENDE (después será la soda) ----
function hdLote(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const r=hdr(X+i,Y+j),n=hdVN(X+i,Y+j,14,4);hdP(B,X+i,Y+j,hdS(n>.55?[104,140,62]:[124,150,72],.86+r*.2))}
  for(let n=0;n<160;n++){const px=X+hsh(n,3)*W,py=Y+8+hsh(3,n)*(H-10),L=4+hsh(n,5)*10;for(let t=0;t<L;t++)hdP(B,px+Math.sin(t*.4+n)*1.5,py-t,t>L*.6?[150,176,84]:[96,130,58])}   // monte alto
  hdR(B,X,Y,W,22,[132,128,120]);for(let i=0;i<W;i+=16)for(let j=0;j<22;j+=8)hdR(B,X+i+((j/8)%2?8:0),Y+j,15,7,hdS([150,146,138],.92+hsh(i,j)*.12));hdR(B,X,Y+20,W,2,[90,86,80]);   // tapia del fondo
  hdEll(B,X+40,Y+H-30,10,5,[70,60,50]);hdR(B,X+34,Y+H-38,12,8,[170,60,50]);hdEll(B,X+W-50,Y+H-40,14,6,[120,120,126]);   // basura, una llanta
  const sx=X+W/2-50,sy=Y+H-74;for(const lx of[sx+16,sx+82])hdR(B,lx,sy+34,4,40,[96,66,40]);hdSurSign(B,sx,sy,100,36,'#f4ead2','SE VENDE','#c0473b',2);hdText(B,sx+18,sy+26,'TEL 8701-2244',[60,40,30])}
// ---- soda (cuando se compra el lote) ----
// Mantel de cuadros rojos y blancos (sirve para las mesas de la terraza y las del jardín)
function hdSodaCloth(B,x,y,w,h,drape){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const ch=(((i>>2)+(j>>2))&1);let c=ch?[214,52,48]:[250,246,238];if(((i>>2)&1)&&((j>>2)&1))c=[236,150,148];hdP(B,x+i,y+j,hdS(c,.9+.1*j/h+(hdr(x+i,y+j)-.5)*.04))}
  if(drape)for(let j=0;j<drape;j++)for(let i=0;i<w;i++){const L=Math.round(1.5*Math.sin(i*.5))+drape-j;if(L<=0)continue;const ch=(((i>>2)+((h+j)>>2))&1);hdP(B,x+i,y+h+j,hdS(ch?[190,44,42]:[226,222,214],.84-.04*j))}}
function hdSodaTable(B,cx,cy,seed){// mesa de la terraza con cuatro sillas
  const WD=[[62,36,20],[96,58,34],[130,82,50],[160,108,68]];hdEll(B,cx,cy+22,26,5,[40,24,10],.3);
  for(const dx of[-17,-9,9,17]){hdR(B,cx+dx-3,cy-12,7,13,WD[2]);hdR(B,cx+dx-3,cy-12,1,13,WD[3]);hdR(B,cx+dx-3,cy-12,7,1,WD[3]);hdR(B,cx+dx-2,cy-6,5,1,WD[1])}   // respaldos de atrás
  hdSodaCloth(B,cx-20,cy-3,40,11,5);hdR(B,cx-18,cy+13,3,9,WD[1]);hdR(B,cx+15,cy+13,3,9,WD[1]);
  hdR(B,cx-6,cy-9,3,6,[220,50,46]);hdR(B,cx-6,cy-10,3,1,[255,255,255]);hdR(B,cx+4,cy-9,3,6,[240,210,60]);hdR(B,cx+4,cy-10,3,1,[255,255,255]);hdR(B,cx-1,cy-6,2,3,[250,250,250]);   // salsa, mostaza, salero
  for(const dx of[-27,22]){hdR(B,dx<0?cx+dx:cx+dx+2,cy-1,4,22,WD[2]);hdR(B,dx<0?cx+dx:cx+dx+2,cy-1,1,22,WD[3]);hdR(B,cx+dx-2,cy+9,8,3,WD[2]);hdR(B,cx+dx-2,cy+9,8,1,WD[3])}   // sillas de los lados
  }
function hdSodaPicnic(B,cx,cy){// mesa de jardín con bancas
  const WD=[[70,44,24],[104,66,38],[140,96,56],[172,124,76]];hdEll(B,cx,cy+22,30,6,[20,50,20],.32);
  for(const[by,h]of[[cy-12,4],[cy+16,4]]){hdR(B,cx-26,by,52,h,WD[2]);hdR(B,cx-26,by,52,1,WD[3]);hdR(B,cx-24,by+h,3,6,WD[0]);hdR(B,cx+21,by+h,3,6,WD[0])}
  for(const lx of[cx-20,cx+17]){hdLine(B,lx,cy-2,lx+5,cy+16,WD[1],1,2)}
  hdSodaCloth(B,cx-24,cy-8,48,13,4);hdR(B,cx-26,cy-9,52,2,WD[3]);hdR(B,cx-26,cy-9,52,1,[200,160,110]);
  hdR(B,cx-10,cy-14,3,7,[220,50,46]);hdR(B,cx-10,cy-15,3,1,[255,255,255]);hdR(B,cx+6,cy-14,3,7,[240,210,60]);hdR(B,cx+6,cy-15,3,1,[255,255,255])}
function hdSodaB(B,o,lv){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,RH=50,FL=46,seed=33;   // FL: ancho de los lados de pared
  const NM=(typeof sodaNombre==='function'?sodaNombre():'Soda Mi Barrio').toUpperCase(),wallC=lv>1?'#f5c431':'#efc24a';
  // ---- jardín y piso (todo el lote)
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=X+i,y=Y+j,r=hdr(x,y),n=hdVN(x,y,16,4);hdP(B,x,y,hdS(n>.55?[84,142,60]:[100,156,66],.88+r*.2))}
  for(let n=0;n<70;n++){const px=X+hsh(n,3)*W,py=Y+150+hsh(3,n)*40,L=3+hsh(n,5)*5;for(let t=0;t<L;t++)hdP(B,px,py-t,t>L*.6?[150,196,84]:[70,120,50])}
  // ---- techo de teja roja, con el aire acondicionado en la cumbrera
  hdRoofTeja(B,X-6,Y,W+12,RH+4,'#c9442c',seed);hdEave(B,X-6,Y+RH+2,W+12,'#a8362a');hdR(B,X-6,Y+RH+8,W+12,3,[0,0,0],.18);
  hdR(B,X+W-44,Y+6,26,15,[206,208,210]);hdR(B,X+W-44,Y+6,26,2,[238,240,242]);hdR(B,X+W-44,Y+19,26,2,[150,152,156]);for(let k=0;k<5;k++)hdR(B,X+W-41+k*4,Y+9,2,9,[90,92,98]);hdR(B,X+W-18,Y+8,3,12,[170,172,176]);
  // ---- paredes amarillas con zócalo azul
  const WY=Y+RH+8,WH=82;hdPlaster(B,X,WY,W,WH,wallC,37);hdShadeBand(B,X,WY,W,6,.28,.02);
  for(const fx of[X,X+W-FL]){hdR(B,fx,WY+WH-16,FL,16,[42,92,168]);hdR(B,fx,WY+WH-16,FL,2,[90,140,210]);hdR(B,fx,WY+WH-1,FL,1,[24,52,100])}
  hdR(B,X+FL-2,WY,2,WH,hdS(hdC(wallC),.7));hdR(B,X+W-FL,WY,2,WH,hdS(hdC(wallC),.8));hdShadeBand(B,X+W-8,WY,8,WH,0,.22);
  // ---- terraza: fondo oscuro del comedor, piso de baldosa y las mesas
  const TX=X+FL,TW=W-2*FL,TY=WY+10,TH=WH-10;
  for(let j=0;j<TH;j++)for(let i=0;i<TW;i++){const x=TX+i,y=TY+j;let c;
    if(j<22){c=hdMix([58,38,28],[84,56,40],j/22);if((i%24)<2)c=hdS(c,.7);if(j>14&&((i+6)%24)<9)c=hdS(c,1.25)}   // el comedor al fondo: mostrador y sillas apiladas
    else{const u=(i%16),v=((j-22)%16);c=[220,134,72];if(u===0||v===0)c=[150,86,48];else if(u===1||v===1)c=[236,156,90];c=hdS(c,(.86+.14*(j-22)/(TH-22))*(.96+hdr(x,y)*.06))}hdP(B,x,y,c)}
  hdR(B,TX,TY,TW,3,[0,0,0],.3);hdShadeBand(B,TX,TY+3,TW,10,.3,0);
  hdSodaTable(B,TX+36,TY+30);hdSodaTable(B,TX+TW-36,TY+30);
  for(const px of[TX+6,TX+TW-18])hdPlantPot(B,px,TY+TH-2,true);
  HD_EMIT.push({k:'shop',x:TX+6,y:TY+3,w:TW-12,h:20});
  // ---- toldo a rayas azul, blanco y rojo
  {const ax=TX-3,aw=TW+6,ay=WY+12,ah=20,C3=[[40,84,170],[250,248,242],[212,48,44],[250,248,242]];
    hdR(B,ax+3,ay+ah+4,aw,5,[20,20,20],.25);
    for(let i=0;i<aw;i++){const k=Math.floor(i/12)%4,c=C3[k],sc=Math.round(3*Math.sin(((i%12)/12)*Math.PI));for(let j=0;j<ah+sc;j++){const f=.82+.28*Math.min(1,j/ah)-(j>=ah?.12:0)+(hdr(ax+i,ay+j)-.5)*.04;hdP(B,ax+i,ay+j,hdS(c,f))}hdP(B,ax+i,ay+ah+sc,hdS(c,.62))}
    hdR(B,ax,ay,aw,2,[60,20,20]);hdR(B,ax,ay+2,aw,1,[255,255,255],.35)}
  // ---- el rótulo grande con el plato de casado y la pincelada
  {const sx=X+6,sy=Y+28,sw=W-12,sh=42,gold=lv>=5;hdR(B,sx+3,sy+sh,sw,5,[20,20,20],.28);
    for(let j=0;j<sh;j++)for(let i=0;i<sw;i++){const x=sx+i,y=sy+j;let c=hdS([246,232,200],.95+hdVN(x,y,14,9)*.06+(hdr(x,y)-.5)*.03);
      const ds=i+j*.9;if((ds<20||ds>sw+sh*.9-20)&&Math.abs(((ds*1.3)%9)-4)<2.2)c=hdMix(c,(i<sw/2)?[214,52,48]:[40,84,170],.9);   // pinceladas a los lados
      hdP(B,x,y,c)}
    const fr=gold?[214,170,60]:[110,70,40];hdR(B,sx,sy,sw,2,fr);hdR(B,sx,sy+sh-2,sw,2,hdS(fr,.7));hdR(B,sx,sy,2,sh,fr);hdR(B,sx+sw-2,sy,2,sh,hdS(fr,.8));hdR(B,sx,sy,sw,1,hdS(fr,1.3));
    // el plato: arroz, frijoles, plátano maduro, ensalada y tomate
    const px=sx+30,py=sy+sh/2+1;hdEll(B,px+2,py+3,24,16,[60,50,40],.25);hdEll(B,px,py,24,16,[250,248,242]);hdEll(B,px,py,21,13,[226,222,214]);hdEll(B,px,py,20,12,[244,242,236]);
    hdEll(B,px-9,py+1,8,7,[60,36,28]);hdEll(B,px-10,py,5,4,[96,62,46]);hdEll(B,px+3,py+1,8,7,[250,248,242]);hdEll(B,px+2,py,5,4,[255,255,255]);
    hdEll(B,px+11,py-4,6,4,[246,206,70]);hdEll(B,px+13,py+2,5,3,[240,190,50]);hdEll(B,px-1,py-8,9,4,[110,176,70]);hdEll(B,px-3,py-8,4,2,[156,210,100]);hdEll(B,px+8,py-8,3,3,[214,60,50]);hdEll(B,px-12,py-7,3,3,[214,60,50]);
    // el nombre grande en azul, con la rayita roja de abajo; si no cabe, en letra chica
    const tx0=sx+62,tw=sw-70;let k=2;if(hdTextW(NM)*2>tw+6)k=1;const nw=hdTextW(NM)*k,nx=tx0+(tw-nw)/2|0,ny=sy+(k===2?6:10);
    hdTextS(B,nx,ny,NM,[28,52,128],k,[255,250,240]);if(k===1)hdTextS(B,nx+1,ny,NM,[28,52,128],k);hdR(B,nx,ny+7*k+3,nw,2,[214,52,48]);hdR(B,nx+nw*.3,ny+7*k+6,nw*.5,1,[40,84,170]);
    const sub='COMIDA TIPICA Y CASERA',swd=hdTextW(sub);hdText(B,tx0+(tw-swd)/2|0,sy+sh-13,sub,[176,40,40]);
    HD_EMIT.push({k:'shop',x:sx+4,y:sy+4,w:sw-8,h:sh-8});HD_EMIT.push({k:'lamp',x:X+22,y:WY+16,w:6,h:6});
    if(lv>=3)for(let i=0;i<14;i++){const bx=X+10+i*(W-20)/13;hdEll(B,bx,sy-4+Math.sin(i*1.2)*2,2.2,2.2,[[255,226,140],[255,150,130],[160,230,255]][i%3])}}
  if(lv>=4){hdR(B,X+W/2-34,WY+13,68,10,[125,60,134]);hdR(B,X+W/2-34,WY+13,68,1,[170,100,180]);hdText(B,X+W/2-26,WY+15,'EVENTOS',[255,240,255])}
  // ---- pizarra con el menú, farol, bandera y el basurero
  {const bx=X+3,by=WY+21,bw=37,bh=46;hdR(B,bx+2,by+bh,bw,4,[0,0,0],.25);hdR(B,bx-2,by-2,bw+4,bh+4,[130,86,48]);hdR(B,bx-2,by-2,bw+4,1,[176,124,76]);hdR(B,bx-2,by+bh+1,bw+4,1,[80,50,28]);
    for(let j=0;j<bh;j++)for(let i=0;i<bw;i++)hdP(B,bx+i,by+j,hdS([38,50,44],.94+hdVN(bx+i,by+j,6,3)*.14+(hdr(bx+i,by+j)>.97?.2:0)));
    const L=['MENU','CASADO','GALLO','TAMAL','C'+([0,3000,3500,4000,4500,5200][lv]||3000)];L.forEach((t,i)=>hdText(B,bx+((bw-hdTextW(t))>>1),by+5+i*8,t,i===0?[255,214,120]:i===4?[255,170,150]:[238,238,226]));
    hdR(B,bx+bw/2-4,by+bh-4,1,1,[238,238,226]);hdR(B,bx+bw/2+3,by+bh-4,1,1,[238,238,226]);hdR(B,bx+bw/2-3,by+bh-2,6,1,[238,238,226])}
  {const lx=X+24,ly=WY+13;hdR(B,lx-8,ly-2,10,2,[30,26,28]);hdR(B,lx,ly-1,1,3,[30,26,28]);hdLamp(B,lx-2,ly+2);hdEll(B,lx,ly+8,8,8,[255,236,150],.16)}
  {const fx=X+W-FL+10,fy=WY+22;hdR(B,fx-2,fy-2,2,50,[120,84,50]);hdR(B,fx+26,fy+4,3,3,[120,84,50]);hdR(B,fx+3,fy+2,24,3,[0,0,0],.2);hdFlag(B,fx,fy,26,34);hdR(B,fx,fy+13,26,8,[206,17,38]);hdEll(B,fx+8,fy+17,4,4,[250,250,250]);hdEll(B,fx+8,fy+17,3,3,[70,150,90]);hdP(B,fx+8,fy+16,[200,150,60]);
    for(let j=0;j<34;j++)hdM(B,fx+20+(j%3),fy+j,6,1,[.84,.84,.9]);}
  // ---- acera de entrada, camino al centro y jardín con mesas
  hdR(B,X,Y+H-58,W,3,[0,0,0],.2);
  for(let j=Y+H-56;j<Y+H-44;j++)for(let i=0;i<W;i++){const x=X+i,y=j,u=(i%24),v=((j-(Y+H-56))%12);let c=[188,182,170];if(u===0||v===0)c=[140,134,124];hdP(B,x,y,hdS(c,.94+hdr(x,y)*.08))}
  for(let j=Y+H-44;j<Y+H;j++)for(let i=W/2-16;i<W/2+16;i++){const x=X+i,y=j,u=((i-(W/2-16))%16),v=((j-(Y+H-44))%12);let c=[186,180,168];if(u===0||v===0)c=[138,132,122];hdP(B,x,y,hdS(c,.94+hdr(x,y)*.08))}
  hdSodaPicnic(B,X+42,Y+H-26);if(lv>1)hdSodaPicnic(B,X+W-42,Y+H-26);
  // el basurero rojo
  {const tx=X+W-26,ty=Y+H-62;hdEll(B,tx+8,ty+20,10,3,[20,40,20],.3);hdR(B,tx,ty,16,20,[196,40,38]);hdR(B,tx,ty,16,3,[230,70,64]);hdR(B,tx-1,ty-3,18,4,[150,30,30]);hdR(B,tx+7,ty-6,3,3,[110,24,24]);hdR(B,tx+15,ty,1,20,[130,28,28]);hdR(B,tx+5,ty+8,6,1,[255,255,255]);hdR(B,tx+7,ty+6,2,1,[255,255,255]);hdR(B,tx+6,ty+9,4,5,[255,255,255],.85)}
  // arbustos con flores rojas
  for(const[bx,by,sd]of[[X+6,Y+H-34,3],[X+W-6,Y+H-34,9],[X+88,Y+H-6,5],[X+W-88,Y+H-6,11],[X+6,Y+H-4,13],[X+W-6,Y+H-4,17]])hdBush(B,bx,by,sd,true);
  if(lv>=5){hdR(B,X+6,Y+28,W-12,2,[230,190,70]);for(const fx of[X+8,X+W-14]){hdR(B,fx+5,Y-34,2,40,[150,150,156]);hdR(B,fx+7,Y-34,16,10,[214,69,60]);hdR(B,fx+7,Y-31,16,4,[250,250,250]);hdR(B,fx+7,Y-29,16,2,[42,82,160])}}}
// ---- Taller El Abuelo (Carlillos) ----
function hdTaller(B,o,open){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,RH=64,FY=Y+RH;
  hdRoofZinc(B,X-4,Y,W+8,RH,'#8f9aa1',71,false);hdEave(B,X-4,FY,W+8,'#8f9aa1');
  hdPlaster(B,X,FY+5,W,H-RH-5,'#c9c2b0',72);for(let i=0;i<W;i+=3)if(hsh(i,5)<.3)hdR(B,X+i,FY+40+hsh(i,7)*60,2,8,[90,80,70],.4);   // manchas de grasa
  const gx=X+14,gy=FY+26,gw=W-28,gh=H-RH-30;
  if(open){hdR(B,gx,gy,gw,gh,[38,34,36]);for(let i=0;i<gw;i+=22){hdR(B,gx+i+4,gy+8,12,2,[150,150,156]);hdR(B,gx+i+6,gy+10,2,10,[150,150,156])}   // herramientas
    hdR(B,gx+6,gy+gh-30,40,22,[60,56,58]);hdEll(B,gx+16,gy+gh-8,7,7,[24,24,26]);hdEll(B,gx+40,gy+gh-8,7,7,[24,24,26]);hdR(B,gx+14,gy+gh-26,30,8,[192,71,59]);   // moto en reparación
    hdR(B,gx+gw-40,gy+gh-26,26,26,[200,60,40]);hdR(B,gx+gw-40,gy+gh-26,26,3,[230,100,80]);hdEll(B,gx+gw-27,gy+gh-30,8,3,[60,60,60]);   // compresor
    hdR(B,gx,gy,gw,6,[80,80,86]);HD_EMIT.push({k:'shop',x:gx,y:gy,w:gw,h:gh})}
  else{for(let j=0;j<gh;j++){const c=j%5===0?[110,114,120]:[150,154,160];hdR(B,gx,gy+j,gw,1,hdS(c,.95+hdr(gx,gy+j)*.08))}hdText(B,gx+16,gy+20,'SE ALQUILA',[60,60,66]);hdText(B,gx+12,gy+42,'KVN',[63,182,176])}
  hdSurSign(B,X+10,FY+6,W-20,18,'#1f4e9c',open?'TALLER EL ABUELO':'LOCAL','#f7d24a');
  // llantas apiladas y estañón de aceite
  for(let k=0;k<3;k++){hdEll(B,X+W-14,Y+H-12-k*9,11,5,[26,26,30]);hdEll(B,X+W-14,Y+H-13-k*9,6,2.5,[60,60,66])}hdR(B,X+4,Y+H-34,18,30,[52,96,150]);hdEll(B,X+13,Y+H-34,9,3,[70,120,170])}
// ---- Servicentro La Pasada ----
function hdBomba(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const r=hdr(X+i,Y+j);let c=hdS([186,184,178],.94+r*.07);if(((i)%64===0)||((j)%64===0))c=[150,148,142];hdP(B,X+i,Y+j,c)}
  for(let n=0;n<14;n++)hdEll(B,X+40+hsh(n,2)*(W-80),Y+110+hsh(2,n)*(H-130),6+hsh(n,3)*8,3,[60,58,56],.25);   // aceite
  // tiendita al fondo
  const sx=X+18,sw=W-36,sy=Y+4,sh=86;hdRoofZinc(B,sx-4,sy,sw+8,34,'#e9e6e0',81,true);hdPlaster(B,sx,sy+34,sw,sh-34,'#f4f2ec',82);
  hdR(B,sx,sy+40,sw,8,[200,40,40]);hdText(B,sx+sw/2-hdTextW('SERVICENTRO LA PASADA')/2,sy+41,'SERVICENTRO LA PASADA',[255,255,255]);
  hdCh_win(B,sx+20,sy+54,sw*.45,26,{frame:'#d8dde2',mull:true});HD_EMIT.push({k:'shop',x:sx+20,y:sy+54,w:sw*.45,h:26});hdR(B,sx+sw-70,sy+52,30,32,[170,200,216]);hdR(B,sx+sw-56,sy+52,2,32,[90,100,110]);
  hdText(B,sx+sw*.5+10,sy+62,'MINI SÚPER',[40,40,46]);
  // islas y bombas
  for(const px of[X+W*.32,X+W*.62]){const py=Y+H-80;hdR(B,px-26,py+30,52,10,[220,216,208]);hdR(B,px-26,py+30,52,2,[240,240,236]);
    for(const dx of[-16,8]){hdR(B,px+dx,py,14,32,[214,60,50]);hdR(B,px+dx,py,14,2,[240,100,90]);hdR(B,px+dx+2,py+4,10,8,[30,40,50]);hdR(B,px+dx+3,py+5,8,3,[120,230,160]);hdR(B,px+dx+3,py+16,8,10,[240,240,240]);hdLine(B,px+dx+13,py+10,px+dx+18,py+24,[30,30,34])}}
  // rótulo de precios
  const rx=X+W-30,ry=Y+H-120;hdR(B,rx+6,ry+40,4,80,[90,90,96]);hdR(B,rx-14,ry,44,44,[30,30,36]);hdR(B,rx-12,ry+2,40,40,[200,40,40]);
  for(const[i,t,p]of[[0,'SÚPER','780'],[1,'REG','760'],[2,'DIÉS','690']]){hdText(B,rx-10,ry+5+i*12,t,[255,255,255]);hdText(B,rx+10,ry+5+i*12,p,[255,226,120])}
  hdR(B,X+6,Y+H-44,14,26,[60,120,190]);hdText(B,X+4,Y+H-54,'AIRE',[40,40,46])}
function hdBombaTop(tg,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,b=hdBuf(W-20,40);
  for(let j=0;j<28;j++)hdR(b,0,j,W-20,1,hdS([240,240,236],1.02-j*.008));for(let i=0;i<W-20;i+=40)hdR(b,i,22,20,6,[200,40,40]);hdR(b,0,26,W-20,3,[160,30,30]);hdR(b,0,0,W-20,2,[255,255,255]);
  for(const px of[(W-20)*.32,(W-20)*.62])hdR(b,px-3,28,6,12,[200,200,204]);tg.drawImage(hdToCanvas(b),X+10,Y+H-138)}
// ---- fuente de la plaza ----
function hdFuente(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,cx=X+W/2,cy=Y+H/2+6;
  hdEll(B,cx,cy+8,W/2,H/2-6,[20,20,24],.2);hdEll(B,cx,cy,W/2-2,H/2-10,[196,190,176]);hdEll(B,cx,cy-2,W/2-8,H/2-16,[90,150,180]);hdEll(B,cx-10,cy-8,W/4,H/6,[150,200,220],.6);
  hdR(B,cx-8,cy-40,16,38,[210,204,190]);hdR(B,cx-8,cy-40,4,38,[236,230,216]);hdEll(B,cx,cy-40,20,6,[196,190,176]);hdEll(B,cx,cy-42,15,4,[100,160,190]);hdR(B,cx-2,cy-56,4,14,[180,220,236])}
// ---- callejón a El Hoyo ----
function hdHoyoGate(B){const tags=[[77,68,'EL HOYO',[242,153,74]],[80,71,'SOLO',[63,182,176]],[80,72,'VECINOS',[63,182,176]],[77,76,'KVN',[242,201,76]],[80,78,'PURA CALLE',[241,147,180]]];
  for(const[x,y,t,c]of tags){const tx=Math.round(x*HT+16-hdTextW(t)/2),ty=y*HT+10;for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]])hdText(B,tx+dx,ty+dy,t,[24,20,24]);hdText(B,tx,ty,t,c)}
  for(const[x,y]of[[78,73],[79,77],[78,80]]){hdEll(B,x*HT+14,y*HT+20,9,6,[34,32,38]);hdEll(B,x*HT+11,y*HT+17,4,3,[70,70,80])}}
function hdSurBase(B,m){if(m.id!=='ext')return;for(const o of m.objs){
  if(o.type==='lote'){if(typeof progSodaLv==='function'&&progSodaLv()>0)hdSodaB(B,o,progSodaLv());else hdLote(B,o);HD_OBJ_HD.add('lote')}
  else if(o.type==='tallerK'){hdTaller(B,o,!!(S&&S.f&&S.f.kevinHelp));HD_OBJ_HD.add('tallerK')}
  else if(o.type==='bomba'){hdBomba(B,o);HD_OBJ_HD.add('bomba')}
  else if(o.type==='fuente'){hdFuente(B,o);HD_OBJ_HD.add('fuente')}}
  hdHoyoGate(B)}
function hdSurTop(tg,m){if(m.id!=='ext')return;for(const o of m.objs)if(o.type==='bomba')hdBombaTop(tg,o)}
