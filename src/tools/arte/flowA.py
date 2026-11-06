from vol import *
PAL_FA={'lf':('#7ad04a','#4aa83a','#2e7a34','#173e1e'),
 'red':('#ff8a7a','#ef4a4a','#b8283a','#4a1018'),
 'yel':('#fff08a','#f8cc3a','#d8902a','#5a3410'),
 'pur':('#d8a8ff','#a870e8','#7048b8','#2a1848'),
 'ctr':('#fff8b0','#f8d040','#c88a20','#4a2a10'),
 'ctrd':('#8a4a2a','#6a3418','#4a2010','#2a1008')}
def flower(s,cx,cy,col,r=2.9,pr=2.0,n=5,rot=0.3):
    H,W=s.h,s.w; m=np.zeros((H,W),bool)
    order=sorted(range(n),key=lambda i:math.sin(rot+i*2*math.pi/n))
    for i in order:
        a=rot+i*2*math.pi/n
        v=s.vol(ell(H,W,cx+math.cos(a)*r,cy+math.sin(a)*r*0.85,pr*1.15,pr*0.85,rot=a),col)
    c=s.vol(ell(H,W,cx,cy,1.3,1.2),'ctr' if col!='yel' else 'ctrd')
    return v
def clumpA(seed=2,cols=('red','yel','red'),W=34,H=28):
    rng=random.Random(seed); s=Sprite(W,H)
    # leaves: pointed ellipses radiating from base
    base=(W/2,H-6)
    for i in range(12):
        a=math.pi*(1.0+i*0.091)+rng.uniform(-0.05,0.05)
        L=rng.uniform(8,11)
        cx=base[0]+math.cos(a)*L*0.75; cy=base[1]+math.sin(a)*L*0.55
        s.vol(ell(H,W,cx,cy,L*0.5,1.9,rot=a),'lf')
    pos=[(W/2-7,H-13),(W/2+6,H-14),(W/2-0.5,H-18)]
    for (x,y),c in zip(pos,cols): flower(s,x,y,c,rot=rng.uniform(0,1))
    return s
def renderFA(seed=2,cols=('red','yel','red')):
    s=clumpA(seed,cols); return render_flat3(s,PAL_FA)
