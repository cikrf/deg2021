import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable, of } from 'rxjs';

import { NgOnChange, NgOnInit } from '@cikrf/gas-utils/decorators';

import { QuestionForm } from '../question-form';
import { FormGroup } from '@angular/forms';
import { switchMap, map, startWith } from 'rxjs/operators';
import { UiButton } from '@ui/components/ui-button/button.enum';
import { ControlStatus } from '@enums/control-status.enum';

@Component({
  selector: 'app-voting-box',
  templateUrl: './voting-box.component.html',
  styleUrls: ['./voting-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingBoxComponent {
  @Output('voted')
  public voted$ = new EventEmitter<void>();

  @Input()
  public maxMarks = 1;

  @Input()
  public initialValue: Record<string, boolean>;

  @NgOnChange('form$')
  @Input('form')
  public form$!: Observable<QuestionForm>;

  @NgOnInit()
  public init$!: Observable<void>;

  public invalid$: Observable<boolean> = this.init$.pipe(
    startWith(false),
    switchMap(() => this.form$.pipe(
      switchMap((form: FormGroup) => form.statusChanges),
      map((status: ControlStatus) => status === ControlStatus.Invalid),
    )),
  );

  public formValue$: Observable<{ [k: string]: boolean }> = this.init$.pipe(
    startWith({}),
    switchMap(() => this.form$.pipe(
      switchMap((form: FormGroup) => form.valueChanges.pipe(
        startWith(this.initialValue),
      )),
    ) || of({})),
  );

  public answersCount$: Observable<number> = this.formValue$.pipe(
    map(value => Object.values(value).filter(checked => checked).length),
  );

  public numbers: Record<number, string> = {
    2: 'двух кандидатов',
    3: 'трех кандидатов',
    4: 'четырех кандидатов',
    5: 'пяти кандидатов',
    6: 'шести кандидатов',
    7: 'семи кандидатов',
    8: 'восьми кандидатов',
    9: 'девяти кандидатов',
    10: 'десяти кандидатов',
    11: 'одиннадцати кандидатов',
    12: 'двенадцати кандидатов',
    13: 'тринадцати кандидатов',
    14: 'четырнадцати кандидатов',
    15: 'пятнадцати кандидатов',
    16: 'шестнадцати кандидатов',
    17: 'семнадцати кандидатов',
    18: 'восемнадцати кандидатов',
    19: 'девятнадцати кандидатов',
    20: 'двадцати кандидатов',
    21: 'двадцати одного кандидата',
    22: 'двадцати двух кандидатов',
    23: 'двадцати трех кандидатов',
    24: 'двадцати четырех кандидатов',
    25: 'двадцати пяти кандидатов',
  };

  public getButtonType(invalid: boolean, maxMarks: number, checked: number): UiButton.ButtonView {
    return maxMarks > 1
      ? maxMarks === checked ? null : 'outline'
      : null;
  }

  public voted(disabled: boolean): void {
    if (disabled) {
      return;
    }

    this.voted$.emit();
  }
}
