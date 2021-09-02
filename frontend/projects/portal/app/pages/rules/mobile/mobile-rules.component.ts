import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { HeaderService } from '@services/header.service';
import { STEPS } from './../rules.constants';

const TITLES: string[] = [
  '1/4',
  '2/4',
  '3/4',
  '4/4',
];

@Component({
  selector: 'app-mobile-rules',
  templateUrl: 'mobile-rules.component.html',
  styleUrls: ['./mobile-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileRulesComponent {
  public steps = STEPS;

  public activeStep$ = new BehaviorSubject<number>(this.steps.stepOne);

  constructor(
    private headerService: HeaderService,
  ) {
    this.headerService.setMetadata({title: TITLES[0]});
  }

  public changeStep(step: number): void {
    this.headerService.setMetadata({title: TITLES[step]});
    this.activeStep$.next(step);
  }

  public nextStep(): void {
    this.changeStep(this.activeStep$.value + 1);
  }

}
