from dogB import *
img=renderB()
bg=Img(img.w,img.h); bg.rect(0,0,img.w,img.h,'#9c9a92')
bg.blit(img,0,0); up(bg,10).save('dogB.png')
