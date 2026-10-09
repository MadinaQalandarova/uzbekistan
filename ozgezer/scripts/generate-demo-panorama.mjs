/* Demo 360° panorama generatori (faqat vaqtinchalik namuna uchun).
 * Real 360° suratlar chiqqach bu fayl va demo rasm o'chiriladi.
 * Ishlatish:  node scripts/generate-demo-panorama.mjs
 * Natija:     public/panoramas/demo-savitskiy-hall.png  (1024x512, 2:1 equirect)
 * Hech qanday tashqi kutubxona kerak emas (zlib Node'da built-in).
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const W = 1024;
const H = 512;

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

/* Osmon + quyosh + tog'lar + yer — abstrakt demo manzarasi */
function pixel(x, y) {
  // Osmon gradienti
  const skyT = Math.min(1, y / 300);
  let r = lerp(126, 238, skyT);
  let g = lerp(184, 244, skyT);
  let b = lerp(196, 235, skyT);
  // Quyosh
  const dx = x - 700;
  const dy = y - 110;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 46) return [246, 196, 83];
  if (dist < 70) {
    const t = (dist - 46) / 24;
    r = lerp(246, r, t); g = lerp(210, g, t); b = lerp(140, b, t);
  }
  // Uzoq tog'lar
  const farH = 262 + 38 * Math.sin(x * 0.011) + 24 * Math.sin(x * 0.023 + 1.7);
  // Yaqin tog'lar
  const nearH = 318 + 52 * Math.sin(x * 0.007 + 0.6) + 28 * Math.sin(x * 0.019 + 3.1);
  if (y > farH) { r = 127; g = 163; b = 160; }
  if (y > nearH) { r = 63; g = 107; b = 102; }
  // Yer
  if (y > 348) {
    const t = (y - 348) / (H - 348);
    r = lerp(227, 178, t); g = lerp(211, 158, t); b = lerp(174, 120, t);
  }
  return [r, g, b];
}

const raw = Buffer.alloc(H * (1 + W * 3));
let off = 0;
for (let y = 0; y < H; y++) {
  raw[off++] = 0; // filter: none
  for (let x = 0; x < W; x++) {
    const [r, g, b] = pixel(x, y);
    raw[off++] = r; raw[off++] = g; raw[off++] = b;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolor RGB

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "panoramas");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, "demo-savitskiy-hall.png");
writeFileSync(out, png);
console.log(`OK: ${out} (${png.length} bytes, ${W}x${H})`);
