(function() {

$.events($('[mv-app="plugin"]'), "mv-load", function(evt) {
	$$(".github-buttons > a").forEach(function(a) {
		a.classList.add("github-button");
	});

	requestAnimationFrame(function() {
		$.include("https://buttons.github.io/buttons.js");
	});
});

})();
