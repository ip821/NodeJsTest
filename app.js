 $ = require("jquery");
 global.jQuery = $;
global.document = window.document;
var gui = require('nw.gui');
var bootstrap = require("bootstrap");

gui.Window.get().show();
gui.Window.get().showDevTools();

var strUrl = 'http://oauth.vk.com/authorize?client_id=4225742&scope=8&redirect_uri=http://oauth.vk.com/blank.html&display=wap&response_type=token';
//gui.Window.get().cookies.remove();
window.intervalId = window.setInterval("window.hashUpdate()", 500);
window.loginWindow = window.open(strUrl, "Login", false);
window.hashUpdate = function() {
  if(window.loginWindow.closed){
    window.clearInterval(intervalId);
//    start(); //just a callback that I'm using to start another part of my application (after I caught the token)
  }
  else {
    var strUrl = window.loginWindow.document.URL;
    if(strUrl.indexOf('#') > -1){
    	var strParams = strUrl.split('#')[1];
    	if(strParams.indexOf('&') > -1){
    		var params = strParams.split('&');
		    console.log(params);

    		var accessToken = params.filter(function(item){
    		 	var keyValue = item.split('=');
    		 	if(keyValue[0] === 'access_token'){
    		 		var accessToken = keyValue[1];
    		 		console.log("accessToken: " + accessToken);
    		 		window.loginWindow.close();
    		 		$('body').html('Vk access token: ' + accessToken);
    		 	}
    		});
    	}
	}
  }
}