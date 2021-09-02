import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

const ERROR_CODES = [500, 502, 503];

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  public context = this.router.getCurrentNavigation()?.extras.state;
  public code = ERROR_CODES.includes(this.context?.status) ? this.context?.status : 'other';

  public errorMap: Record<string, string> = {
    500: 'Внутренняя ошибка сервиса',
    502: 'Сервис не доступен',
    503: 'Сервис не доступен',
    other: 'Истекло время ожидания ответа сервиса',
  };

  constructor(
    private router: Router,
  ) { }
}
