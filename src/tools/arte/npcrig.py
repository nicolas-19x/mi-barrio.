# NPC templates: body (m/f) x 4 dirs x 7 frames, hair styles and accessories as overlays.
# Every pixel stores a material+tone code; the game colours it with each character's colours.
import numpy as np, math
import anim
from anim import Fig,E,P,limb,shade,W,H,OX,OY
FR=anim.FR[:6]+[(0,(0,0),(0,0),0)]
SF=anim.SF[:6]+[(0,((16.8,41.2),(16.6,48.0),0),((15.0,41.2),(14.4,48.0),0),0)]
MATS={'skin':1,'shirt':2,'pants':3,'shoe':4,'hair':5,'acc':6,'metal':7}
FIX=['#140a08','#fbf4ec','#6a2418','#b5525a','#2e6e5e','#ece8e0','#b8b4b0','#1e2a36','#8ab4d0','#e6f2f8','#b9c2c9','#eef3f6','#5a3a22','#e07870','#3a2a1e']
FX={n:i for i,n in enumerate(['eye','eyew','mouth','lips','ink','sole','soleS','lens','lensG','glass','blade','edge','handle','blush','brow'])}
def code_mat(mat,k): return (MATS[mat]-1)*7+int(k)
def code_fix(name): return 49+FX[name]
def render_codes(f):
    k,n=shade(f); C=np.full((H,W),-1,int)
    for y in range(H):
        for x in range(W):
            v=f.vid[y,x]
            if v<0: continue
            mat=f.mats[v]; kk=k[y,x]
            edge=any(not(0<=x+dx<W and 0<=y+dy<H) or f.vid[y+dy,x+dx]<0 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
            if edge:
                left_open=(x-1<0 or f.vid[y,x-1]<0)
                if left_open and mat in ('skin','shirt','pants','hair','acc') and y<H-10 and f.dark[v]==0: kk=min(6,kk+1)
                elif n[y,x,0]>0.05 or n[y,x,1]>0.25: kk=max(0,min(kk,1))
                else: kk=max(1,kk-1)
            C[y,x]=code_mat(mat,kk)
    return C
class Painter:
    def __init__(s,C,ox,oy,mir=False): s.C,s.ox,s.oy,s.mir=C,ox,oy,mir
    def X(s,x): return (W-1-x) if s.mir else x
    def fix(s,x,y,name):
        X,Y=s.X(s.ox+x),s.oy+y
        if 0<=X<W and 0<=Y<H: s.C[Y,X]=code_fix(name)
    def mat(s,x,y,mat,k):
        X,Y=s.X(s.ox+x),s.oy+y
        if 0<=X<W and 0<=Y<H: s.C[Y,X]=code_mat(mat,k)
    def shift(s,x,y,dk):    # darken/lighten existing material pixel
        X,Y=s.X(s.ox+x),s.oy+y
        if 0<=X<W and 0<=Y<H and 0<=s.C[Y,X]<49:
            c=s.C[Y,X]; m,k=c//7,c%7; s.C[Y,X]=m*7+max(0,min(6,k+dk))
# ------------------------------------------------------------------ geometry helpers (front/back share)
def legs_front(f,ox,oy,fdL,fdR,back=False):
    f.add(P([(9.0+ox,32.6+oy),(15.6+ox,32.6+oy),(14.4+ox,46.4+OY+fdL),(10.0+ox,46.4+OY+fdL)]),'pants',2.4)
    f.add(P([(15.6+ox,32.6+oy),(22.2+ox,32.6+oy),(21.2+ox,46.4+OY+fdR),(16.8+ox,46.4+OY+fdR)]),'pants',2.4)
    f.add(P([(8.4+ox,32.4+oy),(23.6+ox,32.4+oy),(23.8+ox,36.6+oy),(8.2+ox,36.6+oy)]),'pants',3.0)
    for (cx,fd) in ((11.7,fdL),(19.3,fdR)):
        f.add(E(cx+ox,50.0+OY+fd,3.9,2.4)|P([(cx-2.6+ox,46.6+OY+fd),(cx+2.6+ox,46.6+OY+fd),(cx+2.9+ox,49.6+OY+fd),(cx-2.9+ox,49.6+OY+fd)]),'shoe',1.8)
def torso(f,ox,oy,fem):
    pts=[(8,17.4),(23,17.4),(24.4,19.2),(23.4,33.6),(8.6,33.6),(7.4,19.2)] if not fem else [(8.8,17.6),(22.2,17.6),(23.4,19.4),(21.8,26.4),(22.8,33.6),(9.2,33.6),(10.2,26.4),(8.6,19.4)]
    return f.add(P([(x+ox,y+oy) for x,y in pts]),'shirt',4.0 if not fem else 3.6)
def arm(f,ox,oy,side,sw,fem):   # side -1 viewer-left, +1 viewer-right; sw swing (+ forward)
    hx=0.6*sw*(-side if side>0 else 1); hy=1.0*sw
    if side<0:
        sl=[(8.4,17.4),(5.6,19),(4.4,23.6),(9.2,23.6),(9.6,19.2)] if not fem else [(9.0,17.6),(6.4,19.2),(5.4,23.4),(9.6,23.4),(10.0,19.4)]
        f.add(P([(x+ox,y+oy) for x,y in sl]),'shirt',2.4)
        a0=4.8 if not fem else 5.6
        f.add(P([(a0+ox,23+oy),(a0+3.9+ox,23+oy),(a0+3.5+hx+ox,31.4+hy+oy),(a0+0.4+hx+ox,31.4+hy+oy)]),'skin',1.8)
        f.add(E(a0+1.9+hx+ox,32.9+hy+oy,2.2,2.4),'skin',1.6)
    else:
        sl=[(22.6,17.4),(25.4,19),(26.6,23.6),(21.8,23.6),(21.4,19.2)] if not fem else [(22.0,17.6),(24.6,19.2),(25.6,23.4),(21.4,23.4),(21.0,19.4)]
        f.add(P([(x+ox,y+oy) for x,y in sl]),'shirt',2.4)
        a0=22.4 if not fem else 21.6
        f.add(P([(a0+ox,23+oy),(a0+3.9+ox,23+oy),(a0+3.5+hx+ox,31.4+hy+oy),(a0+0.4+hx+ox,31.4+hy+oy)]),'skin',1.8)
        f.add(E(a0+2.0+hx+ox,32.9+hy+oy,2.2,2.4),'skin',1.6)
    return hx,hy
def head_front(f,ox,oy):
    f.add(E(8.9+ox,11.4+oy,1.2,1.7),'skin',1.0); f.add(E(22.1+ox,11.4+oy,1.2,1.7),'skin',1.0)
    return f.add(E(15.5+ox,10.8+oy,6.7,5.9)|P([(10+ox,12+oy),(21+ox,12+oy),(19+ox,16.2+oy),(12+ox,16.2+oy)]),'skin',3.2)
# ------------------------------------------------------------------ hair / accessory region builders (added to a Fig)
def hair_front(f,st,ox,oy,phase):
    yy,xx=np.mgrid[0:H,0:W]; cx,cy=15.5+ox,10.8+oy
    if phase=='back':   # parts behind the body
        if st=='largo': f.add(P([(7.6+ox,9+oy),(23.4+ox,9+oy),(24.4+ox,27+oy),(21+ox,28.4+oy),(10+ox,28.4+oy),(6.6+ox,27+oy)]),'hair',3.0)
        if st=='cola': f.add(limb((22.0+ox,12+oy),(24.0+ox,21+oy),1.6,1.1),'hair',1.4)
        return
    top=(E(cx,cy-2.8,7.4,4.8)&(yy<cy-2.2))
    if st=='corto':
        m=top|P([(8.6+ox,7.6+oy),(12+ox,7.4+oy),(11.2+ox,9.0+oy),(13.6+ox,8.0+oy),(15.4+ox,9.2+oy),(17.2+ox,8.0+oy),(19.6+ox,9.0+oy),(19.4+ox,7.4+oy),(22.4+ox,7.6+oy),(22.6+ox,12+oy),(21.6+ox,12.4+oy),(21.2+ox,8.8+oy),(9.8+ox,8.8+oy),(9.4+ox,12.4+oy),(8.4+ox,12+oy)])
        f.add(m,'hair',2.6)
    elif st=='largo':
        m=top|P([(8.2+ox,7+oy),(15.5+ox,7.6+oy),(11.2+ox,9.2+oy),(10.2+ox,11.6+oy),(9.6+ox,13+oy),(9.4+ox,21+oy),(7.4+ox,22+oy),(7.6+ox,10+oy)])|P([(15.5+ox,7.6+oy),(22.8+ox,7+oy),(23.4+ox,10+oy),(23.6+ox,22+oy),(21.6+ox,21+oy),(21.4+ox,13+oy),(20.8+ox,11.6+oy),(19.8+ox,9.2+oy)])
        f.add(m,'hair',2.6)
    elif st=='rizos':
        m=E(cx,cy-3.0,8.6,5.8)&(yy<cy+1.2)
        for a in range(0,360,30):
            r=math.radians(a); m|=E(cx+math.cos(r)*7.6,cy-3.0+math.sin(r)*5.0,2.0,1.8)&(yy<cy+3.2)
        m&=~(P([(10.4+ox,cy-1.6),(20.6+ox,cy-1.6),(20.6+ox,cy+8),(10.4+ox,cy+8)]))
        f.add(m,'hair',3.0)
    elif st=='moño':
        m=top|P([(8.6+ox,7.6+oy),(22.4+ox,7.6+oy),(22.6+ox,12+oy),(21.6+ox,12+oy),(20.6+ox,8.8+oy),(15.5+ox,8+oy),(10.4+ox,8.8+oy),(9.4+ox,12+oy),(8.4+ox,12+oy)])
        f.add(m,'hair',2.6); f.add(E(cx,cy-8.4,3.4,2.8),'hair',1.6)
    elif st=='cola':
        m=top|P([(8.6+ox,7.6+oy),(22.4+ox,7.6+oy),(22.6+ox,12+oy),(21.6+ox,12+oy),(20.8+ox,9.0+oy),(16+ox,8.0+oy),(10.4+ox,9.2+oy),(9.4+ox,12+oy),(8.4+ox,12+oy)])
        f.add(m,'hair',2.6)
    elif st=='calvo':
        f.add(P([(8.2+ox,9+oy),(10.2+ox,8.6+oy),(10.4+ox,12.4+oy),(8.4+ox,12.6+oy)])|P([(20.8+ox,8.6+oy),(22.8+ox,9+oy),(22.6+ox,12.6+oy),(20.6+ox,12.4+oy)]),'hair',1.2)
def hair_back(f,st,ox,oy,phase):
    yy,xx=np.mgrid[0:H,0:W]; cx,cy=15.5+ox,10.8+oy
    if phase=='back': return
    full=E(cx,cy-0.4,6.9,6.0)|P([(10.2+ox,11+oy),(20.8+ox,11+oy),(18.6+ox,14.4+oy),(12.4+ox,14.4+oy)])
    if st=='corto': f.add(full&(yy<cy+3.6),'hair',3.0)
    elif st=='largo': f.add(full|P([(8.0+ox,10+oy),(23+ox,10+oy),(24+ox,27+oy),(20+ox,28.6+oy),(11+ox,28.6+oy),(7+ox,27+oy)]),'hair',3.2)
    elif st=='rizos':
        m=E(cx,cy-0.8,8.6,6.6)
        for a in range(0,360,30):
            r=math.radians(a); m|=E(cx+math.cos(r)*7.6,cy-0.8+math.sin(r)*5.6,2.0,1.8)
        f.add(m&(yy<cy+5.4),'hair',3.2)
    elif st=='moño': f.add(full&(yy<cy+3.0),'hair',3.0); f.add(E(cx,cy-3.4,3.6,3.0),'hair',1.8)
    elif st=='cola': f.add(full&(yy<cy+3.0),'hair',3.0); f.add(limb((cx,cy+1),(cx,cy+12),1.8,1.2),'hair',1.4)
    elif st=='calvo': f.add(P([(9.0+ox,8.6+oy),(22+ox,8.6+oy),(21.4+ox,13.4+oy),(9.6+ox,13.4+oy)])&~E(cx,cy-3.4,6.4,4.6),'hair',1.6)
def hair_side(f,st,MX,oy,phase):
    yy,xx=np.mgrid[0:H,0:W]
    def Em(cx,cy,rx,ry): return E(MX(cx),cy,rx,ry)
    def Pm(pts): return P([(MX(x),y) for x,y in pts])
    def Lm(a,b,r0,r1): return limb((MX(a[0]),a[1]),(MX(b[0]),b[1]),r0,r1)
    if phase=='back':
        if st=='largo': f.add(Pm([(9.0,8+oy),(16.4,8+oy),(15.4,27+oy),(10.6,28+oy),(8.4,20+oy)]),'hair',2.6)
        if st=='cola': f.add(Lm((9.6,11+oy),(9.0,22+oy),1.7,1.1),'hair',1.4)
        return
    cap=Em(15.4,8.8+oy,6.8,4.9)&(yy<9.2+oy)
    back=Pm([(9.2,7+oy),(16.2,7+oy),(16.2,9.6+oy),(15.4,12.6+oy),(13.6,13.6+oy),(10.0,12.6+oy)])
    if st=='corto': f.add(cap|back|Pm([(16.4,9+oy),(18.2,9+oy),(18.0,11.6+oy),(16.6,11.6+oy)])|Pm([(19.4,6+oy),(22.4,8+oy),(21.6,9.6+oy),(19.0,8.8+oy)]),'hair',2.6)
    elif st=='largo': f.add(cap|back|Pm([(9.0,9+oy),(15.6,9+oy),(15.6,14+oy),(12,16+oy)])|Pm([(19.2,6+oy),(22.4,8.2+oy),(21.2,10+oy),(18.6,9+oy)]),'hair',2.6)
    elif st=='rizos':
        m=Em(14.6,8.6+oy,8.0,5.8)&(yy<12.4+oy)
        for a in range(0,360,36):
            r=math.radians(a); m|=Em(14.6+math.cos(r)*6.8,8.6+oy+math.sin(r)*4.8,2.0,1.8)&(yy<13.4+oy)
        m&=~Pm([(17.6,9.6+oy),(23,9.6+oy),(23,16+oy),(17.6,16+oy)])
        f.add(m,'hair',3.0)
    elif st=='moño': f.add(cap|back,'hair',2.6); f.add(Em(9.2,7.4+oy,3.0,2.8),'hair',1.6)
    elif st=='cola': f.add(cap|back,'hair',2.6); f.add(Lm((9.6,9.6+oy),(8.6,13+oy),1.8,1.6),'hair',1.4)
    elif st=='calvo': f.add(Pm([(10.0,8.6+oy),(14.6,8.6+oy),(14.4,12.4+oy),(10.6,12.8+oy)]),'hair',1.2)
# ------------------------------------------------------------------ bodies
def build_front(fi,fem,hook=None):
    b,(ldy,ll),(rdy,rl),sw=FR[fi]; ox,oy=OX,OY+b; fdL,fdR=ldy-ll,rdy-rl
    f=Fig()
    if hook: hook(f,'back',ox,oy)
    f.add(P([(12.8+ox,14+oy),(18.2+ox,14+oy),(18.4+ox,18+oy),(12.6+ox,18+oy)]),'skin',2.0)
    torso(f,ox,oy,fem); legs_front(f,ox,oy,fdL,fdR)
    hxL,hyL=arm(f,ox,oy,-1,sw,fem); hxR,hyR=arm(f,ox,oy,1,-sw,fem)
    head_front(f,ox,oy)
    if hook: hook(f,'front',ox,oy)
    return f,dict(ox=ox,oy=oy,fdL=fdL,fdR=fdR,ll=ll,rl=rl,hxL=hxL,hyL=hyL,hxR=hxR,hyR=hyR)
def face_front(C,g,fem):
    p=Painter(C,g['ox'],g['oy'])
    for ex in (12,18):
        p.fix(ex,10,'eyew'); p.fix(ex+1,10,'eye'); p.fix(ex,11,'eye'); p.fix(ex+1,11,'eye')
        p.mat(ex-1,8,'hair',1); p.mat(ex,8,'hair',1); p.mat(ex+1,8,'hair',2)
    if fem: p.fix(11,10,'eye'); p.fix(20,10,'eye')
    p.shift(16,12,-1); p.shift(16,13,-1); p.shift(15,11,1)
    if fem: [p.fix(x,14,'lips') for x in (14,15,16,17)]; p.fix(15,15,'lips')
    else: [p.fix(x,14,'mouth') for x in (14,15,16,17)]
    p.shift(13,13,-1); p.shift(18,13,-1)
    if fem: p.fix(11,13,'blush'); p.fix(20,13,'blush')
    for x in range(13,19): p.shift(x,16,-2); p.shift(x,17,-1)
    for x in range(10,21): p.shift(x,17+1,0)
    # cuello de la camiseta y faja del pantalón
    for x in range(12,20): p.shift(x,18,-2)
    for x in range(9,23): p.shift(x,33,-2)
def build_back(fi,fem,hook=None):
    b,(ldy,ll),(rdy,rl),sw=FR[fi]; ox,oy=OX,OY+b; fdL,fdR=-ldy-ll,-rdy-rl
    f=Fig()
    if hook: hook(f,'back',ox,oy)
    f.add(P([(13.2+ox,12+oy),(17.8+ox,12+oy),(18.2+ox,18+oy),(12.8+ox,18+oy)]),'skin',2.0)
    torso(f,ox,oy,fem); legs_front(f,ox,oy,fdL,fdR)
    hxL,hyL=arm(f,ox,oy,-1,-sw,fem); hxR,hyR=arm(f,ox,oy,1,sw,fem)
    head_front(f,ox,oy)
    if hook: hook(f,'front',ox,oy)
    return f,dict(ox=ox,oy=oy,fdL=fdL,fdR=fdR,ll=ll,rl=rl,hxL=hxL,hyL=hyL,hxR=hxR,hyR=hyR)
def face_back(C,g,fem):
    p=Painter(C,g['ox'],g['oy'])
    for x in range(12,20): p.shift(x,17,-2)
    for x in range(9,23): p.shift(x,33,-2)
def build_side(fi,facing,fem,hook=None):
    b,near,far,sw=SF[fi]; mir=(facing=='L'); MX=(lambda x:(W-1-x)) if mir else (lambda x:x)
    def M(pts): return [(MX(x),y) for x,y in pts]
    def Em(cx,cy,rx,ry): return E(MX(cx),cy,rx,ry)
    def Lm(p0,p1,r0,r1): return limb((MX(p0[0]),p0[1]),(MX(p1[0]),p1[1]),r0,r1)
    oy=OY+b; f=Fig(); hip=(15.6,34.6+oy)
    def leg(kn,an,pose,dark):
        kn=(kn[0],kn[1]+OY); an=(an[0],an[1]+OY)
        f.add(Lm(kn,(an[0],an[1]+0.6),2.2,1.9),'pants',1.6,dark)
        f.add(P(M(anim.shoe_pts(an[0],an[1]+0.4,pose))),'shoe',1.6,dark)
        f.add(Lm(hip,kn,2.7,2.3)|Lm(hip,(hip[0]+(kn[0]-hip[0])*.15,hip[1]+(kn[1]-hip[1])*.15),3.2,3.0),'pants',2.4,dark)
        return an
    if hook: hook(f,'back',MX,oy)
    hxy=(15.0+sw*5.0,31.0-abs(sw)*0.8+oy)
    f.add(Lm((15.0,20.5+oy),(15.0+sw*2.6,26.0+oy),1.8,1.7)|Lm((15.0+sw*2.6,26.0+oy),hxy,1.7,1.5),'skin',1.5,1)
    f.add(Em(hxy[0],hxy[1]+1.1,1.9,2.0),'skin',1.2,1)
    anF=leg(far[0],far[1],far[2],1)
    f.add(P(M([(13.6,13.5+oy),(18.0,13.5+oy),(18.4,18.5+oy),(13.4,18.5+oy)])),'skin',1.8)
    tw=0 if not fem else 0.6
    f.add(P(M([(11.8+tw,17.4+oy),(19.4-tw,17.4+oy),(20.8-tw,20.2+oy),(20.4-tw*1.6,26+oy),(19.8,33.8+oy),(11.4,33.8+oy),(10.6+tw*1.6,26+oy),(10.8+tw,20.2+oy)])),'shirt',3.6)
    f.add(P(M([(11.0,32.8+oy),(20.2,32.8+oy),(20.8,37.2+oy),(11.0,37.6+oy)])),'pants',2.6)
    anN=leg(near[0],near[1],near[2],0)
    f.add(Em(15.8,10.6+oy,6.3,5.8)|P(M([(15.8,11+oy),(21.6,10.6+oy),(22.2,13.4+oy),(20.8,16.0+oy),(15.2,16.2+oy)]))|Em(22.2,11.8+oy,1.2,1.1),'skin',3.0)
    f.add(Em(14.8,11.6+oy,1.3,1.8),'skin',1.0)
    s2=-sw; hxy2=(15.2+s2*5.0,31.0-abs(s2)*0.8+oy)
    f.add(Lm((15.2,20.5+oy),(15.2+s2*2.4,26.4+oy),1.6,1.5),'skin',1.4)
    f.add(Lm((15.2+s2*2.4,26.4+oy),hxy2,1.5,1.4),'skin',1.3)
    f.add(Em(hxy2[0],hxy2[1]+1.0,1.8,1.9),'skin',1.1)
    f.add(P(M([(12.6,17.8+oy),(17.6,17.8+oy),(18.2,23.8+oy),(12.4,23.8+oy)])),'shirt',2.0)
    if hook: hook(f,'front',MX,oy)
    return f,dict(oy=oy,mir=mir,MX=MX,hxy2=hxy2,s2=s2,anN=anN,anF=anF)
def face_side(C,g,fem):
    p=Painter(C,0,g['oy'],g['mir'])
    p.fix(19,10,'eye'); p.fix(20,10,'eyew'); p.fix(19,11,'eye'); p.fix(20,11,'eye')
    p.mat(19,8,'hair',1); p.mat(20,8,'hair',1); p.mat(21,8,'hair',2)
    if fem: p.fix(21,10,'eye'); p.fix(21,14,'lips'); p.fix(20,14,'lips'); p.fix(19,13,'blush')
    else: p.fix(21,14,'mouth'); p.fix(20,14,'mouth')
    p.shift(22,12,1); p.shift(21,13,-1); p.shift(15,11,-1); p.shift(15,12,-1)
    for x in range(14,19): p.shift(x,17,-2)
    for x in range(11,21): p.shift(x,33,-2)
DIRS=['front','back','L','R']
def build(dirn,fi,fem,hook=None):
    if dirn=='front': f,g=build_front(fi,fem,hook)
    elif dirn=='back': f,g=build_back(fi,fem,hook)
    else: f,g=build_side(fi,dirn,fem,hook)
    return f,g
def details(C,dirn,g,fem):
    if dirn=='front': face_front(C,g,fem)
    elif dirn=='back': face_back(C,g,fem)
    else: face_side(C,g,fem)
# ------------------------------------------------------------------ overlays
def hair_hook(st,dirn):
    def h(f,phase,a,oy):
        if dirn=='front': hair_front(f,st,a,oy,phase)
        elif dirn=='back': hair_back(f,st,a,oy,phase)
        else: hair_side(f,st,a,oy,phase)
    return h
def acc_hook(acc,dirn):
    def h(f,phase,a,oy):
        if phase!='front': return
        yy=np.mgrid[0:H,0:W][0]
        if dirn in ('front','back'):
            ox=a
            if acc=='gorra':
                f.add(E(15.5+ox,6.2+oy,7.6,6.0)&(yy<6.6+oy),'acc',3.0)
                if dirn=='front': f.add(E(15.5+ox,6.9+oy,9.2,1.7),'acc',1.2)
            if acc=='sombrero':
                f.add(E(15.5+ox,6.6+oy,11.8,2.8),'acc',1.6); f.add(E(15.5+ox,4.0+oy,6.2,4.4)&(yy<6.2+oy),'acc',2.4)
            if acc=='barba' and dirn=='front':
                f.add(P([(9.6+ox,12.2+oy),(21.4+ox,12.2+oy),(20.0+ox,16.6+oy),(15.5+ox,17.6+oy),(11.0+ox,16.6+oy)])&~P([(13.4+ox,13.2+oy),(18.6+ox,13.2+oy),(18.6+ox,15.4+oy),(13.4+ox,15.4+oy)]),'hair',1.6)
            if acc=='bigote' and dirn=='front':
                f.add(P([(12.6+ox,12.6+oy),(19.4+ox,12.6+oy),(19.8+ox,14.0+oy),(15.5+ox,13.4+oy),(11.8+ox,14.0+oy)]),'hair',1.0)
        else:
            MX=a; Em=lambda cx,cy,rx,ry:E(MX(cx),cy,rx,ry); Pm=lambda pts:P([(MX(x),y) for x,y in pts])
            if acc=='gorra': f.add(Em(15.6,6.3+oy,7.0,5.7)&(yy<7.2+oy),'acc',3.0); f.add(Em(22.6,7.0+oy,5.2,1.3),'acc',1.0)
            if acc=='sombrero': f.add(Em(15.6,6.6+oy,10.4,2.2),'acc',1.6); f.add(Em(15.2,4.0+oy,5.4,4.0)&(yy<6.2+oy),'acc',2.4)
            if acc=='barba': f.add(Pm([(15.4,12.0+oy),(21.0,12.6+oy),(21.6,14.8+oy),(19.6,16.6+oy),(15.0,16.4+oy)])&~Pm([(19.6,13.4+oy),(22.6,13.4+oy),(22.6,15+oy),(19.6,15+oy)]),'hair',1.6)
            if acc=='bigote': f.add(Pm([(19.4,12.8+oy),(22.4,12.8+oy),(22.6,13.8+oy),(19.6,13.8+oy)]),'hair',1.0)
    return h
def acc_paint(C,acc,dirn,g,fem):
    if dirn in('front','back'):
        p=Painter(C,g['ox'],g['oy'])
        if acc=='aretes':
            for x in (9,22): p.mat(x,13,'acc',5); p.mat(x,14,'acc',3)
        if dirn=='back': return
        if acc=='lentes':
            for x0 in (11,17):
                for x in range(x0,x0+4):
                    p.fix(x,10,'lens'); p.fix(x,11,'lens')
                p.fix(x0+1,10,'lensG')
            p.fix(15,10,'lens'); p.fix(16,10,'lens'); p.fix(10,10,'lens'); p.fix(21,10,'lens')
        if acc=='anteojos':
            for x0 in (11,17):
                for x in range(x0,x0+4): p.fix(x,9,'brow'); p.fix(x,12,'brow')
                p.fix(x0,10,'brow'); p.fix(x0,11,'brow'); p.fix(x0+3,10,'brow'); p.fix(x0+3,11,'brow'); p.fix(x0+2,10,'glass')
            p.fix(15,10,'brow'); p.fix(16,10,'brow')
        if acc=='collar':
            for i,x in enumerate(range(11,21)):
                y=18+int(round(2.2*math.sin((x-11)/9*math.pi))); p.mat(x,y,'acc',5 if i%2 else 3)
            p.mat(15,21,'acc',5); p.mat(16,21,'acc',4); p.mat(15,22,'acc',3); p.mat(16,22,'acc',3)
    else:
        p=Painter(C,0,g['oy'],g['mir'])
        if acc=='aretes': p.mat(15,13,'acc',5); p.mat(15,14,'acc',3)
        if acc=='lentes':
            for x in range(18,22): p.fix(x,10,'lens'); p.fix(x,11,'lens')
            p.fix(19,10,'lensG'); [p.fix(x,10,'lens') for x in range(15,18)]
        if acc=='anteojos':
            for x in range(18,22): p.fix(x,9,'brow'); p.fix(x,12,'brow')
            p.fix(18,10,'brow'); p.fix(18,11,'brow'); p.fix(21,10,'brow'); p.fix(21,11,'brow'); p.fix(20,10,'glass'); [p.fix(x,10,'brow') for x in range(15,18)]
        if acc=='collar':
            for x in range(15,20): p.mat(x,18+(1 if x in(17,18) else 0),'acc',4)
def tattoo_paint(C,dirn,g):
    if dirn in('front','back'):
        p=Painter(C,g['ox'],g['oy'])
        for (x0,hx,hy) in ((5,g['hxL'],g['hyL']),(23,g['hxR'],g['hyR'])):
            for (dx,dy) in ((0,26),(1,27),(2,26),(1,28),(0,29),(2,29)): p.fix(int(round(x0+dx+hx*0.6)),int(round(dy+hy*0.6)),'ink')
    else:
        p=Painter(C,0,g['oy']-OY+OY,g['mir']); hx,hy=g['hxy2']
        for (dx,dy) in ((-1,-4),(0,-3),(1,-4),(0,-2)): p.fix(int(round(hx+dx)),int(round(hy-g['oy']+dy)),'ink')
def machete_paint(C,dirn,g):
    if dirn=='front': p=Painter(C,g['ox'],g['oy']);x0=24
    elif dirn=='back': p=Painter(C,g['ox'],g['oy']);x0=6
    else:
        if not g['mir']: return
        p=Painter(C,0,g['oy'],True);x0=13
    for y in range(27,30): p.fix(x0,y,'handle'); p.fix(x0+1,y,'handle')
    for y in range(30,40): p.fix(x0,y,'blade'); p.fix(x0+1,y,'edge' if y%3 else 'blade')
    p.fix(x0,40,'blade')
def bake_all():
    out={'b':{},'h':{},'a':{}}
    for sex,fem in (('m',False),('f',True)):
        base={}
        out['b'][sex]=[]
        for dirn in DIRS:
            row=[]
            for fi in range(7):
                f,g=build(dirn,fi,fem); C=render_codes(f); details(C,dirn,g,fem); base[(dirn,fi)]=(C,g); row.append(C)
            out['b'][sex].append(row)
        for st in ['corto','largo','rizos','moño','cola','calvo']:
            out['h'].setdefault(st,{})[sex]=[]
            for dirn in DIRS:
                row=[]
                for fi in range(7):
                    f,g=build(dirn,fi,fem,hair_hook(st,dirn)); C=render_codes(f); details(C,dirn,g,fem)
                    B=base[(dirn,fi)][0]; O=np.where(C!=B,C,-1); row.append(O)
                out['h'][st][sex].append(row)
        for acc in ['gorra','sombrero','barba','bigote','lentes','anteojos','aretes','collar','tattoos','machete']:
            out['a'].setdefault(acc,{})[sex]=[]
            for dirn in DIRS:
                row=[]
                for fi in range(7):
                    B,g=base[(dirn,fi)]
                    if acc in('gorra','sombrero','barba','bigote'):
                        f,g2=build(dirn,fi,fem,acc_hook(acc,dirn)); C=render_codes(f); details(C,dirn,g2,fem)
                        if acc=='gorra' and dirn=='front':   # visor shadow over the brows/eyes stays readable
                            pass
                    else:
                        C=B.copy()
                        if acc=='tattoos': tattoo_paint(C,dirn,g)
                        elif acc=='machete': machete_paint(C,dirn,g)
                        else: acc_paint(C,acc,dirn,g,fem)
                    O=np.where(C!=B,C,-1)
                    if acc in('gorra','sombrero'): O=np.where((O>=0)&(O<49)&((O//7)==MATS['acc']-1),O,-1)
                    if acc in('barba','bigote'): O=np.where((O>=0)&(O<49)&((O//7)==MATS['hair']-1),O,-1)
                    row.append(O)
                out['a'][acc][sex].append(row)
    return out
