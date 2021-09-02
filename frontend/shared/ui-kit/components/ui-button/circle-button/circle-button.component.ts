import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UiIcon } from '../../ui-icons/ui-icons.namespace';

/**
 * @description компонент для добавления на страницу круглой кнопки
 * @description с иконкой внутри
 * @param type - добавляет цвет бэкграунда и устанавливает цвет для иконки
 * @param name - имя иконки
 * @param size - размер иконки
 * <ui-circle-button
 *   name='base-add'
 *   type='secondary'
 * >
 * </ui-circle-button>
 */
@Component({
  selector: 'ui-circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.scss'],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._primary]' : `type === 'primary'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._secondary]' : `type === 'secondary'`,
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCircleButtonComponent {
  @Input()
  public type: 'primary' | 'secondary' = 'primary';

  @Input()
  public name: UiIcon.Icons | string = UiIcon.Base.KeyboardArrowDown;

  @Input()
  public size = 40;

}
