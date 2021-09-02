import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-link',
  templateUrl: './ui-link.component.html',
  styleUrls: ['./ui-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLinkComponent {
  @Input()
  public title: string;
}
