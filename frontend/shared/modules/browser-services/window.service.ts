//TODO: вынести в утилиты
import { Inject, Injectable } from '@angular/core';
import { APP_IS_PLATFORM_BROWSER } from '../../providers/is-platform';
import { Observable, of } from 'rxjs';
import { filter, first, map, mapTo } from 'rxjs/operators';
import { BrowserEventsService } from '@services/browser-event.service';

@Injectable({
  providedIn: 'root',
})
export class WindowService {

  public window: Window;

  constructor(
    @Inject(APP_IS_PLATFORM_BROWSER) isPlatformBrowser: boolean,
    private browserEventsService: BrowserEventsService,
  ) {
    if (isPlatformBrowser) {
      this.window = window;
    } else {
      this.window = {
        innerHeight: 0,
        innerWidth: 0,
        // @ts-ignore
        location: {
          href: '',
          hash: '',
          origin: '',
          pathname: '',
        },
        scrollTo: (...args: any[]) => {},
        localStorage: {
          getItem: () => null,
          removeItem: () => {},
          setItem: () => {},
          clear: () => {},
          key: () => null,
          length: 0,
        },
      };
    }
  }

  public get href(): string {
    return this.window.location.href;
  }

  public get hash(): string {
    return decodeURIComponent(this.window.location.hash.slice(1));
  }

  public set hash(value: string) {
    this.window.location.hash = value;
  }

  public get path(): string {
    return this.window.location.origin + this.window.location.pathname;
  }

  public get origin(): string {
    return this.window.location.origin;
  }

  public get pageYOffset(): number {
    return this.window.pageYOffset;
  }

  public goto(url: string) {
    this.window.location.href = url;
  }

  public scrollTo(top: number): void {
    this.window.scrollTo({top, behavior: 'smooth'});
  }

  public scrollBy(top: number): void {
    this.window.scrollBy({top, behavior: 'smooth'});
  }

  public scrollToTop(): void {
    try {
      this.window.scroll({
        top: 0,
        behavior: 'smooth',
      });
    } catch (e) {
      this.window.scroll(0, 0);
    }
  }

  public smoothScrollToTop(): Observable<void> {
    if (!this.window.scrollY) {
      return of(undefined);
    } else {
      this.scrollToTop();
      return this.browserEventsService.scroll$.pipe(
        map(() => this.window.scrollY),
        filter(y => !y),
        first(),
        mapTo(undefined),
      );
    }
  }

  public get innerWidth(): number {
    return this.window.innerWidth;
  }

  public get localStorage(): Storage {
    return this.window.localStorage;
  }

}
