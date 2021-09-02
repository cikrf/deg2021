import { ChangeDetectionStrategy, Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { TITLES } from './../../rules.constants';

@Component({
  selector: 'app-mobile-rules-header',
  templateUrl: './mobile-rules-header.component.html',
  styleUrls: ['./mobile-rules-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRulesHeaderComponent implements OnChanges {
  @Output('changedStep')
  public onChangeStep$ = new EventEmitter<number>();

  @Input()
  public currentStep = 0;

  public stepSubject$ = new BehaviorSubject<number>(0);

  public titles: string[] = TITLES;

  public steps: number[] = [0, 1, 2, 3];

  public ngOnChanges(changes: SimpleChanges): void {
    this.changeStep(changes.currentStep.currentValue);
  }

  public changeStep(step: number): void {
    this.stepSubject$.next(step);
    this.onChangeStep$.emit(step);
  }
}
