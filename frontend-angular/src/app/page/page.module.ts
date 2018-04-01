import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { ProfileComponent } from './profile/profile.component'
import { PagesRoutingModule } from './page.routing'
import { LoginComponent } from './auth/login/login.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PagesRoutingModule
  ],
  declarations: [SessionComponent,ProfileComponent,LoginComponent]
})
export class PageModule { }
