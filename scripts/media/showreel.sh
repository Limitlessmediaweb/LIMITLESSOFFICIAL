#!/usr/bin/env bash
# Montaggio dello showreel dell'hero (muto, ~18 s), orizzontale e verticale.
#
# Uso:  bash scripts/media/showreel.sh
# Se materiali/showreel/ contiene clip (mp4), usa quelle in ordine alfabetico
# (prime CLIP secondi di ognuna); altrimenti usa la scaletta qui sotto.
#
# Output: public/media/showreel/showreel.mp4 (1280x720) e showreel-vertical.mp4 (720x1280),
#         con versione mobile, poster JPG e AVIF (tramite compress-like encode qui sotto).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$ROOT/.cache/showreel"
OUT="$ROOT/public/media/showreel"
CLIP=1.3     # durata di ogni taglio
FADE=0.2     # dissolvenza tra i tagli
mkdir -p "$TMP" "$OUT"

M="$ROOT/materiali"
R="$ROOT/.cache/recordings"

# file | inizio (s)
HORIZONTAL=(
  "$M/walktour/location-eventi.mp4|0.4"
  "$M/spot/casco.mp4|2.0"
  "$R/nottea-desktop.mp4|0.2"
  "$M/spot/meridia.mp4|16.2"
  "$M/walktour/villa-chiara.mp4|3.0"
  "$R/osteria-del-borgo-desktop.mp4|3.5"
  "$M/spot/saetta.mp4|2.6"
  "$M/walktour/camera-hotel.mp4|1.0"
  "$R/volta-desktop.mp4|1.8"
  "$M/spot/villa-lume.mp4|13.2"
  "$R/ordito-desktop.mp4|5.0"
  "$M/spot/versante.mp4|12.0"
  "$R/flusso-desktop.mp4|0.3"
  "$M/walktour/location-eventi.mp4|5.2"
)

VERTICAL=(
  "$M/spot/nottea.mp4|2.4"
  "$M/spot/casco.mp4|2.0"
  "$M/spot/ordito.mp4|4.2"
  "$M/spot/meridia.mp4|16.2"
  "$M/walktour/attico.mp4|10.0"
  "$M/spot/saetta.mp4|2.6"
  "$R/volta-mobile.mp4|0.4"
  "$M/spot/villa-lume.mp4|13.2"
  "$M/walktour/attico.mp4|30.5"
  "$M/spot/versante.mp4|12.0"
  "$R/nottea-mobile.mp4|5.0"
  "$M/spot/flusso.mp4|3.0"
  "$M/walktour/camera-hotel.mp4|1.0"
  "$M/spot/osteria-del-borgo.mp4|5.0"
)

shopt -s nullglob
custom=("$M"/showreel/*.mp4)
if (( ${#custom[@]} > 0 )); then
  echo "Uso le clip di materiali/showreel/ (${#custom[@]})"
  HORIZONTAL=(); VERTICAL=()
  for f in "${custom[@]}"; do HORIZONTAL+=("$f|0"); VERTICAL+=("$f|0"); done
fi

# build <nome> <w> <h> <lista...>
build() {
  local name="$1" w="$2" h="$3"; shift 3
  local list=("$@") i=0 inputs=() parts=()
  rm -f "$TMP/$name"-*.mp4
  for entry in "${list[@]}"; do
    local f="${entry%%|*}" ss="${entry##*|}"
    [[ -f "$f" ]] || { echo "  (manca $f, salto)"; continue; }
    local seg="$TMP/$name-$(printf %02d $i).mp4"
    # riempie il formato con un ritaglio centrale, 30 fps, leggera velatura per il testo dell'hero
    ffmpeg -v error -y -ss "$ss" -i "$f" -t "$CLIP" -an \
      -vf "scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h},fps=30,setsar=1,format=yuv420p" \
      -c:v libx264 -crf 14 -preset fast "$seg"
    parts+=("$seg"); i=$((i+1))
  done

  # catena di xfade
  local n=${#parts[@]} fc="" prev="[0:v]" offset
  for ((k=0; k<n; k++)); do inputs+=(-i "${parts[$k]}"); done
  for ((k=1; k<n; k++)); do
    offset=$(awk -v k="$k" -v c="$CLIP" -v f="$FADE" 'BEGIN{printf "%.3f", k*(c-f)}')
    fc+="${prev}[${k}:v]xfade=transition=fade:duration=${FADE}:offset=${offset}[v${k}];"
    prev="[v${k}]"
  done
  fc="${fc%;}"
  ffmpeg -v error -y "${inputs[@]}" -filter_complex "$fc" -map "$prev" -c:v libx264 -crf 14 -preset fast -pix_fmt yuv420p "$TMP/$name.mp4"

  # encode finali (desktop + mobile), muti
  local dw dh mw mh rate=1300k mrate=750k
  if (( w > h )); then dw=1280; dh=720; mw=960; mh=540; else dw=720; dh=1280; mw=540; mh=960; fi
  ffmpeg -v error -y -i "$TMP/$name.mp4" -vf "scale=$dw:$dh" -c:v libx264 -preset slow -crf 26 -maxrate $rate -bufsize 2600k \
    -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$OUT/$name.mp4"
  ffmpeg -v error -y -i "$TMP/$name.mp4" -vf "scale=$mw:$mh" -c:v libx264 -preset slow -crf 27 -maxrate $mrate -bufsize 1500k \
    -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$OUT/$name-m.mp4"
  # poster = primo fotogramma (coincide con l'inizio del video: niente salto quando parte)
  ffmpeg -v error -y -i "$TMP/$name.mp4" -frames:v 1 -vf "scale=$dw:$dh" -q:v 4 "$OUT/$name.jpg"
  ffmpeg -v error -y -i "$OUT/$name.jpg" -c:v libaom-av1 -still-picture 1 -crf 22 -cpu-used 6 "$OUT/$name.avif" || true
  echo "  ✓ $name ($n tagli)"
}

echo "[showreel]"
build showreel 1280 720 "${HORIZONTAL[@]}"
build showreel-vertical 720 1280 "${VERTICAL[@]}"
node "$ROOT/scripts/media/manifest.mjs"
ls -la "$OUT"
