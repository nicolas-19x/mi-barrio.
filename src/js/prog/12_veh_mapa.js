// ---------- Tus vehículos en el mapa: icono y lugar donde los dejaste ----------
// Se suman como «objetivos» del minimapa y de los mapas grandes (mmTargets); los dibujan mmVeh (abajo) desde 06_minimapa_detallado.js
// y drawBigZone. El vehículo que estás manejando no sale (sos vos); los de otras zonas tampoco.
hookFilter('mmTargets',function(out){
  const p=S&&S.f&&S.f.pg;if(!p||!p.veh)return out;const z=curZone();
  for(const v of p.veh){if(v.gone||v.id===p.ride||!VM[v.m])continue;
    if(!((v.map==='ext'&&z==='barrio')||(v.map==='chepe'&&z==='chepe')))continue;
    out.push({mp:v.map,x:v.x,y:v.y,c:v.col,r:3,edge:false,ic:VM[v.m].k,col:v.col})}
  return out});
// icono de píxeles según el tipo (bici, moto, carro, pickup), con el color del vehículo y borde oscuro; k es el tamaño
function mmVeh(g,X,Y,t,k){const c=t.col||'#d6453c',D='#14101c',W='#f4ead2',G='#7fc3e8';X=Math.round(X);Y=Math.round(Y);
  const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(X+x*k),Math.round(Y+y*k),Math.max(1,Math.round(w*k)),Math.max(1,Math.round(h*k)))};
  const wheel=(x,y)=>{R(x-2,y-2,4,4,D);R(x-1,y-1,2,2,'#8f8a80')};
  const ik=t.ic;
  if(ik==='bici'){R(-6,-1,12,3,'rgba(0,0,0,0)');wheel(-4,3);wheel(4,3);R(-5,2,10,1,D);R(-4,-2,8,1,D);R(-1,-4,2,1,D);R(-3,-2,1,5,D);R(2,-3,1,6,D);R(-4,-1,8,1,c);R(-3,-2,1,3,c);R(2,-2,1,4,c);R(2,-4,3,1,D)}
  else if(ik==='moto'){wheel(-5,3);wheel(5,3);R(-6,-2,12,5,D);R(-5,-1,10,3,c);R(-2,-3,5,2,D);R(-1,-2,3,1,W);R(4,-3,3,1,D);R(5,-4,1,1,W)}
  else if(ik==='pickup'){wheel(-6,3);wheel(6,3);R(-9,-3,19,7,D);R(-8,-2,10,5,c);R(2,-2,7,3,G);R(2,1,7,2,c);R(-8,-2,10,1,W);R(-8,1,10,1,'rgba(0,0,0,.25)')}
  else{wheel(-6,3);wheel(6,3);R(-9,-3,19,7,D);R(-8,-2,17,5,c);R(-5,-4,9,3,D);R(-4,-3,3,2,G);R(0,-3,3,2,G);R(-8,-2,17,1,W);R(-8,2,17,1,'rgba(0,0,0,.25)')}
  // un puntito que parpadea arriba, para que se note en el mapa
  if(Math.floor(qBlink*2)%2){g.fillStyle=W;g.fillRect(Math.round(X-1),Math.round(Y-7*k),2,2)}}
