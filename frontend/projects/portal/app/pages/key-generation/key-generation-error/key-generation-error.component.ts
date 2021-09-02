import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutingEnum } from '../../../app-routing.enum';
import { ToggleSubject } from '@shared/rxjs/toggle-subject.rxjs';

@Component({
  selector: 'app-key-generation-error',
  templateUrl: './key-generation-error.component.html',
  styleUrls: ['./key-generation-error.component.scss', '../key-generation/key-generation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyGenerationErrorComponent {

  public showPossibleReasons$ = new ToggleSubject(false);

  constructor(
    private router: Router,
  ) { }

  public navigateToRootPage(): void {
    this.router.navigateByUrl(AppRoutingEnum.Election);
  }

  public togglePossibleReasons(): void {
    this.showPossibleReasons$.toggle();
  }

}
