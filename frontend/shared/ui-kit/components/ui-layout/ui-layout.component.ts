import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { merge, Observable } from 'rxjs';

import { untilDestroyed } from '@cikrf/gas-utils/operators';

import { WindowService } from '@modules/browser-services/window.service';
import { RouterService } from '@services/router.service';
import { Header, PageType } from '@interfaces/header.interface';
import { HeaderService } from '@services/header.service';
import { LayoutService } from '@services/layout.service';
import { NgOnInit } from '@cikrf/gas-utils/decorators';

@Component({
  selector: 'ui-layout',
  templateUrl: './ui-layout.component.html',
  styleUrls: ['./ui-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._portal]': `type === 'portal'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._anon]': `type === 'anon'`,
  },
})
export class UiLayoutComponent {
  @Input()
  public type: 'portal' | 'anon' = 'portal';

  @NgOnInit()
  public init$!: Observable<void>;

  public header$: Observable<Header> = merge(
    this.routerService.routeData$,
    this.headerService.header$,
  );

  public loading$ = this.headerService.loading$;

  public isShowUpButton$ = this.layoutService.upButton$;

  public afterUpButtonTemplateRef: TemplateRef<HTMLElement>;

  constructor(
    private routerService: RouterService,
    private windowService: WindowService,
    private headerService: HeaderService,
    private layoutService: LayoutService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.layoutService.afterUpButtonTemplateRef$
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((ref: TemplateRef<HTMLElement>) => {
        this.afterUpButtonTemplateRef = ref;

        this.changeDetectorRef.detectChanges();
      });
  }

  public up(): void {
    this.windowService.scrollToTop();
  }

  public isServicePage(pageType: PageType): boolean {
    return pageType === PageType.Service;
  }

  public isAnon(): boolean {
    return this.type === 'anon';
  }
}
