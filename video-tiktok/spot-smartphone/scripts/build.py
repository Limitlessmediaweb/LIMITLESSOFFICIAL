"""
Montaggio dello spot ÈTERE One (concept LIMITLESS): compone ogni fotogramma con numpy/OpenCV
e lo passa a ffmpeg. Tutto il montaggio è descritto in config.json (takes + versioni + testi).

Uso:
  python scripts/build.py                 # tutte le versioni
  python scripts/build.py social ads916   # solo alcune
  python scripts/build.py social --render-only   # prepara stock + render 3D senza montare

Passi per versione:
  1. stock: estrae i fotogrammi delle clip a 30 fps, ritagliati al formato (cover)
  2. 3D: calcola i fotogrammi necessari di ogni take e li renderizza (scripts/render3d.mjs)
  3. montaggio sul beat: ogni pezzo dura 1 beat, 2 beat o mezzo beat (100 BPM = 0,6 s)
  4. look: compositing (light wrap, grana uguale), grade unico, bloom, vignetta, grana
  5. testi (overlays/<formato>/*.png) con dissolvenza e leggera salita
  6. export H.264 High yuv420p 30 fps CRF 18 + traccia AAC muta + faststart, copertina, contact sheet
"""
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "config.json").read_text(encoding="utf8"))
FPS = CFG["fps"]
BEAT = 60 / CFG["bpm"]
FPB = round(BEAT * FPS)  # fotogrammi per beat (18)
FMT = CFG["formats"]


# ---------------------------------------------------------------- utilità
def ease3(p):
    p = min(1.0, max(0.0, p))
    return 1 - (1 - p) ** 3


def ease_in(p):
    p = min(1.0, max(0.0, p))
    return p * p * p


def run(cmd, **kw):
    print("  $", " ".join(str(c) for c in cmd)[:180])
    subprocess.run(cmd, check=True, **kw)


# ---------------------------------------------------------------- stock
def stock_dir(fmt, clip):
    return ROOT / "stock" / "frames" / fmt / clip


def prep_stock(fmt, clip):
    d = stock_dir(fmt, clip)
    if d.exists() and any(d.iterdir()):
        return d
    d.mkdir(parents=True, exist_ok=True)
    w, h = FMT[fmt]["w"], FMT[fmt]["h"]
    src = ROOT / "stock" / f"{clip}.mp4"
    vf = f"fps={FPS},scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},setsar=1"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", vf, "-q:v", "2", str(d / "%04d.jpg")])
    return d


_img_cache = {}


def load_rgb(path):
    key = str(path)
    if key in _img_cache:
        return _img_cache[key]
    im = cv2.imread(key, cv2.IMREAD_COLOR)
    if im is None:
        raise FileNotFoundError(key)
    im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    if len(_img_cache) > 64:
        _img_cache.pop(next(iter(_img_cache)))
    _img_cache[key] = im
    return im


def stock_frame(fmt, clip, t):
    key = (fmt, clip)
    if key not in _nframes:
        _nframes[key] = len(list(stock_dir(fmt, clip).glob("*.jpg")))
    i = max(0, min(_nframes[key] - 1, int(round(t * FPS))))
    return load_rgb(stock_dir(fmt, clip) / f"{i + 1:04d}.jpg")


_nframes = {}


# ---------------------------------------------------------------- 3D
def take_dir(fmt, take):
    return ROOT / "render" / "3d" / fmt / take


def render_jobs(fmt, needs):
    """needs: {take: set(frame index)} -> renderizza i fotogrammi mancanti."""
    w, h = FMT[fmt]["w"], FMT[fmt]["h"]
    items = []
    for take, frames in needs.items():
        T = CFG["takes"][take]
        frames = sorted(f for f in frames if not (take_dir(fmt, take) / f"{f:04d}.png").exists())
        if not frames:
            continue
        # intervalli contigui
        runs, s = [], frames[0]
        for a, b in zip(frames, frames[1:] + [None]):
            if b != a + 1:
                runs.append((s, a + 1))
                s = b
        for a, b in runs:
            it = {"shot": T["shot"], "dur": T["dur"], "fps": FPS, "frames": [a, b], "out": f"render/3d/{fmt}/{take}",
                  "opts": T.get("opts", {}), "samples": T.get("samples", CFG.get("samples", 16))}
            if "bg" in T:
                prep_stock(fmt, T["bg"]["clip"])
                it["bg"] = f"stock/frames/{fmt}/{T['bg']['clip']}/%04d.jpg"
                it["bgOffset"] = int(round(T["bg"].get("start", 0) * FPS))
            items.append(it)
    if not items:
        return
    job = ROOT / "render" / f"jobs_{fmt}.json"
    job.write_text(json.dumps({"width": w, "height": h, "items": items}, indent=1), encoding="utf8")
    run(["node", str(ROOT / "scripts" / "render3d.mjs"), str(job)], cwd=ROOT)


def take_frame(fmt, take, i):
    """RGBA float del take (premoltiplicato -> separiamo colore e alfa)."""
    p = take_dir(fmt, take) / f"{i:04d}.png"
    im = cv2.imread(str(p), cv2.IMREAD_UNCHANGED)
    if im is None:
        raise FileNotFoundError(p)
    rgb = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    a = im[..., 3:4].astype(np.float32) / 255.0 if im.shape[2] == 4 else np.ones(rgb.shape[:2] + (1,), np.float32)
    return rgb, a


# ---------------------------------------------------------------- look
def match_plate(bg, grade):
    """Grade di base della clip reale (prima del grade globale): esposizione e saturazione."""
    out = bg * grade.get("gain", 1.0)
    sat = grade.get("sat", 1.0)
    if sat != 1.0:
        l = out.mean(axis=2, keepdims=True)
        out = l + (out - l) * sat
    return np.clip(out, 0, 1)


def composite(bg, rgb, a, wrap=0.35):
    """Telefono sopra la clip: light wrap (la luce della scena avvolge i bordi) + bordo morbido."""
    a = cv2.GaussianBlur(a, (0, 0), 0.6)[..., None] if a.ndim == 3 else a
    blur_bg = cv2.GaussianBlur(bg, (0, 0), 18)
    edge = np.clip(cv2.GaussianBlur(1 - a[..., 0], (0, 0), 6), 0, 1)[..., None] * a
    # il PNG è già "su trasparente": colore non premoltiplicato da canvas -> fondiamo normalmente
    fg = rgb + blur_bg * edge * wrap
    return bg * (1 - a) + fg * a


def global_grade(img, g):
    """Grade unico: neri profondi, contrasto morbido, ombre fredde / luci rame, saturazione contenuta."""
    x = np.clip((img - g["black"]) / (1 - g["black"]), 0, 1)
    # curva S
    c = g["contrast"]
    x = x + c * x * (1 - x) * (2 * x - 1)  # curva S morbida (c>0 = più contrasto)
    x = np.clip(x, 0, 1)
    l = x.mean(axis=2, keepdims=True)
    sh = (1 - l) ** 2
    hi = l ** 2
    x = x + sh * np.array(g["shadow_tint"], np.float32) + hi * np.array(g["high_tint"], np.float32)
    l = x.mean(axis=2, keepdims=True)
    x = l + (x - l) * g["sat"]
    return np.clip(x, 0, 1)


def bloom(img, k=0.22, thr=0.72):
    h, w = img.shape[:2]
    small = cv2.resize(img, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    br = np.clip(small - thr, 0, None) / (1 - thr)
    b = cv2.GaussianBlur(br, (0, 0), 6) * 0.6 + cv2.GaussianBlur(br, (0, 0), 18) * 0.4
    b = cv2.resize(b, (w, h), interpolation=cv2.INTER_LINEAR)
    return img + b * k


_vig = {}


def vignette(img, s=0.28):
    h, w = img.shape[:2]
    if (w, h) not in _vig:
        y, x = np.mgrid[0:h, 0:w].astype(np.float32)
        r = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
        _vig[(w, h)] = (1 - s * np.clip(r - 0.25, 0, 1) ** 1.6 / 0.75 ** 1.6)[..., None].astype(np.float32)
    return img * _vig[(w, h)]


_rng = np.random.default_rng(7)


def grain(img, amt=0.022):
    h, w = img.shape[:2]
    n = _rng.standard_normal((h // 2, w // 2)).astype(np.float32)
    n = cv2.resize(n, (w, h), interpolation=cv2.INTER_LINEAR)[..., None]
    l = img.mean(axis=2, keepdims=True)
    return img + n * amt * (0.4 + 0.6 * (1 - np.abs(l - 0.45) * 1.6).clip(0.2, 1))


def zoom(img, s, blur_taps=0, blur_span=0.0):
    """Zoom centrale con motion blur radiale (media di più scale)."""
    h, w = img.shape[:2]

    def sc(z):
        M = np.float32([[z, 0, (1 - z) * w / 2], [0, z, (1 - z) * h / 2]])
        return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

    if blur_taps <= 1:
        return sc(s)
    acc = np.zeros_like(img)
    for k in range(blur_taps):
        acc += sc(s * (1 + blur_span * k / (blur_taps - 1)))
    return acc / blur_taps


# ---------------------------------------------------------------- testi
_ov = {}


def overlay(fmt, name):
    key = (fmt, name)
    if key not in _ov:
        im = cv2.imread(str(ROOT / "overlays" / fmt / f"{name}.png"), cv2.IMREAD_UNCHANGED)
        rgb = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        a = im[..., 3:4].astype(np.float32) / 255.0
        _ov[key] = (rgb, a)
    return _ov[key]


def put_text(img, fmt, name, t, t0, t1, fade_in=0.22, fade_out=0.15, rise=16, fixed=False):
    if t < t0 or t >= t1:
        return img
    rgb, a = overlay(fmt, name)
    p = 1.0 if fixed else ease3((t - t0) / fade_in)
    q = 1.0 if t1 - t > fade_out else max(0.0, (t1 - t) / fade_out)
    alpha = p * q
    dy = int(round((1 - p) * rise))
    if dy:
        rgb = np.roll(rgb, dy, axis=0)
        a = np.roll(a, dy, axis=0)
    return img * (1 - a * alpha) + rgb * a * alpha


# ---------------------------------------------------------------- montaggio
def segments(ver):
    """Espande la lista dei tagli (in beat) in segmenti in fotogrammi."""
    out = []
    for s in ver["cuts"]:
        f0 = round(s["b"] * FPB)
        f1 = round((s["b"] + s["n"]) * FPB)
        out.append({**s, "f0": f0, "f1": f1})
    out.sort(key=lambda s: s["f0"])
    return out


def source_frame(fmt, seg, local_t, need=None):
    """Fotogramma del pezzo all'istante local_t (s dentro il pezzo). need: raccoglie i fotogrammi 3D."""
    src = seg["src"]
    t_in = seg.get("in", 0.0) + local_t * seg.get("speed", 1.0)
    if src.startswith("stock:"):
        clip = src[6:]
        if need is not None:
            prep_stock(fmt, clip)
            return None
        bg = stock_frame(fmt, clip, seg.get("in", 0.0) + local_t * seg.get("speed", 1.0))
        return match_plate(bg, CFG["plates"].get(clip, {}))
    take = CFG["takes"][src]
    i = int(round(t_in * FPS))
    i = max(0, min(int(round(take["dur"] * FPS)) - 1, i))
    if need is not None:
        need.setdefault(src, set()).add(i)
        return None
    rgb, a = take_frame(fmt, src, i)
    if "bg" in take:
        clip = take["bg"]["clip"]
        bg = stock_frame(fmt, clip, take["bg"].get("start", 0) + i / FPS)
        bg = match_plate(bg, CFG["plates"].get(clip, {}))
        return composite(bg, rgb, a, take.get("wrap", 0.35))
    return rgb * a  # sfondo nero


def frame_at(fmt, segs, f, need=None):
    seg = next(s for s in segs if s["f0"] <= f < s["f1"])
    lt = (f - seg["f0"]) / FPS
    img = source_frame(fmt, seg, lt, need)
    fx_out = seg.get("out")
    fx_in = seg.get("fxin")
    if need is not None:
        return None
    # zoom-through in uscita: ultimi 0,3 s accelerati con motion blur
    if fx_out == "zoom":
        rem = (seg["f1"] - f) / FPS
        if rem <= 0.3:
            p = ease_in(1 - rem / 0.3)
            img = zoom(img, 1 + 0.9 * p, blur_taps=6, blur_span=0.25 * p)
    # la clip successiva si pulisce in 0,2 s
    if fx_in == "zoom":
        if lt < 0.2:
            p = ease3(lt / 0.2)
            img = zoom(img, 1.25 - 0.25 * p, blur_taps=6, blur_span=0.18 * (1 - p))
    if seg.get("push"):
        # leggera spinta di camera "gimbal" su clip stock
        dur = (seg["f1"] - seg["f0"]) / FPS
        img = zoom(img, 1 + seg["push"] * lt / dur)
    return img


def build(name):
    ver = CFG["versions"][name]
    fmt = ver["format"]
    w, h = FMT[fmt]["w"], FMT[fmt]["h"]
    segs = segments(ver)
    total = round(ver["beats"] * FPB)
    print(f"\n== {name}: {w}x{h}, {ver['beats']} beat = {total / FPS:.1f} s, {len(segs)} tagli")

    # 1-2. stock + 3D necessari (fotogrammi di uscita + qualche margine per i transiti)
    need = {}
    for f in range(total):
        frame_at(fmt, segs, f, need)
    render_jobs(fmt, need)
    if "--render-only" in sys.argv:
        return

    out_dir = ROOT / "out"
    out_dir.mkdir(exist_ok=True)
    mp4 = out_dir / f"etere-one-{name}.mp4"
    enc = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(FPS), "-i", "-",
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-map", "0:v", "-map", "1:a", "-shortest",
        "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
        "-r", str(FPS), "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(mp4),
    ], stdin=subprocess.PIPE)

    g = CFG["grade"]
    fade = ver.get("fade_out", 0.0)
    sheet = []
    for f in range(total):
        t = f / FPS
        img = frame_at(fmt, segs, f)
        img = global_grade(img, g)
        img = bloom(img, g["bloom"])
        img = vignette(img, g["vignette"])
        img = grain(img, g["grain"])
        # testi
        for tx in ver["texts"]:
            img = put_text(img, fmt, tx["id"], t, tx["from"] * BEAT, tx["to"] * BEAT, fixed=tx.get("fixed", False))
        # chiusura in loop: torna al buio del primo fotogramma
        if fade and t > total / FPS - fade:
            img = img * (1 - ease3((t - (total / FPS - fade)) / fade))
        if ver.get("fade_in") and t < ver["fade_in"]:
            img = img * ease3(t / ver["fade_in"])
        out8 = (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)
        enc.stdin.write(out8.tobytes())
        if f % FPB == FPB // 2:
            sheet.append(out8)
        if f == round(ver.get("cover_at", 0) * FPS):
            cover = out8.copy()
        if f % 90 == 0:
            print(f"  {f}/{total}", flush=True)
    enc.stdin.close()
    enc.wait()

    # copertina (con la frase più forte) + contact sheet (un fotogramma per beat)
    cov = cover.astype(np.float32) / 255
    if ver.get("cover_text"):
        rgb, a = overlay(fmt, ver["cover_text"])
        cov = cov * (1 - a) + rgb * a
    cv2.imwrite(str(out_dir / f"etere-one-{name}-cover.jpg"), cv2.cvtColor((cov * 255).astype(np.uint8), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 92])
    cols = 10 if w < h else 6
    tw = 216 if w < h else 320
    th = round(tw * h / w)
    rows = (len(sheet) + cols - 1) // cols
    cs = np.full((rows * (th + 26), cols * (tw + 4), 3), 24, np.uint8)
    for k, im in enumerate(sheet):
        r, c = divmod(k, cols)
        y, x = r * (th + 26) + 22, c * (tw + 4)
        cs[y:y + th, x:x + tw] = cv2.resize(im, (tw, th), interpolation=cv2.INTER_AREA)
        cv2.putText(cs, f"b{k} {k * BEAT + BEAT / 2:.1f}s", (x + 4, y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (230, 230, 230), 1, cv2.LINE_AA)
    cv2.imwrite(str(out_dir / f"etere-one-{name}-contact.jpg"), cv2.cvtColor(cs, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 88])
    print("  ->", mp4)


if __name__ == "__main__":
    names = [a for a in sys.argv[1:] if not a.startswith("--")] or list(CFG["versions"])
    for n in names:
        build(n)
