# volumetric furniture helpers for 3/4 top-down interiors (style B)
from interior import *
def grad_rect(cv,x,y,w,h,c,f0,f1,noise=3,seed=0,hl=True):
    rng=np.random.default_rng(seed); base=C(c)
    for j in range(h):
        f=f0+(f1-f0)*(j/max(1,h-1))
        row=base*f+rng.integers(-noise,noise+1,(w,1))
        cv.a[y+j,x:x+w]=np.clip(row,0,255)
def box(cv,x,y,w,depth,height,top,front,seed=0,cast=True,lip=True):
    """top face (depth px, lit) + front face (height px) + edges + contact/cast shadow"""
    yb=y+depth+height
    if cast:   # soft cast shadow to the right/down (window light from upper-left)
        for k in range(5): cv.mul(x+w+k,y+depth+2+k,1,height-2,[0.70+0.06*k]*3)
        for k in range(4): cv.mul(x+3,yb+k,w,1,[0.58+0.1*k]*3)
    grad_rect(cv,x,y,w,depth,top,0.92,1.06,seed=seed)                 # top: darker at the back (wall AO)
    grad_rect(cv,x,y+depth,w,height,front,0.92,0.72,seed=seed+1)      # front: darker towards the floor
    if lip:
        cv.rect(x,y+depth-1,w,1,shade(top,1.22))                       # lit front lip of the top
        cv.rect(x,y+depth,w,1,shade(front,0.62))                       # shadow under the lip
    cv.rect(x,y,1,depth+height,shade(front,1.12))                      # left edge catches window light
    cv.rect(x+w-1,y,1,depth+height,shade(front,0.62))                  # right edge in shade
    cv.rect(x,yb-1,w,1,shade(front,0.5))
def inset_panel(cv,x,y,w,h,base):
    cv.rect(x,y,w,h,shade(base,0.9))
    cv.rect(x,y,w,1,shade(base,0.6)); cv.rect(x,y,1,h,shade(base,0.66))         # recessed: dark top-left
    cv.rect(x,y+h-1,w,1,shade(base,1.18)); cv.rect(x+w-1,y,1,h,shade(base,1.1)) # light bottom-right
def knob(cv,x,y,c='#d8b050'):
    cv.rect(x,y,2,2,c); cv.px(x,y,shade(c,1.35)); cv.px(x+1,y+2,shade(c,0.5)) 
def lace(cv,x0,y0,w,h,scallop=True):
    for x in range(x0,x0+w):
        bottom=y0+h+(int(2.5*math.sin(((x-x0)%8)/8*math.pi)) if scallop else 0)
        for y in range(y0,bottom):
            if ((x+y)%4==0 and (x-y)%4==0): continue
            cv.px(x,y,shade('#f8f4ea',1.0 if y<y0+2 else 0.94))
        cv.mul(x,bottom,1,1,(0.7,0.7,0.74))
