import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GasNotationPipe } from '@cikrf/gas-utils/pipes';
import { BallotsQuery } from '@state/ballots/ballots.query';
import { Ballot } from '@models/elections';
import { addMillisecondsToTime } from '@helpers/voting.helper';

@Component({
  selector: 'app-ballots-left',
  templateUrl: './ballots-left.component.html',
  styleUrls: ['./ballots-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotsLeftComponent {

  public plannedEndDateTime$: Observable<Date> = this.ballotsQuery.selectActive().pipe(
    map((ballot: Ballot) => addMillisecondsToTime(ballot.plannedEndDateTime, ballot.ballotAcceptanceTimeout)),
  );

  public leftBallotsText$: Observable<string> = this.ballotsQuery.selectAll()
    .pipe(
      map(() => {
        const countCompleted = this.ballotsQuery.getCompleted().length;
        const countAll = this.ballotsQuery.getAll().length;
        const countSkipped = this.ballotsQuery.getSkippedBallots().length;
        const skippedText = countSkipped ? `, пропущено ${countSkipped}` : '';
        const leftCount = countAll - countCompleted;
        // const leftCount = countAll - countCompleted - countSkipped; todo
        const notationText = this.gasNotationPipe.transform(leftCount, ['бюллетень', 'бюллетеня', 'бюллетеней']);
        const leftText = this.gasNotationPipe.transform(leftCount, ['Остался', 'Осталось', 'Осталось']);

        return leftCount > 0 ? `${leftText} ${leftCount} ${notationText}${skippedText}` : '';
      }),
    );

  public hideTimer$ = new BehaviorSubject<boolean>(false);

  constructor(
    private ballotsQuery: BallotsQuery,
    private gasNotationPipe: GasNotationPipe,
  ) {}

  public hideTimer(): void {
    this.hideTimer$.next(true);
  }
}
