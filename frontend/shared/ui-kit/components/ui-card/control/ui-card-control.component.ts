import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-card-control',
  templateUrl: './ui-card-control.component.html',
  styleUrls: ['./ui-card-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardControlComponent {
}
