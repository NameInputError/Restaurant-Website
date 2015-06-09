

addEvent(window, "load", displayCheckout, false);

//check for valid pickup hours
function validateTime(hour, minute, am_pm) {
	if (am_pm.value == "A.M." && hour.value == 12) return false;
	else if (am_pm.value == "A.M." && hour.value > 9) return true;
	else if (am_pm.value == "P.M." && hour.value != 11) return true;
	else if (am_pm.value == "P.M." && hour.value == 11 && minute.value == 00) return true;
	else return false;
}

//display confirmation message when all 3 pickup time selects have been selected
function confirmMessage() {
	//get pickup time selects
	var hours = document.getElementById("hours");
	var minutes = document.getElementById("minutes");
	var ampm = document.getElementById("ampm");
	
	//get confirmation message element
	var message = document.getElementById("confirmMessage");
	
	//get day and month from calendar
	var month = document.getElementById("calendar_head").innerHTML.split(" ")[0];
	var day = document.getElementById("calendar_today").innerHTML;
	
	//get order total
	var total = document.getElementById("total").innerHTML;
	
	//if pickup hours, minutes and am/pm selected, display confirmation message
	if (hours.value != "" && minutes.value != "" && ampm.value != "") {
		
		//check for valid hours
		if (validateTime(hours, minutes, ampm)) {
			
			//valid pickup time, display confirmation message
			message.innerHTML = "Your order will be ready for pickup at " + hours.value + ":" +
					minutes.value + " " + ampm.value + " on " + month + " " + day +
					". Your total will be " + total + ". Please enter your credit card and information below:";
		} else {
			message.innerHTML = "";
			alert("Please select a pickup time between 10 AM and 11 PM");
		}
	}
}

//date selection handler
function selectDate(e) {
	var evt = e || window.event;
	var target = evt.target || evt.srcElement;
	var today = new Date();
	var cells = document.getElementsByClassName("calendar_dates");
	
	//prevent selection of earlier dates
	if (target.innerHTML < today.getDate()) {
		alert("Unlike you, we do not own a time machine. Please select a date within a relevant portion of the space-time continuum.");
		return;
	}
	
	//inefficient workaround due to IE's inability to recognize getElementById("calendar_today") (worked fine in firefox)
	for (var i=0; i < cells.length; i++) {
		cells[i].id = "";
	}
	
	target.id = "calendar_today";
	
	//update confirmation message with new date
	confirmMessage();
}

//verify that pickup information was selected
function validatePickup() {
	//get pickup elements
	var hours = document.getElementById("hours");
	var minutes = document.getElementById("minutes");
	var ampm = document.getElementById("ampm");
	
	//check for blank selects and alert if necessary
	if (hours.value != "" && minutes.value != "" && ampm.value != "") {
		
		//check for valid pickup hours
		if (validateTime(hours, minutes, ampm)) return true;
		else {
			alert("Please select a pickup time between 10 AM and 11 PM.");
			return false;
		}
	} else {
		alert("Please select a pickup time.");
	}
}

//validate name and phone information
function validateInfo() {
	//get information elements
	var phone1 = document.getElementById("phone1").value;
	var phone2= document.getElementById("phone2").value;
	var phone3 = document.getElementById("phone3").value;
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;
	
	//check for blank fields and prompt user to fill in if necessary
	if (phone1 != "" && phone2 != "" && phone3 != "" && lName != "" && fName != "") {
		//regular expressions for each field
		names = /^\D+$/;
		three = /^\d\d\d$/;
		four = /^\d\d\d\d$/;
		
		//validate all elements against regular expressions
		if (three.test(phone1) && three.test(phone2) && four.test(phone3) && names.test(fName) && names.test(lName)) {
			
			//ask customer to confirm info and proceed to final page, else prompt for correction
			if (confirm("Is your name " + fName + " " + lName + " and your phone number "+ phone1 + 
					"-" + phone2 + "-" + phone3 + "?")) {
				//proceed to final page
				return true;
			} else {
				//customer typed wrong information
				alert("Please correct your information.");
			}
		} else {
			//information was not valid
			alert("Please enter valid name and telephone information.");
		}
	} else {
		//fields were not filled in
		alert("Please fill in your name and telephone information.");
	}
}

//validate credit card information
function validateCC() {
	//check for a selected card
   if (selectedCard() == -1) 
      {alert("You must select a credit card");
       return false;}
	
	//check for blank credit number
   else if (document.getElementById("cardNumber").value == "")
      {alert("You must enter a credit card number");
       return false;}
	
	//validate card against luhn formula and card-specific patterns
   else if (checkNumber() == false) {
	  alert("Your card number is not valid");
	  return false;
   }
   //card is valid
   else return true;
}

//function from tutorial, get selected card index
function selectedCard() {
   var card = -1;
   card = document.getElementById("creditCard").selectedIndex;
   return card;
}

//function from tutorial. validate credit card against luhn formula and card-specific patterns
function checkNumber() {
	wsregx = /\s/g;
	var cnum = document.getElementById("cardNumber").value.replace(wsregx, "");
	
	switch (selectedCard()) {
		case 0: cregx = /^3[47]\d{13}$/; break;
		case 1: cregx = /^30[0-5]\d{11}$|^3[68]\d{12}$/; break;
		case 2: cregx = /^6011\d{12}$/; break;
		case 3: cregx = /^5[1-5]\d{14}$/; break;
		case 4: cregx = /^4(\d{12}|\d{15})$/; break;
	}
	
	return (cregx.test(cnum) && luhn(cnum));
}

//function from tutorial. validate against luhn formula
function luhn(num) {
   var luhnTotal=0;
   for (var i = num.length-1; i >= 0; i--) {
      luhnTotal += parseInt(num.charAt(i));
      i--;
      num2 = new String(num.charAt(i)*2);
      for (var j = 0; j < num2.length; j++) {
         luhnTotal += parseInt(num2.charAt(j));
      }
    }
   return (luhnTotal % 10 == 0);
}

//validate all page information
function validate() {
	//validate pickup information
	if (validatePickup()) {
		
		//validate name and phone
		if (validateInfo()) {
			
			//validate credit card
			if (validateCC()) {
				
				//proceed
				completeOrder();
			}
		}
	}
}

//store page information in order summary cookie and proceed to final page
function completeOrder() {
	//get phone info
	var phone1 = document.getElementById("phone1").value;
	var phone2= document.getElementById("phone2").value;
	var phone3 = document.getElementById("phone3").value;
	
	//put phone info in one variable ready for display
	var phone = phone1 + "-" + phone2+ "-" + phone3;
	
	//get month and day
	var month = document.getElementById("calendar_head").innerHTML.split(" ")[0];
	var day = document.getElementById("calendar_today").innerHTML;
	
	//get last 4 digits of card
	var card = document.getElementById("cardNumber").value;
	var cardNo = card.substr(card.length - 4, card.length);
	
	//store all required fields in order summary cookie
	storeCookieField("order", "fName", document.getElementById("fName").value);
	storeCookieField("order", "lName", document.getElementById("lName").value);
	storeCookieField("order", "phone", phone);
	storeCookieField("order", "hours", document.getElementById("hours").value);
	storeCookieField("order", "minutes", document.getElementById("minutes").value);
	storeCookieField("order", "ampm", document.getElementById("ampm").value);
	storeCookieField("order", "month", month);
	storeCookieField("order", "day", day);
	storeCookieField("order", "card", cardNo);
	
	//proceed to final page. yay.
	window.location = "thankyou.html"
}

//add input handlers
function addHandlers() {
	//get calendar cells
	var cells = document.getElementsByTagName("td");
	
	//add date selection handler
	for (var i=0; i < cells.length; i++) {
		if (cells[i].className == "calendar_dates") {
			addEvent(cells[i], "click", selectDate, false);
		}
	}
	
	var allSelects = document.getElementsByTagName("select");
	
	//add handler to display confirmation message when pickup time selected 
	for (var i=0; i < allSelects.length; i++) {
		if (allSelects[i].id == "hours" || allSelects[i].id == "minutes" || allSelects[i].id == "ampm") {
			addEvent(allSelects[i], "change", confirmMessage, false);
		}
	}
}

//
function displayCheckout() {
	//redirect if page reached through typing in url bar
	if (!document.cookie) window.location = "menu.html";
	
	var cookies = document.cookie.split("; ");
	
	//offset in case "order" cookie is in middle of list from ordering additional items
	//after it's created.
	var cookieOffset = 0;
	
	//get subtotal and tip info from "order" cookie
	var subtotal = getField("order", "sub");
	var tip = getField("order", "tip").split("$")[1];
	
	for (var i=1; i < cookies.length + 1; i++) {
		//if "order" cookie, add offset and skip loop
		if (cookies[i - 1].indexOf("order") > -1) { 
			cookieOffset = 1;
			continue;
		}
		
		//get item info
		var name = getField("item" + (i - cookieOffset), "name");
		var price = getField("item" + (i - cookieOffset), "price");
		var qty = getField("item" + (i - cookieOffset), "qty");
		var itemSub = (qty * price).toFixed(2);
		
		var itemInfo = document.createElement("p");
		
		//add item info to element and append it to document
		itemInfo.innerHTML = "" + qty + " " + name + ": " + "$" + itemSub;
		document.getElementById("itemList").appendChild(itemInfo);
	}
	
	//display order summary info
	document.getElementById("orderSub").innerHTML = "$" + subtotal;
	document.getElementById("tax").innerHTML = "$" + (subtotal * .09).toFixed(2);
	document.getElementById("tip").innerHTML = "$" + tip;
	document.getElementById("total").innerHTML = "$" + (parseFloat(subtotal) + parseFloat(tip) + subtotal * .09).toFixed(2);
	
	addHandlers();
}