self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('index')
      .then((cache) => fetch('parcel-manifest.json')
        .then((response) => response.json())
        .then((files) => cache.addAll(files))
      )
      .then(() => console.debug('Service Worker installed.'))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('fetch', (event) => event.respondWith(
  caches
    .match(event.request)
    .then((response) => response || fetch(event.request))
))

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
