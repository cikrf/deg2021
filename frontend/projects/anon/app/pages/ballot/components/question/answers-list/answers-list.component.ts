import {
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Answer } from '@models/elections';
import { FormControl, FormGroup } from '@angular/forms';
import { NgAfterViewChecked, NgOnChange } from '@cikrf/gas-utils/decorators';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ControlStatus } from '@enums/control-status.enum';
import { ScrollInstructionComponent } from '../scroll-instruction/scroll-instruction.component';
import { QuestionForm } from '../question-form';
import { AnswerCardComponent } from '../../answer/answer-card/answer-card.component';
import { BrowserEventsService } from '@services/browser-event.service';
import { ScrollInstructionType } from '../scroll-instruction/scroll-instruction.enum';

@Component({
  selector: 'app-answers-list',
  templateUrl: './answers-list.component.html',
  styleUrls: ['./answers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswersListComponent {

  @ViewChildren(AnswerCardComponent)
  private answerCards: QueryList<AnswerCardComponent>;

  @Input()
  public maxMarks = 1;

  @NgOnChange('form$')
  @Input('form')
  public form$!: Observable<QuestionForm>;

  @NgAfterViewChecked()
  private afterContentChecked$!: Observable<void>;

  public formStatus$: Observable<ControlStatus> = this.form$.pipe(
    switchMap((form: FormGroup) => form.statusChanges.pipe(
      startWith(form.status),
    )),
    distinctUntilChanged(),
    shareReplay(),
  );

  public lastClickOnDisabled$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public showInstruction$: Observable<boolean> = combineLatest([
    this.lastClickOnDisabled$,
    this.formStatus$,
  ]).pipe(
    map(([disabledClickIndex, status]: [number, ControlStatus]) => {
      return status === ControlStatus.Disabled ? true : disabledClickIndex >= 0;
    }),
  );

  public instructionType$: Observable<ScrollInstructionComponent['type']> = this.formStatus$.pipe(
    map((status: ControlStatus) => {
      return status === ControlStatus.Disabled ? ScrollInstructionType.Scroll : ScrollInstructionType.Max;
    }),
  );

  public setActiveInstruction$ = this.form$.pipe(
    switchMap((form: FormGroup) => combineLatest([
      form.valueChanges,
      this.instructionType$,
    ]).pipe(
      tap(([changes, instructionType]: [any, ScrollInstructionType]) => {
        const countChecked = Object.values(form.controls).filter((control: FormControl) => control.value).length;
        if (countChecked < this.maxMarks && instructionType === ScrollInstructionType.Max) {
          this.lastClickOnDisabled$.next(-1);
        }
      }),
    )),
  );

  constructor(
    private browserEventsService: BrowserEventsService,
  ) {
  }

  public trackById(index: number, answer: Answer): any {
    return answer.id;
  }

  public clickedByDisabled(index: number, instruction: any): void {
    setTimeout(() => instruction.elementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
    }));
    this.lastClickOnDisabled$.next(index);
  }

  public maxCardHeight$: Observable<number> = merge(
    this.browserEventsService.resize$,
    this.form$,
    this.afterContentChecked$,
  ).pipe(
    debounceTime(200),
    map(() => this.getMaxCardHeight()),
    distinctUntilChanged(),
  );

  public getMaxCardHeight(): number {
    let height = 0;
    this.answerCards?.forEach((ac: AnswerCardComponent) => {
      if (!ac.voteCard?.nativeElement) {
        return;
      }
      const offsetHeight = ac.voteCard.nativeElement.offsetHeight;

      height = offsetHeight > height ? offsetHeight : height;
    });
    return height;
  }

}
