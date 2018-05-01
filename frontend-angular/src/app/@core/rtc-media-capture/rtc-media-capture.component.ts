import { Component , OnChanges , SimpleChange , OnInit, ViewChild, Input , Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'rtc-media-recorder',
  templateUrl: './template/rtc-media-recorder.component.html',
  styleUrls: ['./template/rtc-media-recorder.component.css']
})
export class RtcMediaCaptureComponent implements OnInit , OnChanges {
  
  @Input() isRemote;
  @Input() mediaSource;
  @Input() constrains;
  @Input() showVideoPlayer = true;

  @Output() startRecording = new EventEmitter();
  @Output() downloadRecording = new EventEmitter();
  @Output() handleMediaStream = new EventEmitter();

  @ViewChild('recVideo') recVideo: any;

  public format = 'video/webm';
  public _navigator = <any> navigator;
  public video;
  public mediaRecorder;
  public recordedBlobs = null;
  constructor() {}

  ngOnInit() {
    if (this.recVideo) {
      this.video = this.recVideo.nativeElement;
      if(!this.isRemote)
        this.recVideo.nativeElement.muted = true;
      this.recVideo.nativeElement.controls = false;
      this.start();
    }
    this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia || this._navigator.mozGetUserMedia 
      || this._navigator.msGetUserMedia );
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    for (let propName in changes) {
      if( propName === "mediaSource" && this.isRemote && this.mediaSource != null ){
        console.log('change');
        this.start();
      }
    }
  }

  private _initStream(constrains, navigator) {
    return navigator.mediaDevices.getUserMedia(constrains).then((stream) => {  
      this.handleMediaStream.emit(stream);
      return stream;
    }).catch(err => err);
  }

  private _stopStream() {
    const tracks = this.mediaSource.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  }

  public start() {
    this.recordedBlobs = [];
    if(this.isRemote) 
      if(this.mediaSource != null){
        this.video.srcObject = this.mediaSource;
        this.mediaRecorder = new window['MediaRecorder'](this.mediaSource, {mimeType: this.format});
      } else {
        console.log('failed to create media')
      }
        
    else {
      this._initStream(this.constrains, this._navigator).then((stream) => {
        if (!window['MediaRecorder'].isTypeSupported(this.format)) {
          console.log(this.format + ' is not Supported');
          return;
        }
        try {
          if (this.video) {
              this.video.srcObject = stream;
              this.mediaSource = this.video.srcObject;
            }
            this.mediaRecorder = new window['MediaRecorder'](this.mediaSource, {mimeType: this.format});
          this.startRecording.emit(stream);
        } catch (e) {
          console.error('Exception while creating MediaRecorder: ' + e);
          return;
        }
        // console.log('Created MediaRecorder', this.mediaRecorder, 'with options', this.format);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedBlobs.push(event.data);
          }};
        this.mediaRecorder.start(10); // collect 10ms of data
        });
      }
  }

  public stop() {
    this._stopStream();
    this.mediaRecorder.stop();
  }
}
