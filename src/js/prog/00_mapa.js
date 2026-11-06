// ================= PROGRESO · MAPA: la cuadra nueva al sur y El Hoyo =================
// La Entrada de Carlillos ahora es un callejón que baja a la Calle 3. Ahí están la iglesia, el servicentro,
// el taller de Carlillos, el lote que se vende, la plaza con su fuente y más casas. Al fondo, a la derecha,
// el callejón que baja a El Hoyo: ahí no entra cualquiera.
var SUR;   // se crea en genSur (el barrio se genera antes de que corra este bloque)
function genSur(m){SUR={gate:[[78,70],[79,70]],hoyoDoor:[[78,82],[79,82]]};const W=m.w,H=m.h,S_=(x,y,t,s)=>setT(m,x,y,t,s?1:0);
  // calle vertical hasta la Calle 3
  for(let y=39;y<=61;y++){for(let x=28;x<=30;x++)S_(x,y,1);if(ti(m,27,y)!==1)S_(27,y,2);if(ti(m,31,y)!==37&&ti(m,31,y)!==1)S_(31,y,2)}
  // Calle 3
  for(let x=1;x<W-1;x++){S_(x,61,2);S_(x,65,2);for(const y of[62,63,64])S_(x,y,1)}
  // la Entrada sigue como callejón hasta la Calle 3
  S_(34,53,6);S_(35,53,6);for(let y=54;y<=60;y++){S_(34,y,6);S_(35,y,6);S_(33,y,37,1);S_(36,y,37,1)}ENT.y1=60;
  // lote, taller, servicentro (fila norte)
  const O=(type,x,y,w,h,solid,extra)=>{m.objs.push(Object.assign({type,x,y,w,h},extra||{}));if(solid)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)S_(i,j,ti(m,i,j)===0?0:ti(m,i,j),1)};
  O('lote',20,53,7,6,true);O('tallerK',39,53,6,6,true);O('bomba',60,53,12,8,false);
  for(let y=53;y<=60;y++)for(let x=60;x<=71;x++)S_(x,y,14);for(let x=60;x<=71;x++)for(let y=53;y<=55;y++)S_(x,y,14,1);
  for(const px of[63,64,67,68])S_(px,58,14,1);
  // iglesia: atrio abierto
  const ig=BMAP.iglesia;if(ig)for(let x=ig.dx-2;x<=ig.dx+2;x++){S_(x,ig.y+ig.h,14);S_(x,ig.y+ig.h+1,14)}
  // plaza frente a la iglesia
  for(let y=66;y<=76;y++)for(let x=36;x<=62;x++){const edge=y===66||y===76||x===36||x===62,path=x===49||x===50||y===71;S_(x,y,edge||path?2:8)}
  O('fuente',48,69,3,3,true);for(const[x,y]of[[40,68],[45,74],[55,68],[59,74],[42,74],[57,71]])O('bench',x,y,1,1,true);
  for(const[x,y]of[[38,68],[60,68],[38,75],[60,75],[44,67],[54,67]]){TREES.push([x,y]);S_(x,y,5,1)}
  // caminitos a las casas del sur
  for(const bx of[6,15,65])for(let y=66;y<=68;y++)S_(bx,y,2);
  // callejón de El Hoyo
  for(let y=66;y<=H-2;y++){S_(78,y,6);S_(79,y,6);S_(77,y,37,1);S_(80,y,37,1)}
  for(const[x,y]of SUR.hoyoDoor){m.doors.push({x,y,to:'hoyo',at:null});m.noPath.add(y*W+x)}
  // árboles y postes de la cuadra nueva
  for(const[x,y]of[[2,58],[11,58],[19,52],[27,52],[58,52],[73,52],[2,66],[11,66],[22,70],[26,74],[70,67],[74,76],[66,79],[30,79],[8,79]])if(ti(m,x,y)===0){TREES.push([x,y]);S_(x,y,5,1)}
  for(const[x,y]of[[8,61],[22,61],[38,61],[52,61],[74,61],[10,65],[44,65],[70,65]]){if(ti(m,x,y)!==2)continue;POLES.push([x,y]);S_(x,y,16,1);m.lights.push({x:x*T+8,y:y*T,r:60,pole:1})}
  m.lights.push({x:65*T,y:57*T,r:80},{x:49.5*T,y:70*T,r:70},{x:51*T,y:59*T,r:50});
  // los vigilantes del callejón
  const G1=zPed('ext',78,70,{id:'z_guardia1',name:'El Chiqui',hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#2a2a30',pants:'#3a3a42',acc:'gorra',accColor:'#c0473b'},{stat:1,talk:hoyoGateTalk,reach:30,d0:0}),
        G2=zPed('ext',79,70,{id:'z_guardia2',name:'Pelón',hair:'calvo',hairColor:'#2a2a2a',skin:'#c68642',shirt:'#f4f4f4',pants:'#2d3346',acc:'ninguno'},{stat:1,talk:hoyoGateTalk,reach:30,d0:0});
  SUR.guards=[G1,G2];hoyoGateSolid();
  // Don Chepe, el del peaje, pensionado en una banca de la plaza
  zPed('ext',41,68,{id:'z_chepe_peaje',name:'Don Chepe',hair:'corto',hairColor:'#cfcfcf',skin:'#e0ac69',shirt:'#3f7fd1',pants:'#3b3b3b',acc:'gorra',accColor:'#2d3a6e'},{stat:1,reach:26,d0:0,talk:e=>{if(typeof chepePeajeTalk==='function')chepePeajeTalk(e)}});
  // Don Fello, el lotero de la plaza
  zPed('ext',44,66,{id:'z_lotero',name:'Don Fello',hair:'calvo',hairColor:'#d8d8d8',skin:'#c68642',shirt:'#e9dcb5',pants:'#5a4a3a',acc:'sombrero',accColor:'#3a3a40'},{stat:1,reach:26,d0:0,talk:e=>{if(typeof loteroTalk==='function')loteroTalk(e)}})}
function hoyoOpen(){return!!(S&&S.f&&S.f.hoyoPase)}
function hoyoGateSolid(){const m=MAPS.ext;if(!m||!SUR)return;const open=hoyoOpen();for(const[x,y]of SUR.gate)m.s[y*m.w+x]=open?0:1;
  if(SUR.guards){const[g1,g2]=SUR.guards;if(open){g1.x=77*T+14;g2.x=80*T+2}else{g1.x=78*T+8;g2.x=79*T+8}}}
function hoyoGateTalk(e){const kv=N('kevin');
  if(hoyoOpen()){say(e.c,pick(['Pase, mop. Usted es del combo de '+kv+'.','Diay, pura vida. Pase, pero no ande dando vueltas de noche.','¿Otra vez por aquí? Tranquilo, pase.']));return}
  say(e.c,pick(['Diay, ¿y usted a quién busca? Aquí no entra cualquiera, mop.','Ey, ey, ey. ¿Para dónde va tan apurado? Esto es El Hoyo.','Mae, aquí abajo nadie lo conoce. Devuélvase tranquilo.']),[
    {t:'«Vengo de parte de '+kv+'.»',f(){if((typeof kvR==='function'?kvR():0)>=2||S.f.kevinHelp){say(e.c,'¿De '+kv+'? …Mmm. A ver, ¿cómo le dice él a su abuelo?',[{t:'«Tata»',f(){S.f.hoyoPase=1;hoyoGateSolid();say(e.c,'Jaja, sí, el Tata. Pase, mop. Si alguien le pregunta, usted es del combo de '+kv+'.');toast('🔓 Ya podés entrar a El Hoyo')}},{t:'«Don Abuelo»',f(){say(e.c,'¿«Don Abuelo»? JAJAJA. Usted ni lo conoce. Devuélvase, mop.')}}])}else say(e.c,'¿'+kv+'? Ese mae ni lo saluda a usted. Vaya hágase amigo de él primero.')}},
    {t:'Ofrecer ₡2 000 de «peaje»',f(){if(S.money<2000){say(e.c,'¿Y con qué plata, mop? Devuélvase.');return}spend(2000,'Multas');if(Math.random()<.35){S.f.hoyoPase=1;hoyoGateSolid();say(e.c,'…Bueno, por hoy. Pase rapidito.');toast('🔓 Pasaste (por ahora)')}else say(e.c,'Gracias por la colaboración, mop. Pero igual no pasa. Jajaja.')}},
    {t:'Irse',f(){say(e.c,'Eso. Buena decisión.')}}])}
// ---- iglesia por dentro ----
function genChurchInt(b){const w=16,h=12,m=newMap(b.id,w,h,'Parroquia San Isidro');m.interior=true;m.b=Object.assign({},b,{wall:'#f6f1e4',floor:12});m.wallFace=shade('#f6f1e4',.15);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const wall=y<2||x===0||x===w-1||y===h-1;setT(m,x,y,wall?10:b.floor,wall)}
  setT(m,8,11,13,0);m.noPath.add(11*w+8);m.exit={x:8,y:11};m.entry={x:8,y:10};
  const F=(type,x,y,ww=1,hh=1,act)=>{m.objs.push({type,x,y,w:ww,h:hh,act});for(let j=y;j<y+hh;j++)for(let i=x;i<x+ww;i++)m.s[j*w+i]=1};
  F('altar',6,2,4,2,'altar');for(const y of[5,7,9])for(const x of[2,10])F('banca',x,y,4,1,'banca');F('velas',1,2,1,1,'velas');F('velas',14,2,1,1,'velas');F('confe',13,5,2,2,'confe');
  m.lights.push({x:8*T,y:3*T,r:90},{x:4*T,y:7*T,r:70},{x:12*T,y:7*T,r:70});return m}
// ---- El Hoyo ----
function genHoyo(){const W=46,H=30,m=newMap('hoyo',W,H,'El Hoyo');const S_=(x,y,t,s)=>setT(m,x,y,t,s?1:0);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)S_(x,y,6);
  for(let x=0;x<W;x++){S_(x,0,37,1);S_(x,H-1,37,1)}for(let y=0;y<H;y++){S_(0,y,37,1);S_(W-1,y,37,1)}
  S_(22,0,6);S_(23,0,6);m.doors.push({x:22,y:0,to:'ext',at:{x:78,y:80}},{x:23,y:0,to:'ext',at:{x:79,y:80}});m.entry={x:22,y:2};
  for(let y=1;y<H-1;y++)for(const x of[21,22,23,24])S_(x,y,2);for(let x=1;x<W-1;x++)for(const y of[14,15])S_(x,y,2);   // pasillos de cemento
  const O=(type,x,y,w,h,extra)=>{m.objs.push(Object.assign({type,x,y,w,h},extra||{}));for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)S_(i,j,ti(m,i,j),1)};
  // ranchos de zinc, la pulpería con rejas, el lote de motos, la cantina y la canchita
  const R_=[[1,2,6,5],[7,2,5,5],[12,2,4,5],[16,2,5,5],[25,2,5,5],[30,2,4,5],[34,2,6,5],[40,2,5,5],
            [10,8,5,5],[15,8,6,5],[25,8,6,5],
            [1,17,5,5],[6,17,5,5],[11,17,5,5],[16,17,5,5],[33,17,5,5],[38,17,7,5],
            [14,23,7,5],[25,23,5,5],[30,23,6,5],[36,23,4,5],[40,23,5,5]];
  R_.forEach(([x,y,w,h],i)=>O('rancho',x,y,w,h,{seed:i*7+3,col:pick2(hsh(i,4),['#c9b9a0','#a6c8d8','#e2b6a0','#b8d0a0','#d8c4e0','#efd88a']),mural:i%4===1}));
  O('pulpaReja',1,8,8,5);O('motos',32,8,13,5);O('cantina',26,17,6,5);
  m.objs.push({type:'canchaH',x:1,y:23,w:12,h:6});
  for(const[x,y]of[[18,13],[27,13],[8,16],[36,16],[18,22],[42,22]])m.objs.push({type:'tendedero',x,y,w:3,h:1});
  for(const[x,y]of[[20,6],[25,11],[20,20],[30,27]])m.lights.push({x:x*T,y:y*T,r:46,pole:1});
  m.walk=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(ti(m,x,y)===2&&!solidT(m,x,y))m.walk.push([x,y]);
  hoyoPeople(m);renderMap(m);return m}
var HOYO_LINES=['¿Qué ocupa, mop? Aquí se consigue de todo.','Diay, ¿y ese tenis? Están bonitos… ¿me los presta?','Aquí nadie vio nada, nadie sabe nada. Así se vive tranquilo.','¿Tiene un cinco que me regale, mop? Pa\' un pancito nada más.','El Hoyo tiene mala fama, pero aquí la gente se ayuda más que allá arriba.','Si va de noche, camine rapidito y sin el cel en la mano.','¡Qué chiva la moto que tiene el Chino en el lote!','Mi abuela vive aquí desde que esto era un cafetal.'];
function hoyoPeople(m){const P_=(id,name,x,y,look,o)=>zPed('hoyo',x,y,Object.assign({id,name},look),Object.assign({sh:HOYO_LINES.slice(0,4),talk:e=>say(e.c,pick(HOYO_LINES))},o||{}));
  P_('z_hoyo1','La Turca',20,8,{hair:'cola',hairColor:'#2b1a10',skin:'#c68642',shirt:'#e85d75',pants:'#2d3346',acc:'aretes',accColor:'#f2c94c'});
  P_('z_hoyo2','Yeison',25,13,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f2c94c',pants:'#2a2a30',acc:'gorra',accColor:'#2a2a30'});
  P_('z_hoyo3','Doña Chela',24,19,{hair:'moño',hairColor:'#d8d8d8',skin:'#b97a4a',shirt:'#a6d8cb',pants:'#4b3b5b'},{stat:1,talk:e=>hoyoChela(e)});
  P_('z_hoyo4','El Chino',38,13,{hair:'corto',hairColor:'#1c1c1c',skin:'#f1d3b0',shirt:'#2a6fb0',pants:'#2d3346',acc:'lentes',accColor:'#2a2a30'},{stat:1,talk:e=>{if(typeof progMotosHoyo==='function')progMotosHoyo(e);else say(e.c,'Motos a buen precio, papeles… bueno, papeles se consiguen.')}});
  P_('z_hoyo5','Chamaco',8,25,{hair:'rizos',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#c0473b',pants:'#2d3a6e'});
  P_('z_hoyo7','Don Mauro',30,15,{hair:'calvo',hairColor:'#cfcfcf',skin:'#b97a4a',shirt:'#f4f4f4',pants:'#2d3346',acc:'bigote'},{stat:1,talk:e=>{if(typeof prestaTalk==='function')prestaTalk(e);else say(e.c,pick(HOYO_LINES))}});
  P_('z_hoyo8','Keilor',6,26,{hair:'corto',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#2a8f6a',pants:'#2d3346'});
  P_('z_hoyo6','Brenda',12,15,{hair:'largo',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#3fb6b0',pants:'#2d3346'})}
function hoyoChela(e){say(e.c,'Mijo, ¿quiere empanaditas? Las hago yo, de papa y de frijol, a ₡500. Con chilera de la casa.',[{t:'Comprar una (₡500)',f(){if(S.money<500){say(e.c,'Diay, no se preocupe. Tome una, pero me la paga otro día.');enAdd(6);return}spend(500,'Antojos');enAdd(8);say(e.c,'¡Que le aproveche! Usted tiene cara de buena gente, no como esos de allá arriba que ni saludan.')}},{t:'No, gracias, Doña Chela'}])}
// ---- puertas con destino fijo (El Hoyo ↔ el callejón) ----
{const _cd=checkDoors;checkDoors=function(){if(doorCD>0)return _cd();const m=MAPS[P.map];if(m&&!m.interior){const[tx,ty]=tileOf(P),d=m.doors.find(d=>d.x===tx&&d.y===ty);
  if(d&&d.to==='hoyo'){ensureMapP('hoyo');const e=MAPS.hoyo.entry;changeMap('hoyo',e.x*T+8+(tx-78)*T,e.y*T+12,0);if(!S.f.hoyoVisto){S.f.hoyoVisto=1;setTimeout(()=>{say(null,'El Hoyo. Ranchos de zinc pegados unos con otros, ropa tendida en los cables, reggaetón de tres parlantes distintos y un olor a frijoles que da hambre.');say(null,'Aquí la gente se conoce toda. Y todos ya saben que vos no sos de aquí.');runDialog()},700)}return}
  if(d&&d.at){changeMap(d.to,d.at.x*T+8,d.at.y*T+12,1);return}}return _cd()}}
function ensureMapP(id){if(!MAPS[id]&&id==='hoyo')genHoyo()}
{const _e=ensureMap;ensureMap=function(id){ensureMapP(id);return _e(id)}}
// el portón se abre/cierra según el pase (también al cargar partida)
hookAfter('startGame',function(f){hoyoGateSolid();});
