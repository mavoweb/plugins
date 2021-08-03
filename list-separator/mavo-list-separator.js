Mavo.Plugins.register("list-separator", {
	hooks: {
		"collection-init-end": function() {
			this.separator = this.element.getAttribute("mv-list-separator");

			if (["\\n", "\\r", "\\r\\n"].includes(this.separator)) {
				// Handle line breaks specially, parse any line break, store with detected line break
				this.separator = /\r?\n/g;
				this.joinSeparator = "\n"; // Default line break to join with
			}

			// TODO ignore separator if this is not a collection of primitives and print error
		},
		"node-getdata-end": function(env) {
			if (this instanceof Mavo.Collection && this.separator) {
				// Escape separator in data
				let data = env.data.map(s => (s + "").replaceAll(this.separator, "\\$&"));
				env.data = data.join(this.joinSeparator ?? this.separator);
			}
		},
		"node-render-start": function(env) {
			if (this instanceof Mavo.Collection && this.separator && env.data.split) {
				let separatorString = this.separator.source ?? this.separator;
				let separator = RegExp(`(?<!\\\\)${separatorString}`, "g");
				let data = env.data.split(separator);

				if (this.separator instanceof RegExp && data.length > 1) {
					// If the separator is a regexp, we need to store the first occurrence and use it to join when saving
					this.joinSeparator = env.data.match(separator)[0];
				}

				// Unescape separator in the data
				data = data.map(s => s.replace(RegExp(`\\\\(?=${separatorString})`, "g"), ""));
				env.data = data;
			}
		}
	}
});
