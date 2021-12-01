/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-325bf67';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./manifest.json","./index.html","./penize_od_hitlera_001.html","./penize_od_hitlera_002.html","./penize_od_hitlera_006.html","./penize_od_hitlera_007.html","./penize_od_hitlera_008.html","./penize_od_hitlera_009.html","./penize_od_hitlera_010.html","./penize_od_hitlera_011.html","./penize_od_hitlera_012.html","./penize_od_hitlera_013.html","./resources.html","./style/style.min.css","./resources/image001_fmt.jpeg","./resources/image002_fmt.jpeg","./resources/index.xml","./resources/obalka_penize_od_hitle_fmt.jpeg","./resources/upoutavka_eknihy_fmt.jpeg","./scripts/bundle.js"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
