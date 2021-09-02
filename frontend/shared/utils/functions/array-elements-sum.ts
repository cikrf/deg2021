export function arrayElementsSum(arr: Array<number>): number {
  return arr.reduce((acc, next) => {
    return acc + next;
  }, 0);
}
