"""Zeichnet die PNG-Icons der Hourbridge (wie favicon.svg) mit 4-fachem Überabtasten."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

ZIEL = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent

def icon(groesse, maskable=False):
    s = groesse * 4
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    k = s / 64
    if maskable:
        d.rectangle([0, 0, s, s], fill='#131E28')
        k2, off = k * 0.72, s * 0.14   # Inhalt in die sichere Zone (80 %) schieben
    else:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=16 * k, fill='#131E28')
        k2, off = k, 0
    P = lambda v: off + v * k2
    box = [P(12), P(12), P(52), P(52)]
    d.pieslice(box, 90, 270, fill='#29405A')
    d.pieslice(box, 270, 90, fill='#0F1A2B')
    d.ellipse(box, outline='#B699C1', width=round(3 * k2))
    w = round(3.2 * k2)
    d.line([P(32), P(20), P(32), P(32)], fill='#D8D1E2', width=w)
    d.line([P(32), P(32), P(40), P(37)], fill='#D8D1E2', width=w)
    for x, y in ((32, 20), (40, 37)):
        r = w / 2
        d.ellipse([P(x) - r, P(y) - r, P(x) + r, P(y) + r], fill='#D8D1E2')
    r = 2.6 * k2
    d.ellipse([P(32) - r, P(32) - r, P(32) + r, P(32) + r], fill='#D8D1E2')
    return img.resize((groesse, groesse), Image.LANCZOS)

icon(192).save(ZIEL / 'icon-192.png')
icon(512).save(ZIEL / 'icon-512.png')
icon(512, True).save(ZIEL / 'icon-maskable.png')
print('ok')
