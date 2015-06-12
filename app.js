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
var stringUtils = require('./stringUtils');

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
                    $('#tableBody').append(stringUtils.format('<tr class="audioRow" id="{0}">', item.aid) +
                        '<td>' + item.artist + '</td>' +
                        '<td>' + item.title + '</td>' +
                        '</tr>');
                });
                $('#syncBadge').html(audioList.length);
            })
            .error(function(e) {
                console.log("Error!");
                console.log(e);
            });
    }

    $('#syncButton').click(function() {
        var index = 0;
        var stop = false;

        function progressHandler(streamSize, dataLegth) {
            var percentValue = parseInt((dataLegth / streamSize) * 100) + '%';
            //console.log(stringUtils.format('PROGRESS: {0}, dataLegth: {1}, streamSize: {2}', percentValue, dataLegth, streamSize));
            $('#progressSong').css('width', percentValue);
            $('#progressSong').html(percentValue);
        }

        function downloadHandler(err) {
            if (audioList.length == index - 1)
                stop = true;
            if ((err && err.message) || stop) {
                if (err) {
                    $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).removeClass('success');
                    $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).removeClass('warning');
                    $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).addClass('error');
                    console.log(err.message);
                }
                $('#stopButton').addClass('hidden');
                $('#syncButton').removeClass('hidden');
                $('#progressContainer').addClass('hidden');
                $('#progressSongContainer').addClass('hidden');
                $('#audioName').addClass('hidden');
                return;
            }
            $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).removeClass('error');
            $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).removeClass('warning');
            $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).addClass('success');
            var percentValue = parseInt((index / audioList.length) * 100) + '%';
            $('#progress').html(percentValue);
            $('#progress').css('width', percentValue);
            $('#progressSong').css('width', 0);
            $('#audioName').html(stringUtils.format('{0}-{1}.mp3', audioList[index].artist, audioList[index].title));
            index++;
            $(stringUtils.format('#{0}.audioRow', audioList[index].aid)).addClass('warning');
            startDownload(audioList[index], downloadHandler, progressHandler);
        };

        $('#stopButton').removeClass('hidden');
        $('#syncButton').addClass('hidden');
        $('#stopButton').click(function() {
            stop = true;
        });

        $('#audioName').removeClass('hidden');
        $('#progressContainer').removeClass('hidden');
        $('#progressSongContainer').removeClass('hidden');
        $('#progress').attr('aria-valuemax', audioList.length);
        $('#progressSong').css('width', 0);
        startDownload(audioList[index], downloadHandler, progressHandler);
    });

    function getMusicFolder() {
        var strHomeFolder = pathExtra.homedir();
        return path.join(strHomeFolder, 'Music');
    }

    function download(url, dest, callback, progressCallback) {
        console.log('Downloading START: ' + url);
        var headerRequestOptions = appProxy.makeHttpRequest(url);
        headerRequestOptions.method = 'HEAD';
        var headerRequest = http.get(headerRequestOptions, function(headersResponse) {

            var streamSize = 0;
            var dataLength = 0;
            if (headersResponse.headers && fs.existsSync(dest)) {
                streamSize = parseInt(headersResponse.headers['content-length']);
                var stats = fs.statSync(dest);
                var fileSize = parseInt(stats["size"]);
                console.log(stringUtils.format('Stream size: {0}, File size: {1}', streamSize, fileSize));
                headerRequest.end();
                if (streamSize == fileSize) {
                    console.log('Skipping ' + dest);
                    callback();
                    return;
                }
            }

            var file = fs.createWriteStream(dest);
            var request = http.get(appProxy.makeHttpRequest(url), function(response) {
                response.on('data', function(data) {
                        file.write(data);
                        dataLength += data.length;
                        progressCallback(streamSize, dataLength);
                    })
                    .on('end', function() {
                        file.end();
                        file.close(callback);
                    })
                    .on('close', function() {
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
        });
    }

    function startDownload(item, onFinishedCallback, progressCallback) {
        var strHomeFolderPath = getMusicFolder();
        var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
        if (!fs.existsSync(strMusicPath))
            fs.mkdirSync(strMusicPath);

        var strFileName = item.artist + "-" + item.title + '.mp3';
        strFileName = strFileName.replace('/', '');
        var strFilePath = path.join(strMusicPath, strFileName);
        download(item.url, strFilePath, onFinishedCallback, progressCallback);
    }
});
