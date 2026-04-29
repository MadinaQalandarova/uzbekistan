"use client";

import { useEffect } from "react";

/** Service Worker ni ro'yxatdan o'tkazadi — faqat production va HTTPS da */
export function SwRegistrar() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.location.protocol === "https:"
    ) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          /* SW ro'yxatdan o'tmasa ilova baribir ishlayveradi */
          console.warn("[SW] Registration failed:", err);
        });
    }
  }, []);

  return null;
}
