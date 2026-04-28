import { unstable_cache } from "next/cache";

import type { CategoryRecord, PlaceRecord, RegionRecord } from "@/lib/data/catalog";
import {
  categories as staticCategories,
  places as staticPlaces,
  regions as staticRegions,
} from "@/lib/data/catalog";
import { prisma } from "@/lib/prisma";

export type AdminPlaceRecord = PlaceRecord & {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  published: boolean;
  phone: string;
  website: string;
  address: { uz: string; ru: string; en: string };
  howToGet: { uz: string; ru: string; en: string };
  reviewCount: number;
  viewCount: number;
};

export type PlaceFilters = {
  q?: string;
  region?: string;
  category?: string;
};

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

export function canManageCatalog() {
  return hasDatabaseConfig();
}

async function _getCategories(): Promise<CategoryRecord[]> {
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

export const getCategories = unstable_cache(_getCategories, ["catalog-categories"], {
  revalidate: 60,
});

async function _getRegions(): Promise<RegionRecord[]> {
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

export const getRegions = unstable_cache(_getRegions, ["catalog-regions"], {
  revalidate: 60,
});

export async function getRegion(slug: string): Promise<RegionRecord | null> {
  const allRegions = await getRegions();
  return allRegions.find((region) => region.slug === slug) ?? null;
}

async function _getPlaces(filters: PlaceFilters = {}): Promise<PlaceRecord[]> {
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

export const getPlaces = unstable_cache(
  _getPlaces,
  ["catalog-places"],
  { revalidate: 30 },
);

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

export async function getAllPlacesAdmin(): Promise<AdminPlaceRecord[]> {
  if (!hasDatabaseConfig()) {
    return staticPlaces.map((place) => ({
      ...place,
      id: place.slug,
      status: "PUBLISHED" as const,
      published: true,
      phone: "",
      website: "",
      address: { uz: "", ru: "", en: "" },
      howToGet: { uz: "", ru: "", en: "" },
      reviewCount: 0,
      viewCount: 0,
    }));
  }

  try {
    const records = await prisma.place.findMany({
      include: {
        region: true,
        categories: { include: { category: true } },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return records.map((place) => ({
      id: place.id,
      slug: place.slug,
      status: place.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      published: place.published,
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
      name: { uz: place.nameUz, ru: place.nameRu, en: place.nameEn },
      description: {
        uz: place.descriptionUz,
        ru: place.descriptionRu,
        en: place.descriptionEn,
      },
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      price: place.price ?? "",
      workingHours: place.workingHours ?? "",
      phone: place.phone ?? "",
      website: place.website ?? "",
      address: {
        uz: place.addressUz ?? "",
        ru: place.addressRu ?? "",
        en: place.addressEn ?? "",
      },
      howToGet: {
        uz: place.howToGetUz ?? "",
        ru: place.howToGetRu ?? "",
        en: place.howToGetEn ?? "",
      },
      averageRating: Number(place.averageRating ?? 0),
      reviewCount: place.reviewCount,
      viewCount: place.viewCount,
    }));
  } catch {
    return [];
  }
}

export type CreatePlaceInput = {
  slug: string;
  regionSlug: string;
  categorySlugs: string[];
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  latitude: number;
  longitude: number;
  price: string;
  workingHours: string;
  phone: string;
  website: string;
  addressUz: string;
  addressRu: string;
  addressEn: string;
  howToGetUz: string;
  howToGetRu: string;
  howToGetEn: string;
};

export async function createPlace(input: CreatePlaceInput) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const region = await prisma.region.findUnique({ where: { slug: input.regionSlug } });
  if (!region) throw new Error("REGION_NOT_FOUND");

  const existing = await prisma.place.findUnique({ where: { slug: input.slug } });
  if (existing) throw new Error("SLUG_ALREADY_EXISTS");

  const categoryRecords = await prisma.category.findMany({
    where: { slug: { in: input.categorySlugs } },
    select: { id: true },
  });

  return prisma.place.create({
    data: {
      slug: input.slug,
      status: "DRAFT",
      published: false,
      nameUz: input.nameUz,
      nameRu: input.nameRu,
      nameEn: input.nameEn,
      descriptionUz: input.descriptionUz,
      descriptionRu: input.descriptionRu,
      descriptionEn: input.descriptionEn,
      latitude: input.latitude,
      longitude: input.longitude,
      price: input.price || null,
      workingHours: input.workingHours || null,
      phone: input.phone || null,
      website: input.website || null,
      addressUz: input.addressUz || null,
      addressRu: input.addressRu || null,
      addressEn: input.addressEn || null,
      howToGetUz: input.howToGetUz || null,
      howToGetRu: input.howToGetRu || null,
      howToGetEn: input.howToGetEn || null,
      regionId: region.id,
      categories: {
        create: categoryRecords.map((cat) => ({ categoryId: cat.id })),
      },
    },
  });
}

export type UpdatePlaceInput = Omit<CreatePlaceInput, "slug">;

export async function updatePlace(slug: string, input: UpdatePlaceInput) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const place = await prisma.place.findUnique({ where: { slug } });
  if (!place) throw new Error("PLACE_NOT_FOUND");

  const region = await prisma.region.findUnique({ where: { slug: input.regionSlug } });
  if (!region) throw new Error("REGION_NOT_FOUND");

  const categoryRecords = await prisma.category.findMany({
    where: { slug: { in: input.categorySlugs } },
    select: { id: true },
  });

  return prisma.place.update({
    where: { slug },
    data: {
      nameUz: input.nameUz,
      nameRu: input.nameRu,
      nameEn: input.nameEn,
      descriptionUz: input.descriptionUz,
      descriptionRu: input.descriptionRu,
      descriptionEn: input.descriptionEn,
      latitude: input.latitude,
      longitude: input.longitude,
      price: input.price || null,
      workingHours: input.workingHours || null,
      phone: input.phone || null,
      website: input.website || null,
      addressUz: input.addressUz || null,
      addressRu: input.addressRu || null,
      addressEn: input.addressEn || null,
      howToGetUz: input.howToGetUz || null,
      howToGetRu: input.howToGetRu || null,
      howToGetEn: input.howToGetEn || null,
      regionId: region.id,
      categories: {
        deleteMany: {},
        create: categoryRecords.map((cat) => ({ categoryId: cat.id })),
      },
    },
  });
}

export async function deletePlace(slug: string) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const place = await prisma.place.findUnique({
    where: { slug },
    include: { reviews: { select: { id: true }, take: 1 } },
  });

  if (!place) throw new Error("PLACE_NOT_FOUND");
  if (place.reviews.length > 0) throw new Error("PLACE_HAS_REVIEWS");

  await prisma.place.delete({ where: { slug } });
}

export async function publishPlace(slug: string) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const place = await prisma.place.findUnique({ where: { slug } });
  if (!place) throw new Error("PLACE_NOT_FOUND");

  return prisma.place.update({
    where: { slug },
    data: { status: "PUBLISHED", published: true },
  });
}

export async function unpublishPlace(slug: string) {
  if (!hasDatabaseConfig()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const place = await prisma.place.findUnique({ where: { slug } });
  if (!place) throw new Error("PLACE_NOT_FOUND");

  return prisma.place.update({
    where: { slug },
    data: { status: "DRAFT", published: false },
  });
}

// ─── Review funksiyalar ───────────────────────────────────────────────────────

export type ReviewRecord = {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  wouldRecommend: boolean;
  userName: string | null;
  createdAt: string;
};

export async function getPlaceReviews(placeSlug: string): Promise<ReviewRecord[]> {
  if (!hasDatabaseConfig()) return [];

  try {
    const place = await prisma.place.findUnique({
      where: { slug: placeSlug },
      select: { id: true },
    });
    if (!place) return [];

    const reviews = await prisma.review.findMany({
      where: { placeId: place.id, status: "APPROVED" },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return reviews.map((r) => ({
      id: r.id,
      userId: r.user.id,
      rating: r.rating,
      comment: r.comment,
      wouldRecommend: r.wouldRecommend,
      userName: r.user.name,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getUserSavedPlaces(userId: string): Promise<PlaceRecord[]> {
  if (!hasDatabaseConfig()) return [];

  try {
    const saved = await prisma.savedPlace.findMany({
      where: { userId },
      include: {
        place: {
          include: {
            region: true,
            categories: { include: { category: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return saved.map(({ place }) => ({
      slug: place.slug,
      regionSlug: place.region.slug,
      regionName: {
        uz: place.region.nameUz,
        ru: place.region.nameRu,
        en: place.region.nameEn,
      },
      categorySlugs: place.categories.map((c) => c.category.slug),
      categoryTitles: place.categories.map((c) => ({
        uz: c.category.nameUz,
        ru: c.category.nameRu,
        en: c.category.nameEn,
      })),
      name: { uz: place.nameUz, ru: place.nameRu, en: place.nameEn },
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
    return [];
  }
}

export async function isPlaceSavedByUser(
  placeSlug: string,
  userId: string,
): Promise<boolean> {
  if (!hasDatabaseConfig()) return false;
  try {
    const place = await prisma.place.findUnique({
      where: { slug: placeSlug },
      select: { id: true },
    });
    if (!place) return false;
    const saved = await prisma.savedPlace.findUnique({
      where: { userId_placeId: { userId, placeId: place.id } },
    });
    return !!saved;
  } catch {
    return false;
  }
}

// ─── Admin: Review moderatsiya ─────────────────────────────────────────────────

export type AdminReviewRecord = {
  id: string;
  rating: number;
  comment: string;
  wouldRecommend: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userName: string | null;
  userEmail: string;
  placeName: string;
  placeSlug: string;
  createdAt: string;
};

export async function getPendingReviews(): Promise<AdminReviewRecord[]> {
  if (!hasDatabaseConfig()) return [];
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { name: true, email: true } },
        place: { select: { nameUz: true, slug: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      wouldRecommend: r.wouldRecommend,
      status: r.status as "PENDING",
      userName: r.user.name,
      userEmail: r.user.email,
      placeName: r.place.nameUz,
      placeSlug: r.place.slug,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function moderateReview(reviewId: string, action: "APPROVED" | "REJECTED") {
  if (!hasDatabaseConfig()) throw new Error("DATABASE_NOT_CONFIGURED");

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status: action },
    select: { placeId: true },
  });

  // Tasdiqlangandan keyin place reytingini yangilaymiz
  if (action === "APPROVED") {
    const stats = await prisma.review.aggregate({
      where: { placeId: review.placeId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { id: true },
    });
    await prisma.place.update({
      where: { id: review.placeId },
      data: {
        averageRating: stats._avg.rating ?? 0,
        reviewCount: stats._count.id,
      },
    });
  }
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
