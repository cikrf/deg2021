import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { QuestionsQuery } from '@state/questions/questions.query';
import { Ballot, Question } from '@models/elections';
import { WindowService } from '@modules/browser-services/window.service';
import { GasNotationPipe } from '@cikrf/gas-utils/pipes';
import { VoteResponse } from '@models/transaction';

/**
 * TODO:
 * Когда будет спокойный режим разработки, нужно отрефакторинг данный компонент + FinalPageComponent. Страницы открываются по
 * разным роутам, но тело у них для проголосованного бюллетеня одинаковое
 */

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent implements AfterViewInit {

  public ballot: Ballot = this.ballotsQuery.getActive();
  public questions$: Observable<Question[]> = this.questionsQuery.selectAll();
  public completed$: Observable<boolean> = this.ballotsQuery.selectActive().pipe(
    filter((ballot: Ballot) => !!ballot),
    map((ballot: Ballot) => {
      const skippedBallotIds: string[] = this.ballotsQuery.getValue().skippedBallotIds || [];
      const hasInSkipped = skippedBallotIds.includes(ballot.id);

      return ballot.completed || hasInSkipped;
    }),
  );

  public hasNext$: Observable<boolean> = this.ballotsQuery.uncompletedWithoutSkipped$.pipe(
    map(Boolean),
  );

  public isSkip: boolean = this.activatedRoute.snapshot.queryParamMap.get('skip') === 'true';

  public get generatedTitle(): string {
    return this.getGeneratedTitle(this.ballotsQuery.getActive(), this.isSkip);
  }

  public receipt$: Subject<VoteResponse> = new Subject<VoteResponse>();

  constructor(
    private questionsQuery: QuestionsQuery,
    private ballotsQuery: BallotsQuery,
    private activatedRoute: ActivatedRoute,
    private windowService: WindowService,
    private gasNotationPipe: GasNotationPipe,
  ) {}

  public ngAfterViewInit() {
    this.windowService.scrollToTop();
  }

  private getGeneratedTitle(ballot: Ballot, isSkip: boolean | undefined): string {

    if (ballot.completed) {
      return '';
    }

    if (isSkip) {
      return 'Вы не проголосовали';
    }

    if (ballot.isSingleAnswer) {
      // return 'Кандидат выбран';
      return '';
    }

    const selectedCount = this.ballotsQuery.getSeletectedAnswers(ballot.questions[0].id).length;

    if (selectedCount < ballot.maxMarks) {
      return `${this.gasNotationPipe.transform(selectedCount, ['Выбран', 'Выбраны', 'Выбраны'])} `
        + `${selectedCount} из ${ballot.maxMarks} кандидатов`;
    }

    return `Все ${selectedCount} ${this.gasNotationPipe.transform(selectedCount, ['кандидат','кандидата','кандидатов'])} выбраны`;

    // todo: когда можно будет определить тип голосования нужно будет добавить возможность подставить эти текстовки
    // Вы ответили на ${selected} ${this.gasNotationPipe.transform(selected, ['вопрос', 'вопроса', 'вопросов'])} из ${ballot.maxMarks}
    // Вы ответили на все ${selected} ${this.gasNotationPipe.transform(selected, ['вопрос', 'вопроса', 'вопросов'])}
  }
}
