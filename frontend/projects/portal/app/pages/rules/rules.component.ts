import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Observable } from 'rxjs';

import { AdaptiveService } from '@services/adaptive.service';
import { Rules } from '@models/rules.interface';
import { WindowService } from '@modules/browser-services/window.service';
import { RulesService } from './rules.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {

  public mobile$: Observable<boolean> = this.adaptiveService.isMobileAndBelow$;

  public rules$: Observable<Rules> = this.rulesService.getRules();

  constructor(
    private adaptiveService: AdaptiveService,
    private windowService: WindowService,
    private rulesService: RulesService,
  ) {
  }

  public up(): void {
    this.windowService.scrollToTop();
  }

  /*private getDatesFormatted(status: PollingStatus): any {
    const daysFromStartToEnd = this.dateFormatService.getDaysBetween(status.openDateTime, status.stopDateTime);
    return {
      days: daysFromStartToEnd + ' ' + new GasNotationPipe().transform(daysFromStartToEnd, ['день', 'дня', 'дней']),
      start: {
        short: this.dateFormatService.getShortDate(new Date(status.openDateTime)),
        full: this.dateFormatService.getFullDate(new Date(status.openDateTime), ':'),
      },
      end: {
        short: this.dateFormatService.getShortDate(new Date(status.stopDateTime)),
        full: this.dateFormatService.getFullDate(new Date(status.stopDateTime), ':'),
      },
    };
  }*/

}
