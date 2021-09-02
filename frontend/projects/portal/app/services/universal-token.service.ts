import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationEnd, NavigationError,
  Router, RouterEvent,
  RouterStateSnapshot,
} from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { RETURN_URL_QUERY_KEY, TOKEN_KEY } from '../constants';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { AppRoutingEnum } from '../app-routing.enum';
import { HttpStatus } from '@cikrf/gas-utils/enums';
import { BlacklistService } from './blacklist.service';
import { ElectionService } from '../pages/election/election.service';
import { AuthenticationType } from '../pages/authentication/authentication.namespace';

@Injectable({providedIn: 'root'})
export class UniversalTokenService implements CanActivate, HttpInterceptor {

  private tokenSubject$ = new BehaviorSubject<string | null>(window.localStorage.getItem(TOKEN_KEY));

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public token$ = this.tokenSubject$.pipe(
    distinctUntilChanged(),
  );

  public authenticationType$: Observable<AuthenticationType> = this.token$.pipe(
    switchMap(() => this.electionService.getAuthenticationType()),
    shareReplay(),
  );

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private router: Router,
    private route: ActivatedRoute,
    private blacklistService: BlacklistService,
    private electionService: ElectionService,
  ) { }

  public updateToken(token: string | null) {
    window.localStorage.setItem(TOKEN_KEY, token as string);
    this.tokenSubject$.next(token);
  }

  public clearToken(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    this.tokenSubject$.next(null);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.token$.pipe(
      first(),
      switchMap((token: string | null) => {
        if (req.headers?.has('skipAppendToken')) {
          return next.handle(req);
        }
        if (!token) {
          return next.handle(req);
        }
        return next.handle(req.clone({
          headers: req.headers.append('Authorization', ['Bearer', token].join(' ')),
        })).pipe(
          catchError((err) => {
            const response: HttpResponse<unknown> = err instanceof HttpErrorResponse ? err : err.response;
            //skipCatchError - данный хедер нужен что бы не отправлять пользователя на авторизацию и вернуть response в ошибке
            if (req.headers?.has('skipCatchError')) {
              return throwError(response);
            }
            if (response.status === HttpStatus.UNAUTHORIZED) {
              this.gotoAuthorization(this.router.url);
              return of({
                type: HttpEventType.User,
              } as HttpUserEvent<unknown>);
            }
            if (response.status === HttpStatus.FORBIDDEN) {
              this.gotoAuthentication(this.router.url);
              return of({
                type: HttpEventType.User,
              } as HttpUserEvent<unknown>);
            }
            return throwError(err);
          }),
        );
      }),
    );
  }

  public gotoAuthorization(returnUrl: string): void {
    this.clearToken();
    setTimeout(() => {
      this.router.navigate(['/', AppRoutingEnum.Auth], {
        queryParams: {[RETURN_URL_QUERY_KEY]: returnUrl},
      }).then();
    }, 0);
  }

  public gotoAuthentication(returnUrl: string): void {
    setTimeout(() => {
      this.router.navigate(['/', AppRoutingEnum.Authentication], {
        queryParams: {[RETURN_URL_QUERY_KEY]: returnUrl},
      }).then();
    }, 0);
  }

  public gotoError(returnUrl: string, context?: any): void {
    setTimeout(() => {
      this.router.navigate(['/', AppRoutingEnum.Error, 'SERVER_ERROR'], {
        queryParams: {[RETURN_URL_QUERY_KEY]: returnUrl},
        skipLocationChange: true,
        state: context,
      }).then();
    }, 0);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.token$.pipe(
      map((token: string | null) => {
        if (!token) {
          /**
           * Если у нас токена нет, но браузер в запрещенных, разрешаем идти дальше,
           * там будет редирект на страницу с ошибкой
           */
          if (this.blacklistService.isCurrentInBlacklist()) {
            return true;
          }

          this.gotoAuthorization(state.url);

          return false;
        }
        return true;
      }),
    );
  }

}
