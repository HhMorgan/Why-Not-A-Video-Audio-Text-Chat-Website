import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { PageComponent } from './page.component';
import { HomeComponent } from './home/home.component';
import { SessionComponent } from './session/session.component';
import { LoginComponent } from './auth/login/login.component'
import { TemplateComponent } from './template/template.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoViewComponent } from './videoView/videoView.component';

const routes: Routes = [
  { path: 'session', component: SessionComponent },
  { path: 'login' , component:LoginComponent},
  { path: 'signup' , component: SignupComponent},
  { path: 'dashboard', component:DashboardComponent},
  { path: 'home' , component:HomeComponent},
  { path: 'video' , component:VideoViewComponent},
  { path: 'profile' , component:ProfileComponent},
  { path: 'template' , component:TemplateComponent},
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
