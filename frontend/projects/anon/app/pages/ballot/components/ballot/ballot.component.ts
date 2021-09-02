import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ballot',
  templateUrl: './ballot.component.html',
  styleUrls: ['./ballot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallotComponent {
}
