import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';

import { BlacklistMeta, BlacklistService } from '../../projects/portal/app/services/blacklist.service';
import { UserAgentBrowser, UserAgentDevice, UserAgentOS } from '@services/user-agent/user-agent.state';
import { catchError, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { QuestionsQuery } from '@state/questions/questions.query';
import { Answer } from '../models/elections';
import { sha256 } from 'js-sha256';

export interface Coordinate {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PREFIX = '/sprites';

const WEBP_FORMAT = 'webp';

const PNG_FORMAT = 'png';

const blacklistWebp: BlacklistMeta[] = [
  {
    os: [ UserAgentOS.Windows ],
    device: [ UserAgentDevice.Desktop ],
    browserVersion: [
      { browser: UserAgentBrowser.IE },
      {
        browser: UserAgentBrowser.Edge,
        tillBrowserVersion: '18',
      },
      {
        browser: UserAgentBrowser.Firefox,
        tillBrowserVersion: '65',
      },
      {
        browser: UserAgentBrowser.Chrome,
        tillBrowserVersion: '32',
      },
      {
        browser: UserAgentBrowser.Opera,
        tillBrowserVersion: '19',
      },
    ],
  },
  {
    os: [ UserAgentOS.MacOS ],
    device: [ UserAgentDevice.Desktop ],
    browserVersion: [
      { browser: UserAgentBrowser.Safari },
      {
        browser: UserAgentBrowser.Chrome,
        tillBrowserVersion: '32',
      },
      {
        browser: UserAgentBrowser.Firefox,
        tillBrowserVersion: '65',
      },
    ],
  },
  {
    os: [ UserAgentOS.iOS ],
    device: [
      UserAgentDevice.Phone,
      UserAgentDevice.Tablet,
    ],
    browserVersion: [
      {
        browser: UserAgentBrowser.Safari,
        tillBrowserVersion: '14',
      },
      {
        browser: UserAgentBrowser.Chrome,
        tillBrowserVersion: '14',
      },
    ],
  },
  {
    os: [ UserAgentOS.Android ],
    device: [
      UserAgentDevice.Phone,
      UserAgentDevice.Tablet,
    ],
    browserVersion: [
      {
        browser: UserAgentBrowser.Android,
        tillBrowserVersion: '4',
      },
    ],
  },
];

/**
 * @deprecated
 * Сервис предназначен для получения, собранных в спрайт, изображений/картинок
 * предложенных для голосования вариантов ответов.
 */
@Injectable({
  providedIn: 'root',
})
export class SpriteService {

  public webp = !this.blacklistService.isCurrentInBlacklist(blacklistWebp);

  public hash$ = this.questionsQuery.selectActiveId()
    .pipe(
      filter((activeId: any) => !!activeId),
      map(() => this.getImagesHash()),
      filter((hash: string) => !!hash),
      shareReplay(),
    );

  public sprite$ = of(null);
  // public sprite$ = this.hash$
  //   .pipe(
  //     switchMap((hash: string) => {
  //       const url = `${PREFIX}/${hash}/sprite.json`;
  //       return this.httpClient.get<Record<string,Coordinate>>(url);
  //     }),
  //     catchError((error) => {
  //       this.errorHandler.handleError(error);
  //       return of(null);
  //     }),
  //     shareReplay(),
  //   );

  public imageFormat = this.webp ? WEBP_FORMAT : PNG_FORMAT;

  constructor(
    private httpClient: HttpClient,
    private blacklistService: BlacklistService,
    private questionsQuery: QuestionsQuery,
    private errorHandler: ErrorHandler,
  ) { }

  public image(image: string): Observable<string> {
    return combineLatest([
        this.hash$,
        this.sprite$,
      ]).pipe(
        map(([hash, sprite]: [string, null | Record<string, Coordinate>]) => {
          return this.getImagePath(image, hash, sprite);
        }),
      );
  }

  private getImagesHash(): string {
    const hash = this.questionsQuery.getActive()
      .answers
      .slice()
      .sort((a: Answer, b: Answer) => a.num - b.num)
      .map((answer: Answer) => answer.image)
      .filter((image: string) => !!image)
      .join(',');

    return !!hash ? sha256(hash) : hash;
  }

  private getImagePath(image: string, hash: string, sprite: null | Record<string, Coordinate>): string {
    const base = `${PREFIX}/${hash}`;
    return sprite
      ? `${base}/sprite.${this.imageFormat}`
      : `${base}/${image}`;
  }
}
