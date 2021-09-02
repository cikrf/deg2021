import { Vote } from '@models/vote.interface';

/** TODO: Странное название, лучше сделать более понятное, чтоб все могли пользоваться и вынести в какой то другой хелпер, мб @gas/utils */
export function createEmptyVote(size: number): Vote {
  return new Array(size).fill(0);
}
