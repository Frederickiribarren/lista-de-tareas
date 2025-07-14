const CACHE_NAME = 'lista-de-tareas-cache-v2'; // Versión actualizada
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/pdf.js',
  './js/auth.js', // Añadido
  './js/index.js',
  './images/icon-192.png',
  './images/icon-512.png',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11' // Añadido
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

// Limpia cachés antiguos al activar el nuevo Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
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
