import { ChangeDetectionStrategy, Component, ErrorHandler, HostListener } from '@angular/core';
import { UiA11yService } from '@ui/modules/ui-a11y/ui-a11y.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  constructor(
    private errorHandler: ErrorHandler,
    private a11yService: UiA11yService,
  ) {
  }

  public openEyePanel(): void {
    this.a11yService.openEyePanel();
  }

}
