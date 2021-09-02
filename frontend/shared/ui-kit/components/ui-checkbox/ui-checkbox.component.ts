import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { untilDestroyed } from '@cikrf/gas-utils/operators';
import { UiFormControlComponent } from '../core/ui-form-control.component';

export type CheckboxType = 'default' | 'votebox';

const DISABLED = 'DISABLED';

/**
 * @description компонент добавляющий на страницу чекбокс
 *
 * <ui-checkbox formControlName='checkbox'></ui-checkbox>
 */
@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UiCheckboxComponent extends UiFormControlComponent<boolean> implements OnInit {
  public checked = false;
  public disabled = false;

  @Input()
  public type: CheckboxType = 'default';

  @Input()
  public label: any;

  @Input()
  public unavailable = false;

  @Input()
  public formControl?: FormControl;

  @Output()
  public onDisabledClick = new EventEmitter<void>();

  @HostBinding('class.ui-checkbox-error')
  public get error(): boolean {
    return !!this.ngControl?.control?.errors || false;
  }

  constructor(
    /** используется в шаблоне */
    @Self() @Optional() public ngControl: NgControl,
  ) {
    super(ngControl);
  }

  @HostListener('click', [])
  public changeCheckboxValue(): void {
    if (this.disabled && !this.unavailable) {
      this.onDisabledClick.emit();
    }

    if (this.disabled || this.unavailable) {
      this.ngControl?.control?.disable();
      return;
    }

    this.writeValue(!this.ngControl?.control?.value);
  }

  public get checkboxStyle(): Record<string, boolean> {
    return {
      'ui-checkbox-control': true,
      'ui-checkbox-control-vote': this.type === 'votebox',
      'ui-checkbox-checked': this.checked,
      'ui-checkbox-unavailable': this.unavailable,
    };
  }

  public ngOnInit(): void {
    // записываем значение контролла в приватную переменную
    this.checked = this.ngControl?.control?.value;
    // записываем текущее состояние контролла в приватную переменную
    this.disabled = this.ngControl?.control?.status === DISABLED;

    // подписываемся на изменение value в контролле
    this.ngControl?.valueChanges?.pipe(
      untilDestroyed(this),
    ).subscribe((value: boolean) => this.checked = value);

    // подписываемся на изменение статуса формы
    this.ngControl?.statusChanges?.pipe(
      untilDestroyed(this),
    ).subscribe((status: string) => this.disabled = status === DISABLED);
  }
}
