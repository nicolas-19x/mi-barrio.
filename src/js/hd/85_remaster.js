// ---------- remasterizado automático para mapas sin versión HD propia (San José, Mercado) ----------
// Escala x2 con EPX (bordes diagonales limpios) y le da grano y manchas a las superficies planas.
function hdRemaster(src,textured){const w=src.width,h=src.height,sd=src.getContext('2d').getImageData(0,0,w,h).data,s32=new Uint32Array(sd.buffer.slice(0));
  const W=w*2,H=h*2,out=new Uint32Array(W*H);const at=(x,y)=>s32[(y<0?0:y>=h?h-1:y)*w+(x<0?0:x>=w?w-1:x)];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const P_=s32[y*w+x],A=at(x,y-1),B=at(x+1,y),Cc=at(x-1,y),D=at(x,y+1);let p1=P_,p2=P_,p3=P_,p4=P_;
    if(Cc===A&&Cc!==D&&A!==B)p1=A;if(A===B&&A!==Cc&&B!==D)p2=B;if(D===Cc&&D!==B&&Cc!==A)p3=Cc;if(B===D&&B!==A&&D!==Cc)p4=D;
    const o=(y*2)*W+x*2;out[o]=p1;out[o+1]=p2;out[o+W]=p3;out[o+W+1]=p4}
  const d=new Uint8ClampedArray(out.buffer);
  if(textured)for(let Y=0;Y<H;Y++)for(let X=0;X<W;X++){const k=(Y*W+X)<<2;if(d[k+3]<255)continue;const x=X>>1,y=Y>>1,P_=s32[y*w+x];
    if(at(x-1,y)!==P_||at(x+1,y)!==P_||at(x,y-1)!==P_||at(x,y+1)!==P_)continue;   // solo superficies planas (no texto ni bordes)
    const f=1+(hdVN(X,Y,22,13)-.5)*.07+(hdr(X,Y)-.5)*.035;d[k]*=f;d[k+1]*=f;d[k+2]*=f}
  const c=mk(W,H);c.getContext('2d').putImageData(new ImageData(d,W,H),0,0);return c}
