from PIL import Image
exec(open("walk2.py").read().split("def cycle(")[0])   # parts(), FW, FH, crisp, back_src
def reshape(img,knee,n):
    """n>0 alarga la canilla duplicando filas en la rodilla; n<0 la acorta quitando filas (el pie sube)."""
    bb=img.getbbox()
    if not bb or n==0:return img
    W,H=img.size;src=img.load();rows=[[src[x,y] for x in range(W)] for y in range(H)]
    k=bb[1]+knee
    if n>0:rows=rows[:k]+[rows[k]]*n+rows[k:]
    else:rows=rows[:k]+rows[k-n:]
    rows=rows[:H]+[[(0,0,0,0)]*W for _ in range(max(0,H-len(rows)))]
    out=Image.new('RGBA',(W,H));o=out.load()
    for y in range(H):
        for x in range(W):o[x,y]=rows[y][x]
    if n<0:   # suela a la vista: oscurecer las dos filas de abajo del pie
        b2=out.getbbox()
        if b2:
            for y in range(b2[3]-2,b2[3]):
                for x in range(W):
                    c=o[x,y]
                    if c[3] and sum(c[:3])>110:o[x,y]=(c[0]*7//10,c[1]*7//10,c[2]*7//10,255)
    return out
def compose3(pp,body,sway,lL,lR,hand,stride=0):
    up,L,Rg,hs=pp;W,H=up.size;c=Image.new('RGBA',(FW,FH));ox=(FW-W)//2+sway;oy=FH-H-3
    for img,n,dx in ((L,lL,-stride),(Rg,lR,stride)):
        c.alpha_composite(reshape(img,6,n),(ox+dx,oy))
    if body<0:   # el torso sube: rellenar la cintura con la fila de la cadera
        bb=up.getbbox();strip=up.crop((0,bb[3]-1,W,bb[3]))
        c.alpha_composite(strip,(ox,oy+bb[3]-1))
    c.alpha_composite(up,(ox,oy+body))
    for i,h in enumerate(hs):
        if hand[i]>0:c.alpha_composite(h,(ox,oy+body))
        c.alpha_composite(h,(ox,oy+body+hand[i]))
    px=c.load()
    for y in range(FH-14,FH):
        for x in range(FW):
            q=px[x,y]
            if q[3] and sum(q[:3])>560:px[x,y]=(0,0,0,0)
    return c
def cycle3(pp,stride=0):
    s=stride
    K=[(0,-1,2,-3,(-1,1),s),   # pisa la izquierda (adelante), la derecha se dobla atrás; peso a la izquierda
       (-1,0,0,-1,(0,0),0),    # paso: sube el cuerpo
       (0,1,-3,2,(1,-1),-s),   # pisa la derecha
       (-1,0,-1,0,(0,0),0)]
    idle=compose3(pp,0,0,0,0,(0,0));breath=compose3(pp,1,0,0,0,(0,0))
    return [idle]+[compose3(pp,b,sw,l,r,h,st) for b,sw,l,r,h,st in K]+[breath]
HANDS_F=[(0,9,45,54),(24,34,45,54)]
pf=parts(crisp,55,16,HANDS_F)
bh=back_src.height;bwid=back_src.width
pb=parts(back_src,round(bh*.76),bwid//2,[(0,6,round(bh*.6),round(bh*.75)),(bwid-7,bwid-1,round(bh*.6),round(bh*.75))])
front=cycle3(pf);right=cycle3(pf,1);left=[f.transpose(Image.FLIP_LEFT_RIGHT) for f in right];back=cycle3(pb)
sheet=Image.new('RGBA',(FW*6,FH*4))
for r,row in enumerate([front,back,left,right]):
    for c,f in enumerate(row):sheet.paste(f,(c*FW,r*FH),f)
sheet.save('hero_sheet3.png');sheet.resize((sheet.width*4,sheet.height*4),Image.NEAREST).save('hero_sheet3_x4.png')
fr=[]
for c in [1,2,3,4]*2:
    g=Image.new('RGBA',(FW*2*5+20,FH*5),(80,84,92,255))
    for i,r in enumerate([0,1]):
        f=sheet.crop((c*FW,r*FH,c*FW+FW,r*FH+FH)).resize((FW*5,FH*5),Image.NEAREST);g.paste(f,(i*(FW*5+20),0),f)
    fr.append(g.convert('P',palette=Image.ADAPTIVE))
fr[0].save('walk3.gif',save_all=True,append_images=fr[1:],duration=170,loop=0)
print('ok')
