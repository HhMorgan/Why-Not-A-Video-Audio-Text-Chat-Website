import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SessionComponent } from './session/session.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'session', component: SessionComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
