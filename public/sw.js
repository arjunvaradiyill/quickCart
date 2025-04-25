// Minimal service worker for Razorpay support only
// This service worker is designed to NOT interfere with Razorpay payment processing

const CACHE_NAME = 'vercelecom-v3';

// Install event - activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Minimal service worker installed');
});

// Fetch event - ignore all Razorpay requests and avoid caching
self.addEventListener('fetch', (event) => {
  // Don't do anything with Razorpay URLs
  if (event.request.url.includes('razorpay.com')) {
    // Pass through all Razorpay requests
    return;
  }
  
  // Handle manifest.json specially to avoid PWA prompts
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      new Response(JSON.stringify({
        "name": "Vercelecom",
        "short_name": "Vercelecom",
        "description": "E-commerce application",
        "start_url": "/",
        "display": "browser",
        "background_color": "#ffffff",
        "theme_color": "#dc2626",
        "icons": []
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
    return;
  }
  
  // For payment-related requests, let them bypass the service worker
  if (event.request.url.includes('/api/payment/') ||
      event.request.url.includes('/order/') ||
      event.request.url.includes('/checkout/')) {
    return;
  }
  
  // For all other requests, use network first strategy without caching
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Network error', { status: 503 });
    })
  );
});

// Activate event - take control immediately and clear caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Delete all caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
      // Take control of all clients
      return self.clients.claim();
    })
  );
}); 