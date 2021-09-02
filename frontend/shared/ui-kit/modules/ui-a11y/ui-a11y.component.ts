import { Component } from '@angular/core';
import { UiA11yService } from '@ui/modules/ui-a11y/ui-a11y.service';
import { A11y } from '@ui/modules/ui-a11y/ui-a11y.namespace';

// TODO: отрефакторить
@Component({
  selector: 'ui-a11y',
  templateUrl: './ui-a11y.component.html',
  styleUrls: ['./ui-a11y.component.scss'],
})
export class UiA11yComponent {

  constructor(
    private a11yService: UiA11yService,
  ) {
  }

  public isEyePanelOpen$ = this.a11yService.isEyePanelOpen$.asObservable();

  public readonly classTokens = A11y.Classes;

  public get bodyClasses(): string[] {
    return this.a11yService.getCurrentClasses();
  }

  public get isA11y(): boolean {
    return this.bodyClasses.length > 0;
  }

  public closePanel(): void {
    this.a11yService.closePanel();
  }

  public toggleState(): void {
    if (this.isA11y) {
      this.a11yService.clearAll();
    } else {
      this.a11yService.setBodyClasses([
        A11y.Classes.Grayscale,
        A11y.Classes.Fz100,
      ]);
    }
  }

  public addGrayScale(): void {
    this.a11yService.setBodyClasses([A11y.Classes.Grayscale]);
  }

  public cancelGrayScale(): void {
    this.a11yService.removeBodyClasses([A11y.Classes.Grayscale]);
  }

  public addFontSize100(): void {
    this.a11yService.removeBodyClasses([A11y.Classes.Fz50]);
    this.a11yService.setBodyClasses([A11y.Classes.Fz100]);
  }

  public addFontSize50(): void {
    this.a11yService.removeBodyClasses([A11y.Classes.Fz100]);
    this.a11yService.setBodyClasses([A11y.Classes.Fz50]);
  }

  public cancelFontSize(): void {
    this.a11yService.removeBodyClasses([A11y.Classes.Fz100, A11y.Classes.Fz50]);
  }

}
