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
  format = 'video/webm';
  constrains = {video: true , audio: true };
  mediaSource_local = null;
  private mediaSource_remote_list : any = [null];
  private peer_config = <RTCConfiguration>{iceServers: [{urls: 'stun:stun.l.google.com:19302'}
  ,{urls: 'stun:stun.services.mozilla.com'}]};
  private peerConnections : RTCPeerConnection[] = [];

  private sessionid = "5accc80710884653ec3a3b14"; 

  constructor(private apiService : APIService , private ioService : IOService) {}

  ngOnInit() {
    
  }

  preparePeerConnection( peerConnection : RTCPeerConnection ){
    peerConnection.onicecandidate = (event) => {
      if(event.candidate) {
        this.ioService.sendMessage(
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
        this.ioService.sendMessage(JSON.stringify(
          {
            room : this.sessionid ,
            type : "offer" ,
            offer : desc
          })
        );
      }
    )
  }

  private getRemoteStream = (e) => {
    this.mediaSource_remote_list[0] = e.stream;
  }

  public socketjoin(){
    this.ioService.getMessages().subscribe((test:any)=>{
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
                      this.ioService.sendMessage(JSON.stringify(
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
        
        case "candidate":
          this.peerConnections[0].addIceCandidate(js.candidate).then();
        break;
      }
    });
  }

  private onCreateOfferSuccess = (desc) => {
    this.peerConnections[0].setLocalDescription(desc).then();
    var mes = JSON.stringify({
      room : this.sessionid ,
      type : "offer" ,
      offer : desc
    });
    this.ioService.sendMessage(mes);
  }

  public socketSend(){
    this.ioService.sendMessage(
      JSON.stringify({
        type : "Join",
        room : this.sessionid
      })
    )
  }

  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
  }

  announceStart() {
  }
}
