// El bus (modo trip) y el mirador (modo view) tapan la pantalla con su propia capa opaca: no hace falta dibujar el mundo detrás.
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;try{if(!PRO){update(dt);if(mode!=='trip'&&mode!=='view')render(dt)}}catch(err){console.error(err)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window.__MB={get S(){return S},P,NPC,MAPS,interact,get mode(){return mode},TALK};
/* ===== Pulpería: catálogo, precios dinámicos y tienda táctil ===== */
const SHOP_USE={pandepina:'Comer',queso:'Comer',salchichon:'Comer',pozuelo:'Comer',frescoleche:'Tomar',imperial:'Tomar',tazos:'Abrir',natillab:'Comer'};
const SHOP_USE_MSG={pandepina:'Pan de piña: dulce y suavecito.',queso:'Queso Turrialba: rechina en los dientes.',salchichon:'Un bocadillo de salchichón. ¡Pura energía!',pozuelo:'Galletitas Pozuelo con el cafecito imaginario.',frescoleche:'¡Fresco leche heladito!',imperial:'Refrescante, como en un partido de la Sele.',natillab:'Natilla de bolsa con tortilla. Rico.'};
const SHOP_CATS=[['todo','Todo'],['mandados','Mandados'],['golosinas','Bebidas y golosinas']];
const CATALOG=[
 {id:'tortillas',cat:'mandados'},{id:'pandepina',cat:'mandados',stock:5},{id:'queso',cat:'mandados',stock:3},{id:'salchichon',cat:'mandados'},
 {id:'natilla',cat:'mandados'},{id:'natillab',cat:'mandados'},{id:'cafe',cat:'mandados'},{id:'tapadulce',cat:'mandados'},{id:'huevos',cat:'mandados',stock:4},{id:'pozuelo',cat:'mandados'},{id:'queque',cat:'mandados'},
 {id:'frescoleche',cat:'golosinas'},{id:'imperial',cat:'golosinas'},{id:'fresco',cat:'golosinas'},{id:'coca',cat:'golosinas'},
 {id:'tazos',cat:'golosinas',stock:4},{id:'chicle',cat:'golosinas'}];
const SHOP_ICON={cafe:[['#5a3a1e',3,3,10,11],['#f4ead2',4,6,8,4],['#c0473b',5,7,6,2]],tapadulce:[['#8a5a2b',2,6,12,6],['#b87a3a',3,7,4,2],['#b87a3a',9,8,3,2]],huevos:[['#e0d2b0',2,7,12,6],['#f4ead2',3,6,3,2],['#f4ead2',8,6,3,2]],tortillas:[['#f4ead2',2,5,12,6],['#e0c48a',3,6,4,1],['#e0c48a',9,8,3,1],['#3f7fd1',2,9,12,2]],pandepina:[['#e0a34f',2,5,12,8],['#f2c94c',4,4,8,3],['#f2994a',5,4,6,1]],
 queso:[['#f4f0dc',2,6,12,7],['#d8d2b4',2,6,12,1],['#ffffff',4,8,3,2]],salchichon:[['#a8423a',1,6,14,5],['#d06a5a',3,7,2,2],['#d06a5a',9,8,2,2],['#f4ead2',0,7,1,3],['#f4ead2',15,7,1,3]],
 natilla:[['#f4f4f4',4,4,8,10],['#2a6fb0',4,4,8,3],['#fffbe8',5,8,6,4]],natillab:[['#f4f4f4',3,3,10,11],['#7bb661',3,5,10,3],['#2a6fb0',5,10,6,2]],
 pozuelo:[['#c0473b',2,4,12,9],['#f2c94c',3,6,10,4],['#c98a3a',4,7,3,2],['#c98a3a',9,7,3,2]],queque:[['#f2994a',2,7,12,6],['#f2c94c',2,6,12,2],['#fffbe8',4,5,8,1]],
 frescoleche:[['#f4f4f4',4,3,8,11],['#f193b4',4,3,8,2],['#c9a46a',6,8,4,3]],imperial:[['#6b4a1e',6,2,4,3],['#c08a2a',5,5,6,9],['#f4ead2',5,8,6,3],['#c0473b',7,9,2,1]],
 fresco:[['#bce7ee',4,3,8,11],['#f2c94c',5,6,6,7]],coca:[['#4a2a14',5,1,6,14],['#c0473b',5,6,6,3],['#c0473b',6,0,4,1]],
 tazos:[['#f2c94c',3,3,10,10],['#f2994a',5,5,6,6],['#3f7fd1',7,7,2,2]],chicle:[['#d64545',2,8,3,3],['#f2c94c',6,6,3,3],['#7bb661',10,8,3,3],['#f193b4',6,10,3,3]]};
function shopIcon(id){const r=SHOP_ICON[id]||[['#c49d6c',3,3,10,10]];return '<svg viewBox="0 0 16 16" class="sicon" shape-rendering="crispEdges">'+r.map(([c,x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`).join('')+'</svg>'}
function shopClerk(){return NPC.rosa&&NPC.rosa.map==='pulperia'&&on('rosa')?'rosa':null}
function shopStock(){if(!S.f.stock||S.f.stock.day!==S.day){S.f.stock={day:S.day};CATALOG.forEach(c=>{if(c.stock)S.f.stock[c.id]=c.stock})}return S.f.stock}
/* Reglas de precio: hora del día, lluvia, inventario diario y misiones */
function shopOffer(id){const base=PRICES[id],pd=period(),st=shopStock(),deliv=(S.activities&&S.activities.stats&&S.activities.stats.delivery)||0;let p=base,tags=[],avail=true,why='';
 if(id==='pandepina'){if(pd==='m'){p=Math.round(base*.75);tags.push('Recién horneado')}if(pd==='n'){avail=false;why='Se acabó. Llega mañana temprano.'}}
 if(id==='tortillas'&&pd==='m')tags.push('Calientitas');
 if(id==='queso'&&S.day%3===0){avail=false;why='El camión de Turrialba viene mañana.'}
 if((id==='frescoleche'||id==='imperial'||id==='fresco')){if(pd==='t'&&!S.rain){p+=100;tags.push('Hace calor')}if(S.rain){p-=100;tags.push('Precio de aguacero')}}
 if(id==='tazos'&&pd==='t')tags.push('Salen los chiquitos de la escuela');
 if(pd==='n'&&id!=='chicle'){p=Math.round(p*1.1);tags.push('Recargo nocturno')}
 if(deliv>=3){p=Math.round(p*.9);tags.push('Cliente de confianza −10%')}
 if(id==='tortillas'&&qs('tortillas')>=2){p=Math.max(100,p-100);tags.push('Encargo de '+N('mama'))}
 if(id==='queque'&&qs('visita')===1){tags.push('Ideal para la visita')}
 if(st[id]!==undefined&&st[id]<=0){avail=false;why='Agotado por hoy.'}
 p=Math.max(50,Math.round(p/50)*50);return{p,base,tags,avail,why,left:st[id]}}
let SHOP={id:null,cat:'todo',sel:null,mood:'idle',line:''};
const SHOP_LINES={hello:['¡Buenas, buenas! ¿Qué se le ofrece?','Pase adelante, ¿qué anda buscando?','¡Hola, mi amor! Todo fresquito hoy.'],
 thanks:{tortillas:'Calientitas, recién llegadas. Salúdeme a Lucía.',queque:'Buena elección. Este queque abre puertas, ¡se lo digo yo!',queso:'Turrialba del bueno. Con tortilla, ¡uf!',pandepina:'El pan de piña es mi debilidad, no le digo a nadie.',tazos:'¡Ojalá le salga el dorado!',imperial:'Bien fría, como debe ser.',natilla:'Esa natilla la hace mi comadre.',salchichon:'Para un buen gallito, ¿verdad?',_:'Aquí tiene. ¡Que le aproveche!'}};
function shopSay(mood,line){SHOP.mood=mood;SHOP.line=line;const r=$('#shopRosa'),b=$('#shopLine');if(!r)return;r.className='srosa '+mood;void r.offsetWidth;r.classList.add('anim');b.textContent=line;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
function cashSound(){beep(1320,.06,'square',.04);setTimeout(()=>beep(1760,.12,'triangle',.05),70);setTimeout(()=>beep(2640,.25,'sine',.03),150)}
let SHOPFX={t:0,mood:'',txt:''};
function openShop(id,cat){SHOP.id=id;SHOP.cat=cat||'todo';SHOP.sel=null;shopStock();
 const greet=id?rot('rosaHi',SHOP_LINES.hello):'No hay nadie en el mostrador. Hay un cuaderno: «Deje la plata aquí».';
 openPanel('Pulpería La Bendición',`<div class="shop">
  <div class="shead"><div id="shopRosa" class="srosa idle ${id?'':'away'}"><i class="h"></i><i class="f"></i><i class="g"></i><i class="b"></i></div>
   <div class="sbub"><b>${id?esc(N('rosa')):'Mostrador'}</b><span id="shopLine">${esc(greet)}</span></div></div>
  <div class="swallet"><span>👛 <b id="shopMoney">₡${S.money}</b></span><span id="shopFiado">${S.f.fiado?'Cuaderno: ₡'+S.f.fiado:''}</span><span class="stime">${({m:'Mañana',t:'Tarde',e:'Atardecer',n:'Noche'})[period()]}</span></div>
  <div class="stabs">${SHOP_CATS.map(([k,l])=>`<button class="alt" data-cat="${k}">${l}</button>`).join('')}</div>
  <div id="shopList" class="slist"></div>
  <div id="shopBar" class="sbar"></div>
  <div class="sextra"><button class="alt" data-x="jobs">📦 Mandados del día</button>${hasI('tomate')?'<button class="alt" data-x="tom">🍅 Vender tomates</button>':''}${S.f.fiado?'<button class="alt" data-x="pay">📒 Pagar fiado</button>':''}</div>
  <div id="shopCash" class="scash">¡Cha-ching!</div></div>`);
 const pb=$('#pbody');pb.closest('.box').classList.add('shopbox');
 pb.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{SHOP.cat=b.dataset.cat;SHOP.sel=null;shopRender()});
 pb.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{const x=b.dataset.x;
  if(x==='jobs'){closePanel();deliveryTalk(id);runDialog()}
  if(x==='tom'){const n=S.inv.tomate||0;delete S.inv.tomate;const v=n*ACTIVITY_RULES.cropValue();S.money+=v;saveGame();cashSound();shopSay('happy','¡Qué fresquitos! Aquí tiene ₡'+v+'.');b.remove();shopRender()}
  if(x==='pay'){const f=S.f.fiado||0,pay=Math.min(f,S.money);if(!pay){shopSay('sad','Cuando tenga, me paga. No se preocupe.');return}S.money-=pay;S.f.fiado=f-pay;if(!S.f.fiado)delete S.f.fiado;saveGame();cashSound();shopSay('happy',S.f.fiado?'Abonó ₡'+pay+'. Quedan ₡'+S.f.fiado+' en el cuaderno.':'¡Cuenta saldada! Usted sí es gente seria.');if(!S.f.fiado)b.remove();shopRender()}});
 shopRender()}
function shopRender(){const pb=$('#pbody');if(!pb||!$('#shopList'))return;
 pb.querySelectorAll('[data-cat]').forEach(b=>b.classList.toggle('on',b.dataset.cat===SHOP.cat));
 $('#shopMoney').textContent='₡'+S.money;$('#shopFiado').textContent=S.f.fiado?'Cuaderno: ₡'+S.f.fiado:'';
 const list=CATALOG.filter(c=>SHOP.cat==='todo'||c.cat===SHOP.cat);
 $('#shopList').innerHTML=list.map(c=>{const o=shopOffer(c.id),have=S.inv[c.id]||0,cant=o.avail&&S.money<o.p;
  return `<button class="sitem ${SHOP.sel===c.id?'sel':''} ${o.avail?'':'off'} ${cant?'cant':''}" data-it="${c.id}">${shopIcon(c.id)}
   <span class="sinfo"><b>${esc(ITEMS[c.id][0])}</b><small>${esc(o.avail?ITEMS[c.id][1]:o.why)}</small>${o.tags.length&&o.avail?`<em>${esc(o.tags.join(' · '))}</em>`:''}</span>
   <span class="sprice">${o.avail?(o.p!==o.base?`<s>₡${o.base}</s>`:'')+`₡${o.p}`:'—'}<small>Mochila: ${have}</small>${o.left!==undefined&&o.avail?`<small>Quedan ${o.left}</small>`:''}</span></button>`}).join('');
 $('#shopList').querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>{SHOP.sel=SHOP.sel===b.dataset.it?null:b.dataset.it;beep(800,.03);shopRender()});
 const bar=$('#shopBar');if(!SHOP.sel){bar.innerHTML='<p class="shint">Tocá un producto para comprarlo.</p>';return}
 const o=shopOffer(SHOP.sel),nm=ITEMS[SHOP.sel][0];
 if(!o.avail){bar.innerHTML=`<p class="shint">${esc(o.why)}</p>`;return}
 const ok=S.money>=o.p,canFiar=SHOP.id&&(S.f.fiado||0)+o.p<=3000;
 bar.innerHTML=`<span><b>${esc(nm)}</b> · ₡${o.p}</span>${ok?`<button class="green" data-buy="1">Comprar</button>`:`<button class="red" data-buy="0">No alcanza</button>`}${!ok&&canFiar?'<button class="alt" data-buy="f">Fiado</button>':''}`;
 bar.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>shopBuy(SHOP.sel,b.dataset.buy))}
function shopBuy(item,how){const o=shopOffer(item),st=shopStock();if(!o.avail)return;
 if(how==='0'){beep(180,.25,'sawtooth',.04);const falta=o.p-S.money;shopSay('sad',SHOP.id?rot('rosaNo',['¡Ay, mi amor! Le faltan ₡'+falta+'.','Uy, no le alcanza... le faltan ₡'+falta+'. ¿Se lo apunto?','Con ₡'+S.money+' no me da, le faltan ₡'+falta+'.']):'No te alcanza. Faltan ₡'+falta+'.');SHOPFX={t:performance.now()+1600,mood:'sad'};return}
 if(how==='f'){S.f.fiado=(S.f.fiado||0)+o.p;shopSay('think','Bueno, se lo apunto en el cuaderno. Me debe ₡'+S.f.fiado+'. ¡No se me pierda!')}
 else{S.money-=o.p;const t=SHOP_LINES.thanks;shopSay('happy',SHOP.id?(t[item]||t._):'Dejás ₡'+o.p+' junto al cuaderno.')}
 if(st[item]!==undefined)st[item]--;addI(item);cashSound();SHOPFX={t:performance.now()+1600,mood:how==='f'?'think':'happy',txt:'-₡'+o.p};
 const c=$('#shopCash');if(c){c.textContent=how==='f'?'📒 Anotado':'¡Cha-ching! −₡'+o.p;c.classList.remove('go');void c.offsetWidth;c.classList.add('go')}
 saveGame();shopRender()}
/* Ambiente: luz cálida, bombillos que titilan, efectos de caja y emociones del pulpero */
function shopFX(ctx,m,cx,cy){const now=performance.now();ctx.save();ctx.fillStyle='rgba(255,170,70,.07)';ctx.fillRect(0,0,VW,VH);
 ctx.globalCompositeOperation='lighter';for(const bx of[4,10]){const fl=.18+.04*Math.sin(now/170+bx),X=(bx*T+7.5-cx)*Z,Y=(6-cy)*Z,r=28*Z;const gr=ctx.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,`rgba(255,200,110,${fl})`);gr.addColorStop(1,'rgba(255,200,110,0)');ctx.fillStyle=gr;ctx.fillRect(X-r,Y-r,r*2,r*2);ctx.fillStyle='#ffe9a8';ctx.fillRect(X-1.5*Z,Y,3*Z,3*Z)}
 ctx.globalCompositeOperation='source-over';
 if(SHOPFX.t>now){const k=1-(SHOPFX.t-now)/1600;const rx=(3*T+104-cx)*Z,ry=(4*T-14-cy-k*14)*Z;ctx.globalAlpha=1-k;
  if(SHOPFX.txt){ctx.fillStyle='#f2c94c';ctx.font=`bold ${Math.round(6*Z)}px monospace`;ctx.textAlign='center';ctx.fillText(SHOPFX.txt,rx,ry);for(let i=0;i<5;i++){ctx.fillRect(rx+Math.cos(i*1.3+k*6)*k*14*Z,ry+Math.sin(i*1.3)*k*8*Z,Z*1.5,Z*1.5)}}
  const n=NPC.rosa;if(n&&n.map==='pulperia'){const X=(n.x-cx)*Z,Y=(n.y-cy-30-Math.sin(k*9)*2)*Z;ctx.fillStyle='#f4ead2';ctx.fillRect(X-5*Z,Y-5*Z,10*Z,9*Z);ctx.fillStyle='#14101c';ctx.font=`bold ${Math.round(7*Z)}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(SHOPFX.mood==='sad'?'…':SHOPFX.mood==='think'?'✎':'♥',X,Y)}
  ctx.globalAlpha=1}
 ctx.restore()}

