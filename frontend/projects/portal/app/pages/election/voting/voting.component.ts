import { ElectionState } from '../election-state.enum';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { NgOnInit } from '@cikrf/gas-utils/decorators';
import { GasNotationPipe } from '@cikrf/gas-utils/pipes';

import { LocalBallotService } from 'projects/portal/app/services/local-ballot.service';
import { ElectionList, Voting, VotingStatus } from '@models/elections';
import { Router } from '@angular/router';
import { addMillisecondsToTime } from '@helpers/voting.helper';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingComponent {
  @Output('onWrongDevice')
  public onWrongDevice$ = new EventEmitter<void>();

  @NgOnInit()
  public onInit$!: Observable<void>;

  @Input()
  public election!: ElectionList;

  /*@Input()
  public stopTime = 0;*/

  public showCleanup = window.ENV.SHOW_CLEANUP || false;

  public footerCardText$: Observable<string> = this.onInit$.pipe(
    switchMap(() => of(this.election)),
    map((election: ElectionList) => election?.votings),
    map((votings: Voting[]) => {
      const count = votings.length;
      const ballotsNotation = `${count} ${this.gasNotationPipe.transform(count, ['бюллетень', 'бюллетеня', 'бюллетеней'])}`;
      let accessNotation = '';

      if (votings.every((voting: Voting) => voting.ballotIssued)) {
        accessNotation = `${this.gasNotationPipe.transform(count, ['Выдан', 'Выдано', 'Выдано'])}`;
      } else {
        accessNotation = '';
      }

      return `${accessNotation} ${ballotsNotation}`;
    }),
    shareReplay(1),
  );

  public electionState$: Observable<string> = this.onInit$.pipe(
    switchMap(() => of(this.election)),
    map((election: ElectionList) => election?.votings),
    map((votings: Voting[]) => {
      if (votings.every((voting: Voting) => voting.ballotIssued)) {
        if (votings.every((voting: Voting) => this.issuedThisDevice(voting))) {
          return ElectionState.Issued;
        } else {
          this.onWrongDevice$.emit();
          return ElectionState.IssuedNotThisDevice;
        }
      }
      return ElectionState.NotIssued;
    }),
    shareReplay(1),
  );

  public endTimeWithTimeout$ = this.electionState$.pipe(
    filter(state => state === ElectionState.Issued),
    map(() => addMillisecondsToTime(this.election.endDateTime, this.election.ballotAcceptanceTimeout)),
  );

  //eslint-disable-next-line
  public ElectionState = ElectionState;

  constructor(
    private localBallotService: LocalBallotService,
    private gasNotationPipe: GasNotationPipe,
    private router: Router,
  ) {
  }

  /**
   * проверка, что бюллетень выдана на конкретном устройстве
   * true - выдана на данном устройстве
   * false - выдана, но пользователь зашел с другого устройства
   */
  public issuedThisDevice(voting: Voting): boolean {
    return voting.ballotIssued && this.localBallotService.has(voting.id);
  }

  /**
   * @deprecated
   */
  public cleanup(): void {
    this.localBallotService.cleanUpBlindSigns(
      this.election.votings.map(v => v.id),
    ).subscribe(() => {
      window.location.reload();
    });
  }

  public isAllVotingsStarted(): boolean {
    const votingsNotInProgress = this.election.votings.find(voting => voting.status !== VotingStatus.InProgress);
    return !votingsNotInProgress;
  }

}
