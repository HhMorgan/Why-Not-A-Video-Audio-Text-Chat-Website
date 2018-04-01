import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { RequestModule } from './request/request.module';
import { RequestComponent } from './request/request.component';
import { ExpertComponent } from './expert/expert.component';
import { ExpertModule } from './expert/expert.module';
import { PagesRoutingModule } from './page.routing'
@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    
  ],
  //declarations: [RequestComponent]
  declarations: [ExpertComponent]
})
export class PageModule { }
