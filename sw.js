/* La Meute CrossFit : ouverture de l'appli même sans réseau */
var CACHE="meute-v22";
var CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./favicon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function timeout(p,ms){return new Promise(function(ok,ko){var t=setTimeout(function(){ko(new Error("timeout"))},ms);p.then(function(r){clearTimeout(t);ok(r)},function(e){clearTimeout(t);ko(e)})})}
function put(req,res){if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp)})}return res}
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);
 if(u.origin===self.location.origin){
  if(r.mode==="navigate"){e.respondWith(timeout(fetch(r),5000).then(function(res){return put("./index.html",res)}).catch(function(){return caches.match("./index.html").then(function(m){return m||caches.match("./")})}));return}
  e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){return put(r,res)})}));return}
 if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){return put(r,res)})}))}
});
/* Notifications push */
self.addEventListener("push",function(e){var d={};try{d=e.data?e.data.json():{}}catch(er){d={title:"La Meute CrossFit",body:e.data?e.data.text():""}}
 e.waitUntil(self.registration.showNotification(d.title||"La Meute CrossFit",{body:d.body||"",tag:d.tag||undefined,renotify:!!d.tag,icon:"icon-192.png",badge:"favicon.png",data:{url:d.url||"./"}}))});
self.addEventListener("notificationclick",function(e){e.notification.close();var u=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
 e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){for(var i=0;i<cs.length;i++){var c=cs[i];if(c.url.indexOf(self.registration.scope)===0&&"focus" in c){c.postMessage({nav:u});return c.focus()}}return self.clients.openWindow(u)}))});
