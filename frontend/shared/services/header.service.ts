import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable, TemplateRef } from '@angular/core';
import { Header } from '@interfaces/header.interface';
import { shareReplay, skip } from 'rxjs/operators';

/**
 * Сервис для установки тайтла
 * Для мобильных устройств добавляет кнопку рядом с заголовком
 */
@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public header$: Observable<Header>;
  public loading$: Observable<boolean>;
  public subheaderTemplateRef$: Observable<TemplateRef<HTMLElement>>;

  private headerSubject$ = new BehaviorSubject<Header>({
    title: '',
  });
  private loadingSubject$ = new BehaviorSubject<boolean>(false);

  /** Подумать над тем, как удобнее прокидывать контент в шапку */
  private subheaderTemplateRefSubject$ = new Subject<TemplateRef<HTMLElement>>();

  constructor() {
    this.header$ = this.headerSubject$.asObservable()
      .pipe(
        skip(1),
      );

    this.loading$ = this.loadingSubject$.asObservable()
      .pipe(
        shareReplay(1),
      );

    this.subheaderTemplateRef$ = this.subheaderTemplateRefSubject$.asObservable()
      .pipe(
        shareReplay(1),
      );
  }

  public setMetadata(header: Partial<Header>): void {
    if (header.subtitle === undefined) {
      header.subtitle = '';
    }
    if (header.isShow === undefined) {
      header.isShow = true;
    }
    this.headerSubject$.next({ ...this.headerSubject$.getValue(), ...header });
  }

  public getHeaderMetadata(): Header {
    return this.headerSubject$.getValue();
  }

  public setLoading(isLoading: boolean): void {
    this.loadingSubject$.next(isLoading);
  }

  public setSubheaderTemplateRef(ref: TemplateRef<HTMLElement> | undefined): void {
    this.subheaderTemplateRefSubject$.next(ref);
  }
}
