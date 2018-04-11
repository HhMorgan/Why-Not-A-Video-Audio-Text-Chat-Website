import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionVideoComponent } from './sessionVideoVoice/session.component';
import { PagesRoutingModule } from './page.routing'
import { RtcMediaCaptureModule } from '../@core/rtc-media-capture/rtc-media-capture.module'
@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    RtcMediaCaptureModule
  ],
  declarations: [SessionVideoComponent]
})
export class PageModule { }
