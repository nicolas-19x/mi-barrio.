// ================= ESTILO B · RENDER HD (32 px por casilla) =================
// El mundo sigue en unidades de 16 px (T); lo que se pinta va al doble de resolución (HT=32) en m.base2/m.top2.
// Todo se pinta con código sobre un búfer de píxeles (rápido) y luego se sube a un lienzo.
const HDK=2,HT=T*HDK;
let HD_ON=true;
function hdBuf(w,h){return{w,h,d:new Uint8ClampedArray(w*h*4)}}
const hdCc={};function hdC(h){let c=hdCc[h];if(c)return c;const n=parseInt(h.slice(1),16);c=hdCc[h]=[n>>16&255,n>>8&255,n&255];return c}
function hdP(b,x,y,c,a){x|=0;y|=0;if(x<0||y<0||x>=b.w||y>=b.h)return;const i=(y*b.w+x)<<2,d=b.d;
  if(a===undefined||a>=1){d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255;return}
  if(a<=0)return;if(d[i+3]===0){d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=a*255;return}
  d[i]+=(c[0]-d[i])*a;d[i+1]+=(c[1]-d[i+1])*a;d[i+2]+=(c[2]-d[i+2])*a;if(d[i+3]<255)d[i+3]=Math.min(255,d[i+3]+a*255)}
function hdR(b,x,y,w,h,c,a){x|=0;y|=0;for(let j=0;j<h;j++)for(let i=0;i<w;i++)hdP(b,x+i,y+j,c,a)}
function hdM(b,x,y,w,h,f){x|=0;y|=0;const fr=f[0],fg=f[1],fb=f[2];for(let j=0;j<h;j++){const Y=y+j;if(Y<0||Y>=b.h)continue;for(let i=0;i<w;i++){const X=x+i;if(X<0||X>=b.w)continue;const k=(Y*b.w+X)<<2,d=b.d;if(!d[k+3])continue;d[k]*=fr;d[k+1]*=fg;d[k+2]*=fb}}}
function hdMP(b,x,y,f){hdM(b,x,y,1,1,f)}
const hdS=(c,f)=>[Math.min(255,c[0]*f),Math.min(255,c[1]*f),Math.min(255,c[2]*f)];
const hdMix=(a,c,t)=>[a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t,a[2]+(c[2]-a[2])*t];
// ramp of n tones from a base colour: shadows cooler/purple, lights warmer (same recipe as the mockups)
function hdRamp(hex,n){const b=typeof hex==='string'?hdC(hex):hex,out=[];n=n||7;
  for(let i=0;i<n;i++){const f=.42+(1.38-.42)*i/(n-1);let r=b[0]*f,g=b[1]*f,bl=b[2]*f;
    if(f>1){const k=(f-1)*.55;r+=(255-r)*k;g+=(255-g)*k;bl+=(255-bl)*k;r*=1.03;bl*=.95}else{r*=.97;g*=.96;bl*=1.05}
    out.push([Math.min(255,r),Math.min(255,g),Math.min(255,bl)])}return out}
// fast deterministic noise tables (period 256 px), plus smooth value noise
const HDN=(()=>{const n=new Float32Array(65536);let s=1234567;for(let i=0;i<65536;i++){s=(s*1103515245+12345)&0x7fffffff;n[i]=s/0x7fffffff}return n})();
const hdr=(x,y)=>HDN[(((y+((x>>8)*53))&255)<<8)|((x+((y>>8)*97))&255)];
function hdVN(x,y,s,seed){const fx0=x/s,fy0=y/s,X=Math.floor(fx0),Y=Math.floor(fy0),fx=fx0-X,fy=fy0-Y,ox=(seed*17)&255,oy=(seed*31)&255;
  const x0=(X+ox)&255,x1=(X+1+ox)&255,y0=((Y+oy)&255)<<8,y1=((Y+1+oy)&255)<<8;const a=HDN[y0|x0],b=HDN[y0|x1],c=HDN[y1|x0],d=HDN[y1|x1];
  const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy}
function hdEll(b,cx,cy,rx,ry,c,a){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const u=(x+.5-cx)/rx,v=(y+.5-cy)/ry;if(u*u+v*v<=1)hdP(b,x,y,c,a)}}
function hdLine(b,x0,y0,x1,y1,c,a,w){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));w=w||1;
  for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;for(let k=0;k<w;k++)hdP(b,x+(w>1&&Math.abs(y1-y0)>Math.abs(x1-x0)?k:0),y+(w>1&&Math.abs(y1-y0)<=Math.abs(x1-x0)?k:0),c,a)}}
function hdToCanvas(b){const c=mk(b.w,b.h),g=c.getContext('2d');g.putImageData(new ImageData(b.d,b.w,b.h),0,0);return c}
// paint a small buffer-made sprite onto a buffer
function hdBlit(dst,src,ox,oy){ox|=0;oy|=0;for(let y=0;y<src.h;y++){const Y=oy+y;if(Y<0||Y>=dst.h)continue;for(let x=0;x<src.w;x++){const X=ox+x;if(X<0||X>=dst.w)continue;const s=(y*src.w+x)<<2,a=src.d[s+3];if(!a)continue;const k=(Y*dst.w+X)<<2,d=dst.d;
  if(a===255){d[k]=src.d[s];d[k+1]=src.d[s+1];d[k+2]=src.d[s+2];d[k+3]=255}else{const t=a/255;d[k]+=(src.d[s]-d[k])*t;d[k+1]+=(src.d[s+1]-d[k+1])*t;d[k+2]+=(src.d[s+2]-d[k+2])*t;d[k+3]=Math.max(d[k+3],a)}}}}
// 5x7 pixel font for signs (HD resolution)
const HDF={'A':'.###.#...##...#######...##...##...#','B':'####.#...##...#####.#...##...#####.','C':'.###.#...##....#....#....#...#.###.','D':'####.#...##...##...##...##...#####.','E':'######....#....####.#....#....#####','F':'######....#....####.#....#....#....','G':'.###.#...##....#.####...##...#.####','H':'#...##...##...#######...##...##...#','I':'###.#..#..#..#..#.###','J':'..###...#....#....#.#..#.#..#..##..','K':'#...##..#.#.#..##...#.#..#..#.#...#','L':'#....#....#....#....#....#....#####','M':'#...###.###.#.##.#.##...##...##...#','N':'#...###..###..##.#.##..###..###...#','O':'.###.#...##...##...##...##...#.###.','P':'####.#...##...#####.#....#....#....','Q':'.###.#...##...##...##.#.##..#..##.#','R':'####.#...##...#####.#.#..#..#.#...#','S':'.###.#...##.....###.....##...#.###.','T':'#####..#....#....#....#....#....#..','U':'#...##...##...##...##...##...#.###.','V':'#...##...##...##...##...#.#.#...#..','W':'#...##...##...##.#.##.#.##.#.#.#.#.','X':'#...##...#.#.#...#...#.#.#...##...#','Y':'#...##...#.#.#...#....#....#....#..','Z':'#####....#...#...#...#...#....#####','0':'.###.#...##..###.#.###..##...#.###.','1':'.#.##..#..#..#..#.###','2':'.###.#...#....#...#...#...#...#####','3':'####.....#....#.###.....#....#####.','4':'...#...##..#.#.#..#.#####...#....#.','5':'######....####.....#....##...#.###.','6':'.###.#....#....####.#...##...#.###.','7':'#####....#...#...#...#....#....#...','8':'.###.#...##...#.###.#...##...#.###.','9':'.###.#...##...#.####....#....#.###.',' ':'..............','.':'......#',',':'.....##','-':'.........###.........','!':'#####.#','¡':'#.#####','₡':'..#.#.#####.#..#.#..#.#...####..#.#','&':'.##..#..#..##...##.##..#.#..#..##.#','\'':'##.....',':':'.#...#.','/':'....#...#....#...#...#....#...#....','%':'##..###.#....#...#...#....#.###..##','+':'.......#....#..#####..#....#.......','?':'.###.#...#....#...#...#.........#..'};
const HDFW={'I':3,'1':3,' ':2,'.':1,',':1,'-':3,'!':1,'¡':1,'\'':1,':':1};
function hdTextW(s){s=s.toUpperCase();let w=0;for(const ch of s){const k=ch.normalize('NFD')[0];w+=(HDFW[k]||5)+1}return w-1}
function hdText(b,x,y,s,c,shadow,tight){s=s.toUpperCase();let cx=x|0;for(const ch of s){const acc=ch!==ch.normalize('NFD')[0]||ch==='Ñ';const k=ch==='Ñ'?'N':ch.normalize('NFD')[0];const g=HDF[k]||HDF[' '];const w=HDFW[k]||5;
  for(let i=0;i<g.length;i++)if(g[i]==='#'){const gx=cx+i%w,gy=y+((i/w)|0);if(shadow)hdP(b,gx+1,gy+1,shadow);hdP(b,gx,gy,c)}
  if(acc){if(ch==='Ñ'){hdP(b,cx+1,y-2,c);hdP(b,cx+2,y-3,c);hdP(b,cx+3,y-2,c)}else if(tight){hdP(b,cx+(w>>1)+1,y-1,c);hdP(b,cx+(w>>1),y-1,c)}else{hdP(b,cx+(w>>1)+1,y-3,c);hdP(b,cx+(w>>1),y-2,c)}}
  cx+=w+1}}
