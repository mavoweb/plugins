(function ($, $$) {

Mavo.Plugins.register({
	name: "revert",
	extend: {
		Mavo: {
			revert: function() {
				this.root.revert();
			},
		},
		Node: {
			revert: function() {
				this.propagate("revert");
			}
		},
		Collection: {
			revert: function() {
				for (let item of this.children) {
					// Delete added items
					if (item.unsavedChanges) {
						this.delete(item, true);
					}
					else {
						// Bring back deleted items
						if (item.deleted) {
							item.deleted = false;
						}

						// Revert all properties
						item.revert();
					}
				}
			},
		},
		Primitive: {
			revert: function() {
				if (this.unsavedChanges && this.savedValue !== undefined) {
					// FIXME if we have a collection of properties (not groups), this will cause
					// cancel to not remove new unsaved items
					// This should be fixed by handling this on the collection level.
					this.value = this.savedValue;
					this.unsavedChanges = false;
				}
			},
		}
	},

	hooks: {
		"init-end": function() {
			this.permissions.can("save", () => {
				if (!this.autoSave) {
					// Revert is pointless if autosaving, there's not enough time between saves to click it
					this.ui.revert = $.create("button", {
						className: "mv-revert",
						textContent: "Revert",
						title: "Revert",
						disabled: true,
						inside: this.ui.bar
					});
				}
			}, () => {
				$.remove(this.ui.revert);
				this.ui.revert = null;
			});

			$.delegate(this.element, "click", {
				".mv-revert": evt => {
					if (this.permissions.save) {
						this.revert();
					}
				}
			});
		}
	}
});

})(Bliss, Bliss.$);
