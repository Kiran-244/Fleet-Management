var CACHE="fleet-mileage-v4";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit||fetch(e.request).then(function(r){
      var copy=r.clone(); caches.open(CACHE).then(function(c){c.put(e.request,copy)}); return r;
    }).catch(function(){return caches.match("index.html")});
  }));
});
