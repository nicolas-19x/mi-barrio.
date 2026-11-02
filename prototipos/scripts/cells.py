from PIL import Image, ImageDraw
from collections import deque
import colorsys
SRC=Image.open('/root/.claude/uploads/30fc341f-8960-5712-8205-dad1772a706d/1cfb253f-image.jpg').convert('RGB')
def bg(c):
    r,g,b=[v/255 for v in c];h,s,v=colorsys.rgb_to_hsv(r,g,b);return s<.14 and v>.42
def cut(box):
    reg=SRC.crop(box);W,H=reg.size;px=reg.load()
    fg=[[not bg(px[x,y]) for x in range(W)] for y in range(H)]
    # componente más grande
    lab=[[0]*W for _ in range(H)];best=None;n=0
    for y in range(H):
        for x in range(W):
            if fg[y][x] and not lab[y][x]:
                n+=1;q=deque([(x,y)]);lab[y][x]=n;pts=[]
                while q:
                    a,b=q.popleft();pts.append((a,b))
                    for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
                        nx,ny=a+dx,b+dy
                        if 0<=nx<W and 0<=ny<H and fg[ny][nx] and not lab[ny][nx]:lab[ny][nx]=n;q.append((nx,ny))
                if not best or len(pts)>len(best):best=pts
    out=Image.new('RGBA',(W,H),(0,0,0,0));op=out.load()
    for a,b in best:op[a,b]=px[a,b]+(255,)
    return out.crop(out.getbbox())
TOP=(76,198);BOT=(203,322)
CELLS={'t1':(353,421),'t2':(424,503),'t3':(506,587),'t4':(590,684),'t5':(688,760),'t6':(762,849),
 'b1':(352,391),'b1b':(352,421),'b2':(424,503),'b3':(506,587),'b4':(590,670),'b5':(660,700),'b6':(700,780),
 'b11':(1080,1160),'b12':(1163,1231),'b13':(1234,1301),'b14':(1304,1380)}
def get(k):
    x0,x1=CELLS[k];y0,y1=TOP if k[0]=='t' else BOT;return cut((x0+1,y0,x1,y1))
if __name__=='__main__':
    ks=list(CELLS);sh=Image.new('RGB',(len(ks)*100,400),(43,34,56));d=ImageDraw.Draw(sh)
    for i,k in enumerate(ks):
        im=get(k);im=im.resize((im.width*3,im.height*3),Image.NEAREST);im.thumbnail((98,370));sh.paste(im,(i*100,25),im);d.text((i*100+30,5),k,fill=(255,220,80))
    sh.save('cands.png')
