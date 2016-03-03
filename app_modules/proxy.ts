import urlUtils = require('url');
var electronProxyAgent = require('electron-proxy-agent');
var session = require('session').defaultSession;

export interface ProxyDescriptor {
    host: string;
    port: string;
    path: string;
    method: string;
    agent: any;
}

export function makeHttpRequest(url: string): ProxyDescriptor {
    var parsedUrl = urlUtils.parse(url);
    var agent = new electronProxyAgent(session);

    return {
        host: parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: undefined,
        agent: agent
    };
}
