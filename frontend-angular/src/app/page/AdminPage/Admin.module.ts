import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './Admin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    Ng2SmartTableModule,
  ],
  declarations: [
  AdminComponent,
  ],
})

export class AdminModule { }
