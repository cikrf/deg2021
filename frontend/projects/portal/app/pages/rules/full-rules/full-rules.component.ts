import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WindowService } from '@modules/browser-services/window.service';
import { Rule } from '@models/rules.interface';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-full-rules',
  templateUrl: './full-rules.component.html',
  styleUrls: ['./full-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullRulesComponent {

  @Input()
  public rules: Rule[];

  constructor(
    private headerService: HeaderService,
    private windowService: WindowService,
  ) {
    this.headerService.setMetadata({title: 'Правила участия'});
  }

  public up(): void {
    this.windowService.scrollToTop();
  }

}
