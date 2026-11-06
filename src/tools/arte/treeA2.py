from px import *
from treeA import MANGO,MANGO2,MC,DROOP,LC
from stampA import stamp
RAMP=['#0f2e1c','#174a2a','#1f6234','#2a7c3a','#3c9c3e','#58ba48','#82d45a','#b0ea7c']
TRK=['#2e1a10','#5c381e','#86562f','#b07a4e']
def canopy_mask(W,H):
    m=np.zeros((H,W),bool)
    for cx,cy,rx,ry in [(48,22,22,15),(28,32,17,14),(68,32,17,14),(18,46,13,11),(78,46,13,11),(48,40,28,20),(36,54,16,10),(60,54,16,10)]:
        m|=ell(H,W,cx,cy,rx,ry)
    return m
def treeA2(desc=False,seed=5):
    W,H=96,104; img=Img(W,H); rng=random.Random(seed)
    # ground shadow
    for y in range(H):
        for x in range(W):
            if ((x-50)/34)**2+((y-96)/7)**2<1: img.px(x,y,(20,60,20,80))
    # trunk
    T=np.zeros((H,W),bool)
    T|=ell(H,W,48,82,7,14)|poly(H,W,[(38,98),(42,86),(54,86),(59,98),(52,95),(48,99),(44,95)])
    T|=poly(H,W,[(45,74),(30,58),(35,55),(49,70)])|poly(H,W,[(50,74),(66,57),(70,60),(53,76)])
    for y,x in zip(*np.nonzero(T)):
        k=2
        if not T[y,max(0,x-2)]: k=3
        if not T[y,min(W-1,x+2)]: k=1
        img.px(x,y,TRK[k])
    for y,x in zip(*np.nonzero(edge_out(T))): img.px(x,y,TRK[0])
    for y in range(80,96,3): img.px(46+(y%2),y,TRK[1]); img.px(46+(y%2),y+1,TRK[1])
    C=canopy_mask(W,H)
    # shadow of canopy onto trunk
    for y,x in zip(*np.nonzero(T)):
        if y<74: img.px(x,y,TRK[1] if (x>=48 or y<66) else TRK[2])
    pts=[]
    for gy in range(0,H,4):
        for gx in range(0,W,6):
            x=gx+rng.uniform(-1.5,1.5)+(3 if (gy//4)%2 else 0); y=gy+rng.uniform(-1,1)
            if 0<=int(y)<H and 0<=int(x)<W and C[int(y),int(x)]: pts.append((y,x))
    pts.sort(reverse=desc)
    for y,x in pts:
        lit=0.62-(y-8)/60*0.55-(x-48)/48*0.25+rng.uniform(-0.12,0.12)
        lv=int(np.clip(lit*5,0,4))+1   # 1..5 base index
        rx,ry=rng.uniform(3.8,4.6),rng.uniform(2.8,3.3)
        for j in range(-5,6):
            for i in range(-7,8):
                u=(i+0.5-(x-int(x)))/rx; v=(j+0.5-(y-int(y)))/ry
                if u*u+v*v<=1:
                    X,Y=int(x)+i,int(y)+j
                    if not(0<=X<W and 0<=Y<H and C[Y,X]): continue
                    k=lv
                    if v>0.55: k=lv-1
                    if (u+v)<-0.9: k=lv+1
                    if v>0.85: k=max(0,lv-2)
                    img.px(X,Y,RAMP[max(0,min(7,k))])
    for y,x in zip(*np.nonzero(edge_out(C))): img.px(x,y,RAMP[0])
    # drooping leaves at bottom edge
    edge=edge_out(C); pts=[(y,x) for y,x in zip(*np.nonzero(edge)) if y>44 and C[y-1,x]]
    rng.shuffle(pts); placed=[]
    for y,x in pts:
        if any(abs(y-py)+abs(x-px_)<7 for py,px_ in placed): continue
        k=0 if 30<x<66 else (1 if x<48 else 2)
        img.blit(stamp(DROOP[k],LC),x-1,y-2); placed.append((y,x))
    for (x,y,k) in ((22,50,0),(64,56,0),(34,58,1),(74,42,1),(52,46,0),(16,40,1),(44,30,0),(58,24,1)):
        img.blit(stamp(MANGO if k==0 else MANGO2,MC),x,y)
    return img
