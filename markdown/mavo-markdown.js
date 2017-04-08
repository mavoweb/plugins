(function($) {

Mavo.Plugins.register({
	name: "markdown",
	ready: $.include(self.showdown, "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.4/showdown.min.js"),
	init: function() {
		showdown.setFlavor("github");
		self.Showdown = new showdown.Converter();
	},
	hooks: {
		"init-start": function() {
			// Disable expressions on Markdown properties, before expressions are parsed
			var selector = Mavo.selectors.and(Mavo.selectors.primitive, ".markdown");
			for (let element of $$(selector, this.element)) {
				element.setAttribute("mv-expressions", element.getAttribute("mv-expressions") || "none");
			}
		}
	}
});

Mavo.Elements.register(".markdown", {
	default: true,
	init: function() {
		this.element.setAttribute("mv-expressions", "none");
		requestAnimationFrame(() => this.done());
	},
	editor: function() {
		var editor = $.create("textarea");

		var width = this.element.offsetWidth;

		if (width) {
			editor.width = width;
		}

		return editor;
	},
	done: function() {
		this.element.innerHTML = Showdown.makeHtml(this.value);
	},
	// getValue: function(element) {
	// 	return this.editor? this.editor.value : this._value;
	// },
	// setValue: function(element, value) {
	// 	if (this.editor) {
	// 		this.editor.value = value;
	// 	}
	// }
});

})(Bliss);
