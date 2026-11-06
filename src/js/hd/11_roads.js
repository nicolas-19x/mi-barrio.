// ---------- calle: rayas, pasos peatonales, baches, parches, grietas ----------
function hdRoad(b,m){
  const paint=[226,190,72],paintW=[226,222,208];
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){if(ti(m,tx,ty)!==1)continue;const X=tx*HT,Y=ty*HT;
    const inV=tx>=28&&tx<=30,inH=(ty>=20&&ty<=22)||(ty>=36&&ty<=38)||(ty>=62&&ty<=64);
    // línea amarilla discontinua, gastada
    if((ty===21||ty===37||ty===63)&&!inV&&tx%2===0){for(let i=3;i<28;i++)for(let j=14;j<18;j++){const r=hdr(X+i,Y+j);if(r>.05)hdP(b,X+i,Y+j,hdS(paint,.8+r*.24),r>.16?.92:.45)}}
    if(tx===29&&!inH&&ty%2===0&&ty>19){for(let j=3;j<28;j++)for(let i=14;i<18;i++){const r=hdr(X+i,Y+j);if(r>.05)hdP(b,X+i,Y+j,hdS(paint,.8+r*.24),r>.16?.92:.45)}}
    // paso peatonal (zebra) donde la calle vertical cruza las aceras
    if(inV&&(ty===23||ty===19||ty===35||ty===39||ty===61)){for(let k=0;k<4;k++)for(let j=5;j<27;j++)for(let i=0;i<5;i++){const r=hdr(X+k*8+i+1,Y+j);if(r>.04)hdP(b,X+k*8+i+1,Y+j,hdS(paintW,.84+r*.16),r>.12?.95:.5)}}
    // parches de bacheo
    if(hsh(tx*13,ty*7)<.07&&!(ty===21||ty===37||ty===63)){const pw=10+((hsh(tx,ty*3)*16)|0),ph=6+((hsh(ty,tx*3)*10)|0),px=X+((hsh(tx*3,ty)*(30-pw))|0),py=Y+4+((hsh(ty*5,tx)*(24-ph))|0);
      for(let j=0;j<ph;j++){const a=(hsh(j,tx)*2)|0,e=(hsh(ty,j)*2)|0;for(let i=a;i<pw-e;i++){const r=hdr(px+i,py+j);hdP(b,px+i,py+j,[60+r*8,58+r*8,56+r*8])}hdP(b,px+a,py+j,[50,48,46]);hdP(b,px+pw-e-1,py+j,[86,82,78])}}
    // grietas finas
    if(hsh(tx*5,ty*11)<.18){let x=X+((hsh(tx,ty*9)*28)|0),y=Y+((hsh(ty*9,tx)*28)|0);for(let i=0;i<14+((hsh(tx,ty)*16)|0);i++){hdP(b,x,y,[42,40,40]);x+=hsh(i,tx*3)<.75?1:0;y+=hsh(tx+i,ty*3)<.33?1:hsh(i,ty*3)<.5?-1:0}}
    // manchas de aceite
    if(hsh(tx*17,ty*3)<.08)hdEll(b,X+8+hsh(tx,ty*4)*16,Y+10+hsh(ty*4,tx)*12,4+hsh(tx,ty)*5,2+hsh(ty,tx)*2,[34,32,34],.35);
    // baches (hundidos: borde de arriba en sombra, de abajo con luz), algunos con agua
    if(hsh(tx*19,ty*23)<.05&&!(ty===21||ty===37||ty===63)&&!inV){const cx=X+10+hsh(tx,ty*5)*12,cy=Y+10+hsh(ty*5,tx)*12,rx=5+hsh(tx*2,ty)*6,ry=3+hsh(ty*2,tx)*3,wet=hsh(tx,ty)<.5;
      for(let y=Math.floor(cy-ry-2);y<=cy+ry+2;y++)for(let x=Math.floor(cx-rx-2);x<=cx+rx+2;x++){const u=(x-cx)/rx,v=(y-cy)/ry,dd=u*u+v*v+.16*Math.sin(x*1.3+y*.7);
        if(dd<1){let c=dd>.55&&(u+v)<0?[36,32,30]:[46,42,40];if(wet&&dd<.6)c=(y-cy)<-ry*.1?[134,142,152]:[104,114,126];if(dd>.82&&(u+v)>.3)c=[120,114,106];hdP(b,x,y,c)}
        else if(dd<1.35&&hdr(x,y)<.45)hdP(b,x,y,[60,56,54])}
      for(let k=0;k<8;k++){const a=hsh(k,tx+ty)*6.28;hdP(b,cx+Math.cos(a)*(rx+3),cy+Math.sin(a)*(ry+2),[140,132,122])}}
  }}
// ---------- tapias con reja, cercas del parque ----------
function hdFences(b,m){
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){if(ti(m,tx,ty)!==4)continue;const X=tx*HT,Y=ty*HT;
    const isF=(x,y)=>ti(m,x,y)===4,park=ty>=24&&ty<=34&&tx>=32&&tx<=59;
    const L=isF(tx-1,ty),Rr=isF(tx+1,ty),U=isF(tx,ty-1),Dn=isF(tx,ty+1);const horiz=!((U||Dn)&&!(L&&Rr));
    if(park){ // baranda verde del parque sobre un murito
      if(horiz){hdR(b,X,Y+22,HT,5,[180,172,156]);hdR(b,X,Y+22,HT,1,[214,206,190]);hdR(b,X,Y+27,HT,2,[110,104,92],.6);
        hdR(b,X,Y+8,HT,2,[46,98,64]);hdR(b,X,Y+8,HT,1,[96,150,104]);for(let i=2;i<HT;i+=6){hdR(b,X+i,Y+8,2,14,[40,86,56]);hdP(b,X+i,Y+8,[110,160,116])}}
      else{hdR(b,X+12,Y,8,HT,[180,172,156]);hdR(b,X+12,Y,2,HT,[214,206,190]);hdR(b,X+18,Y,2,HT,[120,114,100]);for(let j=2;j<HT;j+=6)hdR(b,X+14,Y+j,4,2,[40,86,56])}
      continue}
    if(horiz){ // tapia baja de block repellado + reja negra con puntas
      const wallC=[214,206,190];
      for(let j=0;j<9;j++)for(let i=0;i<HT;i++){const r=hdr(X+i,Y+18+j);hdP(b,X+i,Y+18+j,hdS(wallC,(j<2?1.08:.98-j*.012)+(r-.5)*.05))}
      hdR(b,X,Y+16,HT,2,[236,230,216]);hdR(b,X,Y+27,HT,2,[96,90,80],.55);   // remate + sombra al pie
      for(let i=0;i<HT;i+=32)if(hsh(tx,ty)<.5)hdR(b,X+i,Y+20,1,6,[170,160,144]);
      hdR(b,X,Y+4,HT,2,[30,26,26]);hdR(b,X,Y+4,HT,1,[78,72,72]);hdR(b,X,Y+12,HT,1,[30,26,26]);
      for(let i=1;i<HT;i+=4){hdR(b,X+i,Y+2,1,14,[26,22,22]);hdP(b,X+i,Y+1,[26,22,22]);hdP(b,X+i,Y+2,[90,84,84])}
      if(hsh(tx*3,ty)<.18){hdR(b,X+6,Y+19,7,5,[160,150,130],.5)}   // repello caído
      // musgo al pie
      for(let i=0;i<HT;i++)if(hdr(X+i,Y+26)<.25)hdP(b,X+i,Y+26,[86,110,60])
    }else{ // tapia lateral vista desde arriba
      hdR(b,X+11,Y,10,HT,[206,198,182]);hdR(b,X+11,Y,3,HT,[236,230,216]);hdR(b,X+19,Y,2,HT,[150,142,126]);hdR(b,X+21,Y,4,HT,[60,70,50],.35);
      for(let j=3;j<HT;j+=8)hdR(b,X+14,Y+j,5,1,[26,22,22])}
  }}
// ---------- cancha: líneas de cal ----------
function hdField(b){const L=(x,y,w,h)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++){const r=hdr(x+i,y+j);if(r>.08)hdP(b,x+i,y+j,[236,236,226],.75+r*.25)}};
  const x0=46*HT,y0=26*HT,x1=57*HT,y1=32*HT;
  // zacate gastado frente a los marcos y en el centro
  for(const[cx,cy,r]of[[x0+20,29*HT,22],[x1-20,29*HT,22],[51*HT+16,29*HT,16]])for(let y=cy-r;y<cy+r;y++)for(let x=cx-r*1.4;x<cx+r*1.4;x++){const u=(x-cx)/(r*1.4),v=(y-cy)/r,dd=u*u+v*v;if(dd<1&&hdVN(x,y,6,91)<(1-dd)*.95)hdP(b,x,y,HDPAL.dirt[3+((hdr(x|0,y|0)*2)|0)],.55+(1-dd)*.4)}
  L(x0,y0,2,y1-y0);L(x1-2,y0,2,y1-y0);L(x0,y0,x1-x0,2);L(x0,y1-2,x1-x0,2);L(51*HT+16,y0,2,y1-y0);
  for(let a=0;a<360;a+=1.2){const t=a*Math.PI/180;const x=51*HT+17+Math.cos(t)*28,y=29*HT+Math.sin(t)*28;L(x,y,2,2)}
  for(const gx of[x0,x1]){const dir=gx===x0?1:-1;L(gx+(dir>0?0:-36),28*HT-8,36,2);L(gx+(dir>0?0:-36),30*HT+6,36,2);L(gx+(dir>0?34:-36),28*HT-8,2,46)}
}
