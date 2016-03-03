import stringUtils = require('../app_modules/strings');
import _ = require('underscore');
import $ = require('jquery');

export interface ITableRow {
    aid: number;
    artist: string;
    title: string;
}

export interface IViewEventHandler {
    onViewSyncClick();
    onViewStopClick();
}

export interface IView {
    setEventHandler(eventHandler: IViewEventHandler);
    setModel(audioList: ITableRow[]);
    setIdleState();
    setRunningState(itemNumber: number);
    setRowError(aid: number);
    setRowSuccess(aid: number);
    setRowWarning(aid: number);
    setStreamProgress(dataLegth: number, streamSize: number);
    setOverallProgress(index: number, length: number);
    setOverallProgressDescription(message: string);
}

export class View  implements IView {
    setEventHandler(eventHandler: IViewEventHandler) {
        $("#syncButton").click(eventHandler.onViewSyncClick);
        $("#stopButton").click(eventHandler.onViewStopClick);
    }

    setModel(audioList: ITableRow[]) {
        _.forEach(audioList, item => {
            $('#tableBody').append(stringUtils.format('<tr class="audioRow" id="{0}">', item.aid) +
                '<td>' + item.artist + '</td>' +
                '<td>' + item.title + '</td>' +
                '</tr>');
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
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('success');
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('warning');
        $(stringUtils.format('#{0}.audioRow', aid)).addClass('error');
    }

    setRowSuccess(aid: number) {
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('error');
        $(stringUtils.format('#{0}.audioRow', aid)).removeClass('warning');
        $(stringUtils.format('#{0}.audioRow', aid)).addClass('success');
    }

    setRowWarning(aid: number) {
        $(stringUtils.format('#{0}.audioRow', aid)).addClass('warning');
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