var CACHE_NAME = 'beton-v4';
var urlsToCache = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(urlsToCache); }));
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (n) {
                if (n !== CACHE_NAME) { return caches.delete(n); }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).then(function (resp) {
            var copy = resp.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
            return resp;
        }).catch(function () {
            return caches.match(event.request).then(function (r) {
                return r || caches.match('./index.html');
            });
        })
    );
});
