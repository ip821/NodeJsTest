///<reference path="node_modules/angular2/typings/browser.d.ts"/>
import {Controller} from "./app/controller";
import {ListDownloader, IListDownloaderEventHandler} from "./app/list_downloader";
import {View, IViewEventHandler} from "./app/view";
import {DownloadManager} from './app_modules/download_manager';
import {VkApi, IAudioListItem} from './app_modules/vkapi';
import 'zone.js';
import 'reflect-metadata';
import {Injector, Injectable, Component} from "angular2/core";
import {bootstrap} from 'angular2/platform/browser';

$(document).ready(() => {
    bootstrap(Controller)
});