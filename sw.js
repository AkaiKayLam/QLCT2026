const C='qlct-v4',A=['./','index.html','firebase-config.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(A)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=C).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!='GET'||new URL(r.url).origin!=location.origin)return;
  const u=new URL(r.url);
  const isDoc=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.endsWith('.js')||u.pathname.endsWith('sw.js');
  if(isDoc){
    e.respondWith(
      fetch(r).then(x=>{
        if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}
        return x;
      }).catch(()=>caches.match(r,{ignoreSearch:true}))
    );
    return;
  }
  e.respondWith(
    caches.match(r,{ignoreSearch:true}).then(m=>{
      const n=fetch(r).then(x=>{
        if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}
        return x;
      }).catch(()=>m);
      return m||n;
    })
  );
});
