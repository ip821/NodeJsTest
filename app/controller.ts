import _ = require('underscore');
import stringUtils = require('../app_modules/strings');
import {IAudioListItem, VkApi} from '../app_modules/vkapi';
import {IViewEventHandler, View} from "../app/view";
import {IListDownloaderEventHandler, ListDownloader} from "../app/list_downloader";
import 'zone.js';
import 'reflect-metadata';
import {Injectable} from "angular2/core";
 
@Injectable()
export class Controller implements IViewEventHandler, IListDownloaderEventHandler {
    audioList: IAudioListItem[] = null;

    constructor(public view: View, public downloader: ListDownloader, public vkApi: VkApi) {
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
            (audioList: IAudioListItem[]) => {
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