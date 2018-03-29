import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { PagesRoutingModule } from './page.routing'
@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule
  ],
  declarations: [SessionComponent]
})
export class PageModule { }
