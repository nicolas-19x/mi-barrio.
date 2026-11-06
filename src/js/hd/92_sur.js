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
function hdSodaB(B,o,lv){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,RH=70,FY=Y+RH;
  hdRoofTeja(B,X-4,Y,W+8,RH,'#b8553c',33);hdEave(B,X-4,FY,W+8,'#b8553c');hdPlaster(B,X,FY+5,W,H-RH-5,lv>1?'#f6e2a0':'#efe3c4',37);
  hdR(B,X,Y+H-16,W,16,[63,125,90]);hdR(B,X,Y+H-16,W,2,[96,160,120]);
  hdCh_awning(B,X+4,FY+14,W-8,12,'#2a8f6a','#f4f0e6',5);
  hdR(B,X+14,FY+34,W-28,44,[48,34,26]);hdR(B,X+14,FY+62,W-28,9,[196,158,108]);hdR(B,X+14,FY+62,W-28,1,[230,196,150]);HD_EMIT.push({k:'shop',x:X+14,y:FY+34,w:W-28,h:28});
  for(let i=0;i<5;i++){const px=X+24+i*36;hdR(B,px,FY+46,10,8,[244,244,244]);hdR(B,px+1,FY+44,8,2,[150,96,60]);hdR(B,px+14,FY+48,6,6,[214,69,60])}
  const NM=(typeof sodaNombre==='function'?sodaNombre():'Soda Mi Barrio').toUpperCase();hdSurSign(B,X+W/2-70,FY+6,140,22,'#1e1a24',NM,lv>=5?'#ffd75a':'#f2c94c');
  if(lv>=3)for(let i=0;i<11;i++){const bx=X+10+i*(W-20)/10;hdEll(B,bx,FY+30,2.2,2.2,[[255,226,140],[255,150,130],[160,230,255]][i%3])}
  if(lv>=4){hdR(B,X+W/2-34,FY+30,68,11,[125,60,134]);hdText(B,X+W/2-26,FY+33,'EVENTOS',[255,240,255])}
  if(lv>=5){hdR(B,X+W/2-72,FY+4,144,2,[230,190,70]);hdR(B,X+W/2-72,FY+30,144,2,[230,190,70]);for(const fx of[X+8,X+W-14]){hdR(B,fx+5,Y-34,2,40,[150,150,156]);hdR(B,fx+7,Y-34,16,10,[214,69,60]);hdR(B,fx+7,Y-31,16,4,[250,250,250]);hdR(B,fx+7,Y-29,16,2,[42,82,160])}}
  hdR(B,X+W-48,FY+80,32,22,[244,234,210]);hdR(B,X+W-48,FY+80,32,3,[192,71,59]);hdText(B,X+W-44,FY+86,'CASADO',[60,30,20]);hdText(B,X+W-44,FY+94,'C'+([0,3000,3500,4000,4500,5200][lv]||3000),[192,71,59]);
  if(lv>1)for(let i=0;i<(lv>=3?3:2);i++){const tx=X+10+i*(lv>=3?72:90),ty=Y+H+2;hdEll(B,tx+20,ty+18,22,5,[0,0,0],.2);hdR(B,tx,ty,40,4,[220,60,50]);hdR(B,tx+18,ty+4,4,12,[200,200,200]);for(const cx2 of[tx-8,tx+44])hdR(B,cx2,ty+6,8,8,[220,60,50])}}
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
