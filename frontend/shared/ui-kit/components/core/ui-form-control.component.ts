import { Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { NgOnInit } from '@cikrf/gas-utils/decorators';
import { startWith, switchMap } from 'rxjs/operators';
import { ControlStatus } from '@enums/control-status.enum';

/**
 * @description базовый класс для элементов, являющихся FormControl
 * @description для обновления value необходимо передать корректно значение
 * @description в метод writeValue
 */
export abstract class UiFormControlComponent<T> implements ControlValueAccessor {
  @NgOnInit()
  public init$!: Observable<void>;

  public checked$: Observable<boolean> = this.init$.pipe(
    startWith(false),
    switchMap(() => this.ngControl?.valueChanges || of(false)),
  );

  public status$: Observable<ControlStatus> = this.init$.pipe(
    startWith(ControlStatus.Disabled),
    switchMap(() => this.ngControl?.statusChanges || of(ControlStatus.Disabled)),
  );

  public get control(): AbstractControl | null {
    return this.ngControl?.control;
  }

  constructor(
    /** контролл используется в шаблоне */
    @Self() @Optional() public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public writeValue(value: T): void {
    this.onChange(value);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  protected onChange = (value: T) => { };
  protected onTouched = () => { };
}
