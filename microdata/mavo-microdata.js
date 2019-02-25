(function($, $$) {

Mavo.Plugins.register("microdata");

Mavo.ready.then(function() {
	$$("[mv-app] [itemprop]:not([property])").forEach(function(element) {
		element.setAttribute("property", element.getAttribute("itemprop"));
	});

	$$("[mv-app] [itemtype]:not([typeof]):not([mv-group]), [mv-app] [itemscope]:not([typeof]):not([mv-group])").forEach(function(element) {
		element.setAttribute("typeof", element.getAttribute("itemtype") || "");
	});
});

})(Bliss, Bliss.$);
