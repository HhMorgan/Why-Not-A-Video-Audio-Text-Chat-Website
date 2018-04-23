import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { IOService } from '../../@core/service/io.service';
import { APIService } from '../../@core/service/api.service';
import { APIData , Session , CandicateSession } from '../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-video',
  templateUrl: './template/sessionvideo.component.html',
  styleUrls: ['./template/sessionvideo.component.css']
})
export class SessionVideoComponent implements OnInit {
  public sessionid : String; 
  public format = 'video/webm';
  public constrains = {video: true , audio: true };
  public mediaSource_local = null;
  public mediaSource_remote_list : any = [null];
  private peer_config = <RTCConfiguration>{iceServers: [{urls: 'stun:stun.l.google.com:19302'}
  ,{urls: 'stun:stun.services.mozilla.com'}]};
  private peerConnections : RTCPeerConnection[] = [];
  private connectedUsers : String[] = [];

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
                        }
                      );
                    }
                  );
                  this.mediaSource_remote_list[0] = rtcPeer.getRemoteStreams()[0];
                }
              ); 
            break;
            
            case "answer" :
              this.peerConnections[this.connectedUsers.indexOf(js.from)].setRemoteDescription(js.answer).then()
            break;
            
            case "candidate":
            this.peerConnections[this.connectedUsers.indexOf(js.from)].addIceCandidate(js.candidate).then();
            break;
          }
        });
      }
    );
  }

  ngOnInit() {
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

  public joinClick() {
    console.log(this.connectedUsers);
    console.log(this.peerConnections.length);
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

  private getRemoteStream = (e) => {
    console.log(e);
    this.mediaSource_remote_list[0] = e.stream;
  }

  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
  }

  announceStart() {
  }
}
