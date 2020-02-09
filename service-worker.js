var CACHE_NAME = 'pwa-template-v0';
var FILES_TO_CACHE = [
	'/',
	'./',
	'index.html',
	'/css/style.css',
	'/js/app.js',
	'/img/pwa.png',
	'https://fonts.googleapis.com/css?family=Open+Sans|Roboto:300,400,500&display=swap',
	'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap',
	'https://unpkg.com/modern-css-reset@1.1.0/dist/reset.min.css'
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

// Check if service worker is activated
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
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
			var clone = networkResponse.clone();
			cache.put(event.request, clone);
			if(clone.url && clone.url !== "")
				console.log('[ServiceWorker] Cache updated', clone.url);
			return networkResponse;
        });
        return response || fetchPromise;
      })
    })
  );
});
