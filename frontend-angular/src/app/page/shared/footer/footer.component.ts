import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './template/footer.component.html',
    styleUrls: ['./template/footer.component.scss']
})
export class FooterComponent implements OnInit {
    test : Date = new Date();

    constructor() { }

    ngOnInit() {}
}
