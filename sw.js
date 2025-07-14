const CACHE_NAME = 'lista-de-tareas-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/index.js',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
