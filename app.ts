import {IController, Controller} from "./app/controller";
import { Binding, Kernel, BindingScope } from "inversify";
import {IListDownloader, ListDownloader} from "./app/list_downloader";
import {IView, View} from "./app/view";

var kernel = new Kernel();
kernel.bind(new Binding<IView>("IView", View));
kernel.bind(new Binding<IListDownloader>("IListDownloader", ListDownloader));
kernel.bind(new Binding<IController>("IController", Controller));

$(document).ready(() => {
    var controller = kernel.get<IController>("IController");
    controller.run();
});