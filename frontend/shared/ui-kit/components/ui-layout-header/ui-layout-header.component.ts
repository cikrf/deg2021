import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { Header, PageType } from '@interfaces/header.interface';
import { HeaderService } from '@services/header.service';
import { RouterService } from '@services/router.service';
import { makeArray } from '@utils/functions/make-array';
import { untilDestroyed } from '@cikrf/gas-utils/operators';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';
import { AppRoutingEnum } from '../../../../projects/portal/app/app-routing.enum';
import { UiA11yService } from '@ui/modules/ui-a11y/ui-a11y.service';

@Component({
  selector: 'ui-layout-header',
  templateUrl: './ui-layout-header.component.html',
  styleUrls: ['./ui-layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLayoutHeaderComponent {
  @Input()
  public type: 'portal' | 'anon' = 'portal';

  @Input()
  public title = null;

  @GasInputBoolean()
  @HostBinding('class._left')
  @Input()
  public alignLeft = false;

  public loading$ = this.headerService.loading$;
  public subheaderTemplateRef: TemplateRef<HTMLElement>;
  public appRoutingEnum = AppRoutingEnum;

  public header$: Observable<Header> = merge(
    this.routerService.routeData$,
    this.headerService.header$,
  );

  constructor(
    private router: Router,
    private routerService: RouterService,
    private headerService: HeaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private a11yService: UiA11yService,
  ) {
    this.headerService.subheaderTemplateRef$
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((ref: TemplateRef<HTMLElement>) => {
        this.subheaderTemplateRef = ref;

        this.changeDetectorRef.detectChanges();
      });
  }

  public navigation(link: Header['link']): void {
    this.router.navigate(makeArray(link)).then();
  }

  public isServicePage(pageType: PageType): boolean {
    return pageType === PageType.Service;
  }

  public openEyePanel(): void {
    this.a11yService.openEyePanel();
  }
}
