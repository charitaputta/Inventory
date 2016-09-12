

import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import helpers.*;

public class ConfirmOrder extends HttpServlet {
    
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException {
	
	response.setContentType("text/html");
    PrintWriter out = response.getWriter();
	
	String[] sku = request.getParameterValues("SKUNumber");
	String[] qty = request.getParameterValues("Quantity");
	String[] itemPrice = request.getParameterValues("Price");
	String[] title = request.getParameterValues("Title");
	String shipping = request.getParameter("Shipping");
	String tax = request.getParameter("Tax");
	String totalPrice = request.getParameter("Total");
	String name = request.getParameter("fname")+" "+request.getParameter("lname");
	String email = request.getParameter("email");
	String phone = request.getParameter("areacode")+"-"+request.getParameter("prefix")+"-"+request.getParameter("phone");
	String[] address = new String[]{request.getParameter("s_address1"),request.getParameter("s_address2"),request.getParameter("s_city"),request.getParameter("s_state"),request.getParameter("s_zip")};
	String result = "";
	
	Calendar javaCalendar = Calendar.getInstance();
	String date = javaCalendar.get(Calendar.YEAR) + "." + (javaCalendar.get(Calendar.MONTH) + 1) + "." + javaCalendar.get(Calendar.DATE);
	int check = -1;
	
	for(int i=0; i< sku.length ; i++) {
		String s_query = "SELECT * FROM on_hand WHERE sku=\"" + sku[i] + "\"";
		Vector<String []> tmp1 = DBHelper.doQuery(s_query);	
		if(tmp1.size() == 0) {
			check = -1;
			result += "\n Product with SKU: "+sku[i]+", is not available in Inventory";
			break;
		} else {
			String [] temp = tmp1.elementAt(0);
			int on_hand_qty= Integer.parseInt(temp[2]);
			if(on_hand_qty >= Integer.parseInt(qty[i]) ) {
				String i_query="INSERT into merchandise_out(sku, date, quantity) VALUES (\'" + sku[i] + "\',\'" + date + "\',\'" + qty[i] + "\')";
				int result_out=DBHelper.doUpdate(i_query);
				if(result_out == -1) {
					check = -1;
					result+= "\n Database update Failed, Please try again";
					break;
					}
				else {
					int total_qty= on_hand_qty - Integer.parseInt(qty[i]);
					String i_query2="UPDATE on_hand SET last_modified=\'"+date+"\', on_hand_quantity=\'"+ String.valueOf(total_qty) +"\' WHERE sku=\'"+sku[i]+"\'";
					int row2=DBHelper.doUpdate(i_query2);
					if(row2 == -1) {
						check = -1;
						result += "\n Merchandise sent not updated in on-hand table";
						break;
					} else {
						check = 1;
						result += "\n Merchandise Sent - SKU: "+sku[i]+" & Quantity: "+qty[i];
					}
				}
			} else {
				check = -1;
				result += " Transaction Failed, Only "+on_hand_qty+" products are available of SKU: "+sku[i];
				break;
			}
		} 
	} 
	
	if(check == 1) 
		out.print("Order Placed Successfully"+ name);
	else if(check == -1) 
		out.print("Sorry, Unable to Process your Order"+result);
	
	Vector <String []> items = new Vector<String []>();
	for (int i=0; i < sku.length; i++) {
		title[i] = title[i].replaceAll("[^a-zA-Z0-9-\\s]", "");
		String[] eachRow = new String[]{sku[i], qty[i], itemPrice[i], title[i] };
		items.addElement(eachRow);
	}
	
	String customer[] = new String[]{ name , email, phone};
	String order[] = new String[]{ shipping , tax , totalPrice };
	
	request.setAttribute("Status", check);
	request.setAttribute("Items", items);
	request.setAttribute("Order", order);
	request.setAttribute("Customer", customer);
	request.setAttribute("Address", address);
	
	RequestDispatcher dispatcher 
            = request.getRequestDispatcher("/WEB-INF/proj3_jsp/confirm.jsp");   
        dispatcher.forward(request, response);
	
    }
    
    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {
    	doGet(request, response);
    }
      
}



