import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { Seed } from '@models/seed';
import { Vote } from '@models/vote.interface';
import { Ballot, Question } from '@models/elections';
import { makeArray } from '@utils/functions/make-array';

export type QuestionVotes = Map<Question['id'], Vote>;
export type Votes = Map<Ballot['id'], QuestionVotes>;

export interface BallotsState extends EntityState<Ballot, Ballot['id']>, ActiveState {
  seed: Seed;
  votes: Votes;
  skippedBallotIds: Ballot['id'][];
}

const createInitialState = (): BallotsState => ({
  seed: plainToClass(Seed, {}),
  active: null,
  loading: true,
  votes: new Map(),
  skippedBallotIds: [],
});

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'ballots',
  idKey: 'id',
})
export class BallotsStore extends EntityStore<BallotsState> {

  constructor(
  ) {
    super(createInitialState());
  }

  public setVote(
    ballotId: Ballot['id'],
    questionId: Question['id'],
    vote: Vote,
  ): void {
    // todo понять насколько это вообще нормально
    const { votes } = this.getValue();
    const ballotVotes = votes.get(ballotId) || new Map<Question['id'], Vote>();
    ballotVotes.set(questionId, vote);
    votes.set(ballotId, ballotVotes);
    this.update({ votes });
  }

  public skipBallot(): void {
    const { active, skippedBallotIds } = this.getValue();

    if (!active) {
      return;
    }

    this.update({skippedBallotIds: [...skippedBallotIds, String(active)]});
  }

  public cleanUpSkippedBallots(ids?: Ballot['id'] | Ballot['id'][]): void {
    let { skippedBallotIds } = this.getValue();
    if (ids) {
      const removeIds = makeArray(ids);
      skippedBallotIds = skippedBallotIds.filter(id => !removeIds.includes(id));
    } else {
      skippedBallotIds = [];
    }
    this.update({skippedBallotIds});
  }

}
