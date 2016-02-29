var app;

export function init(app) {
    this.app = app;
}

export interface ProxyDescriptor {
    host: string;
    port: string;
    path: string;
}

export function makeHttpRequest(url): ProxyDescriptor {

    import urlUtils = require('url');

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
