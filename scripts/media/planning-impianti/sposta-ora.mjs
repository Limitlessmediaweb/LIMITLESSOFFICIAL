// Precarica per il server del planning: sposta l'orologio di SPOSTA_MS millisecondi,
// così la giornata di prova risulta "in corso" (mattina) anche se si registra di notte.
const Vero = Date;
const OFF = Number(process.env.SPOSTA_MS || 0);
class Spostata extends Vero {
  constructor(...a) {
    if (a.length === 0) super(Vero.now() + OFF);
    else super(...a);
  }
  static now() {
    return Vero.now() + OFF;
  }
}
globalThis.Date = Spostata;
