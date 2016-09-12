/*
Vennamaneni, Bhavana Account:jadrn042 
CS0645 Spring 2015
Project #3
*/

import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import helpers.*;

public class GetOnHandQty extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
        throws IOException, ServletException {

	response.setContentType("text/html");
    PrintWriter out = response.getWriter();
	
	String query = "SELECT sku, on_hand_quantity FROM on_hand ORDER BY sku";
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



