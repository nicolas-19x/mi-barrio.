import numpy as np
from PIL import Image, ImageDraw, ImageFont
import math, random

def hexc(h):
    h=h.lstrip('#'); return (int(h[0:2],16),int(h[2:4],16),int(h[4:6],16),255)

class Img:
    def __init__(s,w,h):
        s.w,s.h=w,h; s.a=np.zeros((h,w,4),np.uint8)
    def px(s,x,y,c):
        x=int(x);y=int(y)
        if 0<=x<s.w and 0<=y<s.h:
            if isinstance(c,str): c=hexc(c)
            if len(c)==3:c=(*c,255)
            if c[3]==255: s.a[y,x]=c
            else:
                al=c[3]/255; s.a[y,x,:3]=(s.a[y,x,:3]*(1-al)+np.array(c[:3])*al).astype(np.uint8); s.a[y,x,3]=max(s.a[y,x,3],c[3])
    def get(s,x,y):
        if 0<=x<s.w and 0<=y<s.h: return tuple(s.a[y,x])
        return (0,0,0,0)
    def blit(s,o,ox,oy):
        for y in range(o.h):
            for x in range(o.w):
                c=o.a[y,x]
                if c[3]: s.px(ox+x,oy+y,tuple(int(v) for v in c))
    def rect(s,x,y,w,h,c):
        for j in range(h):
            for i in range(w): s.px(x+i,y+j,c)
    def pil(s): return Image.fromarray(s.a,'RGBA')

def ell(h,w,cx,cy,rx,ry,rot=0):
    yy,xx=np.mgrid[0:h,0:w].astype(float)
    dx=xx+0.5-cx; dy=yy+0.5-cy
    c,sn=math.cos(rot),math.sin(rot)
    u=dx*c+dy*sn; v=-dx*sn+dy*c
    return (u/rx)**2+(v/ry)**2<=1.0

def poly(h,w,pts):
    im=Image.new('L',(w,h),0); ImageDraw.Draw(im).polygon(pts,fill=1)
    return np.array(im).astype(bool)

def shift(m,dx,dy):
    o=np.zeros_like(m); h,w=m.shape
    ys=slice(max(0,dy),h+min(0,dy)); yd=slice(max(0,-dy),h+min(0,-dy))
    xs=slice(max(0,dx),w+min(0,dx)); xd=slice(max(0,-dx),w+min(0,-dx))
    o[yd,xd]=m[ys,xs]   # o[y,x]=m[y+dy,x+dx]
    return o

def edge_out(m):
    n=shift(m,1,0)|shift(m,-1,0)|shift(m,0,1)|shift(m,0,-1)
    return n&~m

def font(sz,bold=True):
    p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    return ImageFont.truetype(p,sz)

def up(img,k): return img.pil().resize((img.w*k,img.h*k),Image.NEAREST)
