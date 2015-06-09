//get cookies from shopping cart and display them on a table

addEvent(window, "load", createCart, false);

//display items in cart
function createCart() {
	//redirect if page was accessed through typing in url bar or last item was deleted
	if (!document.cookie) window.location = "menu.html";
	
	addHandlers();
	
	//delete order summary cookie in case adding items left it in middle of list
	delCookie("order");
	
	//get individual cookies
    var cookies = document.cookie.split("; ");
	var orderSub = 0;
	
	//create table and table head elements
	var cartTable = document.createElement("table");
	var tcaption = document.createElement("caption");
	var tableHead = document.createElement("thead");
	var tableBody = document.createElement("tbody");
	var headRow = document.createElement("tr");
	var tName = document.createElement("th");
	var tPrice = document.createElement("th");
	var tQty = document.createElement("th");
	var tSubtotal = document.createElement("th");
	var delButton = document.createElement("th");
	
	//set id and column descriptions
	cartTable.id = "cartTable";
	tcaption.innerHTML = "Item(s) currently in your cart";
	tName.innerHTML = "Item";
	tPrice.innerHTML = "Price";
	tQty.innerHTML = "Quantity";
	tSubtotal.innerHTML = "Item Subtotal";
	delButton.innerHTML = "Delete Item";
	
	//append table elements to document
	cartTable.appendChild(tcaption);
	headRow.appendChild(tName);
	headRow.appendChild(tPrice);
	headRow.appendChild(tQty);
	headRow.appendChild(tSubtotal);
	headRow.appendChild(delButton);
	tableHead.appendChild(headRow);
	cartTable.appendChild(tableHead);
	document.getElementById("tableDiv").appendChild(cartTable);
	
	//iterate through cookies and display one item per row
	for (var i=1; i < cookies.length + 1; i++) {
		//get cookie fields
		var name = getField("item" + i, "name");
		var price = getField("item" + i, "price");
		var qty = getField("item" + i, "qty");
		var itemSub = (qty * price).toFixed(2);
		
		//create row elements
		var itemRow = document.createElement("tr");
		var nameCell = document.createElement("td");
		var priceCell = document.createElement("td");
		var qtyCell = document.createElement("td");
		var subtotalCell = document.createElement("td");
		var deleteCell = document.createElement("td");
		var deleteButton = document.createElement("input");
		
		//fill in item info
		nameCell.innerHTML = name;
		priceCell.innerHTML = "$" + price;
		qtyCell.innerHTML = qty;
		subtotalCell.innerHTML = "$" + itemSub;
		
		//create delete properties
		deleteButton.type = "button";
		deleteButton.value = "Delete";
		deleteButton.number = i;
		addEvent(deleteButton, "click", deleteItem, false);
		
		//append table items
		deleteCell.appendChild(deleteButton);
		itemRow.appendChild(nameCell);
		itemRow.appendChild(priceCell);
		itemRow.appendChild(qtyCell);
		itemRow.appendChild(subtotalCell);
		itemRow.appendChild(deleteCell);
		tableBody.appendChild(itemRow);
		
		//update order subtotal
		orderSub += parseFloat(itemSub);
	}
	//append table body
	cartTable.appendChild(tableBody);
	
	//clean up subtotal display
	document.getElementById("orderSub").innerHTML = orderSub.toFixed(2);
}

//add event handlers to inputs
function addHandlers() {
	//get elements for handlers
	var tipSelect = document.getElementById("tip")
	var tipDisplay = document.getElementById("tipAmt");
	var tipMessage = document.getElementById("tipMessage");
	var shopButton = document.getElementById("shopbutton");
	var checkoutButton = document.getElementById("checkoutButton");
	
	tip.selectedIndex = 0;
	
	//go back to menu
	addEvent(shopbutton, "click", function() {
		window.location = "menu.html";
	}, false);
	
	//proceed to checkout
	addEvent(checkoutbutton, "click", checkOut, false);
	
	//display tip amount and message
	addEvent(tipSelect, "change", function(e) { 
		evt = e || window.event;
		target = evt.target || evt.srcElement;
		if (target.value == "blank") {
			tipMessage.innerHTML = ""
			tipDisplay.innerHTML = "$0.00";
		}
		else if (target.value == ".10") {
			tipMessage.innerHTML = "Thank you.";
			tipDisplay.innerHTML = "$" + (orderSub.innerHTML * .1).toFixed(2);
		}
		else if (target.value == ".15") {
			tipMessage.innerHTML = "Thank you!";
			tipDisplay.innerHTML = "$" + (orderSub.innerHTML * .15).toFixed(2);
		}
		else if (target.value == ".18") {
			tipMessage.innerHTML = "Thank you for your generosity!";
			tipDisplay.innerHTML = "$" + (orderSub.innerHTML * .18).toFixed(2);
		}
		else if (target.value == ".20") {
			tipMessage.innerHTML = "Thank you for your extraordinary kindess!";
			tipDisplay.innerHTML = "$" + (orderSub.innerHTML * .2).toFixed(2);
		}
	}, false);
}

//create order summary cookie and proceed to checkout
function checkOut() {
	var expireDate = new Date();
	expireDate.setHours(expireDate.getHours() + 48);
	
	storeCookieField("order", "sub", document.getElementById("orderSub").innerHTML, expireDate);
	storeCookieField("order", "tip", document.getElementById("tipAmt").innerHTML, expireDate);
	
	window.location = "checkout.html";
}