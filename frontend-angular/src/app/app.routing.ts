import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { PageModule } from './page/page.module';
import { SessionComponent } from './page/session/session.component';
import { ExpertComponent } from './page/expert/expert.component';
import { SessionVideoComponent } from './page/sessionVideoVoice/session.component';
import { RatingComponent } from './page/rating/rating.component';
import { LoginComponent } from './page/auth/login/login.component'
import { SlotRequestComponent } from './page/slotRequest/slotRequest.component';

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
