import pathExtra = require('path-extra');
import fs = require('fs');
import path = require('path');
import proxy = require('../app_modules/proxy');
import {DownloadManager, IDownloadManagerEventHandler} from '../app_modules/download_manager';
import 'zone.js';
import 'reflect-metadata';
import {Injectable} from "angular2/core";

export interface IListDownloaderEventHandler {
    onDownloaderStop();
    onDownloaderError(index: number);
    onDownloaderStreamProgress(dataLegth: number, streamSize: number);
    onDownloaderOverallProgress(completedIndex: number, currentIndex: number);
}

export interface IDownloadItem{
    aid: number;
    artist: string;
    title: string;
    url: string;
}

@Injectable()
export class ListDownloader implements IDownloadManagerEventHandler {
    stop = false;
    eventHandler: IListDownloaderEventHandler;
    index = 0;
    audioList: IDownloadItem[];

    constructor(public downloadManager: DownloadManager) {
        this.downloadManager.setEventHandler(this);
    }

    setEventHandler (eventHandler: IListDownloaderEventHandler) {
        this.eventHandler = eventHandler;
    }

    startDownload (items: IDownloadItem[]) {
        this.index = 0;
        this.stop = false;
        this.audioList = items;
        this.startDownloadItem(this.audioList[this.index]);
    }

    stopDownload () {
        this.stop = true;
    }

    private startDownloadItem = (item: IDownloadItem) => {
        var strHomeFolder = pathExtra.homedir();
        var strHomeFolderPath = path.join(strHomeFolder, 'Music');
        var strMusicPath = path.join(strHomeFolderPath, 'JsVkAudioSync');
        var strFileName = item.artist + "-" + item.title + '.mp3';
        strFileName = strFileName.replace('/', '');
        var strFilePath = path.join(strMusicPath, strFileName);

        var exists = fs.existsSync(strMusicPath);
        if (!exists) {
            fs.mkdirSync(strMusicPath);
        }

        this.downloadManager.download(item.url, strFilePath);
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
}

