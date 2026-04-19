import type { CategoryRecord, PlaceRecord, RegionRecord } from "@/lib/data/catalog";
import {
  categories as staticCategories,
  places as staticPlaces,
  regions as staticRegions,
} from "@/lib/data/catalog";
import { prisma } from "@/lib/prisma";

export type PlaceFilters = {
  q?: string;
  region?: string;
  category?: string;
};

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL && prisma);
}

export function canManageCatalog() {
  return hasDatabaseConfig();
}

export async function getCategories(): Promise<CategoryRecord[]> {
  if (!hasDatabaseConfig()) {
    return staticCategories;
  }

  try {
    const records = await prisma.category.findMany({
      orderBy: { nameUz: "asc" },
    });

    return records.map((category) => {
      const fallback = staticCategories.find((item) => item.slug === category.slug);

      return {
        slug: category.slug,
        title: {
          uz: category.nameUz,
          ru: category.nameRu,
          en: category.nameEn,
        },
        description: fallback?.description ?? { uz: "", ru: "", en: "" },
        stat: fallback?.stat ?? "0",
      };
    });
  } catch {
    return staticCategories;
  }
}

export async function getRegions(): Promise<RegionRecord[]> {
  if (!hasDatabaseConfig()) {
    return staticRegions;
  }

  try {
    const records = await prisma.region.findMany({
      include: {
        places: {
          where: { published: true },
          orderBy: { viewCount: "desc" },
          take: 2,
        },
      },
      orderBy: { nameUz: "asc" },
    });

    return records.map((region) => {
      const fallback = staticRegions.find((item) => item.slug === region.slug);

      return {
        slug: region.slug,
        name: {
          uz: region.nameUz,
          ru: region.nameRu,
          en: region.nameEn,
        },
        summary: {
          uz: region.summaryUz ?? fallback?.summary.uz ?? "",
          ru: region.summaryRu ?? fallback?.summary.ru ?? "",
          en: region.summaryEn ?? fallback?.summary.en ?? "",
        },
        focus: {
          uz: region.focusUz ?? fallback?.focus.uz ?? "",
          ru: region.focusRu ?? fallback?.focus.ru ?? "",
          en: region.focusEn ?? fallback?.focus.en ?? "",
        },
        samplePlaces: region.samplePlaces || fallback?.samplePlaces || region.places.length,
        featuredPlaces:
          region.places.length > 0
            ? region.places.map((place) => ({
                slug: place.slug,
                title: {
                  uz: place.nameUz,
                  ru: place.nameRu,
                  en: place.nameEn,
                },
                type: {
                  uz: "Asosiy nuqta",
                  ru: "Ключевая точка",
                  en: "Key stop",
                },
              }))
            : fallback?.featuredPlaces ?? [],
        highlights: fallback?.highlights ?? [],
      };
    });
  } catch {
    return staticRegions;
  }
}

export async function getRegion(slug: string): Promise<RegionRecord | null> {
  const allRegions = await getRegions();
  return allRegions.find((region) => region.slug === slug) ?? null;
}

export async function getPlaces(filters: PlaceFilters = {}): Promise<PlaceRecord[]> {
  const normalizedQuery = filters.q?.trim().toLowerCase();

  if (!hasDatabaseConfig()) {
    return staticPlaces.filter((place) => filterPlace(place, filters, normalizedQuery));
  }

  try {
    const records = await prisma.place.findMany({
      where: {
        published: true,
        ...(filters.region ? { region: { slug: filters.region } } : {}),
        ...(normalizedQuery
          ? {
              OR: [
                { nameUz: { contains: normalizedQuery, mode: "insensitive" } },
                { nameRu: { contains: normalizedQuery, mode: "insensitive" } },
                { nameEn: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionUz: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionRu: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionEn: { contains: normalizedQuery, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(filters.category
          ? {
              categories: {
                some: {
                  category: {
                    slug: filters.category,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        region: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [{ averageRating: "desc" }, { nameUz: "asc" }],
    });

    return records.map((place) => ({
      slug: place.slug,
      regionSlug: place.region.slug,
      regionName: {
        uz: place.region.nameUz,
        ru: place.region.nameRu,
        en: place.region.nameEn,
      },
      categorySlugs: place.categories.map((item) => item.category.slug),
      categoryTitles: place.categories.map((item) => ({
        uz: item.category.nameUz,
        ru: item.category.nameRu,
        en: item.category.nameEn,
      })),
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
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      price: place.price ?? "",
      workingHours: place.workingHours ?? "",
      averageRating: Number(place.averageRating ?? 0),
    }));
  } catch {
    return staticPlaces.filter((place) => filterPlace(place, filters, normalizedQuery));
  }
}

export async function getPlace(slug: string): Promise<PlaceRecord | null> {
  const items = await getPlaces();
  return items.find((place) => place.slug === slug) ?? null;
}

export async function getRelatedPlaces(place: PlaceRecord): Promise<PlaceRecord[]> {
  const items = await getPlaces({
    region: place.regionSlug,
  });

  return items.filter((item) => item.slug !== place.slug).slice(0, 3);
}

export async function createRegion(input: {
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  summaryUz: string;
  summaryRu: string;
  summaryEn: string;
  focusUz: string;
  focusRu: string;
  focusEn: string;
}) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  return prisma.region.create({
    data: {
      slug: input.slug,
      nameUz: input.nameUz,
      nameRu: input.nameRu,
      nameEn: input.nameEn,
      summaryUz: input.summaryUz,
      summaryRu: input.summaryRu,
      summaryEn: input.summaryEn,
      focusUz: input.focusUz,
      focusRu: input.focusRu,
      focusEn: input.focusEn,
      samplePlaces: 0,
    },
  });
}

export async function deleteRegion(slug: string) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const region = await prisma.region.findUnique({
    where: { slug },
    include: {
      places: {
        select: { id: true },
      },
    },
  });

  if (!region) {
    throw new Error("REGION_NOT_FOUND");
  }

  if (region.places.length > 0) {
    throw new Error("REGION_HAS_PLACES");
  }

  await prisma.region.delete({
    where: { slug },
  });
}

function filterPlace(place: PlaceRecord, filters: PlaceFilters, normalizedQuery?: string) {
  const matchesRegion = !filters.region || place.regionSlug === filters.region;
  const matchesCategory =
    !filters.category || place.categorySlugs.includes(filters.category);
  const matchesQuery =
    !normalizedQuery ||
    place.name.uz.toLowerCase().includes(normalizedQuery) ||
    place.name.ru.toLowerCase().includes(normalizedQuery) ||
    place.name.en.toLowerCase().includes(normalizedQuery) ||
    place.description.uz.toLowerCase().includes(normalizedQuery) ||
    place.description.ru.toLowerCase().includes(normalizedQuery) ||
    place.description.en.toLowerCase().includes(normalizedQuery);

  return matchesRegion && matchesCategory && matchesQuery;
}
