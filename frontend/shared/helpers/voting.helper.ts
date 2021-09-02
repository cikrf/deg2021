export function isBallotValid(checkedAnswers: number, maxMarks: number): boolean {
  return checkedAnswers === 0 || checkedAnswers > maxMarks;
}

export function addMillisecondsToTime(time: Date | number, milliseconds: number): Date {
  const copiedTime = new Date(time instanceof Date ? time.getTime(): time);
  copiedTime.setMilliseconds(copiedTime.getMilliseconds() + milliseconds);
  return copiedTime;
}
