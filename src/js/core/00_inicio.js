'use strict';
// Si el navegador no deja usar el almacenamiento (vista previa de Claude, iframes con sandbox, modo privado estricto),
// se usa uno en memoria: el juego corre igual, pero no se guarda al cerrar la página.
(function(){function probar(n){try{const s=window[n];s.setItem('__t','1');s.removeItem('__t');return true}catch(e){return false}}
  for(const n of['localStorage','sessionStorage'])if(!probar(n)){const m={};const f={getItem:k=>Object.prototype.hasOwnProperty.call(m,k)?m[k]:null,setItem:(k,v)=>{m[k]=String(v)},removeItem:k=>{delete m[k]},clear:()=>{for(const k in m)delete m[k]},key:i=>Object.keys(m)[i]||null,get length(){return Object.keys(m).length}};
    try{Object.defineProperty(window,n,{value:f,configurable:true})}catch(e){window[n]=f}window.__SIN_ALMACEN=true}})();
