import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Компонент предназначен для отображение списка не доступных браузеров
 */
@Component({
  selector: 'ui-unavailable-browser',
  templateUrl: './ui-unavailable-browser.component.html',
  styleUrls: ['./ui-unavailable-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiUnavailableBrowserComponent {
}
