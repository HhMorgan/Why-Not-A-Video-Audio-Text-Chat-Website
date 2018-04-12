import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule, matFormFieldAnimations} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
@NgModule({
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NoopAnimationsModule,
    AmazingTimePickerModule
  ],
  declarations: [
    DatePickerComponent,

  ],
  bootstrap:[DatePickerComponent]
})


export class DatePickerModule { }
