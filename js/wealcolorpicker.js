/*
Wealcash-colorpicker 0.1

Author: Lucas José Merencia <lucas.merencia@gmail.com>
*/
(function($){
	/*
	Generate a color palette based on RGB colors:
	   255,0,0
	   255,255,0
	   0,255,0
	   0,255,255
	   0,0,255
	   255,0,255

	Params:
	 - options{
	     beetwen:  shades of colors between main colors 

	     variant:  shades of colors between the foreground color to black and 
	               foreground color to white

	     expurge:  disregarded colors on top and bottom of the grid

	     dropdown: creates a dropdown to grid (require bootstrap dropdown: 
	               <http://twitter.github.com/bootstrap/components.html#dropdowns> )
	   }
	*/
	$.fn.wealcolorpicker = function(options){
		var configs = {
			between: 3,
			variant: 2,
			expurge: 0,
			dropdown: false
		}
		if (configs){$.extend(configs, options);}
		
		/*define a color*/
		var RGB = function(r,g,b){
			this.r = r;
			this.g = g;
			this.b = b;
		}

		/*Increment a value to 255*/
		var increment = function(val, add){
			val += add;
			return val > 255 ? 255 : val;
		}
		/*Decrement a value to 0*/
		var decrement = function(val, add){
			val -= add;
			return val < 0 ? 0 : val;
		}

		/* create main colorss*/
		var createMaster = function(){
			var master = [];
			var rgb = new RGB(255,0,0);
			var between = configs.between;
			var interval = Math.round(255/between);
			for(var i = 0; i < (between * 6); i++){
				master[i] = new RGB(rgb.r,rgb.g,rgb.b);
				//Color start with RGB(255,0,0)
				//First upping G to 255
				//when RGB(255,255,0) I down R to 0 then up B to 255 (now G always is 255)
				//when RGB(0,255,255) I down G to 0 then up R to 255 again
				if (rgb.g < 255 && rgb.b == 0){
					rgb.g = increment(rgb.g, interval);
				}else if(rgb.g == 255 && (rgb.r > 0 || rgb.b < 255) ){
					if(rgb.r > 0){
						rgb.r = decrement(rgb.r, interval);
					}else{
						rgb.b = increment(rgb.b, interval);
					}
				}else{
					if (rgb.g > 0){
						rgb.g = decrement(rgb.g,interval);
					}else if (rgb.r < 255){
						rgb.r = increment(rgb.r,interval);
					}else{
						rgb.b = decrement(rgb.b,interval);
					}
				}
			} 
			//add column to monochromatic colors
			var black = master.length;
			master[black] = new RGB(127,127,127);
			
			return master;
		}

		/*creates variation in color from black to white*/
		var createVariant = function(master, fn){
			var mat = [];
			var aux = Math.round(255/configs.variant);
			var darken = aux;
			var variant = configs.variant - configs.expurge;
			for(var i = 0; i < variant; i++){
				mat[i] = [];
				for (var x = 0; x < master.length - 1;  x++){
					mat[i][x] = new RGB(
							fn(master[x].r, darken),
							fn(master[x].g, darken),
							fn(master[x].b, darken)
						);
				}
				//for monochrome column change only half the variation
				var len = master.length - 1;
				var val =  Math.round (darken/2);
				mat[i][len] = new RGB(
						fn(master[x].r, val),
						fn(master[x].g, val),
						fn(master[x].b, val)
					);
				
				darken = darken + aux;
			}
			return mat;
		}

		/* Creates color matrix */
		var createColors = function(){
			var master = createMaster();
			var lighten = createVariant(master,increment);
			var darken = createVariant(master,decrement);
			darken.reverse();
			darken.push(master);
			return darken.concat(lighten);
		}

		var createGrid = function(element, clicked){
			var root = $(element);

			var r = 255;
			var g = 255;
			var b = 255;

			var table = $('<table class="weal-table">');

			colors = createColors();
			for (var line = 0; line < colors.length; line++){
				var tr = $('<tr>');
				tr.appendTo(table);
				for(var column = 0; column < 6 * configs.between + 1; column++){
					var td = $("<td>");
					td.appendTo(tr);
					var wealbutton = $("<button class='weal-color'>");
					wealbutton.appendTo(td);
					var color = "rgb("+colors[line][column]['r']+","+colors[line][column]['g']+","+colors[line][column]['b']+")";
					wealbutton.css("background", color);
					wealbutton.attr("data-color", color);
					wealbutton.on('click', function(){
						$(clicked).trigger({type: "colorSelected", color: $(this).data('color')});
						$(root).trigger({type: "colorSelected", color: $(this).data('color')});
					});
					wealbutton.on('focusin', function(){
						$(this).addClass('wealcolor-in');
					});
					wealbutton.on('focusout', function(){
						$(this).removeClass('wealcolor-in');
					});
				}
			}

			table.appendTo(root);
		}

		var create_dropdown = function(element){
			var root = $(element);
			var dropdown = $("<div class='dropdown'>");

			var inputAppend = $("<div class='input-append'>");
			inputAppend.appendTo(dropdown);

	    	//replace root by dropdown
	    	rootParent = root.parent();
	    	root.remove();
	    	root.appendTo(inputAppend);
	    	dropdown.appendTo(rootParent);


	    	//add dropdown classes and data
	    	inputAppend.addClass('dropdown-toggle');
	    	inputAppend.attr('data-toggle', "dropdown");

	    	//create menu
	    	var dropdownMenu = $("<ul>");
	    	dropdownMenu.addClass("dropdown-menu");
	    	dropdownMenu.addClass("weal-dropdown");
	    	dropdownMenu.attr("role", "dropdown-menu");

	    	var grid = createGrid(dropdownMenu, root);

	    	//create button
	    	var btn = $("<span class='add-on'>");
	    	$("<i class='icon-tint'>").appendTo(btn);
	    	btn.click(function(){
	    		dropdownMenu.dropdown('toggle');
	    		return false;
	    	});
	    	root.on('focusin', function(){
	    		dropdownMenu.dropdown('toggle');
	    	});

	    	btn.appendTo(inputAppend);
	    	dropdownMenu.appendTo(dropdown);

	    	root.dropdown();

	    	root.attr('autocomplete', 'off');
	    }

	    return this.each(function(){
	    	if(configs.dropdown){
	    		create_dropdown(this);
	    	}else{
	    		createGrid(this);
	    	}
	    });
	}
})(jQuery);
