//// service worker file from chat gpt;
// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Precaching (if any)
// You can remove or comment out the following line if you don't want to precache anything
// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Custom network-only strategy
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkOnly()
);

// If you have other routes with specific strategies, you can add them here
// For example, you can keep the cache-first strategy for images if desired
// workbox.routing.registerRoute(
//   ({request}) => request.destination === 'image',
//   new workbox.strategies.CacheFirst({
//     cacheName: 'images-cache',
//     plugins: [
//       new workbox.cacheableResponse.CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new workbox.expiration.ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//       }),
//     ],
//   })
// );
