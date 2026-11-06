// ================= ENTITIES =================
const P={kind:'player',map:'casa_jugador',x:0,y:0,dir:0,fr:0,anim:0,moving:false};
let ENTS=[],NPC={};
function feetBlocked(m,x,y){const a=Math.floor((x-5)/T),b=Math.floor((x+5)/T),c=Math.floor((y-4)/T),d=Math.floor((y-.5)/T);return solidT(m,a,c)||solidT(m,b,c)||solidT(m,a,d)||solidT(m,b,d)}
function moveEnt(e,dx,dy){const m=MAPS[e.map];let moved=false;if(dx&&!feetBlocked(m,e.x+dx,e.y)){e.x+=dx;moved=true}if(dy&&!feetBlocked(m,e.x,e.y+dy)){e.y+=dy;moved=true}return moved}
function bfs(m,sx,sy,tx,ty){if(solidT(m,tx,ty))return null;const W=m.w,start=sy*W+sx,goal=ty*W+tx;if(start===goal)return[];const prev=new Int32Array(W*m.h).fill(-1);prev[start]=start;const q=[start];let qi=0;
  while(qi<q.length){const c=q[qi++];if(c===goal)break;const cx=c%W,cy=(c/W)|0;for(const[dx,dy]of D4){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=m.h)continue;const ni=ny*W+nx;if(prev[ni]!==-1||m.s[ni]||(m.noPath.has(ni)&&ni!==goal))continue;prev[ni]=c;q.push(ni)}}
  if(prev[goal]===-1)return null;const path=[];let c=goal;while(c!==start){path.push([c%W,(c/W)|0]);c=prev[c]}return path.reverse()}
const tileOf=e=>[Math.floor(e.x/T),Math.floor((e.y-2)/T)];
function locFor(c){if(!c.enabled)return null;if(S.f.fiestaOn&&(c.core||c.id==='rosa')&&c.id!=='player')return'fiesta';{const dl=dateLoc(c);if(dl)return dl}const sc=SCHED[c.id];let L=sc?sc[period()]:'home';if(L==='home')L=c.home;if(!LOC[L])L='calle';return L}
function placeNPCs(instant){const groups={};
  for(const c of CHARS){if(c.id==='player')continue;let n=NPC[c.id];
    if(!c.enabled){if(n){ENTS=ENTS.filter(e=>e!==n);delete NPC[c.id]}continue}
    if(!n){n={kind:'npc',c,map:'ext',x:0,y:0,dir:0,fr:0,anim:0,steps:[],path:null,wt:rnd(1,3),loc:null};NPC[c.id]=n;ENTS.push(n);instant=true}
    n.c=c;const L=locFor(c);const idx=(groups[L]=(groups[L]||0)+1)-1;const sp=LOC[L].sp[idx%LOC[L].sp.length];const map=LOC[L].map;
    const tx=sp[0]+(idx>=LOC[L].sp.length?1:0),ty=sp[1];n.home={map,x:tx,y:ty};
    if(n.loc===L&&!instant)continue;const first=n.loc===null;n.loc=L;
    const vis=P.map==='ext'&&(map==='ext'||n.map==='ext');
    if(first||instant||!vis){n.map=map;n.x=tx*T+8;n.y=ty*T+12;n.steps=[];n.path=null}
    else{const st=[];if(n.map!=='ext'){const b=BMAP[n.map];st.push({tele:'ext',x:b.dx,y:b.dy+1})}
      if(map!=='ext'){const b=BMAP[map];st.push({go:1,x:b.dx,y:b.dy+1});st.push({tele:map,x:tx,y:ty})}else st.push({go:1,x:tx,y:ty});n.steps=st;n.path=null}}}
function makePeds(){const looks=[['Don Toño','#d8d8d8','#b97a4a','#7a4b2a','calvo','sombrero'],['Doña Chepa','#2b1a10','#e0ac69','#3fb6b0','moño','ninguno'],['Jefry','#1c1c1c','#8d5524','#f2c94c','corto','gorra']];
  looks.forEach((l,i)=>{const c=fillChar({id:'ped'+i,name:l[0],hairColor:l[1],skin:l[2],shirt:l[3],hair:l[4],acc:l[5],pants:'#2d3346',accColor:'#3f7fd1',v:1});const sp=SIDEW[(i*97)%SIDEW.length];ENTS.push({kind:'ped',c,map:'ext',x:sp[0]*T+8,y:sp[1]*T+12,dir:0,fr:0,anim:0,path:null,wt:1})})}
let SIDEW=[];
function makeAnimals(){const A=(type,name,col,x,y,extra)=>{const e=Object.assign({kind:'animal',type,name,col,map:'ext',x:x*T+8,y:y*T+12,ox:x,oy:y,dir:2,fr:0,anim:0,wt:1,vx:0,vy:0},extra||{});ENTS.push(e);return e};
  A('dog','Canelo','#c8a165',8,25);A('dog','Negro','#3a3a40',48,40);A('cat','Mishi','#f2994a',16,8);A('cat','Michi','#8a8a8a',44,9);
  A('dog','Firulais','#f4f4f4',14,5,{special:'firulais'});A('hen','Kiki','#f4f4f4',50,30,{special:'kiki'});A('cadejos','???','#141218',29,5,{special:'cadejos'})}
function animalActive(e){if(e.special==='firulais')return qs('firulais')===1;if(e.special==='kiki')return qs('gallo')===1&&!hasI('kiki');if(e.special==='cadejos'){const h=hour();return(h>=22||h<4)&&!S.f.sec.cadejos}return true}
const PICKS=[
 {id:'tazo1',map:'ext',x:16,y:20,kind:'tazo',lab:'Una botella cortada en la cuneta',cond:()=>!S.f.tazo1,take(){S.f.tazo1=1;addI('tazo');say(null,'¡Un tazo! Una botella de 3 litros partida a la mitad, con la tapa con hueco puesta. Clásico de recreo.');tazoCheck()}},
 {id:'tazo2',map:'ext',x:36,y:9,kind:'tazo',lab:'Una botella cortada detrás de la casa rosada',cond:()=>!S.f.tazo2,take(){S.f.tazo2=1;addI('tazo');say(null,'Otro tazo de botella, escondido detrás de la casa rosada. Alguien los dejó a propósito...');tazoCheck()}},
 {id:'tazo3',map:'ext',x:34,y:33,kind:'tazo',lab:'Una botella cortada en el arbusto del parque',cond:()=>!S.f.tazo3,take(){S.f.tazo3=1;addI('tazo');say(null,'¡Un tazo entre las ramas del arbusto del parque! La tapa con hueco sigue puesta.');tazoCheck()}},
 {id:'cargador',map:'ext',x:21,y:23,kind:'cable',lab:'Recoger cargador',cond:()=>qs('cargador')===1&&!S.f.cargGot,take(){S.f.cargGot=1;addI('cargador');say(null,'Ahí estaba, enrollado debajo de la banca de la parada.')}},
 {id:'sign',map:'ext',x:29,y:2,kind:'none',lab:'Mirador: ver la vista',cond:()=>true,take(){say(null,'Llegaste al Mirador del Barrio. El viento sopla fresco desde el valle.',[{t:'Ver la vista',f(){afterD(openVista)}},{t:'Leer el letrero',f(){say(null,'«MIRADOR DEL BARRIO». Desde aquí se ve todo: los techos de zinc, el parque y, a lo lejos, las luces de la ciudad.');if(isNight()){say(null,'De noche las luces del valle parecen un río de estrellas.');secret('mirador','El mirador de noche')}else say(null,'Dicen que de noche la vista es otra cosa.')}},{t:'Seguir caminando'}])}},
];
function tazoCheck(){const n=['tazo1','tazo2','tazo3'].filter(k=>S.f[k]).length;if(n===3)afterD(()=>{say(null,'¡Completaste la colección de tazos del barrio!');secret('tazos','Colección de tazos')});else say(null,'Tazos: '+n+'/3')}

