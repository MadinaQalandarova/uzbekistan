# O'zGezer

O'zGezer — O'zbekiston bo'ylab sayohat joylarini kashf etish platformasi. 29+ maskan, 13 ta hudud, 6 ta kategoriya, 3 til (uz/ru/en), sharhlar, reytinglar va interaktiv xarita bilan.

Live: https://uzbekistan-y1yg.vercel.app

## Xususiyatlari

- **Katalog**: tarixiy, tabiat, dam olish, ovqat, bozorlar va muzeylar — 13 ta hudud bo'ylab
- **Qidiruv**: matn, viloyat va kategoriya bo'yicha filtrlash (viloyat/kategoriya nomi ham qidiriladi)
- **Xarita**: Leaflet (CARTO Voyager / OSM) + Yandex Go (AppMetrica, 6 xona aniqlik) / Google Maps yo'nalishlari
- **Sharhlar va reytinglar**: foydalanuvchi izohlari moderatsiyadan keyin chiqadi (PENDING), HTML sanitizatsiya, 1000 belgi limiti
- **Ro'yxatdan o'tish**: email validatsiya, scrypt parol hashing, rate-limit
- **Xavfsizlik**: alohida `USER_SECRET`/`ADMIN_SECRET`, HSTS, Permissions-Policy, rate-limit barcha yozuv endpointlarida (view/review/save)
- **PWA**: manifest, service worker (faqat static assets cache), offline qo'llab-quvvatlash
- **Responsivlik**: 320–1440px da horizontal overflow yo'q (scrollbar-gutter: stable, drawer scroll-lock tuzatildi)
- **Tungi rejim**: qotmasdan instant almashadi
- **Tasodifiy joy**: navbar CTA sizni kutilmagan maskanga olib boradi
- **AI Gid**: Anthropic Claude orqali sayohat rejasi va istalgan joy haqida savol-javob (`ANTHROPIC_API_KEY` kerak)
- **i18n**: uz/ru/en — sahifalar va kontent (heroTitle, aria-label, barcha UI matnlar) tarjima qilingan

## Texnologiyalar

- Next.js 16 App Router (Turbopack), TypeScript, Tailwind CSS 4
- Prisma 7 + PostgreSQL (Supabase) + `@prisma/adapter-pg`
- Leaflet / React-Leaflet, o'z i18n tizimi (`lib/i18n.ts`, uz/ru/en), Vercel AI SDK + Anthropic Claude
- Vercel hosting

## Ishga tushirish

```bash
cd ozgezer
npm install
cp ../.env.example .env.local  # DATABASE_URL, DIRECT_URL, ADMIN_*, USER_SECRET, ANTHROPIC_API_KEY
npx prisma generate
npx prisma migrate dev      # yoki prisma db push
npm run prisma:seed         # 29 joy + 13 hudud + 6 kategoriya
npm run dev                 # http://localhost:3000
```

**.env.local** muhim o'zgaruvchilar:

| O'zgaruvchi | Tavsif |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Supabase PostgreSQL |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SECRET` | Admin kirish |
| `USER_SECRET` | User sessiyalar uchun alohida kalit (bo'lmasa dev'da ADMIN_SECRET ishlatiladi; production'da majburiy) |
| `NEXT_PUBLIC_SITE_URL` | Deployment URL (metadataBase uchun) |
| `ANTHROPIC_API_KEY` | AI Gid uchun Anthropic Claude kaliti (bo'lmasa AI bo'limi ishlamaydi) |
| `ANTHROPIC_MODEL` | Claude modeli (ixtiyoriy, default: `claude-haiku-4-5-20251001`) |

## Endpoint urlari (rate-limited)

- `POST /api/places/view` — 1 view / 5 daqiqa / IP
- `POST /api/reviews/submit` — 3 izoh / soat / user
- `POST /api/places/save` — 20 saqlash / soat / user
- `POST /api/ai/guide` — 10 so'rov / soat / IP

## Skriptlar

- `npm run dev` — dev server (Turbopack)
- `npm run build` — `prisma generate && next build`
- `npm run lint` — ESLint
- `npm run prisma:seed` — seed ma'lumotlarini DB ga yuklash

## Hissa qo'shish

1. `.env.local` da zarur o'zgaruvchilarni o'rnating
2. Yangi joy qo'shish: `data/seed-places.json` ga yozing, `public/places/<slug>.jpg` rasm qo'shing, `lib/place-stories.ts` da `PLACE_IMAGES` ni yangilang
3. `npm run build` va `npm run lint` bilan tekshiring, so'ng commit qiling