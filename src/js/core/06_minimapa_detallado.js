// ================= MINIMAPA DETALLADO =================
// Mapa completo prerrenderizado (caché) + ventana que sigue al jugador + mapa grande con etiquetas.
const MM={s:4,w:148,h:104,full:null,big:null,bs:6};
function mmRender(s){const m=MAPS.ext,c=mk(m.w*s,m.h*s),g=c.getContext('2d');g.imageSmoothingEnabled=false;
 const q=(col,x,y,w,h)=>R(g,col,Math.round(x*s),Math.round(y*s),Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*s)));
 const px=(col,X,Y,w,h)=>R(g,col,X,Y,w||1,h||1);
 const park=(x,y)=>y>=24&&y<=34&&x>=32&&x<=59;
 const spk=(x,y,base,a,b,n)=>{px(base,x*s,y*s,s,s);for(let i=0;i<n;i++){const rx=hsh(x*7+i,y*13+1),ry=hsh(x*5+i,y*11+2),rr=hsh(x+i*3,y*3+i);px(rr<.5?a:b,Math.floor(x*s+rx*(s-1)),Math.floor(y*s+ry*(s-1)),1,1)}};
 const dens=Math.max(2,(s*s)>>3);
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const t=ti(m,x,y);
  switch(t){
   case 1:{q('#4a4e55',x,y,1,1);for(let i=0;i<Math.max(1,dens>>1);i++)px(hsh(x+i,y*5)<.5?'#55595f':'#3f4248',Math.floor(x*s+hsh(x*3+i,y)*s),Math.floor(y*s+hsh(x,y*3+i)*s),1,1);
    const sd=(a,b)=>{const v=ti(m,a,b);return v===2||v===16};
    if(sd(x,y-1))q('#2c2f34',x,y,1,.2);if(sd(x,y+1))q('#2c2f34',x,y+.8,1,.2);if(sd(x-1,y))q('#2c2f34',x,y,.2,1);if(sd(x+1,y))q('#2c2f34',x+.8,y,.2,1);
    const inV=x>=28&&x<=30,inH=(y>=20&&y<=22)||(y>=36&&y<=38);
    if((y===21||y===37)&&!inV&&x%2===0)q('#e8c547',x+.15,y+.44,.7,.14);
    if(x===29&&!inH&&y%2===0&&y>19)q('#e8c547',x+.44,y+.15,.14,.7);
    if(inV&&(y===23||y===19||y===35||y===39))for(let i=0;i<4;i++)q('#e6e1d4',x+i*.25+.03,y+.2,.14,.6);
    break}
   case 2:case 16:q('#c4bdad',x,y,1,1);q('#a59e8f',x,y+.85,1,.15);q('#a59e8f',x+.85,y,.15,1);if(hsh(x,y)<.25)px('#b3ab9a',Math.floor(x*s+hsh(y,x)*(s-1)),Math.floor(y*s+hsh(x+1,y)*(s-1)),1,1);
    if(t===16){q('rgba(0,0,0,.25)',x+.3,y+.6,.6,.25);q('#6f6a60',x+.4,y+.3,.25,.55)}break;
   case 6:spk(x,y,'#b08a5c','#9c7749','#c49d6c',dens);break;
   case 14:q('#cdc6b6',x,y,1,1);q('#bdb5a3',x,y+.85,1,.15);break;
   case 4:if(park(x,y))spk(x,y,'#66b152','#5aa047','#78c262',dens);else q('#cdc6b6',x,y,1,1);q('#d9d2c2',x,y+.45,1,.55);q('#2a2a30',x,y+.1,1,.14);q('#a59e8f',x,y+.88,1,.12);break;
   case 8:spk(x,y,'#66b152','#5aa047','#78c262',dens);if(hsh(x+5,y+5)<.18)px(['#f7e04b','#f28ab2','#ffffff'][Math.floor(hsh(x,y)*3)%3],Math.floor(x*s+hsh(x+7,y+7)*(s-1)),Math.floor(y*s+hsh(x+8,y+8)*(s-1)),Math.max(1,s>>2),Math.max(1,s>>2));break;
   case 15:q((x>>1)%2?'#4b9a43':'#53a34a',x,y,1,1);break;
   case 37:q('#7d7972',x,y,1,1);q('#97928a',x,y,1,.2);break;
   default:spk(x,y,'#5c9e48','#4f8c3e','#6fb556',dens)}}
 // cancha: líneas de cal
 {const L=Math.max(1,s>>2),X0=46*s,Y0=26*s,W=11*s,H=6*s;R(g,'#f1ead6',X0,Y0,W,L);R(g,'#f1ead6',X0,Y0+H-L,W,L);R(g,'#f1ead6',X0,Y0,L,H);R(g,'#f1ead6',X0+W-L,Y0,L,H);R(g,'#f1ead6',X0+(W>>1),Y0,L,H);disc(g,'#53a34a',X0+(W>>1)+(L>>1),Y0+(H>>1),Math.round(s*1.1));
  disc(g,'#f1ead6',X0+(W>>1)+(L>>1),Y0+(H>>1),Math.round(s*1.1));disc(g,'#53a34a',X0+(W>>1)+(L>>1),Y0+(H>>1),Math.max(1,Math.round(s*1.1)-L))}
 // árboles y arbustos
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const t=ti(m,x,y),cx=Math.round(x*s+s/2),cy=Math.round(y*s+s/2);
  if(t===5){if(x===0||y===0||x===m.w-1||y===m.h-1){disc(g,'#2e6e33',cx,cy,Math.round(s*1.1));if(hsh(x,y)<.4)disc(g,'#3a8240',cx-1,cy-1,Math.round(s*.6))}
   else{q('rgba(0,0,0,.2)',x+.1,y+.7,.8,.25);q('#6b4a2b',x+.42,y+.55,.2,.4);disc(g,'#2e6e33',cx,cy-Math.round(s*.1),Math.max(2,Math.round(s*.62)));disc(g,'#3f8a3e',cx-1,cy-Math.round(s*.1)-1,Math.max(1,Math.round(s*.4)));px('#6ab85a',cx-Math.round(s*.3),cy-Math.round(s*.35),1,1)}}
  else if(t===7){disc(g,'#2f7a3a',cx,cy+1,Math.max(1,Math.round(s*.42)));disc(g,'#3d9447',cx-1,cy,Math.max(1,Math.round(s*.25)));px('#f28ab2',cx+Math.round(s*.2),cy-1,1,1)}}
 // huerta detrás de tu casa
 for(let i=0;i<3;i++){const X=(3+i*2)*s,Y=7*s+Math.round(s*.35);R(g,'#72513d',X,Y,Math.round(s*.9),Math.max(2,Math.round(s*.4)));px('#67b955',X+1,Y,1,1);px('#67b955',X+Math.round(s*.5),Y,1,1)}
 // casas: techo de zinc + fachada con ventanas y puerta
 for(const b of BUILD){const X=b.x*s,Y=b.y*s,W=b.w*s,rH=(b.h-2)*s,fH=2*s,e=Math.max(1,s>>2);
  R(g,'rgba(0,0,0,.22)',X+2,Y+b.h*s,W,Math.max(1,s>>1));
  R(g,b.roof,X,Y,W,rH);for(let i=0;i<W;i+=2)R(g,i%4===0?shade(b.roof,.2):shade(b.roof,-.13),X+i,Y,1,rH);
  R(g,shade(b.roof,.4),X,Y,W,1);R(g,shade(b.roof,.28),X,Y+(rH>>1),W,1);R(g,shade(b.roof,-.4),X,Y+rH-e,W,e);
  R(g,'#8f8a80',X+W-Math.round(s*1.6),Y+Math.round(s*.5),Math.max(2,Math.round(s*.6)),Math.max(2,Math.round(s*.6)));
  R(g,b.wall,X,Y+rH,W,fH);R(g,shade(b.wall,-.22),X,Y+rH+fH-e,W,e);R(g,shade(b.wall,.25),X,Y+rH,W,1);
  const win=(tx)=>{const wx=Math.round(tx*s+s*.15),wy=Y+rH+Math.round(s*.3),ww=Math.max(2,Math.round(s*.7)),wh=Math.max(2,Math.round(s*.6));R(g,'#efe9dc',wx-1,wy-1,ww+2,wh+2);R(g,'#4f6f8c',wx,wy,ww,wh);px('#8bb3d1',wx,wy,1,1);if(s>=6)R(g,'#2a3c50',wx+(ww>>1),wy,1,wh)};
  for(const tx of[b.x+1,b.x+b.w-2])if(tx!==b.dx)win(tx);
  const dx=Math.round(b.dx*s+s*.22),dw=Math.max(2,Math.round(s*.56)),dh=Math.max(3,Math.round(s*1.25));R(g,'#efe9dc',dx-1,Y+rH+fH-dh-1,dw+2,dh+1);R(g,'#6b4a2b',dx,Y+rH+fH-dh,dw,dh);px('#f2c94c',dx+dw-1,Y+rH+fH-(dh>>1),1,1);
  if(b.kind==='store'){const ah=Math.max(2,Math.round(s*.6));R(g,STORES[b.id].aw,X,Y+rH,W,ah);R(g,'#f7e04b',X,Y+rH+ah-1,W,1)}
  if(b.kind==='shop'){const ah=Math.max(2,Math.round(s*.5));for(let i=0;i<W;i+=2)R(g,(i>>1)%2?'#f4f4f4':'#c0473b',X+i,Y+rH,2,ah);R(g,'rgba(0,0,0,.2)',X,Y+rH+ah,W,1);
   if(s>=6){g.fillStyle='#14101c';g.font='bold '+Math.round(s*.9)+'px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('$',X+(W>>1)-s*2.4,Y+(rH>>1))}}}
 // objetos: parada, kiosco, bancas, arcos, letreros
 for(const o of m.objs){const X=o.x*s,Y=o.y*s,W=o.w*s,H=o.h*s;
  if(o.type==='busstop'){R(g,'rgba(0,0,0,.2)',X,Y+H-1,W,2);R(g,'#2a6fb0',X,Y+1,W,Math.max(2,Math.round(s*.5)));R(g,'#f4f4f4',X,Y+1,W,1);R(g,'#dcdcdc',X+1,Y+Math.round(s*.5)+1,1,Math.max(1,Math.round(s*.4)));R(g,'#dcdcdc',X+W-2,Y+Math.round(s*.5)+1,1,Math.max(1,Math.round(s*.4)))}
  else if(o.type==='kiosco'){R(g,'rgba(0,0,0,.2)',X,Y+H-1,W,2);R(g,'#f4ead2',X+1,Y+Math.round(H*.45),W-2,Math.round(H*.5));R(g,'#c0473b',X,Y,W,Math.round(H*.55));for(let i=0;i<W;i+=2)R(g,'#f4f4f4',X+i,Y,1,Math.round(H*.55));R(g,'#8f2e26',X,Y+Math.round(H*.55)-1,W,1)}
  else if(o.type==='bench'){R(g,'rgba(0,0,0,.2)',X+1,Y+s-2,s-2,1);R(g,'#8a6a45',X+1,Y+Math.round(s*.35),s-2,Math.max(1,Math.round(s*.35)));R(g,'#6b4f30',X+1,Y+Math.round(s*.7),1,Math.max(1,Math.round(s*.25)));R(g,'#6b4f30',X+s-2,Y+Math.round(s*.7),1,Math.max(1,Math.round(s*.25)))}
  else if(o.type==='goal'){R(g,'#f4f4f4',X+Math.round(s*.2),Y,Math.max(1,s>>2),H);R(g,'#f4f4f4',X+Math.round(s*.2),Y,Math.max(2,Math.round(s*.6)),1);R(g,'#f4f4f4',X+Math.round(s*.2),Y+H-1,Math.max(2,Math.round(s*.6)),1)}
  else if(o.type==='sign'){R(g,'#6b4f30',X+Math.round(s*.45),Y+Math.round(s*.4),1,Math.round(s*.6));R(g,'#f4ead2',X+Math.round(s*.15),Y+Math.round(s*.1),Math.max(2,Math.round(s*.7)),Math.max(2,Math.round(s*.4)));R(g,'#14101c',X+Math.round(s*.15),Y+Math.round(s*.1),Math.max(2,Math.round(s*.7)),1)}}
 // punto penal y botellas por reciclar (detalle)
 disc(g,'#f1ead6',Math.round(51*s+s/2),Math.round(29*s+s/2),Math.max(1,s>>2));
 return c}
function genMini(){MM.full=mmRender(MM.s);return MM.full}
const mmCenter=()=>{const m=MAPS[P.map];if(!m.interior)return[P.x/T,P.y/T];const b=BMAP[P.map]||m.door;return b?[b.dx+.5,b.dy+.5]:[0,0]};
function mmTargets(){const out=[],add=(mp,x,y,c,r,edge)=>out.push({mp,x,y,c,r,edge});const blink=Math.floor(qBlink*3)%2;
 for(const id of['ariana','nicolas','matias','papa','mama','rosa']){const n=NPC[id];if(n)add(n.map,n.x,n.y,n.c.shirt,2.2,false)}
 const d=dateOn();if(d&&LOC[d.loc]){const st=d.day*1440+d.h*60;if(nowM()>=st-180&&nowM()<=st+180){const sp=LOC[d.loc].sp[0];add(LOC[d.loc].map,sp[0]*T+8,sp[1]*T+8,'#f193b4',3.2,true)}}
 if(S.f.ph)for(const x of S.f.ph.ped)if(!x.done&&!x.fail){const n=NPC[x.who];if(n)add(n.map,n.x,n.y,'#f2994a',3,true)}
 if(blink){for(const id in NPC)if(questNPC(id)){const n=NPC[id];add(n.map,n.x,n.y,'#f2c94c',3.5,true)}
  if(qs('visita')===1&&!S.f.vGift&&!hasI('queque')&&!hasI('coca'))add('pulperia',0,0,'#f2c94c',3.5,true);if(qs('tortillas')===1&&!hasI('tortillas'))add('pulperia',0,0,'#f2c94c',3.5,true);
  if(qs('cargador')===1&&!S.f.cargGot)add('ext',21*T,23*T,'#f2c94c',3.5,true);if(qs('firulais')===1&&!S.f.dogFollow)add('ext',14*T,5*T,'#f2c94c',3.5,true);
  if(qs('gallo')===1&&!hasI('kiki')){const k=ENTS.find(e=>e.special==='kiki');if(k)add('ext',k.x,k.y,'#f2c94c',3.5,true)}
  if(qs('fiesta')===1)add('ext',39*T,29*T,'#f2c94c',3.5,true)}
 if(activityMarker){add('ext',activityMarker[0]*T,activityMarker[1]*T,'#73c9df',3.5,true);if(P.map==='ext'&&Math.hypot(P.x-activityMarker[0]*T,P.y-activityMarker[1]*T)<30)activityMarker=null}
 if(curZone()==='chepe')zTargets(add);
 return out}
function mmTo(mp,x,y,s){const m=MAPS[mp];if(!m||zoneOf(mp)!==curZone())return null;let X,Y;if(!m.interior){X=x/T;Y=y/T}else{const b=BMAP[mp]||m.door;if(!b)return null;X=b.dx+.5;Y=b.dy+.5}return[X*s,Y*s]}
function mmDot(g,X,Y,c,r){g.fillStyle='#14101c';g.beginPath();g.arc(X,Y,r+1.2,0,7);g.fill();g.fillStyle=c;g.beginPath();g.arc(X,Y,r,0,7);g.fill()}
function mmArrow(g,X,Y,ang,c){g.save();g.translate(X,Y);g.rotate(ang);g.fillStyle='#14101c';g.beginPath();g.moveTo(6,0);g.lineTo(-4,-5);g.lineTo(-4,5);g.closePath();g.fill();g.fillStyle=c;g.beginPath();g.moveTo(4.2,0);g.lineTo(-2.4,-3.2);g.lineTo(-2.4,3.2);g.closePath();g.fill();g.restore()}
function mmPlayer(g,X,Y){const d=[[0,1],[0,-1],[-1,0],[1,0]][P.dir]||[0,1],pulse=1+Math.sin(qBlink*5)*.5;g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1;g.beginPath();g.arc(X,Y,5+pulse,0,7);g.stroke();mmDot(g,X,Y,'#ffffff',3.2);mmArrow(g,X+d[0]*6,Y+d[1]*6,Math.atan2(d[1],d[0]),'#d6453c')}
function drawMini(){const full=curZone()==='barrio'?MM.full:zmm(MM.s);if(!full)return;const mc=$('#mini'),g=mc.getContext('2d'),s=MM.s,W=MM.w,H=MM.h,fw=full.width,fh=full.height,[cx,cy]=mmCenter();
 const sx=clamp(Math.round(cx*s-W/2),0,fw-W),sy=clamp(Math.round(cy*s-H/2),0,fh-H);g.imageSmoothingEnabled=false;g.drawImage(full,sx,sy,W,H,0,0,W,H);
 const dk=darkness();if(dk>0){g.fillStyle='rgba(12,12,44,'+(dk*.5).toFixed(2)+')';g.fillRect(0,0,W,H)}
 const tg=mmTargets();
 for(const t of tg){const p=mmTo(t.mp,t.x,t.y,s);if(!p)continue;const X=p[0]-sx,Y=p[1]-sy;
  if(X>=3&&X<=W-3&&Y>=3&&Y<=H-3)mmDot(g,X,Y,t.c,t.r);
  else if(t.edge){const ax=W/2,ay=H/2,dx=X-ax,dy=Y-ay,k=Math.min((W/2-8)/Math.abs(dx||1e-6),(H/2-8)/Math.abs(dy||1e-6));mmArrow(g,ax+dx*k,ay+dy*k,Math.atan2(dy,dx),t.c)}}
 const pp=mmTo(P.map,P.x,P.y,s);if(pp)mmPlayer(g,pp[0]-sx,pp[1]-sy);
 // rosa de los vientos
 g.fillStyle='rgba(20,16,28,.75)';g.fillRect(W-14,2,12,12);g.fillStyle='#f4ead2';g.font='bold 9px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('N',W-8,8.5);
 if(MAPS[P.map].interior){g.fillStyle='rgba(20,16,28,.75)';g.fillRect(2,H-12,W-4,10);g.fillStyle='#f4ead2';g.font='bold 8px monospace';g.fillText('Dentro: '+intName(P.map),W/2,H-7)}}
const bigOpen=()=>$('#bigmap')&&!$('#panel').classList.contains('hidden');
function openMap(){if(mode!=='play')return;if(curZone()==='chepe'){openPanel('Mapa del centro de San José',`<canvas id="bigmap" width="${CHW*MM.bs}" height="${CHH*MM.bs}"></canvas><div class="mm-leg"><span><i class="mm-k" style="background:#fff"></i>Vos</span><span><i class="mm-k" style="background:#73c9df"></i>Parada de La Chancha</span><span><i class="mm-k" style="background:#f2c94c"></i>Encargo</span></div><p class="note">El último bus al barrio sale a las 9:00 p. m. desde la Avenida Segunda.</p>`);drawBigMap();return}openPanel('Mapa del barrio',`<canvas id="bigmap" width="${84*MM.bs}" height="${56*MM.bs}"></canvas><div class="mm-leg"><span><i class="mm-k" style="background:#fff"></i>Vos</span><span><i class="mm-k" style="background:#f2c94c"></i>Misión</span><span><i class="mm-k" style="background:#73c9df"></i>Destino marcado</span><span><i class="mm-k" style="background:#f193b4"></i>Cita</span><span><i class="mm-k" style="background:#f2994a"></i>Mandado</span></div><p class="note">Tocá el mapa chiquito o apretá M para abrir esto.</p>`);drawBigMap()}
const BM_NAMES={ropa:'Ropa americana',super_chino:'Súper chino',pollolandia:'Pollolandia',gollo:'Gollo',casa_jugador:'Tu casa',pulperia:'Pulpería',iglesia:'Iglesia',casa_papas:'Suegros',casa_vecino:'Vecino'},BM_OWN={casa_matias:'matias',casa_ariana:'ariana',casa_nicolas:'nicolas',casa_marta:'marta'};
function drawBigMap(){const cvs=$('#bigmap');if(!cvs)return;if(curZone()!=='barrio')return drawBigZone(cvs);if(!MM.big)MM.big=mmRender(MM.bs);const s=MM.bs,g=cvs.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(MM.big,0,0);
 const dk=darkness();if(dk>0){g.fillStyle='rgba(12,12,44,'+(dk*.5).toFixed(2)+')';g.fillRect(0,0,cvs.width,cvs.height)}
 const txt=(t,x,y,sz,col)=>{g.font='bold '+sz+'px monospace';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=3;g.strokeStyle='#14101c';g.strokeText(t,x,y);g.fillStyle=col||'#f4ead2';g.fillText(t,x,y)};
 for(const b of BUILD){const nm=BM_NAMES[b.id]||(BM_OWN[b.id]?N(BM_OWN[b.id]).replace(/^(Don|Doña) /,''):null);if(!nm)continue;txt(nm,(b.x+b.w/2)*s,b.y*s-5,9,b.id==='casa_jugador'?'#f2c94c':b.id==='pulperia'?'#f7e04b':'#f4ead2')}
 txt('Parque',45.5*s,25.2*s,9,'#d8f0c8');txt('Cancha',51.5*s,32.4*s,8,'#d8f0c8');txt('Parada',21*s,24.8*s,8,'#bfe0ff');txt('Kiosco',39.5*s,31.6*s,8,'#ffd0c8');txt('Huerta',6*s,6.6*s,8,'#cfe6a8');
 txt('Calle Principal',9*s,21.6*s,8,'#e8c547');txt('Calle del Sur',9*s,37.6*s,8,'#e8c547');txt('Trillo',29.5*s,6*s,8,'#e0c8a0');txt('Parada Este',74*s,24.8*s,8,'#bfe0ff');txt('La entrada',34.5*s,45*s,8,'#f2994a');
 const tg=mmTargets();for(const t of tg){const p=mmTo(t.mp,t.x,t.y,s);if(!p)continue;mmDot(g,p[0],p[1],t.c,t.r+1.6)}
 for(const id of['ariana','nicolas','matias','papa','mama','rosa']){const n=NPC[id],p=n&&mmTo(n.map,n.x,n.y,s);if(p)txt(N(id).replace(/^(Don|Doña) /,''),p[0],p[1]-9,8,'#fff')}
 const pp=mmTo(P.map,P.x,P.y,s);if(pp){g.save();g.translate(pp[0],pp[1]);g.scale(1.5,1.5);g.translate(-pp[0],-pp[1]);mmPlayer(g,pp[0],pp[1]);g.restore();txt('Vos',pp[0],pp[1]-14,9,'#fff')}}
addEventListener('keydown',e=>{if(e.key&&e.key.toLowerCase()==='m'&&!e.repeat&&mode==='play'&&S&&S.started)openMap()});


