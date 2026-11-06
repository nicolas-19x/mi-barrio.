from px import *
from dogC import C16
def treeC():
    W,H=52,56; img=Img(W,H)
    def P(x,y,c): img.px(x,y,C16[c])
    # trunk
    T=ell(H,W,26,43,4,8)|poly(H,W,[(20,51),(23,45),(29,45),(32,51),(28,50),(26,52),(24,50)])
    T|=poly(H,W,[(24,38),(17,31),(19,30),(26,36)])|poly(H,W,[(27,38),(34,30),(36,31),(29,39)])
    for y,x in zip(*np.nonzero(T)):
        P(x,y,'b' if T[y,max(0,x-2)] and T[y,min(W-1,x+2)] else ('B' if not T[y,x-2] else 's'))
        if not T[y,min(W-1,x+2)] and (x+y)%2: P(x,y,'K')
    for y,x in zip(*np.nonzero(edge_out(T))): P(x,y,'K')
    C=np.zeros((H,W),bool)
    lobes=[(26,11,11),(15,17,9),(37,17,9),(10,26,7),(42,26,7),(26,22,13),(18,30,8),(34,30,8)]
    for cx,cy,r in lobes: C|=ell(H,W,cx,cy,r,r*0.9)
    for y,x in zip(*np.nonzero(C)):
        # lighting: distance-ish via lobe-local position
        best=None
        for cx,cy,r in lobes:
            d=((x+0.5-cx)/r)**2+((y+0.5-cy)/(r*0.9))**2
            if d<=1 and (best is None or cy>best[1]): best=(cx,cy,r)
        cx,cy,r=best
        u=(x+0.5-cx)/r; v=(y+0.5-cy)/(r*0.9)
        t=-(u*0.6+v*0.8)  # >0 lit
        chk=(x+y)%2==0
        if t>0.55: c='L' if chk else 'G'
        elif t>0.1: c='G'
        elif t>-0.15: c='G' if chk else 'D'
        elif t>-0.6: c='D'
        else: c='D' if chk else 'K'
        P(x,y,c)
    # inner lobe outlines (bottom arcs of upper lobes)
    for y in range(1,H-1):
        for x in range(W):
            if C[y,x]:
                for cx,cy,r in lobes:
                    d=((x+0.5-cx)/r)**2+((y+0.5-cy)/(r*0.9))**2
                    if False and 0.82<d<=1.05 and y>cy and cy<26 and abs(x+0.5-cx)<r*0.75:
                        inside_other=any(((x+0.5-c2)/r2)**2+((y+0.5-c3)/(r2*0.9))**2<0.7 for c2,c3,r2 in lobes if c3>cy)
                        if inside_other: P(x,y,'K')
    for (x,y) in ((14,12),(30,8),(22,17),(38,20),(10,24),(27,26),(18,30),(34,30),(44,26)):
        if C[y,x] and C[y+1,x+1]: P(x,y,'D'); P(x+1,y+1,'D'); P(x+2,y,'D')
    for y,x in zip(*np.nonzero(edge_out(C))): P(x,y,'K')
    # mangoes: 2x3 with outline
    MG=["..K..",".KYK.","KYYBK","KYBRK","KBRRK",".KKK."]
    for (x,y) in ((6,30),(14,34),(31,35),(40,29),(23,27),(36,19),(13,15)):
        for j,r in enumerate(MG):
            for i,c in enumerate(r):
                if c!='.': P(x+i,y+j,c)
    return img
