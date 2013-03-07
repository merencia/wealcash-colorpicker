(function($){
	$.fn.wealpalette = function(options, callback){
		var configs = {
	        between: 3,
	        variant: 2,
	        expurge: 0,
	        dropdown: false
	    }
	    if (configs){$.extend(configs, options);}
		
		var toDarkness = function(val, dark){
			var nVal = val - dark
			return val > 0 && nVal  > 0 ? nVal : 0;
		}
		
		var toLight = function(val, light){
			var nVal = val + light
			return val < 255  && nVal  < 255 ? nVal : 255;
		}

	    var create_master = function(){
	    	var master = new Array();
	    	var rgb = 'r';
	    	var r = 255;
	    	var g = 0;
	    	var b = 0;
	    	var aux = Math.round(255/configs.between);
	    	for(var i = 0; i < (configs.between * 6); i++){
	    		if(g >= 255){
	    			g = 255;
	    			rgb = 'g';
	    		}

	    		if(b >= 255){
	    			b = 255;
	    			rgb = 'b';
	    		}

	    		if(b >= 255){
	    			b = 255;
	    		}

	    		master[i] = new Array();
	    		master[i]['r'] = r;
	    		master[i]['g'] = g;
	    		master[i]['b'] = b;
	    		if (rgb == 'r'){
	    			g = g + aux;

	    		}else if(rgb == 'g'){
	    			if(r > 0){
	    				r = r - aux;
	    				if (r < 0){
	    					r = 0;
	    				}
	    			}else{
	    				b = b + aux;
	    				if(b >= 255){
	    					b = 255;
	    				}
	    			}
	    		}else if(rgb == 'b'){
	    			if (g > 0){
	    				g = g - aux;
	    				if (g < 0){
	    					g = 0;
	    				}
	    			}else if (r < 255){
	    				r = r + aux;
	    				if (r >= 255){
	    					r = 255;
	    				}
	    			}else{
	    				b = b - aux;
	    			}
	    		}
	    	} 
			var preto = master.length;
			master[preto] = new Array();
			master[preto]['r'] = 127;
	    	master[preto]['g'] = 127;
	    	master[preto]['b'] = 127;
			
	    	return master;
	    }

	    var create_variant_darken = function(master){
	    	var mat = new Array();
	    	var aux = Math.round(255/configs.variant);
	    	var darken = aux;
	    	var variant = configs.variant - configs.expurge;
	    	for(var i = 0; i < variant; i++){
	    		mat[i] = new Array();
	    		for (var x = 0; x < master.length - 1;  x++){
	    			mat[i][x] = new Array();
	    			mat[i][x]['r'] = toDarkness(master[x]['r'], darken);
	    			mat[i][x]['g'] = toDarkness(master[x]['g'], darken);
	    			mat[i][x]['b'] = toDarkness(master[x]['b'], darken);
	    		}
				var len = master.length - 1;
				var val =  Math.round (darken/2);
				mat[i][len] = new Array();
				mat[i][len]['r'] = toDarkness(master[x]['r'], val);
				mat[i][len]['g'] = toDarkness(master[x]['g'], val);
				mat[i][len]['b'] = toDarkness(master[x]['b'], val);
				
	    		darken = darken + aux;
	    	}
	    	return mat;
	    }

	    var create_variant_lighten = function(master){
	    	var mat = new Array();
	    	var aux = Math.round(255/configs.variant);
	    	var lighten = aux;
	    	var variant = configs.variant - configs.expurge;
	    	for(var i = 0; i < variant; i++){
	    		mat[i] = new Array();
	    		for (var x in master){
	    			mat[i][x] = new Array();
	    			mat[i][x]['r'] = toLight(master[x]['r'], lighten);
	    			mat[i][x]['g'] = toLight(master[x]['g'], lighten);
	    			mat[i][x]['b'] = toLight(master[x]['b'], lighten);
	    		}
				
				var len = master.length - 1;
				var val =  Math.round (lighten/2);
				mat[i][len] = new Array();
				mat[i][len]['r'] = toLight(master[x]['r'], val);
				mat[i][len]['g'] = toLight(master[x]['g'], val);
				mat[i][len]['b'] = toLight(master[x]['b'], val);
				
				
	    		lighten = lighten + aux;
	    	}
	    	return mat;
	    }

	    var create_colors = function(){
	    	var master = create_master();
	    	var lighten = create_variant_lighten(master);
	    	var darken = create_variant_darken(master);
	    	darken.reverse();

	    	var mat = new Array();
	    	for (var i in darken){
	    		mat.push(darken[i]);
	    	}

	    	mat.push(master);

	    	for (var i in lighten){
	    		mat.push(lighten[i]);
	    	}
	    	return mat;
	    }

	    var create_grid = function(element, clicked){
	    	var root = $(element);

	    	var r = 255;
	    	var g = 255;
	    	var b = 255;

	    	var table = $('<table class="weal-table">');

	    	colors = create_colors();
	    	create_variant_darken(colors);
	    	for (var line = 0; line < colors.length; line++){
	    		var tr = $('<tr>');
	    		tr.appendTo(table);
	    		for(var column = 0; column < 6 * configs.between + 1; column++){
	    			var td = $("<td>");
	    			td.appendTo(tr);
	    			var wealspan = $("<span class='weal-color'>");
	    			wealspan.appendTo(td);
	    			var color = "rgb("+colors[line][column]['r']+","+colors[line][column]['g']+","+colors[line][column]['b']+")";
	    			wealspan.css("background", color);
	    			td.attr('data-weal-color',color);

	    				td.on('click', function(){
	    					if(callback != null && typeof callback == "function"){
		    					var elem = $(this);
		    					if(configs.dropdown){
		    						$(".dropdown-toggle").dropdown('toggle');
		    					}
		    					callback.call(clicked ,elem.data('weal-color'));
	    					}
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

	    	var grid = create_grid(dropdownMenu, root);

	    	//create button
	    	var btn = $("<span class='add-on'>");
	    	$("<i class='icon-tint'>").appendTo(btn);
	    	btn.click(function(){
	    		dropdownMenu.dropdown('toggle');
	    		return false;
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
	    		create_grid(this);
	    	}
	    });
	}
})(jQuery);
