// "Ultimi lavori" — home page preview feed. One entry per video, in display
// order. Add a 6th (es. VERSANTE) by appending here: nessun'altra modifica
// serve, la sezione legge direttamente da questo array.

export type LavoroRecente = {
  slug: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  posterSrc: string;
  isConcept: boolean;
  /** Only set for entries that link to a live demo site (es. NÒTTEA). */
  siteUrl?: string;
};

export const LAVORI_RECENTI: LavoroRecente[] = [
  {
    slug: "nottea",
    title: "NÒTTEA",
    subtitle: "Spot animato · brand di lusso",
    videoSrc: "/lavori/nottea.mp4",
    posterSrc: "/lavori/posters/nottea.jpg",
    isConcept: true,
    siteUrl: "https://nottea.vercel.app",
  },
  {
    slug: "meridia",
    title: "MERIDIA",
    subtitle: "Spot di prodotto",
    videoSrc: "/lavori/meridia.mp4",
    posterSrc: "/lavori/posters/meridia.jpg",
    isConcept: true,
  },
  {
    slug: "limitless-da-zero-a-online",
    title: "LIMITLESS",
    subtitle: "Sito web + video promo",
    videoSrc: "/lavori/limitless-da-zero-a-online.mp4",
    posterSrc: "/lavori/posters/limitless-da-zero-a-online.jpg",
    isConcept: false,
  },
  {
    slug: "villa-lume",
    title: "VILLA LUME",
    subtitle: "Video immobiliare",
    videoSrc: "/lavori/villa-lume.mp4",
    posterSrc: "/lavori/posters/villa-lume.jpg",
    isConcept: true,
  },
  {
    slug: "attico-walktour",
    title: "L'ATTICO",
    subtitle: "Video walk tour",
    videoSrc: "/lavori/attico-walktour.mp4",
    posterSrc: "/lavori/posters/attico-walktour.jpg",
    isConcept: true,
  },
];
