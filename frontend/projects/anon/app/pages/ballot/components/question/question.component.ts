import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  delay,
  delayWhen,
  filter,
  first,
  map,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import { AnswersStore } from '@state/answers/answers.store';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { QuestionsStore } from '@state/questions/questions.store';
import { QuestionsQuery } from '@state/questions/questions.query';
import { AnswersQuery } from '@state/answers/answers.query';

import { Ballot, Question } from '@models/elections';
import { WindowService } from '@modules/browser-services/window.service';
import { BrowserEventsService } from '@services/browser-event.service';
import { QuestionForm } from './question-form';
import { NgOnDestroy } from '@cikrf/gas-utils/decorators';
import { NavigationService } from '../../../../services/navigation.service';
import { ControlStatus } from '@enums/control-status.enum';
import { BallotsStore } from '@state/ballots/ballots.store';
import { AnswersListComponent } from './answers-list/answers-list.component';

/** TODO: Больно большой файл, подумать над рефакторингом */
@Component({
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  @NgOnDestroy()
  private destroy$!: Observable<void>;

  @ViewChild(AnswersListComponent, { read: ElementRef })
  private answersListElement: ElementRef;

  public question$: Observable<Question> = this.questionsQuery.selectActive().pipe(
    filter((question: Question) => !!question),
    delayWhen(() => this.windowService.smoothScrollToTop()),
  );

  public ballot$: Observable<Ballot> = this.ballotsQuery.selectActive();

  public form$: Observable<QuestionForm> = this.question$.pipe(
    map((question: Question) => {
      return new QuestionForm(
        question,
        this.ballotsQuery.getActive().maxMarks,
        this.answersQuery.getActive(),
      );
    }),
    startWith(undefined),
    pairwise(),
    map(([toDestroy, actual]: [QuestionForm | undefined, QuestionForm]) => {
      toDestroy?.destroy();
      return actual;
    }),
    shareReplay(1),
  );

  public formStatus$: Observable<ControlStatus> = this.form$.pipe(
    switchMap((form: QuestionForm) => form.statusChanges.pipe(
      startWith(form.status),
    )),
  );

  public disabledIndex$ = new BehaviorSubject<number>(-1);
  public formEnabled$: Observable<boolean> = this.formStatus$.pipe(
    withLatestFrom(this.ballot$),
    map(([status, ballot]: [ControlStatus, Ballot]) => {
      return [
        ControlStatus.Enabled,
        ControlStatus.Valid,
      ].includes(status) && !ballot.completed;
    }),
  );

  public get hasNext(): boolean {
    return Boolean(
      this.ballotsQuery.getUncompleted(
        this.ballotsQuery.getActiveId() as Ballot['id'],
      ),
    );
  }

  constructor(
    private answersQuery: AnswersQuery,
    private answersStore: AnswersStore,
    private questionsQuery: QuestionsQuery,
    private questionsStore: QuestionsStore,
    private ballotsQuery: BallotsQuery,
    private ballotStore: BallotsStore,
    private browserEventsService: BrowserEventsService,
    private windowService: WindowService,
    private navigationService: NavigationService,
  ) {

    this.form$.pipe(
      takeUntil(this.destroy$),
      delay(0),
    ).subscribe((form: QuestionForm) => {
      this.tryUnlockBallot(form);
    });

    this.destroy$.pipe(
      withLatestFrom(this.form$),
    ).subscribe(([v, form]: [void, QuestionForm]) => form.destroy());

    this.ballot$.pipe(
      takeUntil(this.destroy$),
      filter((ballot: Ballot) => ballot.completed),
    ).subscribe((ballot: Ballot) => {
      this.navigationService.goToNextBallot(ballot.id, 'complete');
    });
  }

  /**
   * Клик по кнопке "Проголосовать" - сохраняем айдишники в сторе, переходим на следующую страницу:
   * 1 - Страница подтверждения, если одна бюллетень
   * 2 - Следующая бюллетень, если их несколько для одного голосования
   */
  public confirm(isSkip: boolean = false): void {
    this.form$.pipe(
      first(),
    ).subscribe((form: QuestionForm) => {
      this.ballotStore.update(this.ballotsQuery.getActiveId() as Ballot['id'], { unlocked: true });

      if (isSkip) {
        return this.navigationService.goToNextBallot();
      }

      if (form.status === ControlStatus.Invalid) {
        return;
      }

      this.answersStore.setActive(form.checkedAnswers);

      this.questionsStore.setVote(
        // todo as string потому что похоже что акита не поняла там типа айдишника
        this.questionsQuery.getActiveId() as string,
        this.answersQuery.getVote(),
      );

      this.navigationService.goToNextQuestion();
    });

  }

  public navigateToBallot(index: number): void {
    const ballotId = this.ballotsQuery.getAll()[index].id;

    this.navigationService.goToNextBallot(ballotId);
  }

  public isActive(index: number): boolean {
    const currentBallotId: string = this.ballotsQuery.getActive().id;
    const ballotIdByIndex: string = this.ballotsQuery.getAll()[index].id;

    return currentBallotId === ballotIdByIndex;
  }

  public isCompleted(index: number): boolean {
    return this.ballotsQuery.getAll()[index].completed;
  }

  public clickOnScrollTop(): void {
  }

  public clickOnNowYouCanChoose(): void {
  }

  private tryUnlockBallot(form: QuestionForm): void {

    if (this.ballotsQuery.getActive().unlocked) {
      form.enableForm(true);
      return;
    }
    const sub: Subscription = this.browserEventsService.scroll$.pipe(
      takeUntil(this.destroy$),
      debounceTime(100),
    ).subscribe(() => {
      if (!this.answersListElement?.nativeElement) {
        return;
      }

      const element: HTMLElement = this.answersListElement?.nativeElement;
      const { top, height } = element.getBoundingClientRect();

      if (height && (height + top) < this.windowService.window.innerHeight) {
        form.enableForm();
        sub.unsubscribe();
      }
    });
  }
}
