
//function from tutorials
function addEvent(object, evName, fnName, cap) {
   if (object.attachEvent)
       object.attachEvent("on" + evName, fnName);
   else if (object.addEventListener)
       object.addEventListener(evName, fnName, cap);
}

//function from tutorials
function setCookie(cName, cValue, expDate, cPath, cDomain, cSecure) {
   if (cName && cValue != "") {
      var cString = cName + "=" + escape(cValue);
      cString += (expDate ? ";expires=" + expDate.toGMTString(): "");
      cString += (cPath ? ";path=" + cPath : "");
      cString += (cDomain ? ";domain=" + cDomain : "");
      cString += (cSecure ? ";secure" : "");
      document.cookie = cString;
   }
}

//function from tutorials
function delCookie(cName) {
   if (document.cookie) {
      var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
         if (cookies[i].split("=")[0] == cName) {
            document.cookie = cName + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
         }
      }
   }
}

//function from tutorials
function storeCookieField(cName, fName, fValue, expDate, cPath, cDomain, cSecure) {

   if (cName  && fName  && fValue != "") {

      var subkey = fName + "=" + escape(fValue);

      var cValue = null;
      var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
         if (cookies[i].split("=")[0] ==  cName) {
            cValue = cookies[i].slice(cookies[i].indexOf("=") + 1);
            break;
         }
      }
     if (cValue) {
         var foundField = false;
         var subkeys = cValue.split("&");
         for (var i = 0; i < subkeys.length; i++) {
            if (subkeys[i].split("=")[0] == fName) {
               foundField = true;
               subkeys[i] = subkey;
               break;
            }
         }
         if (foundField) cValue = subkeys.join("&")
         else cValue += "&" + subkey;
     } else {
         cValue = subkey;
     }
      var cString = cName + "=" + cValue;
      cString += (expDate ? ";expires=" + expDate.toGMTString(): "");
      cString += (cPath ? ";path=" + cPath : "");
      cString += (cDomain ? ";domain=" + cDomain : "");
      cString += (cSecure ? ";secure" : "");
	  document.cookie = cString;
   } 
}

//function from tutorials
function getCookie(cName) {
   if (document.cookie) {
      var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
         if (cookies[i].split("=")[0] == cName) {
            return unescape(cookies[i].split("=")[1]);
         }
      }
   }
}

//function from tutorials
function getField(cName, fName) {
   if (document.cookie) {
      var cValue = null;
      var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
         if (cookies[i].split("=")[0] == cName) {
            cValue = cookies[i].slice(cookies[i].indexOf("=") + 1 );
            break;
         }
      }
      if (cValue) {
         var subkeys = cValue.split("&");
         for (var i = 0; i < subkeys.length; i++) {
            if (subkeys[i].split("=")[0] == fName)
               return unescape(subkeys[i].split("=")[1]);
         }
      }
   }
}

//delete item from cart and rebuild document.cookie with item #'s in correct sequence (required for my code structure)
function deleteItem(e) {
	//get target element, cross-browser
	event = e || window.event;
	target = event.target || event.srcElement;
	
	//delete selected item from cookies
	delCookie("item" + target.number);
	
	delCookie("order");
	
	if (document.cookie) {
		//get cookies and create new array to copy them into
		var nameArray = document.cookie.split("item");
		var newCookies = [];
		
		//re-number cookies and copy into array
		for (var i=1; i <= document.cookie.split("; ").length; i++)
		{
			//determine if cookie has single or double digit item number, since i < 10 does not always correlate
			if (nameArray[i].substring(0,2).indexOf("=") > -1)  {
				var itemlessCookie = nameArray[i].slice(1, nameArray[i].length);
				var newItem = "item" + i + itemlessCookie;
				newCookies.push(newItem);
			} else {
				var itemlessCookie = nameArray[i].slice(2, nameArray[i].length);
				var newItem = "item" + i + itemlessCookie;
				newCookies.push(newItem);
			}
		}
		
		//get document.cookie's length before it changes inside the following loop
		var iterations = document.cookie.split("; ").length + 1;
		
		//delete old cookies
		for (var i=1; i <= iterations; i++) {
			delCookie("item" + i);
		}
		
		//document.cookie's assignment statement is weird so strings with
		//whitespace have to be assigned one at a time. 
		for (var i=0; i < newCookies.length; i++) {
			document.cookie = newCookies[i];
		}
	}
	
	//remove html row containing item information and reload page
	target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
	window.location = "cart.html";
}