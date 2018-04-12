import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing'
import { AppComponent } from './app.component';
import { APIService } from './@core/service/api.service';
import { SessionService } from './@core/service/session.service';
import { AuthInterceptor } from './@core/service/auth.intercepter';
import { HTTP_INTERCEPTORS , HttpClientModule , HttpClient } from '@angular/common/http';
import { NavbarComponent } from './page/shared/navbar/navbar.component';
import { FooterComponent } from './page/shared/footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    NgbModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } , APIService , SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
