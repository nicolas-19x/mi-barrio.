# Ariana — personaje propio (estilo B): tez clara, delgada, pelo negro largo y lacio peinado hacia atrás,
# cejas marcadas, delineado, blusa de tirantes, dos cadenitas (una con perla), aretes colgantes de cristal.
# Usa el mismo sistema de códigos material+tono que los NPC (el editor sigue tiñendo piel/blusa/pantalón/pelo).
import numpy as np, math
import anim
from anim import Fig,E,P,limb,W,H,OX,OY
from npcrig import FR,SF,render_codes,code_mat,MATS
AFIX=['#120806','#f4ece4','#3a1e14','#c98580','#e6aaa2','#eaa08e','#0a0404','#b8b4b0','#4a2c1c','#7a4a2a','#9a5a58','#eef4fa','#9ab4cc','#fbf8f0','#16100e']
AFX={n:i for i,n in enumerate(['eye','glint','iris','lips','lipsH','blush','lash','soleS','belt','beltH','lipD','crys','crysS','pearl','brow'])}
def cfix(n): return 49+AFX[n]
yy_,xx_=np.mgrid[0:H,0:W]
class Pt:
    def __init__(s,C,ox,oy,mir=False): s.C,s.ox,s.oy,s.mir=C,ox,oy,mir
    def _xy(s,x,y):
        X=s.ox+x; X=(W-1-X) if s.mir else X; return int(round(X)),int(round(s.oy+y))
    def fix(s,x,y,n):
        X,Y=s._xy(x,y)
        if 0<=X<W and 0<=Y<H: s.C[Y,X]=cfix(n)
    def mat(s,x,y,m,k):
        X,Y=s._xy(x,y)
        if 0<=X<W and 0<=Y<H: s.C[Y,X]=code_mat(m,k)
    def ism(s,x,y,m):
        X,Y=s._xy(x,y)
        return 0<=X<W and 0<=Y<H and 0<=s.C[Y,X]<49 and s.C[Y,X]//7==MATS[m]-1
    def shift(s,x,y,dk,only=None):
        X,Y=s._xy(x,y)
        if 0<=X<W and 0<=Y<H and 0<=s.C[Y,X]<49:
            c=s.C[Y,X]; m,k=c//7,c%7
            if only and m!=MATS[only]-1: return
            s.C[Y,X]=m*7+max(0,min(6,k+dk))
def ismat(C,m): return (C>=0)&(C<49)&((C//7)==MATS[m]-1)
def straight(xl,xr,yt,yb,tips=5,tipd=1.2,flare=0.6):
    """masa de pelo lacio: lados casi rectos, puntas finas en la base"""
    pts=[(xl+0.3,yt),(xl-flare,yb)]
    for i in range(tips*2+1):
        x=xl-flare+(xr-xl+2*flare)*i/(tips*2); pts.append((x,yb+(tipd if i%2 else 0)))
    pts+= [(xr+flare,yb),(xr-0.3,yt)]
    return pts
def mirx(x): return 31.0-x
# ---------------------------------------------------------------- FRONT / BACK
def body_fb(f,ox,oy,fdL,fdR,sw,back):
    T=lambda pts:[(x+ox,y+oy) for x,y in pts]
    f.add(P(T([(13.8,14),(17.2,14),(17.6,18.4),(13.4,18.4)])),'skin',1.6)
    # hombros y pecho de piel (blusa de tirantes)
    f.add(P(T([(10.4,17.4),(20.6,17.4),(21.8,19.0),(21.2,22.0),(9.8,22.0),(9.2,19.0)])),'skin',2.6)
    # piernas (jeans ajustados) + cadera
    f.add(P([(10.2+ox,32.6+oy),(15.3+ox,32.6+oy),(14.0+ox,46.6+OY+fdL),(11.0+ox,46.6+OY+fdL)]),'pants',2.0)
    f.add(P([(15.7+ox,32.6+oy),(20.8+ox,32.6+oy),(20.0+ox,46.6+OY+fdR),(17.0+ox,46.6+OY+fdR)]),'pants',2.0)
    f.add(P(T([(10.8,29.6),(20.2,29.6),(21.0,33.0),(20.9,35.0),(10.1,35.0),(10.0,33.0)])),'pants',2.8)
    for (cx,fd) in ((12.5,fdL),(18.5,fdR)):
        f.add(E(cx+ox,50.1+OY+fd,3.0,2.1)|P([(cx-2.0+ox,46.8+OY+fd),(cx+2.0+ox,46.8+OY+fd),(cx+2.4+ox,49.8+OY+fd),(cx-2.4+ox,49.8+OY+fd)]),'shoe',1.5)
    # blusa de tirantes: escote recto, cintura fina
    if back: top=[(11.2,17.6),(12.8,17.6),(13.0,19.2),(18.0,19.2),(18.2,17.6),(19.8,17.6),(21.0,19.6),(20.6,23.4),(19.8,26.6),(20.3,30.6),(10.7,30.6),(11.2,26.6),(10.4,23.4),(10.0,19.6)]
    else:    top=[(11.0,17.8),(12.6,17.8),(12.8,20.4),(18.2,20.4),(18.4,17.8),(20.0,17.8),(21.0,20.0),(20.7,23.4),(19.8,26.6),(20.3,30.6),(10.7,30.6),(11.2,26.6),(10.3,23.4),(10.0,20.0)]
    f.add(P(T(top)),'shirt',3.0)
    hx=[0,0];hy=[0,0]
    for i,(side,s) in enumerate(((-1,sw),(1,-sw))):
        X=(lambda x:x) if side<0 else mirx
        hxx=0.5*s*(1 if side<0 else -1); hyy=0.9*s
        a0=7.6
        f.add(limb((X(a0+1.5)+ox,19.2+oy),(X(a0+1.3)+hxx*0.5+ox,24.6+oy+hyy*0.4),1.55,1.35),'skin',1.5)
        f.add(limb((X(a0+1.3)+hxx*0.5+ox,24.6+oy+hyy*0.4),(X(a0+1.2)+hxx+ox,29.8+hyy+oy),1.35,1.1),'skin',1.4)
        f.add(E(X(a0+1.2)+hxx+ox,31.3+hyy+oy,1.5,1.9),'skin',1.2)
        hx[i]=hxx;hy[i]=hyy
    f.add(E(9.1+ox,11.4+oy,1.0,1.5),'skin',1.0); f.add(E(21.9+ox,11.4+oy,1.0,1.5),'skin',1.0)
    f.add(E(15.5+ox,10.6+oy,6.3,5.8)|P(T([(10.4,12),(20.6,12),(18.6,15.8),(16.2,16.8),(14.8,16.8),(12.4,15.8)])),'skin',3.2)
    return hx,hy
def hair_front_A(f,ox,oy,phase,b):
    cx,cy=15.5+ox,10.6+oy; lag=0.5*b
    if phase=='back':
        f.add(P([(x+ox,y+oy+(lag if y>20 else 0)) for x,y in straight(8.6,22.4,9,29.6,tips=5,flare=0.3)]),'hair',3.0,1)
        return
    # peinado hacia atrás: frente despejada, raya al lado, volumen arriba
    top=E(cx,cy-2.4,7.2,5.4)&(yy_<cy-4.9)
    # costado derecho (del espectador): el pelo cae sobre la oreja y por delante del hombro
    rside=P([(19.4+ox,4.6+oy),(22.8+ox,6.4+oy),(23.4+ox,11+oy),(23.4+ox,16+oy),(22.0+ox,16.4+oy),(21.9+ox,12.6+oy),(21.7+ox,8.0+oy),(20.8+ox,6.2+oy)])
    sR=P([(21.0+ox,15+oy),(23.2+ox,15.4+oy),(22.0+ox,17.6+oy),(21.0+ox,20+oy),(20.4+ox,26+oy+lag),(20.0+ox,28.6+oy+lag),(19.4+ox,27.4+oy+lag),(18.8+ox,28.6+oy+lag),(18.6+ox,26.0+oy+lag),(18.8+ox,22+oy),(19.6+ox,17+oy)])
    # costado izquierdo: pelo detrás de la oreja; un mechón largo cae por delante
    lside=P([(11.6+ox,4.6+oy),(8.2+ox,6.4+oy),(7.8+ox,10.4+oy),(8.6+ox,10.6+oy),(9.2+ox,7.6+oy),(10.4+ox,6.2+oy)])
    sL=P([(8.4+ox,13.4+oy),(10.0+ox,13.4+oy),(11.4+ox,17+oy),(12.2+ox,22+oy),(12.4+ox,27.0+oy+lag),(11.8+ox,28.8+oy+lag),(11.2+ox,27.4+oy+lag),(10.8+ox,22+oy),(10.0+ox,18.4+oy),(9.0+ox,17.4+oy)])
    f.add(top|lside|rside,'hair',2.8); f.add(sL,'hair',1.6); f.add(sR,'hair',1.6)
def hair_back_A(f,ox,oy,b):
    cx,cy=15.5+ox,10.6+oy; lag=0.5*b
    head=E(cx,cy-0.5,6.8,6.1)
    pts=[(9.0,10),(22.0,10),(21.4,15.0),(19.9,18.4),(19.6,22),(20.0,26),(20.2,28.8)]
    for i in range(9): pts.append((20.2-i*(9.4/8),28.8+(1.2 if i%2 else 0)))
    pts+=[(11.0,26),(11.4,22),(11.1,18.4),(9.6,15.0)]
    mass=P([(x+ox,y+oy+(lag if y>20 else 0)) for x,y in pts])
    f.add(head|mass,'hair',3.0)
def hair_tex(C,crown=None,part=None):
    """lacio: líneas finas verticales + brillo en arco"""
    hm=ismat(C,'hair'); ys,xs=np.nonzero(hm)
    for y,x in zip(ys,xs):
        c=C[y,x]; k=c%7
        if y>=16 and (x*7+3)%5<2: C[y,x]=c-min(k,1)
        elif y<16 and (x+(y//3))%4==0: C[y,x]=c-min(k,1)
    if crown:
        cx,cy,rx,amp=crown
        for x in range(int(cx-rx),int(cx+rx)+1):
            t=(x-cx)/rx; y=int(round(cy+amp*t*t))
            for yy,dk in ((y,1),):
                if 0<=yy<H and 0<=x<W and hm[yy,x]:
                    c=C[yy,x]; k=c%7; C[yy,x]=c-k+min(6,k+dk)
    if part:
        pts=part
        for x,y in pts:
            if hm[y,x]: c=C[y,x]; C[y,x]=c-c%7
def strands_sheen(C,cols,y0,y1):
    hm=ismat(C,'hair')
    for x in cols:
        for y in range(y0,y1):
            if 0<=x<W and hm[y,x] and (y%5)!=0:
                c=C[y,x]; k=c%7; C[y,x]=c-k+min(6,k+1)
def face_front(C,ox,oy):
    p=Pt(C,ox,oy)
    # cejas gruesas y definidas
    for x,y in ((11,7),(12,7),(13,7)): p.fix(x,y,'brow')
    p.shift(10,8,-2); p.shift(14,7,-2)
    p.fix(11,7,'brow') if False else None
    for x,y in ((18,7),(19,7),(20,7)): p.fix(x,y,'brow')
    p.shift(21,8,-2); p.shift(17,7,-2)
    # ojos almendrados con delineado y rabito
    for x in (11,12,13): p.fix(x,9,'lash')
    for x in (18,19,20): p.fix(x,9,'lash')
    p.fix(10,9,'lash'); p.fix(21,9,'lash'); 
    p.fix(11,10,'iris'); p.fix(12,10,'glint'); p.fix(13,10,'iris')
    p.fix(18,10,'glint'); p.fix(19,10,'iris'); p.fix(20,10,'iris')
    p.fix(12,11,'eye'); p.fix(19,11,'eye'); p.shift(11,11,-1); p.shift(13,11,-1); p.shift(18,11,-1); p.shift(20,11,-1)
    # nariz fina
    p.shift(16,13,-1)
    # labios llenos
    p.fix(14,14,'lipD'); p.fix(15,14,'lips'); p.fix(16,14,'lips'); p.fix(17,14,'lipD')
    p.fix(15,15,'lipsH'); p.fix(16,15,'lips')
    p.fix(11,13,'blush'); p.fix(20,13,'blush')
    pass
def neck_jewels_front(C,ox,oy):
    p=Pt(C,ox,oy)
    p.shift(13,19,-1,'skin'); p.shift(18,19,-1,'skin')   # clavículas
    # cadenita corta (fina) y cadenita larga con perla
    for x in (13,15,17): p.mat(x,18,'acc',4)
    for x,y in ((13,20),(14,21),(17,21),(18,20)): p.mat(x,y,'acc',3)
    p.mat(15,22,'acc',4); p.fix(16,22,'pearl')
def build_fb(dirn,fi):
    b,(ldy,ll),(rdy,rl),sw=FR[fi]; ox,oy=OX,OY+b
    back=dirn=='back'
    if back: fdL,fdR=-ldy-ll,-rdy-rl; sw=-sw
    else: fdL,fdR=ldy-ll,rdy-rl
    f=Fig()
    if not back: hair_front_A(f,ox,oy,'back',b)
    hx,hy=body_fb(f,ox,oy,fdL,fdR,sw,back)
    if back: hair_back_A(f,ox,oy,b)
    else: hair_front_A(f,ox,oy,'front',b)
    C=render_codes(f)
    p=Pt(C,ox,oy)
    if back:
        hair_tex(C,crown=(15.5+ox,4.8+oy,6.0,2.2))
        strands_sheen(C,[13+ox,17+ox],12+oy,27+oy)
    else:
        hair_tex(C,crown=(15.5+ox,3.6+oy,5.6,2.0),part=[(12+ox,3+oy),(12+ox,4+oy),(13+ox,5+oy)])
        strands_sheen(C,[11+ox,20+ox],16+oy,27+oy)
        q=Pt(C,ox,oy)
        for y in range(6,17):
            for x in range(10,22):
                if q.ism(x,y,'skin'):
                    X,Y=q._xy(x,y); c=C[Y,X]; k=c%7
                    lo=4 if x<16 else 3
                    if y==16 or x in(10,21): lo-=1
                    C[Y,X]=c-k+max(k,lo)
        face_front(C,ox,oy); neck_jewels_front(C,ox,oy)
    # faja, costuras, ruedo de la blusa
    for x in range(11,21): p.shift(x,29,-1,'shirt')
    for x in range(11,21): p.fix(x,30,'belt')
    p.fix(13,30,'beltH'); p.fix(18,30,'beltH')
    if not back: p.mat(15,30,'acc',5); p.mat(16,30,'acc',3)
    for x in range(14,18): p.shift(x,17,-2,'skin')
    # aretes colgantes de cristal (oreja izquierda visible; derecha asoma bajo el pelo)
    if back:
        p.fix(8,13,'crys'); p.fix(8,14,'crysS'); p.fix(23,13,'crys'); p.fix(23,14,'crysS')
    else:
        p.mat(8,12,'acc',5); p.fix(8,13,'crys'); p.fix(8,14,'crysS')
        p.mat(23,12,'acc',5); p.fix(23,13,'crys'); p.fix(23,14,'crysS')
    # pulseras, rodillas, tenis
    for i,side in enumerate((-1,1)):
        X=(lambda x:x) if side<0 else mirx
        y=29+int(round(hy[i])); x=X(8.6)+hx[i]
        p.mat(x,y,'acc',5); p.mat(x+(1 if side<0 else -1),y,'acc',3)
    q=Pt(C,ox,OY)
    for (x0,fd) in ((11,fdL),(17,fdR)):
        q.shift(x0+1,40+fd,1,'pants'); q.shift(x0+1,41+fd,1,'pants')
        for x in range(x0-1,x0+5): q.shift(x,46+fd,2,'pants')
        for x in range(x0-2,x0+5):
            for y in range(53+fd,47+fd,-1):
                if q.ism(x,y,'shoe'): q.fix(x,y,'soleS'); break
        if not back: q.mat(x0+1,49+fd,'shirt',3); q.mat(x0+2,49+fd,'shirt',2)
    return C
# ---------------------------------------------------------------- SIDE
def build_side_A(fi,facing):
    b,near,far,sw=SF[fi]; mir=(facing=='L'); MX=(lambda x:(W-1-x)) if mir else (lambda x:x)
    def M(pts): return [(MX(x),y) for x,y in pts]
    def Em(cx,cy,rx,ry): return E(MX(cx),cy,rx,ry)
    def Lm(p0,p1,r0,r1): return limb((MX(p0[0]),p0[1]),(MX(p1[0]),p1[1]),r0,r1)
    oy=OY+b; f=Fig(); hip=(15.6,33.8+oy); lag=0.5*b
    def leg(kn,an,pose,dark):
        kn=(kn[0],kn[1]+OY); an=(an[0],an[1]+OY)
        f.add(Lm(kn,(an[0],an[1]+0.6),1.8,1.5),'pants',1.6,dark)
        sp=anim.shoe_pts(an[0],an[1]+0.6,pose); cxs=sum(x for x,_ in sp)/len(sp); cys=sum(y for _,y in sp)/len(sp)
        sp=[(cxs+(x-cxs)*0.84,cys+(y-cys)*0.9) for x,y in sp]
        f.add(P(M(sp)),'shoe',1.5,dark)
        f.add(Lm(hip,kn,2.3,1.8)|Lm(hip,(hip[0]+(kn[0]-hip[0])*.15,hip[1]+(kn[1]-hip[1])*.15),2.8,2.6),'pants',2.4,dark)
    # pelo largo por la espalda (se mece un poco al caminar)
    tr=-0.4-0.5*abs(sw)
    f.add(P(M([(9.0,8+oy),(16.0,7+oy),(15.6,14+oy),(14.4,20+oy),(14.0,29.6+oy+lag),(13.0,30.8+oy+lag),(12.0,29.8+oy+lag),(11.0+tr,31.0+oy+lag),(10.2+tr,29.4+oy+lag),(9.6+tr,21+oy),(8.6,13+oy)])),'hair',2.6,1)
    hxy=(15.0+sw*4.4,29.6-abs(sw)*0.8+oy)
    f.add(Lm((15.0,19.6+oy),(15.0+sw*2.2,25.0+oy),1.35,1.2)|Lm((15.0+sw*2.2,25.0+oy),hxy,1.2,1.0),'skin',1.3,1)
    f.add(Em(hxy[0],hxy[1]+1.0,1.3,1.6),'skin',1.1,1)
    leg(far[0],far[1],far[2],1)
    f.add(P(M([(14.4,13.5+oy),(17.4,13.5+oy),(17.8,18.5+oy),(14.2,18.5+oy)])),'skin',1.6)
    f.add(P(M([(12.8,17.4+oy),(18.4,17.4+oy),(19.0,19.6+oy),(12.4,19.6+oy)])),'skin',2.0)
    # blusa de perfil: espalda recta, busto suave, cintura
    f.add(P(M([(12.6,18.6+oy),(14.0,18.4+oy),(17.8,19.6+oy),(19.2,20.4+oy),(19.6,22.6+oy),(18.6,24.6+oy),(18.2,27.2+oy),(18.8,30.6+oy),(12.4,30.6+oy),(12.8,27.2+oy),(12.2,22+oy),(12.2,19.8+oy)])),'shirt',3.0)
    f.add(P(M([(12.4,29.4+oy),(18.8,29.4+oy),(19.8,33.4+oy),(19.2,36.6+oy),(11.4,36.8+oy),(11.0,33.4+oy)])),'pants',2.6)
    leg(near[0],near[1],near[2],0)
    f.add(Em(15.8,10.6+oy,6.0,5.7)|P(M([(15.8,11+oy),(21.3,10.6+oy),(21.9,13.2+oy),(20.6,15.8+oy),(17.6,16.6+oy),(15.2,16.0+oy)]))|Em(21.9,11.8+oy,1.0,1.0),'skin',3.0)
    f.add(Em(15.0,11.6+oy,1.1,1.6),'skin',1.0)
    # pelo hacia atrás, oreja descubierta
    cap=Em(15.2,8.6+oy,6.8,4.8)&(yy_<8.0+oy)
    backh=P(M([(9.0,7+oy),(15.4,6.6+oy),(14.6,8.6+oy),(13.8,10+oy),(13.6,14+oy),(14.0,18.6+oy),(12.4,19.4+oy+lag),(10.4,16+oy),(9.2,12+oy)]))
    front=P(M([(14.6,5.6+oy),(20.6,5.8+oy),(21.6,7.4+oy),(19.8,7.2+oy),(16.4,7.6+oy),(14.6,8.6+oy)]))
    f.add(cap|backh|front,'hair',2.6)
    s2=-sw; hxy2=(15.4+s2*4.4,29.6-abs(s2)*0.8+oy)
    f.add(Lm((15.4,19.4+oy),(15.4+s2*2.1,25.2+oy),1.35,1.2),'skin',1.4)
    f.add(Lm((15.4+s2*2.1,25.2+oy),hxy2,1.2,1.0),'skin',1.3)
    f.add(Em(hxy2[0],hxy2[1]+0.9,1.3,1.6),'skin',1.1)
    C=render_codes(f)
    hair_tex(C,crown=(MX(14.6),4.4+oy,5.0,1.8))
    p=Pt(C,0,oy,mir)
    # cara de perfil: aclarar la cara y calmar la oreja
    for y in range(6,17):
        for x in range(14,24):
            if p.ism(x,y,'skin'):
                X,Y=p._xy(x,y); c=C[Y,X]; k=c%7
                lo=3 if (x<16 or y>=16 or x>=22) else 4
                C[Y,X]=c-k+min(5,max(k,lo))
    for y in (10,11,12,13): p.mat(14,y,'skin',2) if p.ism(14,y,'skin') else None
    p.mat(15,11,'skin',3); p.mat(15,12,'skin',2); p.mat(16,12,'skin',3)
    p.fix(20,7,'brow'); p.fix(21,7,'brow'); p.shift(19,7,-2)
    p.fix(19,9,'lash'); p.fix(20,9,'lash'); p.fix(21,9,'lash')
    p.fix(19,10,'glint'); p.fix(20,10,'iris'); p.fix(20,11,'eye')
    p.mat(23,12,'skin',3); p.mat(22,13,'skin',2)
    p.fix(21,14,'lipD'); p.fix(22,14,'lips'); p.fix(21,15,'lips'); p.fix(22,15,'lipsH')
    p.fix(19,13,'blush')
    # tirante, cadenitas, arete, faja, pulsera
    p.mat(15,18,'shirt',3); p.mat(16,18,'shirt',3)
    p.mat(17,18,'acc',4); p.mat(18,20,'acc',3); p.fix(19,21,'pearl')
    p.mat(15,13,'acc',5); p.fix(15,14,'crys'); p.fix(15,15,'crysS')
    for x in range(12,19): p.shift(x,29,-1,'shirt')
    for x in range(12,20): p.fix(x,30,'belt')
    p.fix(17,30,'beltH')
    hx,hy=hxy2; p.mat(hx,hy-oy-1.4,'acc',5); p.mat(hx+1,hy-oy-1.4,'acc',3)
    sm=ismat(C,'shoe')
    for x in range(W):
        col=np.nonzero(sm[:,x])[0]
        if len(col): C[col[-1],x]=cfix('soleS')
    return C
def finalize(C):
    sk=ismat(C,'skin'); k=C%7; C[sk&(k>5)]-=1
    return C
DIRS=['front','back','L','R']
def bake():
    return [[finalize(build_fb(d,fi) if d in('front','back') else build_side_A(fi,d)) for fi in range(7)] for d in DIRS]
