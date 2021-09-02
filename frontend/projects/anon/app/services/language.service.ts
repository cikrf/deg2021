import { Injectable, Injector } from '@angular/core';
import { Language } from '@models/elections/language.model';
import { Ballot, Voting } from '@models/elections';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { BallotsStore } from '@state/ballots/ballots.store';
import { WindowService } from '@modules/browser-services/window.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { transformTo } from '@cikrf/gas-utils/operators';
import { NavigationService } from './navigation.service';
import { VotingService } from '@state/voting.service';

const LANGUAGE_LS_KEY = 'lang';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  constructor(
    private ballotsStore: BallotsStore,
    private ballotsQuery: BallotsQuery,
    private httpClient: HttpClient,
    private windowService: WindowService,
    private navigationService: NavigationService,
    private injector: Injector,
  ) {
  }

  public changeActiveBallotLanguage(lang: Language['code']): void {
    this.setLanguage(lang);
    const votingService = this.injector.get(VotingService);
    const activeBallot: Ballot = this.ballotsQuery.getActive();
    votingService.getBallot(
      activeBallot.contractId,
      lang,
    ).subscribe((ballot: Ballot) => {
      this.ballotsStore.replace(activeBallot.id, ballot);
      this.ballotsStore.setActive(activeBallot.id);
    });
  }

  public setLanguage(lang: Language['code']): void {
    this.windowService.window.localStorage.setItem(LANGUAGE_LS_KEY, lang.toString());
  }

  public getLanguage(): Language['code'] {
    return Number(this.windowService.window.localStorage.getItem(LANGUAGE_LS_KEY));
  }

}
