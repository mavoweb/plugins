# Github Gist

This plugin allows you to use Github Gists for storage, and even create new ones!

## Reading/writing gists

If you provide a Gist URL, e.g. `mv-storage="https://gist.github.com/username/gistid"` the first file from the gist will be loaded.
You can also provide a specific filename like `mv-storage="https://gist.github.com/username/gistid/filename"`

If the logged in user is not the same as the gist creator, the gist will be forked upon saving, and the URL will be updated to point to it (without a reload)

## Creating gists

You may also want each user to create their own gist for storing their data.
In that case, you can use `mv-storage="https://gist.github.com"`.
Upon saving, the URL will be updated so that storage points to their specific gist (without a reload).
