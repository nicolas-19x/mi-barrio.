#!/usr/bin/env python3
"""Arma Mi_Barrio.html a partir de los módulos de src/ (ver src/README.md).

El juego sigue siendo un solo archivo HTML para jugar sin servidor; esto solo lo arma.
  python3 build.py            -> escribe Mi_Barrio.html
  python3 build.py --check    -> verifica que Mi_Barrio.html está al día (no escribe)
"""
import glob, os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'Mi_Barrio.html')

def read(rel):
    with open(os.path.join(SRC, rel), encoding='utf-8', newline='') as f:
        return f.read()

def files(pattern):
    return sorted(os.path.relpath(p, SRC) for p in glob.glob(os.path.join(SRC, pattern)))

def block(name):
    # Cada bloque conserva sus marcadores para poder ubicarlo en el HTML.
    if name == 'HD':      # arte HD: módulos numerados y luego los datos generados (data_*.js)
        code = '\n'.join(read(f) for f in files('js/hd/[0-9][0-9]_*.js'))
        for f in files('js/hd/data_*.js'):
            code += '\n' + read(f)
        return '// <HD>\n' + code + '\n// </HD>\n'
    if name == 'PROG':    # progresión: cada módulo termina en salto de línea
        return '// <PROG>\n' + ''.join(read(f) + '\n' for f in files('js/prog/[0-9][0-9]_*.js')) + '// </PROG>\n'
    if name == 'UI':
        return '// <UI>\n' + read('js/ui/ui.js') + '// </UI>\n'
    if name == 'NET':
        return '// <NET>\n' + read('js/net/net.js') + '// </NET>\n'
    raise SystemExit('bloque desconocido: ' + name)

def build():
    js = ''
    for line in read('manifest.txt').splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        js += block(line[1:]) if line.startswith('@') else read(line)
    css = read('css/base.css') + '/* <UI> */\n' + read('css/ui.css') + '/* </UI> */'
    html = read('template.html')
    for mark, text in (('/*@@CSS@@*/', css), ('//@@JS@@', js)):
        assert html.count(mark) == 1, mark
        html = html.replace(mark, text)
    return html

if __name__ == '__main__':
    html = build()
    if '--check' in sys.argv:
        cur = open(OUT, encoding='utf-8', newline='').read()
        print('Mi_Barrio.html está al día' if cur == html else 'Mi_Barrio.html NO coincide con src/')
        sys.exit(0 if cur == html else 1)
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        f.write(html)
    print('Mi_Barrio.html armado:', len(html.encode('utf-8')), 'bytes')
