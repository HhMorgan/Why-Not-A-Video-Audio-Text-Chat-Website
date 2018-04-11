import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing'
import { AppComponent } from './app.component';
import { APIService } from './@core/service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from './@core/service/session.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [SessionService ,APIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
