import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GasMathHelper } from '@cikrf/gas-utils/helpers';
import { untilDestroyed } from '@cikrf/gas-utils/operators';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';
import { BehaviorSubject, interval } from 'rxjs';

@Component({
  templateUrl: './playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {
  /** Временное решение для примеров */
  public endTime = new Date().getTime() + 1000 * 60 * 154;

  public preloader$ = new ToggleSubject(false);

  public uniqueId$ = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
  ) {
    interval(1000)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => this.uniqueId$.next(GasMathHelper.getUniqueId()));
  }

  public openSelectModal(): void {
    this.router.navigate([{ outlets: { modal: 'select' }}]);
  }

  public openActivateModal(): void {
    this.router.navigate([{ outlets: { modal: 'activate' }}]);
  }

  public togglePreloader(): void {
    this.preloader$.toggle();
  }
}
