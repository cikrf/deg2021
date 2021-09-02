import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { GasInputBoolean, NgOnInit } from '@cikrf/gas-utils/decorators';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TimeService } from '../../../services/time.service';
import { UiIcon } from '../ui-icons/ui-icons.namespace';

/**
 * Компонент для отображения остатка времени
 * Необходимо передать время окончания и текущее время
 * Далее данный компонент выведет вам остаток времени в нужном формате
 *
 * ВАЖНО, время сам компонент не уменьшает, время нужно вычитать самому
 *
 * Имеет следующие инпуты:
 *
 * @param startTime number, время начала, передаем в цифре, если оно есть, то таймер будет интервальный
 * @param endTime number, время окончания, передаем в цифре
 * @param interval number, период обновления таймера в секундах
 * @param type тип, имеется три варианта - default / success / error в зависимости от этого будет разный цвет у времени
 * @param centered boolean, флаг, обозначающий, центрировать контент или нет
 *
 * @param onHideTimer output, сигнализирует об окончании времени таймера
 */

const ONE_MINUTE = 60000;
const STOP_TIMER = 1000;

@Component({
  selector: 'ui-timer',
  templateUrl: './ui-timer.component.html',
  styleUrls: ['./ui-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._success]': `type === 'success'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._error]': `type === 'error'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._vertical]': `alignType === 'vertical'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.content_success]': `contentType === 'success'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._horizontal]': `alignType === 'horizontal'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class._horizontal-reverse]': `alignType === 'horizontal-reverse'`,
  },
})
export class UiTimerComponent {
  @Output('onHideTimer')
  public onHideTimer$ = new EventEmitter<void>();

  @NgOnInit()
  public init$!: Observable<void>;

  @Input()
  public startTime: number | Date = 0;

  // TODO: привести все переменные времени к одному формату именования
  @Input()
  public endTime: number | Date = 0;

  @Input()
  public interval = 1000;

  @GasInputBoolean()
  @Input()
  public loading = false;

  @Input()
  public type: 'default' | 'success' | 'error' = 'default';

  @Input()
  public contentType: 'default' | 'success' = 'default';

  @Input()
  public alignType: 'vertical' | 'horizontal' | 'horizontal-reverse' = 'vertical';

  @Input()
  public descriptionIcon: UiIcon.Icons = UiIcon.Base.BaseWatch;

  @HostBinding('class._centered')
  @GasInputBoolean()
  @Input()
  public centered = false;

  public lessMinutes$ = new BehaviorSubject<boolean>(false);

  public actualTime$ = this.init$
    .pipe(
      switchMap(() => this.timeService.createTimer(this.interval)),
      tap((time: number) => {
        if (+this.endTime - time < ONE_MINUTE) {
          this.lessMinutes$.next(true);
        }

        if (+this.endTime - time < STOP_TIMER) {
          this.onHideTimer$.emit();
        }
      }),
    );

  public get startTimeTimestamp(): number {
    return new Date(this.startTime).getTime();
  }

  public get endTimeTimestamp(): number {
    return new Date(this.endTime).getTime();
  }

  constructor(
    private timeService: TimeService,
  ) { }

  public getIntervalText(): string {
    const monthEnding = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    const fromDate = typeof this.startTime === 'number'
      ? new Date(this.startTime)
      : this.startTime;

    const endDate = typeof this.endTime === 'number'
      ? new Date(this.endTime)
      : this.endTime;



    /** From */
    const fromDay = fromDate.getDate();
    const fromMonth = monthEnding[fromDate.getMonth()];
    const fromTimeString = fromDate.toTimeString().split(':');
    const fromHoursAndMinutes = `${fromTimeString[0]}:${fromTimeString[1]}`;
    const fromText = `с ${fromDay} ${fromMonth} c ${fromHoursAndMinutes} по`;

    /** End */
    const endDay = endDate.getDate();
    const endMonth = monthEnding[endDate.getMonth()];
    const endTimeString = endDate.toTimeString().split(':');
    const endHoursAndMinutes = `${endTimeString[0]}:${endTimeString[1]}`;
    const endText = `${endDay} ${endMonth} c ${endHoursAndMinutes}
    по московскому времени`;

    return `${fromText}
    ${endText}`;
  }

  public isDefault(): boolean {
    return this.alignType === 'vertical' || this.alignType === 'horizontal';
  }

  public isHorizontalReverse(): boolean {
    return this.alignType === 'horizontal-reverse';
  }

  public isVertical(): boolean {
    return this.alignType === 'vertical';
  }

  public getLines(): number {
    return this.isVertical() ? 1 : 3;
  }
}
