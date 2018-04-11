import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {
  userArray=[{img:"../assets/img/faces/clem-onojeghuo-3.jpg",username:"Clem"},{img:"../assets/img/faces/joe-gardner-2.jpg",username:"Joe"},{img:"../assets/img/faces/kaci-baum-2.jpg",username:"Kaci"},{img:"../assets/img/faces/clem-onojeghuo-2.jpg",username:"Nate"},{img:"../assets/img/faces/erik-lucatero-2.jpg",username:"Erik"}];
  reciever="Chat";

  constructor() { }
  
  ngOnInit() {
    
  }
  userChatChange(val : any){
    this.reciever=val;
  }
  /*onNavigate(){
    //window.open("ProfileComponent", "_blank");
    window.open('../page/profile', 'newwindow','width=700,height=800'); 
    return false;
}*/


}
