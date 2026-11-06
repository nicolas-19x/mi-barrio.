# region-grid + banded directional shading (no outline)
import numpy as np
from px import *
def regions(rows,volmap):
    H=len(rows); W=max(len(r) for r in rows)
    vid=np.full((H,W),-1,int); mat=np.full((H,W),'',object); ch=np.full((H,W),'.',object)
    for y,r in enumerate(rows):
        for x,c in enumerate(r):
            if c in volmap:
                v,m=volmap[c]; vid[y,x]=v; mat[y,x]=m; ch[y,x]=c
    return vid,mat,ch
def dist_dir(vid,x,y,dx,dy,maxd=6):
    v=vid[y,x]; H,W=vid.shape
    for d in range(1,maxd+1):
        xx,yy=x+dx*d,y+dy*d
        if not(0<=xx<W and 0<=yy<H) or vid[yy,xx]!=v: return d
    return maxd+1
def render_band(vid,mat,ramps,light=(-1,-1),idx_mid=3,front_ao=True,ao_rows=(1,2)):
    H,W=vid.shape; img=Img(W,H)
    lx,ly=light
    for y in range(H):
        for x in range(W):
            v=vid[y,x]
            if v<0: continue
            rp=ramps[mat[y,x]]
            dl=min(dist_dir(vid,x,y,lx,0),dist_dir(vid,x,y,0,ly))  # towards light
            dd=min(dist_dir(vid,x,y,-lx,0)+1,dist_dir(vid,x,y,0,-ly)) # away
            k=idx_mid
            if dd==1: k=idx_mid-2
            elif dd==2: k=idx_mid-1
            elif dl==1: k=idx_mid+2
            elif dl==2: k=idx_mid+1
            # ambient occlusion under a front volume
            if front_ao:
                for ddy in ao_rows:
                    if y-ddy>=0 and vid[y-ddy,x]>v: k-=1; break
            k=max(0,min(len(rp)-1,k))
            img.px(x,y,rp[k])
    return img
