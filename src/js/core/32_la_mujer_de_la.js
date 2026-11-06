// ================= LA MUJER DE LA BATA (forma humana de La Mona) =================
const MUJ_R=(()=>{const R={
 gown:['#141a1f','#222c33','#34424b','#4b5c66','#647882','#80949c','#a0b2b8','#c4d2d4'],
 stain:['#140a07','#26140c','#3a2012','#4e2c18','#663a20','#7e4c2c'],
 skin:['#121015','#221e25','#36303a','#4d4650','#686068','#867e84','#a6a0a0','#c8c2bc'],
 hair:['#020203','#06050a','#0c0a12','#14111c','#1e1a2a','#2b263c','#3c3654'],
 sole:['#0a0806','#1a1410','#2a2018','#3c3024'],
 band:['#2a2a2e','#6a6a70','#b0b0b4','#e8e8e8']};
 const o={};for(const k in R)o[k]=R[k].map(h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]});return o})();
function mujCap(u,v,ax,ay,bx,by,r0,r1){const vx=bx-ax,vy=by-ay,l2=vx*vx+vy*vy||1;let t=((u-ax)*vx+(v-ay)*vy)/l2;t=t<0?0:t>1?1:t;const px=ax+vx*t,py=ay+vy*t,d=Math.hypot(u-px,v-py),r=r0+(r1-r0)*t;return d<r?{t,ox:(u-px)/r,oy:(v-py)/r}:null}
// figura completa en 48x100 (1,8 m). pose: 0 quieta, 1..4 corriendo
function mujSprite(pose){const W=52,H=104,B=carBuf(W,H),put=B.put,R=MUJ_R,pk=carPick;
 const run=pose>0,f=(pose-1)%4,sw=run?[1,0,-1,0][f]:0,tilt=run?0:.24,rr=pRng(31+pose);
 const lit=(nx,ny,nz)=>.12+.72*Math.max(0,nz*.85+ny*.25)+.25*Math.max(0,-nx*.6-ny*.5)**2;
 const cx=26,top=run?30:26,hx=cx+(run?sw:4),hy=run?22:14;
 const legs=[],arms=[];const leg=(a,b,c)=>legs.push([a,b,c]),arm=(a,b,c)=>arms.push([a,b,c]);
 if(!run){leg([22,68],[22,83],[22,98]);leg([30,68],[30,83],[30,98]);arm([17,30],[15,49],[14,67]);arm([35,30],[37,49],[38,67])}
 else{if(sw>0){leg([22,66],[19,74],[20,86]);leg([30,66],[33,82],[36,98])}else if(sw<0){leg([22,66],[19,82],[16,98]);leg([30,66],[33,74],[32,86])}else{leg([22,66],[21,80],[20,96]);leg([30,66],[31,80],[32,96])}
  // brazos tirados hacia atrás, abiertos y quebrados
  arm([18,33],[9-sw,44],[4-sw*2,56+sw*4]);arm([34,33],[43-sw,44],[48-sw*2,56-sw*4])}
 const strands=[];for(let i=0;i<26;i++){const a=-Math.PI*(.08+.84*i/25),x0=Math.cos(a)*6.5,y0=Math.sin(a)*7.5,len=run?14+rr()*14:26+rr()*20,side=x0<0?-1:1;strands.push({x0,y0,len,side,ph:rr()*6,w:rr()<.4?2:1})}
 const cs=Math.cos(tilt),sn=Math.sin(tilt);const toW=(ru,rv)=>[hx+ru*cs-rv*sn,hy+ru*sn+rv*cs];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const u=x+.5,v=y+.5;let col=null;
  for(const[a,b,c]of legs){const q=mujCap(u,v,...a,...b,2.7,2.2)||mujCap(u,v,...b,...c,2.2,1.8);if(q){const nz=Math.sqrt(Math.max(0,1-q.ox*q.ox));col=pk(R.skin,lit(q.ox,0,nz)*.8,x,y);if(Math.abs(v-c[1])<2.2&&q.t>.8)col=pk(R.sole,.7,x,y)}}
  {const hem=66+Math.round(Math.sin(u*1.7)*1.5+((u*7)%3>1.6?1:0)),hw=8+(v-top)*.13;
   if(v>=top&&v<hem&&Math.abs(u-cx)<hw){const nx=(u-cx)/hw,nz=Math.sqrt(Math.max(0,1-nx*nx));let val=lit(nx,0,nz);if(Math.sin(u*1.3+v*.15)>.75)val*=.75;
    col=pk(R.gown,val,x,y);const st=Math.sin(u*.9)*Math.cos(v*.33)+Math.sin((u+v)*.21);if(st>1.25||v>hem-6&&((u*3+v)%7)<2)col=pk(R.stain,val*.9,x,y)}}
  for(const[a,b,c]of arms){const q=mujCap(u,v,...a,...b,2.2,1.7)||mujCap(u,v,...b,...c,1.7,1.3);if(q){const nz=Math.sqrt(Math.max(0,1-q.ox*q.ox));col=pk(R.skin,lit(q.ox,0,nz)*.85,x,y)}
   for(let k=-1;k<=1;k++)if(mujCap(u,v,c[0],c[1],c[0]+k*1.5+(c[0]-b[0])*.25,c[1]+5,.7,.45))col=pk(R.skin,.5,x,y);
   const wx=b[0]+(c[0]-b[0])*.8,wy=b[1]+(c[1]-b[1])*.8;if(a[0]>cx&&Math.abs(u-wx)<1.8&&Math.abs(v-wy)<.9)col=pk(R.band,.9,x,y)}
  // cara (en carrera se ve: ojos huecos y boca abierta)
  {const du=u-hx,dv=v-hy,ru=du*cs+dv*sn,rv=-du*sn+dv*cs;if((ru/5)**2+(rv/7.2)**2<1){col=pk(R.skin,.62-.2*(ru/5)-(Math.abs(ru)>3.6?.15:0),x,y);
    if(run){if(((Math.abs(ru)-2.5)/1.5)**2+((rv+.6)/1.9)**2<1)col=[6,3,5];if(((ru)/1.6)**2+((rv-4.4)/2.6)**2<1)col=[12,3,6];if(Math.abs(rv-1.6)<.5&&Math.abs(ru)<.6)col=pk(R.skin,.3,x,y)}}}
  if(col)put(x,y,col)}
 // pelo largo y mojado, mechón por mechón
 for(const st of strands){for(let k=0;k<st.len;k+=.5){let ru=st.x0+Math.sin(k*.18+st.ph)*.9,rv=st.y0+k;
   if(run){ru=st.x0*(1+k*.035)+st.side*k*.1+Math.sin(k*.35+st.ph)*1.6;rv=st.y0-k*.55+Math.abs(st.x0)*.0}
   else if(Math.abs(st.x0)<5.5)ru=st.x0*(1+k*.012)+Math.sin(k*.15+st.ph)*.7;else ru=st.x0+st.side*k*.05;
   if(run&&rv>-2&&Math.abs(ru)<4.6&&rv<8)continue;
   const[x,y]=toW(ru,rv);const val=.06+.3*Math.max(0,Math.sin(k*.2+st.ph))+(k<4?.15:0);for(let d=0;d<st.w;d++)put(Math.round(x)+d,Math.round(y),pk(R.hair,val,Math.round(x)+d,Math.round(y)))}}
 const c=pOut(B.done(),'#06050a');c.mw=.95;return c}

// primer plano: pegada al capó, a medio metro del vidrio, iluminada desde abajo por los focos

