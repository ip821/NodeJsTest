import urlUtils = require('url');

var app: IProxyUrlProvider;

export function init(app: IProxyUrlProvider) {
    this.app = app;
}

export interface ProxyDescriptor {
    host: string;
    port: string;
    path: string;
    method: string;
    agent: any;
}

export interface IProxyUrlProvider {
    getProxyForURL(url: string): string;
}

export function makeHttpRequest(url: string): ProxyDescriptor {
    var parsedUrl = urlUtils.parse(url);

    var ElectronProxyAgent = require('electron-proxy-agent');
    var session = require('session').defaultSession;
    var agent = new ElectronProxyAgent(session);

    return {
        host: parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: undefined,
        agent: agent
    };
}
