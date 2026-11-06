// ---------- casa de Alex: mejoras visibles por fuera ----------
function hdHomeBase(B,m){if(!S||!S.f||!S.f.eco)return;const b=BMAP.casa_jugador,fx=b&&b.fx;if(!fx)return;const X=b.x*HT,Y=b.y*HT,W=b.w*HT;
  // paneles solares sobre el techo
  for(let i=0;i<fx.solar*2;i++){const px=X+14+i*46,py=Y+16;hdR(B,px+3,py+30,40,4,[30,30,30],.3);
    for(let j=0;j<26;j++)for(let k=0;k<40;k++){const c=(k%10===0||j%9===0)?[150,162,176]:hdMix([34,60,104],[90,130,190],(1-j/26)*.6+(k<12&&j<10?.3:0));hdP(B,px+k,py+j,c)}
    hdR(B,px,py,40,1,[200,210,220]);hdR(B,px,py+26,40,2,[60,64,70])}
  // tanque de agua elevado
  if(fx.tanque){const tx=X+W-56,ty=Y+58;for(const lx of[tx+4,tx+34])hdR(B,lx,ty+30,3,24,[70,70,76]);hdR(B,tx+2,ty+40,36,2,[70,70,76]);
    for(let j=0;j<32;j++)for(let k=0;k<40;k++){const u=k/39;hdP(B,tx+k,ty+j,hdS([30,80,150],1.2-.5*u-.1*(j/32)+(k<4?.15:0)))}
    hdEll(B,tx+20,ty+1,20,4,[60,120,200]);hdEll(B,tx+20,ty,10,2,[110,170,240]);for(let j=8;j<32;j+=8)hdR(B,tx,ty+j,40,1,[20,60,120])}
  // verja de lanza blanca y portón
  if(fx.verja){for(let x=1;x<=9;x++){if(x===5)continue;const px=x*HT,py=18*HT;hdR(B,px,py,HT,32,[0,0,0],0);
      hdR(B,px,py+18,HT,9,[236,232,222]);hdR(B,px,py+16,HT,2,[250,248,242]);hdR(B,px,py+27,HT,2,[100,96,88],.5);
      hdR(B,px,py+4,HT,2,[244,242,236]);hdR(B,px,py+12,HT,1,[244,242,236]);for(let i=1;i<HT;i+=4){hdR(B,px+i,py+2,2,15,[248,246,240]);hdP(B,px+i+1,py+3,[196,192,184]);hdP(B,px+i,py+1,[248,246,240])}}
    if(fx.verja>1){for(const px of[4*HT+22,6*HT-4]){hdR(B,px,18*HT-6,8,38,[150,146,136]);hdR(B,px,18*HT-6,2,38,[196,192,182]);hdR(B,px-1,18*HT-14,10,8,[247,224,75]);hdR(B,px+1,18*HT-12,6,4,[255,246,168])}
      for(const px of[1*HT,9*HT]){hdR(B,px+2,17*HT+16,28,14,[155,82,63]);hdR(B,px+2,17*HT+16,28,2,[190,110,86]);for(let j=0;j<7;j++){const xx=px+4+j*4;hdR(B,xx,17*HT+8,1,9,[63,138,62]);hdR(B,xx-1,17*HT+5,3,3,j%2?[242,201,76]:[241,147,180])}}}}
  // huerta ampliada
  if(fx.h2)for(let i=0;i<3;i++){const px=(3+i*2)*HT+16,py=9*HT+16;hdR(B,px-13,py+6,26,5,[114,81,61]);hdR(B,px-13,py+6,26,1,[146,108,82]);for(let k=0;k<5;k++){hdP(B,px-10+k*5,py+4,[92,150,70]);hdP(B,px-11+k*5,py+3,[120,176,84])}}
  // gallinero
  if(fx.gall){const gx=9*HT,gy=5*HT;hdR(B,gx+2,gy+26,62,6,[30,30,30],.25);hdBox(B,gx+4,gy+4,28,6,18,[200,90,60],[138,90,43]);hdR(B,gx+14,gy+16,10,12,[42,30,20]);
    hdR(B,gx-2,gy-2,40,10,[184,68,47]);for(let i=0;i<40;i+=5)hdR(B,gx-2+i,gy-2,2,10,[150,50,36]);
    for(let j=0;j<20;j++)for(let i=0;i<26;i++)if((i+j)%3===0||(i-j)%3===0)hdP(B,gx+36+i,gy+8+j,[220,220,220],.5);for(const lx of[gx+36,gx+61])hdR(B,lx,gy+4,2,26,[107,74,43]);
    const n=fx.gall>1?4:2;for(let i=0;i<n;i++){const hx=gx+40+(i%2)*11,hy=gy+18-(i>1?6:0);hdEll(B,hx+3,hy+2,4,3,[244,244,244]);hdEll(B,hx+6,hy-1,2,2,[244,244,244]);hdP(B,hx+6,hy-3,[214,69,69]);hdP(B,hx+8,hy-1,[242,153,74])}}
  // hamaca
  if(fx.ham){const hx=5*HT,hy=3*HT;hdR(B,hx,hy+28,64,5,[30,30,30],.2);for(const lx of[hx,hx+60])hdR(B,lx,hy+2,4,28,[107,74,43]);
    for(let i=0;i<56;i++){const off=Math.round(Math.sin(i/55*Math.PI)*10);const c=(i%12)<6?[214,69,69]:[242,201,76];hdR(B,hx+4+i,hy+8+off,1,6,c);hdP(B,hx+4+i,hy+7+off,[74,58,44])}}
  // palo de mango chiquito (el grande va en la capa de arriba)
  if(fx.mango===1){const mx=11*HT+16,my=9*HT+30;hdEll(B,mx,my,10,3,[30,30,30],.25);hdR(B,mx-1,my-16,3,16,[107,74,43]);hdEll(B,mx,my-20,8,5,[88,166,76]);hdEll(B,mx-2,my-22,4,2,[124,200,106])}
  else if(fx.mango>1){const mx=11*HT+16,my=9*HT+30;hdEll(B,mx+4,my,14,4,[30,30,30],.25);hdR(B,mx-3,my-26,6,26,[107,74,43]);hdR(B,mx-3,my-26,2,26,[140,104,64])}
  // obra en construcción
  if(fx.obra){for(let j=0;j<104;j++)for(let i=0;i<W/2-4;i++)hdP(B,X+W/2+i,Y+4+j,[60,120,200],.55);hdR(B,X+W/2,Y+4,W/2-4,4,[40,90,170]);for(let i=0;i<W;i+=16)hdR(B,X+i,Y+b.h*HT-12,16,8,(i/16)%2?[20,16,28]:[247,197,49]);
    hdR(B,1*HT+2,17*HT+4,28,18,[244,234,210]);hdR(B,1*HT+2,17*HT+4,28,4,[214,69,69]);hdText(B,1*HT+5,17*HT+11,'OBRA',[20,16,28]);
    for(const cx of[2*HT+4,8*HT+4]){for(let j=0;j<14;j++){const w=2+(j>>1);hdR(B,cx+5-(w>>1),17*HT+16+j,w,1,j%5<2?[255,255,255]:[242,135,58])}}}}
function hdHomeTop(tg){if(!S||!S.f||!S.f.eco)return;const st=mangoStage();if(st<2)return;const e=E(),key=st+'|'+(st===3&&e.mfruit>0?1:0);
  if(!HD_HOMEMANGO||HD_HOMEMANGO.k!==key){const sp=hdTreeSprite(4242,0,st===2?.55:.8,st===3&&e.mfruit>0);HD_HOMEMANGO={k:key,sp,c:hdToCanvas(sp.c)}}
  const sp=HD_HOMEMANGO.sp;tg.drawImage(HD_HOMEMANGO.c,11*HT+16-sp.ax,9*HT+30-sp.ay)}
let HD_HOMEMANGO=null;
// ---------- la entrada: tapias con grafiti, basura, sillón, estañón y foco quebrado ----------
function hdEntrada(B){
  const tags=[[32.5,47,'PURA VIDA',[242,201,76]],[33,43,'KVN',[63,182,176]],[37.5,47,'MAE',[242,153,74]],[38,50,'FE',[123,182,97]]];
  for(const[x,y,t,c]of tags){const tx=Math.round(x*HT+16-hdTextW(t)/2),ty=y*HT+10;for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1],[1,1]])hdText(B,tx+dx,ty+dy,t,[24,20,24]);hdText(B,tx,ty,t,c);
    for(let i=0;i<hdTextW(t);i+=5)if(hsh(i,tx)<.4)hdR(B,tx+i,ty+7,1,2+((hsh(tx,i)*4)|0),c)}
  {const X=36*HT+8,Y=44*HT+10;const H_=[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[1,3],[2,3],[3,3],[2,4]];for(const[a,c]of H_)hdR(B,X+a*2,Y+c*2,2,2,[241,147,180])}
  for(const[x,y]of[[34,43],[35,47],[33,51]]){const X=x*HT+6,Y=y*HT+14;hdR(B,X+2,Y+14,22,3,[20,20,20],.3);hdEll(B,X+10,Y+8,10,8,[30,30,36]);hdEll(B,X+7,Y+5,4,3,[70,70,80]);hdR(B,X+8,Y-2,4,4,[30,30,36]);hdEll(B,X+20,Y+10,6,5,[40,40,46])}
  hdR(B,35*HT+4,45*HT+8,8,4,[217,212,200]);hdR(B,34*HT+18,50*HT+12,6,8,[244,244,244]);hdR(B,34*HT+19,50*HT+12,4,1,[200,40,40]);
  hdSign(B,36*HT+4,39*HT-8,52,16,'#f4ead2','ENTRADA','#7a2e1f',{dy:1});
  // sillón viejo y estañón
  {const X=32*HT,Y=49*HT;hdR(B,X+2,Y+26,60,5,[20,20,20],.3);const P_=['#3e1e32','#4f2c42','#6b3f5a','#86557a','#a06e94'].map(hdC);
    for(let y=Y-4;y<Y+28;y++)for(let x=X;x<X+64;x++){const v=(y-Y+4)/32;let k=y<Y+4?3:Math.round(3-v*1.6);if(x<X+6||x>X+57)k=y<Y+6?4:2;hdP(B,x,y,P_[Math.max(0,Math.min(4,k))])}
    for(let i=0;i<2;i++)hdBox(B,X+8+i*24,Y+4,22,12,6,P_[4],P_[2],false);hdR(B,X+44,Y+10,8,6,[201,185,143]);hdR(B,X+20,Y+8,3,8,[90,70,60])}
  {const X=37*HT+4,Y=51*HT;hdR(B,X+2,Y+26,26,4,[20,20,20],.3);for(let j=0;j<28;j++)for(let i=0;i<24;i++){const u=i/23;hdP(B,X+i,Y+j,hdS([74,90,106],1.2-.5*u-((j%10===3)?.2:0)))}hdEll(B,X+12,Y,12,3,[95,112,128]);hdEll(B,X+12,Y,9,2,[29,26,36])}}
function hdEntradaTop(tg){const b=hdBuf(30,70);hdR(b,14,6,4,64,[95,90,82]);hdR(b,14,6,1,64,[130,124,114]);hdR(b,0,6,18,4,[95,90,82]);hdR(b,0,8,8,8,[42,42,48]);hdR(b,1,14,6,2,[85,82,74]);hdP(b,3,16,[200,200,190]);hdP(b,5,17,[200,200,190]);tg.drawImage(hdToCanvas(b),36*HT+20-14,44*HT-60)}
