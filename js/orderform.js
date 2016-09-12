


var cart = new shopping_cart("jadrn042");

$(document).ready(function() {

	$('#form2')[0].reset();

	var errorStatus = $('#message_line1');
	
	var element = new Array();
    element[0] = $('[name="fname"]');
    element[1] = $('[name="lname"]');
    element[2] = $('[name="email"]');
    element[3] = $('[name="s_address1"]');
    element[4] = $('[name="s_city"]');
    element[5] = $('[name="s_state"]');
    element[6] = $('[name="s_zip"]');
    element[7] = $('[name="nameonc"]');
    element[8] = $('[name="cardno"]');
    element[9] = $('[name="cvv"]');
    
    element[10] = $('[name="b_address1"]');
    element[11] = $('[name="b_city"]');
    element[12] = $('[name="b_state"]');
    element[13] = $('[name="b_zip"]');
    
    
    var hac= $('[name="areacode"]');
    var hpr= $('[name="prefix"]');
    var hph= $('[name="phone"]');

	$('[name="month"]').on('keyup', function() {
        if($('[name="month"]').val().length == 2)       
        $('[name="year"]').focus();
	});
	
	element[5].on('keyup', function() {
		var value=$(this).val();
		$(this).val(value.toUpperCase());
	});
	
	element[5].on('keyup', function() {
		var value=$(this).val();
		$(this).val(value.toUpperCase());
	});	
	
	hac.on('keyup', function() {
        if(hac.val().length == 3)       
        hpr.focus();
    });
            
    hpr.on('keyup', function() {
        if(hpr.val().length == 3)       
        hph.focus();
	});   
			
    
    $('[name="sameaddr"]').click(function(){
        if ($('[name="sameaddr"]').is(":checked")) {
        	var value=element[3].val();
        	element[10].val(value);
        	value=$('[name="s_address2"]').val();
        	$('[name="b_address2"]').val(value);
        	value=element[4].val();
        	element[11].val(value);
        	value=element[5].val();
        	element[12].val(value);
        	value=element[6].val();
        	element[13].val(value);
    	}
    	else {
    		element[10].val("");
    		element[11].val("");
    		element[12].val("");
    		element[13].val("");
    	}
    });
    
    $(':reset').on('click', function() {
    	errorStatus.html("");
       	$('*').removeClass("error");
    });
	      
	$(':submit').on('click', function(e) {
		$('*').removeClass("error");	
        errorStatus.html("");
	    if(!validate_Data()){
	    	
	    	e.preventDefault();
        	return;    
        }   
	   	else {
	   	var cartArray = cart.getCartArray();
	   	if(cartArray.length > 0) {
	   		cart.deleteall();
	   		$('#form2').submit();
	   		} else {
	   			$('#orderform').dialog("close");
	   			$('#form2')[0].reset();
	   			errorStatus.html("Sorry, There are no items in your cart");
	   		}
	   	}       
    });
    
    function validate_Data() { 
    	
    	var htel= $.trim($('[name="areacode"]').val()) +
			  $.trim($('[name="prefix"]').val()) +
			  $.trim($('[name="phone"]').val());
    	
    	if(isEmpty(element[0].val())) {
            element[0].addClass("error");
            errorStatus.html("Please enter your First name");
            element[0].focus();
            return false; 
        }
        
        if(isEmpty(element[1].val())) {
            element[1].addClass("error");
            errorStatus.html("Please enter your Last name");
            element[1].focus();
            return false; 
        }	
        if(isEmpty(htel)) {
            hac.addClass("error");
            hpr.addClass("error");
            hph.addClass("error");
            errorStatus.html("Please enter Phone Number ");
            hac.focus();
            return false;
            }
            
     	if(!isEmpty(htel)) {
        	if (isEmpty(hac.val())) {
        		hac.focus();
        		errorStatus.html("Please enter your Phone Number's areacode");
        		return false;
        	}
        	if (isEmpty(hpr.val())) {
        		hpr.focus();
        		errorStatus.html("Please enter your Phone Number's prefix");
        		return false;
        	}
        	if (isEmpty(hph.val())) {
        		hph.focus();
        		errorStatus.html("Please enter your Phone Number's Phone");
        		return false;
        	}
        }
    	if(!$.isNumeric(htel)) {
        	if(!$.isNumeric(hac.val())) {
        		errorStatus.html("The Phone number's areacode appears to be invalid, numbers only please.");
        		hac.addClass("error");
        		hac.focus();
        		return false;
        	}
        	if(!$.isNumeric(hpr.val())) {
        		errorStatus.html("The Phone number's prefix appears to be invalid, numbers only please.");
        		hpr.addClass("error");
        		hpr.focus();
        		return false;
        	}
        	if(!$.isNumeric(hph.val())) {
        		errorStatus.html("The Phone number's, Phone field appears to be invalid, numbers only please.");
        		hph.addClass("error");
        		hph.focus();
        		return false;
        	}
        }  
        else if(validate_Tel(htel)) {
        	if(hac.val().length != 3) {
        		errorStatus.html("The Phone number's areacode must have 3 digits");
        		hac.addClass("error");
        		hac.focus();
        		return false;
        	}
        	if(hpr.val().length != 3) {
        		errorStatus.html("The Phone number's prefix must have 3 digits");
        		hpr.addClass("error");
        		hpr.focus();
        		return false;
        	}
        	if(hph.val().length != 4) {
        		errorStatus.html("The Phone number's, Phone field must have 4 digits.");
        		hph.addClass("error");
        		hph.focus();
        		return false;
        	}	
        } 
        if(isEmpty(element[2].val())) {
            element[2].addClass("error");
            errorStatus.html("Please enter your Email Id");
            element[2].focus();
            return false;
            }
            
        if(!validate_Email()) {
        	element[2].addClass("error");
            errorStatus.html("Please enter a valid Email Id");
            element[2].focus();
        	return false;
        	}
    
    	if(isEmpty(element[3].val())) {
            element[3].addClass("error");
            errorStatus.html("Please enter your Address");
            element[3].focus();
            return false;
        }
            
        if(isEmpty(element[4].val())) {
            element[4].addClass("error");
            errorStatus.html("Please enter your City");
            element[4].focus();
            return false;
		}
            
        if(!validate_City(element[4].val())) {
        	element[4].addClass("error");
            errorStatus.html("Please enter a valid City name");
            element[4].focus();
        	return false;
        }
            
        if(isEmpty(element[5].val())) {
            element[5].addClass("error");
            errorStatus.html("Please enter your State");
            element[5].focus();
            return false;
            }
        
        if(!validate_State(element[5].val())) {
        	element[5].addClass("error");
            errorStatus.html("Please enter a valid 2 letter State Abbreviation");
            element[5].focus();
        	return false;
        	
        }
            
        if(isEmpty(element[6].val())) {
            element[6].addClass("error");
            errorStatus.html("Please enter your Zip code");
            element[6].focus();
            return false;
        }
            
        if(!validate_Zip(element[6].val())) {
        	element[6].addClass("error");
            errorStatus.html("Please enter a valid 5 digit Zip code");
            element[6].focus();
        	return false;
    	}
    	
    	if(!validate_Ptype()) {
            errorStatus.html("Please choose Payment type");
            $('[name="ptype"]').focus();
        	return false;
    	}
    	
    	if(isEmpty(element[7].val())) {
            element[7].addClass("error");
            errorStatus.html("Please enter Name on Card");
            element[7].focus();
            return false;
        }
        
        if(isEmpty(element[8].val())) {
            element[8].addClass("error");
            errorStatus.html("Please enter Card Number");
            element[8].focus();
            return false;
        }
        if(!$.isNumeric(element[8].val())) {
        	element[8].addClass("error");
            errorStatus.html("Invalid, digits only");
            element[8].focus();
            return false;
        }
		if((element[8].val()).length != 15 && (element[8].val()).length != 16 ){
    		element[8].addClass("error");
            errorStatus.html("Invalid, American Express Card has 15 digits. 16 digits in Visa & Master Cards");
            element[8].focus();
            return false;
    	}
    	
    	if(isEmpty($('[name="month"]').val())) {
        	$('[name="month"]').addClass("error");
            errorStatus.html("Please enter Month field in Expiration Date");
            $('[name="month"]').focus();
            return false;
            }
        else if(!$.isNumeric($('[name="month"]').val())){
        	$('[name="month"]').addClass("error");
        	errorStatus.html("Please enter digits only");
        	$('[name="month"]').focus();
        	return false;
        } 
        
        if(isEmpty($('[name="year"]').val())) {
        	$('[name="year"]').addClass("error");
            errorStatus.html("Please enter year field in Expiration Date");
            $('[name="year"]').focus();
            return false;
            }
        else if(!$.isNumeric($('[name="year"]').val())){
        	$('[name="year"]').addClass("error");
        	errorStatus.html("Please enter numbers only");
        	$('[name="year"]').focus();
        	return false;
        }
        
        if(!validate_Date()) {
        	return false;
        }
    	
        if(isEmpty(element[9].val())) {
            element[9].addClass("error");
            errorStatus.html("Please enter CVV");
            element[9].focus();
            return false;
        }
        
       	if((!$.isNumeric(element[9].val())) || ((element[9].val()).length < 3)) {
       		element[9].addClass("error");
            errorStatus.html("Invalid CVV, Enter a valid 3/4 digit Cvv ");
            element[9].focus();
            return false;
       	}
       	
       	
    	
    	if(isEmpty(element[10].val())) {
            element[10].addClass("error");
            errorStatus.html("Please enter Address, in Billing Address Section");
            element[10].focus();
            return false;
        }
            
        if(isEmpty(element[11].val())) {
            element[11].addClass("error");
            errorStatus.html("Please enter City, in Billing Address Section");
            element[11].focus();
            return false;
		}
            
        if(!validate_City(element[11].val())) {
        	element[11].addClass("error");
            errorStatus.html("Please enter a valid City name, in Billing Address Section");
            element[11].focus();
        	return false;
        }
            
        if(isEmpty(element[12].val())) {
            element[12].addClass("error");
            errorStatus.html("Please enter State, in Billing Address Section");
            element[12].focus();
            return false;
            }
        
        if(!validate_State(element[12].val())) {
        	element[12].addClass("error");
            errorStatus.html("Please enter a valid 2 letter State Abbreviation, in Billing Address Section");
            element[12].focus();
        	return false;
        }
            
        if(isEmpty(element[13].val())) {
            element[13].addClass("error");
            errorStatus.html("Please enter Zip code, in Billing Address Section");
            element[13].focus();
            return false;
        }
            
        if(!validate_Zip(element[13].val())) {
        	element[13].addClass("error");
            errorStatus.html("Please enter a valid 5 digit Zip code, in Billing Address Section");
            element[13].focus();
        	return false;
    	}
    
    	return true;
    }
    
    /* on Blur Functions */
    
    element[0].on('blur', function() {
    	if(isEmpty(element[0].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[1].on('blur', function() {
    	if(isEmpty(element[1].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[2].on('blur', function() {
    	if(isEmpty(element[2].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[3].on('blur', function() {
    	if(isEmpty(element[3].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[4].on('blur', function() {
    	if(isEmpty(element[4].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[5].on('blur', function() {
    	if(isEmpty(element[5].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[6].on('blur', function() {
    	if(isEmpty(element[6].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[7].on('blur', function() {
    	if(isEmpty(element[7].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[8].on('blur', function() {
    	if(isEmpty(element[8].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[9].on('blur', function() {
    	if(isEmpty(element[9].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[10].on('blur', function() {
    	if(isEmpty(element[10].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[11].on('blur', function() {
    	if(isEmpty(element[11].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[12].on('blur', function() {
    	if(isEmpty(element[12].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    element[13].on('blur', function() {
    	if(isEmpty(element[13].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    hac.on('blur', function() {
    	if(isEmpty(hac.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    hpr.on('blur', function() {
    	if(isEmpty(hpr.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    hph.on('blur', function() {
    	if(isEmpty(hph.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    $('[name="month"]').on('blur', function() {
    	if(isEmpty(hph.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    $('[name="year"]').on('blur', function() {
    	if(isEmpty(hph.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
});


function isEmpty(fieldValue) {
    if($.trim(fieldValue).length == 0)
    	return true;
    return false;  
}  

function validate_Tel(t) {
	var value= t.length;
	if(value == 10)
	return false
	return true;
}

function validate_Ptype() {
	var radio = document.getElementsByName("ptype")
	var check = -1
	for(var i=0; i<radio.length; i++) {
		if(radio[i].checked) {
			check = i;
		}
	}
	if(check == -1)
	return false;
	return true;
}

function validate_Email() {
	var value= $.trim($('[name="email"]').val());
	var pattern=/\S+@\S+\.[a-zA-Z]{2,6}/;
	if(pattern.test(value))
		return true;
	return false;
}

function validate_City(val) {
	var value = $.trim(val);
	var pattern= /^[a-zA-Z\- \.]+$/;
	if(pattern.test(value))
		return true;
		return false;
}

function validate_State(state) {  
	var value= $.trim(state).toUpperCase();                          
    var stateList = new Array("AK","AL","AR","AZ","CA","CO","CT","DC",
        "DC2","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA",
        "MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH",
        "NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN",
        "TX","UT","VA","VT","WA","WI","WV","WY");
    for(var i=0; i < stateList.length; i++) 
        if(stateList[i] == value)
            return true;
         return false;
}

function validate_Zip(zip) {
	var value = $.trim(zip);
	var pattern = /^[0-9]{5}$/;
	if(pattern.test(value))
        return true;
    return false;
}

function validate_Date() {
    var Month = $.trim($('[name="month"]').val());
    var Year = $.trim($('[name="year"]').val());        
    if (Month < 1 || Month > 12) {
    	$('[name="month"]').addClass("error");
    	$('#message_line1').html("Invalid month, 1-12 months only");
    	$('[name="month"]').focus();
        return false; 
        }
	if(Year < 2014){
		$('[name="year"]').addClass("error");
    	$('#message_line1').html("Please Check the Year field of Valid through Period of Card");
    	$('[name="month"]').focus();
        return false; 
    }
    if(Year == 2014){
    	if(Month!=12) {
    	$('[name="year"]').addClass("error");
    	$('#message_line1').html("Please Check Card Validity Period Field");
    	$('[name="month"]').focus();
    	return false;
    	}
    
    }
    return true;
}