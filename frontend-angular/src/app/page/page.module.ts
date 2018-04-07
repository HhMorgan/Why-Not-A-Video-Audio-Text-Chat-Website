import { NgModule, Component, OnInit, Inject, Renderer, ElementRef, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { PagesRoutingModule } from './page.routing';
import { LoginComponent } from './auth/login/login.component';

import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/platform-browser';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import{HomeComponent} from './home/home.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NouisliderModule } from 'ng2-nouislider';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';

import { BasicelementsComponent } from './components/basicelements/basicelements.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TypographyComponent } from './components/typography/typography.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { ComponentsComponent } from './components/components.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NgbdModalComponent } from './components/modal/modal.component';
import { NgbdModalContent } from './components/modal/modal.component';
import { DesignTemplateComponent } from './designTemplate/designTemplate.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    NouisliderModule,
    JWBootstrapSwitchModule
  ],
  declarations: [SessionComponent,
    LoginComponent,
    HomeComponent,
    DesignTemplateComponent,
    ComponentsComponent,
    BasicelementsComponent,
    NavigationComponent,
    TypographyComponent,
    NucleoiconsComponent,
    NotificationComponent,
    NgbdModalComponent,
    NgbdModalContent
  ],
  entryComponents: [NgbdModalContent]
})
export class PageModule { 
  
}
