// ================= EL MIRADOR EN ESTILO B (pixel art HD) =================
// Todo se pinta píxel por píxel con las mismas herramientas del barrio (repello, zinc, teja, ruido, rampas)
// a 2 píxeles por unidad, se ilumina con la misma luz ambiente del juego (hdAmbient) y se amplía nítido.
const MV={};
const MV_BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16),mvD=(x,y)=>MV_BAY[((y&3)<<2)|(x&3)];
const mvMix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const mvHz=(c,t,x,y,hz)=>{const q=Math.max(0,Math.min(4,Math.round(t*4+mvD(x,y)-.5)))/4;return q?mvMix(c,hz,q*.8):c};
function mvK(H){const dpr=Math.min(2,window.devicePixelRatio||1);return 2*Math.max(1,Math.round(innerHeight*dpr/(H*2)))}
hookAfter('openVista',function(){if(!HD_ON||!VISTA)return;const c=$('#vcan'),K=mvK(VISTA.H);VISTA.K=K;c.width=VISTA.W*K;c.height=VISTA.H*K;c.style.imageRendering='pixelated';MV.key=MV.skyKey=null});
{const _d=drawVista;drawVista=function(){if(!HD_ON||!VISTA||!VISTA.K)return _d();try{drawVistaB()}catch(e){console.error(e);VISTA.K=0;const c=$('#vcan');c.width=VISTA.W;c.height=VISTA.H}}}
// ---------------------------------------------------------------- el paisaje (de día; la luz se pone después)
function mvLand(W,H){const BW=W*2,BH=H*2,SY=BH-360,B=hdBuf(BW,BH),L=VISTA.L,E={win:[],city:[],red:[],lamp:null},HZ=[178,194,212];
  const P=(x,y,c)=>hdP(B,x,y,c),R=(x,y,w,h,c)=>hdR(B,x,y,w,h,c),rr=vSeed(907);
  const crown=(cx,cy,r,base,hz)=>{for(let y=Math.floor(cy-r);y<=cy+r;y++)for(let x=Math.floor(cx-r);x<=cx+r;x++){const u=(x+.5-cx)/r,v=(y+.5-cy)/r,d=u*u+v*v;if(d>1)continue;const s=-(u+v)*.5;
      let c=s>.32?hdS(base,1.32):s>-.1?base:s>-.5?hdS(base,.78):hdS(base,.6);if(d>.8&&v>.2)c=hdS(base,.5);if(hdr(x,y)>.9)c=hdS(c,1.12);P(x,y,hz?mvHz(c,hz,x,y,HZ):c)}};
  // volcanes: Poás (izq.) e Irazú (der.), con quebradas y bruma en tramado
  const VO=[{cx:BW*.2,pk:SY+72,wd:BW*.34,col:[106,120,166]},{cx:BW*.78,pk:SY+54,wd:BW*.44,col:[98,116,164]}],vb=SY+150;
  for(let x=0;x<BW;x++){let top=vb,v=null;for(const o of VO){const k=1-Math.abs(x-o.cx)/o.wd;if(k<=0)continue;let y=vb-(vb-o.pk)*Math.pow(k,1.5);if(Math.abs(x-o.cx)<o.wd*.035)y+=3;if(y<top){top=y;v=o}}
    if(!v)continue;for(let y=Math.floor(top);y<vb+20;y++){const t=(y-top)/(vb-top+1),lit=x<v.cx;let f=(lit?1.08:.84)*(1-t*.08);if(hdVN(x*2.4,y*.5,6,v.cx|0)>.63)f*=.84;if(y<top+2)f*=1.12;P(x,y,mvHz(hdS(v.col,f),.32+t*.55,x,y,HZ))}}
  // cordillera lejana
  for(let x=0;x<BW;x++){const yf=Math.round(SY+(L.far[x>>1]+8)*2);for(let y=yf;y<SY+200;y++){let c=hdS([78,120,112],.9+hdVN(x,y,14,3)*.2);const r=hdr(x,y);if(r>.84)c=hdS(c,.84);else if(r<.06)c=hdS(c,1.14);if(y===yf)c=hdS(c,1.18);P(x,y,mvHz(c,.42,x,y,HZ))}}
  // cerros cercanos cubiertos de bosque
  const yN=x=>Math.round(SY+L.near[Math.min(W,x>>1)]*2);
  for(let x=0;x<BW;x++)for(let y=yN(x);y<SY+210;y++)P(x,y,mvMix([60,106,66],[92,138,80],Math.min(1,(y-yN(x))/40)));
  for(let gy=0;gy<60;gy+=4)for(let gx=0;gx<BW;gx+=4){const x=gx+(hsh(gx,gy)*4|0),y=yN(x)+gy+(hsh(gy,gx)*3|0);if(y>SY+184)continue;crown(x,y,2+hsh(x,y)*1.8,pick2(hsh(x,7),[[62,112,66],[54,102,62],[74,124,70],[66,118,80]]),gy<12?.18:0)}
  // San José: edificios con ventanitas, torres con luz roja, la cúpula de la catedral
  L.city.forEach((b,i)=>{const bx=b.x*2,bw=b.w*2,base=yN(bx)+8,tower=i%7===3,bh=Math.round(b.h*2.6)+(tower?12:0),c0=mvMix([168,176,188],[214,206,190],b.c);
    for(let y=base-bh;y<base;y++)for(let x=bx;x<bx+bw;x++){let c=x===bx+bw-1?hdS(c0,.74):y===base-bh?hdS(c0,1.14):c0;const wx=(x-bx)%2===1,wy=(y-(base-bh))%3===1;
      if(wx&&wy&&x<bx+bw-1&&y>base-bh){c=[66,82,102];if(hsh(x,y)<.55)E.city.push([x,y])}P(x,y,mvHz(c,.3,x,y,HZ))}
    if(tower){R(bx+(bw>>1),base-bh-7,1,7,[90,96,104]);E.red.push([bx+(bw>>1),base-bh-8])}
    if(i%5===1){R(bx+1,base-bh-3,3,3,[60,64,70]);R(bx+1,base-bh-3,3,1,[100,104,110])}});
  {const cx=Math.round(BW*.58),base=yN(cx)+8;for(let y=-18;y<0;y++)for(let x=-6;x<7;x++){const c=x>4?[190,184,170]:[236,230,216];P(cx+x,base+y,mvHz(c,.28,cx+x,base+y,HZ))}
    for(let y=0;y<7;y++)for(let x=-6;x<7;x++){if(x*x+y*y*1.6>40)continue;P(cx+x,base-18-y,mvHz(x>2?[176,170,156]:[226,220,204],.28,cx+x,base-18-y,HZ))}R(cx,base-30,1,4,[200,170,80])}
  // el valle: potreros, cafetales, cañales, aradas, vacas
  for(let y=SY+170;y<SY+262;y++)for(let x=0;x<BW;x++){if(y<yN(x)+26)continue;const n=hdVN(x,y,22,5),r=hdr(x,y);let c=hdS([118,158,82],.9+n*.2+(r-.5)*.06);if(r>.95)c=hdS(c,1.12);P(x,y,c)}
  for(let k=0;k<34;k++){const cx=rr()*BW,cy=SY+178+rr()*70,w=24+rr()*60,h=7+rr()*12,sk=(rr()-.5)*.5,kind=rr();
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){const x=Math.round(cx-w/2+i+j*sk),y=Math.round(cy-h/2+j);if(y<yN(x)+28)continue;let c;
      if(kind<.32){c=j%3===0?(i%2?[40,80,46]:[58,104,58]):[78,120,62];if(hdr(x,y)>.9)c=[96,140,72]}
      else if(kind<.5){c=i%2?[170,180,92]:[148,162,80];if(j%4===0)c=hdS(c,.86)}
      else if(kind<.62){c=j%2?[150,104,70]:[126,86,58]}
      else if(kind<.8){c=hdS([134,172,90],.94+hdr(x,y)*.1)}
      else c=hdS([104,146,74],.95+hdr(x,y)*.08);
      if(j===h-1||i===0)c=hdS(c,.72);P(x,y,c)}
    if(kind>=.62&&kind<.8)for(let v=0;v<3;v++){const x=Math.round(cx+(rr()-.5)*w*.6),y=Math.round(cy+(rr()-.5)*h*.5);R(x,y,3,1,v%2?[240,240,236]:[40,36,34]);P(x+(v%2?3:-1),y,[230,226,220]);P(x,y+1,[60,56,52]);P(x+2,y+1,[60,56,52])}}
  // el río
  for(let x=0;x<BW;x++){const y=Math.round(SY+194+10*Math.sin(x*.0095+2)+4*Math.sin(x*.035));R(x,y-2,1,1,[70,110,70]);R(x,y-1,1,1,[84,132,160]);R(x,y,1,2,[118,170,204]);R(x,y+2,1,1,[84,132,160]);if(hdr(x,y)>.9)P(x,y,[236,246,250])}
  // árboles del valle y casitas lejanas
  for(let k=0;k<70;k++){const x=rr()*BW,y=SY+182+rr()*74;if(y<yN(x|0)+30)continue;crown(x,y,2+rr()*2,pick2(rr(),[[52,96,58],[64,112,62],[46,88,52]]))}
  for(let k=0;k<46;k++){const x=Math.round(rr()*BW),y=Math.round(SY+184+rr()*64);if(y<yN(x)+30)continue;const w=5+(rr()*4|0),col=hdC(pick2(rr(),['#f4ead2','#e9c46a','#8fd3c7','#f193b4','#a7c957','#7fc3e8']));R(x,y,w,3,col);R(x+w-1,y,1,3,hdS(col,.78));P(x+(w>>1),y+1,[70,50,40]);R(x-1,y-2,w+2,2,hdC(pick2(rr(),['#a0583a','#9aa4a8','#b84a3a'])));R(x-1,y-2,w+2,1,[200,200,200])}
  // la carretera con su línea amarilla
  const rdB=x=>Math.round(SY+208+8*Math.sin(x*.0125+1));MV.rdB=rdB;
  for(let x=0;x<BW;x++){const y=rdB(x);P(x,y-3,[150,140,118]);for(let j=-2;j<3;j++){const a=hdAsphPx(x*3,y*3+j*3);P(x,y+j,hdS(a,.9))}P(x,y+3,[150,140,118]);if((x>>2)&1)P(x,y,[226,196,90])}
  // la plaza con la cancha
  {const cx=BW*.27,cy=SY+232;for(let y=cy-18;y<cy+18;y++)for(let x=cx-BW*.22;x<cx+BW*.22;x++){const u=(x-cx)/(BW*.22),v=(y-cy)/18;if(u*u+v*v>1)continue;P(x,y,((x>>3)&1)?[134,190,102]:[124,180,94])}
    const fx=Math.round(BW*.2),fy=SY+224;R(fx,fy,48,16,[110,170,84]);R(fx,fy,48,1,[244,244,240]);R(fx,fy+15,48,1,[244,244,240]);R(fx,fy,1,16,[244,244,240]);R(fx+47,fy,1,16,[244,244,240]);R(fx+24,fy,1,16,[244,244,240]);R(fx-1,fy+5,1,6,[244,244,240]);R(fx+48,fy+5,1,6,[244,244,240])}
  // los techos del barrio: repello, zinc con óxido, teja, rejas y tanques negros
  for(let y=SY+240;y<SY+330;y++)for(let x=0;x<BW;x++){const n=hdVN(x,y,16,8),r=hdr(x,y);let c=n>.62?hdS(hdSidePx(x*2,y*2),.86):n>.42?hdS([150,118,84],.9+r*.1):hdS([96,134,72],.9+n*.2+(r-.5)*.08);P(x,y,c)}
  const casas=L.houses.slice().sort((a,b)=>a.row-b.row||a.y-b.y);const plantar=[];
  for(const[i,b]of casas.entries()){const X=b.x*2,Y=SY+b.y*2,Wd=b.w*2,Hh=b.wh*2,Rh=b.rh*2,seed=i*13+7;
    if(b.row<2&&hsh(i,5)<.35)plantar.push([X+Wd+2,Y+Hh,i]);
    hdPlaster(B,X,Y,Wd,Hh,b.wall,seed);R(X+Wd-2,Y,2,Hh,hdS(hdC(b.wall),.74));R(X,Y+Hh-1,Wd,1,hdS(hdC(b.wall),.6));
    const ww=Math.max(3,Wd*.16|0),wh=Math.max(3,Hh*.4|0),wy=Y+Math.round(Hh*.28);
    for(const f of[.16,.62]){const wx=X+Math.round(Wd*f);R(wx-1,wy-1,ww+2,wh+2,[236,230,216]);for(let j=0;j<wh;j++)for(let k=0;k<ww;k++)P(wx+k,wy+j,j<wh*.45&&k<ww*.6?[96,118,140]:[52,64,82]);
      if(hsh(i,f*10|0)<.55)for(let k=1;k<ww;k+=2)R(wx+k,wy,1,wh,[30,28,30]);E.win.push({x:wx,y:wy,w:ww,h:wh,lit:b.lit,s:hsh(i,f*7|0)})}
    const dw=Math.max(3,Wd*.11|0);R(X+Math.round(Wd*.42),Y+Math.round(Hh*.38),dw,Hh-Math.round(Hh*.38),hdS(hdC(pick2(hsh(i,2),['#7a4b2a','#2e5a48','#5a3a24','#3a4a6a'])),1));
    const teja=b.roof==='#a0583a'||b.roof==='#b84a3a';if(teja)hdRoofTeja(B,X-2,Y-Rh,Wd+4,Rh,b.roof,seed);else hdRoofZinc(B,X-2,Y-Rh,Wd+4,Rh,b.roof,seed,false);
    R(X-2,Y,Wd+4,1,[34,30,30]);R(X,Y+1,Wd,1,hdS(hdC(b.wall),.7));
    if(b.tank){const tx=X+Math.round(Wd*.6),ty=Y-Rh-6;R(tx,ty,6,7,[30,32,36]);R(tx,ty,6,1,[70,74,82]);R(tx+1,ty+1,1,6,[56,60,66]);R(tx-1,ty+7,8,1,[20,20,22])}
    if(b.ant){const ax=X+Math.round(Wd*.3);R(ax,Y-Rh-12,1,12,[48,50,56]);R(ax-3,Y-Rh-11,7,1,[48,50,56]);R(ax-2,Y-Rh-8,5,1,[48,50,56])}
    if(hsh(i,3)<.14){const dx=X+Math.round(Wd*.82),dy=Y-Rh-2;hdEll(B,dx,dy,2.4,2,[214,214,210]);P(dx+1,dy-1,[240,240,236])}
    if(hsh(i,9)<.18){const ly=Y+Hh-4;for(let k=0;k<Wd-4;k++)P(X+2+k,ly+((k%9)>4?1:0),[60,56,52]);for(let k=3;k<Wd-6;k+=4)R(X+2+k,ly+1,2,3,hdC(pick2(hsh(i,k),['#e85d75','#f2c94c','#3fb6b0','#f4f4f4'])))}}
  // árboles entre las casas (los del barrio, a escala)
  for(const[x,y,i]of plantar){const sp=hdTreeSprite(i*19+3,i%HD_TREEPAL.length,.26,false);hdBlit(B,sp.c,Math.round(x-sp.c.w/2),Math.round(y-sp.c.h+2))}
  L.trees.forEach((t,i)=>{const sp=hdTreeSprite(i*37+5,(i+2)%HD_TREEPAL.length,.24,i%6===0);hdBlit(B,sp.c,Math.round(t.x*2-sp.c.w/2),Math.round(SY+t.y*2-sp.c.h+3))});
  // la iglesia del barrio: nave con frontón de teja, campanario con techo de pirámide, cruz dorada
  {const cx=Math.round(BW*.52),base=SY+280,w=40,h=24,x0=cx-w/2;
    for(let j=0;j<12;j++){const ww=w+6-j*4;if(ww<=0)break;R(cx-(ww>>1),base-h-1-j,ww,1,j%2?[176,80,56]:[196,94,64]);P(cx-(ww>>1),base-h-1-j,[120,50,36])}
    hdPlaster(B,x0,base-h,w,h,'#f6f1e4',91);R(x0+w-2,base-h,2,h,[204,198,184]);R(x0,base-h,w,1,[150,140,126]);R(x0,base-1,w,1,[150,140,126]);
    const tx=cx-7,tw=14,th=30,ty=base-h-th;hdPlaster(B,tx,ty,tw,th,'#f6f1e4',33);R(tx+tw-2,ty,2,th,[204,198,184]);R(tx,ty,tw,1,[150,140,126]);
    for(let j=0;j<9;j++){const ww=tw+2-j*2;if(ww<=0)break;R(cx-(ww>>1),ty-1-j,ww,1,j%2?[176,80,56]:[196,94,64])}
    R(cx,ty-16,1,7,[226,186,80]);R(cx-2,ty-14,5,1,[226,186,80]);
    R(cx-3,ty+5,6,8,[40,32,30]);R(cx-2,ty+4,4,1,[40,32,30]);hdEll(B,cx,ty+10,2,2,[214,170,70]);
    hdEll(B,cx,base-h+7,3.5,3.5,[150,60,44]);hdEll(B,cx,base-h+7,2.2,2.2,[110,160,200]);P(cx,base-h+7,[240,220,150]);
    R(cx-4,base-11,9,11,[96,62,40]);R(cx-3,base-12,7,1,[96,62,40]);R(cx-4,base-11,9,1,[130,86,56]);R(cx,base-11,1,11,[70,44,28]);
    for(const wx of[x0+5,x0+w-9]){R(wx,base-h+9,4,8,[52,64,82]);R(wx,base-h+8,4,1,[52,64,82]);E.win.push({x:wx,y:base-h+9,w:4,h:8,lit:true,s:.5})}
    R(x0-1,base,w+2,1,[120,112,100])}
  // postes de luz y cables colgando
  const PO=[];for(let x=BW*.05;x<BW;x+=BW*.15+hsh(x|0,3)*BW*.05)PO.push([Math.round(x),SY+272+(hsh(x|0,9)*12|0)]);
  for(let i=0;i<PO.length-1;i++){const[a,b]=[PO[i],PO[i+1]];for(const d of[0,3,5]){for(let k=0;k<=1;k+=1/(b[0]-a[0])){const x=a[0]+(b[0]-a[0])*k,y=a[1]-24+d+(b[1]-a[1])*k+10*4*k*(1-k);P(x,y,[34,34,38])}}}
  for(const[x,y]of PO){R(x-1,y-26,3,30,[150,150,146]);R(x-1,y-26,1,30,[184,184,180]);R(x-5,y-25,11,2,[120,120,118]);for(const dx of[-4,0,4])P(x+dx,y-26,[200,200,196])}
  // primer plano: el piso del mirador, la buganvilla, la baranda de hierro, los binoculares, la banca y el farol
  const FY=SY+328;for(let y=FY;y<BH;y++)for(let x=0;x<BW;x++){let c=hdS(hdSidePx(x*2,y*2),.82);if((x%24===0)||((y-FY)%14===0))c=hdS(c,.82);P(x,y,c)}
  for(let k=0;k<14;k++){let x=rr()*BW,y=FY+2+rr()*(BH-FY-4);for(let s=0;s<10;s++){P(x,y,[96,92,84]);x+=rr()*2-.5;y+=rr()*1.4-.5}}
  const FL=[[222,60,130],[188,38,104],[246,124,172]],HJ=[[62,118,60],[40,86,46]];
  const buga=(cx,cy,rx,ry,nn)=>{for(let k=0;k<nn;k++){const a=rr()*Math.PI*2,d=Math.sqrt(rr()),x=Math.round(cx+Math.cos(a)*d*rx),y=Math.round(cy+Math.sin(a)*d*ry);if(x<0)continue;const leaf=rr()<.28,c=leaf?HJ[(rr()*2)|0]:FL[(rr()*3)|0];P(x,y,c);P(x+1,y,leaf?c:FL[(rr()*3)|0]);if(rr()<.5)P(x,y+1,hdS(c,.8))}};
  buga(34,FY-30,52,24,2600);
  const RY=FY-22;R(0,RY,BW,3,[38,40,46]);R(0,RY,BW,1,[104,108,118]);R(0,FY-3,BW,2,[38,40,46]);R(0,FY-3,BW,1,[92,96,106]);
  for(let x=2;x<BW;x+=6){R(x,RY+3,2,FY-RY-6,[38,40,46]);P(x,RY+3,[104,108,118]);R(x,RY+3,1,FY-RY-6,[70,74,82]);if((x/6|0)%4===0){const cx=x+4,cy=RY+11;for(let a=0;a<12;a++)P(Math.round(cx+Math.cos(a/12*6.28)*2.6),Math.round(cy+Math.sin(a/12*6.28)*2.6),[38,40,46])}}
  buga(18,FY-14,30,12,700);
  for(let x=0;x<BW;x+=72){R(x,RY-6,5,FY-RY+10,[30,32,38]);R(x,RY-6,1,FY-RY+10,[96,100,110]);hdEll(B,x+2.5,RY-8,3,3,[30,32,38]);P(x+1,RY-10,[120,124,134])}
  {const bx=Math.round(BW*.36),by=FY+8;R(bx-1,by-26,3,26,[40,94,120]);R(bx-1,by-26,1,26,[90,160,190]);R(bx-7,by-34,14,8,[42,111,143]);R(bx-7,by-34,14,1,[110,180,210]);hdEll(B,bx-5,by-30,2.6,2.6,[30,70,90]);hdEll(B,bx+5,by-30,2.6,2.6,[30,70,90]);P(bx-6,by-31,[200,240,250]);P(bx+4,by-31,[200,240,250]);R(bx-4,by+0,9,2,[30,32,38])}
  {const bx=Math.round(BW*.62),by=FY+22;for(const dy of[-10,-6])R(bx,by+dy,52,3,[122,82,51]),R(bx,by+dy,52,1,[160,112,72]);R(bx+4,by-10,2,12,[40,40,44]);R(bx+46,by-10,2,12,[40,40,44])}
  {const lx=BW-30,top=SY+238;R(lx,top,3,BH-top,[30,32,38]);R(lx,top,1,BH-top,[90,94,104]);R(lx-3,BH-10,9,10,[30,32,38]);R(lx-5,top-4,13,2,[30,32,38]);R(lx-4,top-16,11,12,[30,32,38]);R(lx-3,top-15,9,10,[190,186,168]);R(lx-1,top-15,1,10,[30,32,38]);R(lx+3,top-15,1,10,[30,32,38]);R(lx-3,top-18,9,2,[30,32,38]);P(lx+1,top-20,[30,32,38]);E.lamp={x:lx-3,y:top-15,w:9,h:10}}
  return{cv:hdToCanvas(B),E}}
// ---------------------------------------------------------------- nubes en píxel (tres tonos, sin borde)
function mvCloud(seed,w,h){const b=hdBuf(w,h),blobs=[];for(let k=0;k<6;k++)blobs.push([w*(.15+.7*hsh(seed,k)),h*(.45+.25*hsh(k,seed)),h*(.28+.22*hsh(seed+k,2))]);blobs.push([w*.5,h*.62,h*.4]);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let best=0;for(const[cx,cy,r]of blobs){const d=1-Math.hypot(x+.5-cx,(y+.5-cy)*1.1)/r;if(d>best)best=d}if(best<=0||y>h*.82)continue;const t=y/h+(1-best)*.25;
    const c=t<.38?[255,255,255]:t<.56?(mvD(x,y)<(t-.38)*5?[226,232,242]:[255,255,255]):t<.7?[226,232,242]:[198,206,224];hdP(b,x,y,c)}return hdToCanvas(b)}
function mvTint(src,col){const c=mk(src.width,src.height),g=c.getContext('2d');g.drawImage(src,0,0);g.globalCompositeOperation='multiply';g.fillStyle=`rgb(${col.map(v=>Math.max(0,Math.min(255,v|0))).join(',')})`;g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='destination-in';g.drawImage(src,0,0);return c}
// ---------------------------------------------------------------- cielo en píxel con tramado
function mvSky(BW,rows,SY,h,rain){const img=new ImageData(BW,rows),d=img.data,[top,bot]=vSkyAt(h),wm=Math.min(1,vWarm(h)),n=vNight(h);
  const T=rain?vmix(top,'#5a6170',rain*.6):top,Bt=rain?vmix(bot,'#8a909a',rain*.6):bot,hzY=SY+150;
  for(let y=0;y<rows;y++){const t=Math.min(1,y/hzY),base=mvMix(T,Bt,Math.pow(t,1.3)),band=wm*Math.max(0,1-Math.abs(t-.94)*5),c=band?mvMix(base,[255,168,110],band*.55):base;
    for(let x=0;x<BW;x++){const q=mvD(x,y)-.5,i=(y*BW+x)<<2;d[i]=Math.round((c[0]+q*10)/5)*5;d[i+1]=Math.round((c[1]+q*10)/5)*5;d[i+2]=Math.round((c[2]+q*10)/5)*5;d[i+3]=255}}
  const put=(x,y,c,a)=>{x|=0;y|=0;if(x<0||y<0||x>=BW||y>=rows)return;const i=(y*BW+x)<<2;d[i]+=(c[0]-d[i])*a;d[i+1]+=(c[1]-d[i+1])*a;d[i+2]+=(c[2]-d[i+2])*a};
  if(h>=5.6&&h<=18.6){const k=(h-5.6)/13,sx=BW*.08+k*BW*.84,sy=SY+140-Math.sin(Math.PI*k)*(116+SY*.6),low=1-Math.sin(Math.PI*k),sc=mvMix([255,246,214],[255,138,74],low*.8),A=1-rain*.85;
    for(let y=-26;y<=26;y++)for(let x=-26;x<=26;x++){const r=Math.hypot(x,y);if(r<7)put(sx+x,sy+y,sc,A);else if(r<26&&mvD(sx+x|0,sy+y|0)<(1-(r-7)/19)*.55*A)put(sx+x,sy+y,mvMix(sc,[255,255,255],.2),.5)}}
  const mh=h>=18?h-18:h<6?h+6:-1;if(mh>=0){const k=mh/12,mx=BW*.1+k*BW*.8,my=SY+144-Math.sin(Math.PI*k)*(112+SY*.6);
    for(let y=-14;y<=14;y++)for(let x=-14;x<=14;x++){const r=Math.hypot(x,y);if(r<5.5)put(mx+x,my+y,(x+2)*(x+2)+(y+1)*(y+1)<3||(x-2)*(x-2)+(y-2)*(y-2)<2?[206,202,178]:[246,242,222],1-rain*.8);else if(r<14&&mvD(mx+x|0,my+y|0)<(1-(r-5.5)/8.5)*.4)put(mx+x,my+y,[220,226,255],.35)}}
  return img}
// ---------------------------------------------------------------- cada cuadro
function drawVistaB(){const V=VISTA,L=V.L,W=V.W,H=V.H,BW=W*2,BH=H*2,SY=BH-360,K=V.K,cv=$('#vcan'),g=cv.getContext('2d'),t=V.t,h=S.t/60,rain=Math.min(1,(S.rain||0)/20);
  if(!MV.land||MV.sz!==BW+'x'+BH){MV.land=mvLand(W,H);MV.sz=BW+'x'+BH;MV.key=MV.skyKey=null;MV.F=mk(BW,BH);MV.cl=L.clouds.map((c,i)=>mvCloud(i*11+3,Math.round(c.w*2.2),Math.round(14+c.w*.4)))}
  const F=MV.F,f=F.getContext('2d'),n=vNight(h),wm=Math.min(1,vWarm(h)),bot=vSkyAt(h)[1];f.imageSmoothingEnabled=false;
  // luz ambiente del juego sobre el paisaje (se recalcula cada pocos minutos de juego)
  const key=Math.floor(h*12)+'|'+Math.round(rain*4);if(MV.key!==key){MV.key=key;let a=hdAmbient(h);if(rain)a=[a[0]*.82,a[1]*.84,a[2]*.9];a=a.map(v=>Math.max(.24,Math.min(1,v)));
    const lit=mk(BW,BH),lg=lit.getContext('2d');lg.drawImage(MV.land.cv,0,0);lg.globalCompositeOperation='multiply';lg.fillStyle=`rgb(${a.map(v=>v*255|0).join(',')})`;lg.fillRect(0,0,BW,BH);
    if(wm>0){lg.globalCompositeOperation='source-atop';const wg=lg.createLinearGradient(0,SY+40,0,SY+300);wg.addColorStop(0,`rgba(255,150,80,${.28*wm})`);wg.addColorStop(1,`rgba(255,150,80,${.06*wm})`);lg.fillStyle=wg;lg.fillRect(0,0,BW,BH)}
    lg.globalCompositeOperation='destination-in';lg.drawImage(MV.land.cv,0,0);MV.lit=lit;
    const ct=vmix(vmix(vmix('#ffffff',bot,.18+wm*.35),'#6e7480',rain*.7),'#2b3160',n*.85);MV.clT=MV.cl.map(c=>mvTint(c,ct))}
  const skyRows=Math.min(BH,SY+230),sk=Math.floor(h*30)+'|'+Math.round(rain*6);if(MV.skyKey!==sk){MV.skyKey=sk;MV.sky=mvSky(BW,skyRows,SY,h,rain)}
  f.putImageData(MV.sky,0,0);
  if(n>.05&&rain<.6)for(const s of L.stars){const a=n*(1-rain)*(.45+.55*Math.sin(t*2+s.p*3));if(a<=.05)continue;const x=Math.round(s.x*2),y=Math.round(s.y*2*(SY+130)/120);f.fillStyle=`rgba(255,250,232,${a.toFixed(2)})`;f.fillRect(x,y,1,1);if(s.b&&a>.5){f.fillStyle=`rgba(255,250,232,${(a*.45).toFixed(2)})`;f.fillRect(x-1,y,3,1);f.fillRect(x,y-1,1,3)}}
  L.clouds.forEach((c,i)=>{const im=MV.clT[i],x=Math.round(((c.x*2+t*c.s*2)%(BW*1.4))-BW*.2),y=Math.round(SY*.5+c.y*2);f.drawImage(im,x,y)});
  f.drawImage(MV.lit,0,0);
  // ventanas, ciudad y valle que se encienden de noche
  const E=MV.land.E;if(n>.3){const a=Math.min(1,(n-.3)*1.6);f.fillStyle=`rgba(255,206,128,${a.toFixed(2)})`;for(const w of E.win)if(w.lit&&(w.s>.08||Math.sin(t*.5+w.s*40)>-.9))f.fillRect(w.x,w.y,w.w,w.h);
    f.globalCompositeOperation='lighter';f.fillStyle=`rgba(255,160,80,${(.16*a).toFixed(2)})`;for(const w of E.win)if(w.lit)f.fillRect(w.x-2,w.y-2,w.w+4,w.h+4);f.globalCompositeOperation='source-over';
    for(const[x,y]of E.city){if(Math.sin(t*.7+x*.31+y*.17)>-.7){f.fillStyle=`rgba(255,214,128,${a.toFixed(2)})`;f.fillRect(x,y,1,1)}}
    for(const l of L.lights){const al=a*(.5+.5*Math.sin(t*3+l.p*7));f.fillStyle=l.c;f.globalAlpha=al;f.fillRect(Math.round(l.x*2),Math.round(SY+l.y*2),1,1);f.globalAlpha=1}
    const lp=E.lamp;if(lp){f.fillStyle='#ffe6a0';f.fillRect(lp.x,lp.y,lp.w,lp.h);f.fillStyle='#30323a';f.fillRect(lp.x+2,lp.y,1,lp.h);f.fillRect(lp.x+6,lp.y,1,lp.h)}}
  if(n>.2)for(const[x,y]of E.red)if(Math.sin(t*3+x)>0){f.fillStyle='#ff3a2a';f.fillRect(x,y,1,1)}
  // carros por la carretera
  L.cars.forEach((c,i)=>{const x=Math.round(c.x*2),y=MV.rdB(x)-1;f.fillStyle=['#d6453c','#f4ead2','#2a6fb0','#f2b632','#3fa66b'][i];f.fillRect(x-2,y-1,5,2);f.fillStyle='rgba(30,30,40,.8)';f.fillRect(x-1,y-2,3,1);
    if(n>.35){f.fillStyle='#fff4c0';f.fillRect(c.s>0?x+3:x-3,y,1,1);f.fillStyle='#ff4a3a';f.fillRect(c.s>0?x-3:x+3,y,1,1)}});
  // neblina de la mañana (bandas con tramado)
  const fog=Math.max(0,1-Math.abs(h-6.3)/1.6)+rain*.45;if(fog>.02)for(let i=0;i<5;i++){const y=SY+176+i*12,a=fog*(.22+.1*Math.sin(t*.4+i));f.fillStyle=`rgba(236,240,246,${a.toFixed(2)})`;for(let x=0;x<BW;x+=2){const o=Math.round(Math.sin(x*.03+t*.25+i)*3);f.fillRect(x,y+o,2,5)}}
  // pericos y zopilotes
  if(n<.4&&!rain)L.birds.forEach((b,i)=>{const x=Math.round(b.x*2),y=Math.round(SY*.6+b.y*2+Math.sin(t*1.5+b.p)*5),up=Math.sin(t*9+b.p)>0;f.fillStyle=i%2?'#1d1a24':'#2f8a4a';const cnt=i%2?1:3;
    for(let k=0;k<cnt;k++){const ox=x+k*7,oy=y+k*3;f.fillRect(ox-1,oy,3,1);f.fillRect(ox-3,oy+(up?-1:1),2,1);f.fillRect(ox+2,oy+(up?-1:1),2,1)}});
  // luciérnagas
  if(n>.5)L.flies.forEach(fl=>{const a=Math.max(0,Math.sin(t*2+fl.p*4));if(a>.2){const x=Math.round(fl.x*2+Math.sin(t*.6+fl.p)*10),y=Math.round(SY+fl.y*2+Math.cos(t*.8+fl.p)*6);f.fillStyle=`rgba(225,255,140,${(a*n).toFixed(2)})`;f.fillRect(x,y,1,1);f.fillStyle=`rgba(225,255,140,${(a*n*.3).toFixed(2)})`;f.fillRect(x-1,y,3,1);f.fillRect(x,y-1,1,3)}});
  // lluvia en píxel
  if(rain){f.fillStyle=`rgba(50,60,80,${(.18*rain).toFixed(2)})`;f.fillRect(0,0,BW,BH);f.fillStyle=`rgba(210,222,240,${(.55*rain).toFixed(2)})`;for(let i=0;i<BW*.9;i++){const sp=.8+hsh(i,2)*.5,y=Math.round((hsh(1,i)*BH+t*330*sp)%BH),x=Math.round((hsh(i,1)*(BW+30)+t*60*sp+y*.18)%(BW+30))-15;f.fillRect(x,y,1,3+(i%3))}}
  // ampliar nítido + luz cinematográfica (halo del farol, sol bajo, viñeta)
  g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.drawImage(F,0,0,cv.width,cv.height);const s=K/2;
  if(n>.25&&E.lamp){const lx=(E.lamp.x+4.5)*s,ly=(E.lamp.y+5)*s,R=70*s,lg=g.createRadialGradient(lx,ly,0,lx,ly,R);lg.addColorStop(0,`rgba(255,210,130,${(.4*n*(.94+.06*Math.sin(t*7))).toFixed(2)})`);lg.addColorStop(1,'rgba(255,210,130,0)');g.globalCompositeOperation='lighter';g.fillStyle=lg;g.fillRect(lx-R,ly-R,R*2,R*2);g.globalCompositeOperation='source-over'}
  if(wm>.2&&!rain&&h>12){const k=(h-5.6)/13,sx=(BW*.08+k*BW*.84)*s,sy=(SY+140-Math.sin(Math.PI*k)*(116+SY*.6))*s,R=BW*.6*s,sg=g.createRadialGradient(sx,sy,0,sx,sy,R);sg.addColorStop(0,`rgba(255,170,100,${(.22*wm).toFixed(2)})`);sg.addColorStop(1,'rgba(255,170,100,0)');g.globalCompositeOperation='lighter';g.fillStyle=sg;g.fillRect(0,0,cv.width,cv.height);g.globalCompositeOperation='source-over'}
  const vg=g.createRadialGradient(cv.width/2,cv.height*.55,cv.height*.3,cv.width/2,cv.height*.55,Math.max(cv.width,cv.height)*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${.32+n*.2})`);g.fillStyle=vg;g.fillRect(0,0,cv.width,cv.height)}
