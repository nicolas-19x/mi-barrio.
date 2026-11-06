from sceneB_ground import *
from sceneB_build import *
from sceneB_props import *
from charsB import person,ALEX,ARIANA,ROSA
from dogB import renderB
from treeB import treeB
from flowB import bushB
def crop(img,h):
    o=Img(img.w,h); o.a[:]=img.a[:h]; return o
def grade(cv):
    H_,W_=cv.h,cv.w
    xs=np.linspace(0,1,W_)[None,:,None]; ys=np.linspace(0,1,H_)[:,None,None]
    warm=np.array([1.20,1.03,0.80]); cool=np.array([1.02,0.95,0.92])
    f=warm*(1-xs*0.7)+cool*(xs*0.7)
    a=cv.a*f
    l=a.mean(axis=2,keepdims=True)/255
    a=a+ (l**2)*np.array([30,14,-10])              # warm highlights
    a=a*(1-0.24*(1-l))+ (1-l)*np.array([-6,-4,10])  # cool, deeper shadows
    # soft light shafts from upper-left
    d=(np.arange(W_)[None,:]+np.arange(H_)[:,None]*0.9)
    shaft=(np.sin(d/38.0)**8)*(1-ys[:,:,0]*0.6)
    a=a+shaft[:,:,None]*np.array([22,13,2])
    # vignette
    vx=(xs-0.5)*2; vy=(ys-0.5)*2; v=1-0.16*(vx**2+vy**2)
    cv.a=np.clip(a*v,0,255)
def build():
    cv=Canvas(W,H); ground(cv)
    pul=pulperia(cv); ariana(cv); soda(cv)
    cv.blit(crop(person(ROSA),30),101,104)
    pulperia_front(cv,*pul)
    veranera(cv); toldo(cv)
    # awning shadow on sidewalk (sun from west → falls right/down)
    for y in range(150,172):
        for x in range(404,576):
            if x>404+(y-150)*0.9: cv.shadow[y,x]=1
    # props with cast shadows
    P=poste(); A=person(ALEX); B=person(ARIANA); D=renderB(); BN=bench(); BK=basket()
    CH=chair(); TB=table(); FL=farola(); BI=bin_(); EA=easel(); CR=crates(); GS=gas()
    items=[  # (img, x, y, base)
        (CR,44,152,178),(D,92,162,182),(BK,352,142,182),(P,364,-2,184),
        (A,252,136,182),(B,282,136,182),(EA,420,152,182),
        (CH,456,156,178),(TB,472,156,178),(CH,506,156,178),(GS,560,132,152),
        (BN,186,282,304),(FL,300,224,308),(BI,250,290,310)]
    for im,x,y,base in items:
        cv.cast(im,x,y,base,k=1.0,m=0.10)
    cv.apply_shadow((0.48,0.50,0.68))
    # tree first (its own long shadow), flowers, fallen mangoes
    for x,y in ((96,306),(130,312),(112,298),(150,304)): mango_fallen(cv,x,y)
    cv.blit(bushB(),338,276); cv.blit(bushB(seed=8,hib=((4,6,1),(18,2,0)),chav=((26,16),(8,19),(17,20),(32,20))),420,284)
    cv.blit(bushB(seed=12,hib=((10,4,1),),chav=((4,16),(16,18),(26,15),(30,20),(10,21))),510,280)
    for im,x,y,base in sorted(items,key=lambda t:t[3]):
        if im is BN: continue
        cv.blit(im,x,y)
        if im is EA: easel_text(cv,x,y)
    cv.blit(BN,186,282)
    cv.blit(treeB(),22,214)
    cables(cv)
    # sleeping z's over the dog
    for (x,y,n) in ((97,154,3),(103,146,4)):
        c=(240,232,214)
        for i in range(n): cv.px(x+i,y,c); cv.px(x+i,y+n-1,c)
        for i in range(1,n-1): cv.px(x+n-1-i,y+i,c)
    grade(cv)
    return cv
if __name__=='__main__':
    cv=build(); cv.save('sB.png',2); cv.save('sB1.png',1)
