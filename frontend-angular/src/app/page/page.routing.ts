import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SessionComponent } from './session/session.component';
import { LoginComponent } from './auth/login/login.component'
import { AdminComponent } from './AdminPage/Admin.component'
import { TemplateComponent } from './template/template.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RatingComponent } from './rating/rating.component';
import { viewScheduleComponent } from './viewSchedule/viewSchedule.component';
import { upgradeToExpertComponent } from './upgradeToExpert/upgradeToExpert.component';
import { AdminPageUserComponent } from './AdminPageUser/AdminPageUser.component';
import { ScheduleComponent } from './Schedule/Schedule.component';
import { AdminRatingComponent } from './components/admin-rating/admin-rating.component';
import { ConfirmMailComponent } from '../page/auth/confirm-mail/confirm-mail.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from '../page/search/search.component';
import { NotificationListComponent } from '../page/notification-list/notification.list.component';
import { RoleGuardService as AuthGuard } from '../@core/service/role-guard.service';
import { ErrTestComponent } from './errTest/errTest.component';
import{Schedule2Component} from './schedule2/schedule2.component';
import { RequestsComponent } from './requests/requests.component';

const routes: Routes = [
  { path: 'home' , component : HomeComponent },
  { path: 'about', component : AboutComponent },
  { path: 'login' , component : LoginComponent },
  { path: 'signup' , component : SignupComponent },
  { path: 'confirm/:email/:token', component : ConfirmMailComponent},
  { path: 'session/:sessionid', component: SessionComponent , canActivate : [AuthGuard]  , data : { checkRole : true } },
  { path: 'dashboard', component : DashboardComponent , canActivate : [AuthGuard]  , data : { checkRole : true , expectedRole : 'admin' } },
  { path: 'profile' , component : ProfileComponent , canActivate : [AuthGuard]  , data : { checkRole : true } },
  { path: 'profile/:username' , component : ProfileComponent , canActivate : [AuthGuard] , data : { checkRole : true } },
  { path: 'search/:searchtag' , component:SearchComponent , canActivate : [AuthGuard] , data : { checkRole : true }  },
  { path: 'rating', component : RatingComponent , canActivate : [AuthGuard]  , data : { checkRole : true }},
  { path: 'notification', component : NotificationListComponent , canActivate : [AuthGuard] , data : { checkRole : true } },
  { path: 'schedule', component : ScheduleComponent , canActivate : [AuthGuard]  , data : { checkRole : true , expectedRole : 'expert' }  },
  { path: 'schedule/:expertid', component: ScheduleComponent , canActivate : [AuthGuard] , data : { checkRole : true } },
  { path: 'schedule2', component: Schedule2Component , canActivate : [AuthGuard]  , data : { checkRole : true }},
  { path: 'requests', component: RequestsComponent , canActivate : [AuthGuard]  , data : { checkRole : true , expectedRole : 'expert'}},
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
