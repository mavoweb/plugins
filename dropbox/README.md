# Dropbox

The [Dropbox](https://dropbox.com) backend provides remote storage, and may be useful for people without a [Github](https://github.com) account. Just like the [Github backend](https://mavo.io/docs/storage#github), it takes care of authentication, and only provides editing and saving controls to users that have appropriate permissions.

Unlike with Github, Mavo *cannot create the file for you if it does not exist*. To start using it, you need to create an empty file with a `.json` extension, and add it to your Dropbox. Then, in the Dropbox application, click “Share” and copy the link it gives you (you may need to click “Copy Link” to get to it). It will look like `https://www.dropbox.com/s/5fsvey23bi0v8lf/myfile.json?dl=0`. This link is what you will use in the `mv-storage` attribute:

```html
<div mv-app mv-storage="https://www.dropbox.com/s/5fsvey23bi0v8lf/myfile.json?dl=0">
	...
</div>
```
