import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uiRepeatArray',
})
export class UiRepeatArrayPipe implements PipeTransform {
  public transform(count: number): string[] {
    return Array(count);
  }
}
