import gui = require('nw.gui');
import appController = require("./app/controller");
import appProxy = require('./app_modules/proxy');
var init = require('./app_modules/init');

init.initJQuery(window, this);
init.initXMLHttpRequest(this);

gui.Window.get().show();
gui.Window.get().showDevTools();
gui.Window.get().focus();

appProxy.init(gui.App);

$(document).ready(() => {
    var controller = new appController.Controller();
    controller.run();
});