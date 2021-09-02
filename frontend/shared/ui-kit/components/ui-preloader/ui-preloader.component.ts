import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { BaseComponent } from '@cikrf/gas-utils/services/gas-dynamic-components.service';
import { isMobileAndBelow } from '@shared/helpers/adaptive.helper';

@Component({
  template: '&nbsp;',
  styleUrls: ['./ui-preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPreloaderComponent implements BaseComponent {
  public get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    /** Используется для динамичного создания компонента */
    public el: ElementRef,
    private renderer: Renderer2,
  ) {}

  public addClass(className: string): void {
    this.element.className = className;
  }

  public addAttribute(attribute: string): void {
    this.renderer.setAttribute(this.element, attribute, '');
  }

  public makePrimary(): void {
    this.element.classList.add('_primary');
  }

  public setHeight(height: number): void {
    this.renderer.setStyle(this.element, 'height', `${height}px`);
    this.renderer.setStyle(this.element, 'line-height', `${height}px`);
  }

  public setWidth(width: number): void {
    if (isMobileAndBelow()) {
      this.renderer.setStyle(this.element, 'width', '100%');
    } else {
      this.renderer.setStyle(this.element, 'width', `${width}px`);
    }
  }

  public initMultiLine(isLast: boolean): void {
    const style = window.getComputedStyle(this.element, null).getPropertyValue('font-size');
    const fontSize = parseFloat(style);

    this.renderer.setStyle(this.element, 'height', `${fontSize}px`);

    if (!isLast) {
      this.renderer.setStyle(this.element, 'margin-top', '0');
      this.renderer.setStyle(this.element, 'margin-bottom', '0');

      this.renderer.addClass(this.element, 'mb-sm');
    }
  }

  public initWidth(): void {
    this.renderer.setStyle(this.element, 'width', `${this.getRandomWidth()}%`);
  }

  private getRandomWidth(): number {
    const intervalStep = 30;
    const randomOffset = 1;
    const fullWidth = 100;

    /**
     * intervalStep Максимально возможное отклонение от 100% ширины
     * leftWidth Остаток
     */
    const intervalWidth = Math.floor(Math.random() * (intervalStep + randomOffset));

    return intervalWidth + (fullWidth - intervalStep);
  }
}
