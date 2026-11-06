import sys
from px import *
def dump(img,pal):
    inv={hexc(v)[:3]:k for k,v in pal.items()}
    rows=[]
    for y in range(img.h):
        r=''
        for x in range(img.w):
            c=tuple(int(v) for v in img.a[y,x])
            r+= '.' if c[3]==0 else inv.get(c[:3],'?')
        rows.append(r)
    return rows
def load(rows,pal):
    w=max(len(r) for r in rows); img=Img(w,len(rows))
    for y,r in enumerate(rows):
        for x,ch in enumerate(r):
            if ch not in '. ': img.px(x,y,pal[ch])
    return img
