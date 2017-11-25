(function() {

var readme = $('[property="readme"]');

Mavo.hooks.add("markdown-render-before", function(env) {
	env.markdown = env.markdown.replace(/^(Note|Tip): /mi, function($0, $1) {
		return "<p class=" + $1.toLowerCase() + ">";
	});
});

$.events(readme, "mv-markdown-render", function(evt) {
	// Create live demos
	$$("h2[id^=demo] + pre > code.language-markup, h2[id^=demo] + p + pre > code.language-markup", readme).forEach(function(code) {
		var markup = code.textContent;
		var pre = code.parentNode;

		var iframe = $.create("iframe", {
			srcdoc: `<!DOCTYPE html>
<head>
	<link rel="stylesheet" href="https://get.mavo.io/mavo.css" />
	<script src="https://get.mavo.io/mavo.js"></script>
</head>
<body>
${markup}
</body>
`
		});

		$.create({
			className: "example side-by-side",
			around: pre
		});

		$.create({
			className: "demo-container",
			around: pre
		});

		$.create({
			className: "example-container",
			contents: iframe,
			after: pre
		});
	});

	// Highlight code areas
	requestAnimationFrame(() => {
		$$("code", readme).forEach(function(element) {
			Prism.highlightElement(element);
		});
	});
});

$.events($('[mv-app="plugin"]'), "mv-load", function(evt) {
	$$(".github-buttons > a").forEach(function(a) {
		a.classList.add("github-button");
	});

	requestAnimationFrame(function() {
		$.include("https://buttons.github.io/buttons.js");
	});
});

})();
