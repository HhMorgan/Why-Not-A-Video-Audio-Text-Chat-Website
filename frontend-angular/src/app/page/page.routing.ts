import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SessionComponent } from './session/session.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './auth/login/login.component'
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'session', component: SessionComponent },
  { path: 'editProfile', component: ProfileComponent },
  { path: 'login' , component:LoginComponent},
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
