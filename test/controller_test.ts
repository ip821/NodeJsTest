/// <reference path="../typings/typemoq/typemoq.d.ts" />
import assert = require('assert');
import {ListDownloader} from "../app/list_downloader";
import {View} from "../app/view";
import {Controller} from "../app/controller";
import {VkApi, IAudioListItem} from '../app_modules/vkapi';
import {Mock, It} from "typemoq";
import 'zone.js';
import 'reflect-metadata';
import {Injector, Injectable, provide} from "angular2/core";

describe("controller", () => {

    var container: Injector;
    var viewMock: Mock<View>;
    var listDownloaderMock: Mock<ListDownloader>;
    var vkApiMock: Mock<VkApi>;

    beforeEach(() => {
        viewMock = Mock.ofType(View);
        viewMock.setup(c => c.setEventHandler(It.isAny()));

        listDownloaderMock = Mock.ofType(ListDownloader);
        listDownloaderMock.setup(c => c.setEventHandler(It.isAny()));

        vkApiMock = Mock.ofType(VkApi);

        container = Injector.resolveAndCreate([
            provide(View, {useValue: viewMock.object}),
            provide(ListDownloader, {useValue: listDownloaderMock.object}),
            provide(VkApi, {useValue: vkApiMock.object}),
            Controller
        ]);
    });

    it("should start download on sync command", () => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.startDownload(It.isAny())).callback(() => isCalled = true);

        var controller = container.get(Controller);
        controller.audioList = [];
        controller.onViewSyncClick();

        assert.equal(isCalled, true, "startDownload should be called");
    });

    it("should stop download on stop command", () => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.stopDownload()).callback(() => isCalled = true);

        var controller = container.get(Controller);
        controller.audioList = [];
        controller.onViewStopClick();

        assert.equal(isCalled, true, "stopDownload should be called");
    });
});