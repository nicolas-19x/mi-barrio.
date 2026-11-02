"""Escena de prueba de la nueva escala: frente a la Pulpería La Bendición, media tarde.
Todo se dibuja a la misma densidad que el personaje (≈2,5 cm por píxel) y con la misma luz (arriba a la izquierda)."""
from PIL import Image, ImageDraw, ImageFont
import math, random, sys
sys.path.insert(0, '.')

W, H = 320, 180
im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
px = im.load()
rnd = random.Random(7)


def hsh(x, y, s=0):
    h = (x * 374761393 + y * 668265263 + s * 2147483647) & 0xffffffff
    h = ((h ^ (h >> 13)) * 1274126177) & 0xffffffff
    return ((h ^ (h >> 16)) & 0xffffffff) / 4294967296


def R(x, y, w, h, c):
    for yy in range(max(0, y), min(H, y + h)):
        for xx in range(max(0, x), min(W, x + w)):
            px[xx, yy] = c + (255,) if len(c) == 3 else c


def blend(x, y, c, a):
    if 0 <= x < W and 0 <= y < H:
        o = px[x, y]
        px[x, y] = (round(o[0] * (1 - a) + c[0] * a), round(o[1] * (1 - a) + c[1] * a), round(o[2] * (1 - a) + c[2] * a), 255)


def shadow_rect(x, y, w, h, a=.28):
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            blend(xx, yy, (40, 24, 40), a)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# ---------- cielo y árbol de mango detrás de la tapia ----------
for y in range(0, 60):
    for x in range(200, W):
        px[x, y] = lerp((150, 200, 232), (236, 214, 176), y / 60) + (255,)
for (cx, cy, r) in [(250, 10, 26), (285, 4, 30), (312, 18, 22), (232, 30, 14)]:
    for y in range(cy - r, cy + r):
        for x in range(cx - r, cx + r):
            d = math.hypot(x - cx, (y - cy) * 1.2)
            if d < r - hsh(x, y) * 4 and 0 <= x < W and 0 <= y < H:
                t = (x - cx + (y - cy)) / (2 * r) + .5
                c = (46, 100, 52) if t > .62 else (62, 128, 62) if t > .3 else (92, 160, 76)
                if hsh(x * 3, y * 5) < .08: c = (120, 182, 90)
                px[x, y] = c + (255,)
for (mx, my) in [(262, 22), (276, 14), (298, 26), (244, 34)]:
    R(mx, my, 3, 4, (232, 152, 52)); R(mx, my, 1, 2, (246, 196, 80))

# ---------- tapia de bloques con veranera ----------
TAP = (206, 64)
for y in range(TAP[1], 124):
    for x in range(TAP[0], W):
        bx, by = (x - TAP[0] + (8 if ((y - TAP[1]) // 8) % 2 else 0)) % 16, (y - TAP[1]) % 8
        c = (196, 186, 170) if bx and by else (162, 150, 136)
        if hsh(x, y) < .12: c = lerp(c, (150, 138, 124), .5)
        if y > 112: c = lerp(c, (120, 128, 92), (y - 112) / 14)
        px[x, y] = c + (255,)
R(TAP[0] - 2, TAP[1] - 4, W - TAP[0] + 2, 4, (176, 168, 156)); R(TAP[0] - 2, TAP[1] - 4, W - TAP[0] + 2, 1, (214, 208, 196))
for x in range(TAP[0], W, 3):   # vidrios quebrados en el remate
    R(x, TAP[1] - 7, 1, 3, (150, 196, 170)); R(x + 1, TAP[1] - 6, 1, 2, (196, 230, 214))
for x in range(TAP[0] + 6, W):  # veranera que se derrama en racimos
    hang = int(8 + 20 * abs(math.sin(x * .07 + 1)) + 8 * abs(math.sin(x * .23)))
    for y in range(TAP[1] - 9, TAP[1] + hang):
        depth = (y - TAP[1] + 9) / (hang + 9)
        if hsh(x // 2, y // 2, 3) < .78 - depth * .55:
            c = (54, 108, 50) if hsh(x // 2, y // 3, 4) < .5 else (74, 136, 62)
            if hsh(x // 3, y // 3, 5) < .42:
                c = (206, 40, 124) if hsh(x, y, 6) < .55 else (236, 96, 162)
                if hsh(x // 3, y // 3, 8) < .15: c = (248, 150, 196)
            px[x, y] = c + (255,)
# ---------- fachada de la pulpería ----------
WALL = (0, 205)
for y in range(12, 124):
    for x in range(WALL[0], WALL[1]):
        c = lerp((246, 210, 98), (226, 176, 62), y / 124)
        n = hsh(x, y)
        if n < .1: c = lerp(c, (255, 228, 140), .5)
        elif n > .93: c = lerp(c, (196, 146, 50), .5)
        px[x, y] = c + (255,)
R(0, 108, WALL[1], 16, (150, 70, 52))  # zócalo pintado
for x in range(0, WALL[1]):
    R(x, 108, 1, 1, (182, 94, 70))
    if hsh(x, 9) < .3: R(x, 120 + int(hsh(x, 2) * 3), 1, 4, (110, 120, 70))
R(0, 107, WALL[1], 1, (120, 54, 40))
# grieta y mancha de humedad
for i in range(16):
    blend(186 + (i // 3), 40 + i, (150, 104, 40), .7)
for y in range(90, 108):
    for x in range(8, 40):
        if hsh(x, y, 9) < .25 + (y - 90) / 60: blend(x, y, (150, 120, 60), .25)
# alero de zinc
for x in range(0, WALL[1] + 4):
    for y in range(0, 10):
        c = (196, 64, 52) if (x // 3) % 2 else (162, 44, 40)
        if y == 0: c = (226, 108, 86)
        if hsh(x // 3, y // 4) < .12: c = (150, 84, 52)  # parches de óxido
        px[x, y] = c + (255,)
R(0, 10, WALL[1] + 4, 2, (110, 40, 36)); shadow_rect(0, 12, WALL[1], 6, .35); shadow_rect(0, 18, WALL[1], 3, .15)
R(WALL[1] - 2, 10, 3, 100, (130, 136, 140)); R(WALL[1] - 2, 10, 1, 100, (176, 182, 186))  # bajante de la canoa

# rótulo pintado a mano
R(36, 21, 158, 19, (176, 40, 42)); R(36, 21, 158, 1, (214, 80, 70)); R(36, 39, 158, 1, (120, 26, 30)); R(36, 21, 1, 19, (120, 26, 30)); R(193, 21, 1, 19, (120, 26, 30))
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 10)
d = ImageDraw.Draw(im); d.fontmode = '1'
d.text((48, 24), 'PULPERÍA LA BENDICIÓN', font=f, fill=(252, 238, 196))
for x in range(38, 192, 7):
    R(x, 23, 2, 1, (196, 64, 60))

# ventana con reja
WX, WY, WW, WH = 12, 48, 56, 44
R(WX - 3, WY - 3, WW + 6, WH + 7, (240, 232, 214)); R(WX - 3, WY + WH + 2, WW + 6, 2, (196, 186, 166))
for y in range(WY, WY + WH):
    for x in range(WX, WX + WW):
        px[x, y] = lerp((70, 52, 46), (44, 32, 32), (y - WY) / WH) + (255,)
for s in range(3):  # estantes con productos
    sy = WY + 10 + s * 12
    R(WX, sy + 7, WW, 2, (110, 74, 46))
    for i in range(0, WW, 4):
        col = [(214, 60, 60), (240, 196, 70), (90, 170, 90), (70, 120, 210), (240, 140, 60), (240, 240, 230)][int(hsh(i, s) * 6)]
        hh = 4 + int(hsh(s, i) * 3)
        R(WX + i, sy + 7 - hh, 3, hh, col); R(WX + i, sy + 7 - hh, 1, hh, lerp(col, (255, 255, 255), .3))
R(WX, WY, WW, 2, (36, 26, 26))
for x in range(WX + 2, WX + WW, 5):  # reja blanca con volutas
    R(x, WY, 2, WH, (236, 236, 228)); R(x + 1, WY, 1, WH, (186, 186, 178))
R(WX, WY + 20, WW, 2, (236, 236, 228))
for x in range(WX + 4, WX + WW - 2, 10):
    for (dx, dy) in [(0, -3), (1, -4), (2, -4), (3, -3), (0, 3), (1, 4), (2, 4), (3, 3)]:
        R(x + dx, WY + 21 + dy, 1, 1, (236, 236, 228))
shadow_rect(WX - 3, WY + WH + 4, WW + 8, 3, .3)

# puerta abierta y mostrador
DX, DY, DW, DH = 88, 42, 70, 82
R(DX - 3, DY - 3, DW + 6, 3, (120, 70, 40)); R(DX - 3, DY - 3, 3, DH + 3, (120, 70, 40)); R(DX + DW, DY - 3, 3, DH + 3, (98, 56, 32))
for y in range(DY, DY + DH):
    for x in range(DX, DX + DW):
        px[x, y] = lerp((92, 64, 44), (52, 36, 30), (y - DY) / DH) + (255,)
for s in range(3):  # estantes del fondo
    sy = DY + 14 + s * 11
    R(DX + 4, sy + 6, DW - 8, 2, (130, 88, 54))
    for i in range(4, DW - 8, 5):
        col = [(214, 60, 60), (240, 196, 70), (90, 170, 90), (70, 120, 210), (240, 240, 230), (160, 90, 60)][int(hsh(i, s + 9) * 6)]
        R(DX + i, sy, 4, 6, lerp(col, (60, 40, 30), .25)); R(DX + i, sy, 1, 6, col)
R(DX, DY + 3, DW, 1, (40, 30, 26))  # mecate con paquetes colgando
for i in range(6):
    x = DX + 5 + i * 11; col = [(240, 196, 70), (214, 60, 60), (90, 170, 220), (240, 140, 60), (90, 170, 90), (240, 196, 70)][i]
    R(x, DY + 4, 8, 9, col); R(x, DY + 4, 8, 1, (60, 40, 30)); R(x + 1, DY + 6, 2, 5, lerp(col, (255, 255, 255), .45)); R(x, DY + 12, 8, 1, lerp(col, (0, 0, 0), .3))
# mostrador de madera con frascos de confites
R(DX - 2, DY + 52, DW + 4, 3, (186, 136, 84)); R(DX - 2, DY + 55, DW + 4, 27, (140, 92, 54))
for x in range(DX, DX + DW, 9):
    R(x, DY + 56, 1, 25, (110, 70, 40))
for j, jx in enumerate([DX + 2, DX + 15, DX + 58]):
    R(jx, DY + 40, 12, 12, (210, 236, 240)); R(jx, DY + 38, 12, 3, (196, 64, 52)); R(jx + 1, DY + 41, 2, 10, (248, 252, 252))
    for k in range(10):
        R(jx + 3 + int(hsh(k, j) * 8), DY + 44 + int(hsh(j, k) * 7), 2, 2, [(214, 60, 60), (240, 196, 70), (90, 170, 90), (240, 140, 170)][k % 4])
R(DX + 45, DY + 42, 12, 10, (44, 44, 52)); R(DX + 47, DY + 44, 8, 3, (110, 220, 140))  # caja registradora
shadow_rect(DX - 2, DY + 82, DW + 6, 2, .35)

# rótulo de cartón «HAY HIELO»
R(166, 52, 30, 18, (214, 186, 140)); R(166, 50, 30, 1, (232, 210, 170)); R(166, 67, 30, 1, (170, 140, 100))
d.text((172, 50), 'HAY', font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 9), fill=(40, 90, 170))
d.text((168, 58), 'HIELO', font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 7), fill=(40, 90, 170))
R(180, 44, 1, 6, (60, 40, 30)); shadow_rect(168, 68, 30, 3, .25)

# ---------- acera, cordón, cuneta y calle ----------
for y in range(124, 158):
    for x in range(W):
        c = lerp((206, 198, 182), (186, 176, 160), (y - 124) / 34)
        if (x + (0 if y < 141 else 20)) % 40 == 0 or y in (124, 141): c = (150, 142, 128)
        if hsh(x, y, 2) < .06: c = lerp(c, (160, 150, 136), .6)
        px[x, y] = c + (255,)
for (sx, sy) in [(60, 130), (232, 146), (140, 150)]:  # grietas
    x, y = sx, sy
    for i in range(14):
        R(x, y, 1, 1, (130, 120, 108)); x += 1; y += (1 if hsh(i, sx) < .4 else 0) - (1 if hsh(sx, i) < .2 else 0)
for x in range(0, W, 2):  # zacate en la junta con la pared
    if hsh(x, 7) < .35: R(x, 123 - int(hsh(x, 8) * 3), 1, 3, (100, 150, 70))
R(0, 158, W, 3, (224, 218, 204)); R(0, 161, W, 2, (150, 142, 128))
R(0, 163, W, 6, (110, 108, 104)); R(0, 165, W, 2, (52, 54, 60))
for x in range(214, 244, 3):  # rejilla
    R(x, 163, 2, 6, (40, 40, 46))
for y in range(169, H):
    for x in range(W):
        c = (82, 86, 94) if hsh(x, y, 5) < .5 else (74, 78, 86)
        if hsh(x // 9, y // 5, 6) < .12: c = (64, 68, 76)
        px[x, y] = c + (255,)

# ---------- objetos de la acera ----------
# silla plástica blanca
CX, CY = 70, 132
shadow_rect(CX + 4, CY + 18, 22, 4, .28)
R(CX, CY, 18, 14, (244, 244, 240)); R(CX + 1, CY + 1, 16, 2, (255, 255, 255)); R(CX, CY + 12, 18, 2, (206, 206, 204))
for i in range(4): R(CX + 2 + i * 4, CY + 4, 2, 6, (214, 214, 210))
R(CX - 1, CY + 13, 20, 4, (236, 236, 232)); R(CX, CY + 17, 2, 6, (216, 216, 212)); R(CX + 16, CY + 17, 2, 6, (200, 200, 196))
# cajas de refrescos vacías
for k, (bx, by) in enumerate([(166, 112), (166, 100), (184, 112)]):
    R(bx, by, 18, 12, (196, 44, 46)); R(bx, by, 18, 1, (226, 90, 80)); R(bx, by + 11, 18, 1, (130, 26, 30))
    for i in range(4): R(bx + 2 + i * 4, by - 2, 3, 3, (60, 110, 70)); R(bx + 2 + i * 4, by - 2, 1, 1, (150, 210, 160))
    R(bx + 6, by + 4, 6, 3, (246, 220, 120))
shadow_rect(168, 124, 36, 4, .3)
# Canelo, dormido a la sombra (se dibuja aparte y se le pone contorno)
dog = Image.new('RGBA', (34, 16), (0, 0, 0, 0)); dp = dog.load()
def dput(x, y, c):
    if 0 <= x < 34 and 0 <= y < 16: dp[x, y] = c + (255,)
for y in range(16):
    for x in range(34):
        if ((x - 13) / 11) ** 2 + ((y - 9) / 5) ** 2 < 1:   # cuerpo
            dput(x, y, (222, 176, 110) if y < 8 else (196, 146, 88) if y < 12 else (164, 116, 66))
        if ((x - 26) / 5) ** 2 + ((y - 9) / 4) ** 2 < 1:    # cabeza
            dput(x, y, (222, 176, 110) if y < 9 else (196, 146, 88))
for x in range(28, 33): dput(x, 11, (240, 214, 170)); dput(x, 12, (226, 196, 150))   # hocico sobre las patas
dput(32, 10, (50, 32, 30)); dput(33, 11, (50, 32, 30))                                 # nariz
for x in range(25, 28): dput(x, 8, (90, 58, 40))                                       # ojo cerrado
for (x, y) in [(23, 5), (24, 5), (22, 6), (23, 6), (24, 6), (22, 7), (23, 7), (23, 8)]: dput(x, y, (164, 112, 64))   # oreja caída
for (x, y) in [(1, 9), (1, 10), (2, 8), (3, 7), (4, 7), (2, 11), (3, 12)]: dput(x, y, (196, 146, 88))           # cola enroscada
for x in range(8, 18, 3): dput(x, 6, (236, 196, 136))                                  # brillo del lomo
for x in range(27, 32): dput(x, 13, (222, 176, 110)); dput(x, 14, (196, 146, 88))      # patas delanteras
dm = dog.copy(); dmp = dm.load(); ds = dog.load()
for y in range(16):
    for x in range(34):
        if ds[x, y][3]: continue
        if any(0 <= x + a < 34 and 0 <= y + b < 16 and ds[x + a, y + b][3] for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            dmp[x, y] = (70, 44, 36, 255)
DGX, DGY = 212, 134
shadow_rect(DGX + 2, DGY + 13, 32, 4, .3)
im.alpha_composite(dm, (DGX, DGY))
R(DGX + 31, DGY - 4, 3, 3, (242, 238, 230)); R(DGX + 35, DGY - 8, 2, 2, (242, 238, 230))  # zzz
# poste de concreto y cables
PX0 = 262
R(PX0, 0, 8, 158, (168, 164, 154)); R(PX0, 0, 2, 158, (200, 196, 186)); R(PX0 + 6, 0, 2, 158, (130, 126, 118))
for y in range(20, 150, 14): R(PX0 + 1, y, 6, 1, (150, 146, 136))
shadow_rect(PX0 + 8, 150, 26, 5, .25)
R(PX0 - 8, 8, 24, 3, (130, 126, 118))
for k in range(2):   # acometida: del poste a la esquina de la casa
    for x in range(204, PX0 + 1):
        t = (x - 204) / (PX0 - 204); y = int(16 + k * 2 + (10 - 16) * t + 9 * math.sin(t * math.pi))
        R(x, y, 1, 1, (36, 30, 36))
for k in range(3):   # la línea de la calle, por encima de todo
    for x in range(PX0 - 30, W):
        R(x, 9 + k * 3, 1, 1, (36, 30, 36))
R(232, 28, 4, 6, (242, 242, 242)); R(232, 34, 4, 2, (196, 44, 46)); R(238, 27, 4, 6, (242, 242, 242)); R(238, 33, 4, 2, (196, 44, 46))
R(233, 22, 1, 6, (40, 30, 30)); R(239, 21, 1, 6, (40, 30, 30))   # tenis colgando del cable

# ---------- el personaje ----------
ch = Image.open('../hd2/campesino.png').convert('RGBA')
FX, FY = 122, 152   # pies
ox, oy = FX - ch.width // 2, FY - ch.height + 1
for y in range(FY - 3, FY + 3):   # sombra de contacto
    for x in range(FX - 16, FX + 22):
        if ((x - FX - 3) / 18) ** 2 + ((y - FY) / 3.2) ** 2 < 1:
            blend(x, y, (40, 24, 40), .38)
im.alpha_composite(ch, (ox, oy))
# ---------- luz de media tarde ----------
for y in range(H):
    for x in range(W):
        o = px[x, y]
        warm = .08 + .06 * (1 - x / W)
        px[x, y] = (min(255, round(o[0] + (255 - o[0]) * warm * .5)), min(255, round(o[1] + (214 - o[1]) * warm * .25)), round(o[2] * (1 - warm * .25)), 255)

out = im.convert('RGB').crop((26, 18, 282, 162)).resize((256 * 5, 144 * 5), Image.NEAREST)
out.save(sys.argv[1])
