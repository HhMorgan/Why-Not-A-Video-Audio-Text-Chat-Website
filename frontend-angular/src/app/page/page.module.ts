import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { PagesRoutingModule } from './page.routing'
import { RtcMediaCaptureModule } from '../@core/rtc-media-capture/rtc-media-capture.module'
@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    RtcMediaCaptureModule
  ],
  declarations: [SessionComponent]
})
export class PageModule { }
