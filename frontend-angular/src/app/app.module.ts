import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing'
import { AppComponent } from './app.component';
import { APIService } from './@core/service/api.service';
import { AuthInterceptor } from './@core/service/auth.intercepter';
import { HTTP_INTERCEPTORS , HttpClientModule , HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },APIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
