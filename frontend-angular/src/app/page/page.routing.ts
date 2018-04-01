import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SessionComponent } from './session/session.component';
import { EditProfileComponent } from './editProfile/editProfile.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'session', component: SessionComponent },
  { path: 'editProfile', component: EditProfileComponent },
  { path: '', pathMatch: 'full', redirectTo: 'session' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
