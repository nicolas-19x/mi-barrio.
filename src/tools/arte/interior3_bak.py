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
def sofa(cv,x0=164,y0=104,w=124):
    # seen from behind (it faces the TV): seat & cushions beyond, then backrest
    cv.noise(x0+8,y0,w-16,14,'#4a6a5a',var=3,seed=51)           # seat far side
    for k in range(3): cv.rect(x0+10+k*(w-20)//3,y0+1,(w-20)//3-2,10,'#5a7a6a'); cv.rect(x0+10+k*(w-20)//3,y0+1,(w-20)//3-2,1,'#7a9a88')
    cv.noise(x0,y0+12,w,30,'#3e5e4e',var=3,seed=52)             # backrest (back face)
    cv.rect(x0,y0+12,w,3,'#6a8a78'); cv.rect(x0,y0+15,w,1,'#527262')
    for xx in range(x0+4,x0+w-4,12): cv.rect(xx,y0+18,1,22,'#36524a')
    cv.noise(x0-6,y0+2,10,40,'#4a6a5a',var=3,seed=53); cv.rect(x0-6,y0+2,10,2,'#7a9a88')   # armrests
    cv.noise(x0+w-4,y0+2,10,40,'#36524a',var=3,seed=54); cv.rect(x0+w-4,y0+2,10,2,'#5a7a6a')
    for xx in (x0,x0+w-6): cv.rect(xx,y0+42,4,4,'#3a2618')
    cv.mul(x0-6,y0+46,w+12,4,(0.62,0.62,0.68))
    # white lace doily (carpeta de encaje) draped over the backrest
    lx0,lx1=x0+26,x0+92
    for x in range(lx0,lx1):
        u=(x-lx0)%8
        bottom=y0+26+int(3*math.sin(u/8*math.pi))           # scalloped edge
        for y in range(y0+9,bottom):
            hole=((x+y)%4==0 and (x-y)%4==0) or (((x-lx0)%8==4) and (y-y0)%6==3)
            if hole: continue
            f=1.0 if y<y0+14 else 0.93
            cv.px(x,y,shade('#f6f2e8',f))
        cv.mul(x,bottom,1,2,(0.72,0.72,0.76))
    for x in range(lx0,lx1,8): cv.px(x+4,y0+27,'#f6f2e8')
    # cushion with lace
    cv.rect(x0+w-30,y0+2,16,12,'#e8d080'); cv.rect(x0+w-30,y0+2,16,1,'#f8e8a8')
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
    def chair(x,y,back_up):
        if back_up:
            cv.rect(x,y-22,18,4,'#7a4a2e'); cv.rect(x,y-22,18,1,'#9a6a46')
            for k in (x+2,x+8,x+14): cv.rect(k,y-18,2,10,'#6a3e24')
            cv.rect(x,y-8,18,9,'#8a5a36'); cv.rect(x+2,y-7,14,6,'#c03a3a'); cv.rect(x+2,y-7,14,1,'#e05a5a')
        else:
            cv.rect(x,y,18,9,'#8a5a36'); cv.rect(x+2,y+1,14,6,'#c03a3a'); cv.rect(x+2,y+1,14,1,'#e05a5a')
            cv.rect(x,y+9,18,3,'#6a3e24')
            for k in (x+2,x+8,x+14): cv.rect(k,y+12,2,9,'#6a3e24')
            cv.rect(x,y+21,18,4,'#7a4a2e'); cv.rect(x,y+21,18,1,'#9a6a46')
            cv.mul(x,y+25,18,3,(0.65,0.65,0.7))
    chair(x0+12,y0+2,True); chair(x0+56,y0+2,True)
    # table with plastic floral tablecloth
    for y in range(y0,y0+h):
        for x in range(x0,x0+w):
            c=C('#f6f2ea')
            h_=(x*7+y*13)%37
            if h_ in (0,1): c=C('#e86a7a')
            elif h_==2: c=C('#f2a0aa')
            elif h_ in (5,) and (x+y)%3==0: c=C('#6aa05a')
            cv.a[y,x]=c*(0.97+0.03*math.sin(x*0.3))
    cv.rect(x0,y0,w,1,'#ffffff')
    for x in range(x0,x0+w):   # cloth hanging edge
        L=6+int(1.5*math.sin(x*0.35))
        for j in range(L): cv.px(x,y0+h+j,shade('#e86a7a' if (x*7+j*13)%17==0 else '#f6f2ea',0.88-0.03*j))
    for lx in (x0+4,x0+w-6): cv.rect(lx,y0+h+6,3,10,'#5a3a22')
    cv.mul(x0,y0+h+16,w,4,(0.62,0.62,0.68))
    # things on the table
    cv.rect(x0+10,y0+8,10,16,'#c03a30'); cv.rect(x0+10,y0+8,3,16,'#e05a4a'); cv.rect(x0+11,y0+6,8,3,'#2a2a2a')   # termo
    for (cx,cy) in ((x0+30,y0+20),(x0+64,y0+14)):
        cv.rect(cx,cy,7,6,'#f6f6f2'); cv.rect(cx+1,cy+1,5,2,'#5a3a22'); cv.rect(cx+7,cy+2,2,2,'#f6f6f2')
    cv.rect(x0+46,y0+12,12,9,'#b05a34'); cv.rect(x0+46,y0+12,3,9,'#c87048'); [cv.px(x0+52+math.cos(t*0.9)*(4+t%3),y0+9+math.sin(t*0.9)*3-(t%4),['#2e6a3a','#4a8a4a','#6aa85a'][t%3]) for t in range(40)]
    if False: cv.rect(x0+44,y0+6,16,9,'#e8c890'); cv.rect(x0+44,y0+6,16,2,'#f0d8a8'); 
    cv.rect(x0+72,y0+24,4,6,'#f0f0f0'); cv.rect(x0+72,y0+23,4,1,'#a0a0a0')
    chair(x0+12,y0+h+2,False); chair(x0+56,y0+h+2,False)
def plant(cv,x,y,seed):
    rng=random.Random(seed)
    cv.rect(x-9,y-14,18,14,'#b05a34'); cv.rect(x-9,y-14,4,14,'#c87048'); cv.rect(x+6,y-14,3,14,'#8a4428'); cv.rect(x-10,y-16,20,3,'#c06a42')
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
    cv.rect(100,236,24,16,'#c8a868'); [cv.rect(100,yy,24,1,'#a8884a') for yy in range(238,252,3)]; cv.rect(102,231,20,6,'#e8e8f0'); cv.rect(106,229,8,4,'#5a8ad0'); cv.rect(114,231,6,4,'#e8a0b0'); cv.mul(100,252,24,3,(0.6,0.6,0.66))
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
