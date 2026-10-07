"""Apply Upeo's golden-hour film grade to a folder of photos.

usage:  python scripts/grade.py <input-folder> <output-folder>
needs:  pip install Pillow

Warm highlights, umber shadows, greens pulled toward dry grass, gentle fade,
and a deep but not crushed black. Caps width at 2000px.
"""
import colorsys
import os
import sys

from PIL import Image, ImageEnhance

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)


def lut(lo, hi, sh, hl):
    out = []
    for i in range(256):
        t = i / 255.0
        s = t * t * (3 - 2 * t)
        t = 0.45 * s + 0.55 * t
        v = lo + t * (hi - lo) + sh * (1 - t) ** 2 + hl * t ** 2
        out.append(max(0, min(255, int(round(v)))))
    return out


R = lut(12, 248, 4, 8)
G = lut(10, 238, 1, 0)
B = lut(8, 214, -2, -14)


def grade(img):
    # pull greens toward straw: shift hue of green pixels a little toward yellow, reduce their saturation
    img = img.convert("HSV")
    h, s, v = img.split()
    h = h.point(lambda x: x - 10 if 50 <= x <= 120 else x)
    s = s.point(lambda x: int(x * 0.82))
    img = Image.merge("HSV", (h, s, v)).convert("RGB")
    img = ImageEnhance.Contrast(img).enhance(1.04)
    r, g, b = img.split()
    return Image.merge("RGB", (r.point(R), g.point(G), b.point(B)))


for f in sorted(os.listdir(src)):
    if not f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        continue
    im = Image.open(os.path.join(src, f)).convert("RGB")
    if im.width > 2000:
        im = im.resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS)
    out = os.path.splitext(f)[0] + ".jpg"
    grade(im).save(os.path.join(dst, out), "JPEG", quality=80, optimize=True, progressive=True)
