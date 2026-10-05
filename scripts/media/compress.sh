#!/usr/bin/env bash
# Comprime i video di materiali/ (e le registrazioni dei siti) in public/media/.
#
# Uso:
#   bash scripts/media/compress.sh            # tutto: spot, walk tour, siti
#   bash scripts/media/compress.sh spot       # solo materiali/spot
#   bash scripts/media/compress.sh walktour   # solo materiali/walktour
#   bash scripts/media/compress.sh siti       # solo .cache/recordings (da record-sites.ts)
#   FORCE=1 bash scripts/media/compress.sh    # rigenera anche i file già presenti
#
# Per ogni video produce:
#   <slug>.mp4      desktop  (verticale 720x1280, orizzontale 1280x720)
#   <slug>-m.mp4    mobile   (lato corto 540 px)
#   <slug>.jpg      poster   (fotogramma a POSTER_AT secondi, override in poster-times.txt)
#   <slug>.avif     poster AVIF
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/public/media"
POSTER_TIMES="$ROOT/scripts/media/poster-times.txt"
WHAT="${1:-all}"

command -v ffmpeg >/dev/null || { echo "ffmpeg non trovato nel PATH"; exit 1; }

poster_at() {
  # poster-times.txt: righe "<cartella>/<slug> <secondi>", es. "spot/nottea 1.2"
  local key="$1" t
  t="$(grep -E "^${key} " "$POSTER_TIMES" 2>/dev/null | awk '{print $2}' | head -n1 || true)"
  echo "${t:-0.5}"
}

# encode <input> <output> <scale filter> <maxrate> <audio:yes|no>
encode() {
  local in="$1" out="$2" vf="$3" maxrate="$4" audio="$5"
  local aopts=(-c:a aac -b:a 64k -ac 2)
  [[ "$audio" == "no" ]] && aopts=(-an)
  ffmpeg -v error -y -i "$in" -vf "$vf,fps=30" \
    -c:v libx264 -preset slow -crf 27 -maxrate "$maxrate" -bufsize "$((${maxrate%k} * 2))k" \
    -profile:v high -pix_fmt yuv420p -movflags +faststart \
    "${aopts[@]}" "$out"
}

process() {
  local in="$1" kind="$2" slug="$3" audio="${4:-yes}"
  local dir="$OUT/$kind"
  mkdir -p "$dir"
  if [[ -f "$dir/$slug.mp4" && -z "${FORCE:-}" ]]; then
    echo "  = $kind/$slug (già presente, FORCE=1 per rigenerare)"
    return
  fi

  local w h
  w="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$in" | tr -d ',\r')"
  h="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in" | tr -d ',\r')"

  local vf_d vf_m vf_p rate_d rate_m
  if [[ "$kind" == "siti" ]]; then
    # Registrazioni dei siti: proporzioni del viewport, nessun ritaglio.
    if (( h >= w )); then
      vf_d="scale=720:-2:flags=lanczos"; vf_m="scale=540:-2:flags=lanczos"
    else
      vf_d="scale=1280:-2:flags=lanczos"; vf_m="scale=960:-2:flags=lanczos"
    fi
    vf_p="$vf_d"
  elif (( h >= w )); then
    vf_d="scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280"
    vf_m="scale=540:960:force_original_aspect_ratio=increase,crop=540:960"
    vf_p="scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280"
  else
    vf_d="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"
    vf_m="scale=960:540:force_original_aspect_ratio=increase,crop=960:540"
    vf_p="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"
  fi
  # Budget: spot <= 3 MB, walk tour <= 6 MB, siti (muti, 12-15 s) leggeri.
  case "$kind" in
    walktour) rate_d="1100k"; rate_m="700k" ;;
    siti)     rate_d="900k";  rate_m="600k" ;;
    *)        rate_d="950k";  rate_m="600k" ;;
  esac

  echo "  > $kind/$slug (${w}x${h})"
  encode "$in" "$dir/$slug.mp4" "$vf_d" "$rate_d" "$audio"
  encode "$in" "$dir/$slug-m.mp4" "$vf_m" "$rate_m" "$audio"

  local t
  t="$(poster_at "$kind/$slug")"
  ffmpeg -v error -y -ss "$t" -i "$in" -frames:v 1 -vf "$vf_p" -q:v 3 "$dir/$slug.jpg"
  ffmpeg -v error -y -i "$dir/$slug.jpg" -c:v libaom-av1 -still-picture 1 -crf 34 -cpu-used 6 "$dir/$slug.avif" \
    || echo "    (AVIF non generato: encoder libaom-av1 mancante)"
}

run_dir() {
  local src="$1" kind="$2" audio="${3:-yes}"
  [[ -d "$src" ]] || return 0
  echo "[$kind] $src"
  shopt -s nullglob
  for f in "$src"/*.mp4 "$src"/*.mov "$src"/*.webm; do
    local base slug
    base="$(basename "$f")"
    slug="$(echo "${base%.*}" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
    process "$f" "$kind" "$slug" "$audio"
  done
}

case "$WHAT" in
  spot)     run_dir "$ROOT/materiali/spot" spot ;;
  walktour) run_dir "$ROOT/materiali/walktour" walktour ;;
  siti)     run_dir "$ROOT/.cache/recordings" siti no ;;
  all)
    run_dir "$ROOT/materiali/spot" spot
    run_dir "$ROOT/materiali/walktour" walktour
    run_dir "$ROOT/.cache/recordings" siti no
    ;;
  *) echo "Argomento non valido: $WHAT"; exit 1 ;;
esac

node "$ROOT/scripts/media/manifest.mjs"
