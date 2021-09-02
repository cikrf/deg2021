import { Inject, Injectable } from '@angular/core';
import { A11y } from '@ui/modules/ui-a11y/ui-a11y.namespace';
import { BehaviorSubject } from 'rxjs';
import { APP_IS_PLATFORM_BROWSER } from '../../../providers/is-platform';

const STORAGE_KEY = '__ally_mem';
const SEPARATOR = '//';

// TODO: отрефакторить
@Injectable({ providedIn: 'root' })
export class UiA11yService {
  private htmlRoot = this.isPlatformBrowser ? document.documentElement : null;
  public isEyePanelOpen$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(APP_IS_PLATFORM_BROWSER) private isPlatformBrowser: boolean,
  ) {
  }

  public openEyePanel(): void {
    this.isEyePanelOpen$.next(true);
    this.restoreClasses();
  }

  public closePanel(): void {
    this.isEyePanelOpen$.next(false);
  }

  public clearAll(): void {
    this.removeBodyClasses();
    this.saveSettings();
  }

  public getSettings(): string {
    return window.localStorage.getItem(STORAGE_KEY) || '';
  }

  public getCurrentClasses(): string[] {
    return Object.values(A11y.Classes).filter(className => this.htmlRoot?.classList.contains(className));
  }

  public restoreClasses(): void {
    const savedClasses = this.getSettings();
    const restoredClasses = !savedClasses ? [] : savedClasses.split(SEPARATOR);
    this.setBodyClasses(restoredClasses);
  }

  public saveSettings(classes: string[] = []): void {
    window.localStorage.setItem(STORAGE_KEY, classes.join(SEPARATOR));
  }

  public setSettings(settings: string): void {
    this.saveSettings(settings.split(SEPARATOR));
    this.restoreClasses();
  }

  public setBodyClasses(classes: string[]): void {
    if (!classes.length) {
      return;
    }
    this.htmlRoot?.classList.add(...classes);
    this.saveSettings(this.getCurrentClasses());
  }

  public removeBodyClasses(classes?: string[]): void {
    if (!classes || !classes.length) {
      classes = Object.values(A11y.Classes);
    }
    this.htmlRoot?.classList.remove(...classes);
    this.saveSettings(this.getCurrentClasses());
  }

}
