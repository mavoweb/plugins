(function($, $$) {

Mavo.Plugins.register("importhtml", {
	ready: $.ready(function() {
		var properties = {
			"--mv-property": "property",
			"--mv-typeof": "typeof",
			"--mv-datatype": "datatype"
		};

		Mavo.attributes.forEach(name => {
			properties["--" + name] = name;
		});

		delete properties["--mv-plugins"];

		var propertyNames = Object.keys(properties);

		var selectors = [];

		for (var stylesheet of document.styleSheets) {
			try {
				var rules = stylesheet.cssRules;
			}
			catch (e) {}

			if (rules) {
				for (var rule of rules) {
					if (rule && rule.style && Mavo.Functions.intersects(propertyNames, Array.from(rule.style))) {
						selectors.push(rule.selectorText);
					}
				}
			}
		}

		if (selectors.length) {
			$.create("style", {
				textContent: `* {
					${propertyNames.map(name => `${name}: initial;`).join("\n\t")}
				}`,
				inside: document.head
			});

			$$(selectors.join(", ")).forEach(function(element) {
				var cs = getComputedStyle(element);

				for (var property in properties) {
					var value = cs.getPropertyValue(property).trim();
					var attribute = properties[property];

					if (value && !element.hasAttribute(attribute)) {
						value = value === "true"? "" : value;
						element.setAttribute(attribute, value);
					}
				}
			});
		}
	})
});

})(Bliss, Bliss.$);
