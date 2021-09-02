import * as moment from 'moment'

export const getDateFromStr = (str: string) => {
  return moment(str, 'DD-MM-YYYY hh:mm:ss').utc(true).toDate()
}

export function isDateInstance(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.valueOf())
}

export function getDateString(date: Date, dateFormat = 'DD-MM-YYYY HH:mm:ss') {
  return moment.utc(date).format(dateFormat)
}
