import http = require('http');
import fs = require('fs');
import stringUtils = require('./strings');
import appProxy = require("./proxy");
import 'zone.js';
import 'reflect-metadata';
import {Injectable, Component} from "angular2/core";

export interface IDownloadManagerEventHandler {
    onDownloadManagerCompleted(err: any);
    onDownloadManagerProgress(dataLength: number, streamSize: number);
}

@Injectable()
export class DownloadManager {
    eventHandler: IDownloadManagerEventHandler;

    setEventHandler (eventHandler: IDownloadManagerEventHandler) {
        this.eventHandler = eventHandler;
    }

    download (url, dest) {
        console.log('Downloading START: ' + url);
        var headerRequestOptions = appProxy.makeHttpRequest(url);
        headerRequestOptions.method = 'HEAD';
        
        var headerRequest = http.get(headerRequestOptions, (headersResponse) => {
            var streamSize = 0;
            if (headersResponse.headers) {
                streamSize = parseInt(headersResponse.headers['content-length']);
                var destExists = fs.existsSync(dest);
                if (destExists) {
                    var destStat = fs.statSync(dest);
                    var fileSize = destStat.size;
                    console.log(stringUtils.format('Stream size: {0}, File size: {1}', streamSize, fileSize));
                    headerRequest.end();
                    if (streamSize === fileSize) {
                        console.log('Skipping ' + dest);
                        this.eventHandler.onDownloadManagerCompleted(undefined);
                        return;
                    }
                }
            }

            var dataLength = 0;
            var file = fs.createWriteStream(dest);
            var request = http.get(appProxy.makeHttpRequest(url), (response) => {
                response
                    .on('data', (data) => {
                        file.write(data);
                        dataLength += data.length;
                        this.eventHandler.onDownloadManagerProgress(dataLength, streamSize);
                    })
                    .on('end', () => {
                        file.end();
                        file.close();
                        console.log('Downloading DONE: ' + url);
                        this.eventHandler.onDownloadManagerCompleted(undefined);
                    })
                    .on('error', (err) => {
                        console.log('Downloading FAIL: ' + url);
                        file.close();
                        fs.unlink(dest);
                        this.eventHandler.onDownloadManagerCompleted(err);
                    });
            });
        });
    }
}
