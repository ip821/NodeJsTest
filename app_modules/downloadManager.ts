import http = require('http');
import fs = require('fs');
import stringUtils = require('./strings');
import appProxy = require("./appProxy");

export interface DownloadManagerEventHandler {
    onDownloadManagerCompleted(err: any);
    onDownloadManagerProgress(dataLength: number, streamSize: number);
}

export class DownloadManager {
    eventHandler: DownloadManagerEventHandler;

    setEventHandler = (eventHandler: DownloadManagerEventHandler) => {
        this.eventHandler = eventHandler;
    }

    downloadInternal = (url, dest, streamSize) => {
        var dataLength = 0;        
        var file = fs.createWriteStream(dest);
        var request = http.get(appProxy.makeHttpRequest(url), (response) => {
            response.on('data', (data) => {
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
    }

    download = (url, dest) => {
        console.log('Downloading START: ' + url);
        var headerRequestOptions = appProxy.makeHttpRequest(url);
        headerRequestOptions.method = 'HEAD';
        var headerRequest = http.get(headerRequestOptions, (headersResponse) => {
            var streamSize = 0;
            if (headersResponse.headers) {
                streamSize = parseInt(headersResponse.headers['content-length']);
                fs.exists(dest, (exists) => {
                    if (exists) {
                        fs.stat(dest, (err, stats) => {
                            var fileSize = stats.size;
                            console.log(stringUtils.format('Stream size: {0}, File size: {1}', streamSize, fileSize));
                            headerRequest.end();
                            if (streamSize === fileSize) {
                                console.log('Skipping ' + dest);
                                this.eventHandler.onDownloadManagerCompleted(undefined);
                                return;
                            }
                            this.downloadInternal(url, dest, streamSize);
                        });
                        return;
                    }
                    this.downloadInternal(url, dest, streamSize);
                });
                return;
            }

            this.downloadInternal(url, dest, streamSize);
        });
    }
}
