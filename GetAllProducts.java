

import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import helpers.*;

public class GetAllProducts extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException {

	response.setContentType("text/html");
    PrintWriter out = response.getWriter();
	
	String query = "SELECT sku_id, category_name, vendor_name, manufacturer_id, retail, image, description, features FROM product p, "+
			" vendor v, category c WHERE p.category_id=c.category_id AND p.vendor_id=v.vendor_id";
	Vector <String []> tmp = DBHelper.doQuery(query);
	String answer ="";
	if(tmp.size()>0){
		for(int i= 0; i<tmp.size(); i++){
			String [] temp = tmp.elementAt(i);
			for(int j=0; j < temp.length; j++) {
				answer += temp[j] + "|";
			}
			answer = answer.substring(0, answer.length()-1);
			answer += "||";
		}
		answer = answer.substring(0, answer.length()-2);	
	}
	
	out.print(answer);
	
    }
    
    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException
    {
    	doGet(request, response);
    }
      
}



