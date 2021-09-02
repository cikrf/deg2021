import { Injectable } from '@angular/core';
import { ActivatedRoute, Data, Event, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators';
import { Header } from '@interfaces/header.interface';
import { HeaderService } from './header.service';

/**
 * Сервис для полу
 */
@Injectable({
  providedIn: 'root',
})
export class RouterService {

  public routeData$: Observable<Header>;

  public routeEventEnd$: Observable<ActivatedRoute> = this.router.events
    .pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      shareReplay(1),
    );

  private routeDataSubject$ = new Subject<Header>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
  ) {
    this.routeData$ = this.routeDataSubject$.asObservable()
      .pipe(
        filter(data => !!data.title),
      );
  }

  /**
   * Получение объекта data из route параметров
   * При получении данных, отправляет в специальный сервис, в котором мы получаем observable с данными
   */
  public init(): void {
    this.routeEventEnd$
      .pipe(
        map((route: ActivatedRoute) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route: ActivatedRoute) => route.outlet === 'primary'),
        mergeMap((route: ActivatedRoute) => route.data),
      )
      .subscribe((data: Data) => this.setRouteData(this.getMappedRouteData(data)));
  }

  private getMappedRouteData(routeData: Data): Header {
    const headerData: Header = {
      title: routeData.title,
      link: routeData.link,
      pageType: routeData.pageType,
    };

    return { ...this.headerService.getHeaderMetadata(), ...headerData};
  }

  private setRouteData(routeData: Header): void {
    this.routeDataSubject$.next(routeData);
  }
}
