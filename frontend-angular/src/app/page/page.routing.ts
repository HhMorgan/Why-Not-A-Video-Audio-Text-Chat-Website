import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SessionComponent } from './session/session.component';
import { LoginComponent } from './auth/login/login.component'
import { RouterModule, Routes } from '@angular/router';
import{HomeComponent} from './home/home.component';
import { DesignTemplateComponent } from './designTemplate/designTemplate.component';
const routes: Routes = [
  { path: 'session', component: SessionComponent },
  { path: 'login' , component:LoginComponent},
  { path: 'home' , component:HomeComponent},
  {path:'design', component:DesignTemplateComponent},
  { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
