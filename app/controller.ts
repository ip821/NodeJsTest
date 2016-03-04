import _ = require('underscore');
import { Inject } from "inversify";
import stringUtils = require('../app_modules/strings');
import {IVkApi, IAudioListItem} from '../app_modules/vkapi';
import {IViewEventHandler, IView} from "../app/view";
import {IListDownloaderEventHandler, IListDownloader} from "../app/list_downloader";

export interface IController {
    run();
}

export class Controller implements IViewEventHandler, IListDownloaderEventHandler, IController {
    downloader: IListDownloader;
    view: IView;
    audioList: IAudioListItem[] = null;
    vkApi: IVkApi;

    constructor(view: IView, listDownloader: IListDownloader, vkApi: IVkApi) {
        this.downloader = listDownloader;
        this.view = view;
        this.vkApi = vkApi;
        
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