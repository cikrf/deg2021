import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { Vote } from '@models/vote.interface';
import { Ballot, Voting } from '@models/elections';
import { VotingMeta } from '@models/voting';
import { BlockchainService } from '@modules/blockchain/blockchain.service';
import { catchError, distinctUntilChanged, map, mapTo, mergeAll, pluck, switchMap, tap, toArray } from 'rxjs/operators';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApiError } from '@shared/interceptor/api.error';
import { arrayTransformTo, transformTo } from '@cikrf/gas-utils/operators';
import { TimeService } from '@services/time.service';
import { BallotsStore } from '@state/ballots/ballots.store';
import { Language } from '@models/elections/language.model';
import { LanguageService } from '../services/language.service';
import { VoteResponse } from '@models/transaction';

const GLOBAL_API_PREFIX = '/api';
const VOTING_BOX_ENDPOINTS = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CanVote: `${GLOBAL_API_PREFIX}/vote/can-vote`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Vote: `${GLOBAL_API_PREFIX}/vote`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Ballots: `${GLOBAL_API_PREFIX}/ballot-models`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Ballot: `${GLOBAL_API_PREFIX}/ballot-model`,
});


@Injectable({
  providedIn: 'root',
})
export class VotingService {

  private votingMetaMap = new Map<Ballot['contractId'], VotingMeta>();

  constructor(
    private blockchainService: BlockchainService,
    private ballotsQuery: BallotsQuery,
    private ballotsStore: BallotsStore,
    private httpClient: HttpClient,
    private timeService: TimeService,
    private languageService: LanguageService,
  ) {
    this.ballotsQuery.selectActive().pipe(
      distinctUntilChanged((ballotOne: Ballot, ballotTwo: Ballot) => {
        return ballotOne?.id === ballotTwo?.id;
      }),
      switchMap((ballot: Ballot) => {
        if (!ballot) {
          return of(true);
        }
        return this.canBallotVote(ballot);
      }),
    ).subscribe((canVote: boolean) => {
      if (!canVote) {
        this.ballotsStore.updateActive({ completed: true });
      }
    });
  }

  public setMetas(metas: VotingMeta[]): void {
    metas.forEach((meta: VotingMeta) => this.votingMetaMap.set(meta.contractId, meta));
  }

  public vote(id: Ballot['contractId'], vote: Vote[]): Observable<VoteResponse> {
    const meta: VotingMeta | undefined = this.votingMetaMap.get(id);
    if (!meta) {
      throw new Error('Cannot find meta for vote');
    }

    return this.timeService.getTime().pipe(
      switchMap((time: number) => this.blockchainService.createTransaction(
        meta.seed,
        meta.contractId,
        vote,
        meta.signature,
        meta.mainKey,
        this.ballotsQuery.getActive().maxMarks, // todo how to fix? add to meta?
        time,
      ).pipe(
        switchMap(tx => this.httpClient.post(VOTING_BOX_ENDPOINTS.Vote, {
          ... tx,
          signature: meta.signature,
        })),
        transformTo(VoteResponse),
      )),
    );
  }

  public checkBallot(votingMetas: VotingMeta[]): Observable<VotingMeta[]> {
    return forkJoin(
      votingMetas.map((meta: VotingMeta) => {
        return this.canVote(meta.contractId, meta.seed.publicKey)
          .pipe(
            map((canVote: boolean) => {
              meta.ballot.completed = !canVote;
              return meta;
            }),
          );
      }),
    );
  }

  public canBallotVote(ballot: Ballot): Observable<boolean> {
    const meta: VotingMeta | undefined = this.votingMetaMap.get(ballot.contractId);
    if (!meta) {
      throw new Error('Cannot find meta for vote');
    }

    return this.canVote(
      meta.contractId,
      meta.seed.publicKey,
    );
  }

  public getBallot(
    contractId: Voting['contractId'],
    lang: Language['code'] = this.languageService.getLanguage(),
  ): Observable<Ballot> {
    const params = new HttpParams()
      .append('contractId', contractId)
      .append('lang', lang.toString());
    return this.httpClient.get<{ballot: Ballot; languages: Language[]}>(VOTING_BOX_ENDPOINTS.Ballot, {params}).pipe(
      map((dto: {ballot: Ballot; languages: Language[]}) => {
        return {
          ... dto.ballot,
          languages: dto.languages,
        };
      }),
      transformTo(Ballot),
    );
  }

  public getBallots(contractIds: Voting['contractId'][]): Observable<Ballot[]> {
    const params = new HttpParams().append('contractIds', contractIds.join(','));
    return this.httpClient.get<{ballot: Ballot; languages: Language[]}[]>(VOTING_BOX_ENDPOINTS.Ballots, {params}).pipe(
      mergeAll(),
      map((dto: {ballot: Ballot; languages: Language[]}) => {
        return {
          ... dto.ballot,
          languages: dto.languages,
        };
      }),
      toArray(),
      arrayTransformTo(Ballot),
    );
  }

  private canVote(contractId: string, publicKey: string): Observable<boolean> {
    const params = new HttpParams()
      .append('contractId', contractId)
      .append('senderPublicKey', publicKey);

    return this.httpClient.get<boolean>(VOTING_BOX_ENDPOINTS.CanVote, {params})
      .pipe(
        catchError((error: ApiError) => {
          if (error.response instanceof HttpResponse && error.response.body.error?.code === 71) {
            return throwError(error);
          }
          console.warn(error.message);
          return of(false);
        }),
      );
  }
}
