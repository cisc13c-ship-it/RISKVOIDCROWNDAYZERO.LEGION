#!/usr/bin/env python3
"""Composite DÍA CERO lockups onto the game's own 16:9 key art."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path("/workspace/.grok")
BG = ROOT / "card-bg.jpg"
FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Bold.ttf"
TAG_FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Regular.ttf"

NEAR_BLACK = (8, 9, 12)
OFF_WHITE = (232, 230, 225)
STEEL = (154, 163, 173)
EMBER = (181, 74, 60)


def tracked_width(font: ImageFont.FreeTypeFont, text: str, tracking: float) -> float:
    if not text:
        return 0.0
    return sum(font.getlength(c) for c in text) + tracking * (len(text) - 1)


def draw_tracked(
    base: Image.Image,
    text: str,
    center: tuple[float, float],
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: float,
    shadow: bool = True,
) -> None:
    """Draw tracked caps with a soft near-black halo so lettering holds over fire."""
    w = tracked_width(font, text, tracking)
    x0 = center[0] - w / 2
    y = center[1]
    # halo on a separate layer, then composite
    halo = Image.new("RGBA", base.size, (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    glyphs: list[tuple[str, float]] = []
    x = x0
    for i, ch in enumerate(text):
        glyphs.append((ch, x))
        x += font.getlength(ch) + (tracking if i < len(text) - 1 else 0)

    if shadow:
        for ox, oy in (
            (0, 0),
            (2, 2),
            (-2, 2),
            (2, -2),
            (-2, -2),
            (4, 4),
            (-4, 0),
            (4, 0),
            (0, 4),
            (0, -4),
        ):
            for ch, gx in glyphs:
                hd.text((gx + ox, y + oy), ch, font=font, fill=(*NEAR_BLACK, 180), anchor="lm")
        halo = halo.filter(ImageFilter.GaussianBlur(radius=6))
        base.alpha_composite(halo)

    ink = Image.new("RGBA", base.size, (0, 0, 0, 0))
    idr = ImageDraw.Draw(ink)
    for ch, gx in glyphs:
        idr.text((gx, y), ch, font=font, fill=(*fill, 255), anchor="lm")
    base.alpha_composite(ink)


def vignette(im: Image.Image, strength: float = 0.42, inner: float = 0.28) -> Image.Image:
    arr = np.asarray(im).astype(np.float32)
    h, w = arr.shape[:2]
    yy, xx = np.ogrid[:h, :w]
    nx = (xx - w / 2) / (w * 0.55)
    ny = (yy - h / 2) / (h * 0.55)
    r = np.sqrt(nx * nx + ny * ny)
    v = np.clip((r - inner) / (1.35 - inner), 0, 1)
    # extra center dim so the lockup reads
    cx = np.exp(-((nx * 1.15) ** 2 + (ny * 1.4) ** 2) / 0.55)
    shade = 1.0 - strength * v - 0.22 * cx
    arr *= shade[..., None]
    # lift ember in the sky a hair so the scene stays warm at the edges
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def compose_og() -> Image.Image:
    bg = Image.open(BG).convert("RGB")
    bg = vignette(bg, strength=0.5, inner=0.2)
    canvas = bg.convert("RGBA")
    w, h = canvas.size
    font = ImageFont.truetype(FONT_PATH, 340)
    tag_font = ImageFont.truetype(TAG_FONT_PATH, 34)
    tracking = 340 * 0.10
    # stacked lockup, vertically centered as a block
    block_gap = 28
    dia_h = 340
    cero_h = 340
    tag_h = 34
    rule_h = 3
    total = dia_h + block_gap + rule_h + block_gap + cero_h + 22 + tag_h
    top = h / 2 - total / 2
    dia_cy = top + dia_h * 0.52
    rule_y = top + dia_h + block_gap
    cero_cy = rule_y + rule_h + block_gap + cero_h * 0.48
    tag_cy = cero_cy + cero_h * 0.52 + 28 + tag_h * 0.35

    draw_tracked(canvas, "DÍA", (w / 2, dia_cy), font, OFF_WHITE, tracking)
    draw = ImageDraw.Draw(canvas)
    rule_w = tracked_width(font, "CERO", tracking) * 0.38
    draw.rectangle(
        [w / 2 - rule_w / 2, rule_y, w / 2 + rule_w / 2, rule_y + rule_h],
        fill=(*EMBER, 230),
    )
    draw_tracked(canvas, "CERO", (w / 2, cero_cy), font, OFF_WHITE, tracking)
    tag_tracking = 34 * 0.42
    draw_tracked(canvas, "EL PRIMER DÍA", (w / 2, tag_cy), tag_font, STEEL, tag_tracking, shadow=True)
    return canvas.convert("RGB")


def compose_banner() -> Image.Image:
    bg = Image.open(BG).convert("RGB")
    w, h = bg.size
    # 50:11 strip from the upper-middle (fire / sky / rooftops)
    strip_h = int(round(w * 11 / 50))
    top = max(0, int(h * 0.10))
    if top + strip_h > h:
        top = h - strip_h
    strip = bg.crop((0, top, w, top + strip_h))
    # left-weighted vignette: keep scenery on the right, dim left for type
    arr = np.asarray(strip).astype(np.float32)
    sh, sw = arr.shape[:2]
    yy, xx = np.ogrid[:sh, :sw]
    nx = xx / sw
    ny = yy / sh
    left_dim = 0.38 * np.clip(1.0 - nx / 0.55, 0, 1)
    bottom_dim = 0.18 * np.clip((ny - 0.55) / 0.45, 0, 1)
    edge = 0.28 * np.clip((ny - 0.82) / 0.18, 0, 1)
    arr *= (1.0 - left_dim - bottom_dim - edge)[..., None]
    strip = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    font = ImageFont.truetype(FONT_PATH, 118)
    tag_font = ImageFont.truetype(TAG_FONT_PATH, 22)
    tracking = 118 * 0.10
    # lockup in the LEFT HALF, ABOVE the midline, comfortable top/left margins
    left_cx = sw * 0.26
    dia_cy = sh * 0.24
    cero_cy = sh * 0.48
    draw_tracked(strip, "DÍA", (left_cx, dia_cy), font, OFF_WHITE, tracking)
    draw = ImageDraw.Draw(strip)
    rule_w = tracked_width(font, "CERO", tracking) * 0.42
    rule_y = sh * 0.35
    draw.rectangle(
        [left_cx - rule_w / 2, rule_y, left_cx + rule_w / 2, rule_y + 2],
        fill=(*EMBER, 230),
    )
    draw_tracked(strip, "CERO", (left_cx, cero_cy), font, OFF_WHITE, tracking)
    return strip.convert("RGB")


def main() -> None:
    og = compose_og()
    og.save(ROOT / "og-raw.png")
    banner = compose_banner()
    banner.save(ROOT / "banner-raw.png")
    print("og-raw", og.size)
    print("banner-raw", banner.size)
    print("dia width ratio", tracked_width(ImageFont.truetype(FONT_PATH, 268), "CERO", 268 * 0.12) / og.size[0])


if __name__ == "__main__":
    main()
