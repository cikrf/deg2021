import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversalTokenService } from '../../services/universal-token.service';
import { combineLatest, of, throwError } from 'rxjs';
import { catchError, first, map, pluck, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { AuthError } from './auth-error.class';
import { AppRoutingEnum } from '../../app-routing.enum';
import { ErrorSection } from '../error/error-section.enum';
import { WindowService } from '@modules/browser-services/window.service';
import { RETURN_URL_QUERY_KEY } from '../../constants';

@Component({
  selector: 'app-auth',
  styleUrls: ['./auth.scss'],
  template: `
    <ui-unavailable
      hideMain
      hideRepeat
      isContent
      spinner
      hideDescription
      title="Ожидайте"
    >
      <div
        aria-busy="true"
        aria-live="assertive"
        class="waiting"
      >
        <p class="waiting__description">
          Если вы&nbsp;видите этот экран слишком долго, обратитесь в&nbsp;службу поддержки
          по&nbsp;телефону&nbsp;<span style="display: inline-block;">8-800-200-36-20</span>
        </p>
      </div>
    </ui-unavailable>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  public error$ = this.route.queryParams.pipe(
    pluck('error'),
  );

  public errorDescription$ = this.route.queryParams.pipe(
    pluck('error_description'),
  );

  public returnUrl$ = this.route.queryParams.pipe(
    pluck(RETURN_URL_QUERY_KEY),
    map(returnUrl => returnUrl || AppRoutingEnum.Election),
  );

  public code$ = this.route.queryParams.pipe(
    pluck('code'),
  );

  public state$ = this.route.queryParams.pipe(
    pluck('state'),
  );

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private router: Router,
    private route: ActivatedRoute,
    private utoken: UniversalTokenService,
    private http: HttpClient,
    private authService: AuthService,
    private window: WindowService,
  ) {

    this.error$.pipe(
      switchMap((error) => {
        if (error) {
          return combineLatest([
            this.error$,
            this.errorDescription$,
          ]).pipe(
            switchMap(([err, description]: string[]) => throwError(new AuthError(err))),
          );
        }

        return of(null);
      }),
      switchMap(() => combineLatest([this.code$, this.state$, this.returnUrl$])),
      switchMap(([code, state, returnUrl]: string[]) => {
        if (!state || !code) {
          this.authService.getAuthUrl(this.window.href).subscribe((url: string) => {
            this.window.goto(url);
          });
          return of(null);
        }

        return this.authService.auth(code, state, this.window.path + returnUrl);
      }),
      first(),
      catchError((e) => {
        this.showError(e);

        return throwError(e);
      }),
    ).subscribe((token) => {
      if (!token) {
        return;
      }
      this.utoken.updateToken(token as string);
      this.returnUrl$.subscribe((returnUrl: string) => {
        this.router.navigateByUrl(returnUrl).then();
      });
    }, (error: Error) => {
      this.showError(error.message);
    });
  }

  private showError(error: string) {
    setTimeout(() => {
      this.router.navigate([AppRoutingEnum.Error, ErrorSection.Esia], {queryParams: {code: error as string}}).then();
    });
  }
}
