from cv import *
W,H=576,320
FAC=150      # facade/sidewalk line
CURB=184     # sidewalk front edge
ST0,ST1=198,262   # street
PK=274       # park start
def ground(cv):
    rng=random.Random(1)
    # sidewalk concrete slabs
    cv.noise(0,FAC,W,CURB-FAC,'#b4aa98',var=5,seed=1)
    for x in range(0,W,36):
        cv.rect(x,FAC,1,CURB-FAC,'#8e8474')
    cv.rect(0,FAC+17,W,1,'#9a907f')
    # stains, wear, cracks
    for i in range(26):
        x=rng.randint(0,W); y=rng.randint(FAC+2,CURB-4); r=rng.randint(2,7)
        for dy in range(-r,r):
            for dx in range(-r*2,r*2):
                if (dx/2)**2+dy**2<r*r and rng.random()<0.7: cv.px(x+dx,y+dy,(150,140,124),0.25)
    for i in range(9):
        x=rng.randint(0,W); y=rng.randint(FAC+3,CURB-3)
        for t in range(rng.randint(6,16)):
            cv.px(x,y,'#6e6656'); x+=1; y+=rng.choice((-1,0,0,1)); y=min(max(y,FAC+1),CURB-2)
    # weeds in joints
    for x in range(0,W,36):
        if rng.random()<0.5:
            for k in range(3): cv.px(x+rng.randint(-1,1),CURB-2-k,'#5c7a34' if k%2 else '#7a9a40')
    # curb face (lit top edge)
    cv.rect(0,CURB,W,2,'#d6ccb6'); cv.noise(0,CURB+2,W,3,'#8a8070',var=4,seed=3)
    # cuneta (gutter) V-channel
    cv.noise(0,CURB+5,W,4,'#7e776a',var=4,seed=4); cv.noise(0,CURB+9,W,2,'#5e584e',var=3,seed=5)
    cv.noise(0,CURB+11,W,ST0-CURB-11,'#8a8272',var=4,seed=6)
    for i in range(30):  # wet streak + leaves + litter
        x=rng.randint(0,W); cv.rect(x,CURB+9,rng.randint(3,14),2,'#3e3a36',0.6)
    for i in range(16):
        x=rng.randint(0,W); y=rng.randint(CURB+5,ST0-2); c=rng.choice(['#8a6a2a','#a8742e','#6a5a24','#b08a3a'])
        cv.px(x,y,c); cv.px(x+1,y,c)
    # asphalt
    cv.noise(0,ST0,W,ST1-ST0,'#4e4a48',var=4,seed=7)
    cv.noise(0,ST0,W,ST1-ST0,'#5c5754',var=3,seed=8,p=0.18)
    cv.noise(0,ST0,W,ST1-ST0,'#3e3a39',var=2,seed=9,p=0.10)
    # patches (bacheo)
    for (x,y,w,h) in ((150,212,46,22),(430,236,60,18),(300,203,22,12)):
        rr=random.Random(x)
        for yy in range(y,y+h):
            a=rr.randint(0,3); b=rr.randint(0,3)
            cv.noise(x+a,yy,w-a-b,1,'#4a4643',var=3,seed=x*7+yy)
            cv.px(x+a,yy,'#403c39'); cv.px(x+w-b-1,yy,'#57524e')
    # cracks
    for i in range(10):
        x=rng.randint(0,W); y=rng.randint(ST0+3,ST1-3)
        for t in range(rng.randint(8,24)):
            cv.px(x,y,'#2a2726'); x+=rng.choice((1,1,2)); y+=rng.choice((-1,0,0,1)); y=min(max(y,ST0+1),ST1-2)
    # potholes (depression: top-left inner rim dark, bottom-right rim lit)
    def hole(cx,cy,rx,ry,water):
        for y in range(int(cy-ry-2),int(cy+ry+3)):
            for x in range(int(cx-rx-2),int(cx+rx+3)):
                u=(x-cx)/rx; v=(y-cy)/ry; d=u*u+v*v+0.18*math.sin(x*1.3+y*0.7)
                if d<1:
                    c='#2a2624' if d>0.55 and (u+v)<0 else '#34302d'
                    if water and d<0.62:
                        c='#8a8f9a' if (y-cy)<-ry*0.1 else '#6d7480'
                        if (x+y)%7==0 and d<0.3: c='#e8b57a'   # sun glint from sky
                    cv.px(x,y,c)
                    if d>0.82 and (u+v)>0.3: cv.px(x,y,'#7a736b')
                elif d<1.35 and rng.random()<0.5: cv.px(x,y,'#3a3634')
        for k in range(10):   # loose gravel
            a=rng.uniform(0,6.28); cv.px(cx+math.cos(a)*(rx+3),cy+math.sin(a)*(ry+2),'#8a8278')
    hole(252,232,16,7,True); hole(372,248,8,4,False); hole(520,214,10,5,True); hole(205,252,5,3,False)
    # manhole cover
    mx,my=470,224
    for y in range(my-5,my+6):
        for x in range(mx-10,mx+11):
            d=((x-mx)/10)**2+((y-my)/5)**2
            if d<1: cv.px(x,y,'#5a5048' if d>0.7 else ('#6a6058' if (x+y)%3 else '#4a423c'))
            if 0.7<d<0.85 and (x-mx)+(y-my)*2>0: cv.px(x,y,'#8a8078')
    # oil stains and tyre tracks
    for (x,y,r) in ((120,240,9),(330,228,7),(560,246,8)):
        for yy in range(-r//2,r//2+1):
            for xx in range(-r,r+1):
                if (xx/r)**2+(yy/(r/2))**2<1 and rng.random()<0.8: cv.px(x+xx,y+yy,(30,28,30),0.35)
    for y0 in (214,246):
        for x in range(0,W):
            if rng.random()<0.6: cv.px(x,y0+rng.randint(0,1),(70,66,62),0.25)
    for i in range(25):   # dry leaves on street
        x=rng.randint(0,W); y=rng.randint(ST0+2,ST1-2); c=rng.choice(['#8a6a2a','#a8742e','#6a5a24','#c09040'])
        cv.px(x,y,c); cv.px(x+1,y,c) if rng.random()<0.5 else cv.px(x,y+1,c)
    # park-side cuneta + curb
    cv.noise(0,ST1,W,8,'#8a8272',var=4,seed=11); cv.noise(0,ST1+2,W,2,'#5e584e',var=3,seed=12)
    cv.rect(0,ST1+8,W,2,'#d0c6b0'); cv.noise(0,ST1+10,W,2,'#8e8474',var=3,seed=13)
    # park grass
    rng2=np.random.default_rng(5)
    cols=[C('#64803c'),C('#6a8640'),C('#708a44'),C('#5a763a'),C('#78924a')]
    for y in range(PK,H):
        for x in range(W):
            cv.a[y,x]=cols[1] if rng2.random()>0.22 else cols[rng2.integers(0,5)]
    # worn dirt path into park
    for y in range(PK,H):
        for x in range(W):
            u=(x-262-(y-PK)*0.5)/16
            if abs(u)<1+0.15*math.sin(y*0.7):
                cv.a[y,x]=C('#a08a64')+rng2.integers(-6,7)
    # grass blades / clover / pebbles
    for i in range(500):
        x=rng.randint(0,W-1); y=rng.randint(PK+2,H-1)
        c=rng.choice(['#84a050','#90aa58','#4e6a32','#5a7636'])
        cv.px(x,y,c); 
        if c in('#84a050','#90aa58'): cv.px(x,y-1,c)
    for i in range(30):
        x=rng.randint(0,W-1); y=rng.randint(PK+4,H-1); cv.px(x,y,'#b8b0a0'); cv.px(x+1,y,'#8a8278')
    for i in range(14):
        x=rng.randint(160,W-1); y=rng.randint(PK+4,H-3); cv.px(x,y,'#f2f0e0'); cv.px(x,y+1,'#e8d050')  # tiny daisies
    # grass tufts along curb
    for x in range(0,W,3):
        if rng.random()<0.5: cv.px(x,PK,'#82a050'); cv.px(x,PK-1,'#6a8640') if rng.random()<0.4 else None
