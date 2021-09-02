import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { map, pluck, repeatWhen, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { HeaderService } from '@services/header.service';
import { AdaptiveService } from '@services/adaptive.service';
import {
  AuthenticationStatus,
  AuthenticationText,
  AuthenticationType,
  CodeState,
  CodeStatus,
} from './authentication.namespace';
import { ApiError } from '@shared/interceptor/api.error';
import { AppRoutingEnum } from '../../app-routing.enum';
import { ERROR_CODES } from '../../../../../shared/constants/error-codes';
import { RETURN_URL_QUERY_KEY } from '../../constants';
import { UniversalTokenService } from '../../services/universal-token.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NgOnDestroy } from '@cikrf/gas-utils/decorators';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';

const CODE_LENGTH = 6;
const ERROR_VERIFICATION_CODE = 45;
const BUTTON_HOLD_TIMEOUT = 750;

const AUTHENTICATION = {
  [AuthenticationType.Sms]: {
    pageHeader: 'Введите код из СМС-сообщения',
    confirmation: 'Введите код подтверждения из СМС-сообщения, отправленного на номер',
    noAccessTitle: 'Нет доступа к этому номеру?',
    noAccess: 'Измените свой номер на актуальный',
    codeNotCome: 'Подождите указанное в таймере время и запросите код повторно. Если СМС сообщение не приходит',
  },
  [AuthenticationType.Email]: {
    pageHeader: 'Введите код из электронного письма',
    confirmation: 'Введите код подтверждения из письма, отправленного на',
    noAccessTitle: 'Нет доступа к почте?',
    noAccess: 'Измените адрес электронной почты на актуальный',
    codeNotCome: 'Проверьте папку “Спам”, подождите указанное в таймере время и запросите код повторно. Если письмо не приходит',
  },
};

@Component({
  selector: 'app-sms-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationComponent {
  @ViewChild('inputRef', { static: false })
  public inputRef: ElementRef;

  public appRoutingEnum = AppRoutingEnum;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AuthenticationType = AuthenticationType;
  public authenticationType$: Observable<AuthenticationType> = this.universalTokenService.authenticationType$;

  public form = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}')]),
  });

  public readonly maxLengthCode = 6;

  public readonly authentication$: Observable<AuthenticationText> = this.authenticationType$.pipe(
    map((type: AuthenticationType) => AUTHENTICATION[type]),
  );

  public refreshSubject$ = new Subject<void>();
  public error$ = new BehaviorSubject<string>('');
  public disabledInput$ = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.adaptiveService.isMobileAndBelow$;
  public disabledButton$ = new BehaviorSubject<boolean>(false);
  public loading$: ToggleSubject = new ToggleSubject(false);

  public state$: Observable<CodeState> = this.authenticationService.requestCode().pipe(
    repeatWhen(() => this.refreshSubject$),
    shareReplay(),
  );
  public timer$: Observable<number> = this.state$.pipe(
    switchMap((state: CodeState) => this.authenticationService.createTimer(state)),
    tap((left: number) => {
      if (!left) {
        this.disabledInput$.next(true);
      }
    }),
  );
  public sendTo$: Observable<string> = this.state$.pipe(
    pluck('sentTo'),
  );

  private regex = /[0-9]{0,6}/;

  @NgOnDestroy()
  private destroy$!: Observable<void>;

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adaptiveService: AdaptiveService,
    private universalTokenService: UniversalTokenService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationType$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((type: AuthenticationType) => {
      this.headerService.setMetadata(
        {
          title: AUTHENTICATION[type].pageHeader,
          isShow: true,
        },
      );
    });

    this.state$.subscribe((state: CodeState) => {
      if (state.status === CodeStatus.Verified) {
        this.navigateToSuccess();
      }

      if (state.enteredIncorrectCode) {
        this.error$.next(ERROR_CODES[ERROR_VERIFICATION_CODE].getDescriprion(0));
        this.disabledInput$.next(true);
      }
    });

    combineLatest([this.form.statusChanges, this.error$]).pipe(
      takeUntil(this.destroy$),
      startWith([AuthenticationStatus.Invalid, '']),
      map(([status, error]: [AuthenticationStatus, string]) => status === AuthenticationStatus.Invalid || !!error),
    ).subscribe(this.disabledButton$);
  }

  public get control(): AbstractControl {
    return this.form.controls.code;
  }

  public sendCode(): void {
    const code: string = this.control.value;

    if (code.trim().length !== CODE_LENGTH) {
      return;
    }

    this.loading$.toggle();
    this.disabledButton$.next(true);

    this.authenticationService.sendCode(code).subscribe(
      () => {
        setTimeout(() => {
          this.loading$.toggle();
          this.navigateToSuccess();
        }, BUTTON_HOLD_TIMEOUT);
      },
      (error: ApiError) => {
        if (error.response instanceof HttpResponse) {
          const seconds = error.response.body.data?.secondsToNextAttempt;
          let errorCode = error.response.body.error.code;
          if (+errorCode === 46) {
            errorCode = 45; // todo DG-368 comment 19901
          }

          this.disabledInput$.next(true);
          this.loading$.toggle();

          if (ERROR_CODES[errorCode].getDescriprion) {
            this.timer$.pipe(
              takeUntil(merge(
                this.destroy$,
                this.refreshSubject$,
              )),
              map((time: number) => ERROR_CODES[errorCode].getDescriprion(time)),
            ).subscribe((errorDescription: string) => {
              this.error$.next(errorDescription);
            });
          } else {
            const errorText = ERROR_CODES[errorCode].description;
            this.error$.next(errorText);
          }
        } else {
          this.error$.next(error.description);
          throw new Error(error.description);
        }
      },
    );
  }

  public refreshCode(): void {
    this.refreshSubject$.next();
    this.error$.next('');
    this.control.setValue('');
    this.inputRef.nativeElement.removeAttribute('disabled');
    this.disabledInput$.next(false);
  }

  public validate(event: KeyboardEvent): void {
    if (!this.regex.test(event.key)) {
      event.preventDefault();
    }
  }

  public blurWithMaxLengthOnMobile(event: any, isMobile: boolean): void {
    // На андроиде некорректно отрабатывают события ввода с цифровой клавиатуры, поэтому убираем из value все нечисловые значения.
    event.target.value = event.target.value.replace(/[^\d]/g, '');

    if (isMobile && this.control.value.length === CODE_LENGTH) {
      this.inputRef.nativeElement.blur();
    }
  }

  public checkDisabledInput(disabledInput: boolean): void {
    if (disabledInput) {
      this.inputRef.nativeElement.blur();
    }
  }

  public isError(timer: number, error: boolean): boolean {
    return !timer || error;
  }

  private navigateToSuccess(): void {
    if (this.activatedRoute.snapshot.queryParams[RETURN_URL_QUERY_KEY]) {
      this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[RETURN_URL_QUERY_KEY]).then();
      return;
    }
    this.router.navigate(
      [this.appRoutingEnum.Election],
    ).then();
  }
}
