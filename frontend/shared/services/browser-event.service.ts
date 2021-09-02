import { Inject, Injectable } from '@angular/core';
import { combineLatest, fromEvent, NEVER, Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { APP_IS_PLATFORM_BROWSER } from '../providers/is-platform';

/**
 * Сервис предназначен для отлавливания глобальных событий
 * Таких как, scroll и resize окна
 * Используйте данный сервис, вместо того, что бы вручную подписываться каждый раз
 *
 * Пример:
 *
 * @example browserEventsService.scroll$.subscribe((event: Event) => console.log('handle event ' + event));
 */
@Injectable({
  providedIn: 'root',
})
export class BrowserEventsService {
  public readonly scroll$: Observable<Event | null> = this.isPlatformBrowser ?
    fromEvent(window, 'scroll').pipe(startWith(null)) :
    NEVER;
  public readonly resize$: Observable<Event | null> = this.isPlatformBrowser ?
    fromEvent(window, 'resize').pipe(startWith(null), debounceTime(100)) :
    NEVER;
  public readonly resizeAndScroll$: Observable<[Event | null, Event | null]> = combineLatest([
    this.scroll$.pipe(startWith(null)),
    this.resize$.pipe(startWith(null)),
  ]);

  constructor(
    @Inject(APP_IS_PLATFORM_BROWSER) private isPlatformBrowser: boolean,
  ) {}
}
