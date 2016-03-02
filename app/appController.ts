import _ = require('underscore');
import bootstrap = require("bootstrap");
import stringUtils = require('../app_modules/strings');
import vkApi = require('../app_modules/vkApi');
import {View, ViewEventHandler} from "../app/appView";
import {Downloader, DownloaderEventHandler} from "../app/appDownloader";

export class Controller implements ViewEventHandler, DownloaderEventHandler {
    downloader: Downloader = new Downloader();
    view: View = new View();
    audioList: vkApi.AudioListItem[] = null;

    constructor() {
        this.view.setEventHandler(this);
        this.downloader.setEventHandler(this);
    }

    onViewSyncClick = () => {
        console.log(this);
        this.view.setRunningState(this.audioList.length);
        this.downloader.startDownload(this.audioList);
    }

    onViewStopClick = () => {
        this.downloader.stopDownload();
    }

    onDownloaderStreamProgress = (dataLegth: number, streamSize: number) => {
        this.view.setStreamProgress(dataLegth, streamSize);
    }

    onDownloaderError = (index: number) => {
        this.view.setRowError(this.audioList[index].aid);
    }

    onDownloaderOverallProgress = (completedIndex: number, currentIndex: number) => {
        var completedItem = this.audioList[completedIndex];
        this.view.setRowSuccess(completedItem.aid);
        this.view.setOverallProgress(completedIndex, this.audioList.length);
        var currentItem = this.audioList[currentIndex];
        this.view.setOverallProgressDescription(stringUtils.format('{0}-{1}.mp3', currentItem.artist, currentItem.title));
        this.view.setRowWarning(currentItem.aid);
    }

    onDownloaderStop = () => {
        this.view.setIdleState();
    }

    getAudioListSuccess = (e: vkApi.AudioListItem[]) => {
    }

    initAudioList = (userId, accessToken) => {
        vkApi.getAudioList(
            userId,
            accessToken,
            (audioList: vkApi.AudioListItem[]) => {
                this.audioList = audioList;
                this.view.fillTable(audioList);
            },
            (e) => {
                console.log("Error!");
                console.log(e);
            }
        );
    }

    run = () => {
        vkApi.openLoginWindow(window, (userId, accessToken) => {
            this.initAudioList(userId, accessToken);
        });
    }
}