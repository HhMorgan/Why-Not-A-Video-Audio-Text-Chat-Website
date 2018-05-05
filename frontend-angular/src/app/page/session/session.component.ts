// The ts file that contains all the linking functions for the video/text chat
import { Component, OnInit,Renderer2, ElementRef,Input,ViewChild  } from '@angular/core';

import { ProfileComponent } from '../profile/profile.component';
import { APIService } from '../../@core/service/api.service';
import { APIData, User } from '../../@core/service/models/api.data.structure';
import { IOService } from '../../@core/service/io.service';
import { trigger, state, style, animate, transition, query,stagger} from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {
  public userArray=[ {img:"../assets/img/faces/clem-onojeghuo-3.jpg",username:"Clem"} 
  ,{img:"../assets/img/faces/joe-gardner-2.jpg",username:"Joe"},
  {img:"../assets/img/faces/kaci-baum-2.jpg",username:"Kaci"},
  {img:"../assets/img/faces/clem-onojeghuo-2.jpg",username:"Nate"},
  {img:"../assets/img/faces/erik-lucatero-2.jpg",username:"Erik"}];
  public reciever="Chat";
  value='';
  public chatMessage;
  searchValue:string = '';
  messageRecieved:string='';
  public joinFlag = false;
  public joinButtonflag=false;
  @Input() htmlVariable=[];
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public sessionid : String; 
  public format = 'video/webm';
  public constrains = { video: true , audio: true };
  public startCapture = true;
  public mediaSource_local = null;
  public mediaSource_remote_list : any = [null];
  private peer_config = <RTCConfiguration>{iceServers: [{urls: 'stun:stun.l.google.com:19302'}
  ,{urls: 'stun:stun.services.mozilla.com'}]};
  private peerConnections : RTCPeerConnection[] = [];
  private connectedUsers : String[] = [];

  ngOnInit() {
    this.scrollToBottom();
  }
//forces the scroll area to focus on the last element
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }
//checks the screen size of the device that views the site
  screenSize(){
    if (screen.width <= 699) {
      return false;
    } else {
        return true;
    }
  }
//forces the scroll area to focus on the last element
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }
  //old function that meant to let user switch between the other users that are with him/her to chat with or switch the video to
  userChatChange(val : any){
    this.reciever=val;
  }
//starts the socket between the two users
  socketjoin(){
    this.joinFlag = true;
  }
//switch cases for all of the chating protocols that are followed to make a connection between users
  constructor( private apiService : APIService , private ioService : IOService , private route : ActivatedRoute ) {
    this.route.params.subscribe( 
      params => {
        this.sessionid = params.sessionid;
        this.ioService.getMessages().subscribe((test:any)=>{
          var js = JSON.parse(test);
          console.log(js);
          switch(js.type) {
            case "Join" :
              if(!this.connectedUsers.includes(js.userid)){
                this.connectedUsers.push(js.userid);
                this.peerConnections.push(new RTCPeerConnection(this.peer_config))
              }
            break;
            case "connected":
              this.ioService.sendMessage(
                JSON.stringify({
                  type : "Join",
                  room : this.sessionid
                })
              )
            break;

            case "disconnected":
              if(this.checkIsUserConnected(js.userid)){
                this.connectedUsers.splice(this.connectedUsers.indexOf(js.userid),1)
              }
            break;

            case "connectedUsers":
              this.connectedUsers = js.data;
              for(var i = 0 ; i < this.connectedUsers.length ; i++){
                this.peerConnections.push(new RTCPeerConnection(this.peer_config))
              }
            break;

            case "offer" :
              let rtcPeer : RTCPeerConnection = this.peerConnections[this.connectedUsers.indexOf(js.from)];
              rtcPeer.setRemoteDescription(js.offer).then(
                () => {
                  this.preparePeerConnection( rtcPeer , js.from );
                  rtcPeer.createAnswer().then(
                    (desc) => {
                      rtcPeer.setLocalDescription(desc).then(
                        () => {
                          this.ioService.sendMessage(JSON.stringify(
                            {
                              room : this.sessionid ,
                              type : "answer" ,
                              answer : desc,
                              to : js.from
                            }
                          ));
                          this.joinButtonflag = true;
                        }
                      );
                    }
                  );
                  this.mediaSource_remote_list[0] = rtcPeer.getRemoteStreams()[0];
                }
              ); 
            break;

            case "answer" :
              if(this.checkIsUserConnected(js.from)){
                this.peerConnections[this.connectedUsers.indexOf(js.from)].setRemoteDescription(js.answer).then()
              }
            break;
            
            case "candidate":
              if(this.checkIsUserConnected(js.from)){
                this.peerConnections[this.connectedUsers.indexOf(js.from)].addIceCandidate(js.candidate).then();
              }
            break;

            case "close" :
              if(this.checkIsUserConnected(js.from)){
                this.peerConnections[this.connectedUsers.indexOf(js.from)].close()
                this.peerConnections.splice(this.peerConnections.indexOf(js.userid),1)
              }
            break;

            case "message" :
              this.messageRecieved = js.message;
              this.htmlVariable.push({type:"recieved",message:this.messageRecieved});
              console.log(this.htmlVariable);
            break;
          }
        });
      }
    );
  }
  //makes sure that the user is still connected to the session
  checkIsUserConnected(user:String){
    return this.connectedUsers.includes(user);
  }

  preparePeerConnection( peerConnection : RTCPeerConnection , userid : String ){
    peerConnection.onicecandidate = (event) => {
      if(event.candidate) {
        this.ioService.sendMessage(
          JSON.stringify(
            {
              room : this.sessionid ,
              type : "candidate",
              candidate : event.candidate ,
              to : userid
            }
          )
        ) 
      }
    }
    peerConnection.onaddstream = this.getRemoteStream;
    peerConnection.addStream(this.mediaSource_local);
  }
//the function that connects the video between the two users
  public joinClick() {
    this.joinButtonflag=true;
    for(var i = 0 ; i < this.connectedUsers.length ; i++) {
      let userid : String = this.connectedUsers[i];
      let rtcPeer : RTCPeerConnection = this.peerConnections[i];
      this.preparePeerConnection(this.peerConnections[i] , userid );
      rtcPeer.createOffer().then(
        (desc) =>{
          rtcPeer.setLocalDescription(desc).then();
          this.ioService.sendMessage(JSON.stringify(
            {
              room : this.sessionid ,
              type : "offer" ,
              offer : desc ,
              to : userid
            })
          );
        }
      )
    }
  }
//the function that ends the video call between the two users
  public closeCall(){
    this.startCapture = false;
    for(var i = 0 ; i < this.connectedUsers.length ; i++) {
      // this.peerConnections[i].close();
      this.ioService.sendMessage(JSON.stringify(
        {
          room : this.sessionid ,
          type : "close" ,
          userid : this.connectedUsers[i]
        })
      )
    }
  }
//gets the stream from the other user that is connected to the same session
  private getRemoteStream = (e) => {
    console.log(e);
    this.mediaSource_remote_list[0] = e.stream;
  }
//stores the stream data
  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
  }
//sends a message through the chat between the users 
  onEnter(value : string){
    console.log(value);
    console.log(JSON.stringify(
      {
        type:value , 
        name:this.sessionid
      })
    );
    this.value = value;
    this.ioService.sendMessage(
      JSON.stringify(
        {
          room : this.sessionid ,
          type : "message" ,
          name : this.sessionid,
          message : value
        }
      )
    );
    this.htmlVariable.push({type:"sender",message:this.value});
    this.searchValue=null;
  }
  //updates the value of something that was used in the old version of this page
  update(value: string) { 
    this.value = value; 
  }

  public rtcCaptureControl(event){
    console.log(event);
  }
}







