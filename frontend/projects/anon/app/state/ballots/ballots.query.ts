import { QueryConfig, QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { SortBy } from '@datorama/akita/src/queryConfig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BallotsState, BallotsStore } from '@state/ballots/ballots.store';
import { Vote } from '@models/vote.interface';
import { createEmptyVote } from '../../helpers/voting.helper';
import { Answer, Ballot, Question } from '@models/elections';

@Injectable({
  providedIn: 'root',
})
@QueryConfig({
  sortBy: '-completed',
})
export class BallotsQuery extends QueryEntity<BallotsState> {

  public uncompleted$: Observable<Ballot | undefined> = this.selectAll().pipe(
    map(() => this.getUncompleted()),
  );

  public uncompletedWithoutSkipped$: Observable<Ballot | undefined> = this.selectAll().pipe(
    map(() => this.getUncompletedWithoutSkipped()),
  );

  public completedBallots$: Observable<Ballot[]> = this.selectAll().pipe(
    map(() => this.getCompleted()),
  );

  constructor(protected store: BallotsStore) {
    super(store);
  }

  public getUncompleted(exclude?: Ballot['id']): Ballot | undefined {
    const { skippedBallotIds } = this.getValue();
    // проверяем что по бюллетене еще не проголосовали и избиратель ее не пропустил
    return this.getAll().find(({id, completed}) => !completed && !skippedBallotIds.includes(id) && id !== exclude);
  }

  public getUncompletedWithoutSkipped(): Ballot | undefined {
    return this.getAll().find(({id, completed}) => !completed);
  }

  public getCompleted(): Ballot[] {
    return this.getAll().filter((ballot: Ballot) => ballot.completed);
  }

  public getSkippedBallots(): Ballot[] {
    return this.getAll().filter((ballot: Ballot) => this.getValue().skippedBallotIds.includes(ballot.id));
  }

  public getActiveVotes(): Vote[] {
    const { votes } = this.getValue();
    const activeBallot = this.getActive();
    const ballotVotes = votes.get(activeBallot.id) || new Map<Question['id'], Vote>();
    if (ballotVotes.size) {
      return activeBallot.questions.map((question: Question) =>
        ballotVotes.get(question.id) || createEmptyVote(question.answers.length),
      );
    } else {
      return activeBallot.questions.map((question: Question) => createEmptyVote(question.answers.length));
    }
  }

  public getSeletectedAnswers(): Answer[][]
  public getSeletectedAnswers(questionId: Question['id']): Answer[]
  public getSeletectedAnswers(questionId?: Question['id']): Answer[][] | Answer[] {
    const votes = this.getActiveVotes();
    const activeBallot = this.getActive();
    if (questionId) {
      const questionIndex = activeBallot.questions.findIndex((question) => question.id === questionId);
      if (questionIndex !== undefined && votes[questionIndex]) {
        return this.getQuestionAnswers(activeBallot.questions[questionIndex], votes[questionIndex]);
      } else {
        return [];
      }
    } else {
      return activeBallot.questions.map((question, questionIndex) => {
        const vote = votes[questionIndex] || [];
        return this.getQuestionAnswers(question, vote);
      });
    }
  }

  private getQuestionAnswers(question: Question, vote: Vote): Answer[] {
    return question.answers.filter((answer, answerIndex) => vote[answerIndex] === 1);
  }

}
