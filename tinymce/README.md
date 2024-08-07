To use TinyMCE, follow the installation instructions below. Then add `class="tinymce"` to the property that you want to be edited via TinyMCE.

Additionally, you can customize the [tinymce toolbar](https://www.tiny.cloud/docs-4x/configure/editor-appearance/#groupingtoolbarcontrols) that is used for each field. By passing an attribute called `mv-tinymce-toolbar`, you can specify which buttons show on the toolbar, see the [tinymce toolbar docs](https://www.tiny.cloud/docs-4x/advanced/editor-control-identifiers/#toolbarcontrols) for more information. By default the following value is used for the toolbar when nothing is specified: `"styleselect | bold italic | image link | table | bullist numlist"`

You can also specify additional valid elements using the `mv-tinymce-extended-valid-elements` attribute. This allows you to include elements that TinyMCE might otherwise strip out: `mv-tinymce-extended-valid-elements="span,div[*],p[*]"`
