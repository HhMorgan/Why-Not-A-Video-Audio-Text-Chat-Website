import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { ExpertComponent } from './expert/expert.component';
import { HomeComponent } from './home/home.component';
import { SessionComponent } from './session/session.component';
import { SlotRequestComponent } from './slotRequest/slotRequest.component';
import { LoginComponent } from './auth/login/login.component'
import { AdminComponent } from './AdminPage/Admin.component'
import { TemplateComponent } from './template/template.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoViewComponent } from './videoView/videoView.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { RatingComponent } from './rating/rating.component';
import { viewScheduleComponent } from './viewSchedule/viewSchedule.component';
import { upgradeToExpertComponent } from './upgradeToExpert/upgradeToExpert.component';
import { ExpertsListComponent } from './expertsList/expertsList.component';
import { AdminPageUserComponent } from './AdminPageUser/AdminPageUser.component';
import { TagSearchComponent } from './tagSearch/tagSearch.component';
import { SessionVideoComponent } from './sessionVideoVoice/sessionvideo.component';
import { SessionChatMobileComponent } from './sessionChatMobile/session.component';
import { ScheduleComponent } from './Schedule/Schedule.component';

import { AdminRatingComponent } from './components/admin-rating/admin-rating.component';
import { AboutComponent } from './about/about.component';
import { SearchUserComponent } from '../page/search-user/search-user.component';
import { notificationPageComponent } from '../page/notificationPage/notificationPage.Component';

const routes: Routes = [
  { path: 'home' , component:HomeComponent},
  { path: 'login' , component:LoginComponent},
  { path: 'signup' , component: SignupComponent},
  { path: 'session/:sessionid', component: SessionComponent },
  { path: 'dashboard', component:DashboardComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'profile' , component:ProfileComponent},
  { path: 'profile/:username' , component:ProfileComponent},
  { path: 'template' , component:TemplateComponent},
  { path: 'date-picker' , component:DatePickerComponent},
  { path: 'expert', component: ExpertComponent },
  { path: 'expertsList', component: ExpertsListComponent },
  { path: 'tagSearch',component: TagSearchComponent},
  { path: 'adminPage', component:AdminPageUserComponent},
  { path: 'chat', component: SessionChatMobileComponent},
  { path: 'search/:searchtag' , component:SearchUserComponent},
  { path: 'about', component:AboutComponent },
  { path: 'slotRequest', component: SlotRequestComponent },
  { path: 'rating', component: RatingComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'schedule/:expertid', component: ScheduleComponent },
  { path: 'admin-rating', component:AdminRatingComponent },
  { path: 'notification', component:notificationPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
  constructor() {
    //console.log(Router);    
  }  
  
}
