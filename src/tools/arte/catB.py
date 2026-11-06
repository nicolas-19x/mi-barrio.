from dump import load
PC={'o':'#26262c','d':'#5a5a64','m':'#7a7a86','l':'#a2a2ae','h':'#c4c4cc','w':'#f2f0ea','v':'#c8c4bc','p':'#e89090','k':'#1a1a1e','s':'#3e3e46'}
CAT="""
..o....o..................
.olo..olo.................
.olpo.ohlo...ooooooo......
olhhoolhhlooommmmmmmoo....
olhhhhhhhllomlllmmlmmdo...
ohkkhhhhkkhlmmsmmsmmsmdo..
ohhhhwwhhhhmmsmmsmmsmmmdo.
ohhhwwpwwhmmmmmmmmmmmmmdo.
.ohhwwwwwhmmmsmmsmmsmmmddo
..odvwwvdmmmmmmmmmmmmmmddo
...oddddddmmmmmmmmmmmdddo.
...ollllllllllldddddddddo.
....oddddddddlllllhhwdoo..
.....ooooooooooooooooo....
"""
def renderCat(): return load(CAT.strip('\n').split('\n'),PC)
if __name__=='__main__':
    from px import Img,up
    c=renderCat(); b=Img(c.w+4,c.h+4); b.rect(0,0,b.w,b.h,'#9a3c3c'); b.blit(c,2,2); up(b,16).save('cat.png')
