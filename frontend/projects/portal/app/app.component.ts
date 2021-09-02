import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ErrorHandler,
  HostListener,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { HeaderService } from '@services/header.service';
import { AuthService } from './shared/services/auth.service';
import { UniversalTokenService } from './services/universal-token.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { WindowService } from '@modules/browser-services/window.service';
import { AppRoutingEnum } from './app-routing.enum';
import { LogoutComponent } from './pages/logout/logout.component';
import { UiA11yService } from '@ui/modules/ui-a11y/ui-a11y.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {

  @ViewChild('logoutRef')
  public logoutTemplate: TemplateRef<HTMLElement>;

  @ViewChild('logoutEmptyRef')
  public logoutEmptyTemplate: TemplateRef<HTMLElement>;

  public appRoutingEnum = AppRoutingEnum;

  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private universalTokenService: UniversalTokenService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private windowService: WindowService,
    private uiA11yService: UiA11yService,
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
    ).subscribe(() => setTimeout(() => this.windowService.scrollToTop(), 0));
    this.uiA11yService.restoreClasses();
  }

  public onActivate($transferedComponent: any) {
    if ($transferedComponent instanceof LogoutComponent) {
      this.headerService.setMetadata({ title: undefined });
      this.setLogoutTemplate(this.logoutEmptyTemplate);
      return;
    }
    this.setLogoutTemplate(this.logoutTemplate);
  }

  public ngAfterViewInit(): void {
    this.setLogoutTemplate(this.logoutTemplate);
  }

  private setLogoutTemplate(tpl: TemplateRef<HTMLElement>) {
    this.headerService.setSubheaderTemplateRef(tpl);
  }
}
