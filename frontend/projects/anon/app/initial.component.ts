import { ChangeDetectionStrategy, Component, ErrorHandler, Inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import {
  filter,
  first,
  map,
  mergeAll,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs/operators';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { BallotsStore } from '@state/ballots/ballots.store';
import { TransferBetweenAppsService } from '@modules/transfer-between-apps/transfer-between-apps.service';
import { TbaPrivate, TbaPrivateItem, TbaPublic, TbaPublicItem } from '@models/elections/tba.model';
import { HeaderService } from '@services/header.service';
import { NavigationService } from './services/navigation.service';
import { VotingService } from '@state/voting.service';
import { arrayTransformTo, transformTo } from '@cikrf/gas-utils/operators';
import { VotingMeta } from '@models/voting';
import { Ballot } from '@models/elections';
import { ApiError } from '@shared/interceptor/api.error';
import { HttpResponse } from '@angular/common/http';
import { APP_IS_PLATFORM_BROWSER } from '@shared/providers/is-platform';
import { Router } from '@angular/router';
import { UiA11yService } from '@ui/modules/ui-a11y/ui-a11y.service';

export class EmptyDataError extends Error {
  constructor() {
    super('Some data is empty');
  }
}

@Component({
  template: '<ui-image-preloader aria-live="assertive" title="Загрузка"></ui-image-preloader>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitialComponent {

  public loading$: Observable<boolean> = this.ballotsQuery.selectLoading()
    .pipe(
      startWith(true),
    );

  private extra$: Observable<TbaPublic> = this.transferBetweenAppsService.extractExtra().pipe(
    map(current => current || new TbaPublic({items: []})),
    transformTo(TbaPublic),
    shareReplay(),
  );

  private payload$: Observable<TbaPrivate> = this.transferBetweenAppsService.extractPayload().pipe(
    map(current => current || new TbaPrivate({items: []})),
    transformTo(TbaPrivate),
    shareReplay(),
  );

  private votingMetas$: Observable<VotingMeta[]> = combineLatest([
    this.extra$.pipe(pluck('items')),
    this.payload$.pipe(pluck('items')),
  ]).pipe(
    map(([publicItems, privateItems]: [TbaPublicItem[], TbaPrivateItem[]]) => {
      if (!((publicItems && publicItems.length) && (privateItems && privateItems.length))) {
        throw new EmptyDataError();
      }
      const publicItemsMap: {[k: string]: TbaPublicItem} = publicItems.reduce((acc, item) => ({... acc, [item.votingId]: item}), {});
      return privateItems.reduce((acc: [TbaPrivateItem, TbaPublicItem][], privateItem: TbaPrivateItem) => {
        const publicItem: TbaPublicItem | undefined = publicItemsMap[privateItem.votingId];
        if (!publicItem) {
          throw new EmptyDataError();
        }
        acc.push([privateItem, publicItem]);
        return acc;
      }, [] as [TbaPrivateItem, TbaPublicItem][]);
    }),
    mergeAll(),
    map(([privateItem, publicItem]: [TbaPrivateItem, TbaPublicItem]) => new VotingMeta({
      mainKey: publicItem.mainKey,
      contractId: publicItem.contractId,
      signature: privateItem.signature,
      seed: privateItem.seed,
      votingId: privateItem.votingId,
    })),
    toArray(),
    arrayTransformTo(VotingMeta),
    switchMap((votingMetas: VotingMeta[]) => {
      const metasByVotingId: Record<VotingMeta['votingId'], VotingMeta> = votingMetas.reduce((
        acc: Record<VotingMeta['votingId'], VotingMeta>,
        meta: VotingMeta,
      ) => {
        return {
          ...acc,
          [meta.votingId]: meta,
        };
      }, {} as Record<VotingMeta['votingId'], VotingMeta>);
      return this.votingService.getBallots(votingMetas.map(m => m.contractId)).pipe(
        map((ballots: Ballot[]) => {
          ballots.forEach((ballot: Ballot) => {
            ballot.contractId = metasByVotingId[ballot.votingId].contractId;
            metasByVotingId[ballot.votingId].ballot = ballot;
          });
          return Object.values(metasByVotingId).filter(m => !!m.ballot);
        }),
      );
    }),
    switchMap((votingMetas: VotingMeta[]) => this.votingService.checkBallot(votingMetas)),
    tap((metas: VotingMeta[]) => this.votingService.setMetas(metas)),
  );

  // todo надо посмотреть как удобнее сделать моки и заменить true на environment.production
  private ballots$: Observable<Ballot[]> = this.votingMetas$.pipe(
    mergeAll(),
    pluck('ballot'),
    toArray(),
    arrayTransformTo(Ballot),
    withLatestFrom(this.extra$),
    map(([ballots, extra]: [Ballot[], TbaPublic]) =>
      (extra.order || [])
        .map(id => ballots.find(b => b.votingId === id))
        .filter(Boolean) as Ballot[],
    ),
  );

  constructor(
    private ballotsQuery: BallotsQuery,
    private ballotsStore: BallotsStore,
    private transferBetweenAppsService: TransferBetweenAppsService<TbaPrivate, TbaPublic>,
    private headerService: HeaderService,
    private navigationService: NavigationService,
    private votingService: VotingService,
    private router: Router,
    private a11yService: UiA11yService,
    private errorHandler: ErrorHandler,
    @Inject(APP_IS_PLATFORM_BROWSER) private isPlatformBrowser: boolean,
  ) {
    this.headerService.setLoading(true);
    this.ballotsStore.reset();

    if (this.isPlatformBrowser) {

      this.extra$.pipe(
        pluck('a11ySettings'),
        filter(Boolean),
      ).subscribe((a11ySettings: string) => {
        this.a11yService.setSettings(a11ySettings);
      });

      /** TODO: Спрятать данные реализации */
      this.ballots$.subscribe(
        (ballots: Ballot[]) => {
          if (!ballots.length) {
            return this.transferBetweenAppsService.transfer();
          }

          this.loading$.pipe(
            filter(loading => !loading),
            first(),
          ).subscribe(() => {
            this.headerService.setLoading(false);

            if (this.navigationService.getNextBallotId()) {
              this.navigationService.goToNextBallot();
            } else {
              this.navigationService.goToNextBallot(ballots[ballots.length - 1].id, 'complete');
            }

          });

          this.ballotsStore.set(ballots);
        }, (error: ApiError | EmptyDataError) => {
          this.errorHandler.handleError(error);
          if (error instanceof HttpResponse && (error.status >= 500 || error.status === 0)) {
            this.router.navigate(['/', 'error'], {
              queryParams: {returnUrl: '/'},
              skipLocationChange: true,
              state: error,
            }).then();
            return;
          }
          if (error instanceof EmptyDataError) {
            return this.transferBetweenAppsService.transfer();
          }
          if (error.response instanceof HttpResponse && error.response.body.error?.code) {
            this.navigationService.goToNextBallot(undefined, 'error', String(error.response.body.error?.code));
          } else {
            this.navigationService.goToNextBallot(undefined, 'error');
          }
        });
    }
  }
}
