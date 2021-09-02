import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppRoutingEnum } from 'projects/portal/app/app-routing.enum';

/**
 * @description добавляет на страницу футер с фиксированным положением
 * @description прижатым к низу страницы. Футер адаптивный и подстраивается
 * @description под размеры страницы
 *
 * <ui-footer></ui-footer>
 */
@Component({
  selector: 'ui-footer',
  templateUrl: './ui-footer.component.html',
  styleUrls: ['./ui-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFooterComponent {
  @Input()
  public showSupport = true;

  public appRoutingEnum = AppRoutingEnum;
}
