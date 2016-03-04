import {IController, Controller} from "./app/controller";
import { Binding, Kernel, BindingScope } from "inversify";
import {IListDownloader, ListDownloader} from "./app/list_downloader";
import {IView, View} from "./app/view";
import {VkApi, IAudioListItem} from './app_modules/vkapi';
import typeioc = require("typeioc");

var containerBuilder = typeioc.createBuilder();
containerBuilder.register<VkApi>(VkApi).as(() => new VkApi());
containerBuilder.register<IView>(View).as(() => new View());
containerBuilder.register<IListDownloader>(ListDownloader).as(() => new ListDownloader());
containerBuilder.register<IController>(Controller).as(c => {
    var view = c.resolve<IView>(View);
    var listDownloader = c.resolve<IListDownloader>(ListDownloader);
    var vkApi = c.resolve<VkApi>(VkApi);
    return new Controller(view, listDownloader, vkApi);
});

var container = containerBuilder.build();

$(document).ready(() => {
    var controller = container.resolve<IController>(Controller);
    controller.run();
});