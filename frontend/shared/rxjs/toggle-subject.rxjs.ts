import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/** TODO: Перенести в @gas/utils */
export class ToggleSubject extends BehaviorSubject<boolean> {
  constructor(
    value: boolean,
  ) {
    super(value);
  }

  public toggle(withTimeout?: number): void {
    this.set(!this.value, withTimeout);
  }

  public set(value?: boolean | number, withTimeout?: number): void {

    if (value === undefined && withTimeout === undefined) {
      value = !this.value;
      withTimeout = 0;
    } else if (typeof value === 'number') {
      withTimeout = Number(value);
      value = !this.value;
    }

    of(value).pipe(
      delay(withTimeout || 0),
    ).subscribe(this.next.bind(this));
  }
}
