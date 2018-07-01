(function($, $$) {

var TwitterWidgets = $.include("https://platform.twitter.com/widgets.js");

Mavo.Plugins.register("twitter", { widgets: TwitterWidgets });

Mavo.hooks.add("markdown-render-before", function(env) {
	if (env.markdown) {
		env.markdown = env.markdown.replace(/^\s*https:\/\/twitter.com\/\w{1,50}\/status\/\d+\s*$/gim, function(url) {
			return `<blockquote class="twitter-tweet"><a href="${url}">${url}</a></blockquote>`;
		});
	}
});

document.addEventListener("mv-markdown-render", function(evt) {
	TwitterWidgets.then(function() {
		Mavo.Plugins.loaded.twitter.rendered = twttr.widgets.load(evt.target);
	});
});

})(Bliss, Bliss.$);
