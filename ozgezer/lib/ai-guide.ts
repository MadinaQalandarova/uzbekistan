import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

import { getCategories, getPlaces, getRegions } from "@/lib/data/catalog-service";
import { PLACE_STORIES } from "@/lib/place-stories";
import type { Locale } from "@/lib/i18n";

export type GuideMode = "plan" | "place";

export type GuideRequest = {
  q: string;
  mode: GuideMode;
  locale: Locale;
  destination?: string;
  days?: number;
  category?: string;
};

/* Default model — ANTHROPIC_MODEL env bilan ustidan yozib bo'ladi */
function getModel() {
  return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001");
}

const LOCALE_NAME: Record<Locale, string> = {
  uz: "o'zbek",
  ru: "русский",
  en: "English",
};

/**
 * Katalog va PLACE_STORIES asosida Claude uchun grounding kontekstini
 * quramiz — AI javob berishda loyihadagi real ma'lumotlarga tayanadi.
 */
async function buildContext(request: GuideRequest): Promise<string> {
  const [places, regions, categories] = await Promise.all([
    getPlaces(),
    getRegions(),
    getCategories(),
  ]);

  const regionNames = regions.map((r) => r.name[request.locale]);
  const categoryNames = categories.map((c) => c.title[request.locale]);

  const placeLines = places.slice(0, 60).map((p) => {
    const story = PLACE_STORIES[p.slug];
    const tags = p.categoryTitles.map((c) => c[request.locale]).join(", ");
    const quote = story?.quote[request.locale];
    return `- ${p.name[request.locale]} (${p.regionName[request.locale]}, ${tags}, baho: ${p.averageRating.toFixed(1)})${quote ? ` | iqtibos: "${quote}"` : ""}`;
  });

  return `O'ZGEZER KATALOGI (O'zbekiston sayohat platformasi)
=================================================
Hududlar: ${regionNames.join(", ")}
Kategoriyalar: ${categoryNames.join(", ")}

Joylar ro'yxati:
${placeLines.join("\n") || "Hozircha ma'lumot yo'q."}`;
}

/**
 * AI Gid javobini streaming qilib qaytaradi.
 * Streaming Response qaytaradi — client uni chunk'larda o'qiydi.
 */
export async function createGuideStream(request: GuideRequest): Promise<Response> {
  const context = await buildContext(request);

  const langInstruction = `Siz O'zGezer sayohat platformasining AI gidisiz. Mijozga o'zbekiston bo'ylab sayohatda yordam bering.
JAVOB TILINI doim "${LOCALE_NAME[request.locale]}" tilida yozing.
YODDA TUTING:
1. Faqat YUQORIDAGI katalogdagi REAL joylarga tayaning. Invented joy yozmang.
2. Joy nomi berilsa va u katalogda bo'lsa — uning iqtibos/faktlarini ishlating va qiziqarli qilib tasvirlang.
3. Joy katalogda bo'lmasa — buni ochiq ayting va shu shahar/hudud haqida umumiy tavsiya bering.
4. Savolga qisqa, tuzilgan va foydali javob bering. Markdown formatida (~300-500 so'z).
5. Har bir jumla aniq va ishonchli bo'lsin — noaniq raqamlar/faktlarni ixtiro qilmang.`;

  const planPrompt = request.mode === "plan"
    ? `Mijozning so'rovi: "${request.q}"
${request.destination ? `Nishon hudud: ${request.destination}` : ""}
${request.days ? `Davomiylik: ${request.days} kun` : ""}
${request.category ? `Kategoriya: ${request.category}` : ""}

Katalogdagi real joylarga asoslangan sayohat rejasini tuzing. Rejada:
- Kunlar bo'yicha taqsimot (agar days berilgan bo'lsa)
- Har joy uchun qisqa tavsif va nima uchun aynan uni tanlash kerakligi
- Maslahatlar (transport, vaqt, mahalliy oshxona)`
    : `Mijozning so'rovi: "${request.q}"

Bu so'rovda foydalanuvchi boradigan yoki allaqachon borgan joyi nomini yozgan bo'lishi mumkin.
Katalogdagi mos joyni toping va uni QIZIQARLI qilib tasvirlang — nima uchun aynan shu joy
diqqatga sazovor, qanday faktlar bor, nimani ko'rish kerak. Agar aniq joy nomi berilgan bo'lsa,
shu joyga e'tibor qarating.`;

  const result = streamText({
    model: getModel(),
    system: `${langInstruction}\n\n${context}`,
    prompt: planPrompt,
    maxOutputTokens: 1024,
    temperature: 0.6,
  });

  return result.toTextStreamResponse();
}