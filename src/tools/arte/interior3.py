from interior2 import *
def rug(cv,x0=150,y0=150,w=150,h=84):
    for y in range(y0,y0+h):
        for x in range(x0,x0+w):
            u=(x-x0)/w; v=(y-y0)/h; e=min(u,v,1-u,1-v)
            if e<0.04: c='#6a2a2a'
            elif e<0.07: c='#d8b070'
            elif e<0.13: c='#8e3a3a' if ((x+y)//3)%2 else '#7a3030'
            elif e<0.15: c='#d8b070'
            else:
                du=abs(u-0.5); dv=abs(v-0.5)
                c='#c8a060' if abs(du*1.8+dv*3-0.5)<0.03 else '#9a3c3c'
            cv.px(x,y,shade(c,0.95+0.05*((x*7+y*3)%5)/5))
    for x in range(x0,x0+w,3): cv.px(x,y0-1,'#e8d8b0'); cv.px(x+1,y0+h,'#e8d8b0')   # fringe
def sofa(cv,x0=160,y0=102,w=132):
    """3-seat sofa seen from behind (it faces the TV): seat cushions beyond,
    rounded backrest roll, back panel, rolled armrests, feet, shadows."""
    G=['#1c3428','#244032','#2e4e3e','#3a5e4c','#4a705c','#5e8670','#7aa088','#9cbca6']
    def px(x,y,k): cv.px(x,y,G[max(0,min(7,k))])
    ax=12                                   # armrest width
    # cast shadow on the floor/rug (light from upper-left)
    for k in range(6): cv.mul(x0+6+k,y0+50+k//2,w,1,[0.62+0.06*k]*3)
    for k in range(6): cv.mul(x0+w+k,y0+12+k,1,40,[0.66+0.06*k]*3)
    # seat cushions (far side, partly hidden by the backrest)
    cw=(w-2*ax)//3
    for i in range(3):
        cx=x0+ax+i*cw
        for y in range(y0,y0+12):
            for x in range(cx,cx+cw):
                u=(x-cx)/(cw-1); v=(y-y0)/11
                k=4+(1 if v<0.35 else 0)-(1 if v>0.8 else 0)-(1 if u>0.9 else 0)+(1 if u<0.08 else 0)
                px(x,y,k)
        cv.rect(cx,y0,cw,1,G[6])
        cv.rect(cx+cw-1,y0+1,1,11,G[2])                    # seam between cushions
    # backrest top roll (cylinder lit from upper-left)
    for y in range(y0+10,y0+20):
        v=(y-(y0+10))/9
        prof=math.cos((v-0.35)*math.pi*0.9)                # brightest a bit above centre
        for x in range(x0+ax-2,x0+w-ax+2):
            k=int(round(2+prof*4.4))
            if x<x0+ax+3: k+=1
            px(x,y,k)
    # back panel (faces the camera) with gentle tufting
    for y in range(y0+20,y0+44):
        v=(y-(y0+20))/23
        for x in range(x0+ax-2,x0+w-ax+2):
            k=int(round(4.2-v*2.6))
            u=(x-(x0+ax))%((w-2*ax)//3)
            if u in (0,1): k-=1                            # vertical seams
            if (y-y0-26)%10==0 and (u-cw//2)**2<2: k-=2      # tufting buttons
            px(x,y,k)
    cv.rect(x0+ax-2,y0+20,w-2*ax+4,1,G[2])                 # crease under the roll
    # rolled armrests (both ends): rounded top + front face
    for side in (0,1):
        sx=x0 if side==0 else x0+w-ax
        for y in range(y0+2,y0+46):
            for x in range(sx,sx+ax):
                u=(x-sx)/(ax-1)
                if y<y0+12:                                # top of the arm roll
                    prof=math.cos((u-0.35)*math.pi*0.95)
                    k=int(round(2.5+prof*4.2))
                    if y==y0+2 and (u<0.12 or u>0.88): continue
                else:                                      # front face of the arm
                    v=(y-(y0+12))/33
                    k=int(round(4.0-v*2.4-(1.4 if u>0.8 else 0)+(0.8 if u<0.15 else 0)))
                px(x,y,k)
        cv.rect(sx,y0+12,ax,1,G[2])
        for xx in range(sx+1,sx+ax-1): px(xx,y0+11,6 if side==0 else 5)
    # wooden feet + contact shadow
    for fx in (x0+3,x0+w-7,x0+ax+cw*3//2-2):
        cv.rect(fx,y0+46,4,4,'#3a2414'); cv.px(fx,y0+46,'#6a4426')
    cv.rect(x0+1,y0+45,w-2,1,G[0])
    # lace doily draped over the backrest roll
    from furn import lace
    lace(cv,x0+30,y0+11,68,12)
    # loose cushion on the far seat, leaning on the arm
    for y in range(y0-2,y0+9):
        for x in range(x0+w-ax-20,x0+w-ax-4):
            u=(x-(x0+w-ax-20))/15; v=(y-(y0-2))/10
            if (u-0.5)**2/0.25+(v-0.5)**2/0.3<1:
                c=shade('#e8c860',1.15-0.35*v-0.15*u); cv.px(x,y,c)
def mecedora(cv,x=130,y=236):
    Wd=['#3e2414','#5a3420','#7a4a2e','#9a6640']
    cv.mul(x-2,y+1,40,3,(0.6,0.6,0.66))
    for k,lx in enumerate((x+1,x+33)):            # curved rockers (side runners)
        for t in range(-6,30):
            cv.px(lx,y-t*0.0+0-(0 if t<0 else 0)+(t>20)*0,Wd[1])
    for t in range(0,40):
        yy=y-int(2.5*math.sin(t/40*math.pi))
        cv.px(x-2+t,yy,Wd[1]); cv.px(x-2+t,yy-1,Wd[2])
    for lx in (x+2,x+32): cv.rect(lx,y-14,2,13,Wd[1])
    cv.rect(x+2,y-20,32,7,Wd[2]); cv.rect(x+2,y-20,32,1,Wd[3])        # seat front rail
    for xx in range(x+4,x+32):                                         # rattan seat
        for yy in range(y-28,y-20): cv.px(xx,yy,'#d8b070' if (xx+yy)%3 else '#a8804a')
    cv.rect(x+2,y-60,3,40,Wd[2]); cv.rect(x+31,y-60,3,40,Wd[1])       # back posts
    cv.rect(x+2,y-62,32,4,Wd[3]); cv.rect(x+2,y-62,32,1,'#b8845a')
    for xx in range(x+5,x+31):                                         # woven back
        for yy in range(y-58,y-30): cv.px(xx,yy,'#dcb878' if ((xx-yy)%4 and (xx+yy)%4) else '#9a7444')
    cv.rect(x-2,y-36,6,3,Wd[3]); cv.rect(x+32,y-36,6,3,Wd[2])          # armrests
    cv.rect(x-1,y-33,2,14,Wd[1]); cv.rect(x+35,y-33,2,14,Wd[0])
    cv.rect(x+10,y-44,16,14,'#c85a4a'); cv.rect(x+10,y-44,16,2,'#e07a68'); cv.rect(x+24,y-44,2,14,'#9a3e34')  # cushion
def fan(cv,x=306,y=150):
    cv.rect(x-6,y-1,13,3,'#3a3a3e'); cv.rect(x,y-40,2,40,'#8a8a90'); cv.rect(x+2,y-40,1,40,'#5a5a60')
    for yy in range(y-60,y-38):
        for xx in range(x-11,x+13):
            d=math.hypot(xx-x-1,yy-(y-49))
            if d<11:
                ring=abs(d-10.4)<0.6 or abs(d-6)<0.5 or (abs(xx-x-1)<1 or abs(yy-(y-49))<1)
                if ring: cv.px(xx,yy,'#d8dce0')
                elif d<3: cv.px(xx,yy,'#3a7ac0')
                else: cv.px(xx,yy,(150,190,220),0.25)
def dining(cv,x0=372,y0=176,w=88,h=40):
    from furn import box
    WD=['#3e2414','#5a3420','#7a4a2e','#9a6640','#b8845a']
    def back_chair(x,y):       # behind the table, facing camera: only the backrest shows
        for k in range(3): cv.mul(x+20+k,y-20+k,1,20,[0.75+0.08*k]*3)
        cv.rect(x,y-24,20,3,WD[3]); cv.rect(x,y-24,20,1,WD[4]); cv.rect(x,y-21,20,2,WD[1])   # top rail (top + front)
        for k in (x+1,x+17): cv.rect(k,y-24,2,24,WD[2]); cv.px(k,y-24,WD[4])
        for k in (x+6,x+10,x+14): cv.rect(k-1,y-19,2,12,WD[2]); cv.px(k-1,y-19,WD[3])
        cv.rect(x,y-8,20,2,WD[1])
    def front_chair(x,y):      # in front of the table, seen from behind
        for k in range(4): cv.mul(x+3,y+28+k,20,1,[0.6+0.1*k]*3)
        for k in range(4): cv.mul(x+20+k,y+4+k,1,24,[0.7+0.07*k]*3)
        # seat top face with red cushion
        cv.rect(x,y,20,9,WD[3]); cv.rect(x,y,20,1,WD[4])
        for yy in range(y+1,y+8):
            for xx in range(x+2,x+18):
                v=(yy-y-1)/6; u=(xx-x-2)/15
                cv.px(xx,yy,shade('#c83a3a',1.18-0.3*v-0.12*u))
        cv.rect(x,y+9,20,2,WD[1])                                   # seat front edge
        # backrest (closest to camera): top rail top face + front, spindles
        cv.rect(x,y+10,20,3,WD[3]); cv.rect(x,y+10,20,1,WD[4]); cv.rect(x,y+13,20,2,WD[1])
        for k in (x+1,x+17): cv.rect(k,y+10,2,19,WD[2]); cv.px(k,y+10,WD[4]); cv.rect(k+1,y+11,1,18,WD[1])
        for k in (x+6,x+10,x+14): cv.rect(k-1,y+15,2,9,WD[2])
        cv.rect(x,y+24,20,2,WD[2]); cv.rect(x,y+24,20,1,WD[3])
        for k in (x+1,x+17): cv.rect(k,y+26,2,3,WD[1])
    back_chair(x0+12,y0+4); back_chair(x0+56,y0+4)
    # table: cloth-covered top face + hanging cloth with folds + legs
    for k in range(5): cv.mul(x0+w+k,y0+6+k,1,h+10,[0.68+0.06*k]*3)
    for k in range(4): cv.mul(x0+4,y0+h+14+k,w,1,[0.6+0.1*k]*3)
    for y in range(y0,y0+h):
        for x in range(x0,x0+w):
            c=C('#f8f4ec')*(0.93+0.07*(y-y0)/h)
            h_=(x*7+y*13)%37
            if h_ in (0,1): c=C('#e86a7a')
            elif h_==2: c=C('#f2a0aa')
            elif h_==5 and (x+y)%3==0: c=C('#6aa05a')
            cv.a[y,x]=c
    cv.rect(x0,y0,w,1,'#ffffff'); cv.rect(x0,y0,1,h,'#ffffff')
    for x in range(x0,x0+w):
        f=0.84+0.12*math.sin((x-x0)*0.55)
        L=8+int(1.5*math.sin(x*0.35))
        for j in range(L):
            c='#e86a7a' if (x*7+j*13)%17==0 else '#f4f0e6'
            cv.px(x,y0+h+j,shade(c,f-0.025*j))
        cv.px(x,y0+h+L,'#d8d0c4')
    cv.rect(x0,y0+h,w,1,'#d8d0c4')
    for lx in (x0+4,x0+w-7): cv.rect(lx,y0+h+8,3,8,WD[1]); cv.px(lx,y0+h+8,WD[3])
    # things on the table (each with its own little shadow)
    def thing_shadow(x,y,w_): cv.mul(x+2,y,w_,2,(0.78,0.78,0.82))
    thing_shadow(x0+10,y0+24,10); cv.rect(x0+10,y0+8,10,16,'#c03a30'); cv.rect(x0+10,y0+8,3,16,'#e86a5a'); cv.rect(x0+18,y0+8,2,16,'#8a2a22'); cv.rect(x0+11,y0+5,8,3,'#2a2a2a'); cv.rect(x0+11,y0+5,8,1,'#5a5a5a')
    for (cx,cy) in ((x0+30,y0+20),(x0+64,y0+14)):
        thing_shadow(cx,cy+6,7); cv.rect(cx,cy,7,6,'#f6f6f2'); cv.rect(cx,cy,7,1,'#ffffff'); cv.rect(cx+1,cy+1,5,2,'#5a3a22'); cv.rect(cx+7,cy+2,2,2,'#e8e8e4'); cv.rect(cx+6,cy,1,6,'#c8c8c4')
    thing_shadow(x0+46,y0+21,12); cv.rect(x0+46,y0+12,12,9,'#b05a34'); cv.rect(x0+46,y0+12,3,9,'#d07a50'); cv.rect(x0+56,y0+12,2,9,'#8a4428'); cv.rect(x0+45,y0+11,14,2,'#c86a42')
    rng=random.Random(5)
    for t in range(50):
        a=rng.uniform(-math.pi,0); r=rng.uniform(2,8); cv.px(x0+52+math.cos(a)*r,y0+9+math.sin(a)*r*0.8,['#2e6a3a','#4a8a4a','#6aa85a','#86c06a'][int((-a)/math.pi*3.99)])
    thing_shadow(x0+72,y0+30,4); cv.rect(x0+72,y0+24,4,6,'#f0f0f0'); cv.rect(x0+72,y0+23,4,1,'#a0a0a0')
    front_chair(x0+12,y0+h+4); front_chair(x0+56,y0+h+4)
def plant(cv,x,y,seed):
    rng=random.Random(seed)
    for k in range(4): cv.mul(x+9+k,y-12+k,1,12,[0.7+0.07*k]*3)
    for yy in range(y-14,y):
        for xx in range(x-9,x+9):
            u=(xx-x+9)/17; cv.px(xx,yy,shade('#b05a34',1.25-0.6*u-0.15*(yy-y+14)/14))
    cv.rect(x-10,y-17,20,4,'#c87048'); cv.rect(x-10,y-17,20,1,'#e0906a'); cv.rect(x-8,y-16,16,2,'#3a2418')
    cv.mul(x-9,y,18,3,(0.6,0.6,0.66))
    G=['#1e3a22','#2c5230','#3e6a38','#5a8640','#7aa04a']
    for i in range(26):
        a=rng.uniform(-math.pi*0.95,-math.pi*0.05); L=rng.uniform(10,22)
        ex=x+math.cos(a)*L; ey=y-16+math.sin(a)*L*0.9
        for t in range(int(L)):
            f=t/L; px_=x+(ex-x)*f; py_=y-16+(ey-y+16)*f
            wdt=int(2.6*math.sin(f*math.pi))
            for k in range(-wdt,wdt+1):
                lit=2+(1 if k<0 else -1)+(1 if a<-math.pi/2 else 0)
                cv.px(px_+k*0.6,py_+k*0.3,G[max(0,min(4,lit))])
def cat(cv,x,y,S=1.6):
    O=['#2e2e34','#4a4a52','#6a6a74','#8e8e98','#b0b0b8']
    cv.mul(x-16,y+int(6*S)-1,32,3,(0.7,0.7,0.75))
    for yy in range(int(-6*S),int(6*S)+1):
        for xx in range(int(-10*S),int(10*S)+1):
            d=(xx/(10*S))**2+(yy/(6*S))**2
            if d<1:
                lit=-(xx*0.5+yy)/(7*S); k=int(np.clip(2+lit*2,0,4))
                if (xx+40)%5==0 and d<0.75 and yy<3: k=max(0,k-2)      # tabby stripes
                cv.px(x+xx,y+yy,O[k])
    for t in range(22):   # tail wrapped around the front
        a=math.pi*0.1+t/22*math.pi*0.85; X=x+math.cos(a)*10*S; Y=y+math.sin(a)*6.3*S
        cv.px(X,Y,O[1]); cv.px(X,Y-1,O[3]); cv.px(X+1,Y-1,O[2])
    hx,hy=x-int(7*S),y-int(2*S)
    for yy in range(-5,5):
        for xx in range(-7,7):
            if (xx/7)**2+(yy/5)**2<1: cv.px(hx+xx,hy+yy,O[3] if yy<0 else O[2])
    for ex in (-6,3):     # ears
        cv.px(hx+ex,hy-6,O[1]); cv.px(hx+ex+1,hy-6,O[1]); cv.px(hx+ex,hy-5,O[3]); cv.px(hx+ex+1,hy-5,'#d89090'); cv.px(hx+ex+2,hy-5,O[2])
    for yy in range(0,5):     # white muzzle/chest
        for xx in range(-4,4):
            if (xx/4)**2+((yy-1)/3)**2<1: cv.px(hx+xx,hy+yy,'#f2f0ea')
    for ex in (-4,1): cv.px(hx+ex,hy-1,'#1e1e22'); cv.px(hx+ex+1,hy-1,'#1e1e22')   # closed eyes
    cv.px(hx-1,hy+1,'#e88a8a'); cv.px(hx,hy+1,'#e88a8a')
F5['!']=["#","#","#","#","#",".","#"]; F5['¡']=["#",".","#","#","#","#","#"]
def bubble(cv,x,y,s):
    w=twidth(s)+8; h=13
    cv.rect(x,y,w,h,'#fffaf0'); cv.rect(x+1,y-1,w-2,1,'#fffaf0'); cv.rect(x+1,y+h,w-2,1,'#fffaf0')
    for k in range(4): cv.rect(x+6+k,y+h+1+k,4-k,1,'#fffaf0')
    text(cv,x+4,y+3,s,'#2a1a14')
def light(cv,albedo):
    H_,W_=cv.h,cv.w
    L=np.ones((H_,W_,3))*np.array([1.00,0.95,0.88])
    yy,xx=np.mgrid[0:H_,0:W_]
    L+=(np.clip(1-xx/420,0,1)**2*0.12)[:,:,None]*np.array([1.0,0.85,0.6])   # warm bounce from window side
    yy,xx=np.mgrid[0:H_,0:W_]
    # sun patch through window louvers & bars: parallelogram on floor
    x_top,y_top,x_bot,y_bot,ww=176,148,226,232,56
    v=(yy-y_top)/(y_bot-y_top); xl=x_top+(x_bot-x_top)*v; u=(xx-xl)/ww
    inside=(v>=0)&(v<=1)&(u>=0)&(u<=1)
    wx=u*56; bars=((np.floor(wx)%5)==1)|(np.abs(u-0.5)<0.012)
    louv=((np.floor(v*42)%4)==3)
    edge=np.clip(np.minimum.reduce([u,1-u,v,1-v])*14,0,1)
    patch=inside&~bars
    L+=(patch*edge)[:,:,None]*np.array([0.85,0.66,0.34])
    # big soft sun shafts across stairs and floor (from the upper-left)
    for (c0,wd,k) in ((60,26,0.30),(118,18,0.22),(330,30,0.16)):
        band=np.abs((xx-c0)-(yy-70)*0.55)
        m=np.clip(1-band/wd,0,1)**1.5*(yy>WALL1-40)
        L+=(m*k)[:,:,None]*np.array([1.0,0.82,0.52])
    # volumetric beam window → patch (soft haze)
    for y in range(58,y_top):
        t=(y-58)/(y_top-58)
        xa=142+(x_top-142)*t; 
        for x in range(int(xa),int(xa+56)):
            if 0<=x<W_: L[y,x]+=np.array([0.16,0.13,0.08])*(1-abs((x-xa)/56-0.5)*1.6)*(0.6+0.4*t)
    # light from the open door
    v2=(FLOOR1-yy)/90; half=16+v2*30
    door=(v2>=0)&(v2<=1)&(np.abs(xx-304)<half)
    L+=(door*np.clip(1-v2,0,1)**1.5)[:,:,None]*np.array([0.40,0.33,0.22])
    # TV glow
    d=np.sqrt((xx-247)**2+((yy-56)*1.4)**2); L+=(np.clip(1-d/40,0,1)**2)[:,:,None]*np.array([0.10,0.22,0.12])
    cv.a=albedo*L
    rng=random.Random(3)
    for i in range(40):  # dust motes in the beam
        t=rng.random(); y=58+(y_top-58)*t+rng.uniform(-4,4); x=142+(x_top-142)*t+rng.uniform(0,56)
        cv.px(x,y,(255,236,200),rng.uniform(0.3,0.7))
def grade(cv):
    xs=np.linspace(-1,1,cv.w)[None,:,None]; ys=np.linspace(-1,1,cv.h)[:,None,None]
    a=cv.a; l=a.mean(axis=2,keepdims=True)
    a=l+(a-l)*1.04                                # a touch more saturation
    ln=np.clip(l/255,0,1)
    a=a+(ln**2)*np.array([14,8,-4])
    cv.a=np.clip(a*(1-0.07*(xs**2+ys**2)),0,255)
def build():
    cv=Canvas(W,H); cv.a[:]=C('#120e0d')
    floor_mosaic(cv); walls(cv); stairs(cv); window(cv); wall_deco(cv)
    tv_unit(cv); aparador(cv); kitchen(cv)
    rug(cv)
    from catB import renderCat
    cv.mul(242,229,26,2,(0.65,0.65,0.7)); cv.blit(renderCat(),242,215)
    mecedora(cv); fan(cv)
    # laundry basket + doormat
    for k in range(4): cv.mul(102,254+k,24,1,[0.6+0.1*k]*3)
    for yy in range(236,254):                     # woven basket: rim (top face) + body
        for xx in range(100,124):
            u=(xx-100)/23; f=1.15-0.45*u-0.2*(yy-236)/18
            c='#c8a060' if ((xx+yy)%4<2)!=((yy//3)%2==0) else '#a8804a'
            cv.px(xx,yy,shade(c,f))
    for xx in range(100,124): cv.px(xx,234,'#d8b878'); cv.px(xx,235,'#b8945a')
    cv.rect(101,228,22,7,'#e8eaf2'); cv.rect(101,228,22,1,'#ffffff'); cv.rect(104,226,9,5,'#5a8ad0'); cv.rect(104,226,9,1,'#8ab0f0'); cv.rect(114,227,7,5,'#e8a0b0'); cv.rect(114,227,7,1,'#f8c8d0')
    cv.noise(286,272,36,14,'#7a5a3a',var=6,seed=77); cv.rect(286,272,36,1,'#9a7a52')
    sofa(cv)
    plant(cv,96,286,1); plant(cv,486,286,2)
    dining(cv)
    A=person(ALEX); B=person(dict(ARIANA,look=0))
    for (im,x,base) in ((B,334,262),(A,290,300)):
        for xx in range(x+4,x+im.w-4):
            for d in (0,1,2): cv.mul(xx,base-1+d,1,1,[0.7+0.1*d]*3)
        cv.blit(im,x,base-46)
    caps(cv)
    cv.blit(person(ALEX),290,254)   # Alex stands in the doorway, over the threshold cap
    light(cv,cv.a.copy())
    bubble(cv,296,232,'¡UPE!')
    grade(cv)
    return cv
if __name__=='__main__':
    cv=build(); cv.save('interior_1x.png'); cv.save('interior_2x.png',2)
