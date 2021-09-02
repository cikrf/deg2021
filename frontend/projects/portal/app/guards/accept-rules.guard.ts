import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ACCEPT_RULES_STORAGE_KEY, RETURN_URL_QUERY_KEY } from '../constants';
import { AppRoutingEnum } from '../app-routing.enum';
import { WindowService } from '@modules/browser-services/window.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptRulesGuard implements CanActivate {

  constructor(
    private router: Router,
    private windowService: WindowService,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.windowService.window.sessionStorage.getItem(ACCEPT_RULES_STORAGE_KEY)) {
      return true;
    } else {
      this.router.navigate([
        AppRoutingEnum.Rules,
      ], { queryParams: { [RETURN_URL_QUERY_KEY]: state.url } }).then();
      return false;
    }
  }

}
