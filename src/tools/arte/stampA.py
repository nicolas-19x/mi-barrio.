from px import *
F4="""
.ooo.ooo.
oLLLoLLMo
oLLMoLMMo
oLMoYoMDo
.ooYyYoo.
oLMoYoMDo
oLMMoMMDo
oMMDoMDDo
.ooo.ooo.
"""
F5="""
...ooo...
..oLLMo..
.ooLMMoo.
oLLoMoLMo
oLMMyYMDo
.oMMYYMo.
.oLMoMDo.
oMMDooMDo
.ooo..oo.
"""
def stamp(g,cols):
    rows=g.strip('\n').split('\n'); im=Img(len(rows[0]),len(rows))
    for y,r in enumerate(rows):
        for x,c in enumerate(r):
            if c in cols: im.px(x,y,cols[c])
    return im
LEAF_R="""
...oooo...
.ooLLLMoo.
oLLMMMMMDo
.oDDMMDDo.
..ooooo...
"""
LEAF_L='\n'.join(r[::-1] for r in LEAF_R.strip('\n').split('\n'))
LEAF_U="""
..o..
.oLo.
oLMMo
oLMDo
oLMDo
.oDo.
..o..
"""
GA={'o':'#173e1e','L':'#7ad04a','M':'#4aa83a','D':'#2e7a34'}
FCOL={'red':{'o':'#4a1018','L':'#ff8a7a','M':'#ef4a4a','D':'#b8283a','y':'#fff8b0','Y':'#f8d040'},
      'yel':{'o':'#5a3410','L':'#fff4a0','M':'#f8cc3a','D':'#d8902a','y':'#8a4a2a','Y':'#5a2a14'},
      'pur':{'o':'#2a1848','L':'#e0b8ff','M':'#a870e8','D':'#7048b8','y':'#fff8b0','Y':'#f8d040'},
      'wht':{'o':'#3a3a4a','L':'#ffffff','M':'#ecebf2','D':'#bcbccc','y':'#fff070','Y':'#e8b830'}}
def clumpA(kind=0,cols=('red','yel','red'),seed=1):
    im=Img(34,26); rng=random.Random(seed)
    lf=[(LEAF_L,0,17),(LEAF_R,22,17),(LEAF_L,3,13),(LEAF_R,19,13),(LEAF_U,8,10),(LEAF_U,20,9),(LEAF_L,7,19),(LEAF_R,15,19),(LEAF_U,14,12)]
    for g,x,y in lf: im.blit(stamp(g,GA),x,y)
    # stems
    for sx,sy,ey in ((9,8,18),(24,7,18),(16,4,18)):
        for y in range(sy,ey): im.px(sx,y,'#2e7a34'); im.px(sx+1,y,'#173e1e')
    pos=[(4,2+0,cols[0],F4),(19,1,cols[1],F5),(11,-2+2,cols[2],F4)]
    pos=[(5,4,cols[0],F4),(20,3,cols[1],F4),(12,0,cols[2],F4)]
    for x,y,c,g in pos: im.blit(stamp(g,FCOL[c]),x,y)
    return im
