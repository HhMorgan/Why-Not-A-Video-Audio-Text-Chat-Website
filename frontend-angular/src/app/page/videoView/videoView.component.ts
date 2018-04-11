import { Component, OnInit } from '@angular/core';
declare var jquery:any;
import * as $ from 'jquery';

@Component({
  selector: 'app-videoView',
  templateUrl: './template/videoView.component.html',
  styleUrls: ['./template/videoView.component.scss']
})
export class VideoViewComponent implements OnInit {
  userArray=[{img:"../assets/img/faces/clem-onojeghuo-3.jpg",username:"Clem"},{img:"../assets/img/faces/joe-gardner-2.jpg",username:"Joe"},{img:"../assets/img/faces/kaci-baum-2.jpg",username:"Kaci"},{img:"../assets/img/faces/clem-onojeghuo-2.jpg",username:"Nate"},{img:"../assets/img/faces/erik-lucatero-2.jpg",username:"erik"}];
  constructor() { }
  
  ngOnInit() {
   
  }

}