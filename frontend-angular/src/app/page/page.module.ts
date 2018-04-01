import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { EditProfileComponent } from './editProfile/editProfile.component'
import { PagesRoutingModule } from './page.routing'
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PagesRoutingModule
  ],
  declarations: [SessionComponent,EditProfileComponent]
})
export class PageModule { }
