/** Portfolio completo: sito separato (repo limitless-portfolio). Quando il CNAME su Aruba è attivo, passare a https://portfolio.limitlessmedia.it */
export const PORTFOLIO_URL = "https://limitless-portfolio.vercel.app";

/** L'HUB è il servizio principale: prima voce. Video e siti subito dopo. */
export const NAV = [
  { href: "/hub", label: "HUB" },
  { href: "/lavori", label: "Lavori" },
  { href: "/servizi", label: "Servizi e prezzi" },
  { href: PORTFOLIO_URL, label: "Portfolio" },
  { href: "/contatti", label: "Contatti" },
];
