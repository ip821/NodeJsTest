///<reference path="node_modules/angular2/typings/browser.d.ts"/>
import 'zone.js';
import 'reflect-metadata';
import {bootstrap} from 'angular2/platform/browser';
import {ControllerComponent} from "./app/controller_component";

$(window.document).ready(() => {
    bootstrap(ControllerComponent)
});