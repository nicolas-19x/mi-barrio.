from cv import *
from sceneB_ground import W,H,FAC,CURB
R=random.Random(3)
EMIT=[]   # (name,x,y,w,h) glass / interiors that glow at night
def zinc(cv,x0,x1,y0,y1,base,rust=0.3,seed=0):
    rng=random.Random(seed); b=C(base)
    for y in range(y0,y1):
        for x in range(x0,x1):
            k=(x-x0)%5
            f=[1.10,1.02,0.92,0.80,0.95][k]
            sheet=((y-y0)//14)
            c=b*f*(1-0.05*sheet)+np.random.default_rng(x*977+y).integers(-4,5)
            cv.a[y,x]=c
        if (y-y0)%14==0 and y>y0: cv.rect(x0,y,x1-x0,1,b*0.65)
    # rust streaks running down slope
    for i in range(int((x1-x0)*rust/4)):
        x=rng.randint(x0,x1-2); y=rng.randint(y0,y1-6); L=rng.randint(4,14)
        for t in range(L):
            if y+t<y1: cv.px(x,y+t,'#8a4a24',0.55*(1-t/L)+0.15); cv.px(x+1,y+t,'#a85a2a',0.35*(1-t/L))
    for i in range(int((x1-x0)/40)):   # patched sheet / rocks holding roof
        x=rng.randint(x0+4,x1-8); y=rng.randint(y0+2,y1-6)
        cv.rect(x,y,4,3,'#6a6460'); cv.rect(x,y,4,1,'#8e8884'); cv.rect(x+1,y+3,4,1,'#2a2624',0.5)
def teja(cv,x0,x1,y0,y1):
    for y in range(y0,y1):
        for x in range(x0,x1):
            row=(y-y0)//5; ox=(row%2)*4
            u=((x-x0+ox)%8)/8.0; v=((y-y0)%5)/5.0
            base=C('#b8583a')*(0.98-row*0.012)
            f=0.82+0.35*math.sin(u*math.pi)   # rounded tile
            if v>0.8: f*=0.62
            c=base*f+np.random.default_rng(x*31+y*7).integers(-6,7)
            if (x*13+y*7)%53==0: c=C('#5e6a3a')   # moss
            cv.a[y,x]=c
def eave_shadow(cv,x0,x1,y,depth=6,strength=0.55):
    for d in range(depth):
        f=1-strength*(1-d/depth)
        cv.mul(x0,y+d,x1-x0,1,(f,f*1.01,f*1.1))
def wall(cv,x0,x1,y0,y1,base,seed):
    cv.noise(x0,y0,x1-x0,y1-y0,base,var=4,seed=seed)
    rng=random.Random(seed)
    for i in range((x1-x0)*(y1-y0)//400):   # plaster blotches
        x=rng.randint(x0,x1); y=rng.randint(y0,y1); r=rng.randint(2,6); f=rng.choice((0.94,0.96,1.04))
        for dy in range(-r,r+1):
            for dx in range(-r,r+1):
                if dx*dx+dy*dy<r*r and rng.random()<0.8 and x0<=x+dx<x1 and y0<=y+dy<y1: cv.a[y+dy,x+dx]*=f
def drip(cv,x0,w,y0,L,f=0.85,seed=0):
    rng=random.Random(seed)
    for x in range(x0,x0+w):
        l=int(L*rng.uniform(0.3,1.0))
        for t in range(l): cv.mul(x,y0+t,1,1,[1-(1-f)*(1-t/l)]*3)
def grime(cv,x0,x1,y1,h=10):
    for d in range(h):
        f=0.70+0.30*(d/h)
        cv.mul(x0,y1-1-d,x1-x0,1,(f,f*0.98,f*0.95))
    rng=random.Random(x0)
    for i in range((x1-x0)//3):   # mud splashes
        cv.px(rng.randint(x0,x1),y1-rng.randint(1,12),'#5a4a3a',0.4)
def celosia(cv,x,y,w,h,frame='#e8e2d4',bars=True):
    EMIT.append(('win%d'%x,x,y,w,h))
    cv.rect(x-2,y-2,w+4,h+4,frame); cv.rect(x-2,y+h+2,w+4,2,'#cfc6b2')  # frame + sill
    cv.mul(x-2,y+h+4,w+4,2,(0.75,0.75,0.8))
    for j in range(h):
        k=j%3
        c=['#f2c890','#c89a70','#5a5260'][k] if j<h*0.6 else ['#d8a880','#a07a62','#463e48'][k]
        cv.rect(x,y+j,w,1,c)
    cv.rect(x+w//2,y,1,h,frame)
    if bars:
        for bx in range(x+2,x+w,4): cv.rect(bx,y-1,1,h+2,'#26221f')
        cv.rect(x,y+h//2,w,1,'#26221f')
    drip(cv,x-1,w+2,y+h+6,10,0.86,seed=x)
def door(cv,x,y,w,h,c,dark):
    cv.rect(x-2,y-2,w+4,h+2,'#ddd5c4')
    cv.noise(x,y,w,h,c,var=3,seed=x)
    for j in range(y+4,y+h-2,10): cv.rect(x+2,j,w-4,7,np.array(C(c))*0.85); cv.rect(x+2,j,w-4,1,np.array(C(c))*1.1)
    cv.rect(x+w-4,y+h//2,2,2,'#e0c060')
    cv.rect(x,y,w,1,dark)
def pulperia(cv,x0=0,x1=196):
    zinc(cv,x0,x1,0,30,'#9a9a98',rust=0.6,seed=1)
    wall(cv,x0,x1,30,150,'#94c2aa',seed=2)
    cv.noise(x0,124,x1-x0,26,'#3f705c',var=3,seed=21)            # zocalo
    cv.rect(x0,124,x1-x0,1,'#2e5444')
    eave_shadow(cv,x0,x1,30,7,0.6); cv.rect(x0,30,x1-x0,2,'#3a3a3a')
    celosia(cv,24,44,28,24); celosia(cv,120,44,28,24)
    # flowerpot on sill
    cv.rect(124,64,10,5,'#b05a34'); cv.rect(125,59,8,5,'#4a7a38'); cv.px(127,58,'#e04848'); cv.px(130,58,'#f0c040')
    # painted sign band
    cv.noise(6,82,x1-12,16,'#efe4c8',var=3,seed=3); cv.rect(6,82,x1-12,1,'#c8bca0'); cv.rect(6,97,x1-12,1,'#b8ac90')
    s='PULPERIA LA BENDICION'; tw=twidth(s); tx=x0+(x1-x0-tw)//2
    text(cv,tx,87,s,'#c0302a',acc=(6,18),shadow='#8a7a62')
    cv.rect(x0+10,84,3,2,'#2a5a9a'); cv.rect(x1-14,84,3,2,'#2a5a9a')
    drip(cv,8,x1-16,98,8,0.9,seed=4)
    eave_shadow(cv,6,x1-6,98,3,0.3)
    # door (metal, green) left
    cv.rect(10,104,30,46,'#ddd5c4'); cv.noise(12,106,26,44,'#2e5a48',var=3,seed=5)
    for j in range(108,148,4): cv.rect(13,j,24,1,'#244a3a')
    cv.rect(33,126,2,3,'#d0b050')
    # counter opening with bars
    ox,oy,ow,oh=50,104,138,34
    EMIT.append(('pulperia',ox,oy,ow,oh-6))
    cv.rect(ox-2,oy-2,ow+4,oh+4,'#ddd5c4')
    cv.noise(ox,oy,ow,oh,'#2c2420',var=3,seed=6)
    rng=random.Random(9)
    pal=['#d03a30','#f0c030','#3070c0','#40a050','#f08030','#e8e0d0','#a040a0','#c0a070','#60c0d0']
    for sy in (oy+3,oy+12,oy+21):         # shelves with goods
        cv.rect(ox+2,sy+7,ow-4,1,'#6a4a30')
        x=ox+3
        while x<ox+ow-6:
            w=rng.randint(2,4); h=rng.randint(3,6); c=rng.choice(pal)
            cv.rect(x,sy+7-h,w,h,c); cv.rect(x,sy+7-h,1,h,np.clip(C(c)*1.25,0,255)); cv.rect(x+w-1,sy+7-h,1,h,C(c)*0.7)
            x+=w+rng.randint(0,2)
    # hanging snack bags on string
    cv.rect(ox+4,oy+1,ow-8,1,'#8a8070')
    for i,x in enumerate(range(ox+6,ox+ow-8,9)):
        c=pal[i%len(pal)]; cv.rect(x,oy+2,5,7,c); cv.rect(x,oy+2,5,1,'#e8e0d0'); cv.rect(x+4,oy+3,1,6,C(c)*0.7)
    return (ox,oy,ow,oh)
def pulperia_front(cv,ox,oy,ow,oh):
    # counter ledge + bars drawn over Dona Rosa
    cv.noise(ox-2,oy+oh-6,ow+4,6,'#b08a5a',var=4,seed=7); cv.rect(ox-2,oy+oh-6,ow+4,1,'#d8b07a'); cv.rect(ox-2,oy+oh,ow+4,1,'#5a3a22')
    cv.mul(ox-2,oy+oh+1,ow+4,3,(0.7,0.7,0.75))
    for bx in range(ox+3,ox+ow,6):
        if 100<=bx<=126: continue   # ventanilla
        cv.rect(bx,oy-1,1,oh-6,'#1c1a18'); cv.px(bx+1,oy+2,'#5a5652')
    cv.rect(ox,oy+8,ow,1,'#1c1a18'); cv.rect(100,oy+8,27,1,'#2c2420')
    cv.rect(98,oy-1,2,oh-6,'#1c1a18'); cv.rect(127,oy-1,2,oh-6,'#1c1a18')
    # goods on counter: candy jar, bread
    cv.rect(140,oy+oh-13,7,7,'#a8c8d0'); cv.rect(141,oy+oh-12,5,5,'#e86a6a'); cv.px(142,oy+oh-11,'#f0d040'); cv.px(144,oy+oh-10,'#60b060'); cv.rect(140,oy+oh-14,7,1,'#d0d0d0')
    cv.rect(156,oy+oh-10,12,4,'#d8a860'); cv.rect(156,oy+oh-10,12,1,'#f0d090')
    grime(cv,0,196,150,12)
def ariana(cv,x0=196,x1=388):
    teja(cv,x0,x1,0,28)
    cv.rect(x0,28,x1-x0,3,'#f2ece0'); 
    wall(cv,x0,x1,31,150,'#e7a3b4',seed=11)
    eave_shadow(cv,x0,x1,31,8,0.55)
    # upper: balcony door with curtains + railing
    EMIT.append(('balcon',256,42,72,44)); cv.rect(254,40,76,48,'#f2ece0'); cv.noise(256,42,72,44,'#3a3040',var=2,seed=12)
    cv.noise(258,44,30,42,'#f0dca0',var=3,seed=13); cv.noise(296,44,30,42,'#f0dca0',var=3,seed=14)  # curtains
    for x in range(258,326,4): cv.rect(x,44,1,42,'#d8c088')
    cv.rect(291,42,2,44,'#f2ece0')
    celosia(cv,212,46,26,22,frame='#f2ece0'); celosia(cv,346,46,26,22,frame='#f2ece0')
    # balcony slab + wrought-iron railing (curls)
    cv.noise(246,86,92,5,'#ece6da',var=3,seed=15); cv.rect(246,91,92,2,'#b8aca0')
    eave_shadow(cv,246,338,93,6,0.5)
    for x in range(248,337,6):
        cv.rect(x,66,1,20,'#1e1a1c')
        cv.px(x+1,70,'#1e1a1c'); cv.px(x+2,71,'#1e1a1c'); cv.px(x+2,72,'#1e1a1c'); cv.px(x+1,73,'#1e1a1c')
    cv.rect(246,65,92,2,'#1e1a1c'); cv.rect(246,65,92,1,'#4a4446'); cv.rect(246,84,92,1,'#1e1a1c')
    # ground floor: window with reja, door, garage gate
    EMIT.append(('ventana_ari',216,106,36,26)); cv.rect(214,104,40,30,'#f2ece0'); cv.noise(216,106,36,26,'#4a4050',var=2,seed=16)
    cv.noise(216,106,36,12,'#c8a088',var=4,seed=17)  # reflected sunset
    for x in range(218,252,5): cv.rect(x,104,1,30,'#1e1a1c')
    for y in (110,122): cv.rect(214,y,40,1,'#1e1a1c')
    for x in range(220,252,10):   # diamond motif
        cv.px(x+2,115,'#1e1a1c'); cv.px(x+1,116,'#1e1a1c'); cv.px(x+3,116,'#1e1a1c'); cv.px(x+2,117,'#1e1a1c')
    cv.rect(212,134,44,2,'#d6ccbc'); drip(cv,213,42,136,9,0.86,seed=18)
    door(cv,272,104,24,46,'#7a4a2e','#3a2216')
    cv.rect(278,96,12,5,'#2a4a8a'); text(cv,280,96,'28' if False else '',  '#fff')
    cv.rect(279,97,10,3,'#e8e8f0'); cv.px(281,98,'#2a4a8a'); cv.px(283,98,'#2a4a8a'); cv.px(286,98,'#2a4a8a')
    # garage gate (black iron + sheet)
    gx=310; cv.rect(gx,100,72,50,'#24201f')
    for x in range(gx+2,gx+72,4): cv.rect(x,102,2,46,'#3a3434'); cv.rect(x,102,1,46,'#4e4646')
    cv.rect(gx,100,72,2,'#141212'); cv.rect(gx,124,72,2,'#141212'); cv.rect(gx+35,100,2,50,'#141212')
    for x in range(gx+4,gx+70,8): cv.px(x,99,'#24201f'); cv.px(x,98,'#24201f')   # spear tips
    grime(cv,x0,x1,150,10)
    # wall lamp
    cv.rect(300,104,4,6,'#2a2624'); cv.rect(301,106,2,3,'#f8e0a0')
def veranera(cv,seed=21):
    # bougainvillea mass climbing left side & over balcony railing
    rng=random.Random(seed)
    stems=[(204,150),(206,150)]
    for x,y in [(200,148),(203,120),(206,98),(214,84),(230,70),(250,64),(276,62),(300,64),(322,62),(338,68)]:
        pass
    pts=[]
    path=[(203,150),(204,128),(207,110),(212,96),(222,84),(238,74),(256,66),(280,63),(305,64),(330,64),(344,72),(348,84)]
    for (ax,ay),(bx,by) in zip(path,path[1:]):
        for t in range(12): pts.append((ax+(bx-ax)*t/12,ay+(by-ay)*t/12))
    # trunk
    for x,y in pts[:30]: cv.px(x,y,'#4a3424'); cv.px(x+1,y,'#6a4a32')
    blobs=[]
    for x,y in pts:
        for k in range(4):
            blobs.append((x+rng.gauss(0,7),y+rng.gauss(0,6)-2))
    blobs+= [(rng.uniform(200,236),rng.uniform(96,150)) for _ in range(40)]
    blobs+= [(rng.uniform(296,350),rng.uniform(64,96)) for _ in range(30)]   # spill over railing
    blobs.sort(key=lambda p:p[1])
    MAG=['#5a1640','#7e1e56','#a8286e','#cc3a86','#e45ea0','#f28cbc']
    LF=['#1e3a22','#2c5230','#3e6a38','#5a8640']
    for bx,by in blobs:
        leafy=rng.random()<0.5
        r=rng.uniform(1.6,2.8)
        for dy in range(-4,5):
            for dx in range(-4,5):
                d=(dx*dx+dy*dy)/(r*r)
                if d<1:
                    lit=-(dx+dy)/(2*r)    # light from upper-left
                    if leafy: k=int(np.clip(1.5+lit*2.2+rng.uniform(-0.4,0.4),0,3)); c=LF[k]
                    else: k=int(np.clip(3+lit*2.6+rng.uniform(-0.5,0.5),0,5)); c=MAG[k]
                    cv.px(bx+dx,by+dy,c)
    # fallen petals on sidewalk
    for i in range(30): cv.px(rng.uniform(196,280),rng.uniform(152,182),rng.choice(MAG[2:]))
    cv.rect(198,140,22,10,'#8a5a3a'); cv.rect(198,140,22,1,'#b07a52')   # planter
def soda(cv,x0=388,x1=576):
    zinc(cv,x0,x1,0,30,'#b04a3a',rust=0.4,seed=31)
    wall(cv,x0,x1,30,150,'#e4b858',seed=32)
    eave_shadow(cv,x0,x1,30,7,0.6); cv.rect(x0,30,x1-x0,2,'#3a2a2a')
    celosia(cv,410,44,28,22,frame='#f4ecd8'); celosia(cv,500,44,28,22,frame='#f4ecd8',bars=False)
    # clothesline with laundry between windows
    cv.rect(446,42,48,1,'#4a4440')
    for x,c,w,h in ((449,'#d84a4a',8,11),(460,'#f0f0f0',7,9),(470,'#3a6ac0',9,13),(482,'#f0d040',7,8)):
        cv.rect(x,43,w,h,c); cv.rect(x+w-1,43,1,h,C(c)*0.75); cv.rect(x,43,w,1,C(c)*1.15)
    # sign band
    cv.noise(396,76,172,16,'#f4f0e4',var=3,seed=33); cv.rect(396,91,172,1,'#b8b0a0')
    s='SODA EL CAFETAL'; tx=x0+(x1-x0-twidth(s))//2
    text(cv,tx,80,s,'#2a7a4a',shadow='#9a9a8a')
    for k,x in enumerate((400,560)): cv.rect(x,80,4,7,'#6a3a1e'); cv.rect(x,78,4,2,'#3a8a3a')   # coffee cherry deco
    drip(cv,398,168,92,6,0.9,seed=34)
    # open front (seen beneath awning)
    cv.noise(396,100,172,50,'#3a2c24',var=3,seed=35)
    cv.noise(400,124,120,10,'#8a5a36',var=3,seed=36); cv.rect(400,124,120,1,'#c08a58')   # counter
    for x in (412,436,460,484): cv.rect(x,134,2,10,'#3a3a3a'); cv.rect(x-3,132,8,2,'#c03a30')  # stools
    cv.rect(530,104,30,40,'#d8dce0'); cv.rect(531,105,28,18,'#e8ecf0'); cv.rect(531,124,28,19,'#c8ccd0'); cv.rect(556,112,2,8,'#8a8a8a')  # fridge
    grime(cv,x0,x1,150,10)
def toldo(cv,x0=392,x1=572,y0=98,y1=142):
    # awning plane seen from above, sloping toward street; stripes + scallops
    for y in range(y0,y1):
        t=(y-y0)/(y1-y0)
        for x in range(x0,x1):
            st=((x-x0)//10)%2
            c=C('#c8342e') if st==0 else C('#f2e6cc')
            f=1.08-0.18*t
            if (x-x0)%10==0: f*=0.85
            cv.a[y,x]=c*f+np.random.default_rng(x*7+y*13).integers(-4,5)
    cv.rect(x0,y0,x1-x0,2,'#5a3a2a')
    for x in range(x0,x1):  # scalloped valance
        st=((x-x0)//10)%2; u=((x-x0)%10)/10
        L=4+int(3*math.sin(u*math.pi))
        for j in range(L):
            c=C('#a82a26') if st==0 else C('#d8ccb0')
            cv.a[y1+j,x]=c*(0.9-0.05*j)
    for x in range(x0,x1,30): cv.rect(x,y0+2,1,y1-y0-2,'#6a4a3a',0.35)   # frame ribs
