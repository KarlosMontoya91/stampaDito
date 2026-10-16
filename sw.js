/**
 * StampaDito — Service Worker (sw.js)
 * -----------------------------------
 * Garantiza que el sitio cargue rápido y sin errores tanto en redes Wi-Fi como
 * en datos telefónicos (4G/5G/3G) con latencia variable o microcortes de señal.
 * Estrategia:
 * - Navegación (HTML), CSS y JS: Network-First con respaldo inmediato en caché.
 * - Imágenes y recursos gráficos: Stale-While-Revalidate para respuesta instantánea en móvil.
 */

const CACHE_NAME = 'stampadito-prod-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './site.webmanifest',
  './assets/favicon.svg',
  './assets/logo-stampadito.svg',
  './assets/tazas-recortadas/taza-botanica-camila.png',
  './assets/tazas-recortadas/taza-mascota-bruno.png',
  './assets/tazas-recortadas/taza-nombre-mateo.png',
  './assets/tazas-recortadas/taza-geometria-color.png',
  './assets/tazas-recortadas/taza-ilustracion-gatito.png',
  './assets/tazas-recortadas/taza-regalo-polaroid.png',
  './assets/tazas-recortadas/taza-negocio-estudio.png',
  './assets/tazas-recortadas/taza-banner-sol.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Para documentos HTML, CSS y JS usamos Network-First con fallback a caché
  if (
    request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Para imágenes y vectores usamos Stale-While-Revalidate (carga instantánea en datos móviles)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
