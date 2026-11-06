# Tico muchacho — style B character, 32x52, volumetric shading + hand-drawn details
import numpy as np, math
from px import Img, ell, poly, hexc, up
W,H=32,54
RAMP={
 'skin':['#4a2418','#6e3622','#90492c','#b0613a','#c97c4c','#dc9a64','#ecb886'],
 'red': ['#3e0a14','#640f1e','#8e1626','#b41f2e','#d23038','#e8524a','#f87c62'],
 'blue':['#0e1a44','#16286a','#20389a','#2e4cbc','#4468d4','#5a80e0','#7a9aec'],
 'wht': ['#5a5872','#8a88a0','#b4b2c4','#d4d2dc','#ecebef','#f6f4f2','#fffdf8'],
 'navy':['#0a1028','#121c40','#1a2a5c','#243a7a','#30509a','#4268b4','#5a82c8'],
 'cap': ['#0c0c12','#16161e','#20202a','#2c2c38','#3a3a48','#4c4c5c','#626276'],
 'hair':['#0c0808','#1a1012','#28191a','#382426','#4a3232','#5e4040','#745050'],
}
def chamfer(m):
    d=np.where(m,1e9,0.0); h,w=m.shape
    for _ in range(2):
        for y in range(h):
            for x in range(w):
                if d[y,x]==0: continue
                v=d[y,x]
                for dy,dx,c in ((-1,0,1),(0,-1,1),(-1,-1,1.414),(-1,1,1.414)):
                    yy,xx=y+dy,x+dx
                    v=min(v,(d[yy,xx] if 0<=yy<h and 0<=xx<w else 0)+c)
                d[y,x]=v
        for y in range(h-1,-1,-1):
            for x in range(w-1,-1,-1):
                if d[y,x]==0: continue
                v=d[y,x]
                for dy,dx,c in ((1,0,1),(0,1,1),(1,1,1.414),(1,-1,1.414)):
                    yy,xx=y+dy,x+dx
                    v=min(v,(d[yy,xx] if 0<=yy<h and 0<=xx<w else 0)+c)
                d[y,x]=v
    return d
class Fig:
    def __init__(s): s.vid=np.full((H,W),-1,int); s.mats=[]; s.flat=[]; s.rnd=[]
    def add(s,m,mat,rnd=3.0,flat=0.0):
        s.vid[m]=len(s.mats); s.mats.append(mat); s.rnd.append(rnd); s.flat.append(flat); return len(s.mats)-1
E=lambda *a,**k: ell(H,W,*a,**k)
P=lambda pts: poly(H,W,pts)
def build_regions():
    f=Fig(); R={}
    R['neck']=f.add(P([(12.8,14),(18.2,14),(18.4,18),(12.6,18)]),'skin',2.0)
    R['torso']=f.add(P([(8,17.4),(23,17.4),(24.4,19.2),(23.4,33.6),(8.6,33.6),(7.4,19.2)]),'red',4.0)
    R['shorts']=f.add(P([(8.4,32.6),(23.6,32.6),(24.4,40.6),(16.8,40.6),(15.5,37.4),(14.2,40.6),(7.6,40.6)]),'navy',3.0)
    R['legL']=f.add(P([(9.4,40),(14.2,40),(13.9,45.8),(10.1,45.8)]),'skin',2.0)
    R['legR']=f.add(P([(16.8,40),(21.6,40),(21.0,45.8),(17.2,45.8)]),'skin',2.0)
    R['sockL']=f.add(P([(9.9,45.4),(14.1,45.4),(14.1,48.4),(9.9,48.4)]),'wht',1.6)
    R['sockR']=f.add(P([(17.0,45.4),(21.2,45.4),(21.2,48.4),(17.0,48.4)]),'wht',1.6)
    R['shoeL']=f.add(E(11.7,50.2,4.0,2.4)|P([(9.2,48),(14.6,48),(14.8,50),(9,50)]),'wht',1.8)
    R['shoeR']=f.add(E(19.3,50.2,4.0,2.4)|P([(16.6,48),(22,48),(22.2,50),(16.4,50)]),'wht',1.8)
    R['sleeveL']=f.add(P([(8.4,17.4),(5.6,19),(4.4,23.6),(9.2,23.6),(9.6,19.2)]),'red',2.4)
    R['sleeveR']=f.add(P([(22.6,17.4),(25.4,19),(26.6,23.6),(21.8,23.6),(21.4,19.2)]),'red',2.4)
    R['armL']=f.add(P([(4.8,23),(8.8,23),(8.4,31.4),(5.2,31.4)]),'skin',1.8)
    R['handL']=f.add(E(6.7,32.9,2.3,2.5),'skin',1.6)
    R['earL']=f.add(E(8.9,11.4,1.2,1.7),'skin',1.0)
    R['earR']=f.add(E(22.1,11.4,1.2,1.7),'skin',1.0)
    R['head']=f.add(E(15.5,10.8,6.7,5.9)|P([(10,12),(21,12),(19,16.2),(12,16.2)]),'skin',3.2)
    R['cap']=f.add(E(15.5,6.2,7.6,6.0)&(np.mgrid[0:H,0:W][0]<6.6),'cap',3.0)
    R['visor']=f.add(E(15.5,6.9,9.2,1.7),'cap',1.2)
    R['uarmR']=f.add(P([(22.8,22.8),(26.6,22.8),(29.2,28.0),(26.2,28.6)]),'skin',1.6)
    R['ball']=f.add(E(23.4,31.8,5.4,5.4),'wht',5.0)
    R['farmR']=f.add(P([(26.4,27.6),(29.4,27.8),(29.8,33.0),(27.6,36.4),(25.2,36.2),(27.0,32.4)]),'skin',1.5)
    R['handR']=f.add(E(24.8,36.0,2.3,1.8),'skin',1.3)
    return f,R
def shade(f,light=(-0.62,-0.55,0.56)):
    L=np.array(light); L=L/np.linalg.norm(L)
    k=np.full((H,W),-1,int); n_out=np.zeros((H,W,3))
    for i,mat in enumerate(f.mats):
        m=f.vid==i
        if not m.any(): continue
        from vol import blur
        r=f.rnd[i]
        hgt=blur(m,max(1,int(round(r*0.8))))*r*1.6
        d2=chamfer(m); hgt=0.6*hgt+0.4*np.sqrt(np.clip(d2/r,0,1))*r
        gy,gx=np.gradient(hgt)
        n=np.dstack([-gx,-gy,np.ones_like(gx)*0.9]); n/=np.linalg.norm(n,axis=2,keepdims=True)
        lam=(n@L)
        val=0.18+0.95*np.clip(lam,0,1)
        n_out[m]=n[m]
        k[m]=np.clip(np.round(val[m]*6-0.4),0,6).astype(int)
    # cast/contact shadow: a volume in front darkens what lies right/below its edge
    for i in range(len(f.mats)):
        front=f.vid>i
        m=f.vid==i
        sh=np.zeros((H,W),bool)
        for dy,dx in ((1,0),(2,0),(1,1),(2,1),(1,-1)):
            sh|=np.roll(np.roll(front,dy,0),dx,1)
        sh&=m&~front
        k[sh]=np.maximum(k[sh]-2,0)
    return k,n_out
def render():
    f,R=build_regions(); k,n=shade(f)
    img=Img(W,H)
    for y in range(H):
        for x in range(W):
            v=f.vid[y,x]
            if v<0: continue
            mat=f.mats[v]; kk=k[y,x]
            # selective outline: boundary to background on the shadow side gets the darkest tone
            edge=any(not(0<=x+dx<W and 0<=y+dy<H) or f.vid[y+dy,x+dx]<0 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
            if edge:
                left_open=(x-1<0 or f.vid[y,x-1]<0)
                if left_open and mat in ('skin','red','navy','cap','wht') and y<46:
                    kk=min(6,kk+1)                     # warm rim light: sun from the west
                elif n[y,x,0]>0.05 or n[y,x,1]>0.25: kk=max(0,min(kk,1))
                else: kk=max(1,kk-1)
            img.px(x,y,RAMP[mat][kk])
    return img,f,R
def put(img,y,x,s,cmap):
    for i,ch in enumerate(s):
        if ch in (' ','.'): continue
        c=cmap[ch]; img.px(x+i,y,c)
def sprite_arm():
    # render only the right forearm + hand layers (to put them back over the hand-drawn ball)
    img,f,R=render(); out=Img(W,H)
    m=(f.vid==R['farmR'])|(f.vid==R['handR'])
    out.a[m]=img.a[m]; return out
def details(img):
    S=RAMP['skin']; CM={str(i):S[i] for i in range(7)}
    CM.update({'e':'#140a08','y':'#fbf4ec','m':'#6a2418','t':'#f4ece0','I':RAMP['hair'][1],'J':RAMP['hair'][2],'K':RAMP['hair'][4],
               'q':'#eeeae0','Q':'#b8b2a8','A':RAMP['cap'][0],'B':RAMP['cap'][1],'C':RAMP['cap'][3],'D':RAMP['cap'][4],'E':RAMP['cap'][6],'r':'#d23038','R':'#8e1626',
               'L':RAMP['blue'][1],'M':RAMP['blue'][3],'N':RAMP['blue'][5],'W':RAMP['wht'][5],'X':RAMP['wht'][3],'Y':RAMP['wht'][1],'V':RAMP['wht'][0],
               'z':RAMP['red'][0],'x':RAMP['red'][1],'c':RAMP['red'][2],'v':RAMP['red'][3],'b':RAMP['red'][4],'n':RAMP['red'][5],
               'k':'#16161c','o':'#8a8a9a','p':'#c03030','g':'#2a2a34'})
    # --- cap
    put(img,0,15,"rr",CM)
    put(img,2,14,"qqq",CM); put(img,3,13,"qQqq",CM); put(img,4,13,"qqqQ",CM)
    put(img,1,12,"C",CM); put(img,2,11,"D",CM); put(img,3,10,"E",CM); put(img,4,9,"D",CM)
    put(img,1,18,"A",CM); put(img,2,19,"A",CM); put(img,3,20,"A",CM)
    put(img,6,8,"DEEEEDD",CM)
    # --- face (hand drawn): soft brows a row above the eyes, friendly closed smile
    put(img,7,9, "I11111111111 I",CM)
    put(img,7,21,"1",CM)
    put(img,8,9, "IJII3333III2 I",CM)       # brows sit in the visor shade
    put(img,8,21,"2",CM)
    put(img,9,9, "4455555444433I",CM)
    put(img,10,9,"455ye5554ye332",CM)
    put(img,11,9,"455ee5654ee332",CM)
    put(img,12,9,"46553554434321",CM)
    put(img,13,10,"4553mmmm3321",CM)
    put(img,12,13,"3",CM); put(img,12,18,"3",CM)          # smile corners lifted
    put(img,14,11,"4444554321",CM)
    put(img,15,12,"34443221",CM)
    put(img,16,13,"222211",CM)
    # --- collar
    put(img,16,11,"M",CM); put(img,16,20,"L",CM)
    put(img,17,11,"NMMMMMMMML",CM)
    put(img,18,12,"WWWWWWWX",CM)
    # --- chest patch tricolour
    put(img,20,17,"MMM",CM); put(img,21,17,"WrW",CM); put(img,22,17,"MMM",CM)
    # --- jersey folds (soft) + hem
    put(img,25,10,"c",CM); put(img,26,11,"c",CM); put(img,28,13,"c",CM); put(img,29,12,"c",CM)
    put(img,27,19,"x",CM); put(img,28,20,"x",CM)
    put(img,32,9,"zxxxxxxxxxxxz",CM)
    # --- sleeve trims + armpit shade
    put(img,22,4,"WWWWX",CM); put(img,23,4,"MMMLL",CM)
    put(img,22,22,"XXXXY",CM); put(img,23,22,"LLLLL",CM)
    put(img,19,9,"x",CM); put(img,20,9,"z",CM); put(img,19,22,"z",CM); put(img,20,22,"z",CM)
    # --- left arm: elbow crease, bracelet, hand with thumb
    put(img,27,5,"4",CM); put(img,27,8,"2",CM)
    put(img,30,5,"MWrW",CM)
    put(img,32,4,"5",CM); put(img,33,4,"54",CM); put(img,34,5,"323",CM); put(img,35,5,"2 1",CM)   # thumb + finger gaps
    # --- shorts: white side stripe, waistband, centre seam
    for y in range(33,40): put(img,y,8,"W",CM); put(img,y,23,"X",CM)
    put(img,33,9,"LLLLLLLLLLLLLL",CM)
    put(img,36,15,"L",CM); put(img,37,15,"g",CM); put(img,38,15,"g",CM)
    # --- knees
    put(img,41,11,"5",CM); put(img,42,11,"4",CM); put(img,41,18,"4",CM)
    # --- socks + hand-drawn sneakers
    put(img,45,10,"XWWWX",CM); put(img,45,17,"XWWWX",CM)
    put(img,47,10,"XXXXX",CM); put(img,47,17,"XXXXY",CM)
    put(img,48,8,".XWWWWX.",CM); put(img,48,16,".XWWWXY.",CM)
    put(img,49,8,"XWoWoWWX",CM); put(img,49,16,"XWoWoWXY",CM)
    put(img,50,8,"WWWWWWWX",CM); put(img,50,16,"XWWWWWXY",CM)
    put(img,51,8,"XMMMXXXY",CM); put(img,51,16,"XXXLLLXY",CM)
    put(img,52,8,".YYYYYY.",CM); put(img,52,16,".YYYYYV.",CM)
    # --- football drawn by hand, then the forearm/hand redrawn over it
    BALL=["...XWWWX...",
          ".XWWKKKWXY.",
          ".WWWWKWWWY.",
          "XKWWWWWWKXY",
          "KKWWKKKWWKY",
          "WWWKKKKKWXY",
          "WWWWKKKWWXY",
          "XKWWWWWWWKY",
          ".KKWWWWWKY.",
          ".XWWWKKWXYY",
          "...YKKYY..."]
    BC={'W':'#fbfaf6','X':'#d8d6e0','Y':'#9e9cb0','K':'#26262e'}
    for j,r in enumerate(BALL):
        for i,ch in enumerate(r):
            if ch!='.': img.px(18+i,26+j,BC[ch])
    img.px(20,28,'#ffffff'); img.px(20,27,'#ffffff')
    arm=sprite_arm()
    for y in range(H):
        for x in range(W):
            if arm.a[y,x,3]: img.a[y,x]=arm.a[y,x]
    # --- right arm hugging the ball: elbow, fingers under the ball
    put(img,28,27,"21",CM)
    put(img,36,23,"4 3",CM); put(img,35,22,"5",CM)
    for y in range(28,35): img.px(25,y,'#8a889c')      # ball shade under the forearm
    return img
def sprite():
    img,f,R=render(); return details(img)
if __name__=='__main__':
    s=sprite()
    bg=Img(W+8,H+6); bg.rect(0,0,bg.w,bg.h,'#b4aa98'); bg.blit(s,4,2); up(bg,12).save('tico.png')
