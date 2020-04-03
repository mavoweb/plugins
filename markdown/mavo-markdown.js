(function($, $$) {

const SELECTOR = ".markdown, [mv-markdown-options]";
const CMD = navigator.platform.indexOf("Mac") === 0? "metaKey" : "ctrlKey";

Mavo.Plugins.register("markdown", {
	ready: Promise.all([
		$.include(self.showdown, "https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.2/showdown.min.js"),
		$.include(self.DOMPurify, "https://cdnjs.cloudflare.com/ajax/libs/dompurify/1.0.2/purify.min.js")
	]),
	init: function() {
		showdown.setFlavor("github");
		self.Showdown = new showdown.Converter();
	},
	hooks: {
		"init-start": function() {
			// Disable expressions on Markdown properties, before expressions are parsed
			for (var element of $$(SELECTOR, this.element)) {
				if (element.matches(Mavo.selectors.primitive)) {
					element.setAttribute("mv-expressions", element.getAttribute("mv-expressions") || "none");
				}
			}
		}
	},
	render: function(element, markdown, showdown = Showdown) {
		var env = {element, markdown};
		Mavo.hooks.run("markdown-render-before", env);

		env.rawHTML = showdown.makeHtml(env.markdown);
		env.html = DOMPurify.sanitize(env.rawHTML);
		Mavo.hooks.run("markdown-render-after", env);

		element.innerHTML = env.html;

		requestAnimationFrame(function() {
			$.fire(element, "mv-markdown-render");
		});
	}
});

Mavo.Elements.register("markdown", {
	default: true,
	selector: SELECTOR,
	hasChildren: true,
	init: function() {
		var options = this.element.getAttribute("mv-markdown-options");

		if (options && !this.fromTemplate("showdown")) {
			this.showdown = new showdown.Converter(Mavo.options(options));
			this.showdown.setFlavor("github");
		}
	},
	editor: function() {
		var env = {context: this};
		env.editor = $.create("textarea");
		env.editor.style.whiteSpace = "pre-wrap";

		var width = this.element.offsetWidth;

		if (width) {
			env.editor.width = width;
		}

		// Keyboard shortcuts
		env.editor.addEventListener("keydown", evt => {
			if (evt[CMD]) {
				var t = evt.target;
				var text = t.value.slice(t.selectionStart, t.selectionEnd);
				var hadSelection = t.selectionStart != t.selectionEnd;
				var newText;

				if (evt.key == "k") {
					newText = "[" + text + "]()";
					document.execCommand("insertText", false, newText);

					if (hadSelection) {
						// Place caret inside the parens
						t.selectionStart = t.selectionEnd = t.selectionEnd - 1;
					}
					else {
						// Place caret inside the braces
						t.selectionStart = t.selectionEnd = t.selectionEnd - 3;
					}
				}
				else {
					if (evt.key === "b") {
						newText = "**" + text + "**";
					}
					else if (evt.key == "i") {
						newText = "*" + text + "*";
					}

					if (newText && newText != text) {
						document.execCommand("insertText", false, newText);

						if (hadSelection) {
							// By default inserText places the caret at the end, losing any selection
							// What we want instead is the replaced text to be selected
							t.selectionStart = t.selectionEnd - newText.length;
						}
						else {
							t.selectionStart = t.selectionEnd = t.selectionEnd - 2;
						}
					}
				}
			}
		});

		Mavo.hooks.run("markdown-editor-create", env);

		return env.editor;
	},
	done: function() {
		// Has it actually been edited?
		this.preEdit && this.preEdit.then(function() {
			Mavo.Plugins.loaded.markdown.render(this.element, this.value, this.showdown);
		}.bind(this));
	},
	setValue: function(element, value) {
		if (this.editor) {
			this.editor.value = value;
		}
		else {
			Mavo.Plugins.loaded.markdown.render(this.element, value, this.showdown);
		}
	},
	// We don't need an observer and it actually causes problems as it tries to feed HTML changes back to MD
	observer: false
});

Mavo.Formats.Markdown = $.Class({
	extends: Mavo.Formats.Base,
	constructor: function(backend) {
		this.property = this.mavo.root.getNames("Primitive")[0];
		var primitive = this.mavo.root.children[this.property];
		primitive.config = Mavo.Elements.markdown;
	},

	static: {
		extensions: [".md", ".markdown"],
		parse: Mavo.Formats.Text.parse,
		stringify: Mavo.Formats.Text.stringify
	}
});

})(Bliss, Bliss.$);
