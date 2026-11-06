from px import *
G5=['#1c2e1e','#26432a','#335a32','#47743c','#62904a','#82aa58','#a6c46e']
HIB={'0':'#4a0e18','1':'#7e1626','2':'#ae2632','3':'#d43c3e','4':'#ec6656','5':'#f8967e','y':'#f8e070','Y':'#e8a840'}
HIBISCUS="""
....45....45...
...4554..4553..
...45554.4553..
.44.4554453.33.
4555544553333.3
.455554y4333332
..444441Y133322
.3333311y112221
.3333311.122221
..33322..12222.
...3222...1221.
....222....11..
"""
HIBISCUS2="""
...4554...
..455543..
4.45554.33
5545y4433.
.4441Y132.
.3331y1222
.333...222
..32...21.
"""
CHAV="""
.545.
55455
44c44
55455
.545.
"""
CHC={'5':'#fbe6f0','4':'#f2b8d2','c':'#c8306a'}
CHC2={'5':'#ffffff','4':'#e4e2ea','c':'#d03050'}
def stamp(g,cols):
    rows=g.strip('\n').split('\n'); im=Img(max(len(r) for r in rows),len(rows))
    for y,r in enumerate(rows):
        for x,c in enumerate(r):
            if c in cols: im.px(x,y,cols[c])
    return im
LEAFB=["""
.65.
6543
5432
.21.
""","""
..65
.654
6543
321.
""","""
56..
4565
3454
.123
"""]
def bushB(W=40,H=30,seed=3,hib=((9,3,0),(24,6,1),(16,12,1)),chav=((4,18),(30,17),(20,19),(10,21))):
    rng=random.Random(seed); im=Img(W,H)
    cx,cy,rx,ry=W/2,H*0.55,W*0.45,H*0.38
    # ground shadow (long, afternoon: towards right)
    for y in range(H):
        for x in range(W):
            if ((x-cx-4)/(rx+2))**2+((y-cy-ry*0.75)/(ry*0.45))**2<1: im.px(x,y,(20,30,20,90))
    pts=[]
    for i in range(170):
        x=rng.uniform(cx-rx,cx+rx); y=rng.uniform(cy-ry,cy+ry)
        if ((x-cx)/rx)**2+((y-cy)/ry)**2<=1: pts.append((y,x))
    pts.sort()
    for y,x in pts:
        t=(y-(cy-ry))/(2*ry)   # 0 top .. 1 bottom
        lit=1-t + (cx-x)/rx*0.25 + rng.uniform(-0.15,0.15)
        base=int(np.clip(lit*5.2,0,5))
        g=rng.choice(LEAFB); rows=g.strip('\n').split('\n')
        for j,r in enumerate(rows):
            for i,c in enumerate(r):
                if c!='.':
                    k=int(np.clip(int(c)-4+base+1,0,6)); im.px(int(x)+i-2,int(y)+j-2,G5[k])
    for x,y,k in hib: im.blit(stamp(HIBISCUS if k==0 else HIBISCUS2,HIB),x,y)
    for i,(x,y) in enumerate(chav): im.blit(stamp(CHAV,CHC if i%2==0 else CHC2),x,y)
    return im
