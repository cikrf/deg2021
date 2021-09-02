import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { Ballot } from '@models/elections';

@Component({
  selector: 'app-final-completed',
  templateUrl: './final-completed.component.html',
  styleUrls: ['../final-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCompletedComponent {

  public ballot$: Observable<Ballot> = this.ballotsQuery.selectActive();

  constructor(
    private ballotsQuery: BallotsQuery,
  ) {}
}
