import time,pickle,numpy as np
import npcrig
t=time.time(); out=npcrig.bake_all(); print('baked in',round(time.time()-t,1),'s')
pickle.dump(out,open('npc_bake.pkl','wb'))
