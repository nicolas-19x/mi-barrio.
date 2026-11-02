from PIL import Image, ImageEnhance, ImageFilter
import sys, colorsys
sys.path.insert(0, '../ref')
from cells import get
from build import clean
FW, FH = 36, 74
crisp = Image.open('campesino.png').convert('RGBA')
# paleta del sprite nítido: la vista de espaldas se pinta con estos mismos colores
cols = sorted({crisp.getpixel((x, y))[:3] for x in range(crisp.width) for y in range(crisp.height) if crisp.getpixel((x, y))[3]})
pal_img = Image.new('P', (1, 1)); flat = [v for c in cols for v in c]; flat += [0] * (768 - len(flat)); pal_img.putpalette(flat)

def to_palette(im, h):
    a = im.split()[3]; rgb = im.convert('RGB')
    rgb = ImageEnhance.Color(rgb).enhance(1.1); rgb = ImageEnhance.Contrast(rgb).enhance(1.1)
    g = Image.merge('RGBA', (*rgb.split(), a)); w = round(im.width * h / im.height)
    g = g.resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1, percent=70, threshold=2))
    al = g.split()[3].point(lambda v: 255 if v > 120 else 0)
    base = Image.new('RGB', g.size, (255, 0, 255)); base.paste(g, (0, 0), al)
    q = base.quantize(palette=pal_img, dither=Image.Dither.NONE).convert('RGB')
    out = Image.new('RGBA', g.size, (0, 0, 0, 0)); out.paste(q, (0, 0), al)
    o = Image.new('RGBA', (out.width + 2, out.height + 2), (0, 0, 0, 0)); o.paste(out, (1, 1)); p = o.load(); src = o.copy().load()
    for y in range(o.height):
        for x in range(o.width):
            if src[x, y][3]: continue
            if any(0 <= x + a < o.width and 0 <= y + b < o.height and src[x + a, y + b][3] and sum(src[x + a, y + b][:3]) > 190 for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                p[x, y] = (34, 22, 28, 255)
    return o

def shift_leg(im, x0, x1, y0, dy):
    out = im.copy(); s = im.load(); d = out.load(); W, H = im.size
    for x in range(x0, x1 + 1):
        for y in range(y0, H): d[x, y] = (0, 0, 0, 0)
        for y in range(y0, H):
            ny = y + dy
            if y0 - 2 <= ny < H and s[x, y][3]: d[x, ny] = s[x, y]
    return out

def frame(im):
    c = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); c.paste(im, ((FW - im.width) // 2, FH - im.height - 1), im); return c

def walk(im, split, y0):
    # paso A: se levanta la pierna izquierda · paso B: la derecha
    W = im.width
    return [frame(im), frame(shift_leg(im, 0, split, y0, -2)), frame(shift_leg(im, split + 1, W - 1, y0, -2))]

front = walk(crisp, 16, 56)
back_src = to_palette(clean(get('b2')), 74)
bp = back_src.load()
for y in range(back_src.height - 10, back_src.height):
    for x in range(back_src.width):
        c = bp[x, y]
        if c[3] and sum(c[:3]) > 520: bp[x, y] = (0, 0, 0, 0)
for _ in range(2):   # puntos sueltos
    for y in range(back_src.height):
        for x in range(back_src.width):
            if bp[x, y][3] and sum(1 for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + a < back_src.width and 0 <= y + b < back_src.height and bp[x + a, y + b][3]) <= 1:
                bp[x, y] = (0, 0, 0, 0)
back_src = back_src.crop(back_src.getbbox())
bw = back_src.width
back = walk(back_src, bw // 2, 55)
right = front
left = [f.transpose(Image.FLIP_LEFT_RIGHT) for f in front]
sheet = Image.new('RGBA', (FW * 3, FH * 4), (0, 0, 0, 0))
for r, row in enumerate([front, back, left, right]):
    for c, f in enumerate(row): sheet.paste(f, (c * FW, r * FH), f)
sheet.save('hero_sheet.png'); sheet.resize((sheet.width * 4, sheet.height * 4), Image.NEAREST).save('hero_sheet_x4.png')
print(sheet.size, back_src.size)
