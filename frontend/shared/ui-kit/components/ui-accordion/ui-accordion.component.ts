import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ui-accordion',
  templateUrl: './ui-accordion.component.html',
  styleUrls: ['./ui-accordion.component.scss'],
  host: {
    '[class.ui-accordion]': `true`,
    '[class.ui-accordion--light]': `type === 'light'`,
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAccordionComponent implements AfterViewInit {
  @Output('onClicked')
  public onClicked = new EventEmitter<boolean>();

  @Input()
  public title: string;

  @Input()
  public iconVisible = true;

  @Input()
  public type: 'default' | 'light' = 'default';

  @Input()
  public ariaId: string;

  @HostBinding('class.ui-accordion--with-description')
  public hasDescription = false;

  @HostBinding('class.ui-accordion--opened')
  public opened = false;

  @ViewChild('description')
  public description: ElementRef;

  public ngAfterViewInit(): void {
    this.hasDescription = this.description?.nativeElement.hasChildNodes();
  }
}
