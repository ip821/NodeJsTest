import _ = require('underscore');
import bootstrap = require("bootstrap");
import fs = require('fs');
import path = require('path');
import pathExtra = require('path-extra');
import appProxy = require('../app_modules/appProxy');
import stringUtils = require('../app_modules/strings');
import vkApi = require('../app_modules/vkApi');
import downloadManager = require('../app_modules/downloadManager');
import appView = require("../app/appView");

var view = new appView.View();
var audioList: vkApi.AudioListItem[] = undefined;

export function run() {

    vkApi.openLoginWindow(window, (userId, accessToken) => {
        initAudioList(userId, accessToken);
    });

    function initAudioList(userId, accessToken) {
        vkApi.getAudioList(
            userId,
            accessToken,
            getAudioListSuccess,
            getAudioListError
        );

        function getAudioListSuccess(e: vkApi.AudioListItem[]) {
            console.log("Success!");
            console.log(e);
            audioList = e;
            view.fillTable(audioList);
        }

        function getAudioListError(e) {
            console.log("Error!");
            console.log(e);
        }
    }

    var stop = false;

    view.getStopCommand().click(() => {
        stop = true;
    });


    view.getSyncButton().click(() => {
        var index = 0;

        function progressHandler(streamSize, dataLegth) {
            view.setStreamProgress(dataLegth, streamSize);
        }

        function downloadHandler(err) {
            if (audioList.length - 1 === index) {
                stop = true;
                console.log('audioList is done.');
            }
            if ((err && err.message) || stop) {
                if (err) {
                    view.setRowError(audioList[index].aid);
                    console.log(err.message);
                }
                view.setIdleState();
                return;
            }
            view.setRowSuccess(audioList[index].aid);
            view.setOverallProgress(index, audioList.length);
            index++;
            view.setOverallProgressDescription(stringUtils.format('{0}-{1}.mp3', audioList[index].artist, audioList[index].title));
            view.setRowWarning(audioList[index].aid);
            startDownload(audioList[index], downloadHandler, progressHandler);
        };

        view.setRunningState(audioList.length);
        startDownload(audioList[index], downloadHandler, progressHandler);
    });

    function startDownload(item: vkApi.AudioListItem, onFinishedCallback, progressCallback) {
        var strHomeFolder = pathExtra.homedir();
        var strHomeFolderPath = path.join(strHomeFolder, 'Music');
        var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
        fs.exists(strMusicPath, (exists) => {
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
};
