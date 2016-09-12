

var products;
var onHandQty;
var cart = new shopping_cart("jadrn042");
var qtyArray;
var dialog;

$(document).ready( function() {

	$('#count').text(cart.size());
	$('#search').val('');
	$("#shopping-cart").attr('title', 'Click to View Your Cart');
	
	products= new Array();
	onHandQty = new Array();
    $.get("http://jadran.sdsu.edu/jadrn042/servlet/GetAllProducts", handleData);
    
    $('#cart-table').on('click',"[class='update']",function(){
 		var sku=$(this).attr("id");
 		var q_id= "u"+sku;
 		var qty=$('#'+q_id).val();
 		if(qty > 0) {
 			if(isAvailable(sku,qty)) {
 				$('#'+m_id).html("");
 				$('#'+"u"+sku).removeClass('error');
 				updateQty(sku,qty);
 			}
 		} else {
 			var m_id = "m"+sku;
 			$('#'+"u"+sku).focus();
 			$('#'+m_id).html("Invalid Quantity Value");
 			$('#'+"u"+sku).addClass('error');
 		}
 			
 	}); 
 	
 	$('#cart-table').on('click',"[class='remove']",function(){
 		var sku=$(this).attr("id");
 		deleteQty(sku);
 	});
 	

	dialog=$('#orderform').dialog({
    	autoOpen: false,
      	height: 550,
      	width: 800,
      	modal: true,
      	draggable: false,
      	resizable: false,
      	title: 'Checkout Form',
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
    
    $('#orderform').on('click',"[id='confirm']",function(){
    	updateDisplay();
    });
       
    	
    $('#cart-table').on('click',"[id='placeOrder']",function(){
 		$('#hiddendiv').empty();
 		var cartArrays = cart.getCartArray();
		var toWrites="";
    	var TotalPrice = 0;
    	var TaxPrice = 0;
		var ShippingPrice = 0;
		var productQty = 0;
		var productPrice = 0;
		var costPrice=0;
		var priceTax=0;
		var title;
		if(cart.size() > 0) {
        
        for(i=0; i < cartArrays.length; i++) {
            for(var j=0; j< products.length ; j++) {
				if(products[j][0] == cartArrays[i][0]){
    			    productQty += parseInt(cartArrays[i][1]);
					itemPrice = parseFloat(products[j][4]);
	    			itemPrice = Math.round(itemPrice * 100)/100;
					productPrice += parseFloat(products[j][4] * cartArrays[i][1] );
					productPrice = Math.round(productPrice * 100)/100;
            		break;
            	}
    		}
    		toWrites += "<input type='hidden' name='SKUNumber' value="+ cartArrays[i][0] + " />";
            toWrites += "<input type='hidden' name='Quantity' value="+cartArrays[i][1]+" />"; 
    		toWrites +="<input type='hidden' name='Price' value="+itemPrice+" />";     
			toWrites += "<input type='hidden' size='50' name='Title' value='"+products[i][2]+"&nbsp;-&nbsp;"+products[i][3]+"' />"
			
        }
		ShippingPrice = 5;
		TaxPrice = ((parseFloat(productPrice) + parseFloat(ShippingPrice)) * 0.08);
		TaxPrice = Math.round(TaxPrice * 100)/100;
		TotalPrice = parseFloat(productPrice) +  parseFloat(TaxPrice) + parseFloat(ShippingPrice);
		TotalPrice = Math.round(TotalPrice * 100)/100;
		toWrites += "<input type='hidden' name='Shipping' value='"+ShippingPrice+"' />";
		toWrites += "<input type='hidden' name='Tax' value='"+TaxPrice+"' />";
		toWrites += "<input type='hidden' name='Total' value='"+TotalPrice+"' />";
		toWrites +="<p></p>"
	}
    $('#hiddendiv').html(toWrites); 	
 	dialog.dialog("open");
 		
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

function updateQty(sku,Qty) {
	var cartArray = cart.getCartArray();
	if (cartArray.length > 0) {
        for(i=0; i < cartArray.length; i++) {
        	for(var j=0; j< products.length ; j++) {
				if(products[j][0] == cartArray[i][0]) {
					products[j][9] = products[j][9] + parseInt(cartArray[i][1]);
					products[j][9] = products[j][9] - parseInt(Qty);
					if(products[j][9] == 0) 
						products[j][8] = "Out of Stock";
					else 
						products[j][8] = "In stock";
					break;
				}
			}
		}
    }
    cart.setQuantity(sku, Qty);
    updateDisplay();
}

function deleteQty(sku) {
	var cartArray = cart.getCartArray();
	if (cartArray.length > 0) {
        for(i=0; i < cartArray.length; i++) {
        	for(var j=0; j< products.length ; j++) {
				if(products[j][0] == cartArray[i][0]) {
					products[j][9] = products[j][9] + parseInt(cartArray[i][1]);
					if(products[j][9] > 0) 
						products[j][8] = "In stock";
					break;
				}
			}
		}
    }
    cart.delete(sku);
    updateDisplay();
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
    updateDisplay();
}


function updateDisplay() {
    var cartArray = cart.getCartArray();
	var TotalPrice = 0;
	var TaxPrice = 0;
	var ShippingPrice = 0;
	var productQty = 0;
	var productPrice = 0;
	var itemPrice = 0;
	var toWrite = "";
	
    toWrite += "<table id='cart_table'>";
    toWrite += "<caption text-align='left'><h3>Your Shopping Cart</h3></caption>";
    toWrite += "<tr><th id='c_record'>Item Description</th><th>Quantity</th><th>Price</th><th>Total</th></tr>";
	if (cartArray.length > 0) {
        for(i=0; i < cartArray.length; i++) {
	   		for(var j=0; j< products.length ; j++) {
				if(products[j][0] == cartArray[i][0]){
	   				toWrite += "<tr><td>"+products[j][2]+"&nbsp;-&nbsp;"+products[j][3]+"<br/><img class='c_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+products[j][5]+"' /></td>";
        			toWrite += "<td><input type='number' class='qtyfield' name='updateQty' id='u" + cartArray[i][0] + "' min='1' value='" +  cartArray[i][1] + "' />";
	    			toWrite += "<br/><a class='update' id='" + cartArray[i][0] + "'>Update</a><br/><a class='remove' id='" + cartArray[i][0] + "'>Remove</a>";
	    			toWrite += "<br/><div id='m" + cartArray[i][0] + "' class='message_line'>&nbsp;</div></td>";
	    			productQty += parseInt(cartArray[i][1]);
					itemPrice = parseFloat(products[j][4]);
	    			itemPrice = Math.round(itemPrice * 100)/100;
					productPrice += parseFloat(products[j][4] * cartArray[i][1] );
					productPrice = Math.round(productPrice * 100)/100;
					break;
				}
			} 
	    	toWrite += "<td> $ " + itemPrice +"</td><td> $ " + Math.round((itemPrice * cartArray[i][1])*100)/100 +"</td></tr>"; 
		}
	ShippingPrice = 5;
	TaxPrice = ((parseFloat(productPrice) + parseFloat(ShippingPrice)) * 0.08);
	TaxPrice = Math.round(TaxPrice * 100)/100;
	TotalPrice = parseFloat(productPrice) +  parseFloat(TaxPrice) + parseFloat(ShippingPrice);
	TotalPrice = Math.round(TotalPrice * 100)/100;
	toWrite += "<tr><th colspan='4'>Order Summary</th></tr>";
	toWrite += "<tr><th>Shipping Charges:</th><td>" + "$ " + ShippingPrice + "</td>";
	toWrite += "<th>Tax:</th><td>" + "$ " + TaxPrice + "</td></tr>";
	toWrite += "<tr><th>Total Price:</th><td colspan='3'>" + "$ " + TotalPrice + "</td></tr>";
	toWrite += "<tr><td colspan='4' id='c_buttons'><a href='products.html' id='continue' />Back to Shopping</a>";
    toWrite += "&nbsp;&nbsp;&nbsp;<input type='button' value='Proceed to Checkout' id='placeOrder' /></td></tr></table>";
	}
	else {
		toWrite += "<tr><td colspan='4'><center>There are no items in your cart</center></td></tr>";
		toWrite += "<tr><td colspan='4' id='c_buttons'><a href='products.html' id='continue' />Back to Shopping</a></td></tr></table>";
		}
        var handle = document.getElementById('cart-table');
    		handle.innerHTML = toWrite;   
        $('#count').text(cart.size());     
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

function isAvailable(sku,qty) {
	for(var i=0; i< onHandQty.length ; i++) {
		if(onHandQty[i][0] == sku) {
			if(parseInt(qty) <= parseInt(onHandQty[i][1])) {
				return true;
				break;
			} else {
				var m_id = "m"+sku;
 				$('#'+m_id).html("Only "+onHandQty[i][1]+" in stock");
 				$('#'+"u"+sku).addClass('error');
				return false;
				
			}
			break;
		}
	}	
} 