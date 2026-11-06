import pickle,numpy as np,sys
from PIL import Image,ImageDraw,ImageFont
from npcrig import FIX,W,H
out=pickle.load(open('npc_bake.pkl','rb'))
def hexc(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)
def ramp(hx,n=7):
    b=hexc(hx); r=[]
    for i in range(n):
        f=.42+(1.38-.42)*i/(n-1); c=b*f
        if f>1: c=c+(255-c)*(f-1)*.55; c=c*np.array([1.03,1,.95])
        else: c=c*np.array([.97,.96,1.05])
        r.append(np.clip(c,0,255))
    return r
CH=[('Ariana',dict(hair='largo',hairColor='#2a1810',skin='#c68e5e',shirt='#e85d75',pants='#35477d',acc='aretes',accColor='#f5c542')),
    ('Nicolás',dict(hair='corto',hairColor='#1c1c1c',skin='#d9a066',shirt='#2e9e6b',pants='#4a4a52',acc='gorra',accColor='#d64545')),
    ('Matías',dict(hair='rizos',hairColor='#5a3a1e',skin='#e0ac69',shirt='#f2994a',pants='#2d3a6e',acc='ninguno',accColor='#d64545')),
    ('Don Alexander',dict(hair='corto',hairColor='#f2f2f2',skin='#f3d3b6',shirt='#5b7fa6',pants='#3b3b3b',acc='bigote',accColor='#e4e4e4',machete=1)),
    ('Doña Lucía',dict(hair='moño',hairColor='#2b1a10',skin='#c98b5c',shirt='#c2577a',pants='#4b3b5b',acc='collar',accColor='#f5c542')),
    ('Doña Rosa',dict(hair='cola',hairColor='#8a8a8a',skin='#c68e5e',shirt='#f0e6d2',pants='#7a4b2a',acc='lentes',accColor='#d64545')),
    ('Doña Marta',dict(hair='moño',hairColor='#d8d8d8',skin='#e0ac69',shirt='#7bb661',pants='#5a4632',acc='ninguno',accColor='#d64545')),
    ('Don Beto',dict(hair='corto',hairColor='#3a3a3a',skin='#8d5524',shirt='#e8e8e8',pants='#2d3a6e',acc='sombrero',accColor='#d9b36c')),
    ('Carlillos',dict(hair='corto',hairColor='#e3c56b',skin='#e8b88a',shirt='#2a2a30',pants='#4a5a7a',acc='gorra',accColor='#c8102e',tattoos=1)),
    ('Calvo',dict(hair='calvo',hairColor='#3a3a3a',skin='#b97a4a',shirt='#3fb6b0',pants='#2d3346',acc='barba',accColor='#d64545')),
    ('Anteojos',dict(hair='rizos',hairColor='#c8a24a',skin='#f6d3b3',shirt='#c2577a',pants='#35477d',acc='anteojos',accColor='#d64545')),
]
SHOES=['#f0ece4','#26262e','#6a4430','#3a5a9a']
def compose(c,dirn,fi):
    fem=c['hair'] in('largo','moño','cola'); sx='f' if fem else 'm'
    C=out['b'][sx][dirn][fi].copy()
    def ov(O):
        nonlocal C; C=np.where(O>=0,O,C)
    if c['hair'] in out['h']: ov(out['h'][c['hair']][sx][dirn][fi])
    a=c.get('acc','ninguno')
    for k in ('aretes','collar'):
        if a==k: ov(out['a'][k][sx][dirn][fi])
    if c.get('tattoos'): ov(out['a']['tattoos'][sx][dirn][fi])
    for k in ('lentes','anteojos','bigote','barba'):
        if a==k: ov(out['a'][k][sx][dirn][fi])
    if c.get('machete'): ov(out['a']['machete'][sx][dirn][fi])
    for k in ('gorra','sombrero'):
        if a==k: ov(out['a'][k][sx][dirn][fi])
    R={1:ramp(c['skin']),2:ramp(c['shirt']),3:ramp(c['pants']),4:ramp(SHOES[hash(c['shirt'])%4]),5:ramp(c['hairColor']),6:ramp(c['accColor']),7:ramp('#9aa0a8')}
    img=np.zeros((H,W,4),np.uint8)
    for y in range(H):
        for x in range(W):
            v=C[y,x]
            if v<0: continue
            if v<49: col=R[v//7+1][v%7]
            else: col=hexc(FIX[v-49])
            img[y,x,:3]=col; img[y,x,3]=255
    return Image.fromarray(img,'RGBA')
if __name__=='__main__':
    K=5; F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',16)
    S=Image.new('RGB',(len(CH)*(W*K+8)+20,4*(H*K+6)+50),(184,173,154)); d=ImageDraw.Draw(S)
    for i,(n,c) in enumerate(CH):
        d.text((10+i*(W*K+8),8),n,fill=(30,24,24),font=F)
        for di in range(4):
            im=compose(c,di,6).resize((W*K,H*K),Image.NEAREST); S.paste(im,(10+i*(W*K+8),36+di*(H*K+6)),im)
    S.save('npc_prev.png'); print(S.size)
