(function() {

if (!self.document) {
	// We're in a service worker! Oh man, we’re living in the future! 🌈🦄
	if (location.hostname === "localhost") {
		// We're testing locally, use local URLs for Mavo
		self.addEventListener("fetch", function(evt) {
			var url = evt.request.url;

			if (url.indexOf("get.mavo.io/mavo.") > -1 || url.indexOf("dev.mavo.io/dist/mavo.") > -1) {
				var newURL = url.replace(/.+?(get|dev)\.mavo\.io\/(dist\/)?/, "http://localhost:8000/dist/") + "?" + Date.now();
			}
			else if (/plugins.mavo.io\/(\w+)\/(?:mavo-\1.js|mavo-\1.css|README.md)$/.test(url)) {
				var newURL = new URL(url);
				newURL.host = location.host;
				newURL.protocol = location.protocol;
				newURL += "";
			}
			else if (/\/plugin\/\w+\/?$/.test(url)) {
				// Doesn't currently work :(
				var newURL = url.replace("/plugin/", "/plugin/?plugin=");
			}

			if (newURL) {
				var response = fetch(new Request(newURL), evt.request)
					.then(r => r.status < 400? r : Promise.reject())
					.catch(err => fetch(evt.request)); // if that fails, return original request

				evt.respondWith(response);
			}
		});
	}

	return;
}

var src = document.currentScript ? document.currentScript.src : "sitewide.js";

if ("serviceWorker" in navigator) {
	// Register this script as a service worker
	addEventListener("load", function() {
		navigator.serviceWorker.register(src);
	});
}


})();
