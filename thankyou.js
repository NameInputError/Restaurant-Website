
addEvent(window, "load", setupPage, false);

function setupPage() {
	//redirect if page reached through typing in url bar
	if (!document.cookie) window.location = "menu.html";
	
	displayInfo();
	displayOrder();
}

//display pickup and customer information
function displayInfo() {
	//get order summary cookie fields
	var info = document.getElementById("custInfo");
	var fName = getField("order", "fName");
	var lName = getField("order", "lName");
	var phone = getField("order", "phone");
	var hours = getField("order", "hours");
	var minutes = getField("order", "minutes");
	var ampm = getField("order", "ampm");
	var month = getField("order", "month");
	var day = getField("order", "day");
	var card = getField("order", "card");
	
	//display pickup and customer information
	info.innerHTML = "The following order will be ready for pickup on " + month + " " + day + " at " +
			hours + ":" + minutes + " " + ampm + " for " + fName + " " + lName + ", " +
			"with telephone number of " + phone + " and credit card ending in " + card + ":";
}

//display order items
function displayOrder() {
	
	var cookies = document.cookie.split("; ");
	
	//offset in case "order" cookie is in middle of list from ordering additional items
	//after it's created.
	var cookieOffset = 0;
	
	for (var i=1; i < cookies.length + 1; i++) {
		//if "order" cookie, add offset and skip iteration
		if (cookies[i - 1].indexOf("order") > -1) {
			cookieOffset = 1;
			continue;
		}
		
		//get cookie fields
		var name = getField("item" + (i - cookieOffset), "name");
		var qty = getField("item" + (i - cookieOffset), "qty");
		
		var itemInfo = document.createElement("p");
		
		//add item info to element and append it to document
		itemInfo.innerHTML = "" + qty + " " + name + "."
		document.getElementById("order").appendChild(itemInfo);
	}
}