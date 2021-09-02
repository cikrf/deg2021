import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Answer, Ballot } from '@models/elections';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { isBallotValid } from '@shared/helpers/voting.helper';
import { VoteResponse } from '@models/transaction';

@Component({
  selector: 'app-confirm-single-question',
  templateUrl: './confirm-single-question.component.html',
  styleUrls: ['../confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmSingleQuestionComponent implements OnInit {
  @Input('skip')
  public isSkip = false;

  @Output('onReceipt')
  public onReceipt$: EventEmitter<VoteResponse> = new EventEmitter<VoteResponse>();

  public answers: Answer[] = [];
  public isError = false;

  public ballot: Ballot = this.ballotsQuery.getActive();

  constructor(
    private ballotsQuery: BallotsQuery,
  ) { }

  public ngOnInit(): void {
    this.answers = this.ballotsQuery.getSeletectedAnswers(this.ballot.questions[0].id);

    // this.isError = isBallotValid(this.answers.length, this.ballot.maxMarks);
  }
}
