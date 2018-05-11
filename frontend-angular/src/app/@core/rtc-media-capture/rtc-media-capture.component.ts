import { Component, OnChanges, SimpleChange, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
@Component({
  selector: 'rtc-media-recorder',
  templateUrl: './template/rtc-media-recorder.component.html',
  styleUrls: ['./template/rtc-media-recorder.component.css']
})
export class RtcMediaCaptureComponent implements OnInit, OnChanges , OnDestroy {

  @Input() isRemote;
  @Input() mediaSource;
  @Input() constrains;
  @Input() startCapture = false;
  @Input() showVideoPlayer = true;

  @Output() startRecording = new EventEmitter();
  @Output() downloadRecording = new EventEmitter();
  @Output() handleMediaStream = new EventEmitter();

  @ViewChild('recVideo') recVideo: any;

  public format = 'video/webm';
  public _navigator = <any>navigator;
  public video;
  public mediaRecorder;
  constructor() {}

  ngOnInit() {
    if (this.recVideo) {
      this.video = this.recVideo.nativeElement;
      if (!this.isRemote)
        this.recVideo.nativeElement.muted = true;
      this.recVideo.nativeElement.controls = false;
    }
    this._navigator.getUserMedia = (this._navigator.getUserMedia || this._navigator.webkitGetUserMedia || this._navigator.mozGetUserMedia
      || this._navigator.msGetUserMedia);
  }

  ngOnDestroy(): void {
    this.startCapture = false;
    this.stop();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (let propName in changes) {
      switch (propName) {
        case "mediaSource":
          if (this.isRemote && this.mediaSource != null) {
            this.start();
          }
        break;
        
        case "startCapture":
          if (!this.isRemote) {
            if (this.startCapture) {
              this.start();
            } else {
              this.stop();
            }
          }
        break;
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
    if(this.mediaSource){
      const tracks = this.mediaSource.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  }

  public start() {
    if (this.isRemote) {
      if (this.mediaSource != null) {
        this.video.srcObject = this.mediaSource;
      } else {
        console.error('failed to create media')
      }
    } else {
      this._initStream(this.constrains, this._navigator).then((stream) => {
        if (this.video) {
          this.video.srcObject = stream;
          this.mediaSource = this.video.srcObject;
        }
      });
    }
  }
  public stop() {
    this._stopStream();
  }
}
