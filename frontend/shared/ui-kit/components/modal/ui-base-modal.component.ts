import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-base-modal',
  styleUrls: ['./ui-base-modal.component.scss'],
  templateUrl: './ui-base-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBaseModalComponent {
  @Input()
  public closeOnlyByUser = false;

  @Input()
  public sizeType: 'default' = 'default';

  @HostBinding('class._default-size')
  public get isDefaultSize(): boolean {
    return this.sizeType === 'default';
  }

  constructor(
    private router: Router,
  ) {}

  public close(): void {
    this.router.navigate([{ outlets: { modal: null }}]);
  }
}
