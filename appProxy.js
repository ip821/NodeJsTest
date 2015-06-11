var app;

function init(app) {
    this.app = app;
}

function makeHttpRequest(url) {

    var urlUtils = require('url');

    var strProxy = this.app.getProxyForURL(url);
    console.log('Proxy info:' + strProxy);
    if (strProxy === 'DIRECT') {
    	var parsedUrl = urlUtils.parse(url);
        return {
            host: parsedUrl.host,
            post: parsedUrl.port,
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

exports.makeHttpRequest = makeHttpRequest;
exports.init = init;
