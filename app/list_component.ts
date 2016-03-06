import {Injectable, Component, AfterViewInit, Input, Output, NgZone} from "angular2/core";
import stringUtils = require('../app_modules/strings');
import $ = require('jquery');

export interface ITableRow {
    aid: number;
    artist: string;
    title: string;
}

export enum RowStatus{None = 0, Success, Warning, Error}

@Injectable()
@Component({
    selector: "list",
    template: `
    <ul id="tableBody" class="list-group">
        <li 
            *ngFor="#item of _audioList; #i = index" 
            id="{{item.aid}}"
            class="list-group-item audioRow"
            [class.list-group-item-success] = "_rowStatuses[i] == 1"
            [class.list-group-item-warning] = "_rowStatuses[i] == 2"
            [class.list-group-item-danger] = "_rowStatuses[i] == 3"
            >
            {{item.artist}} - {{item.title}}
        </li>
    </ul>
    `
})
export class ListComponent {
    private _audioList: Array<ITableRow>;
    private _rowStatuses: Array<RowStatus>;

    constructor(private _ngZobe: NgZone) { }

    setAudioList = (audioList: Array<ITableRow>) => {
        this._audioList = audioList;
        this._rowStatuses = new Array<RowStatus>(audioList.length);
        this._rowStatuses.fill(RowStatus.None);
    }
    
    setRowStatus = (index: number, rowStatus: RowStatus) => {
        this._rowStatuses[index] = rowStatus;
    }
}