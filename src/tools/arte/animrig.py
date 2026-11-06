# animal templates (side view facing right): code 0..6 fur tones, 7..13 light markings, 14+ fixed colours
import numpy as np, math, json
import anim
from anim import shade, chamfer
from px import ell, poly
from vol import blur
FIXA=['#120c0c','#f6f2ec','#d8707a','#ff3a2a','#f0a020','#d83a30','#e8c040','#2a2420']
FXA={n:i for i,n in enumerate(['eye','shine','tongue','red','beak','comb','leg','claw'])}
class AF:
    def __init__(s,W,H): s.W,s.H=W,H; s.vid=np.full((H,W),-1,int); s.mats=[]; s.rnd=[]; s.dark=[]
    def add(s,m,mat,rnd=2.0,dark=0): s.vid[m]=len(s.mats); s.mats.append(mat); s.rnd.append(rnd); s.dark.append(dark)
def E(f,cx,cy,rx,ry,rot=0): return ell(f.H,f.W,cx,cy,rx,ry,rot)
def L(f,p0,p1,r0,r1,n=10):
    m=np.zeros((f.H,f.W),bool)
    for i in range(n+1):
        t=i/n; m|=E(f,p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t,r0+(r1-r0)*t,r0+(r1-r0)*t)
    return m
def shade_af(f,light=(-0.62,-0.55,0.56)):
    Lv=np.array(light); Lv=Lv/np.linalg.norm(Lv); H,W=f.H,f.W
    k=np.full((H,W),-1,int); n_out=np.zeros((H,W,3))
    for i,mat in enumerate(f.mats):
        m=f.vid==i
        if not m.any(): continue
        r=f.rnd[i]; hgt=blur(m,max(1,int(round(r*0.8))))*r*1.6
        gy,gx=np.gradient(hgt); n=np.dstack([-gx,-gy,np.ones_like(gx)*0.9]); n/=np.linalg.norm(n,axis=2,keepdims=True)
        val=0.18+0.95*np.clip(n@Lv,0,1); n_out[m]=n[m]; k[m]=np.clip(np.round(val[m]*6-0.4)-f.dark[i],0,6).astype(int)
    for i in range(len(f.mats)):
        front=f.vid>i; m=f.vid==i; sh=np.zeros((H,W),bool)
        for dy,dx in ((1,0),(2,0),(1,1),(1,-1)): sh|=np.roll(np.roll(front,dy,0),dx,1)
        sh&=m&~front; k[sh]=np.maximum(k[sh]-2,0)
    C=np.full((H,W),-1,int)
    for y in range(H):
        for x in range(W):
            v=f.vid[y,x]
            if v<0: continue
            kk=k[y,x]; edge=any(not(0<=x+dx<W and 0<=y+dy<H) or f.vid[y+dy,x+dx]<0 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
            if edge:
                if (x-1<0 or f.vid[y,x-1]<0) and f.dark[v]==0 and y<H-3: kk=min(6,kk+1)
                elif n_out[y,x,0]>0.05 or n_out[y,x,1]>0.25: kk=max(0,min(kk,1))
                else: kk=max(1,kk-1)
            C[y,x]=kk+(7 if f.mats[v]=='mark' else 0)
    return C
def fix(C,x,y,name):
    if 0<=y<C.shape[0] and 0<=x<C.shape[1]: C[y,x]=14+FXA[name]
def dog(fi,big=False):
    s=1.18 if big else 1.0; W,H=(42,34) if big else (36,30); f=AF(W,H); S=lambda v:v*s
    ph=[0,1,2,3,None][fi]; sw=[1,0.3,-1,-0.3,0][fi] if ph is not None else 0; bob=[0,1,0,1,0][fi]
    gy=S(26.6)
    def leg(x0,y0,ang,dark,mat='fur'):
        kx=x0+ang*S(1.6); fx=x0+ang*S(3.0)
        f.add(L(f,(x0,y0),(kx,S(21.5)),S(1.6),S(1.3))|L(f,(kx,S(21.5)),(fx,gy-S(1.2)),S(1.3),S(1.1)),mat,1.2,dark)
        f.add(E(f,fx+S(.6),gy-S(.4),S(1.6),S(1.0)),'mark' if mat=='fur' else mat,0.8,dark)
    # far legs (darker), tail, body, near legs, head
    leg(S(23.4),S(16)+bob,sw,1); leg(S(10.6),S(16)+bob,-sw,1)
    wag=[0,1,0,-1,0][fi]*S(1.2)
    f.add(L(f,(S(7.2),S(11.6)+bob),(S(3.4)+wag,S(5.4)+bob),S(1.4),S(.9)),'fur',1.0)
    f.add(E(f,S(15.6),S(13.2)+bob,S(9.2),S(5.0))|E(f,S(22.6),S(13.4)+bob,S(5.0),S(5.4)),'fur',3.0)
    f.add(E(f,S(23.4),S(16.4)+bob,S(3.2),S(2.8)),'mark',1.6)
    leg(S(21.6),S(16.4)+bob,-sw,0); leg(S(9.2),S(16.2)+bob,sw,0)
    f.add(L(f,(S(23.6),S(12)+bob),(S(26.6),S(8.6)+bob),S(3.0),S(2.6)),'fur',2.0)
    f.add(E(f,S(28.4),S(7.6)+bob,S(4.6),S(3.9)),'fur',2.4)
    f.add(E(f,S(32.4),S(9.0)+bob,S(2.9),S(2.0)),'mark',1.4)
    f.add(poly(H,W,[(S(25.4),S(3.4)+bob),(S(28.4),S(4.4)+bob),(S(27.8),S(9.4)+bob),(S(25.2),S(8.6)+bob)]),'fur',1.0,1)
    C=shade_af(f)
    nx,ny=int(round(S(34.6))),int(round(S(8.4)+bob)); fix(C,nx,ny,'eye'); fix(C,nx,ny+1,'eye'); fix(C,nx-1,ny,'eye')
    ex,ey=int(round(S(29.6))),int(round(S(6.4)+bob)); fix(C,ex,ey,'red' if big else 'eye'); fix(C,ex,ey+1,'red' if big else 'eye'); 
    if not big: fix(C,ex+1,ey,'shine')
    else: fix(C,ex+1,ey,'red')
    if fi==4 and not big: fix(C,int(round(S(32.6))),int(round(S(10.6)+bob)),'tongue'); fix(C,int(round(S(33.4))),int(round(S(10.8)+bob)),'tongue')
    return C
def cat(fi):
    W,H=30,24; f=AF(W,H); sw=[1,0.3,-1,-0.3,0][fi]; bob=[0,1,0,1,0][fi]; gy=21.6
    if fi==4:   # sentado
        f.add(L(f,(6,16),(3,6),1.3,0.9),'fur',1.0)
        f.add(E(f,11.6,15.4,6.0,6.4),'fur',3.0); f.add(E(f,14.6,19.8,3.0,1.6),'mark',1.0)
        f.add(L(f,(15.6,14),(16.4,21),1.4,1.2),'fur',1.0); f.add(E(f,16.8,21.2,1.5,0.9),'mark',0.6)
        hx,hy=15.6,7.6
    else:
        def leg(x0,ang,dark): f.add(L(f,(x0,13.6+bob),(x0+ang*2.0,gy),1.2,1.0),'fur',1.0,dark); f.add(E(f,x0+ang*2.0+.4,gy,1.3,.8),'mark',0.6,dark)
        leg(19.0,sw,1); leg(8.6,-sw,1)
        f.add(L(f,(5.2,10.6+bob),(1.8,4.4+bob),1.2,0.8),'fur',1.0)
        f.add(E(f,12.6,11.4+bob,7.6,3.8),'fur',2.6); f.add(E(f,18.6,12.6+bob,2.6,2.2),'mark',1.2)
        leg(17.6,-sw,0); leg(7.4,sw,0)
        hx,hy=21.6,7.6+bob
    f.add(E(f,hx,hy,4.0,3.5),'fur',2.2)
    f.add(poly(H,W,[(hx-3.2,hy-1.8),(hx-2.6,hy-6.0),(hx-0.6,hy-2.8)]),'fur',0.8)
    f.add(poly(H,W,[(hx+0.6,hy-2.8),(hx+2.2,hy-6.2),(hx+3.4,hy-1.6)]),'fur',0.8)
    f.add(E(f,hx+1.6,hy+1.6,2.0,1.4),'mark',1.0)
    C=shade_af(f); ex,ey=int(round(hx+1.4)),int(round(hy-0.6))
    C[ey,ex]=14+FXA['eye']; C[ey,ex+1]=14+FXA['shine'] if False else 14+FXA['eye']; C[ey+1,ex]=14+FXA['eye']
    nx,ny=int(round(hx+3.6)),int(round(hy+1.2)); C[ny,nx]=14+FXA['tongue']
    for (x,y) in ((int(hx-2.2),int(hy-4)),(int(hx+2),int(hy-4.4))):
        if 0<=y<H and 0<=x<W and C[y,x]>=0: C[y,x]=14+FXA['tongue']
    return C
def hen(fi):
    W,H=26,26; f=AF(W,H); bob=[0,1,0,1,0][fi]; peck=(fi==4)
    st=[1,0,-1,0,0][fi]
    lf=L(f,(12.6,17.6+bob),(12.6+st*1.6,23.4),0.6,0.6)|L(f,(10.2,17.6+bob),(10.2-st*1.6,23.4),0.6,0.6); f.add(lf,'leg',0.5)
    f.add(L(f,(5.4,12+bob),(2.4,5.6+bob),2.2,1.4)|L(f,(6.0,13+bob),(3.0,8.6+bob),1.8,1.2),'fur',1.4)
    f.add(E(f,11.6,13.2+bob,7.0,5.6),'fur',3.2); f.add(E(f,10.4,12.6+bob,4.0,2.8),'fur',1.6)
    hx,hy=(18.8,11.6+bob) if peck else (17.6,6.4+bob)
    f.add(L(f,(15.6,10+bob),(hx-.6,hy+1),2.6,2.2),'fur',1.6)
    f.add(E(f,hx,hy,3.2,3.0),'fur',2.0)
    C=shade_af(f)
    def fx(x,y,n):
        x=int(round(x)); y=int(round(y))
        if 0<=x<W and 0<=y<H: C[y,x]=14+FXA[n]
    for (dx,dy) in ((-1,-3),(0,-4),(1,-3),(0,-3),(-1,-4)): fx(hx+dx,hy+dy,'comb')
    fx(hx+3.4,hy+.4,'beak'); fx(hx+4.4,hy+.6,'beak'); fx(hx+3.4,hy+1.2,'beak')
    fx(hx+2.4,hy+2.4,'comb'); fx(hx+2.4,hy+3.2,'comb')
    fx(hx+1.0,hy-.6,'eye')
    for y in range(H):
        for x in range(W):
            if f.vid[y,x]>=0 and f.mats[f.vid[y,x]]=='leg': C[y,x]=14+FXA['leg']
    return C
AL='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
def enc(C):
    seq=['.' if v<0 else AL[v] for v in C.flatten()]; o=[];i=0
    while i<len(seq):
        j=i
        while j<len(seq) and seq[j]==seq[i] and j-i<64: j+=1
        o.append(seq[i]+AL[j-i-1]); i=j
    return ''.join(o)
if __name__=='__main__':
    D={'fix':FIXA,'dog':{'w':36,'h':30,'f':[enc(dog(i)) for i in range(5)]},'cadejos':{'w':42,'h':34,'f':[enc(dog(i,True)) for i in range(5)]},
       'cat':{'w':30,'h':24,'f':[enc(cat(i)) for i in range(5)]},'hen':{'w':26,'h':26,'f':[enc(hen(i)) for i in range(5)]}}
    js='const ANID='+json.dumps(D,separators=(',',':'))+';\n'
    open('../hd/data_anim.js','w').write(js); print('bytes',len(js))
    # preview
    from PIL import Image
    def hexc(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)
    def ramp(hx):
        b=hexc(hx); r=[]
        for i in range(7):
            f_=.42+(1.38-.42)*i/6; c=b*f_
            if f_>1: c=c+(255-c)*(f_-1)*.55
            r.append(np.clip(c,0,255))
        return r
    def col(C,base,markc='#f2ece0'):
        R1=ramp(base); R2=ramp(markc); img=np.zeros(C.shape+(4,),np.uint8)
        for y in range(C.shape[0]):
            for x in range(C.shape[1]):
                v=C[y,x]
                if v<0: continue
                c=R1[v] if v<7 else R2[v-7] if v<14 else hexc(FIXA[v-14])
                img[y,x,:3]=c; img[y,x,3]=255
        return Image.fromarray(img,'RGBA')
    S=Image.new('RGB',(5*44*6+20,4*40*6+20),(184,173,154))
    rows=[('dog','#c8a165',dog),('cadejos','#141218',lambda i:dog(i,True)),('cat','#f2994a',cat),('hen','#f4f4f4',hen)]
    for r,(n,c,fn) in enumerate(rows):
        for i in range(5):
            im=col(fn(i),c,'#f2ece0' if n!='cadejos' else '#2a2228'); im=im.resize((im.width*6,im.height*6),Image.NEAREST); S.paste(im,(10+i*44*6,10+r*40*6),im)
    S.save('anim_prev.png')
