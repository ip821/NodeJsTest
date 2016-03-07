import assert = require('assert');
import {ListDownloader} from "../app/list_downloader";
import {ControllerComponent} from "../app/controller_component";
import {VkApi, IAudioListItem} from '../app_modules/vkapi';
import {DownloadManager} from '../app_modules/download_manager';
import {Mock, It, MockBehavior} from "typemoq";
import 'zone.js';
import 'reflect-metadata';
import {Injector, Injectable, NgZone, provide} from "angular2/core";
import {MockNgZone} from "angular2/testing";

describe("controller", () => {

    var container: Injector;
    var listDownloaderMock: Mock<ListDownloader>;
    var vkApiMock: Mock<VkApi>;
    var downloadManagerMock: Mock<DownloadManager>;

    beforeEach(() => {
        downloadManagerMock = Mock.ofType(DownloadManager);
        listDownloaderMock = Mock.ofType(ListDownloader, MockBehavior.Loose, downloadManagerMock.object);
        vkApiMock = Mock.ofType(VkApi);

        container = Injector.resolveAndCreate([
            provide(NgZone, { useValue: MockNgZone }),
            provide(ListDownloader, { useValue: listDownloaderMock.object }),
            provide(VkApi, { useValue: vkApiMock.object }),
            provide(DownloadManager, { useValue: downloadManagerMock.object }),
            ControllerComponent
        ]);
    });

    it("should start download on sync command", () => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.startDownload(It.isAny())).callback(() => isCalled = true);

        var controller = container.get(ControllerComponent);
        controller.audioList = [];
        controller.onViewSyncClick();

        assert.equal(isCalled, true, "startDownload should be called");
    });

    it("should stop download on stop command", () => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.stopDownload()).callback(() => isCalled = true);

        var controller = container.get(ControllerComponent);
        controller.audioList = [];
        controller.onViewStopClick();

        assert.equal(isCalled, true, "stopDownload should be called");
    });
});