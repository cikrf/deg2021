import { BehaviorSubject } from 'rxjs';
import { untilDestroyed } from '@cikrf/gas-utils/operators';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdaptiveService } from '@services/adaptive.service';

const ICON_SIZES = {
  mobile: 40,
  tabletAndAbove: 80,
};

@Component({
  selector: 'app-completed-question',
  templateUrl: './completed-question.component.html',
  styleUrls: ['./completed-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedQuestionComponent {
  public iconSize = new BehaviorSubject<number>(ICON_SIZES.mobile);

  constructor(
    private adaptiveService: AdaptiveService,
  ) {
    this.adaptiveService.isTabletAndAbove$
      .pipe(
        untilDestroyed(this),
      ).subscribe(
        (isTablet: boolean) => isTablet ? this.iconSize.next(ICON_SIZES.tabletAndAbove) : this.iconSize.next(ICON_SIZES.mobile),
      );
  }
}
