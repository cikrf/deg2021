import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { WindowService } from '@modules/browser-services/window.service';
import { AdaptiveService } from '@services/adaptive.service';

@Component({
  selector: 'ui-up-button',
  templateUrl: './ui-up-button.component.html',
  styleUrls: ['./ui-up-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiUpButtonComponent {
  public isMobile$ = this.adaptiveService.isMobileAndBelow$;

  constructor(
    private adaptiveService: AdaptiveService,
    private windowService: WindowService,
  ) {
  }

  @HostBinding('attr.aria-hidden')
  @Input()
  public ariaHidden = true;

  @Output('onClick')
  public onClick = new EventEmitter<void>();

  public clickHandler(): void {
    this.windowService.scrollToTop();
    this.onClick.emit();
  }

}
