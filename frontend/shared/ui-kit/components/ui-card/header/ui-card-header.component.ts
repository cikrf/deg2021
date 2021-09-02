import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-card-header',
  templateUrl: './ui-card-header.component.html',
  styleUrls: ['./ui-card-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardHeaderComponent {
}
