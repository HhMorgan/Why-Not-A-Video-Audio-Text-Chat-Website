import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { PageModule } from './page/page.module';
import { SessionComponent } from './page/session/session.component';
import { RequestComponent } from './page/request/request.component';
import { ExpertComponent } from './page/expert/expert.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'page', loadChildren: './page/page.module#PageModule' },
  { path: '', redirectTo: 'page', pathMatch: 'full' },
  { path: '**', redirectTo: 'page' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
