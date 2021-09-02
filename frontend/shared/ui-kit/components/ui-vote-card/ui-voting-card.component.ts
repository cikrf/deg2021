import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * выводит на страницу заголовок и таймер
 *
 * @param title - заголовок
 * @param timerLabel - лэйбл для таймера
 * @param startDate - текущая дата
 * @param endDate - дата окончания
 * @param timerType - тип таймера (меняет цвет)
 * @param contentType - меняет цвет контента и иконки
 *
 * <ui-voting-card
 *    title="Голосание номер 1"
 *    timerLabel="Голосание началось"
 *    [startDate]="startDate"
 *    [endDate]="endDate"
 *    contentType="success"
 * >
 * </ui-voting-card>
 */

@Component({
  selector: 'ui-voting-card',
  templateUrl: './ui-voting-card.component.html',
  styleUrls: ['./ui-voting-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiVotingCardComponent {
  @Input()
  public title = '';

  @Input()
  public timerLabel = '';

  @Input()
  public startDate: Date;

  @Input()
  public endDate: Date;

  @Input()
  public timerType = 'default';

  @Input()
  public contentType = 'default';
}
