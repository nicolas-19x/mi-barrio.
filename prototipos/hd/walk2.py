from PIL import Image
import sys
sys.argv=['x']
exec(open("hero.py").read().split("sheet = Image.new")[0])   # reutiliza crisp, back_src y utilidades
FW,FH=40,80
def parts(im,hip,split,hands):
    W,H=im.size;s=im.load()
    up=Image.new('RGBA',(W,H));L=Image.new('RGBA',(W,H));Rg=Image.new('RGBA',(W,H));hs=[Image.new('RGBA',(W,H)) for _ in hands]
    u,l,r=up.load(),L.load(),Rg.load();hl=[h.load() for h in hs]
    for y in range(H):
        for x in range(W):
            c=s[x,y]
            if not c[3]:continue
            if y>=hip:(l if x<=split else r)[x,y]=c
            else:
                k=next((i for i,(x0,x1,y0,y1) in enumerate(hands) if x0<=x<=x1 and y0<=y<=y1),None)
                if k is None:u[x,y]=c
                else:hl[k][x,y]=c
    return up,L,Rg,hs
def compose(pp,body,legL,legR,hand):
    up,L,Rg,hs=pp;W,H=up.size;c=Image.new('RGBA',(FW,FH));ox=(FW-W)//2;oy=FH-H-3
    # piernas detrás: un poco de relleno arriba para que no se despeguen del torso
    for img,(dx,dy) in ((L,legL),(Rg,legR)):
        c.alpha_composite(img,(ox+dx,oy+dy))
        if dy>0 or body<0:
            bb=img.getbbox()
            if bb:
                strip=img.crop((bb[0],bb[1],bb[2],bb[1]+1))
                for k in range(1,max(dy,0)+1-min(body,0)):c.alpha_composite(strip,(ox+dx+bb[0],oy+dy+bb[1]-k))
    c.alpha_composite(up,(ox,oy+body))
    for i,h in enumerate(hs):
        if hand[i][1]>0:c.alpha_composite(h,(ox,oy+body))   # tapa el hueco de la manga
        c.alpha_composite(h,(ox+hand[i][0],oy+body+hand[i][1]))
    px=c.load()   # sin píxeles casi blancos sueltos en los pies
    for y in range(FH-14,FH):
        for x in range(FW):
            q=px[x,y]
            if q[3] and sum(q[:3])>560:px[x,y]=(0,0,0,0)
    return c
def cycle(pp,side):
    # (cuerpo, pierna izq, pierna der, manos) · y: abajo positivo
    sx=1 if side else 0
    keys=[(0,(-sx,1),(sx,-2),[(0,-1),(0,1)]),   # pisa la izquierda, la derecha atrás levantada
          (-1,(0,0),(0,-1),[(0,0),(0,0)]),       # paso intermedio, cuerpo arriba
          (0,(sx,-2),(-sx,1),[(0,1),(0,-1)]),    # pisa la derecha
          (-1,(0,-1),(0,0),[(0,0),(0,0)])]
    idle=compose(pp,0,(0,0),(0,0),[(0,0),(0,0)]);breath=compose(pp,1,(0,0),(0,0),[(0,0),(0,0)])
    return [idle]+[compose(pp,*k) for k in keys]+[breath]
HANDS_F=[(0,9,45,54),(24,34,45,54)]
pf=parts(crisp,55,16,HANDS_F)
bh=back_src.height;bwid=back_src.width
pb=parts(back_src,round(bh*.76),bwid//2,[(0,6,round(bh*.6),round(bh*.75)),(bwid-7,bwid-1,round(bh*.6),round(bh*.75))])
front=cycle(pf,False);back=cycle(pb,False);right=cycle(pf,True);left=[f.transpose(Image.FLIP_LEFT_RIGHT) for f in right]
N=len(front);sheet=Image.new('RGBA',(FW*N,FH*4))
for r,row in enumerate([front,back,left,right]):
    for c,f in enumerate(row):sheet.paste(f,(c*FW,r*FH),f)
sheet.save('hero_sheet2.png');sheet.resize((sheet.width*4,sheet.height*4),Image.NEAREST).save('hero_sheet2_x4.png')
fr=[]
for c in [1,2,3,4]*2:
    g=Image.new('RGBA',(FW*4*5,FH*5),(60,64,72,255))
    for r in range(4):
        f=sheet.crop((c*FW,r*FH,c*FW+FW,r*FH+FH)).resize((FW*5,FH*5),Image.NEAREST);g.paste(f,(r*FW*5,0),f)
    fr.append(g.convert('P',palette=Image.ADAPTIVE))
fr[0].save('walk2.gif',save_all=True,append_images=fr[1:],duration=150,loop=0)
print(sheet.size)
