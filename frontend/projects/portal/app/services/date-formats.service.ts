import { Injectable } from '@angular/core';

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const MONTHS = [
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

@Injectable({
  providedIn: 'root',
})
export class DateFormatsService {

  public getShortDate(date: Date): string {
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  }

  public getFullDate(date: Date, separator: string = '-'): string {
    const minutes = date.getMinutes();
    return `${date.getHours()}${separator}${minutes < 10 ? '0' + minutes : minutes} ${this.getShortDate(date)} ${date.getFullYear()} года`;
  }

  public getFullDateStarts(date: Date): string {
    const minutes = date.getMinutes();
    const time = `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`;
    const dayWithMonth = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
    return `${dayWithMonth} ${date.getFullYear()} года в ${time}`;
  }

  public getDaysBetween(timestampFrom: number, timestampTo: number): number {
    return Math.round(
      ( this.getDayStartDate(timestampTo).getTime() - this.getDayStartDate(timestampFrom).getTime() ) / ONE_DAY_IN_MILLISECONDS,
    ) + 1;
  }

  private getDayStartDate(timestamp: number): Date {
    console.log(new Date(timestamp));
    const date = new Date(timestamp).getDate();
    const month = new Date(timestamp).getMonth() + 1;
    return new Date([
      new Date(timestamp).getFullYear(),
      month < 10 ? '0' + month : month,
      date < 10 ? '0' + date : date,
    ].join('-'));
  }

}
