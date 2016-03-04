import stringUtils = require('../app_modules/strings');
import _ = require('underscore');
import $ = require('jquery');
import 'zone.js';
import 'reflect-metadata';
import {Injectable} from "angular2/core";

export interface ITableRow {
    aid: number;
    artist: string;
    title: string;
}

export interface IViewEventHandler {
    onViewSyncClick();
    onViewStopClick();
}

@Injectable()
export class View {
    setEventHandler(eventHandler: IViewEventHandler) {
        $("#syncButton").click(eventHandler.onViewSyncClick);
        $("#stopButton").click(eventHandler.onViewStopClick);
    }

    setModel(audioList: ITableRow[]) {
        _.forEach(audioList, item => {
            $('#tableBody').append(stringUtils.format('<li class="list-group-item audioRow" id="{0}">{1} - {2}</li>', item.aid, item.artist, item.title)
            );
        });
        $('#syncBadge').html(audioList.length.toString());
    }

    setIdleState() {
        $('#stopButton').addClass('hidden');
        $('#syncButton').removeClass('hidden');
        $('#progressContainer').addClass('hidden');
        $('#progressSongContainer').addClass('hidden');
        $('#audioName').addClass('hidden');
    }

    setRunningState(itemNumber: number) {
        $('#stopButton').removeClass('hidden');
        $('#syncButton').addClass('hidden');

        $('#audioName').removeClass('hidden');
        $('#progressContainer').removeClass('hidden');
        $('#progressSongContainer').removeClass('hidden');
        $('#progress').attr('aria-valuemax', itemNumber);
        $('#progressSong').css('width', 0);
    }

    setRowError(aid: number) {
        var row = $(stringUtils.format('#{0}.audioRow', aid));
        row.removeClass('list-group-item-success');
        row.removeClass('list-group-item-warning');
        row.addClass('list-group-item-danger');
    }

    setRowSuccess(aid: number) {
        var row = $(stringUtils.format('#{0}.audioRow', aid));
        row.removeClass('list-group-item-danger');
        row.removeClass('list-group-item-warning');
        row.addClass('list-group-item-success');
    }

    setRowWarning(aid: number) {
        var row = $(stringUtils.format('#{0}.audioRow', aid));
        row.addClass('list-group-item-warning');
    }

    setStreamProgress(dataLegth: number, streamSize: number) {
        var percentValue = Math.round((dataLegth / streamSize) * 100) + '%';
        $('#progressSong').css('width', percentValue);
        $('#progressSong').html(percentValue);
    }

    setOverallProgress(index: number, length: number) {
        var percentValue = Math.floor((index / length) * 100) + '%';
        $('#progress').html(percentValue);
        $('#progress').css('width', percentValue);
        $('#progressSong').css('width', 0);
    }

    setOverallProgressDescription(message: string) {
        $('#audioName').html(message);
    }
}