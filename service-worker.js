const CACHE_NAME = "meeting-halls-v5";
const APP_SHELL = [
 "./","./index.html","./manifest-v5.webmanifest",
 "./planning-circle-apple-v5.png","./planning-circle-192-v5.png","./planning-circle-512-v5.png",
 "./planning-circle-favicon-32-v5.png","./planning-circle-favicon-48-v5.png",
 "./Ashoka-Pillar.png","./planning-building.png",
 "./conference-hall.jpg.jpg","./committee-room.jpg.jpg","./video-conference-room.jpg.jpg"
];
self.addEventListener("install",e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));
 self.skipWaiting();
});
self.addEventListener("activate",e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin || u.hostname.includes("googleapis.com")) return;
 e.respondWith(fetch(e.request).then(r=>{
   const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return r;
 }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
