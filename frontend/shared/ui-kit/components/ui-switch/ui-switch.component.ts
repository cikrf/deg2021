import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  Optional,
  Self,
} from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';

import { UiFormControlComponent } from '../core/ui-form-control.component';
import { SwitchLabel } from './ui-switch.interface';

const DEFAULT_ICON_SIZE = 28;

/**
 * @description компонент добавляющий на страницу переключатель
 * @param label - добаляет лейбл под переключатель {default: string, active: string}
 * @param nativeDisabled - состояние неактивности
 * @param iconSize - размер иконки
 * @param active - состояние переключателя
 * <ui-switch
 *  [label]="{ default: 'Выключен', active: 'Включен', disabled: 'Не доступно' }"
 *  [nativeDisabled]="false"
 *  formControlName="switcher"
 * ></ui-switch>
 */
@Component({
  selector: 'ui-switch',
  templateUrl: './ui-switch.component.html',
  styleUrls: ['./ui-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSwitchComponent extends UiFormControlComponent<boolean> {
  @Input()
  public label: SwitchLabel;

  //TODO: если нужно будет дизейблить форму, то доплнить этот функционал
  @GasInputBoolean()
  @HostBinding('class._disabled')
  @Input()
  public nativeDisabled = false;

  @Input()
  public iconSize = DEFAULT_ICON_SIZE;

  @GasInputBoolean()
  @HostBinding('class._active')
  @Input()
  public active = false;

  @GasInputBoolean()
  @HostBinding('class._horizontal')
  @Input()
  public horizontal = false;

  constructor(
    /** контролл используется в шаблоне */
    @Self() @Optional() public ngControl: NgControl,
  ) {
    super(ngControl);

    /** Обновление состояния через push в форме свыше */
    this.registerOnChange((isActive) => this.handleChange(isActive));
  }

  @HostListener('click', [])
  public changeSwitch(): void {
    if (this.nativeDisabled) {
      return;
    }

    this.active = !this.active;

    this.writeValue(this.active);
  }

  public getLabel(): string {
    if (this.nativeDisabled) {
      return this.label?.disabled || this.label.default;
    }

    if (this.active) {
      return this.label?.active || this.label.default;
    }

    return this.label.default;
  }

  private handleChange(isActive: boolean): void {
    this.active = isActive;
  }
}
