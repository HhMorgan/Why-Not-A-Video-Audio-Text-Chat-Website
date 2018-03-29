import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SessionComponent } from './session/session.component'
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'session', component: SessionComponent },
  // { path: 'page', component: PageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'session' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
