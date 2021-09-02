import { ChangeDetectionStrategy, Component, ErrorHandler, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { BallotsQuery } from '@state/ballots/ballots.query';
import { BallotsStore } from '@state/ballots/ballots.store';
import { VotingService } from '@state/voting.service';
import { AnswersStore } from '@state/answers/answers.store';

import { UiButton } from '@ui/components/ui-button/button.enum';
import { NavigationService } from '../../../../../services/navigation.service';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';
import { ApiError } from '@shared/interceptor/api.error';
import { VoteResponse } from '@models/transaction';

@Component({
  selector: 'app-confirm-controls',
  templateUrl: './confirm-controls.component.html',
  styleUrls: ['../confirm.component.scss', './confirm-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmControlsComponent {
  @Input('error')
  public isError = false;

  @Input('skip')
  public isSkip = false;

  @Output('onReceipt')
  public onReceipt$: EventEmitter<VoteResponse> = new EventEmitter<VoteResponse>();

  public control = new FormControl(false);
  public loading$: ToggleSubject = new ToggleSubject(false);

  // TODO: сделать корректный тип ui-button
  public get confirmButtonType(): UiButton.ButtonView {
    return this.isSelectedLessThanPossible ? 'outline' : null;
  }

  public get backButtonType(): UiButton.ButtonView {
    return this.isSelectedLessThanPossible && !this.isSkip ? null : 'outline';
  }

  public get activeButtonText(): string {
    if (this.isSkip) {
      return 'Вернуться к бюллетеню';
    }

    return this.isError
      ? 'Подтвердить действие'
      : 'Подтвердить выбор';
  }

  public get backButtonText(): string {
    return this.isSkip
      ? 'Следующий бюллетень'
      : 'Изменить выбор';
  }

  private isSelectedLessThanPossible: boolean = this.ballotsQuery.getSeletectedAnswers()[0].length < this.ballotsQuery.getActive().maxMarks;

  constructor(
    private ballotsStore: BallotsStore,
    private ballotsQuery: BallotsQuery,
    private votingService: VotingService,
    private navigationService: NavigationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private answersStore: AnswersStore,
    private errorHandler: ErrorHandler,
  ) {
  }

  public vote(): void {
    if (this.isError && !this.control.value && this.loading$.value) {
      return;
    }

    this.loading$.toggle();

    const ballot = this.ballotsQuery.getActive();
    this.ballotsStore.cleanUpSkippedBallots(ballot.id);
    this.votingService.vote(
      ballot.contractId,
      this.ballotsQuery.getActiveVotes(),
    ).subscribe((voteResponse: VoteResponse) => {
      this.onReceipt$.next(voteResponse);
      this.ballotsStore.updateActive({
        completed: true,
        receipt: voteResponse,
      });
      this.loading$.toggle();
      this.gotoComplete();
    }, (error: ApiError) => {
      if (error.response instanceof HttpResponse && error.response?.body?.error?.code) {
        const code = String(error.response?.body?.error?.code);
        setTimeout(() => {
          this.router.navigate(['error'], {
            relativeTo: this.activatedRoute.parent,
            queryParams: { error: code, showDesc: true },
          }).then();
        });
        return;
      }

      this.errorHandler.handleError(error);

      setTimeout(() => {
        this.router.navigate(['error'], {
          relativeTo: this.activatedRoute.parent,
        }).then();
      });
    });
  }

  public skip(): void {
    this.ballotsStore.skipBallot();

    /** Фейк обновление, чтоб вызвать обработку выбранного элемента и перейти на "успех" */
    this.ballotsStore.updateActive({ completed: false });
    this.gotoComplete(true);
  }

  public gotoComplete(skip: boolean = false, voteResponse?: VoteResponse): void {
    if (skip) {
      return this.navigationService.goToNextBallot();
    }

    setTimeout(() => {
      this.router.navigate(['complete'], {
        queryParams: { skip },
        relativeTo: this.activatedRoute.parent,
      }).then();
    });
  }

  public goBack(): void {
    if (this.isSkip) {
      this.answersStore.setActive([]);
    }

    this.navigationService.goToCurrentBallot();
  }

  public isDisabled(): boolean {
    return !this.isSkip && this.isError && !this.control.value;
  }
}
