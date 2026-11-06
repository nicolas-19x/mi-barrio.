// ================= PUNTOS DE EXTENSIÓN (ganchos) =================
// Para que un sistema nuevo se enganche a una función del juego sin reescribirla:
//   hookAfter('ecoDay', fn)    corre fn(...args) después de la función original
//   hookBefore('ecoDay', fn)   corre fn(...args) antes
//   hookFilter('metas', fn)    fn(resultado, ...args) recibe lo que devolvió la función y devuelve el nuevo resultado
// El orden es el mismo que tenían los envoltorios encadenados {const _f=f;f=function(){...}}:
// primero los «antes» (el último registrado corre primero), luego la original, luego «después» y filtros en orden de registro.
// Sirve para funciones declaradas con `function` a nivel global (ecoDay, startGame, update, metas, casaHTML, progProxies…).
// Puntos de enganche más usados: ecoDay (cada noche), startGame (al empezar o cargar), update (cada cuadro).
const HOOKS={};
function hookInstall(name){let h=HOOKS[name];if(h)return h;const orig=globalThis[name];if(typeof orig!=='function')throw new Error('hook: '+name+' no es una función global');
  h=HOOKS[name]={orig,before:[],post:[]};
  globalThis[name]=function(...args){for(let i=h.before.length-1;i>=0;i--)h.before[i].apply(this,args);let r=h.orig.apply(this,args);
    for(const p of h.post){if(p.filter)r=p.fn.call(this,r,...args);else p.fn.apply(this,args)}return r};
  return h}
function hookAfter(name,fn){hookInstall(name).post.push({fn,filter:false})}
function hookBefore(name,fn){hookInstall(name).before.push(fn)}
function hookFilter(name,fn){hookInstall(name).post.push({fn,filter:true})}
