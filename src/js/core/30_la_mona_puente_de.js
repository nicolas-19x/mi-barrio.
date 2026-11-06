// ================= La Mona · puente de la Vieja · sprites =================
// La Mona: según la leyenda, una bruja que de noche toma forma de mona (homínido peludo, ojos de brasa).
function sprBaranda(){const c=pCan(34,26,(g,p)=>{ // poste de concreto + pasamanos que se une con el siguiente
 p('#8d8a85',1,5,32,2);p('#b3b0aa',1,5,32,1);p('#6a6762',1,7,32,1);p('#8d8a85',1,13,32,2);p('#a8a59f',1,13,32,1);p('#6a6762',1,15,32,1);
 p('#9c9993',13,2,8,24);p('#c0bdb6',13,2,3,24);p('#6e6b66',19,2,2,24);p('#b0ada6',12,0,10,3);p('#d0cdc6',12,0,10,1);
 p('#e8e2c0',15,18,4,3);p('#1d1a24',16,19,2,1)});c.mw=2.2;return pOut(c,'#0b0a0e')}
function sprFarol(){const c=pCan(24,70,(g,p)=>{p('#2c2a30',10,10,3,60);p('#444248',10,10,1,60);p('#2c2a30',4,6,10,2);p('#2c2a30',3,8,3,3);
 p('#23212a',2,10,6,7);p('#e8b858',3,11,4,5);p('#fff0b0',4,12,2,3);p('#23212a',1,9,8,1);p('#23212a',2,17,6,1)});c.mw=.5;
 c.lit=pCan(24,70,(g,p)=>{p('#ffd070',3,11,4,5);p('#fff6c8',4,12,2,3)});c.lights=[[5,13.5,'#ffc050']];return pOut(c,'#0b0a0e')}
function sprSignPuente(){return sprSign(['PUENTE','LA VIEJA'],'#1f6b3a','#f4f2e8',58)}
// grietas del parabrisas: epicentro (cx,cy), nivel 0..1
function sprOjos(){const c=pCan(14,6,(g,p)=>{p('#ff7a10',1,1,3,2);p('#fff0a0',2,1,1,1);p('#ff7a10',9,1,3,2);p('#fff0a0',10,1,1,1)});c.mw=.55;c.lit=c;c.lights=[[2.5,2,'#ff7a10'],[10.5,2,'#ff7a10']];return c}

