// ================= PROGRESO · LA CASA CRECE =================
// Ampliaciones que se ven desde la calle (cochera, segundo piso, terraza, tallercito) y decoración por dentro
// que suma comodidad: dormís mejor, te visitan y el barrio lo comenta.
Object.assign(HUP,{
 cochera:{n:'Cochera techada',ic:'🅿️',cat:'Ampliaciones',lv:[{n:'Cochera con techo de zinc',c:22000,d:2,t:'Tu vehículo queda bajo techo: no se moja y ya no se lo roban.'}]},
 tallerC:{n:'Tallercito en el patio',ic:'🛠',cat:'Ampliaciones',lv:[{n:'Galerón con herramientas',c:26000,d:2,t:'Arreglás tus vehículos vos mismo (más barato) y le arreglás bicis a los vecinos por plata.'}]},
 segundo:{n:'Segundo piso',ic:'🏗',cat:'Ampliaciones',lv:[{n:'Segundo piso',c:95000,d:6,req:['techo',1],t:'La casa crece para arriba: más comodidad y un cuarto que se puede alquilar a un estudiante.'}]},
 terraza:{n:'Terraza',ic:'🌇',cat:'Ampliaciones',lv:[{n:'Terraza con lucecitas',c:38000,d:3,req:['segundo',1],t:'Una terraza en el segundo piso para ver el atardecer… y para hacer fiestas.'}]}});
HCATS.push('Ampliaciones');
function progTwoStory(){return typeof U==='function'&&!!(S&&S.f&&S.f.eco)&&U('segundo')>0}
// ---- por fuera (HD) ----
{const _hb=hdHomeBase;hdHomeBase=function(B,m){_hb(B,m);if(!S||!S.f||!S.f.eco)return;const b=BMAP.casa_jugador,X=b.x*HT,Y=b.y*HT,W=b.w*HT;
  if(U('cochera')){const cx=6*HT,cy=17*HT;for(let j=0;j<HT;j++)for(let i=0;i<3*HT;i++)hdP(B,cx+i,cy+j,hdS([176,174,168],.94+hdr(cx+i,cy+j)*.08));hdEll(B,cx+50,cy+18,12,4,[60,58,56],.3);
    for(const px of[cx+2,cx+3*HT-6])hdR(B,px,cy-26,4,HT+24,[110,112,118])}
  if(U('tallerC')){const sx=2*HT,sy=5*HT,sw=2*HT,sh=2*HT;hdEll(B,sx+sw/2+4,sy+sh+2,sw/2+6,6,[30,40,20],.28);hdRoofZinc(B,sx-4,sy-6,sw+8,24,'#9aa1a6',57,false);
    for(let j=18;j<sh;j++)for(let i=0;i<sw;i++)hdP(B,sx+i,sy+j,hdS(i%8===0?[118,92,66]:[150,120,90],.92+hdr(sx+i,sy+j)*.1));
    hdR(B,sx+6,sy+22,sw-12,sh-26,[34,30,32]);hdR(B,sx+8,sy+24,sw-16,10,[70,64,60]);
    for(const[i,c]of[[0,[200,60,50]],[1,[180,180,186]],[2,[230,180,60]],[3,[180,180,186]],[4,[60,120,200]]])hdR(B,sx+11+i*9,sy+26,2,7+(i%2)*3,c);
    hdR(B,sx+10,sy+42,sw-20,3,[120,80,46]);hdEll(B,sx+18,sy+sh-6,5,5,[24,24,28]);hdEll(B,sx+18,sy+sh-6,2,2,[150,150,156]);hdEll(B,sx+40,sy+sh-6,5,5,[24,24,28]);hdEll(B,sx+40,sy+sh-6,2,2,[150,150,156]);hdR(B,sx+18,sy+sh-10,22,2,[192,71,59]);
    hdSurSign(B,sx+8,sy+11,sw-16,10,'#e6c846','TALLER','#28201a',1);
    for(let k=0;k<3;k++){hdEll(B,sx+sw+8,sy+sh-4-k*6,7,3.4,[30,30,34]);hdEll(B,sx+sw+8,sy+sh-4-k*6,3,1.4,[70,70,76])}}
  if(progTwoStory()&&U('terraza')){const tx=X+W/2+4,ty=Y+8,tw=W/2-14,th=52;for(let j=0;j<th;j++)for(let i=0;i<tw;i++){const u=i&15,v=j&15;hdP(B,tx+i,ty+j,(u===0||v===0)?[170,160,148]:hdS([206,192,170],.94+hdr(tx+i,ty+j)*.08))}
    hdR(B,tx,ty+th-4,tw,4,[240,236,226]);for(let i=0;i<tw;i+=6)hdR(B,tx+i,ty+th-16,2,12,[240,236,226]);hdR(B,tx,ty+th-16,tw,2,[250,248,240]);
    for(const px of[tx+12,tx+tw-26]){hdR(B,px,ty+20,14,12,[192,71,59]);hdR(B,px+2,ty+14,10,6,[214,96,80])}hdPlantPot(B,tx+tw/2-4,ty+30,true)}
  if(U('tallerC'))HD_EMIT.push({k:'win',x:2*HT+8,y:5*HT+24,w:2*HT-16,h:20})}}
{const _ht=hdHomeTop;hdHomeTop=function(tg){_ht(tg);if(!S||!S.f||!S.f.eco)return;
  if(U('cochera')){const b=hdBuf(3*HT+12,26);hdRoofZinc(b,0,0,3*HT+12,22,'#b9c0c6',63,true);hdR(b,0,22,3*HT+12,3,[90,96,100]);tg.drawImage(hdToCanvas(b),6*HT-6,17*HT-36)}
  if(progTwoStory()&&U('terraza')){const X=BMAP.casa_jugador.x*HT,W=BMAP.casa_jugador.w*HT,tx=X+W/2+4,tw=W/2-14,b=hdBuf(tw,14);for(let i=0;i<tw;i++)hdP(b,i,4+Math.sin(i/tw*Math.PI*2)*2,[50,46,44]);
    for(let i=4;i<tw;i+=9)hdEll(b,i,6+Math.sin(i/tw*Math.PI*2)*2,1.6,2,[[255,214,120],[255,150,150],[150,220,255],[180,255,170]][(i/9|0)%4]);tg.drawImage(hdToCanvas(b),tx,BMAP.casa_jugador.y*HT+4)}}}
// las luces de la terraza y el taller se encienden de noche
{const _ah=applyHome;applyHome=function(){const r=_ah();const m=MAPS.ext;if(m&&S&&S.f&&S.f.eco){for(const[x,y]of[[2,5],[3,5],[2,6],[3,6]])m.s[y*m.w+x]=U('tallerC')?1:0;
    m.lights=m.lights.filter(l=>!l.pgHome);if(U('terraza'))m.lights.push({x:7.1*T,y:11.8*T,r:54,pgHome:1});if(U('cochera'))m.lights.push({x:7.5*T,y:17*T,r:30,pgHome:1});
    const im=MAPS.casa_jugador;if(im){im.hdDirty=true}}return r}}
// ---- decoración (dentro de la casa) ----
const DECO={matas:{n:'Matas de interior',ic:'🪴',c:2500,p:2,t:'Dos matas en macetas de barro. Purifican el aire y le dan vida a la sala.'},
 cuadro:{n:'Cuadros de la Negrita y del Arenal',ic:'🖼',c:3000,p:2,t:'Como en toda casa tica que se respete.'},
 sele:{n:'Afiche de la Sele',ic:'⚽',c:1500,p:1,t:'Brasil 2014, el año que soñamos. Para la pared del cuarto.'},
 lampara:{n:'Lámpara de pie',ic:'💡',c:4000,p:2,t:'Luz amarillita para leer y para las visitas.'},
 cortinas:{n:'Cortinas de flores',ic:'🌺',c:3500,p:2,t:'Las de la abuela eran iguales. Le quitan el sol de la tarde a la sala.'},
 alfombra:{n:'Alfombra nueva',ic:'🟥',c:5500,p:3,t:'Suavecita, para la sala. Adiós a la alfombra mordida por el perro.'},
 abanico:{n:'Abanico de techo',ic:'🌀',c:7000,p:4,t:'Para las noches de verano en que hace un calor del diablo.'},
 trofeos:{n:'Repisa con trofeos',ic:'🏆',c:5000,p:2,t:'Para lucir medallas y trofeos de las mejengas y del barrio.'},
 sonido:{n:'Equipo de sonido',ic:'🔊',c:12000,p:4,t:'Con bajos que hacen temblar las ventanas. Ideal para fiestas (y para molestar a los vecinos).'},
 perro:{n:'Camita para Firulais',ic:'🐕',c:2500,p:2,t:'Para que el perro deje de dormir encima de tus tenis.'}};
const hasD=k=>!!(S&&S.f&&S.f.pg&&S.f.pg.decor&&S.f.pg.decor[k]);
function comfort(){if(!S||!S.f||!S.f.eco)return 0;let c=4;for(const[k,p]of[['cama',3],['sala',3],['piso',2],['refri',1],['compu',1],['segundo',6],['terraza',3],['techo',2],['tanque',1]])c+=U(k)?p:0;for(const k in DECO)if(hasD(k))c+=DECO[k].p;return c}
const COMF=[[0,'Rancho','Lo justo para sobrevivir.'],[10,'Casita','Ya se siente hogar.'],[18,'Hogar','Da gusto llegar.'],[26,'Casa bonita','Los vecinos la comentan.'],[34,'Casa de revista','Hasta Doña Rosa pregunta quién fue el decorador.']];
const comfLv=()=>{const c=comfort();let r=COMF[0];for(const x of COMF)if(c>=x[0])r=x;return r};
function decoBuy(k){const d=DECO[k];if(hasD(k))return;if(S.money<d.c){toast('Te faltan '+fmtC(d.c-S.money));return}spend(d.c,'Decoración');PGS().decor[k]=1;const im=MAPS.casa_jugador;if(im)im.hdDirty=true;toast(d.ic+' '+d.n+' · comodidad '+comfort());if(typeof progRep==='function')progRep(1);saveGame()}
// dibujo de la decoración en el interior (HD)
function hdDecoInt(c,m){const b=hdBuf(m.w*32,m.h*32);
  if(hasD('cuadro')){for(const[x,blue]of[[4*32+38,1],[8*32+2,0]]){hdR(b,x,10,22,26,[150,112,52]);hdR(b,x+2,12,18,22,blue?[70,110,170]:[110,170,210]);if(blue){hdEll(b,x+11,22,5,8,[214,176,82]);hdEll(b,x+11,18,2,2,[70,50,40])}else{for(let j=0;j<10;j++)hdR(b,x+11-j,22+j*.4,j*2,1,[100,120,90]);hdR(b,x+10,14,2,4,[200,120,90])}}}
  if(hasD('sele')){const x=11*32+18,y=8;hdR(b,x,y,20,26,[214,69,60]);hdR(b,x+2,y+2,16,10,[244,244,244]);hdR(b,x+2,y+14,16,10,[42,111,176]);hdText(b,x+2,y+3,'CR',[214,69,60])}
  if(hasD('cortinas'))for(const s of[0,1])for(let j=6;j<54;j++){const x=s?2*32+50:2*32-10,ww=8;for(let i=0;i<ww;i++){let col=hdS([242,162,190],.85+.2*Math.sin(i*1.4));if((i+j)%7===0)col=[255,240,120];hdP(b,x+i,j,col)}}
  if(hasD('matas'))for(const[x,y]of[[4*32+8,8*32+28],[10*32+8,8*32+28]])hdPlantPot(b,x,y,true);
  if(hasD('lampara')){const x=8*32+14,y=2*32+28;hdEll(b,x+2,y+2,7,3,[20,20,24],.3);hdR(b,x,y-36,3,36,[60,56,54]);for(let j=0;j<12;j++)hdR(b,x+1-6+j*.2,y-48+j,12-j*.4,1,[244,226,170]);hdEll(b,x+1,y-36,4,2,[255,236,170])}
  if(hasD('alfombra')&&m.rug){const[x,y,w,h]=m.rug,X=x*32,Y=y*32,RW=w*32,RH=h*32;for(let j=0;j<RH;j++)for(let i=0;i<RW;i++){const u=i/RW,v=j/RH,e=Math.min(u,v,1-u,1-v);let cc=e<.05?[40,70,110]:e<.09?[240,226,180]:((i>>3)+(j>>3))%2?[70,110,160]:[60,96,146];if(Math.abs(Math.abs(u-.5)*2+Math.abs(v-.5)*2-.6)<.03)cc=[240,226,180];hdP(b,X+i,Y+j,hdS(cc,.95+.05*hdr(X+i,Y+j)))}}
  if(hasD('trofeos')){const x=4*32+2,y=2*32+2;hdR(b,x,y+14,60,5,[120,80,46]);hdR(b,x,y+14,60,1,[160,110,64]);for(let i=0;i<4;i++){const tx=x+6+i*14,ty=y+4;hdR(b,tx+2,ty+6,6,4,[214,176,82]);hdR(b,tx,ty,10,6,[236,200,96]);hdR(b,tx+3,ty+10,4,3,[140,100,40])}}
  if(hasD('sonido')){const x=9*32+2,y=4*32+4;hdR(b,x,y+4,28,18,[34,34,40]);hdR(b,x+2,y+6,24,4,[90,200,255]);for(const sx of[x-10,x+30]){hdR(b,sx,y,9,24,[26,26,30]);hdEll(b,sx+4.5,y+8,3,3,[80,80,90]);hdEll(b,sx+4.5,y+17,3.5,3.5,[80,80,90])}}
  if(hasD('perro')){const x=11*32+4,y=4*32+6;hdEll(b,x+22,y+12,20,9,[150,70,60]);hdEll(b,x+22,y+12,15,6,[214,190,160]);hdEll(b,x+26,y+11,6,3,[240,230,210])}
  c.getContext('2d').drawImage(hdToCanvas(b),0,0)}
function hdDecoTop(m){if(!hasD('abanico'))return null;const t=mk(m.w*32,m.h*32),g=t.getContext('2d'),b=hdBuf(80,60),cx=40,cy=30;
  for(let k=0;k<4;k++){const a=k*1.5708+.5;for(let r=7;r<34;r++){const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.5,w=2.2+Math.sin(r/34*Math.PI)*2.2;hdEll(b,x,y+5,w,w*.6,[0,0,0],.05);hdEll(b,x,y,w,w*.6,r>30?[96,66,40]:[140,100,62]);hdEll(b,x-.5,y-.5,w*.5,w*.3,[176,132,86])}}
  hdEll(b,cx,cy,7,5,[200,200,206]);hdEll(b,cx,cy-1,5,3.5,[236,236,240]);hdEll(b,cx,cy+3,4,3,[255,236,170]);g.globalAlpha=.92;g.drawImage(hdToCanvas(b),6*32-cx+16,3.4*32-cy);return t}
{const _hi=hdInterior;hdInterior=function(m){const c=_hi(m);if(m.id==='casa_jugador')try{hdDecoInt(c,m)}catch(e){console.error(e)}return c}}
{const _he=hdEnsure;hdEnsure=function(m){const was=m.hdDirty;_he(m);if(was&&m.id==='casa_jugador')m.top2=hdDecoTop(m)}}
// dormir en una casa cómoda rinde más
{const _sl=sleep;sleep=function(){const d0=S.day,t0=S.t;const r=_sl();setTimeout(()=>{if(!S)return;if(S.day!==d0||S.t>t0+120){const bonus=Math.round(comfort()/3);if(bonus>0){const e=E();e.en=Math.min(100,e.en+bonus);toast('🛋 Tu casa es '+comfLv()[1].toLowerCase()+': +'+bonus+'⚡ extra al despertar')}}},1400);return r}}
// ---- tallercito del patio ----
ACT_POINTS.push({map:'ext',x:2,y:7,label:'Tallercito',cond:()=>U('tallerC')>0,run(){const v=anyVehNear(140),e=E(),ch=[];
  if(v){const c=VM[v.m],miss=100-v.cond,cost=Math.round((c.k==='bici'?20:c.k==='moto'?80:160)*miss/50)*50,en=Math.round(10+miss/5);if(miss>3)ch.push({t:'Arreglarla vos mismo ('+fmtC(cost)+' en repuestos · −'+en+'⚡)',f(){if(S.money<cost)return say(null,'No te alcanza para los repuestos.');if(e.en<en+5)return say(null,'Estás muy cansado para meterle mano.');spend(cost,'Taller');e.en-=en;fadeDo(()=>{passTime(90);v.cond=Math.max(v.cond,95);v.varado=0;v.push=0},()=>{say(null,'Con grasa hasta los codos, pero quedó. '+N('kevin')+' estaría orgulloso.');runDialog()})}})}
  const day=PGS().bikeFix===S.day;if(!day)ch.push({t:'Arreglarle bicis a los vecinos (2 h · +₡2 500 · −12⚡)',f(){if(e.en<17)return say(null,'Estás muy cansado.');PGS().bikeFix=S.day;e.en-=12;fadeDo(()=>{passTime(120);earn(2500,'Taller')},()=>{say(null,pick(['Le arreglaste la cadena a la bici de un chiquito. La mamá te pagó y además te regaló un pedazo de queque.','Dos llantas pinchadas y un freno flojo. Plata fácil… bueno, no tan fácil.']));runDialog()})}});
  ch.push({t:'Nada'});say(null,'Tu tallercito: herramientas, un compresor viejito y olor a grasa.',ch)}});
// ---- alquilar el cuarto del segundo piso ----
const INQS=[['Jeison','estudiante de Ingeniería en la UCR','corto'],['Valeria','estudiante de Enfermería','largo'],['Don Fabio','pensionado, muy tranquilo','calvo']];
function inqOffer(){const p=PGS();if(!progTwoStory()||p.inq)return;const q=pick(INQS);say(null,'Pegaste un papelito en la pulpería: «SE ALQUILA CUARTO, CON BAÑO, ₡9 000 POR SEMANA».');
  say(fillChar({id:'z_inq',name:q[0],hair:q[2],hairColor:'#2a1810',skin:'#e0ac69',shirt:'#3fb6b0',pants:'#2d3346',v:1}),'Buenas, vengo por lo del cuarto. Soy '+q[0]+', '+q[1]+'. Pago puntual, se lo prometo.',[{t:'Alquilárselo',f(){p.inq={n:q[0],d:q[1],h:q[2],next:S.day+7};toast('🏠 '+q[0]+' se pasó al cuarto de arriba')}},{t:'Mejor no'}])}
function inqNight(){const p=S&&S.f&&S.f.pg;if(!p||!p.inq)return;const q=p.inq;if(S.day>=q.next){q.next=S.day+7;if(Math.random()<.12){toast('🏠 '+q.n+' dice que le pagan el viernes… este no.')}else{earn(9000,'Alquiler');toast('🏠 '+q.n+' te pagó el alquiler: ₡9 000')}}
  if(Math.random()<.08)toast(pick(['🎶 '+q.n+' puso música a todo volumen hasta la medianoche…','🍲 '+q.n+' cocinó olla de carne y te guardó un plato. +5⚡','🧹 '+q.n+' barrió hasta la acera. Qué inquilino.']))}
hookAfter('ecoDay',function(){try{inqNight()}catch(e){}});
// en la libreta de la casa: comodidad, decoración y el cuarto
hookFilter('casaHTML',function(h){const lv=comfLv(),c=comfort(),nx=COMF.find(x=>x[0]>c);
  h+=`<h3>Comodidad</h3><div class="qitem"><b>🛋 ${lv[1]} · ${c} puntos</b><p>${lv[2]}${nx?' · Para «'+nx[1]+'» te faltan '+(nx[0]-c)+'.':''}</p><p class="note">Una casa cómoda te da más energía al despertar (+${Math.round(c/3)}⚡) y trae visitas.</p></div>`;
  h+=`<h3>Decoración</h3>`+Object.entries(DECO).map(([k,d])=>`<div class="qitem"><b>${d.ic} ${d.n}${hasD(k)?' ✔':''}</b><p>${d.t}</p>${hasD(k)?'':`<button data-deco="${k}">${fmtC(d.c)} · +${d.p} comodidad</button>`}</div>`).join('');
  if(progTwoStory())h+=`<h3>El cuarto de arriba</h3><div class="qitem">${PGS().inq?`<b>🏠 ${esc(PGS().inq.n)} · ${esc(PGS().inq.d)}</b><p>Paga ₡9 000 por semana. Próximo pago: día ${PGS().inq.next}.</p><button class="alt" data-inq="out">Pedirle el cuarto</button>`:`<p>El cuarto de arriba está vacío. Podés alquilarlo por ₡9 000 a la semana.</p><button class="green" data-inq="in">Buscar inquilino</button>`}</div>`;
  return h});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-deco],[data-inq]');if(!b)return;if(b.dataset.deco){decoBuy(b.dataset.deco);if(typeof openCasa==='function')openCasa()}
  else if(b.dataset.inq==='in'){closePanel();inqOffer();runDialog()}else if(b.dataset.inq==='out'){const q=PGS().inq;PGS().inq=null;closePanel();say(null,q.n+' empaca sus cosas con cara triste. «Gracias por todo», te dice.');runDialog()}});
appReg({id:'casa',n:'Mi casa',ic:'🏠',c:'#c4553a',html(){const lv=comfLv(),c=comfort();return`<div class="qitem"><b>🛋 ${lv[1]} · ${c} puntos de comodidad</b><p>${lv[2]}</p></div><p>Las mejoras, ampliaciones y la decoración se manejan en la <b>libreta de la casa</b> (en la mesa de tu casa).</p><button class="green" data-act="lib">Abrir la libreta de la casa</button>`},act(k){if(k==='lib'&&typeof openCasa==='function')openCasa()}});
