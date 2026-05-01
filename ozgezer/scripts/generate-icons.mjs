/**
 * O'zGezer — PNG ikonalar generatori
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ICONS_DIR = join(ROOT, "public", "icons");

mkdirSync(ICONS_DIR, { recursive: true });

const svgBuffer = readFileSync(join(ICONS_DIR, "icon.svg"));

const sizes = [
  { size: 192,  name: "icon-192.png" },
  { size: 512,  name: "icon-512.png" },
  { size: 180,  name: "apple-icon.png" },   // iOS "Add to Home Screen"
  { size: 96,   name: "icon-96.png" },      // Android splash / notification
];

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(ICONS_DIR, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

console.log("\n✅ Barcha ikonalar yaratildi: public/icons/");
