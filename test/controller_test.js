"use strict";
var assert = require('assert');
var list_downloader_1 = require("../app/list_downloader");
var view_1 = require("../app/view");
var controller_1 = require("../app/controller");
var vkapi_1 = require('../app_modules/vkapi');
var typemoq_1 = require("typemoq");
require('zone.js');
require('reflect-metadata');
var core_1 = require("angular2/core");
describe("controller", function () {
    var container;
    var viewMock;
    var listDownloaderMock;
    var vkApiMock;
    beforeEach(function () {
        viewMock = typemoq_1.Mock.ofType(view_1.View);
        viewMock.setup(function (c) { return c.setEventHandler(typemoq_1.It.isAny()); });
        listDownloaderMock = typemoq_1.Mock.ofType(list_downloader_1.ListDownloader);
        listDownloaderMock.setup(function (c) { return c.setEventHandler(typemoq_1.It.isAny()); });
        vkApiMock = typemoq_1.Mock.ofType(vkapi_1.VkApi);
        container = core_1.Injector.resolveAndCreate([
            core_1.provide(view_1.View, { useValue: viewMock.object }),
            core_1.provide(list_downloader_1.ListDownloader, { useValue: listDownloaderMock.object }),
            core_1.provide(vkapi_1.VkApi, { useValue: vkApiMock.object }),
            controller_1.Controller
        ]);
    });
    it("should start download on sync command", function () {
        var isCalled = false;
        listDownloaderMock.setup(function (c) { return c.startDownload(typemoq_1.It.isAny()); }).callback(function () { return isCalled = true; });
        var controller = container.get(controller_1.Controller);
        controller.audioList = [];
        controller.onViewSyncClick();
        assert.equal(isCalled, true, "startDownload should be called");
    });
    it("should stop download on stop command", function () {
        var isCalled = false;
        listDownloaderMock.setup(function (c) { return c.stopDownload(); }).callback(function () { return isCalled = true; });
        var controller = container.get(controller_1.Controller);
        controller.audioList = [];
        controller.onViewStopClick();
        assert.equal(isCalled, true, "stopDownload should be called");
    });
});
//# sourceMappingURL=controller_test.js.map