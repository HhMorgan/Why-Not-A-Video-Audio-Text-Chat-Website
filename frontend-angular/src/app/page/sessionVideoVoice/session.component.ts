import { Component, OnInit } from '@angular/core';
import { APIService } from '../../@core/service/api.service';
import { SessionService } from '../../@core/service/session.service';

import {APIData , Session , CandicateSession } from '../../@core/service/models/api.data.structure';

@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
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
  private peerConnections : RTCPeerConnection[] = [ new RTCPeerConnection(null) , 
    new RTCPeerConnection(null) ];

  private userid = "5accc86110884653ec3a3b15";
  private reciver = "";
  private sessionid = "5accc80710884653ec3a3b14"; 

  constructor(private apiService:APIService , private sessionService : SessionService) {}
  ngOnInit() {
    console.log(this.mediaSource_remote_list.length+"edenudne")
  }

  public switchUser(){
    this.userid = (this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15"; 
  }

  public joinClick1() {
    // for( var i = 0 ; i < this.list.length ; i++)
    // document.write("");
    // this.mediaSource_remote = this.mediaSource_local;
    var pc1 = new RTCPeerConnection(null);
    var pc2 = new RTCPeerConnection(null);
    pc1.addStream(this.mediaSource_local);
    var  mediaSource_local = this.mediaSource_local;
    pc1.onicecandidate = function(event) {
      onIceCandidate(pc1, event);
      // alert(event)
      // console.log(event)
      if (event) {
        // Send the candidate to the remote peer
      } else {
        // All ICE candidates have been sent
      }
    }

    pc1.oniceconnectionstatechange = function(e) {
      onIceStateChange(pc1, e);
    };

    function onIceCandidate(pc, event) {
      getOtherPc(pc).addIceCandidate(event.candidate).then(
        function() {
          onAddIceCandidateSuccess(pc);
        },
        function(err) {
          onAddIceCandidateError(pc, err);
        }
      );
    }

    function onAddIceCandidateSuccess(pc) {
      console.log(getName(pc) + ' addIceCandidate success');
    }
    
    function onAddIceCandidateError(pc, error) {
      console.log(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
    }
    
    function onIceStateChange(pc, event) {
      if (pc) {
        // console.log(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
        // console.log('ICE state change event: ', event);
      }
    }

    function getOtherPc(pc) {
      return (pc === pc1) ? pc2 : pc1;
    }

    function getName(pc) {
      return (pc === pc1) ? 'pc1' : 'pc2';
    }

    function onCreateOfferSuccess(desc) {
      pc1.setLocalDescription(desc).then(
        function() {
          // console.log(getName(pc1)+"local sucess")
        },
        // onSetSessionDescriptionError
      );
      console.log('pc2 setRemoteDescription start');
      pc2.setRemoteDescription(desc).then(
        function() {
          // console.log(getName(pc2)+"local sucess")
        },
        // onSetSessionDescriptionError
      );
      // console.log('pc2 createAnswer start');
      // Since the 'remote' side has no media stream we need
      // to pass in the right constraints in order for it to
      // accept the incoming offer of audio and video.
      pc2.createAnswer().then(
        onCreateAnswerSuccess,
      );
    }

    function onCreateAnswerSuccess(desc) {
      // console.log('Answer from pc2:\n' + desc.sdp);
      // console.log('pc2 setLocalDescription start');
      pc2.setLocalDescription(desc).then(
        function() {
          // console.log(getName(pc2)+"local sucess")
        },
      );
      // console.log('pc1 setRemoteDescription start');
      pc1.setRemoteDescription(desc).then(
        function() {
          // console.log(getName(pc1)+"remote sucess")
        },
      );
    }
    pc1.createOffer().then(onCreateOfferSuccess)
    pc2.onaddstream = this.getRemoteStream;
  }

  private getOtherPc = (pc) => {
    return (pc === this.peerConnections[0] ) ? this.peerConnections[1] : this.peerConnections[0];
  }

  private getPcName = (pc) => {
    return (pc === this.peerConnections[0]) ? "PC1":"PC2" 
  }

  private onIceCandidate(pc, event) {
    this.getOtherPc(pc).addIceCandidate(event.candidate).then(
      () => {
        this.onAddIceCandidateSuccess(pc);
      },
      (err) => {
        this.onAddIceCandidateError(pc, err);
      }
    );
  }

  private onAddIceCandidateSuccess = (pc) => {
    console.log(this.getPcName(pc));
  }

  private onAddIceCandidateError = (pc, err) => {
    console.log(this.getPcName(pc));
    console.log(err)
  }
  
  public joinClick() {
    this.peerConnections[0].addStream(this.mediaSource_local);
    var mediaSource_local = this.mediaSource_local;

    this.peerConnections[0].onicecandidate = (event) => {

      this.onIceCandidate(this.peerConnections[0], event);
      console.log(event)
      if(event){
        var mes = JSON.stringify({
          type:"candidate",
          name:(this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15" ,
          candidate: event.candidate
        });
        this.sessionService.sendMessage(mes)      }
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
      type:"offer",
      name:(this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15" ,
      offer: JSON.stringify(desc)
    });
    this.sessionService.sendMessage(mes);
    // this.apiService.updateSessionCandidates(
    //   <CandicateSessionData>{ sessionId: this.sessionid , userId : this.userid , rtcDes : JSON.stringify(desc) }).subscribe((apiresponse: APIData) => {
    //     this.peerConnections[0].setLocalDescription(desc).then();
    // });
  }
  private onCreateAnswerSuccess = (desc) => {
    console.log('-------------Answer-1------------');
    console.log(desc);
    console.log('---------------------------------');
    this.peerConnections[1].setLocalDescription(desc).then(
      () => {
        var fuck =  JSON.stringify({
          type: "answer",
          name: this.reciver ,
          answer: JSON.stringify(desc)
        });
        this.sessionService.sendMessage(fuck);
      }
       
    );
    // console.log('-------------Answer-0------------');
    // console.log(desc);
    // console.log('---------------------------------');
    // this.peerConnections[0].setRemoteDescription(desc).then(
    //   function() {
    //     console.log('b5osh')
    //   }
    //   ,
    // );
  }

  private getRemoteStream = (e) => {
    this.mediaSource_remote_list[0] = e.stream;
    console.log(this.mediaSource_remote_list[0]);
  }

  private getRemoteDes(){
    
    // this.apiService.getSessionCandidatesRTCDes(
    //   <SessionData> {sessionId : this.sessionid , userId : (this.userid == "5accc86110884653ec3a3b15") ? "5accc40aef33b42a5cde5c87" : "5accc86110884653ec3a3b15" }).subscribe((apiresponse: APIData) => {
    //     this.peerConnections[1].addStream(this.mediaSource_local);
    //     this.peerConnections[1].setRemoteDescription(JSON.parse(apiresponse.data[0].candidates[0].rtcDes)).then(
    //       function() {
    //         console.log('-------------Offer-1-------------');
    //         console.log('Remote');
    //         console.log('---------------------------------');
    //       },
    //     )
    //   });
  }

  public socketjoin(){
    this.sessionService.getMessages().subscribe((test:any)=>{
      var js = JSON.parse(test);
      console.log(js);
      switch(js.type){
        case "offer" :
          this.reciver = js.name;
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
    // JSON.stringify(
    // this.sessionService.sendMessage()
  }

  public socketSend(){
    this.sessionService.sendMessage(
      JSON.stringify({
        type:"login" , 
        name:this.userid
      }
    ));
  }


  public testConnection(){
    this.peerConnections[1].createAnswer().then(
      this.onCreateAnswerSuccess,
    );
    this.mediaSource_remote_list[0] = this.peerConnections[1].getRemoteStreams()[0];
    console.log(this.peerConnections[1].getRemoteStreams().length);
    console.log(this.peerConnections[1].getLocalStreams().length);

    // this.apiService.getSessionCandidatesRTCDes(
    //   <SessionData>{
    //   sessionId: this.sessionid , 
    //   userId : "5accc40aef33b42a5cde5c87"
    // }).subscribe((apiresponse: APIData) => {
    //   console.log(JSON.parse(apiresponse.data[0].rtcDes));

    //   });
  }

  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
  }

  announceStart() {
    // alert('Start recording!');
    // console.log("test")
  }
}
