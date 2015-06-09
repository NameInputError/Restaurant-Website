//Add checked items to shopping cart cookie

//product information constructor
function product() { 
	this.name = null;
	this.price = null;
	this.qty = 1;
}

//event handler for add items button
function addToCart() {
	
	//cookie test
	var cookieTest = false;
	
	setCookie("tempCookie", "temp");
	
	if (getCookie("tempCookie")) {
		cookieTest = true;
		delCookie("tempCookie");
	}
	
	//if cookies supported, retrieve orders
	if (!cookieTest) {
		alert("You must have cookies enabled to use this shopping cart");
	} else {
		//delete order summary cookie in case it's in middle of list
		delCookie("order");
		
		//get tables and get offset for cookie names if cookies exist
		var allTables = document.getElementsByTagName("table");
		var itemCount = document.cookie ? document.cookie.split("; ").length : 0;
		
		//go through all checkboxes and store item info in cookie if checked
		for (var i=0; i <allTables.length; i++) {
			for (var j=0; j < allTables[i].rows.length; j++) {
				if (allTables[i].rows[j].cells[2].firstChild.nextSibling.checked) {
					var item = new product();
					var expireDate = new Date();
					
					//increase cookie name by 1
					itemCount++;
					expireDate.setHours(expireDate.getHours() + 48);
					
					//get name and qty for cookie
					item.name = allTables[i].rows[j].cells[1].getElementsByTagName("span")[0].innerHTML;
					item.qty = allTables[i].rows[j].cells[2].getElementsByTagName("select")[0].value;
					
					//get price field for cookie
					var price = allTables[i].rows[j].cells[3].innerHTML
					item.price = parseFloat(price.split("$")[1]);
					
					//store cookie fields
					storeCookieField("item" + itemCount, "name", item.name, expireDate);
					storeCookieField("item" + itemCount, "qty", item.qty, expireDate);
					storeCookieField("item" + itemCount, "price", item.price, expireDate);
				}
			}
		}
		//do not proceed if no items selected
		if (document.cookie) window.location = "cart.html";
		else alert("You have no items selected.");
	}
}