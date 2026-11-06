import pickle,json
import ariana
from npcexport import enc
new=pickle.load(open('ariana.pkl','rb'))
strs=[];idx={}
def put(C):
    s=enc(C)
    if s not in idx: idx[s]=len(strs); strs.append(s)
    return idx[s]
d=[[put(C) for C in row] for row in new]
js='const ARID='+json.dumps({'fix':ariana.AFIX,'s':strs,'d':d},separators=(',',':'))+';\n'
open('../hd/data_ariana.js','w').write(js); print(len(strs),len(js))
