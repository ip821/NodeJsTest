import gui = require('nw.gui');
import {Controller} from "./app/controller";
import proxy = require('./app_modules/proxy');
var init = require('./app_modules/init');

init.initJQuery(window, this);
init.initXMLHttpRequest(this);

// gui.Window.get().show();
// gui.Window.get().showDevTools();
// gui.Window.get().focus();

proxy.init(gui.App);

$(document).ready(() => {
    var controller = new Controller();
    controller.run();
});