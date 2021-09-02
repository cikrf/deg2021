import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UniversalTokenService } from './universal-token.service';
import { interval, Observable, of } from 'rxjs';
import { AuthenticationType, CodeState } from '../pages/authentication/authentication.namespace';
import { transformTo } from '@cikrf/gas-utils/operators';
import { AUTH_ENDPOINTS } from '../constants';
import { catchError, first, map, mapTo, startWith, switchMap, take, tap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements CanActivate {

  constructor(
    private httpClient: HttpClient,
    private universalTokenService: UniversalTokenService,
  ) {}

  public requestCode(): Observable<CodeState> {
    return this.universalTokenService.authenticationType$.pipe(
      first(),
      switchMap((type: AuthenticationType) => {
        return this.httpClient.get([
          AUTH_ENDPOINTS.Verification,
          type.toLowerCase(),
        ].join('/'));
      }),
      transformTo(CodeState),
    );
  }

  public createTimer(state: CodeState): Observable<number> {
    return interval(1000).pipe(
      take(state.secondsToNextAttempt),
      map(i => state.secondsToNextAttempt - i - 1),
      startWith(state.secondsToNextAttempt),
    );
  }

  public sendCode(code: string): Observable<CodeState> {
    return this.httpClient.post<CodeState>([
      AUTH_ENDPOINTS.Verification,
      'code',
    ].join('/'), { code }).pipe(
      transformTo(CodeState),
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpClient.get(
      AUTH_ENDPOINTS.Verification,
      {
        headers: {
          skipCatchError: '',
        },
      },
    ).pipe(
      mapTo(true),
    );
  }

  // todo guard? universal-service?
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isAuthenticated().pipe(
      catchError(() => of(false)),
      tap((auth: boolean) => {
        if (!auth) {
          this.universalTokenService.gotoAuthentication(state.url);
        }
      }),
    );
  }
}
