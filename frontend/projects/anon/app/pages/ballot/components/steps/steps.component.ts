import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { Ballot } from '@models/elections';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { NavigationService } from 'projects/anon/app/services/navigation.service';

import { Observable } from 'rxjs';

/** TODO: Больно большой файл, подумать над рефакторингом */
@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent {

  public ballots$: Observable<Ballot[]> = this.ballotsQuery.selectAll();

  constructor(
    private ballotsQuery: BallotsQuery,
    private navigationService: NavigationService,
  ) {}

  public navigateToBallot(index: number): void {
    return;
    // const ballotId = this.ballotsQuery.getAll()[index].id;
    // this.navigationService.goToNextBallot(ballotId);
  }

  public isActive(index: number): boolean {
    const currentBallotId: string = this.ballotsQuery.getActive().id;
    const ballotIdByIndex: string = this.ballotsQuery.getAll()[index].id;

    return currentBallotId === ballotIdByIndex && !this.ballotsQuery.getAll()[index].completed;
  }

  public isCompleted(index: number): boolean {
    return this.ballotsQuery.getAll()[index].completed;
  }
}
