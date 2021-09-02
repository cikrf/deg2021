import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { AdaptiveService } from '@services/adaptive.service';

@Component({
  selector: 'ui-image-preloader',
  templateUrl: './ui-image-preloader.component.html',
  styleUrls: ['./ui-image-preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiImagePreloaderComponent {

  public isMobileOnly$ = this.adaptiveService.isMobileOnly$;
  public isTabletOnly$ = this.adaptiveService.isTabletOnly$;
  public isDesktop$ = this.adaptiveService.isDesktopAndAbove$;

  constructor(
    private adaptiveService: AdaptiveService,
  ) {}
}
