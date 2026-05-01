import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "O'zGezer — O'zbekiston sayohat atlasi",
    short_name: "O'zGezer",
    description: "O'zbekiston bo'ylab tarixiy, tabiiy va mahalliy sayohat joylarini kashf eting.",
    start_url: "/uz",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8F7F3",
    theme_color: "#2D6B6B",
    categories: ["travel", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/places/itchan-kala.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
        label: "O'zGezer bosh sahifa",
      },
    ],
  };
}
