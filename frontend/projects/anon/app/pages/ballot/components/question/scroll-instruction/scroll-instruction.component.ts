import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';
import { ScrollInstructionType } from './scroll-instruction.enum';

@Component({
  selector: 'app-scroll-instruction',
  templateUrl: './scroll-instruction.component.html',
  styleUrls: ['./scroll-instruction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollInstructionComponent implements AfterViewInit {
  @Input()
  public type: ScrollInstructionType = ScrollInstructionType.Scroll;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.addClass(this.elementRef.nativeElement, '_show-instruction');
    });
  }

  public close(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, '_show-instruction');
  }
}
