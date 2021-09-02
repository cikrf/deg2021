import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';

/**
 * Для реализации карточек был создан данный компонент
 * Принимает следующие состояния:
 *
 * @Input active - Состояние активности, синий бордер
 * @Input error - Ошибка, красный бордер
 * @Input disabled - Не активное состояние, серый бордер
 *
 * Для управления контентом внутри, были созданы три вспомогательных компонента:
 * ui-card-header - Шапка
 * ui-card-control - Элемент управления, с серым фоном
 * ui-card-content - Контент
 *
 * Их можно комбинировать внутри как угодно, например:
 *
 * @example
 * <ui-card>
 *   <ui-card-control>Content of control</ui-card-control>
 *   <ui-card-header>Content of header</ui-card-header>
 *   <ui-card-content>Content</ui-card-content>
 * </ui-card>
 */
@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.component.html',
  styleUrls: ['./ui-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardComponent {
  @HostBinding('class._active')
  @GasInputBoolean()
  @Input()
  public active = false;

  @HostBinding('class._error')
  @GasInputBoolean()
  @Input()
  public error = false;

  @HostBinding('class._disabled')
  @GasInputBoolean()
  @Input()
  public disabled = false;
}
