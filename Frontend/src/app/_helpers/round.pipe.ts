import {Pipe, PipeTransform} from '@angular/core';
import {Tools} from './tools';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, precision: number): number {
    return Tools.round(value, precision);
  }

}
