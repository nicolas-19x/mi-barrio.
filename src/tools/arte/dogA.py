from vol import *
def dogA():
    W,H=42,24; s=Sprite(W,H); E=lambda *a,**k:ell(H,W,*a,**k)
    ox,oy=2,3
    t=np.zeros((H,W),bool)
    for i in range(9):
        a=i/8; t|=E(ox+31+a*7, oy+13+a*a*4.5, 1.7-a*0.5, 1.5-a*0.4)
    tail=s.vol(t,'fur')
    body=s.vol(E(ox+21,oy+12,10,4.8)|E(ox+28,oy+11.4,5.4,5.2),'fur')
    leg=s.vol(E(ox+9,oy+15.6,8,1.8),'fur')
    head=s.vol(E(ox+10.5,oy+8.6,5.2,4.6)|E(ox+4.6,oy+10.6,4.4,2.5),'fur')
    ear=s.vol(E(ox+13,oy+8.2,1.9,3.6,rot=-0.35),'ear')
    thigh=s.vol(E(ox+27.5,oy+12.6,4.3,3.7),'fur')
    hp=s.vol(E(ox+21.8,oy+16.4,3.6,1.4),'fur')
    s.paint(E(ox+3.5,oy+12,4.5,1.6),'wht',[head])
    s.paint(E(ox+1.8,oy+15.6,2.6,2),'wht',[leg])
    s.paint(E(ox+19.3,oy+16.4,1.8,2),'wht',[hp])
    s.paint(E(ox+15,oy+14.5,3.4,2.4),'wht',[body])
    s.paint(E(ox+38,oy+17.4,1.8,1.8),'wht',[tail])
    return s,(ox,oy),dict(tail=tail,body=body,leg=leg,head=head,ear=ear,thigh=thigh,hp=hp)
PAL_A={'fur':('#f8bd68','#df8f3e','#a85a24','#4a2210'),
       'wht':('#fffaf0','#f2e3c8','#c9a982','#5a3420'),
       'ear':('#9a5428','#7c3f1a','#5c2c10','#3a1a0a')}
def renderA():
    s,(ox,oy),v=dogA()
    img=render_flat3(s,PAL_A,inner_skip={(v['head'],v['leg']),(v['hp'],v['body']),(v['tail'],v['body'])})
    O='#3a1a0a'
    for x,y in ((7,8),(8,9),(9,9),(10,8)): img.px(ox+x,oy+y,O)   # closed eye
    img.px(ox+6,oy+8,'#a85a24')
    for x,y in ((-1,9),(0,9),(-1,10),(0,10),(1,10)): img.px(ox+x+1,oy+y,'#24120a')  # nose
    img.px(ox+1,oy+9,'#7a5a4a')
    for x in (3,4,5): img.px(ox+x,oy+12,'#b08a68')   # mouth
    img.px(ox+1,oy+16,'#c9a982'); img.px(ox+3,oy+16,'#c9a982')   # toes
    img.px(ox+19,oy+16,'#c9a982')
    return img
