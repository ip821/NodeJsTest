import {Injectable, Component, AfterViewInit, Input, Output, ElementRef} from "angular2/core";
import stringUtils = require('../app_modules/strings');

export interface ITableRow {
    aid: number;
    artist: string;
    title: string;
}

@Injectable()
@Component({
    selector: "list",
    template: `
    <ul id="tableBody" class="list-group">
    <li *ngFor="#item of audioList" class="list-group-item audioRow" id="{{item.aid}}">
        {{item.artist}} - {{item.title}}
    </li>
    </ul>
    `
})
export class ListComponent {
    private audioList: Array<ITableRow>;

    constructor(private _element: ElementRef) { }

    setAudioList = (audioList: Array<ITableRow>) => {
        this.audioList = audioList;
    }

    setRowError = (aid: number) => {
        var row = $(this._element.nativeElement).find(stringUtils.format('#{0}.audioRow', aid));
        row.removeClass('list-group-item-success');
        row.removeClass('list-group-item-warning');
        row.addClass('list-group-item-danger');
    }

    setRowSuccess = (aid: number) =>{
        var row = $(this._element.nativeElement).find(stringUtils.format('#{0}.audioRow', aid));
        row.removeClass('list-group-item-danger');
        row.removeClass('list-group-item-warning');
        row.addClass('list-group-item-success');
    }

    setRowWarning = (aid: number) => {
        var row = $(this._element.nativeElement).find(stringUtils.format('#{0}.audioRow', aid));
        row.addClass('list-group-item-warning');
    }
}