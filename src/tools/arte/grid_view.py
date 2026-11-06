import sys
from px import *; from dump import load
def view(rows,pal,out,k=12,bg='#9c9a92'):
    img=load(rows,pal); b=Img(img.w+4,img.h+4); b.rect(0,0,b.w,b.h,bg); b.blit(img,2,2); up(b,k).save(out); return img
