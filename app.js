 $ = require("jquery");
 global.jQuery = $;
 global.document = window.document;
 var gui = require('nw.gui');
 var bootstrap = require("bootstrap");

 gui.Window.get().show();
 // gui.Window.get().showDevTools();
