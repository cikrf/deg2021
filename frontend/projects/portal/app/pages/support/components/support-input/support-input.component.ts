import { Observable } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  Input,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';

import { untilDestroyed } from '@cikrf/gas-utils/operators';

import { SupportPage } from '../../support-page.namespace';

@Component({
  selector: 'app-support-input',
  templateUrl: './support-input.component.html',
  styleUrls: ['support-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SupportInputComponent),
      multi: true,
    },
  ],
})
export class SupportInputComponent implements ControlValueAccessor {

  @Input()
  public type = SupportPage.SupportInputTypeEnum.Text;

  @Input()
  public label: string;

  @Input()
  public autofocus: boolean;

  @Input()
  public maxLength: number;

  @Input()
  public placeholder = '';

  @Input()
  public pattern: 'all' | 'number' = 'all';

  @Input()
  public error = false;

  @GasInputBoolean()
  @Input()
  public codeInput = false;

  @HostBinding('class._disabled')
  public get disabled(): boolean {
    return this.form.disabled;
  }

  public inputTyprEnum = SupportPage.SupportInputTypeEnum;
  public form = new FormControl();
  public inputData$: Observable<string> = this.form.valueChanges;

  constructor() {
    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: any) => {
        this.onChange(value);
      });
  }

  public writeValue(value: any): void {
    this.form.setValue(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  public validate(event: any): void {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  }

  public get getTransformedLabel() {
    return this.label.replace(/ /g, '');
  }

  protected onChange = (value: any) => {
  };
  protected onTouched = () => {
  };
}
