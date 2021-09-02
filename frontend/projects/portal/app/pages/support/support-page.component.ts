import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { untilDestroyed } from '@cikrf/gas-utils/operators';
import { UserAgentService } from '@services/user-agent/user-agent.service';
import { SupportPage } from './support-page.namespace';
import { User } from '@models/user';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { AppRoutingEnum } from '../../app-routing.enum';
import { HttpClient } from '@angular/common/http';
import { SUPPORT_ENDPOINTS } from '../../constants';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';

const BUTTON_HOLD_TIMEOUT = 750;

@Component({
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportPageComponent implements OnInit {

  public form: FormGroup;
  public inputTypeEnum = SupportPage.SupportInputTypeEnum;
  public stageEnum = SupportPage.SupportPageStageEnum;
  public stage$ = new BehaviorSubject<SupportPage.SupportPageStageEnum>(SupportPage.SupportPageStageEnum.NEW_REPORT);
  public appRoutingEnum = AppRoutingEnum;

  private userSubject$ = new BehaviorSubject<User | undefined>(undefined);

  public loading$: ToggleSubject = new ToggleSubject(false);

  constructor(
    private authService: AuthService,
    private userAgentService: UserAgentService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private headerService: HeaderService,
    private httpClient: HttpClient,
  ) {
    this.activatedRoute.params.subscribe(params => this.initFormWithErrorDescription(params.message));

    this.headerService.setMetadata(
      {
        title: '',
        isShow: false,
      },
    );
  }

  public ngOnInit(): void {
    this.form.get('browser')?.disable();
    this.fillUserFullName();
  }

  public buildReportMessage(): void {
    this.loading$.toggle();

    if (!this.form.valid) {
      return;
    }

    if (this.userSubject$.value) {
      this.sendReportMessage();
      return;
    }
  }

  public sendReportMessage(): void {
    const value = this.form.getRawValue();
    this.sendErrorMessage(value).subscribe(() => {
      setTimeout(() => {
        this.loading$.toggle();
        this.stage$.next(SupportPage.SupportPageStageEnum.REPORT_SENDED);
      }, BUTTON_HOLD_TIMEOUT);
    });
  }

  public goToBack(): void {
    this.location.back();
  }

  private initFormWithErrorDescription(errorDescription: string = ''): void {
    if (!!this.form) {
      return this.form.patchValue({errorDescription});
    }

    this.form = new FormGroup({
      fullName: new FormControl(''),
      phoneNumber: new FormControl(null, [Validators.required]),
      browser: new FormControl({
        value: `${this.userAgentService.browserAndOs}; ${this.getUserTimezone()}`,
        disabled: true,
      },
      [Validators.required]),
      errorDescription: new FormControl(errorDescription, [Validators.required]),
    });
  }

  private fillUserFullName(): void {
    this.authService.me(true)
      .pipe(untilDestroyed(this))
      .subscribe((userInfo: User) => {
        this.userSubject$.next(userInfo);

        this.form.patchValue({phoneNumber: userInfo.phoneNumber});
        this.form.patchValue({fullName: userInfo.fio ? userInfo.fio : ''});

        if (this.form.controls['fullName'].value) {
          this.form.controls['fullName'].disable();
        }

        if (this.form.controls['phoneNumber'].value) {
          this.form.controls['phoneNumber'].disable();
        }

        this.changeDetectorRef.markForCheck();
      });
  }

  private sendErrorMessage(input: {
    phoneNumber: string;
    errorDescription: string;
    fullName: string;
  }): Observable<any> {
    const browserInfo = this.getUserTimezone() + ' // ' + this.userAgentService.browserAndOs + ' (' + navigator.userAgent + ')';
    return this.httpClient.post(SUPPORT_ENDPOINTS.Message, { ...input, browserInfo });
  }

  private getUserTimezone(): string {
    const timezoneMatch = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/);
    if (!timezoneMatch?.length) {
      return '';
    }
    return timezoneMatch[1];
  }
}
