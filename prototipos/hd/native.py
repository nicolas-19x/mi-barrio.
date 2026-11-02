from PIL import Image
import math, colorsys
from collections import deque
SRC=Image.open('/root/.claude/uploads/30fc341f-8960-5712-8205-dad1772a706d/9199c36a-image.png').convert('RGB');px=SRC.load();W,H=SRC.size
# perfil de bordes horizontales y verticales dentro del personaje
def prof(axis):
    n=W if axis==0 else H;p=[0.0]*n
    for a in range(1,n):
        s=0
        for b in range(250,1050,3):
            if axis==0:
                c1,c0=px[a,b],px[a-1,b]
            else:
                c1,c0=px[b,a],px[b,a-1]
            s+=sum(abs(c1[i]-c0[i]) for i in range(3))
        p[a]=s
    return p
def best(p,lo,hi):
    bestv=None
    for k in range(int(lo*100),int(hi*100)):
        per=k/100;cs=sum(v*math.cos(2*math.pi*i/per) for i,v in enumerate(p));sn=sum(v*math.sin(2*math.pi*i/per) for i,v in enumerate(p))
        m=math.hypot(cs,sn)
        if not bestv or m>bestv[0]:bestv=(m,per,math.atan2(sn,cs))
    m,per,ph=bestv;off=(ph/(2*math.pi)*per)%per;return per,off
px_x=prof(0);px_y=prof(1)
pxp,ox=best(px_x,8.5,11.5);pyp,oy=best(px_y,8.5,11.5)
print('periodo',pxp,pyp,'fase',ox,oy)
# muestreo en el centro de cada celda (las celdas empiezan en los bordes)
cols=int((W-ox)/pxp);rows=int((H-oy)/pyp)
nat=Image.new('RGB',(cols,rows));np_=nat.load()
for j in range(rows):
    for i in range(cols):
        cx=ox+(i+.5)*pxp;cy=oy+(j+.5)*pyp
        acc=[0,0,0];n=0
        for dy in (-1.5,0,1.5):
            for dx in (-1.5,0,1.5):
                c=px[min(W-1,int(cx+dx)),min(H-1,int(cy+dy))];acc=[acc[k]+c[k] for k in range(3)];n+=1
        np_[i,j]=tuple(round(v/n) for v in acc)
nat.save('nat_raw.png');print(nat.size)
