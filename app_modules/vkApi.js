var strUrl = 'http://oauth.vk.com/authorize?client_id=4225742&scope=8&redirect_uri=http://oauth.vk.com/blank.html&display=wap&response_type=token';
var strUrlApi = 'https://api.vk.com/method/';

var appInit = require('./appInit');

function openLoginWindow(parentWindow, onClosedCallback) {
    var intervalId = parentWindow.setInterval(hashUpdate, 500);
    var loginWindow = parentWindow.open(strUrl, "Login", false);

    appInit.initJQuery(loginWindow, this);
    appInit.initXMLHttpRequest(this);

    var userId = undefined;
    var accessToken = undefined;

    function hashUpdate() {
        if (loginWindow.closed) {
            parentWindow.clearInterval(intervalId);
            console.log("userId: " + userId);
            console.log("accessToken: " + accessToken);
            onClosedCallback(userId, accessToken);
        } else {
            var strUrl = loginWindow.document.URL;
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
                    loginWindow.close();
                }
            }
        }
    }
}

function getAudioList(userId, accessToken, onSuccessCallback, onErrorCallback) {
    console.log('vkApi.getAudioList: userId=' + userId + 'accessToken=' + accessToken);
    var strUrl = strUrlApi + 'audio.get?' + $.param({
        uid: userId,
        access_token: accessToken
    })
    console.log("Request:");
    console.log(strUrl);
    $.ajax({
            type: 'GET',
            url: strUrl,
            data: {}
        })
        .success(function(e) {
            onSuccessCallback(e);
        })
        .error(function(e) {
            onErrorCallback(e);
        });
}

exports.openLoginWindow = openLoginWindow;
exports.getAudioList = getAudioList;
