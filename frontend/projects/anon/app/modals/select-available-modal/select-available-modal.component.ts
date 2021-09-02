import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-available-modal',
  styleUrls: ['./select-available-modal.component.scss'],
  templateUrl: './select-available-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAvailableModalComponent {
  constructor(
    private router: Router,
  ) {}

  public start(): void {
    this.router.navigate([{ outlets: { modal: null }}]);
  }
}
