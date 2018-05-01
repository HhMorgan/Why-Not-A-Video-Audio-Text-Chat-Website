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
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { NgModule, Component, OnInit, Inject, Renderer, ElementRef, ViewChild} from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxPaginationModule } from 'ngx-pagination';
/* Our Components
---------------------------------------------------*/
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SessionComponent } from './session/session.component';
import { AdminComponent } from './AdminPage/Admin.component';

import { viewScheduleComponent } from './viewSchedule/viewSchedule.component';
import { upgradeToExpertComponent } from './upgradeToExpert/upgradeToExpert.component';

import { SlotRequestComponent } from './slotRequest/slotRequest.component';
import { ExpertComponent } from './expert/expert.component';
import { PagesRoutingModule } from './page.routing'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RtcMediaCaptureModule } from '../@core/rtc-media-capture/rtc-media-capture.module'
import { RatingComponent } from './rating/rating.component';
import { ExpertsListComponent } from './expertsList/expertsList.component';
import { AdminPageUserComponent } from './AdminPageUser/AdminPageUser.component';
import { SessionChatMobileComponent } from './sessionChatMobile/session.component';
import { AdminRatingComponent } from '../page/components/admin-rating/admin-rating.component';
import { SettingsPageComponent } from './profile/settings-page/settings-page.component';
import { ScheduleComponent } from './Schedule/Schedule.component';
import { WeekModule } from './Schedule/week.module';
import { AboutComponent } from './about/about.component';
import { notificationPageComponent } from '../page/notificationPage/notificationPage.Component';
import { SearchComponent } from '../page/search/search.component';
import { SnackbarCompComponent } from './components/snackbar-comp/snackbar-comp.component';
import { ColorTagComponent } from './colorTag/colorTag.component';
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component';

@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    Ng2SmartTableModule ,
    PagesRoutingModule,
    NouisliderModule,
    PagesRoutingModule,
    RtcMediaCaptureModule,
    AngularFontAwesomeModule,
    JWBootstrapSwitchModule,
    AmazingTimePickerModule,
    WeekModule ,
    NgxPaginationModule 
  ],
  declarations: [
    AdminComponent,
    AdminPageUserComponent,
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
    ProfileComponent,
    SignupComponent,
    DashboardComponent,
    SlotRequestComponent, 
    RatingComponent,
    viewScheduleComponent,
    upgradeToExpertComponent,
    ExpertComponent,
    ExpertsListComponent,
    AdminPageUserComponent,
    SessionChatMobileComponent,
    AdminRatingComponent,
    SettingsPageComponent,
    ScheduleComponent,
    SearchComponent,
    AboutComponent,
    notificationPageComponent,
    SnackbarCompComponent,
    ColorTagComponent,
    ConfirmMailComponent,
  ],
  entryComponents: [NgbdModalContent]
})
export class PageModule { 

}