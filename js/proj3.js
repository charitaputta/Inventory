

var products;
var onHandQty;
var dialog;
var cart = new shopping_cart("jadrn042");
var tmpIndexArray;

$(document).ready( function() {

	$('#count').text(cart.size());
	$('#search').val('');
	$("#shopping-cart").attr('title', 'Click to View Your Cart');

	
	products= new Array();
	onHandQty = new Array();
	tmpIndexArray = new Array();
    $.get("http://jadran.sdsu.edu/jadrn042/servlet/GetAllProducts", handleData);
    
    $('#searchbutton').on('click',function(){
    	var val= $.trim($('#search').val());
    	var val= $.trim($('#search').val());
    	if(val == "") {
    		$('#search').attr("placeholder", "Enter Keyword");
    		$('#search').focus();
    	} else {
    		val = val.replace(/ /g, "_");
    		window.location.href = 'http://jadran.sdsu.edu/jadrn042/proj3/products.html?search='+val;
    	}
    });
    
    $('#products_holder').on('click',"[name='onClick']",function(){
    	var itemSku = $(this).attr("id");
    	productView(itemSku);
    });
    
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
    randomProducts();
}

function isInArray(array, search) {
    return (array.indexOf(search) >= 0) ? true : false; 
}
    
function randomProducts() {
		if(tmpIndexArray.length == 4) {
			var answer = "<table class='product_table'><tr><td colspan='4'><h2 class='p_title'>Featured Items</h2></tr><tr class='p_row'>";
			for(var j=0; j < tmpIndexArray.length; j++) {
				answer += "<td class='p_record'><img id='"+products[j][0]+"' name='onClick' class='p_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+products[j][5]+"' />";
    			answer += "<h4 class='p_title'>"+products[j][2]+"&nbsp;-&nbsp;"+products[j][3]+"</h4>";
   				if(products[j][8] == "In stock") 
    				answer += "<p class='p_left'>"+products[j][8]+"</p>";
				else if(products[j][8] == "Coming Soon")
    				answer += "<p class='p_left-blue'>"+products[j][8]+"</p>";
    			else 
    				answer += "<p class='p_left1'>"+products[j][8]+"</p>";
   				answer+= "<p class='p_right'>$"+products[j][4]+"</p></td>";
			}
			answer+= "</tr><tr class='p_row'></tr><tr><td colspan='4'><center><a href='products.html' class='shop_link'>Shop Now</a></center></tr></table>" ;
			var handle = document.getElementById('products_holder');
			handle.innerHTML = answer;
		} else {
		
		var maxIndex = products.length - 1;
		var answer = "<table class='product_table'><tr><td colspan='4'><h2 class='p_title'>Featured Items</h2></tr><tr class='p_row'>";
		var index = Math.floor((Math.random()*(maxIndex)));
		for(var i=0; i < 4; i++) {			
			while(isInArray(tmpIndexArray, index)) {					
					index = Math.floor((Math.random()*(maxIndex)));	
			}
			tmpIndexArray.push(index);
			answer += "<td class='p_record'><img id='"+products[index][0]+"' name='onClick' class='p_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+products[index][5]+"' />";
    		answer += "<h4 class='p_title'>"+products[index][2]+"&nbsp;-&nbsp;"+products[index][3]+"</h4>";
   			if(products[index][8] == "In stock") 
    			answer += "<p class='p_left'>"+products[index][8]+"</p>";
			else if(products[index][8] == "Coming Soon")
    			answer += "<p class='p_left-blue'>"+products[index][8]+"</p>";
    		else 
    			answer += "<p class='p_left1'>"+products[index][8]+"</p>";
   			answer+= "<p class='p_right'>$"+products[index][4]+"</p></td>";					
		}
		answer+= "</tr><tr class='p_row'></tr><tr><td colspan='4'><center><a href='products.html' class='shop_link'>Shop Now</a></center></tr></table>" ;
		var handle = document.getElementById('products_holder');
		handle.innerHTML = answer;
		}
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
    			answer += "<tr><td><input type='button' class='addToCart' id='"+products[i][0]+"' value='Add to Cart' name='addToCart' /></td></tr></tr>";
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
 			$('#d_message').html("Invalid Quantity value");
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
	randomProducts();
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