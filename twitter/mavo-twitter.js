(function($, $$) {

var TwitterWidgets = $.include("https://platform.twitter.com/widgets.js");

Mavo.hooks.add("markdown-render-before", function(env) {
	env.markdown = env.markdown.replace(/^\s*https:\/\/twitter.com\/\w{1,50}\/status\/\d+\s*$/gim, function(url) {
		return `<blockquote class="twitter-tweet"><a href="${url}">${url}</a></blockquote>`;
	});
});

document.addEventListener("mv-markdown-render", function(evt) {
	TwitterWidgets.then(() => twttr.widgets.load(evt.target));
});

})(Bliss, Bliss.$);
