/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient, PlaceStatus } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { config } = require("dotenv");
const regionSeed = require("../data/seed-regions.json");
const categorySeed = require("../data/seed-categories.json");
const placeSeed = require("../data/seed-places.json");

config({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL yoki DIRECT_URL .env.local da topilmadi");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Kategoriyalar yuklanmoqda...");
  for (const category of categorySeed) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameUz: category.nameUz,
        nameRu: category.nameRu,
        nameEn: category.nameEn,
      },
      create: {
        slug: category.slug,
        nameUz: category.nameUz,
        nameRu: category.nameRu,
        nameEn: category.nameEn,
      },
    });
  }
  console.log(`  ✓ ${categorySeed.length} ta kategoriya`);

  console.log("Viloyatlar yuklanmoqda...");
  for (const region of regionSeed) {
    await prisma.region.upsert({
      where: { slug: region.slug },
      update: {
        nameUz: region.nameUz,
        nameRu: region.nameRu,
        nameEn: region.nameEn,
        summaryUz: region.summaryUz,
        summaryRu: region.summaryRu,
        summaryEn: region.summaryEn,
        focusUz: region.focusUz,
        focusRu: region.focusRu,
        focusEn: region.focusEn,
        samplePlaces: region.samplePlaces,
      },
      create: {
        slug: region.slug,
        nameUz: region.nameUz,
        nameRu: region.nameRu,
        nameEn: region.nameEn,
        summaryUz: region.summaryUz,
        summaryRu: region.summaryRu,
        summaryEn: region.summaryEn,
        focusUz: region.focusUz,
        focusRu: region.focusRu,
        focusEn: region.focusEn,
        samplePlaces: region.samplePlaces,
      },
    });
  }
  console.log(`  ✓ ${regionSeed.length} ta viloyat`);

  console.log("Joylar yuklanmoqda...");
  let placesAdded = 0;
  for (const place of placeSeed) {
    const region = await prisma.region.findUnique({
      where: { slug: place.regionSlug },
      select: { id: true },
    });

    if (!region) continue;

    await prisma.place.upsert({
      where: { slug: place.slug },
      update: {
        nameUz: place.nameUz,
        nameRu: place.nameRu,
        nameEn: place.nameEn,
        descriptionUz: place.descriptionUz,
        descriptionRu: place.descriptionRu,
        descriptionEn: place.descriptionEn,
        latitude: place.latitude,
        longitude: place.longitude,
        price: place.price,
        workingHours: place.workingHours,
        averageRating: place.averageRating,
        published: true,
        status: PlaceStatus.PUBLISHED,
        regionId: region.id,
      },
      create: {
        slug: place.slug,
        nameUz: place.nameUz,
        nameRu: place.nameRu,
        nameEn: place.nameEn,
        descriptionUz: place.descriptionUz,
        descriptionRu: place.descriptionRu,
        descriptionEn: place.descriptionEn,
        latitude: place.latitude,
        longitude: place.longitude,
        price: place.price,
        workingHours: place.workingHours,
        averageRating: place.averageRating,
        published: true,
        status: PlaceStatus.PUBLISHED,
        regionId: region.id,
      },
    });

    const persistedPlace = await prisma.place.findUnique({
      where: { slug: place.slug },
      select: { id: true },
    });

    if (!persistedPlace) continue;

    for (const categorySlug of place.categorySlugs) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });

      if (!category) continue;

      await prisma.placeCategory.upsert({
        where: {
          placeId_categoryId: {
            placeId: persistedPlace.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          placeId: persistedPlace.id,
          categoryId: category.id,
        },
      });
    }
    placesAdded++;
  }
  console.log(`  ✓ ${placesAdded} ta joy`);
  console.log("\nSeed muvaffaqiyatli tugadi!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
