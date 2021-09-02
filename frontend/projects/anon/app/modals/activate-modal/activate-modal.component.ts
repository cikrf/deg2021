import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate-modal',
  styleUrls: ['./activate-modal.component.scss'],
  templateUrl: './activate-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateModalComponent {
  constructor(
    private router: Router,
  ) {}

  public start(): void {
    this.router.navigate([{ outlets: { modal: null }}]);
  }
}
