"use strict";importScripts("./sw-toolbox.js"),self.toolbox.options.cache={name:"phys-player",version:"5.1.5"},self.toolbox.precache([]),self.toolbox.router.any("/assets/*",self.toolbox.cacheFirst),self.toolbox.router.any("/*.js",self.toolbox.cacheFirst,{origin:"wuliplayercdn.nobook.com"}),self.toolbox.router.default=self.toolbox.networkFirst,self.addEventListener("install",function(e){console.log("~~~service-worker installed"),self.skipWaiting(),self.dispatchEvent(new Event("controllerchange"))}),self.addEventListener("activate",function(e){return e.waitUntil(self.clients.claim())});