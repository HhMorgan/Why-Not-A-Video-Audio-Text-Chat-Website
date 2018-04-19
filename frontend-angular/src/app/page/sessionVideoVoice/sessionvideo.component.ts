import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { SessionService } from '../../@core/service/session.service';

import {APIData , Session , CandicateSession } from '../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-session',
  templateUrl: './template/sessionvideo.component.html',
  styleUrls: ['./template/sessionvideo.component.css']
})
export class SessionVideoComponent implements OnInit {
  format = 'video/webm';
  isRemote_Local = false;
  isRemote_Remote = true;
  constrains = {video: true , audio: true };
  mediaSource_local = null;
  private mediaSource_remote_list : any = [null];
  private peer_config = <RTCConfiguration>{iceServers: [{urls: 'stun:stun.l.google.com:19302'}
  ,{urls: 'stun:stun.services.mozilla.com'}]};
  private peerConnections : RTCPeerConnection[] = [ 
    new RTCPeerConnection(null) , 
    new RTCPeerConnection(null) 
  ];

  private userid = "5accc86110884653ec3a3b15";
  private reciver = "";
  private sessionid = "5accc80710884653ec3a3b14"; 

  constructor(private apiService:APIService , private sessionService : SessionService) {}
  ngOnInit() {
    console.log(this.mediaSource_remote_list.length+"edenudne")
  }

  private getOtherPc = (pc) => {
    return (pc === this.peerConnections[0] ) ? this.peerConnections[1] : this.peerConnections[0];
  }

  private getPcName = (pc) => {
    return (pc === this.peerConnections[0]) ? "PC1":"PC2" 
  }

  private onIceCandidate(pc, event) {
    if(event.candidate) {
      var mes = JSON.stringify({
        room : this.sessionid ,
        type : "candidate",
        candidate : event.candidate
      });
      this.sessionService.sendMessage(mes) 
    }
    this.getOtherPc(pc).addIceCandidate(event.candidate).then(
      () => {
        this.onAddIceCandidateSuccess(pc,event);
      },
      (err) => {
        console.log('error fuck ejuefhursgyrhsighsiruhgirsuhgiyrhsg')
        this.onAddIceCandidateError(pc, err);
      }
    );
  }

  private onAddIceCandidateSuccess = (pc,event) => {
    console.log('---------------------------')
    console.log(event)
    console.log('---------------------------')
  }

  private onAddIceCandidateError = (pc, err) => {
    // console.log(this.getPcName(pc));
    // console.log(err)
  }
  
  public joinClick() {
    this.peerConnections[0].addStream(this.mediaSource_local);
    var mediaSource_local = this.mediaSource_local;

    this.peerConnections[0].onicecandidate = (event) => {
      this.onIceCandidate(this.peerConnections[0], event);
    }

    this.peerConnections[0].oniceconnectionstatechange = (e) => {
      onIceStateChange(this.peerConnections[0], e);
    };
    
    function onIceStateChange(pc, event) {
      if (pc) {
        // console.log(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
        // console.log('ICE state change event: ', event);
      }
    }
    this.peerConnections[0].createOffer().then(this.onCreateOfferSuccess)
    this.peerConnections[1].onaddstream = this.getRemoteStream;
  }

  private onCreateOfferSuccess = (desc) => {
    console.log('-------------Offer-0--------------');
    console.log(desc);
    console.log('----------------------------------');

    this.peerConnections[0].setLocalDescription(desc).then();

    var mes = JSON.stringify({
      room : this.sessionid ,
      type : "offer" ,
      offer : JSON.stringify(desc)
    });
    this.sessionService.sendMessage(mes);
  }
  private onCreateAnswerSuccess = (desc) => {
    console.log('-------------Answer-1------------');
    console.log(desc);
    console.log('---------------------------------');
    this.peerConnections[1].setLocalDescription(desc).then(
      () => {
        var msg =  JSON.stringify({
          room : this.sessionid ,
          type : "answer" ,
          answer : JSON.stringify(desc)
        });
        this.sessionService.sendMessage(msg);
      }
    );
  }

  private getRemoteStream = (e) => {
    this.mediaSource_remote_list[0] = e.stream;
    console.log(this.mediaSource_remote_list[0]);
  }

  public socketjoin(){
    this.sessionService.getMessages().subscribe((test:any)=>{
      var js = JSON.parse(test);
      console.log(js);
      switch(js.type){
        case "offer" :
          this.peerConnections[1].setRemoteDescription(JSON.parse(js.offer)).then(
          ); break;
          case "answer" :
            this.peerConnections[0].setRemoteDescription(JSON.parse(js.answer)).then()
          break;
          case "candidate":
            this.peerConnections[1].addIceCandidate(js.candidate);
          break;
      }
    });
  }

  public socketSend(){
    this.sessionService.sendMessage(
      JSON.stringify({
        type : "Join",
        room : this.sessionid
      })
    )
  }


  public testConnection(){
    this.peerConnections[1].createAnswer().then(
      this.onCreateAnswerSuccess,
    );
    this.mediaSource_remote_list[0] = this.peerConnections[1].getRemoteStreams()[0];
    console.log(this.peerConnections[1].getRemoteStreams().length);
    console.log(this.peerConnections[1].getLocalStreams().length);
  }

  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
  }

  announceStart() {
    // alert('Start recording!');
    // console.log("test")
  }
}
