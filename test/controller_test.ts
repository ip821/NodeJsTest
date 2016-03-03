import typeioc = require("typeioc");
import assert = require('assert');
import {IListDownloader, ListDownloader} from "../app/list_downloader";
import {IView, View} from "../app/view";
import {Controller, IController} from "../app/controller";
import {VkApi, IAudioListItem} from '../app_modules/vkapi';
import {Mock, It} from "typemoq";

describe("controller", () => {

    var container: typeioc.IContainer;
    var viewMock: Mock<IView>;
    var listDownloaderMock: Mock<IListDownloader>;
    var vkApiMock: Mock<VkApi>;

    beforeEach(() => {
        viewMock = Mock.ofType(View);
        viewMock.setup(c => c.setEventHandler(It.isAny()));

        listDownloaderMock = Mock.ofType(ListDownloader);
        listDownloaderMock.setup(c => c.setEventHandler(It.isAny()));

        vkApiMock = Mock.ofType(VkApi);

        var containerBuilder = typeioc.createBuilder();
        containerBuilder.register<VkApi>(VkApi).as(() => vkApiMock.object);
        containerBuilder.register<IView>(View).as(() => viewMock.object);
        containerBuilder.register<IListDownloader>(ListDownloader).as(() => listDownloaderMock.object);
        containerBuilder.register<Controller>(Controller).as(c => {
            var view = c.resolve<IView>(View);
            var listDownloader = c.resolve<IListDownloader>(ListDownloader);
            var vkApi = c.resolve<VkApi>(VkApi);
            return new Controller(view, listDownloader, vkApi);
        });

        container = containerBuilder.build();

    });

    it("should start download on sync command", () => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.startDownload(It.isAny())).callback(() => isCalled = true);

        var controller = container.resolve<Controller>(Controller);
        controller.audioList = [];
        controller.onViewSyncClick();

        assert.equal(isCalled, true, "startDownload should be called");
    });

    it("should stop download on stop command", () => {
        var isCalled = false;
        listDownloaderMock.setup(c => c.stopDownload()).callback(() => isCalled = true);

        var controller = container.resolve<Controller>(Controller);
        controller.audioList = [];
        controller.onViewStopClick();

        assert.equal(isCalled, true, "stopDownload should be called");
    });
});