from px import *
from dump import load
from dogA_grid import DOG_A,PA
from dogB import renderB
from dogC import renderC,C16
from stampA import clumpA
from flowB import bushB
from flowC import bedC,grassC
from treeA2 import treeA2
from treeB import treeB
from treeC import treeC
def x2(im):
    o=Img(im.w*2,im.h*2)
    for y in range(im.h):
        for x in range(im.w):
            c=im.a[y,x]
            if c[3]:
                for dy in (0,1):
                    for dx in (0,1): o.a[y*2+dy,x*2+dx]=c
    return o
def panel(im,bg,pad,k,bgfn=None):
    b=Img(im.w+pad*2,im.h+pad*2)
    if bgfn: b.blit(bgfn(b.w,b.h),0,0)
    else: b.rect(0,0,b.w,b.h,bg)
    b.blit(im,pad,pad); return b.pil().resize((b.w*k,b.h*k),Image.NEAREST)
def sheet(title,sub,items,out,theme):
    bgc,fg=theme
    K=5
    ims=[(lab,panel(*args)) for lab,args in items]
    W=max(sum(i.width for _,i in ims)+40*(len(ims)+1),1500); H=max(i.height for _,i in ims)+190
    S=Image.new('RGB',(W,H),bgc); d=ImageDraw.Draw(S)
    d.text((40,28),title,fill=fg,font=font(40)); d.text((40,84),sub,fill=fg,font=font(21,False))
    x=40
    for lab,i in ims:
        S.paste(i,(x,140)); d.text((x,140+i.height+10),lab,fill=fg,font=font(22)); x+=i.width+40
    S.save(out)
def sidewalkA(w,h):
    im=Img(w,h)
    for y in range(h):
        for x in range(w): im.px(x,y,'#c8beb0' if (x%16 and y%16) else '#a89c8c')
    return im
def grassA(w,h):
    im=Img(w,h); im.rect(0,0,w,h,'#6cb84a')
    for y in range(h):
        for x in range(w):
            hh=(x*73856093^y*19349663)&1023
            if hh<14: im.px(x,y,'#4aa83a'); im.px(x,y-1,'#4aa83a')
            elif hh<20: im.px(x,y,'#8ad05a')
    return im
def sidewalkB(w,h):
    im=Img(w,h); rng=random.Random(2)
    for y in range(h):
        for x in range(w):
            v=rng.randint(-6,6); im.px(x,y,(176+v,166+v,148+v,255))
            if x%32==0 or y%32==0: im.px(x,y,(140,130,116,255))
    return im
def grassB(w,h):
    im=Img(w,h); rng=random.Random(5)
    cols=['#64803c','#6a8640','#708a44','#62803c','#74904a']
    for y in range(h):
        for x in range(w): im.px(x,y,cols[rng.randint(0,4)] if rng.random()<0.12 else '#6a8640')
    return im
def sidewalkC(w,h):
    im=Img(w,h)
    for y in range(h):
        for x in range(w): im.px(x,y,'#b8b0d0' if ((x+12)%48<2 or (y+40)%48<2) else (C16['g'] if (x//2+y//2)%2 and (x//2*7+y//2*3)%11==0 else C16['W'] if False else '#d8d0e0'))
    return im
def g2(w,h): return x2(grassC((w+1)//2,(h+1)//2))
if __name__=='__main__':
    dogA=load(DOG_A.strip('\n').split('\n'),PA)
    sheet('A · Barrio cálido — piezas','Contorno oscuro de color, sombreado plano de 3 tonos, formas redondeadas. 32 px por casilla. Perro y flores ×9, árbol ×5.',
      [('Perro (zaguate caramelo)',(dogA,None,6,9,sidewalkA)),('Flores (cantero)',(clumpA(0,('red','yel','red')),None,4,9,grassA)),('Palo de mango',(treeA2(),None,4,5,grassA))],
      'piezas_A.png',('#2b1d14','#fbe9cc'))
    sheet('B · Cinematográfico — piezas','Sin contornos, rampas de 7-10 tonos, luz de tarde desde el oeste y sombras largas. 32 px por casilla. Perro y flores ×9, árbol ×5.',
      [('Perro (zaguate negro y fuego)',(renderB(),None,6,9,sidewalkB)),('Flores (amapolas y\nchavelitas)',(bushB(),None,4,9,grassB)),('Palo de mango',(treeB(),None,4,5,grassB))],
      'piezas_B.png',('#1b1a1f','#e8dcc4'))
    sheet('C · Retro 16 bits — piezas','Píxel doble (16 px por casilla, ampliado ×2), 16 colores fijos, tramado, contorno negro. Perro y flores ×9, árbol ×5.',
      [('Perro (con collar)',(x2(renderC()),None,6,9,sidewalkC)),('Flores (tulipanes\nen jardinera)',(x2(bedC()),None,4,9,g2)),('Palo de mango',(x2(treeC()),None,4,5,g2))],
      'piezas_C.png',('#101018','#f8f8f0'))
