// ---------- árboles, palmeras, monte y matas ----------
const HD_TREEPAL=[
 ['#12241f','#183428','#1f4430','#295634','#356a38','#4a803a','#68983e','#8eae48','#b8c45a','#e0d27a'],   // mango (oscuro, denso)
 ['#16281a','#1e3a22','#284c28','#33602e','#427336','#58883e','#73a048','#93b656','#b4ca6a','#d8dc86'],   // árbol de sombra
 ['#1c2a16','#283c1c','#344e22','#426028','#54742e','#6a8a36','#86a240','#a6b84e','#c4cc62','#e0dc80'],   // poró / guarumo claro
].map(p=>p.map(hdC));
const HD_TRUNK=['#24180f','#3a281a','#523a26','#6e5034','#8c6a46','#a88660'].map(hdC);
function hdTreeSprite(seed,kind,s,fruit){
  const W=Math.ceil(104*s),Hc=Math.ceil(82*s),TH=Math.ceil(30*s),H=Hc+TH;const cb=hdBuf(W,H),tb=hdBuf(W,H),pal=HD_TREEPAL[kind];
  const cx0=W/2;const lob=[[0,-20,24,16],[-21,-9,17,14],[21,-9,17,14],[-32,6,13,11],[32,6,13,11],[0,0,30,21],[-12,16,16,10],[12,16,16,10]];
  const mask=new Uint8Array(W*H);const L=lob.map(([dx,dy,rx,ry],i)=>[cx0+dx*s*(.9+hsh(seed,i)*.2),Hc*.52+dy*s*(.9+hsh(i,seed)*.2),rx*s*(.85+hsh(seed+i,3)*.3),ry*s*(.85+hsh(3,seed+i)*.3)]);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){for(const[cx,cy,rx,ry]of L){const u=(x+.5-cx)/rx,v=(y+.5-cy)/ry;if(u*u+v*v<=1){mask[y*W+x]=1;break}}}
  // tronco y ramas (debajo de la copa)
  const tx=cx0+(hsh(seed,9)-.5)*6*s,baseY=H-2;
  for(let y=Math.floor(Hc*.55);y<baseY;y++){const t=(y-Hc*.55)/(baseY-Hc*.55),hw=(3.4+t*2.2+(y>baseY-5?(y-baseY+5)*1.2:0))*s;
    for(let x=Math.floor(tx-hw);x<=tx+hw;x++){const u=(x-(tx-hw))/(2*hw);let k=u<.28?4:u>.72?1:2;if(hsh(x*7,y*13)<.18)k--;if((y+((x/3)|0))%5===0&&k>1)k--;hdP(tb,x,y,HD_TRUNK[Math.max(0,k)])}}
  for(const sg of[-1,1]){let x=tx,y=Hc*.62;for(let i=0;i<14*s;i++){x+=sg*.9;y-=.6;hdR(tb,x,y,2,2,HD_TRUNK[sg<0?3:1])}}
  for(let x=-8*s;x<9*s;x++)hdP(tb,tx+x,baseY+1,HD_TRUNK[0],.5);
  // copa: grupitos de hojas ordenados de arriba hacia abajo
  const pts=[];for(let gy=0;gy<H;gy+=4)for(let gx=0;gx<W;gx+=5){const x=gx+(hsh(seed+gx,gy)-.5)*2.4+((gy/4)&1?2.5:0),y=gy+(hsh(gy,seed+gx)-.5)*2;if(x>=0&&y>=0&&x<W&&y<H&&mask[(y|0)*W+(x|0)])pts.push([y,x])}
  pts.sort((a,c)=>a[0]-c[0]);
  for(const[y,x]of pts){const lit=.72-(y-8*s)/(60*s)*.5-(x-cx0)/(48*s)*.38+(hsh(x*3|0,y*5|0)-.5)*.1+(hdVN(x,y,14,seed)-.5)*.16;const lv=Math.max(0,Math.min(6,Math.floor(lit*7)))+1;
    const rx=3.1+hsh(x|0,y|0)*1.1,ry=2.2+hsh(y|0,x|0)*.7;
    for(let j=-3;j<=3;j++)for(let i=-4;i<=4;i++){const u=(i+.5-(x-(x|0)))/rx,v=(j+.5-(y-(y|0)))/ry;if(u*u+v*v>1)continue;const X=(x|0)+i,Y=(y|0)+j;if(X<0||Y<0||X>=W||Y>=H||!mask[Y*W+X])continue;
      let k=lv;if(v>.5)k=lv-1;if(v>.8)k=lv-2;if(u+v<-.8)k=lv+1;if(u+v<-1.15&&lv>=5)k=lv+2;hdP(cb,X,Y,pal[Math.max(0,Math.min(9,k))])}}
  // hojas sueltas en la silueta
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!mask[y*W+x]||mask[y*W+x-1]&&mask[y*W+x+1]&&mask[(y-1)*W+x]&&mask[(y+1)*W+x])continue;if(hsh(x*11+seed,y*7)>.3)continue;
    const lit=.7-(y-8*s)/(60*s)*.5-(x-cx0)/(48*s)*.38,base=Math.max(1,Math.min(8,Math.floor(lit*7)+1)),dx=x<cx0?-1:1,down=y>Hc*.45,Ln=3+((hsh(x,y)*3)|0);
    for(let t=0;t<Ln;t++){const X=x+(down?(t>=Ln-1?dx:0):dx*(t>>1)),Y=y+(down?t:-(t>>1));hdP(cb,X,Y,pal[Math.max(0,Math.min(9,base+(t===0?1:0)-(t===Ln-1?1:0)))])}}
  if(fruit){const MG=['.ab..','abcc.','bccd.','bccdd','.cdde','..de.'],MC={a:[216,224,112],b:[244,200,74],c:[240,154,58],d:[216,96,42],e:[154,58,36]};
    for(let n=0;n<7+((hsh(seed,4)*5)|0);n++){const fx=(cx0+(hsh(n,seed)-.5)*70*s)|0,fy=(Hc*(.35+hsh(seed,n)*.5))|0;if(!mask[fy*W+fx])continue;
      for(let k=0;k<3;k++)hdP(cb,fx+(k<2?1:0),fy+k,[58,42,26]);MG.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=='.')hdP(cb,fx-1+i,fy+3+j,MC[r[i]])})}}
  return{c:cb,t:tb,w:W,h:H,ax:Math.round(tx),ay:baseY}}
function hdPalmSprite(seed){const W=84,H=124,b=hdBuf(W,H),lean=(hsh(seed,1)-.5)*16,bx=W/2,by=H-3;
  const pts=[];for(let i=0;i<=40;i++){const t=i/40,x=bx+lean*t*t,y=by-t*88;pts.push([x,y])}
  for(let i=0;i<pts.length;i++){const[x,y]=pts[i],hw=3.6-i*.035;for(let X=Math.floor(x-hw);X<=x+hw;X++){const u=(X-(x-hw))/(2*hw);let c=u<.3?[176,150,112]:u>.7?[104,84,62]:[142,118,88];if(i%3===0)c=hdS(c,.8);hdP(b,X,y,c);hdP(b,X,y+1,c)}}
  const top=pts[pts.length-1];const FC=[[34,74,42],[48,98,50],[66,122,58],[92,146,66],[126,170,80]];
  const fr=8+((hsh(seed,2)*3)|0);
  for(let f=0;f<fr;f++){const ang=-Math.PI/2+(f/(fr-1)-.5)*Math.PI*1.9+(hsh(f,seed)-.5)*.25,len=34+hsh(seed,f)*10,droop=.55+hsh(f,seed*2)*.35;
    let px=top[0],py=top[1];for(let t=0;t<len;t++){const k=t/len,a=ang+(Math.cos(ang)>0?1:-1)*droop*k*k*1.6;px+=Math.cos(a);py+=Math.sin(a)+droop*k*.9;
      const lit=Math.cos(a+2.4)>0?3:1;hdP(b,px,py,FC[lit]);hdP(b,px,py+1,FC[lit-1]);
      if(t>4&&t%2===0){const ll=5*(1-k*.6);for(let s=-1;s<=1;s+=2){const la=a+s*1.1+droop*.4;for(let q=1;q<ll;q++)hdP(b,px+Math.cos(la)*q,py+Math.sin(la)*q+q*.35,FC[Math.max(0,Math.min(4,(s<0?lit+1:lit-1)))])}}}}
  for(let n=0;n<4;n++){const cx=top[0]+(n-1.5)*3.2,cy=top[1]+4+(n%2)*2;hdEll(b,cx,cy,2.2,2.2,[110,96,40]);hdP(b,cx-.5,cy-.8,[176,164,80])}
  return{c:b,w:W,h:H,ax:bx,ay:by}}
// arbusto con flores (amapolas/chavelitas) para t7
function hdBush(b,cx,cy,seed,flowers){const G=['#1c2e1e','#26432a','#335a32','#47743c','#62904a','#82aa58','#a6c46e'].map(hdC);const rx=15,ry=10;
  hdEll(b,cx+4,cy+ry*.7,rx+1,ry*.45,[30,40,30],.35);
  const pts=[];for(let i=0;i<110;i++){const x=cx+(hsh(seed,i)-.5)*2*rx,y=cy+(hsh(i,seed)-.5)*2*ry;if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)pts.push([y,x])}pts.sort((a,c)=>a[0]-c[0]);
  for(const[y,x]of pts){const t=(y-(cy-ry))/(2*ry),lit=1-t+(cx-x)/rx*.25+(hsh(x|0,y|0)-.5)*.3;const base=Math.max(0,Math.min(5,Math.round(lit*5.2)));
    for(let j=-1;j<=1;j++)for(let i=-2;i<=1;i++){if((i===-2||i===1)&&j!==0)continue;hdP(b,x+i,y+j,G[Math.max(0,Math.min(6,base-(j>0?1:0)+(i<0&&j<0?1:0)))])}}
  if(flowers)for(let n=0;n<7;n++){const fx=cx+(hsh(n,seed*3)-.5)*rx*1.6,fy=cy+(hsh(seed*3,n)-.5)*ry*1.4,pink=hsh(n,seed)<.5,c1=pink?[244,182,210]:[226,64,64],c2=pink?[252,230,240]:[246,150,126],cc=pink?[200,48,106]:[248,224,112];
    hdP(b,fx,fy-1,c2);hdP(b,fx-1,fy,c1);hdP(b,fx+1,fy,c1);hdP(b,fx,fy+1,c1);hdP(b,fx,fy,cc)}}
// borde del mapa: monte espeso
function hdBorder(b,m){const G=['#14261a','#1b3220','#223e26','#2c4c2c','#385c32','#486e38','#5e8442'].map(hdC);
  const isB=(x,y)=>x===0||y===0||x===m.w-1||y===m.h-1;
  const pts=[];for(let ty=0;ty<m.h;ty++)for(let tx=0;tx<m.w;tx++){if(!isB(tx,ty))continue;for(let n=0;n<7;n++)pts.push([ty*HT+hsh(tx*7+n,ty)*HT,tx*HT+hsh(tx,ty*7+n)*HT])}
  pts.sort((a,c)=>a[0]-c[0]);
  for(const[y,x]of pts){const r=5+hsh(x|0,y|0)*5;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const dd=(i*i+j*j)/(r*r);if(dd>1)continue;const lit=-(i+j)/(2*r);let k=Math.round(2.6+lit*2.6+(hdr((x+i)|0,(y+j)|0)-.5)*1.4);if(dd>.8&&j>0)k-=1;hdP(b,x+i,y+j,G[Math.max(0,Math.min(6,k))])}}}
