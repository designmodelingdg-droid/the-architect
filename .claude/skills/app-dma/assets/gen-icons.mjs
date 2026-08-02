// Genera los iconos PWA (PNG) sin dependencias externas.
// Uso: node scripts/gen-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

const PURPLE = [0x6c, 0x5c, 0xe7, 255];
const WHITE = [255, 255, 255, 255];
const TRANSPARENT = [0, 0, 0, 0];

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePNG(size, pixelAt) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0; // filtro none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelAt(x, y);
      const o = y * (1 + size * 4) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Distancia con signo a un rectángulo redondeado centrado en (cx, cy)
function sdRoundRect(px, py, cx, cy, w, h, r) {
  const dx = Math.abs(px - cx) - (w / 2 - r);
  const dy = Math.abs(py - cy) - (h / 2 - r);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(dx, dy), 0) - r;
}

// Icono: fondo morado con billetera blanca (cuerpo + solapa + broche morado)
function drawIcon(size, { maskable }) {
  const bgRadius = maskable ? 0 : size * 0.22;
  const pad = maskable ? size * 0.1 : 0; // zona segura maskable
  const s = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;
  return encodePNG(size, (x, y) => {
    if (!maskable && sdRoundRect(x, y, cx, cy, size, size, bgRadius) > 0) return TRANSPARENT;
    // cuerpo de la billetera
    const body = sdRoundRect(x, y, cx, cy + s * 0.04, s * 0.56, s * 0.4, s * 0.07);
    // solapa superior
    const flap = sdRoundRect(x, y, cx - s * 0.03, cy - s * 0.16, s * 0.46, s * 0.1, s * 0.045);
    if (body <= 0 || flap <= 0) {
      // broche: círculo morado dentro del cuerpo, lado derecho
      const bx = cx + s * 0.17;
      const by = cy + s * 0.05;
      if (Math.hypot(x - bx, y - by) <= s * 0.055) return PURPLE;
      return WHITE;
    }
    return PURPLE;
  });
}

// Empaqueta varios PNG en un .ico (favicon multi-tamaño para el navegador)
function buildIco(sizes) {
  const images = sizes.map((size) => ({
    size,
    png: drawIcon(size, { maskable: false }),
  }));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo 1 = icono
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const img of images) {
    const e = Buffer.alloc(16);
    e[0] = img.size >= 256 ? 0 : img.size; // ancho (0 = 256)
    e[1] = img.size >= 256 ? 0 : img.size; // alto
    e[2] = 0; // colores de paleta
    e[3] = 0; // reservado
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por píxel
    e.writeUInt32LE(img.png.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += img.png.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "icon-192.png"), drawIcon(192, { maskable: false }));
writeFileSync(join(OUT, "icon-512.png"), drawIcon(512, { maskable: false }));
writeFileSync(join(OUT, "maskable-512.png"), drawIcon(512, { maskable: true }));
writeFileSync(join(OUT, "apple-touch-icon.png"), drawIcon(180, { maskable: true }));
// Iconos sueltos que algunos navegadores prefieren
writeFileSync(join(OUT, "icon-32.png"), drawIcon(32, { maskable: false }));
// Favicon del navegador (pestaña) — reemplaza el de Next.js
writeFileSync(
  join(OUT, "..", "..", "src", "app", "favicon.ico"),
  buildIco([16, 32, 48])
);
console.log("Iconos generados en public/icons/ y src/app/favicon.ico");
