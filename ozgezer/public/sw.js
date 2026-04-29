/* O'zGezer — Service Worker v1 */
const CACHE = "ozgezer-v1";

/* Birinchi yuklanishda keshlash */
const PRECACHE = [
  "/",
  "/uz",
  "/ru",
  "/en",
  "/icons/icon.svg",
  "/places/itchan-kala.jpg",
  "/places/chimgan.jpg",
  "/places/ark-fortress.jpg",
  "/places/registan.jpg",
  "/places/shahrisabz.jpg",
  "/places/aydarkul.webp",
  "/places/nurota.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* API so'rovlari va POST — har doim network */
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) return;

  /* Rasmlar uchun — Cache First (tezkor) */
  if (
    url.pathname.startsWith("/places/") ||
    url.pathname.startsWith("/categories/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(request, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  /* Sahifalar uchun — Network First, offline fallback */
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
