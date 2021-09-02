import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckupService } from '@services/checkup.service';

@Injectable({
  providedIn: 'root',
})
export class CheckupGuard implements CanActivate {
  constructor(
    private checkupService: CheckupService,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkupService.result();
  }
}
