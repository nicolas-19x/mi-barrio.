import numpy as np,pickle,sys
from PIL import Image
import ariana
from npcprev import ramp,compose,CH,hexc
A=dict(CH)['Ariana']; OLD=dict(A)
A=dict(A,skin='#e3b597',hairColor='#1e1614',shirt='#86b4d8',pants='#2e3a5c',accColor='#e6c060')
def colorize(C,fix,shoe='#f0ece4'):
    R=[None,ramp(A['skin']),ramp(A['shirt']),ramp(A['pants']),ramp(shoe),ramp(A['hairColor']),ramp(A['accColor']),ramp('#9aa0a8')]
    im=np.zeros((C.shape[0],C.shape[1],4),np.uint8)
    for y,x in zip(*np.nonzero(C>=0)):
        v=C[y,x]; col=R[v//7+1][v%7] if v<49 else hexc(fix[v-49])
        im[y,x,:3]=col; im[y,x,3]=255
    return Image.fromarray(im,'RGBA')
if __name__=='__main__':
    new=ariana.bake(); pickle.dump(new,open('ariana.pkl','wb'))
    W,H=36,58
    def sheet(K,rows,name,bg=(184,173,154,255)):
        s=Image.new('RGBA',(W*K*max(len(r) for r in rows),H*K*len(rows)),bg)
        for j,r in enumerate(rows):
            for i,im in enumerate(r): s.alpha_composite(im.resize((W*K,H*K),0),(i*W*K,j*H*K))
        s.save(name)
    c=lambda d,f:colorize(new[d][f],ariana.AFIX)
    sheet(10,[[compose(OLD,0,6),c(0,6),c(3,6),c(1,6),c(2,6)]],'ari_zoom.png')
    sheet(4,[[c(0,i) for i in range(6)],[c(3,i) for i in range(6)],[c(1,i) for i in range(6)]],'ari_walk.png')
