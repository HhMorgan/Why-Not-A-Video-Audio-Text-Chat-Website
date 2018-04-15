import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    model = {
        left: true,
        middle: false,
        right: false
    };

    private Announcement="Annoucement";
    private i=0;
    private slideIndex = 1;
    constructor(){}  
    ngOnInit() {}
  Next(){
    this.Announcement="";
    this.i= this.i+1;
    this.Announcement=this.Announcement+this.i;

  }
Before(){
  this.Announcement="";
  if(this.i>0){
    this.i= this.i-1;
    this.Announcement=this.Announcement+this.i;
  }

  }
}
