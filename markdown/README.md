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

<h2 class=advanced> Advanced customization: Events and Hooks</h2>

If you wish to modify the HTML produced, this plugin fires an `mv-markdown-render` event on the property element that is markdown-enabled right after it converts the Markdown to HTML and renders it. The current Plugins directory uses this for the live demos, you can find the [code here](https://github.com/mavoweb/plugins/blob/master/plugin/plugin.js#L9).

To further modify how Markdown is converted to HTML, this plugin adds three [hooks](https://mavo.io/docs/plugins/#hooks):

Name | Details |
----------|------------------
`markdown-editor-create` | Allows you to modify the textarea for editing (via `env.editor`)
`markdown-render-before` | Called before converting Markdown to HTML. Allows you to modify the Markdown via `env.markdown`. This plugin directory uses this for note and tip paragraphs ([code](https://github.com/mavoweb/plugins/blob/master/plugin/plugin.js#L5)). 
`markdown-render-after` | Called after converting to Markdown to HTML but before applying it to the page. Allows you to modify the HTML via `env.html`. There is also `env.rawHTML` for the pre-sanitization HTML.

***Credits:** Besides [Showdown](http://showdownjs.github.io/demo/), this plugin also uses the awesome [DOMPurify](https://github.com/cure53/DOMPurify) library to filter the resulting HTML.*