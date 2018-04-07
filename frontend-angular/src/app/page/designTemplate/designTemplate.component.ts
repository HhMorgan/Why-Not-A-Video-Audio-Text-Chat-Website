import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './designTemplate.component.html',
    styleUrls: ['./designTemplate.component.scss']
})

export class DesignTemplateComponent implements OnInit {
    model = {
        left: true,
        middle: false,
        right: false
    };
    constructor() { }

    ngOnInit() {}
}
