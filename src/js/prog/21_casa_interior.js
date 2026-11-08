// ================= TU CASA POR DENTRO (estilo B): MÁS GRANDE, CON CUARTOS =================
// La casa del jugador deja de ser un solo cuarto de 14×10: ahora mide 22×16 casillas por dentro, con
//   · cuarto (oeste-arriba), baño (oeste-abajo), sala (centro), cocina con desayunador (este-arriba) y comedor (este-abajo).
// Las paredes de adentro se ven «en corte» (bajitas, como casa de muñecas) para que nunca tapen al personaje.
// Se pinta con las herramientas HD del barrio y la luz del juego; encima se anima: el cielo en las ventanas según la hora,
// los rayos de sol que entran con polvito, la tele, el vapor de la olla y el abanico de techo.
// Por fuera la casa se ve igual. Las acciones de siempre siguen con los mismos nombres (bed, night, tv, counter, stove, fridge,
// sofa, table, compu) y hay nuevas en el baño (ducha, inodoro, lavatorio) y el cuarto (ropero, baúl).
// La decoración que ya compraste (DECO) aparece en su lugar nuevo. Los lugares están pensados para el modo «Decorar» (parte b).
var CJ={W:22,H:16,EXIT:{x:11,y:15},ENTRY:{x:11,y:14}};
var CJ_WIN=[{x:4,w:2,room:'cuarto'},{x:15,w:2,room:'cocina'},{x:10,w:1,room:'sala',narrow:1}];   // ventanas en la pared del fondo (casillas)
function cjRoom(tx,ty){if(tx<=8)return ty<=8?'cuarto':ty>=10?'bano':'pared';if(tx===9)return'pared';if(tx>=15&&ty<=7)return'cocina';return'sala'}
function genCasaJ(b){const W=CJ.W,H=CJ.H,m=newMap(b.id,W,H,'');m.interior=true;m.b=b;m.casaJ=true;m.wallFace=shade(b.wall,.35);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const wall=y<2||x===0||x===W-1||y===H-1;setT(m,x,y,wall?10:b.floor,wall)}
  // paredes de adentro: la vertical (x=9) con dos puertas y la horizontal entre el cuarto y el baño (y=9)
  for(let y=2;y<H-1;y++)if(y!==5&&y!==12)setT(m,9,y,10,1);
  for(let x=1;x<=8;x++)setT(m,x,9,10,1);
  setT(m,CJ.EXIT.x,CJ.EXIT.y,13,0);m.noPath.add(CJ.EXIT.y*W+CJ.EXIT.x);m.exit={x:CJ.EXIT.x,y:CJ.EXIT.y};m.entry={x:CJ.ENTRY.x,y:CJ.ENTRY.y};
  const F=(type,x,y,ww=1,hh=1,act,extra)=>{const o=Object.assign({type,x,y,w:ww,h:hh,act,cj:1},extra||{});m.objs.push(o);for(let j=y;j<y+hh;j++)for(let i=x;i<x+ww;i++)m.s[j*W+i]=1;return o};
  const up=k=>typeof U==='function'&&S&&S.f&&S.f.eco?U(k):0;
  // cuarto
  F('bed',1,2,2,3,'bed');F('night',3,2,1,1,'night');F('ropero',7,2,2,1,'ropero');F('baul',1,6,2,1,'baul');
  if(up('compu'))F('desk',4,2,2,2,'compu');
  // baño
  F('ducha',1,10,2,2,'ducha');F('inodoro',4,10,1,1,'inodoro');F('lavatorio',6,10,1,1,'lavatorio');F('canasto',8,14,1,1,'canasto');
  // sala
  F('tvmueble',11,2,3,1,'tv');F('mesacentro',11,5,3,1,'mesacentro');F('sofa',11,8,3,1,'sofa');F('plant',10,14);F('zapatera',13,14,1,1,'zapatera');
  if(typeof hasD==='function'&&hasD('lampara'))F('lampara',10,2);else F('plant',10,2);
  if(typeof hasD==='function'&&hasD('sonido'))F('sonido',14,2,1,1,'sonido');else F('radio',14,2,1,1,'radio');
  if(typeof hasD==='function'&&hasD('perro'))F('camaperro',14,12,1,1,'camaperro');
  if(typeof hasD==='function'&&hasD('matas')){F('plant',14,14);F('plant',8,8)}
  // cocina y comedor
  F('fregadero',15,2,2,1,'counter');F('stove',17,2,1,1,'stove');F('mostrador',18,2,2,1,'cafe');F('fridge',20,2,1,1,'fridge');
  F('desayunador',15,6,4,1,'desayunador');F('banco',16,7);F('banco',17,7);
  F('table',16,10,3,2,'table');F('chair',15,10);F('chair',15,11);F('chair',19,10,1,1,null,{der:1});F('chair',19,11,1,1,null,{der:1});F('plant',20,14);
  m.s0=m.s.slice();
  m.lights.push({x:3*T,y:3.2*T,r:54},{x:12.5*T,y:6*T,r:90},{x:17.5*T,y:4*T,r:70},{x:17.5*T,y:10.5*T,r:70},{x:4.5*T,y:12*T,r:56});
  return m}
{const _g=genInt;genInt=function(b){if(b&&b.id==='casa_jugador')return genCasaJ(b);return _g(b)}}
// applyHome mete un escritorio en el lugar viejo: se quita, porque la casa nueva ya lo pone en su rincón
hookAfter('applyHome',function(){const m=MAPS.casa_jugador;if(!m||!m.casaJ)return;m.objs=m.objs.filter(o=>o.cj);m.s=m.s0.slice();
  if(typeof U==='function'&&U('compu')&&!m.objs.some(o=>o.type==='desk')){m.objs.push({type:'desk',x:4,y:2,w:2,h:2,act:'compu',cj:1});for(const[x,y]of[[4,2],[5,2],[4,3],[5,3]])m.s[y*m.w+x]=1;m.s0=m.s.slice()}
  m.hdDirty=true});
// si la partida estaba en la casa vieja en un lugar que ahora es pared, se le busca un lugar libre
hookAfter('startGame',function(){if(P.map!=='casa_jugador')return;const m=MAPS.casa_jugador;if(!m||!m.casaJ)return;if(feetBlocked(m,P.x,P.y)){P.x=12*T+8;P.y=11*T+12;snapCam()}});
// ---------------------------------------------------------------- el arte
const CJ_P={
  cuarto:{wall:[176,204,220]},cocina:{wall:[236,232,220]},bano:{wall:[214,232,232]}};
function cjWood(X,Y,base){const row=Y>>3,off=(hsh(row,7)*96)|0,L=(64+hsh(row,((X+off)/80)|0)*48)|0,seg=((X+off)/L)|0,ph=hsh(row,seg);
  let f=.88+ph*.14+(hdVN(X,Y*3,26,5)-.5)*.08;const g=Math.sin((X+off)*.35+row*1.7);if(g>.94)f*=.95;if((Y&7)===7)f=.6;else if((Y&7)===0)f*=1.05;if(((X+off)%L)===0)f=.64;
  const c=hdS(base,f);if(hdr(X,Y)<.004)return[90,62,40];return c}
function cjMosaico(X,Y){// mosaico de la abuela: baldosas de 16 px con una flor de cuatro pétalos, colores gastados
  const u=((X&15)/16)*2-1,v=((Y&15)/16)*2-1,d1=Math.abs(u)+Math.abs(v),cu=Math.hypot(Math.abs(u)-1,Math.abs(v)-1);
  let c=[222,212,190];if(d1<.42)c=[178,104,82];else if(d1<.56)c=[226,206,164];else if(cu<.42)c=[120,138,128];else if(cu<.5)c=[204,190,160];
  if(Math.abs(u)>.94||Math.abs(v)>.94)c=[186,176,156];const w=hdVN(X,Y,48,3);return hdS(c,(.92+.07*w)*(.97+hdr(X,Y)*.05))}
function cjAjedrez(X,Y){const k=(((X>>4)+(Y>>4))&1);let c=k?[176,84,60]:[232,222,200];if((X&15)===0||(Y&15)===0)c=[150,136,118];return hdS(c,.94+hdVN(X,Y,30,9)*.08+(hdr(X,Y)-.5)*.04)}
function cjCeramica(X,Y){let c=[222,206,180];if((X&31)===0||(Y&31)===0)return[176,164,146];const vn=hdVN(X*1.4,Y,22,(X>>5)*7+(Y>>5));if(Math.abs(vn-.5)<.02)c=[204,186,160];
  c=hdS(c,.95+hdVN(X,Y,50,2)*.06);const sh=((X+Y*2)%97)<6&&((X>>5)+(Y>>5))%2?1.05:1;return hdS(c,sh)}
function cjBanoPiso(X,Y){if(X%11===0||Y%11===0)return[184,190,192];let c=[236,240,240];if(((X/11|0)+(Y/11|0))%7===0)c=[150,196,214];return hdS(c,.95+hdr(X,Y)*.05)}
function cjAzulejo(X,Y,blue){const u=X%16,v=Y%16;if(u===0||v===0)return[196,200,200];let c=[244,244,240];if(blue&&((X>>4)+(Y>>4))%2===0){const du=Math.abs(u-8),dv=Math.abs(v-8);if(du+dv<5)c=[60,110,170];else if(du<1||dv<1)c=[120,160,200]}
  if(u===1||v===1)c=hdS(c,1.03);if(u===15||v===15)c=hdS(c,.9);return c}
function cjPlaster(b,x,y,w,h,col,seed){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=x+i,Y=y+j,n=hdVN(X,Y,18,seed),r=hdr(X,Y);hdP(b,X,Y,hdS(col,.93+n*.07+(r-.5)*.03))}}
function hdCasaJ(m){const W=m.w*32,H=m.h*32,b=hdBuf(W,H),EM=m.hdEmit=[],up=k=>typeof U==='function'&&S&&S.f&&S.f.eco?U(k):0,piso=up('piso');
  // ---- pisos por cuarto
  for(let Y=64;Y<H-32;Y++)for(let X=0;X<W;X++){const tx=X>>5,ty=Y>>5,r=cjRoom(tx,ty);let c;
    if(r==='cuarto')c=cjWood(X,Y,[164,118,80]);else if(r==='bano')c=cjBanoPiso(X,Y);else if(r==='cocina')c=piso?cjCeramica(X,Y):cjAjedrez(X,Y);
    else if(r==='sala')c=piso?cjCeramica(X,Y):cjMosaico(X,Y);else c=[60,50,44];
    // sombra de contacto contra las paredes (oclusión)
    let ao=1;const dyb=Y-64;if(dyb<16)ao*=.72+.28*dyb/16;if(tx===10){const dx=X-320;if(dx<12)ao*=.78+.22*dx/12}if(ty===10&&tx<=8){const dy=Y-320;if(dy<12)ao*=.7+.3*dy/12}
    if(X<20)ao*=.8+.2*X/20;if(X>W-20)ao*=.8+.2*(W-X)/20;if(Y>H-46)ao*=.8+.2*(H-32-Y)/14;
    const i=(Y*W+X)<<2;b.d[i]=c[0]*ao;b.d[i+1]=c[1]*ao;b.d[i+2]=c[2]*ao*(ao<1?1.02:1);b.d[i+3]=255}
  // ---- pared del fondo: celeste en el cuarto, el color de la casa en la sala, azulejos en la cocina
  const wallSala=hdC((m.b&&m.b.wall)||'#e9dcb5');
  cjPlaster(b,0,0,9*32+16,64,CJ_P.cuarto.wall,3);cjPlaster(b,9*32+16,0,6*32-16,64,hdS(wallSala,1.02),5);cjPlaster(b,15*32,0,7*32,64,CJ_P.cocina.wall,7);
  for(let Y=14;Y<57;Y++)for(let X=15*32;X<W;X++)hdP(b,X,Y,cjAzulejo(X,Y,1));
  // cenefa de la sala y zócalo del cuarto
  for(let X=9*32+16;X<15*32;X++){hdP(b,X,20,hdS(wallSala,.78));hdP(b,X,21,[170,74,58]);hdP(b,X,22,hdS(wallSala,.78))}
  for(let Y=38;Y<57;Y++)for(let X=0;X<9*32+16;X++){const p=(X%10===0);hdP(b,X,Y,hdS(p?[134,96,64]:[160,116,78],.92+hdVN(X,Y,12,4)*.1))}hdR(b,0,37,9*32+16,2,[110,78,52]);
  hdR(b,0,0,W,6,[74,58,52]);hdR(b,0,0,W,1,[110,90,80]);for(let d=0;d<9;d++)hdM(b,0,6+d,W,1,[.74+.026*d,.74+.026*d,.76+.024*d]);   // cielo raso
  hdR(b,0,57,W,7,[118,86,60]);hdR(b,0,57,W,1,[156,120,84]);hdR(b,0,63,W,1,[78,56,40]);   // rodapié
  for(const sx of[9*32+14,15*32-1])hdR(b,sx,6,2,51,hdS([160,150,140],.9));   // esquinas entre cuartos
  // ---- ventanas con rejas, cortinas y marco
  for(const w of CJ_WIN){const x=w.x*32+(w.narrow?6:8),ww=w.w*32-(w.narrow?12:16),y=12,h=34;m.win=m.win||[];
    hdR(b,x-4,y-4,ww+8,h+8,[244,240,230]);hdR(b,x-4,y-4,ww+8,1,[255,255,250]);hdR(b,x+ww+3,y-4,1,h+8,[200,194,182]);
    for(let j=0;j<h;j++)for(let i=0;i<ww;i++){const t=j/h;hdP(b,x+i,y+j,t<.6?hdMix([150,196,226],[214,232,240],t/.6):hdMix([120,170,96],[90,140,80],(t-.6)/.4))}
    for(let i=4;i<ww;i+=6)hdR(b,x+i,y,1,h,[36,32,32]);hdR(b,x,y+11,ww,1,[36,32,32]);hdR(b,x,y+23,ww,1,[36,32,32]);   // rejas
    hdR(b,x-6,y+h+3,ww+12,3,[226,218,204]);hdR(b,x-6,y+h+6,ww+12,1,[150,140,126]);
    const flor=typeof hasD==='function'&&hasD('cortinas');
    for(const s of[0,1])for(let j=-6;j<h+4;j++){const ww2=Math.max(3,(8-4*Math.sin(Math.min(1,Math.max(0,(j-6)/22))*Math.PI))|0);for(let i=0;i<ww2;i++){const X=s?x+ww+5-i:x-6+i;let c=flor?hdS([240,170,190],.82+.22*Math.sin(i*1.3)):hdS(w.room==='cocina'?[236,206,120]:[220,226,236],.8+.22*Math.sin(i*1.4));
        if(flor&&(i*7+j*3)%11===0)c=[200,70,90];if(flor&&(i*5+j*7)%13===0)c=[90,140,80];hdP(b,X,y+j,c)}}
    hdR(b,x-10,y-9,ww+20,2,[120,90,58]);hdR(b,x-11,y-10,2,4,[90,66,44]);hdR(b,x+ww+9,y-10,2,4,[90,66,44]);
    m.win.push({x,y,w:ww,h,room:w.room});if(w.room==='cuarto'&&!up('compu'))hdPlantPot(b,x+ww/2-4,y+h+3,false)}
  // ---- cuadros y cosas de pared
  {const x=3*32+6,y=18;if(typeof hasD==='function'&&hasD('sele')){hdR(b,x-1,y-1,22,28,[20,20,24]);hdR(b,x,y,20,26,[214,69,60]);hdR(b,x+2,y+2,16,9,[244,244,244]);hdR(b,x+2,y+14,16,10,[42,111,176]);hdText(b,x+5,y+3,'CR',[214,69,60])}
    else{hdR(b,x+8,y,3,18,[150,110,60]);hdR(b,x+3,y+5,13,3,[150,110,60]);hdR(b,x+9,y+1,1,16,[190,150,90])}}   // crucifijo de madera
  if(typeof hasD==='function'&&hasD('cuadro')){for(const[x,blue]of[[11*32+6,1],[13*32+2,0]]){hdR(b,x-1,y_(14)-1,24,24,[110,80,40]);hdR(b,x,y_(14),22,22,[176,138,58]);hdR(b,x+2,y_(14)+2,18,18,blue?[70,110,170]:[110,170,210]);if(blue){hdEll(b,x+11,y_(14)+11,4,7,[214,176,82]);hdEll(b,x+11,y_(14)+6,2,2,[70,50,40])}else{for(let j=0;j<8;j++)hdR(b,x+11-j,y_(14)+10+j,j*2,1,[100,120,90]);hdR(b,x+10,y_(14)+4,2,4,[200,120,90])}}}
  else{const x=12*32-4,y=14;hdR(b,x-1,y-1,30,22,[110,80,40]);hdR(b,x,y,28,20,[176,138,58]);hdR(b,x+2,y+2,24,16,[122,176,214]);hdR(b,x+2,y+11,24,7,[92,150,72]);hdEll(b,x+19,y+6,3,3,[244,206,72]);hdR(b,x+5,y+9,6,6,[240,232,214]);hdR(b,x+5,y+8,7,2,[176,72,52])}
  if(typeof hasD==='function'&&hasD('trofeos')){const x=13*32+18,y=26;hdR(b,x,y+14,42,4,[120,80,46]);hdR(b,x,y+14,42,1,[160,110,64]);hdShadeBand(b,x,y+18,42,3,.3,.05);for(let i=0;i<3;i++){const tx=x+4+i*13,ty=y+3;hdR(b,tx+2,ty+6,6,4,[214,176,82]);hdR(b,tx,ty,10,6,[236,200,96]);hdP(b,tx+1,ty+1,[255,240,170]);hdR(b,tx+3,ty+10,4,3,[140,100,40])}}
  // reloj de la cocina y almanaque de la pulpería
  {const cx=19*32+16,cy=8;for(let y=cy-7;y<=cy+7;y++)for(let x=cx-7;x<=cx+7;x++){const d=Math.hypot(x-cx,y-cy);if(d<7.3)hdP(b,x,y,d>6?[52,48,46]:[248,244,232])}hdR(b,cx,cy-5,1,5,[30,30,30]);hdR(b,cx,cy,4,1,[30,30,30]);hdP(b,cx,cy,[200,40,40])}
  {const x=21*32-34,y=20;hdR(b,x,y,16,22,[250,248,240]);hdR(b,x,y,16,6,[200,50,44]);hdText(b,x+2,y+1,'LA',[255,255,255]);for(let j=0;j<3;j++)for(let i=0;i<4;i++)hdR(b,x+2+i*3,y+9+j*4,2,2,[120,120,120]);hdR(b,x+7,y-2,2,3,[60,60,60])}
  // ---- muebles (de atrás para adelante)
  const objs=m.objs.slice().sort((a,c)=>(a.y+a.h)-(c.y+c.h));
  // primero las alfombras
  cjRug(b,3*32+4,5*32+6,4*32-8,3*32-12,'cuarto');cjRug(b,10*32+16,4*32+4,5*32-32,4*32+16,typeof hasD==='function'&&hasD('alfombra')?'azul':'sala');cjRug(b,5*32,12*32+4,2*32,32-6,'bano');
  for(const o of objs)cjObj(b,o,m,up);
  // ---- paredes de adentro en corte (bajitas)
  cjParedV(b,9*32,64,H-32,[5,12]);cjParedH(b,32,9*32,9*32);
  // ---- paredes de los lados y del frente (en corte)
  for(const sx of[0,W-14]){hdR(b,sx,0,14,H,[74,58,52]);hdR(b,sx+(sx?0:13),0,1,H,[110,90,80])}
  hdR(b,0,H-18,W,18,[22,18,18]);hdR(b,0,H-32,W,14,[74,58,52]);hdR(b,0,H-32,W,1,[110,90,80]);
  const dx=CJ.EXIT.x*32;hdR(b,dx,H-32,32,32,[150,144,132]);hdR(b,dx,H-32,32,2,[196,190,178]);
  for(let j=0;j<14;j++)for(let i=0;i<28;i++)hdP(b,dx+2+i,H-48+j,hdS(((i>>1)+(j>>1))%2?[140,104,64]:[122,90,58],.9+hdr(i,j)*.15));hdR(b,dx+2,H-48,28,1,[156,120,84]);hdText(b,dx+5,H-44,'HOLA',[236,214,170]);
  EM.push({k:'lamp',x:3*32+10,y:2*32-14,w:12,h:10});
  return hdToCanvas(b)}
function y_(v){return v}
function cjRug(b,x,y,w,h,k){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const u=i/w,v=j/h,e=Math.min(u,v,1-u,1-v),X=x+i,Y=y+j;let c;
    if(k==='azul'){c=e<.04?[40,70,110]:e<.07?[240,226,180]:((i>>3)+(j>>3))%2?[70,110,160]:[60,96,146];if(Math.abs(Math.abs(u-.5)*2+Math.abs(v-.5)*2-.6)<.025)c=[240,226,180]}
    else if(k==='bano'){c=e<.08?[120,170,200]:[160,206,226];if((i+j)%4===0)c=hdS(c,1.06)}
    else if(k==='cuarto'){c=e<.05?[120,70,60]:((Math.floor(j/5))%3===0)?[210,180,120]:((Math.floor(j/5))%3===1)?[170,90,70]:[110,140,110];if(e<.02)c=[240,226,190]}
    else{if(e<.04)c=[106,42,42];else if(e<.07)c=[216,176,112];else if(e<.13)c=((i+j)>>1)%2?[142,58,58]:[122,48,48];else if(e<.15)c=[216,176,112];else{const du=Math.abs(u-.5),dv=Math.abs(v-.5);c=Math.abs(du*1.8+dv*3-.5)<.03?[200,160,96]:[154,60,60]}}
    hdP(b,X,Y,hdS(c,.94+.06*hdr(X,Y)))}
  for(let i=0;i<w;i+=3){hdP(b,x+i,y-1,[230,220,200]);hdP(b,x+i,y+h,[230,220,200])}hdShadeBand(b,x,y+h+1,w,2,.2,.05)}
function cjParedV(b,X,y0,y1,doors){const x=X+6,w=20;for(let Y=y0;Y<y1;Y++){const ty=Y>>5;if(doors.includes(ty))continue;for(let i=0;i<w;i++){let c=[150,132,118];if(i<2)c=[190,176,162];else if(i>w-3)c=[104,88,78];hdP(b,x+i,Y,hdS(c,.96+hdr(x+i,Y)*.06))}
    for(let k=0;k<8;k++)hdMP(b,x+w+k,Y,[.72+.035*k,.72+.035*k,.76+.03*k])}
  for(const ty of doors){const Y=ty*32;for(const yy of[Y-4,Y+32]){hdR(b,x-2,yy,w+4,4,[120,88,58]);hdR(b,x-2,yy,w+4,1,[160,120,80])}hdR(b,X+2,Y+12,28,8,[150,112,72]);hdR(b,X+2,Y+12,28,1,[186,148,104]);hdR(b,X+2,Y+19,28,1,[100,72,46])}}
function cjParedH(b,x0,x1,Y){const top=Y+2,face=Y+10,bot=Y+30;hdR(b,x0,top,x1-x0,8,[150,132,118]);hdR(b,x0,top,x1-x0,2,[190,176,162]);
  for(let y=face;y<bot;y++)for(let x=x0;x<x1;x++){let c=cjAzulejo(x,y,0);if(y>=bot-3)c=[150,140,130];hdP(b,x,y,hdS(c,.96))}
  hdR(b,x0,face,x1-x0,1,[110,96,86]);for(let k=0;k<6;k++)hdM(b,x0,bot+k,x1-x0,1,[.7+.05*k,.7+.05*k,.74+.045*k])}
// ---------------------------------------------------------------- los muebles
function cjObj(b,o,m,up){const X=o.x*32,Y=o.y*32,W=o.w*32,H=o.h*32;
  switch(o.type){
  case'bed':{const nueva=up('cama'),q=nueva?[44,64,120]:null;
    // cabecera de madera contra la pared
    const WD=hdRamp([138,94,58],7);for(let j=0;j<30;j++)for(let i=0;i<W-4;i++){let k=3;if(j<3)k=5;if(i<2)k=4;if(i>W-8)k=2;if(j>24)k=2;if((i-6)%14===0&&j>5)k=2;hdP(b,X+2+i,Y-26+j,WD[k])}
    hdR(b,X+2,Y-28,W-4,3,WD[6]);for(const px of[X+1,X+W-6])hdR(b,px,Y-32,5,40,WD[4]);
    // colchón y sábanas
    hdBox(b,X+4,Y+2,W-8,H-22,10,[246,244,238],[214,210,204]);
    // cobija: colcha de retazos (o edredón nuevo)
    for(let j=0;j<H-40;j++)for(let i=0;i<W-10;i++){const XX=X+5+i,YY=Y+30+j;let c;
      if(q){c=hdS(q,.9+.12*Math.sin(i*.25+j*.05));if(j<4)c=[230,232,240];if(i<2||i>W-13)c=hdS(c,.82)}
      else{const pi=(i/12|0),pj=(j/12|0),pal=[[200,80,70],[230,190,90],[90,140,180],[120,170,110],[226,140,160],[240,230,210]];c=pal[(pi*3+pj*5)%6];if(i%12===0||j%12===0)c=[250,246,236];c=hdS(c,.9+.08*Math.sin((i+j)*.3));if(j<4)c=[246,240,226]}
      hdP(b,XX,YY,c)}
    for(let i=0;i<W-10;i++){hdP(b,X+5+i,Y+H-12,[0,0,0],.25)}
    // almohadas
    for(const px of nueva?[X+8,X+W/2+1]:[X+12]){const pw=nueva?W/2-10:W-24;hdEll(b,px+pw/2,Y+14,pw/2,7,[252,252,250]);hdEll(b,px+pw/2-2,Y+12,pw/2-4,4,[255,255,255]);hdR(b,px+2,Y+19,pw-4,1,[200,200,210])}
    if(nueva)hdR(b,X+6,Y+H-24,W-12,3,[242,201,76]);
    for(const px of[X+3,X+W-7])hdR(b,px,Y+H-12,4,10,WD[1]);hdR(b,X+3,Y+H-14,W-6,3,WD[3]);   // patas y pie de cama
    break}
  case'night':{hdBox(b,X+4,Y+2,26,10,18,[150,104,64],[124,84,52]);hdInset(b,X+8,Y+15,18,6,[124,84,52]);hdKnob(b,X+16,Y+17);hdInset(b,X+8,Y+23,18,6,[124,84,52]);hdKnob(b,X+16,Y+25);
    hdR(b,X+15,Y-6,3,9,[90,70,50]);for(let j=0;j<12;j++){const ww=8+j*.6;hdR(b,X+16-ww/2,Y-17+j,ww,1,hdS([244,214,150],1-j*.015))}hdR(b,X+10,Y-18,13,1,[255,240,200]);
    hdR(b,X+22,Y-1,5,3,[40,40,46]);hdR(b,X+6,Y,4,4,[200,40,40]);break}   // celular cargando y una vela
  case'ropero':{const WD=hdRamp([128,86,52],7);for(let k=0;k<5;k++)hdM(b,X+W+k,Y-20+k,1,52,[.7+.06*k,.7+.06*k,.74+.05*k]);
    for(let j=0;j<10;j++)for(let i=0;i<W-4;i++)hdP(b,X+2+i,Y-54+j,WD[5-(j>6?1:0)]);
    for(let j=0;j<74;j++)for(let i=0;i<W-4;i++){let k=3;if(i<2)k=5;if(i>W-8)k=1;if(i===(W-4)/2|0||i===((W-4)/2|0)+1)k=1;if(j>68)k=1;const g=Math.sin((Y+j)*.5+hdVN(X+i,Y+j,7,9)*5);if(g>.9&&k===3)k=2;hdP(b,X+2+i,Y-44+j,WD[k])}
    // espejo en una puerta
    for(let j=0;j<44;j++)for(let i=0;i<20;i++){const t=(i+j*.5)%24;hdP(b,X+8+i,Y-38+j,t<3?[230,238,244]:hdMix([150,170,186],[120,138,156],j/44))}hdR(b,X+7,Y-39,22,1,WD[6]);
    hdKnob(b,X+W/2-5,Y-8);hdKnob(b,X+W/2+3,Y-8);hdR(b,X+4,Y+26,4,4,WD[0]);hdR(b,X+W-8,Y+26,4,4,WD[0]);
    hdR(b,X+10,Y-62,18,8,[214,190,150]);hdR(b,X+10,Y-62,18,1,[240,220,186]);hdR(b,X+32,Y-60,16,6,[160,60,60]);break}   // cajas arriba
  case'baul':{const WD=hdRamp([140,90,52],7);hdBox(b,X+4,Y+4,W-8,10,16,WD[4],WD[3]);for(const px of[X+12,X+W-16])hdR(b,px,Y+4,4,26,[90,90,96]);hdR(b,X+W/2-3,Y+15,6,6,[214,176,80]);hdP(b,X+W/2-1,Y+17,[60,40,20]);
    hdR(b,X+10,Y-4,16,10,[226,220,206]);hdR(b,X+11,Y-3,14,1,[200,60,60]);break}   // ropa doblada
  case'desk':{const WD=hdRamp([150,104,64],7);hdBox(b,X+4,Y+2,W-8,12,18,WD[4],WD[3]);
    hdR(b,X+14,Y-22,34,22,[24,24,30]);hdR(b,X+16,Y-20,30,17,[60,110,180]);for(let j=0;j<17;j++)for(let i=0;i<30;i++)if((j%4===1)&&i>3&&i<20+((j*7)%9))hdP(b,X+16+i,Y-20+j,[170,210,240]);hdR(b,X+29,Y-1,4,4,[40,40,46]);hdR(b,X+24,Y+2,14,2,[40,40,46]);
    hdR(b,X+12,Y+6,24,5,[214,214,214]);for(let i=0;i<22;i+=3)hdR(b,X+13+i,Y+7,2,1,[160,160,160]);hdEll(b,X+44,Y+8,3,2,[200,200,200]);hdR(b,X+52,Y-2,6,9,[242,242,236]);hdR(b,X+53,Y-1,4,2,[110,70,40]);
    // silla de escritorio
    hdEll(b,X+30,Y+52,12,4,[20,20,24],.3);hdR(b,X+20,Y+34,20,14,[40,40,46]);hdR(b,X+20,Y+34,20,2,[80,80,90]);hdR(b,X+28,Y+48,4,6,[60,60,66]);hdR(b,X+22,Y+54,16,2,[40,40,46]);break}
  case'ducha':{// plato, azulejos, cortina y la ducha eléctrica
    for(let j=0;j<H-6;j++)for(let i=0;i<W-6;i++)hdP(b,X+3+i,Y+3+j,cjAzulejo(X+i,Y+j,0));hdR(b,X+3,Y+H-6,W-6,4,[236,236,232]);hdEll(b,X+W/2,Y+H/2,3,2,[120,130,136]);
    hdR(b,X+W/2-6,Y-10,12,9,[244,244,240]);hdR(b,X+W/2-6,Y-10,12,2,[255,255,255]);hdR(b,X+W/2-1,Y-1,3,5,[200,200,206]);hdEll(b,X+W/2,Y+5,5,2,[214,214,220]);
    hdLine(b,X+W/2+6,Y-6,X+W/2+20,Y-14,[30,30,30]);hdLine(b,X+W/2+6,Y-4,X+W/2+22,Y-10,[200,40,40]);   // los cables pelados, como debe ser
    for(let j=0;j<H-8;j++)for(let i=0;i<10;i++){const c=hdS([110,190,200],.82+.2*Math.sin(i*1.6));hdP(b,X+W-14+i,Y+2+j,c)}hdR(b,X+2,Y,W-4,2,[200,200,206]);break}
  case'inodoro':{hdEll(b,X+17,Y+28,10,3,[20,30,40],.25);hdR(b,X+8,Y-8,18,12,[246,246,244]);hdR(b,X+8,Y-8,18,2,[255,255,255]);hdR(b,X+22,Y-6,3,2,[200,200,206]);
    hdEll(b,X+17,Y+14,10,11,[240,240,238]);hdEll(b,X+17,Y+14,7,8,[206,214,218]);hdEll(b,X+17,Y+15,5,6,[150,196,214]);hdR(b,X+11,Y+22,12,6,[230,230,228]);
    hdR(b,X+27,Y+4,4,10,[250,250,250]);hdR(b,X+27,Y+4,4,2,[200,200,200]);break}   // rollo de papel
  case'lavatorio':{// espejo en la pared en corte y el lavatorio de pedestal
    hdR(b,X+5,Y-30,22,20,[160,140,110]);hdR(b,X+7,Y-28,18,16,[190,214,226]);hdR(b,X+9,Y-27,3,10,[236,244,250]);
    hdR(b,X+14,Y+10,6,16,[236,236,232]);hdEll(b,X+17,Y+6,13,7,[246,246,244]);hdEll(b,X+17,Y+6,9,4,[196,210,216]);hdR(b,X+16,Y-2,2,5,[180,180,186]);
    hdR(b,X+26,Y-4,4,7,[90,170,210]);hdR(b,X+27,Y-8,1,4,[240,200,60]);break}   // vaso con cepillo
  case'canasto':{hdEll(b,X+16,Y+26,10,3,[20,20,24],.25);for(let j=0;j<16;j++)for(let i=0;i<18;i++)hdP(b,X+7+i,Y+8+j,hdS([186,150,96],((i+j)%4<2?1:.85)));hdR(b,X+6,Y+6,20,3,[160,124,76]);hdR(b,X+9,Y+3,8,4,[90,130,200]);break}
  case'tvmueble':{const WD=hdRamp([128,84,50],7);hdBox(b,X+4,Y+2,W-8,10,22,WD[4],WD[3]);hdInset(b,X+10,Y+16,W/2-14,12,WD[3]);hdInset(b,X+W/2+4,Y+16,W/2-14,12,WD[3]);hdKnob(b,X+W/2-6,Y+21);hdKnob(b,X+W/2+6,Y+21);hdLace(b,X+16,Y+3,W-32,4);
    const plana=up('sala'),tw=plana?66:46,th=plana?36:30,tx=X+(W-tw)/2,ty=Y+2-th-(plana?2:0);
    if(plana){hdR(b,tx,ty,tw,th,[16,16,20]);hdR(b,tx+2,ty+2,tw-4,th-4,[40,110,60]);hdR(b,X+W/2-8,Y,16,4,[30,30,34])}
    else{hdR(b,tx-2,ty-2,tw+4,th+6,[54,52,56]);hdR(b,tx-2,ty-2,tw+4,2,[90,88,92]);hdR(b,tx+2,ty+2,tw-14,th-4,[40,110,60]);for(let k=0;k<3;k++)hdEll(b,tx+tw-6,ty+6+k*7,2,2,[120,120,126]);hdLine(b,tx+tw/2-6,ty-3,tx+tw/2-14,ty-14,[40,40,40]);hdLine(b,tx+tw/2+4,ty-3,tx+tw/2+12,ty-14,[40,40,40])}
    m.tv={x:tx+2,y:ty+2,w:plana?tw-4:tw-14,h:th-4};
    hdR(b,X+8,Y-8,8,8,[230,200,120]);hdR(b,X+9,Y-7,6,1,[255,240,190]);break}   // la Virgencita de yeso al lado de la tele
  case'mesacentro':{const WD=hdRamp([150,100,60],7);hdBox(b,X+8,Y+6,W-16,12,10,WD[4],WD[2]);hdLace(b,X+30,Y+7,W-60,6);hdEll(b,X+W/2,Y+10,9,4,[200,190,170]);
    for(const[fx,fc]of[[-4,[240,120,40]],[2,[230,200,60]],[6,[120,170,70]]])hdEll(b,X+W/2+fx,Y+8,3,3,fc);hdR(b,X+20,Y+10,10,4,[30,30,34]);hdR(b,X+21,Y+11,2,1,[200,40,40]);break}   // frutero y control
  case'sofa':{// visto de espaldas (mira hacia la tele): el respaldar y los cojines de arriba
    const nuevo=up('sala'),G=nuevo?['#3a4250','#465060','#525e70','#5e6a7e','#6a778c','#7c889c','#909cae']:['#4a1e1a','#62261f','#7a3a2c','#8e4436','#a24e3e','#b85e4a','#cc7a64'];const P_=G.map(hdC);
    for(let k=0;k<5;k++)hdM(b,X+6,Y+30+k,W-8,1,[.66+.06*k,.66+.06*k,.7+.06*k]);
    for(let y=Y-4;y<Y+6;y++)for(let x=X+10;x<X+W-10;x++){const u=((x-X-10)%((W-20)/3|0));hdP(b,x,y,P_[u<2?3:4])}   // cojines del asiento (se asoman)
    for(let y=Y+4;y<Y+28;y++){const v=(y-Y-4)/24;for(let x=X+4;x<X+W-4;x++){let k=Math.round(5-v*3.2);if(y<Y+7)k=6;if(x<X+6||x>X+W-7)k=Math.max(1,k-1);hdP(b,x,y,P_[Math.max(0,Math.min(6,k))])}}
    for(const sx of[X,X+W-10])for(let y=Y-2;y<Y+28;y++)for(let x=sx;x<sx+10;x++){const u=(x-sx)/9;let k=y<Y+2?6:Math.round(4.6-(y-Y)/30*2.4-(u>.75?1.2:0)+(u<.2?.6:0));hdP(b,x,y,P_[Math.max(0,Math.min(6,k))])}
    hdR(b,X+W/2-10,Y-6,20,8,nuevo?[242,201,76]:[236,220,180]);hdR(b,X+W/2-10,Y-6,20,1,[255,255,255]);hdLace(b,X+30,Y+5,W-60,5);break}   // cojín y carpetita
  case'lampara':{const x=X+14,y=Y+28;hdEll(b,x+2,y,7,3,[20,20,24],.3);hdR(b,x,y-44,3,44,[60,56,54]);for(let j=0;j<14;j++)hdR(b,x+1-7+j*.25,y-58+j,14-j*.5,1,hdS([244,226,170],1-j*.01));hdEll(b,x+1,y-44,4,2,[255,236,170]);break}
  case'sonido':{const x=X+2,y=Y-6;hdR(b,x+6,y+8,20,14,[34,34,40]);hdR(b,x+8,y+10,16,3,[90,200,255]);hdR(b,x+8,y+15,6,2,[200,60,60]);for(const sx of[x-2,x+24]){hdR(b,sx,y+2,9,26,[26,26,30]);hdR(b,sx,y+2,9,1,[70,70,76]);hdEll(b,sx+4.5,y+9,3,3,[80,80,90]);hdEll(b,sx+4.5,y+19,3.5,3.5,[80,80,90])}hdEll(b,x+15,y+30,14,3,[20,20,24],.25);break}
  case'radio':{hdBox(b,X+4,Y+8,24,8,14,[150,104,64],[124,84,52]);hdR(b,X+7,Y-4,18,12,[110,70,40]);hdR(b,X+9,Y-2,8,8,[214,190,140]);hdEll(b,X+21,Y+2,2,2,[200,200,200]);hdLine(b,X+22,Y-4,X+30,Y-16,[180,180,186]);break}
  case'camaperro':{hdEll(b,X+16,Y+20,15,8,[150,70,60]);hdEll(b,X+16,Y+19,11,5,[214,190,160]);hdEll(b,X+20,Y+18,5,3,[240,230,210]);hdR(b,X+2,Y+24,6,3,[200,200,206]);hdR(b,X+3,Y+23,4,1,[160,110,70]);break}
  case'zapatera':{hdBox(b,X+3,Y+6,26,6,18,[150,104,64],[124,84,52]);for(const[sx,c]of[[6,[40,40,46]],[16,[220,220,220]]]){hdR(b,X+sx,Y+3,8,4,c);hdR(b,X+sx,Y+3,8,1,hdS(c,1.3))}hdR(b,X+22,Y-14,3,22,[60,60,66]);hdEll(b,X+23,Y-15,4,2,[200,60,60]);break}   // tenis y sombrilla
  case'fregadero':{// mueble, pila de acero, escurridor
    hdBox(b,X+1,Y+2,W-2,10,22,[214,208,198],[226,222,214]);for(const ix of[X+4,X+W/2+2]){hdInset(b,ix,Y+15,W/2-6,14,[214,208,198]);hdKnob(b,ix+W/2-12,Y+20)}
    hdR(b,X+8,Y+3,26,8,[176,182,188]);hdR(b,X+10,Y+4,22,6,[130,138,146]);hdR(b,X+20,Y-6,2,8,[190,196,200]);hdR(b,X+20,Y-6,6,2,[190,196,200]);
    for(let i=0;i<4;i++)hdEll(b,X+44+i*4,Y+2,1.6,5,[[230,230,236],[200,80,70],[230,230,236],[80,140,200]][i]);hdR(b,X+40,Y+6,20,2,[180,180,186]);break}
  case'stove':{const gas=up('refri');if(gas){hdBox(b,X+1,Y-4,30,12,26,[40,40,46],[30,30,34]);for(const[bx,by]of[[8,0],[21,0],[8,5],[21,5]])hdEll(b,X+1+bx,Y-4+by+2,4,1.6,[70,150,220],.8)}
    else{hdBox(b,X+1,Y-4,30,12,26,[240,240,236],[232,232,228]);hdR(b,X+2,Y-3,28,10,[42,42,46]);for(const[bx,by]of[[8,2],[21,2],[8,7],[21,7]])hdEll(b,X+1+bx,Y-4+by,3.5,1.6,[96,96,104]);hdR(b,X+4,Y+12,24,14,[42,42,46]);hdR(b,X+6,Y+15,20,5,[80,64,60])}
    // olla de frijoles
    hdEll(b,X+10,Y-4,7,3,[60,60,66]);hdR(b,X+3,Y-12,14,9,[150,156,160]);hdR(b,X+3,Y-12,4,9,[200,206,210]);hdEll(b,X+10,Y-12,7,2,[120,126,130]);hdR(b,X+1,Y-10,2,2,[60,60,66]);hdR(b,X+17,Y-10,2,2,[60,60,66]);break}
  case'mostrador':{hdBox(b,X+1,Y+2,W-2,10,22,[214,176,140],[200,192,178]);hdInset(b,X+6,Y+15,W/2-10,14,[200,192,178]);hdInset(b,X+W/2+4,Y+15,W/2-10,14,[200,192,178]);
    // el chorreador con su bolsita de tela, el tarro del café y el pan
    const cx=X+14;hdR(b,cx-1,Y-18,2,18,[120,80,46]);hdR(b,cx+8,Y-18,2,18,[120,80,46]);hdR(b,cx-3,Y-20,15,3,[150,104,64]);for(let j=0;j<10;j++){const ww=10-(j>>1);hdR(b,cx+4-(ww>>1),Y-16+j,ww,1,[240,232,214])}hdR(b,cx,Y-4,10,6,[230,230,226]);hdR(b,cx+2,Y-3,6,4,[90,60,40]);
    hdR(b,X+34,Y-8,10,10,[200,60,50]);hdR(b,X+34,Y-8,10,2,[230,90,80]);hdR(b,X+36,Y-3,6,3,[255,240,200]);
    hdEll(b,X+52,Y-2,8,4,[214,160,80]);hdEll(b,X+51,Y-3,5,2,[240,200,120]);break}
  case'fridge':{const ac=up('refri'),c=ac?[200,208,214]:[236,238,238];for(let k=0;k<5;k++)hdM(b,X+30+k,Y-26+k,1,58,[.72+.05*k,.72+.05*k,.76+.05*k]);hdBox(b,X+1,Y-38,29,6,64,hdS(c,1.04),c,false);hdR(b,X+1,Y-14,29,1,[150,156,158]);
    hdR(b,X+24,Y-30,2,10,[160,166,168]);hdR(b,X+24,Y-8,2,16,[160,166,168]);for(const[mx,my,mc]of[[6,-28,[224,48,48]],[12,-26,[240,192,48]],[8,-6,[58,122,208]],[14,0,[90,170,90]]])hdR(b,X+mx,Y+my,4,4,mc);
    hdR(b,X+5,Y+4,12,14,[255,255,255]);hdR(b,X+5,Y+4,12,3,[216,64,64]);hdR(b,X+6,Y+9,8,1,[150,150,150]);hdR(b,X+6,Y+12,6,1,[150,150,150]);break}   // la lista del súper
  case'desayunador':{const WD=hdRamp([150,104,64],7);hdBox(b,X+2,Y+4,W-4,10,18,[226,214,190],WD[3]);for(let i=X+10;i<X+W-8;i+=40)hdInset(b,i,Y+17,30,8,WD[3]);
    hdEll(b,X+30,Y+8,6,3,[250,250,246]);hdR(b,X+28,Y+2,5,6,[250,250,246]);hdR(b,X+29,Y+3,3,2,[90,60,40]);hdR(b,X+80,Y+4,8,6,[240,200,60]);break}   // taza de café y un queque
  case'banco':{hdEll(b,X+16,Y+22,9,3,[20,20,24],.25);hdEll(b,X+16,Y+6,9,4,[150,104,64]);hdEll(b,X+16,Y+5,7,2.5,[186,140,96]);for(const lx of[X+9,X+21])hdR(b,lx,Y+8,2,14,[110,74,44]);hdR(b,X+10,Y+16,12,1,[110,74,44]);break}
  case'table':{for(let k=0;k<5;k++)hdM(b,X+W+k,Y+6+k,1,H-6,[.7+.06*k,.7+.06*k,.74+.05*k]);
    for(let j=0;j<H-20;j++)for(let i=0;i<W-8;i++){const XX=X+4+i,YY=Y+4+j,ch=(((i>>3)+(j>>3))&1);let c=ch?[214,60,56]:[248,244,236];if(((i>>3)&1)&&((j>>3)&1))c=[236,170,168];hdP(b,XX,YY,hdS(c,.93+.07*j/(H-20)))}
    for(let i=0;i<W-8;i++){const L=8+Math.round(1.5*Math.sin(i*.35)),f=.86+.1*Math.sin(i*.55);for(let j=0;j<L;j++){const ch=((((i)>>3)+((H-16+j)>>3))&1);hdP(b,X+4+i,Y+H-16+j,hdS(ch?[214,60,56]:[248,244,236],f-.03*j))}}
    hdR(b,X+8,Y+H-6,3,6,[90,58,34]);hdR(b,X+W-11,Y+H-6,3,6,[90,58,34]);
    // libretas, salero, frutero y una mata
    hdR(b,X+14,Y+12,14,10,[63,127,209]);hdR(b,X+14,Y+12,14,2,[100,160,230]);hdR(b,X+30,Y+14,12,9,[214,176,82]);hdR(b,X+31,Y+15,10,1,[255,230,160]);
    hdR(b,X+W/2+6,Y+10,3,6,[250,250,250]);hdR(b,X+W/2+10,Y+10,3,6,[60,60,60]);hdEll(b,X+W-24,Y+20,9,5,[176,90,52]);for(let t=0;t<26;t++){const a=-Math.PI*hsh(t,X),r=2+hsh(X,t)*7;hdP(b,X+W-24+Math.cos(a)*r,Y+16+Math.sin(a)*r*.8,t%3?[74,138,74]:[110,168,90])}break}
  case'chair':{const right=!!o.der,WD=[[62,36,20],[90,52,32],[122,74,46],[154,102,64]];hdR(b,X+8,Y+26,18,3,[40,30,30],.3);
    hdR(b,X+8,Y+10,18,8,WD[2]);hdR(b,X+8,Y+10,18,1,WD[3]);hdR(b,X+10,Y+11,14,5,[200,58,58]);for(const lx of[X+9,X+23])hdR(b,lx,Y+18,2,9,WD[1]);
    const bx=right?X+25:X+7;hdR(b,bx,Y-8,3,26,WD[2]);hdR(b,bx,Y-8,1,26,WD[3]);for(const yy of[Y-6,Y])hdR(b,right?bx-1:bx,yy,4,2,WD[1]);break}
  case'plant':{hdR(b,X+7,Y+14,18,14,[176,90,52]);hdR(b,X+7,Y+14,18,1,[224,144,106]);hdR(b,X+21,Y+14,4,14,[138,68,40]);hdR(b,X+6,Y+12,20,3,[200,112,72]);hdR(b,X+8,Y+12,16,2,[58,36,24]);
    for(let n=0;n<30;n++){const a=-Math.PI*(.05+.9*hsh(n,X+Y)),L=9+hsh(X,n)*14;for(let t=0;t<L;t++){const px=X+16+Math.cos(a)*t,py=Y+12+Math.sin(a)*t*.9,w2=Math.round(2.4*Math.sin(t/L*Math.PI));for(let k=-w2;k<=w2;k++)hdP(b,px+k*.6,py+k*.3,t/L>.6?[110,160,76]:t/L>.3?[78,128,58]:[56,98,46])}}break}
  }}
// ---------------------------------------------------------------- pintar la casa nueva en vez de la vieja
{const _hi=hdInterior;hdInterior=function(m){if(m&&m.casaJ)return hdCasaJ(m);return _hi(m)}}
{const _he=hdEnsure;hdEnsure=function(m){const was=m&&m.hdDirty;_he(m);if(was&&m.casaJ)m.top2=null}}
// ---------------------------------------------------------------- lo que se mueve: cielo en las ventanas, rayos de sol, tele, vapor y abanico
var CJV={dust:[],steam:[]};
function cjSky(h){if(h<5||h>=19.5)return[[16,22,52],[30,36,70]];if(h<6.5)return[[80,90,150],[236,160,120]];if(h<16.5)return[[110,170,226],[200,226,240]];if(h<18.3)return[[110,120,180],[250,170,100]];return[[40,40,96],[180,90,100]]}
hookAfter('zoneGround',function(g){const m=MAPS[P.map];if(!m||!m.casaJ||!m.win)return;const h=S.t/60,sk=cjSky(h),t=performance.now()/1000;
  for(const w of m.win){const x=w.x/2,y=w.y/2,ww=w.w/2,hh=w.h/2;for(let j=0;j<hh;j+=.5){const k=j/hh;g.fillStyle='rgb('+hdMix(sk[0],sk[1],Math.min(1,k*1.5)).map(v=>v|0).join(',')+')';g.fillRect(x,y+j,ww,.5)}
    if(h>=5&&h<19)for(let i=0;i<ww;i+=1.5){const hg=hh*(.45+.15*Math.sin(i*.9+w.x));g.fillStyle=h>17.5?'#3a5a40':'#5a8a4a';g.fillRect(x+i,y+hg,1.5,hh-hg)}   // los árboles de afuera
    else{g.fillStyle='rgba(255,255,230,.9)';for(let i=0;i<4;i++)g.fillRect(x+hsh(i,w.x)*ww,y+hsh(w.x,i)*hh*.5,.5,.5)}
    g.fillStyle='#242020';for(let i=2;i<ww;i+=3)g.fillRect(x+i,y,.5,hh);g.fillRect(x,y+5.5,ww,.5);g.fillRect(x,y+11.5,ww,.5)}
  // la tele encendida
  if(m.tv){const tv=m.tv,x=tv.x/2,y=tv.y/2,w=tv.w/2,hh=tv.h/2;g.fillStyle='#2f7a3e';g.fillRect(x,y,w,hh);g.fillStyle='#3a8c48';g.fillRect(x,y+hh*.5,w,hh*.5);g.fillStyle='rgba(240,240,240,.8)';g.fillRect(x+w/2,y,.5,hh);
    const px=x+w*(.5+.4*Math.sin(t*.7)),py=y+hh*(.5+.3*Math.sin(t*1.1));g.fillStyle='#fff';g.fillRect(px,py,1,1);g.fillStyle='#d23038';g.fillRect(x+w*(.3+.2*Math.sin(t*.5)),y+hh*.3,1,1.5);g.fillStyle='#2e6fd1';g.fillRect(x+w*(.7+.15*Math.cos(t*.6)),y+hh*.65,1,1.5);
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,y+hh-2,w,2);g.fillStyle='#f2c94c';g.fillRect(x+1,y+hh-1.5,6,1)}});
hookAfter('zoneAir',function(g){const m=MAPS[P.map];if(!m||!m.casaJ)return;const t=performance.now()/1000,h=S.t/60;
  // vapor de la olla a la hora de comer
  if((h>=6&&h<8.5)||(h>=11&&h<13.5)||(h>=17.5&&h<20)){CJV.k=(CJV.k||0)+1;if(CJV.k%12===0)CJV.steam.push({x:17*T+5+(hsh(CJV.k,3)-.5)*4,y:2*T-6,t:0});}
  for(const s of CJV.steam){s.t+=1/60;s.y-=8/60;s.x+=Math.sin(s.t*3)*.1;const a=Math.max(0,.35*(1-s.t/2));g.fillStyle='rgba(240,240,240,'+a.toFixed(2)+')';g.beginPath();g.arc(s.x,s.y,1+s.t*1.6,0,7);g.fill()}CJV.steam=CJV.steam.filter(s=>s.t<2);
  // abanico de techo
  if(typeof hasD==='function'&&hasD('abanico')){const cx=12.5*T,cy=5.6*T,a=t*7;g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.ellipse(cx+3,cy+22,14,4,0,0,7);g.fill();
    for(let k=0;k<4;k++){const an=a+k*Math.PI/2;g.save();g.translate(cx,cy);g.scale(1,.5);g.rotate(an);g.fillStyle='rgba(140,100,62,.85)';g.fillRect(2,-2,15,4);g.fillStyle='rgba(176,132,86,.85)';g.fillRect(2,-2,15,1.5);g.restore()}
    g.fillStyle='#c8c8ce';g.beginPath();g.ellipse(cx,cy,3.5,2.4,0,0,7);g.fill();g.fillStyle='#ececf0';g.fillRect(cx-2,cy-2,3,1);g.fillStyle='#808086';g.fillRect(cx-.5,cy-12,1,10)}});
// rayos de sol que entran por las ventanas (después de la luz, para que brillen)
hookAfter('hdLight',function(m,cx,cy){if(!m||!m.casaJ||!m.win)return;const h=S.t/60;if(h<6.3||h>17.8||S.rain)return;const a=Math.min(1,(h-6.3)/1.2,(17.8-h)/1.2)*.32;
  const sl=(h-12)*-9;ctx.save();ctx.setTransform(Z,0,0,Z,-cx*Z,-cy*Z);ctx.globalCompositeOperation='lighter';
  for(const w of m.win){const x0=w.x/2,x1=(w.x+w.w)/2,top=32,L=34+Math.abs(sl)*.4;const warm=h>16?'255,190,120':'255,240,200';
    for(let s=0;s<6;s++){const u0=s/6,u1=(s+.82)/6,xa=x0+(x1-x0)*u0,xb=x0+(x1-x0)*u1;ctx.fillStyle='rgba('+warm+','+a.toFixed(3)+')';ctx.beginPath();ctx.moveTo(xa,top);ctx.lineTo(xb,top);ctx.lineTo(xb+sl,top+L);ctx.lineTo(xa+sl,top+L);ctx.fill()}
    // polvito flotando en el rayo
    const t=performance.now()/1000;ctx.fillStyle='rgba(255,250,230,'+(a*2).toFixed(2)+')';for(let i=0;i<10;i++){const u=(hsh(i,w.x)+t*.02*(1+i%3))%1,v=(hsh(w.x,i)+t*.03)%1;ctx.fillRect(x0+(x1-x0)*u+sl*v,top+L*v,.5,.5)}}
  ctx.restore()});
// ---------------------------------------------------------------- lo nuevo que se puede usar
{const _ft=furnTalk;furnTalk=function(o,m){if(!m||!m.casaJ)return _ft(o,m);const e=typeof E==='function'?E():null;
  switch(o.act){
  case'ducha':if(e&&e.cut&&e.cut.agua){say(null,'No hay agua. Otra vez. Hay un balde lleno en la pila, por si acaso.');return}
    if(PGS().ducha===S.day){say(null,'Ya te bañaste hoy. El recibo del agua no perdona.');return}
    say(null,'La ducha eléctrica hace «tic, tic, tic»… y sale el agua tibiecita. No toqués el tubo.',[{t:'Bañarse (15 min · +8⚡)',f(){afterD(()=>fadeDo(()=>{passTime(15);PGS().ducha=S.day;enAdd(8)},()=>toast('🚿 Quedaste como nuevo. Oliendo a jabón Rosas.')))}},{t:'Ahorita no'}]);return;
  case'inodoro':say(null,pick(['Todo en orden. Hay un rollo de papel y medio. Hay que comprar más.','En la pared alguien escribió con lápiz: «aquí estuvo Nicolás». Clásico.']));return;
  case'lavatorio':say(null,'Te lavás la cara con agua fría. El espejo dice que dormiste poco.');enAdd(1);return;
  case'ropero':say(null,'El ropero huele a naftalina y a ropa limpia. Hay una camiseta de la Sele, una jacket para el frío de Chepe y la ropa de domingo.');return;
  case'baul':say(null,'En el baúl están las cosas de la abuela: un rosario, fotos en blanco y negro y una carta que nunca abriste.');return;
  case'mesacentro':say(null,'La carpetita tejida, el frutero y el control de la tele, que se perdió y apareció tres veces esta semana.');return;
  case'sonido':say(null,'Ponés una cumbia. Las ventanas vibran y en algún lado ladra un perro.');return;
  case'radio':say(null,'La radio vieja agarra solo una emisora: la de las rancheras. Y está bien así.');return;
  case'camaperro':say(null,'La camita de Firulais tiene pelos, una chancleta mordida y un hueso de plástico.');return;
  case'zapatera':say(null,'Tus tenis, unas chancletas y la sombrilla, por si a las dos se cae el cielo.');return;
  case'cafe':say(null,'El chorreador con la bolsita de tela, el tarro del café y pan de la pulpería.',[{t:'Chorrear un cafecito (5 min · +4⚡)',f(){afterD(()=>fadeDo(()=>{passTime(5);enAdd(4)},()=>toast('☕ Café chorreado. Ahora sí arranca el día.')))}},{t:'Nada'}]);return;
  case'desayunador':say(null,'El desayunador con una taza de café a medio tomar y un queque de la pulpería.');return;
  case'canasto':say(null,'El canasto de la ropa sucia. Ya va por la mitad. Ya va por la mitad desde el martes.');return}
  return _ft(o,m)}}
// la casa nueva desde el arranque (las partidas viejas también)
if(typeof BMAP!=='undefined'&&BMAP.casa_jugador){const m=genCasaJ(BMAP.casa_jugador);renderMap(m)}
