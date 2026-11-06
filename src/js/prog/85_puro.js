// ================= EL PURO DE CARLILLOS =================
// Carlillos se fuma un puro en la entrada: brasa que se aviva al jalar, humito que sube y se lo lleva el viento.
const PURO={humo:[],t:0,next:0,jalada:0};
function puroActivo(e){return e&&e.map===P.map&&!S.rain&&!(typeof COMBAT!=='undefined'&&COMBAT)}
function puroTick(e,now){const p=PURO,dt=Math.min(.1,(now-(p.last||now))/1000);p.last=now;p.t+=dt;
  if(p.t>p.next){p.next=p.t+rnd(5,9);p.jalada=1}           // cada ratito le da una jalada
  if(p.jalada>0)p.jalada=Math.max(0,p.jalada-dt*.9);
  const m=puroBoca(e);if(Math.random()<dt*(p.jalada>.3?14:4))p.humo.push({x:m.x+m.dx*3.4,y:m.y,vx:rnd(-.6,.6)+.5,vy:rnd(-5,-3.4),r:.7,a:p.jalada>.3?.7:.42,life:0});
  for(const h of p.humo){h.life+=dt;h.x+=h.vx*dt*3+Math.sin(p.t*1.7+h.life*3)*.05;h.y+=h.vy*dt;h.vy*=.992;h.r+=dt*1.3;h.a-=dt*.16}
  p.humo=p.humo.filter(h=>h.a>0)}
function puroBoca(e){const d=e.dir|0;return{x:e.x+(d===2?-3.4:d===3?3.4:1.4),y:e.y-17.2,dx:d===2?-1:1,atras:d===1}}
hookAfter('progProxies',function(list,map){const e=typeof NPC!=='undefined'&&NPC.kevin;if(!puroActivo(e))return;
  list.push({kind:'carv',map,x:e.x,y:e.y+.5,draw:g=>{const now=performance.now();puroTick(e,now);const m=puroBoca(e),p=PURO;
    if(!m.atras){g.fillStyle='#2a1a10';g.fillRect(m.x-.2*m.dx,m.y-.25,3.8*m.dx,1.5);g.fillStyle='#8a5530';g.fillRect(m.x,m.y,3.4*m.dx,1);g.fillStyle='#b07a48';g.fillRect(m.x,m.y,3.4*m.dx,.35);g.fillStyle='#d8b050';g.fillRect(m.x+.7*m.dx,m.y,.6*m.dx,1);
      const b=.55+p.jalada*.45+Math.sin(p.t*9)*.05,ex=m.x+3.4*m.dx;g.fillStyle=`rgba(255,${120+Math.round(80*b)},40,${b.toFixed(2)})`;g.fillRect(ex-(m.dx<0?.9:0),m.y-.05,.9,1.1);
      if(p.jalada>.2){const gl=g.createRadialGradient(ex,m.y+.45,0,ex,m.y+.45,3);gl.addColorStop(0,`rgba(255,150,60,${(.45*p.jalada).toFixed(2)})`);gl.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=gl;g.fillRect(ex-3,m.y-2.6,6,6)}}
    for(const h of p.humo){g.fillStyle=`rgba(222,222,228,${Math.max(0,h.a).toFixed(2)})`;g.beginPath();g.arc(h.x,h.y,h.r,0,7);g.fill()}}})});
// lo que dice del puro
{const _k=TALK.kevin;TALK.kevin=function(){const a=arguments,th=this;if(S.f.puroDia===S.day||Math.random()>.45)return _k.apply(th,a);S.f.puroDia=S.day;
  const L=[['Carlillos le da una jalada larga al puro y suelta el humo por la nariz, despacio, como si tuviera todo el tiempo del mundo.','Este me lo regaló el Tata. Cubano, mop. De los buenos. Uno por día… bueno, tal vez dos.'],
   ['Carlillos sacude la ceniza del puro contra la tapia.','¿Qué me ve? Un mae de la entrada sin su puro es como un casado sin maduro. No sirve, mop.'],
   ['Una nube de humo te pega en la cara. Carlillos se ríe.','Perdón, perdón. Es que el viento siempre sopla para donde está la gente decente.']];
  const x=pick(L);say(null,x[0]);say('kevin',x[1],[{t:'«Eso mata, mae.»',f(){say('kevin','Diay, todo mata, mop. El tráfico de Chepe, el colesterol del chicharrón, la suegra… Pero tranquilo, que este es el último. Desde hace tres años.');afterD(()=>_k.apply(th,a))}},
   {t:'«Huele a Tata.»',f(){say('kevin','…Sí, verdad. Huele a él. Por eso me lo fumo aquí, en la entrada, donde él se sentaba a ver pasar la gente antes de que le diera lo del corazón.');afterD(()=>_k.apply(th,a))}},
   {t:'Toser y seguir',f(){afterD(()=>_k.apply(th,a))}}]);runDialog()}}
