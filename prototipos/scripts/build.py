from PIL import Image
import colorsys, sys
sys.path.insert(0,'.')
from cells import get
HT=46
def clean(im):
    im=im.copy();px=im.load();W,H=im.size
    # quitar líneas de suelo grises (corridas horizontales largas de gris sin color)
    def gray(c):
        if c[3]==0:return False
        h,s,v=colorsys.rgb_to_hsv(*[x/255 for x in c[:3]]);return s<.2 and v<.65
    for y in range(H):
        x=0
        while x<W:
            if gray(px[x,y]):
                x2=x
                while x2<W and gray(px[x2,y]):x2+=1
                if x2-x>=8:
                    for xx in range(x,x2):px[xx,y]=(0,0,0,0)
                x=x2
            else:x+=1
    return im.crop(im.getbbox())
FR={'S':['t2','t1','t2','t3'],'N':['b2','b12','b3','b13'],'W':['b1b','b4','b1b','b6']}
raw={k:[clean(get(c)) for c in v] for k,v in FR.items()}
# reducir cada cuadro a la misma altura con buen filtro
from PIL import ImageEnhance, ImageFilter
def prep(f):
    a=f.split()[3];rgb=f.convert('RGB')
    rgb=ImageEnhance.Color(rgb).enhance(1.18);rgb=ImageEnhance.Contrast(rgb).enhance(1.15);rgb=ImageEnhance.Brightness(rgb).enhance(1.08)
    g=Image.merge('RGBA',(*rgb.split(),a));g=g.resize((max(1,round(f.width*HT/f.height)),HT),Image.LANCZOS)
    return g.filter(ImageFilter.UnsharpMask(radius=1,percent=60,threshold=2))
small={k:[prep(f) for f in v] for k,v in raw.items()}
# paleta compartida de 24 colores a partir de todos los cuadros
allf=[f for v in small.values() for f in v];tot=sum(f.width for f in allf)
strip=Image.new('RGB',(tot,HT),(255,0,255));x=0
for f in allf:
    bgc=Image.new('RGB',f.size,(255,0,255));bgc.paste(f,(0,0),f);strip.paste(bgc,(x,0));x+=f.width
pal=strip.quantize(colors=33,method=Image.Quantize.MAXCOVERAGE)
def px_art(f):
    a=f.split()[3].point(lambda v:255 if v>110 else 0)
    rgb=Image.new('RGB',f.size,(255,0,255));rgb.paste(f,(0,0),a)
    q=rgb.quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    out=Image.new('RGBA',f.size,(0,0,0,0));out.paste(q,(0,0),a)
    # contorno oscuro cálido alrededor de la silueta
    o=out.copy();op=o.load();ip=out.load();W,H=out.size
    for yy in range(H):
        for xx in range(W):
            if ip[xx,yy][3]:continue
            for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
                nx,ny=xx+dx,yy+dy
                if 0<=nx<W and 0<=ny<H and ip[nx,ny][3]:op[xx,yy]=(30,20,26,255);break
    return o
def frame(f):
    c=Image.new('RGBA',(32,48),(0,0,0,0));p=px_art(f)
    if p.width>32:p=p.crop(((p.width-32)//2,0,(p.width-32)//2+32,p.height))
    c.paste(p,((32-p.width)//2,48-1-p.height),p);return c
rows={k:[frame(f) for f in v] for k,v in small.items()}
rows['E']=[f.transpose(Image.FLIP_LEFT_RIGHT) for f in rows['W']]
sheet=Image.new('RGBA',(128,192),(0,0,0,0))
for r,k in enumerate(['S','N','W','E']):
    for c,f in enumerate(rows[k]):sheet.paste(f,(c*32,r*48),f)
sheet.save('tico_sheet.png');sheet.resize((512,768),Image.NEAREST).save('tico_sheet_x4.png')
print('ok',[[f.size for f in v] for v in small.values()])
