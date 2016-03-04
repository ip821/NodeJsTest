import {BrowserWindow, app} from 'electron';
import _ = require("underscore");

var mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 500, height: 500 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    if (_.contains(process.argv, "--debug_mode")) {
        mainWindow.maximize();
        mainWindow.webContents.openDevTools();
    }
});

app.on('window-all-closed', () => {
    app.quit();
});

