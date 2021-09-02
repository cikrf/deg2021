import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toString',
})
export class ToStringPipe implements PipeTransform {

  transform(value: unknown): string {
    return String(value);
  }

}
