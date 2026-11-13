# Video "glow up" LIMITLESS (TikTok / Reels)

**"Ho rifatto il sito della mia agenzia da zero"**: prima/dopo + "guarda cosa facciamo".
17,0 s · 1080x1920 · 30 fps · H.264 High yuv420p CRF 18 · AAC muto · faststart.

- `limitless-glow-up-tiktok.mp4`: video finale
- `cover.jpg`: copertina "Prima → Dopo" (1080x1920)
- `contact-sheet.jpg`: un fotogramma ogni 0,5 s

## Montaggio (griglia 120 BPM, tagli ogni 0,5 s)

| Tempo | Contenuto |
|---|---|
| 0,0-1,5 | Vecchio sito (desaturato, più scuro) dentro un telefono, scroll lento. "Il nostro vecchio sito…" |
| 1,5-2,0 | Whip pan verso sinistra con sfocatura di movimento |
| 2,0 | Flash bianco di 2 fotogrammi (100% → 50%) |
| 2,0-6,0 | Nuovo sito a tutto schermo: cornice dell'intro, poster (a 1,5x), apertura, wordmark, hero con showreel. "…e quello nuovo." |
| 6,0-11,0 | 10 tagli da 0,5 s nel telefono: NÒTTEA, ORDITO, Osteria del Borgo, VOLTA, FLUSSO (prima le intro, poi gli hero), con nome e settore |
| 11,0-12,0 | I 5 telefoni insieme. Testo fisso: "Lo facciamo anche per la tua attività." |
| 12,0-14,5 | Laptop + telefono sulla sezione Servizi. "Siti da 500 € · Spot da 99 €" |
| 14,5-17,0 | Finale: wordmark LIMITLESS, "Consulenza gratuita", "limitlessmedia.it · scrivici in DM" |

Punti di taglio: 1,5 · 2,0 · 6,0 · 6,5 · 7,0 · … · 11,0 · 12,0 · 14,5 · 17,0 s.

Variante skill `limitless-video-sito`: hook (b) Prima/Dopo · presentazione mista (telefono + schermo intero + split) · ritmo (b) veloce a tempo · transizioni whip pan + flash, poi tagli netti · finale CTA con logo.

## Fonti
- Nuovo sito: questo repo in build di produzione (`npm run build && npx next start -p 3200`), tema scuro.
- Vecchio sito: il sito sostituito il 05/10 (cartella `Desktop/LIMITLESS-SITE`, ramo `sito-precedente`) in locale su `:3100`.
  Per usare l'URL Vercel di backup: `OLD_URL=https://... node scripts/record.mjs old-mobile`.
- Lavori: URL live su Vercel (nottea, ordito-flame, osteria-del-borgo-virid, volta-puce, flusso-six).

## Rifarlo
```bash
node video-tiktok/glow-up/scripts/record.mjs        # clip grezze in clips/ (si apre una finestra di Chrome)
node video-tiktok/glow-up/scripts/overlays.mjs      # testi, cornici, finale (font del sito)
python video-tiktok/glow-up/scripts/build.py        # montaggio, video, copertina
```
- `record.mjs`: Playwright + Google Chrome, 540x960 DPR 2, emulazione iPhone, CDP `Page.startScreencast` (jpeg 100) → 30 fps costanti; scroll con piccoli eventi di rotellina (Lenis). **Con finestra**: in headless lo screencast restituisce 540x960 invece di 1080x1920.
- `layout.json`: posizioni di telefono, laptop e testi (safe zone: testi tra y 150 e 1540, x < 940).
- `build.py`: istanti scelti per ogni lavoro in `PASS1` / `PASS2`; rimappatura dell'intro in `new_intro_time`.
