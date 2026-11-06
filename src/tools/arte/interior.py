from cv import *
from px import Img
from charsB import person,ALEX,ARIANA
W,H=576,320
RX0,RX1=64,512          # room outer bounds (14 tiles)
CAP=6; WALL1=70; FLOOR1=290; DOORX=288
def shade(c,f): return np.clip(C(c)*f,0,255)
def floor_mosaic(cv):
    rng=random.Random(2)
    T=32
    for y in range(WALL1,FLOOR1):
        for x in range(RX0,RX1):
            u=((x-RX0)%T)/T*2-1; v=((y-WALL1)%T)/T*2-1
            base=C('#e2d6be')
            d1=abs(u)+abs(v); r=math.sqrt(u*u+v*v)
            cu=min(math.sqrt((abs(u)-1)**2+(abs(v)-1)**2),9)
            if d1<0.36: c=C('#b0604a')
            elif d1<0.46: c=base
            elif 0.74<r<0.80: c=C('#8a7e70')
            elif cu<0.36: c=C('#c89c62')
            elif cu<0.42: c=C('#8a7e70')
            elif abs(u)<0.06 or abs(v)<0.06:
                c=base
            else: c=base
            if abs(u)>0.965 or abs(v)>0.965: c=C('#b4a890')     # grout
            n=np.random.default_rng(x*7919+y*131).integers(-6,7)
            wear=0.94+0.06*math.sin(x*0.07)*math.cos(y*0.05)
            cv.a[y,x]=c*wear+n
    # worn path from door to kitchen, cracks
    for i in range(8):
        x=rng.randint(RX0,RX1); y=rng.randint(WALL1+4,FLOOR1-4)
        for t in range(rng.randint(5,14)):
            cv.px(x,y,'#7a7060',0.7); x+=rng.choice((1,1,0)); y+=rng.choice((-1,0,1))
    # baseboard AO along back wall
    for d in range(10): cv.mul(RX0,WALL1+d,RX1-RX0,1,[0.72+0.028*d]*3)
def walls(cv):
    # back wall face
    cv.noise(RX0,CAP,RX1-RX0,WALL1-CAP,'#ecdcb8',var=3,seed=3)
    rng=random.Random(4)
    for i in range(40):
        x=rng.randint(RX0,RX1); y=rng.randint(CAP,WALL1); r=rng.randint(2,6)
        for dy in range(-r,r):
            for dx in range(-r,r):
                if dx*dx+dy*dy<r*r and rng.random()<0.7: cv.mul(x+dx,y+dy,1,1,[0.97]*3)
    for d in range(8): cv.mul(RX0,CAP+d,RX1-RX0,1,[0.70+0.0375*d]*3)     # ceiling AO
    # kitchen azulejos
    for y in range(26,WALL1-4):
        for x in range(340,RX1-12):
            tu=(x-340)%10; tv=(y-26)%10
            c=C('#e8eef0') if (tu and tv) else C('#b8c4c8')
            if tu in(4,5) and tv in(4,5): c=C('#3a6ab0')
            if (tu in(2,7) and tv in(2,7)): c=C('#8aa8d8')
            cv.a[y,x]=c+np.random.default_rng(x*3+y).integers(-3,4)
    cv.rect(340,25,RX1-12-340,1,'#9aa8ac')
    cv.noise(RX0,WALL1-5,RX1-RX0,5,'#7a5a40',var=3,seed=5); cv.rect(RX0,WALL1-5,RX1-RX0,1,'#9a7a58')   # rodapie
def caps(cv):
    cv.rect(0,0,W,H,'#120e0d') if False else None
    def capr(x,y,w,h):
        cv.noise(x,y,w,h,'#4a3a34',var=3,seed=x+y); cv.rect(x,y,w,1,'#6a5650')
    capr(RX0-2,0,RX1-RX0+4,CAP)
    capr(RX0-2,0,14,FLOOR1+14); capr(RX1-12,0,14,FLOOR1+14)
    capr(RX0-2,FLOOR1,DOORX-RX0+2,14); capr(DOORX+32,FLOOR1,RX1-DOORX-30,14)
    # inner shadow cast by side caps onto floor/wall (light from window → left)
    for d in range(6): cv.mul(RX0+12+d,CAP,1,FLOOR1-CAP,[0.62+0.06*d]*3); cv.mul(RX1-13-d,CAP,1,FLOOR1-CAP,[0.62+0.06*d]*3)
    # door threshold + street outside
    cv.noise(DOORX,FLOOR1,32,14,'#8e8a80',var=4,seed=8); cv.rect(DOORX,FLOOR1,32,2,'#b8b0a0')
    cv.noise(DOORX,FLOOR1+14,32,H-FLOOR1-14,'#c8bca4',var=5,seed=9)
def stairs(cv):
    # each step = lit tread (top face) + darker riser (front face); steps climb toward the back wall
    x0,x1=RX0+12,128
    top=8; bot=204; n=13; step=(bot-top)/n; rise=5
    for i in range(n):
        yb=int(bot-i*step); yt=int(bot-(i+1)*step)
        f=0.80+0.20*(i/n)                                   # higher steps get more light
        tread_h=yb-yt-rise
        for j in range(tread_h):                            # tread: terrazo, lighter toward its front edge
            g=f*(0.94+0.08*j/max(1,tread_h-1))
            cv.noise(x0,yt+j,x1-x0,1,shade('#d8d0be',g),var=3,seed=i*31+j)
        for k in range(12): cv.px(x0+((k*37+i*11)%(x1-x0)),yt+((k*13)%max(1,tread_h)),shade('#9a907e',f))
        cv.rect(x0,yt+tread_h-1,x1-x0,1,shade('#fbf4e4',f))     # bright nosing
        for j in range(rise):                               # riser (front face, in shade)
            cv.rect(x0,yt+tread_h+j,x1-x0,1,shade('#8e8472',f*(0.92-0.05*j)))
        cv.mul(x0,yt,4,yb-yt,(0.78,0.78,0.82))              # wall AO on the left
        # baluster on the right of each step + its shadow on the tread
        bx=x1-3
        cv.rect(bx,yt-8,2,tread_h+8,'#1e1a1c'); cv.px(bx,yt-8,'#5a5456')
        for t in range(6): cv.mul(bx-3-t,yt+tread_h-2,1,1,(0.75,0.75,0.8))
    cv.rect(x1-3,top,2,bot-top-8,'#2a2628'); cv.rect(x1-4,top,1,bot-top-8,'#6a6466')   # handrail
    cv.rect(x1-5,bot-12,6,12,'#2a2628'); cv.rect(x1-5,bot-12,6,1,'#7a7476')          # newel post
    cv.rect(x0,top-2,x1-x0,10,'#2a2220')                    # opening to upper floor
    for d in range(12): cv.mul(x0,top+8+d,x1-x0,1,[0.55+0.037*d]*3)
    for k in range(4): cv.mul(x0+2,bot+k,x1-x0,1,[0.6+0.1*k]*3)   # contact shadow at the foot
    # shoes at the foot of the stairs
    for (sx,c) in ((x0+4,'#2a2a3a'),(x0+12,'#2a2a3a'),(x0+24,'#c84a4a'),(x0+32,'#c84a4a')):
        cv.rect(sx,bot+5,7,4,c); cv.rect(sx,bot+5,7,1,shade(c,1.6)); cv.rect(sx+1,bot+6,3,1,'#e8e8e8')
def window(cv,x=142,y=14,w=56,h=42):
    cv.rect(x-3,y-3,w+6,h+6,'#f2ece0'); cv.rect(x-3,y+h+3,w+6,3,'#d8d0c0'); cv.mul(x-3,y+h+6,w+6,3,(0.8,0.8,0.82))
    rng0=random.Random(8)
    for j in range(h):   # bright garden + sky outside
        for i in range(w):
            t=j/h
            if t<0.30: c=shade('#d8ecf4',1.0-0.1*t)
            else:
                c=shade('#7ab854',1.15-0.5*t)
                if rng0.random()<0.25: c=shade('#a8d070',1.1-0.4*t)
                if rng0.random()<0.08: c=shade('#4a8a3a',1.0)
            if t<0.45 and ((i-10)**2/90+(j-12)**2/40)<1: c=shade('#5aa04a',1.05)   # tree crown outside
            cv.px(x+i,y+j,c)
    for bx in range(x+3,x+w,5): cv.rect(bx,y-1,1,h+2,'#26221f')
    cv.rect(x,y+h//2,w,1,'#26221f')
    # curtains (floral) tied to sides
    rng=random.Random(5)
    for side in (0,1):
        for j in range(-6,h+8):
            ww=int(14-6*math.sin(min(1,max(0,(j-10)/24))*math.pi)) if j<h else 14
            ww=max(5,ww)
            for i in range(ww):
                X=x-6+i if side==0 else x+w+6-i-1
                f=0.8+0.25*math.sin(i*1.3)
                c=shade('#e8c4c8',f)
                if (i*7+j*3)%11==0: c=C('#c04a5a')
                if (i*5+j*7)%13==0: c=C('#5a8a4a')
                cv.px(X,y+j,c)
        tx=x-2 if side==0 else x+w+1
        cv.rect(tx-2,y+22,5,2,'#c8a040')
    cv.rect(x-10,y-8,w+20,2,'#8a6a40')    # curtain rod
    # sill plants in tins
    for k,px_ in enumerate((x+6,x+22,x+40)):
        cv.rect(px_,y+h+1,8,6,['#c8c8c8','#d06040','#c8c8c8'][k]); cv.rect(px_,y+h+1,8,1,'#ffffff')
        for t in range(9): cv.px(px_+1+rng.randint(0,6),y+h+1-rng.randint(1,6),rng.choice(['#4a8a4a','#6aa85a','#2e6a3a']))
