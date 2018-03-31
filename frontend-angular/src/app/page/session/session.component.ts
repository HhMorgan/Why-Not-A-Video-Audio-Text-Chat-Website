import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session',
  templateUrl: './template/session.component.html',
  styleUrls: ['./template/session.component.css']
})
export class SessionComponent implements OnInit {
  format = 'video/webm';
  constrains = {video: true , audio: true };
  constructor() { }

  ngOnInit() {
    
  }

  public handleVideoStream(blob) {
    console.log('Recording' + blob);
  }

  announceStart() {
    // alert('Start recording!');
    var pc1 = new RTCPeerConnection(null);
    pc1.onicecandidate = function(event) {
      console.log(event)
      if (event.candidate) {
        // Send the candidate to the remote peer
      } else {
        // All ICE candidates have been sent
      }
    }
    
    var pc2 = new RTCPeerConnection(null);
    pc2.onicecandidate = function(event) {
      console.log(event)
      if (event.candidate) {
        // Send the candidate to the remote peer
      } else {
        // All ICE candidates have been sent
      }
    }

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
