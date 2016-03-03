import {IController, Controller} from "./app/controller";
import { Binding, Kernel, BindingScope } from "inversify";
import {IListDownloader, ListDownloader} from "./app/list_downloader";
import {IView, View} from "./app/view";
import typeioc = require("typeioc");

var containerBuilder = typeioc.createBuilder();
containerBuilder.register<IView>(View).as(() => new View());
containerBuilder.register<IListDownloader>(ListDownloader).as(() => new ListDownloader());
containerBuilder.register<IController>(Controller).as(c => {
    var view = c.resolve<IView>(View);
    var listDownloader = c.resolve<IListDownloader>(ListDownloader);
    return new Controller(view, listDownloader);
});

var container = containerBuilder.build();

$(document).ready(() => {
    var controller = container.resolve<IController>(Controller);
    controller.run();
});