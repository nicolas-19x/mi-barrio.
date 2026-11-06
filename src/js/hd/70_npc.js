// ---------- personajes HD (vecinos y gente de la calle) ----------
// Plantillas horneadas (cuerpo de hombre/mujer, 6 peinados, accesorios) en 4 direcciones x 7 cuadros.
// Cada píxel guarda material+tono; aquí se pinta con los colores de cada personaje (el editor sigue funcionando).
const ND_AL='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const ND_MAP=(()=>{const m={};for(let i=0;i<64;i++)m[ND_AL[i]]=i;return m})();
const ND_DEC=[];
function ndDec(i){let a=ND_DEC[i];if(a)return a;const s=NPCD.s[i];a=new Int8Array(NPCD.w*NPCD.h);let p=0;
  for(let k=0;k<s.length;k+=2){const ch=s[k],n=ND_MAP[s[k+1]]+1,v=ch==='.'?-1:ND_MAP[ch];a.fill(v,p,p+n);p+=n}ND_DEC[i]=a;return a}
const ND_SHOES=['#f0ece4','#26262e','#6a4430','#3a5a9a','#8a2a2a','#efe6d8'];
const NPCC=new Map();
function npcSig(c){return[c.id,c.hair,c.hairColor,c.skin,c.shirt,c.pants,c.acc,c.accColor,c.glasses?1:0,c.machete?1:0,c.tattoos?1:0,c.body||''].join('|')}
function npcSex(c){return c.body?c.body:(c.hair==='largo'||c.hair==='moño'||c.hair==='cola')?'f':'m'}
function npcSprite(c,dir,fi){const sig=npcSig(c);let EN=NPCC.get(sig);if(!EN){if(NPCC.size>400)NPCC.clear();EN={f:{},r:null};NPCC.set(sig,EN)}
  dir=dir|0;fi=fi|0;const key=dir*8+fi;let cnv=EN.f[key];if(cnv)return cnv;
  if(!EN.r){let hs=0;for(const ch of String(c.id||c.name||''))hs=(hs*31+ch.charCodeAt(0))|0;const shoe=ND_SHOES[Math.abs(hs)%ND_SHOES.length];
    EN.r=[null,hdRamp(c.skin||'#d9a066'),hdRamp(c.shirt||'#7bb661'),hdRamp(c.pants||'#2d3346'),hdRamp(shoe),hdRamp(c.hairColor||'#2a1810'),hdRamp(c.accColor||'#d64545'),hdRamp('#9aa0a8')]}
  if(npcAri(c)){const cnv2=ariSprite(c,dir,fi,EN);EN.f[key]=cnv2;return cnv2}
  const sx=npcSex(c),D=NPCD.d,W=NPCD.w,H=NPCD.h,codes=Int8Array.from(ndDec(D.b[sx][dir][fi]));
  const ov=i=>{const a=ndDec(i);for(let p=0;p<a.length;p++)if(a[p]>=0)codes[p]=a[p]};
  const A=n=>{if(D.a[n])ov(D.a[n][sx][dir][fi])},acc=c.acc||'ninguno';
  if(D.h[c.hair])ov(D.h[c.hair][sx][dir][fi]);
  if(acc==='aretes')A('aretes');if(acc==='collar')A('collar');if(c.tattoos)A('tattoos');
  if(acc==='lentes')A('lentes');if(acc==='anteojos'||c.glasses)A('anteojos');if(acc==='bigote')A('bigote');if(acc==='barba')A('barba');
  if(c.machete)A('machete');if(acc==='gorra')A('gorra');if(acc==='sombrero')A('sombrero');
  cnv=mk(W,H);const g=cnv.getContext('2d'),im=g.createImageData(W,H),d=im.data,RR=EN.r,FX=NPCD.fix.map(hdC);
  for(let p=0;p<codes.length;p++){const v=codes[p];if(v<0)continue;const col=v<49?RR[((v/7)|0)+1][v%7]:FX[v-49];const o=p<<2;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255}
  g.putImageData(im,0,0);EN.f[key]=cnv;return cnv}
// Ariana tiene modelo propio (tez clara, pelo lacio largo, cadenitas, aretes de cristal); si en el editor
// le cambian peinado o accesorio, vuelve a la plantilla general.
const ARI_DEC=[];
function npcAri(c){return typeof ARID!=='undefined'&&c.id==='ariana'&&c.hair==='largo'&&(!c.acc||c.acc==='aretes'||c.acc==='collar'||c.acc==='ninguno')&&!c.glasses&&!c.tattoos&&!c.machete}
function ariSprite(c,dir,fi,EN){let a=ARI_DEC[dir*8+fi];if(!a){const s=ARID.s[ARID.d[dir][fi]];a=new Int8Array(NPCD.w*NPCD.h);let p=0;
    for(let k=0;k<s.length;k+=2){const ch=s[k],n=ND_MAP[s[k+1]]+1,v=ch==='.'?-1:ND_MAP[ch];a.fill(v,p,p+n);p+=n}ARI_DEC[dir*8+fi]=a}
  const W=NPCD.w,H=NPCD.h,cnv=mk(W,H),g=cnv.getContext('2d'),im=g.createImageData(W,H),d=im.data,RR=EN.r.slice(),FX=ARID.fix.map(hdC);RR[4]=hdRamp('#f0ece4');
  for(let p=0;p<a.length;p++){const v=a[p];if(v<0)continue;const col=v<49?RR[((v/7)|0)+1][v%7]:FX[v-49];const o=p<<2;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255}
  g.putImageData(im,0,0);return cnv}
function npcTick(e){if(e===P||(!e.c&&e.kind!=='animal'))return;const px=e._px,py=e._py;e._px=e.x;e._py=e.y;if(px===undefined)return;const d=Math.hypot(e.x-px,e.y-py);
  if(d>.01&&d<24&&!e.talking){e.hf=(e.hf||0)+d/(e.kind==='animal'?(e.type==='hen'?7:12)*4:28)*(e.kind==='animal'?4:6);e._st=0}else e._st=(e._st||0)+1}
function npcFrame(e){return(e._st||0)<5?Math.floor(e.hf||0)%6:6}
function npcDraw(e){if(!e.c)return null;return{img:npcSprite(e.c,e.dir||0,npcFrame(e)),x:-9,y:-27,w:18,h:29}}
// dibuja la versión HD en el rectángulo que ocupaba el sprite viejo (18x26), para escenas especiales
function hdCharImg(c,dir,fi){return(c===CH.player||c.id==='player')?heroSprite(dir,fi,c.shirt):npcSprite(c,dir,fi)}
function drawCharAt(g,c,dir,fr,x,y,w,h){if(!HD_ON){g.drawImage(sprite(c,dir,fr),x,y,w,h);return}const fi=fr===1?1:fr===2?4:6;g.drawImage(hdCharImg(c,dir|0,fi),x,y-h*2/26,w,h*29/26)}
