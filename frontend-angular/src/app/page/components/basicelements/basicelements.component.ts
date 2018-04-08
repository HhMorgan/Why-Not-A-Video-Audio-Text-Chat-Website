import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basicelements',
  templateUrl: './template/basicelements.component.html',
  styleUrls: ['./template/basicelements.component.scss']
})
export class BasicelementsComponent implements OnInit {
    simpleSlider = 40;
    doubleSlider = [20, 60];
    state_default: boolean = true;

    constructor() { }

    ngOnInit() {}

}
