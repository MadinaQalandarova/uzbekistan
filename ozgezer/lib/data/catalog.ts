import categorySeed from "@/data/seed-categories.json";
import placeSeed from "@/data/seed-places.json";
import regionSeed from "@/data/seed-regions.json";
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export type CategoryRecord = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  stat: string;
};

export type FeaturedPlaceRecord = {
  slug: string;
  title: LocalizedText;
  type: LocalizedText;
};

export type RegionRecord = {
  slug: string;
  name: LocalizedText;
  summary: LocalizedText;
  focus: LocalizedText;
  samplePlaces: number;
  featuredPlaces: FeaturedPlaceRecord[];
  highlights: LocalizedText[];
};

export type PlaceRecord = {
  slug: string;
  regionSlug: string;
  regionName: LocalizedText;
  categorySlugs: string[];
  categoryTitles: LocalizedText[];
  name: LocalizedText;
  description: LocalizedText;
  latitude: number;
  longitude: number;
  price: string;
  workingHours: string;
  averageRating: number;
};

export const categories: CategoryRecord[] = categorySeed.map((category) => ({
  slug: category.slug,
  title: {
    uz: category.nameUz,
    ru: category.nameRu,
    en: category.nameEn,
  },
  description: {
    uz: category.descriptionUz,
    ru: category.descriptionRu,
    en: category.descriptionEn,
  },
  stat: String(category.stat),
}));

export const places: PlaceRecord[] = placeSeed.map((place) => {
  const region = regionSeed.find((item) => item.slug === place.regionSlug);
  const placeCategories = categories.filter((category) =>
    place.categorySlugs.includes(category.slug),
  );

  return {
    slug: place.slug,
    regionSlug: place.regionSlug,
    regionName: region
      ? {
          uz: region.nameUz,
          ru: region.nameRu,
          en: region.nameEn,
        }
      : {
          uz: place.regionSlug,
          ru: place.regionSlug,
          en: place.regionSlug,
        },
    categorySlugs: place.categorySlugs,
    categoryTitles: placeCategories.map((category) => category.title),
    name: {
      uz: place.nameUz,
      ru: place.nameRu,
      en: place.nameEn,
    },
    description: {
      uz: place.descriptionUz,
      ru: place.descriptionRu,
      en: place.descriptionEn,
    },
    latitude: place.latitude,
    longitude: place.longitude,
    price: place.price,
    workingHours: place.workingHours,
    averageRating: place.averageRating,
  };
});

export const regions: RegionRecord[] = regionSeed.map((region) => {
  const relatedPlaces = places.filter((place) => place.regionSlug === region.slug);

  return {
    slug: region.slug,
    name: {
      uz: region.nameUz,
      ru: region.nameRu,
      en: region.nameEn,
    },
    summary: {
      uz: region.summaryUz,
      ru: region.summaryRu,
      en: region.summaryEn,
    },
    focus: {
      uz: region.focusUz,
      ru: region.focusRu,
      en: region.focusEn,
    },
    samplePlaces: region.samplePlaces,
    featuredPlaces:
      relatedPlaces.length > 0
        ? relatedPlaces.map((place) => ({
            slug: place.slug,
            title: place.name,
            type: {
              uz: "Asosiy nuqta",
              ru: "Ключевая точка",
              en: "Key stop",
            },
          }))
        : [
            {
              slug: `${region.slug}-featured`,
              title: {
                uz: region.featuredPlaceTitleUz,
                ru: region.featuredPlaceTitleRu,
                en: region.featuredPlaceTitleEn,
              },
              type: {
                uz: "Asosiy nuqta",
                ru: "Ключевая точка",
                en: "Key stop",
              },
            },
          ],
    highlights: [
      {
        uz: `${region.nameUz} uchun kontent qatlamida tarix, tabiat va mahalliy tajriba aralashtirildi.`,
        ru: `Для ${region.nameRu} в контентный слой добавлены история, природа и локальный опыт.`,
        en: `${region.nameEn} combines history, nature, and local experiences in the current content layer.`,
      },
      {
        uz: "Keyingi bosqichda real place yozuvlari va reviewlar bilan boyitiladi.",
        ru: "На следующем этапе регион будет дополнен реальными местами и отзывами.",
        en: "The next step will enrich this region with real places and reviews.",
      },
    ],
  };
});

export function getRegionBySlug(slug: string) {
  return regions.find((region) => region.slug === slug);
}

export function getPlaceBySlug(slug: string) {
  return places.find((place) => place.slug === slug);
}
