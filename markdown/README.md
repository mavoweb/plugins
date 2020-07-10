# Mavo Markdown

To use, either give a class of `markdown` to the property you want to enable Markdown on, or specify a Markdown file as your data. Both of these are used in this page, so you can View Source for another example.

## Demo

```markup
<div mv-app mv-storage="local" 
     mv-plugins="markdown">
	<div property="text" class="markdown">### Heading
**This is bold** *This is italic* 
Here’s a [link!](https://mavo.io)

And some code `foo.bar();`
	</div>
</div>
```

## Keyboard shortcuts

This plugin supports some basic keyboard shortcuts:

Mac  | Windows | Result |
-----|---------|--------|
⌘ + B|CTRL + B |Make highlighted text **bold**.|
⌘ + I|CTRL + I |Make highlighted text *italic*.|
⌘ + K|CTRL + K |Convert highlighted text into a link or insert a placeholder for a link. In either case, you should provide a URL.|

## Image upload

If you are using one of the backends that support uploads such as Github, Dropbox, or Firebase, you can paste an image *from the clipboard* right into the text. The plugin will upload it automatically.

The plugin also supports the `mv-upload-path` and `mv-upload-url` attributes. For more information, see the [Uploads](https://mavo.io/docs/storage#uploads) section of the Mavo docs.

## Customize conversion to HTML

Showdown supports [a number of options for customizing the way it converts Markdown to HTML](https://github.com/showdownjs/showdown#valid-options). You can specify these options on a per-property basis by using the `mv-markdown-options` attribute.
The syntax of this attribute is a CSS-like list of declarations, where you can use either commas or semicolons to separate the option-value pairs. If you just want to set an option to `true`, you can just provide no value.
Also, if you use this attribute, you can omit the `markdown` class from your element, it's not needed.

<h2 hidden id="demo">Demo</h2>

```markup
<div mv-app mv-storage="local"  mv-plugins="markdown">
	<div property="text" 
	     mv-markdown-options="headerLevelStart: 3, tasklists">
# Heading

- [x] This task is done
- [ ] This is still pending
	</div>
</div>
```

<h2 class=advanced> Advanced customization: Events and Hooks</h2>

If you wish to modify the HTML produced, this plugin fires an `mv-markdown-render` event on the property element that is markdown-enabled right after it converts the Markdown to HTML and renders it. The current Plugins directory uses this for the live demos, you can find the [code here](https://github.com/mavoweb/plugins/blob/master/plugin/plugin.js#L9).

To further modify how Markdown is converted to HTML, this plugin adds three [hooks](https://mavo.io/docs/plugins/#hooks):

Name | Details |
----------|------------------
`markdown-editor-create` | Allows you to modify the textarea for editing (via `env.editor`)
`markdown-render-before` | Called before converting Markdown to HTML. Allows you to modify the Markdown via `env.markdown`. This plugin directory uses this for note and tip paragraphs ([code](https://github.com/mavoweb/plugins/blob/master/plugin/plugin.js#L5)). 
`markdown-render-after` | Called after converting to Markdown to HTML but before applying it to the page. Allows you to modify the HTML via `env.html`. There is also `env.rawHTML` for the pre-sanitization HTML.

***Credits:** Besides [Showdown](http://showdownjs.github.io/demo/), this plugin also uses the awesome [DOMPurify](https://github.com/cure53/DOMPurify) library to filter the resulting HTML.*