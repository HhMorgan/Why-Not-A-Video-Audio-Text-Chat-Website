import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtcMediaCaptureComponent } from './rtc-media-capture.component';

@NgModule({
  declarations: [
    RtcMediaCaptureComponent
  ],
  exports: [RtcMediaCaptureComponent],
  imports: [CommonModule],
  providers: [],
})
export class RtcMediaCaptureModule { }
