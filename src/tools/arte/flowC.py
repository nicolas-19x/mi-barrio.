from px import *
from dogC import C16
TUL="""
.K.K.K.
KHKMKMK
KHMMMSK
KHMMMSK
.KMMSK.
..KKK..
...G...
.GGG.D.
GGDGDD.
.D.G...
"""
def tulip(c):
    m={'K':'K','G':'G','D':'D'}
    m.update({'red':{'H':'O','M':'R','S':'b'},'yel':{'H':'W','M':'Y','S':'B'},'pnk':{'H':'W','M':'O','S':'p'}}[c])
    rows=TUL.strip('\n').split('\n'); im=Img(7,10)
    for y,r in enumerate(rows):
        for x,ch in enumerate(r):
            if ch!='.': im.px(x,y,C16[m[ch]])
    return im
def bedC(cols=('red','yel','red','pnk')):
    im=Img(30,15)
    for y in range(3,15):
        for x in range(30):
            e=(y==3 or y==14 or x==0 or x==29)
            if (x in(0,29)) and y in (3,14): continue
            im.px(x,y,C16['K'] if e else (C16['s'] if (x+y)%2==0 and y>10 else C16['S'] if y<=10 or (x*3+y)%4 else C16['s']))
    for i,c in enumerate(cols): im.blit(tulip(c),1+i*7,0+(i%2)*3)
    return im
def grassC(w,h):
    im=Img(w,h)
    for y in range(h):
        for x in range(w):
            h=(x*374761393+y*668265263)&0xffff; im.px(x,y,C16['D'] if (h%13==0 and (x+y)%2==0) else C16['G'])
    return im
