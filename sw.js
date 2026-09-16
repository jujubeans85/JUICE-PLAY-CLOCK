const SCOPE=new URL(self.registration.scope);
const PREFIX='juice-play-clock:'+SCOPE.pathname+':';
const CACHE=PREFIX+'v5';
const FILES=['./','./index.html','./style.css','./config.js','./app.js','./share.js','./trivia-data.js','./trivia.js','./trivia.css','./boss.webmanifest','./manifest.webmanifest','./icon-192.png','./icon-512.png','./clock-icon.svg','./boss-icon.svg','./clock-icon-192.png','./clock-icon-512.png','./boss-icon-192.png','./boss-icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||(new URL(e.request.url).origin!==SCOPE.origin||!new URL(e.request.url).pathname.startsWith(SCOPE.pathname)))return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'&&!r.redirected){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)))}return r}).catch(()=>caches.open(CACHE).then(c=>c.match('./index.html'))));return}e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(cached=>cached||fetch(e.request)))});
