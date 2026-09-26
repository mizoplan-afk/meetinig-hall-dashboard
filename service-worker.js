const CACHE_NAME = "meeting-halls-v3";
const APP_SHELL = [
  "./", "./index.html", "./manifest-v3.webmanifest",
  "./planning-apple-icon-v3.png", "./planning-icon-192-v3.png", "./planning-icon-512-v3.png",
  "./planning-favicon-32-v3.png", "./planning-favicon-48-v3.png",
  "./Ashoka-Pillar.png", "./planning-building.png",
  "./conference-hall.jpg.jpg", "./committee-room.jpg.jpg", "./video-conference-room.jpg.jpg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.hostname.includes("googleapis.com")) return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(r => r || caches.match("./index.html")))
  );
});
