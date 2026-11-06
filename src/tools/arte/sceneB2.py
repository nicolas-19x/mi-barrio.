import sceneB_build as SB
from sceneB_ground import *
from sceneB_build import *
from sceneB_props import *
from charsB import person,ALEX,ARIANA,ROSA
from dogB import renderB
from treeB import treeB
from flowB import bushB
def crop(img,h):
    o=Img(img.w,h); o.a[:]=img.a[:h]; return o
def flip(img):
    o=Img(img.w,img.h); o.a[:]=img.a[:,::-1]; return o

POLE_X=364
# light sources: (x,y,colour,radius,intensity,ysquash)
LIGHTS={
 'pul_in':(119,120,'#ffcf8a',70,1.5,1.0),
 'pul_spill':(119,166,'#ffc27a',96,1.15,2.0),
 'lamp_ari':(302,112,'#ffe0a0',62,1.0,1.3),
 'farola':(310,296,'#ffe6b0',80,1.25,1.7),
 'farola_head':(310,232,'#fff0c8',26,0.9,1.0),
 'sodio':(398,214,'#ffab4a',130,1.30,1.9),
 'sodio_head':(398,63,'#ffc070',20,1.0,1.0),
 'soda':(482,166,'#ffd89a',96,1.05,2.2),
 'win_pul':(134,56,'#ffcf8a',34,0.55,1.0),
 'win_bal':(292,64,'#ffd29a',50,0.6,1.0),
 'win_soda':(424,55,'#ffd29a',34,0.5,1.0),
}
LIT_WINDOWS={'win120','balcon','win410','pulperia','ventana_ari'}

def light_pass(cv,albedo,ambient,keys,k=1.0):
    H_,W_=cv.h,cv.w
    L=np.ones((H_,W_,3))*np.array(ambient)
    yy,xx=np.mgrid[0:H_,0:W_]
    for key in keys:
        x,y,col,rad,inten,sq=LIGHTS[key]
        d=np.sqrt((xx-x)**2+((yy-y)*sq)**2)
        f=np.clip(1-d/rad,0,1)**2*inten*k
        L+=f[:,:,None]*(C(col)/255)
    cv.a=albedo*L
def emissive(cv,albedo,pre,names,glow='#ffcf8a',k=1.0):
    g=C(glow)/255
    for (name,x,y,w,h) in SB.EMIT:
        if name not in names: continue
        reg=albedo[y:y+h,x:x+w]; p=pre[y:y+h,x:x+w]
        same=np.abs(reg-p).sum(axis=2)<2          # not covered by later objects
        lum=reg.mean(axis=2)
        m=same&(lum>40)
        lit=np.minimum(255,reg*g*1.55*k+np.array([30,18,4])*k)
        cur=cv.a[y:y+h,x:x+w]
        cur[m]=np.maximum(cur[m],lit[m])
def bloom(cv,x,y,col,r,k):
    yy,xx=np.mgrid[0:cv.h,0:cv.w]; d=np.sqrt((xx-x)**2+(yy-y)**2)
    cv.a+=(np.clip(1-d/r,0,1)**2*k)[:,:,None]*C(col)

def grade_day(cv):
    H_,W_=cv.h,cv.w
    xs=np.linspace(0,1,W_)[None,:,None]; ys=np.linspace(0,1,H_)[:,None,None]
    warm=np.array([1.20,1.03,0.80]); cool=np.array([1.02,0.95,0.92])
    a=cv.a*(warm*(1-xs*0.7)+cool*(xs*0.7))
    l=a.mean(axis=2,keepdims=True)/255
    a=a+(l**2)*np.array([30,14,-10])
    a=a*(1-0.24*(1-l))+(1-l)*np.array([-6,-4,10])
    d=(np.arange(W_)[None,:]+np.arange(H_)[:,None]*0.9)
    shaft=(np.sin(d/38.0)**8)*(1-ys[:,:,0]*0.6)
    a=a+shaft[:,:,None]*np.array([22,13,2])
    vx=(xs-0.5)*2; vy=(ys-0.5)*2
    cv.a=np.clip(a*(1-0.16*(vx**2+vy**2)),0,255)
def grade_night(cv):
    xs=np.linspace(-1,1,cv.w)[None,:,None]; ys=np.linspace(-1,1,cv.h)[:,None,None]
    a=cv.a
    l=a.mean(axis=2,keepdims=True)/255
    a=a+(1-l)**3*np.array([0,4,14])
    cv.a=np.clip(a*(1-0.30*(xs**2+ys**2)),0,255)
def grade_rain(cv):
    xs=np.linspace(-1,1,cv.w)[None,:,None]; ys=np.linspace(-1,1,cv.h)[:,None,None]
    a=cv.a; l=a.mean(axis=2,keepdims=True)
    a=a*0.80+l*0.20                      # desaturate
    a=a*np.array([0.96,1.0,1.06])
    cv.a=np.clip(a*(1-0.22*(xs**2+ys**2)),0,255)

def wet(cv):
    # darker, more contrasted wet ground; water in cunetas and bigger puddles
    cv.a[FAC:PK]*=np.array([0.70,0.72,0.78]); cv.a[PK:]*=np.array([0.82,0.86,0.86])
    rng=random.Random(7)
    for y in range(CURB+6,CURB+12):          # water running along the cuneta
        for x in range(W): cv.a[y,x]=cv.a[y,x]*0.55+C('#5a6878')*0.45
    for y in range(ST1+1,ST1+5):
        for x in range(W): cv.a[y,x]=cv.a[y,x]*0.55+C('#5a6878')*0.45
    for (cx,cy,rx,ry) in ((252,232,22,9),(520,214,15,7),(372,248,12,5),(120,240,10,4),(60,226,14,5)):
        for y in range(int(cy-ry),int(cy+ry)+1):
            for x in range(int(cx-rx),int(cx+rx)+1):
                d=((x-cx)/rx)**2+((y-cy)/ry)**2+0.15*math.sin(x*0.9+y)
                if d<1: cv.a[y,x]=C('#4e5a6a')*(0.9+0.1*rng.random())
        for r in (0.35,0.7):     # ripple rings
            for a in range(0,360,12):
                t=math.radians(a); X=int(cx+rx*r*math.cos(t)); Y=int(cy+ry*r*math.sin(t))
                cv.a[Y,X]=cv.a[Y,X]*0.6+C('#9aa8b8')*0.4
def reflections(cv,src,k_side=0.30,k_st=0.22):
    # mirror the lit facades into wet sidewalk/street (top-down 3/4 wet look)
    out=cv.a.copy()
    for y in range(FAC,ST1+8):
        d=y-FAC; sy=FAC-1-int(d*0.9)
        if sy<0: break
        k=(k_side if y<CURB else k_st)*(1-d/120)
        jit=int(2*math.sin(y*1.7))
        row=np.roll(src[sy],jit,axis=0)
        out[y]=out[y]+row*k*(0.6+0.4*(row.mean(axis=1,keepdims=True)/255))
    cv.a=out
def streaks(cv,lights_xy,rng):
    # long vertical light streaks on the wet street (classic rain-night look)
    for (x,y0,col,inten) in lights_xy:
        c=C(col)
        for y in range(y0,min(cv.h,y0+90)):
            t=(y-y0)/90
            for dx in range(-3,4):
                if rng.random()<0.75:
                    k=inten*(1-t)**1.5*(1-abs(dx)/4)
                    cv.a[y,x+dx+rng.randint(-1,1)]+=c*k*0.5
def rain(cv,rng,n=900):
    for i in range(n):
        x=rng.uniform(-20,cv.w); y=rng.uniform(-10,cv.h); L=rng.randint(4,8)
        a=rng.uniform(0.18,0.40)
        for t in range(L): cv.px(x+t*0.35,y+t,(200,214,232),a*(0.5+0.5*t/L))
    for i in range(160):   # splashes on ground
        x=rng.randint(0,cv.w-3); y=rng.randint(FAC+2,cv.h-2)
        cv.px(x,y,(210,220,235),0.45); cv.px(x+2,y,(210,220,235),0.45); cv.px(x+1,y-1,(220,230,240),0.35)
    for x in range(394,572,7):   # drips from awning edge
        for t in range(rng.randint(3,9)): cv.px(x+rng.randint(0,2),150+t*2,(210,220,235),0.5)

HERO=None
NO_CHARS=False
NOGRADE=False
def build(mode='tarde'):
    SB.EMIT.clear()
    cv=Canvas(W,H); ground(cv)
    pul=pulperia(cv); ariana(cv); soda(cv)
    pre=cv.a.copy()
    cv.blit(crop(person(ROSA),30),101,104)
    pulperia_front(cv,*pul)
    veranera(cv); toldo(cv)
    if mode=='lluvia': wet(cv)
    P=poste(); A=person(ALEX); B=person(ARIANA); D=renderB(); BN=bench(); BK=basket()
    CH=chair(); TB=table(); FL=farola(); BI=bin_(); EA=easel(); CR=crates(); GS=gas(); BIKE=bike()
    items=[(CR,44,152,178),(BIKE,4,150,174),(BK,352,142,182),(P,POLE_X,-2,184),
           *([] if NO_CHARS else ([(A,252,136,182),(B,282,136,182)] if HERO is None else [(HERO,262,129,182)])),(CH,456,156,178),(TB,472,156,178),(CH,506,156,178),(GS,560,132,152),
           (BN,186,282,304),(FL,300,224,308),(BI,250,290,310)]
    if mode=='lluvia': items+=[(D,404,160,180)]          # dog took shelter under the toldo
    else: items+=[(D,92,162,182),(EA,420,152,182)]
    if mode=='tarde':
        for y in range(150,172):
            for x in range(404,576):
                if x>404+(y-150)*0.9: cv.shadow[y,x]=1
        for im,x,y,base in items: cv.cast(im,x,y,base,k=1.0,m=0.10)
        cv.apply_shadow((0.48,0.50,0.68))
    else:   # soft contact shadows only (no sun)
        for im,x,y,base in items:
            for xx in range(x+2,x+im.w-2):
                for d in (0,1,2): cv.mul(xx,base-1+d,1,1,[0.72+0.09*d]*3)
    for x,y in ((96,306),(130,312),(112,298),(150,304),(176,309)): mango_fallen(cv,x,y)
    cv.blit(bushB(),338,276); cv.blit(bushB(seed=8,hib=((4,6,1),(18,2,0)),chav=((26,16),(8,19),(17,20),(32,20))),420,284)
    cv.blit(bushB(seed=12,hib=((10,4,1),),chav=((4,16),(16,18),(26,15),(30,20),(10,21))),510,280)
    for im,x,y,base in sorted(items,key=lambda t:t[3]):
        if im is BN: continue
        cv.blit(im,x,y)
        if im is EA: easel_text(cv,x,y)
    cv.blit(BN,186,282)
    if mode=='lluvia':
        for t in range(26): cv.px(281-t*0.2,142+t,'#2a2a2a')   # shaft down to Alex's hand
        cv.blit(umbrella(),251,121)
    cv.blit(treeB(s=1.3,shadow=(mode=='tarde')),2,186)
    cables(cv)
    if mode=='tarde':
        for (x,y,n) in ((97,154,3),(103,146,4)):
            c=(240,232,214)
            for i in range(n): cv.px(x+i,y,c); cv.px(x+i,y+n-1,c)
            for i in range(1,n-1): cv.px(x+n-1-i,y+i,c)
        if not NOGRADE: grade_day(cv)
        return cv
    albedo=cv.a.copy()
    if mode=='noche':
        keys=list(LIGHTS.keys())
        light_pass(cv,albedo,(0.17,0.21,0.40),keys)
        emissive(cv,albedo,pre,LIT_WINDOWS)
        lit=cv.a.copy()
        for x in range(398,570,16):                       # bulb string under the toldo
            cv.px(x,149,'#fff2c0'); cv.px(x+1,149,'#ffe090'); bloom(cv,x,149,'#ffc070',7,0.35)
        bloom(cv,310,232,'#ffe0a0',18,0.6); bloom(cv,302,108,'#ffd090',10,0.5); bloom(cv,398,64,'#ffa040',26,0.7)
        for i in range(10):                               # moths around the farola
            r=random.Random(i); cv.px(310+r.randint(-12,12),232+r.randint(-14,10),(255,240,210))
        # stars of fireflies over the park
        r=random.Random(4)
        for i in range(9):
            x=r.randint(20,570); y=r.randint(282,316); cv.px(x,y,(220,255,140)); bloom(cv,x,y,'#c8ff80',4,0.25)
        grade_night(cv)
    else:
        keys=['pul_in','pul_spill','lamp_ari','farola','farola_head','sodio','sodio_head','soda','win_pul','win_bal']
        light_pass(cv,albedo,(0.50,0.54,0.66),keys,k=0.75)
        emissive(cv,albedo,pre,{'pulperia','win120','balcon','ventana_ari'},k=0.85)
        src=cv.a.copy()
        reflections(cv,src)
        rng=random.Random(9)
        streaks(cv,[(119,186,'#ffc27a',0.55),(398,200,'#ffab4a',0.8),(310,300,'#ffe6b0',0.4),(482,186,'#ffd89a',0.45),(302,186,'#ffe0a0',0.3)],rng)
        bloom(cv,310,232,'#ffe0a0',14,0.45); bloom(cv,398,64,'#ffa040',20,0.5)
        rain(cv,rng)
        grade_rain(cv)
    cv.a=np.clip(cv.a,0,255)
    return cv
if __name__=='__main__':
    import sys
    for m in (sys.argv[1:] or ['tarde','noche','lluvia']):
        cv=build(m); cv.save(f'escena_B_{m}_1x.png'); cv.save(f'escena_B_{m}_2x.png',2)
