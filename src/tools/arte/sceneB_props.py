from cv import *
from px import Img
def spr(w,h): return Img(w,h)
def poste():
    im=spr(44,186)
    for y in range(4,186):
        for x in range(19,25):
            c=['#e2dccc','#c8c0ae','#aea694','#a09886','#867e70','#6a6458'][x-19]
            im.px(x,y,c)
        if y%23==0: im.px(20,y,'#8a8270'); im.px(21,y,'#8a8270')
    for x in range(19,25): im.px(x,185,'#5a5448')
    # crossarm + insulators
    for x in range(2,42): im.px(x,10,'#7a5a3a'); im.px(x,11,'#5a3e28'); im.px(x,12,'#3e2a1c')
    for x in (4,13,31,40): im.px(x,8,'#e8eef0'); im.px(x,9,'#a8b4b8'); im.px(x,7,'#c8d0d4')
    # transformer
    for y in range(24,44):
        for x in range(25,35):
            c=['#b8bcbc','#a4a8a8','#909494','#7c8080','#6a6e6e','#5a5e5e','#4e5252','#464a4a','#3e4242','#363a3a'][x-25]
            im.px(x,y,c)
    for x in range(25,35): im.px(x,24,'#d0d4d4'); im.px(x,43,'#2a2e2e')
    im.px(27,22,'#3a3a3a'); im.px(27,23,'#3a3a3a'); im.px(32,22,'#3a3a3a'); im.px(32,23,'#3a3a3a')
    # street-light arm toward the street + sodium lamp head
    for t in range(16):
        im.px(24+t*0.55,46+t,'#4a4e4e'); im.px(25+t*0.55,46+t,'#2e3232')
    for y in range(60,66):
        for x in range(28,38): im.px(x,y,'#5a5e5e' if y<63 else '#3a3e3e')
    for x in range(29,37): im.px(x,66,'#d8c890')
    # number plate + posters stapled
    for y in range(120,126):
        for x in range(19,25): im.px(x,y,'#e8d040' if y<123 else '#2a2a2a')
    for y in range(92,104):
        for x in range(19,25): im.px(x,y,'#e0e4ea' if (y+x)%5 else '#c04040')
    return im
def basket():
    im=spr(16,40)
    for y in range(12,40): im.px(7,y,'#4a4a4a'); im.px(8,y,'#2e2e2e')
    for y in range(4,14):
        for x in range(1,15):
            mesh=(x+y)%3==0 or (x-y)%3==0
            if y==4 or y==13 or x in (1,14) or mesh: im.px(x,y,'#3a3a3c' if x>7 else '#5a5a5e')
    for y in range(0,6):
        for x in range(3,13):
            if (x-8)**2/25+(y-4)**2/9<1: im.px(x,y,'#26262a' if x>7 else '#3e3e46')
    im.px(5,1,'#5e5e6a'); im.px(6,1,'#5e5e6a')
    return im
def bench():
    im=spr(50,22)
    WD=['#4a2e1e','#6e4428','#8e5a34','#a87040','#c48a52']
    for x in range(0,50):     # backrest slats
        for j,y in enumerate((1,2,5,6)):
            im.px(x,y,WD[3] if y in(1,5) else WD[2])
        for y in (11,12,14,15,17,18):   # seat slats (top view)
            im.px(x,y,WD[4] if y in(11,14,17) else WD[3])
    for x in (0,49): 
        for y in range(1,19): im.px(x,y,WD[1])
    for lx in (4,42):          # concrete legs
        for y in range(0,22):
            for x in range(lx,lx+5): 
                if y in (3,4,7,8,9,10,13,16,19,20,21) or y<1: im.px(x,y,['#d8d2c4','#c4bcac','#aaa292','#968e80','#7e776a'][x-lx])
    return im
def chair():
    im=spr(14,22)
    W_=['#a8aab0','#c4c6cc','#dcdee2','#eeeff2','#fafafa']
    for y in range(0,9):
        for x in range(2,12):
            if not(y==0 and x in(2,11)): im.px(x,y,W_[3] if x<7 else W_[2])
    for x in (4,6,8,10): 
        for y in range(2,7): im.px(x,y,W_[1])
    for y in range(9,15):
        for x in range(1,13): im.px(x,y,W_[4] if y<11 else W_[3])
    for x in (1,2,11,12):
        for y in range(15,22): im.px(x,y,W_[2] if x<6 else W_[0])
    return im
def table():
    im=spr(30,22)
    for y in range(0,10):
        for x in range(0,30):
            if ((x-14.5)/15)**2+((y-4.5)/5)**2<1: im.px(x,y,'#f6f6f4' if y<6 else '#dcdcdc')
    for x in range(3,27): im.px(x,9,'#b8b8bc')
    for lx in (5,23):
        for y in range(9,22): im.px(lx,y,'#d0d0d4'); im.px(lx+1,y,'#a8a8ae')
    # plate of casado + glass
    for y in range(2,6):
        for x in range(6,14):
            if ((x-9.5)/4)**2+((y-3.5)/2)**2<1: im.px(x,y,'#ffffff')
    im.px(8,3,'#3a2a1a'); im.px(9,3,'#3a2a1a'); im.px(10,4,'#f0e8d0'); im.px(11,4,'#f0e8d0'); im.px(9,4,'#d8a040'); im.px(11,3,'#5aa040')
    for y in range(1,6): im.px(19,y,'#e88a3a'); im.px(20,y,'#f0a050')
    return im
def easel():
    im=spr(22,30)
    for y in range(2,30): im.px(3+(y//10),y,'#6a4a30'); im.px(18-(y//10),y,'#6a4a30')
    for y in range(0,18):
        for x in range(1,21): im.px(x,y,'#2a302c' if 0<x<20 and 0<y<17 else '#8a6440')
    return im
def easel_text(cv,ox,oy):
    text(cv,ox+3,oy+3,'CASADO',(232,232,220),font=F3)
    text(cv,ox+5,oy+10,'¢2500',(232,210,120),font=F3)
def crates():
    im=spr(18,26)
    for k,(oy,c) in enumerate(((14,'#c83030'),(4,'#e8b020'))):
        for y in range(oy,oy+12):
            for x in range(0,18):
                cc=C(c)*(1.1 if x<3 else 0.8 if x>14 else 1.0)
                if y in(oy,oy+11) or x in(0,17) or (y-oy)%4==0: cc=cc*0.75
                im.px(x,y,tuple(int(v) for v in np.clip(cc,0,255)))
        for x in range(2,17,3): im.px(x,oy+1,'#3a6a3a'); im.px(x,oy+2,'#5a8a4a')  # bottle caps
    return im
def gas():
    im=spr(10,20)
    for y in range(3,20):
        for x in range(0,10):
            im.px(x,y,['#e0e8ec','#c8d2d8','#b4bec6','#a0aab2','#8e98a0','#7e8890','#6e7880','#626c74','#58626a','#4e5860'][x])
    for x in range(3,7): im.px(x,0,'#5a5a5a'); im.px(x,1,'#7a7a7a'); im.px(x,2,'#5a5a5a')
    for x in range(0,10): im.px(x,8,'#c84040')
    return im
def mango_fallen(cv,x,y):
    cv.px(x,y,'#f0b040'); cv.px(x+1,y,'#e88a30'); cv.px(x+2,y,'#c85a28'); cv.px(x,y+1,'#d8902e'); cv.px(x+1,y+1,'#b85428')
def cables(cv,px_=386):
    # wires from crossarm to off-screen poles; with faint shadows on roofs/walls
    def wire(x0,y0,x1,y1,sag,col='#1a1818',sh=True):
        n=int(abs(x1-x0))+1
        for i in range(n):
            t=i/(n-1); x=x0+(x1-x0)*t; y=y0+(y1-y0)*t+sag*4*t*(1-t)
            if sh: cv.mul(x+5,y+7,1,1,(0.78,0.78,0.85))
            cv.px(x,y,col)
    for (ax,ay,s) in ((px_-17,8,10),(px_-8,8,12),(px_+10,8,11),(px_+19,8,9)):
        wire(ax,ay,-260 if ax<px_ else 900,2,14+s)
    wire(px_-15,13,px_-200,12,7,'#2a2626'); wire(px_+12,13,px_+220,12,6,'#2a2626')
    wire(px_-6,40,326,40,5); wire(px_+6,40,470,36,4)   # service drops to houses
    # sneakers hanging on the wire (tenis colgando)
    x0,x1=px_-17,-260; t=(x0-150)/(x0-x1); y=8+(2-8)*t+(14+10)*4*t*(1-t)
    for k,c in ((0,'#f2f2f2'),(5,'#d84040')):
        for j in range(5): cv.px(150+k,int(y)+1+j,'#d0d0d0')
        for j in range(3):
            for i in range(3): cv.px(149+k+i,int(y)+6+j,c)
        cv.px(152+k,int(y)+8,'#3a3a3a')
def farola():
    im=spr(20,84)
    for y in range(14,84):
        for x in range(8,12): im.px(x,y,['#5a5e5a','#3e423e','#2c302c','#222622'][x-8])
    for y in range(78,84):
        for x in range(6,14): im.px(x,y,'#3a3e3a' if x>9 else '#5a5e5a')
    for y in range(2,14):           # lantern
        w=4 if y<5 else 6
        for x in range(10-w,10+w):
            im.px(x,y,'#f6e2a8' if 4<y<12 and abs(x-10)<w-1 else '#2c302c')
    for x in range(5,15): im.px(x,1,'#2c302c'); im.px(x,0,'#3e423e')
    return im
def bin_():
    im=spr(14,20)
    for y in range(2,20):
        for x in range(0,14):
            c=['#6aa060','#5a9050','#4e8446','#447a3e','#3c7036','#36682f','#30602a','#2c5826','#285222','#244c1f','#20461c','#1c4018','#183a15','#143412'][x]
            if (y-2)%6==0: c='#1e3a18'
            im.px(x,y,c)
    for x in range(0,14): im.px(x,1,'#2a2a2a'); im.px(x,2,'#4a4a4a')
    return im

def bike():
    im=spr(40,26)
    def wheel(cx,cy):
        for a in range(0,360,6):
            r=math.radians(a); im.px(cx+math.cos(r)*8.5,cy+math.sin(r)*8.5,'#1e1e22'); im.px(cx+math.cos(r)*7.6,cy+math.sin(r)*7.6,'#3a3a40')
        for a in range(0,360,45):
            r=math.radians(a)
            for t in range(1,7): im.px(cx+math.cos(r)*t,cy+math.sin(r)*t,'#9a9aa4')
        im.px(cx,cy,'#c8c8d0')
    wheel(9,16); wheel(30,16)
    def line(a,b,c,w=1):
        n=int(max(abs(b[0]-a[0]),abs(b[1]-a[1])))+1
        for i in range(n+1):
            t=i/n; x=a[0]+(b[0]-a[0])*t; y=a[1]+(b[1]-a[1])*t
            for k in range(w): im.px(x,y+k,c)
    R='#c0302a'
    line((9,16),(16,8),R,2); line((16,8),(27,8),R,2); line((16,8),(19,16),R,2); line((19,16),(9,16),R); line((27,8),(30,16),R,2); line((19,16),(27,8),R,2)
    line((15,8),(14,4),'#2a2a2a'); line((12,3),(18,3),'#2a2a2a',2)     # seat
    line((27,8),(26,3),'#8a8a92'); line((23,2),(30,2),'#2a2a2a',2)     # handlebar
    for x in range(17,22): im.px(x,17,'#5a5a60')
    return im
def umbrella():
    im=spr(60,30)
    cx,cy,rx,ry=30,12,28,10
    base=np.array([36,138,140],float)
    for y in range(0,24):
        for x in range(0,60):
            u=(x-cx)/rx; v=(y-cy)/ry
            if u*u+v*v<1:
                ang=math.atan2(v,u); seg=int(((ang+math.pi)/(2*math.pi))*8)
                lit=-(u*0.7+v*0.7)
                f=0.78+0.32*lit+(0.06 if seg%2 else -0.04)
                c=np.clip(base*f+(f>1.05)*np.array([30,40,30]),0,255)
                im.px(x,y,tuple(int(k) for k in c))
    for a in range(8):     # ribs
        r=a*math.pi/4
        for t in range(2,26):
            x=cx+math.cos(r)*t*rx/28; y=cy+math.sin(r)*t*ry/28
            if ((x-cx)/rx)**2+((y-cy)/ry)**2<0.98: im.px(x,y,(20,90,96,255))
    for x in range(2,58):   # scalloped rim
        u=(x-cx)/rx; y=cy+ry*math.sqrt(max(0,1-u*u))
        im.px(x,y,(18,80,84,255)); im.px(x,y-1,(24,104,108,255))
    im.px(cx,cy-1,'#d8d8d8'); im.px(cx,cy-2,'#a0a0a0')
    return im
