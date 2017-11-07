# Greek localization

To use, simply include the plugin and then use `lang="el"` on your Mavo root, or the `<html>` element.

## Demo (Local storage)

```markup
<div mv-app mv-plugins="locale-el" lang="el" mv-storage="local">
	<strong property="όνομα">Lea Verou</strong>
	Χόμπι: <span property="χόμπι" mv-multiple>Cooking</span>
</div>
```

## Demo (Github storage)

```markup
<div mv-app="countries" mv-plugins="locale-el" lang="el" 
     mv-storage="https://github.com/mavoweb/test/data">
	<ul>
		<li property="country" mv-multiple>
			<span property="code">Code</span>
			<span property="name">Name</span>
		</li>
	</ul>
</div>
```
