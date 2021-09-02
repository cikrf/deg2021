import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalTokenService } from './services/universal-token.service';
import { AppRoutingEnum } from './app-routing.enum';
import { RouterService } from '../../../shared/services/router.service';
import { AcceptRulesGuard } from './guards/accept-rules.guard';
import { CheckupGuard } from './guards/checkup.guard';
import { AuthenticationService } from './services/authentication.service';

const routes: Routes = [
  {
    path: AppRoutingEnum.Election,
    pathMatch: 'full',
    loadChildren: () => import('./pages/election/election-page.module').then(module => module.ElectionPageModule),
    canActivate: [
      UniversalTokenService,
    ],
  },
  {
    path: AppRoutingEnum.Auth,
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/auth/auth-page.module').then(mod => mod.AuthPageModule),
  },
  {
    path: AppRoutingEnum.KeyGeneration,
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/key-generation/key-generation-page.module').then(module => module.KeyGenerationPageModule),
    canActivate: [
      UniversalTokenService,
      CheckupGuard,
      AuthenticationService,
      AcceptRulesGuard,
    ],
  },
  {
    path: AppRoutingEnum.Playground,
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/playground/playground-page.module').then(mod => mod.PlaygroundPageModule),
  },
  {
    path: AppRoutingEnum.Authentication,
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/authentication/authentication.module').then(mod => mod.AuthenticationModule),
    canActivate: [
      UniversalTokenService,
      AcceptRulesGuard,
    ],
  },
  {
    path: AppRoutingEnum.Support,
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/support/support-page.module').then(mod => mod.SupportPageModule),
    canActivate: [
      UniversalTokenService,
    ],
  },
  {
    path: AppRoutingEnum.Rules,
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/rules/rules.module').then(mod => mod.RulesModule),
    canActivate: [
      UniversalTokenService,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'legacy',
    onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(
    private routerService: RouterService,
  ) {
    this.routerService.init();
  }
}
