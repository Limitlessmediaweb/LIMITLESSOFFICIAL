import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "src", "assets", "fonts");

async function asDataUri(publicPath: string | null | undefined) {
  if (!publicPath) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", publicPath));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Immagine Open Graph 1200x630 nello stile del sito: fondo scuro, cornice da mirino,
 * REC, titolo nel display condensato e (se c'è) un fotogramma del lavoro a destra.
 */
export async function ogImage({
  title,
  kicker,
  image,
  imageWide = false,
}: {
  title: string;
  kicker: string;
  /** percorso in /public di un JPG (poster o screenshot) */
  image?: string | null;
  imageWide?: boolean;
}) {
  const [display, sans, img] = await Promise.all([
    readFile(join(fontDir, "ArchivoCondensed-ExtraBold.ttf")),
    readFile(join(fontDir, "Archivo-Medium.ttf")),
    asDataUri(image),
  ]);

  const corner = (pos: Record<string, number>, borders: Record<string, string>) => (
    <div style={{ position: "absolute", width: 34, height: 34, ...pos, ...borders }} />
  );
  const line = "3px solid #e8ff3a";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", color: "#f2f0ea", position: "relative" }}>
        {img && imageWide && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover", opacity: 0.45 }} />
        )}
        {img && !imageWide && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" width={300} height={533} style={{ position: "absolute", right: 90, top: 48, width: 300, height: 533, objectFit: "cover", border: "2px solid rgba(242,240,234,0.25)" }} />
        )}
        {corner({ left: 36, top: 36 }, { borderLeft: line, borderTop: line })}
        {corner({ right: 36, top: 36 }, { borderRight: line, borderTop: line })}
        {corner({ left: 36, bottom: 36 }, { borderLeft: line, borderBottom: line })}
        {corner({ right: 36, bottom: 36 }, { borderRight: line, borderBottom: line })}

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 84px", width: img && !imageWide ? 760 : 1100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Sans", fontSize: 24, letterSpacing: 2 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ff3b30" }} />
            <span>REC</span>
            <span style={{ opacity: 0.6, marginLeft: 12 }}>{kicker.toUpperCase()}</span>
          </div>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: title.length > 34 ? 84 : 112, lineHeight: 0.92, letterSpacing: -1 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Display", fontSize: 40, letterSpacing: 1 }}>
            <span>LIMITLESS</span>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#e8ff3a" }} />
            <span style={{ fontFamily: "Sans", fontSize: 22, opacity: 0.7 }}>limitlessmedia.it</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Sans", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
