export const isPositiveInteger = (num: string | number, allowZero = false): num is number => {
  if (typeof num !== 'number') {
    return false
  }
  return !isNaN(num) && Number.isInteger(num) && Number.isFinite(num) && (num > 0 || allowZero && (num === 0))
}
