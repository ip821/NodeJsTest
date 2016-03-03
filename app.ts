import {Controller} from "./app/controller";
import proxy = require('./app_modules/proxy');
var init = require('./app_modules/init');

var http = require('http');
var https = require('http');
var ElectronProxyAgent = require('electron-proxy-agent');
var session = require('session').defaultSession;
 
// use ElectronProxyAgent as http and https globalAgents 
http.globalAgent = https.globalAgent = new ElectronProxyAgent(session);

// init.initJQuery(window, this);
// init.initXMLHttpRequest(this);

// gui.Window.get().show();
// gui.Window.get().showDevTools();
// gui.Window.get().focus();

//proxy.init(gui.App);

$(document).ready(() => {
    var controller = new Controller();
    controller.run();
});