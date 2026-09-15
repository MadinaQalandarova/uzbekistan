"use client";

import { useEffect } from "react";

const viewed = new Set<string>();

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (viewed.has(slug)) return;
    viewed.add(slug);

    fetch("/api/places/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
