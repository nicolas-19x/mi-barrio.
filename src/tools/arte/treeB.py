from px import *
from treeA2 import canopy_mask
# warm-lit (west sun from left) / cool shadow ramp, no outline
RB=['#122420','#183428','#1f4430','#295634','#356a38','#4a803a','#68983e','#8eae48','#b8c45a','#e0d27a']
TB=['#24180f','#3a281a','#523a26','#6e5034','#8c6a46','#a88660']
def treeB(seed=11,s=1.0,shadow=True):
    W,H=int(150*s),int(112*s); img=Img(W,H); rng=random.Random(seed)
    ox=0
    Cm=np.zeros((H,W),bool)
    for cx,cy,rx,ry in [(48,22,22,15),(28,32,17,14),(68,32,17,14),(18,46,13,11),(78,46,13,11),(48,40,28,20),(36,54,16,10),(60,54,16,10)]:
        Cm|=ell(H,W,cx*s,cy*s,rx*s,ry*s)
    # long cast shadow of canopy to the right/down (afternoon)
    for y in range(H):
        for x in range(W):
            u=(x-92*s)/(52*s); v=(y-98*s)/(9*s)
            if shadow and u*u+v*v<1: img.px(x,y,(24,34,30,110))
    for y in range(H):
        for x in range(W):
            u=(x-60*s)/(14*s); v=(y-99*s)/(4*s)
            if u*u+v*v<1: img.px(x,y,(24,34,30,70))
    T=np.zeros((H,W),bool)
    T|=ell(H,W,48*s,82*s,6.5*s,14*s)|poly(H,W,[(a*s,b*s) for a,b in [(37,99),(42,86),(54,86),(60,99),(53,96),(48,100),(43,96)]])
    T|=poly(H,W,[(a*s,b*s) for a,b in [(45,74),(28,56),(33,53),(49,70)]])|poly(H,W,[(a*s,b*s) for a,b in [(50,74),(68,55),(72,58),(53,76)]])
    for y,x in zip(*np.nonzero(T)):
        d=0
        for k in range(1,6):
            if not T[y,max(0,x-k)]: d=k;break
        k=4 if d in(1,2) else 2
        if not T[y,min(W-1,x+1)] or not T[y,min(W-1,x+2)]: k=1
        if (hsh:=((x*7+y*13)%11))<2: k-=1      # bark grain
        if (y+x//3)%5==0 and k>1: k-=1
        img.px(x,y,TB[max(0,k)])
    for y,x in zip(*np.nonzero(T)):
        if y<76*s: img.px(x,y,TB[1] if y>68*s else TB[0])
    pts=[]
    for gy in range(0,H,3):
        for gx in range(0,W,4):
            x=gx+rng.uniform(-1.2,1.2)+(2 if (gy//3)%2 else 0); y=gy+rng.uniform(-1,1)
            if 0<=int(y)<H and 0<=int(x)<W and Cm[int(y),int(x)]: pts.append((y,x))
    pts.sort()
    for y,x in pts:
        lit=0.7-(y-8*s)/(60*s)*0.5-(x-48*s)/(48*s)*0.38+rng.uniform(-0.1,0.1)
        lv=int(np.clip(lit*7,0,6))+1
        rx,ry=rng.uniform(2.6,3.4),rng.uniform(1.8,2.4)
        for j in range(-3,4):
            for i in range(-4,5):
                u=(i+0.5-(x-int(x)))/rx; v=(j+0.5-(y-int(y)))/ry
                if u*u+v*v<=1:
                    X,Y=int(x)+i,int(y)+j
                    if not(0<=X<W and 0<=Y<H and Cm[Y,X]): continue
                    k=lv
                    if v>0.5: k=lv-1
                    if v>0.8: k=lv-2
                    if (u+v)<-0.8: k=lv+1
                    if (u+v)<-1.15 and lv>=5: k=lv+2
                    img.px(X,Y,RB[max(0,min(9,k))])
    # loose individual leaves on silhouette (no outline): lanceolate, drooping
    edge=edge_out(Cm); pts=list(zip(*np.nonzero(edge))); rng.shuffle(pts); placed=[]
    for y,x in pts:
        if any(abs(y-py)+abs(x-px_)<4 for py,px_ in placed): continue
        placed.append((y,x))
        lit=0.7-(y-8*s)/(60*s)*0.5-(x-48*s)/(48*s)*0.38
        base=int(np.clip(lit*7,0,6))+1
        dx=-1 if x<48*s else 1
        L=rng.randint(3,5)
        down=y>30
        for t in range(L):
            X=x+(dx*(t//2) if not down else (dx if t>=L-1 else 0)); Y=y+(t if down else -t//2)
            img.px(X,Y,RB[max(0,min(9,base+(1 if t==0 else 0)-(1 if t==L-1 else 0)))])
    # mangoes (no outline, gradient) hanging on thin stems
    for (x,y) in [(int(a*s),int(b*s)) for a,b in ((22,50),(64,56),(34,59),(74,42),(52,47),(16,40),(44,31),(58,25),(28,36),(40,44),(66,36))]:
        for s in range(3): img.px(x+(1 if s<2 else 0),y+s,'#3a2a1a')
        mg=[".ab..","abcc.","bccd.","bccdd",".cdde","..de."]
        cols={'a':'#d8e070','b':'#f4c84a','c':'#f09a3a','d':'#d8602a','e':'#9a3a24'}
        for j,r in enumerate(mg):
            for i,c in enumerate(r):
                if c!='.': img.px(x-1+i,y+3+j,cols[c])
    return img
