import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { APIService } from '../../@core/service/api.service';
import { APIData, User } from '../../@core/service/models/api.data.structure';
import { SessionService } from '../../@core/service/session.service';
declare var jquery:any;
import * as $ from 'jquery';
@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {
  private userid = "5accc86110884653ec3a3b15";
  userArray=[{img:"../assets/img/faces/clem-onojeghuo-3.jpg",username:"Clem"},{img:"../assets/img/faces/joe-gardner-2.jpg",username:"Joe"},{img:"../assets/img/faces/kaci-baum-2.jpg",username:"Kaci"},{img:"../assets/img/faces/clem-onojeghuo-2.jpg",username:"Nate"},{img:"../assets/img/faces/erik-lucatero-2.jpg",username:"Erik"}];
  reciever="Chat";
  value='';
  private chatArea;
  searchValue:string = '';
  messageRecieved:string='';
  htmlVariable: string = '<p>Hello. hoooo How are you today?</p>';
  
  private chatMessage;
 
  constructor(private _apiService:APIService,private sessionService : SessionService) { }
  
  ngOnInit() {
   
  }
  userChatChange(val : any){
    this.reciever=val;
  }
 
public switchUser(){
  this.userid = (this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15"; 
}

onEnter(value : string){
  console.log(value);
  console.log(JSON.stringify({
    type:value , 
    name:this.userid
  }
));
  this.value = value;
  this.sessionService.sendMessage(
    JSON.stringify({
      type:"message" , 
      name:this.userid,
      message : value
    }
  ));
  
  this.searchValue=null;
}

onSwitch(){
  this.switchUser();
}
public socketSend(){
  this.sessionService.sendMessage(
    JSON.stringify({
      type:"login" , 
      name: (this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15"
    }
  ));
}
public socketjoin(){
  var flag = true;
  this.sessionService.getMessages().subscribe((test:any)=>{
    if(flag)
      this.socketSend();
    var js = JSON.parse(test);
    console.log(js);
    this.messageRecieved=js.message;
    flag = false;
  });
  // JSON.stringify(
  // this.sessionService.sendMessage()
}

update(value: string) { this.value = value; }
}
