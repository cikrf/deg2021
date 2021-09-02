/**
 * Проверяет является ли значение на `undefined` и `null`.
 */
export function isNullish(value: any): boolean {
  return value === undefined || value === null;
}
