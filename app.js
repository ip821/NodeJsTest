// init jquery and env
$ = require("jquery");
global.jQuery = $;
global.document = window.document;
XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

$.support.cors = true;
$.ajaxSettings.xhr = function() {
    return new XMLHttpRequest();
};
//

var strUrlApi = 'https://api.vk.com/method/';

var gui = require('nw.gui');
var bootstrap = require("bootstrap");

gui.Window.get().show();
gui.Window.get().showDevTools();

var accessToken = undefined;
var userId = undefined;

var strUrl = 'http://oauth.vk.com/authorize?client_id=4225742&scope=8&redirect_uri=http://oauth.vk.com/blank.html&display=wap&response_type=token';
//gui.Window.get().cookies.remove();
window.intervalId = window.setInterval("window.hashUpdate()", 500);
window.loginWindow = window.open(strUrl, "Login", false);
window.hashUpdate = function() {
    if (window.loginWindow.closed) {
        window.clearInterval(intervalId);
        start();
    } else {
        var strUrl = window.loginWindow.document.URL;
        if (strUrl.indexOf('#') > -1) {
            var strParams = strUrl.split('#')[1];
            if (strParams.indexOf('&') > -1) {
                var params = strParams.split('&');
                console.log(params);

                params.forEach(function(item) {
                    var keyValue = item.split('=');
                    if (keyValue[0] === 'user_id') {
                        userId = keyValue[1];
                        console.log("userId: " + userId);
                    }
                    if (keyValue[0] === 'access_token') {
                        accessToken = keyValue[1];
                        console.log("accessToken: " + accessToken);
                    }
                });
                window.loginWindow.close();
            }
        }
    }
}

function start() {
    var strUrl = strUrlApi + 'audio.get?' + $.param({uid: userId, access_token: accessToken})//uid=' + userId + '&access_token=' + accessToken;
    console.log("Request:");
    console.log(strUrl);
    $.ajax({
            type: 'GET',
            url: strUrl,
            data: {}
        })
        .success(function(e) {
            console.log("Success!");
            console.log(e);

            e.response.forEach(function(item) {
            $('#tableBody').append('<tr class="success audioRow">' +
            '<td>' + item.artist + '</td>' +
            '<td>' + item.title + '</td>' +
            '</tr>');
            });
        })
        .error(function(e) {
            console.log("Error!");
            console.log(e);
        });
}
