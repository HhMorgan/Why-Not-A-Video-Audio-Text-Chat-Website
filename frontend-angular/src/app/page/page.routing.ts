import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SessionVideoComponent } from './sessionVideoVoice/session.component'
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'session', component: SessionVideoComponent },
  // { path: 'page', component: PageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'session' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
