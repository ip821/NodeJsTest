///<reference path="node_modules/angular2/typings/browser.d.ts"/>
import 'zone.js';
import 'reflect-metadata';
import {bootstrap} from 'angular2/platform/browser';
import {MainViewComponent} from "./components/mainview_component";
var ng2 = require("ng2-bootstrap");

$(window.document).ready(() => {
    bootstrap(MainViewComponent)
});