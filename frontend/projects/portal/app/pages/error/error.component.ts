import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { HttpStatus } from '@cikrf/gas-utils/enums';
import { HeaderService } from '@services/header.service';
import { ERROR_MAP } from './error.constant';
import { RETURN_URL_QUERY_KEY } from '../../constants';
import { AppRoutingEnum } from '../../app-routing.enum';
import { sanitize } from 'sanitizer';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  public sectionAndCode$: Observable<[string, string]> = combineLatest([
    this.route.params.pipe(
      pluck('section'),
    ),
    this.route.queryParams.pipe(
      pluck('code'),
      map((s: string) => sanitize(s)),
    ),
  ]).pipe(map(([section, code]: [string, string]) => {
    return [
      (section || String(HttpStatus.NOT_FOUND)).toUpperCase(),
      (code || '').toUpperCase(),
    ];
  }));

  public title$: Observable<string> = this.sectionAndCode$.pipe(
    map(([section, code]: [string, string]) => {
      const errorCode = code || this.context?.status;
      const errorCodeText = errorCode ? ' - Код ошибки ' + errorCode : '';
      return this.getMappedText(section, code, 'TITLE') + errorCodeText;
    }),
  );

  public text$: Observable<string> = this.sectionAndCode$.pipe(
    map(([section, code]: [string, string]) => this.getMappedText(section, code, 'TEXT')),
  );

  public returnUrl$: Observable<string> = this.route.queryParams.pipe(
    pluck(RETURN_URL_QUERY_KEY),
  );

  public enableRedMode$: Observable<boolean> = this.route.queryParams.pipe(
    pluck('red'),
    map((red: string) => Boolean(red)),
  );

  public hideMain$: Observable<boolean> = this.route.queryParams.pipe(
    pluck('hideMain'),
    map((hideMain: string) => Boolean(hideMain)),
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public AppRoutingEnum = AppRoutingEnum;

  public context: any = this.router.getCurrentNavigation()?.extras.state;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
  ) {
    this.headerService.setMetadata({
      title: '',
    });
  }

  private getMappedText(section: string, code: string, postfix: 'TITLE' | 'TEXT'): string {

    if (section === 'SERVER_ERROR') {
      if (this.context?.error?.name === 'ChunkLoadError') {
        code = '0';
      }
    }

    try {
      if (code) {
        return ERROR_MAP[section][code][postfix];
      }

      return ERROR_MAP[section][postfix];
    } catch(e) {
      return postfix === 'TITLE'
        ? 'Ошибка'
        : code || 'Произошла ошибка системы';
    }
  }

}
