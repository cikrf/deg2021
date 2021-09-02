import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeAll,
  pluck,
  repeatWhen,
  shareReplay,
  takeUntil,
  toArray,
} from 'rxjs/operators';
import { ElectionService } from '../election.service';
import { ElectionList, Voting, VotingStatus } from '@models/elections';
import { AppRoutingEnum } from '../../../app-routing.enum';
import { HeaderService } from '@services/header.service';
import { CheckupService } from '@services/checkup.service';
import { WindowService } from '@modules/browser-services/window.service';
import { GasNotationPipe } from '@cikrf/gas-utils/pipes';
import { LocalBallotService } from '../../../services/local-ballot.service';
import { TimeService } from '@services/time.service';
import { NgOnDestroy } from '@cikrf/gas-utils/decorators';
import { UiIcon } from '@ui/components/ui-icons/ui-icons.namespace';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionsComponent {

  @NgOnDestroy()
  public destroy$!: Observable<void>;

  public uiIconStuff = UiIcon.Stuff;
  public isShowBallot$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = new BehaviorSubject<boolean>(true);
  public isError$ = new BehaviorSubject<boolean>(false);
  public repeat$ = new Subject();
  public disabled$ = new BehaviorSubject(false);
  public electionList$: Observable<ElectionList[]> = this.electionService.getElections().pipe(
    takeUntil(this.destroy$),
    repeatWhen(() => this.repeat$),
    map((electionList: ElectionList[]) => {
      this.isLoading$.next(false);
      this.headerService.setLoading(false);
      this.setTitle(electionList);
      return electionList;
    }),
    shareReplay(),
    catchError((error: unknown) => {
      this.isLoading$.next(false);
      this.headerService.setLoading(false);
      this.isError$.next(true);
      return throwError(error);
    }),
  );

  public currentTime$: Observable<number> = this.timeService.actualTime$;

  public actualElections$: Observable<ElectionList[]> = combineLatest([
    this.electionList$,
    this.currentTime$,
  ]).pipe(
    map(([elections, currentTime]: [ElectionList[], number]) => {
      return elections.filter(election => {
        // todo этого костыля быть не должно, мы должны проверять только статусы. будет задача
        return election.startDateTime.getTime() < currentTime && currentTime < election.endDateTime.getTime();
      });
    }),
    distinctUntilChanged((a: ElectionList[], b: ElectionList[]) => {
      const arrayA = a.map(({ id }) => id);
      const arrayB = b.map(({ id }) => id);
      if (arrayA.length === arrayB.length) {
        return arrayA.every(itemA => arrayB.includes(itemA));
      }
      return false;
    }),
  );

  public actualVotings$: Observable<Voting[]> = this.actualElections$.pipe(
    map((elections: ElectionList[]) => {
      return this.getActualVotings(elections);
    }),
  );

  constructor(
    private electionService: ElectionService,
    private headerService: HeaderService,
    private router: Router,
    private checkupService: CheckupService,
    private windowService: WindowService,
    private gasNotationPipe: GasNotationPipe,
    private localBallotService: LocalBallotService,
    private activatedRoute: ActivatedRoute,
    private timeService: TimeService,
  ) {
    this.checkupService.result().subscribe(
      (isAvailable: boolean) => {
        if (!isAvailable) {
          setTimeout(() => this.router.navigate(
            [AppRoutingEnum.Error, 'checkup'],
            { skipLocationChange: true },
          ).then());
        }
      },
    );
    this.headerService.setLoading(true);
    this.isLoading$.next(true);
    this.destroy$.subscribe(() => {
      this.headerService.setMetadata({ title: '' });
    });
  }

  public vote(): void {
    this.actualVotings$.pipe(
      first(),
      mergeAll(),
      pluck('id'),
      toArray(),
      filter((votingIds: Voting['id'][]) => votingIds.length > 0),
      map((votingIds: Voting['id'][]) => votingIds.join(',')),
    ).subscribe((votingIds: string) => {
      /** Редирект на страницу генерации ключа */
      this.router.navigate([AppRoutingEnum.KeyGeneration],
        {
          queryParams: {
            votingIds,
          },
        }).then();
    });
  }

  public up(): void {
    this.windowService.scrollToTop();
  }

  public canVote(voting: Voting): boolean {
    if (![VotingStatus.InProgress, VotingStatus.BallotIssuingCompleted].includes(voting.status)) {
      return false;
    }
    if (voting.status === VotingStatus.BallotIssuingCompleted && !voting.ballotIssued) {
      return false;
    }
    return voting.ballotIssued ? this.localBallotService.has(voting.id) : true;
  }

  private getActualVotings(electionLists: ElectionList[]): Voting[] {
    return electionLists.map((electionList: ElectionList) => {
      return electionList.votings;
    }).reduce((acc, next: Voting[]) => {
      acc.push(... next.filter((voting) => {
        return this.canVote(voting);
      }));
      return acc;
    }, [] as Voting[]);
  }

  private setTitle(electionLists: ElectionList[]): void {
    const allCount = electionLists.reduce((acc, next) => {
      acc.push(...next.votings);
      return acc;
    }, [] as Voting[]).length;
    const title = `${allCount} ${this.gasNotationPipe.transform(allCount, ['бюллетень', 'бюллетеня', 'бюллетеней'])}`;

    this.headerService.setMetadata({
      title,
      isShow: electionLists.length > 0,
    });
  }

}
