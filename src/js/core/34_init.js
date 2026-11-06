// ================= INIT =================
$('#mini').addEventListener('click',()=>openMap());
loadChars();genExt();BUILD.forEach(genInt);Object.values(MAPS).forEach(renderMap);genMini();
for(let y=0;y<MAPS.ext.h;y++)for(let x=0;x<MAPS.ext.w;x++)if(ti(MAPS.ext,x,y)===2&&!solidT(MAPS.ext,x,y))SIDEW.push([x,y]);
S=newState();S.t=16*60;P.map='ext';P.x=40*T;P.y=30*T;S.per='';checkPeriod();makePeds();makeAnimals();storeVend();placeNPCs(true);snapCam();refreshMenu();
let last=performance.now();
