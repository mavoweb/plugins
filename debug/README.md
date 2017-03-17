# Mavo inspector

## How to use

You enable the Mavo inspector on a Mavo app by ising the `mv-debug` class on its root or adding `?debug` to the URL. After reloading you will see the tools. If you only want to debug storage, use the class `mv-debug-saving` instead of `mv-debug`.

## The tools

On every group, you will get a table with the current values of all properties and expressions. **The expressions in the table are editable** and you can see the results of your edits as you type, both in the table and in your app.

Hovering over the elements in the last column will highlight them in the app.

```html
	<div mv-storage class="mv-debug">
		<p>
			<label>x = <input type="number" property="x" value="15" /></label>,
			<label>y = <input type="number" property="y" value="5" /></label>
		</p>
		<ul>
			<li>x + y = <span property="sum">[x + y]</span></li>
			<li>x - y = [x - y]</li>
			<li>x * y = [x * y]</li>
			<li>x / y = [x / y]</li>
			<li>(x + y)<sup>2</sup> = [pow(sum, 2)]</li>
		</ul>
	</div>
```
