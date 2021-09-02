import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { GasInputBoolean } from '@cikrf/gas-utils/decorators';

@Component({
  selector: 'ui-divider',
  templateUrl: './ui-divider.component.html',
  styleUrls: ['./ui-divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDividerComponent {
  @HostBinding('class._vertical')
  @GasInputBoolean()
  @Input()
  public vertical = false;

  @HostBinding('class._solid')
  @GasInputBoolean()
  @Input()
  public solid = false;
}
