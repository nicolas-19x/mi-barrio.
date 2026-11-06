// ---------- pulpería La Bendición (diseño detallado) ----------
function hdTextS(b,x,y,s,c,k,sh){const tw=hdTextW(s),tmp=hdBuf(tw+4,12);hdText(tmp,0,3,s,[255,255,255],null,true);
  for(let yy=0;yy<12;yy++)for(let xx=0;xx<tmp.w;xx++)if(tmp.d[((yy*tmp.w+xx)<<2)+3]){if(sh)hdR(b,x+xx*k+1,y+(yy-3)*k+1,k,k,sh);hdR(b,x+xx*k,y+(yy-3)*k,k,k,c)}}
function hdFlag(b,x,y,w,h){const st=[[0,40,140],[244,244,244],[206,17,38],[244,244,244],[0,40,140]],r=[1,1,2,1,1];let yy=y;for(let i=0;i<5;i++){const hh=Math.round(h*r[i]/6);hdR(b,x,yy,w,hh,st[i]);yy+=hh}}
function hdPulperia2(B,bd){const X=bd.x*HT,Y=bd.y*HT,W=bd.w*HT,H=bd.h*HT,RH=66,FY=Y+RH+4,dX=X+(bd.dx-bd.x)*HT;
  // paredes amarillas con repello caído y ladrillo
  hdPlaster(B,X,FY-6,W,H-RH,'#e8bf55',33);
  for(let n=0;n<11;n++){const px=X+6+((hsh(n,77)*(W-30))|0),py=FY+((hsh(77,n)*(H-RH-40))|0),pw=8+((hsh(n,3)*16)|0),ph=6+((hsh(3,n)*10)|0);
    for(let j=0;j<ph;j++)for(let i=0;i<pw;i++){if(((i-pw/2)/(pw/2))**2+((j-ph/2)/(ph/2))**2>1.1+hsh(i+n,j)*.3)continue;const row=(py+j)>>2,brick=((px+i+(row&1)*4)&7)===0||((py+j)&3)===0;
      hdP(B,px+i,py+j,brick?[188,170,150]:hdS([178,88,58],.9+hdr(px+i,py+j)*.2))}
    for(let i=-1;i<=pw;i++){hdP(B,px+i,py-1,[150,118,60]);hdP(B,px+i,py+ph,[250,224,140])}}
  for(let i=0;i<W;i+=3)hdDrip(B,X+i,FY,2,10+((hsh(i,9)*20)|0),i);
  const zc=[58,112,74];hdR(B,X,Y+H-16,W,16,zc);hdR(B,X,Y+H-16,W,2,[96,150,104]);for(let i=0;i<W;i++)if(hdr(X+i,Y+H-10)<.35)hdP(B,X+i,Y+H-16+((hdr(i,Y)*16)|0),[40,82,54]);hdShadeBand(B,X,Y+H-5,W,5,.05,.35);
  // techo de teja anaranjada con manchas
  hdRoofTeja(B,X-6,Y,W+12,RH,'#c45a34',41);for(let n=0;n<30;n++){const rx=X+((hsh(n,51)*W)|0),ry=Y+18+((hsh(51,n)*(RH-24))|0),L=4+((hsh(n,5)*12)|0);for(let t=0;t<L;t++)hdP(B,rx,ry+t,[96,52,32],.35*(1-t/L))}
  hdEave(B,X-6,Y+RH,W+12,'#c45a34');hdShadeBand(B,X,Y+RH+5,W,8,.4,.04);hdPipe(B,X+W-7,Y+RH+5,Y+H-3);
  // celosías de ventilación y rótulo con bandera
  for(const vx of[X+8,X+W-30]){hdR(B,vx-2,FY+8,26,18,[226,214,190]);for(let j=0;j<14;j++)hdR(B,vx,FY+10+j,22,1,j%3===2?[214,196,160]:[60,44,34])}
  const sx=X+36,sw=W-72;hdR(B,sx-3,FY+0,sw+6,38,[110,70,40]);hdR(B,sx-3,FY+0,sw+6,2,[150,104,64]);hdR(B,sx,FY+3,sw,32,[238,226,196]);for(let j=0;j<32;j++)for(let i=0;i<sw;i++)if(hdr(sx+i,FY+5+j)<.08)hdP(B,sx+i,FY+5+j,[214,200,170]);
  hdFlag(B,sx+2,FY+8,6,8);hdFlag(B,sx+sw-8,FY+8,6,8);hdFlag(B,sx+2,FY+23,6,8);hdFlag(B,sx+sw-8,FY+23,6,8);
  hdTextS(B,sx+((sw-hdTextW('PULPERÍA')*2)>>1),FY+6,'PULPERÍA',[34,92,84],2,[170,150,110]);
  {const t='LA BENDICIÓN',w=hdTextW(t)*2;hdTextS(B,sx+((sw-w)>>1),FY+22,t,[34,92,84],2,[170,150,110])}
  hdShadeBand(B,sx-3,FY+38,sw+6,3,.3,.05);
  // alero de zinc oxidado sobre el frente
  const ay=FY+42,ah=15;for(let j=0;j<ah;j++)for(let i=-4;i<W+4;i++){const k=(i+3)%6,f=[1.12,1.04,.95,.82,.9,1.0][k]*(1.05-.25*j/ah);let c=hdS([150,152,150],f);if(hsh(i*3,j+7)<.06)c=hdS([150,84,44],f);hdP(B,X+i,ay+j,c)}
  for(let n=0;n<26;n++){const rx=X+((hsh(n,61)*W)|0),L=3+((hsh(61,n)*10)|0);for(let t=0;t<L;t++)hdP(B,rx,ay+2+t,[146,78,38],.5*(1-t/L)+.15)}
  hdR(B,X-4,ay+ah,W+8,2,[90,92,92]);hdShadeBand(B,X,ay+ah+2,W,9,.42,.05);
  for(const lx of[X+4,X+W-6])hdR(B,lx,ay+ah,2,6,[90,70,50]);
  // puerta verde de tablones (al centro: por ahí se entra)
  const dw=26,dh=50,dx=dX+3,dy=Y+H-dh-3;hdR(B,dx-3,dy-3,dw+6,dh+3,[222,210,180]);for(let j=0;j<dh;j++)for(let i=0;i<dw;i++){const pl=(i%7===6)?.68:1;hdP(B,dx+i,dy+j,hdS([46,110,70],pl*(.92+hdr(dx+i,dy+j)*.1)-(i===dw-1?.2:0)))}
  hdR(B,dx+3,dy+6,dw-6,1,[30,74,46]);hdR(B,dx+3,dy+dh-8,dw-6,1,[30,74,46]);hdR(B,dx+dw-5,dy+dh/2,3,3,[216,176,80]);hdR(B,dx-4,dy+dh,dw+8,3,[176,170,160]);HD_EMIT.push({k:'door',b:bd.id,x:dx,y:dy,w:dw,h:dh});
  // PURA VIDA y ventanita enrejada a la izquierda
  {const px=X+10,py=ay+26;hdR(B,px,py,30,26,[244,240,230]);hdR(B,px,py,30,1,[200,190,170]);hdTextS(B,px+3,py+3,'PURA',[20,40,120],1);hdTextS(B,px+3,py+12,'VIDA',[20,40,120],1);hdR(B,px+3,py+21,24,2,[206,17,38]);hdR(B,px+3,py+23,24,1,[0,40,140])}
  hdMeter(B,X+46,ay+24);
  // ventana del mostrador repleta (a la derecha de la puerta)
  const ox=dx+dw+6,ow=X+W-10-ox,oy=ay+20,oh=Y+H-20-oy;hdR(B,ox-3,oy-3,ow+6,oh+6,[200,176,120]);hdR(B,ox,oy,ow,oh,[42,32,26]);
  const pal=[[208,58,48],[240,192,48],[48,112,192],[64,160,80],[240,128,48],[232,224,208],[160,64,160],[192,160,112],[96,192,208]];
  for(const sy of[oy+4,oy+14,oy+24]){hdR(B,ox+2,sy+8,ow-4,1,[110,76,48]);let x=ox+3;while(x<ox+ow-5){const w=2+((hsh(x,sy)*3)|0),h=3+((hsh(sy,x)*5)|0),c=pal[((hsh(x*3,sy)*9)|0)%9];hdR(B,x,sy+8-h,w,h,c);hdP(B,x,sy+8-h,hdS(c,1.3));x+=w+((hsh(x,sy*3)*2)|0)}}
  hdR(B,ox+2,oy+1,ow-4,1,[150,140,120]);for(let i=0,x=ox+4;x<ox+ow-6;x+=7,i++){const c=pal[(i*4)%9];hdR(B,x,oy+2,5,8,c);hdR(B,x,oy+2,5,1,[240,236,220]);hdP(B,x+2,oy+5,[255,255,255])}
  hdR(B,ox-2,oy+oh-7,ow+4,7,[176,138,90]);hdR(B,ox-2,oy+oh-7,ow+4,1,[214,176,122]);hdShadeBand(B,ox-2,oy+oh,ow+4,3,.35,.05);
  hdR(B,ox+ow-26,oy+oh-17,16,10,[214,210,196]);hdR(B,ox+ow-24,oy+oh-15,12,5,[120,170,190]);hdR(B,ox+ow-27,oy+oh-8,18,2,[180,176,160]);   // compu vieja/caja
  HD_EMIT.push({k:'shop',b:bd.id,x:ox,y:oy,w:ow,h:oh-7});
  {const hx=X+W-48,hy=oy+oh-34;hdR(B,hx+1,hy+1,38,22,[30,20,16],.4);hdR(B,hx,hy,38,22,[214,190,140]);hdR(B,hx,hy,38,1,[236,214,170]);hdText(B,hx+3,hy+3,'HUEVOS',[60,36,20]);hdText(B,hx+3,hy+12,'₡1.200',[160,40,30]);hdR(B,hx+15,hy-1,8,2,[220,220,200])}
  // cosas al frente: cajas de refresco, maceta, saco, basurero
  for(const[cy,cc]of[[Y+H-14,[200,48,48]],[Y+H-26,[40,90,170]]]){hdR(B,X+2,cy,18,12,cc);hdR(B,X+2,cy,18,1,hdS(cc,1.3));for(let i=1;i<18;i+=3){hdR(B,X+2+i,cy-6,2,7,[50,120,60]);hdP(B,X+2+i,cy-6,[150,220,160])}}
  hdPlantPot(B,X+24,Y+H-1,true);
  {const sxx=X+W-30,syy=Y+H-24;hdEll(B,sxx+8,syy+12,9,11,[214,196,160]);hdEll(B,sxx+6,syy+8,4,4,[232,218,190]);hdR(B,sxx+4,syy,8,3,[180,160,120]);hdText(B,sxx+1,syy+10,'',[0,0,0])}
  {const tx=X+W-14,ty=Y+H-22;for(let j=0;j<20;j++)for(let i=0;i<12;i++)hdP(B,tx+i,ty+j,hdS([46,110,70],1.15-.4*i/12-((j===4)?.3:0)));hdEll(B,tx+6,ty,6,2,[70,140,90])}}
