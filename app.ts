import appInit = require('./app_modules/appInit');
appInit.initJQuery(window, this);
appInit.initXMLHttpRequest(this);

import gui = require('nw.gui');
import bootstrap = require("bootstrap");
import fs = require('fs');
import path = require('path');
import pathExtra = require('./node_modules/path-extra/lib/path');
import appProxy = require('./app_modules/appProxy');
import stringUtils = require('./app_modules/strings');
import vkApi = require('./app_modules/vkApi');
import downloadManager = require('./app_modules/downloadManager');

gui.Window.get().show();
gui.Window.get().showDevTools();

appProxy.init(gui.App);

var audioList = undefined;

$(document).ready(function() {

    vkApi.openLoginWindow(window, function(userId, accessToken) {
        initAudioList(userId, accessToken);
    });

    function initAudioList(userId, accessToken) {
        vkApi.getAudioList(
            userId,
            accessToken,
            getAudioListSuccess,
            getAudioListError
        );

        function getAudioListSuccess(e) {
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
        }

        function getAudioListError(e) {
            console.log("Error!");
            console.log(e);
        }
    }

    $('#syncButton').click(function() {
        var index = 0;
        var stop = false;

        function progressHandler(streamSize, dataLegth) {
            var percentValue = Math.round((dataLegth / streamSize) * 100) + '%';
            //console.log(stringUtils.format('PROGRESS: {0}, dataLegth: {1}, streamSize: {2}', percentValue, dataLegth, streamSize));
            $('#progressSong').css('width', percentValue);
            $('#progressSong').html(percentValue);
        }

        function downloadHandler(err) {
            if (audioList.length - 1 === index) {
                stop = true;
                console.log('audioList is done.');
            }
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
            var percentValue = Math.floor((index / audioList.length) * 100) + '%';
            $('#progress').html(percentValue);
            $('#progress').css('width', percentValue);
            $('#progressSong').css('width', 0);
            index++;
            $('#audioName').html(stringUtils.format('{0}-{1}.mp3', audioList[index].artist, audioList[index].title));
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

    function startDownload(item, onFinishedCallback, progressCallback) {
        var strHomeFolder = pathExtra.homedir();
        var strHomeFolderPath = path.join(strHomeFolder, 'Music');
        var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
        fs.exists(strMusicPath, function(exists) {
            if (!exists) {
                fs.mkdir(strMusicPath, function() {
                    startDownloadInternal();
                });
                return;
            }

            startDownloadInternal();

            function startDownloadInternal() {
                var strFileName = item.artist + "-" + item.title + '.mp3';
                strFileName = strFileName.replace('/', '');
                var strFilePath = path.join(strMusicPath, strFileName);
                downloadManager.download(appProxy, item.url, strFilePath, onFinishedCallback, progressCallback);
            }
        });
    }
});
