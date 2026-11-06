// ---------- suelo del barrio ----------
const HDPAL={
 grass:['#43672d','#4e7533','#5a8239','#658e40','#719a48','#80a754','#94b965'].map(hdC),
 park:['#466f2f','#527e35','#5e8b3c','#6a9843','#76a34b','#86b157','#9ac469'].map(hdC),
 dirt:['#664a30','#755638','#846342','#93714d','#a07e58','#ae8d65','#bf9f78'].map(hdC),
};
const hdIsSide=t=>t===2||t===16;
function hdGrassPx(X,Y,pal){const n=hdVN(X,Y,26,7)*.6+hdVN(X,Y,9,3)*.4,r=hdr(X,Y);let k=.6+n*4.6+(r-.5)*1.1;
  const bl=hdr(X*3+7,Y>>1);if(bl<.075)k-=1.6;else if(bl>.955)k+=1.3;
  return pal[k<0?0:k>6?6:Math.round(k)]}
function hdAsphPx(X,Y){const n=hdVN(X,Y,44,11),n2=hdVN(X,Y,12,5),r=hdr(X,Y);let v=66+n*13+n2*5+(r-.5)*9;if(r>.94)v+=16;else if(r<.05)v-=13;return[v*1.03,v*.99,v*.95]}
function hdSidePx(X,Y){const n=hdVN(X,Y,30,21),r=hdr(X,Y);let v=176+(n-.5)*14+(r-.5)*9;if(hdVN(X,Y,13,4)>.78)v-=9;if(r<.02)v-=24;return[v*1.03,v*.985,v*.9]}
function hdDirtPx(X,Y){const n=hdVN(X,Y,20,31)*.7+hdVN(X,Y,6,8)*.3,r=hdr(X,Y);let k=1.2+n*3.8+(r-.5)*1.2;if(r>.965)k+=1.8;else if(r<.03)k-=1.6;return HDPAL.dirt[k<0?0:k>6?6:Math.round(k)]}
function hdYardPx(X,Y){ // baldosas de cemento rojizo y ocre, 16 px
  const u=X&15,v=Y&15,tx=X>>4,ty=Y>>4,r=hdr(X,Y),n=hdVN(X,Y,24,41);
  if(u===15||v===15)return[128,116,102];
  const k=(tx*7+ty*3)%7;let c=k===0?[170,122,96]:k===3?[176,140,108]:[184,160,128];const f=.94+n*.1+(r-.5)*.05+(u===0||v===0?.04:0);
  return[c[0]*f,c[1]*f,c[2]*f]}
function hdGround(b,m){const W=b.w,H=b.h,d=b.d;
  for(let Y=0;Y<H;Y++){const ty=Y>>5;for(let X=0;X<W;X++){const tx=X>>5,t=ti(m,tx,ty);let c;
    switch(t){
      case 1:c=hdAsphPx(X,Y);break;
      case 2:case 16:c=hdSidePx(X,Y);break;
      case 6:c=hdDirtPx(X,Y);break;
      case 8:c=hdGrassPx(X,Y,HDPAL.park);break;
      case 15:{const st=(tx&1)?1:-1,g=hdGrassPx(X,Y,HDPAL.park);c=hdS(g,1+st*.045);break}
      case 14:c=hdYardPx(X,Y);break;
      case 37:{const u=X&31,v=Y&31,row=v>>3,off=(row&1)?8:0,mort=(v&7)===7||((u+off)&15)===15;const r=hdr(X,Y);c=mort?[96,92,86]:hdS([132,128,120],.92+r*.12+(hdVN(X,Y,10,77)-.5)*.12);break}
      case 4:c=(ty>=24&&ty<=34&&tx>=32&&tx<=59)?hdGrassPx(X,Y,HDPAL.park):hdGrassPx(X,Y,HDPAL.grass);break;
      default:c=hdGrassPx(X,Y,HDPAL.grass)}
    const k=(Y*W+X)<<2;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255}}}
// ---------- bordes, cordón, cuneta, juntas, maleza ----------
function hdTileEdges(b,m){
  for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){const t=ti(m,tx,ty),X=tx*HT,Y=ty*HT;
    const N=ti(m,tx,ty-1),S=ti(m,tx,ty+1),Wt=ti(m,tx-1,ty),E=ti(m,tx+1,ty);
    if(hdIsSide(t)){ // losas: orientación según la acera
      const vert=!(hdIsSide(Wt)||hdIsSide(E)||Wt===1&&E===1)&&(hdIsSide(N)||hdIsSide(S));
      const J=[150,140,124],JL=[196,188,170];
      if(!vert){hdR(b,X,Y+15,HT,1,J);hdR(b,X,Y+16,HT,1,JL,.6);const o=(ty&1)?16:0;hdR(b,X+o,Y,1,15,J);hdR(b,X+((o+16)&31),Y+16,1,16,J)}
      else{hdR(b,X+15,Y,1,HT,J);hdR(b,X+16,Y,1,HT,JL,.6);hdR(b,X,Y+((tx&1)?16:0),15,1,J);hdR(b,X+16,Y+((tx&1)?0:16),16,1,J)}
      // grietas y maleza en las juntas
      if(hsh(tx*7,ty*13)<.28){let x=X+((hsh(tx,ty)*30)|0),y=Y+((hsh(ty,tx)*30)|0);for(let i=0;i<10+((hsh(tx+3,ty)*14)|0);i++){hdP(b,x,y,[118,108,94]);x+=hsh(i,tx+ty)<.7?1:0;y+=hsh(tx+i,ty)<.33?1:hsh(i,ty)<.5?-1:0}}
      if(hsh(tx*3,ty*5)<.35){const wx=X+(hsh(tx,ty*2)<.5?15:3+((hsh(tx,ty*7)*26)|0)),wy=Y+15;for(let k=0;k<4;k++)hdP(b,wx+((k*7)%3)-1,wy-k%3,k%2?[112,140,62]:[88,120,52])}
      if(hsh(tx*11,ty*3)<.22)hdEll(b,X+6+hsh(tx,ty*3)*20,Y+6+hsh(ty*3,tx)*20,3+hsh(tx,ty)*5,2+hsh(ty,tx)*3,[120,112,98],.22);   // manchas
      if(hsh(tx*5,ty*9)<.2)hdP(b,X+((hsh(tx*9,ty)*30)|0),Y+((hsh(ty*9,tx)*30)|0),[90,86,84]);   // chicle
      // cordón hacia el asfalto (borde iluminado + cara en sombra)
      if(S===1){hdR(b,X,Y+28,HT,2,[220,212,194]);hdR(b,X,Y+30,HT,2,[138,128,112])}
      if(N===1){hdR(b,X,Y,HT,2,[150,140,124]);hdR(b,X,Y+2,HT,1,[214,206,188])}
      if(E===1){hdR(b,X+29,Y,2,HT,[214,206,188]);hdR(b,X+31,Y,1,HT,[132,122,108])}
      if(Wt===1){hdR(b,X,Y,1,HT,[132,122,108]);hdR(b,X+1,Y,2,HT,[214,206,188])}
    }
    if(t===1){ // cuneta de concreto pegada a la acera
      const cun=(x,y,w,h,horiz,flip)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++){const xx=x+i,yy=y+j,q=horiz?(flip?h-1-j:j):(flip?w-1-i:i);
        let c=[138,130,116];if(q===2||q===3)c=[96,90,80];if(q===4)c=[118,112,100];if(q>=5)c=[78,74,70];const r=hdr(xx,yy);c=hdS(c,.95+r*.1);hdP(b,xx,yy,c)}};
      if(hdIsSide(N))cun(X,Y,HT,6,true,false);
      if(hdIsSide(S))cun(X,Y+26,HT,6,true,true);
      if(hdIsSide(Wt))cun(X,Y,6,HT,false,false);
      if(hdIsSide(E))cun(X+26,Y,6,HT,false,true);
      // hojas y basurita en la cuneta
      if(hdIsSide(N)||hdIsSide(S))for(let i=0;i<3;i++)if(hsh(tx*5+i,ty)<.4){const lx=X+((hsh(tx,i*7+ty)*28)|0),ly=Y+(hdIsSide(N)?2:27)+((hsh(i,tx)*3)|0);const lc=[[150,110,52],[176,128,58],[118,96,44]][i%3];hdP(b,lx,ly,lc);hdP(b,lx+1,ly,lc)}
    }
    // zacate que invade las orillas de acera, tierra y patio
    if((hdIsSide(t)||t===6||t===14||t===1&&false)){
      const edge=(dx,dy)=>{const nt=ti(m,tx+dx,ty+dy);return nt===0||nt===5||nt===7||nt===8||nt===4};
      for(let i=0;i<HT;i++){
        if(edge(0,-1)){const h=1+((hdr(X+i,Y)*3.4)|0);for(let k=0;k<h;k++)hdP(b,X+i,Y+k,HDPAL.grass[2+((hdr(X+i,Y+k+5)*3)|0)])}
        if(edge(0,1)){const h=((hdr(X+i,Y+40)*2.6)|0);for(let k=0;k<h;k++)hdP(b,X+i,Y+31-k,HDPAL.grass[2+((hdr(X+i,Y+k)*2)|0)])}
        if(edge(-1,0)){const h=1+((hdr(X,Y+i)*3)|0);for(let k=0;k<h;k++)hdP(b,X+k,Y+i,HDPAL.grass[2+((hdr(X+k,Y+i)*3)|0)])}
        if(edge(1,0)){const h=1+((hdr(X+31,Y+i)*3)|0);for(let k=0;k<h;k++)hdP(b,X+31-k,Y+i,HDPAL.grass[1+((hdr(X+k,Y+i)*3)|0)])}
      }
    }
    if(t===6){ // tierra: piedritas y huellas
      for(let i=0;i<6;i++)if(hsh(tx*3+i,ty*7)<.5){const px=X+((hsh(i,tx*5+ty)*30)|0),py=Y+((hsh(tx+i*3,ty)*30)|0);hdP(b,px,py,[196,182,160]);hdP(b,px+1,py,[150,134,112]);hdP(b,px,py+1,[110,90,66])}
    }
  }}
