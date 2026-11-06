import numpy as np, math
from px import Img, ell, poly, hexc
from band import render_band
def ramp(base,n=6):
    b=np.array(hexc(base)[:3],float)
    out=[]
    for i,f in enumerate([0.42,0.62,0.80,1.0,1.16,1.30]):
        c=b*f
        if f>1: c=c+(255-c)*(f-1)*0.55
        # hue shift: shadows cooler/purple, lights warmer
        if f<1: c=c*np.array([0.96,0.95,1.06])
        else: c=c*np.array([1.03,1.0,0.94])
        out.append('#%02x%02x%02x'%tuple(int(v) for v in np.clip(c,0,255)))
    return out
class Body:
    def __init__(s,W,H): s.W,s.H=W,H; s.vid=np.full((H,W),-1,int); s.mat=np.full((H,W),'',object); s.n=0
    def add(s,m,mat):
        s.vid[m]=s.n; s.mat[m]=mat; s.n+=1
    def E(s,*a,**k): return ell(s.H,s.W,*a,**k)
    def R(s,x0,y0,x1,y1):
        m=np.zeros((s.H,s.W),bool); m[y0:y1,x0:x1]=True; return m
    def P(s,pts): return poly(s.H,s.W,pts)
def person(spec):
    W,H=28,48; b=Body(W,H); cx=14
    hair_long=spec.get('long',False)
    if hair_long:   # back hair behind everything
        b.add(b.E(cx,14,10.4,11)|b.P([(3.5,14),(24.5,14),(24,33),(20,35),(8,35),(4,33)]),'hair')
    yb=spec.get('slim',0)
    # legs
    b.add(b.R(8,33,13,43),'pants'); b.add(b.R(15,33,20,43),'pants')
    b.add(b.E(10.2,44,3.6,2.2),'shoe'); b.add(b.E(17.8,44,3.6,2.2),'shoe')
    # torso
    tw=6.5-yb
    b.add(b.P([(cx-tw,20),(cx+tw,20),(cx+tw+0.5,34),(cx-tw-0.5,34)]),'shirt')
    if spec.get('belt'): b.add(b.R(int(cx-tw),32,int(cx+tw+1),34),'pants')
    b.add(b.R(12,17,16,21),'skin')     # neck
    # arms
    b.add(b.P([(cx-tw-0.2,20.5),(cx-tw-3.6,22),(cx-tw-3.8,27),(cx-tw,27)]),'shirt')
    b.add(b.P([(cx+tw+0.2,20.5),(cx+tw+3.6,22),(cx+tw+3.8,27),(cx+tw,27)]),'shirt')
    b.add(b.R(int(cx-tw-3.5),27,int(cx-tw),32),'skin'); b.add(b.R(int(cx+tw+1),27,int(cx+tw+4.5),32),'skin')
    b.add(b.E(cx-tw-1.8,32.5,2.0,1.8),'skin'); b.add(b.E(cx+tw+2.8,32.5,2.0,1.8),'skin')
    # head
    b.add(b.E(4.4,12,1.3,1.9)|b.E(23.6,12,1.3,1.9),'skin')   # ears
    b.add(b.E(cx,10,9.2,9.0),'skin')
    # hair front
    if spec.get('hairstyle')=='short':
        m=b.E(cx,8.6,9.8,8.6)&~b.R(0,9,W,H)
        m|=b.P([(4.6,8),(9,8),(7.6,10.6),(10.5,8.4),(13,11),(14.5,8.4),(17.5,10.4),(18.5,8),(23.6,8),(23.6,12),(22.2,12.5),(21.5,9.5),(6.5,9.5),(5.8,12.5),(4.4,12)])
        b.add(m,'hair')
    elif spec.get('hairstyle')=='long':
        m=b.E(cx,8.4,10,8.6)&~b.R(0,8,W,H)
        m|=b.P([(4.2,7),(13.5,7.5),(9,12),(6,13),(5.4,20),(3.6,21),(3.8,10)])
        m|=b.P([(13.5,7.5),(23.8,7),(24.2,10),(24.4,21),(22.6,20),(22,13),(18,10)])
        b.add(m,'hair')
    elif spec.get('hairstyle')=='bun':
        b.add(b.E(cx,8.2,9.8,8.2)&~b.R(0,7,W,H)|b.P([(4.4,6),(23.6,6),(23.4,11),(21.6,8.5),(14,7.2),(6.4,8.5),(4.6,11)]),'hair')
        b.add(b.E(cx+7,2.6,3.4,3.0),'hair')
    ramps={k:ramp(v) for k,v in spec['cols'].items()}
    img=render_band(b.vid,b.mat,ramps,idx_mid=3,ao_rows=(1,))
    # face details: eyes look toward spec['look'] (+1 right,-1 left)
    lk=spec.get('look',0)
    ey=12
    for ex in (cx-4+lk,cx+3+lk):
        img.px(ex,ey,'#2a1c22'); img.px(ex,ey+1,'#120a0e'); img.px(ex,ey+2,'#3a2a30')
        img.px(ex+(1 if lk>=0 else -1),ey,'#f4ece4')
    # brows
    hc=ramps['hair'][1]
    for ex in (cx-4+lk,cx+3+lk): img.px(ex-1,ey-2,hc); img.px(ex,ey-2,hc); img.px(ex+1,ey-2,hc)
    # mouth + blush
    img.px(cx+lk,16,'#8a4a3a'); img.px(cx+lk+1,16,'#a85a48')
    if spec.get('blush'):
        for ex in (cx-7+lk,cx+5+lk): img.px(ex,15,'#e07870'); img.px(ex+1,15,'#e88878')
    if spec.get('earrings'):
        img.px(4,14,'#f5c542'); img.px(23,14,'#f5c542'); img.px(4,15,'#c8902a'); img.px(23,15,'#c8902a')
    if spec.get('glasses'):
        g='#d64545'
        for ex in (cx-4+lk,cx+3+lk):
            for dx in (-2,-1,0,1,2): img.px(ex+dx,ey-1,g); img.px(ex+dx,ey+3,g)
            for dy in (0,1,2): img.px(ex-2,ey+dy,g); img.px(ex+2,ey+dy,g)
        img.px(cx+lk,ey,g)
    return img
ALEX=dict(hairstyle='short',look=1,cols={'hair':'#3b2416','skin':'#d9a066','shirt':'#3f7fd1','pants':'#2d3346','shoe':'#d8d4cc'})
ARIANA=dict(hairstyle='long',long=True,look=-1,blush=True,earrings=True,slim=0.8,
            cols={'hair':'#2a1810','skin':'#c68e5e','shirt':'#e85d75','pants':'#35477d','shoe':'#f0ece4'})
ROSA=dict(hairstyle='bun',look=1,glasses=True,cols={'hair':'#8a8a8a','skin':'#c68e5e','shirt':'#f0e6d2','pants':'#7a4b2a','shoe':'#4a3a2a'})
if __name__=='__main__':
    from px import up
    row=Img(100,52); row.rect(0,0,100,52,'#b4aa98')
    for i,s in enumerate((ALEX,ARIANA,ROSA)): row.blit(person(s),2+i*32,2)
    up(row,8).save('chars.png')
