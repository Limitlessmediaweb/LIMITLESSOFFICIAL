import type { MediaSource } from "@/lib/media";
import type { Faq } from "@/data/faq";
import { waLink } from "@/data/azienda";

/**
 * Pagina /impianti: il planning degli interventi per termoidraulici e caldaisti.
 * Si manda su WhatsApp a chi risponde «mandami info». Video e schermate: solo dati di prova
 * (azienda «Termoidraulica Esempio», nomi, clienti, indirizzi e numeri inventati).
 */
export const MESSAGGIO_IMPIANTI = "Ciao, ho visto il planning per impianti e vorrei saperne di più";
export const waImpianti = waLink(MESSAGGIO_IMPIANTI);

/** Demo registrata dal planning (39 s, 9:16, muta). Script: scripts/media/planning-impianti/. */
export const impiantiDemo: MediaSource = {
  mp4: "/media/impianti/planning-demo.mp4",
  mp4Mobile: null,
  poster: "/media/impianti/planning-demo.jpg",
  posterAvif: "/media/impianti/planning-demo.avif",
  bytes: 986185,
  width: 720,
  height: 1280,
  vertical: true,
};

export const impiantiPassi = [
  {
    n: "01",
    titolo: "L'ufficio inserisce",
    testo: "Cliente, indirizzo, caldaia e orario: l'intervento va nella colonna del tecnico. Se cambia qualcosa, lo spostate in un attimo.",
  },
  {
    n: "02",
    titolo: "Il tecnico riceve",
    testo: "Sul telefono vede il suo programma. Se l'orario cambia gli arriva subito, con il vecchio e il nuovo, e tocca Letto. Imprevisto? Ritardo in due tocchi.",
  },
  {
    n: "03",
    titolo: "L'ufficio vede tutto in diretta",
    testo: "Chi ha letto, chi è in ritardo, chi ha chiuso. E sul monitor dell'ufficio c'è la giornata di tutta la squadra.",
  },
] as const;

export const impiantiRisultati = [
  {
    titolo: "Meno telefonate",
    testo: "I cambi arrivano da soli sul telefono del tecnico. Per sapere se li ha visti non serve chiamarlo: c'è il tasto Letto.",
  },
  {
    titolo: "Tecnici sempre aggiornati",
    testo: "Sul telefono c'è sempre il programma giusto, anche se lo cambiate cinque minuti prima di partire.",
  },
  {
    titolo: "Clienti avvisati",
    testo: "Se un tecnico è in ritardo l'ufficio lo sa subito e può avvisare il cliente prima che sia lui a chiamare.",
  },
] as const;

export const impiantiScadenzario = {
  titolo: "In più: lo scadenzario delle caldaie",
  testo: "Le manutenzioni in scadenza in un elenco, con il promemoria automatico al cliente quando si avvicina il controllo.",
};

export const impiantiSuMisura = [
  "Riparazioni e manutenzioni con colori diversi",
  "Le vostre fasce orarie e le vostre sigle",
  "I fogli da stampare, se in ufficio servono ancora",
  "Il resoconto degli incassi del giorno",
] as const;

export const impiantiDomande: Faq[] = [
  {
    q: "Devo cambiare il programma che uso?",
    a: "No. Il planning organizza gli interventi della giornata: fatture e contabilità restano dove sono adesso. Se lavorate con Excel, partiamo dai vostri file.",
  },
  {
    q: "I tecnici devono imparare qualcosa?",
    a: "Molto poco. Aprono il loro link sul telefono e vedono il programma, con pochi tasti grandi: Letto, Fatto, Imprevisto. Niente password da ricordare.",
  },
  {
    q: "Funziona da telefono?",
    a: "Sì. I tecnici lo usano dal telefono, l'ufficio dal PC o anche dal telefono. Si installa come un'app, senza passare dagli store.",
  },
  {
    q: "I dati dove sono?",
    a: "Su server in Europa. Ogni azienda vede solo i suoi dati e i dati restano vostri.",
  },
  {
    q: "Quanto ci vuole per partire?",
    a: "Dipende da quanti tecnici avete e da come lavorate oggi. Scriveteci su WhatsApp: ve lo diciamo dopo una breve chiamata, e poi si parte con la prova di 30 giorni.",
  },
];
