import { Pipe, PipeTransform } from '@angular/core';
import { GasNotationPipe } from '@cikrf/gas-utils/pipes';

/**
 * Данная пайпа предназначена для отображения остатка времени
 * Пайпу необходимо применить к timestamp и передать текущее время
 * Далее указать формат, если нужен и все
 *
 * Варианты форматов:
 * short - 2д 6ч 30м 14с
 * long - 5 дней 16 часов 32 минуты
 * time 05:15:03 (часы, минуты, секунды)
 *
 * @example {{ election?.endDate | gasTimeInterval : actualTime }}
 * @deprecated поправить в `@cikrf-utils`
 */
@Pipe({
  name: 'uiTimeInterval',
})
export class UiTimeIntervalPipe implements PipeTransform {
  constructor(
     private gasNotationPipe: GasNotationPipe,
  ) {}

  public transform(
    endDate: number,
    currentDate: number = new Date().getTime(),
    format: 'short' | 'long' | 'time' | string = 'long',
  ): string {
    const interval = endDate - currentDate;

    if (interval <= 0 || !currentDate) {
      return '00:00';
    }

    let diff = Math.ceil(interval / 1000);

    /** получаем количество дней */
    const days = Math.floor(diff / (60 * 60 * 24));
    diff = diff % (60 * 60 * 24);

    /** получаем количество часов */
    const hours = Math.floor(diff / (60 * 60));
    diff = diff % (60 * 60);

    /** получаем минуты */
    const minutes = Math.floor(diff / 60);
    diff = diff % 60;

    /** получаем секунды */
    const seconds = diff;

    return this.currentDateFormat(days, hours, minutes, seconds, format);
  }

  /** Возвращаем дату в нужном формате */
  private currentDateFormat(days: number, hours: number, minutes: number, seconds: number, format: string): string {
    const daysNotation = this.gasNotationPipe.transform(days, ['день', 'дня', 'дней']);
    const hoursNotation = this.gasNotationPipe.transform(hours, ['час', 'часа', 'часов']);
    const minutesNotation = this.gasNotationPipe.transform(minutes, ['минута', 'минуты', 'минут']);

    switch (format) {
      case 'short':
        return `
          ${days > 0 ? days + 'д ' : ''}
          ${hours ? this.addZero(hours) + 'ч ' : ''}
          ${minutes ? this.addZero(minutes) + 'м ' : ''}
          ${seconds ? this.addZero(seconds) + 'с ' : ''}
        `;
      case 'long':
        return `
          ${days > 0 ? `${days} ${daysNotation}` : ''}
          ${hours ? `${hours} ${hoursNotation}` : ''}
          ${minutes ? `${minutes} ${minutesNotation}` : ''}
        `;
      case 'time':
        return `
          ${hours ? `${this.addZero(hours)}` : '00'}:
          ${minutes ? `${this.addZero(minutes)}` : '00'}:
          ${seconds ? `${this.addZero(seconds)}` : '00'}
        `;
      default:
        return `
          ${days > 0 ? `${days} ${daysNotation}` : ''}
          ${hours ? `${days > 0 ? this.addZero(hours) : hours} ${hoursNotation}` : ''}
          ${minutes ? `${this.addZero(minutes)} ${minutesNotation}` : ''}
        `;
    }
  }

  /** Добавляем ноль перед числом, если оно меньше 10 */
  private addZero(data: number): string {
    const date: string = data < 10 ? '0' +  data : data.toString();

    return date;
  }
}
