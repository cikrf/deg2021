import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-max-checked-modal',
  templateUrl: './max-checked-modal.component.html',
  styleUrls: ['./max-checked-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaxCheckedModalComponent {
  constructor(
    private router: Router,
  ) {
  }

  public start(): void {
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
