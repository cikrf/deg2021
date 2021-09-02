import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { Inject, Injectable, TemplateRef } from '@angular/core';
import { debounceTime, delay, shareReplay } from 'rxjs/operators';
import { RouterService } from './router.service';
import { WindowService } from '@modules/browser-services/window.service';
import { BrowserEventsService } from './browser-event.service';
import { APP_IS_PLATFORM_BROWSER } from '../providers/is-platform';

/**
 * Сервис для работы с layout
 */
@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  /** Подумать над тем, как удобнее прокидывать контент в шапку */
  private afterUpButtonTemplateRefSubject$ = new Subject<TemplateRef<HTMLElement>>();

  public afterUpButtonTemplateRef$: Observable<TemplateRef<HTMLElement>> = this.afterUpButtonTemplateRefSubject$.asObservable()
    .pipe(
      shareReplay(1),
    );

  private upButtonSubject$ = new BehaviorSubject<boolean>(false);
  public upButton$ = this.upButtonSubject$.asObservable();

  constructor(
    private routerService: RouterService,
    private windowService: WindowService,
    private browserEventsService: BrowserEventsService,
    @Inject(APP_IS_PLATFORM_BROWSER) isPlatformBrowser: boolean,
  ) {
    if (isPlatformBrowser) {
      merge(
        this.browserEventsService.resize$.pipe(debounceTime(200)),
        this.browserEventsService.scroll$.pipe(debounceTime(200)),
        this.routerService.routeEventEnd$,
      )
        .pipe(
          delay(50),
        )
        .subscribe(() => {
          const windowHeight = this.windowService.window.innerHeight;
          const scrollHeight = document.body.scrollHeight;
          this.upButtonSubject$.next(scrollHeight > windowHeight);
        });
    }
  }

  public setAfterUpButtonTemplateRef(ref: TemplateRef<HTMLElement> | undefined): void {
    this.afterUpButtonTemplateRefSubject$.next(ref);
  }
}
