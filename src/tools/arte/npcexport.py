import pickle,json,numpy as np
from npcrig import FIX,W,H
out=pickle.load(open('npc_bake.pkl','rb'))
AL='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
def enc(C):
    seq=['.' if v<0 else AL[v] for v in C.flatten()]
    o=[];i=0
    while i<len(seq):
        j=i
        while j<len(seq) and seq[j]==seq[i] and j-i<64: j+=1
        o.append(seq[i]+AL[j-i-1]); i=j
    return ''.join(o)
strs=[];idx={}
def put(C):
    s=enc(C)
    if s not in idx: idx[s]=len(strs); strs.append(s)
    return idx[s]
D={'b':{},'h':{},'a':{}}
for sx in ('m','f'): D['b'][sx]=[[put(C) for C in row] for row in out['b'][sx]]
for st in out['h']: D['h'][st]={sx:[[put(C) for C in row] for row in out['h'][st][sx]] for sx in ('m','f')}
for ac in out['a']: D['a'][ac]={sx:[[put(C) for C in row] for row in out['a'][ac][sx]] for sx in ('m','f')}
data={'w':W,'h':H,'fix':FIX,'s':strs,'d':D}
js='const NPCD='+json.dumps(data,separators=(',',':'),ensure_ascii=False)+';\n'
open('../hd/data_npc.js','w',encoding='utf-8').write(js)
print('unique strings',len(strs),'bytes',len(js))
