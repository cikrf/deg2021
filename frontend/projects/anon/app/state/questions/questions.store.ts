import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BallotsStore } from '@state/ballots/ballots.store';
import { Vote } from '@models/vote.interface';
import { Ballot, Question } from '@models/elections';
import { BallotsQuery } from '../ballots/ballots.query';
import { NgOnDestroy } from '@cikrf/gas-utils/decorators';
import { Observable } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';

export interface QuestionsState extends EntityState<Question, Question['id']>, ActiveState {
  ballot: Ballot;
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'questions',
  idKey: 'id',
  resettable: true,
})
export class QuestionsStore extends EntityStore<QuestionsState> {
  @NgOnDestroy()
  private destroy$!: Observable<void>;

  constructor(
    private ballotsStore: BallotsStore,
    private ballotsQuery: BallotsQuery,
  ) {
    super();
    this.ballotsQuery.selectActive()
      .pipe(
        takeUntil(this.destroy$),
        filter((ballot: Ballot) => !!ballot),
        tap((ballot: Ballot) => {
          this.setBallot(ballot);
        }),
      )
      .subscribe();
  }

  public setBallot(ballot: Ballot): void {
    const currentBallot = this.getValue().ballot;
    if (!currentBallot || !(currentBallot.id === ballot.id && currentBallot.lang === ballot.lang)) {
      this.reset();
      this.update({ ballot });
      this.set(ballot.questions);
      this.update(null, {completed: false});
      this.setActive(ballot.questions[0].id);
    }
  }

  public setVote(id: Question['id'], vote: Vote): void {
    if (!id) {
      return;
    }
    const { ballot } = this.getValue();
    this.ballotsStore.setVote(
      ballot.id,
      id,
      vote,
    );
    this.updateActive({
      completed: true,
    });
  }
}
