import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UiError404PageComponent } from '@ui/components/ui-error-404-page/ui-error404-page.component';
import { UiError50xPageComponent } from '@ui/components/ui-error-50x-page/ui-error50x-page.component';

const routes: Routes = [
  {
    path: '404',
    pathMatch: 'prefix',
    component: UiError404PageComponent,
  },
  {
    path: '50x',
    pathMatch: 'prefix',
    component: UiError50xPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
