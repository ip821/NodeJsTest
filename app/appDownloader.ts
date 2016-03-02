import pathExtra = require('path-extra');
import fs = require('fs');
import path = require('path');
import {DownloadManager, DownloadManagerEventHandler} from '../app_modules/downloadManager';
import appProxy = require('../app_modules/appProxy');
import {AudioListItem} from '../app_modules/vkApi';

export interface DownloaderEventHandler {
    onDownloaderStop();
    onDownloaderError(index: number);
    onDownloaderStreamProgress(dataLegth: number, streamSize: number);
    onDownloaderOverallProgress(completedIndex: number, currentIndex: number);
}

export class Downloader implements DownloadManagerEventHandler {
    stop = false;
    eventHandler: DownloaderEventHandler;
    index = 0;
    audioList: AudioListItem[];
    downloadManager: DownloadManager = new DownloadManager();

    constructor() {
        this.downloadManager.setEventHandler(this);
    }

    setEventHandler = (eventHandler: DownloaderEventHandler) => {
        this.eventHandler = eventHandler;
    }

    startDownloadItem = (item: AudioListItem) => {
        var strHomeFolder = pathExtra.homedir();
        var strHomeFolderPath = path.join(strHomeFolder, 'Music');
        var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
        var strFileName = item.artist + "-" + item.title + '.mp3';
        strFileName = strFileName.replace('/', '');
        var strFilePath = path.join(strMusicPath, strFileName);
        
        fs.exists(strMusicPath, (exists) => {
            if (!exists) {
                fs.mkdir(strMusicPath, ()=> {
                    this.downloadManager.download(item.url, strFilePath);
                });
                return;
            }

            this.downloadManager.download(item.url, strFilePath);
        });
    }

    onDownloadManagerProgress = (dataLength: number, streamSize: number) => {
        this.eventHandler.onDownloaderStreamProgress(dataLength, streamSize);
    }

    onDownloadManagerCompleted = (err: any) => {
        if (this.audioList.length - 1 === this.index) {
            this.stop = true;
        }

        if ((err && err.message) || this.stop) {
            if (err) {
                this.eventHandler.onDownloaderError(this.audioList[this.index].aid);
            }
            this.eventHandler.onDownloaderStop();
            return;
        }
       
        this.eventHandler.onDownloaderOverallProgress(this.index, this.index + 1);
        this.index++;
        this.startDownloadItem(this.audioList[this.index]);
    };

    startDownload = (items: AudioListItem[]) => {
        this.index = 0;
        this.stop = false;
        this.audioList = items;
        this.startDownloadItem(this.audioList[this.index]);
    }

    stopDownload = () => {
        this.stop = true;
    }
}

