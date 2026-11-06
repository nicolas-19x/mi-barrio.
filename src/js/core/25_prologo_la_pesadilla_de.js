// ================= PRÓLOGO: «La pesadilla de la Ruta 27» · pixel art =================
const PRO_SEEN='mibarrio_prologo_v1';
let PRO=null;
const PSP={};
function pCan(w,h,fn){const c=mk(w,h),g=c.getContext('2d');g.imageSmoothingEnabled=false;fn(g,(col,x,y,ww,hh)=>{g.fillStyle=col;g.fillRect(x,y,ww||1,hh||1)});return c}
function pRng(s){s=(s|0)%2147483647;if(s<=0)s+=2147483646;return()=>{s=s*16807%2147483647;return(s-1)/2147483646}}
// contorno oscuro de 1 px (el lienzo trae 1 px de margen)
function pOut(c,col){col=col||'#0b0910';const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data,o=mk(w,h),g=o.getContext('2d');g.fillStyle=col;
 const A=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&d[(y*w+x)*4+3]>60;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!A(x,y)&&(A(x-1,y)||A(x+1,y)||A(x,y-1)||A(x,y+1)))g.fillRect(x,y,1,1);
 g.drawImage(c,0,0);o.mw=c.mw;o.lit=c.lit;o.lights=c.lights;o.big=c.big;return o}
// versión oscurecida/teñida por la neblina (se guarda en caché por nivel)
function pDim(c,a,col){const q=Math.max(0,Math.min(10,Math.round(a*10)));if(!q)return c;c._d=c._d||{};const k=col+q;if(c._d[k])return c._d[k];
 const o=mk(c.width,c.height),g=o.getContext('2d');g.drawImage(c,0,0);g.globalCompositeOperation='source-atop';g.globalAlpha=q/10;g.fillStyle=col;g.fillRect(0,0,o.width,o.height);return c._d[k]=o}
// línea de píxeles (Bresenham) con grosor
function pLine(g,x0,y0,x1,y1,col,t){g.fillStyle=col;t=t||1;x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;
 for(;;){g.fillRect(x0-(t>>1),y0-(t>>1),t,t);if(x0===x1&&y0===y1||n++>2000)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function pDisk(p,cx,cy,r,fn){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.6)fn(cx+x,cy+y,x,y)}

// ---------- árboles de monte, platanillo y caña ----------
function sprTree(v){const c=pCan(34,46,(g,p)=>{const r=pRng(11+v*977);
 p('#24170f',16,28,3,17);p('#3a2617',16,28,1,17);p('#24170f',13,43,9,2);
 const blobs=v===1?[[17,16,12],[9,22,7],[25,21,8],[17,27,7],[12,10,6]]:v===2?[[17,12,8],[11,19,8],[23,18,8],[17,24,9],[10,28,5],[24,29,5]]:[[17,15,11],[8,22,7],[26,20,7],[17,26,8],[11,8,6],[22,8,6]];
 for(const[cx,cy,rr]of blobs)pDisk(p,cx,cy,rr,(x,y,dx,dy)=>{const n=r(),lit=dx+dy<-rr*.5,mid=dx+dy<rr*.1;p(lit?(n<.45?'#3f7a3a':'#356b33'):mid?(n<.35?'#264d2a':'#2d5a2f'):(n<.5?'#173320':'#1c3b24'),x,y)});
 for(let i=0;i<40;i++){const x=3+(r()*28)|0,y=3+(r()*28)|0;if(r()<.5)p('#4c8a43',x,y)}});c.mw=6.5;return pOut(c,'#081008')}
function sprPlatano(){const c=pCan(30,40,(g,p)=>{p('#3d5a2a',14,18,3,22);p('#53733a',14,18,1,22);
 const leaf=(x0,y0,dx,dy,n)=>{for(let i=0;i<n;i++){const x=x0+dx*i,y=y0+dy*i+(i*i)/(n*1.4);p('#2f6b2c',Math.round(x),Math.round(y),3,2);p('#4a9a3c',Math.round(x),Math.round(y),2,1);if(i%3===1)p('#173a1b',Math.round(x)+1,Math.round(y)+2)}};
 leaf(15,18,-1.1,-1.1,12);leaf(16,18,1.1,-1.2,12);leaf(15,17,-1.3,-.2,11);leaf(16,17,1.3,-.3,11);leaf(15,16,0,-1.4,10);
 p('#6a3a2a',17,24,3,4);p('#8a4a30',17,24,1,3)});c.mw=4;return pOut(c,'#081008')}
function sprCana(){const c=pCan(26,44,(g,p)=>{const r=pRng(5);for(let i=0;i<7;i++){const x=4+i*3+(r()*2|0),h=24+(r()*16|0);for(let y=43-h;y<43;y++){p(i%2?'#5f8a3a':'#6f9a42',x,y);if(y%6===0)p('#3f5f28',x,y)}
  p('#4f7f34',x-2,43-h,2,1);p('#4f7f34',x+1,44-h,2,1)}});c.mw=3;return pOut(c,'#081008')}

// ---------- poste de concreto (y el del barrio, con enredo de cables y tenis colgando) ----------
function sprPoste(barrio){const c=pCan(26,92,(g,p)=>{
 for(let y=6;y<91;y++){const w=y<20?3:4;p('#8e8b86',12,y,w);p('#b1aea8',12,y,1);p('#6d6a66',12+w-1,y,1);if(y%11===0)p('#77736e',12,y,w)}
 p('#5b5a58',3,10,20,2);p('#7d7b77',3,10,20,1);[4,10,17,21].forEach(x=>{p('#d9d3c4',x,7,2,3);p('#a8a294',x+1,7,1,3)});
 p('#3e3c3a',6,14,14,1);
 if(barrio){p('#565a5e',15,22,7,11);p('#7c8186',15,22,2,11);p('#3c3f42',20,22,2,11);p('#2c2e30',15,21,7,1);p('#2c2e30',15,33,7,1);
  const r=pRng(77);for(let i=0;i<55;i++){const a=r()*6.28,rr=2+r()*5;p(r()<.5?'#111015':'#1f1d24',13+Math.round(Math.cos(a)*rr*1.6),40+Math.round(Math.sin(a)*rr),1,1)}
  for(let x=0;x<26;x++){p('#141217',x,13+Math.round(Math.sin(x*.35)*1+x*.08),1,1);p('#141217',x,36+Math.round(Math.abs(x-13)*-.15+2),1,1)}
  p('#141217',7,36,1,12);p('#f2f2ee',5,48,3,3);p('#d64545',5,51,4,1);p('#141217',9,36,1,9);p('#f2f2ee',8,45,3,3);p('#d64545',8,48,4,1);
  p('#d0c040',13,60,5,7);p('#1d1a24',14,62,3,1);p('#1d1a24',14,64,2,1)}
 else{p('#e9e3d2',12,58,4,3);p('#1d1a24',13,59,2,1)}});c.mw=1.15;return pOut(c,'#0b0a0e')}
function sprPostito(){const c=pCan(5,14,(g,p)=>{p('#e8e6e0',1,2,3,12);p('#ffffff',1,2,1,12);p('#b9b6ae',3,2,1,12)});c.mw=.22;
 c.lit=pCan(5,14,(g,p)=>{p('#ff3b2f',1,3,3,2);p('#ffd0c0',1,3,1,1)});return pOut(c,'#151318')}
// ---------- rótulos ----------
function sprSign(lines,bg,fg,w){bg=bg||'#1f6b3a';fg=fg||'#f4f2e8';w=w||64;const h=10+lines.length*9;const c=pCan(w+2,h+30,(g,p)=>{
 p('#77736e',8,h,3,30);p('#9e9a94',8,h,1,30);p('#77736e',w-9,h,3,30);p('#9e9a94',w-9,h,1,30);
 p(bg,1,1,w,h);p(fg,3,3,w-4,1);p(fg,3,h-2,w-4,1);p(fg,3,3,1,h-4);p(fg,w-2,3,1,h-4);
 const sh=shade(bg,-.25);for(let i=0;i<w;i+=7)p(sh,1+i,1,1,h);
 lines.forEach((t,i)=>cText(g,t,1+w/2,6+i*9,5,fg))});c.mw=w/14;return pOut(c,'#0b0a0e')}

// ---------- vehículos ----------
function sprTrailer(){const W=42,H=50;const c=pCan(W,H,(g,p)=>{
 p('#cfd2d4',1,1,40,36);for(let x=3;x<40;x+=4)p('#b6babd',x,2,1,34);p('#e6e8e9',1,1,40,2);
 p('#8f9497',20,3,2,33);p('#5f6366',20,3,1,33);[9,31].forEach(x=>{p('#6c7174',x,8,2,24);for(let y=10;y<30;y+=6)p('#4d5154',x-1,y,4,2)});
 p('#7a7f82',1,37,40,3);p('#2b2b2e',1,40,40,4);p('#3e3f42',1,40,40,1);
 p('#1a1a1c',3,44,8,6);p('#1a1a1c',31,44,8,6);p('#26262a',4,44,6,1);p('#26262a',32,44,6,1);
 p('#c62b2b',4,37,5,3);p('#c62b2b',33,37,5,3);p('#e8b030',10,38,3,2);p('#e8b030',29,38,3,2);
 p('#e9e3c8',16,41,10,4);p('#1d1a24',17,42,3,1);p('#1d1a24',21,42,4,1);p('#1d1a24',17,43,8,1);
 p('#1d1d20',2,46,1,4);p('#1d1d20',39,46,1,4);p('#262628',2,45,9,1)});c.mw=2.7;
 c.lit=pCan(W,H,(g,p)=>{p('#ff3a2a',4,37,5,3);p('#ff9a80',5,37,2,1);p('#ff3a2a',33,37,5,3);p('#ff9a80',34,37,2,1);p('#ffb43a',10,38,3,2);p('#ffb43a',29,38,3,2);p('#ffe9a8',17,41,8,1)});
 c.lights=[[6.5,38.5,'#ff3a2a'],[35.5,38.5,'#ff3a2a']];return pOut(c,'#0b0a0e')}
function sprCarBack(col){col=col||'#7a2a2a';const c=pCan(32,22,(g,p)=>{
 p(shade(col,-.2),3,2,26,7);p('#1b2230',6,3,20,5);p('#2c3648',6,3,20,1);p(col,1,9,30,8);p(shade(col,.15),1,9,30,1);
 p('#9fa3a6',1,15,30,2);p('#c0283a',2,10,6,3);p('#c0283a',24,10,6,3);p('#e9e3c8',12,12,8,3);p('#1d1a24',13,13,6,1);
 p('#141416',3,17,6,4);p('#141416',23,17,6,4);p('#232326',4,17,4,1)});c.mw=1.8;
 c.lit=pCan(32,22,(g,p)=>{p('#ff3a2a',2,10,6,3);p('#ffb0a0',3,10,3,1);p('#ff3a2a',24,10,6,3);p('#ffb0a0',25,10,3,1)});c.lights=[[5,11.5,'#ff3a2a'],[27,11.5,'#ff3a2a']];return pOut(c,'#0b0a0e')}
function sprCarFront(col){col=col||'#c9c4b8';const c=pCan(32,22,(g,p)=>{
 p(shade(col,-.25),4,2,24,7);p('#2a3a52',6,3,20,5);p('#4a6082',6,3,6,1);p(col,1,9,30,8);p(shade(col,.2),1,9,30,1);
 p('#2a2a2e',9,12,14,3);for(let x=10;x<22;x+=2)p('#4a4a50',x,12,1,3);p('#f6f2d0',2,10,6,3);p('#f6f2d0',24,10,6,3);p('#8e9296',1,15,30,2);
 p('#141416',3,17,6,4);p('#141416',23,17,6,4)});c.mw=1.8;
 c.lit=pCan(32,22,(g,p)=>{p('#fffbe0',2,10,6,3);p('#fffbe0',24,10,6,3)});c.lights=[[5,11.5,'#fff6c8'],[27,11.5,'#fff6c8']];c.big=1;return pOut(c,'#0b0a0e')}
function sprBus(){const W=58;const c=pCan(W,46,(g,p)=>{
 p('#e8e2cf',1,4,W-2,36);p('#d64545',1,26,W-2,4);p('#f2b632',1,30,W-2,2);p('#cfc8b2',1,4,W-2,1);
 p('#151a22',4,1,W-8,7);cText(g,'BARRIO-CHEPE',W/2,2,5,'#ffb43a');
 p('#1b2532',3,9,W-6,16);p('#2a3a50',3,9,W-6,2);p('#5d6e86',4,10,10,1);
 const r=pRng(33);for(let i=0;i<12;i++){const x=5+i*4|0,y=14+(i%3===1?2:0)+(r()*2|0);p('#0b0d12',x,y,3,4);p('#0b0d12',x-1,y+3,5,7)}
 p('#55585c',W/2-1,9,2,16);p('#151515',4,32,W-8,4);for(let x=6;x<W-5;x+=3)p('#2a2a2c',x,33,2,2);
 p('#f6f2d0',3,36,8,3);p('#f6f2d0',W-11,36,8,3);p('#ffb43a',12,37,2,2);p('#ffb43a',W-14,37,2,2);p('#9aa0a6',1,39,W-2,2);p('#e9e3c8',W/2-6,35,12,3);p('#1d1a24',W/2-5,36,10,1);
 p('#141416',5,41,9,5);p('#141416',W-14,41,9,5)});c.mw=2.6;
 c.lit=pCan(W,46,(g,p)=>{cText(g,'BARRIO-CHEPE',W/2,2,5,'#ffcf60');p('#fffbe0',3,36,8,3);p('#fffbe0',W-11,36,8,3);p('#ffcf60',12,37,2,2);p('#ffcf60',W-14,37,2,2);
  for(let i=0;i<12;i++){const x=5+i*4|0,y=14+(i%3===1?2:0);p('#dfe8ff',x,y+1,1,1);p('#dfe8ff',x+2,y+1,1,1)}});c.lights=[[7,37.5,'#fff6c8'],[W-7,37.5,'#fff6c8']];c.big=1;return pOut(c,'#0b0a0e')}

// ---------- peaje: techo, caseta con barra, interior ----------
function sprPeajeTecho(){const c=pCan(162,26,(g,p)=>{p('#2d3036',1,4,160,14);p('#454a52',1,4,160,2);p('#1d2024',1,16,160,2);
 p('#e9e3c8',56,6,50,9);cText(g,'PEAJE',81,8,5,'#1d1a24');p('#c8102e',57,6,48,1);
 for(let x=8;x<160;x+=18){p('#f4e8a0',x,18,6,2)}p('#55585c',2,18,4,8);p('#55585c',156,18,4,8)});c.mw=19;
 c.lit=pCan(162,26,(g,p)=>{for(let x=8;x<160;x+=18){p('#fff6c0',x,18,6,2)}});return pOut(c,'#0b0a0e')}
function sprCaseta(lit,up){const c=pCan(64,52,(g,p)=>{
 p('#d9d4c6',1,10,24,40);p('#ece8dc',1,10,24,1);p('#b8b2a2',22,10,3,40);p('#bfbab0',1,34,24,16);for(let y=36;y<50;y+=3)p('#a9a395',1,y,24,1);
 p('#2b2e34',0,6,26,5);p('#3f444c',0,6,26,1);p('#f2b632',0,11,26,2);for(let x=0;x<26;x+=6)p('#1d1a24',x,11,3,2);
 g.clearRect(4,16,17,15);p('#8e9398',3,15,19,1);p('#8e9398',3,15,1,17);p('#8e9398',21,15,1,17);p('#8e9398',3,31,19,1);
 if(!lit){p('#14161b',4,16,17,15);p('#232731',5,17,4,1)}
 p('#c8102e',20,40,4,4);p('#2b2b2e',22,38,4,7);
 if(up){for(let i=0;i<34;i++){p(Math.floor(i/4)%2?'#c8102e':'#f4f2e8',24,38-i,2,1)}}
 else{for(let x=0;x<38;x++){p(Math.floor(x/5)%2?'#c8102e':'#f4f2e8',25+x,40,1,2)}p('#2b2b2e',62,39,2,4)}});c.mw=5;
 c.lit=pCan(64,52,(g,p)=>{if(lit){p('#ffd27a',3,15,1,17);p('#ffd27a',21,15,1,17);p('#ffd27a',3,15,19,1);p('#ffd27a',3,31,19,1)}});return pOut(c,'#0b0a0e')}
function sprCasetaIn(){const c=pCan(22,20,(g,p)=>{p('#f1c46a',1,1,20,18);p('#ffe2a0',1,1,20,4);p('#d9a24e',1,15,20,4);p('#7a5a30',14,4,5,6);p('#d64545',3,6,4,3)});c.mw=1.6;c.lit=c;return c}

// ---------- el barrio que se mete en la carretera ----------
function sprChino(){const c=pCan(64,46,(g,p)=>{
 p('#a3141f',1,8,62,20);p('#d4202c',1,8,62,2);p('#6e0c14',1,26,62,2);
 cText(g,'SUPER',22,11,9,'#ffd23a');cText(g,'ECONOMICO',22,22,5,'#ffe78a');
 p('#ffd23a',47,11,13,13);p('#a3141f',49,13,9,9);p('#ffd23a',51,15,5,1);p('#ffd23a',51,17,5,1);p('#ffd23a',53,15,1,5);p('#ffd23a',51,19,5,1);
 [6,22,40,56].forEach((x,i)=>{p('#1d1a24',x+2,28,1,4);p('#d4202c',x,32,6,8);p('#ff4a3a',x,33,6,1);p('#ffd23a',x,32,6,1);p('#ffd23a',x,39,6,1);p('#ffd23a',x+2,40,2,3)})});c.mw=7;
 c.lit=pCan(64,46,(g,p)=>{cText(g,'SUPER',22,11,9,'#fff07a');cText(g,'ECONOMICO',22,22,5,'#fff3b0');[6,22,40,56].forEach(x=>{p('#ff6a50',x+1,33,4,5)})});c.lights=[[9,36,'#ff4a2a'],[25,36,'#ff4a2a'],[43,36,'#ff4a2a'],[59,36,'#ff4a2a'],[22,16,'#ffd23a']];return pOut(c,'#1a0508')}
function sprGallo(fr){const c=pCan(20,20,(g,p)=>{const l=fr?1:0;
 p('#1d2a5a',2,6,4,7);p('#2d3f8a',3,5,3,3);p('#7a1e12',6,7,8,7);p('#a8341c',7,7,6,2);p('#c8582a',10,4,5,5);p('#e07a34',11,4,3,2);
 p('#d6221e',11,1,4,3);p('#ff4a3a',12,1,1,1);p('#e8b030',15,6,3,1);p('#d6221e',13,9,2,2);p('#1d1a24',13,5,1,1);p('#2a5a2a',2,9,3,4);
 p('#e8b030',8+l,14,1,5);p('#e8b030',11-l,14,1,5);p('#e8b030',7+l,18,3,1);p('#e8b030',10-l,18,3,1)});c.mw=.85;return pOut(c,'#0b0a0e')}
function sprPerro(fr){const c=pCan(26,18,(g,p)=>{const l=fr?1:0,col='#b07a42',dk='#7a5228';
 p(col,4,6,14,6);p(shade(col,.15),4,6,14,1);p(col,17,3,6,6);p(dk,17,2,2,4);p('#1d1a24',21,5,1,1);p('#1d1a24',23,6,1,1);p(dk,22,7,2,1);
 p(col,1,4,3,2);p(col,3,5,2,2);p(dk,5,11,3,1);p(col,5+l,12,2,5);p(col,9-l,12,2,5);p(col,13+l,12,2,5);p(col,16-l,12,2,5);
 p('#e8d8b8',10,9,5,2)});c.mw=1.3;return pOut(c,'#0b0a0e')}
function sprCarretillo(){const c=pCan(32,24,(g,p)=>{
 p('#2a4a8a',2,8,24,9);p('#3a62b0',2,8,24,2);p('#1a3060',2,15,24,2);p('#6a4a2a',26,11,6,2);
 const fr=[['#f2b632',4],['#e05a2a',8],['#7bb661',12],['#f2b632',16],['#c8102e',20]];fr.forEach(([cl,x],i)=>{p(cl,x,5-(i%2),4,4);p(shade(cl,.3),x,5-(i%2),2,1)});
 p('#8a6a3a',13,1,4,4);p('#5a8a2a',13,0,1,2);p('#5a8a2a',16,0,1,2);
 pDisk(p,8,19,3,(x,y,dx,dy)=>p(dx*dx+dy*dy<3?'#7a7a7a':'#1d1d20',x,y));p('#4a4a4a',20,17,2,6)});c.mw=2.2;return pOut(c,'#0b0a0e')}
function sprSillon(){const c=pCan(34,22,(g,p)=>{const r=pRng(9);
 p('#7a3a5a',3,2,28,9);p('#8a4a6a',3,2,28,2);p('#7a3a5a',1,8,4,10);p('#7a3a5a',29,8,4,10);p('#6a2e4c',5,11,24,6);p('#8a4a6a',5,11,24,1);
 for(let i=0;i<26;i++){const x=4+(r()*26|0),y=3+(r()*13|0);p(r()<.5?'#e8b030':'#f193b4',x,y)}
 p('#f2e8c8',18,5,6,4);p('#e0d4a8',19,6,4,2);p('#3a2416',3,18,2,4);p('#3a2416',29,18,2,4)});c.mw=2.6;return pOut(c,'#0b0a0e')}
function sprTapia(txt,sub){const W=170,H=56;const c=pCan(W,H,(g,p)=>{const r=pRng(21);
 p('#9a958c',1,8,W-2,H-9);
 for(let row=0;row<8;row++){const y=8+row*6,off=row%2?8:0;p('#7d786f',1,y,W-2,1);for(let x=off;x<W;x+=16)p('#7d786f',x,y,1,6)}
 for(let i=0;i<140;i++){const x=1+(r()*(W-3)|0),y=9+(r()*(H-11)|0);p(r()<.6?'#8a857c':'#a8a39a',x,y)}
 for(let i=0;i<9;i++){const x=6+(r()*(W-14)|0);for(let y=40+(r()*6|0);y<H-1;y++)p('#5d5a50',x,y,2,1)}
 p('#6e6a62',1,6,W-2,3);
 for(let x=2;x<W-2;x+=6){for(let a=0;a<12;a++){const px=x+Math.round(Math.cos(a*.52)*3),py=3+Math.round(Math.sin(a*.52)*2.5);p('#b9bcc0',px,py)}}
 const t=mk(4*txt.length+2,8),tg=t.getContext('2d');cText(tg,txt,t.width/2,1,5,'#d01c1c');
 const sc=Math.min(4,Math.floor((W-24)/t.width)),tw=t.width*sc,tx=(W-tw)>>1,ty=sub?12:15;g.drawImage(t,0,0,t.width,8,tx,ty,tw,8*sc);
 for(let i=0;i<22;i++){const x=tx+(r()*tw|0),y0=ty+5*sc;if(r()<.7)p('#a81414',x,y0,1,2+(r()*7|0))}
 if(sub){const s2=mk(4*sub.length+2,8),sg=s2.getContext('2d');cText(sg,sub,s2.width/2,1,5,'#f4f2e8');g.drawImage(s2,0,0,s2.width,8,(W-s2.width*2)>>1,ty+5*sc+6,s2.width*2,16)}
 p('#3a5a2a',2,H-6,10,5);p('#4a7a32',4,H-8,6,3);p('#3a5a2a',W-14,H-5,12,4)});c.mw=17;return pOut(c,'#0b0a0e')}
// persona del juego (sprite de 18x26) con la mano levantada si toca
function sprPersona(ch,wave){const s=sprite(ch,0,0),c=mk(20,30),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(s,1,3);
 if(wave){const p=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w||1,h||1)};p('#1d1a24',14,1,4,13);p(ch.shirt,15,7,2,7);p(ch.skin,15,2,2,5);p(shade(ch.skin,-.2),16,3,1,4)}
 c.mw=1.3;return c}
function sprHumo(){const c=pCan(14,12,(g,p)=>{pDisk(p,6,6,4,(x,y,dx,dy)=>p(dx+dy<-1?'#c9c4d4':'#9e98ab',x,y));pDisk(p,10,5,3,(x,y,dx,dy)=>p(dx+dy<0?'#c9c4d4':'#9e98ab',x,y))});c.mw=.5;return c}

// ---------- pinito del retrovisor ----------
function sprPino(){return pCan(11,18,(g,p)=>{p('#e8e2cf',5,0,1,4);
 const rows=[[5,1],[4,3],[3,5],[4,3],[2,7],[3,5],[1,9],[2,7],[0,11],[4,3]];rows.forEach(([x,w],i)=>{p(i===9?'#6a4a2a':'#2f8a3a',x,4+i,w,1);if(i<9)p('#4fb04f',x,4+i,1,1)});
 p('#f4f2e8',3,11,5,2);p('#c8102e',4,11,3,1)})}

// ---------- Ariana de cerca (el final) ----------
function sprAriFace(open){const ch=CH.ariana||{skin:'#c68e5e',hairColor:'#2a1810',shirt:'#e85d75',accColor:'#f5c542'};const sk=ch.skin,hr=ch.hairColor;
 const c=pCan(46,52,(g,p)=>{const S=shade(sk,-.22),L=shade(sk,.14),HH=shade(hr,.18),HD=shade(hr,-.3);
  // pelo de atrás
  for(let y=4;y<52;y++)for(let x=2;x<44;x++){const dx=(x-23)/19,dy=(y-21)/18;if(dx*dx+dy*dy<1||(y>=21&&Math.abs(x-23)<19-Math.max(0,y-40)*.6))p(x%5===0?HD:hr,x,y)}
  // cuello y hombros
  p(S,18,36,10,10);p(ch.shirt,4,45,38,7);p(shade(ch.shirt,.18),4,45,38,1);p(shade(ch.shirt,-.2),20,46,6,6);p(sk,19,44,8,3);
  // cara
  for(let y=9;y<41;y++){const rx=12-Math.max(0,y-28)*.55;for(let x=0;x<46;x++){const dx=(x-23)/rx,dy=(y-24)/15;if(dx*dx+dy*dy<1)p(x>29?S:x<17&&y>22&&y<32?L:sk,x,y)}}
  // orejas y aretes
  p(sk,10,23,2,5);p(S,10,24,1,3);p(sk,35,23,2,5);p(S,36,24,1,3);
  [[9,29],[36,29]].forEach(([x,y])=>{p(ch.accColor||'#f5c542',x,y,2,1);p(ch.accColor||'#f5c542',x-1,y+1,1,2);p(ch.accColor||'#f5c542',x+2,y+1,1,2);p(ch.accColor||'#f5c542',x,y+3,2,1);p('#fff3b0',x,y,1,1)});
  // flequillo
  for(let x=10;x<37;x++){const top=Math.round(9+Math.max(0,(x-12))*.32),bot=Math.round(11+Math.max(0,22-x)*.45+(x>26?(x-26)*.25:0));for(let y=top-2;y<bot;y++)p((x+y)%7===0?HH:hr,x,y)}
  for(let x=13;x<26;x+=3)p(HH,x,10,1,2);
  // cejas
  p(HD,14,18,5,1);p(HD,15,17,3,1);p(HD,27,18,5,1);p(HD,28,17,3,1);
  // ojos
  const eye=(x)=>{if(open===2){p('#1d1a24',x,21,6,1);p('#f2e8dc',x,22,6,2);p('#3a2416',x+2,22,3,3);p('#0e0806',x+3,22,1,2);p('#ffffff',x+2,22,1,1);p(S,x,24,6,1);p('#1d1a24',x-1,21,1,1);p('#1d1a24',x+6,21,1,1)}
   else if(open===1){p('#1d1a24',x,22,6,1);p('#3a2416',x+2,23,3,1);p('#f2e8dc',x,23,2,1);p('#f2e8dc',x+5,23,1,1);p(S,x,24,6,1)}
   else{p('#1d1a24',x,23,6,1);p('#1d1a24',x,22,1,1);p('#1d1a24',x+5,22,1,1);p('#1d1a24',x+1,24,1,1);p('#1d1a24',x+3,24,1,1);p(S,x,21,6,1)}};
  eye(15);eye(26);
  // nariz, mejillas, boca
  p(S,23,26,1,3);p(S,22,29,3,1);p(L,21,27,1,1);p('#c9786a',14,28,3,1);p('#c9786a',29,28,3,1);
  p('#8a3e44',20,33,7,1);p('#b8605a',21,34,5,1);p(shade(sk,-.35),22,32,3,1)});return pOut(c,'#0b0910')}
// Ariana dormida contra la ventana (copiloto)
function sprAriSleep(awake){const ch=CH.ariana||{skin:'#c68e5e',hairColor:'#2a1810',accColor:'#f5c542'};const sk=ch.skin,hr=ch.hairColor;
 const c=pCan(40,60,(g,p)=>{const S=shade(sk,-.25),HH=shade(hr,.2);
  for(let y=6;y<44;y++)for(let x=8;x<40;x++){const dx=(x-25)/13,dy=(y-18)/13;if(dx*dx+dy*dy<1||(y>18&&x>10+(y-18)*.15&&x<39))p((x*3+y)%9===0?HH:hr,x,y)}
  for(let y=10;y<30;y++){const rx=8-Math.max(0,y-22)*.6;for(let x=0;x<40;x++){const dx=(x-19)/rx,dy=(y-19)/10;if(dx*dx+dy*dy<1)p(x>22?S:sk,x,y)}}
  for(let x=11;x<30;x++)for(let y=8;y<12+Math.max(0,(20-x))*.35;y++)p(hr,x,y);
  if(awake){p('#f2e8dc',13,17,4,3);p('#1d1a24',14,18,1,1);p('#f2e8dc',20,17,4,3);p('#1d1a24',21,18,1,1);p('#1d1a24',13,16,4,1);p('#1d1a24',20,16,4,1);p('#3a0e14',15,24,3,2)}else{p('#1d1a24',14,18,4,1);p('#1d1a24',14,17,1,1);p('#1d1a24',21,18,3,1);}p(S,16,22,2,1);p('#8a3e44',15,25,4,1);p('#c9786a',13,21,2,1);
  p(ch.accColor||'#f5c542',26,24,2,2);
  const pl=['#a51f2c','#1f2d5a'];for(let y=30;y<60;y++)for(let x=2;x<40;x++){if(y<34&&(x<8||x>36))continue;const k=((x>>2)+(y>>2))%2;let col=pl[k];if(x%4===0||y%4===0)col='#e8c860';if((x%4===0)&&(y%4===0))col='#f4e8b0';p(col,x,y)}
  for(let x=2;x<40;x++)p('#7a1520',x,30);p(sk,10,36,6,4);p(S,10,39,6,1)});return pOut(c,'#0b0910')}
// casco de Ariana en el espejo de la moto
function sprAriMirror(){const ch=CH.ariana||{skin:'#c68e5e',hairColor:'#2a1810'};return pCan(16,16,(g,p)=>{
 pDisk(p,8,8,7,(x,y,dx,dy)=>p(dy<-1?'#e85d75':dy<3?'#2a2a32':'#e85d75',x,y));p('#4a5a7a',3,7,11,3);p(ch.skin,5,8,6,2);p('#1d1a24',6,8,1,1);p('#1d1a24',9,8,1,1);p('#ffffff',3,7,2,1);p(ch.hairColor,2,12,3,4);p(ch.hairColor,12,12,3,4)})}

function proSprites(){if(PSP.ok)return PSP;PSP.ok=1;
 PSP.tree=[0,1,2].map(sprTree);PSP.plat=sprPlatano();PSP.cana=sprCana();PSP.poste=sprPoste(0);PSP.posteB=sprPoste(1);PSP.post=sprPostito();
 PSP.trailer=sprTrailer();PSP.carB=['#7a2a2a','#2a4a7a','#c9c4b8','#3a5a3a'].map(sprCarBack);PSP.carF=['#c9c4b8','#d64545','#2a2a2e'].map(sprCarFront);PSP.bus=sprBus();
 PSP.techo=sprPeajeTecho();PSP.caseta=sprCaseta(1,0);PSP.casetaUp=sprCaseta(1,1);PSP.casetaOff=sprCaseta(0,1);PSP.casetaIn=sprCasetaIn();
 PSP.chino=sprChino();PSP.gallo=[sprGallo(0),sprGallo(1)];PSP.perro=[sprPerro(0),sprPerro(1)];PSP.carre=sprCarretillo();PSP.sillon=sprSillon();PSP.humo=sprHumo();
 PSP.pino=sprPino();return PSP}

