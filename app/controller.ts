import _ = require('underscore');
import stringUtils = require('../app_modules/strings');
import {IAudioListItem, VkApi} from '../app_modules/vkapi';
import {IViewEventHandler, View} from "../app/view";
import {IListDownloaderEventHandler, ListDownloader} from "../app/list_downloader";
import {DownloadManager, IDownloadManagerEventHandler} from '../app_modules/download_manager';
import 'zone.js';
import 'reflect-metadata';
import {Injectable, Component} from "angular2/core";
 
@Injectable()
@Component({
    selector: 'app',
    providers: [View, ListDownloader, VkApi, DownloadManager],
    template: `

    <a id="syncButton" class="btn btn-primary">Sync <span class='badge' id='syncBadge'></span></a>
    <a id="stopButton" class="btn btn-primary hidden">Stop</a>
    <div class="progress hidden" id='progressContainer'>
        <div id='progress' class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100" style="width: 0%">
        </div>
    </div>
    <div class="progress hidden" id='progressSongContainer'>
        <div id='progressSong' class="progress-bar progress-bar-striped active progress-bar-no-animation" role="progressbar" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100" style="width: 0%">
        </div>
    </div>
    <p id='audioName' class='hidden'></p>
    <br>
    <ul id="tableBody" class="list-group">
    </ul>
  `
})

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