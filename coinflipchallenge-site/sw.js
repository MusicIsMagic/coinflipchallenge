/* Offline cache for Coin Flip Challenge. Bump VERSION when files change. */
var VERSION='cfc-v5';
var FILES=['/','/index.html','/play/','/play/index.html','/privacy.html','/site.css','/config.js','/manifest.webmanifest',
'/icons/favicon.svg','/icons/icon-192.png','/icons/icon-512.png','/icons/apple-touch-icon.png',
'/fonts/alfa-slab-one-latin-400-normal.woff2','/fonts/figtree-latin-400-normal.woff2','/fonts/figtree-latin-500-normal.woff2','/fonts/figtree-latin-600-normal.woff2','/fonts/figtree-latin-700-normal.woff2','/fonts/ibm-plex-mono-latin-500-normal.woff2','/fonts/ibm-plex-mono-latin-600-normal.woff2'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);if(u.origin!==location.origin)return;
  if(u.pathname.indexOf('/downloads/')===0)return; /* big files: always network */
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    return hit||fetch(e.request).then(function(r){var cp=r.clone();caches.open(VERSION).then(function(c){c.put(e.request,cp);});return r;});
  }));
});
