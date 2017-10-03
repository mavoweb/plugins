(function() {

Mavo.Plugins.register("clear", {
	dependencies: [
		"mavo-clear.css"
	],
	extend: {
		Mavo: {
			clear: function() {
				if (confirm(this._("delete-confirmation"))) {
					this.store(null).then(() => this.root.clear());
				}
			}
		},
		Node: {
			clear: function() {
				if (this.modes != "read") {
					this.propagate("clear");
				}
			}
		},
		Collection: {
			/**
			 * Delete all items in the collection. Not undoable.
			 */
			clear: function() {
				if (this.modes == "read") {
					return;
				}

				if (this.mutable) {
					for (var i = 1, item; item = this.children[i]; i++) {
						item.element.remove();
						item.destroy();
					}

					this.children = this.children.slice(0, 1);

					this.dataChanged("clear");
				}

				this.propagate("clear");
			}
		},
		Primitive: {
			clear: function() {
				if (this.modes != "read") {
					this.value = this.templateValue;
				}
			}
		}
	}
});

Mavo.UI.Bar.controls.clear = {
	action: function() {
		this.clear();
	},
	permission: "delete",
	optional: true
};

Mavo.Locale.register("en", {
	"clear": "Clear",
	"delete-confirmation": "This will delete all your data. Are you sure?"
});

})();
