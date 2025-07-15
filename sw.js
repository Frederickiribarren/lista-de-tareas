const CACHE_NAME = 'lista-de-tareas-cache-v8'; // Versión actualizada para forzar la actualización
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/pdf.js',
  './js/auth.js',
  './images/icon-192.png',
  './images/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// 1. Instalación del Service Worker y guardado en caché de los assets estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching static assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activación del Service Worker y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Escucha de mensajes desde el cliente (para la actualización)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Estrategia de caché "Cache falling back to network" para las peticiones
self.addEventListener('fetch', event => {
  // Ignorar las solicitudes que no son GET, ya que no se pueden cachear.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Si el recurso está en la caché, lo devolvemos.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en la caché, lo buscamos en la red.
        return fetch(event.request).catch(error => {
          console.warn('Fetch failed; app is offline.', event.request.url);
          // No se devuelve nada, permitiendo que el navegador maneje el error de red.
        });
      })
  );
});
  
