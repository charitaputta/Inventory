

var products;
var onHandQty;
var cart = new shopping_cart("jadrn042");
var qtyArray;

$(document).ready( function() {

	$('#count').text(cart.size());
	
	var person = {firstName:"John", lastName:"Doe", age:46};
	
	products= new Array();
	onHandQty = new Array();
    $.get("http://jadran.sdsu.edu/jadrn042/servlet/GetAllProducts", handleData);
    
    $('#cart-table').on('click',"[class='update']",function(){
 		var sku=$(this).attr("id");
 		var q_id= "u"+sku;
 		var qty=$('#'+q_id).val();
 		updateQty(sku,qty);
 		cart.setQuantity(sku, qty);
 		updateDisplay();
 	}); 
 	
 	$('#cart-table').on('click',"[class='remove']",function(){
 		var sku=$(this).attr("id");
 		cart.delete(sku);
 		updateDisplay();
 	});
    
    });


function handleData(response) {
	products = response.split('||');
	$.get("http://jadran.sdsu.edu/jadrn042/servlet/GetOnHandQty", handleOnHand);
}

function handleOnHand(response) {
	onHandQty = response.split('||');
	evaluateStatus();
}



function updateQty(sku,addQty) {
	if (cartArray.length > 0) {
        for(i=0; i < cartArray.length; i++) {
        	if(cartArray[i][0] == sku) {
        	for(var j=0; j< products.length ; j++) {
				var product = products[j].split('|');
				if(product[0] == sku) {
					product[9] = product[9] + cartArray[i][1];
					product[9] = product[9] - addQty;
					if(product[9] == 0) {
						product[8] = "Out of Stock";
					}
					break;
				}
			}
			}
        }
    }
    updateDisplay();
}

function 

function evaluateStatus() {
	for(var i=0; i< products.length ; i++) {
		var product = products[i].split('|');
		for(var j=0; j< onHandQty.length ; j++) {
			var status ="";
			var qty = -1;
			onhand = onHandQty[j].split('|');
			if(product[0] == onhand[0]) {
				if(onhand[1] > 0) 
					status = "In stock";	
				else if(onhand[1] == 0) 
					status = "Out of Stock";	
				qty= onhand[1];
				break;	
			}
		}
		if(status == ""){
			status = "Coming Soon";
		}
		products[i] = products[i] + "|" + status + "|" + qty;
	}
	updateQuantity();
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
				var product = products[j].split('|');
				if(product[0] == cartArray[i][0]){
	   				toWrite += "<tr><td>"+product[2]+"&nbsp;-&nbsp;"+product[3]+"<br/><img class='c_image' src='http://jadran.sdsu.edu/~jadrn042/proj1/p_Imges/"+product[5]+"' /></td>";
        			toWrite += "<td><input type='tel' name='updateQty'  id='u" + cartArray[i][0] + "' size='2' value='" +  cartArray[i][1] + "' />";
	    			toWrite += "<br/><a class='update' id='" + cartArray[i][0] + "'>Update</a><br/><a class='remove' id='" + cartArray[i][0] + "'>Remove</a></td>";
	    			productQty += parseInt(cartArray[i][1]);
	    	
					itemPrice = parseFloat(product[4]);
	    			itemPrice = Math.round(itemPrice * 100)/100;
					productPrice += parseFloat(product[4] * cartArray[i][1] );
					productPrice = Math.round(productPrice * 100)/100;
					break;
				}
			} 
	    	toWrite += "<td> $ " + itemPrice +"</td><td> $ " + Math.round((itemPrice * cartArray[i][1])*100)/100 +"</td></tr>"; 
		}
	ShippingPrice = parseInt(productQty, 10) * 5;
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

