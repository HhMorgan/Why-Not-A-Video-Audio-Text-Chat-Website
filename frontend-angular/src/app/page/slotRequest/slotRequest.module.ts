/*This module views the expert's pending slot requests using ng2-smart-table.
The expert can accept/reject the request.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotRequestComponent } from './slotRequest.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    Ng2SmartTableModule,
  ],
  declarations: [
    SlotRequestComponent,
  ],
})


export class SlotRequestModule { }
