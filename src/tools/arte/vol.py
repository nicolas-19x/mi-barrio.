# volume-based sprite builder: volumes (with own shading) + paint patches + details
import numpy as np
from px import *

class Sprite:
    def __init__(s,w,h):
        s.w,s.h=w,h; s.vols=[]   # list of (mask, mat)
        s.vid=np.full((h,w),-1,int); s.mat=np.full((h,w),'',object)
    def vol(s,mask,mat):
        i=len(s.vols); s.vols.append(mat); s.vid[mask]=i; s.mat[mask]=mat; return i
    def paint(s,mask,mat,within=None):
        m=mask&(s.vid>=0)
        if within is not None: m&=np.isin(s.vid,within)
        s.mat[m]=mat
    def occ(s): return s.vid>=0

def render_flat3(sp,pal,outline=True,sh=(1,2),hl=(-1,-1),inner=True,inner_skip=()):
    """Stardew-like: base/dark/light per material + selective dark outline"""
    img=Img(sp.w,sp.h); occ=sp.occ()
    for y in range(sp.h):
        for x in range(sp.w):
            v=sp.vid[y,x]
            if v<0: continue
            m=sp.mat[y,x]; L,M,D,O=pal[m]
            def same(dx,dy):
                xx,yy=x+dx,y+dy
                return 0<=xx<sp.w and 0<=yy<sp.h and sp.vid[yy,xx]==v
            c=M
            if not same(*sh) or not same(0,1): c=D
            elif not same(*hl) or not same(0,-1): c=L
            img.px(x,y,c)
            # inner line: boundary with a volume behind (lower index)
            if inner:
                for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    xx,yy=x+dx,y+dy
                    if 0<=xx<sp.w and 0<=yy<sp.h:
                        v2=sp.vid[yy,xx]
                        if v2>=0 and v2<v and (v,v2) not in inner_skip and (v2,v) not in inner_skip:
                            img.px(x,y,O); break
    if outline:
        eo=edge_out(occ)
        for y,x in zip(*np.nonzero(eo)):
            # selout: colour from adjacent material
            best=None
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                xx,yy=x+dx,y+dy
                if 0<=xx<sp.w and 0<=yy<sp.h and sp.vid[yy,xx]>=0: best=sp.mat[yy,xx];break
            img.px(x,y,pal[best][3])
    return img

def blur(m,r):
    a=m.astype(float)
    for _ in range(2):
        p=np.pad(a,r,mode='constant')
        c=np.cumsum(np.cumsum(p,0),1); c=np.pad(c,((1,0),(1,0)))
        k=2*r+1; h,w=a.shape
        a=(c[k:k+h,k:k+w]-c[0:h,k:k+w]-c[k:k+h,0:w]+c[0:h,0:w])/(k*k)
    return a

def render_soft(sp,ramps,light=(-0.75,-0.65),r=2,amb=0.55,seed=1,tex=0.10,rim=True,order_bias=None):
    """Eastward-like: no outline, multi-tone ramps, pseudo-normal shading, texture noise"""
    rng=np.random.default_rng(seed); img=Img(sp.w,sp.h)
    shade=np.zeros((sp.h,sp.w))
    for i in range(len(sp.vols)):
        m=sp.vid==i
        if not m.any(): continue
        b=blur(m|(sp.vid>i),r)  # treat front volumes as part (no seam) -- volume own
        b=blur(m,r)
        gy,gx=np.gradient(b)
        nx,ny=-gx,-gy; ln=np.sqrt(nx*nx+ny*ny)+1e-6
        dot=(nx*light[0]+ny*light[1])/ln*np.clip(ln*3,0,1)
        val=amb+0.5*dot+0.25*(b-0.5)
        # occlusion where a volume in front overlaps (contact shadow below edge)
        shade[m]=val[m]
    # contact shadows: pixels just below/right of a front volume edge get darker
    for i in range(len(sp.vols)):
        m=sp.vid==i
        front=(sp.vid>i)
        near=(shift(front,0,-1)|shift(front,0,-2)|shift(front,-1,-1))&m&~front
        shade[near]-=0.18
    shade+=rng.normal(0,tex,shade.shape)
    for y in range(sp.h):
        for x in range(sp.w):
            if sp.vid[y,x]<0: continue
            rp=ramps[sp.mat[y,x]]; n=len(rp)
            k=int(np.clip(shade[y,x],0,0.999)*n)
            img.px(x,y,rp[k])
    return img
