// ================= PUNTARENAS · LA GENTE: VECINOS PLAYEROS, VENDEDORES AMBULANTES, HUMO, PERROS Y LA MEJENGA =================
// Todos se crean dentro de genPlaya (pzPeople). Los que caminan usan el «wander» de los peatones de Chepe por el área que les toca;
// los que nadan llevan e.swim; los que fuman, e.smoke (brasa y humo como el puro de Carlillos); los chamacos, e.kid y e.mej.
var PZP={puffs:[],ball:null,kids:[],score:[0,0],goalT:0,kick:0};
var PZ_BEACH=[17,111,17,28],PZ_PROM=[16,111,11,15],PZ_FIELD=[38,57,21,26];
function pzPeople(m){
  const Z=(id,name,x,y,look,o)=>zPed('playa',x,y,Object.assign({id,name},look),Object.assign({stat:1,reach:26,d0:0},o||{}));
  const Wk=(id,name,_n,x,y,area,look,talk,o)=>zPed('playa',x,y,Object.assign({id,name},look),Object.assign({wander:1,area,talk,sp:rnd(20,30)},o||{}));
  const L=lines=>e=>say(e.c,rot(e.c.id,lines));
  // --- familias y grupos debajo de las sombrillas
  Z('z_pz_papa','Don Mario Mora',29,22,{hair:'corto',hairColor:'#1c1c1c',skin:'#a8672f',shirt:'#f2f2f2',pants:'#2a6fb0',acc:'gorra',accColor:'#c0473b'},{talk:L(['¡Upe! Aquí con la familia, como todos los años. Treinta años viniendo a Puntarenas, mae.','¿Una birrita? La hielera está llena… de hielo. Las birras se acabaron en Esparza.','Mi señora trajo gallo pinto en tarrina. A la playa uno viene con el almuerzo hecho.']),d0:0});
  Z('z_pz_mama','Doña Ligia Mora',28,23,{hair:'moño',hairColor:'#2b1a10',skin:'#c68642',shirt:'#e85d75',pants:'#3a2e4c',acc:'aretes',accColor:'#f2c94c'},{talk:L(['¡Mijo, póngase bloqueador que ese sol no perdona! …Perdón, es que lo vi igualito a mi Johnny.','¿Ya almorzó? Aquí hay arroz con pollo. Siéntese, siéntese, no sea tímido.','Ese chiquillo mío se metió al agua con los tenis. ¡Con los tenis nuevos!']),d0:3});
  Z('z_pz_abuela','Abuela Mora',30,23,{hair:'moño',hairColor:'#e8e8e8',skin:'#b97a4a',shirt:'#a6d8cb',pants:'#4b3b5b',acc:'anteojos'},{talk:L(['Yo venía en el tren al Puerto cuando era una chiquilla. ¡Diay, qué tiempos!','Antes el agua era más clarita. O yo veía mejor, quién sabe.','Ese Paseo antes era puro barro, mijo. Ahora mírelo, con letras y todo.']),d0:2});
  Z('z_pz_novio','Kevin (de luna de miel)',50,23,{hair:'corto',hairColor:'#2a1810',skin:'#e0ac69',shirt:'#3fb6b0',pants:'#e9dcb5',acc:'lentes',accColor:'#2a2a30'},{talk:L(['¡Nos casamos el sábado, mae! Luna de miel en Puntarenas. No alcanzó para Cancún.','Mi esposa… uy, qué raro decir «mi esposa»… quiere ir a la isla San Lucas. Yo quiero churchill.']),d0:3});
  Z('z_pz_novia','Yuliana (de luna de miel)',51,24,{hair:'largo',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#f2f2f2',pants:'#ef6f8a',acc:'aretes',accColor:'#f2c94c'},{talk:L(['Él dice que esto es mejor que Cancún. Yo le creo porque lo quiero.','Nos conocimos en un bus de Barranca a Chepe. Ocho horas de presa. Amor a primera presa.']),d0:2});
  Z('z_pz_chisme1','Doña Cata',76,23,{hair:'rizos',hairColor:'#4a3a30',skin:'#d9a066',shirt:'#f2c94c',pants:'#2d3346',acc:'aretes',accColor:'#e85d75'},{talk:L(['¿Ya supo lo del hijo de Doña Mireya? …Ay no, mejor no le cuento. Bueno, sí le cuento.','Aquí vengo a broncearme. Llevo cuarenta años y sigo igualita de blanca.']),d0:3});
  Z('z_pz_chisme2','Doña Mercedes',77,22,{hair:'moño',hairColor:'#c8c8c8',skin:'#e0ac69',shirt:'#7bb661',pants:'#3a2e4c',acc:'sombrero',accColor:'#e9dcb5'},{talk:L(['Usted no es de aquí, ¿verdad? Se le nota en lo pálido. Póngase bloqueador.','Mire a esos chamacos jugando bola. Así era mi marido. Ahora juega dominó y pierde.']),d0:2});
  // el del parlante con birra (y otro que fuma)
  Z('z_pz_parlante','Brayan',86,26,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#d23038',pants:'#2a2a30',acc:'gorra',accColor:'#26262e'},{talk:pzBirraTalk,sh:['♪ ♫ ¡Wepa! ♫','¡Esa cumbia, mae!','♪ La pollera colorá ♪'],d0:0});
  Z('z_pz_fuma1','Don Rafa',61,13,{hair:'calvo',hairColor:'#d8d8d8',skin:'#b97a4a',shirt:'#f4f4f4',pants:'#5a5f66',acc:'sombrero',accColor:'#e9dcb5'},{smoke:'puro',talk:L(['Este puro es de Nicaragua. Mi compadre me los manda. Uno al día, como el señor del barrio de usted.','Cuarenta años de pescador. Ahora me siento aquí a ver el mar que me dio de comer.','El golfo tiene sus mañas, joven. Nunca le dé la espalda al mar.']),d0:0});
  Z('z_pz_fuma2','Shirley',91,29,{hair:'cola',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#8a4fd1',pants:'#2a2a30',acc:'aretes',accColor:'#f4f4f4'},{smoke:'cig',pier:1,talk:L(['Vengo aquí a fumarme uno y ver las lanchas. Mi mamá cree que ya lo dejé. Shhh.','Trabajo en el hotel de enfrente. Quince minutos de descanso y me vengo volada al muelle.']),d0:3});
  Z('z_pz_fuma3','Rasta del Puerto',101,21,{hair:'largo',hairColor:'#1c1c1c',skin:'#6b3e1e',shirt:'#2e9e6b',pants:'#e9dcb5',acc:'collar',accColor:'#f2c94c'},{smoke:'cig',talk:L(['Pura vida, hermano. Aquí el tiempo va más despacio. Allá en Chepe todo el mundo corre.','¿Ve esa isla? La San Lucas. Antes era cárcel. Ahora es para turistas. Así es la vida.','Yo hago pulseras. Bueno, las hacía. Ahora solo veo el mar.']),d0:0});
  // pescadores en la T del muelle
  Z('z_pz_pesc1','Don Goyo',87,45,{hair:'corto',hairColor:'#cfcfcf',skin:'#8d5524',shirt:'#e9dcb5',pants:'#2a2a30',acc:'sombrero',accColor:'#c9a860'},{rod:1,pier:1,talk:L(['Shhh… que se espantan. …Bueno, igual no pica nada desde las seis.','Aquí lo que sale es pargo, corvina y mentiras. Más que todo mentiras.']),d0:0});
  Z('z_pz_pesc2','Wílmer',94,45,{hair:'corto',hairColor:'#1c1c1c',skin:'#a8672f',shirt:'#2a6fb0',pants:'#3a3a42',acc:'gorra',accColor:'#f2c94c'},{rod:1,pier:1,talk:L(['Mi abuelo pescaba aquí, mi papá pescaba aquí, y yo… yo vengo a ver si pica. Tradición.','Si saca un pargo grande, Don Chalo se lo compra. Él tiene un cuñado con marisquería.']),d0:0});
  // turistas y gente del Paseo
  Z('z_pz_alemana','Turista alemana',55,20,{hair:'largo',hairColor:'#f0d890',skin:'#f6d0b8',shirt:'#f4f4f4',pants:'#2a6fb0',acc:'sombrero',accColor:'#e9dcb5'},{talk:L(['¡Hola! Ich… perdón. Estoy aprendiendo español. ¿Pura vida es «hola» o «adiós»?','Mi novio se fue a la banana. Vuelve todo mojado y feliz. Como un perro.','En Alemania ahora hay nieve. Aquí, churchill. Yo me quedo.']),d0:0});
  Z('z_pz_salva','Salvavidas Andrés',73,21,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#d6453c',pants:'#d6453c',acc:'gorra',accColor:'#d6453c'},{talk:pzSalvaTalk,sh:['¡No pasen de las boyas!','¡Ey, los del fondo, más pa\' acá!'],d0:0});
  Wk('z_pz_poli','Oficial turística','',60,12,PZ_PROM,{hair:'cola',hairColor:'#1c1c1c',skin:'#c68642',shirt:'#2d3a6e',pants:'#2a2a30',acc:'gorra',accColor:'#2d3a6e'},L(['Buenas. Cuide el celular y la billetera, que aquí hay muchos «amigos» de lo ajeno.','No se meta al mar borracho, por favor. Cada verano sacamos a alguno.','Si va a manejar de vuelta, nada de guaro. Hay retenes en la Ruta 27.']));
  Wk('z_pz_corre','Muchacha que trota',null,30,13,PZ_PROM,{hair:'cola',hairColor:'#3b2416',skin:'#e0ac69',shirt:'#ef6f8a',pants:'#26262e'},L(['¡Uf! Cinco kilómetros… ida y vuelta… ¡a esta hora! ¡Qué calor, mae!','Si me ve pasar otra vez, ya voy por la tercera vuelta. Mentira, es la primera.']),{sp:44});
  Wk('z_pz_viejito','Don Chema',null,80,13,PZ_PROM,{hair:'calvo',hairColor:'#e8e8e8',skin:'#b97a4a',shirt:'#a9c8ef',pants:'#e9dcb5',acc:'sombrero',accColor:'#e9dcb5'},L(['Yo camino todos los días por el Paseo. El doctor dice que para el corazón. Yo vengo por los churchills.','¿Usted es de Chepe? Allá hace frío, ¿verdad? Aquí uno suda hasta pensando.']),{sp:16});
  Wk('z_pz_colegial','Colegiales de excursión',null,45,14,PZ_PROM,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f4f4f4',pants:'#2d3a6e'},L(['¡Mae, nos escapamos de la excursión del colegio! Shhh, no le diga a la profe.','¿Usted sabe dónde venden granizados? La profe dijo que nada de azúcar. Por eso mismo.']));
  Wk('z_pz_cartago','Turista de Cartago',null,95,14,PZ_PROM,{hair:'moño',hairColor:'#2b1a10',skin:'#f1c9a5',shirt:'#7bb661',pants:'#3a2e4c',acc:'anteojos'},L(['Yo soy de Cartago. Allá hace un frío… aquí me estoy derritiendo como un helado de sorbetera.','¡Qué calor! Allá en Cartago uno anda con jacket. Aquí ando con la jacket en la cartera, por si acaso.']));
  // bañistas
  for(const[i,x,y,lk]of[[0,40,32,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#3f7fd1'}],[1,64,32,{hair:'largo',hairColor:'#2b1a10',skin:'#c68642',shirt:'#e85d75'}],[2,79,33,{hair:'corto',hairColor:'#e8c070',skin:'#f6d0b8',shirt:'#f2c94c'}],[3,82,32,{hair:'cola',hairColor:'#1c1c1c',skin:'#e0ac69',shirt:'#2e9e6b'}]])
    Z('z_pz_ban'+i,['Bañista','Bañista','Gringo flotando','Bañista'][i],x,y,lk,{swim:1,swimmer:1,hx0:x,hy0:y,talk:L(['¡Está riquísima el agua! ¡Métase!','¡Cuidado con las aguamalas! …Mentira, no hay. Creo.','Aquí flotando, sin pensar en nada. Esto cura todo.','¡Mae, me pasó un pez por la pierna! ¡Un pez!'])});
  // vendedores ambulantes
  const V=(id,name,x,y,look,talk,sh,carry)=>Wk(id,name,null,x,y,PZ_BEACH,look,talk,{sh,carry,sp:18,vend:1});
  V('z_pz_copos','Beto el de los copos',42,20,{hair:'corto',hairColor:'#1c1c1c',skin:'#a8672f',shirt:'#f4f4f4',pants:'#2a6fb0',acc:'gorra',accColor:'#2a6fb0'},pzVend('copo'),['¡Copos, copos bien fríos!','¡Copo con leche en polvo!'],'copos');
  V('z_pz_mango','Doña Nidia',70,22,{hair:'moño',hairColor:'#2b1a10',skin:'#8d5524',shirt:'#f2994a',pants:'#3a2e4c',acc:'aretes',accColor:'#f2c94c'},pzVend('mango'),['¡Mango con sal y limón!','¡Mango verde, mango maduro!'],'mango');
  V('z_pz_cev','Toño el cevichero',90,25,{hair:'corto',hairColor:'#3a3a3a',skin:'#c68642',shirt:'#3fb6b0',pants:'#e9dcb5',acc:'bigote'},pzVend('cev'),['¡Ceviche en vasito, ceviche!','¡De pescado y de camarón!'],'cev');
  V('z_pz_lot','Don Lalo',57,17,{hair:'calvo',hairColor:'#cfcfcf',skin:'#b97a4a',shirt:'#e8e8e8',pants:'#5a5f66',acc:'sombrero',accColor:'#c9a46a'},pzVend('lot'),['¡Lotería, lotería, el que juega gana!','¡Termina en siete, joven!'],'lot');
  V('z_pz_gorras','Jairo de las gorras',100,18,{hair:'corto',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f2c94c',pants:'#2a2a30',acc:'gorra',accColor:'#d23038'},pzVend('gorra'),['¡Gorras, lentes, gorras!','¡Lentes de sol a dos mil!'],'gorras');
  Z('z_pz_flory','Doña Flory',79,13,{hair:'rizos',hairColor:'#2b1a10',skin:'#c68642',shirt:'#3f8fd1',pants:'#2d3346',acc:'aretes',accColor:'#f4f4f4'},{talk:pzVend('gran'),sh:['¡Granizados con leche condensada!']});
  Z('z_pz_mayra','Doña Mayra',100,13,{hair:'moño',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#f2a03a',pants:'#2d3346',acc:'aretes',accColor:'#f2c94c'},{talk:pzVend('cevC'),sh:['¡Ceviche de la casa!']});
  // la mejenga: tres contra tres, un marco de chancletas y otro de palos
  PZP.kids=[];const KL=[['Jefferson','#1c1c1c','#8d5524','#d23038'],['Kendall','#2a1810','#c68642','#d23038'],['Josué','#1c1c1c','#6b3e1e','#d23038'],['Brandon','#1c1c1c','#e0ac69','#f4f4f4'],['Dylan','#3b2416','#a8672f','#f4f4f4'],['Keylor','#1c1c1c','#8d5524','#f4f4f4']];
  KL.forEach((k,i)=>{const team=i<3?0:1;const hx=team?PZ_FIELD[1]-3-(i%3)*4:PZ_FIELD[0]+3+(i%3)*4,hy=PZ_FIELD[2]+1+(i%3)*2;
    const e=Z('z_pz_kid'+i,k[0],hx,hy,{hair:'corto',hairColor:k[1],skin:k[2],shirt:k[3],pants:team?'#2a2a30':'#2a6fb0'},{kid:1,mej:1,team,hx:hx,hy:hy,reach:20,talk:pzKidTalk});PZP.kids.push(e)});
  PZP.ball={x:(PZ_FIELD[0]+PZ_FIELD[1]+1)/2*T,y:(PZ_FIELD[2]+PZ_FIELD[3]+1)/2*T,vx:0,vy:0,z:0,vz:0,spin:0};PZP.score=[0,0];
  // perros de playa
  const A=(name,col,x,y)=>{const e={kind:'animal',type:'dog',name,col,map:'playa',x:x*T+8,y:y*T+12,ox:x,oy:y,dir:2,fr:0,anim:0,wt:1,vx:0,vy:0};ENTS.push(e);return e};
  A('Canelo del Puerto','#c8a165',35,19);A('Mancha','#f4f4f4',95,22);A('Sombra','#3a3a40',70,14)}
// ---------------------------------------------------------------- vendedores
var PZ_VEND={
  copo:{q:'¡Copos, mi amor! Hielo raspado con sirope de fresa, leche en polvo y leche condensada.',items:[['Un copo con todo (₡1 000)',1000,10,'Te lo sirve en vaso de cartón. El sirope rojo se te chorrea hasta el codo. Delicioso.']]},
  mango:{q:'¡Mango con sal y limón, mi amor! También hay mango verde con chile.',items:[['Mango maduro con sal y limón (₡1 500)',1500,9,'Te arruga la boca y te alegra el alma. Así se come mango en Puntarenas.'],['Mango verde con chile (₡1 500)',1500,7,'¡Pica! Se te salen las lágrimas, pero no podés dejar de comer.']]},
  cev:{q:'¡Ceviche de pescado en vasito! Con limón mandarina, culantro, cebolla morada y galleta soda.',items:[['Ceviche en vasito (₡2 000)',2000,14,'Fresquito, ácido y con galletas soda. Con chile panameño para los valientes.'],['Ceviche de camarón (₡3 000)',3000,18,'Camarones grandes, culantro y limón. Esto sí es la gloria del Puerto.']]},
  cevC:{q:'Ceviche de la casa, papito. Receta de mi mamá, que en paz descanse.',items:[['Ceviche de la casa (₡2 500)',2500,16,'Te lo sirve en plato hondo con salsa rosada. Tenía razón: la mamá cocinaba como los ángeles.']]},
  gran:{q:'¡Granizados! Hielo raspado, sirope de kola, leche condensada y leche en polvo.',items:[['Granizado de kola (₡1 200)',1200,10,'Rojo intenso y frío. Te congela el cerebro un segundo. Vale la pena.'],['Granizado de tamarindo (₡1 200)',1200,10,'Agridulce, como debe ser. Te refresca hasta el alma.']]},
  lot:{q:'¡Lotería, joven! Tiempos para esta noche. Escoja su número del 00 al 99, que le paga noventa veces.',lot:1},
  gorra:{q:'¡Gorras, lentes de sol! Para que no se me queme, mi hermano.',items:[['Gorra (₡3 000)',3000,0,'Te ponés una gorra que dice «PUNTARENAS» con letras doradas. El sol ya no te pega tanto en la cara.','gorra'],['Lentes de sol (₡2 500)',2500,0,'Unos lentes negros grandotes. Te sentís en un videoclip de reguetón.','lentes']]}};
function pzVend(k){return function(e){const V=PZ_VEND[k];const ch=[];
  if(V.lot){const t=PZS().tiempo;if(t&&t.day===S.day){say(e.c,'Ya tiene su número, joven: el '+String(t.n).padStart(2,'0')+'. Esta noche se sabe.');return}
    ch.push({t:'Comprar un tiempo (₡1 000)',f(){if(S.money<1000)return say(e.c,'Diay, sin plata no hay suerte.');spend(1000,'Lotería');const n=Math.floor(Math.random()*100);PZS().tiempo={n,day:S.day};say(e.c,'Le salió el '+String(n).padStart(2,'0')+'. Esta noche juega. ¡Que Dios lo acompañe!')}})}
  else for(const it of V.items)ch.push({t:it[0],f(){if(S.money<it[1])return say(e.c,'Uy, no le alcanza, mi amor. Otro día.');spend(it[1],'Antojos');if(it[2])enAdd(it[2]);say(null,it[3]+(it[2]?' +'+it[2]+'⚡':''));
    if(it[4])PZS()[it[4]]=1;if(PLAYA&&PLAYA.ari&&Math.random()<.6)say('ariana',it[4]==='lentes'?'¡Jajaja! Pareces un mafioso de película. …Te quedan bien, la verdad.':it[4]==='gorra'?'Ahora sí pareces turista de verdad.':pick(['¿Me das un poquito? …Un poquito más. Bueno, me lo como todo.','¡Qué rico! Esto sabe a vacaciones.']));progStat('pzAntojo')}});
  ch.push({t:'No, gracias'});say(e.c,V.q,ch)}}
hookAfter('ecoDay',function(){const p=S.f&&S.f.pg&&S.f.pg.pz;if(!p||!p.tiempo)return;const t=p.tiempo;delete p.tiempo;const g=Math.floor(Math.random()*100);
  if(g===t.n){earn(90000,'Lotería');toast('🎉 ¡Salió el '+String(g).padStart(2,'0')+'! Ganaste ₡90 000 con el tiempo de Don Lalo');progStat('pzLoteria')}else toast('🎟 Salió el '+String(g).padStart(2,'0')+'. Tu '+String(t.n).padStart(2,'0')+' no pegó.')});
function pzSalvaTalk(e){say(e.c,pick(['Buenas. Aquí estoy de turno hasta las cinco. No pase de las boyas anaranjadas, que ahí la corriente lo jala.','Si se va a meter, que sea sobrio y con alguien. El mar no perdona al que se cree Tarzán.','¿Ve esa bandera? Amarilla: con cuidado. Roja: ni se le ocurra.']),[{t:'¿Cómo se nada aquí?',f(){say(e.c,'Bajás por las gradas, caminás hasta el agua y te metés. Nadás más despacio y te cansás. Si te quedás sin energía, salí a descansar.')}},{t:'Gracias, mae'}])}
function pzKidTalk(e){say(e.c,pick(['¡Mae, juegue con nosotros! Nos falta uno. El marco de chancletas es el de nosotros.','¡Patee la bola, mae! ¡Patéela!','Mi papá dice que yo voy a jugar en el Puntarenas F.C. Yo quiero jugar en el Saprissa. No le diga.','¡Gol de chilena! …Bueno, casi.']),[{t:'Patear la bola (caminá contra ella)',f(){toast('⚽ Caminá contra la bola para patearla. Con Shift va más fuerte.')}},{t:'¿Cómo va el partido?',f(){say(e.c,'Vamos '+PZP.score[0]+' a '+PZP.score[1]+'. Los de rojo somos los de las chancletas. ¡Usted es de los de rojo!')}},{t:'Ahorita'}])}
function pzBirraTalk(e){say(e.c,'¡Upe, mae! ¿Una birrita? Bien fría, de la hielera. ♪ ♫',[{t:'Una birra (₡1 500)',f(){if(S.money<1500)return say(e.c,'Diay, mae, sin plata no hay birra. Pero tome agua, que el sol pega.');spend(1500,'Antojos');if(typeof pzDrink==='function')pzDrink('birra',e.c);else enAdd(4)}},
  {t:'Un guaro (₡2 000)',f(){if(S.money<2000)return say(e.c,'No le alcanza, mae.');spend(2000,'Antojos');if(typeof pzDrink==='function')pzDrink('guaro',e.c)}},{t:'Agua, gracias',f(){enAdd(2);say(e.c,'¡Buena esa! Agua también hay. El que maneja, no toma.')}}])}
// ---------------------------------------------------------------- props del suelo
function pzProp(b,o){const X=o.x*HT,Y=o.y*HT;
  if(o.type==='hielera'){hdEll(b,X+16,Y+26,14,4,[30,30,40],.3);hdR(b,X+4,Y+10,24,16,[236,236,232]);hdR(b,X+4,Y+10,24,4,[52,120,196]);hdR(b,X+4,Y+10,24,1,[110,170,230]);hdR(b,X+26,Y+14,2,12,[190,190,186]);hdR(b,X+12,Y+8,8,2,[52,120,196]);
    for(const[dx,dy]of[[30,22],[34,24],[-2,24]]){hdR(b,X+dx,Y+dy-6,3,6,[200,160,50]);hdR(b,X+dx,Y+dy-6,3,1,[240,220,150])}return true}
  if(o.type==='radio'){hdEll(b,X+16,Y+26,12,3,[30,30,40],.3);hdR(b,X+6,Y+12,20,13,[40,40,46]);hdR(b,X+6,Y+12,20,1,[90,90,96]);for(const cx of[11,21]){hdEll(b,X+cx,Y+19,4,4,[20,20,24]);hdEll(b,X+cx,Y+19,2,2,[70,70,76])}hdR(b,X+9,Y+9,14,2,[60,60,66]);hdR(b,X+15,Y+14,2,2,[60,220,120]);return true}
  return false}
// ---------------------------------------------------------------- cada cuadro: bañistas, chamacos, bola y humo
{const _u=updZPed;updZPed=function(e,dt){if(e.map==='playa'&&(e.mej||e.swimmer))return;return _u(e,dt)}}
function pzTick(dt){const t=pzSeaT();
  for(const e of ENTS){if(e.map!=='playa')continue;
    if(e.swimmer&&!e.talking){e.x=e.hx0*T+8+Math.sin(t*.3+e.hx0)*10;e.y=e.hy0*T+12+Math.sin(t*.23+e.hy0)*4;e.dir=Math.sin(t*.3+e.hx0)>0?3:2;e.moving=Math.abs(Math.cos(t*.3+e.hx0))>.3}
    if(e.smoke){e.smT=(e.smT||rnd(0,2))-dt;if(e.smT<=0){e.smT=rnd(1.4,2.6);if(Math.hypot(e.x-P.x,e.y-P.y)<260&&PZP.puffs.length<40)for(let k=0;k<3;k++)PZP.puffs.push({x:e.x+(e.dir===2?-2:2),y:e.y-21+(e.zl?-e.zl:0),t:-k*.15,vx:rnd(4,9),r:rnd(1.2,2)})}}}
  for(const p of PZP.puffs){p.t+=dt;if(p.t<0)continue;p.x+=p.vx*dt+Math.sin(p.t*3)*.15;p.y-=(7-p.t*1.5)*dt;p.r+=dt*1.6}PZP.puffs=PZP.puffs.filter(p=>p.t<2.6);
  pzMejTick(dt)}
function pzMejTick(dt){const b=PZP.ball;if(!b)return;const F=PZP_F();
  // la bola
  b.x+=b.vx*dt;b.y+=b.vy*dt;b.vz-=260*dt;b.z=Math.max(0,b.z+b.vz*dt);if(b.z===0){if(b.vz<-40)b.vz=-b.vz*.42;else b.vz=0;const fr=Math.exp(-2.4*dt);b.vx*=fr;b.vy*=fr}else{const fr=Math.exp(-.4*dt);b.vx*=fr;b.vy*=fr}b.spin+=Math.hypot(b.vx,b.vy)*dt*.25;
  if(b.y<F.y0){b.y=F.y0;b.vy=Math.abs(b.vy)*.5}if(b.y>F.y1){b.y=F.y1;b.vy=-Math.abs(b.vy)*.5}
  if(PZP.goalT>0){PZP.goalT-=dt;if(PZP.goalT<=0){b.x=(F.x0+F.x1)/2;b.y=(F.y0+F.y1)/2;b.vx=b.vy=b.vz=0;b.z=0}}
  else{const inPost=b.y>F.gy0&&b.y<F.gy1;
    if(b.x<F.x0){if(inPost&&b.z<10)pzGoal(1);else{b.x=F.x0;b.vx=Math.abs(b.vx)*.5}}
    if(b.x>F.x1){if(inPost&&b.z<10)pzGoal(0);else{b.x=F.x1;b.vx=-Math.abs(b.vx)*.5}}}
  // el jugador patea
  if(PZP.kick>0)PZP.kick-=dt;const pd=Math.hypot(P.x-b.x,P.y-2-b.y);
  if(P.moving&&!P.swim&&!riding()&&pd<9&&PZP.kick<=0&&b.z<6){const[dx,dy]=DV[P.dir];const pow=KEYS.shift?210:150;b.vx=dx*pow+(b.x-P.x)*4;b.vy=dy*pow*.8+(b.y-P.y+2)*4;b.vz=KEYS.shift?90:40;PZP.kick=.35;PZP.last='p';beep(180,.05,'square',.03);progStat('pzPatada')}
  // los chamacos: el más cerca de cada equipo va por la bola, los demás se acomodan
  for(const team of[0,1]){const ks=PZP.kids.filter(k=>k.team===team&&!k.talking);let best=null,bd=1e9;for(const k of ks){const d=Math.hypot(k.x-b.x,k.y-b.y);if(d<bd){bd=d;best=k}}
    for(const k of ks){let tx,ty,sp;if(k===best&&PZP.goalT<=0){tx=b.x+(team?6:-6);ty=b.y+2;sp=50}else{tx=k.hx*T+8+(b.x-(F.x0+F.x1)/2)*.35;ty=k.hy*T+12+(b.y-(F.y0+F.y1)/2)*.4;sp=34}
      const dx=tx-k.x,dy=ty-k.y,d=Math.hypot(dx,dy);if(d>2){const s=Math.min(d,sp*dt);k.x+=dx/d*s;k.y+=dy/d*s;k.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0)}else if(Math.hypot(P.x-k.x,P.y-k.y)<40)faceTo(k,P);else k.dir=team?2:3;
      k.kt=(k.kt||0)-dt;if(k===best&&bd<8&&k.kt<=0&&b.z<6&&PZP.goalT<=0){k.kt=.6;const gx=team?F.x0-10:F.x1+10,gy=(F.gy0+F.gy1)/2+rnd(-16,16);const ang=Math.atan2(gy-b.y,gx-b.x)+rnd(-.35,.35),pow=rnd(90,150);b.vx=Math.cos(ang)*pow;b.vy=Math.sin(ang)*pow*.8;b.vz=rnd(10,60);PZP.last=team;if(Math.hypot(P.x-b.x,P.y-b.y)<200)beep(200,.04,'square',.015)}}}}
function PZP_F(){return{x0:PZ_FIELD[0]*T+4,x1:(PZ_FIELD[1]+1)*T-4,y0:PZ_FIELD[2]*T+4,y1:(PZ_FIELD[3]+1)*T,gy0:(PZ_FIELD[2]+1.5)*T,gy1:(PZ_FIELD[2]+4.5)*T}}
function pzGoal(team){PZP.score[team]++;PZP.goalT=2.2;const b=PZP.ball;b.vx*=.2;b.vy*=.2;const k=pick(PZP.kids.filter(k=>k.team===team));
  const byP=PZP.last==='p'&&team===0;if(BUBS.length<3&&k)BUBS.push({e:k,txt:byP?'¡GOOOL DEL MAE DE CHEPE!':'¡GOOOOOL!',t:2.4});
  if(Math.hypot(P.x-b.x,P.y-b.y)<260)beepSeq(team===0?[523,659,784,1046]:[392,330,262]);if(byP){progStat('pzGol');toast('⚽ ¡Gol! Rojos '+PZP.score[0]+' · Blancos '+PZP.score[1]);if(PLAYA&&PLAYA.ari){relAdd('ar',.5)}}}
// ---------------------------------------------------------------- dibujo: la bola, los marcos, lo que cargan los vendedores, las cañas y el humo
function pzGround(g,cx,cy){const F=PZP_F();if(cx>F.x1+60||cx+VW/Z<F.x0-60)return;
  // marco de chancletas (rojos) y de palos (blancos)
  for(const y of[F.gy0,F.gy1]){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(F.x0-3,y+2,7,2);g.fillStyle='#e8524a';g.fillRect(F.x0-3,y-1,6,3);g.fillStyle='#ffb0a0';g.fillRect(F.x0-2,y-1,4,1);g.fillStyle='#2a6fb0';g.fillRect(F.x0+1,y+3,5,2)}
  for(const y of[F.gy0,F.gy1]){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(F.x1,y+1,5,2);g.fillStyle='#8a6a46';g.fillRect(F.x1,y-12,2,13);g.fillStyle='#b08a5e';g.fillRect(F.x1,y-12,1,13)}
  g.fillStyle='rgba(150,120,90,.35)';for(let y=F.gy0+3;y<F.gy1-1;y+=3)g.fillRect(F.x0,y,1,1)}
function pzMoreProxies(list,map){const b=PZP.ball;
  if(b)list.push({kind:'carv',map,x:b.x,y:b.y,draw:g=>{const X=Math.round(b.x*2)/2,Y=Math.round(b.y*2)/2;g.fillStyle='rgba(0,0,0,.28)';g.fillRect(X-2.5,Y,5,1.5);const yy=Y-3-b.z*.5;g.fillStyle='#f4f4f0';g.beginPath();g.arc(X,yy,2.6,0,7);g.fill();g.fillStyle='#26262e';const k=Math.floor(b.spin)%2;g.fillRect(X-1+(k?.5:-.5),yy-1,1.5,1.5);g.fillRect(X+.5,yy+(k?.5:-.5),1,1);g.fillStyle='#ffffff';g.fillRect(X-1.5,yy-2,1,.5)}});
  for(const e of ENTS){if(e.map!==map)continue;
    if(e.carry){const yy=e.y+.1;list.push({kind:'carv',map,x:e.x,y:yy,draw:g=>pzCarryDraw(g,e)})}
    if(e.rod)list.push({kind:'carv',map,x:e.x,y:e.y+.1,draw:g=>{const t=pzSeaT(),X=e.x,Y=e.y;g.fillStyle='#5a4030';for(let i=0;i<14;i++)g.fillRect(X+3+i*.5,Y-14+i*1.2,1,1);g.fillStyle='rgba(240,240,230,.7)';const ex=X+10,ey=Y+5;for(let i=0;i<12;i++)g.fillRect(ex+Math.sin(t+i*.3)*.4,ey+i*1.4,.5,1);g.fillStyle='#e8622c';g.fillRect(ex-1,ey+17+Math.sin(t*2)*.6,2,2)}})}}
function pzCarryDraw(g,e){const X=Math.round(e.x),Y=Math.round(e.y),k=e.carry,s=e.dir===2?-1:1;
  if(k==='copos'){g.fillStyle='#f4f4f0';g.fillRect(X+s*5-3,Y-14,7,6);g.fillStyle='#2a6fb0';g.fillRect(X+s*5-3,Y-14,7,1.5);g.fillStyle='#e8524a';g.fillRect(X+s*5-2,Y-17,1.5,3);g.fillStyle='#f2c94c';g.fillRect(X+s*5+1,Y-17,1.5,3)}
  else if(k==='mango'){g.fillStyle='#a07a40';g.fillRect(X+s*5-4,Y-13,8,4);g.fillStyle='#c89a56';g.fillRect(X+s*5-4,Y-13,8,1);g.fillStyle='#f2a03a';for(let i=0;i<3;i++)g.fillRect(X+s*5-3+i*2.5,Y-15,2,2);g.fillStyle='#7bb661';g.fillRect(X+s*5+2,Y-16,1.5,1.5)}
  else if(k==='cev'){g.fillStyle='#d6453c';g.fillRect(X+s*5-3,Y-14,7,6);g.fillStyle='#f4f4f0';g.fillRect(X+s*5-3,Y-14,7,1.5);for(let i=0;i<3;i++){g.fillStyle='rgba(240,240,236,.9)';g.fillRect(X+s*5-3+i*2.5,Y-17,2,3)}}
  else if(k==='lot'){g.fillStyle='#8a6a46';g.fillRect(X+s*4-4,Y-16,8,7);g.fillStyle='#f4ead2';for(let i=0;i<3;i++)g.fillRect(X+s*4-3+i*2.4,Y-15,2,5);g.fillStyle='#d6453c';g.fillRect(X+s*4-3,Y-15,7,1)}
  else if(k==='gorras'){const cs=['#d23038','#2e6fd1','#f2c94c','#2e9e6b','#26262e'];for(let i=0;i<5;i++){g.fillStyle=cs[i];g.fillRect(X-3,Y-30-i*2.2,6,2);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(X-3,Y-28.5-i*2.2,6,.5)}g.fillStyle='#8a6a46';g.fillRect(X+s*5-3,Y-15,6,8);g.fillStyle='#26262e';for(let i=0;i<3;i++)g.fillRect(X+s*5-2,Y-14+i*2.5,4,1)}}
function pzAir(g){const h=S.t/60,night=h<6||h>18.4;
  for(const p of PZP.puffs){if(p.t<0)continue;const a=Math.max(0,.42*(1-p.t/2.6));g.fillStyle='rgba(214,214,220,'+a.toFixed(2)+')';g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()}
  const t=pzSeaT();for(const e of ENTS){if(e.map!=='playa'||!e.smoke)continue;if(Math.abs(e.x-P.x)>300)continue;const s=e.dir===2?-1:1,X=e.x+s*4,Y=e.y-14;const k=.6+.4*Math.sin(t*3+e.x);
    g.fillStyle=e.smoke==='puro'?'#6a4a2a':'#f4f4f0';g.fillRect(X-(s<0?3:0),Y,3,1);g.fillStyle='rgba(255,'+(120+k*60|0)+',40,'+(.7+.3*k).toFixed(2)+')';g.fillRect(X+(s<0?-4:3),Y,1,1);if(night){g.fillStyle='rgba(255,150,60,.25)';g.fillRect(X+(s<0?-6:1),Y-2,5,5)}}}
