import gui = require('nw.gui');
var inv = require("./app_modules/inversify");
import { Binding, Kernel, BindingScope } from "inversify";
import {IController, Controller} from "./app/controller";
import {IView, View} from "./app/view";
import proxy = require('./app_modules/proxy');
var init = require('./app_modules/init');

init.initJQuery(window, this);
init.initXMLHttpRequest(this);

gui.Window.get().show();
gui.Window.get().showDevTools();
gui.Window.get().focus();

proxy.init(gui.App);

var kernel = new Kernel();
kernel.bind(new Binding<IView>("IView", View));
kernel.bind(new Binding<IController>("IController", Controller));

$(document).ready(() => {
    var controller = kernel.get<IController>("IController");
    controller.run();
});