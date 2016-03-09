import _ = require('underscore');
import stringUtils = require('../services/strings');
import {IAudioListItem, VkApi} from '../services/vkapi';
import {IListDownloaderEventHandler, ListDownloader} from "../services/list_downloader";
import {DownloadManager, IDownloadManagerEventHandler} from '../services/download_manager';
import {ListComponent, RowStatus} from "./list_component";
import {HeaderComponent} from "./header_component";
import 'zone.js';
import 'reflect-metadata';
import {Injectable, Component, AfterViewInit, Input, ViewChild, NgZone} from "angular2/core";

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
export class MainViewComponent implements AfterViewInit, IListDownloaderEventHandler {
    audioList: IAudioListItem[] = null;
    @ViewChild(HeaderComponent) _header: HeaderComponent;
    @ViewChild(ListComponent) _list: ListComponent;

    constructor(
        public downloader: ListDownloader, 
        public vkApi: VkApi, 
        private _ngZone: NgZone
        ) {
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
        this.vkApi
        .getAudioList(userId, accessToken)
        .subscribe(
            data => {
                this.audioList = data;
                this._ngZone.run(() => {
                    this._list.setAudioList(this.audioList);
                    this._header.setCount(this.audioList.length);
                });
            },
            e => {
                console.log("Error!");
                console.log(e);
            }
        );
    }

    onViewSyncClick = () => {
        this._ngZone.run(() => {
            this._header.setRunningState(this.audioList.length);
            this.downloader.startDownload(this.audioList);
        });
    }

    onViewStopClick = () => {
        this.downloader.stopDownload();
    }

    onDownloaderStreamProgress = (dataLegth: number, streamSize: number) => {
        this._ngZone.run(() => this._header.setStreamProgress(dataLegth, streamSize));
    }

    onDownloaderError = (index: number) => {
        this._ngZone.run(() => this._list.setRowStatus(index, RowStatus.Error));
    }

    onDownloaderOverallProgress = (completedIndex: number, currentIndex: number) => {
        this._ngZone.run(() => {
            var completedItem = this.audioList[completedIndex];
            this._list.setRowStatus(completedIndex, RowStatus.Success);
            this._header.setOverallProgress(completedIndex, this.audioList.length);
            var currentItem = this.audioList[currentIndex];
            this._header.setOverallProgressDescription(stringUtils.format('{0}-{1}.mp3', currentItem.artist, currentItem.title));
            this._list.setRowStatus(currentIndex, RowStatus.Warning);
        });
    }

    onDownloaderStop = () => {
        this._ngZone.run(() => {
            this._header.setIdleState();
        });
    }
}