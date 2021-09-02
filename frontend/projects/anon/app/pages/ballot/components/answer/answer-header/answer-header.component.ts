import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import {  NgControl } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { GasInputBoolean, NgOnChange } from '@cikrf/gas-utils/decorators';

import { UiFormControlComponent } from '@ui/components/core/ui-form-control.component';
import { ControlStatus } from '@enums/control-status.enum';

@Component({
  selector: 'app-answer-header',
  templateUrl: './answer-header.component.html',
  styleUrls: ['./answer-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerHeaderComponent extends UiFormControlComponent<boolean> {
  @Output('onDisabledClick')
  public onDisabledClick$ = new EventEmitter<void>();

  @Input()
  public rejectionReason: string;

  @Input()
  public unavailable = false;

  @NgOnChange('maxMarks$')
  @Input('maxMarks')
  public maxMarks$!: Observable<number>;

  @HostBinding('class._dark')
  @GasInputBoolean()
  @Input()
  public dark = false;

  /** добавляет стиль если чекбокс чекед */
  @HostBinding('class._selected')
  public get selected(): boolean {
    return this.ngControl.value;
  }

  public formValue$: Observable<{[k: string]: boolean}> = this.init$.pipe(
    startWith({}),
    switchMap(() =>
      this.ngControl.control?.parent?.valueChanges.pipe(startWith(this.ngControl.control?.parent?.value)) || of({})),
  );

  public answersCount$: Observable<number> = this.formValue$.pipe(
    map(value => Object.values(value).filter(checked => checked).length),
  );

  public invalid$: Observable<boolean> = this.status$.pipe(
    map((status: ControlStatus) => status === ControlStatus.Invalid),
  );

  constructor(
    /** используется в шаблоне */
    @Self() @Optional() public ngControl: NgControl,
  ) {
    super(ngControl);
  }

  public isDisableControl(): boolean {
    return this.control?.status === ControlStatus.Disabled;
  }

  public onDisabledClick(): void {
    this.onDisabledClick$.emit();
  }

  public clickOnDisabledCheckbox(): void {
  }

  public clickOnQuestion(): void {
  }
}
