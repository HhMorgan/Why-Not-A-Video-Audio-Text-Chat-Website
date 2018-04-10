import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {

  constructor() { }
  
  ngOnInit() {
    
  }
  onNavigate(){
    window.open("https://www.google.com", "_blank");
}


}
