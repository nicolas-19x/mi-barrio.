from interior import *
from furn import *
def wood(cv,x,y,w,h,base='#7a4a2e',seed=0):
    cv.noise(x,y,w,h,base,var=4,seed=seed)
    rng=random.Random(seed)
    for i in range(w*h//30):
        X=rng.randint(x,x+w-3); Y=rng.randint(y,y+h-1); cv.rect(X,Y,rng.randint(2,6),1,shade(base,0.85))
    cv.rect(x,y,w,1,shade(base,1.25)); cv.rect(x,y,1,h,shade(base,1.12)); cv.rect(x+w-1,y,1,h,shade(base,0.7)); cv.rect(x,y+h-1,w,1,shade(base,0.6))
def frame(cv,x,y,w,h,fc='#b08a3a',inner=None):
    cv.rect(x,y,w,h,fc); cv.rect(x,y,w,1,shade(fc,1.3)); cv.rect(x,y+h-1,w,1,shade(fc,0.6)); cv.rect(x+w-1,y,1,h,shade(fc,0.7))
    cv.mul(x+1,y+h,w,2,(0.78,0.78,0.82))
    return (x+2,y+2,w-4,h-4)
def wall_deco(cv):
    # family photos + clock above TV
    for (x,y,w,h,c) in ((214,12,12,15,'#c8a070'),(230,10,16,12,'#5a4030'),(250,13,11,14,'#e8e0d0'),(266,11,14,11,'#5a4030')):
        ix,iy,iw,ih=frame(cv,x,y,w,h,c)
        cv.noise(ix,iy,iw,ih,'#8aa0b0',var=8,seed=x)
        cv.rect(ix+iw//2-2,iy+ih//2-1,4,ih//2+1,'#6a4a3a'); cv.rect(ix+iw//2-1,iy+ih//2-3,3,3,'#d0a070')
    cx,cy=289,17
    for yy in range(cy-7,cy+8):
        for xx in range(cx-7,cx+8):
            d=math.hypot(xx-cx,yy-cy)
            if d<7.3: cv.px(xx,yy,'#2a2a2a' if d>6.2 else '#f6f2e8')
    for t in range(4): cv.px(cx,cy-t,'#1a1a1a'); cv.px(cx+t*0.7,cy+t*0.4,'#1a1a1a')
    cv.px(cx,cy,'#c03030')
    # La Ultima Cena (long frame) over the aparador
    ix,iy,iw,ih=frame(cv,300,14,52,22,'#a8822e')
    cv.noise(ix,iy,iw,ih,'#6a4a2a',var=5,seed=11)
    cv.rect(ix,iy+ih-7,iw,4,'#e8dcc0')                       # tablecloth
    for k in range(13):
        hx=ix+2+k*3.5; cv.rect(hx,iy+ih-11,2,2,'#e0b080' if k!=6 else '#f0d090'); cv.rect(hx,iy+ih-9,2,3,['#a03030','#3050a0','#c09040','#4a7a4a'][k%4])
    cv.rect(ix+iw//2-4,iy+1,8,6,'#e8d8a0')                   # window behind Jesus
    # palm cross + small Virgen de los Angeles
    for t in range(9): cv.px(357,10+t,'#c8b060')
    cv.rect(354,13,7,1,'#c8b060')
    ix,iy,iw,ih=frame(cv,186,64-50,0,0) if False else (0,0,0,0)
    # calendar on fridge side wall area
def tv_unit(cv):
    W_='#6a4026'
    box(cv,204,62,88,10,28,'#8a5a36',W_,seed=21)
    for dx in (208,250): inset_panel(cv,dx,77,38,18,W_); knob(cv,dx+18,85)
    cv.rect(204,100,4,3,'#3a2414'); cv.rect(288,100,4,3,'#3a2414')     # feet
    lace(cv,214,64,66,6)                                               # crochet doily on the top face
    cv.mul(234,70,26,2,(0.7,0.7,0.74))                                 # TV stand shadow on top
    # flat TV showing a football match
    cv.rect(220,36,54,32,'#141416'); cv.rect(220,36,54,1,'#4a4a50'); cv.rect(220,36,1,32,'#3a3a40'); cv.rect(244,68,6,2,'#1e1e22'); cv.rect(236,69,22,2,'#2e2e34'); cv.rect(236,69,22,1,'#5a5a60')
    cv.noise(223,39,48,26,'#3a8a3a',var=4,seed=22)
    for y in range(39,65,5): cv.rect(223,y,48,2,'#358035')
    cv.rect(246,39,1,26,'#d8e8d8'); 
    for k in range(10): cv.px(262+k,39+k,(255,255,255)) if False else cv.mul(258+k,39,1,26-k*2,(1.08,1.08,1.08))   # screen glare

    for a in range(0,360,30): cv.px(246+5*math.cos(math.radians(a)),54+4*math.sin(math.radians(a)),'#d8e8d8')
    for (px_,py_,c) in ((232,50,'#e03030'),(238,58,'#e03030'),(258,47,'#f0f0f0'),(263,60,'#f0f0f0'),(250,55,'#e03030')): cv.rect(px_,py_,2,3,c)
    cv.rect(254,52,1,1,'#ffffff'); cv.rect(223,41,18,4,'#101010'); cv.rect(224,42,3,2,'#e03030'); cv.rect(229,42,2,2,'#f0f0f0')
    # vase with plastic flowers + figurine
    cv.rect(279,56,8,11,'#3a6ab0'); cv.rect(279,56,2,11,'#6a9ae0'); cv.rect(285,56,2,11,'#2a4a8a'); cv.rect(280,55,6,1,'#2a3a6a'); cv.mul(287,60,3,7,(0.7,0.7,0.75))
    for (fx,fy,c) in ((278,50,'#e84a6a'),(283,48,'#f0d040'),(281,52,'#e86aa0'),(286,52,'#e84a6a')): cv.rect(fx,fy,3,3,c); cv.px(fx+1,fy+3,'#3a7a3a')
    cv.rect(210,60,5,8,'#f0f0f0'); cv.rect(211,57,3,3,'#f0e0c0'); cv.px(212,58,'#3a3a3a')
def aparador(cv):
    box(cv,298,66,50,9,25,'#9a6a40','#7a4e30',seed=31)
    inset_panel(cv,302,80,20,15,'#7a4e30'); inset_panel(cv,324,80,20,15,'#7a4e30'); knob(cv,320,87); knob(cv,326,87)
    # fruit bowl: bananas, mango, papaya
    cv.mul(308,73,24,2,(0.7,0.7,0.74)); cv.rect(306,69,24,5,'#e8e4dc'); cv.rect(306,69,24,1,'#ffffff'); cv.rect(308,73,20,1,'#a8a49c')
    for i in range(6): cv.rect(307+i*2,66+abs(i-3)//2,3,4,'#f0d040'); cv.px(307+i*2,66+abs(i-3)//2,'#7a6a2a')
    cv.rect(320,66,8,5,'#e88a3a'); cv.rect(320,66,8,1,'#f0b050'); cv.rect(320,70,8,1,'#c86a2a')
    cv.rect(316,68,5,4,'#e8a030'); cv.px(316,68,'#80a040')
    # termo + bible
    cv.rect(336,60,7,16,'#c03a30'); cv.rect(336,60,2,16,'#e05a4a'); cv.rect(337,58,5,2,'#2a2a2a')
def kitchen(cv):
    # shelf with jars and bottles
    cv.noise(352,26,64,3,'#8a6a46',var=3,seed=41); cv.mul(352,29,64,2,(0.7,0.7,0.74))
    rng=random.Random(4)
    x=354
    for c,h_ in (('#6a3a20',12),('#e8e0c8',8),('#c84a2a',7),('#e8e0c8',8),('#4a2a18',13),('#f0c040',6),('#7a8a3a',7),('#e8e0c8',9),('#a8603a',8)):
        w=5 if h_>10 else 6; cv.rect(x,26-h_,w,h_,c); cv.rect(x,26-h_,1,h_,shade(c,1.3)); cv.rect(x+w-1,26-h_,1,h_,shade(c,0.7))
        if h_>10: cv.rect(x+1,26-h_-2,w-2,2,'#2a2a2a')
        x+=w+1
    # counter: tiled top face + concrete front with cabinet and cortinita
    box(cv,350,60,72,11,28,'#d8b898','#d8d2c4',seed=42)
    for yy in range(61,70,3): cv.rect(351,yy,70,1,'#b89878')
    for xx in range(352,421,8): cv.rect(xx,60,1,10,'#b89878')
    inset_panel(cv,355,76,24,19,'#e4e0d6'); knob(cv,375,84,'#9a9a9a')
    for xx in range(384,418):                        # cortinita with folds
        f=0.86+0.16*math.sin((xx-384)*0.9)
        for yy in range(74,97):
            base='#e86a6a' if ((xx//4)+(yy//4))%2 else '#f8ece4'
            cv.px(xx,yy,shade(base,f))
    cv.rect(383,73,36,2,'#8a8a8a')
    # chorreador de cafe (wooden stand + cloth bag) + pot
    cv.rect(360,50,2,18,'#6a4026'); cv.rect(372,50,2,18,'#6a4026'); cv.rect(358,48,18,3,'#8a5a36'); cv.rect(358,48,18,1,'#aa7a50')
    for j in range(10):
        ww=10-j//2; cv.rect(367-ww//2,51+j,ww,1,shade('#efe6d0',0.9+0.01*j))
    cv.rect(362,60,10,8,'#b8bcc0'); cv.rect(362,60,3,8,'#d8dce0'); cv.rect(371,62,3,1,'#2a2a2a')   # cup/pot
    # escurridor with plates
    cv.rect(382,58,22,10,'#c8ccd0')
    for k in range(5): cv.rect(384+k*4,52,3,14,['#f6f6f2','#e8eef6','#f6f6f2','#f0d8b8','#f6f6f2'][k]); cv.rect(384+k*4,52,1,14,'#ffffff')
    # rice cooker
    cv.rect(406,56,13,12,'#f2f2ee'); cv.rect(406,56,13,3,'#d8d8d4'); cv.rect(410,54,5,2,'#8a8a8a'); cv.rect(415,62,2,2,'#e03030')
    # stove: enamel box, burners on the top face, knobs + oven door on the front
    x0=424
    box(cv,x0,54,30,12,32,'#f2f2ee','#e8e8e4',seed=44)
    cv.rect(x0+1,55,28,10,'#2a2a2e'); cv.rect(x0+1,55,28,1,'#4a4a50')
    for (bx,by) in ((x0+8,58),(x0+21,58),(x0+8,63),(x0+21,63)):
        for dx in range(-4,5):
            for dy in range(-2,3):
                d=(dx/4)**2+(dy/2)**2
                if 0.45<d<1.05: cv.px(bx+dx,by+dy,'#6a6a70' if dy<0 else '#4a4a50')
        cv.px(bx,by,'#8a8a90')
    for k in range(4): cv.rect(x0+4+k*6,69,3,3,'#2a2a2e'); cv.px(x0+4+k*6,69,'#6a6a70')
    cv.rect(x0+3,74,24,20,'#2a2a2e'); cv.rect(x0+3,74,24,1,'#6a6a70')
    cv.rect(x0+6,78,18,8,'#4a3a36'); cv.rect(x0+6,78,18,1,'#2a2020'); cv.mul(x0+6,78,6,8,(1.25,1.2,1.1))
    cv.rect(x0+5,75,20,2,'#c8c8cc'); cv.rect(x0+5,75,20,1,'#f0f0f4')     # handle bar
    for yy in range(66,90): cv.px(x0+25,yy,'#e86a6a' if yy%4 else '#f8ece4')   # dish towel
    # pot (olla de frijoles) with steam
    cv.rect(x0+15,48,13,12,'#a8acb0'); cv.rect(x0+15,48,4,12,'#d8dce0'); cv.rect(x0+26,48,2,12,'#7a7e82'); cv.rect(x0+14,46,15,3,'#8a8e92'); cv.rect(x0+14,46,15,1,'#c8ccd0'); cv.rect(x0+20,44,3,2,'#2a2a2a')
    for t in range(10): cv.px(x0+18+int(2*math.sin(t*0.8)),43-t,(240,240,240),0.35)   # steam
    # gas cylinder
    cv.rect(456,74,9,24,'#c8d0d6'); cv.mul(458,98,9,3,(0.6,0.6,0.66)); cv.rect(456,74,3,24,'#e0e6ea'); cv.rect(463,74,2,24,'#8a949a'); cv.rect(458,71,5,3,'#5a5a5a'); cv.rect(456,82,9,2,'#c84040')
    # fridge
    fx=466
    for k in range(5): cv.mul(fx+32+k,22+k,1,76,[0.70+0.06*k]*3)
    box(cv,fx,12,32,7,79,'#f4f6f6','#e6e8e8',seed=45,cast=False)
    for yy in range(19,98): cv.px(fx+1,yy,'#ffffff'); cv.px(fx+2,yy,'#f6f8f8'); cv.px(fx+29,yy,'#c4c8c8'); cv.px(fx+30,yy,'#b0b4b4')
    cv.px(fx,12,'#2a2220'); cv.px(fx+31,12,'#2a2220')
    cv.rect(fx,40,32,1,'#8a9090'); cv.rect(fx,41,32,1,'#ffffff'); cv.rect(fx+25,24,2,12,'#9aa0a0'); cv.rect(fx+25,24,1,12,'#e8ecec'); cv.rect(fx+25,46,2,20,'#9aa0a0'); cv.rect(fx+25,46,1,20,'#e8ecec')
    for (mx,my,c) in ((fx+6,22,'#e03030'),(fx+14,24,'#f0c030'),(fx+8,50,'#3a7ad0'),(fx+18,56,'#40a050')): cv.rect(mx,my,4,4,c)
    cv.rect(fx+5,58,14,18,'#ffffff'); cv.rect(fx+5,58,14,4,'#d84040')      # calendar
    for k in range(12): cv.px(fx+7+(k%4)*3,64+(k//4)*3,'#7a7a7a')
    cv.rect(fx+9,47,10,8,'#f4f0e0'); cv.rect(fx+11,49,3,3,'#e8b030'); cv.rect(fx+14,51,3,3,'#3a8a3a')   # kid drawing
    
    cv.mul(fx,98,32,4,(0.6,0.6,0.66))
    rng=random.Random(12)
    for t in range(60):
        vx=rng.choice((352,358,364)); L_=rng.randint(4,26)
        yy=27+(t%L_); xx=vx+int(2*math.sin(yy*0.5+vx))
        cv.px(xx,yy,['#2e6a3a','#4a8a4a','#6aa85a','#3a7a3a'][t%4]); cv.px(xx+1,yy,'#5a9a4a') if t%3==0 else None
    cv.rect(fx+9,10,14,6,'#b05a34'); cv.rect(fx+9,10,3,6,'#c87048')
    for t in range(30): cv.px(fx+16+rng.randint(-9,9),9-rng.randint(0,3),['#2e6a3a','#4a8a4a','#6aa85a'][t%3])
    # bananas hanging + broom
    for k in range(7): cv.rect(432+k*2,30+abs(k-3),2,8,'#e8c838'); cv.px(432+k*2,38+abs(k-3),'#5a4a20')
    cv.rect(437,24,2,7,'#6a5a3a')
