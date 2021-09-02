import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-ballot',
  templateUrl: './empty-ballot.component.html',
  styleUrls: ['./empty-ballot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyBallotComponent {

  constructor() { }

}
