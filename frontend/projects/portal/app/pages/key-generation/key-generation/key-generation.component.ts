import { ChangeDetectionStrategy, Component, ErrorHandler } from '@angular/core';
import {
  catchError,
  delay,
  finalize,
  groupBy,
  map,
  mergeAll,
  mergeMap,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { Voting } from '@models/elections';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';
import { TbaPrivate, TbaPublic } from '@models/elections/tba.model';
import { LocalBallotService } from 'projects/portal/app/services/local-ballot.service';
import { VotingBlindSignatureService } from '../voting-blind-signature.service';
import { Portal } from '../../../portal.namespace';
import VotingPackage = Portal.VotingPackage;
import { UiA11yService } from '@ui/modules/ui-a11y/ui-a11y.service';
import { TransferBetweenAppsService } from '@modules/transfer-between-apps/transfer-between-apps.service';

// todo: вынести в authService когда он будет
export interface Token {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  scope: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'urn:esia:sbj_id': number;
  'urn:esia:sid': string;
}

@Component({
  selector: 'app-key-generation',
  templateUrl: './key-generation.component.html',
  styleUrls: ['./key-generation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    VotingBlindSignatureService,
  ],
})
export class KeyGenerationComponent {

  public loading$ = new ToggleSubject(true);

  public isError$ = new ToggleSubject(false);

  public isGeneration$ = new ToggleSubject(false);

  public tbaPrivate: TbaPrivate;

  public tbaPublic: TbaPublic;

  public transferDataSubject$ = new BehaviorSubject<string[]>([]);

  private votingIds: Voting['id'][] = this.activatedRoute.snapshot.queryParams['votingIds'].split(',') as Voting['id'][];

  private votingPackages$: Observable<VotingPackage[]> = of(this.votingIds).pipe(
    mergeAll(),
    groupBy((votingId: Voting['id']) => this.localBallotService.has(votingId)),

    mergeMap(group$ => group$.pipe(
      toArray(),
      switchMap((votingIds: Voting['id'][]) => {
        if (group$.key === true) {
          return this.localBallotService.getForAll(votingIds);
        }

        this.isGeneration$.set(true);
        return this.votingBlindSignatureService.getForAll(votingIds);
      }),
    )),
    mergeAll(),
    toArray(),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private errorHandler: ErrorHandler,
    private localBallotService: LocalBallotService,
    private votingBlindSignatureService: VotingBlindSignatureService,
    private uiA11yService: UiA11yService,
    private transferBetweenAppsService: TransferBetweenAppsService<TbaPrivate, TbaPublic>,
  ) {
    forkJoin([
      of(null).pipe(delay(3000)), // todo это нужно чтобы было видно лоадер, возможность прочитать
      this.votingPackages$,
    ]).pipe(
      map(([e, packages]: [null, VotingPackage[]]) => packages),
      catchError((error: Error) => {
        this.isError$.toggle();

        return throwError(error);
      }),
      tap((packs: VotingPackage[]) => {
        packs.forEach((pack) => {
          this.localBallotService.set(pack);

          /** Делаем запрос по конкретному контракту, не должно быть лишних */
          // const ballot: Ballot | undefined = ballots.find((b: Ballot) => b.votingId === pack.votingId);
          if (pack.ballots && pack.ballots[0]) {
            pack.ballot = pack.ballots[0];
          }
        });
        this.tbaPrivate = new TbaPrivate({
          items: packs.map(
            pack => ({
              seed: pack.seed,
              votingId: pack.votingId,
              signature: pack.signature,
            }),
          ),
        });
        this.tbaPublic = new TbaPublic({
          items: packs.map(
            pack => ({
              ballot: pack.ballot,
              mainKey: pack.mainKey,
              contractId: pack.contractId,
              votingId: pack.votingId,
            }),
          ),
          order: this.votingIds,
          a11ySettings: this.uiA11yService.getSettings(),
        });
      }),
      switchMap(() => this.transferBetweenAppsService.createRequestData(this.tbaPrivate, this.tbaPublic)),
      tap((transferData: string[]) => {
        this.transferDataSubject$.next(transferData);
      }),
      finalize(() => {
        this.loading$.set(false);
      }),
    ).subscribe(
      () => {},
      (error: Error) => this.errorHandler.handleError(error),
    );
  }
}
