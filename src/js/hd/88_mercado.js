// ---------- Mercado Central por dentro, en estilo B ----------
function hdMk_pile(b,x,y,w,cols,r,seed){for(let k=0;k<w/(r*1.6);k++){const cx=x+r+k*r*1.6+(hsh(seed,k)-.5)*2,cy=y-(k%2)*r*.8,c=cols[(hsh(k,seed)*cols.length)|0];hdEll(b,cx,cy,r,r*.9,hdS(c,.8));hdEll(b,cx-r*.25,cy-r*.25,r*.65,r*.6,c);hdP(b,cx-r*.4,cy-r*.45,hdS(c,1.35))}}
function hdMk_sack(b,x,y,w,h,fill){const c=[196,164,112];hdR(b,x+2,y+h,w,3,[20,16,14],.3);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const u=i/(w-1);hdP(b,x+i,y+j,hdS(c,.82+.28*Math.sin(u*Math.PI)-(j<3?.1:0)+(hdr(x+i,y+j)-.5)*.1))}
  hdR(b,x,y,w,2,hdS(c,.7));if(fill){for(let i=1;i<w-1;i++)for(let j=0;j<3;j++){const r=hdr(x+i,y+j+20);hdP(b,x+i,y-1+j,hdS(fill,.8+r*.4))}}}
function hdMk_goods(b,k,X,Y,W,H,seed){const n=Math.max(1,(W/12)|0);
  switch(k){
  case'soda':for(let i=0;i<n;i++){const x=X+i*12;if(i%3===0){hdR(b,x,Y+H-6,10,6,[244,244,244]);hdR(b,x+1,Y+H-7,8,2,[150,96,60]);hdEll(b,x+5,Y+H-7,3,1.2,[220,160,90])}else if(i%3===1){hdR(b,x+1,Y+H-12,8,12,[50,50,58]);hdR(b,x+1,Y+H-12,8,2,[90,90,100]);hdR(b,x+2,Y+H-9,2,6,[120,120,130])}else{hdEll(b,x+5,Y+H-3,6,3,[236,232,224]);hdEll(b,x+5,Y+H-4,4,1.6,[200,120,60])}}break;
  case'sorbetera':for(let i=0;i<n;i++){const x=X+i*12;if(i%2===0){hdR(b,x,Y+H-14,12,14,[138,98,58]);for(let j=0;j<14;j+=4)hdR(b,x,Y+H-14+j,12,1,[100,68,40]);hdR(b,x+2,Y+H-18,8,6,[200,206,212]);hdR(b,x+2,Y+H-18,8,1,[240,244,248]);hdEll(b,x+6,Y+H-19,3,1.5,[246,236,214])}
    else{for(let c=0;c<3;c++){hdR(b,x+2+c*3,Y+H-10,2,8,[224,164,80]);hdEll(b,x+3+c*3,Y+H-11,2.2,2.2,[[246,230,200],[242,180,190],[200,140,90]][c])}}}break;
  case'cafe':for(let i=0;i<n;i++){const x=X+i*12;if(i%2)hdMk_sack(b,x,Y+H-12,11,12,[70,40,24]);else{hdR(b,x+1,Y+H-14,9,14,[192,71,59]);hdR(b,x+1,Y+H-14,9,3,[230,200,150]);hdR(b,x+3,Y+H-8,5,3,[250,240,220])}}break;
  case'chicharron':for(let i=0;i<n;i++){const x=X+i*12;hdR(b,x+5,Y,1,6,[60,50,40]);for(let j=0;j<3;j++){hdEll(b,x+5,Y+9+j*8,4,4,[218,160,74]);hdP(b,x+4,Y+7+j*8,[250,210,130]);hdR(b,x+3,Y+12+j*8,5,1,[170,110,40])}}break;
  case'hierbas':for(let i=0;i<n;i++){const x=X+i*12;if(hsh(i,seed)<.55){for(let s=0;s<8;s++)hdLine(b,x+6,Y+H,x+2+s,Y+H-12-hsh(s,i)*6,[[56,120,52],[84,150,66],[40,96,44]][s%3]);hdR(b,x+3,Y+H-5,6,2,[180,140,80])}
    else{hdR(b,x+1,Y+H-12,10,12,[214,236,240]);hdR(b,x+1,Y+H-12,10,2,[250,250,250]);hdR(b,x+3,Y+H-8,6,6,[[192,57,43],[242,201,76],[123,182,97],[138,90,43]][i%4])}}break;
  case'flores':for(let i=0;i<n;i++){const x=X+i*12;hdR(b,x+1,Y+H-8,10,8,[126,138,146]);hdR(b,x+1,Y+H-8,10,1,[170,180,186]);const fc=[[242,201,76],[214,69,69],[244,244,244],[242,147,180],[242,153,74]][i%5];
    for(let s=0;s<6;s++){const fx=x+2+hsh(s,i)*8,fy=Y+H-12-hsh(i,s)*8;hdLine(b,fx,fy,x+6,Y+H-8,[60,120,50]);hdEll(b,fx,fy,2.2,2.2,fc);hdP(b,fx,fy,hdS(fc,.6))}}break;
  case'recuerdos':for(let i=0;i<n;i++){const x=X+i*12;if(i%2===0){const c=[[214,69,69],[242,201,76],[42,111,176]][i%3];hdR(b,x,Y+H-9,11,6,c);hdEll(b,x+2,Y+H-2,2,2,[60,40,30]);hdEll(b,x+9,Y+H-2,2,2,[60,40,30]);for(let s=0;s<5;s++)hdP(b,x+2+s*2,Y+H-7,[244,244,244])}
    else{const c=[[123,182,97],[244,244,244],[214,69,69]][i%3];hdEll(b,x+5,Y+6,5,6,c);hdR(b,x+2,Y+4,2,2,[30,26,34]);hdR(b,x+7,Y+4,2,2,[30,26,34]);hdR(b,x+3,Y+9,5,1,[30,26,34]);hdR(b,x+1,Y+1,2,4,c);hdR(b,x+8,Y+1,2,4,c)}}break;
  case'frutas':hdMk_pile(b,X,Y+H-3,W*.5,[[242,153,74],[242,201,76],[224,93,58]],4,seed);hdMk_pile(b,X+W*.5,Y+H-3,W*.5,[[123,182,97],[214,69,69],[242,201,76]],4,seed+1);
    for(let i=0;i<3;i++){const x=X+8+i*(W/3);for(let s=0;s<4;s++)hdEll(b,x+s*2,Y+H-11-s,2,5,[244,214,80])}break;
  case'granos':for(let i=0;i<n;i++)hdMk_sack(b,X+i*12,Y+H-12,11,12,[[244,244,244],[42,42,48],[142,47,38],[242,201,76]][i%4]);break;
  case'artesania':for(let i=0;i<n;i++){const x=X+i*12;if(i%2){hdEll(b,x+5,Y+H-5,5,5,[138,90,43]);hdEll(b,x+4,Y+H-6,3,3,[170,118,60])}else{const c=[[214,69,69],[242,201,76],[42,111,176]][i%3];hdR(b,x+1,Y+2,10,12,c);hdR(b,x+3,Y+5,2,2,[30,26,34]);hdR(b,x+7,Y+5,2,2,[30,26,34]);hdR(b,x+4,Y+10,4,1,[30,26,34])}}break;
  case'pescado':hdR(b,X,Y+H-10,W,10,[214,236,244]);for(let i=0;i<W;i+=3)hdP(b,X+i,Y+H-10+((i*7)%9),[255,255,255]);for(let i=0;i<n;i++){const x=X+i*12+2;hdEll(b,x+4,Y+H-6,5,2,[150,170,182]);hdEll(b,x+3,Y+H-7,3,1,[200,214,222]);hdP(b,x+9,Y+H-6,[110,124,134]);hdP(b,x+1,Y+H-7,[30,30,34])}break;}}
function hdMk_sign(b,cx,y,txt){const w=hdTextW(txt)+14;hdR(b,cx-w/2-1,y-1,w+2,16,[30,26,34]);hdR(b,cx-w/2,y,w,14,[246,236,214]);hdR(b,cx-w/2,y,w,2,[255,250,236]);hdR(b,cx-w/2,y+12,w,2,[200,180,150]);hdText(b,cx-w/2+7,y+4,txt,[122,46,31])}
function hdMk_stall(b,p){const X=p.x*HT,Y=p.y*HT,W=p.w*HT,H=(p.h||1)*HT,cy=p.rev?Y:Y+H-HT,seed=p.x*11+p.y;
  if(p.h>1){const sy=p.rev?Y+HT:Y;hdR(b,X,sy,W,H-HT,[96,64,40]);for(let i=0;i<W;i+=24)hdR(b,X+i,sy,2,H-HT,[70,46,30]);hdR(b,X,sy,W,3,[130,90,56]);
    for(let r=0;r<2;r++){const ry=sy+8+r*((H-HT-10)/2);hdR(b,X+2,ry+((H-HT-10)/2)-4,W-4,3,[150,104,62]);hdMk_goods(b,p.k,X+4,ry,W-8,(H-HT-10)/2-4,seed+r)}}
  // mostrador
  hdR(b,X+2,cy+30,W,4,[20,16,14],.3);
  for(let j=0;j<22;j++)for(let i=0;i<W;i++){const X2=X+i,Y2=cy+8+j;let f=.8+(hdr(X2,Y2)-.5)*.1+(i%16===0?-.25:0)+(j<2?.25:0);hdP(b,X2,Y2,hdS([150,98,56],f))}
  for(let j=0;j<8;j++)for(let i=0;i<W;i++)hdP(b,X+i,cy+j,hdS([206,160,104],1.05-j*.02+(hdr(X+i,cy+j)-.5)*.08));hdR(b,X,cy,W,1,[236,200,150]);
  hdMk_goods(b,p.k,X+4,cy-14,W-8,14,seed);
  if(p.k==='soda'){for(let i=0;i<3;i++){const sx=X+14+i*((W-28)/2);hdEll(b,sx,cy+40,5,2,[20,16,14],.25);hdR(b,sx-4,cy+30,8,4,[192,71,59]);hdR(b,sx-1,cy+34,2,8,[90,90,96])}}}
function hdMercadoInt(m){const W=m.w*HT,H=m.h*HT,b=hdBuf(W,H),T2=HT;
  // piso: mosaico gastado (crema y terracota en damero diagonal)
  for(let Y=T2*2;Y<H-T2;Y++)for(let X=T2;X<W-T2;X++){const u=X&15,v=Y&15,tx=X>>4,ty=Y>>4,r=hdr(X,Y);
    let c=((tx+ty)&1)?[206,192,166]:[178,132,104];if(((tx+ty)%6)===0&&((tx-ty)%4===0))c=[120,140,120];
    const wear=Math.max(0,1-Math.abs(Y-H*.56)/(H*.22))*hdVN(X,Y,60,8);c=hdMix(c,[196,184,160],wear*.5);
    let f=.94+r*.07+(hdVN(X,Y,40,3)-.5)*.16;if(u===0||v===0)f=.72;else if(u===1||v===1)f*=1.06;hdP(b,X,Y,hdS(c,f))}
  for(let n=0;n<26;n++){const px=T2*2+hsh(n,5)*(W-T2*4),py=T2*3+hsh(5,n)*(H-T2*5);hdEll(b,px,py,6+hsh(n,7)*10,3+hsh(7,n)*4,[60,50,44],.12)}   // manchas
  for(let n=0;n<18;n++){const px=21*T2+hsh(n,9)*4*T2,py=15*T2-hsh(9,n)*2*T2;hdEll(b,px,py,4,2,[180,210,226],.35)}   // agua del tramo de mariscos
  // paredes: arriba revoque mostaza con zócalo de azulejo verde; lados y abajo en planta
  hdPlaster(b,0,0,W,T2*2,'#e2c98f',61);hdR(b,0,T2*2-22,W,22,[56,118,92]);for(let i=0;i<W;i+=10)for(let j=T2*2-22;j<T2*2;j+=10){hdR(b,i,j,10,1,[40,92,70]);hdR(b,i,j,1,10,[40,92,70]);hdP(b,i+2,j+2,[110,170,140])}
  hdR(b,0,T2*2-24,W,2,[220,200,150]);hdShadeBand(b,0,T2*2,W,10,.3,.02);
  for(let i=6;i<W;i+=96){for(let j=0;j<26;j++)for(let k=0;k<30;k++)hdP(b,i+k,8+j,hdMix([180,214,226],[240,236,214],j/26))}   // ventanas altas
  for(const[x0,w0]of[[0,T2],[W-T2,T2]]){for(let Y=T2*2;Y<H;Y++)for(let X=x0;X<x0+w0;X++)hdP(b,X,Y,hdS([150,128,96],.9+hdr(X,Y)*.08));hdR(b,x0===0?T2-3:x0,T2*2,3,H-T2*2,[60,48,40])}
  for(let Y=H-T2;Y<H;Y++)for(let X=0;X<W;X++)hdP(b,X,Y,hdS([150,128,96],.9+hdr(X,Y)*.08));hdR(b,0,H-T2,W,3,[60,48,40]);
  const dx=13*T2;for(let Y=H-T2;Y<H;Y++)for(let X=dx;X<dx+T2;X++)hdP(b,X,Y,hdS([90,70,52],.9+hdr(X,Y)*.1));hdR(b,dx,H-T2,T2,4,[60,125,90]);
  // reloj
  const ck=13.5*T2;hdEll(b,ck,22,12,12,[40,36,40]);hdEll(b,ck,22,10,10,[250,246,236]);hdR(b,ck,13,1,9,[30,26,34]);hdR(b,ck,22,7,1,[30,26,34]);for(let a=0;a<12;a++)hdP(b,ck+Math.cos(a/12*6.283)*8,22+Math.sin(a/12*6.283)*8,[30,26,34]);
  // puestos
  const ps=m.objs.filter(o=>o.type==='puesto').sort((a,c)=>a.y-c.y);for(const p of ps){hdMk_stall(b,p);if(p.y===3)hdMk_sign(b,p.x*T2+p.w*T2/2,T2+8,p.lab)}
  const base=hdToCanvas(b);
  // arriba: rótulos colgantes, banderines y bombillos
  const top=mk(W,H),tg=top.getContext('2d'),t=hdBuf(W,H);
  for(const p of ps){if(p.y===3)continue;const cx=p.x*T2+p.w*T2/2,y=p.y*T2-(p.rev?28:48);hdR(t,cx-24,y-12,1,12,[40,36,40]);hdR(t,cx+23,y-12,1,12,[40,36,40]);hdMk_sign(t,cx,y,p.lab)}
  for(const fy of[4.6,9.6]){const y=fy*T2;for(let x=T2;x<W-T2;x++){const sag=Math.sin((x%(T2*3))/(T2*3)*Math.PI)*8;hdP(t,x,y+sag,[40,36,40],.7)}
    for(let x=T2;x<W-T2;x+=16){const sag=Math.sin((x%(T2*3))/(T2*3)*Math.PI)*8,c=[[214,69,69],[242,201,76],[63,127,209],[123,182,97],[242,147,180]][(x/16|0)%5];for(let j=0;j<10;j++){const ww=Math.max(1,10-j);hdR(t,x+5-ww/2,y+sag+1+j,ww,1,hdS(c,1-j*.03))}}}
  for(const x of[4,11,16,22]){const X=x*T2;hdR(t,X,0,1,T2*2+10,[30,26,34]);hdR(t,X-6,T2*2+10,13,4,[50,50,56]);hdEll(t,X+.5,T2*2+18,5,5,[255,226,150]);hdEll(t,X+.5,T2*2+17,2.5,2.5,[255,250,220])}
  tg.drawImage(hdToCanvas(t),0,0);
  return{base,top}}
