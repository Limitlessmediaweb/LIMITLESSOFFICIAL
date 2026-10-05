# LIMITLESS v3

Il sito di LIMITLESS, costruito da zero: siti web animati, spot video e walk tour per attività locali e piccoli brand.
Concept di design: **"La sala di proiezione"**. I lavori non si descrivono, si guardano.

Stack: Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 (token in `@theme`) · GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, DrawSVG, Flip: tutti gratuiti da GSAP 3.13) · Lenis · `next/font` · `lucide-react`.

> Repository: `Limitlessmediaweb/LIMITLESSOFFICIAL`, ramo `main`. Il sito precedente è conservato nel ramo `sito-precedente`.
> Su Vercel impostare le variabili d'ambiente (vedi sotto): senza `NEXT_PUBLIC_ALLOW_INDEXING=true` il sito è in `noindex`.

---

## Modifiche 05/10

**1. Dati legali e social.** Tutti i dati sono in `src/data/azienda.ts` (titolare Riccardo Pasquini, P.IVA 03051470189, sede, email, PEC, telefono, Instagram, TikTok) e si usano solo da lì (`contatti.ts` è stato eliminato). Nessun regime fiscale indicato.
- Footer su tutte le pagine: "LIMITLESS di Riccardo Pasquini · P.IVA 03051470189 · Miradolo Terme (PV) · Disponibile online in tutta Italia", email, PEC, telefono, icone Instagram e TikTok, link a Privacy, Termini e Cookie.
- TikTok aggiunto ovunque c'è Instagram: menu mobile, footer, /contatti, CTA finale, JSON-LD `sameAs`. Evento `social_click` con `{ rete, posizione }`. Icone ufficiali da Simple Icons (`components/ui/Social.tsx`).
- **TikTok: handle e link da confermare** (`azienda.tiktok`, ora `@limitlessmediaweb`).
- /privacy e /termini con titolare, sede, P.IVA, email e PEC. Nuova sezione **Cookie** nella privacy (`/privacy#cookie`): solo cookie e strumenti tecnici (tema scelto, intro già vista), nessun banner. Plausible non usa cookie; nel sito non ci sono altri script di terze parti.
- JSON-LD `Organization` e `ProfessionalService`: `legalName`, `vatID` IT03051470189, email, telefono, `address` (solo Miradolo Terme, PV, IT), `areaServed` Italia.
- Nelle sezioni commerciali il comune non compare (solo "Disponibile online in tutta Italia"): si legge solo nel footer e nelle pagine legali.

**2. Prezzi.** Un solo prezzo "a partire da" per servizio: sito **da 500 €**, spot **da 99 €**, walk tour **da 99 €**, manutenzione **9 €/mese**, automazioni su richiesta (`src/data/servizi.ts`). Sotto i prezzi, sempre: "Il prezzo finale dipende dal progetto: te lo diciamo dopo la consulenza gratuita, senza sorprese." Tolti i pacchetti a prezzo preciso, le cifre vecchie e ogni frase sulla proprietà del sito o del dominio; al loro posto la frase sulla manutenzione a 9 €/mese (contenuto da confermare). FAQ "Il sito è mio?" sostituita da "Ci sono costi mensili?". JSON-LD `OfferCatalog` aggiornato.

**3. Consulenza gratuita.** CTA principale "Prenota la consulenza gratuita" (componente `ConsulenzaButton`) con messaggio WhatsApp "Ciao! Vorrei una consulenza gratuita per la mia attività." Badge "Consulenza gratuita · senza impegno" nell'hero, nei servizi, nella CTA finale, in /contatti e nelle pagine progetto. Versione breve "Consulenza gratuita" nell'header e nella barra fissa mobile. Primo passo di "Come lavoriamo" = consulenza di 15 minuti. Nuova prima FAQ "La consulenza è davvero gratuita?". Il configuratore genera "Ciao! Vorrei una consulenza gratuita per la mia attività: ho …". Evento `consulenza_click` con la posizione.

**4. Video location eventi rimosso.** Eliminati voce in `progetti.ts`, file in `public/media/walktour/` e in `materiali/`, poster, riga in `poster-times.txt` e le due clip nello showreel (sostituite con Villa Chiara e Camera hotel; showreel rigenerato). Non era nell'intro, nella sitemap né nelle immagini OG. Restano 3 walk tour: il selettore a chip funziona senza spazi vuoti.

**5. Bug della registrazione di ORDITO.**
- *Difetto*: lo scroll era fatto con `window.scrollTo` a ogni frame, che litigava con lo smooth scroll Lenis del sito e con le sezioni fissate di GSAP. Risultato: sezioni fuori ordine (la maglietta compariva prima dell'esploso, poi si tornava alla giacca), esploso quasi invisibile, immagini lazy non caricate (riquadri bianchi) e ultimi 3 secondi fermi su una pagina vuota, senza mai arrivare al footer.
- *Soluzione* (`scripts/media/record-sites.ts` riscritto): cattura con CDP `Page.startScreencast` (DPR 2) e ricostruzione a 30 fps costanti dai timestamp; attesa di intro, font e immagini; scroll di riscaldamento fino in fondo e ritorno su; scrollbar nascosta; scroll guidato da un ciclo `requestAnimationFrame` nella pagina che invia piccoli eventi di rotellina a Lenis (o muove lo scroll nativo di pochi pixel per frame sui siti senza Lenis), con easing; sezioni fissate più lente e l'esploso di ORDITO 5 volte più lento. Calibrazione automatica del moltiplicatore della rotellina (ORDITO lo riduceva a 0,9 e la registrazione si fermava al 90%).
- Rifatte con lo stesso metodo le registrazioni di tutti e 5 i siti, ricompresse (H.264, yuv420p, +faststart) con poster nuovi.

**6. Controllo completo (05/10).**
- Indicizzazione: con `NEXT_PUBLIC_ALLOW_INDEXING=true` `robots.txt` permette tutto e punta a `https://www.limitlessmedia.it/sitemap.xml`, il meta robots è `index, follow`, sitemap e canonical usano `https://www.limitlessmedia.it` (con www).
- Link: 39 link unici controllati (`node scripts/check-links.mjs`): pagine interne, ancore, "Apri il sito live", WhatsApp, Instagram, TikTok, email, PEC, telefono. 0 errori, nessun `example.com` o `localhost`.
- Console: 0 errori e 0 warning (anche di idratazione) su tutte le pagine.
- Video: `muted` + `playsinline`, play da JS solo se visibile, massimo 2 insieme, Risparmio dati e reduced motion = solo poster + pulsante play. Il più pesante è 3,03 MB (walk tour Attico); spot ≤ 2 MB, registrazioni dei siti ≤ 1,5 MB.
- Accessibilità: axe-core 0 violazioni su tutte le pagine (chiaro/scuro, mobile/desktop). Lighthouse Accessibility 100.
- SEO: title e description unici, OG per ogni pagina e progetto, favicon, una sola H1 per pagina, 404 con status 404.
- Testi: nessuna cifra, cliente o recensione inventata; ogni concept ha il tag "Concept".
- Prestazioni: i titoli animati (SplitText) ora si preparano solo quando stanno per entrare nello schermo, ed è stato tolto un `ScrollTrigger.refresh()` doppio al `load`: TBT della home da 280-400 ms a ~100 ms.

### Variabili da impostare su Vercel (Production)

| Variabile | Valore |
|---|---|
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.limitlessmedia.it` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `limitlessmedia.it` (solo se usi Plausible) |

Dopo averle salvate serve un nuovo deploy (sono variabili `NEXT_PUBLIC_`, entrano nella build).

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

- Usate: `design-taste-frontend` (taste-skill). Le regole sono state applicate (niente trattini lunghi nei testi visibili, un solo accento, una sola etichetta per l'intento "contatto": "Prenota la consulenza gratuita", breve "Consulenza gratuita").
- Non presente: `frontend-design`.
- `design:ux-copy`: revisione di tutti i testi (FAQ dal punto di vista del cliente, messaggio del configuratore in italiano naturale, etichette dei link coerenti).
- `design:accessibility-review`: audit WCAG 2.1 AA con axe-core su tutte le pagine (temi chiaro/scuro, mobile/desktop, con e senza reduced motion): **0 violazioni**. Test da tastiera di skip link, menu mobile (resto della pagina inerte), lightbox (focus, frecce, Esc), carosello, accordion. Aggiunti i pulsanti pausa per nastri e showreel finale (WCAG 2.2.2).
- Non usate: `ui-ux-pro-max`, `scroll-cinematic`, `modern-web-guidance`, `design:design-system`, `stop-slop`, le skill `searchfit-seo:*`, `design:design-critique`, `engineering:code-review`. I controlli equivalenti (SEO on-page, schema, alt, contrasto, Lighthouse) sono stati fatti a mano o con script: vedi sotto.

## Verifica

- `npm run lint`, `npm run typecheck`, `npm run build`: puliti, nessun warning.
- `check-alt`: ok. `check-placeholders`: elenca i segnaposto (vedi sotto).
- Ogni pagina: una sola `<h1>`, titolo ≤ 60 caratteri, description ≤ 155, nessun segnaposto visibile in produzione.
- Screenshot: `docs/screenshots/` (`-full` = pagina intera con reduced motion).
- Lighthouse mobile (`docs/lighthouse/`, build con `NEXT_PUBLIC_ALLOW_INDEXING=true` come al lancio, server locale):

  | Pagina | Performance | Accessibility | Best Practices | SEO | LCP simulato | CLS | TBT | Peso |
  |---|---|---|---|---|---|---|---|---|
  | Home | 90-93 | 100 | 100 | 100 | 3,1-3,5 s | 0-0,023 | 90-120 ms | 462 KB |
  | /lavori/nottea | 98-100 | 100 | 100 | 100 | 1,8-2,2 s | 0,001 | 30-110 ms | 1,4 MB (lo spot parte subito) |

  (Misure del 05/10, quattro prove consecutive.)

  L'LCP **osservato** è ~0,17 s; quello simulato da Lighthouse (rete 4G lenta) resta sopra i 2,5 s sulla home perché nella simulazione condivide la banda con JS e font. Con `NEXT_PUBLIC_ALLOW_INDEXING=false` la SEO scende a ~66 solo per il `noindex` voluto.
- Intro testata: 3,9 s compreso il caricamento, 0,7 s con reduced motion, una sola volta per sessione, pulsante "Salta" funzionante.

---

## Da completare prima del lancio

`npm run check:placeholders` li elenca tutti con file e riga (30 al 05/10). In sintesi:
- **TikTok**: handle e link del profilo (`azienda.tiktok`, ora provvisorio `@limitlessmediaweb`).
- **Manutenzione 9 €/mese**: confermare cosa è incluso.
- **Tempi** di consegna di sito, spot e walk tour; acconto 50%; frase "partiamo dalle foto che hai già, senza sopralluogo".
- **Frasi dei progetti**: Osteria del Borgo, VOLTA, FLUSSO (da confermare); Meridia, Saetta, Versante, Casco, Limitless da zero e i walk tour (da scrivere); nome del progetto "Casco".
- Orari di risposta, testo "Chi c'è dietro", conservazione dei dati (12 mesi) nella privacy.
- Logo ufficiale in `materiali/brand/`.
- Privacy e termini: far revisionare.
- Al lancio: variabili su Vercel (vedi "Modifiche 05/10"), poi `npm run check:launch`.
