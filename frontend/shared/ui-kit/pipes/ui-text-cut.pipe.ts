import { Pipe, PipeTransform } from '@angular/core';

import { WindowService } from '@modules/browser-services/window.service';

const DOT_SYMBOL = '...';
const BREAKPOINTS_COEFFICIENT = {
  mobileMin: 320,
  mobileMax: 420,
  tabletMin: 600,
  desktopMin: 768,
};

@Pipe({
  name: 'uiTextCut',
})
export class UiTextCutPipe implements PipeTransform {
  private coefficient = 1;

  constructor(
    private windowService: WindowService,
  ) { }

  public transform(fullText: string, maxLength: number): string {
    this.coefficient = this.getCoefficient();

    const newString: string[] = [];
    const stringArray = fullText.trim().split(' ');

    /**
     * перебираем массив со всеми словами и проверяем, что он меньше допустимого количества символов
     */
    stringArray.forEach(str => {
      if (newString.join(' ').length > maxLength * this.coefficient - DOT_SYMBOL.length) {
        return;
      } else {
        newString.push(str);
      }
    });

    newString.splice(-DOT_SYMBOL.length);
    return newString.join(' ') + DOT_SYMBOL;
  }

  private getCoefficient(): number {
    if (this.windowService.innerWidth > BREAKPOINTS_COEFFICIENT.desktopMin) {
      return 4;
    } else if (this.windowService.innerWidth > BREAKPOINTS_COEFFICIENT.tabletMin) {
      return 2.5;
    } else if (this.windowService.innerWidth > BREAKPOINTS_COEFFICIENT.mobileMax) {
      return 2;
    } else if (this.windowService.innerWidth > BREAKPOINTS_COEFFICIENT.mobileMin) {
      return 1.5;
    } else {
      return 1;
    }
  }

}
