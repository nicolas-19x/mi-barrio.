from interior import *
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
    wood(cv,206,72,84,26,'#6a4026',seed=21)
    for dx in (210,248): cv.rect(dx,78,36,16,shade('#6a4026',0.85)); cv.rect(dx,78,36,1,shade('#6a4026',1.15)); cv.rect(dx+17,84,2,3,'#d0b060')
    cv.mul(206,98,84,4,(0.6,0.6,0.66))
    # crochet doily
    for xx in range(214,280):
        for yy in range(68,73):
            if (xx+yy)%2==0 or yy==72: cv.px(xx,yy,'#f6f2ea')
    # flat TV showing a football match
    cv.rect(220,38,54,32,'#141416'); cv.rect(244,70,6,3,'#1e1e22'); cv.rect(236,72,22,2,'#26262a')
    cv.noise(223,41,48,26,'#3a8a3a',var=4,seed=22)
    for y in range(41,67,5): cv.rect(223,y,48,2,'#358035')
    cv.rect(246,41,1,26,'#d8e8d8'); 
    for a in range(0,360,30): cv.px(246+5*math.cos(math.radians(a)),54+4*math.sin(math.radians(a)),'#d8e8d8')
    for (px_,py_,c) in ((232,50,'#e03030'),(238,58,'#e03030'),(258,47,'#f0f0f0'),(263,60,'#f0f0f0'),(250,55,'#e03030')): cv.rect(px_,py_,2,3,c)
    cv.rect(254,52,1,1,'#ffffff'); cv.rect(223,41,18,4,'#101010'); cv.rect(224,42,3,2,'#e03030'); cv.rect(229,42,2,2,'#f0f0f0')
    # vase with plastic flowers + figurine
    cv.rect(280,58,6,10,'#3a6ab0'); cv.rect(280,58,2,10,'#5a8ad0')
    for (fx,fy,c) in ((279,52,'#e84a6a'),(284,50,'#f0d040'),(282,54,'#e86aa0'),(286,55,'#e84a6a')): cv.rect(fx,fy,3,3,c); cv.px(fx+1,fy+3,'#3a7a3a')
    cv.rect(210,60,5,8,'#f0f0f0'); cv.rect(211,57,3,3,'#f0e0c0'); cv.px(212,58,'#3a3a3a')
def aparador(cv):
    wood(cv,298,76,50,22,'#7a4e30',seed=31); cv.mul(298,98,50,3,(0.6,0.6,0.66))
    # fruit bowl: bananas, mango, papaya
    cv.rect(306,70,24,6,'#d8d4cc'); cv.rect(306,75,24,1,'#a8a49c')
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
    # counter (concrete + tile top)
    cv.noise(352,72,68,26,'#d8d2c4',var=3,seed=42)
    for xx in range(352,420,10): cv.rect(xx,72,1,26,'#b8b2a4')
    cv.noise(350,68,72,5,'#c8a888',var=3,seed=43); cv.rect(350,68,72,1,'#e8d0b0'); cv.mul(352,73,68,2,(0.75,0.75,0.78))
    cv.rect(356,80,22,14,'#e8e4dc'); cv.rect(356,80,22,1,'#ffffff'); cv.rect(366,86,2,2,'#888888')   # under-sink curtain? cabinet
    for xx in range(384,418):   # little curtain under counter (cortinita)
        for yy in range(76,96):
            cv.px(xx,yy,shade('#e88a8a' if ((xx//3)+(yy//3))%2 else '#f6e8e0',0.92+0.08*math.sin(xx)))
    cv.mul(352,98,68,4,(0.6,0.6,0.66))
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
    # stove
    x0=422
    cv.rect(x0,64,32,34,'#eeeeea'); cv.rect(x0,64,32,1,'#ffffff'); cv.rect(x0+31,64,1,34,'#b8b8b4')
    cv.rect(x0+2,62,28,6,'#2a2a2c')
    for bx in (x0+7,x0+22): cv.rect(bx-3,63,6,3,'#4a4a4c'); cv.px(bx,64,'#7a7a7c')
    cv.rect(x0+3,72,26,3,'#d8d8d4')
    for k in range(4): cv.rect(x0+5+k*6,73,3,2,'#3a3a3a')
    cv.rect(x0+4,77,24,17,'#2a2a2c'); cv.rect(x0+6,79,20,6,'#4a4040'); cv.rect(x0+4,77,24,1,'#6a6a6c')
    cv.mul(x0,98,32,4,(0.6,0.6,0.66))
    # pot (olla de frijoles) with steam
    cv.rect(x0+16,52,13,11,'#a8acb0'); cv.rect(x0+16,52,4,11,'#c8ccd0'); cv.rect(x0+15,51,15,2,'#6a6e72'); cv.rect(x0+21,49,3,2,'#2a2a2a')
    # gas cylinder
    cv.rect(456,74,9,24,'#c8d0d6'); cv.rect(456,74,3,24,'#e0e6ea'); cv.rect(463,74,2,24,'#8a949a'); cv.rect(458,71,5,3,'#5a5a5a'); cv.rect(456,82,9,2,'#c84040')
    # fridge
    fx=466
    cv.rect(fx,16,32,82,'#e6e8e8'); cv.rect(fx,16,4,82,'#f6f8f8'); cv.rect(fx+28,16,4,82,'#b8bcbc'); cv.rect(fx,16,32,1,'#ffffff')
    cv.rect(fx,40,32,2,'#9aa0a0'); cv.rect(fx+25,26,2,10,'#8a9090'); cv.rect(fx+25,48,2,18,'#8a9090')
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
