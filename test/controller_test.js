"use strict";
var typeioc = require("typeioc");
var assert = require('assert');
var list_downloader_1 = require("../app/list_downloader");
var view_1 = require("../app/view");
var controller_1 = require("../app/controller");
var vkapi_1 = require('../app_modules/vkapi');
var typemoq_1 = require("typemoq");
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
        var containerBuilder = typeioc.createBuilder();
        containerBuilder.register(vkapi_1.VkApi).as(function () { return vkApiMock.object; });
        containerBuilder.register(view_1.View).as(function () { return viewMock.object; });
        containerBuilder.register(list_downloader_1.ListDownloader).as(function () { return listDownloaderMock.object; });
        containerBuilder.register(controller_1.Controller).as(function (c) {
            var view = c.resolve(view_1.View);
            var listDownloader = c.resolve(list_downloader_1.ListDownloader);
            var vkApi = c.resolve(vkapi_1.VkApi);
            return new controller_1.Controller(view, listDownloader, vkApi);
        });
        container = containerBuilder.build();
    });
    it("should start download on sync command", function () {
        var isCalled = false;
        listDownloaderMock.setup(function (c) { return c.startDownload(typemoq_1.It.isAny()); }).callback(function () { return isCalled = true; });
        var controller = container.resolve(controller_1.Controller);
        controller.audioList = [];
        controller.onViewSyncClick();
        assert.equal(isCalled, true, "startDownload should be called");
    });
    it("should stop download on stop command", function () {
        var isCalled = false;
        listDownloaderMock.setup(function (c) { return c.stopDownload(); }).callback(function () { return isCalled = true; });
        var controller = container.resolve(controller_1.Controller);
        controller.audioList = [];
        controller.onViewStopClick();
        assert.equal(isCalled, true, "stopDownload should be called");
    });
});
//# sourceMappingURL=controller_test.js.map