# Monta la demo verticale 1080x1920 per la pagina /impianti dalle registrazioni di registra.mjs.
# Una scena per schermo (ufficio, telefono del tecnico, monitor), con una didascalia breve in alto.
# Video MUTO: niente voce, niente effetti sonori.
# Uso: python scripts/media/planning-impianti/monta.py   -> public/media/impianti/planning-demo.mp4 (+ poster)
import json, os, shutil, subprocess

QUI = os.path.dirname(os.path.abspath(__file__))
L = os.path.join(QUI, "lavoro")
OUT = os.path.abspath(os.path.join(QUI, "..", "..", "..", "public", "media", "impianti"))
os.makedirs(OUT, exist_ok=True)
S = os.path.join(L, "scene"); shutil.rmtree(S, ignore_errors=True); os.makedirs(S)
t = json.load(open(os.path.join(L, "tempi.json")))
ini = t["inizio"]
shutil.copy("C:/Windows/Fonts/segoeuib.ttf", os.path.join(S, "b.ttf"))
shutil.copy("C:/Windows/Fonts/segoeui.ttf", os.path.join(S, "r.ttf"))

BG, LIME, GRIGIO = "0x0a0a0a", "0xe8ff3a", "0xa3a39c"
FPS = 30

def txt(nome, s):
    open(os.path.join(S, nome), "w", encoding="utf8", newline="").write(s)
    return nome

# ritagli per sorgente: (x, y, w, h) nel video registrato, poi scala e posizione nel 1080x1920
LAYOUT = {
    "ufficio": dict(crop=(0, 0, 860, 800), w=1080, y=420),
    "ufficio-largo": dict(crop=(0, 0, 1280, 800), w=1080, y=560),
    "telefono": dict(crop=(0, 0, 390, 844), h=1380, y=410),
    "monitor": dict(crop=(150, 0, 1620, 1080), w=1080, y=640),
}
ETICHETTA = {"ufficio": "IN UFFICIO", "telefono": "SUL TELEFONO DEL TECNICO", "monitor": "SUL MONITOR DELL'UFFICIO"}

def scena(i, src, da, a, didascalia, vel=1.0, coda=0.0, layout=None):
    """Pezzo della registrazione `src` tra i segnaposto da..a (secondi di registra.mjs), accelerato di `vel`."""
    lay = LAYOUT[layout or src]
    s0, s1 = da - ini[src], a - ini[src]
    dur = (s1 - s0) / vel + coda
    x, y, w, h = lay["crop"]
    scala = f"scale={lay['w']}:-2" if "w" in lay else f"scale=-2:{lay['h']}"
    f = [f"color=c={BG}:s=1080x1920:r={FPS}:d={dur:.3f}[bg]",
         f"[0:v]trim=start={s0:.3f}:end={s1:.3f},setpts=(PTS-STARTPTS)/{vel},fps={FPS},crop={w}:{h}:{x}:{y},{scala},"
         f"tpad=stop_mode=clone:stop_duration={coda + 0.1:.3f}[m]",
         f"[bg][m]overlay=(W-w)/2:{lay['y']}:shortest=1[v0]"]
    dt = [f"drawtext=fontfile=b.ttf:textfile={txt(f'e{i}', ETICHETTA[src])}:fontcolor={LIME}:fontsize=34:x=70:y=96",
          f"drawtext=fontfile=b.ttf:textfile={txt(f'd{i}', didascalia)}:fontcolor=white:fontsize=62:line_spacing=10:x=70:y=150",
          f"drawtext=fontfile=b.ttf:textfile={txt(f'p{i}', 'DATI DI PROVA')}:fontcolor=0x0a0a0a:box=1:boxcolor={LIME}:boxborderw=12:fontsize=28:x=w-text_w-50:y=1850"]
    f.append("[v0]" + ",".join(dt) + ",format=yuv420p[v]")
    esegui(i, ["-i", t[src]], f, dur)
    return dur

def cartello(i, titolo, sotto, dur):
    f = [f"color=c={BG}:s=1080x1920:r={FPS}:d={dur}[bg]",
         "[bg]" + ",".join([
             f"drawtext=fontfile=b.ttf:textfile={txt(f't{i}', titolo)}:fontcolor=white:fontsize=92:line_spacing=12:x=70:y=(h-text_h)/2-120",
             f"drawtext=fontfile=r.ttf:textfile={txt(f's{i}', sotto)}:fontcolor={GRIGIO}:fontsize=50:line_spacing=10:x=70:y=(h)/2+140",
             f"drawtext=fontfile=b.ttf:textfile={txt(f'l{i}', 'LIMITLESS')}:fontcolor={LIME}:fontsize=40:x=70:y=1780",
             f"drawtext=fontfile=b.ttf:textfile={txt(f'q{i}', 'DATI DI PROVA')}:fontcolor=0x0a0a0a:box=1:boxcolor={LIME}:boxborderw=12:fontsize=28:x=w-text_w-50:y=1784",
         ]) + ",format=yuv420p[v]"]
    esegui(i, [], f, dur)
    return dur

pezzi = []
def esegui(i, ingressi, f, dur):
    nome = f"s{i:02d}.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ingressi, "-filter_complex", ";".join(f), "-map", "[v]",
                    "-t", f"{dur:.3f}", "-r", str(FPS), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "medium", "-an", nome],
                   cwd=S, check=True)
    pezzi.append(nome)

tot = 0
tot += cartello(0, "Il planning\ndegli interventi", "Ufficio e tecnici\nsullo stesso schermo.", 2.6)
tot += scena(1, "ufficio", t["pronto"], t["modifica"], "Il planning del giorno,\ntecnico per tecnico", coda=0.4)
tot += scena(2, "ufficio", t["modifica"], t["arrivato"] - 0.3, "L'ufficio sposta\nun intervento", vel=1.4, layout="ufficio-largo")
tot += scena(3, "telefono", t["arrivato"] - 0.2, t["letto"] + 1.2, "Arriva subito\nsul telefono del tecnico", vel=1.2)
tot += scena(4, "ufficio", t["letto"] + 0.2, t["letto"] + 2.4, "In ufficio vedete\nche l'ha letto")
tot += scena(5, "telefono", t["ritardo"] - 0.3, t["ritardoInvio"] + 0.8, "Imprevisto?\nRitardo in due tocchi", vel=1.2)
tot += scena(6, "ufficio", t["segnalazione"] - 0.2, t["segnalazione"] + 2.2, "L'ufficio lo sa subito\ne avvisa il cliente")
tot += scena(7, "telefono", t["chiusura"], t["salvaRes"] + 0.6, "Lavoro finito: il tecnico\nlo chiude dal telefono", vel=1.6)
tot += scena(8, "ufficio", t["chiuso"] - 0.1, t["chiuso"] + 2.3, "Intervento chiuso:\navviso in ufficio")
tot += scena(9, "monitor", t["sulMonitor"] - 3.5, t["sulMonitor"] + 1.0, "E sul monitor,\nla squadra in diretta", coda=0.6)
tot += cartello(10, "Su misura per\ntermoidraulici\ne caldaisti", "Pavia, Lodi, Piacenza.\nScriveteci su WhatsApp.", 3.0)

open(os.path.join(S, "lista.txt"), "w").write("".join(f"file '{p}'\n" for p in pezzi))
dest = os.path.join(OUT, "planning-demo.mp4")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "lista.txt",
                "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
                "-crf", "26", "-preset", "slow", "-movflags", "+faststart", "-an", dest], cwd=S, check=True)
# poster: la prima scena del planning (non il cartello)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "3.6", "-i", dest, "-frames:v", "1", "-q:v", "3", os.path.join(OUT, "planning-demo.jpg")], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(OUT, "planning-demo.jpg"), "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "34", os.path.join(OUT, "planning-demo.avif")], check=True)
print(f"ok {tot:.1f} s, {os.path.getsize(dest)} byte -> {dest}")
