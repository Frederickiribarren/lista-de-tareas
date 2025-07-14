const CACHE_NAME = 'lista-de-tareas-cache-v4'; // Versión actualizada
const REPO_NAME = '/lista-de-tareas'; // Nombre de tu repositorio

const urlsToCache = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/css/style.css`,
  `${REPO_NAME}/js/app.js`,
  `${REPO_NAME}/js/pdf.js`,
  `${REPO_NAME}/js/auth.js`,
  `${REPO_NAME}/images/icon-192.png`,
  `${REPO_NAME}/images/icon-512.png`,
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
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
