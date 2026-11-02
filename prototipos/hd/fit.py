from PIL import Image
import colorsys
im=Image.open('nat.png').convert('RGBA');W,H=im.size;px=im.load()
# 1) quitar halo: píxeles claros y sin color pegados al vacío
for _ in range(2):
    kill=[]
    for y in range(H):
        for x in range(W):
            c=px[x,y]
            if not c[3]:continue
            h,s,v=colorsys.rgb_to_hsv(*[t/255 for t in c[:3]])
            edge=any(not(0<=x+a<W and 0<=y+b<H) or px[x+a,y+b][3]==0 for a,b in((1,0),(-1,0),(0,1),(0,-1)))
            if edge and s<.22 and v>.45:kill.append((x,y))
    for x,y in kill:px[x,y]=(0,0,0,0)
# 2) paleta limpia (quita mezclas de la compresión)
a=im.split()[3].point(lambda v:255 if v>0 else 0)
rgb=Image.new('RGB',im.size,(255,0,255));rgb.paste(im,(0,0),a)
q=rgb.quantize(colors=40,method=Image.Quantize.MAXCOVERAGE,dither=Image.Dither.NONE).convert('RGB')
im=Image.new('RGBA',(W,H),(0,0,0,0));im.paste(q,(0,0),a)
G=[[im.getpixel((x,y)) for x in range(W)] for y in range(H)]
# 3) quitar filas y columnas casi repetidas, protegiendo cara y ojos
def diff(r1,r2):return sum(sum(abs(p[i]-q2[i]) for i in range(4)) for p,q2 in zip(r1,r2))
QUOTA=[(0,10,1),(34,53,5),(53,77,6),(77,90,1)]   # zona: [desde, hasta), filas a quitar
def drop_rows(G,_):
    keep=list(range(len(G)));drop=set()
    for a,b,n in QUOTA:
        cand=[y for y in range(max(1,a),min(b,len(G)-1))]
        sc=sorted(cand,key=lambda y:diff(G[y],G[y-1])+diff(G[y],G[y+1])*.5)
        picked=[]
        for y in sc:
            if len(picked)>=n:break
            if y-1 in picked or y+1 in picked:continue   # no quitar filas vecinas
            picked.append(y)
        drop|=set(picked)
    return [G[y] for y in keep if y not in drop]
def T(G):return [list(r) for r in zip(*G)]
G=drop_rows(G,H-70)
Gc=T(G)
FACE_COLS=range(9,30)
for _ in range(W-33):
    best=None
    for x in range(1,len(Gc)-1):
        if x in FACE_COLS:continue
        d=diff(Gc[x],Gc[x-1])+diff(Gc[x],Gc[x+1])*.5
        if best is None or d<best[0]:best=(d,x)
    Gc.pop(best[1])
G=T(Gc);h=len(G);w=len(G[0])
out=Image.new('RGBA',(w,h),(0,0,0,0));op=out.load()
for y in range(h):
    for x in range(w):op[x,y]=G[y][x]
o=Image.new('RGBA',(w+2,h+2),(0,0,0,0));o.paste(out,(1,1));p=o.load();src=o.copy().load()
def dark(c):return c[3] and sum(c[:3])<190
for y in range(h+2):
    for x in range(w+2):
        if src[x,y][3]:continue
        nb=[src[x+a,y+b] for a,b in((1,0),(-1,0),(0,1),(0,-1)) if 0<=x+a<w+2 and 0<=y+b<h+2]
        if any(c[3] and not dark(c) for c in nb):p[x,y]=(34,22,28,255)
o.save('campesino.png');o.resize((o.width*8,o.height*8),Image.NEAREST).save('campesino_x8.png');print(o.size)
