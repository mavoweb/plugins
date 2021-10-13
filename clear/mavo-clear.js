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
				this.propagate("clear");
			}
		},
		Group: {
			clear: function() {
				// Delete invisible properties
				let hasInvisible = false;

				for (let prop in this.data) {
					if (!(prop in this.children)) {
						hasInvisible = true;
						delete this.data[prop];
						delete this.liveData.data[prop];
					}
				}

				this.propagate("clear");

				if (hasInvisible) {
					this.dataChanged("clear");
				}
			}
		},
		Collection: {
			/**
			 * Delete all items in the collection. Not undoable.
			 */
			clear: function() {
				this.render([]);

				if (this.initializeData) {
					this.initializeData();
				}

				this.propagate("clear");
			}
		},
		Primitive: {
			clear: function() {
				this.render(this.initialValue);
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
