/* O'zGezer — Service Worker v1 */
const CACHE_NAME = "ozgezer-v1";
const OFFLINE_URL = "/uz";

/* Install: offline sahifasini cache qilamiz */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([
          OFFLINE_URL,
          "/manifest.webmanifest",
          "/icons/icon-192.png",
          "/icons/icon-512.png",
        ])
      )
      .then(() => self.skipWaiting())
  );
});

/* Activate: eski cache larni tozalaymiz */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* Fetch: Network-first, offline fallback */
self.addEventListener("fetch", (event) => {
  /* Faqat GET so'rovlari */
  if (event.request.method !== "GET") return;

  /* Chrome extensions va non-http URLlarni o'tkazib yuboramiz */
  if (!event.request.url.startsWith("http")) return;

  /* API so'rovlari uchun network-only */
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        /* Muvaffaqiyatli javobni cache ga saqlaymiz */
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() =>
        /* Network yo'q — cache dan olamiz, bo'lmasa offline sahifa */
        caches.match(event.request).then(
          (cached) => cached || caches.match(OFFLINE_URL)
        )
      )
  );
});
