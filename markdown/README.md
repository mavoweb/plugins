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

***Credits:** Besides [Showdown](http://showdownjs.github.io/demo/), this plugin also uses the awesome [DOMPurify](https://github.com/cure53/DOMPurify) library to filter the resulting HTML.*