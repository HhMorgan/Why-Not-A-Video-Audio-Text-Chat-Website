import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing'
import { AppComponent } from './app.component';
import { APIService } from './@core/service/api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [APIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
