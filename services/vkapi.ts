import $ = require('jquery');
import _ = require('underscore');
import 'zone.js';
import 'reflect-metadata';
import {Injectable, Component} from "angular2/core";
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

var strUrl = 'http://oauth.vk.com/authorize?client_id=4225742&scope=8&redirect_uri=http://oauth.vk.com/blank.html&display=wap&response_type=token';
var strUrlApi = 'https://api.vk.com/method/';

export interface IAudioListItem {
    aid: number;
    artist: string;
    title: string;
    url: string;
}

@Injectable()
export class VkApi {
    constructor(private http: Http) {

    }

    openLoginWindow(parentWindow: Window, onClosedCallback: (userId: string, accessToken: string) => void) {
        var electron = require('electron');
        var loginWindow = new electron.remote.BrowserWindow({ height: 400, width: 300 });
        loginWindow.loadURL(strUrl);
        loginWindow.on("closed", () => {
            console.log("userId: " + userId);
            console.log("accessToken: " + accessToken);
            onClosedCallback(userId, accessToken);
        });

        var userId = undefined;
        var accessToken = undefined;

        loginWindow.webContents.on("did-navigate", (event, url) => {
            var strUrl = url;
            if (strUrl.indexOf('#') > -1) {
                var strParams = strUrl.split('#')[1];
                if (strParams.indexOf('&') > -1) {
                    var params = strParams.split('&');
                    console.log(params);

                    params.forEach(function(item) {
                        var keyValue = item.split('=');
                        if (keyValue[0] === 'user_id') {
                            userId = keyValue[1];
                            console.log("userId: " + userId);
                        }
                        if (keyValue[0] === 'access_token') {
                            accessToken = keyValue[1];
                            console.log("accessToken: " + accessToken);
                        }
                    });
                    loginWindow.close();
                }
            }
        });
    }

    getAudioList(userId: string, accessToken: string) {
        console.log('vkApi.getAudioList: userId=' + userId + 'accessToken=' + accessToken);
        var strUrl = strUrlApi + 'audio.get?' + $.param({
            uid: userId,
            access_token: accessToken
        })
        console.log("Request:");
        console.log(strUrl);

        return this.http
            .get(strUrl)
            .do(res => console.log(res.json().response))
            .map(res => <IAudioListItem[]>res.json().response);
    }
}