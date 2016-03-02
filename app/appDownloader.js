"use strict";
var pathExtra = require('path-extra');
var fs = require('fs');
var path = require('path');
var downloadManager_1 = require('../app_modules/downloadManager');
var appProxy = require('../app_modules/appProxy');
var Downloader = (function () {
    function Downloader() {
        var _this = this;
        this.stop = false;
        this.index = 0;
        this.downloadManager = new downloadManager_1.DownloadManager();
        this.setEventHandler = function (eventHandler) {
            _this.eventHandler = eventHandler;
        };
        this.startDownloadItem = function (item) {
            var strHomeFolder = pathExtra.homedir();
            var strHomeFolderPath = path.join(strHomeFolder, 'Music');
            var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
            var strFileName = item.artist + "-" + item.title + '.mp3';
            strFileName = strFileName.replace('/', '');
            var strFilePath = path.join(strMusicPath, strFileName);
            fs.exists(strMusicPath, function (exists) {
                if (!exists) {
                    fs.mkdir(strMusicPath, function () {
                        _this.downloadManager.download(appProxy, item.url, strFilePath);
                    });
                    return;
                }
                _this.downloadManager.download(appProxy, item.url, strFilePath);
            });
        };
        this.onProgress = function (dataLength, streamSize) {
            _this.eventHandler.onDownloaderStreamProgress(dataLength, streamSize);
        };
        this.onCompleted = function (err) {
            if (_this.audioList.length - 1 === _this.index) {
                _this.stop = true;
            }
            if ((err && err.message) || _this.stop) {
                if (err) {
                    _this.eventHandler.onDownloaderError(_this.audioList[_this.index].aid);
                }
                _this.eventHandler.onDownloaderStop();
                return;
            }
            console.log("onCompleted");
            console.log(_this);
            console.log(_this.eventHandler);
            console.log(_this.eventHandler.onDownloaderOverallProgress);
            _this.eventHandler.onDownloaderOverallProgress(_this.index, _this.index + 1);
            _this.index++;
            _this.startDownloadItem(_this.audioList[_this.index]);
        };
        this.startDownload = function (items) {
            _this.index = 0;
            _this.stop = false;
            _this.audioList = items;
            _this.startDownloadItem(_this.audioList[_this.index]);
        };
        this.stopDownload = function () {
            _this.stop = true;
        };
        this.downloadManager.setEventHandler(this);
    }
    return Downloader;
}());
exports.Downloader = Downloader;
//# sourceMappingURL=appDownloader.js.map