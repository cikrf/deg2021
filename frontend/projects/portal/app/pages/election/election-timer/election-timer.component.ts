import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;

@Component({
  selector: 'app-election-timer',
  templateUrl: './election-timer.component.html',
  styleUrls: ['./election-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionTimerComponent implements OnChanges {
  @Output('timerCompleted')
  public timerCompleted$ = new EventEmitter<void>();

  @Input()
  public endTime = 0;

  @Input()
  public currentTime = 0;

  public oneMinuteLeft = false;

  public ngOnChanges(): void {
    if (this.endTime && this.currentTime) {
      const delta = this.endTime - this.currentTime;

      if (delta < ONE_SECOND) {
        this.timerCompleted$.emit();
      }

      this.oneMinuteLeft = this.isOneMinuteLeft();
    }
  }

  private isOneMinuteLeft(): boolean {
    return this.currentTime + ONE_MINUTE > this.endTime;
  }
}
