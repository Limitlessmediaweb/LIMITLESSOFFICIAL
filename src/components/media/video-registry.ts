/**
 * Coordina i video della pagina:
 *  - al massimo MAX_PLAYING video in riproduzione insieme (si ferma il più vecchio);
 *  - un solo video con l'audio attivo alla volta.
 */
const MAX_PLAYING = 2;
const playing: HTMLVideoElement[] = [];

export function requestPlay(v: HTMLVideoElement) {
  const i = playing.indexOf(v);
  if (i !== -1) playing.splice(i, 1);
  playing.push(v);
  while (playing.length > MAX_PLAYING) {
    const oldest = playing.shift();
    if (oldest && oldest !== v) {
      oldest.pause();
      oldest.dispatchEvent(new CustomEvent("registry-pause"));
    }
  }
  const p = v.play();
  if (p) p.catch(() => release(v));
}

export function release(v: HTMLVideoElement) {
  const i = playing.indexOf(v);
  if (i !== -1) playing.splice(i, 1);
}

export function soloAudio(v: HTMLVideoElement) {
  document.querySelectorAll<HTMLVideoElement>("video[data-smart]").forEach((other) => {
    if (other !== v && !other.muted) {
      other.muted = true;
      other.dispatchEvent(new CustomEvent("registry-mute"));
    }
  });
}

export function prefersLowData() {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(c?.saveData);
}
