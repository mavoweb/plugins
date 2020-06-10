(function($, $$) {

Mavo.Plugins.register("gist");

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Github Gist",
	constructor: function() {
		this.permissions.on(["login", "read"]);

		this.key = this.mavo.element.getAttribute("mv-github-key") || "7e08e016048000bc594e";

		// Extract info for username, repo, branch, filepath from URL
		var extension = this.format.constructor.extensions[0] || ".json";

		this.defaults = {
			filename: `${this.mavo.id}${extension}`
		};

		this.info = _.parseURL(this.source, this.defaults);
		$.extend(this, this.info);

		this.login(true);
	},

	update: function(url, o) {
		this.super.update.call(this, url, o);

		this.info = _.parseURL(this.source, this.defaults);
		$.extend(this, this.info);
	},

	get: function(url) {
		if (this.isAuthenticated()) {
			// Authenticated API call
			var info = url? _.parseURL(url) : this.info;

			return info.gistId? this.request(`gists/${info.gistId}`, {}, "GET")
				.then(data => {
					let files = data.files;

					if (info.filename && (info.filename in files)) {
						return files[info.filename].content;
					}
					else {
						// Requested filename not found, just return the first file
						let file = Object.values(files)[0];
						info.filename = file.filename;
						return file.content;
					}
				}) : Promise.resolve(null);
		}
		else {
			// Unauthenticated, use simple GET request to avoid rate limit
			let filename = this.filename === this.defaults.filename? "" : this.filename + "/";
			url = new URL(`https://gist.githubusercontent.com/${this.username}/${this.gistId}/raw/${filename}`);
			url.searchParams.set("timestamp", Date.now()); // ensure fresh copy

			return $.fetch(url.href).then(xhr => Promise.resolve(xhr.responseText), () => Promise.resolve(null));
		}
	},

	/**
	 * Saves a file to the backend.
	 * @param {String} serialized - Serialized data
	 * @param {String} path - Optional file path
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: async function(serialized) {
		let apiCall = "gists";
		let gistId = this.info.gistId;

		if (gistId) {
			if (!this.canPush()) {
				// Fork gist
				let gistInfo = await this.request(`gists/${this.info.gistId}/forks`, {}, "POST");
				this.info.username = gistInfo.owner.login;
				this.info.gistId = gistInfo.id;
			}

			apiCall += "/" + this.info.gistId;
		}

		return this.request(apiCall, {
			files: {
				[this.filename]: {
					content: serialized
				}
			},
			public: true
		}, "POST").then(gistInfo => {
			this.info.gistId = gistInfo.id;

			if (this.info.gistId !== gistId) {
				// New gist created (or forked), update URL
				let url = new URL(location);
				let param = "storage";

				if (this.mavo.index !== 1) {
					param = this.mavo.id + "-" + param;
				}

				url.searchParams.set(param, `https://gist.github.com/${this.info.username}/${this.info.gistId}`);
				history.pushState("", null, url);
			}
		});
	},

	async login (passive) {
		let user = await Mavo.Backend.Github.prototype.login.call(this, passive);

		if (this.user) {
			this.permissions.on(["edit", "save"]);
		}
	},

	canPush: function() {
		// Just check if authenticated user is the same as our URL username
		// A gist can't have multiple collaborators
		return this.user && this.user.username.toLowerCase() == this.username.toLowerCase();
	},

	oAuthParams: () => "&scope=gist",
	logout: Mavo.Backend.Github.prototype.logout,
	getUser: Mavo.Backend.Github.prototype.getUser,

	static: {
		apiDomain: Mavo.Backend.Github.apiDomain,
		oAuth: Mavo.Backend.Github.oAuth,

		test: function(url) {
			url = new URL(url, Mavo.base);
			return url.host === "gist.github.com";
		},

		/**
		 * Parse Gist URLs, return username, gist id, filename
		 */
		parseURL: function(source, {filename} = {}) {
			var ret = {};
			var url = new URL(source, Mavo.base);
			var path = url.pathname.slice(1).split("/");

			ret.username = path.shift();
			ret.gistId = path.shift();

			if (ret.gistId === "NEW") {
				ret.gistId = undefined;
			}

			ret.filename = path.pop() || filename;

			return ret;
		}
	}
}));

})(Bliss, Bliss.$);
