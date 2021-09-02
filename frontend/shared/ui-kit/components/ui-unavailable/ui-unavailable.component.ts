import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';
import { AppRoutingEnum } from 'projects/portal/app/app-routing.enum';
import { UiIcon } from '../ui-icons/ui-icons.namespace';

/**
 * Компонент предназначен для отображение не доступной информации
 * Например для не существующей страницы или не корректно загруженном запросе
 *
 * @Input hideMain - Скрывает кнопку "На главную"
 * @Input hideRepeat - Скрывает кнопку "Повторить"
 * @Input spinner - Показывает загрузку, вместо иконки
 * @Input red - Красный цвет иконки
 * @Input iconName - Вставка кастомной иконки
 * @Input title - Заголовок
 * @Input description - Подзаголовок
 * @Input href - Урл у главной кнопки
 * @Input mainButtonText - Текст на главной кнопке
 * @Input repeatButtonText - Текст на побочной кнопке
 * @Input isContent - Флаг для отображения контенда между description и кнопками
 *
 * @example <ui-unavailable
 *  title="title"
 *  description="description"
 *  (onRepeatClicked)="handleRepeat()"></ui-unavailable>
 */
@Component({
  selector: 'ui-unavailable',
  templateUrl: './ui-unavailable.component.html',
  styleUrls: ['./ui-unavailable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiUnavailableComponent {
  @GasInputBoolean()
  @Input()
  public hideMain = false;

  @GasInputBoolean()
  @Input()
  public hideRepeat = false;

  @GasInputBoolean()
  @Input()
  public hideDescription = false;

  @GasInputBoolean()
  @Input()
  public spinner = false;

  @GasInputBoolean()
  @Input()
  public red = false;

  @GasInputBoolean()
  @Input()
  public isContent = false;

  @GasInputBoolean()
  @Input()
  public showSupport = false;

  @GasInputBoolean()
  @Input()
  public isAnon = false;

  @Input()
  public iconName: UiIcon.Icons = UiIcon.Notice.Warning;

  @Input()
  public href = AppRoutingEnum.Election || '/';

  @Input()
  public supportHref = '/' + AppRoutingEnum.Support;

  @Input()
  public title = 'Страница не найдена';

  @Input()
  public description = 'Запрашиваемая вами страница не существует. Возможно, есть ошибка при написании адреса. Начните с главной.';

  @Input()
  public mainButtonText = 'На главную';

  @Input()
  public repeatButtonText = 'Повторить';

  @HostBinding('attr.aria-live')
  public attrAriaLive = 'assertive';

  @HostBinding('attr.role')
  public attrRole = 'alert';

  public reloadPage(): void {
    window.location.reload();
  };

}
