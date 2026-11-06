// ---------- ensamblado del mapa HD ----------
function hdLegacyBase(g,m){ // respaldo: lo que aún no tiene versión HD se dibuja con el pintor anterior al doble
  if(m.id==='ext'){if(!HD_DONE.buildings)BUILD.forEach(b=>drawBuilding(g,b));
    for(const o of m.objs)if(!HD_DONE.objs||!HD_OBJ_HD.has(o.type))drawObj(g,o,m);
    if(!HD_DONE.details)drawNeighborhoodDetails(g)}}
const HD_DONE={buildings:false,objs:false,details:false,trees:false,poles:false};
const HD_OBJ_HD=new Set();
function renderMapHD(m){if(!HD_ON)return;
  if(m.id==='ext'){const t0=performance.now();const b=hdBuf(m.w*HT,m.h*HT);
    hdGround(b,m);hdTileEdges(b,m);hdRoad(b,m);hdFences(b,m);hdField(b);
    if(typeof hdBuildingsBase==='function')hdBuildingsBase(b,m);
    if(typeof hdPropsBase==='function')hdPropsBase(b,m);
    hdHomeBase(b,m);hdEntrada(b);if(typeof hdSurBase==='function')hdSurBase(b,m);
    const base=hdToCanvas(b),g=base.getContext('2d');g.imageSmoothingEnabled=false;
    g.save();g.scale(HDK,HDK);hdLegacyBase(g,m);g.restore();
    if(typeof hdAfterBase==='function')hdAfterBase(g,m);
    m.base2=base;
    const top=mk(m.w*HT,m.h*HT),tg=top.getContext('2d');tg.imageSmoothingEnabled=false;
    if(typeof hdTop==='function')hdTop(tg,m);else tg.drawImage(m.top,0,0,top.width,top.height);if(typeof hdSurTop==='function')hdSurTop(tg,m);
    m.top2=top;m.hdMs=Math.round(performance.now()-t0)}
  else if(m.id==='chepe'){const r=hdChepe2(m);m.base2=r.base;m.top2=r.top}
  else if(m.id==='hoyo'){const r=hdHoyoMap(m);m.base2=r.base;m.top2=r.top}
  else if(m.id==='mercado'){const r=hdMercadoInt(m);m.base2=r.base;m.top2=r.top}
  else if(m.zone==='chepe'||m.id==='mercado'){m.base2=hdRemaster(m.base,true);m.top2=hdRemaster(m.top,false)}
  else if(m.interior&&m.b&&(m.b.kind==='house'||m.b.kind==='shop'||m.b.kind==='church'||(m.b.kind==='store'&&m.b.st))){m.base2=null;m.top2=null;m.hdDirty=true}   // se pinta al entrar (carga más rápida)
}

function hdEnsure(m){if(!m.hdDirty)return;m.hdDirty=false;const t0=performance.now();
  if(m.b.kind==='store'){const r=hdStoreInterior(m);m.base2=r.base;m.top2=r.top}else{m.base2=hdInterior(m);m.top2=null}m.hdMs=Math.round(performance.now()-t0)}
