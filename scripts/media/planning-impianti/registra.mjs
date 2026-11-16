// Registra la demo del planning per la pagina /impianti: ufficio (PC), telefono del tecnico e monitor dell'ufficio,
// nello stesso momento e collegati allo stesso server. Solo dati inventati (nomi, clienti, indirizzi, telefoni).
// Uso: PLANNING_DIR="<cartella limitless-planning/planning>" node scripts/media/planning-impianti/registra.mjs
// Uscita: scripts/media/planning-impianti/lavoro/ (video grezzi, tempi.json, screenshot)
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const QUI = path.dirname(fileURLToPath(import.meta.url));
const PLANNING = process.env.PLANNING_DIR || path.resolve(QUI, "../../../../limitless-planning/planning");
const req = createRequire(path.join(PLANNING, "package.json"));
const { chromium, selectors } = req("@playwright/test");
const { DatabaseSync } = await import("node:sqlite");

const L = path.join(QUI, "lavoro");
const PORT = 3290, BASE = `http://localhost:${PORT}`;
fs.rmSync(L, { recursive: true, force: true });
fs.mkdirSync(path.join(L, "foto"), { recursive: true });
const DATI = path.join(L, "dati");

// la giornata di prova alle 10:20 di oggi
const adesso = new Date();
const finta = new Date(adesso.getFullYear(), adesso.getMonth(), adesso.getDate(), 10, 20, 0);
const SPOSTA_MS = finta.getTime() - adesso.getTime();
const preload = pathToFileURL(path.join(QUI, "sposta-ora.mjs")).href;

const avvia = () => spawn(process.execPath, ["--import", preload, "server.js"], {
  cwd: PLANNING, env: { ...process.env, PORT: String(PORT), DATA_DIR: DATI, DEMO: "1", SPOSTA_MS: String(SPOSTA_MS) }, stdio: "ignore",
});
const aspetta = async () => { for (let i = 0; i < 80; i++) { try { await fetch(BASE + "/api/me"); return; } catch { await new Promise((r) => setTimeout(r, 200)); } } throw new Error("server non partito"); };

// 1° avvio: crea i dati di prova; poi si cambia il nome dell'azienda con uno inventato
let srv = avvia(); await aspetta(); srv.kill(); await new Promise((r) => setTimeout(r, 800));
const db = new DatabaseSync(path.join(DATI, "planning.sqlite"));
db.exec("UPDATE aziende SET nome = 'Termoidraulica Esempio' WHERE slug = 'mezzadri'");
db.close();
srv = avvia(); await aspetta();

selectors.setTestIdAttribute("data-test");
const t0 = Date.now();
const tempi = {};
const b = await chromium.launch();
const tz = { locale: "it-IT", timezoneId: "Europe/Rome" };
const UF = { ...tz, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, recordVideo: { dir: path.join(L, "ufficio"), size: { width: 2560, height: 1600 } } };
const TEL = { ...tz, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  recordVideo: { dir: path.join(L, "telefono"), size: { width: 780, height: 1688 } } };
const MON = { ...tz, viewport: { width: 1920, height: 1080 }, recordVideo: { dir: path.join(L, "monitor"), size: { width: 1920, height: 1080 } } };

const inizio = {};
async function entra(opz, corpo, pagina, nome) {
  const ctx = await b.newContext(opz);
  await ctx.clock.install({ time: new Date(Date.now() + SPOSTA_MS) });
  inizio[nome] = (Date.now() - t0) / 1000; // la registrazione di ogni contesto parte con la sua prima pagina
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  const r = await p.request.post(BASE + "/api/demo-login", { data: corpo, headers: { origin: BASE } });
  if (!r.ok()) throw new Error(`accesso ${JSON.stringify(corpo)}: ${r.status()}`);
  await p.goto(BASE + pagina);
  return p;
}
const api = async (p, metodo, url, data) => {
  const r = await p.request.fetch(BASE + url, { method: metodo, data, headers: { origin: BASE } });
  if (!r.ok()) throw new Error(`${metodo} ${url}: ${r.status()} ${await r.text()}`);
  return r.json();
};
const foto = (p, nome, opz = {}) => p.screenshot({ path: path.join(L, "foto", `${nome}.png`), ...opz });


const segna = (k) => { tempi[k] = (Date.now() - t0) / 1000; console.log(k, tempi[k]); };

const u = await entra(UF, { ruolo: "ufficio", numero: 1 }, "/ufficio", "ufficio");
const oggi = await u.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; });
const stato = await api(u, "GET", `/api/ufficio/stato?da=${oggi}&a=${oggi}`);
const luca = stato.operatori[0];
const diLuca = stato.interventi.filter((i) => i.operatore_id === luca.id && i.data === oggi && i.stato === "programmato").sort((a, b) => a.ora.localeCompare(b.ora));
if (diLuca.length < 2) throw new Error("servono almeno 2 interventi programmati per Luca");
const mon = await entra(MON, { ruolo: "ufficio", numero: 2 }, "/monitor", "monitor");
const o = await entra(TEL, { ruolo: "operatore", operatore_id: luca.id }, "/operatore", "telefono");
const nascondi = ".attiva-push{display:none!important}";
await o.addStyleTag({ content: nascondi });
await u.waitForTimeout(1500);

// foto per la pagina (prima che cambi qualcosa)
await foto(u, "ufficio-giorno");
await foto(o, "telefono-programma");
await foto(mon, "monitor");
segna("pronto");
await u.waitForTimeout(3000);

// 1) l'ufficio sposta un intervento di Luca
const daSpostare = diLuca[1];
const [hh, mm] = daSpostare.ora.split(":").map(Number);
const min = hh * 60 + mm + 30;
const nuova = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
segna("modifica");
await u.locator(`[data-test=colonna][data-op="${luca.id}"] [data-test=scheda][data-id="${daSpostare.id}"] .cliente`).click();
await u.waitForTimeout(900);
const campoOra = u.locator("input[name=ora]");
await campoOra.click(); await campoOra.fill(""); await campoOra.pressSequentially(nuova.replace(":", ""), { delay: 160 });
await u.waitForTimeout(600);
await u.getByTestId("salva").click();
await o.getByTestId("letto").first().waitFor({ timeout: 8000 });
segna("arrivato");
await o.waitForTimeout(3200);
await foto(o, "telefono-cambio-letto");

// 2) Luca tocca Letto
segna("letto");
await o.getByTestId("letto").first().click();
await u.waitForTimeout(2800);

// 3) Ritardo sul primo intervento
const primo = diLuca[0];
const scheda = o.locator(`[data-test=op-scheda][data-id="${primo.id}"]`);
await scheda.scrollIntoViewIfNeeded();
await o.waitForTimeout(500);
segna("ritardo");
await scheda.getByTestId("imprevisto").click();
await o.waitForTimeout(900);
await o.getByTestId("imp-ritardo").click();
await o.getByTestId("ritardo-30").waitFor();
await o.waitForTimeout(900);
await foto(o, "telefono-ritardo");
segna("ritardoInvio");
await o.getByTestId("ritardo-30").click();
await u.getByTestId("segnalazione").first().waitFor({ timeout: 8000 });
segna("segnalazione");
await u.waitForTimeout(3200);

// 4) Luca chiude l'intervento
segna("chiusura");
await scheda.scrollIntoViewIfNeeded();
await scheda.getByTestId("resoconto-btn").click();
await o.waitForTimeout(700);
await o.getByTestId("res-lavori").pressSequentially("Pulizia scambiatore, analisi fumi ok", { delay: 35 });
await o.getByTestId("incasso-importo").fill("120");
await o.waitForTimeout(300);
await o.getByTestId("metodo-pos").check();
await o.getByTestId("esito-concluso").check();
await o.waitForTimeout(700);
segna("salvaRes");
await o.getByTestId("salva-resoconto").click();
await u.getByTestId("chiuso").first().waitFor({ timeout: 8000 });
segna("chiuso");
await mon.getByTestId("m-avviso").filter({ hasText: "ha chiuso" }).first().waitFor({ timeout: 8000 });
await u.waitForTimeout(2500);
await foto(u, "ufficio-chiusura");
segna("sulMonitor");
await mon.waitForTimeout(5000);
await foto(mon, "monitor-avviso");
segna("fine");

const ctxs = [u.context(), o.context(), mon.context()];
for (const c of ctxs) await c.close();
await b.close(); srv.kill();
const file = (d) => path.join(L, d, fs.readdirSync(path.join(L, d))[0]);
fs.writeFileSync(path.join(L, "tempi.json"), JSON.stringify({ ...tempi, inizio, ufficio: file("ufficio"), telefono: file("telefono"), monitor: file("monitor") }, null, 2));
console.log("ok", tempi);
