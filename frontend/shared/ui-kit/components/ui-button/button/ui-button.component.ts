import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { UiButton } from '../button.enum';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';

/**
 * @description компонент стандартной кнопки с текстовым лэйблом.
 * @param disabled - управляет disabled состояние кнопки.
 * @param isLink - отриисовывает как html ссылку <a>.
 * @example
 * <ui-button
 *   [label]="Текст кнопки"
 *   disabled
 * ></ui-button>
 */
@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  @GasInputBoolean()
  @Input()
  public isLink: boolean;

  @Input()
  public link: any;

  @Input()
  public href: string;

  @Input()
  public type: UiButton.ButtonType = 'button';

  @Input()
  public label: any;

  @Input()
  public ariaLabel: string;

  @GasInputBoolean()
  @Input()
  public ariaExpanded: boolean;

  @Input()
  public ariaControls: string;

  @Input()
  public disabled = false;

  @GasInputBoolean()
  @Input()
  public loading = false;

  @GasInputBoolean()
  @Input()
  public autofocus: boolean;

  @Input()
  public styleClass: string;

  @Input()
  public uiButton: UiButton.ButtonView = null;

  @Input()
  public uiColor: UiButton.ButtonColor = null;

  @Output('onClick')
  public onClick = new EventEmitter<void>();

  public get classNames() {
    return {
      'ui-button': true,
      'ui-button-disabled': this.disabled || this.loading,
      'ui-button-loading': this.loading,
      'ui-button-link': this.uiButton === 'link',
      'ui-button-outline': this.uiButton === 'outline',
      'ui-button-error': this.uiColor === 'error',
      'ui-button-success': this.uiColor === 'success',
    };
  }

  public get hrefAttr() {
    return this.disabled || this.loading || !this.href ? '#' : this.href;
  }

  constructor(
    public element: ElementRef<HTMLElement>,
  ) {
  }
}
