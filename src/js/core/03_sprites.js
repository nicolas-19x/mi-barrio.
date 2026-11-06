// ================= SPRITES =================
const SPR=new Map();
function drawBody(g,c,dir,fr){
  const sk=c.skin,sh=c.shirt,pa=c.pants,hc=c.hairColor,sho='#2a2228',ink='#1d1a24';
  const side=dir>=2,up=dir===1;
  // legs
  if(!side){const hl=fr===1?3:4,hr=fr===2?3:4;R(g,pa,5,18,3,hl);R(g,pa,8,18,3,hr);R(g,sho,5,18+hl,3,2);R(g,sho,8,18+hr,3,2)}
  else{ if(fr===0){R(g,pa,6,18,4,4);R(g,sho,5,22,5,2)} else if(fr===1){R(g,pa,4,18,3,4);R(g,pa,9,18,3,3);R(g,sho,3,22,4,2);R(g,sho,9,21,4,2)} else {R(g,pa,5,18,3,3);R(g,pa,8,18,3,4);R(g,sho,4,21,4,2);R(g,sho,8,22,4,2)}}
  // body
  R(g,sh,4,12,8,7);R(g,shade(sh,.18),5,13,2,3);R(g,shade(sh,-.28),11,13,1,5);R(g,shade(sh,-.2),4,17,8,2);R(g,shade(sh,-.35),7,12,2,1);R(g,shade(pa,.18),5,19,1,2);R(g,'#2a2228',4,18,8,1);if(!side)R(g,'#c9a04a',7,18,2,1);R(g,'#b9bec5',5,22,2,1);
  if(!side){const a=fr===1?-1:fr===2?1:0;R(g,sh,3,12,1,3);R(g,sh,12,12,1,3);R(g,sk,3,15+a,1,3);R(g,sk,12,15-a,1,3)}
  else{const a=fr===1?-1:fr===2?1:0;R(g,shade(sh,-.1),7+a,13,2,4);R(g,sk,7+a,17,2,2)}
  // head
  R(g,sk,4,3,8,9);R(g,shade(sk,-.15),4,11,8,1);
  if(dir===0){R(g,ink,6,7,1,2);R(g,ink,9,7,1,2);R(g,shade(hc,-.2),5,6,2,1);R(g,shade(hc,-.2),9,6,2,1);R(g,'#fff6',6,7,1,1);R(g,'#fff6',9,7,1,1);R(g,'#9c4a3a',7,10,2,1);R(g,shade(sk,-.08),5,9,1,1);R(g,shade(sk,-.08),10,9,1,1)}
  else if(side){R(g,ink,5,7,1,2);R(g,shade(hc,-.2),4,6,2,1);R(g,'#9c4a3a',4,10,2,1);R(g,shade(sk,-.15),3,8,1,2)}
  // hair
  const H=(x,y,w,h)=>R(g,hc,x,y,w,h),hl=shade(hc,.2);
  switch(c.hair){
    case'corto':if(up)H(3,1,10,9);else if(side){H(3,1,10,3);H(8,4,5,4);H(4,4,1,1)}else{H(3,1,10,3);H(3,4,1,3);H(12,4,1,3);H(5,4,3,1)}break;
    case'largo':if(up)H(2,1,12,14);else if(side){H(3,1,10,3);H(8,3,5,12);H(4,4,1,1)}else{H(3,1,10,3);H(2,3,2,11);H(12,3,2,11);H(4,4,2,1);H(10,4,2,1)}break;
    case'rizos':if(up){H(2,0,12,10)}else if(side){H(2,0,12,4);H(8,4,6,5)}else{H(2,0,12,4);H(2,4,2,4);H(12,4,2,4)}R(g,hl,4,1,1,1);R(g,hl,8,0,1,1);R(g,hl,11,2,1,1);break;
    case'moño':if(up){H(3,1,10,9);H(6,0,4,3)}else if(side){H(3,1,10,3);H(9,3,4,5);H(11,0,4,3)}else{H(3,1,10,3);H(3,4,1,3);H(12,4,1,3);H(6,0,4,2)}break;
    case'cola':if(up){H(3,1,10,9);H(7,9,2,6)}else if(side){H(3,1,10,3);H(8,4,5,4);H(12,4,2,7)}else{H(3,1,10,3);H(3,4,1,3);H(12,4,1,3);H(13,5,1,5)}break;
    case'calvo':if(up){H(3,6,10,4)}else if(side){H(9,5,4,4)}else{H(3,5,1,4);H(12,5,1,4);R(g,shade(sk,.25),6,4,2,1)}break;
  }
  if(c.hair!=='calvo'){R(g,hl,5,2,4,1);if(up){R(g,shade(hc,-.2),10,4,1,4);R(g,hl,5,4,1,3)}}
  const ac=c.accColor||'#d64545';
  switch(c.acc){
    case'gorra':R(g,ac,3,0,10,3);if(dir===0)R(g,shade(ac,-.3),4,3,8,1);else if(side)R(g,shade(ac,-.3),1,3,5,1);break;
    case'sombrero':R(g,ac,1,3,14,1);R(g,ac,4,0,8,3);R(g,shade(ac,-.4),4,2,8,1);break;
    case'lentes':if(dir===0){R(g,ink,4,6,8,1);R(g,'#2b3a4a',5,6,2,2);R(g,'#2b3a4a',9,6,2,2)}else if(side){R(g,ink,4,6,5,1);R(g,'#2b3a4a',4,6,2,2)}break;
    case'aretes':if(dir===0){R(g,ac,3,9,1,2);R(g,ac,12,9,1,2)}else if(side)R(g,ac,9,9,1,2);break;
    case'bigote':if(dir===0)R(g,ac==='#d64545'?'#3a2a1e':ac,5,9,6,1);else if(side)R(g,'#3a2a1e',3,9,3,1);break;
    case'barba':if(dir===0){H(4,9,8,3);R(g,'#9c4a3a',7,10,2,1)}else if(side)H(3,9,6,3);break;
    case'collar':if(!up)R(g,ac,side?5:5,12,side?4:6,1);break;
  }
  if((c.glasses||c.acc==='anteojos')&&!up){const fm='rgba(70,55,45,.88)',fs='rgba(70,55,45,.5)',gl='rgba(235,247,252,.75)';
    if(dir===0){R(g,fm,5,6,6,1);R(g,fm,5,7,1,2);R(g,fm,10,7,1,2);R(g,fs,5,9,2,1);R(g,fs,9,9,2,1);R(g,fm,8,7,1,1);R(g,fs,4,7,1,1);R(g,fs,11,7,1,1);R(g,gl,6,7,1,1)}
    else if(side){R(g,fm,4,6,3,1);R(g,fm,4,7,1,2);R(g,fs,4,9,3,1);R(g,fm,6,7,1,1);R(g,fs,7,7,3,1);R(g,gl,5,7,1,1)}}
  if(c.machete){const ta=fr===1?-1:fr===2?1:0,hd='#5a3a22',bl='#b9c2c9',ed='#eef3f6',dk='#7d878f';
    if(dir===0){R(g,hd,12,16-ta,2,2);R(g,'#2b2b30',12,18-ta,2,1);R(g,dk,13,19-ta,2,1);R(g,bl,13,20-ta,2,3);R(g,ed,14,20-ta,1,3);R(g,bl,13,23-ta,1,1)}
    else if(up){R(g,hd,12,16+ta,2,2);R(g,bl,13,18+ta,2,4);R(g,ed,13,18+ta,1,4)}
    else{R(g,hd,6,16,2,2);R(g,'#2b2b30',6,18,2,1);R(g,dk,5,19,3,1);R(g,bl,4,20,4,2);R(g,ed,4,20,4,1);R(g,bl,3,22,2,1)}}
  if(c.tattoos){const tt='#2e6e5e';const ta=fr===1?-1:fr===2?1:0;if(!side){R(g,tt,3,16+ta,1,1);R(g,tt,12,16-ta,1,1);if(dir===0)R(g,tt,10,8,1,1)}else R(g,tt,7+ta,17,2,1)}
}
function sprite(c,dir,fr){const k=c.id+'|'+c.v+'|'+dir+'|'+fr;let s=SPR.get(k);if(s)return s;
  const t=mk(16,24),g=t.getContext('2d');
  if(dir===3){g.translate(16,0);g.scale(-1,1);drawBody(g,c,2,fr)}else drawBody(g,c,dir,fr);
  const o=mk(16,24),og=o.getContext('2d');og.drawImage(t,0,0);og.globalCompositeOperation='source-in';R(og,'#1d1a24',0,0,16,24);
  s=mk(18,26);const sg=s.getContext('2d');sg.drawImage(o,0,1);sg.drawImage(o,2,1);sg.drawImage(o,1,0);sg.drawImage(o,1,2);sg.drawImage(t,1,1);
  SPR.set(k,s);return s}
