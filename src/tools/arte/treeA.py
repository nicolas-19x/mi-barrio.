from vol import *
from stampA import stamp
PT={'lf':('#62c44c','#3c9c3e','#25723a','#0f2e1c'),
    'lf2':('#42a240','#2a7c3a','#1b5634','#0f2e1c'),
    'trk':('#b07a4e','#86562f','#5c381e','#2e1a10')}
MANGO="""
.o..
.o..
.oo.
oYYoo
oYRRo
oYRRo
oRRDo
.oDDo
..oo.
"""
MANGO2="""
.o..
.o..
.oo.
oMMoo
oMYYo
oMYRo
oYRDo
.oDDo
..oo.
"""
MC={'o':'#3a1a0a','Y':'#ffd040','R':'#f06a2a','D':'#b83a20','M':'#a6d040'}
DROOP=["""
.o.
oLo
oMo
oMo
oDo
oDo
.o.
""","""
.o..
oLo.
oMo.
.oMo
.oDo
..o.
""","""
..o.
.oLo
.oMo
oMo.
oDo.
.o..
"""]
LC={'o':'#0f2e1c','L':'#62c44c','M':'#3c9c3e','D':'#25723a'}
def treeA(seed=4):
    W,H=96,100; rng=random.Random(seed); s=Sprite(W,H); E=lambda *a,**k:ell(H,W,*a,**k)
    tr=E(48,80,7,13)|poly(H,W,[(38,94),(42,84),(54,84),(59,94),(52,91),(48,95),(44,91)])
    tr|=poly(H,W,[(46,72),(34,58),(38,55),(49,68)])|poly(H,W,[(49,72),(62,57),(65,60),(52,74)])
    s.vol(tr,'trk')
    cl=[]
    # dome of clumps
    for i in range(19):
        a=rng.uniform(0,2*math.pi); rr=math.sqrt(rng.uniform(0,1))
        cx=48+math.cos(a)*rr*30; cy=36+math.sin(a)*rr*20
        r=rng.uniform(10,13)
        cl.append((cy,cx,r))
    cl.sort(reverse=True)  # bottom first; top clumps overlap
    for cy,cx,r in cl:
        mat='lf' if cy<34 else 'lf2'
        s.vol(E(cx,cy,r,r*0.88),mat)
    return s
def renderTA():
    s=treeA(); occ=s.vid>0
    img=render_flat3(s,PT,sh=(1,2),inner=False)
    # dark rim under each clump overlapping a lower one => separation (bottom arcs)
    for y in range(s.h-1):
        for x in range(s.w):
            v=s.vid[y,x]
            if v>0 and s.vid[y+1,x]>0 and s.vid[y+1,x]!=v and s.vid[y+1,x]<v:
                img.px(x,y+1,PT[s.mat[y+1,x]][3])
    rng=random.Random(7)
    # leaf strokes on lit/mid areas
    for i in range(260):
        x=rng.randint(4,92); y=rng.randint(4,64)
        ok=all(0<=x+dx<96 and occ[y+dy,x+dx] and s.vid[y+dy,x+dx]==s.vid[y,x] for dx,dy in ((-2,0),(2,0),(0,3),(-2,2),(2,2)))
        if not ok: continue
        pal=PT[s.mat[y,x]]; c=tuple(img.get(x,y)[:3])
        if c==hexc(pal[1])[:3]: hi,lo=pal[0],pal[2]
        elif c==hexc(pal[0])[:3]: hi,lo='#a4e47a',pal[1]
        elif c==hexc(pal[2])[:3]: hi,lo=pal[1],pal[3]
        else: continue
        # little rosette of 3 pointed leaves  \|/
        for px_,py_ in ((-2,0),(-1,1),(0,0),(0,1),(2,0),(1,1)): img.px(x+px_,y+py_,hi)
        img.px(x,y+2,lo)
    edge=edge_out(occ)
    for y,x in zip(*np.nonzero(edge)):
        if y<44 and (x+y*3)%5==0 and s.vid[min(y+1,99),x]>0:
            img.px(x,y,PT['lf'][3]); img.px(x,y-1,PT['lf'][3]) if s.vid[y-1,x]<=0 and (x%2) else None
            img.px(x,y+1,PT['lf'][1]); img.px(x,y,PT['lf'][2]) if (x%2) else None
    # drooping leaf bunches along lower edge
    edge=edge_out(occ); pts=[(y,x) for y,x in zip(*np.nonzero(edge)) if y>38]
    rng.shuffle(pts); placed=[]
    for y,x in pts:
        if s.vid[max(0,y-1),x]<=0: continue   # need canopy above
        if 36<x<60 and y>62: continue
        if any(abs(y-py)+abs(x-px_)<7 for py,px_ in placed): continue
        k=0 if 30<x<66 else (1 if x<48 else 2)
        st=stamp(DROOP[k],LC); img.blit(st,x-1,y-2); placed.append((y,x))
    for (x,y,k) in ((20,50,0),(64,56,0),(34,58,1),(76,44,1),(52,46,0),(12,36,1),(44,30,0)):
        img.blit(stamp(MANGO if k==0 else MANGO2,MC),x,y)
    return img
