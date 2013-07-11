# Wealcash ColorPicker

It's a jQuery plugin which provide a color picker for your web based applications.

This plugin may be used alongside [Twitter Bootstrap](http://twitter.github.com/bootstrap/).

## Demo

You can see it working [here](http://wealcash.github.com/wealcash-colorpicker).

## Usage

 - Import css and javascript to your HTML file;

 - Call the function `wealcolorpicker`;

## Example

### Simple Grid

```html
<div id="grid"></div>

<script>
  $('#grid').wealcolorpicker();
</script>
```
    
If you wanna change the default values:

```html
<script>
	$('#grid').wealcolorpicker({
		between: 3,
		variant: 7,
		expurge: 2
	});
</script>
```
    
### Using twitter bootstrap dropdown:

```html
<input class="weal-colorpicker"/>
<script>
	$('#grid').wealcolorpicker({
		between: 3,
		variant: 7,
		expurge: 2,
		dropdown: true
	});
</script>
```
    
## Handling Events

```javascript
$('.weal-colorpicker').on('colorSelected', function (event) {
	$('body').css('background-color', event.color);
	console.log(event.color);
});
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

