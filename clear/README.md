# Clear toolbar button

The plugin adds a clear toolbar button as **optional**.
Therefore, after including the plugin, you need to add the clear button to the Mavos you want via `mv-bar="with clear"` or, if you want a custom label, by including it in the HTML, like so:

```html
<div class="mv-bar mv-ui">
	<button class="mv-clear">Reset</button>
</div>
```

Note: Clearing a collection will not empty it, it will return it to the same state it had before any data was stored, i.e. having one item with its data taken from the HTML.

## Demo

```markup
<div mv-app mv-storage="local"
     mv-bar="with clear" mv-plugins="clear">
	<h2 property="heading">Heading</h2>
	<p property="paragraph" mv-multiple>Lorem Ipsum</p>
</div>
```
