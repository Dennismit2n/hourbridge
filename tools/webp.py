"""Macht aus docs/screens-*.png WebP-Dateien (Qualität 86) und löscht die PNG."""
from pathlib import Path
from PIL import Image

docs = Path(__file__).resolve().parent.parent / 'docs'
for png in sorted(docs.glob('screens-*.png')):
    ziel = png.with_suffix('.webp')
    Image.open(png).save(ziel, 'WEBP', quality=86, method=6)
    png.unlink()
    print(ziel.name, ziel.stat().st_size // 1024, 'KB')
