# O'zGezer

O'zGezer🌐 — bu O'zbekiston bo'ylab sayohat joylarini kashf etish platformasi. 29 ta maskan, 13 ta hudud, 6 ta kategoriya, 3 til (uz/ru/en), sharhlar, reytinglar va xarita bilan mukammal platforma.

Live: https://uzbekistan-y1yg.vercel.app

## Xususiyatlari⚡ 

- Katalogda: 29 ta joy (tarixiy, tabiat, dam olish, ovqat, bozorlar, muzeylar) — 13 ta hudud bo'ylab
- Qidiruv tizimi : matn, viloyat va kategoriya bo'yicha filtrlash (viloyat/kategoriya nomi ham qidiriladi)
- Xarita: Leaflet + Yandex Go / Google Maps yo'nalishlari
- Tungi rejim: qotmasdan almashadi (html background transition olib tashlandi, toggle instant)
- Ro'yxatdan o'tish: isValidEmail + rate-limit + xato logi (UNKNOWN endi Vercel logs da ko'rinadi)
- Xavfsizlik: alohida USER_SECRET/ADMIN_SECRET, HSTS, Permissions-Policy, rate-limit view/review/save endpointlarida
- Sharhlar moderatsiyasi: izohlar PENDING status bilan saqlanadi, HTML sanitizatsiya, 1000 belgi limiti
- PWA: manifest, service worker (faqat static assets), offline qo'llab-quvvatlash
- Tasodifiy joy: navbar CTA sizni kutilmagan maskanga olib boradi
- AI Gid: Anthropic Claude orqali sayohat rejasi va istalgan joy haqida savol-javob (`ANTHROPIC_API_KEY` kerak)

## Texnologiyalar(Tools)

- Next.js 16 App Router, TypeScript, Tailwind CSS 4
- Prisma 7 + PostgreSQL (Supabase) + @prisma/adapter-pg
- Leaflet / React-Leaflet, o'z i18n tizimi (`lib/i18n.ts`, uz/ru/en), Vercel AI SDK + Anthropic Claude
- Vercel hosting

## Ishga tushirish

```bash
cd ozgezer
npm install
cp ../.env.example .env.local  # DATABASE_URL, DIRECT_URL, ADMIN_*, USER_SECRET, ANTHROPIC_API_KEY
npx prisma generate
npx prisma migrate dev       # yoki prisma db push
npm run prisma:seed          # 29 joy + 13 hudud + 6 kategoriya
npm run dev                  # http://localhost:3000
```

## Loyiha tuzilishi

```
ozgezer/
  app/[locale]/        # sahifalar (home, explore, regions, places, map, admin)
  components/          # UI (place-card, place-gallery, gradient-search, liquid-navbar, ...)
  lib/data/            # catalog-service (DB + static fallback), i18n
  data/                # seed-*.json (viloyatlar, kategoriyalar, joylar)
  prisma/              # schema.prisma, seed.js
  public/places/       # joy rasmlari, public/categories/ — kategoriya rasmlari
  docs/phase-0/        # mahsulot va arxitektura qarorlari
```

## Skriptlar

- `npm run dev` — dev server (Turbopack)
- `npm run build` — `prisma generate && next build`
- `npm run lint` — ESLint
- `npm run prisma:seed` — seed ma'lumotlarini DB ga yuklash

## Hissa qo'shish

1. `.env.local` da `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `USER_SECRET` ni o'rnating (AI Gid uchun `ANTHROPIC_API_KEY` ham)
2. Yangi joy qo'shish: `data/seed-places.json` ga yozing, `public/places/<slug>.jpg` rasm qo'shing, `lib/place-stories.ts` da `PLACE_IMAGES` ni yangilang
3. `npm run build` va `npm run lint` bilan tekshiring, so'ng commit qiling
