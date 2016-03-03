import {Controller} from "./app/controller";
import {ListDownloader} from "./app/list_downloader";
import Deps = require('ts-dependency-injection');

var container = new Deps.Context();
container.addValue(Controller);
container.addValue(ListDownloader);
container.resolve();

$(document).ready(() => {
    var controller = new Controller();
    controller.run();
});