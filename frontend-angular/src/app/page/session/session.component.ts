import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {
  format = 'video/webm';
  isRemote_Local = false;
  isRemote_Remote = true;
  constrains = {video: true , audio: true };
  mediaSource_local = null;
  mediaSource_remote = null;
  private mediaSource_remote_list : any[6] = [null];


  private pc1 ;
  private pc2 ;
  constructor() { }
  ngOnInit() {
    console.log(this.mediaSource_remote_list.length+"edenudne")
  }

  public joinClick(){

    // for( var i = 0 ; i < this.list.length ; i++)
    // document.write("");
    // this.mediaSource_remote = this.mediaSource_local;
    var pc_config = <RTCConfiguration>{iceServers: [{urls: 'stun:stun.l.google.com:19302'},{urls: 'stun:stun.services.mozilla.com'}]};
    var pc1 = new RTCPeerConnection(null);
    var pc2 = new RTCPeerConnection(null);
    pc1.addStream(this.mediaSource_local);
    var  mediaSource_local = this.mediaSource_local;
    pc1.onicecandidate = function(event) {
      onIceCandidate(pc1, event);
      // alert(event)
      console.log(event)
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
      // console.log(getName(pc) + ' addIceCandidate success');
    }
    
    function onAddIceCandidateError(pc, error) {
      // console.log(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
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

  private getRemoteStream = (e) => {
    this.mediaSource_remote = e.stream;
    this.mediaSource_remote_list[0] = e.stream;
  }


  

  public handle_Media_Stream(stream) {
    this.mediaSource_local = stream;
    console.log('edtuyfigrhfu9rhgiuth' + stream);
  }

  announceStart() {
    // alert('Start recording!');
    console.log("test")
    



    function handleNegotiationNeededEvent() {
      // pc1.createOffer().then(function(offer) {
      //   return pc1.setLocalDescription(offer);
      // }).then(function() { sendToServer({
      //   name: 'h',
      //   target: '',
      //   type: "video-offer",
      //   sdp: pc1.localDescription
      //   });
      // })
      // .catch(reportError);
    }
  }
}
