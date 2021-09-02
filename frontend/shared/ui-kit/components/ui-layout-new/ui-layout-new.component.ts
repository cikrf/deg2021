import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { GasInputBoolean } from '@cikrf/gas-utils/decorators';

@Component({
  selector: 'ui-layout-new',
  templateUrl: './ui-layout-new.component.html',
  styleUrls: ['../ui-layout/ui-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._anon]': `true`,
  },
})
export class UiLayoutNewComponent {
  @Input()
  public title = '';

  @GasInputBoolean()
  @Input()
  public loading = false;

  @Input()
  public showSupport = true;
}
