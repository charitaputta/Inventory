
var cart = new shopping_cart("jadrn042");

$(document).ready( function() {

	$('#count').text(cart.size());
	$('#search').val('');
	$("#shopping-cart").attr('title', 'Click to View Your Cart');
	
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
    
});