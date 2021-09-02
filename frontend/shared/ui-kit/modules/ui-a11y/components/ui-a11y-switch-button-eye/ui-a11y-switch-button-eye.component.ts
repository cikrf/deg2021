import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-a11y-switch-button-eye',
  templateUrl: './ui-a11y-switch-button-eye.component.html',
  styles: [`
    button {
      box-shadow: none !important;
      border: 0;
      border-radius: 0;
      flex: 0 0 auto;
      display: inline-flex;
      padding: 0;
      font: inherit;
      background: none transparent;
      white-space: nowrap;
    }
  `],
})
export class UiA11ySwitchButtonEyeComponent {

  @Input() public id: any;

  @Input() public allyActive: boolean;

  @Output('callback')
  public callback$ = new EventEmitter<void>();

  public onClick(): void {
    this.callback$.emit();
  }

}
