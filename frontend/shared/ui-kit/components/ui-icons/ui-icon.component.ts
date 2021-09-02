import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { UiIcon } from './ui-icons.namespace';
import { WindowService } from '@modules/browser-services/window.service';

const DEFAULT_SIZE = {
  size: 40,
};

/**
 * @description компонент для добавления иконок на страницу
 * @param name - имя иконки (можно посмотреть в файле ui-icons.namespace.ts)
 * @param size - размер иконки (задает ширину и высоту)
 * @param color - цвет иконки
 * @example <ui-icon name="keyboard-arrow-top"></ui-icon>
 */
@Component({
  selector: 'ui-icon',
  templateUrl: './ui-icon.component.html',
  styleUrls: ['./ui-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiIconComponent {
  /** имя иконки */
  @Input()
  public set name(name: string | UiIcon.Icons) {
    this.path = `assets/icons/icons.svg`;
    this.iconName = name;
  }

  /** размер иконки */
  @Input()
  public set size(size: number) {
    if (size && size !== DEFAULT_SIZE.size) {
      this.width = size;
      this.height = size;
    } else {
      this.width = DEFAULT_SIZE.size;
      this.height = DEFAULT_SIZE.size;
    }
  }

  /** тайтл для скринридеров */
  @Input()
  public htmlTitle: string;

  /** устанавливает цвет иконки */
  @HostBinding('style.color')
  @Input()
  public color: string;

  @HostBinding('style.width.px')
  public width: number = DEFAULT_SIZE.size;

  @HostBinding('style.height.px')
  public height: number = DEFAULT_SIZE.size;

  public path: string;
  public iconName: string;

  constructor(
    public el: ElementRef,
    private windowService: WindowService,
  ) { }

}
