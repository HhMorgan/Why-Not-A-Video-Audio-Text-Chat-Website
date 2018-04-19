import { Component, OnInit,Renderer2, ElementRef,Input,ViewChild  } from '@angular/core';

import { ProfileComponent } from '../profile/profile.component';
import { APIService } from '../../@core/service/api.service';
import { APIData, User } from '../../@core/service/models/api.data.structure';
import { IOService } from '../../@core/service/io.service';
declare var jquery:any;
import * as $ from 'jquery';
@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {
  //private userid = "5accc86110884653ec3a3b15";
  userArray=[{img:"../assets/img/faces/clem-onojeghuo-3.jpg",username:"Clem"},{img:"../assets/img/faces/joe-gardner-2.jpg",username:"Joe"},{img:"../assets/img/faces/kaci-baum-2.jpg",username:"Kaci"},{img:"../assets/img/faces/clem-onojeghuo-2.jpg",username:"Nate"},{img:"../assets/img/faces/erik-lucatero-2.jpg",username:"Erik"}];
  reciever="Chat";
  value='';
  private chatArea;
  searchValue:string = '';
  messageRecieved:string='';
  @Input() htmlVariable=[];
  mediaSource_local = null;
  private sessionid = "5accc80710884653ec3a3b14"; 
  private mediaSource_remote_list : any = [null];
  private peerConnections : RTCPeerConnection[] = [ 
    new RTCPeerConnection(null) , 
    new RTCPeerConnection(null) 
  ];

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  private chatMessage;
 
  constructor(private _apiService:APIService,private sessionService : IOService,private el: ElementRef,private renderer:Renderer2) {
    
   }
  
  
  ngOnInit() {
    /*this.joinClick();
    this.socketjoin();
    this.socketSend();*/
    console.log(this.mediaSource_remote_list.length+"edenudne");
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
}

scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
}
  userChatChange(val : any){
    this.reciever=val;
  }
 
public switchUser(){
  //this.userid = (this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15"; 
}


private getOtherPc = (pc) => {
  return (pc === this.peerConnections[0] ) ? this.peerConnections[1] : this.peerConnections[0];
}

private getPcName = (pc) => {
  return (pc === this.peerConnections[0]) ? "PC1":"PC2" 
}


onEnter(value : string){
  console.log(value);
  console.log(JSON.stringify({
    type:value , 
    name:this.sessionid
  }
));
  this.value = value;


  this.sessionService.sendMessage(
    JSON.stringify({
      room : this.sessionid ,
      type:"message" , 
      name:this.sessionid,
      message : value
    }
  ));


  
  this.htmlVariable.push({type:"sender",message:this.value});
  this.searchValue=null;
}

onSwitch(){
  this.switchUser();
}
public socketSend(){
  this.sessionService.sendMessage(
    JSON.stringify({
      type : "Join",
      room : this.sessionid
    })
  );
}


private getRemoteStream = (e) => {
  this.mediaSource_remote_list[0] = e.stream;
}

preparePeerConnection( peerConnection : RTCPeerConnection ){
  peerConnection.onicecandidate = (event) => {
    if(event.candidate) {
      this.sessionService.sendMessage(
        JSON.stringify(
          {
            room : this.sessionid ,
            type : "candidate",
            candidate : event.candidate
          }
        )
      ) 
    }
  }
  peerConnection.onaddstream = this.getRemoteStream;
  peerConnection.addStream(this.mediaSource_local);
}
public joinClick() {
  this.peerConnections.push(new RTCPeerConnection(null));
  this.preparePeerConnection(this.peerConnections[0]);
  this.peerConnections[0].createOffer().then(
    (desc) =>{
      this.peerConnections[0].setLocalDescription(desc).then();
      this.sessionService.sendMessage(JSON.stringify(
        {
          room : this.sessionid ,
          type : "offer" ,
          offer : desc
        })
      );
    }
  )
}

// public socketjoin(){
//   var flag = true;
//   this.sessionService.getMessages().subscribe((test:any)=>{
//     if(flag)
//       this.socketSend();
//     var js = JSON.parse(test);
//     console.log(js);
//     this.messageRecieved=js.message;
//     this.htmlVariable.push({type:"recieved",message:this.messageRecieved});
//     console.log(this.htmlVariable);
//     flag = false;
//   });
// }



public socketjoin(){
  var flag = true;
  this.sessionService.getMessages().subscribe((test:any)=>{
    if(flag)
       this.socketSend();
    flag = false;
    var js = JSON.parse(test);
    console.log(js);
    switch(js.type) {
      case "offer" :
        let rtcPeer : RTCPeerConnection = new RTCPeerConnection(null)
        this.peerConnections.push(rtcPeer);
        rtcPeer.setRemoteDescription(js.offer).then(
          () => {
            this.preparePeerConnection(rtcPeer);
            rtcPeer.createAnswer().then(
              (desc) => {
                rtcPeer.setLocalDescription(desc).then(
                  () => {
                    this.sessionService.sendMessage(JSON.stringify(
                      {
                        room : this.sessionid ,
                        type : "answer" ,
                        answer : desc
                      }
                    ));
                  }
                );
              }
            );
            this.mediaSource_remote_list[0] = rtcPeer.getRemoteStreams()[0];
          }
        ); 
      break;
      
      case "answer" :
        this.peerConnections[0].setRemoteDescription(js.answer).then()
      break;
      case "message" :
      var js = JSON.parse(test);
      console.log(js);
      this.messageRecieved=js.message;
      this.htmlVariable.push({type:"recieved",message:this.messageRecieved});
      console.log(this.htmlVariable);
      break;
      case "candidate":
        this.peerConnections[0].addIceCandidate(js.candidate).then();
      break;
    }
  });
}

update(value: string) { this.value = value; }
}






