import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ElectionList, Voting } from '@models/elections';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionComponent {

  @Input()
  public electionList: ElectionList;

  public isShowBallot$ = new ToggleSubject(true);

  public hasVotings(): boolean {
    return this.electionList?.votings?.length > 0;
  }

  public toggleBallot(): void {
    this.isShowBallot$.toggle();
  }
}
