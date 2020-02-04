var CACHE_NAME = 'pwa-template-v0';
var FILES_TO_CACHE = [
	'/',
	'/index.html',
	'/css/style.css',
	'/js/app.js',
	'/img/pwa.png'
];

// Start the service worker and cache all of the app's shell content
self.addEventListener('install', function (e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(FILES_TO_CACHE);
		})
	);
	self.skipWaiting();
});

// Check if server worker is activated
self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  // Delete old static cache
  e.waitUntil(
    caches.keys().then(cacheNames => {
      console.log(cacheNames);
      return Promise.all(cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Serve cached content when offline
/*self.addEventListener('fetch', function (e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
	e.respondWith(
		caches.match(e.request).then(function (response) {
			return response || fetch(e.request);
		})
	);
});*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      })
    })
  );
});