///<reference path="node_modules/angular2/typings/browser.d.ts"/>
import {Controller} from "./app/controller";
import {ListDownloader} from "./app/list_downloader";
import {View} from "./app/view";
import {VkApi, IAudioListItem} from './app_modules/vkapi';
import 'zone.js';
import 'reflect-metadata';
import {Injector, Injectable} from "angular2/core"; 

var container = Injector.resolveAndCreate([
    View,
    ListDownloader,
    VkApi,
    Controller
]);

$(document).ready(() => {
    var controller = container.get(Controller);
    controller.run();
});