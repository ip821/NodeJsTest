///<reference path="node_modules/angular2/typings/browser.d.ts"/>
import 'zone.js';
import 'reflect-metadata';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/Rx';
import {MainViewComponent} from "./components/mainview_component";

$(window.document).ready(() => {
    bootstrap(MainViewComponent, HTTP_PROVIDERS)
});