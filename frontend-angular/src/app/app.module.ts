import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing'
import { AppComponent } from './app.component';
import { APIService } from './@core/service/api.service';
import { SessionService } from './@core/service/session.service';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthInterceptor } from './@core/service/auth.intercepter';
import { HTTP_INTERCEPTORS , HttpClientModule , HttpClient } from '@angular/common/http';
import { NavbarComponent } from './page/shared/navbar/navbar.component';
import { FooterComponent } from './page/shared/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AdminRatingComponent} from './page/components/admin-rating/admin-rating.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SettingsPageComponent } from './settings-page/settings-page.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SettingsPageComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule
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