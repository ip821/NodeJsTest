import _ = require('underscore');
import bootstrap = require("bootstrap");
import stringUtils = require('../app_modules/strings');
import {VkApi, AudioListItem} from '../app_modules/vkapi';
import {View, IViewEventHandler} from "../app/view";
import {ListDownloader, IListDownloaderEventHandler} from "../app/list_downloader";

export class Controller implements IViewEventHandler, IListDownloaderEventHandler {
    downloader: ListDownloader = new ListDownloader();
    view: View = new View();
    audioList: AudioListItem[] = null;
    vkApi: VkApi = new VkApi();

    constructor() {
        this.view.setEventHandler(this);
        this.downloader.setEventHandler(this);
    }

    onViewSyncClick = () => {
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

    private initAudioList (userId, accessToken) {
        this.vkApi.getAudioList(
            userId,
            accessToken,
            (audioList: AudioListItem[]) => {
                this.audioList = audioList;
                this.view.setModel(audioList);
            },
            (e) => {
                console.log("Error!");
                console.log(e);
            }
        );
    }

    run () {
        this.vkApi.openLoginWindow(window, (userId, accessToken) => {
            this.initAudioList(userId, accessToken);
        });
    }
}