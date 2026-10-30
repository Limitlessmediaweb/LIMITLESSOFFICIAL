// Server statico minimo per la scena 3D (file locali, nessun servizio esterno)
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONTS = join(ROOT, "..", "..", "src", "assets", "fonts");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".hdr": "application/octet-stream", ".ttf": "font/ttf", ".woff2": "font/woff2", ".mp4": "video/mp4" };

export function startServer(port = 0) {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      const file = url.startsWith("/fonts/") ? join(FONTS, url.slice(7)) : join(ROOT, url);
      if (!file.startsWith(ROOT) && !file.startsWith(FONTS)) { rsp.writeHead(403); return rsp.end(); }
      if (!existsSync(file) || statSync(file).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
      createReadStream(file).pipe(rsp);
    });
    srv.listen(port, "127.0.0.1", () => res({ srv, url: `http://127.0.0.1:${srv.address().port}` }));
  });
}
