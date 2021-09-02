import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Answer, Ballot, Question } from '@models/elections';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { isBallotValid } from '@shared/helpers/voting.helper';
import { Confirm } from '../confirm.namespace';
import { VoteResponse } from '@models/transaction';

@Component({
  selector: 'app-confirm-multi-questions',
  templateUrl: './confirm-multi-questions.component.html',
  styleUrls: ['../confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmMultiQuestionsComponent implements OnInit {

  @Output('onReceipt')
  public onReceipt$: EventEmitter<VoteResponse> = new EventEmitter<VoteResponse>();

  public answers: Answer[] = [];
  public isError = false;
  public ballot: Ballot = this.ballotsQuery.getActive();
  public questions: Question[] = this.ballot.questions;
  public checkedAnswersMap: Map<Confirm.QuestionId, Confirm.Answers> = new Map<Confirm.QuestionId, Confirm.Answers>();

  constructor(
    private ballotsQuery: BallotsQuery,
  ) {}

  public ngOnInit(): void {
    this.questions.forEach(question => {
      this.checkedAnswersMap.set(question.id, this.getAnswers(question.id));
    });

    this.isError = this.isErrorBallot();
  }

  private getAnswers(id: string): Answer[] {
    const answers: Answer[] = this.ballotsQuery.getSeletectedAnswers(id);

    this.answers.push(...answers);

    return answers;
  }

  private isErrorBallot(): boolean {
    let isError = false;

    this.checkedAnswersMap.forEach((answers: Answer[]) => {
      if (isBallotValid(answers.length, this.ballot?.maxMarks)) {
        isError = true;
      }
    });

    return isError;
  }
}
