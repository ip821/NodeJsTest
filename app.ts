import gui = require('nw.gui');
import appController = require("./app/appController");
import appProxy = require('./app_modules/appProxy');
var appInit = require('./app_modules/appInit');

appInit.initJQuery(window, this);
appInit.initXMLHttpRequest(this);

gui.Window.get().show();
gui.Window.get().showDevTools();
gui.Window.get().focus();

appProxy.init(gui.App);

$(document).ready(() => {
    appController.run();
});