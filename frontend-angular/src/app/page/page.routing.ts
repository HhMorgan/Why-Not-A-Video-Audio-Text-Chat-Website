import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page.component';
import { HomeComponent } from './home/home.component';
import { SessionComponent } from './session/session.component';
import { LoginComponent } from './auth/login/login.component'
import { TemplateComponent } from './template/template.component';
import { ProfileComponent } from './profile/profile.component';
const routes: Routes = [
  { path: 'session', component: SessionComponent },
  { path: 'login' , component:LoginComponent},
  { path: 'home' , component:HomeComponent},
  { path: 'profile' , component:ProfileComponent},
  { path: 'template' , component:TemplateComponent},
  { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
