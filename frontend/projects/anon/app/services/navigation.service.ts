import { Injectable } from '@angular/core';
import { NavigationBehaviorOptions, NavigationEnd, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, first, tap } from 'rxjs/operators';

import { BallotsQuery } from '../state/ballots/ballots.query';
import { BallotsStore } from '../state/ballots/ballots.store';
import { QuestionsQuery } from '../state/questions/questions.query';
import { QuestionsStore } from '../state/questions/questions.store';
import { Ballot, Question } from '@models/elections';

const defaultNavigationExtras: NavigationBehaviorOptions = {
  skipLocationChange: true,
};

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private ballotsQuery: BallotsQuery,
    private ballotsStore: BallotsStore,
    private questionsQuery: QuestionsQuery,
    private questionsStore: QuestionsStore,
    private router: Router,
  ) { }

  public getNextBallotId(ballotId?: Ballot['id']): Ballot['id'] | undefined {
    const hasUncompleted = this.ballotsQuery.getUncompleted() !== undefined;

    /**
     * Обработка ситуации, когда мы переходим на следующую бюллетень
     * Нужно проверить, что мы можем переходить на следующую бюллетень по флоу голосования
     * Если у нас нет следующего или он completed, то идем на первый незаконченный
     */
    if (!ballotId) {
      const allBallots = this.ballotsQuery.getAll();
      const allUncompletedBallotIds = allBallots.filter(b => !b.completed).map(b => b.id);
      const allUncompletedBallotsWithActive = allBallots
        .filter((b) => {
          return b.id === this.ballotsQuery.getActiveId() ||
            allUncompletedBallotIds.includes(b.id);
        });
      const activeBallotIndex = allUncompletedBallotsWithActive
        .findIndex((ballot: Ballot) => ballot.id === this.ballotsQuery.getActive()?.id);
      const nextBallotByFlow = activeBallotIndex > -1 ? allUncompletedBallotsWithActive[activeBallotIndex + 1] : null;

      if (nextBallotByFlow && !nextBallotByFlow.completed) {
        return nextBallotByFlow.id;
      }
    }

    const nextBallotId: Ballot['id'] | undefined = (ballotId && this.ballotsQuery.hasEntity(ballotId || ''))
      ? ballotId
      : hasUncompleted ? this.ballotsQuery.getUncompleted()?.id : this.ballotsQuery.getUncompletedWithoutSkipped()?.id;

    return nextBallotId;
  }

  public goToNextBallot(ballotId?: Ballot['id'], postfix?: 'complete' | 'error', error?: string): void {
    const nextBallotId: Ballot['id'] | undefined = this.getNextBallotId(ballotId);

    if (!nextBallotId) {
      this.router.navigate(['/']).then();
      return;
    }

    this.ballotsStore.setActive(nextBallotId);

    combineLatest([
      this.ballotsQuery.selectActive(),
      this.questionsQuery.selectActive(),
    ])
      .pipe(
        filter(([ballot, question]: [Ballot, Question]) => !!ballot && !!question),
        distinctUntilChanged(),
        first(),
      )
      .subscribe(([ballot, question]: [Ballot, Question]) => {
        const url = [ballot.id];
        if (postfix) {
          url.push(postfix);
        } else {
          url.push(question.id);
        }
        let queryParams = {};
        if (error) {
          queryParams = { error, showDesc: true };
        }
        this.router.navigate(url, { queryParams, ... defaultNavigationExtras }).then().catch(e => console.error(e));
      });
  }

  public goToNextQuestion(): void {
    const ballotId = this.ballotsQuery.getActiveId();
    const nextQuestion = this.questionsQuery.getUncompleted();

    if(!nextQuestion) {
      this.router.navigate([ballotId, 'confirm']).then();
      return;
    }

    this.questionsStore.setActive(nextQuestion.id);
    this.router.navigate([ballotId, this.questionsQuery.getActiveId()], defaultNavigationExtras).then();
  }

  public goToCurrentBallot(): void {
    this.questionsStore.update(null, {completed: false});
    this.ballotsStore.cleanUpSkippedBallots(this.ballotsQuery.getActiveId() as Ballot['id']);

    const firstUncompletedQuestion = this.questionsQuery.getUncompleted();

    if (firstUncompletedQuestion) {
      this.questionsStore.setActive(firstUncompletedQuestion.id);
    }

    this.router.navigate([
      this.ballotsQuery.getActiveId(),
      this.questionsQuery.getActiveId(),
    ], defaultNavigationExtras).then();
  }
}
