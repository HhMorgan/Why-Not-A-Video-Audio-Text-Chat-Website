import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'week' })
export class WeekPipe implements PipeTransform {
    transform(value: Date): number {
        return moment(value).week();
    }
}
