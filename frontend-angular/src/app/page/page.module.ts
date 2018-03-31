import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { RequestModule } from './request/request.module';
import { RequestComponent } from './request/request.component';
import { PagesRoutingModule } from './page.routing'
@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    
  ],
  declarations: [RequestComponent]
})
export class PageModule { }
