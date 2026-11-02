"""Doña Yorleny, la de la lotería · personaje a ~65 px de alto, dibujado píxel por píxel.
Luz desde arriba a la izquierda. Contorno exterior oscuro cálido; contornos interiores con sombras de color."""
from PIL import Image

PAL = {
 'O': (42, 26, 32), 'o': (120, 64, 52),
 'L': (236, 182, 132), 'S': (214, 152, 106), 'D': (180, 114, 78), 'd': (140, 82, 58), 'b': (222, 128, 108),
 'H': (40, 28, 34), 'h': (72, 50, 56), 'y': (112, 84, 88),
 'R': (214, 54, 60), 'r': (160, 32, 46), 'w': (246, 232, 220),
 'E': (248, 244, 238), 'I': (96, 58, 36), 'P': (26, 14, 18), 'B': (54, 34, 36),
 'M': (196, 66, 84), 'm': (148, 42, 62),
 'G': (244, 202, 80), 'g': (184, 132, 40),
 'U': (126, 216, 204), 'T': (64, 180, 170), 't': (42, 134, 130), 'u': (28, 96, 98),
 'F': (246, 134, 168), 'f': (252, 224, 112),
 'K': (58, 58, 72), 'k': (36, 36, 46), 'z': (186, 186, 196),
 'Y': (110, 134, 182), 'J': (80, 100, 148), 'j': (58, 74, 114), 'n': (40, 52, 84),
 'X': (246, 246, 246), 'x': (196, 200, 212), 'q': (150, 156, 170),
 'V': (164, 116, 70), 'v': (112, 76, 46),
 'Q': (252, 248, 232), 'c': (70, 120, 210), 'e': (226, 76, 76), 'a': (80, 166, 92),
}
W, H = 60, 70
G = [['.'] * W for _ in range(H)]


def put(x, y, s):
    for i, ch in enumerate(s):
        if ch != '.' and 0 <= x + i < W and 0 <= y < H:
            G[y][x + i] = ch


def rect(x0, y0, x1, y1, ch):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            G[y][x] = ch


# ---------- la vara de lotería (detrás del brazo) ----------
rect(14, 4, 15, 61, 'V')
for y in range(4, 62):
    G[y][15] = 'v'
rect(2, 5, 18, 6, 'V'); rect(2, 6, 18, 6, 'v')
# tiras de lotería colgando, cada una con su número y su color
for i, (x, ln, col) in enumerate([(3, 17, 'c'), (6, 19, 'e'), (9, 16, 'a'), (12, 18, 'c'), (16, 15, 'e')]):
    for y in range(7, 7 + ln):
        G[y][x] = 'Q'; G[y][x + 1] = 'Q' if y % 4 else col
        if y % 4 == 1:
            G[y][x] = col
    G[7 + ln][x] = 'x'; G[7 + ln][x + 1] = 'x'
    G[7][x] = 'g'; G[7][x + 1] = 'g'   # prensas

# ---------- pelo suelto detrás de los hombros ----------
for y in range(18, 33):
    for x in list(range(17, 23)) + list(range(37, 43)):
        k = ((x // 2) * 3 + y) % 4
        G[y][x] = 'y' if k == 0 and (x + y) % 2 else 'h' if k in (0, 1) else 'H'
for x in range(17, 23):
    if (x + 1) % 2: G[33][x] = 'H'
for x in range(37, 43):
    if x % 2: G[33][x] = 'H'

# ---------- cabeza ----------
HEAD = {
 2: (25, 'OOOOOOOOOO'),
 3: (23, 'OORRRwRRRRRROO'),
 4: (22, 'ORRwRRRRRRwRRRrO'),
 5: (21, 'ORRRRRRRwRRRRRRrrO'),
 6: (20, 'ORRwRRRRRRRRRwRRrrrO'),
 7: (20, 'OrRRRRRwRRRRRRRRrrrO'),
 8: (20, 'OrrrrrrrrrrrrrrrrrrO'),
 9: (20, 'OHyHhHyhHHhHyHhHyHHO'),
 10: (20, 'OHHhLLLLLLLLLLLLhHHO'),
 11: (20, 'OHhLLLLLLLLLLLLLShHO'),
 12: (20, 'OHhLBBBLLLLLLBBBShHO'),
 13: (20, 'OHhOOOOLLLLLLOOOOhHO'),
 14: (20, 'OHSLEIPLLLLLLPIELDHO'),
 15: (20, 'OHSLEIILLLLLLIIELDHO'),
 16: (20, 'OHSLLSSSLLLLSSSLSDHO'),
 17: (20, 'OHhLbbLLLLSDLLbbLShO'),
 18: (20, 'OHhLLLLLLLDDLLLLSShO'),
 19: (20, 'OHhSLLLmLLLLLLmLSShO'),
 20: (20, 'OHhSLLLLMEEEEMLLSDhO'),
 21: (20, 'OHhSSLLLLmMMmLLSDDhO'),
 22: (20, 'OHHoSSLLLLLLLLSDDoHO'),
 23: (20, 'OHHHooDSSSSSSDDooHHO'),
 24: (20, '.OHH..oooooooooo.HHO'),
}
for y, (x, s) in HEAD.items():
    put(x, y, s)
# brillo del pelo y luz en la frente
put(23, 10, 'L'); put(24, 11, 'L')
# nudo de la pañoleta y sus puntas
put(37, 3, 'OOO'); put(37, 4, 'OrRrO'); put(38, 5, 'OrRrO'); put(39, 6, 'OrrO'); put(40, 7, 'OrO'); put(40, 8, 'OrO'); put(41, 9, 'OO')
# argollas doradas
for (x, y, s) in [(19, 17, 'GG'), (18, 18, 'G'), (21, 18, 'g'), (18, 19, 'G'), (21, 19, 'g'), (18, 20, 'G'), (21, 20, 'g'), (19, 21, 'gg'),
                  (39, 17, 'GG'), (38, 18, 'G'), (41, 18, 'g'), (38, 19, 'G'), (41, 19, 'g'), (38, 20, 'G'), (41, 20, 'g'), (39, 21, 'gg')]:
    put(x, y, s)

# ---------- cuello ----------
put(27, 24, 'DDDDDD'); put(27, 25, 'DDDDDD'); put(27, 26, 'SSSSSD')

# ---------- blusa floreada ----------
TORSO = {27: (22, 37), 28: (22, 37), 29: (22, 37), 30: (22, 37)}
for y in range(31, 39):
    TORSO[y] = (21, 38)
TORSO[39] = (22, 37)
for y, (a, b) in TORSO.items():
    for x in range(a, b + 1):
        c = 'U' if x <= a + 1 else 'u' if x >= b else 't' if x >= b - 2 else 'T'
        if y >= 37 and c == 'T': c = 't' if x > 30 else 'T'
        G[y][x] = c
# escote con cadena y crucita
put(27, 27, 'SSSSSS'); put(28, 28, 'GLSG'); put(29, 29, 'GG'); put(29, 30, 'g')
put(26, 27, 'u'); put(33, 27, 'u'); put(27, 28, 'u'); put(32, 28, 'u')
# flores
for (fx, fy) in [(24, 31), (31, 33), (26, 36), (34, 30), (29, 38), (35, 36), (23, 34), (32, 29)]:
    if G[fy][fx] in 'UTtu':
        G[fy][fx] = 'f'
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if G[fy + dy][fx + dx] in 'UTtu': G[fy + dy][fx + dx] = 'F'
# mangas abombadas
for y in range(27, 34):
    for x in range(18, 22):
        G[y][x] = 'U' if x == 18 or y == 27 else 'T'
    for x in range(38, 42):
        G[y][x] = 'u' if x == 41 else 't'
put(18, 33, 'tttt'); put(38, 33, 'uuuu')
put(22, 28, 'u'); put(22, 29, 'u'); put(37, 28, 'u'); put(37, 29, 'u')

# ---------- brazos y manos ----------
for y in range(34, 42):
    put(18, y, 'LSD'); put(39, y, 'SSD')
    G[y][21] = 'u'; G[y][38] = 'u'
# mano izquierda (de ella) agarrando la vara
put(14, 41, 'SLLSD'); put(14, 42, 'DSSSD'); put(14, 43, 'SLLSd'); put(15, 44, 'DDd')
G[41][13] = 'o'; G[42][13] = 'o'; G[43][13] = 'o'
put(18, 41, 'SD'); put(17, 40, 'SD')
# mano derecha con el abanico de enteros
for (x, y, s) in [(42, 39, 'QQ'), (44, 39, 'Qe'), (41, 40, 'cQQ'), (44, 40, 'QQa'), (43, 41, 'QQQ'), (45, 38, 'QQ'), (46, 39, 'Q')]:
    put(x, y, s)
put(39, 42, 'SSLS'); put(39, 43, 'DSSd'); put(40, 41, 'LS'); put(42, 41, 'S')

# ---------- riñonera ----------
put(21, 37, 'kkkkkkkkkkkkkkkkkk')
for y in range(38, 43):
    a, b = (24, 35) if y in (38, 42) else (23, 36)
    for x in range(a, b + 1):
        G[y][x] = 'K' if y < 41 else 'k'
put(25, 39, 'zzzzzzzzzz'); put(34, 39, 'G'); put(24, 40, 'K'); put(26, 38, 'q')

# ---------- jeans: cadera, piernas separadas que se afinan ----------
for y in range(43, 58):
    if y <= 46:
        for x in range(22, 38): G[y][x] = 'Y' if x <= 23 else 'j' if x >= 35 else 'J'
        if y >= 45: G[y][29] = 'n'; G[y][30] = 'j'
    else:
        t = 1 if y >= 53 else 0
        for x in range(22 + t, 29): G[y][x] = 'Y' if x <= 23 + t else 'j' if x >= 27 else 'J'
        for x in range(31, 38 - t): G[y][x] = 'J' if x <= 33 else 'j' if x >= 36 - t else 'J'
put(24, 44, 'YYYY'); put(32, 44, 'YYYY')
for y in (50, 51):
    put(24, y, 'YY'); put(32, y, 'YY')
put(26, 48, 'j'); put(34, 48, 'j'); put(25, 55, 'j'); put(33, 55, 'j')
put(23, 57, 'nnnnnn'); put(31, 57, 'nnnnnn')
# ---------- tenis ----------
for y, (s1, s2) in {58: ('XXXXXXX', 'XXXXXXX'), 59: ('XFFXXXXX', 'XXXFFXXX'), 60: ('xxxxxxxx', 'xxxxxxxx'), 61: ('qqqqqqqq', 'qqqqqqqq')}.items():
    put(21, y, s1); put(31, y, s2)
put(23, 58, 'nn'); put(33, 58, 'nn')
rect(14, 62, 15, 66, '.')
# ---------- contorno exterior automático ----------
def outline():
    out = [r[:] for r in G]
    for y in range(H):
        for x in range(W):
            if G[y][x] != '.':
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < W and 0 <= ny < H and G[ny][nx] not in '.O':
                    out[y][x] = 'O'; break
    return out


def image():
    g = outline()
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = im.load()
    for y in range(H):
        for x in range(W):
            if g[y][x] != '.':
                px[x, y] = PAL[g[y][x]] + (255,)
    return im


if __name__ == '__main__':
    import sys
    im = image(); im.save(sys.argv[1] + '/yorleny.png')
    im.resize((W * 8, H * 8), Image.NEAREST).save(sys.argv[1] + '/yorleny_x8.png')
