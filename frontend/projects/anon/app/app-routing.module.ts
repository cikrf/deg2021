import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouterService } from '@services/router.service';
import { BallotsGuard } from './guards/ballots.guard';
import { InitialComponent } from './initial.component';
import { ErrorPageComponent } from './pages/error/error-page.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: InitialComponent,
  },
  {
    path: 'error/:state',
    pathMatch: 'full',
    component: ErrorPageComponent,
  },
  {
    path: ':id',
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/ballot/ballot-page.module').then(m => m.BallotPageModule),
    canActivate: [
      BallotsGuard,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(
    private routerService: RouterService,
  ) {
    this.routerService.init();
  }
}
