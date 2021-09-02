import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-layout-anon-header',
  templateUrl: './ui-layout-anon-header.component.html',
  styleUrls: ['./ui-layout-anon-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLayoutAnonHeaderComponent {
}
