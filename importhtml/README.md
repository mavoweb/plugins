# Import HTML

This plugin allows you to set Mavo attributes (e.g. `property`, `mv-multiple` etc) via CSS properties.
Because CSS selectors are great at handling HTML elements en masse, this means you can use it to import data from your existing HTML, scrape data from HTML, or anything else you can think of!

## Names and syntax of CSS properties

Every CSS property this plugin defines starts with `--mv-`, whether the corresponding attribute starts with `mv-` or not.
This means that e.g. `property` becomes `--mv-property` and `mv-multiple` becomes `--mv-multiple`.

Their values are the same as the corresponding attributes (no quotes), with one exception:
Attributes without values (like `mv-multiple`) would need a value of `true`.

## Example

Let's suppose you have some HTML like the following, that you’d like to turn into a Mavo app:

```html
<div id="main">
	<article>
		<h1>Heading1</h1>
		<p>Content1</p>
	</article>
	<article>
		<h1>Heading2</h1>
		<p>Content2</p>
	</article>
	<article>
		<h1>Heading3</h1>
		<p>Content3</p>
	</article>
	<article id="foo">
		<h1>Heading4</h1>
		<p>Content4</p>
	</article>
	<article>
		<h1>Heading5</h1>
		<p>Content5</p>
	</article>
	...
</div>
```

You *could* add `property` and `mv-multiple` attributes to every `<article>`, `<h1>` or `<p>` element there and it would work, but it would be a huge hassle. Thankfully, you don’t have to do that! With this plugin, you can just add a few simple CSS rules:

```html
<style>
	#main {
		--mv-app: test;
		--mv-storage: local;
	}

	article {
		--mv-property: collection;
		--mv-multiple: true;
	}

	article h1 {
		--mv-property: title;
	}

	article p {
		--mv-property: content;
	}
</style>
```

Reload the page, save, done! Once you save, your data is imported wherever your `mv-storage` attribute is pointing.
You could now even delete the HTML (except the first item) or leave it there, up to you!

You can also mix and match attributes and CSS properties! The example above could also be written as follows.

<h2 hidden>Demo</h2>

```html
<style>
	article {
		--mv-property: collection;
		--mv-multiple: true;
	}

	article h1 {
		--mv-property: title;
	}

	article p {
		--mv-property: content;
	}
</style>
<div id="main" mv-app="test" mv-storage="local">
	<article>
		<h1>Heading1</h1>
		<p>Content1</p>
	</article>
	<article>
		<h1>Heading2</h1>
		<p>Content2</p>
	</article>
	<article>
		<h1>Heading3</h1>
		<p>Content3</p>
	</article>
	<article id="foo">
		<h1>Heading4</h1>
		<p>Content4</p>
	</article>
	<article>
		<h1>Heading5</h1>
		<p>Content5</p>
	</article>
	...
</div>
```

## Caveats

- The CSS that contains these properties **must** be either a `<style>` element or a CSS file **in the same domain**, otherwise the properties will be ignored (in some cases you may be able to get around this by using the [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) attribute on the `<link>` element).
- All this plugin really does is set the corresponding attributes on your actual HTML before Mavo reads them. If you use CSS to change the value of any of them (e.g. via a pseudo-class), the changes will **not** be applied.
- If you change the HTML after you have saved your data, the changes will be visible, unless they don't interfere with the data. E.g. in the example above, changing "Heading1" to "Foo Bar" after saving the data, would not have any effect. On the other hand, adding a class or id to any of the elements, or putting the `<p>` before the `<h1>` will work just fine.
