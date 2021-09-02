import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-card-content',
  templateUrl: './ui-card-content.component.html',
  styleUrls: ['./ui-card-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardContentComponent {
}
