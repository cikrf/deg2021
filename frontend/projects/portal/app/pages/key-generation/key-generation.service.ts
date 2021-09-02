import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { BlindSignPublicKey } from '@models/voting';
import { Ballot, Voting } from '@models/elections';
import { REGISTRY_ENDPOINTS } from '../../constants';
import { BlindSign } from '@models/voting/blind-sign.model';
import { mapTo, switchMap } from 'rxjs/operators';
import { BlindSignRequest } from './key-generation.interfaces';
import { arrayTransformTo } from '@cikrf/gas-utils/operators';
import { Portal } from '../../portal.namespace';

@Injectable()
export class KeyGenerationService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  public getPublicKeys(votingIds: Voting['id'][]): Observable<BlindSignPublicKey[]> {
    const params = new HttpParams().append('votingIds', votingIds.join(','));

    return this.httpClient.get(REGISTRY_ENDPOINTS.PublicKeys, {params}).pipe(
      arrayTransformTo(BlindSignPublicKey),
    );
  }

  /**
   * todo отдельная кнопка?
   * используется в getBlindSign, но тут, по идее, надо удалить
   *
   * @deprecated
   */
  public cleanUpBlindSigns(votingIds: Voting['id'][]): Observable<void> {
    return forkJoin(
      votingIds.map(
        (votingId: string) => this.httpClient.delete(REGISTRY_ENDPOINTS.CleanUpBlindSign + votingId),
      ),
    ).pipe(mapTo(undefined));
  }

  public getBlindSign(requests: BlindSignRequest[]): Observable<BlindSign[]> {
    return this.httpClient.post(REGISTRY_ENDPOINTS.BlindSign, {
      votings: requests.map((request) => ({
        passphrase: request.passphrase,
        voterPublicKey: request.maskedPublicKey,
        votingId: request.votingId,
      })),
    }).pipe(
      arrayTransformTo(BlindSign),
    );
  }
}
