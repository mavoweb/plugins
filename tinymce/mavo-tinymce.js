(function($) {

Mavo.Plugins.register("tinymce", {
	ready: $.include(self.tinymce, "https://cdn.tinymce.com/4/tinymce.min.js")
});

Mavo.Elements.register(".tinymce", {
	hasChildren: true,
	default: true,
	edit: function() {
		this.preEdit.then(evt => {
			if (this.tinymce) {
				// Previously edited, we already have an editor
				tinymce.EditorManager.execCommand("mceAddEditor", true, this.tinymce.id);
				return;
			}

			// Init for the first time
			tinymce.init({
				target: this.element,
				inline: true,
				menubar: false,
				toolbar: "styleselect | bold italic | image link | table | bullist numlist",
				plugins: "image code link table lists media tabfocus"
			}).then(editors => {
				this.tinymce = editors[0];

				this.tinymce.on("change", evt => {
					this.value = this.getValue();
				});
			});
		});
	},
	done: function() {
		if (this.tinymce) {
			tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.tinymce.id);
		}
	},
	getValue: element => element.innerHTML,
	setValue: (element, value) => element.innerHTML = value
});

})(Bliss);
