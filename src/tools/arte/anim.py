# Walk cycles for the Tico muchacho (style B): rig of volumes + per-frame offsets + hand detail
import numpy as np, math
from px import Img, ell, poly, hexc, up
from tico import RAMP, chamfer
from vol import blur
W,H=36,58
OX,OY=2,2
CM={}
S=RAMP['skin']; CM.update({str(i):S[i] for i in range(7)})
CM.update({'e':'#140a08','y':'#fbf4ec','m':'#6a2418','I':RAMP['hair'][1],'J':RAMP['hair'][2],'K':RAMP['hair'][4],'h':RAMP['hair'][3],
 'q':'#eeeae0','Q':'#b8b2a8','A':RAMP['cap'][0],'B':RAMP['cap'][1],'C':RAMP['cap'][3],'D':RAMP['cap'][4],'E':RAMP['cap'][6],'r':'#d23038',
 'L':RAMP['blue'][1],'M':RAMP['blue'][3],'N':RAMP['blue'][5],'W':RAMP['wht'][5],'X':RAMP['wht'][3],'Y':RAMP['wht'][1],'V':RAMP['wht'][0],
 'z':RAMP['red'][0],'x':RAMP['red'][1],'c':RAMP['red'][2],'v':RAMP['red'][3],'b':RAMP['red'][4],'n':RAMP['red'][5],
 'g':'#2a2a34','o':'#8a8a9a','k':'#26262e'})
class Fig:
    def __init__(s): s.vid=np.full((H,W),-1,int); s.mats=[]; s.rnd=[]; s.dark=[]
    def add(s,m,mat,rnd=3.0,dark=0):
        s.vid[m]=len(s.mats); s.mats.append(mat); s.rnd.append(rnd); s.dark.append(dark); return len(s.mats)-1
def E(cx,cy,rx,ry,rot=0): return ell(H,W,cx,cy,rx,ry,rot)
def P(pts): return poly(H,W,pts)
def limb(p0,p1,r0,r1,n=12):
    m=np.zeros((H,W),bool)
    for i in range(n+1):
        t=i/n; m|=E(p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t,r0+(r1-r0)*t,r0+(r1-r0)*t)
    return m
def shade(f,light=(-0.62,-0.55,0.56)):
    L=np.array(light); L=L/np.linalg.norm(L)
    k=np.full((H,W),-1,int); n_out=np.zeros((H,W,3))
    for i,mat in enumerate(f.mats):
        m=f.vid==i
        if not m.any(): continue
        r=f.rnd[i]
        hgt=blur(m,max(1,int(round(r*0.8))))*r*1.6
        d2=chamfer(m); hgt=0.6*hgt+0.4*np.sqrt(np.clip(d2/r,0,1))*r
        gy,gx=np.gradient(hgt)
        n=np.dstack([-gx,-gy,np.ones_like(gx)*0.9]); n/=np.linalg.norm(n,axis=2,keepdims=True)
        val=0.18+0.95*np.clip(n@L,0,1)
        n_out[m]=n[m]
        k[m]=np.clip(np.round(val[m]*6-0.4)-f.dark[i],0,6).astype(int)
    for i in range(len(f.mats)):
        front=f.vid>i; m=f.vid==i; sh=np.zeros((H,W),bool)
        for dy,dx in ((1,0),(2,0),(1,1),(2,1),(1,-1)): sh|=np.roll(np.roll(front,dy,0),dx,1)
        sh&=m&~front; k[sh]=np.maximum(k[sh]-2,0)
    return k,n_out
def render_fig(f):
    k,n=shade(f); img=Img(W,H)
    for y in range(H):
        for x in range(W):
            v=f.vid[y,x]
            if v<0: continue
            mat=f.mats[v]; kk=k[y,x]
            edge=any(not(0<=x+dx<W and 0<=y+dy<H) or f.vid[y+dy,x+dx]<0 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
            if edge:
                left_open=(x-1<0 or f.vid[y,x-1]<0)
                if left_open and mat in ('skin','red','navy','cap','wht') and y<H-10 and f.dark[v]==0: kk=min(6,kk+1)
                elif n[y,x,0]>0.05 or n[y,x,1]>0.25: kk=max(0,min(kk,1))
                else: kk=max(1,kk-1)
            img.px(x,y,RAMP[mat][kk])
    return img
class Pen:
    def __init__(s,img,ox,oy): s.img,s.ox,s.oy=img,ox,oy
    def __call__(s,y,x,st):
        for i,ch in enumerate(st):
            if ch in (' ','.'): continue
            s.img.px(s.ox+x+i,s.oy+y,CM[ch])
    def px(s,x,y,c): s.img.px(s.ox+x,s.oy+y,c)
BALL=["...XWWWX...",".XWWKKKWXY.",".WWWWKWWWY.","XKWWWWWWKXY","KKWWKKKWWKY","WWWKKKKKWXY",
      "WWWWKKKWWXY","XKWWWWWWWKY",".KKWWWWWKY.",".XWWWKKWXYY","...YKKYY..."]
BC={'W':'#fbfaf6','X':'#d8d6e0','Y':'#9e9cb0','K':'#26262e'}
def draw_ball(img,x0,y0,clip=None):
    for j,r in enumerate(BALL):
        for i,ch in enumerate(r):
            if ch!='.' and (clip is None or clip(x0+i,y0+j)): img.px(x0+i,y0+j,BC[ch])
    if clip is None or clip(x0+2,y0+2): img.px(x0+2,y0+2,'#ffffff'); img.px(x0+2,y0+1,'#ffffff')

# ---------------------------------------------------------------- FRONT (walking down)
# frame table: bob, left leg (dy,lift), right leg (dy,lift), left-arm swing
FR=[(0,(2,0),(-1,0),-1),(1,(1,0),(-1,1),-1),(0,(0,0),(0,3),0),
    (0,(-1,0),(2,0),1),(1,(-1,1),(1,0),1),(0,(0,3),(0,0),0)]
def front(fi):
    b,(ldy,ll),(rdy,rl),sw=FR[fi]
    f=Fig(); ox,oy=OX,OY+b
    def T(pts,dx=0,dy=0): return [(x+ox+dx,y+oy+dy) for x,y in pts]
    def Eo(cx,cy,rx,ry,dy=0): return E(cx+ox,cy+oy+dy,rx,ry)
    fdL=ldy-ll; fdR=rdy-rl
    R={}
    R['neck']=f.add(P(T([(12.8,14),(18.2,14),(18.4,18),(12.6,18)])),'skin',2.0)
    R['torso']=f.add(P(T([(8,17.4),(23,17.4),(24.4,19.2),(23.4,33.6),(8.6,33.6),(7.4,19.2)])),'red',4.0)
    # legs (independent of the bob at the feet)
    R['legL']=f.add(P([(9.4+ox,39+oy),(14.2+ox,39+oy),(13.9+ox,45.8+OY+fdL),(10.1+ox,45.8+OY+fdL)]),'skin',2.0)
    R['legR']=f.add(P([(16.8+ox,39+oy),(21.6+ox,39+oy),(21.0+ox,45.8+OY+fdR),(17.2+ox,45.8+OY+fdR)]),'skin',2.0)
    R['shorts']=f.add(P(T([(8.4,32.6),(23.6,32.6),(24.4,40.6+ (0.6 if rl else 0)),(16.8,40.6+(0.6 if rl else 0)),(15.5,37.4),(14.2,40.6+(0.6 if ll else 0)),(7.6,40.6+(0.6 if ll else 0))])),'navy',3.0)
    R['sockL']=f.add(P([(9.9+ox,45.4+OY+fdL),(14.1+ox,45.4+OY+fdL),(14.1+ox,48.4+OY+fdL),(9.9+ox,48.4+OY+fdL)]),'wht',1.6)
    R['sockR']=f.add(P([(17.0+ox,45.4+OY+fdR),(21.2+ox,45.4+OY+fdR),(21.2+ox,48.4+OY+fdR),(17.0+ox,48.4+OY+fdR)]),'wht',1.6)
    R['shoeL']=f.add(E(11.7+ox,50.2+OY+fdL,4.0,2.4)|P([(9.2+ox,48+OY+fdL),(14.6+ox,48+OY+fdL),(14.8+ox,50+OY+fdL),(9+ox,50+OY+fdL)]),'wht',1.8)
    R['shoeR']=f.add(E(19.3+ox,50.2+OY+fdR,4.0,2.4)|P([(16.6+ox,48+OY+fdR),(22+ox,48+OY+fdR),(22.2+ox,50+OY+fdR),(16.4+ox,50+OY+fdR)]),'wht',1.8)
    R['sleeveL']=f.add(P(T([(8.4,17.4),(5.6,19),(4.4,23.6),(9.2,23.6),(9.6,19.2)])),'red',2.4)
    R['sleeveR']=f.add(P(T([(22.6,17.4),(25.4,19),(26.6,23.6),(21.8,23.6),(21.4,19.2)])),'red',2.4)
    hx=0.6*sw; hy=1.0*sw
    R['armL']=f.add(P(T([(4.8,23),(8.8,23),(8.4+hx,31.4+hy),(5.2+hx,31.4+hy)])),'skin',1.8)
    R['handL']=f.add(Eo(6.7+hx,32.9+hy,2.3+0.2*max(0,sw),2.5+0.2*max(0,sw)),'skin',1.6)
    R['earL']=f.add(Eo(8.9,11.4,1.2,1.7),'skin',1.0); R['earR']=f.add(Eo(22.1,11.4,1.2,1.7),'skin',1.0)
    R['head']=f.add(Eo(15.5,10.8,6.7,5.9)|P(T([(10,12),(21,12),(19,16.2),(12,16.2)])),'skin',3.2)
    yy=np.mgrid[0:H,0:W][0]
    R['cap']=f.add(Eo(15.5,6.2,7.6,6.0)&(yy<6.6+oy),'cap',3.0)
    R['visor']=f.add(Eo(15.5,6.9,9.2,1.7),'cap',1.2)
    R['uarmR']=f.add(P(T([(22.8,22.8),(26.6,22.8),(29.2,28.0),(26.2,28.6)])),'skin',1.6)
    R['ballmask']=f.add(Eo(23.4,31.8,5.4,5.4),'wht',5.0)
    R['farmR']=f.add(P(T([(26.4,27.6),(29.4,27.8),(29.8,33.0),(27.6,36.4),(25.2,36.2),(27.0,32.4)])),'skin',1.5)
    R['handR']=f.add(Eo(24.8,36.0,2.3,1.8),'skin',1.3)
    img=render_fig(f)
    # ball by hand, then forearm back on top
    arm=Img(W,H); m=(f.vid==R['farmR'])|(f.vid==R['handR']); arm.a[m]=img.a[m]
    p=Pen(img,ox,oy)
    p(0,15,"rr"); p(2,14,"qqq"); p(3,13,"qQqq"); p(4,13,"qqqQ")
    p(1,12,"C"); p(2,11,"D"); p(3,10,"E"); p(4,9,"D"); p(1,18,"A"); p(2,19,"A"); p(3,20,"A")
    p(6,8,"DEEEEDD")
    p(7,9,"I11111111111 I"); p(7,21,"1")
    p(8,9,"IJII3333III2 I"); p(8,21,"2")
    p(9,9,"4455555444433I")
    p(10,9,"455ye5554ye332"); p(11,9,"455ee5654ee332")
    p(12,9,"46553554434321"); p(13,10,"4553mmmm3321"); p(12,13,"3"); p(12,18,"3")
    p(14,11,"4444554321"); p(15,12,"34443221"); p(16,13,"222211")
    p(16,11,"M"); p(16,20,"L"); p(17,11,"NMMMMMMMML"); p(18,12,"WWWWWWWX")
    p(20,17,"MMM"); p(21,17,"WrW"); p(22,17,"MMM")
    p(25,10,"c"); p(26,11,"c"); p(28,13,"c"); p(29,12,"c"); p(27,19,"x"); p(28,20,"x")
    p(32,9,"zxxxxxxxxx")
    p(22,4,"WWWWX"); p(23,4,"MMMLL"); p(22,22,"XXXXY"); p(23,22,"LLLLL")
    p(19,9,"x"); p(20,9,"z"); p(19,22,"z"); p(20,22,"z")
    ax,ay=int(round(hx)),int(round(hy))
    p(27+ay//2,5,"4"); p(30+ay,5+ax,"MWrW")
    p(32+ay,4+ax,"5"); p(33+ay,4+ax,"54"); p(34+ay,5+ax,"323"); p(35+ay,5+ax,"2 1")
    for y in range(33,40): p(y,8,"W"); p(y,23,"X")
    p(33,9,"LLLLLLLLLLLLLL"); p(36,15,"L"); p(37,15,"g"); p(38,15,"g")
    draw_ball(img,18+ox,26+oy)
    img.a[m]=arm.a[m]
    p(28,27,"21"); p(36,23,"4 3"); p(35,22,"5")
    for y in range(28,35): p.px(25,y,'#8a889c')
    # lower body: knees, socks, sneakers (per-leg offsets, ground-relative)
    q=Pen(img,ox,OY)
    for (x0,fd,lift,side) in ((8,fdL,ll,'L'),(16,fdR,rl,'R')):
        if fd>=0 and not lift: q(42+fd,x0+3 if side=='L' else x0+2,"5" if side=='L' else "4")
        q(45+fd,x0+2 if side=='L' else x0+1,"XWWWX"); q(47+fd,x0+2 if side=='L' else x0+1,"XXXXX" if side=='L' else "XXXXY")
        if side=='L':
            rows=[".XWWWWX.","XWoWoWWX","WWWWWWWX","XMMMXXXY",".YYYYYY."]
        else:
            rows=[".XWWWXY.","XWoWoWXY","XWWWWWXY","XXXLLLXY",".YYYYYV."]
        if lift:   # lifted foot: sole tilts toward camera
            rows=rows[:3]+[ "YXXXXXXY" if side=='L' else "YXXXXXXV", ".VYYYYV."]
        for j,r in enumerate(rows): q(48+fd+j,x0,r)

    return img

def ground_shadow(img,cx,cy,rx,ry,al=90):
    for y in range(int(cy-ry),int(cy+ry)+1):
        for x in range(int(cx-rx),int(cx+rx)+1):
            if ((x-cx)/rx)**2+((y-cy)/ry)**2<1 and 0<=x<img.w and 0<=y<img.h: img.px(x,y,(30,24,30,al))

def strip(frames,k=8,bg='#b8ad9a',pad=4):
    w=(W+pad)*len(frames)+pad; s=Img(w,H+pad*2); s.rect(0,0,s.w,s.h,bg)
    for i,fr in enumerate(frames):
        ground_shadow(s,pad+i*(W+pad)+18,pad+H-4,9,2.2)
        s.blit(fr,pad+i*(W+pad),pad)
    return up(s,k)
if __name__=='__main__':
    fr=[front(i) for i in range(6)]
    strip(fr).save('walk_front_strip.png')
def gif(frames,path,k=6,bg=(184,173,154),ms=110,shadow=True):
    from PIL import Image
    out=[]
    for fr in frames:
        b=Img(W+8,H+4); b.rect(0,0,b.w,b.h,bg)
        if shadow: ground_shadow(b,4+18,2+H-4,9,2.2)
        b.blit(fr,4,2); out.append(b.pil().convert('RGB').resize((b.w*k,b.h*k),Image.NEAREST))
    out[0].save(path,save_all=True,append_images=out[1:],duration=ms,loop=0)

# ---------------------------------------------------------------- BACK (walking up)
def back(fi):
    b,(ldy,ll),(rdy,rl),sw=FR[fi]
    # from behind, the forward foot is the far one (higher on screen); flip dy
    ldy,rdy=-ldy,-rdy
    f=Fig(); ox,oy=OX,OY+b
    def T(pts,dx=0,dy=0): return [(x+ox+dx,y+oy+dy) for x,y in pts]
    def Eo(cx,cy,rx,ry): return E(cx+ox,cy+oy,rx,ry)
    fdL=ldy-ll; fdR=rdy-rl
    R={}
    R['ball']=f.add(Eo(6.6,31.6,5.4,5.4),'wht',5.0)          # ball in front of him -> behind the torso for us
    R['neck']=f.add(P(T([(13.2,12),(17.8,12),(18.2,18),(12.8,18)])),'skin',2.0)
    R['torso']=f.add(P(T([(8,17.4),(23,17.4),(24.4,19.2),(23.4,33.6),(8.6,33.6),(7.4,19.2)])),'red',4.0)
    R['legL']=f.add(P([(9.4+ox,39+oy),(14.2+ox,39+oy),(13.9+ox,45.8+OY+fdL),(10.1+ox,45.8+OY+fdL)]),'skin',2.0)
    R['legR']=f.add(P([(16.8+ox,39+oy),(21.6+ox,39+oy),(21.0+ox,45.8+OY+fdR),(17.2+ox,45.8+OY+fdR)]),'skin',2.0)
    R['shorts']=f.add(P(T([(8.4,32.6),(23.6,32.6),(24.4,40.6),(16.8,40.6),(15.5,37.8),(14.2,40.6),(7.6,40.6)])),'navy',3.0)
    R['sockL']=f.add(P([(9.9+ox,45.4+OY+fdL),(14.1+ox,45.4+OY+fdL),(14.1+ox,48.4+OY+fdL),(9.9+ox,48.4+OY+fdL)]),'wht',1.6)
    R['sockR']=f.add(P([(17.0+ox,45.4+OY+fdR),(21.2+ox,45.4+OY+fdR),(21.2+ox,48.4+OY+fdR),(17.0+ox,48.4+OY+fdR)]),'wht',1.6)
    R['shoeL']=f.add(E(11.7+ox,50.2+OY+fdL,3.8,2.2)|P([(9.2+ox,48+OY+fdL),(14.6+ox,48+OY+fdL),(14.8+ox,50+OY+fdL),(9+ox,50+OY+fdL)]),'wht',1.8)
    R['shoeR']=f.add(E(19.3+ox,50.2+OY+fdR,3.8,2.2)|P([(16.6+ox,48+OY+fdR),(22+ox,48+OY+fdR),(22.2+ox,50+OY+fdR),(16.4+ox,50+OY+fdR)]),'wht',1.8)
    R['sleeveL']=f.add(P(T([(8.4,17.4),(5.6,19),(4.4,23.6),(9.2,23.6),(9.6,19.2)])),'red',2.4)
    R['sleeveR']=f.add(P(T([(22.6,17.4),(25.4,19),(26.6,23.6),(21.8,23.6),(21.4,19.2)])),'red',2.4)
    # viewer-left arm = his right arm, bent around the ball (upper arm + elbow visible)
    R['uarmA']=f.add(P(T([(4.8,22.8),(8.6,22.8),(6.4,29.6),(3.0,29.0)])),'skin',1.6)
    R['elbA']=f.add(Eo(4.6,29.6,1.9,1.7),'skin',1.2)
    # viewer-right arm = his left arm, swinging (mirror of the front swing, opposite phase)
    hx=-0.6*(-sw); hy=1.0*(-sw)
    R['armB']=f.add(P(T([(22.2,23),(26.2,23),(25.8+hx,31.4+hy),(22.6+hx,31.4+hy)])),'skin',1.8)
    R['handB']=f.add(Eo(24.3+hx,32.9+hy,2.3,2.5),'skin',1.6)
    R['earL']=f.add(Eo(8.9,11.4,1.2,1.7),'skin',1.0); R['earR']=f.add(Eo(22.1,11.4,1.2,1.7),'skin',1.0)
    yy=np.mgrid[0:H,0:W][0]
    headm=Eo(15.5,10.6,6.7,5.7)|P(T([(10.2,11),(20.8,11),(18.6,14.6),(12.4,14.6)]))
    R['hairB']=f.add(headm,'hair',3.2)
    R['cap']=f.add(Eo(15.5,6.6,7.7,6.2)&(yy<7.4+oy),'cap',3.0)
    img=render_fig(f)
    ballm=f.vid==R['ball']
    tmp=Img(W,H); draw_ball(tmp,1+ox,26+oy)
    img.a[ballm&(tmp.a[:,:,3]>0)]=tmp.a[ballm&(tmp.a[:,:,3]>0)]
    p=Pen(img,ox,oy)
    # cap back: snap-strap opening showing hair, stitched panels, red button
    p(0,15,"rr"); p(1,12,"C"); p(2,11,"D"); p(3,10,"E"); p(4,9,"D")
    p(1,15,"A"); p(2,15,"A"); p(3,15,"A")                    # centre seam
    p(4,13,"BAAAB"); p(5,13,"AhJhA"); p(6,13,"AJJJA"); p(7,11,"CBBEEDBBC")   # strap arch + adjuster
    # hair fade at the nape, ears seen from behind
    p(8,10,"KhJJIIIIIIII"); p(9,9,"KKhJJIIIIIIII"); p(10,9,"KhJJIJIIJIIII"); p(11,10,"hJJIJIIJIII")
    p(12,11,"hJIJIIJII"); p(13,12,"J3J3I2I"); p(14,13,"45433")      # short fade into the nape
    p(15,13,"44332"); p(16,13,"3322")
    p(10,8,"4"); p(11,8,"3"); p(10,23,"2"); p(11,23,"1")
    # collar back + number 10
    p(16,11,"M"); p(16,20,"L"); p(17,11,"NMMMMMMMML")
    for j,r in enumerate([".WW. .WWW.","WWW. WW.WW",".WW. WW.WW",".WW. WW.WW",".WW. WW.WW","WWWW .WWW."]):
        for i,ch in enumerate(r):
            if ch=='W': p.px(11+i,21+j,CM['W']); p.px(12+i,22+j,CM['x']) if r[i+1:i+2] in ('.',' ','') else None
    p(22,4,"WWWWX"); p(23,4,"MMMLL"); p(22,22,"XXXXY"); p(23,22,"LLLLL")
    p(25,10,"c"); p(26,11,"c"); p(28,19,"x"); p(29,20,"x"); p(32,9,"zxxxxxxxxxxxz")
    # left (viewer-right) arm: bracelet + fingers
    ax,ay=int(round(hx)),int(round(hy))
    p(30+ay,22+ax,"WrWM"); p(34+ay,23+ax,"3 3"); p(35+ay,23+ax,"2 2")
    for y in range(33,40): p(y,8,"W"); p(y,23,"X")
    p(33,9,"LLLLLLLLLLLLLL"); p(37,15,"g"); p(38,15,"g")
    q=Pen(img,ox,OY)
    for (x0,fd,lift,side) in ((8,fdL,ll,'L'),(16,fdR,rl,'R')):
        q(45+fd,x0+2 if side=='L' else x0+1,"XWWWX")
        if lift:     # heel lifts toward camera -> sole shows
            rows=[".XWWWWX.","XWWMMWWX","YXXXXXXY","VYYYYYYV",".VVVVVV."]
        else:
            rows=[".XWWWWX.","XWWMMWWX","XWWWWWWX","XXXXXXXY",".YYYYYY."] if side=='L' else [".XWWWXY.","XWWLLWXY","XWWWWWXY","XXXXXXXY",".YYYYYV."]
        for j,r in enumerate(rows): q(48+fd+j,x0,r)
        if not lift and fd>=0: q(43+fd,x0+3,"3")          # calf crease
    return img

# ---------------------------------------------------------------- SIDE (walking right / left)
# per frame: bob, near leg (knee, ankle, foot pose), far leg (knee, ankle, pose), far/near arm swing
# foot pose: 0 flat, 1 toe-down (heel up), 2 lifted/tilted
SF=[(0, ((19.6,41.0),(22.0,47.6),0), ((13.0,41.2),(9.8,47.0),1), +1),
    (1, ((18.6,41.4),(19.2,47.8),0), ((12.8,41.4),(10.6,45.8),2), +0.5),
    (0, ((16.6,41.2),(16.2,48.0),0), ((18.0,40.4),(14.6,45.0),2), 0),
    (0, ((13.0,41.2),(9.8,47.0),1), ((19.6,41.0),(22.0,47.6),0), -1),
    (1, ((12.8,41.4),(10.6,45.8),2), ((18.6,41.4),(19.2,47.8),0), -0.5),
    (0, ((18.0,40.4),(14.6,45.0),2), ((16.6,41.2),(16.2,48.0),0), 0)]
def shoe_pts(ax,ay,pose):
    if pose==0: pts=[(ax-2.6,ay+0.0),(ax+1.6,ay-0.6),(ax+4.6,ay+0.9),(ax+5.8,ay+2.0),(ax+5.6,ay+3.4),(ax-2.8,ay+3.4)]
    elif pose==1: pts=[(ax-1.8,ay-1.2),(ax+1.8,ay-0.2),(ax+4.6,ay+1.8),(ax+5.2,ay+3.4),(ax+3.6,ay+4.0),(ax-2.6,ay+1.2)]
    else: pts=[(ax-2.6,ay-0.4),(ax+1.4,ay-0.4),(ax+4.0,ay+1.6),(ax+4.6,ay+3.0),(ax+3.4,ay+3.6),(ax-2.8,ay+2.4)]
    return pts
def side(fi,facing='R'):
    b,near,far,sw=SF[fi]
    mir=(facing=='L')
    MX=lambda x: (W-1-x) if mir else x
    def M(pts): return [(MX(x),y) for x,y in pts]
    def Em(cx,cy,rx,ry): return E(MX(cx),cy,rx,ry)
    def Lm(p0,p1,r0,r1): return limb((MX(p0[0]),p0[1]),(MX(p1[0]),p1[1]),r0,r1)
    oy=OY+b; f=Fig(); R={}
    hip=(15.6,34.6+oy)
    def leg(pre,kn,an,pose,dark):
        kn=(kn[0],kn[1]+OY+ (b if False else 0)); an=(an[0],an[1]+OY)
        thigh=Lm(hip,kn,2.6,2.2); calf=Lm(kn,an,2.1,1.6)
        R[pre+'calf']=f.add(calf,'skin',1.6,dark)
        R[pre+'sock']=f.add(Lm((an[0]+(kn[0]-an[0])*0.35,an[1]+(kn[1]-an[1])*0.35),an,1.9,1.8),'wht',1.4,dark)
        R[pre+'shoe']=f.add(P(M(shoe_pts(an[0],an[1],pose))),'wht',1.6,dark)
        R[pre+'thigh']=f.add(thigh|Lm(hip,(hip[0]+(kn[0]-hip[0])*0.15,hip[1]+(kn[1]-hip[1])*0.15),3.2,3.0),'navy',2.4,dark)
        return an,kn
    # ---- far side: far arm (behind torso), far leg
    if facing=='R':      # far arm = his left arm, swinging
        hxy=(15.0+sw*5.2,31.0-abs(sw)*0.8+oy)
        R['farArm']=f.add(Lm((15.0,20.5+oy),(15.0+sw*2.6,26.0+oy),1.8,1.7)|Lm((15.0+sw*2.6,26.0+oy),hxy,1.7,1.5),'skin',1.5,1)
        R['farHand']=f.add(Em(hxy[0],hxy[1]+1.2,1.9,2.0),'skin',1.2,1)
    else:                # far arm = his right arm with the ball (ball mostly hidden by torso)
        pass
    anF,knF=leg('f',far[0],far[1],far[2],1)
    # ---- torso, head
    R['neck']=f.add(P(M([(13.6,13.5+oy),(18.0,13.5+oy),(18.4,18.5+oy),(13.4,18.5+oy)])),'skin',1.8)
    R['torso']=f.add(P(M([(11.8,17.4+oy),(19.4,17.4+oy),(20.8,20.2+oy),(20.4,26+oy),(19.8,33.8+oy),(11.4,33.8+oy),(10.6,26+oy),(10.8,20.2+oy)])),'red',3.6)
    R['shorts']=f.add(P(M([(11.0,32.8+oy),(20.2,32.8+oy),(20.8,37.2+oy),(11.0,37.6+oy)])),'navy',2.6)
    anN,knN=leg('n',near[0],near[1],near[2],0)
    R['head']=f.add(Em(15.8,10.6+oy,6.3,5.8)|P(M([(15.8,11+oy),(21.6,10.6+oy),(22.2,13.4+oy),(20.8,16.0+oy),(15.2,16.2+oy)]))|Em(22.2,11.8+oy,1.2,1.1),'skin',3.0)
    R['ear2']=f.add(Em(14.8,11.6+oy,1.3,1.8),'skin',1.0)
    yy=np.mgrid[0:H,0:W][0]
    R['hair']=f.add((Em(15.4,9.6+oy,6.6,5.2)&(yy>=6+oy)&(yy<12.6+oy)&(np.mgrid[0:H,0:W][1]<=MX(14.2) if not mir else np.mgrid[0:H,0:W][1]>=MX(14.2))),'hair',2.4)
    R['cap']=f.add(Em(15.6,6.3,7.0,5.7)&(yy<7.2+oy),'cap',3.0)
    R['visor']=f.add(Em(22.6,7.0+oy,5.2,1.3),'cap',1.0)
    # ---- near arm
    if facing=='R':      # near arm = his right arm hugging the ball
        R['ball']=f.add(Em(17.6,30.4+oy,5.4,5.4),'wht',5.0)
        R['uarm']=f.add(Lm((14.8,21.0+oy),(13.0,28.0+oy),1.6,1.5),'skin',1.4)
        R['farm']=f.add(Lm((13.0,28.0+oy),(16.2,34.8+oy),1.5,1.4)|Lm((16.2,34.8+oy),(20.6,33.8+oy),1.4,1.3),'skin',1.3)
        R['hand']=f.add(Em(21.6,32.6+oy,1.6,1.8),'skin',1.1)
    else:                # near arm = his left arm, swinging opposite to the near leg
        s2=-sw
        hxy=(15.0+s2*5.2,31.0-abs(s2)*0.8+oy)
        R['uarm']=f.add(Lm((15.2,20.5+oy),(15.2+s2*2.4,26.4+oy),1.6,1.5),'skin',1.4)
        R['farm']=f.add(Lm((15.2+s2*2.4,26.4+oy),hxy,1.5,1.4),'skin',1.3)
        R['hand']=f.add(Em(hxy[0],hxy[1]+1.0,1.8,1.9),'skin',1.1)
    # sleeve over the upper arm (short sleeve)
    R['sleeve']=f.add(P(M([(12.6,17.8+oy),(17.6,17.8+oy),(18.2,23.8+oy),(12.4,23.8+oy)])),'red',2.0)
    img=render_fig(f)
    def P_(y,x,st):    # mirrored detail painter (x in right-facing coords)
        for i,ch in enumerate(st):
            if ch in (' ','.'): continue
            X=x+i; img.px(MX(X),oy+y,CM[ch])
    if facing=='R':
        tmp=Img(W,H); draw_ball(tmp,12,25+oy)
        keep=(f.vid==R['ball'])&(tmp.a[:,:,3]>0); img.a[keep]=tmp.a[keep]
        P_(32,21,"4"); P_(33,22,"3"); P_(31,22,"5")      # fingers cupping the ball
    # cap: patch on the front panel, button, rim light on the back
    P_(0,15,"rr"); P_(2,17,"qqq"); P_(3,17,"qQq"); P_(3,10,"E"); P_(4,9,"D"); P_(2,11,"D")
    P_(6,17,"AAAAAAAA"); P_(7,19,"BBBBBBBB")          # visor underside shadow
    # hair at the back + sideburn, eye, brow, mouth, cheek
    P_(8,10,"KhJ"); P_(9,9,"KhJI"); P_(10,9,"hJII"); P_(11,10,"JII"); P_(12,11,"hI")
    P_(9,16,"I"); P_(10,16,"I"); P_(11,16,"J")
    P_(8,19,"III"); P_(9,19,"3"); P_(10,19,"ey"); P_(11,19,"ee")
    P_(13,20,"3"); P_(14,20,"mm"); P_(13,18,"5")
    P_(12,22,"5"); P_(13,22,"2")                        # nose highlight / nostril shade
    P_(11,15,"3"); P_(12,15,"2")                        # ear detail
    # collar + sleeve trim + jersey side seam
    P_(17,13,"LMMMMN"); P_(18,14,"WWWW")
    P_(22,12,"WWWWWX"); P_(23,12,"MMMMML")
    P_(33,11,"LLLLLLLLLL")
    if facing=='L':
        for y in range(34,37): P_(y,15,"W")
    if facing=='L':
        # bracelet on the swinging near hand
        s2=-sw; hx=15.0+s2*5.2; hy=31.0-abs(s2)*0.8
        P_(int(round(hy))-1,int(round(hx))-1,"MWr")
    # shoe details (laces + accent) for both legs
    for (an,pose,dark) in ((anN,near[2],0),(anF,far[2],1)):
        ax,ay=int(round(an[0])),int(round(an[1]))
        if pose==0:
            P_(ay-oy+0,ax,"oWo"); P_(ay-oy+2,ax-2,"MMMM" if not dark else "LLLL")
            P_(ay-oy+3,ax-2,"YYYYYYYY" if not dark else "VVVVVVVV")
        elif pose==1:
            P_(ay-oy+0,ax,"oW"); P_(ay-oy+2,ax,"YY")
        else:
            P_(ay-oy+0,ax,"oW"); P_(ay-oy+2,ax-1,"VYYYY")
    return img
