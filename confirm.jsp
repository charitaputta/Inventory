<%@ page import="javax.servlet.*, javax.servlet.http.*, javax.util.*, javax.io.*, javax.text.*, java.util.*" %>

<%@page import="java.text.SimpleDateFormat" %>  
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">


<head>
	<title>Online Camera Store</title>
	<meta http-equiv="content-type" 
		content="text/html;charset=utf-8" />
	<link rel="shortcut icon" href="/jadrn042/proj2/images/icon.png" />
	<link rel="stylesheet" type="text/css" href="/jadrn042/proj3/proj3.css" />
    <script type="text/javascript" src="/jquery/jquery.js"></script>
    <script type="text/javascript" src="/jadrn042/proj3/js/shopping_cart.js"></script>
    <script type="text/javascript" src="/jadrn042/proj3/js/search.js"></script>
</head>

<body>
            	
	<div id="wrapper">
	  <div id="banner">	
	  	<img id="logo"src="/jadrn042/proj3/images/icon.png" />
	  	<a href="/jadrn042/proj3/cart.html"><div id="shopping-cart"><span id="count">0</span>
	  	<img id="cart" src="/jadrn042/proj3/images/cart.png"></div></a>
		
		<h1 display="inline" id="bannerTitle">Camera Store</h1><br/>	
	</div>
	<div id = "navigation">
     <ul>
      <li><a href = "proj3.html" >Home</a></li>
      <li><a href = "products.html">Products</a></li>
      <li><a href = "about.html">About Us</a></li>
      <li><a href = "contact.html">Contact Us</a> </li>
      <input type="text" name="search" size="20" placeholder="Enter keyword" id="search" />
      <input type="button" value="Search" id="searchbutton" /> 
      </ul>
    </div>
    <div id="content">
    <% String[] customer = (String[])request.getAttribute("Customer"); 
		String[] order = (String[])request.getAttribute("Order"); 
		String[] address = (String[])request.getAttribute("Address"); 
		Vector <String []> items = (Vector<String []>)request.getAttribute("Items"); %>
    
    <% Integer status = (Integer) request.getAttribute("Status");
		 if (status == -1) {
	%> 
	<center><h3>Sorry <%= customer[0]%>!!!</h3></center>
	<center><h3>Unable to process your order. Please Try Again</h3></center>
	<%								
		}
		else if(status == 1){					
	%> 
	<%  Date dNow = new Date( );
        SimpleDateFormat ft = new SimpleDateFormat("E yyyy.MM.dd 'at' hh:mm a "); %>
	
	<table id='confirmtable'>
	<center><h3>Thank You! <%= customer[0]%></h3></center>
    <center><caption>Your Order has been Placed Successfully</caption></center>
    <tr><td colspan='2'><b>Order Details </b></td><td colspan='2'><%= ft.format(dNow) %></td></tr>
    <tr><th>SKU</th><th>Item</th><th>Quantity</th><th>Price</th></tr>
    <% for(String[] eachItem : items) {  
    %>
	 	
	 	<tr> 
			<td> <%= eachItem[0] %>  </td>
			<td> <%= eachItem[3] %>  </td>
			<td> <%= eachItem[1] %>  </td>
			<td> <%= eachItem[2] %>  </td> 
		</tr> 
	<%	} %>
    
    <tr><th>Calculated Tax: </th><td>$ <%= order[1] %></td><th> Shipping Charges: </th><td>$ <%= order[0] %></td></tr>
 	
 	<tr><th>Total Order Price:</th><td colspan='3'> $ <%= order[2] %></td></tr>	
	<tr><th colspan='4'>Shipment Address</th></tr>
	<tr><td><b>Address:</b> <td colspan='3'><%= address[0] %> ,&nbsp; <%= address[1] %> </td></tr>
	<tr><td>&nbsp;</td><td colspan='3'><%= address[2] %>, <%= address[3] %> - <%= address[4] %></td></tr>
	<tr><td colspan='2'><b>Email:</b>&nbsp; <%= customer[1] %></td><td colspan='2'><b>Tel:</b> &nbsp; <%= customer[2] %></td></tr>

	</table>
	
	<% } %>
	<center><a href='/jadrn042/proj3/proj3.html' class='shop_link' />Home</a></center>
	</div>
	
	<img id="brand" src="/jadrn042/proj3/images/brands.gif" />
	<div id="footer"> 
		<h4 id="footer_title">&copy; 2015 Camera Store, Inc. All rights reserved.</h4>
	</div>
	</div>	
	
</body>

</html>