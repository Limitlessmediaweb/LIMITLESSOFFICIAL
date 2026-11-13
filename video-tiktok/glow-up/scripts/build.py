"""
Montaggio del video "glow up" LIMITLESS: compone ogni fotogramma (PIL/numpy) e lo passa a ffmpeg.

Uso:  python video-tiktok/glow-up/scripts/build.py
Prima: record.mjs (clip/) e overlays.mjs (overlays/, frames/finale/).

Griglia a 120 BPM: ogni taglio cade su un multiplo di 0,5 s (15 fotogrammi a 30 fps).
  0,0-1,5  vecchio sito (desaturato) in un telefono + "Il nostro vecchio sito…"
  1,5-2,0  whip pan del vecchio sito verso sinistra (sfocatura di movimento)
  2,0      flash bianco di 2 fotogrammi, poi intro del nuovo sito + "…e quello nuovo."
  6,0-11,0 dieci tagli da 0,5 s tra i 5 lavori nel telefono (intro, poi hero) con nome e settore
  11,0-12,0 i 5 telefoni insieme
  12,0-14,5 laptop + telefono sulla sezione Servizi + "Siti da 500 € · Spot da 99 €"
  14,5-17,0 finale: wordmark, consulenza gratuita, limitlessmedia.it · scrivici in DM
"""
import json
import shutil
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
CLIPS, OV, BUILD = ROOT / "clips", ROOT / "overlays", ROOT / "build"
CACHE = ROOT / "frames" / "src"
L = json.loads((ROOT / "scripts" / "layout.json").read_text(encoding="utf8"))
FPS, W, H = 30, 1080, 1920
BG_DARK = (10, 10, 10)

# Momenti scelti dalle registrazioni (secondi nella clip): prima l'intro/animazione, poi l'hero
PASS1 = {"nottea": 3.65, "ordito": 2.95, "osteria": 0.95, "volta": 3.50, "flusso": 4.15}
PASS2 = {"nottea": 9.40, "ordito": 4.80, "osteria": 5.00, "volta": 5.00, "flusso": 4.75}
ORDER = [s["id"] for s in L["sites"]]


def extract(name):
    """Estrae (una volta) i fotogrammi di una clip in JPEG di alta qualità."""
    d = CACHE / name
    if not d.exists() or not any(d.iterdir()):
        d.mkdir(parents=True, exist_ok=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(CLIPS / f"{name}.mp4"), "-q:v", "1", "-qmin", "1", str(d / "%05d.jpg")], check=True)
    return sorted(d.glob("*.jpg"))


_frames = {}


def src(name, t):
    """Fotogramma della clip `name` all'istante t (s)."""
    if name not in _frames:
        _frames[name] = extract(name)
    fr = _frames[name]
    i = min(len(fr) - 1, max(0, round(t * FPS)))
    return Image.open(fr[i]).convert("RGB")


_ov = {}


def ov(name):
    if name not in _ov:
        _ov[name] = Image.open(OV / f"{name}.png").convert("RGBA")
    return _ov[name]


def ease3(p):
    return 1 - (1 - p) ** 3


def text_in(frame, layer, t, start, dur=0.25, rise=14):
    """Testo che entra con dissolvenza e leggera salita (niente rimbalzi)."""
    if t < start:
        return
    p = ease3(min(1, (t - start) / dur))
    im = ov(layer)
    if p < 1:
        a = np.array(im)
        a[..., 3] = (a[..., 3] * p).astype(np.uint8)
        im = Image.fromarray(a)
    frame.alpha_composite(im, (0, round((1 - p) * rise)))


def screen(frame, img, r, b):
    """Mette un video nello schermo del dispositivo r (con bordo b)."""
    w, h = r["w"] - 2 * b, r["h"] - 2 * b
    frame.paste(img.resize((w, h), Image.LANCZOS), (r["x"] + b, r["y"] + b))


def old_look(img):
    """Vecchio sito "spento": meno saturazione, un filo più scuro e piatto."""
    img = ImageEnhance.Color(img).enhance(0.35)
    img = ImageEnhance.Contrast(img).enhance(0.9)
    return ImageEnhance.Brightness(img).enhance(0.85)


def motion_blur_shift(rgb, dx, blur):
    """Sposta l'immagine di dx px (verso sinistra se negativo) con sfocatura orizzontale di `blur` px."""
    a = np.asarray(rgb).astype(np.float32)
    out = np.empty_like(a)
    out[:] = BG_DARK
    dx = max(-W, min(W, int(round(dx))))
    if abs(dx) == W:
        pass
    elif dx < 0:
        out[:, : W + dx] = a[:, -dx:]
    else:
        out[:, dx:] = a[:, : W - dx]
    k = int(blur)
    if k > 1:
        pad = np.pad(out, ((0, 0), (k, k), (0, 0)), mode="edge")
        c = np.cumsum(pad, axis=1)
        c = np.concatenate([np.zeros_like(c[:, :1]), c], axis=1)
        out = (c[:, 2 * k + 1 :][:, :W] - c[:, : W]) / (2 * k + 1)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def flash(frame, amount):
    white = Image.new("RGBA", (W, H), (255, 255, 255, int(255 * amount)))
    frame.alpha_composite(white)


def new_intro_time(k):
    """Rimappa l'intro del nuovo sito in 4 s: disegno della cornice a 1x, fotogrammi a 1,5x, apertura e hero a 1x."""
    if k < 30:
        return 0.34 + k / FPS  # prima di 0,33 s c'è ancora la pagina prima del ricaricamento
    if k < 66:
        return 1.34 + (k - 30) * 1.5 / FPS
    return 3.14 + (k - 66) / FPS


def frame_at(n):
    t = n / FPS
    f = Image.new("RGBA", (W, H), BG_DARK + (255,))
    if n < 60:  # vecchio sito + whip pan
        # il vecchio sito dentro un telefono; il nuovo poi riempie tutto lo schermo
        f.alpha_composite(ov("bg-lavori"))
        screen(f, old_look(src("old-mobile", t)), L["phone"], L["phoneB"])
        f.alpha_composite(ov("fg-lavori"))
        f.alpha_composite(ov("t-hook"))
        if n >= 45:
            p = (n - 44) / 15
            pos = lambda q: -W * q**3  # esce del tutto proprio sull'ultimo fotogramma prima del flash
            v = abs(pos(p) - pos(p - 1 / 15))
            f = motion_blur_shift(f.convert("RGB"), pos(p), v * 0.45).convert("RGBA")
    elif n < 180:  # nuovo sito: cornice, apertura, hero con showreel
        k = n - 60
        f.paste(src("new-intro", new_intro_time(k)))
        f.alpha_composite(ov("scrim-top"))
        text_in(f, "t-new", t, 2.2)
        if k < 2:
            flash(f, [1.0, 0.5][k])
    elif n < 330:  # tagli a tempo tra i lavori
        slot = (n - 180) // 15
        site = ORDER[slot % 5]
        start = (PASS1 if slot < 5 else PASS2)[site]
        f.alpha_composite(ov("bg-lavori"))
        screen(f, src(site, start + ((n - 180) % 15) / FPS), L["phone"], L["phoneB"])
        f.alpha_composite(ov("fg-lavori"))
        f.alpha_composite(ov(f"lab-{site}"))
        f.alpha_composite(ov("t-lavori"))
    elif n < 360:  # tutti e 5 insieme
        k = n - 330
        f.alpha_composite(ov("bg-grid"))
        for site, r in zip(ORDER, L["grid"]):
            screen(f, src(site, PASS2[site] + 0.5 + k / FPS), r, L["gridB"])
        f.alpha_composite(ov("fg-grid"))
        f.alpha_composite(ov("t-lavori"))
    elif n < 435:  # servizi e prezzi: laptop + telefono
        k = n - 360
        f.alpha_composite(ov("bg-split"))
        screen(f, src("new-servizi-desktop", 2.0 + k / FPS), L["laptop"], L["laptopB"])
        f.alpha_composite(ov("fg-split-laptop"))
        screen(f, src("new-servizi-mobile", 1.1 + k / FPS), L["small"], L["smallB"])
        f.alpha_composite(ov("fg-split-phone"))
        text_in(f, "t-prezzi", t, 12.0, dur=0.2)
    else:  # finale
        k = n - 435
        f = Image.open(ROOT / "frames" / "finale" / f"{k:05d}.png").convert("RGBA")
    f.alpha_composite(ov("wm"))
    return f.convert("RGB")


TOTAL = 510  # 17,0 s


def main():
    BUILD.mkdir(exist_ok=True)
    out = ROOT / "limitless-glow-up-tiktok.mp4"
    cmd = [
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-map", "0:v", "-map", "1:a", "-shortest",
        "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", str(out),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for n in range(TOTAL):
        im = frame_at(n)
        proc.stdin.write(im.tobytes())
        if n in (52, 61, 200, 345, 400, 500):  # fotogrammi di controllo
            im.save(BUILD / f"check-{n:03d}.jpg", quality=90)
        if n % 60 == 0:
            print(f"  {n}/{TOTAL}", flush=True)
    proc.stdin.close()
    proc.wait()
    print(f"OK {out}")

    # copertina: il fotogramma più bello (wordmark sulla bottiglia NÒTTEA nell'intro) + "Prima → Dopo"
    # fotogramma ritagliato sotto l'intestazione del sito e abbassato: in alto resta il nero per il titolo
    cov = Image.new("RGBA", (W, H), BG_DARK + (255,))
    shot = src("new-intro", 4.1).crop((0, 440, W, H)).convert("RGBA")
    a = np.array(shot)
    fade = np.clip(np.arange(shot.height) / 220, 0, 1)[:, None]  # sfumatura in alto
    a[..., 3] = (a[..., 3] * fade).astype(np.uint8)
    cov.alpha_composite(Image.fromarray(a), (0, 620))
    cov.alpha_composite(ov("cover-text"))
    cov.convert("RGB").save(ROOT / "cover.jpg", quality=93)
    print("OK cover.jpg")


if __name__ == "__main__":
    shutil.rmtree(CACHE, ignore_errors=True)
    main()
