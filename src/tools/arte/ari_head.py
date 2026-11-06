# Ariana — personaje propio (estilo B): cuerpo estilizado, pelo largo ondulado, cara detallada,
# argollas, cadenita, faja, tenis. Mismo sistema de códigos material+tono que los NPC (el editor sigue tiñendo).
import numpy as np, math
import anim, npcrig
from anim import Fig,E,P,limb,W,H,OX,OY
from npcrig import FR,SF,render_codes,code_mat,MATS
AFIX=['#120806','#fbf4ec','#5a2e1c','#c8485a','#e8788a','#e07870','#0a0404','#ece8e0','#b8b4b0','#4a2c1c','#7a4a2a','#f6e6d8','#9a3040']
AFX={n:i for i,n in enumerate(['eye','glint','iris','lips','lipsH','blush','lash','sole','soleS','belt','beltH','teeth','lipD'])}
def cfix(n): return 49+AFX[n]
yy_,xx_=np.mgrid[0:H,0:W]
class Pt:
    def __init__(s,C,ox,oy,mir=False): s.C,s.ox,s.oy,s.mir=C,ox,oy,mir
    def _xy(s,x,y):
        X=s.ox+x; X=(W-1-X) if s.mir else X; return int(X),int(s.oy+y)
    def fix(s,x,y,n):
        X,Y=s._xy(x,y)
        if 0<=X<W and 0<=Y<H: s.C[Y,X]=cfix(n)
    def mat(s,x,y,m,k):
        X,Y=s._xy(x,y)
        if 0<=X<W and 0<=Y<H: s.C[Y,X]=code_mat(m,k)
    def get(s,x,y):
        X,Y=s._xy(x,y)
        return s.C[Y,X] if 0<=X<W and 0<=Y<H else -1
    def shift(s,x,y,dk,only=None):
        X,Y=s._xy(x,y)
        if 0<=X<W and 0<=Y<H and 0<=s.C[Y,X]<49:
            c=s.C[Y,X]; m,k=c//7,c%7
            if only and m!=MATS[only]-1: return
            s.C[Y,X]=m*7+max(0,min(6,k+dk))
def ismat(C,m): return (C>=0)&(C<49)&((C//7)==MATS[m]-1)
def wavy(xl,xr,yt,yb,amp=0.7,per=3.2,ph=0.0,tips=4,tipd=1.6):
    """masa de pelo con bordes ondulados y puntas en la base"""
    pts=[]; n=14
    for i in range(n+1):
        y=yt+(yb-yt)*i/n; pts.append((xl-amp*math.sin(y/per+ph)*(i/n),y))
    for i in range(tips*2+1):
        x=xl+(xr-xl)*i/(tips*2); pts.append((x,yb+(tipd if i%2 else 0)-0.3*math.sin(i+ph)))
    for i in range(n,-1,-1):
        y=yt+(yb-yt)*i/n; pts.append((xr+amp*math.sin(y/per+ph+1.3)*(i/n),y))
    return pts
