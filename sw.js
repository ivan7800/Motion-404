const CACHE_PREFIX = 'motion-404-';
const CACHE = `${CACHE_PREFIX}v1.3.1`;
const APP_SHELL = './index.html';
const CORE = [
  './', APP_SHELL, './styles.css', './app.js', './manifest.webmanifest',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/icon-maskable-512.png',
  './assets/universo-404.webp', './assets/preview.jpg',
  './assets/examples/architecture.webp', './assets/examples/dashboard.webp', './assets/examples/travel.webp',
  './assets/examples/ecommerce.webp', './assets/examples/restaurant.webp', './assets/examples/portfolio.webp',
  './assets/examples/gaming.webp', './assets/examples/automotive.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function canCache(response) {
  return Boolean(response && response.ok && response.type !== 'opaque');
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (canCache(response)) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match(APP_SHELL)) || new Response('Motion 404 no está disponible sin conexión.', {
      status: 503,
      headers: {'Content-Type': 'text/plain; charset=utf-8'}
    });
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request).then(async response => {
    if (canCache(response)) await cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  return (await refresh) || new Response('', {status: 504, statusText: 'Gateway Timeout'});
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }
  event.respondWith(staleWhileRevalidate(event.request, event));
});
