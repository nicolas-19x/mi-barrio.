from px import *
from dump import load
# EarthBound-like 16 colour master palette (shared by whole style C)
C16={'K':'#101018','W':'#f8f8f0','g':'#b8b0d0','b':'#a05830','B':'#d89048','p':'#f088a0',
     'G':'#58b848','D':'#287838','Y':'#f8d840','R':'#e04838','S':'#c8a080','s':'#887060',
     'A':'#7888c0','a':'#485890','O':'#f8a8c8','L':'#a8e060'}
DOG_C="""
........KKKK..................
.......KWWWWKK................
......KWWWWWWWK..KKKKKKKK..KK.
......KWWWWWbbbKKKWWWWWWWKKWK.
KKKKKKWKKWWbbbbbKRWWWWWWWWKgK.
KKKWWWWWWWWbbbbbKRWWWWWWWWgK..
KKKWWWWWWWWKbbbKWRWWWWWWWWgK..
.KggWWWWWWWWKbKWWRWWWWWWWggK..
..KKKKgWWWWWWKWWWRWWWWWgggggK.
.KWWWWWKKgggggggggggggKKKKgK..
KWWWWWWWWKKKKKKKKKKKKKK..KKK..
.KKKKKKKK.....................
"""
def renderC():
    return load(DOG_C.strip('\n').split('\n'),C16)
