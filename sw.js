const CACHE = 'eps-pro-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icone-192.png',
  'icone-512.png',
  'icône-touch-apple.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      return r || fetch(e.request).catch(() => caches.match('index.html'));
    })
  );
});
