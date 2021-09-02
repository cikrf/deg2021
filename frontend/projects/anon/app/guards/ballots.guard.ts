import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BallotsQuery } from '@state/ballots/ballots.query';

@Injectable({
  providedIn: 'root',
})
export class BallotsGuard implements CanActivate {
  constructor(
    private ballotsQuery: BallotsQuery,
    private router: Router,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const ballotId: string = route.params['id'];
    if (!ballotId || !this.ballotsQuery.hasEntity(ballotId) || ballotId !== this.ballotsQuery.getActiveId()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
