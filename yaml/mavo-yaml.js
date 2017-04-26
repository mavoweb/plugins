(function() {

var _ = Mavo.Formats;

_.Yaml = $.Class({
	extends: _.Base,
	static: {
		extensions: [".yaml", ".yml"],
		loadOptions: {
			json: true
		},
		dumpOptions: {},
		dependencies: [{
			test: () => self.jsyaml,
			url: "https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.8.3/js-yaml.min.js"
		}],
		ready: _.Base.ready,
		parse: serialized => _.Yaml.ready().then(() => jsyaml.safeLoad(serialized, _.Yaml.loadOptions)),
		stringify: data => _.Yaml.ready().then(() => jsyaml.safeDump(data, _.Yaml.dumpOptions))
	}
});

Mavo.Plugins.register("yaml");

})();
