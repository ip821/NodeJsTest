import urlUtils = require('url');
import nw = require("nw.gui");

var app: nw.App;

export function init(app: nw.App) {
    this.app = app;
}

export interface ProxyDescriptor {
    host: string;
    port: string;
    path: string;
}

export function makeHttpRequest(url: string): ProxyDescriptor {
    var strProxy = this.app.getProxyForURL(url);
    console.log('Proxy info:' + strProxy);
    if (strProxy === 'DIRECT') {
    	var parsedUrl = urlUtils.parse(url);
        return {
            host: parsedUrl.host,
            port: parsedUrl.port,
            path: parsedUrl.path
        };
    }

    var strProxy = strProxy.replace('PROXY ', '');
    var parts = strProxy.split(':');
    return {
        host: parts[0],
        port: parts[1],
        path: url
    };
}
