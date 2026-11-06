import sys,os; sys.path.insert(0,'.')
from anim import *
from PIL import Image, ImageDraw, ImageFont
import sceneB2
from cv import Canvas
F=lambda n,b=True: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),n)
DIRS=[('Abajo',[front(i) for i in range(6)]),('Arriba',[back(i) for i in range(6)]),
      ('Derecha',[side(i,'R') for i in range(6)]),('Izquierda',[side(i,'L') for i in range(6)])]
# ---- sprite sheet (4 rows x 6 frames)
K=5; cw,ch=(W+4)*K,(H+4)*K
S=Image.new('RGB',(170+cw*6+30,110+ch*4+20),(27,26,31)); d=ImageDraw.Draw(S)
d.text((30,24),'Caminata · 4 direcciones × 6 cuadros',fill=(240,228,206),font=F(34))
d.text((30,70),'Cuadros: contacto · bajada · paso · contacto · bajada · paso   (×5)',fill=(200,190,170),font=F(18,False))
for r,(name,frs) in enumerate(DIRS):
    d.text((30,110+r*ch+ch//2-12),name,fill=(240,228,206),font=F(24))
    for i,fr in enumerate(frs):
        b=Img(W+4,H+4); b.rect(0,0,b.w,b.h,'#b8ad9a'); ground_shadow(b,2+18,2+H-4,9,2.2); b.blit(fr,2,2)
        S.paste(b.pil().convert('RGB').resize((cw,ch),Image.NEAREST),(170+i*cw,110+r*ch))
S.save('caminata_hoja.png')
# ---- 4-direction animated preview
K=6; frames=[]
for i in range(6):
    c=Image.new('RGB',((W+6)*K*4+20,(H+16)*K),(184,173,154)); dd=ImageDraw.Draw(c)
    for j,(name,frs) in enumerate(DIRS):
        b=Img(W+6,H+4); b.rect(0,0,b.w,b.h,'#b8ad9a'); ground_shadow(b,3+18,2+H-4,9,2.2); b.blit(frs[i],3,2)
        c.paste(b.pil().convert('RGB').resize(((W+6)*K,(H+4)*K),Image.NEAREST),(10+j*(W+6)*K,0))
        dd.text((10+j*(W+6)*K+((W+6)*K)//2-40,(H+4)*K+14),name,fill=(40,30,30),font=F(30))
    frames.append(c)
frames[0].save('caminata_4dir.gif',save_all=True,append_images=frames[1:],duration=115,loop=0)
# ---- walking along the sidewalk in the afternoon scene, real cast shadow per frame
sceneB2.NO_CHARS=True; sceneB2.NOGRADE=True
base=sceneB2.build('tarde')
out=[]
right=DIRS[2][1]
for t in range(84):
    cv=Canvas(base.w,base.h); cv.a=base.a.copy()
    fr=right[t%6]; x=int(140+t*2.2); y=182-53
    cv.cast(fr,x,y,182,k=1.0,m=0.10); cv.apply_shadow((0.48,0.50,0.68))
    cv.blit(fr,x,y)
    sceneB2.grade_day(cv)
    im=Image.fromarray(np.clip(cv.a,0,255).astype(np.uint8)).crop((60,70,476,200))
    out.append(im.resize((im.width*3,im.height*3),Image.NEAREST))
out[0].save('caminata_escena.gif',save_all=True,append_images=out[1:],duration=95,loop=0)
print('ok', S.size, frames[0].size, out[0].size)
