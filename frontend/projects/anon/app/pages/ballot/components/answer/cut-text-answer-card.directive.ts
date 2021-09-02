import { AfterContentChecked, Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  //eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cutText]',
  exportAs: 'cutText',
})
export class CutTextAnswerCardDirective implements AfterContentChecked {
  @Input()
  public maxLines = 3;

  @HostBinding('class._opened')
  public isOpen = false;

  @HostBinding('style.height')
  public get height(): string {
    return this.isOpen ? 'auto' : `${this.styleHeight}px`;
  }

  @HostBinding('style.max-height.px')
  public get maxHeight(): number {
    return this.styleHeightContainer;
  }

  @HostBinding('class._cutted')
  public get cutted(): boolean {
    return this.isOpen ? true : this.scrollHeight > this.styleHeight;
  }

  private get scrollHeight(): number {
    return this.elementRef.nativeElement.scrollHeight;
  }

  private get styleHeight(): number {
    return this.styleHeightContainer === undefined
      ? this.getStyleHeightFromCoputedStyle()
      : this.styleHeightContainer;
  };

  private styleHeightContainer: number;

  constructor(
    private elementRef: ElementRef,
  ) { }

  public toggle(): void {
    if (!this.cutted) {
      return;
    }
    this.isOpen = !this.isOpen;
  }

  public ngAfterContentChecked(): void {
    if (!this.height) {
      setTimeout(() => this.styleHeightContainer = this.getStyleHeightFromCoputedStyle());
    }
  }

  private getStyleHeightFromCoputedStyle(): number {
    //eslint-disable-next-line
    return parseInt(getComputedStyle(this.elementRef.nativeElement).lineHeight) * this.maxLines;
  }
}
