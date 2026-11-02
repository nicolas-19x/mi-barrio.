"""Tres direcciones de arte para el mapa de Mi Barrio · misma esquina, misma cámara del juego, el doble de detalle.
A = Barrio cálido · B = Cinematográfico (hora dorada) · D = Diorama (mañana, profundidad)."""
import numpy as np, math, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont

W, H = 576, 324
STYLE = sys.argv[1]
OUT = sys.argv[2]
rng = np.random.default_rng(3)


def hsh(x, y, s=0):
    h = (int(x) * 374761393 + int(y) * 668265263 + s * 1442695040888963407) & 0xffffffff
    h = ((h ^ (h >> 13)) * 1274126177) & 0xffffffff
    return ((h ^ (h >> 16)) & 0xffffffff) / 4294967296


def C(hexs):
    hexs = hexs.lstrip('#'); return np.array([int(hexs[i:i + 2], 16) for i in (0, 2, 4)], float)


def mix(a, b, t): return a + (b - a) * t
def sh(c, k): return np.clip(c * (1 + k) if k < 0 else c + (255 - c) * k, 0, 255)


# ---------------- paletas por estilo ----------------
PAL = {
 'A': dict(grass=C('6fae4a'), grass2=C('5b9a3e'), grass3=C('86c25a'), side=C('d9cdb5'), side2=C('c4b79c'), asph=C('5b5d66'), asph2=C('4c4e57'),
           pulp=C('f2c14e'), pink=C('f2a2b6'), soda=C('9fd0c4'), roofR=C('c4473a'), roofG=C('a7b0b6'), roofB=C('6f8fa8'),
           shadow=C('3c2a52'), shadowA=.32, sky=C('bfe3f2'), leaf=C('3f8a3e'), leaf2=C('5aa64c'), leaf3=C('2e6b33'), light=C('fff1c8')),
 'B': dict(grass=C('7a9a4a'), grass2=C('607e3c'), grass3=C('a2b25a'), side=C('d6c2a2'), side2=C('bba684'), asph=C('545663'), asph2=C('454654'),
           pulp=C('e8b347'), pink=C('e892a8'), soda=C('8fc0b6'), roofR=C('b8443a'), roofG=C('9aa0a4'), roofB=C('607e98'),
           shadow=C('2a2e58'), shadowA=.72, sky=C('f2c08a'), leaf=C('3d6e3a'), leaf2=C('6e8e44'), leaf3=C('24452c'), light=C('ffcf8a')),
 'D': dict(grass=C('7cc25a'), grass2=C('64ac48'), grass3=C('9ad46e'), side=C('e4dccb'), side2=C('cfc5b0'), asph=C('646a78'), asph2=C('565b69'),
           pulp=C('f7cd62'), pink=C('f6b4c4'), soda=C('a8dcd2'), roofR=C('d65a4a'), roofG=C('b8c2c8'), roofB=C('7aa0c0'),
           shadow=C('3a4a78'), shadowA=.28, sky=C('d2ecf8'), leaf=C('46a04a'), leaf2=C('6cc05a'), leaf3=C('2f7a3c'), light=C('f4fbff')),
}[STYLE]
P = PAL
img = np.zeros((H, W, 3), float)
alpha_shadow = np.zeros((H, W), float)   # mapa de sombras proyectadas (se aplica al final del suelo)


def R(x, y, w, h, c, a=1.0):
    x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(W, int(x + w)), min(H, int(y + h))
    if x1 <= x0 or y1 <= y0: return
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + np.asarray(c, float) * a


def px(x, y, c, a=1.0):
    if 0 <= x < W and 0 <= y < H: img[int(y), int(x)] = img[int(y), int(x)] * (1 - a) + c * a


def disc(cx, cy, r, c, a=1.0, sy=1.0):
    for y in range(int(cy - r * sy) - 1, int(cy + r * sy) + 2):
        for x in range(int(cx - r) - 1, int(cx + r) + 2):
            if ((x - cx) / r) ** 2 + ((y - cy) / (r * sy)) ** 2 <= 1: px(x, y, c, a)


def shadow_rect(x, y, w, h, a=1.0):
    x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(W, int(x + w)), min(H, int(y + h))
    if x1 > x0 and y1 > y0: alpha_shadow[y0:y1, x0:x1] = np.maximum(alpha_shadow[y0:y1, x0:x1], a)


def cast(x, y, h, w=10, a=1.0):
    """sombra proyectada: corta y bajo los pies de día; larga hacia la derecha en la hora dorada"""
    global alpha_shadow
    if STYLE != 'B':
        shadow_ell(x, y, w * .6 + 2, 3, a); apply_shadows(); alpha_shadow[:] = 0; return
    L = h * 1.5
    for i in range(int(L)):
        t = i / L; cx = x + i; cy = y + i * .18
        ww = w * (1 - t * .35) / 2
        for yy in range(int(cy - 2), int(cy + 3)):
            for xx in range(int(cx - ww), int(cx + ww) + 1):
                if 0 <= xx < W and 0 <= yy < H: alpha_shadow[yy, xx] = max(alpha_shadow[yy, xx], a * (1 - t * .6))
    apply_shadows(); alpha_shadow[:] = 0


def shadow_ell(cx, cy, rx, ry, a=1.0):
    for y in range(int(cy - ry), int(cy + ry) + 1):
        for x in range(int(cx - rx), int(cx + rx) + 1):
            d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
            if d <= 1 and 0 <= x < W and 0 <= y < H: alpha_shadow[y, x] = max(alpha_shadow[y, x], a * (1 - d * .35))


def text(x, y, s, size, col, bold=True):
    global img
    im = Image.fromarray(img.astype(np.uint8)); d = ImageDraw.Draw(im); d.fontmode = '1'
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else ''), size)
    d.text((x, y), s, font=f, fill=tuple(int(v) for v in col)); img = np.asarray(im, float).copy()


# ---------------- geometría (mundo: 32 px por casilla) ----------------
ROOF_Y, FAC_Y, BASE_Y = 0, 74, 120          # techo · fachada · pie de fachada
SW_N = (120, 150); CURB_N = 150; ST = (160, 222); CURB_S = 222; SW_S = (230, 262)
B_PULP = (14, 236); B_ALLEY = (236, 274); B_CASA = (274, 470); B_SODA = (486, 576)

# ---------------- fondo: patios, palos y techos lejanos ----------------
def leafclump(cx, cy, r, base, hi, lo, a=1.0):
    for y in range(int(cy - r), int(cy + r) + 1):
        for x in range(int(cx - r), int(cx + r) + 1):
            d = math.hypot(x - cx, y - cy) / r
            if d <= 1:
                t = ((x - cx) + (y - cy)) / (2 * r)
                c = hi if t < -.35 else lo if t > .35 or d > .85 else base
                px(x, y, c, a)


def background():
    for y in range(0, BASE_Y):
        img[y, :] = mix(sh(P['leaf3'], -.35), P['leaf3'], y / BASE_Y)
    for i in range(70):
        cx, cy = rng.integers(0, W), rng.integers(0, 70); r = rng.integers(8, 16)
        leafclump(cx, cy, r, sh(P['leaf3'], -.1), P['leaf'], sh(P['leaf3'], -.4))


# ---------------- suelo ----------------
def ground():
    # zacate del parque
    for y in range(SW_S[1], H):
        for x in range(W):
            big = hsh(x // 14, y // 9, 31) + hsh((x + 7) // 9, (y + 3) // 6, 32) * .6
            t = hsh(x // 2, y // 2, 1); c = P['grass'] if big < .9 else sh(P['grass'], -.08)
            if t < .18: c = P['grass2']
            elif t > .9: c = P['grass3']
            if y < SW_S[1] + 6: c = sh(c, -.18 * (1 - (y - SW_S[1]) / 6))
            img[y, x] = c
    for i in range(60):    # matas
        cx, cy = rng.integers(0, W), rng.integers(SW_S[1] + 8, H + 6)
        for k in range(14):
            x = cx + int(rng.integers(-6, 7)); h = int(rng.integers(3, 7))
            R(x, cy - h, 1, h, P['grass2'] if k % 2 else sh(P['grass3'], .1)); px(x, cy - h, P['grass3'])
    for i in range(900):   # hojitas de zacate
        x, y = rng.integers(0, W), rng.integers(SW_S[1] + 2, H)
        c = P['grass3'] if rng.random() < .5 else P['grass2'] * .9
        R(x, y - 3, 1, 3, c); px(x + 1, y - 2, c)
    for i in range(40):     # flores silvestres
        x, y = rng.integers(0, W), rng.integers(SW_S[1] + 6, H)
        col = [C('f7e05a'), C('f4f4f4'), C('f39ac0'), C('c9a0e8')][i % 4]
        R(x, y, 2, 2, col); px(x + 1, y + 2, P['leaf'])
    # aceras de losas
    for (y0, y1) in (SW_N, SW_S):
        for y in range(y0, y1):
            for x in range(W):
                c = mix(P['side'], P['side2'], (y - y0) / (y1 - y0) * .5)
                if hsh(x, y, 2) < .08: c = sh(c, -.06)
                if hsh(x, y, 3) > .97: c = sh(c, .06)
                img[y, x] = c
        for x in range(0, W, 32):
            R(x, y0, 1, y1 - y0, sh(P['side2'], -.12)); R(x + 1, y0, 1, y1 - y0, sh(P['side'], .08))
        R(0, y0 + 15, W, 1, sh(P['side2'], -.1))
        for k in range(6):   # grietas
            cx, cy = rng.integers(10, W - 10), rng.integers(y0 + 3, y1 - 3)
            for i in range(10):
                px(cx, cy, sh(P['side2'], -.3)); cx += 1; cy += int(rng.integers(-1, 2))
        for x in range(0, W, 3):   # zacate entre la acera y las casas / el parque
            if hsh(x, y0, 4) < .45: R(x, y0 - (1 if y0 == SW_N[0] else 0), 1, 2 + int(hsh(x, 5) * 2), P['grass2'])
    # cordón y cuneta
    for yc, up in ((CURB_N, True), (CURB_S, False)):
        R(0, yc, W, 3 if up else 3, sh(P['side'], .1)); R(0, yc + 3, W, 2, sh(P['side2'], -.2))
        R(0, yc + 5 if up else yc - 5, W, 5, mix(P['asph'], P['side2'], .45))
        R(0, (yc + 7) if up else (yc - 3), W, 2, sh(P['asph2'], -.35))
    for gx in (88, 344):   # rejillas
        R(gx, CURB_N + 5, 22, 5, C('24242a'))
        for i in range(0, 22, 3): R(gx + i, CURB_N + 5, 1, 5, C('6a6a72'))
    # asfalto
    for y in range(ST[0], ST[1]):
        for x in range(W):
            t = hsh(x, y, 6); c = P['asph'] if t < .55 else P['asph2'] if t < .9 else sh(P['asph'], .12)
            img[y, x] = c
    for (bx, by, bw, bh) in [(40, 172, 46, 18), (300, 196, 60, 14), (470, 168, 34, 22)]:   # bacheo
        for y in range(by, by + bh):
            for x in range(bx, bx + bw):
                if hsh(x // 3, y // 3, 61) < .85 or (bx + 3 < x < bx + bw - 3 and by + 2 < y < by + bh - 2):
                    px(x, y, sh(P['asph2'], -.04) if hsh(x, y, 62) < .6 else P['asph2'])
    for x in range(0, W, 48): R(x + 6, 190, 20, 2, mix(P['asph'], C('e8e2c8'), .55))   # raya gastada
    # alcantarilla
    disc(240, 206, 8, C('35373e')); disc(240, 206, 6.5, C('5b5e66'))
    for i in range(-5, 6, 2): R(240 + i, 201, 1, 10, C('45474e'))
    # bache con charco
    disc(410, 178, 11, sh(P['asph2'], -.25), sy=.45); disc(410, 178, 9, mix(P['sky'], P['asph'], .45), sy=.38)
    R(404, 176, 6, 1, sh(P['sky'], .2))


# ---------------- techos de zinc vistos desde arriba ----------------
def zinc(x0, x1, y0, y1, base, rust=.12):
    for y in range(y0, y1):
        depth = (y - y0) / max(1, y1 - y0)
        for x in range(x0, x1):
            k = (x - x0) % 6
            c = sh(base, .22) if k == 0 else sh(base, .1) if k == 1 else sh(base, -.12) if k == 4 else sh(base, -.2) if k == 5 else base
            c = sh(c, -.12 * depth)
            col = (x - x0) // 6
            run = hsh(col, x0, 9)
            if run < rust * 2.2 and y - y0 < 10 + hsh(col, 2, x0) * 40: c = mix(c, C('8a4a2a'), .45 + .25 * (k in (2, 3)))
            if hsh(col // 4, x0, 17) < .12: c = sh(c, .14)
            img[y, x] = c
    for y in range(y0 + 22, y1, 24): R(x0, y, x1 - x0, 1, sh(base, -.35)); R(x0, y + 1, x1 - x0, 1, sh(base, .18))   # traslapes
    for i in range(int((x1 - x0) / 18)):   # hojas secas sobre el zinc
        lx, ly = x0 + hsh(i, y0, 41) * (x1 - x0), y0 + 8 + hsh(y0, i, 42) * (y1 - y0 - 14)
        R(lx, ly, 3, 2, C('9a6a2a')); px(lx + 1, ly, C('c8963a'))
    R(x0, y0, x1 - x0, 3, sh(base, .3)); R(x0, y0 + 3, x1 - x0, 1, sh(base, -.3))      # cumbrera
    R(x0 - 2, y1, x1 - x0 + 4, 3, C('9aa1a6')); R(x0 - 2, y1 + 3, x1 - x0 + 4, 1, C('5c6166'))   # canoa


def facade(x0, x1, col):
    for y in range(FAC_Y + 4, BASE_Y):
        for x in range(x0, x1):
            c = mix(sh(col, .06), sh(col, -.1), (y - FAC_Y) / (BASE_Y - FAC_Y))
            n = hsh(x, y, 11)
            if n < .07: c = sh(c, -.07)
            elif n > .95: c = sh(c, .08)
            img[y, x] = c
    R(x0, BASE_Y - 8, x1 - x0, 8, sh(col, -.45)); R(x0, BASE_Y - 9, x1 - x0, 1, sh(col, -.6))   # zócalo
    R(x0, FAC_Y + 4, x1 - x0, 5, P['shadow'], .45)   # sombra del alero


def window_reja(x, y, w, h, frame=C('f2ece0'), interior=None):
    R(x - 2, y - 2, w + 4, h + 4, frame); R(x - 2, y + h + 1, w + 4, 2, sh(frame, -.25))
    for yy in range(y, y + h): R(x, yy, w, 1, mix(interior if interior is not None else C('3c4a5e'), C('22283a'), (yy - y) / h))
    R(x + 2, y + 2, w // 3, 3, C('8fb4d0'), .7)
    for i in range(1, w, 4): R(x + i, y, 1, h, C('f4f4f0')); R(x + i + 1, y, 1, h, C('b8b8b2'))
    R(x, y + h // 2, w, 1, C('f4f4f0'))
    for i in range(3, w - 3, 8):
        for dx, dy in ((0, -2), (1, -3), (2, -2), (0, 2), (1, 3), (2, 2)): px(x + i + dx, y + h // 2 + dy, C('f4f4f0'))


def buildings():
    # pulpería
    zinc(B_PULP[0], B_PULP[1], ROOF_Y, FAC_Y, P['roofR'], .1)
    facade(B_PULP[0], B_PULP[1], P['pulp'])
    R(30, 78, 190, 15, C('b8282c')); R(30, 78, 190, 1, C('d85048')); R(30, 92, 190, 1, C('7a181c'))
    text(38, 79, 'PULPERÍA LA BENDICIÓN', 11, C('fff0c8'))
    window_reja(26, 96, 40, 18, interior=C('4a3020'))
    # mostrador abierto con productos, mecate de paquetes y Doña Rosa adentro
    R(90, 96, 100, 24, C('3a2618'))
    for i, cc in enumerate(['f2c94c', 'd64545', '7bc0e8', 'f2994a', '7bb661', 'f2c94c', 'e85d75']):
        x = 94 + i * 13; R(x, 97, 9, 8, C(cc)); R(x + 1, 98, 2, 6, sh(C(cc), .4)); R(x, 104, 9, 1, sh(C(cc), -.35))
    R(90, 96, 100, 1, C('241810'))
    for i in range(0, 100, 5): R(90 + i, 106, 3, 4, C(['d64545', 'f2c94c', '7bb661', '3f7fd1', 'f4f4f4'][(i // 5) % 5]))
    R(86, 112, 108, 8, C('8a5a32')); R(86, 112, 108, 2, C('b07a46'))
    for j, jx in enumerate((100, 166)):
        R(jx, 104, 10, 9, C('d8eef2')); R(jx, 102, 10, 2, C('c0473b')); [R(jx + 2 + (k * 3) % 7, 107 + (k // 3) * 2, 2, 2, C(['d64545', 'f2c94c', '7bb661'][k % 3])) for k in range(6)]
    R(196, 94, 26, 26, C('5c3d24')); R(198, 96, 22, 24, C('7a5233')); R(214, 106, 2, 2, C('e8c547'))
    # rótulo de cartón y cajas de refresco
    R(228, 96, 2, 6, C('5c3d24'))
    # callejón con tapia y veranera
    for y in range(40, BASE_Y):
        for x in range(B_ALLEY[0], B_ALLEY[1]):
            bx, by = (x + (8 if (y // 8) % 2 else 0)) % 16, y % 8
            img[y, x] = C('cfc5b4') if bx and by else C('a89e8c')
    R(B_ALLEY[0], 36, B_ALLEY[1] - B_ALLEY[0], 4, C('bdb3a2'))
    for x in range(B_ALLEY[0] - 4, B_ALLEY[1] + 10):
        hang = int(10 + 26 * abs(math.sin(x * .13)) + 10 * hsh(x, 2))
        for y in range(30, 40 + hang):
            dpt = (y - 30) / (hang + 10)
            if hsh(x // 2, y // 2, 3) < .82 - dpt * .55:
                c = P['leaf3'] if hsh(x // 2, y // 3, 4) < .45 else P['leaf']
                if hsh(x // 3, y // 3, 5) < .4: c = C('d62a7c') if hsh(x, y, 6) < .55 else C('f06aaa')
                px(x, y, c)
    # casa de Ariana
    zinc(B_CASA[0], B_CASA[1], ROOF_Y + 6, FAC_Y, P['roofG'], .2)
    facade(B_CASA[0], B_CASA[1], P['pink'])
    window_reja(290, 90, 34, 20); window_reja(420, 90, 34, 20)
    R(352, 86, 30, 34, C('5c3d24')); R(354, 88, 26, 32, C('f4ead2')); R(356, 92, 10, 10, sh(C('f4ead2'), -.08)); R(368, 92, 10, 10, sh(C('f4ead2'), -.08)); R(375, 104, 2, 2, C('c9a04a'))
    for mx in (334, 390, 404):   # macetas
        R(mx, 110, 10, 9, C('b5562f')); R(mx, 110, 10, 2, C('d27a4f')); disc(mx + 5, 106, 6, P['leaf']); disc(mx + 3, 104, 3, P['leaf2']); R(mx + 4, 101, 2, 2, C('f193b4'))
    R(326, 66, 46, 8, C('f4f4f4')); R(326, 66, 46, 1, C('ffffff'))
    # tanque negro y antena en el techo
    R(432, 14, 26, 22, C('1e1e24')); R(434, 16, 8, 18, C('34343e')); R(432, 22, 26, 1, C('101014')); R(432, 28, 26, 1, C('101014')); R(436, 10, 18, 4, C('2a2a32'))
    R(300, 4, 1, 26, C('5d5d66')); R(292, 8, 18, 1, C('5d5d66')); R(294, 13, 14, 1, C('5d5d66')); R(296, 18, 10, 1, C('5d5d66'))
    # soda con toldo a rayas
    zinc(B_SODA[0], B_SODA[1], ROOF_Y + 2, FAC_Y - 8, P['roofB'], .15)
    facade(B_SODA[0], B_SODA[1], P['soda'])
    for i in range(0, B_SODA[1] - B_SODA[0], 10):
        R(B_SODA[0] + i, 66, 10, 18, C('d84a3c') if (i // 10) % 2 else C('f4ead2'))
    for i in range(0, B_SODA[1] - B_SODA[0], 10): R(B_SODA[0] + i, 84, 10, 3, C('a8322a') if (i // 10) % 2 else C('d8cdb4'))
    R(B_SODA[0] + 10, 92, 50, 22, C('2a3a44')); R(B_SODA[0] + 12, 94, 20, 6, C('f2c94c')); text(B_SODA[0] + 10, 95, 'SODA', 8, C('fff0c8'))


def details():
    for x0, x1 in (B_PULP, B_CASA, B_SODA):
        L = 22 if STYLE == 'B' else 7
        for y in range(BASE_Y, BASE_Y + L): R(x0 + (y - BASE_Y) * (4 if STYLE == 'B' else 2), y, x1 - x0, 1, P['shadow'], (.5 if STYLE == 'B' else .35) * (1 - (y - BASE_Y) / (L + 1)))
    for mx in (70, 460):   # medidores de luz y agua
        R(mx, 98, 9, 12, C('d8d8d0')); R(mx + 1, 99, 7, 5, C('9ab8c4')); R(mx + 2, 106, 5, 2, C('2a2a30'))
    disc(330, 30, 4, C('f4f4f4')); px(329, 29, C('2a2a30')); px(331, 31, C('2a2a30'))   # la bola en el techo
    # bicicleta recostada en la tapia del callejón
    for wx in (240, 262):
        disc(wx, 140, 6, C('1d1a24')); disc(wx, 140, 4.6, C('8f949a')); disc(wx, 140, 1, C('1d1a24'))
    R(241, 132, 21, 2, C('2a6fb0')); R(250, 128, 2, 12, C('2a6fb0')); R(247, 126, 7, 2, C('1d1a24')); R(259, 126, 2, 8, C('2a6fb0'))
    shadow_rect(236, 146, 34, 3, .6)


def props():
    # silla plástica y cajas de refresco frente a la pulpería
    R(20, 124, 14, 10, C('f4f4f0')); R(20, 124, 14, 2, C('ffffff')); R(18, 132, 18, 4, C('e6e6e2')); R(19, 136, 2, 6, C('d0d0cc')); R(33, 136, 2, 6, C('c0c0bc'))
    shadow_rect(22, 140, 18, 4, .7)
    for (bx, by) in ((204, 128), (204, 118), (218, 128)):
        R(bx, by, 14, 10, C('c8322e')); R(bx, by, 14, 1, C('e66a5a')); R(bx + 4, by + 3, 6, 3, C('f6dc78'))
        for i in range(3): R(bx + 2 + i * 4, by - 2, 2, 3, C('3f7a4a'))
    shadow_rect(204, 138, 30, 4, .7)
    # banca del parque y basurero de canasta en poste
    R(70, 268, 52, 6, C('9a6a3e')); R(70, 268, 52, 1, C('c08a52')); R(70, 276, 52, 5, C('8a5a32')); R(74, 281, 3, 7, C('3a3a40')); R(115, 281, 3, 7, C('3a3a40'))
    shadow_rect(74, 287, 50, 4, .8)
    R(152, 246, 2, 20, C('5d5d66')); R(146, 236, 14, 11, C('3a3a40')); [R(147 + i, 237, 1, 9, C('6a6a72')) for i in range(0, 12, 3)]
    # perro dormido a la sombra
    for y in range(240, 256):
        for x in range(394, 430):
            if ((x - 410) / 15) ** 2 + ((y - 250) / 6) ** 2 < 1: px(x, y, C('d8a868') if y < 249 else C('b88a50'))
    disc(426, 247, 6, C('d8a868')); R(428, 248, 6, 3, C('f0d8a8')); R(433, 248, 2, 2, C('3a2420')); R(423, 241, 3, 5, C('a87840')); R(424, 246, 3, 1, C('6a4430'))
    shadow_ell(412, 257, 20, 4, .8)


# ---------------- personajes ----------------
def sprite(name, x, y):
    global img
    s = Image.open(name).convert('RGBA'); a = np.asarray(s, float); al = a[..., 3:4] / 255
    h, w = a.shape[:2]; X, Y = int(x - w / 2), int(y - h + 1)
    y0, x0 = max(0, Y), max(0, X); y1, x1 = min(H, Y + h), min(W, X + w)
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - al[y0 - Y:y1 - Y, x0 - X:x1 - X]) + a[y0 - Y:y1 - Y, x0 - X:x1 - X, :3] * al[y0 - Y:y1 - Y, x0 - X:x1 - X]


def characters():
    # Doña Rosa detrás del mostrador (solo de la cintura para arriba)
    s = Image.open('rosa_0_0.png').convert('RGBA').crop((0, 0, 34, 30)); s.save('_rosa_half.png'); sprite('_rosa_half.png', 140, 112)
    R(86, 112, 108, 8, C('8a5a32')); R(86, 112, 108, 2, C('b07a46'))
    cast(178, 146, 46, 14, .9); sprite('player_0_0.png', 178, 147)
    cast(306, 147, 46, 12, .9); sprite('ariana_2_0.png', 306, 148)
    cast(100, 289, 46, 12, .9); sprite('beto_0_0.png', 100, 280)


# ---------------- capa superior: poste, cables, mango ----------------
def top_layer():
    # mango del parque (copa encima de la calle)
    shadow_ell(470 + (60 if STYLE == 'B' else 0), 236 + (10 if STYLE == 'B' else 0), 70 + (40 if STYLE == 'B' else 0), 22, .75); apply_shadows(); alpha_shadow[:] = 0
    cx, cy = 472, 196
    R(464, 230, 12, 50, C('6b4a2b')); R(464, 230, 4, 50, C('86603a')); R(474, 230, 2, 50, C('4a3220'))
    clumps = []
    for i in range(46):
        ang = hsh(i, 3, 51) * 6.283; dist = math.sqrt(hsh(i, 4, 52)) * 52
        clumps.append((cx + math.cos(ang) * dist, cy + math.sin(ang) * dist * .72, 9 + hsh(i, 5, 53) * 8))
    clumps.sort(key=lambda c: c[1])
    for (x, y, r) in clumps:
        lum = (y - cy) / 50
        leafclump(x, y + 2, r, sh(P['leaf3'], -.25), sh(P['leaf3'], -.1), sh(P['leaf3'], -.45))
        leafclump(x, y, r - 1, P['leaf'] if lum > -.3 else P['leaf2'], sh(P['leaf2'], .18), P['leaf3'])
    for i in range(12):
        x, y = cx - 40 + hsh(i, 1) * 80, cy - 20 + hsh(1, i) * 40; R(x, y, 4, 5, C('f2a43a')); R(x, y, 2, 2, C('f8d070')); px(x + 1, y - 1, C('4a6a2a'))
    # poste de concreto con lámpara
    PX = 252
    R(PX, 6, 8, 142, C('b4b0a6')); R(PX, 6, 2, 142, C('d2cec4')); R(PX + 6, 6, 2, 142, C('8e8a80'))
    for y in range(20, 140, 16): R(PX + 1, y, 6, 1, C('a09c92'))
    R(PX - 14, 16, 36, 3, C('8e8a80')); R(PX + 8, 22, 18, 2, C('5d5d66')); R(PX + 22, 22, 8, 5, C('3a3a40')); R(PX + 23, 26, 6, 2, C('f2e6b0'))
    shadow_rect(PX + 2, 146, 34, 4, .8) if STYLE != 'B' else cast(PX + 4, 147, 120, 8, .8)
    cables = []
    for k in range(3): cables.append([(x, 12 + k * 3 + 16 * math.sin(math.pi * x / PX)) for x in range(0, PX)] + [(x, 12 + k * 3 + 16 * math.sin(math.pi * (x - PX) / (W - PX))) for x in range(PX, W)])
    cables.append([(x, 18 + (x - 150) * (40 - 18) / (PX - 150) + 8 * math.sin(math.pi * (x - 150) / (PX - 150))) for x in range(150, PX)])   # acometida
    for cab in cables:
        for x, y in cab: px(x, y, C('1c1a22')); px(x, y + 1, C('1c1a22'), .35)
    for (tx, ty) in ((356, 21), (362, 20)):   # tenis colgando
        R(tx, ty, 1, 7, C('2a2228')); R(tx - 2, ty + 7, 5, 6, C('f4f4f4')); R(tx - 2, ty + 12, 5, 2, C('d64545'))


# ---------------- iluminación y posproceso por estilo ----------------
def apply_shadows():
    global img
    a = alpha_shadow[..., None] * P['shadowA']
    img = img * (1 - a) + (img * .55 + P['shadow'] * .45) * a


def grade():
    global img
    yy, xx = np.mgrid[0:H, 0:W]
    if STYLE == 'A':
        img = img * np.array([1.03, 1.0, .95]) + np.array([6, 3, -2])
        vig = 1 - .18 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        img *= vig[..., None]
    elif STYLE == 'B':
        # hora dorada: luz baja desde la izquierda, sombras azules, rayos de sol y viñeta fuerte
        lum = img.mean(axis=2, keepdims=True) / 255
        warm = np.array([255, 170, 90.]); cool = np.array([40, 56, 110.])
        img = img * .78 + (warm * lum + cool * (1 - lum)) * .22
        t = np.clip(1 - xx / W, 0, 1)[..., None]
        img += np.array([60, 30, 0]) * t * .55
        rays = np.zeros((H, W))
        for k, off in enumerate((20, 150, 300, 470)):
            band = np.abs(((xx - off) - (yy * 1.1)) % 600 - 30) < 18 + k * 5
            rays += band * (.16 - k * .025)
        rays = np.asarray(Image.fromarray((rays * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(8)), float) / 255
        img += rays[..., None] * np.array([255, 200, 120])
        vig = 1 - .42 * (((xx - W * .42) / (W * .62)) ** 2 + ((yy - H * .45) / (H * .62)) ** 2)
        img *= np.clip(vig, .45, 1)[..., None]
        for i in range(140):   # polvo flotando en la luz
            x, y = rng.integers(0, W), rng.integers(0, H)
            if (((x - y * 1.1) % 600) - 30) < 40: img[y, x] = np.clip(img[y, x] + np.array([90, 70, 40]), 0, 255)
    elif STYLE == 'D':
        img = img * np.array([.98, 1.0, 1.04]) + np.array([2, 5, 10])
        lum = img.mean(axis=2, keepdims=True); img = lum + (img - lum) * 1.18
    img = np.clip(img, 0, 255)


def lights_B():
    """ventanas y focos que empiezan a prenderse en la hora dorada"""
    global img
    glow = np.zeros((H, W))
    for (x, y, w, h) in ((26, 96, 40, 18), (90, 96, 100, 16), (290, 90, 34, 20), (B_SODA[0] + 10, 92, 50, 22)):
        glow[y:y + h, x:x + w] = 1
    glow[24:28, 275:281] = 2.5
    yy, xx = np.mgrid[0:H, 0:W]
    pool = np.clip(1 - (((xx - 278) / 46) ** 2 + ((yy - 150) / 16) ** 2), 0, 1)   # charco de luz del foco
    img += pool[..., None] * np.array([255, 190, 110]) * .35
    g = np.asarray(Image.fromarray(np.clip(glow * 120, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10)), float) / 255
    img += g[..., None] * np.array([255, 170, 80]) * .7
    for (x, y, w, h) in ((26, 96, 40, 18), (290, 90, 34, 20)):
        sl = img[y:y + h, x:x + w]; img[y:y + h, x:x + w] = sl * .5 + np.array([255, 196, 110]) * .5
    img = np.clip(img, 0, 255)


def diorama_D():
    """profundidad de maqueta: desenfoque arriba y abajo, hojas en primer plano y brillo suave"""
    global img
    base = Image.fromarray(img.astype(np.uint8))
    blur = np.asarray(base.filter(ImageFilter.GaussianBlur(2.2)), float)
    yy = np.arange(H)[:, None]
    m = np.clip(np.maximum((70 - yy) / 70, (yy - 250) / 74), 0, 1) ** 1.3
    img = img * (1 - m[..., None]) + blur * m[..., None]
    # hojas de primer plano (fuera de foco) en las esquinas de abajo
    fg = np.zeros((H, W, 4))
    for (cx, cy, r) in [(20, 330, 60), (70, 340, 40), (560, 336, 58), (520, 350, 40)]:
        for y in range(max(0, cy - r), H):
            for x in range(max(0, cx - r), min(W, cx + r)):
                if ((x - cx) / r) ** 2 + ((y - cy) / r) ** 2 < 1 - hsh(x // 6, y // 6, 21) * .4:
                    fg[y, x] = [36, 82, 44, 230]
    fgi = Image.fromarray(fg.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(4)); fg = np.asarray(fgi, float)
    al = fg[..., 3:4] / 255; img = img * (1 - al) + fg[..., :3] * al
    bright = np.clip(img - 200, 0, 255)
    bloom = np.asarray(Image.fromarray(bright.astype(np.uint8)).filter(ImageFilter.GaussianBlur(6)), float)
    img = np.clip(img + bloom * .6, 0, 255)


# ---------------- armar la escena ----------------
background(); ground(); buildings(); details(); props()
apply_shadows()
alpha_shadow[:] = 0
characters(); apply_shadows(); alpha_shadow[:] = 0
top_layer(); apply_shadows()
if STYLE == 'B': lights_B()
grade()
if STYLE == 'D': diorama_D()
out = Image.fromarray(img.astype(np.uint8)).resize((W * 2, H * 2), Image.NEAREST)
out.save(OUT)
print('ok', OUT)
