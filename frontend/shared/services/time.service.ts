import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Observable,
  race,
  ReplaySubject,
} from 'rxjs';
import { first, map, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { ServerTimeData } from '../models/server-time.model';

const SERVER_ENDPOINT_TIME = '/api/server/time';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private time$ = new ReplaySubject<number>(1);
  public readonly actualTime$ = this.time$.pipe(
    startWith(new Date().getTime()),
  );

  constructor(private httpClient: HttpClient) {
    this.createTimer().subscribe(this.time$);
  }

  public createTimer(period: number = 1000): Observable<number> {
    return race([
      this.time$.pipe(first()),
      this.getTime(),
    ]).pipe(
      switchMap(
        (serverTime: number) => interval(period)
          .pipe(
            startWith(0),
            scan((acc: number) => acc + period, serverTime),
          )),
    );
  }

  public getTime(): Observable<number> {
    return this.httpClient.get(SERVER_ENDPOINT_TIME)
      .pipe(
        map((response: ServerTimeData) => response.time),
      );
  }
}
