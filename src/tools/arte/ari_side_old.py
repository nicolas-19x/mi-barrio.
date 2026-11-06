# ---------------------------------------------------------------- SIDE
def build_side_A(fi,facing):
    b,near,far,sw=SF[fi]; mir=(facing=='L'); MX=(lambda x:(W-1-x)) if mir else (lambda x:x)
    def M(pts): return [(MX(x),y) for x,y in pts]
    def Em(cx,cy,rx,ry): return E(MX(cx),cy,rx,ry)
    def Lm(p0,p1,r0,r1): return limb((MX(p0[0]),p0[1]),(MX(p1[0]),p1[1]),r0,r1)
    oy=OY+b; f=Fig(); hip=(15.6,33.8+oy); lag=0.6*b
    def leg(kn,an,pose,dark):
        kn=(kn[0],kn[1]+OY); an=(an[0],an[1]+OY)
        f.add(Lm(kn,(an[0],an[1]+0.6),2.0,1.6),'pants',1.6,dark)
        sp=anim.shoe_pts(an[0],an[1]+0.6,pose); cxs=sum(x for x,_ in sp)/len(sp); cys=sum(y for _,y in sp)/len(sp)
        sp=[(cxs+(x-cxs)*0.86,cys+(y-cys)*0.9) for x,y in sp]
        f.add(P(M(sp)),'shoe',1.5,dark)
        f.add(Lm(hip,kn,2.5,2.0)|Lm(hip,(hip[0]+(kn[0]-hip[0])*.15,hip[1]+(kn[1]-hip[1])*.15),3.0,2.8),'pants',2.4,dark)
        return an
    # pelo de atrás (cae por la espalda y se mece)
    tr=-0.5-0.6*abs(sw)
    f.add(P(M([(8.6,8+oy),(16.2,7+oy),(16.4,14+oy),(14.6,20+oy),(13.6,27+oy+lag),(12.6,29.6+oy+lag),(11.4,28.4+oy+lag),(10.2+tr,30.2+oy+lag),(9.0+tr,27.6+oy+lag),(8.0+tr,21+oy),(7.8,13+oy)])),'hair',2.8,1)
    hxy=(15.0+sw*4.6,30.0-abs(sw)*0.8+oy)
    f.add(Lm((15.0,20.5+oy),(15.0+sw*2.4,25.6+oy),1.5,1.4)|Lm((15.0+sw*2.4,25.6+oy),hxy,1.4,1.2),'skin',1.4,1)
    f.add(Em(hxy[0],hxy[1]+1.0,1.5,1.7),'skin',1.1,1)
    leg(far[0],far[1],far[2],1)
    f.add(P(M([(14.0,13.5+oy),(17.6,13.5+oy),(18.0,18.5+oy),(13.8,18.5+oy)])),'skin',1.6)
    # torso de perfil: espalda recta, busto suave, cintura
    f.add(P(M([(12.4,17.4+oy),(18.6,17.4+oy),(19.6,19.6+oy),(20.2,22.4+oy),(19.2,24.6+oy),(18.6,27.2+oy),(19.2,30.6+oy),(12.0,30.6+oy),(12.6,27.2+oy),(11.8,22+oy),(11.6,19.6+oy)])),'shirt',3.2)
    f.add(P(M([(12.0,29.4+oy),(19.2,29.4+oy),(20.2,33.4+oy),(19.6,36.6+oy),(11.0,36.8+oy),(10.6,33.4+oy)])),'pants',2.6)
    leg(near[0],near[1],near[2],0)
    f.add(Em(15.8,10.6+oy,6.1,5.7)|P(M([(15.8,11+oy),(21.4,10.6+oy),(22.0,13.2+oy),(20.6,15.8+oy),(17.6,16.6+oy),(15.2,16.0+oy)]))|Em(22.0,11.8+oy,1.1,1.0),'skin',3.0)
    f.add(Em(14.8,11.6+oy,1.2,1.7),'skin',1.0)
    # pelo de la cabeza (frente y costado, tapa la oreja)
    yy=yy_
    cap=Em(15.4,8.6+oy,7.0,5.0)&(yy<9.4+oy)
    backh=P(M([(8.8,7+oy),(16.6,7+oy),(16.8,10+oy),(16.4,15+oy),(15.2,19.6+oy),(13.0,20.2+oy+lag),(11.0,18+oy),(9.4,13+oy)]))
    bang=P(M([(18.6,5.4+oy),(22.6,7.4+oy),(22.2,9.4+oy),(21.0,8.6+oy),(19.6,9.6+oy),(18.4,9.0+oy)]))
    f.add(cap|backh|bang,'hair',2.8)
    s2=-sw; hxy2=(15.4+s2*4.6,30.0-abs(s2)*0.8+oy)
    f.add(Lm((15.4,20.5+oy),(15.4+s2*2.3,25.8+oy),1.4,1.3),'skin',1.4)
    f.add(Lm((15.4+s2*2.3,25.8+oy),hxy2,1.3,1.2),'skin',1.3)
    f.add(Em(hxy2[0],hxy2[1]+0.9,1.5,1.7),'skin',1.1)
    f.add(P(M([(13.0,17.6+oy),(17.6,17.6+oy),(18.0,22.2+oy),(12.8,22.2+oy)])),'shirt',2.0)
    C=render_codes(f)
    hair_tex(C)
    p=Pt(C,0,oy,mir)
    # cara de perfil
    p.mat(20,8,'hair',1); p.mat(21,8,'hair',1)
    p.fix(20,9,'lash'); p.fix(21,9,'lash'); p.fix(22,9,'lash')
    p.fix(20,10,'glint'); p.fix(21,10,'iris'); p.fix(20,11,'iris'); p.fix(21,11,'eye')
    p.shift(22,12,1); p.shift(21,13,-1)
    p.fix(21,14,'lips'); p.fix(20,14,'lipD'); p.fix(21,15,'lipsH')
    p.fix(19,13,'blush'); p.fix(18,13,'blush')
    for x in range(15,19): p.shift(x,17,-2,'skin')
    # cadenita, argolla, faja, pulsera
    for x in (17,18,19): p.mat(x,18 if x<19 else 19,'acc',4)
    p.mat(15,14,'acc',6); p.mat(14,15,'acc',4); p.mat(16,15,'acc',4); p.mat(15,16,'acc',3)
    for x in range(11,20): p.fix(x,30,'belt')
    p.fix(18,30,'beltH')
    for x in range(12,20): p.shift(x,29,-1,'shirt')
    hx,hy=hxy2; p.mat(int(round(hx)),int(round(hy-oy-1.6)),'acc',5); p.mat(int(round(hx))+1,int(round(hy-oy-1.6)),'acc',3)
    # tenis: suela y rayita
    for an in ():
        pass
    sm=ismat(C,'shoe')
    for x in range(W):
        col=np.nonzero(sm[:,x])[0]
        if len(col): C[col[-1],x]=cfix('soleS')
    return C
DIRS=['front','back','L','R']
def bake():
    out=[]
    for d in DIRS:
        row=[]
        for fi in range(7):
            row.append(build_fb(d,fi) if d in('front','back') else build_side_A(fi,d))
        out.append(row)
    return out
