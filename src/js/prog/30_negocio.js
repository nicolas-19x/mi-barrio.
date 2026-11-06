// ================= PROGRESO · NEGOCIO PROPIO E INVERSIONES =================
// Carrito de copos en la plaza → soda en el lote de la Calle 3. Tanda, lotería, cooperativa y el prestamista del Hoyo.
var DOWN=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
function yJoin(a){return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' y '+a[a.length-1]}
function dow(d){return((d==null?S.day:d)-1)%7}
function NEG(){const p=PGS();if(!p.neg||p.neg.v!==1)p.neg=Object.assign({v:1,cart:0,stock:0,sold:0,fama:10,up:{},soda:0,obra:null,cook:0,permiso:0,rentNext:0,rentDebt:0,closed:0,earn:0,best:0,sodaSrv:0,ayud:0},p.neg||{});const n=p.neg;if(n.nombre===undefined)Object.assign(n,{nombre:'Soda Mi Barrio',nombrePend:0,ari:'',ariDias:0,ariAcc:0,ariaGan:0,rec:{},sup:{},fr:{},cat:{dia:0,l:[],act:[],hechos:0},ult:null});return n}
function progSodaLv(){return S&&S.f&&S.f.pg&&S.f.pg.neg?S.f.pg.neg.soda|0:0}
const CART_AT={x:53,y:72};
// ---------- motor de atención (copos y soda) ----------
let SRV=null;
const SRV_NAMES=['Chiquito de escuela','Doña Lidia','Un mae de la mejenga','Pareja de novios','Señor del bus','Doña Cuca','La de la tienda','Un turista perdido','Chiquilla de colegio','Don Chepe','Una señora con sombrilla','El cartero','Un pastor evangélico','Muchacha del EBAIS'];
const SRV_FACE=['🧒','👵','🧑','💑','👴','👩','🧑‍🦱','🧔','👧','👨‍🦳','👩‍🦳','📮','🙏','👩‍⚕️'];
const COPO_CFG={title:'🍧 Carrito de copos',sub:'Raspá el hielo y servilo como lo piden.',dur:75,
 cats:[{k:'sir',n:'Sirope',one:1,o:[['kola','Kola','#c0473b'],['fresa','Fresa','#ef6f8a'],['menta','Menta','#4fb37a'],['tam','Tamarindo','#8a5a2b'],['pina','Piña','#f2c94c']]},
       {k:'top',n:'Encima',o:[['polvo','Leche en polvo','#f4f0e6'],['cond','Condensada','#efe2b8'],['helado','Helado de vainilla','#fff6d6',()=>NEG().up.helado]]}],
 price(o){return 1000+(o.top.includes('helado')?500:0)},cost:300,
 say(o){const s=COPO_CFG.cats[0].o.find(x=>x[0]===o.sir)[1].toLowerCase(),t=o.top.map(k=>({polvo:'leche en polvo',cond:'condensada',helado:'helado'})[k]);
   return pick(['Uno de '+s,'Regáleme uno de '+s,'Un copo de '+s,'Diay, uno de '+s])+(t.length?' con '+yJoin(t):' solo, sin nada')+(Math.random()<.3?', porfa.':'.')},
 order(){const a=COPO_CFG.cats[0].o,tp=['polvo','cond'].concat(NEG().up.helado?['helado']:[]),o={sir:pick(a)[0],top:[]};for(const k of tp)if(Math.random()<(k==='helado'?.3:.6))o.top.push(k);if(Math.random()<.75&&!o.top.length)o.top.push('cond');return o},
 cup(sel){const s=COPO_CFG.cats[0].o.find(x=>x[0]===sel.sir),c=s?s[2]:'#e8f2f8';return`<div class="srv-cup"><div class="srv-ice" style="--c:${c}">${sel.top.includes('polvo')?'<i class="dots"></i>':''}${sel.top.includes('cond')?'<i class="drz"></i>':''}${sel.top.includes('helado')?'<i class="ball"></i>':''}</div><div class="srv-vaso"></div></div>`}};
const SODA_CFG={get title(){return'🍛 '+(typeof sodaNombre==='function'?sodaNombre():'Soda Mi Barrio')},sub:'Casados, gallos y fresco natural. Que no se le enfríe a nadie.',dur:90,
 cats:[{k:'pla',n:'Plato',one:1,o:[['casado','Casado','#c98a4a'],['gallo','Gallo pinto','#6b4a34'],['arroz','Arroz con pollo','#e2b33a'],['olla','Olla de carne','#b8553c'],['sopa','Sopa negra','#3a2a24'],['apollo','Arroz con pollo de la abuela','#e8b13a',()=>recOn('apollo')],['chifri','Chifrijo de Ariana','#c8472f',()=>recOn('chifri')]]},
       {k:'fre',n:'Fresco',one:1,o:[['cas','Cas','#e8d27a'],['mora','Mora','#7d3c86'],['tam','Tamarindo','#8a5a2b'],['horch','Horchata','#efe2c8'],['agua','Agua dulce','#c48a3a']]},
       {k:'ext',n:'Extra',o:[['maduro','Maduro','#e2b33a'],['huevo','Huevo frito','#fff6d6'],['natilla','Natilla','#f4f0e6'],['tres','Tres leches','#f2ead2',()=>recOn('tres')]]}],
 price(o){const lv=progSodaLv();return([0,3000,3500,4000,4500,5200][lv]||3000)+700+o.ext.length*400+((o.pla==='apollo'||o.pla==='chifri')?900:0)+(o.ext.includes('tres')?300:0)+(sodaUp('horno')?250:0)},cost:1500,
 say(o){const C=SODA_CFG.cats,n=(i,k)=>C[i].o.find(x=>x[0]===k)[1].toLowerCase().replace('ariana','Ariana');return pick(['Me da un ','Regáleme un ','Un ','Diay, ¿me hace un '])+n(0,o.pla)+(o.ext.length?' con '+yJoin(o.ext.map(k=>n(2,k))):'')+', y fresco de '+n(1,o.fre)+'.'},
 order(){const C=SODA_CFG.cats,ok=a=>a.filter(x=>!x[3]||x[3]()),o={pla:pick(ok(C[0].o))[0],fre:pick(ok(C[1].o))[0],ext:[]};for(const x of ok(C[2].o))if(Math.random()<.2)o.ext.push(x[0]);return o},
 cup(sel){const C=SODA_CFG.cats,f=(i,k)=>{const x=C[i].o.find(y=>y[0]===k);return x?x[2]:null},p=f(0,sel.pla),d=f(1,sel.fre);
   return`<div class="srv-plate"><div class="plato">${p?`<i style="background:${p}"></i><i class="rice"></i>`:''}${sel.ext.includes('maduro')?'<i class="mad"></i>':''}${sel.ext.includes('huevo')?'<i class="egg"></i>':''}${sel.ext.includes('natilla')?'<i class="nat"></i>':''}${sel.ext.includes('tres')?'<i class="nat" style="background:#f2ead2!important;left:60px;top:8px;width:24px"></i>':''}</div><div class="vaso" style="--c:${d||'transparent'}"></div></div>`}};
function srvEmpty(cfg){const o={};for(const c of cfg.cats)o[c.k]=c.one?null:[];return o}
function srvStart(cfg,opt){const busy=opt.busy||1,s=SRV={cfg,opt,t:cfg.dur,q:[],sel:srvEmpty(cfg),money:0,cost:0,ok:0,bad:0,gone:0,nx:.6,tips:0,stock:opt.stock==null?99:opt.stock};
  openPanel(cfg.title,'<div class="srv" id="srv"></div>');$('#panel').dataset.kind='activity';srvRender();
  s.iv=setInterval(()=>{if(SRV!==s)return clearInterval(s.iv);if($('#panel').classList.contains('hidden'))return srvEnd(true);const dt=.1;s.t-=dt;s.nx-=dt*busy;
    if(s.nx<=0&&s.q.length<3&&s.t>6){const i=Math.floor(Math.random()*SRV_NAMES.length),pat=(opt.pat||14)*(.8+Math.random()*.4);s.q.push({n:SRV_NAMES[i],f:SRV_FACE[i],o:cfg.order(),p:pat,mx:pat});s.nx=5+Math.random()*4;beep(1200,.03,'sine',.02)}
    s.q.forEach((c,i)=>{c.p-=dt*(i?.25:1)});const lost=s.q.filter(c=>c.p<=0);if(lost.length){s.gone+=lost.length;s.q=s.q.filter(c=>c.p>0);beep(220,.12,'sawtooth',.03)}
    if(s.t<=0)return srvEnd(false);srvTick()},100)}
function srvTick(){const s=SRV;if(!s)return;const t=$('#srvT');if(t)t.textContent=Math.ceil(s.t);for(const[i,c]of s.q.entries()){const b=document.querySelector('#srvQ [data-i="'+i+'"] i');if(b){b.style.width=Math.max(0,c.p/c.mx*100)+'%';b.style.background=c.p/c.mx<.3?'#d6453c':c.p/c.mx<.6?'#f2c94c':'#57d17a'}}
  if(s.qn!==s.q.length||s.q[0]!==s.q0){s.qn=s.q.length;s.q0=s.q[0];srvRender()}}
function srvRender(){const s=SRV,c=s.cfg,el=$('#srv');if(!el)return;const cur=s.q[0];
  el.innerHTML=`<div class="srv-top"><span>⏱ <b id="srvT">${Math.ceil(s.t)}</b> s</span><span>💰 <b>${fmtC(s.money)}</b></span><span>✔ ${s.ok} · ✖ ${s.bad+s.gone}</span>${s.opt.stock!=null?`<span>📦 ${s.stock}</span>`:''}</div>
  <div class="srv-q" id="srvQ">${s.q.map((q,i)=>`<div class="srv-cl${i?'':' on'}" data-i="${i}"><span class="f">${q.f}</span><span class="n">${esc(q.n)}</span><b><i></i></b></div>`).join('')||'<p class="note">Nadie en la fila… todavía.</p>'}</div>
  <div class="srv-say">${cur?'«'+esc(c.say(cur.o))+'»':'<span class="note">'+esc(c.sub)+'</span>'}</div>
  <div class="srv-mid">${c.cup(s.sel)}</div>
  ${c.cats.map(k=>`<div class="srv-cat"><small>${k.n}${k.one?'':' (varios)'}</small><div>${k.o.filter(o=>!o[3]||o[3]()).map(o=>{const on=k.one?s.sel[k.k]===o[0]:s.sel[k.k].includes(o[0]);return`<button class="srv-b${on?' on':''}" data-srv="${k.k}:${o[0]}" style="--c:${o[2]}">${o[1]}</button>`}).join('')}</div></div>`).join('')}
  <div class="row srv-act"><button class="green" data-srv="go" ${cur?'':'disabled'}>Entregar</button><button class="alt" data-srv="bota">Botar y empezar de nuevo</button><button class="alt" data-srv="fin">Cerrar el chinamo</button></div>`;
  srvTick()}
function srvSame(a,b){for(const k in a){const x=a[k],y=b[k];if(Array.isArray(x)){if(x.length!==y.length||x.some(v=>!y.includes(v)))return false}else if(x!==y)return false}return true}
function srvClick(v){const s=SRV;if(!s)return;if(v==='fin')return srvEnd(false);if(v==='bota'){s.sel=srvEmpty(s.cfg);return srvRender()}
  if(v==='go'){const cur=s.q[0];if(!cur)return;if(s.stock<=0){toast('📦 Se te acabaron los insumos');return srvEnd(false)}s.stock--;s.cost+=s.cfg.cost;
    if(srvSame(cur.o,s.sel)){const pr=s.cfg.price(cur.o),tip=cur.p/cur.mx>.6?Math.round(pr*.1/50)*50*(Math.random()<.6?1:0):0;s.money+=pr+tip;s.tips+=tip;s.ok++;cashSound();if(tip)toast('🪙 Propina de '+fmtC(tip))}
    else{s.bad++;s.money+=Math.round(s.cfg.price(cur.o)*.5/50)*50;beep(180,.15,'square',.03);toast(pick(['«¡Eso no fue lo que le pedí!» …pero igual paga la mitad.','«Diay, ¿y esto?» Lo acepta de mala gana.','«Mae, ¿usted está dormido?»']))}
    s.q.shift();s.sel=srvEmpty(s.cfg);return srvRender()}
  const[k,o]=v.split(':'),cat=s.cfg.cats.find(c=>c.k===k);if(!cat)return;if(cat.one)s.sel[k]=s.sel[k]===o?null:o;else{const a=s.sel[k],i=a.indexOf(o);i<0?a.push(o):a.splice(i,1)}beep(900,.02,'triangle',.02);srvRender()}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-srv]');if(!b||!SRV)return;e.stopPropagation();srvClick(b.dataset.srv)},true);
function srvEnd(closed){const s=SRV;if(!s)return;SRV=null;clearInterval(s.iv);if(!closed)closePanel();s.opt.done&&s.opt.done(s)}
// ---------- el carrito de copos ----------
function cartSprite(){if(cartSprite.c)return cartSprite.c;const b=hdBuf(48,64);
  hdEll(b,24,58,20,4,[0,0,0],.25);for(const x of[10,38]){hdEll(b,x,54,5,5,[30,30,34]);hdEll(b,x,54,2,2,[160,160,166])}
  hdR(b,4,30,40,20,[244,244,240]);hdR(b,4,40,40,3,[42,82,160]);hdR(b,4,43,40,3,[244,244,240]);hdR(b,4,46,40,3,[214,69,60]);hdR(b,4,30,40,2,[255,255,255]);hdR(b,42,30,2,20,[200,200,200]);
  hdR(b,8,22,22,9,[200,228,240]);hdR(b,9,23,20,7,[236,248,255]);hdR(b,11,24,10,5,[250,252,255]);
  for(const[i,c]of[[0,[192,71,59]],[1,[239,111,138]],[2,[79,179,122]],[3,[138,90,43]],[4,[242,201,76]]]){hdR(b,31+i*2.4,19,2,11,c);hdR(b,31+i*2.4,18,2,2,[240,240,240])}
  hdR(b,23,4,2,27,[150,150,156]);for(let i=-22;i<=22;i++){const h=8-Math.abs(i)*.18;hdR(b,24+i,4+Math.abs(i)*.18,1,h,(Math.floor((i+22)/7)%2)?[244,244,240]:[214,69,60])}
  hdText(b,10,32,'COPOS',[214,69,60]);cartSprite.c=hdToCanvas(b);return cartSprite.c}
hookAfter('progProxies',function(list,map){const n=S&&S.f&&S.f.pg&&S.f.pg.neg;if(map!=='ext'||!n||!n.cart)return;const X=CART_AT.x*T+8,Y=CART_AT.y*T+12,s=cartSprite();
  list.push({kind:'carv',map,x:X,y:Y,draw:g=>g.drawImage(s,X-12,Y-30,24,32)})});
function cartSolid(){const m=MAPS.ext;if(m&&S&&S.f&&S.f.pg&&S.f.pg.neg&&S.f.pg.neg.cart)m.s[CART_AT.y*m.w+CART_AT.x]=1}
hookAfter('startGame',function(){try{cartSolid()}catch(e){}});
const CART_UP={sombrilla:{n:'Sombrilla nueva',c:4000,t:'La gente espera más tranquila en la sombra.'},helado:{n:'Helado de vainilla',c:8000,t:'Nuevo topping: el copo «con todo» vale ₡500 más.'},parlante:{n:'Parlantito con marimba',c:6000,t:'Llega más gente atraída por la música.'},ayudante:{n:'Ayudante (Chamaco)',c:5000,t:'Cuando no vendés vos, vende él: ganancia diaria si hay insumos.'}};
function copoBusy(){const h=S.t/60;let b=1;if(h>=11&&h<15)b*=1.35;if(dow()===6)b*=1.4;if(dow()===5)b*=1.2;if(S.rain)b*=.45;if(NEG().up.parlante)b*=1.25;return b*(.8+NEG().fama/120)}
function cartTalk(){const n=NEG(),h=S.t/60,e=E(),ch=[];
  if(h>=10&&h<18.5)ch.push({t:'Vender copos ('+n.stock+' en insumos)',f(){if(n.stock<=0)return say(null,'No tenés insumos. Sin hielo no hay copo.');if(e.en<15)return say(null,'Estás muy cansado para raspar hielo.');
    if(S.rain)toast('🌧 Con este aguacero casi nadie quiere copo… pero alguno habrá.');afterD(()=>setTimeout(()=>srvStart(COPO_CFG,{busy:copoBusy(),pat:(n.up.sombrilla?28:22),stock:n.stock,done:copoDone}),80))}});
  else ch.push({t:'Vender copos (de 10 a.m. a 6 p.m.)',f(){say(null,h<10?'Muy temprano: la gente todavía está con el cafecito.':'Ya es muy tarde. La plaza está quedándose sola.')}});
  ch.push({t:'Encargar insumos (₡5 000 · 20 copos)',f(){if(S.money<5000)return say(null,'No te alcanza.');spend(5000,'Negocio');n.stock+=20;toast('🧊 +20 copos en insumos (hielo, siropes y leches)')}});
  const ups=Object.entries(CART_UP).filter(([k])=>!n.up[k]);if(ups.length)ch.push({t:'Mejorar el carrito',f(){say(null,'¿Qué le ponés al carrito?',ups.map(([k,u])=>({t:u.n+' ('+fmtC(u.c)+')',f(){if(S.money<u.c)return say(null,'No te alcanza.');spend(u.c,'Negocio');n.up[k]=1;toast('🍧 '+u.n+': '+u.t);if(k==='ayudante')say(fillChar({id:'z_hoyo5',name:'Chamaco',hair:'rizos',hairColor:'#1c1c1c',skin:'#8d5524',shirt:'#c0473b',pants:'#2d3a6e',v:1}),'¡Pura vida, jefe! Yo le cuido el carrito y le vendo como loco. Usted solo déjeme insumos.')}})).concat([{t:'Nada'}]))}});
  ch.push({t:'Nada'});say(null,'Tu carrito de copos: '+n.sold+' vendidos'+(n.best?' · mejor tanda '+fmtC(n.best):'')+'.',ch)}
function copoDone(s){const n=NEG();n.stock=s.stock;n.sold+=s.ok+s.bad;n.fama=clamp(n.fama+s.ok*.6-s.bad*.8-s.gone*1.2,0,100);const net=s.money;n.best=Math.max(n.best,net);n.earn+=net-s.cost;earn(net,'Negocio');
  fadeDo(()=>{passTime(Math.max(60,Math.round((COPO_CFG.dur-Math.max(0,s.t))/COPO_CFG.dur*150)));enAdd(-12)},()=>{
   say(null,'🍧 Vendiste '+(s.ok+s.bad)+' copos: '+fmtC(net)+(s.tips?' (con '+fmtC(s.tips)+' de propinas)':'')+'. Insumos usados: '+fmtC(s.cost)+'. '+(s.gone?s.gone+' clientes se fueron aburridos. ':'')+'Fama del carrito: '+Math.round(n.fama)+'.');
   if(n.sold>=40&&!n.sodaHint){n.sodaHint=1;say(null,'Mientras guardás el carrito ves el rótulo del lote de la Calle 3: «SE VENDE · TEL 8701-2244». Ahí cabría una soda…')}
   runDialog();if(typeof progRep==='function')progRep(s.ok>=8?2:1);if(typeof progStat==='function')progStat('copos',s.ok+s.bad);saveGame()})}
ACT_POINTS.push({map:'ext',x:CART_AT.x,y:CART_AT.y+1,label:'Tu carrito de copos',cond:()=>NEG().cart>0,run:cartTalk});
// Doña Mireya (Chepe) vende su carrito viejo
{const _mt=mireyaTalk;mireyaTalk=function(e){if(NEG().cart)return _mt(e);const c=e.c;say(c,'¿Un copito, mi amor? Y vea… ando vendiendo mi carrito viejo, que mis hijos me regalaron uno nuevo con sombrilla y todo.',[
  {t:'Comprarle el carrito viejo (₡15 000)',f(){if(S.money<15000)return say(c,'Ay, mi amor, ₡15 000 y es suyo. Ese carrito tiene más historia que el Teatro Nacional.');spend(15000,'Negocio');const n=NEG();n.cart=1;n.stock+=20;cartSolid();
    say(c,'¡Trato hecho! Mi yerno se lo lleva en el pickup a la plaza de su barrio, al lado de la fuente. Le dejo hielo y siropes para veinte copos.');say(c,'El secreto: hielo bien raspado, sirope hasta abajo, leche en polvo y un chorro de condensada. Lo demás es granizado de gringo.');toast('🍧 ¡Tenés carrito de copos! Está en la plaza del sur, junto a la fuente.');if(typeof progRep==='function')progRep(3,'Compraste un carrito de copos')}},
  {t:'Solo un copo (₡1 000)',f(){zBuy(1000,()=>{enAdd(12);say(null,'Hielo raspado, sirope de kola, leche en polvo y un chorro de condensada. +12⚡')})}},{t:'Después, Doña Mireya'}])};for(const e of ENTS)if(e.talk===_mt)e.talk=mireyaTalk}
// ---------- la soda del lote ----------
const RIGO={id:'z_rigo',name:'Don Rigo',hair:'calvo',hairColor:'#cfcfcf',skin:'#e0ac69',shirt:'#e9dcb5',pants:'#5a4a3a',acc:'sombrero',accColor:'#e9dcb5'};
function sodaTalk(){const n=NEG(),r=fillChar(Object.assign({v:1},RIGO));
  if(n.obra){return say(null,'Los maestros le están dando duro: «'+sodaNombre().toUpperCase()+'» va tomando forma. Faltan '+Math.max(0,n.obra.fin-S.day)+' días.')}
  if(!n.soda){say(null,'Llamás al número del rótulo: 8701-2244.');say(r,'¿Aló? Sí, el lote es mío. Venderlo no lo vendo barato, pero se lo alquilo: ₡10 000 por semana y usted pone la construcción.',[
    {t:'Montar una soda (₡85 000 · 4 días)',f(){if(n.sold<40)return say(r,'Mire, joven, una soda no es un juego. Primero demuéstreme que sabe vender: venda unos 40 copos y hablamos. (Llevás '+n.sold+').');if(S.money<85000)return say(r,'La construcción, la cocina industrial y las mesas le salen en unos ₡85 000. Cuando los tenga me llama.');
      spend(85000,'Negocio');n.obra={fin:S.day+4,lv:1};n.rentNext=S.day+7;say(r,'¡Trato hecho! Mañana mismo empiezan los maestros. Yo le cobro el alquiler cada semana.');toast('🏗 Obra de la soda: lista el día '+n.obra.fin);if(typeof progRep==='function')progRep(4,'Empezaste tu soda')}},
    {t:'Solo estaba preguntando'}]);return}
  if(n.nombrePend){n.nombrePend=0;return sodaNombrar(true)}
  const ch=[];const h=S.t/60;
  if(h>=6&&h<20&&!n.closed)ch.push({t:'Atender la soda vos mismo',f(){if(E().en<20)return say(null,'Estás muy cansado para la cocina.');afterD(()=>setTimeout(()=>srvStart(SODA_CFG,{busy:.85+n.fama/150+Math.min(.5,(progSodaLv()-1)*.12),pat:34,done:sodaDone}),80))}});
  if(n.closed)ch.push({t:'(Cerrada por el Ministerio de Salud hasta el día '+n.closed+')',f(){}});
  if(!n.cook)ch.push({t:'¿Quién cocina cuando no estoy?',f(){say(null,'Te hace falta una cocinera de confianza… alguien que sepa hacer empanadas y casados como en la casa de la abuela. En El Hoyo, Doña Chela vende las mejores empanadas del barrio.')}});
  else ch.push({t:'Hablar con Doña Chela',f(){const c=fillChar({id:'z_hoyo3',name:'Doña Chela',hair:'moño',hairColor:'#d8d8d8',skin:'#b97a4a',shirt:'#a6d8cb',pants:'#4b3b5b',v:1});say(c,pick(['Mijo, hoy se vendió la olla de carne completita. ¡Ni el caldo quedó!','La gente pregunta por usted. Les digo que el patrón anda en vueltas.','Gracias por la oportunidad, mijo. En El Hoyo nadie me daba trabajo de verdad.','Hay que comprar más tortillas, que el casado sin tortilla no es casado.']),[{t:'Despedirla',f(){n.cook=0;say(c,'Ay, mijo… está bien. Que Dios lo acompañe.')}},{t:'Seguir así'}])}});
  if(!n.permiso)ch.push({t:'Sacar el permiso sanitario (₡15 000)',f(){if(S.money<15000)return say(null,'No te alcanza.');spend(15000,'Negocio');n.permiso=1;toast('📄 Permiso del Ministerio de Salud al día');}});
  ch.push({t:'Administrar la soda (nombre, cocineras, mejoras, franquicias)',f(){afterD(()=>{openPhone();PHV.tab='apps';phRender();appOpen('soda')})}});
  ch.push({t:'Nada'});say(null,'Tu soda: fama '+Math.round(n.fama)+' · alquiler cada '+DOWN[dow(n.rentNext)]+(n.rentDebt?' · le debés '+fmtC(n.rentDebt)+' a Don Rigo':'')+'.',ch)}
function sodaDone(s){const n=NEG();n.fama=clamp(n.fama+s.ok*.5-s.bad*.8-s.gone,0,100);n.sodaSrv+=s.ok+s.bad;const net=s.money-s.cost;n.best=Math.max(n.best,s.money);n.earn+=net;earn(Math.max(0,net),'Negocio');
  fadeDo(()=>{passTime(180);enAdd(-16)},()=>{say(null,'🍛 Serviste '+(s.ok+s.bad)+' platos: '+fmtC(s.money)+' de venta, '+fmtC(s.cost)+' en ingredientes. Ganancia: '+fmtC(Math.max(0,net))+'.');runDialog();if(typeof progRep==='function')progRep(2);if(typeof progStat==='function')progStat('platos',s.ok+s.bad);saveGame()})}
ACT_POINTS.push({map:'ext',x:23,y:59,label:'El lote de la Calle 3',cond:()=>true,run:sodaTalk});
{const _hc=hoyoChela;hoyoChela=function(e){const n=NEG();if(!n.soda||n.cook)return _hc(e);say(e.c,'Mijo, ¿quiere empanaditas? …¿Qué? ¿Una soda? ¿Y usted quiere que yo cocine?',[
  {t:'Contratarla (₡5 000 al día)',f(){n.cook=1;say(e.c,'¡Ay, Diosito! Treinta años cocinando para mis nietos y para el barrio entero, y nadie nunca me había ofrecido trabajo de verdad.');say(e.c,'Mañana a las seis estoy ahí. Con delantal y todo. ¡Ya va a ver qué casados!');toast('👩‍🍳 Doña Chela cocina en tu soda: abre sola todos los días')}},
  {t:'Mejor solo las empanadas',f(){_hc(e)}}])}}
function sodaRerender(){const m=MAPS.ext;if(m&&HD_ON)renderMap(m)}
// ---------- noche: negocio, alquiler, inspecciones ----------
function negNight(){const n=S&&S.f&&S.f.pg&&S.f.pg.neg;if(!n||n.v!==1)return;const msgs=[];
  if(n.obra&&S.day>=n.obra.fin){n.soda=n.obra.lv;n.obra=null;setTimeout(sodaRerender,50);msgs.push(sodaListo(n.soda))}
  if(n.cart&&n.up.ayudante&&n.stock>=6){const k=Math.min(n.stock,Math.round(rnd(6,11)*(S.rain?.5:1)));n.stock-=k;const g=k*1000-k*300-1500;n.sold+=k;n.earn+=g;if(g>0){earn(g,'Negocio');msgs.push('🍧 Chamaco vendió '+k+' copos: te dejó '+fmtC(g))}}
  if(n.soda&&(n.cook||n.ari)){if(n.closed&&S.day<n.closed){}else{n.closed=0;msgs.push(sodaDia(n))}
    if(!n.permiso&&Math.random()<.07){n.closed=S.day+2;const f=20000;if(S.money>=f)spend(f,'Multas');else n.rentDebt+=f;msgs.push('🚫 Llegó el Ministerio de Salud sin avisar. Sin permiso sanitario: multa de ₡20 000 y la soda cerrada 2 días.')}
    else if(Math.random()<.05)msgs.push(pick(['📸 Una influencer subió un video de tu casado: «¡el mejor de la zona!». +fama','⚡ Se fue la luz media tarde y Doña Chela cocinó con leña. Los clientes encantados.','🐕 Firulais se robó un chicharrón de la cocina. Doña Chela lo perdonó.']));}
  if(n.soda&&S.day>=n.rentNext){n.rentNext+=7;const r=10000+n.rentDebt;if(S.money>=r){spend(r,'Alquiler');n.rentDebt=0;msgs.push('🏠 Pagaste el alquiler del lote a Don Rigo ('+fmtC(r)+')')}else{n.rentDebt=r;msgs.push('⚠️ No te alcanzó para el alquiler del lote. Don Rigo dice que «se lo apunta», pero ya anda serio.')}}
  for(const[i,m]of msgs.entries())setTimeout(()=>toast(m),1800+i*2600)}
// ---------- inversiones ----------
function INV(){const p=PGS();if(!p.inv||p.inv.v!==1)p.inv=Object.assign({v:1,ahorro:[],cred:null,tanda:null,lot:[],presta:null,hist:[]},p.inv||{});return p.inv}
const COOPE='CoopeBarrio R.L.';
function invNight(){const v=S&&S.f&&S.f.pg&&S.f.pg.inv;if(!v||v.v!==1)return;const msgs=[],d=S.day,ended=d-1;
  for(const a of v.ahorro.slice())if(d>=a.fin){const g=Math.round(a.m*1.035);earn(g,'Inversiones');if(typeof progStat==='function')progStat('ahorros');v.ahorro.splice(v.ahorro.indexOf(a),1);msgs.push('🏦 Venció tu ahorro a plazo: '+fmtC(g)+' (ganaste '+fmtC(g-a.m)+')')}
  const c=v.cred;if(c&&d>=c.next){c.next+=7;if(S.money>=c.cuota){spend(c.cuota,'Cuotas');c.left--;msgs.push('🏦 Cuota de '+COOPE+': '+fmtC(c.cuota)+' · faltan '+c.left)}else{c.mora++;c.cuota=Math.round(c.cuota*1.05);msgs.push('⚠️ No pagaste la cuota de la coope. Mora '+c.mora+'/3 (+5%)')}
    if(c.left<=0){v.cred=null;v.buen=(v.buen||0)+1;msgs.push('✅ ¡Pagaste todo el préstamo! La coope te sube el límite.')}else if(c.mora>=3){v.cred=null;v.negra=1;msgs.push('🚫 La coope te pasó a cobro judicial. Te quedaste sin crédito por un buen rato.');if(typeof progRep==='function')progRep(-5)}}
  const t=v.tanda;if(t&&d>=t.next){t.next+=7;t.w++;if(S.money>=5000)spend(5000,'Tanda');else{t.debe=(t.debe||0)+5000;msgs.push('⚠️ No te alcanzó para la tanda. Doña Rosa te lo apuntó en el cuaderno.')}
    if(Math.random()<.06){t.hueco=(t.hueco||0)+5000;msgs.push('😤 '+pick(['Doña Marta','Jeffrey el del taxi','La prima de Doña Rosa'])+' no pagó la tanda esta semana. «Ya le pago, ya le pago…»')}
    if(t.w===t.num){const g=40000-(t.hueco||0)-(t.debe||0);earn(Math.max(0,g),'Tanda');if(typeof progStat==='function')progStat('tandas');msgs.push('🎉 ¡Te tocó la tanda! Doña Rosa te entregó '+fmtC(Math.max(0,g))+' en un sobre de manila.');t.cobrado=1}
    if(t.w>=8){v.tanda=null;msgs.push('📓 Terminó la tanda de Doña Rosa. «¿Hacemos otra?»')}}
  for(const l of v.lot.slice())if(ended>=l.dia){v.lot.splice(v.lot.indexOf(l),1);const win=v.res&&v.res[l.dia+':'+l.tipo]!=null?v.res[l.dia+':'+l.tipo]:(v.res=v.res||{},v.res[l.dia+':'+l.tipo]=Math.floor(Math.random()*100));
    const pr=l.tipo==='nac'?80000:40000,cost=l.tipo==='nac'?1000:500;let g=0;if(win===l.num)g=pr*l.fr;else if(win%10===l.num%10)g=cost*l.fr;
    if(g){earn(g,'Lotería');msgs.push((win===l.num?'🎉🎉 ¡PEGASTE EL PREMIO MAYOR! Salió el ':'🎟 Reintegro: salió el ')+String(win).padStart(2,'0')+' · ganaste '+fmtC(g));if(win===l.num&&typeof progStat==='function')progStat('premios')}else msgs.push('🎟 '+(l.tipo==='nac'?'Lotería Nacional':'Chances')+': salió el '+String(win).padStart(2,'0')+'. Tu '+String(l.num).padStart(2,'0')+' no pegó. «La próxima es la vencida».')}
  const pr=v.presta;if(pr){const cu=Math.min(pr.debe,pr.cuota);if(S.money>=cu){spend(cu,'Prestamista');pr.debe-=cu;if(pr.debe<=0){v.presta=null;msgs.push('💀 Terminaste de pagarle a Don Mauro. «Un placer hacer negocios con usted.»')}}
    else{pr.fallo++;pr.debe+=Math.round(pr.debe*.1);if(pr.fallo>=2){pr.fallo=0;const take=Math.min(S.money,Math.round(pr.debe*.3));if(take>0){spend(take,'Prestamista');pr.debe-=take}const e=E();e.en=Math.max(5,e.en-35);S.f.cojo=Math.max(S.f.cojo||0,10);
      msgs.push('🩸 El Chiqui y Pelón te esperaron en la esquina. «Don Mauro manda saludos.» Te dejaron cojeando'+(take?' y se llevaron '+fmtC(take):'')+'.');if(typeof phQueue==='function')phQueue('mama','Mijo, ¿qué le pasó en la pierna? Me dijeron que lo vieron cojeando… ¿En qué anda metido? Me tiene con el alma en un hilo.')}
      else msgs.push('⚠️ El cobrador de Don Mauro pasó y no tenías los '+fmtC(cu)+'. «Mañana sin falta, mop. Por su bien.» (+10% de intereses)')}}
  for(const[i,m]of msgs.entries())setTimeout(()=>toast(m),2400+i*2600)}
hookAfter('ecoDay',function(){try{negNight()}catch(e){console.error(e)}try{invNight()}catch(e){console.error(e)}});
// Don Fello, el lotero de la plaza
function nextDraw(tipo){for(let d=S.day;d<S.day+8;d++){const w=dow(d);if(tipo==='nac'?w===6:(w===1||w===4))return d}return S.day}
function loteroTalk(e){const v=INV(),c=e.c;const own=v.lot.length;
  const buy=(tipo)=>{const cost=tipo==='nac'?1000:500,dia=nextDraw(tipo),mine=v.lot.filter(l=>l.dia===dia&&l.tipo===tipo).reduce((s,l)=>s+l.fr,0);if(mine>=5)return say(c,'Ya lleva cinco fracciones para ese sorteo, mijo. No se me vaya a vicear.');
    say(c,'¿Qué número le gusta? Para el sorteo del '+DOWN[dow(dia)]+(dia===S.day?' (hoy en la noche)':'')+'.',[{t:'El que soñé anoche',n:Math.floor(Math.random()*100)},{t:'El de mi cumpleaños (14)',n:14},{t:'El 27, como el bus',n:27},{t:'Que la suerte escoja',n:-1}].map(o=>({t:o.t,f(){const num=o.n<0?Math.floor(Math.random()*100):o.n;
      say(c,'¿Cuántas fracciones?',[1,2,5].filter(k=>mine+k<=5).map(k=>({t:k+' ('+fmtC(cost*k)+')',f(){if(S.money<cost*k)return say(c,'No le alcanza, mijo. Vuelva luego.');spend(cost*k,'Lotería');v.lot.push({tipo,num,fr:k,dia});say(c,'El '+String(num).padStart(2,'0')+'. '+pick(['¡Ese número está caliente!','Ese salió hace como tres meses… ya le toca.','Que Diosito lo ilumine.','Si gana, se acuerda de este viejito, ¿verdad?']))}})))}})))};
  say(c,'¡Lotería, Chances! ¡Para hoy, para hoy! Los Chances juegan martes y viernes; la Nacional, el domingo. '+(own?'Usted ya lleva '+own+' número'+(own>1?'s':'')+'.':''),[{t:'Chances (₡500 la fracción)',f(){buy('ch')}},{t:'Lotería Nacional (₡1 000 la fracción)',f(){buy('nac')}},{t:'¿Ha vendido algún premio mayor?',f(){say(c,'Dos veces, mijo. Una a una señora que vendía tamales, que ahora tiene una soda en Cartago. La otra a un muchacho que se lo gastó todo en un mes. La plata no cambia a la gente: la desenmascara.')}},{t:'Hoy no, Don Fello'}])}
// Don Mauro, el prestamista del Hoyo
function prestaTalk(e){const v=INV(),c=e.c;if(v.presta)return say(c,'Usted me debe '+fmtC(v.presta.debe)+', mop. Mi cobrador pasa todas las noches por '+fmtC(v.presta.cuota)+'. No me haga mandar a los muchachos.',[{t:'Pagar todo ahora',f(){if(S.money<v.presta.debe)return say(c,'Con qué, ¿con fe?');spend(v.presta.debe,'Prestamista');v.presta=null;say(c,'Así me gusta. Usted es serio.')}},{t:'Ya le pago, ya le pago'}]);
  say(c,'¿Anda corto de plata, mop? Yo presto sin papeles, sin fiador y sin preguntas. Eso sí: el 30% y pago diario. Y el que no paga… bueno, aquí todo el mundo paga.',[
    ...[20000,50000].map(m=>({t:'Pedirle '+fmtC(m),f(){const debe=Math.round(m*1.3);v.presta={debe,cuota:Math.round(debe/7),fallo:0};earn(m,'Préstamos');say(c,'Ahí está. '+fmtC(debe)+' en total, '+fmtC(Math.round(debe/7))+' cada noche. Mi cobrador lo encuentra donde esté.');toast('💀 Debés '+fmtC(debe)+' a Don Mauro')}})),
    {t:'No, gracias'}])}
// ---------- apps del celular ----------
appReg({id:'neg',n:'Mi negocio',ic:'🍧',c:'#ef6f8a',html(){const n=NEG();let h='';
  if(!n.cart)return`<div class="qitem"><b>🍧 Todavía no tenés negocio</b><p>Doña Mireya vende copos en el bulevar de Chepe desde hace 32 años… y anda vendiendo su carrito viejo. Por algo se empieza.</p></div>`;
  h+=`<div class="qitem"><b>🍧 Carrito de copos</b><p>${n.sold} copos vendidos · fama ${Math.round(n.fama)}/100 · insumos para ${n.stock}</p><p class="note">Abre de 10 a.m. a 6 p.m. junto a la fuente de la plaza. Más clientes al mediodía, los sábados y los domingos después de misa.</p><p>${Object.entries(CART_UP).map(([k,u])=>(n.up[k]?'✔ ':'· ')+u.n).join('<br>')}</p></div>`;
  h+=`<div class="qitem"><b>🍛 Soda Mi Barrio</b><p>${n.obra?'En construcción: lista el día '+n.obra.fin:n.soda?'Abierta · nivel '+n.soda+' · '+(n.cook?'cocina Doña Chela':'sin cocinera')+(n.permiso?' · permiso sanitario ✔':' · ⚠️ sin permiso sanitario')+(n.closed?' · cerrada hasta el día '+n.closed:''):n.sold>=40?'El lote de la Calle 3 se alquila. Llamá al 8701-2244.':'Vendé '+(40-n.sold)+' copos más para que Don Rigo te tome en serio.'}</p></div>`;
  h+=`<div class="qitem"><b>📈 Ganancias acumuladas: ${fmtC(n.earn)}</b><p class="note">Mejor tanda: ${fmtC(n.best)}</p></div>`;return h}});
appReg({id:'coope',n:COOPE,ic:'🏦',c:'#2a6fb0',html(){const v=INV();let h=`<p class="note">Hoy es ${DOWN[dow()]} (día ${S.day}).</p>`;
  h+=`<h3>Ahorro a plazo</h3><div class="qitem"><p>Depositás y en 28 días te devuelven 3,5% más. Si lo sacás antes, perdés los intereses.</p>${v.ahorro.map((a,i)=>`<p>💰 ${fmtC(a.m)} · vence el día ${a.fin} <button class="alt" data-act="sacar:${i}">Sacar ya</button></p>`).join('')}<div class="row">${[10000,25000,50000,100000].map(m=>`<button data-act="ahorro:${m}" ${S.money<m?'disabled':''}>${fmtC(m)}</button>`).join(' ')}</div></div>`;
  const lim=v.negra?0:50000*(1+(v.buen||0))+(typeof repLv==='function'&&repLv()>=2?25000:0);h+=`<h3>Préstamo</h3><div class="qitem">${v.cred?`<p>Debés ${v.cred.left} cuotas de ${fmtC(v.cred.cuota)} (cada ${DOWN[dow(v.cred.next)]})${v.cred.mora?' · mora '+v.cred.mora+'/3':''}</p>`:v.negra?'<p>⛔ Estás en cobro judicial. La coope no te presta.</p>':`<p>Hasta ${fmtC(lim)} en 8 cuotas semanales (15% de interés total).</p><div class="row">${[25000,lim].filter((x,i,a)=>a.indexOf(x)===i).map(m=>`<button data-act="cred:${m}">Pedir ${fmtC(m)}</button>`).join(' ')}</div>`}</div>`;
  const t=v.tanda;h+=`<h3>La tanda de Doña Rosa</h3><div class="qitem">${t?`<p>Semana ${t.w}/8 · te toca en la semana ${t.num}${t.cobrado?' (ya cobraste)':''}. Pagás ₡5 000 cada ${DOWN[dow(t.next)]}.</p>`:`<p>Ocho vecinos, ₡5 000 por semana, ocho semanas. A cada uno le toca una vez: ₡40 000 de golpe. ¿Qué número querés?</p><div class="row">${[1,3,5,8].map(k=>`<button data-act="tanda:${k}">Número ${k}</button>`).join(' ')}</div><p class="note">Los primeros números cobran antes… pero si alguien no paga, el hueco lo sienten los últimos.</p>`}</div>`;
  h+=`<h3>Lotería</h3><div class="qitem">${v.lot.length?v.lot.map(l=>`<p>🎟 ${l.tipo==='nac'?'Nacional':'Chances'} · ${String(l.num).padStart(2,'0')} · ${l.fr} fracc. · sorteo del ${DOWN[dow(l.dia)]}</p>`).join(''):'<p>No tenés números. Don Fello vende en la plaza, frente a la iglesia.</p>'}</div>`;
  if(v.presta)h+=`<div class="qitem"><b>💀 Le debés ${fmtC(v.presta.debe)} a Don Mauro</b><p>Cuota diaria: ${fmtC(v.presta.cuota)}.</p></div>`;return h},
 act(a,b){const v=INV(),m=+b;
  if(a==='ahorro'){if(S.money<m)return toast('No te alcanza');spend(m,'Ahorro');v.ahorro.push({m,fin:S.day+28});toast('🏦 Ahorro a plazo: '+fmtC(m)+' hasta el día '+(S.day+28))}
  else if(a==='sacar'){const x=v.ahorro.splice(m,1)[0];if(x){earn(x.m,'Ahorro');toast('🏦 Sacaste '+fmtC(x.m)+' (sin intereses)')}}
  else if(a==='cred'){if(v.cred||v.negra)return;const cu=Math.round(m*1.15/8);v.cred={left:8,cuota:cu,next:S.day+7,mora:0};earn(m,'Préstamos');toast('🏦 Préstamo aprobado: '+fmtC(m)+' · 8 cuotas de '+fmtC(cu));if(typeof progRep==='function')progRep(1)}
  else if(a==='tanda'){if(v.tanda)return;v.tanda={num:m,w:0,next:S.day+7};toast('📓 Entraste a la tanda con el número '+m+'. Doña Rosa lo apuntó en su cuaderno.')}
  saveGame();appOpen('coope')}});
{const st=document.createElement('style');st.textContent=`
.srv{display:flex;flex-direction:column;gap:8px;user-select:none}
.srv-top{display:flex;gap:12px;flex-wrap:wrap;font-size:14px;padding:6px 10px;border-radius:10px;background:rgba(0,0,0,.25)}
.srv-q{display:flex;gap:6px;min-height:58px;flex-wrap:wrap}
.srv-cl{flex:1 1 90px;max-width:130px;padding:5px 6px;border-radius:10px;background:rgba(255,255,255,.06);border:2px solid transparent;display:flex;flex-direction:column;align-items:center;font-size:11px;line-height:1.2;text-align:center}
.srv-cl.on{border-color:#f2c94c;background:rgba(242,201,76,.12)}.srv-cl .f{font-size:22px}.srv-cl b{display:block;width:100%;height:5px;border-radius:3px;background:rgba(0,0,0,.35);margin-top:3px;overflow:hidden}.srv-cl b i{display:block;height:100%;width:100%;transition:width .1s linear}
.srv-say{min-height:40px;padding:8px 12px;border-radius:12px;background:#f4ead2;color:#2a1e14;font-weight:600;font-size:14px}
.srv-say .note{color:#5a4a3a}
.srv-mid{display:flex;justify-content:center;min-height:96px}
.srv-cup{position:relative;width:90px;height:96px}.srv-vaso{position:absolute;left:18px;bottom:0;width:54px;height:46px;background:linear-gradient(90deg,#e8e8e8,#fff 40%,#d8d8d8);clip-path:polygon(0 0,100% 0,82% 100%,18% 100%);border-radius:0 0 6px 6px}
.srv-ice{position:absolute;left:12px;bottom:38px;width:66px;height:52px;border-radius:50% 50% 12px 12px;background:radial-gradient(circle at 35% 30%,#fff,var(--c) 70%);box-shadow:inset 0 -6px 10px rgba(0,0,0,.15)}
.srv-ice .dots{position:absolute;inset:6px;border-radius:50%;background:radial-gradient(#fff 1.4px,transparent 1.6px) 0 0/7px 7px}
.srv-ice .drz{position:absolute;left:8px;right:8px;top:10px;height:14px;border-radius:50%;background:#efe2b8;opacity:.9;box-shadow:0 8px 0 -3px #efe2b8}
.srv-ice .ball{position:absolute;left:20px;top:-14px;width:28px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#fff0c0)}
.srv-plate{display:flex;align-items:flex-end;gap:14px}.srv-plate .plato{position:relative;width:110px;height:70px;border-radius:50%;background:radial-gradient(#fff 55%,#dcdcdc 56%,#f4f4f4 70%);box-shadow:0 4px 8px rgba(0,0,0,.3)}
.srv-plate .plato i{position:absolute;border-radius:50%}.srv-plate .plato i:first-child{left:20px;top:18px;width:38px;height:28px}.srv-plate .plato .rice{left:56px;top:16px;width:32px;height:26px;background:radial-gradient(#fff 1px,#f0ece0 2px)}
.srv-plate .mad{left:30px;top:44px;width:30px;height:12px;background:#e2a23a!important;border-radius:40%!important;transform:rotate(-12deg)}.srv-plate .egg{left:60px;top:40px;width:26px;height:20px;background:radial-gradient(#f2b630 30%,#fff 34%)!important}.srv-plate .nat{left:42px;top:6px;width:18px;height:12px;background:#f8f4e8!important}
.srv-plate .vaso{width:34px;height:58px;border-radius:4px 4px 8px 8px;background:linear-gradient(transparent 12%,var(--c) 12%);border:2px solid rgba(255,255,255,.7);box-shadow:inset 6px 0 0 rgba(255,255,255,.25)}
.srv-cat small{display:block;opacity:.75;margin-bottom:3px}.srv-cat>div{display:flex;flex-wrap:wrap;gap:6px}
.srv-b{padding:7px 11px!important;min-height:0!important;font-size:13px!important;border-left:6px solid var(--c)!important}
.srv-b.on{outline:3px solid #fff;outline-offset:1px;background:var(--c)!important;color:#14101c!important;text-shadow:0 1px 0 rgba(255,255,255,.5)}
.srv-act{flex-wrap:wrap;gap:6px}`;document.head.appendChild(st)}
