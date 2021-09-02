import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, pluck, tap, skip } from 'rxjs/operators';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { User } from '@models/user';
import { transformTo } from '@cikrf/gas-utils/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private http: HttpClient,
  ) {}

  public getAuthUrl(redirectUrl: string): Observable<string> {
    return this.http.get(`/api/auth/esia/auth-code-url`, {
      params: {
        redirectUrl,
      },
    }).pipe(
      pluck('url'),
    );
  }

  public auth(code: string, state: string, redirectUrl: string): Observable<string> {
    return this.http.post(`/api/auth/esia/authenticate`, {
      code,
      state,
      redirectUrl,
    }).pipe(
      pluck('access_token'),
    );
  }

  public me(skipAuth: boolean = false): Observable<User> {
    const headers = skipAuth ? new HttpHeaderResponse().headers.append('skipCatchError', '') : {};

    return this.http.get('/api/auth/user/me', {headers}).pipe(
      transformTo(User),
    );
  }

  public logout(): Observable<string> {
    return this.http.get('/api/auth/esia/logout-url', {
      params: {
        redirectUrl: window.location.origin + this.baseHref,
      },
    }).pipe(
      pluck('url'),
    );
  }

}
