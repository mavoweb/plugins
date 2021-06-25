(function($) {

// List of all supported controls
// in the form of "control: plugin/core"
const allControls = {
	newdocument: "core",
	bold: "core",
	italic: "core",
	underline: "core",
	strikethrough: "core",
	alignleft: "core",
	aligncenter: "core",
	alignright: "core",
	alignjustify: "core",
	alignnone: "core",
	styleselect: "core",
	formatselect: "core",
	fontselect: "core",
	fontsizeselect: "core",
	cut: "core",
	copy: "core",
	paste: "core",
	outdent: "core",
	indent: "core",
	blockquote: "core",
	undo: "core",
	redo: "core",
	removeformat: "core",
	subscript: "core",
	superscript: "core",
	visualaid: "core",
	insert: "core",
	hr: "hr",
	bullist: "lists",
	numlist: "lists",
	link: "link",
	unlink: "link",
	openlink: "link",
	image: "image",
	charmap: "charmap",
	pastetext: "paste",
	print: "print",
	preview: "preview",
	anchor: "anchor",
	pagebreak: "pagebreak",
	spellchecker: "spellchecker",
	searchreplace: "searchreplace",
	visualblocks: "visualblocks",
	visualchars: "visualchars",
	code: "code",
	help: "help",
	fullscreen: "fullscreen",
	insertdatetime: "insertdatetime",
	media: "media",
	nonbreaking: "nonbreaking",
	save: "save",
	cancel: "save",
	table: "table",
	tabledelete: "table",
	tablecellprops: "table",
	tablemergecells: "table",
	tablesplitcells: "table",
	tableinsertrowbefore: "table",
	tableinsertrowafter: "table",
	tabledeleterow: "table",
	tablerowprops: "table",
	tablecutrow: "table",
	tablecopyrow: "table",
	tablepasterowbefore: "table",
	tablepasterowafter: "table",
	tableinsertcolbefore: "table",
	tableinsertcolafter: "table",
	tabledeletecol: "table",
	rotateleft: "imagetools",
	rotateright: "imagetools",
	flipv: "imagetools",
	fliph: "imagetools",
	editimage: "imagetools",
	imageoptions: "imagetools",
	fullpage: "fullpage",
	ltr: "directionality",
	rtl: "directionality",
	emoticons: "emoticons",
	template: "template",
	forecolor: "textcolor",
	backcolor: "textcolor",
	toc: "toc"
};

const defaultToolbar = "styleselect | bold italic | image link | table | bullist numlist"

let parser, serializer;

Mavo.Plugins.register("tinymce", {
	ready: $.include(self.tinymce, "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.11/tinymce.min.js").then(() => {
		parser = new tinymce.html.DomParser();
		serializer = new tinymce.html.Serializer();
	})
});

Mavo.Elements.register(".tinymce", {
	hasChildren: true,
	default: true,
	edit: function() {
		(this.preEdit || Promise.resolve()).then(v => {
			if (v === "abort") {
				return;
			}

			if (this.element.tinymce) {
				// Previously edited, we already have an editor
				tinymce.EditorManager.execCommand("mceAddEditor", true, this.element.tinymce.id);
				return;
			}

			const toolbar = this.element.getAttribute("mv-tinymce-toolbar")?.trim() || defaultToolbar;

			// Parse the passed-in toolbar
			const groups = toolbar.split("|").filter(g => g.length);
			const controls = groups.join(" ").split(/\s+/);

			// Generate a set of all the plugins that must be downloaded
			const plugins = new Set()
			plugins.add("tabfocus"); // "tabfocus" is the required plugin

			controls.forEach(control => {
				const plugin = allControls[control];

				if (!plugin) {
					Mavo.warn(`Button with the name "${control}" can't be added to the toolbar since it is not supported by the TinyMCE plugin.`);
					return;
				}

				plugins.add(plugin)
			});

			// There is no plugin with the name "core", so we must delete it
			plugins.delete("core");

			// Init for the first time
			tinymce.init({
				target: this.element,
				inline: true,
				menubar: false,
				toolbar,
				plugins: Array.from(plugins).join(" ") // "plugin plugin ... plugin"
			}).then(editors => {
				this.element.tinymce = editors[0];

				this.element.tinymce.on("change keyup paste cut", evt => {
					this.value = this.getValue();
				});
			});
		});
	},
	done: function() {
		if (this.element.tinymce) {
			tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.element.tinymce.id);
		}
	},
	getValue: (element) => {
		return element.tinymce ? element.tinymce.getContent() : element.innerHTML;
	},
	setValue: (element, value) => {
		const content = serializer.serialize(parser.parse(value));

		if (!element.tinymce) {
			element.innerHTML = content;
		}
		else if (element.tinymce.isHidden()) {
			element.tinymce.setContent(content);
		}
	}
});

})(Bliss);
