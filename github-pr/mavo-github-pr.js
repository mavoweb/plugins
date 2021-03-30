// @ts-check

(function () {
	"use strict";

	Mavo.Backend.Github.prototype.pullRequest = function (existing) {
		const previewURL = new URL(location);
		const message = this.mavo._("gh-edit-suggestion-saved-in-profile", { previewURL });

		let lastNoticeName = "";

		if (this.notice) {
			lastNoticeName = this.notice.options.name;
			this.notice.element.style.transition = "none";
			this.notice.close();
		}

		if (existing) {
			const style = lastNoticeName === "closePR" ? { animation: "none", transition: "none" } : {};

			this.notice = this.mavo.message(`${message}
				${this.mavo._("gh-edit-suggestion-notreviewed")}
				<form onsubmit="return false">
					<button class="mv-danger">${this.mavo._("gh-edit-suggestion-revoke")}</button>
				</form>`, {
				classes: "mv-inline",
				dismiss: ["button", "submit"],
				style: style,
				name: "closePR"
			});

			this.notice.element.style.transitionDuration = "400ms";

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				let username;
				let repo;

				if (this.repoInfo.fork) { // Storage points to current user's repo (but they want to close PR)
					username = this.repoInfo.parent.owner.login;
					repo = this.repoInfo.parent.name;
				}
				else { // Storage points to another user's repo
					username = this.username;
					repo = this.repo;
				}

				// Close PR
				this.request(`repos/${username}/${repo}/pulls/${existing.number}`, {
					state: "closed"
				}, "POST").then(prInfo => {
					new Mavo.UI.Message(this.mavo, `<a href="${prInfo.html_url}">${this.mavo._("gh-edit-suggestion-cancelled")}</a>`, {
						dismiss: ["button", "timeout"],
						style: style
					});

					this.pullRequest();
				});
			});
		}
		else {
			// Ask about creating a PR
			// We already have a pull request, ask about closing it
			const style = lastNoticeName === "createPR" ? { animation: "none", transition: "none" } : {};

			this.notice = this.mavo.message(`${message}
				${this.mavo._("gh-edit-suggestion-instructions")}
				<form onsubmit="return false">
					<textarea name="edits" class="mv-autosize" placeholder="${this.mavo._("gh-edit-suggestion-reason-placeholder")}"></textarea>
					<button>${this.mavo._("gh-edit-suggestion-send")}</button>
				</form>`, {
				classes: "mv-inline",
				dismiss: ["button", "submit"],
				style: style,
				name: "createPR"
			});
			this.notice.element.style.transitionDuration = "400ms";

			this.notice.closed.then(form => {
				if (!form) {
					return;
				}

				let username;
				let repo;
				let base;

				if (this.repoInfo.fork) { // Storage points to current user's repo (but they want to send PR)
					username = this.repoInfo.parent.owner.login;
					repo = this.repoInfo.parent.name;
					base = this.repoInfo.parent.default_branch;
				}
				else { // Storage points to another user's repo
					username = this.username;
					repo = this.repo;
					base = this.branch;
				}

				// We want to send a pull request
				this.request(`repos/${username}/${repo}/pulls`, {
					title: this.mavo._("gh-edit-suggestion-title"),
					body: this.mavo._("gh-edit-suggestion-body", {
						description: form.elements.edits.value,
						previewURL
					}),
					head: `${this.user.username}:${this.branch}`,
					base: base
				}, "POST").then(prInfo => {
					new Mavo.UI.Message(this.mavo, `<a href="${prInfo.html_url}">${this.mavo._("gh-edit-suggestion-sent")}</a>`, {
						dismiss: ["button", "timeout"],
						style: style
					});

					this.pullRequest(prInfo);
				});
			});
		}
	};

	Mavo.Plugins.register("github-pr", {
		hooks: {
			"gh-after-commit": function (env) {
				// Storage points to current user's repo (but maybe they want to submit PR)
				if (this.repoInfo.fork) {
					// Ask if they want to send PR
					this.forkInfo = this.repoInfo.parent;
					this.request(`repos/${this.repoInfo.parent.owner.login}/${this.repoInfo.parent.name}/pulls`, {
						head: `${this.user.username}:${this.branch}`,
						base: this.repoInfo.parent.default_branch
					}).then(prs => {
						this.pullRequest(prs[0]);
					});
				}
				// Storage points to another user's repo
				else if (this.forkInfo) {
					// Update url to include storage = their fork
					let params = (new URL(location)).searchParams;
					let prefix = `${this.mavo.id}-`;

					if (this.mavo.index === 1 && params.has("storage")) {
						prefix = "";
					}
					params.set(`${this.mavo.id}-storage`, env.fileInfo.content.download_url);

					// Why? If an author provides both mv-source and mv-storage, end-users won't see their data if we only change the storage location.
					// And since we don't want that, we must disable the source.
					if (this.mavo.source) {
						prefix = `${this.mavo.id}-`;

						if (this.mavo.index === 1 && params.has("source")) {
							prefix = "";
						}

						params.set(`${prefix}source`, "none");
					}

					history.pushState({}, "", `${location.pathname}?${params}`);
					location.replace(`${location.pathname}?${params}`);

					// We saved in a fork, do we have a pull request?
					this.request(`repos/${this.username}/${this.repo}/pulls`, {
						head: `${this.user.username}:${this.branch}`,
						base: this.branch
					}).then(prs => {
						this.pullRequest(prs[0]);
					});
				}
			},

			"gh-after-login": function (env) {
				if (env.repoInfo.fork) { // if current repo is a fork, we can display PR dialog
					this.forkInfo = env.repoInfo.parent;
					this.request(`repos/${env.repoInfo.parent.owner.login}/${env.repoInfo.parent.name}/pulls`, {
						head: `${this.user.username}:${this.branch}`,
						base: env.repoInfo.parent.default_branch
					}).then(prs => {
						this.pullRequest(prs[0]);
					});
				}
			}
		}
	});

	Mavo.Locale.register("en", {
		"gh-edit-suggestion-saved-in-profile": "Your edits are saved to <a href=\"{previewURL}\" target=\"_blank\">your own profile</a>, because you are not allowed to edit this page.",
		"gh-edit-suggestion-instructions": "Write a short description of your edits below to suggest them to the page admins:",
		"gh-edit-suggestion-notreviewed": "You have selected to suggest your edits to the page admins. Your suggestions have not been reviewed yet.",
		"gh-edit-suggestion-send": "Send edit suggestion",
		"gh-edit-suggestion-revoke": "Revoke edit suggestion",
		"gh-edit-suggestion-reason-placeholder": "I added / corrected / deleted ...",
		"gh-edit-suggestion-cancelled": "Edit suggestion cancelled successfully!",
		"gh-edit-suggestion-title": "Suggested edits to data",
		"gh-edit-suggestion-body": `Hello there! I used Mavo to suggest the following edits:
{description}
Preview my changes here: {previewURL}`,
		"gh-edit-suggestion-sent": "Edit suggestion sent successfully!"
	});
})();
