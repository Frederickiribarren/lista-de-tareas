const CACHE_NAME = 'lista-de-tareas-cache-v11'; // Versión actualizada sin PDF
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/auth.js',
  './js/notifications.js', // Sistema de notificaciones
  './js/reminders.js', // Sistema de recordatorios
  './images/icon-192.png',
  './images/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
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

// 4. Estrategia de caché "Stale-While-Revalidate"
self.addEventListener('fetch', event => {
  // Ignorar las solicitudes que no son GET, ya que no se pueden cachear.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // 1. Intenta obtener el recurso de la red en segundo plano
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Si la petición a la red es exitosa, la guardamos en caché
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // 2. Devuelve la respuesta de la caché si existe, si no, espera a la red
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// 5. Manejar notificaciones push (para futuras implementaciones con servidor)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de Lista de Tareas',
    icon: './images/icon-192.png',
    badge: './images/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver tareas',
        icon: './images/icon-192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: './images/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Lista de Tareas', options)
  );
});

// 6. Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Abrir la aplicación cuando se hace clic en "Ver tareas"
    event.waitUntil(
      clients.openWindow('./')
    );
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Clic en la notificación principal
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          // Si la app ya está abierta, enfocarla
          return clientList[0].focus();
        }
        // Si no está abierta, abrirla
        return clients.openWindow('./');
      })
    );
  }
});

// 7. Manejar el cierre de notificaciones
self.addEventListener('notificationclose', event => {
  console.log('Notificación cerrada:', event.notification.tag);
});

