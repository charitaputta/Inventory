
var products;
var onHandQty;
var vendor;
var category;
var dialog;
var cart = new shopping_cart("jadrn042");
var filterArray;

$(document).ready( function() {

	$('#count').text(cart.size());
	$('#search').val('');
	$("#shopping-cart").attr('title', 'Click to View Your Cart');
	
	products= new Array();
	onHandQty = new Array();
	vendor = new Array();
	category = new Array();
	filterArray = new Array();
    $.get("http://jadran.sdsu.edu/jadrn042/servlet/GetAllProducts", handleData);
    $.get("http://jadran.sdsu.edu/jadrn042/servlet/GetVendor", handleVendor);
    $.get("http://jadran.sdsu.edu/jadrn042/servlet/GetCategory", handleCategory);
 	
 	$('#searchbutton').on('click',function(){
    	var val= $.trim($('#search').val());
    	if(val == "") {
    		$('#search').attr("placeholder", "Enter Keyword");
    		$('#search').focus();
    	} else {
    		val = val.replace(/ /g, "_");
    		val = "search="+val;
    		$('#filter-form')[0].reset();
    	$( "#slider" ).slider("values", 0, 0);
  		$( "#slider" ).slider("values", 1, 5000);
    	$( "#amount" ).val( "$" + $( "#slider" ).slider( "values", 0 ) +
      " - $" + $( "#slider" ).slider( "values", 1 ) );
      	filterArray= new Array();
    		handleSearch(val);
    	}
    });
 	
    $( "#slider" ).slider({
      range: true,
      min: 0,
      max: 5000,
      step: 500,
      values: [ 0, 5000 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider" ).slider( "values", 0 ) +
      " - $" + $( "#slider" ).slider( "values", 1 ) );
      
    dialog=$('#product-view').dialog({
    	autoOpen: false,
      	height: 550,
      	width: 750,
      	modal: true,
      	draggable: false,
      	resizable: false,
      	open:function() {
			$(".ui-dialog-content").scrollTop(0);
  		}
    }); 
    
    var pos = $(".ui-dialog").position();

    //adjust the dialog box position so that it scrolls as you scroll the page
    $(".ui-dialog").css({
        position: 'fixed',
        top: pos.y
    });
    
    dialog.on('dialogclose', function(event) {
    	$('#product-view').empty();
    	dialog.dialog('option', 'title', '');
 	});
    
    
    $('#product-view').on('click',"[name='addToCart']",function(){
    	var itemSku = $(this).attr("id");
    	cartAdd(itemSku);
    });

    
    $('#filter-clear').on('click',function() {
    	$('#filter-form')[0].reset();
    	$( "#slider" ).slider("values", 0, 0);
  		$( "#slider" ).slider("values", 1, 5000);
    	$( "#amount" ).val( "$" + $( "#slider" ).slider( "values", 0 ) +
      " - $" + $( "#slider" ).slider( "values", 1 ) );
      	filterArray= new Array();
      	displayProducts();
    });
    
    $('#filter-apply').on('click',function(){
    	name='brand'
    	var selBrand = [];
 		$('[name=brand]:checked').each(function() {
   			selBrand.push($(this).val());
 		});
 		var selCategory = [];
 		
 		$('[name=category]:checked').each(function() {
   			selCategory.push($(this).val());
 		});
 		var minRange= $( "#slider" ).slider( "values", 0 );
 		var maxRange = $( "#slider" ).slider( "values", 1 );
 		applyFilter(selBrand, selCategory, minRange, maxRange);

    });

	
});

function handleData(response) {
	var tmpArray = explodeArray(response,'||', 2);
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|', 1);
        products[i] = innerArray;
    }
	$.get("http://jadran.sdsu.edu/jadrn042/servlet/GetOnHandQty", handleOnHand);
}

function handleOnHand(response) {
	var tmpArray = explodeArray(response,'||', 2);
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|', 1);
        onHandQty[i] = innerArray;
    }
	evaluateStatus();
}

function evaluateStatus() {
	for(var i=0; i< products.length ; i++) {
		for(var j=0; j< onHandQty.length ; j++) {
			var status ="";
			var qty = -1;
			
			if(products[i][0] == onHandQty[j][0]) {
				if(onHandQty[j][1] > 0) 
					status = "In stock";	
				else if(onHandQty[j][1] == 0) 
					status = "Out of Stock";	
				qty= onHandQty[j][1];
				break;	
			}
		}
		if(status == ""){
			status = "Coming Soon";
		}
		products[i][8] = status;
		products[i][9] = qty;
	}
	var search_value = window.location.search.substring(1);
	if(search_value != "") {
		handleSearch(search_value);
	} else
		updateQuantity();
		
}

function updateQuantity() {
	var cartArray = cart.getCartArray();
	if (cartArray.length > 0) {
        for(i=0; i < cartArray.length; i++) {
        	for(var j=0; j< products.length ; j++) {
				if(products[j][0] == cartArray[i][0]) {
					products[j][9] = products[j][9] - cartArray[i][1];
					if(products[j][9] == 0) 
						products[j][8] = "Out of Stock";
					break;
				}
			}
		}
    }
    displayProducts();
}

 

function displayProducts() {
	if(filterArray.length > 0) {
		var answer = "<table class='product_table1'><caption><h3>Matched Items("+filterArray.length+")</caption><tr class='p_row'>";
		var tmp= 0;
		for(var j=0; j< filterArray.length ; j++) {	
		for(var i=0; i< products.length ; i++) {
			
			if(filterArray[j]==products[i][0]) {
			tmp = tmp+ 1;
			
    		answer += "<td class='p_record'><img id='"+products[i][0]+"' onclick='productView(\""+products[i][0]+"\")' class='p_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+products[i][5]+"' />";
    		answer += "<h4 class='p_title'>"+products[i][2]+"&nbsp;-&nbsp;"+products[i][3]+"</h4>"; 
    		if(products[i][8] == "In stock") 
    			answer += "<p class='p_left'>"+products[i][8]+"</p>";
			else if(products[i][8] == "Coming Soon")
    			answer += "<p class='p_left-blue'>"+products[i][8]+"</p>";
    		else 
    			answer += "<p class='p_left1'>"+products[i][8]+"</p>";	
    		answer += "<p class='p_right'>$"+products[i][4]+"</p></td>";
   			if(tmp == 3) {
   				answer+= "</tr><tr class='p_row'>" ;
   				tmp = 0;
   			}
   			}
   		}
   		}
   		answer += "</tr></table>";
	}
	else {
	var answer = "<table class='product_table1'><tr class='p_row'>";
	var tmp= 0;
	for(var i=0; i< products.length ; i++) {
	tmp = tmp+ 1;
    answer += "<td class='p_record'><img id='"+products[i][0]+"' onclick='productView(\""+products[i][0]+"\")' class='p_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+products[i][5]+"' />";
    answer += "<h4 class='p_title'>"+products[i][2]+"&nbsp;-&nbsp;"+products[i][3]+"</h4>"; 
    if(products[i][8] == "In stock") 
    	answer += "<p class='p_left'>"+products[i][8]+"</p>";
	else if(products[i][8] == "Coming Soon")
    	answer += "<p class='p_left-blue'>"+products[i][8]+"</p>";
    else 
    	answer += "<p class='p_left1'>"+products[i][8]+"</p>";	
    answer += "<p class='p_right'>$"+products[i][4]+"</p></td>";
   	if(tmp == 3) {
   		answer+= "</tr><tr class='p_row'>" ;
   		tmp = 0;
   	}
   	}
   	answer += "</tr></table>";
   	}
	var handle = document.getElementById('right-products');
    handle.innerHTML = answer; 
}

function handleVendor(response) {
	var tmpArray = explodeArray(response,'||', 2);
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|', 1);
        vendor[i] = innerArray;
    }
	var answer = "";
	for(var i=0; i< vendor.length ; i++) {
		answer += "<input type='checkbox' name='brand' value='"+vendor[i][1]+"'><p class='c_title'>"+vendor[i][1]+"</p><br/>";
	}
	var handle = document.getElementById('brands');
    handle.innerHTML = answer; 
}

function handleCategory(response) {
	var tmpArray = explodeArray(response,'||', 2);
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|', 1);
        category[i] = innerArray;
    }
	var answer = "";
	for(var i=0; i< category.length ; i++) {
		answer += "<input type='checkbox' name='category' value='"+category[i][1]+"'><p class='c_title'>"+category[i][1]+"</p><br/>";
	}
	var handle = document.getElementById('categories');
    handle.innerHTML = answer; 
}

function productView(SKU) {
	var itemSku = SKU;
	var answer="";
	for(var i=0; i< products.length ; i++) {
		if(products[i][0] == itemSku) {
			dialog.dialog('option', 'title', products[i][2]+"  -  "+products[i][3]);
    		answer += "<table class='detail-table'><tr><td rowspan='8' class='image_row'><img id='"+products[i][0]+"' class='d_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+products[i][5]+"' /></td>";
    		answer += "<td><h4>"+products[i][3]+"</h4></td></tr><tr><td>By: <h4 class='d_vendor'>"+products[i][2]+"</h4></td></tr>";
			answer += "<tr><td>Price: <h4 style='display: inline'>$"+products[i][4]+"</h4></td></tr><tr><td>Category: <h4 style='display: inline'>"+products[i][1]+"</h4></td></tr>";
    		if(products[i][8] == "Coming Soon") 
    			answer += "<tr><td>Status: <h3 class='coming' name='d_status'>"+products[i][8]+"</h3></td></tr><tr><td>&nbsp;</td></tr></tr><tr><td>&nbsp;</td></tr>";
    		else if(products[i][8] == "In stock") {
    			answer += "<tr><td>Status: <h3 class='available' name='d_status'>"+products[i][8]+"</h3></td></tr>";
    			answer += "<tr><td>Quantity: <input type='number' id='qty"+products[i][0]+"' size='2' name='qty' min='1' value='1'/></td></tr>"; 
    			answer += "<tr><td><input type='button' id='"+products[i][0]+"' value='Add to Cart' name='addToCart' class='addToCart' /></td></tr></tr>";
    		} else
    		 	answer += "<tr><td>Status: <h3 class='unavailable' name='d_status'>"+products[i][8]+"</h3></td></tr><tr><td>&nbsp;</td></tr></tr><tr><td>&nbsp;</td></tr>";
    		answer += "<tr><td><div class='d_message' id='d_message'>&nbsp;</div></td></tr>";
    		answer += "<tr><td colspan='2'><h3>Features:</h3>"+products[i][7]+"</td></tr><tr><td colspan='2'><h3>Description:</h3>"+products[i][6]+"</td></tr></table>"; 
   	    	var handle = document.getElementById('product-view');
    		handle.innerHTML = answer;
    		dialog.dialog("open");
   	   		break;
   	    }
   	} 
}

function cartAdd(itemSku) {
	var sku= itemSku;
    var q_id= "qty"+sku;
	var qty=$('#'+q_id).val();
	if(qty > 0) {
 			if(isAvailable(sku,qty)) {
 				updateAddQty(sku,qty);
 				$('#d_message').html("<p style='color:blue'>"+qty+" items added to cart</p>");
 				$('#'+"qty"+sku).removeClass('error');
 			}
 		} else {
 			$('#'+"qty"+sku).focus();
 			$('#d_message').html("Invalid Quantity Value");
 		}
 	$('#count').text(cart.size()); 
}

function isAvailable(sku,qty) {
	for(var i=0; i< products.length ; i++) {
		if(products[i][0] == sku) {
			if(parseInt(qty) <= parseInt(products[i][9])) {
				return true;
				break;
			} else {
				var m_id = "m"+sku;
 				$('#d_message').html("Only "+products[i][9]+" in stock");
 				$('#'+"qty"+sku).focus();
				return false;	
			}
			break;
		}
	}	
} 

function updateAddQty(sku,Qty) {
	var cartArray = cart.getCartArray();
    for(var j=0; j< products.length ; j++) {
		if(products[j][0] == sku) {
			products[j][9] = parseInt(products[j][9]) - parseInt(Qty);
			if(products[j][9] == 0) 
				products[j][8] = "Out of Stock";
			else 
				products[j][8] = "In stock";
			break;
		}
	}
	cart.add(sku,Qty);
	productView(sku);
	displayProducts();
}

function explodeArray(item,delimiter,indexValue) {
	tempArray=new Array(1);
	var Count=0;
	var tempString=new String(item);
	while (tempString.indexOf(delimiter)>0) {
		tempArray[Count]=tempString.substr(0,tempString.indexOf(delimiter));
		tempString=tempString.substr(tempString.indexOf(delimiter)+indexValue,tempString.length-tempString.indexOf(delimiter)+indexValue);
		Count=Count+1;
	}
	tempArray[Count]=tempString;
	return tempArray;
} 

function applyFilter(brand, category, min, max) {
	filterArray = new Array();
	
	if(brand.length > 0) {
	if(category.length > 0) {
	for(var i=0; i< brand.length ; i++) {
		for(var j=0; j< products.length; j++) {
			if(brand[i]==products[j][2]) {
				for(var k=0; k< category.length; k++) {
					if(category[k] == products[j][1]) {
						if(parseInt(products[j][4]) >= min && parseInt(products[j][4]) <= max) {
						filterArray.splice(filterArray.length,0,products[j][0]);
						break;
						}
					}	
				}	
			}
		}
	}
	} else {
		for(var i=0; i< brand.length ; i++) {
		for(var j=0; j< products.length; j++) {
			if(brand[i]==products[j][2]) {
				if(parseInt(products[j][4]) >= min && parseInt(products[j][4]) <= max) {
					filterArray.splice(filterArray.length,0,products[j][0]);
				}
			}
		}
	}
	}
	} else if(category.length > 0){
		for(var k=0; k< category.length; k++) {
			for(var j=0; j< products.length; j++) {
					if(category[k] == products[j][1]) {
						if(parseInt(products[j][4]) >= min && parseInt(products[j][4]) <= max) {
						filterArray.splice(filterArray.length,0,products[j][0]);
						}
					}	
				}
			}
	} else {
		for(var j=0; j< products.length; j++) {
			if(parseInt(products[j][4]) >= min && parseInt(products[j][4]) <= max) {
				filterArray.splice(filterArray.length,0,products[j][0]);
			}
		
		}
	}
	if(filterArray.length > 0) 
		displayProducts();
	else {
		var answer = "<h3>No Items found - Matching Filters</h3>"
		var handle = document.getElementById('right-products');
    	handle.innerHTML = answer;
	}
}

function handleSearch(searchValue) {
	var keyword = searchValue.split('=');
	var value = keyword[1].toUpperCase();
	var words = value.split('_');
	filterArray = new Array();
	for(var i=0; i< products.length; i++) {
		for(j=0; j< products[i].length - 1; j++) {
			var str= products[i][j].toUpperCase();
			if((str.indexOf(value)) != -1) {
				filterArray.splice(filterArray.length,0, products[i][0]);
				break;
			} else {
				var check = false;
				for(var k=0; k < words.length; k++) {
					if((str.indexOf(words[k])) != -1){
						check = true;
					}
				}
				if(check) {
					filterArray.splice(filterArray.length,0, products[i][0]);
					break;
				}
			}
		}
	}
	if(filterArray.length > 0) 
		displayProducts();
	else {
		var answer = "<h3>No Items found - Matching Search Keyword</h3>"
		var handle = document.getElementById('right-products');
    	handle.innerHTML = answer;
	}
}
	



















