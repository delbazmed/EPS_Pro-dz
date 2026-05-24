// Smart EPS Service Worker - Network First Strategy
const CACHE = 'smart-eps-v8';

self.addEventListener('install', e => {
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k))) // delete ALL old caches
    )
  );
  self.clients.claim();
});

// Network First - always try network, fallback to cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
