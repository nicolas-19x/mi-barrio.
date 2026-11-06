// ---------- El Hoyo: ranchos de zinc, murales, pulpería con rejas, lote de motos, cantina, canchita ----------
function hdZincWall(b,x,y,w,h,seed){const sheets=[[150,156,160],[122,128,132],[168,120,90],[110,118,104],[176,170,160]];
  for(let i=0;i<w;i+=22){const c=sheets[(hsh(seed,i)*sheets.length)|0],sw=Math.min(22,w-i),off=((hsh(i,seed)*6)|0)-3;
    for(let j=0;j<h;j++)for(let k=0;k<sw;k++){const cor=[1.1,1.02,.92,.82,.92,1.02][(k+seed)%6];let f=cor*(.92+hdr(x+i+k,y+j)*.1);if(j<2)f*=1.15;hdP(b,x+i+k,y+j+off*0,hdS(c,f))}
    for(let n=0;n<4;n++){const rx=x+i+hsh(n,seed+i)*sw,ry=y+hsh(seed+i,n)*h,L=6+hsh(n,i)*16;for(let t=0;t<L&&ry+t<y+h;t++)hdP(b,rx,ry+t,[130,70,34],.5*(1-t/L))}
    hdR(b,x+i,y,1,h,[60,58,56],.5)}}
function hdRancho(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,RH=56,FY=Y+RH,sd=o.seed||1;
  hdRoofZinc(B,X-4,Y,W+8,RH,hsh(sd,1)<.5?'#8f8a84':'#9a6a50',sd,false);
  for(let n=0;n<4;n++){const px=X+10+hsh(n,sd)*(W-24),py=Y+14+hsh(sd,n)*(RH-26);hdEll(B,px,py,5,4,[110,106,100]);hdP(B,px-2,py-2,[160,156,150])}   // piedras sobre el techo
  if(hsh(sd,2)<.5){hdR(B,X+W-30,Y+6,18,10,[200,60,40]);hdEll(B,X+W-21,Y+6,9,3,[220,80,60])}   // tanque de agua de lata
  hdEave(B,X-4,FY,W+8,'#8f8a84');
  if(hsh(sd,3)<.55)hdZincWall(B,X,FY+5,W,H-RH-5,sd);else{hdPlaster(B,X,FY+5,W,H-RH-5,o.col||'#c9b9a0',sd);for(let j=FY+12;j<Y+H-4;j+=10)for(let i=X+((j/10)%2?0:10);i<X+W;i+=20)hdR(B,i,j,19,1,hdS(hdC(o.col||'#c9b9a0'),.8))}
  if(o.mural){const cols=[[242,153,74],[63,182,176],[241,147,180],[242,201,76]];for(let i=0;i<W-16;i+=2)for(let j=0;j<24;j++){const v=Math.sin(i*.08+j*.2+sd)+Math.cos(i*.05-j*.1);if(v>.4)hdP(B,X+8+i,FY+16+j,cols[((v*3)|0)%4],.85)}hdText(B,X+12,FY+44,pick2(hsh(sd,5),['FE','BARRIO','PAZ','MAMÁ TE AMO','RESPETO']),[255,255,255],[30,26,30])}
  const wx=X+12,wy=FY+20;hdCh_win(B,wx,wy,20,16,{frame:'#6a6a70',mull:false});for(let i=wx+2;i<wx+20;i+=4)hdR(B,i,wy-1,1,18,[30,26,26]);HD_EMIT_HOYO.push({k:'win',x:wx,y:wy,w:20,h:16});
  const dX=X+W-34,dY=Y+H-48;for(let j=0;j<46;j++)for(let i=0;i<22;i++)hdP(B,dX+i,dY+j,hdS(hsh(sd,6)<.5?[60,90,140]:[120,70,40],.86+hdr(dX+i,dY+j)*.12));
  if(hsh(sd,7)<.6){hdR(B,dX-3,dY,2,46,[30,26,26]);for(let j=dY;j<dY+46;j+=6)hdR(B,dX-3,j,28,1,[30,26,26])}   // reja
  hdR(B,X+4,Y+H-10,12,10,[160,70,50]);for(let k=0;k<6;k++)hdP(B,X+6+k*2,Y+H-12-(k%3),[70,140,60]);   // mata en tarro de pintura
  hdShadeBand(B,X,Y+H-4,W,4,.05,.3)}
function hdPulpaReja(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,RH=50,FY=Y+RH;hdRoofZinc(B,X-4,Y,W+8,RH,'#a05a3c',121,false);hdEave(B,X-4,FY,W+8,'#a05a3c');
  hdPlaster(B,X,FY+5,W,H-RH-5,'#f2d26a',122);hdR(B,X+10,FY+24,W-20,H-RH-34,[44,32,26]);for(let i=0;i<8;i++)hdR(B,X+16+i*24,FY+30,16,12,[[214,69,69],[242,201,76],[123,182,97],[63,127,209]][i%4]);
  for(let i=X+10;i<X+W-10;i+=5)hdR(B,i,FY+22,2,H-RH-30,[30,26,26]);hdR(B,X+10,FY+22,W-20,2,[30,26,26]);hdR(B,X+10,FY+48,W-20,2,[30,26,26]);
  HD_EMIT_HOYO.push({k:'shop',x:X+10,y:FY+24,w:W-20,h:H-RH-34});hdSurSign(B,X+W/2-60,FY+6,120,16,'#c0473b','PULPERÍA LA REJA','#fff2c0');hdText(B,X+14,Y+H-14,'NO SE FÍA',[192,71,59])}
function hdMotosLote(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++)hdP(B,X+i,Y+j,hdS([150,140,124],.9+hdr(X+i,Y+j)*.12));for(let i=0;i<W;i+=6)hdR(B,X+i,Y,2,H,[120,120,124],.35);   // malla
  for(let i=0;i<W;i+=20)hdR(B,X+i,Y,3,H,[90,90,96]);hdR(B,X,Y,W,3,[90,90,96]);
  const cols=['#c0473b','#2a6fb0','#2a2a30','#e2b33a'];for(let k=0;k<4;k++){const s=typeof vehSprite==='function'?vehSprite('moto',cols[k],0,'#c9c2b0'):null;if(s){const tmp=hdBuf(s.width,s.height);/* dibujadas encima en la capa de arriba */}}
  hdSurSign(B,X+20,Y+8,W-40,18,'#f2c94c','MOTOS EL CHINO · SE FINANCIA','#30202a');hdText(B,X+24,Y+H-14,'PAPELES AL DÍA (CASI)',[120,40,30])}
function hdCantina(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT,RH=52,FY=Y+RH;hdRoofZinc(B,X-4,Y,W+8,RH,'#6f6a64',131,false);hdEave(B,X-4,FY,W+8,'#6f6a64');hdPlaster(B,X,FY+5,W,H-RH-5,'#3f6e5a',132);
  hdR(B,X+W/2-20,Y+H-50,40,48,[30,22,18]);hdR(B,X+W/2-20,Y+H-50,40,2,[90,60,40]);for(let k=0;k<2;k++)hdR(B,X+W/2-18+k*20,Y+H-40,16,24,[120,80,40]);   // puertas de cantina
  hdSurSign(B,X+W/2-62,FY+8,124,16,'#1e1a24','EL ÚLTIMO TRAGO','#f193b4');for(const[x2,c]of[[X+16,[242,201,76]],[X+W-28,[63,182,176]]])hdR(B,x2,FY+30,12,16,c);HD_EMIT_HOYO.push({k:'shop',x:X+16,y:FY+30,w:W-32,h:16})}
function hdCanchaH(B,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,H=o.h*HT;for(let j=0;j<H;j++)for(let i=0;i<W;i++)hdP(B,X+i,Y+j,hdS([150,118,80],.9+hdr(X+i,Y+j)*.14+(hdVN(X+i,Y+j,20,8)-.5)*.12));
  for(const gx of[X+8,X+W-22]){for(let k=0;k<3;k++){hdEll(B,gx+7,Y+H/2-30+k*30,9,5,[26,26,30]);hdEll(B,gx+7,Y+H/2-31+k*30,5,2,[60,60,66])}}hdEll(B,X+W/2,Y+H/2,22,22,[255,255,255],.25);hdEll(B,X+W/2,Y+H/2,20,20,[150,118,80])}
function hdTendedero(t,o){const X=o.x*HT,Y=o.y*HT,W=o.w*HT,b=hdBuf(W,40);hdR(b,0,4,2,36,[90,70,50]);hdR(b,W-2,4,2,36,[90,70,50]);for(let i=0;i<W;i++)hdP(b,i,6+Math.sin(i/W*Math.PI)*5,[40,40,44]);
  for(let k=0;k<5;k++){const cx=8+k*(W-16)/4,cy=8+Math.sin(cx/W*Math.PI)*5,c=[[214,69,69],[242,201,76],[63,127,209],[244,244,244],[123,182,97]][(k+o.x)%5];hdR(b,cx-5,cy,10,12+(k%2)*4,c);hdR(b,cx-5,cy,10,1,hdS(c,1.2))}t.drawImage(hdToCanvas(b),X,Y-30)}
let HD_EMIT_HOYO=[];
function hdHoyoMap(m){HD_EMIT_HOYO=[];const W=m.w*HT,H=m.h*HT,b=hdBuf(W,H);hdGround(b,m);hdTileEdges(b,m);
  for(let n=0;n<60;n++){const px=hsh(n,1)*W,py=hsh(1,n)*H;hdEll(b,px,py,6+hsh(n,2)*10,3+hsh(2,n)*4,[90,74,56],.22)}   // charcos y manchas
  for(const o of m.objs){if(o.type==='rancho')hdRancho(b,o);else if(o.type==='pulpaReja')hdPulpaReja(b,o);else if(o.type==='motos')hdMotosLote(b,o);else if(o.type==='cantina')hdCantina(b,o);else if(o.type==='canchaH')hdCanchaH(b,o)}
  for(let x=0;x<m.w;x+=1)if(hsh(x,9)<.3){const px=x*HT+8;hdR(b,px,4,3,22,[96,90,82])}
  hdText(b,22*HT-10,6,'EL HOYO',[242,153,74],[30,26,30]);
  m.hdEmit=HD_EMIT_HOYO;const base=hdToCanvas(b),top=mk(W,H),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;
  for(const o of m.objs)if(o.type==='tendedero')hdTendedero(tg,o);
  // cables enredados de poste a poste
  tg.strokeStyle='rgba(30,28,32,.85)';tg.lineWidth=1;for(let k=0;k<6;k++){tg.beginPath();const y0=hsh(k,3)*H*.9+20;tg.moveTo(0,y0);tg.quadraticCurveTo(W/2,y0+30+k*6,W,y0+hsh(3,k)*40);tg.stroke()}
  // motos del lote (en la capa de arriba para que se vean sobre la malla)
  const mo=m.objs.find(o=>o.type==='motos');if(mo&&typeof vehSprite==='function'){const cols=['#c0473b','#2a6fb0','#2a2a30','#e2b33a'];for(let k=0;k<4;k++){const s=vehSprite('moto',cols[k],0,'#c9c2b0');tg.drawImage(s,mo.x*HT+24+k*64,mo.y*HT+mo.h*HT-80)}}
  return{base,top}}
// ---------- iglesia por dentro ----------
function hdChurchObj(b,o,m){const X=o.x*32,Y=o.y*32,W=o.w*32,H=o.h*32;
  if(o.type==='altar'){hdR(b,X-20,Y-60,W+40,60,[236,226,200]);hdR(b,X-20,Y-60,W+40,4,[214,176,82]);for(const px of[X-12,X+W+4])hdCh_column(b,px,Y-56,10,56,'#fbf8f0');
    const cx=X+W/2;hdEll(b,cx,Y-34,16,22,[60,90,150]);hdEll(b,cx,Y-34,12,18,[214,176,82]);hdEll(b,cx,Y-40,5,5,[70,50,40]);hdR(b,cx-6,Y-34,12,16,[90,120,180]);   // La Negrita (Virgen de los Ángeles)
    hdR(b,X,Y,W,H-8,[244,240,230]);hdR(b,X,Y,W,4,[214,176,82]);hdR(b,X+W/2-16,Y+10,32,20,[200,40,40]);hdR(b,X+W/2-2,Y+12,4,16,[255,240,200]);hdR(b,X+W/2-8,Y+16,16,4,[255,240,200]);
    for(const fx of[X+8,X+W-16]){hdR(b,fx,Y-6,8,8,[250,250,240]);hdP(b,fx+3,Y-9,[255,200,90]);hdP(b,fx+4,Y-10,[255,240,160])}return true}
  if(o.type==='banca'){for(let k=0;k<2;k++){hdR(b,X+2,Y+6+k*0,W-4,6,[120,78,44]);hdR(b,X+2,Y+6,W-4,1,[160,110,64])}hdR(b,X+2,Y+16,W-4,8,[100,64,36]);hdR(b,X+2,Y+16,W-4,1,[140,96,56]);for(const lx of[X+4,X+W-8])hdR(b,lx,Y+24,4,6,[70,44,26]);return true}
  if(o.type==='velas'){hdR(b,X+2,Y+10,28,20,[90,60,40]);for(let k=0;k<6;k++){const vx=X+5+(k%3)*8,vy=Y+4+((k/3)|0)*8;hdR(b,vx,vy,4,8,[250,248,236]);hdP(b,vx+1,vy-2,[255,200,90]);hdP(b,vx+2,vy-3,[255,246,170])}return true}
  if(o.type==='confe'){hdR(b,X,Y-20,W,H+20,[110,70,40]);hdR(b,X,Y-20,W,4,[150,100,60]);for(let i=X+6;i<X+W-6;i+=4)hdR(b,i,Y-6,2,18,[70,44,26]);hdR(b,X+W/2-1,Y-20,2,H+20,[80,50,30]);return true}
  return false}
{const _hio=hdIntObj;hdIntObj=function(b,o,m){if(m&&m.id==='iglesia'&&hdChurchObj(b,o,m))return true;return _hio(b,o,m)}}
