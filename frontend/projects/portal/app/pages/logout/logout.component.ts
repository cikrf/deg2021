import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UniversalTokenService } from '../../services/universal-token.service';
import { HeaderService } from '@services/header.service';
import { Location } from '@angular/common';

@Component({
  templateUrl: 'logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private location: Location,
    private universalTokenService: UniversalTokenService,
  ) {
  }

  public logout(): void {
    this.authService.logout().subscribe((url: string) => {
      this.universalTokenService.clearToken();
      window.location.href = url;
    });
  }

  public goBack(): void {
    this.location.back();
  }
}
