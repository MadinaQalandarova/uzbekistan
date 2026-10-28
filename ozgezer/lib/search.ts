/**
 * Qidiruv yordamchilari.
 *
 * Foydalanuvchilar nomlarni har xil yozadi: "Buxoro" → "buhoro", "buhara",
 * "buxara", "Бухара". Quyidagi funksiyalar shunday xatolarni ham topadi:
 *   1. diakritika / apostrof / kirillcha → lotin
 *   2. tokenlar orasidagi Levenshtein masofasi
 *   3. fonetik skelet (x→h, q→k, w→v, unlilar tashlanadi)
 */

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

/** Qidiruv uchun matnni bir xil ko'rinishga keltiradi */
export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ʻʼ‘’'`´]/g, "")
    .replace(/[а-яёўқғҳ]/g, (char) => CYRILLIC_TO_LATIN[char] ?? char)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Unlilarni tashlab, o'xshash talaffuzlarni bir xil ko'rinishga keltiradi */
function phoneticKey(word: string): string {
  return word
    .replace(/ph/g, "f")
    .replace(/x/g, "h")
    .replace(/q/g, "k")
    .replace(/w/g, "v")
    .replace(/[aeiouy]/g, "")
    .replace(/(.)\1+/g, "$1");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1]! + 1,
        previous[j]! + 1,
        previous[j - 1]! + cost,
      );
    }
    previous = current;
  }

  return previous[b.length]!;
}

/** Bitta so'zni so'rov so'zi bilan solishtiradi (0..1) */
function scoreToken(queryToken: string, textToken: string): number {
  if (queryToken === textToken) return 1;

  if (queryToken.length >= 3 && textToken.startsWith(queryToken)) return 0.94;
  if (textToken.length >= 3 && queryToken.startsWith(textToken)) return 0.9;

  const maxDistance = queryToken.length >= 7 ? 2 : queryToken.length >= 4 ? 1 : 0;
  if (maxDistance > 0) {
    const distance = levenshtein(queryToken, textToken);
    if (distance <= maxDistance) return 0.88 - distance * 0.04;
  }

  const queryKey = phoneticKey(queryToken);
  const textKey = phoneticKey(textToken);
  if (queryKey.length >= 3 && textKey.length >= 3) {
    if (queryKey === textKey) return 0.8;
    if (textKey.startsWith(queryKey)) return 0.7;
    if (levenshtein(queryKey, textKey) <= 1) return 0.64;
  }

  return 0;
}

/**
 * Matn so'rovga qanchalik mos — 0 (mos emas) .. 1 (aniq mos).
 * Barcha so'rov so'zlari topilishi shart, aks holda 0 qaytadi.
 */
export function scoreText(text: string, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedText = normalizeSearchText(text);
  if (!normalizedQuery || !normalizedText) return 0;

  if (normalizedText.includes(normalizedQuery)) return 1;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const textTokens = normalizedText.split(" ").filter(Boolean);
  if (queryTokens.length === 0 || textTokens.length === 0) return 0;

  let total = 0;
  for (const queryToken of queryTokens) {
    let best = 0;
    for (const textToken of textTokens) {
      if (Math.abs(textToken.length - queryToken.length) > 4) continue;
      const score = scoreToken(queryToken, textToken);
      if (score > best) best = score;
      if (best === 1) break;
    }
    if (best < 0.6) return 0;
    total += best;
  }

  return total / queryTokens.length;
}

export type SearchablePlace = {
  name: { uz: string; ru: string; en: string };
  description: { uz: string; ru: string; en: string };
  regionName: { uz: string; ru: string; en: string };
  categoryTitles: { uz: string; ru: string; en: string }[];
};

/** Joyning barcha matn maydonlari bo'yicha eng yaxshi moslik balli */
export function scorePlace(place: SearchablePlace, query: string): number {
  /* Nom, viloyat va kategoriya — asosiy belgilar.
     Tavsif esa faqat qo'shimcha ishora, shuning uchun pastroq vazn bilan. */
  const primary = [
    ...Object.values(place.name),
    ...Object.values(place.regionName),
    ...place.categoryTitles.flatMap((title) => Object.values(title)),
  ];
  const secondary = Object.values(place.description);

  let best = 0;
  for (const text of primary) {
    const score = scoreText(text, query);
    if (score > best) best = score;
    if (best === 1) return 1;
  }

  for (const text of secondary) {
    const score = scoreText(text, query) * 0.7;
    if (score > best) best = score;
  }

  return best;
}

/**
 * "Balki shuni izlagansiz?" taklifi.
 * So'rov biror nomga to'liq mos kelsa — taklif kerak emas (null).
 */
export function suggestCorrection(labels: string[], query: string): string | null {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return null;

  let best: { label: string; score: number } = { label: "", score: 0 };

  for (const label of labels) {
    if (!label) continue;
    const normalizedLabel = normalizeSearchText(label);
    if (!normalizedLabel) continue;
    if (normalizedLabel.includes(normalizedQuery)) return null;

    const score = scoreText(label, query);
    if (score > best.score) best = { label, score };
  }

  return best.score >= 0.7 ? best.label : null;
}
