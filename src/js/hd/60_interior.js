// ---------- interiores HD (casas y pulpería) ----------
function hdBox(b,x,y,w,depth,height,top,front,cast){const T_=typeof top==='string'?hdC(top):top,F_=typeof front==='string'?hdC(front):front,yb=y+depth+height;
  if(cast!==false){for(let k=0;k<5;k++)hdM(b,x+w+k,y+depth+2+k,1,Math.max(0,height-2),[.72+.055*k,.72+.055*k,.76+.05*k]);for(let k=0;k<4;k++)hdM(b,x+3,yb+k,w,1,[.6+.1*k,.6+.1*k,.64+.09*k])}
  for(let j=0;j<depth;j++){const f=.92+.14*j/Math.max(1,depth-1);for(let i=0;i<w;i++)hdP(b,x+i,y+j,hdS(T_,f*(.97+hdr(x+i,y+j)*.05)))}
  for(let j=0;j<height;j++){const f=.92-.2*j/Math.max(1,height-1);for(let i=0;i<w;i++)hdP(b,x+i,y+depth+j,hdS(F_,f*(.97+hdr(x+i,y+depth+j)*.05)))}
  hdR(b,x,y+depth-1,w,1,hdS(T_,1.2));hdR(b,x,y+depth,w,1,hdS(F_,.62));hdR(b,x,y,1,depth+height,hdS(F_,1.12));hdR(b,x+w-1,y,1,depth+height,hdS(F_,.62));hdR(b,x,yb-1,w,1,hdS(F_,.5))}
function hdInset(b,x,y,w,h,base){const c=typeof base==='string'?hdC(base):base;hdR(b,x,y,w,h,hdS(c,.9));hdR(b,x,y,w,1,hdS(c,.6));hdR(b,x,y,1,h,hdS(c,.66));hdR(b,x,y+h-1,w,1,hdS(c,1.18));hdR(b,x+w-1,y,1,h,hdS(c,1.1))}
function hdKnob(b,x,y){hdR(b,x,y,2,2,[216,176,80]);hdP(b,x,y,[255,230,140]);hdP(b,x+1,y+2,[90,70,30])}
function hdLace(b,x0,y0,w,h){for(let x=x0;x<x0+w;x++){const bot=y0+h+Math.round(2*Math.sin(((x-x0)%8)/8*Math.PI));for(let y=y0;y<bot;y++){if((x+y)%4===0&&(x-y)%4===0)continue;hdP(b,x,y,[248,244,234])}hdMP(b,x,bot,[.72,.72,.75])}}
function hdFloor(b,m,W,H){const wood=m.b.floor===11;
  for(let Y=64;Y<H;Y++)for(let X=0;X<W;X++){let c;
    if(wood){const row=(Y-64)>>3,off=hsh(row,7)*96|0,seg=((X+off)/((64+hsh(row,(X+off)/80|0)*40)|0))|0,ph=hsh(row,seg);
      const base=[181,130,79];let f=.86+ph*.2+(hdVN(X,Y,30,5)-.5)*.1;if(((Y-64)&7)===7)f=.62;if((((X+off)%((64+hsh(row,seg)*40)|0)))===0)f=.66;if(hdr(X*3,Y)<.05)f*=.92;c=hdS(base,f);if(hdr(X,Y)<.004)c=[90,64,40]}
    else{const u=((X%32)/32)*2-1,v=(((Y-64)%32)/32)*2-1,d1=Math.abs(u)+Math.abs(v),r=Math.hypot(u,v),cu=Math.hypot(Math.abs(u)-1,Math.abs(v)-1);
      const base=[226,214,190];c=base;if(d1<.36)c=[176,96,74];else if(.74<r&&r<.8)c=[138,126,112];else if(cu<.36)c=[200,156,98];else if(cu<.42)c=[138,126,112];
      if(Math.abs(u)>.965||Math.abs(v)>.965)c=[180,168,144];c=hdS(c,(.94+.06*Math.sin(X*.07)*Math.cos(Y*.05))*(.97+hdr(X,Y)*.05))}
    hdP(b,X,Y,c)}
  for(let d=0;d<10;d++)hdM(b,0,64+d,W,1,[.7+.03*d,.7+.03*d,.72+.028*d])}
function hdIntWalls(b,m,W,H){const wc=hdS(hdC(m.b.wall),1.04),seed=m.b.x*3;
  for(let Y=0;Y<64;Y++)for(let X=0;X<W;X++){const n=hdVN(X,Y,16,seed),r=hdr(X,Y);hdP(b,X,Y,hdS(wc,.95+n*.06+(r-.5)*.03))}
  for(let d=0;d<10;d++)hdM(b,0,6+d,W,1,[.72+.028*d,.72+.028*d,.74+.026*d]);
  hdR(b,0,57,W,7,[122,90,62]);hdR(b,0,57,W,1,[156,120,84]);hdR(b,0,63,W,1,[80,58,40]);   // rodapié
  hdR(b,0,0,W,6,[74,58,52]);hdR(b,0,0,W,1,[106,88,80]);   // remate
  for(const sx of[0,W-14]){hdR(b,sx,0,14,H,[74,58,52]);hdR(b,sx+(sx?0:13),0,1,H,[106,88,80])}
  for(let d=0;d<7;d++){hdM(b,14+d,6,1,H-6,[.62+.055*d,.62+.055*d,.66+.05*d]);hdM(b,W-15-d,6,1,H-6,[.62+.055*d,.62+.055*d,.66+.05*d])}
  hdR(b,0,H-18,W,18,[22,18,18]);hdR(b,0,H-32,W,14,[74,58,52]);hdR(b,0,H-32,W,1,[106,88,80]);
  // puerta: umbral y alfombrita
  const dx=7*32;hdR(b,dx,H-32,32,32,[150,144,132]);hdR(b,dx,H-32,32,2,[196,190,178]);for(let j=0;j<12;j++)for(let i=0;i<28;i++)hdP(b,dx+2+i,H-46+j,hdS([122,90,58],.9+hdr(i,j)*.2));hdR(b,dx+2,H-46,28,1,[156,120,84])}
function hdIntDeco(b,m,d){
  if(d==='win'){const x=2*32+2,y=12,w=40,h=34;hdR(b,x-3,y-3,w+6,h+6,[240,234,222]);for(let j=0;j<h;j++)for(let i=0;i<w;i++){const t=j/h;let c=t<.35?[214,232,240]:hdS([122,178,92],1.1-t*.4);if(t<.5&&((i-12)**2/80+(j-12)**2/30)<1)c=[88,150,72];hdP(b,x+i,y+j,c)}
    for(let i=3;i<w;i+=5)hdR(b,x+i,y-1,1,h+2,[38,34,32]);hdR(b,x,y+(h>>1),w,1,[38,34,32]);hdR(b,x-4,y+h+3,w+8,3,[214,206,192]);
    for(const s of[0,1])for(let j=-4;j<h+6;j++){const ww=Math.max(4,(10-5*Math.sin(Math.min(1,Math.max(0,(j-8)/22))*Math.PI))|0);for(let i=0;i<ww;i++){const X=s?x+w+5-i:x-5+i;let c=hdS([232,196,200],.82+.24*Math.sin(i*1.3));if((i*7+j*3)%11===0)c=[192,74,90];if((i*5+j*7)%13===0)c=[90,138,74];hdP(b,X,y+j,c)}}
    hdR(b,x-10,y-8,w+20,2,[138,106,64])}
  if(d==='pic'){const x=4*32+4,y=14;hdR(b,x,y,26,20,[176,138,58]);hdR(b,x,y,26,1,[214,178,92]);hdR(b,x+2,y+2,22,16,[122,176,214]);hdR(b,x+2,y+11,22,7,[92,150,72]);hdEll(b,x+17,y+6,3,3,[244,206,72]);hdR(b,x+5,y+9,6,6,[240,232,214]);hdR(b,x+5,y+8,7,2,[176,72,52]);hdShadeBand(b,x,y+20,26,2,.3,.1)}
  if(d==='clock'){const cx=(m.b.kind==='shop'?9*32+16:7*32),cy=m.b.kind==='shop'?17:22;for(let y=cy-8;y<=cy+8;y++)for(let x=cx-8;x<=cx+8;x++){const dd=Math.hypot(x-cx,y-cy);if(dd<8.3)hdP(b,x,y,dd>7?[42,42,42]:[246,242,232])}for(let t=0;t<5;t++){hdP(b,cx,cy-t,[26,26,26]);hdP(b,cx+t*.7,cy+t*.4,[26,26,26])}hdP(b,cx,cy,[192,48,48])}
  if(d==='posters'){hdR(b,5*32+8,7,22,20,[214,69,69]);hdR(b,5*32+10,9,18,7,[244,244,244]);hdR(b,5*32+10,19,18,3,[242,201,76]);hdR(b,11*32+20,6,24,22,[42,111,176]);hdText(b,11*32+22,10,'SELE',[244,244,244]);hdR(b,11*32+22,19,20,6,[123,182,97]);
    hdR(b,7*32+2,8,30,16,[242,201,76]);hdText(b,7*32+5,12,'LOTO',[142,47,38])}
  if(d==='sign'){const w=hdTextW('HOY NO FÍO, MAÑANA SÍ')+10;hdR(b,22,8,w,15,[244,234,210]);hdR(b,22,8,w,1,[255,250,236]);hdR(b,22,22,w,1,[180,168,140]);hdText(b,27,12,'HOY NO FÍO, MAÑANA SÍ',[142,47,38])}
  if(d==='bulbs'){for(const bx of[4,10]){hdR(b,bx*32+16,0,1,18,[30,30,30]);hdEll(b,bx*32+16,21,3,3.5,[255,240,190])}}}
function hdIntObj(b,o,m){const X=o.x*32,Y=o.y*32,W=o.w*32,H=o.h*32,up=!!o.v;
  switch(o.type){
  case'bed':{const q=up?[47,111,191]:hdC(['#3f7fd1','#e85d75','#7bb661','#f2994a'][o.x%4]);hdR(b,X+2,Y-16,W-4,20,[110,72,44]);hdR(b,X+2,Y-16,W-4,2,[150,104,64]);hdInset(b,X+6,Y-12,W-12,12,[110,72,44]);
    hdBox(b,X+2,Y+4,W-4,H-20,12,[244,240,232],[200,196,190]);for(let j=0;j<H-36;j++)for(let i=0;i<W-8;i++)hdP(b,X+4+i,Y+22+j,hdS(q,.92+.1*Math.sin((i+j)*.4)*(up?0:1)+(j<3?.12:0)));
    hdBox(b,X+8,Y+6,W-16,10,4,[255,255,255],[214,214,220],false);if(up){hdR(b,X+6,Y+H-22,W-12,3,[242,201,76])}break}
  case'night':hdBox(b,X+4,Y+2,26,10,16,[150,104,64],[122,82,50]);hdKnob(b,X+16,Y+20);hdEll(b,X+17,Y-4,6,3,[250,226,170]);hdR(b,X+16,Y-1,2,5,[90,70,50]);hdR(b,X+11,Y-12,12,9,[244,214,150]);hdR(b,X+11,Y-12,12,1,[255,240,200]);break;
  case'tv':{hdBox(b,X+2,Y+2,W-4,8,20,[138,92,56],[106,64,38]);hdInset(b,X+6,Y+14,(W-16)/2,12,[106,64,38]);hdInset(b,X+W/2+2,Y+14,(W-16)/2,12,[106,64,38]);hdKnob(b,X+W/2-4,Y+19);hdKnob(b,X+W/2+4,Y+19);hdLace(b,X+10,Y+3,W-20,4);
    const tw=up?52:40,th=up?30:24,tx=X+(W-tw)/2,ty=Y+2-th;hdR(b,tx,ty,tw,th,[20,20,24]);hdR(b,tx,ty,tw,1,[74,74,80]);for(let j=2;j<th-2;j++)for(let i=2;i<tw-2;i++)hdP(b,tx+i,ty+j,j<th*.45?[64,140,64]:[56,128,58]);hdR(b,tx+tw/2,ty+2,1,th-4,[214,232,214]);
    hdR(b,tx+6,ty+8,2,3,[224,48,48]);hdR(b,tx+tw-12,ty+12,2,3,[240,240,240]);hdR(b,tx+tw/2-3,ty+th,6,2,[30,30,34]);for(let k=0;k<8;k++)hdM(b,tx+tw-12+k,ty+2,1,th-4,[1.08,1.08,1.08]);break}
  case'counter':if(m.b.kind==='shop'){hdBox(b,X,Y+2,W,10,18,[200,170,120],[156,120,80]);for(let i=X+8;i<X+W;i+=32)hdInset(b,i,Y+16,24,10,[156,120,80]);
      hdR(b,X+10,Y-8,14,10,[200,226,236]);hdR(b,X+12,Y-6,10,7,[226,96,96]);hdP(b,X+14,Y-4,[242,206,72]);hdP(b,X+18,Y-3,[96,176,96]);hdR(b,X+10,Y-9,14,2,[200,60,50]);
      hdR(b,X+44,Y-2,20,8,[63,127,209]);hdR(b,X+46,Y,16,4,[244,244,244]);for(let k=0;k<4;k++)hdR(b,X+47,Y+1+k,14,1,[150,170,200]);
      hdBox(b,X+W-56,Y-14,36,6,16,[60,60,66],[42,42,48],false);hdR(b,X+W-52,Y-11,20,6,[96,200,110]);for(let i=0;i<4;i++)hdR(b,X+W-52+i*6,Y-2,4,3,[214,206,192]);
      hdR(b,X+70,Y-6,16,8,[216,168,96]);hdR(b,X+70,Y-6,16,2,[240,208,144])}
    else{for(let j=0;j<40;j++)for(let i=0;i<W;i++){const tu=(i%10),tv=(j%10);hdP(b,X+i,Y-42+j,tu&&tv?(tu>3&&tu<6&&tv>3&&tv<6?[58,106,176]:[232,238,240]):[184,196,200])}
      hdBox(b,X,Y,W,10,22,[214,176,140],[216,210,196]);hdInset(b,X+4,Y+14,26,14,[230,226,218]);hdKnob(b,X+26,Y+20);for(let i=X+34;i<X+W-2;i++)for(let j=Y+12;j<Y+31;j++)hdP(b,i,j,hdS(((i>>2)+(j>>2))%2?[232,138,138]:[248,236,228],.9+.1*Math.sin(i)));
      hdR(b,X+6,Y+1,22,7,[176,182,188]);hdR(b,X+8,Y+2,18,5,[120,128,136]);hdR(b,X+16,Y-6,2,8,[150,156,160]);
      hdR(b,X+36,Y-14,2,16,[106,64,38]);hdR(b,X+48,Y-14,2,16,[106,64,38]);hdR(b,X+34,Y-16,18,3,[138,92,56]);for(let j=0;j<9;j++){const ww=9-(j>>1);hdR(b,X+43-(ww>>1),Y-13+j,ww,1,[240,232,214])}}
    break;
  case'stove':if(up){hdBox(b,X+1,Y-4,30,12,26,[40,40,46],[30,30,34]);for(const[bx,by]of[[8,0],[21,0],[8,5],[21,5]])hdEll(b,X+1+bx,Y-4+by+2,4,1.6,[70,150,220],.8)}
    else{hdBox(b,X+1,Y-4,30,12,26,[240,240,236],[232,232,228]);hdR(b,X+2,Y-3,28,10,[42,42,46]);for(const[bx,by]of[[8,2],[21,2],[8,7],[21,7]]){hdEll(b,X+1+bx,Y-4+by,3.5,1.6,[96,96,104])}
      hdR(b,X+4,Y+12,24,14,[42,42,46]);hdR(b,X+6,Y+15,20,5,[80,64,60]);hdR(b,X+5,Y+11,22,2,[200,200,206])}
    hdR(b,X+14,Y-16,13,12,[168,172,176]);hdR(b,X+14,Y-16,4,12,[214,218,222]);hdR(b,X+13,Y-18,15,3,[138,142,146]);break;
  case'fridge':{const c=up?[206,214,218]:[236,238,238];for(let k=0;k<5;k++)hdM(b,X+30+k,Y-26+k,1,58,[.72+.05*k,.72+.05*k,.76+.05*k]);hdBox(b,X+1,Y-36,29,6,62,hdS(c,1.04),c,false);hdR(b,X+1,Y-12,29,1,[150,156,158]);
    hdR(b,X+24,Y-28,2,10,[160,166,168]);hdR(b,X+24,Y-6,2,16,[160,166,168]);for(const[mx,my,mc]of[[6,-26,[224,48,48]],[12,-24,[240,192,48]],[8,-4,[58,122,208]]])hdR(b,X+mx,Y+my,4,4,mc);
    hdR(b,X+5,Y+2,12,14,[255,255,255]);hdR(b,X+5,Y+2,12,3,[216,64,64]);break}
  case'sofa':{const G=up?['#3f4856','#4a5466','#566070','#626e80','#6e7a8c','#7e8a9c','#909cae','#a8b4c4']:['#4a1e1a','#62261f','#7a3a2c','#8e4436','#9a4a3a','#b05a48','#c46e5a','#d8887a'];const P_=G.map(hdC);const ax=6,yy=Y-6;
    for(let k=0;k<5;k++)hdM(b,X+6+k,yy+40+k,W-6,1,[.62+.06*k,.62+.06*k,.66+.06*k]);
    for(let i=0;i<2;i++){const cx=X+ax+i*((W-2*ax)/2);for(let y=yy;y<yy+10;y++)for(let x=cx;x<cx+(W-2*ax)/2;x++)hdP(b,x,y,P_[4+(y<yy+3?1:0)-(y>yy+8?1:0)]);hdR(b,cx+(W-2*ax)/2-1,yy+1,1,9,P_[2])}
    for(let y=yy+9;y<yy+17;y++){const v=(y-yy-9)/7,pr=Math.cos((v-.35)*Math.PI*.9);for(let x=X+ax-2;x<X+W-ax+2;x++)hdP(b,x,y,P_[Math.max(0,Math.min(7,Math.round(2+pr*4.4)))])}
    for(let y=yy+17;y<yy+36;y++){const v=(y-yy-17)/18;for(let x=X+ax-2;x<X+W-ax+2;x++)hdP(b,x,y,P_[Math.round(4.2-v*2.6)])}
    for(const sx of[X,X+W-ax])for(let y=yy+1;y<yy+37;y++)for(let x=sx;x<sx+ax;x++){const u=(x-sx)/(ax-1);let k=y<yy+9?Math.round(2.5+Math.cos((u-.35)*Math.PI*.95)*4.2):Math.round(4-(y-yy-9)/27*2.4-(u>.8?1.4:0)+(u<.15?.8:0));hdP(b,x,y,P_[Math.max(0,Math.min(7,k))])}
    hdLace(b,X+16,yy+9,W-32,8);if(up)hdR(b,X+W-24,yy+1,10,7,[242,201,76]);break}
  case'table':{for(let k=0;k<5;k++)hdM(b,X+W+k,Y+6+k,1,26,[.7+.06*k,.7+.06*k,.74+.05*k]);for(let j=0;j<20;j++)for(let i=0;i<W;i++){const h_=((X+i)*7+(Y+j)*13)%37;hdP(b,X+i,Y+2+j,h_<2?[232,106,122]:h_===2?[96,160,90]:hdS([248,244,236],.93+.07*j/20))}
    for(let i=0;i<W;i++){const L=7+Math.round(1.5*Math.sin(i*.35)),f=.84+.12*Math.sin(i*.55);for(let j=0;j<L;j++)hdP(b,X+i,Y+22+j,hdS([244,240,230],f-.025*j))}
    hdR(b,X+4,Y+30,3,6,[90,58,34]);hdR(b,X+W-7,Y+30,3,6,[90,58,34]);
    hdR(b,X+10,Y+4,8,13,[192,58,48]);hdR(b,X+10,Y+4,2,13,[232,106,90]);hdR(b,X+11,Y+2,6,2,[40,40,40]);hdR(b,X+26,Y+12,7,5,[246,246,242]);hdR(b,X+27,Y+13,5,2,[90,58,34]);
    hdR(b,X+42,Y+8,12,8,[176,90,52]);for(let t=0;t<30;t++){const a=-Math.PI*hsh(t,X),r=2+hsh(X,t)*6;hdP(b,X+48+Math.cos(a)*r,Y+6+Math.sin(a)*r*.8,t%3?[74,138,74]:[110,168,90])}break}
  case'chair':{const left=o.x<11;const WD=[[62,36,20],[90,52,32],[122,74,46],[154,102,64]];hdR(b,X+8,Y+26,18,3,[40,30,30],.3);
    hdR(b,X+8,Y+12,18,8,WD[2]);hdR(b,X+8,Y+12,18,1,WD[3]);hdR(b,X+10,Y+13,14,5,[200,58,58]);for(const lx of[X+9,X+23])hdR(b,lx,Y+20,2,8,WD[1]);
    const bx=left?X+7:X+25;hdR(b,bx,Y-6,3,26,WD[2]);hdR(b,bx,Y-6,1,26,WD[3]);for(const yy of[Y-4,Y+2])hdR(b,left?bx:bx-1,yy,4,2,WD[1]);break}
  case'plant':{hdR(b,X+7,Y+14,18,14,[176,90,52]);hdR(b,X+7,Y+14,18,1,[224,144,106]);hdR(b,X+21,Y+14,4,14,[138,68,40]);hdR(b,X+6,Y+12,20,3,[200,112,72]);hdR(b,X+8,Y+12,16,2,[58,36,24]);
    for(let n=0;n<26;n++){const a=-Math.PI*(.05+.9*hsh(n,X+Y)),L=8+hsh(X,n)*12;for(let t=0;t<L;t++){const px=X+16+Math.cos(a)*t,py=Y+12+Math.sin(a)*t*.9,w2=Math.round(2.4*Math.sin(t/L*Math.PI));for(let k=-w2;k<=w2;k++)hdP(b,px+k*.6,py+k*.3,t/L>.6?[110,160,76]:k<0?[78,128,58]:[50,92,46])}}break}
  case'desk':{hdBox(b,X+2,Y+2,W-4,10,18,[150,104,64],[122,82,50]);hdR(b,X+10,Y-14,26,18,[30,30,36]);hdR(b,X+12,Y-12,22,13,[111,181,232]);hdR(b,X+13,Y-11,8,3,[200,230,250]);hdR(b,X+20,Y+4,8,3,[30,30,36]);hdR(b,X+8,Y+7,22,4,[214,214,214]);hdR(b,X+44,Y-2,6,9,[242,201,76]);break}
  // ---- pulpería ----
  case'shelf':case'fridgeR':{const fr=o.type==='fridgeR';if(fr){hdBox(b,X+1,Y-36,30,6,62,[52,120,190],[42,111,176],false);for(let j=0;j<44;j++)for(let i=0;i<24;i++)hdP(b,X+4+i,Y-28+j,[200,236,248]);
      for(let s=0;s<4;s++)for(let i=0;i<5;i++){const c=[[192,57,43],[244,244,244],[242,201,76],[107,58,30]][(o.x+s+i)%4];hdR(b,X+5+i*5,Y-27+s*11,3,8,c);hdP(b,X+5+i*5,Y-27+s*11,hdS(c,1.4))}hdR(b,X+4,Y+18,24,3,[244,234,210])}
    else{hdBox(b,X,Y-36,32,4,64,[138,96,58],[122,82,50],false);for(let s=0;s<4;s++){const sy=Y-32+s*15;hdR(b,X+2,sy+11,28,3,[92,62,38]);let x=X+3;while(x<X+29){const w=3+((hsh(x,sy+o.x)*3)|0),h=5+((hsh(sy,x+o.x)*6)|0),c=[[214,69,69],[242,201,76],[123,182,97],[63,127,209],[242,153,74],[232,232,232],[160,64,160]][((hsh(x*3,sy)*7)|0)%7];hdR(b,x,sy+11-h,w,h,c);hdR(b,x,sy+11-h,1,h,hdS(c,1.3));hdR(b,x+w-1,sy+11-h,1,h,hdS(c,.7));x+=w+1}}}break}
  case'fridgeD':{hdBox(b,X,Y-20,32,6,H+14,[214,64,52],[192,57,43],false);for(let j=0;j<H+2;j++)for(let i=0;i<24;i++)hdP(b,X+4+i,Y-12+j,[200,232,246]);for(let s=0;s<5;s++)for(let i=0;i<4;i++){const c=[[107,58,30],[242,153,74],[123,209,107]][(s+i)%3];hdR(b,X+5+i*6,Y-11+s*12,4,9,c);hdP(b,X+5+i*6,Y-11+s*12,hdS(c,1.4))}hdR(b,X+4,Y-14,24,3,[255,255,255]);break}
  case'sacks':for(const[sy,t]of[[Y+2,'ARROZ'],[Y+34,'FRIJOL']]){hdR(b,X+5,sy+26,24,3,[40,30,26],.35);for(let j=0;j<24;j++){const w2=10+Math.round(3*Math.sin(Math.min(1,j/6)*Math.PI/2));for(let i=-w2;i<=w2;i++){const u=i/w2;hdP(b,X+16+i,sy+4+j,hdS([206,172,116],1.08-.32*Math.max(0,u)-.12*(j/24)+(u<-.6?.06:0)))}}
    for(let i=-4;i<=4;i++)hdP(b,X+16+i,sy+3,[176,140,90]);hdR(b,X+13,sy,6,4,[188,152,100]);hdR(b,X+12,sy+3,8,1,[120,90,56]);hdText(b,X+16-hdTextW(t)/2,sy+12,t,[92,61,36])}break;
  case'bread':{hdBox(b,X+2,Y+8,28,6,16,[150,104,64],[122,82,50]);for(const[bx,by,w]of[[5,0,10],[15,-2,12],[9,4,14]]){hdEll(b,X+bx+w/2,Y+by+6,w/2,4,[224,163,79]);hdEll(b,X+bx+w/2-1,Y+by+5,w/3,2,[244,200,120])}break}
  case'candy':{hdBox(b,X+4,Y+14,24,6,12,[150,104,64],[122,82,50]);hdR(b,X+7,Y-4,18,18,[210,236,246]);for(let i=0;i<12;i++)hdR(b,X+9+(i*5)%14,Y+(i>>2)*5,3,3,[[214,69,69],[242,201,76],[123,182,97],[63,127,209],[241,147,180]][i%5]);hdR(b,X+7,Y-6,18,3,[192,71,59]);break}
  case'crate':{hdBox(b,X+3,Y+6,26,6,16,[196,157,108],[160,120,76]);for(let i=0;i<3;i++)hdEll(b,X+9+i*7,Y+6,3,3,[[242,153,74],[242,201,76],[123,182,97]][i]);break}
  default:return false}
  return true}
function hdInterior(m){const W=m.w*32,H=m.h*32,b=hdBuf(W,H);hdFloor(b,m,W,H);hdIntWalls(b,m,W,H);
  for(const d of m.deco||[])hdIntDeco(b,m,d);
  if(m.rug){const[x,y,w,h]=m.rug,X=x*32,Y=y*32,RW=w*32,RH=h*32;for(let j=0;j<RH;j++)for(let i=0;i<RW;i++){const u=i/RW,v=j/RH,e=Math.min(u,v,1-u,1-v);let c;
      if(e<.04)c=[106,42,42];else if(e<.07)c=[216,176,112];else if(e<.13)c=((i+j)>>1)%2?[142,58,58]:[122,48,48];else if(e<.15)c=[216,176,112];else{const du=Math.abs(u-.5),dv=Math.abs(v-.5);c=Math.abs(du*1.8+dv*3-.5)<.03?[200,160,96]:[154,60,60]}
      hdP(b,X+i,Y+j,hdS(c,.95+.05*hdr(X+i,Y+j)))}}
  const objs=m.objs.slice().sort((a,c)=>(a.y+a.h)-(c.y+c.h));const rest=[];for(const o of objs)if(!hdIntObj(b,o,m))rest.push(o);
  const c=hdToCanvas(b);if(rest.length){const g=c.getContext('2d');g.save();g.scale(HDK,HDK);for(const o of rest)drawObj(g,o,m);g.restore()}
  return c}
