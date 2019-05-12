import { Pipe, PipeTransform } from '@angular/core';
import DateUtil from 'utils/date';

@Pipe({ name: 'timesToNow' })
export class TimesToNowPipe implements PipeTransform {
  transform(value: string): string {
    return DateUtil.timesToNow(value);
  }
}
