import 'rxjs/add/operator/filter';
import { Subscription } from 'rxjs/Subscription';
import { NouisliderModule } from 'ng2-nouislider';
import { DOCUMENT } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplateComponent } from './template/template.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgbdModalContent } from './components/modal/modal.component';
import { ComponentsComponent } from './components/components.component';
import { NgbdModalComponent } from './components/modal/modal.component';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TypographyComponent } from './components/typography/typography.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BasicelementsComponent } from './components/basicelements/basicelements.component';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { NgModule, Component, OnInit, Inject, Renderer, ElementRef, ViewChild} from '@angular/core';

/* Our Components
---------------------------------------------------*/
import { PagesRoutingModule } from './page.routing';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SessionComponent } from './session/session.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    NouisliderModule,
    PagesRoutingModule,
    JWBootstrapSwitchModule,
  ],
  declarations: [
    BasicelementsComponent,
    ComponentsComponent,
    NavigationComponent,
    TypographyComponent,
    NucleoiconsComponent,
    NotificationComponent,
    NgbdModalComponent,
    NgbdModalContent,
    TemplateComponent,
    SessionComponent,
    LoginComponent,
    HomeComponent,
  ],
  entryComponents: [NgbdModalContent]
})
export class PageModule { 
  
}
