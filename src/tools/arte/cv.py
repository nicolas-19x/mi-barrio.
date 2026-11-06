# float canvas helpers for scene B
import numpy as np, random, math
from PIL import Image
def C(h):
    if not isinstance(h,str): return np.array(h[:3],float)
    h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)
class Canvas:
    def __init__(s,w,h):
        s.w,s.h=w,h; s.a=np.zeros((h,w,3)); s.shadow=np.zeros((h,w))
    def px(s,x,y,c,al=1.0):
        x=int(x);y=int(y)
        if 0<=x<s.w and 0<=y<s.h:
            c=C(c) if isinstance(c,str) else np.array(c[:3],float)
            s.a[y,x]=s.a[y,x]*(1-al)+c*al
    def rect(s,x,y,w,h,c,al=1.0):
        x0,y0=max(0,int(x)),max(0,int(y)); x1,y1=min(s.w,int(x+w)),min(s.h,int(y+h))
        if x1<=x0 or y1<=y0: return
        c=C(c) if isinstance(c,str) else np.array(c,float)
        s.a[y0:y1,x0:x1]=s.a[y0:y1,x0:x1]*(1-al)+c*al
    def noise(s,x,y,w,h,c,var=5,seed=0,p=1.0,cols=None):
        rng=np.random.default_rng(seed)
        x0,y0=max(0,int(x)),max(0,int(y)); x1,y1=min(s.w,int(x+w)),min(s.h,int(y+h))
        if x1<=x0 or y1<=y0: return
        base=C(c); n=rng.integers(-var,var+1,(y1-y0,x1-x0,1))
        blk=base+n
        if p<1.0:
            m=rng.random((y1-y0,x1-x0))<p
            s.a[y0:y1,x0:x1][m]=blk[m]
        else: s.a[y0:y1,x0:x1]=blk
    def mul(s,x,y,w,h,f):
        x0,y0=max(0,int(x)),max(0,int(y)); x1,y1=min(s.w,int(x+w)),min(s.h,int(y+h))
        if x1>x0 and y1>y0: s.a[y0:y1,x0:x1]*=np.array(f,float)
    def blit(s,img,ox,oy):
        a=img.a if hasattr(img,'a') else img
        h,w=a.shape[:2]
        for y in range(h):
            Y=oy+y
            if not 0<=Y<s.h: continue
            for x in range(w):
                X=ox+x
                if 0<=X<s.w and a[y,x,3]:
                    al=a[y,x,3]/255; s.a[Y,X]=s.a[Y,X]*(1-al)+a[y,x,:3]*al
    def cast(s,img,ox,oy,base,k=0.95,m=0.12,minh=0):
        a=img.a if hasattr(img,'a') else img
        h,w=a.shape[:2]
        for y in range(h):
            for x in range(w):
                if a[y,x,3]>128:
                    Y=oy+y; X=ox+x; hh=base-Y
                    if hh<minh: continue
                    sx=X+hh*k; sy=base+hh*m
                    for d in (0,1):
                        xi,yi=int(sx+d*0.5),int(sy)
                        if 0<=xi<s.w and 0<=yi<s.h: s.shadow[yi,xi]=1
    def apply_shadow(s,tint=(0.52,0.55,0.70)):
        m=s.shadow>0
        s.a[m]*=np.array(tint); s.shadow[:]=0
    def save(s,path,k=1):
        im=Image.fromarray(np.clip(s.a,0,255).astype(np.uint8),'RGB')
        if k>1: im=im.resize((s.w*k,s.h*k),Image.NEAREST)
        im.save(path); return im
# 5x7 font
F5={
'A':[".###.","#...#","#...#","#####","#...#","#...#","#...#"],
'B':["####.","#...#","#...#","####.","#...#","#...#","####."],
'C':[".###.","#...#","#....","#....","#....","#...#",".###."],
'D':["####.","#...#","#...#","#...#","#...#","#...#","####."],
'E':["#####","#....","#....","####.","#....","#....","#####"],
'F':["#####","#....","#....","####.","#....","#....","#...."],
'I':["###",".#.",".#.",".#.",".#.",".#.","###"],
'L':["#....","#....","#....","#....","#....","#....","#####"],
'N':["#...#","##..#","##..#","#.#.#","#..##","#..##","#...#"],
'O':[".###.","#...#","#...#","#...#","#...#","#...#",".###."],
'P':["####.","#...#","#...#","####.","#....","#....","#...."],
'R':["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],
'S':[".###.","#...#","#....",".###.","....#","#...#",".###."],
'T':["#####","..#..","..#..","..#..","..#..","..#..","..#.."],
'U':["#...#","#...#","#...#","#...#","#...#","#...#",".###."],
' ':["..","..","..","..","..","..",".."],
}
F3={'C':["###","#..","#..","#..","###"],'A':[".#.","#.#","###","#.#","#.#"],'S':["###","#..","###","..#","###"],
    'D':["##.","#.#","#.#","#.#","##."],'O':["###","#.#","#.#","#.#","###"],'2':["###","..#","###","#..","###"],
    '5':["###","#..","###","..#","###"],'0':["###","#.#","#.#","#.#","###"],'8':["###","#.#","###","#.#","###"],
    'G':["###","#..","#.#","#.#","###"],'L':["#..","#..","#..","#..","###"],'P':["###","#.#","###","#..","#.."],
    'Y':["#.#","#.#",".#.",".#.",".#."],'F':["###","#..","##.","#..","#.."],'R':["##.","#.#","##.","#.#","#.#"],
    'E':["###","#..","##.","#..","###"],'J':["..#","..#","..#","#.#","###"],'T':["###",".#.",".#.",".#.",".#."],
    'I':["#","#","#","#","#"],'¢':[".#.","###","##.","###",".#."],' ':["..","..","..","..",".."]}
def text(cv,x,y,s,col,font=F5,acc=(),shadow=None):
    cx=x
    for i,ch in enumerate(s):
        g=font[ch]
        for j,r in enumerate(g):
            for k,c in enumerate(r):
                if c=='#':
                    if shadow: cv.px(cx+k+1,y+j+1,shadow)
                    cv.px(cx+k,y+j,col)
        if i in acc:
            w=len(g[0]); cv.px(cx+w//2+1,y-2,col); cv.px(cx+w//2,y-1,col)
        cx+=len(g[0])+1
    return cx-x
def twidth(s,font=F5): return sum(len(font[c][0])+1 for c in s)-1
