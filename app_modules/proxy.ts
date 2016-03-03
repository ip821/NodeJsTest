import urlUtils = require('url');

var app: ProxyUrlProvider;

export function init(app: ProxyUrlProvider) {
    this.app = app;
}

export interface ProxyDescriptor {
    host: string;
    port: string;
    path: string;
    method: string;
}

export interface ProxyUrlProvider {
    getProxyForURL(url: string): void;
}

export function makeHttpRequest(url: string): ProxyDescriptor {
    var strProxy = "DIRECT";//this.app.getProxyForURL(url);
    console.log('Proxy info:' + strProxy);
    if (strProxy === 'DIRECT') {
        var parsedUrl = urlUtils.parse(url);
        return {
            host: parsedUrl.host,
            port: parsedUrl.port,
            path: parsedUrl.path,
            method: undefined,
        };
    }

    var strProxy = strProxy.replace('PROXY ', '');
    var parts = strProxy.split(':');
    return {
        host: parts[0],
        port: parts[1],
        path: url,
        method: undefined,
    };
}
