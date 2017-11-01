(function() {

var readme = $('[property="readme"]');

$.events(readme, "mavo:datachange", function(evt) {
	$$("code", readme).forEach(function(element) {
		Prism.highlightElement(element);
	});
});

$.events($('[mv-app="plugin"]'), "mavo:load", function(evt) {
	$$(".github-buttons > a").forEach(function(a) {
		a.classList.add("github-button");
	});

	requestAnimationFrame(function() {
		$.include("https://buttons.github.io/buttons.js");
	});
});

})();
