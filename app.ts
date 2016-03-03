import {Controller} from "./app/controller";
import proxy = require('./app_modules/proxy');

$(document).ready(() => {
    var controller = new Controller();
    controller.run();
});