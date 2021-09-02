import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Answer, Question } from '@models/elections';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { GasFormHelper } from '@shared/helpers/form.helper';
import { ControlStatus } from '@enums/control-status.enum';

/**
 * @description сервис для создания и работы с формой для карточек вопросов
 * @description сервис добавляет кастомный валидатор, раздизейбливает форму
 */
export class QuestionForm extends FormGroup {

  private formSubs: Subscription[] = [];


  constructor(
    private question: Question,
    private maxMarks: number,
    private activeAnswers: Answer[] = [],
  ) {
    super({});
    question.answers.forEach((answer: Answer) => {
      this.addControl(answer.id, this.getControlsForAnswer(answer));
    });
    this.disable();
    this.formResubscribe();
  }

  /** проверка, нужно ли раздизейблить форму */
  public enableForm(byUnlocked: boolean = false): boolean {
    if (this.disabled) {
      this.enable();

      if (byUnlocked) {
        this.markAsDirty();
      }

      return true;
    }
    return false;
  }

  public destroy(): void {
    this.formSubs.forEach(sub => sub.unsubscribe());
  }

  public get answers(): Answer[] {
    return this.question.answers;
  }

  public get hasChecked(): boolean {
    return this.checkedAnswers.length > 0;
  }

  /** массив с выбранными значениями */
  public get checkedAnswers(): string[] {
    return GasFormHelper.getFormValue(this);
  }

  private getControlsForAnswer(answer: Answer): FormControl {
    const activeAnswers: Answer[] = this.activeAnswers || [];
    const isActiveAnswer = activeAnswers.find((innerAnswer: Answer) => innerAnswer.id === answer.id) !== undefined;

    const control = new FormControl(isActiveAnswer);

    if (isActiveAnswer) {
      control.markAsDirty();
    }
    return control;
  }

  private get isSingleAnswer(): boolean {
    return this.maxMarks === 1;
  }

  private formResubscribe(): void {
    this.formSubs.forEach((subscription: Subscription) => subscription.unsubscribe());
    this.formSubs = [];

    const unavailableSub = this.statusChanges.pipe(
      distinctUntilChanged(),
      filter((status: ControlStatus) => status !== ControlStatus.Disabled),
      // todo form validator??
    ).subscribe(() => {
      Object.keys(this.controls).forEach((answerId: Answer['id']) => {
        const answer: Answer | undefined = this.question.getAnswerById(answerId);
        if (answer && answer.disabled) {
          this.controls[answer.id].disable({ onlySelf: true, emitEvent: false });
        }
      });
    });

    this.formSubs.push(unavailableSub);

    GasFormHelper.controlForEach(this, (control: AbstractControl) => {
      const sub: Subscription = GasFormHelper.controlValueObservable(control)
        .pipe(
          tap((checked: boolean) => !checked ? control.markAsPristine() : null),
        ).subscribe((checked: boolean) => {
          if (checked) {
            if (this.isSingleAnswer) {
              GasFormHelper.controlForEach(this, (formControl: AbstractControl) => {
                if (formControl !== control && formControl.value === true) {
                  formControl.patchValue(false);
                }
              });
            }
          }

          setTimeout(() => {
            if (!this.isSingleAnswer && this.dirty) {
              if (this.maxMarks === this.checkedAnswers.length) {
                GasFormHelper.controlForEach(this, (formControl: AbstractControl) => {
                  if (formControl.value === false && formControl.enabled) {
                    formControl.disable();
                  }
                });
              } else {
                GasFormHelper.controlForEach(this, (formControl: AbstractControl, name: string | number) => {
                  const answer: Answer | undefined = this.question.getAnswerById(String(name));
                  if (
                    formControl.status === ControlStatus.Disabled &&
                    formControl.disabled &&
                    !answer?.disabled
                  ) {
                    formControl.enable();
                  }
                });
              }
            }
          });
        });

      this.formSubs.push(sub);
    });
  }
}
