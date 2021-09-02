import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-voters-card',
  templateUrl: './ui-voting-card.component.html',
  styleUrls: ['./ui-voting-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiVotingCardContentComponent {
}
