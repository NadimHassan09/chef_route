"""Convert site images to optimized WebP."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# path relative to ROOT -> max width (None = no resize)
IMAGES = {
    "img.jpg": 1400,
    "assets/images/interior/hero.jpeg": 1920,
    "assets/images/interior/1.jpeg": 1600,
    "assets/images/interior/2.jpeg": 1600,
    "assets/images/interior/3.jpeg": 1600,
    "assets/images/interior/4.png": 1600,
    "assets/images/interior/5.png": 1600,
    "assets/images/interior/6.jpeg": 1600,
    "assets/images/interior/11.jpeg": 1400,
    "assets/images/menu/1.png": 900,
    "assets/images/menu/2.png": 900,
    "assets/images/menu/3.png": 900,
    "assets/images/menu/4.png": 900,
    "assets/images/menu/5.png": 900,
    "assets/images/menu/6.png": 900,
}

QUALITY = 82


def optimize(src_rel: str, max_width: int | None) -> None:
    src = ROOT / src_rel.replace("/", "\\") if "\\" not in src_rel else ROOT / src_rel
    if not src.exists():
        # try forward slashes on all platforms
        src = ROOT / Path(src_rel)
    if not src.exists():
        print(f"SKIP (missing): {src_rel}")
        return

    dest = src.with_suffix(".webp")
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    elif img.mode != "RGB":
        img = img.convert("RGB")

    w, h = img.size
    if max_width and w > max_width:
        ratio = max_width / w
        img = img.resize((max_width, int(h * ratio)), Image.Resampling.LANCZOS)

    save_kw = {"format": "WEBP", "quality": QUALITY, "method": 6}
    if img.mode == "RGBA":
        save_kw["lossless"] = False
        img.save(dest, **save_kw)
    else:
        img.save(dest, **save_kw)

    old_kb = src.stat().st_size / 1024
    new_kb = dest.stat().st_size / 1024
    print(f"{src_rel} -> {dest.name}: {old_kb:.0f} KB -> {new_kb:.0f} KB")


def main() -> None:
    for rel, max_w in IMAGES.items():
        optimize(rel, max_w)


if __name__ == "__main__":
    main()
