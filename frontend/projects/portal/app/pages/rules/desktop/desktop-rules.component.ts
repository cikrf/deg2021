import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TITLES, STEPS } from './../rules.constants';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-desktop-rules',
  templateUrl: './desktop-rules.component.html',
  styleUrls: ['./desktop-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopRulesComponent {

  public titles: string[] = TITLES;

  public steps: Record<string, number> = STEPS;

  constructor(
    private headerService: HeaderService,
  ) {
    this.headerService.setMetadata({title: 'Правила участия'});
  }
}
