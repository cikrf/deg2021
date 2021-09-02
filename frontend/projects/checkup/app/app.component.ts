import { WindowService } from '@modules/browser-services/window.service';
import { ChangeDetectionStrategy, Component, ErrorHandler } from '@angular/core';
import { CheckupService } from '@services/checkup.service';
import { BehaviorSubject, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public success$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private checkupService: CheckupService,
    private errorHandler: ErrorHandler,
    private windowService: WindowService,
    private router: Router,
  ) {
    of(null).pipe(
      delay(3000), // todo это нужно чтобы было видно лоадер, возможность прочитать
      switchMap(() => this.checkupService.result()),
      tap(() => this.loading$.next(false)),
    ).subscribe(
      (result) => {
        this.router.navigate([], { queryParams: { success: true }});
        this.success$.next(result);
      },
      (err) => {
        this.router.navigate([], { queryParams: { fail: true }});
        this.errorHandler.handleError(err);
      },
    );
  }

  public goToLanding(): void {
    this.windowService.window.location.href = '/';
  }
}
