# O'zGezer

O'zGezer — bu O'zbekiston bo'ylab sayohat joylarini kashf etish platformasi. 29 ta maskan, 13 ta hudud, 6 ta kategoriya, 3 til (uz/ru/en), sharhlar, reytinglar va xarita bilan mukammal platforma.

Live: https://uzbekistan-y1yg.vercel.app

## Xususiyatlari

- Katalog: 29 ta joy (tarixiy, tabiat, dam olish, ovqat, bozorlar, muzeylar) — 13 ta hudud bo'ylab
- Qidiruv: matn, viloyat va kategoriya bo'yicha filtrlash (viloyat/kategoriya nomi ham qidiriladi)
- Xarita: Leaflet + Yandex Go / Google Maps yo'nalishlari
- Tungi rejim: standart — tungi, tez almashinuv (0.12s), localStorage da saqlanadi
- PWA: manifest, service worker, offline qo'llab-quvvatlash
- Tasodifiy joy: navbar CTA sizni kutilmagan maskanga olib boradi

## Texnologiyalar(Tools)

- Next.js 16 App Router, TypeScript, Tailwind CSS 4
- Prisma 7 + PostgreSQL (Supabase) + @prisma/adapter-pg
- Leaflet / React-Leaflet, next-intl i18n (uz/ru/en)
- Vercel hosting

## Ishga tushirish

```bash
cd ozgezer
npm install
cp .env.example .env.local  # DATABASE_URL, DIRECT_URL, ADMIN_SECRET va boshqalar
npx prisma generate
npx prisma migrate dev       # yoki prisma db push
npm run prisma:seed          # 29 joy + 13 hudud + 6 kategoriya
npm run dev                  # http://localhost:3000
```

## Loyiha tuzilishi

```
ozgezer/
  app/[locale]/        # sahifalar (home, explore, regions, places, map, admin)
  components/          # UI (place-card, place-gallery, gradient-search, theme-toggle, ...)
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

1. `.env.local` da `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET` ni o'rnating
2. Yangi joy qo'shish: `data/seed-places.json` ga yozing, `public/places/<slug>.jpg` rasm qo'shing, `lib/place-stories.ts` da `PLACE_IMAGES` ni yangilang
3. `npm run build` va `npm run lint` bilan tekshiring, so'ng commit qiling
