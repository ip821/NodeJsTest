/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../node_modules/typemoq/typemoq.d.ts" />
/// <reference path="../node_modules/typemoq/typemoq.node.d.ts" />

import {ListDownloader} from "../services/list_downloader";
import {MainViewComponent} from "../components/mainview_component";
import {HeaderComponent} from "../components/header_component";
import {VkApi, IAudioListItem} from '../services/vkapi';
import {DownloadManager} from '../services/download_manager';
import {Mock, It, MockBehavior} from "typemoq";
import 'zone.js';
import 'reflect-metadata';
import {Injector, Injectable, NgZone, provide} from "angular2/core";
import {describe,expect,it,xit, inject, injectAsync, beforeEachProviders, MockNgZone, TestComponentBuilder, ComponentFixture } from 'angular2/testing';

describe("mainview", () => {

    var container: Injector;
    var listDownloaderMock: Mock<ListDownloader>;
    var vkApiMock: Mock<VkApi>;
    var downloadManagerMock: Mock<DownloadManager>;

    beforeEachProviders(() =>
    {
        downloadManagerMock = Mock.ofType(DownloadManager);
        listDownloaderMock = Mock.ofType(ListDownloader, MockBehavior.Loose, downloadManagerMock.object);
        vkApiMock = Mock.ofType(VkApi);
        
        return [
            MainViewComponent,
            provide(DownloadManager, {useValue: downloadManagerMock.object}),
            provide(ListDownloader, {useValue: listDownloaderMock.object}),
            provide(VkApi, {useValue: vkApiMock.object}),
            provide(NgZone, {useClass: MockNgZone}),
        ]
    });
    
    it("should start download on sync command", inject([MainViewComponent], (mainView) => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.startDownload(It.isAny())).callback(() => isCalled = true);

        var headerMock = Mock.ofType(HeaderComponent);
        headerMock.setup(c => c.setRunningState(It.isAny()));

        mainView.audioList = [];
        mainView._header = headerMock.object;
        mainView.onViewSyncClick();
        expect(isCalled).toBe(true, "startDownload should be called");
    }));

    it("should stop download on stop command", inject([MainViewComponent], (mainView) => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.stopDownload()).callback(() => isCalled = true);

        mainView.audioList = [];
        mainView.onViewStopClick();

        expect(isCalled).toBe(true,  "stopDownload should be called");
    }));
});