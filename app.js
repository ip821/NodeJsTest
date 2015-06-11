var strUrlApi = 'https://api.vk.com/method/';

var appInit = require('./appInit');
appInit.initJQuery(this);
appInit.initXMLHttpRequest(this);

var gui = require('nw.gui');
var bootstrap = require("bootstrap");
var http = require('http');
var fs = require('fs');
var path = require('path');
var pathExtra = require('path-extra');
var appProxy = require('./appProxy');

gui.Window.get().show();
gui.Window.get().showDevTools();

appProxy.init(gui.App);

var accessToken = undefined;
var userId = undefined;
var audioList = undefined;

var strUrl = 'http://oauth.vk.com/authorize?client_id=4225742&scope=8&redirect_uri=http://oauth.vk.com/blank.html&display=wap&response_type=token';

$(document).ready(function() {

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
        var strUrl = strUrlApi + 'audio.get?' + $.param({
                uid: userId,
                access_token: accessToken
            }) //uid=' + userId + '&access_token=' + accessToken;
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

                audioList = e.response;
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

    $('#syncButton').click(function() {
        var index = 0;
        startDownload(audioList[index], function(err) {
            if (err && err.message) {
                console.log(err.message);
                return;
            }
            index++;
            startDownload(audioList[index]);
        });
    });

    function getMusicFolder() {
        var strHomeFolder = pathExtra.homedir();
        return path.join(strHomeFolder, 'Music');
    }

    function download(url, dest, callback) {
        console.log('Downloading START: ' + url);
        var file = fs.createWriteStream(dest);
        var request = http.get(appProxy.makeHttpRequest(url), function(response) {
            response.on('data', function(data) {
                    file.write(data);
                })
                .on('end', function() {
                    file.end();
                    file.close(callback);
                    console.log('Downloading DONE: ' + url);
                })
                .on('error', function(err) {
                    console.log('Downloading FAIL: ' + url);
                    file.close(function() {
                        fs.unlink(dest);
                        if (callback)
                            callback(err);
                    });
                });
        });
    }

    function startDownload(item, onFinishedCallback) {
        var strHomeFolderPath = getMusicFolder();
        var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
        if (!fs.existsSync(strMusicPath))
            fs.mkdirSync(strMusicPath);

        var strFileName = item.artist + "-" + item.title + '.mp3';
        var strFilePath = path.join(strMusicPath, strFileName);
        download(item.url, strFilePath, onFinishedCallback);
    }
});
