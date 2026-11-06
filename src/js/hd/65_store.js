// ---------- interiores de las tiendas ----------
const HD_STW={chino:'#e6dcc2',pollo:'#f4ead2',gollo:'#eceef0',ropa:'#ead8c4'};
function hdStoreFloor(b,st,W,H){for(let Y=64;Y<H;Y++)for(let X=0;X<W;X++){const u=X&31,v=(Y-64)&31,tx=X>>5,ty=(Y-64)>>5,r=hdr(X,Y);let c;
    if(st==='pollo'){c=((tx+ty)&1)?[214,64,52]:[244,238,226];if(u===31||v===31)c=[168,150,136]}
    else if(st==='gollo'){c=[236,238,240];if(u===31||v===31)c=[196,200,206];c=hdS(c,.97+.03*Math.sin(X*.05+Y*.03))}
    else if(st==='ropa'){const row=(Y-64)>>3,off=(hsh(row,3)*64)|0;c=hdS([176,128,84],.86+hsh(row,((X+off)/72)|0)*.2);if(((Y-64)&7)===7)c=[110,78,50];if((X+off)%72===0)c=[120,86,56]}
    else{c=hdS([206,200,186],.94+hdVN(X,Y,24,9)*.1);if(u===31||v===31)c=[160,154,140];if(r<.06)c=hdS(c,.9)}
    hdP(b,X,Y,hdS(c,.97+r*.05))}
  for(let d=0;d<10;d++)hdM(b,0,64+d,W,1,[.7+.03*d,.7+.03*d,.72+.028*d])}
function hdStoreObj(b,o,m){const X=o.x*32,Y=o.y*32,W=o.w*32,H=o.h*32,pal=[[214,69,69],[242,201,76],[123,182,97],[63,127,209],[242,153,74],[240,240,240],[142,59,138]];
  switch(o.type){
  case'sShelf':{hdBox(b,X,Y-36,32,4,64,[150,156,164],[122,128,136],false);for(let s=0;s<4;s++){const sy=Y-32+s*15;hdR(b,X+2,sy+11,28,3,[92,98,106]);let x=X+3;while(x<X+29){const w=3+((hsh(x,sy+o.x*3)*3)|0),h=5+((hsh(sy,x+o.x)*6)|0),c=pal[((hsh(x*3,sy+o.x)*7)|0)%7];hdR(b,x,sy+11-h,w,h,c);hdR(b,x,sy+11-h,1,h,hdS(c,1.3));hdR(b,x+w-1,sy+11-h,1,h,hdS(c,.7));x+=w+1}}break}
  case'sFridge':case'gFridge':{const gl=o.type==='gFridge';const fc=gl?[236,238,240]:[42,42,48];for(let k=0;k<5;k++)hdM(b,X+30+k,Y-20+k,1,H+14,[.72+.05*k,.72+.05*k,.76+.05*k]);hdBox(b,X+1,Y-26,29,6,H+20,hdS(fc,1.06),fc,false);
    if(!gl){for(let j=0;j<H+10;j++)for(let i=0;i<23;i++)hdP(b,X+4+i,Y-18+j,[204,236,248]);for(let s=0;s<((H+10)/11|0);s++)for(let i=0;i<4;i++){const c=[[192,57,43],[63,166,107],[242,201,76],[107,58,30]][(s+i)%4];hdR(b,X+5+i*6,Y-17+s*11,4,8,c);hdP(b,X+5+i*6,Y-17+s*11,hdS(c,1.4))}}
    else{hdR(b,X+1,Y-6,29,1,[180,186,190]);hdR(b,X+24,Y-20,2,10,[150,156,160]);hdR(b,X+24,Y-2,2,14,[150,156,160]);hdR(b,X+4,Y-22,10,6,[247,198,0]);hdText(b,X+5,Y-22+0,'',[0,0,0])}break}
  case'sGond':{hdBox(b,X,Y,W,8,H-10,[170,176,184],[140,146,154]);hdR(b,X+W/2-1,Y,2,H-2,[110,116,124]);for(let j=10;j<H-4;j+=8)for(let i=2;i<W-2;i+=5){const c=pal[((i+j+o.x*3)>>2)%7];hdR(b,X+i,Y+j,4,6,c);hdP(b,X+i,Y+j,hdS(c,1.35))}break}
  case'sCounter':case'pCounter':case'rCounter':case'gDesk':{const top=o.type==='sCounter'?[232,220,196]:o.type==='pCounter'?[206,210,214]:[176,138,90],fr=o.type==='sCounter'?[192,57,43]:o.type==='pCounter'?[214,41,31]:[122,82,50];
    hdBox(b,X,Y+2,W,9,19,top,fr);if(o.type==='pCounter')hdR(b,X,Y+16,W,3,[247,198,0]);
    if(o.type!=='rCounter'){hdBox(b,X+8,Y-10,20,5,9,[60,60,66],[42,42,48],false);hdR(b,X+11,Y-8,13,3,[87,209,122])}
    if(o.type==='sCounter'){hdR(b,X+44,Y-12,14,14,[242,201,76]);hdEll(b,X+51,Y-14,6,5,[244,214,96]);hdP(b,X+49,Y-15,[42,42,48]);hdP(b,X+53,Y-15,[42,42,48]);hdR(b,X+57,Y-22,3,9,[242,201,76]);for(let i=0;i<3;i++)hdR(b,X+66+i*5,Y-6,3,7,pal[i])}
    if(o.type==='pCounter'){for(let i=0;i<3;i++){hdEll(b,X+88+i*30,Y-3,8,4,[200,117,42]);hdEll(b,X+86+i*30,Y-5,4,2,[232,170,90])}hdR(b,X+W-40,Y-16,26,16,[244,244,244]);hdR(b,X+W-38,Y-14,22,5,[214,41,31])}
    if(o.type==='gDesk'){hdR(b,X+50,Y-12,24,14,[30,30,36]);hdR(b,X+52,Y-10,20,10,[111,181,232]);hdR(b,X+78,Y-6,8,8,[208,32,42])}
    if(o.type==='rCounter'){hdR(b,X+10,Y-4,22,6,[244,244,244]);hdR(b,X+60,Y-12,20,14,[42,42,48]);hdR(b,X+62,Y-10,16,4,[87,209,122])}break}
  case'pTable':{for(let k=0;k<4;k++)hdM(b,X+4,Y+26+k,W,1,[.62+.1*k,.62+.1*k,.66+.09*k]);hdBox(b,X,Y+2,W,16,6,[247,198,0],[214,170,0]);hdR(b,X+10,Y+5,12,9,[244,244,244]);hdEll(b,X+16,Y+9,4,3,[200,117,42]);hdR(b,X+W-18,Y+4,6,10,[214,41,31]);hdR(b,X+W-17,Y+4,2,10,[240,96,80]);
    for(const cx of[X-8,X+W+2]){hdR(b,cx,Y+2,6,18,[192,57,43]);hdR(b,cx,Y+2,6,1,[230,90,80])}break}
  case'rRack':{hdR(b,X,Y+2,W,3,[170,176,184]);hdR(b,X,Y+2,W,1,[214,218,222]);for(const lx of[X+2,X+W-4])hdR(b,lx,Y+4,2,26,[130,136,144]);
    for(let i=0;i<W-10;i+=5){const c=[[214,69,69],[63,127,209],[242,201,76],[123,182,97],[241,147,180],[142,59,138],[244,244,244],[200,16,46]][((i/5|0)+o.x)%8];hdR(b,X+5+i,Y+5,4,20,c);hdR(b,X+5+i,Y+5,1,20,hdS(c,1.25));hdR(b,X+8+i,Y+5,1,20,hdS(c,.7));hdP(b,X+6+i,Y+4,[60,60,66])}break}
  case'rBin':{hdBox(b,X,Y+4,W,10,14,[196,157,108],[160,120,76]);for(let i=0;i<14;i++){const c=pal[i%7];hdEll(b,X+5+(i*7)%(W-10),Y+5+(i%3)*2,3,2,c)}hdR(b,X+W/2-12,Y+18,24,8,[244,244,244]);hdText(b,X+W/2-9,Y+19,'₡500',[192,57,43]);break}
  case'rCurtain':{for(let j=-12;j<H+18;j++)for(let i=0;i<W;i++)hdP(b,X+i,Y+j,hdS([142,59,138],.84+.2*Math.sin(i*.8)));hdR(b,X-2,Y-14,W+4,3,[120,100,80]);break}
  case'gTV':{hdBox(b,X+2,Y+8,W-4,8,14,[200,204,208],[176,180,186]);hdR(b,X+6,Y+18,W-12,5,[247,198,0]);const tw=W-8,th=34;hdR(b,X+4,Y-28,tw,th,[24,24,28]);hdR(b,X+4,Y-28,tw,1,[80,80,86]);
    const sc=[[63,127,209],[46,158,107],[214,69,69],[142,59,138]][o.x%4];for(let j=2;j<th-2;j++)for(let i=2;i<tw-2;i++)hdP(b,X+4+i,Y-28+j,hdS(sc,.8+.4*(1-j/th)));for(let k=0;k<10;k++)hdM(b,X+tw-14+k,Y-26,1,th-4,[1.1,1.1,1.1]);break}
  case'gSofa':{const P_=['#2e3644','#3a4454','#4a5466','#566070','#626e80','#7a869a','#909cae'].map(hdC);for(let y=Y;y<Y+28;y++)for(let x=X;x<X+W;x++){const v=(y-Y)/28;hdP(b,x,y,P_[Math.max(0,Math.min(6,Math.round(5-v*3.4)))])}
    for(let i=0;i<3;i++)hdBox(b,X+4+i*(W-8)/3,Y+6,(W-8)/3-2,10,6,P_[5],P_[3],false);hdR(b,X+W-30,Y-8,26,10,[247,198,0]);hdText(b,X+W-28,Y-6,'2X1',[208,32,42]);break}
  case'gMoto':{hdR(b,X+2,Y+26,W-4,3,[40,40,40],.3);for(const cx of[X+10,X+W-10]){hdEll(b,cx,Y+20,7,7,[29,26,36]);hdEll(b,cx,Y+20,3,3,[154,161,169])}hdR(b,X+12,Y+6,W-24,10,[208,32,42]);hdR(b,X+12,Y+6,W-24,2,[240,90,90]);hdR(b,X+20,Y,16,5,[42,42,48]);hdR(b,X+W-16,Y-4,3,12,[200,204,208]);break}
  default:return false}
  return true}
function hdStoreInterior(m){const st=m.b.st,W=m.w*32,H=m.h*32,b=hdBuf(W,H);hdStoreFloor(b,st,W,H);const mb=m.b,ow=mb.wall;mb.wall=HD_STW[st]||'#e6dcc2';hdIntWalls(b,m,W,H);mb.wall=ow;
  const wy=10;
  if(st==='chino'){hdSign(b,4*32,wy,5*32,16,'#9e1b1b','AQUÍ NO SE FÍA','#f7e04b',{border:'#d8b45a',dy:1});hdR(b,10*32,wy,40,22,[244,244,244]);hdR(b,10*32,wy,40,6,[192,57,43]);hdText(b,10*32+15,wy+10,'31',[20,16,28])}
  if(st==='pollo'){for(const[x,a1,a2]of[[1,'COMBO','₡3200'],[11,'ALITAS','₡2800']]){hdR(b,x*32,wy-2,64,28,[29,26,36]);hdText(b,x*32+32-hdTextW(a1)/2,wy+2,a1,[247,198,0]);hdText(b,x*32+32-hdTextW(a2)/2,wy+13,a2,[255,255,255])}}
  if(st==='ropa'){hdSign(b,32,wy,4*32,15,'#f4ead2','NO SE CAMBIA','#c0392b',{dy:1});hdSign(b,8*32,wy,3*32,15,'#f4ead2','NO SE FÍA','#2a6fb0',{dy:1})}
  if(st==='gollo'){hdSign(b,3*32,wy,8*32,16,'#d0202a','¡LLÉVESELO HOY! SIN PRIMA','#ffffff',{dy:1})}
  const objs=m.objs.slice().sort((a,c)=>(a.y+a.h)-(c.y+c.h));const rest=[];for(const o of objs)if(!hdStoreObj(b,o,m))rest.push(o);
  const c=hdToCanvas(b);if(rest.length){const g=c.getContext('2d');g.save();g.scale(HDK,HDK);for(const o of rest)drawObj(g,o,m);g.restore()}
  const top=mk(W,H),tg=top.getContext('2d'),tb=hdBuf(W,90);
  if(st==='chino')for(const x of[3,7,11]){hdR(tb,x*32+15,0,1,70,[20,16,28]);hdEll(tb,x*32+16,78,8,9,[192,57,43]);hdR(tb,x*32+9,70,14,2,[242,201,76]);hdR(tb,x*32+9,86,14,2,[242,201,76]);hdR(tb,x*32+15,88,2,2,[216,180,90])}
  if(st==='pollo'||st==='gollo'||st==='ropa')for(const x of[3,7,11]){hdR(tb,x*32+15,0,1,62,[20,16,28]);hdEll(tb,x*32+16,66,7,4,st==='pollo'?[247,198,0]:[230,230,236]);hdEll(tb,x*32+16,69,3,2,[255,244,200])}
  tg.drawImage(hdToCanvas(tb),0,0);return{base:c,top}}
