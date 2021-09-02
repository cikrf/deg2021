import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElectionList, Voting } from '@models/elections';
import { forkJoin, Observable, of } from 'rxjs';

import { arrayTransformTo } from '@cikrf/gas-utils/operators';
import { REGISTRY_ENDPOINTS } from '../../constants';
import { map, mapTo } from 'rxjs/operators';
import { AuthenticationType } from '../authentication/authentication.namespace';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(
    private httpClient: HttpClient,
  ) {}

  public getElections(): Observable<ElectionList[]> {
    return this.httpClient.get(REGISTRY_ENDPOINTS.Elections).pipe(
      arrayTransformTo(ElectionList),
      map((electionLists: ElectionList[]) => {
        return electionLists.map((electionList: ElectionList) => {
          electionList.votings = electionList.votings.filter((v) => v.hasActiveVotingRight );
          return electionList;
        });
      }),
    );
  }

  public getAuthenticationType(): Observable<AuthenticationType> {
    return this.httpClient.get<AuthenticationType>(REGISTRY_ENDPOINTS.VerificationType);
  }

}
