// ---------- animales HD (perros, gatos, gallina, cadejos) ----------
const ANIC=new Map();
function aniSprite(type,col,fi,flip){const key=type+'|'+col+'|'+fi+'|'+(flip?1:0);let c=ANIC.get(key);if(c)return c;
  const TT=ANID[type]||ANID.dog,W=TT.w,H=TT.h,s=TT.f[fi]||TT.f[0];
  const fur=hdRamp(col||'#c8a165'),mark=hdRamp(type==='cadejos'?'#2a2228':type==='hen'?'#fbf6ee':'#f2ece0'),FX=ANID.fix.map(hdC);
  c=mk(W,H);const g=c.getContext('2d'),im=g.createImageData(W,H),d=im.data;let p=0;
  for(let k=0;k<s.length;k+=2){const ch=s[k],n=ND_MAP[s[k+1]]+1;if(ch!=='.'){const v=ND_MAP[ch],col2=v<7?fur[v]:v<14?mark[v-7]:FX[v-14];
      for(let j=0;j<n;j++){const q=p+j,x=q%W,y=(q/W)|0,o=((y*W)+(flip?W-1-x:x))<<2;d[o]=col2[0];d[o+1]=col2[1];d[o+2]=col2[2];d[o+3]=255}}p+=n}
  g.putImageData(im,0,0);ANIC.set(key,c);return c}
function aniDraw(e){const mv=(e._st||0)<5,fi=mv?Math.floor(e.hf||0)%4:4;const s=aniSprite(e.type,e.col,fi,e.dir===2);return{img:s,x:-Math.round(s.width/4),y:-Math.round(s.height/2)+1,w:s.width/2,h:s.height/2}}
