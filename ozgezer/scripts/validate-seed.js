/* eslint-disable @typescript-eslint/no-require-imports */
const places = require("../data/seed-places.json");
const regions = require("../data/seed-regions.json");
const categories = require("../data/seed-categories.json");

console.log("Joylar:", places.length);
console.log("Viloyatlar:", regions.length);
console.log("Kategoriyalar:", categories.length);

let ok = true;
const slugs = new Set();
for (const p of places) {
  if (slugs.has(p.slug)) { console.error("DUBLIKAT SLUG:", p.slug); ok = false; }
  slugs.add(p.slug);
}
const regSlugs = new Set(regions.map((r) => r.slug));
for (const p of places) {
  if (!regSlugs.has(p.regionSlug)) { console.error("NOMALUM REGION:", p.slug, "->", p.regionSlug); ok = false; }
}
const catSlugs = new Set(categories.map((c) => c.slug));
for (const p of places) {
  for (const cs of p.categorySlugs) {
    if (!catSlugs.has(cs)) { console.error("NOMALUM KATEGORIYA:", p.slug, "->", cs); ok = false; }
  }
  for (const key of ["nameUz","nameRu","nameEn","descriptionUz","descriptionRu","descriptionEn"]) {
    if (!p[key] || !String(p[key]).trim()) { console.error("BOSH MAYDON:", p.slug, key); ok = false; }
  }
}
for (const r of regions) {
  for (const key of ["nameUz","nameRu","nameEn","summaryUz","summaryRu","summaryEn","focusUz","focusRu","focusEn"]) {
    if (!r[key]) { console.error("REGION BOSH MAYDON:", r.slug, key); ok = false; }
  }
}
console.log(ok ? "HAMMASI TOGRI!" : "XATOLAR BOR!");
process.exit(ok ? 0 : 1);
