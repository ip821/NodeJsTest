import _ = require('underscore');
import stringUtils = require('../app_modules/strings');
import {IAudioListItem, VkApi} from '../app_modules/vkapi';
import {IListDownloaderEventHandler, ListDownloader} from "../app/list_downloader";
import {DownloadManager, IDownloadManagerEventHandler} from '../app_modules/download_manager';
import {ListComponent} from "./list_component";
import {HeaderComponent} from "./header_component";
import 'zone.js';
import 'reflect-metadata';
import {Injectable, Component, AfterViewInit, Input, ViewChild} from "angular2/core";

@Injectable()
@Component({
    selector: 'app',
    providers: [ListDownloader, VkApi, DownloadManager],
    directives: [HeaderComponent, ListComponent],
    template: `
    <div>
    <header 
        (onClickSync)="onViewSyncClick()" 
        (onClickStop)="onViewStopClick()"
        >
    </header>
    <br>
    <list></list>
    </div>
  `
})

export class ControllerComponent implements AfterViewInit, IListDownloaderEventHandler {
    audioList: IAudioListItem[] = null;
    @ViewChild(HeaderComponent)
    _header: HeaderComponent;
    @ViewChild(ListComponent)
    _list: ListComponent;

    constructor(public downloader: ListDownloader, public vkApi: VkApi) {
    }

    ngAfterViewInit() {
        this.downloader.setEventHandler(this);
        this.run();
    }

    run() {
        this.vkApi.openLoginWindow(window, (userId, accessToken) => {
            this.initAudioList(userId, accessToken);
        });
    }

    private initAudioList(userId, accessToken) {
        this.vkApi.getAudioList(
            userId,
            accessToken,
            (audioList: IAudioListItem[]) => {
                this.audioList = audioList;
                this._list.setAudioList(audioList);
                this._header.setCount(audioList.length);
            },
            (e) => {
                console.log("Error!");
                console.log(e);
            }
        );
    }

    onViewSyncClick = () => {
        this._header.setRunningState(this.audioList.length);
        this.downloader.startDownload(this.audioList);
    }

    onViewStopClick = () => {
        this.downloader.stopDownload();
    }

    onDownloaderStreamProgress = (dataLegth: number, streamSize: number) => {
        this._header.setStreamProgress(dataLegth, streamSize);
    }

    onDownloaderError = (index: number) => {
        this._list.setRowError(this.audioList[index].aid);
    }

    onDownloaderOverallProgress = (completedIndex: number, currentIndex: number) => {
        var completedItem = this.audioList[completedIndex];
        this._list.setRowSuccess(completedItem.aid);
        this._header.setOverallProgress(completedIndex, this.audioList.length);
        var currentItem = this.audioList[currentIndex];
        this._header.setOverallProgressDescription(stringUtils.format('{0}-{1}.mp3', currentItem.artist, currentItem.title));
        this._list.setRowWarning(currentItem.aid);
    }

    onDownloaderStop = () => {
        this._header.setIdleState();
    }
}