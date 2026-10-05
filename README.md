# LIMITLESS v3

Il sito di LIMITLESS, costruito da zero: siti web animati, spot video e walk tour per attività locali e piccoli brand.
Concept di design: **"La sala di proiezione"**. I lavori non si descrivono, si guardano.

Stack: Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 (token in `@theme`) · GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, DrawSVG, Flip: tutti gratuiti da GSAP 3.13) · Lenis · `next/font` · `lucide-react`.

> Il vecchio sito resta online sul suo progetto Vercel. **Questo progetto non è ancora stato pubblicato.**

---

## Avvio

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build di produzione (prima lancia check-alt e check-placeholders)
npm start
```

Altri comandi:

| Comando | Cosa fa |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | controllo TypeScript |
| `npm run check:alt` | fa fallire la build se c'è un `<img>`/`<Image>` senza `alt` |
| `npm run check:placeholders` | elenca tutti i `[DA COMPLETARE]` / `[DA CONFERMARE]` |
| `npm run check:launch` | come sopra, ma fallisce se resta anche un solo segnaposto (da usare prima del lancio) |
| `npm run media` | comprime tutti i video di `materiali/` in `public/media/` |
| `npm run media:siti` | registra lo scroll dei siti live (Playwright) e li comprime |
| `npm run media:showreel` | rimonta lo showreel dell'hero |
| `npm run lighthouse` | Lighthouse mobile su home e `/lavori/nottea` in `docs/lighthouse/` (serve il sito avviato, `BASE=...`) |
| `npm run screenshots` | screenshot di tutte le pagine (390x844 e 1440x900) in `docs/screenshots/` (serve il sito avviato, `BASE=http://localhost:3000`) |

Requisiti per gli script media: `ffmpeg`/`ffprobe` nel PATH, Bash (Git Bash su Windows), Chromium di Playwright (`npx playwright install chromium`).

## Variabili d'ambiente

Copia `.env.example` in `.env.local`.

| Variabile | Default | A cosa serve |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.limitlessmedia.it` | base per canonical, sitemap, Open Graph, JSON-LD |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | `false` = `noindex` globale e `robots.txt` che blocca tutto. **Mettere `true` al lancio.** |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | (vuota) | se impostata (es. `limitlessmedia.it`) carica Plausible, senza cookie |
| `NEXT_PUBLIC_WHATSAPP` | `393397958873` | numero per i link `wa.me` |

Eventi analytics (`src/lib/analytics.ts`, funzione `track()`): `whatsapp_click` (con `posizione`), `progetto_live_click`, `video_audio_on`, `configuratore_invio`, `filtro_lavori`. Nessun dato personale.

---

## Come aggiungere un nuovo lavoro

1. Metti il video in `materiali/spot/<slug>.mp4` (o `materiali/walktour/<slug>.mp4`). Lo slug è in kebab-case, es. `linea-dacqua`.
2. Aggiungi una voce in `src/data/progetti.ts` con lo stesso `slug` (tipo `sito-spot`, `spot` o `walktour`). Per un Sito + Spot servono anche `sitoUrl` e le 3 righe di `idea`.
3. Lancia:
   ```bash
   npm run media                                  # comprime il video e aggiorna il manifest
   npx tsx scripts/media/record-sites.ts <slug>   # solo per i Sito + Spot: registra il sito live
   bash scripts/media/compress.sh siti
   ```
4. (Facoltativo) scegli il fotogramma del poster in `scripts/media/poster-times.txt` (`spot/<slug> 2.5`) e rilancia con `FORCE=1 npm run media`.

Se un video manca, il sito non si rompe: un Sito + Spot senza spot mostra la registrazione del sito nello smartphone; un lavoro senza nessun video non compare. Il progetto LINEA D'ACQUA si aggiunge così, con un file e una voce.

### Pipeline media (`scripts/media/`)

- `compress.sh`: H.264, `yuv420p`, `+faststart`, CRF 27 con tetto di bitrate. Verticali 720x1280, orizzontali 1280x720, versione mobile `-m.mp4` a 540 px. Audio AAC 64k mantenuto (in pagina partono muti). Poster JPG + AVIF. Risultato: spot 0,8-2 MB, walk tour ≤ 3,2 MB.
- `record-sites.ts`: Playwright apre il sito live, aspetta 4,5 s per l'intro, scorre dall'alto al fondo in 13 s (mobile 390x844 e desktop 1440x900) e salva lo screenshot dell'hero (`public/media/siti/<slug>-hero.jpg`, usato anche per l'OG).
- `showreel.sh`: 14 tagli da 1,3 s con dissolvenze di 0,2 s (~17 s), orizzontale e verticale, muto. Se `materiali/showreel/` contiene clip, usa quelle.
- `manifest.mjs`: scrive `src/data/media-manifest.json` (percorsi, dimensioni, orientamento). Il sito legge solo questo file per sapere quali video esistono.

---

## Struttura

```
src/app            pagine (/, /lavori, /lavori/[slug], /servizi, /contatti, /privacy, /termini, 404), robots, sitemap, OG
src/components
  motion/          SplitReveal, ScrambleText, Reveal, Stagger, PinnedSteps, HorizontalScroll, Marquee, ScrubText,
                   TiltCard, MagneticButton, ParallaxLayer, ScrollProgress, PageTransition, CursorFollower, DrawLine, SmoothScroll
  media/           SmartVideo, PhoneFrame, BrowserFrame, Lightbox, video-registry
  sections/        Intro, Hero, Nastri, Problema, LavoriEvidenza, SpotCarousel, WalkTour, Servizi, ComeLavoriamo,
                   Configuratore, ChiSiamo, Faq, CtaFinale, LavoriGrid
  ui/              Header, Footer, MobileWhatsAppBar, WhatsAppButton, ThemeToggle, Logo, Viewfinder, T (segnaposto), ...
src/data           progetti.ts, servizi.ts, faq.ts, contatti.ts, nav.ts, media-manifest.json (generato)
src/lib            analytics, seo, media, og, gsap, hooks, placeholder
scripts/media      compress.sh, record-sites.ts, showreel.sh, manifest.mjs, poster-times.txt
public/media       video compressi e poster
materiali/         sorgenti (i video non sono versionati, vedi .gitignore)
docs/              screenshots/ e lighthouse/
```

---

## Decisioni

**Contenuti e materiali**
- `materiali/` è stata popolata con i video di `Desktop/LIMITLESS PORTFOLIO` (e i due walk-through da Download), rinominati con lo slug. Il vecchio sito non è stato aperto né letto.
- Spot dei Sito + Spot: i file `*-tiktok.mp4` e `nottea video sito.mp4`. Lo spot di ORDITO (`ordito-tiktok.mp4`) è arrivato durante il lavoro ed è già incluso.
- Spot e video promo: Meridia, Saetta, Villa Lume, Versante (vino, da `versante spot 2.mp4`, la versione 1080p), Casco, Limitless da zero.
- Walk tour: Attico (`walktour-attico-concept.mp4`), Location eventi, Villa Chiara e Camera hotel (i due video "walk-through" e "dolly-in" di Download, rinominati come negli esempi del brief).
- **Esclusi** per prudenza, perché potrebbero essere clienti reali senza consenso: `il-glicine-spot`, `studio-aura-spot`, `limitless analisi video`, `location-eventi-drone`. Per aggiungerli basta copiarli in `materiali/spot/` e aggiungere la voce.
- `progetti.md` sul Desktop era il modello vuoto, quindi vale la tabella del brief. Le frasi mancanti sono `[DA COMPLETARE]`.
- Nessun logo ufficiale in `materiali/brand/`: ho disegnato un marchio provvisorio (inquadratura 9:16 aperta + puntino REC) in `components/ui/Logo.tsx` e `app/icon.svg`. **Da sostituire col logo vero.** Accento: il fallback lime `#E8FF3A`.

**Design**
- Display: **Archivo Condensed ExtraBold** (alternativa libera a Clash Display / Neue Machina), self-hosted con `next/font/local` e ridotto al set latino: 19 KB invece degli 88 del font variabile. Testo: **Inter Tight**. Timecode: monospace di sistema (etichette piccole, non vale un download).
- Angoli vivi ovunque (radius 0); unica eccezione la cornice dello smartphone, che imita un dispositivo reale.
- Tema: scuro di default; senza scelta salvata segue `prefers-color-scheme`; il toggle nell'header salva la scelta. I testi sopra i video sono sempre chiari su velatura scura, in entrambi i temi.
- Easing solo `power3.out`, `expo.out`, `expo.inOut`, `power2`: nessun `back`, `elastic` o rimbalzo.
- Intro (~3,5 s di animazione): i fotogrammi cambiano ogni 0,34 s (≈3 al secondo, per stare sotto la soglia WCAG dei lampi) invece dei 0,25 s del brief. L'ultimo fotogramma è il poster dell'hero, scoperto con un `clip-path` che si allarga: il passaggio all'hero è continuo. Il primo fotogramma è già nell'HTML (coperto da un "otturatore" nero) così l'LCP non aspetta il JavaScript; gli altri si scaricano solo quando l'intro parte. Lo showreel dell'hero parte solo a intro finita.
- I testi dell'hero sono visibili subito nell'HTML; si animano solo quando c'è l'intro (che li copre). Alla seconda visita della sessione niente animazione: contenuto immediato.
- Su mobile e tablet il pulsante WhatsApp dell'hero non c'è: c'è già la barra fissa in basso, due bottoni gialli uno sopra l'altro erano ridondanti. Su desktop è nell'hero e nell'header.
- "Come lavoriamo" usa un layout diverso dai capitoli dei lavori (colonna fissa con il numero del passo + linea che si disegna) per non ripetere due volte lo stesso schema di pin.
- I poster sono `<picture>` con AVIF + JPG già generati (nessun costo di ottimizzazione immagini su Vercel). `next/image` non serve: non ci sono altre immagini statiche.
- Transizioni di pagina con `<ViewTransition>` di React (supportato da Next 16 senza configurazione), fallback GSAP.
- Lenis è attivo solo con puntatore fine; su touch resta lo scroll nativo (più affidabile su iOS).

**Video (SmartVideo)**
- `preload="none"`, poster obbligatorio, sorgente mobile con `<source media>`, play solo se visibile (IntersectionObserver), massimo 2 video in riproduzione (il più vecchio va in pausa), un solo video con audio alla volta.
- Il poster è una `<picture>` lazy sopra al video (visibile quando il video non sta andando), **non** l'attributo `poster`: il browser lo scaricherebbe subito per tutti i video della pagina (era il grosso del peso iniziale).
- I poster a tutto schermo non vanno compressi troppo: sotto ~0,05 bit per pixel Chrome li considera "a bassa entropia" e li esclude dall'LCP (per questo i poster dello showreel sono AVIF a CRF 22).
- Con reduced motion o Risparmio dati non parte niente da solo: poster + pulsante play.
- Senza JavaScript i video hanno i controlli nativi; FAQ tutte aperte; intro nascosta.

## Skill usate

- Usate: `design-taste-frontend` (taste-skill). Le regole sono state applicate (niente trattini lunghi nei testi visibili, un solo accento, una sola etichetta per l'intento "contatto": "Scrivici su WhatsApp").
- Non presente: `frontend-design`.
- Non usate in questa sessione per contenere i tempi: `ui-ux-pro-max`, `scroll-cinematic`, `modern-web-guidance`, `design:design-system`, `design:ux-copy`, `stop-slop`, le skill `searchfit-seo:*`, `design:accessibility-review`, `design:design-critique`, `engineering:code-review`. I controlli equivalenti (SEO on-page, schema, alt, contrasto, Lighthouse) sono stati fatti a mano o con script: vedi sotto.

## Verifica

- `npm run lint`, `npm run typecheck`, `npm run build`: puliti, nessun warning.
- `check-alt`: ok. `check-placeholders`: elenca i segnaposto (vedi sotto).
- Ogni pagina: una sola `<h1>`, titolo ≤ 60 caratteri, description ≤ 155, nessun segnaposto visibile in produzione.
- Screenshot: `docs/screenshots/` (`-full` = pagina intera con reduced motion).
- Lighthouse mobile (`docs/lighthouse/`, build con `NEXT_PUBLIC_ALLOW_INDEXING=true` come al lancio, server locale):

  | Pagina | Performance | Accessibility | Best Practices | SEO | LCP simulato | CLS | TBT | Peso |
  |---|---|---|---|---|---|---|---|---|
  | Home | 91-92 | 100 | 100 | 100 | 3,1-3,5 s | 0 | 90-140 ms | 455 KB |
  | /lavori/nottea | 96-97 | 100 | 100 | 100 | 2,6-2,7 s | 0 | 50 ms | 1,4 MB (lo spot parte subito) |

  L'LCP **osservato** è ~0,17 s; quello simulato da Lighthouse (rete 4G lenta) resta sopra i 2,5 s sulla home perché nella simulazione condivide la banda con JS e font. Con `NEXT_PUBLIC_ALLOW_INDEXING=false` la SEO scende a ~66 solo per il `noindex` voluto.
- Intro testata: 3,9 s compreso il caricamento, 0,7 s con reduced motion, una sola volta per sessione, pulsante "Salta" funzionante.

---

## Da completare prima del lancio

Lancia `npm run check:placeholders` per l'elenco preciso con file e riga. In sintesi:

- **Dati legali**: P.IVA, titolare del trattamento, fornitore email, tempi di conservazione (`contatti.ts`, privacy, termini). Far revisionare privacy e termini.
- **Prezzi e tempi** di sito, spot e walk tour, manutenzione 29 €/mese (`servizi.ts`, `faq.ts`, "Come lavoriamo").
- **Frasi dei progetti**: Osteria del Borgo, VOLTA, FLUSSO da confermare; frasi di Meridia, Saetta, Versante, Casco, Limitless da zero e di tutti i walk tour da scrivere; nome del progetto "Casco".
- **Zona servita** e **orari di risposta** (`contatti.ts`).
- Testo "Chi c'è dietro" da completare con Riccardo.
- Frase sui walk tour "partiamo dalle foto che hai già, senza sopralluogo".
- Logo ufficiale in `materiali/brand/`.
- Al lancio: `NEXT_PUBLIC_ALLOW_INDEXING=true`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=limitlessmedia.it`, poi `npm run check:launch`.
