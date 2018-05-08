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
import { upgradeToExpertComponent } from './upgradeToExpert/upgradeToExpert.component';
import { AdminPageUserComponent } from './AdminPageUser/AdminPageUser.component';
import { AdminRatingComponent } from './components/admin-rating/admin-rating.component';
import { VerifyComponent } from '../page/auth/verify/verify.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from '../page/search/search.component';
import { NotificationListComponent } from '../page/notification-list/notification.list.component';
import { RoleGuardService as AuthGuard } from '../@core/service/role-guard.service';
import { ErrTestComponent } from './errTest/errTest.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { RequestsComponent } from './requests/requests.component';

const routes: Routes = [
  { path: 'home' , component : HomeComponent },
  { path: 'about', component : AboutComponent },
  { path: 'login' , component : LoginComponent },
  { path: 'signup' , component : SignupComponent },
  { path: 'verify/:token', component : VerifyComponent},
  { path: 'session/:sessionid', component: SessionComponent , canActivate : [AuthGuard]  , data : { checkRole : false } },
  { path: 'dashboard', component : DashboardComponent , canActivate : [AuthGuard]  , data : { checkRole : true , expectedRole : 'admin' } },
  { path: 'profile' , component : ProfileComponent , canActivate : [AuthGuard]  , data : { checkRole : false } },
  { path: 'profile/:username' , component : ProfileComponent , canActivate : [AuthGuard] , data : { checkRole : false } },
  { path: 'search/:searchOptions/:search' , component:SearchComponent , canActivate : [AuthGuard] , data : { checkRole : false }  },
  { path: 'rating', component : RatingComponent , canActivate : [AuthGuard]  , data : { checkRole : false }},
  { path: 'notification', component : NotificationListComponent , canActivate : [AuthGuard] , data : { checkRole : false } },
  { path: 'schedule', component : ScheduleComponent , canActivate : [AuthGuard]  , data : { checkRole : true , expectedRole : 'expert' }  },
  { path: 'schedule/:expertid', component: ScheduleComponent , canActivate : [AuthGuard] , data : { checkRole : false } },
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
