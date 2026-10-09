"use client";

import dynamic from "next/dynamic";
import type { PanoramaScene } from "./virtual-tour";

/* Pannellum window/document talab qiladi — faqat brauzerda yuklanadi */
export const VirtualTour = dynamic(
  () => import("./virtual-tour").then((m) => m.VirtualTour),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full animate-pulse rounded-[1.5rem] bg-[var(--color-mist)] sm:h-80" />
    ),
  },
);

export type { PanoramaScene };
