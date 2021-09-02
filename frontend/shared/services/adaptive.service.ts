import { Injectable } from '@angular/core';
import { DeviceType } from '@models/adaptive.model';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, share, shareReplay, startWith, throttleTime } from 'rxjs/operators';
import { BrowserEventsService } from './browser-event.service';
import {
  isSmMobileOnly,
  isSmMobileAndAbove,
  isSmMobileAndBelow,

  isMobileOnly,
  isMobileAndAbove,
  isMobileAndBelow,

  isTabletOnly,
  isTabletAndAbove,
  isTabletAndBelow,

  isDesktopOnly,
  isDesktopAndAbove,
  isDesktopAndBelow,

  isDesktopWideOnly,
  isDesktopWideAndAbove,
  isDesktopWideAndBelow,
} from '@helpers/adaptive.helper';

/**
 * Сервис предназначен для отлавливания изменения размеров окна и определения типа девайса
 *
 * Пример:
 *
 * @example adaptiveService.isMobile$.subscribe((isMobile: boolean) => console.log('is mobile ' + isMobile));
 */
@Injectable({
  providedIn: 'root',
})
export class AdaptiveService {
  /** Возвращает тип девайса */
  public readonly deviceType$: Observable<DeviceType> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      throttleTime(300),
      startWith(null),
      map(() => {
        if (isSmMobileOnly()) {
          return DeviceType.MinMobile;
        }

        if (isMobileOnly()) {
          return DeviceType.MaxMobile;
        }

        if (isTabletOnly()) {
          return DeviceType.Tablet;
        }

        if (isDesktopOnly()) {
          return DeviceType.Desktop;
        }

        return DeviceType.WideDesktop;
      }),
      share(),
    );

  /** Sm mobile start */
  public readonly isSmMobileOnly$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isSmMobileOnly()),
      shareReplay(1),
    );

  public readonly isSmMobileAndAbove$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isSmMobileAndAbove()),
      shareReplay(1),
    );

  public readonly isSmMobileAndBelow$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isSmMobileAndBelow()),
      shareReplay(1),
    );
  /** Sm mobile end */

  /** Mobile start */
  public readonly isMobileOnly$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isMobileOnly()),
      shareReplay(1),
    );

  public readonly isMobileAndAbove$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isMobileAndAbove()),
      shareReplay(1),
    );

  public readonly isMobileAndBelow$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isMobileAndBelow()),
      shareReplay(1),
    );
  /** Mobile end */

  /** Tablet start */
  public readonly isTabletOnly$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isTabletOnly()),
      shareReplay(1),
    );

  public readonly isTabletAndAbove$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isTabletAndAbove()),
      shareReplay(1),
    );

  public readonly isTabletAndBelow$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isTabletAndBelow()),
      shareReplay(1),
    );
  /** Tablet end */

  /** Desktop start */
  public readonly isDesktopOnly$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isDesktopOnly()),
      shareReplay(1),
    );

  public readonly isDesktopAndAbove$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isDesktopAndAbove()),
      shareReplay(1),
    );

  public readonly isDesktopAndBelow$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isDesktopAndBelow()),
      shareReplay(1),
    );
  /** Desktop end */

  /** Desktop wide start */
  public readonly isDesktopWideOnly$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isDesktopWideOnly()),
      shareReplay(1),
    );

  public readonly isDesktopWideAndAbove$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isDesktopWideAndAbove()),
      shareReplay(1),
    );

  public readonly isDesktopWideAndBelow$: Observable<boolean> = this.browserEventsService.resize$
    .pipe(
      distinctUntilChanged(),
      map(() => isDesktopWideAndBelow()),
      shareReplay(1),
    );
  /** Desktop wide end */

  constructor(
    private browserEventsService: BrowserEventsService,
  ) {}
}
