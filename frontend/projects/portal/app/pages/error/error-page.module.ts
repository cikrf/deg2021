import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@utils/pipes/pipes.module';
import { UiKitModule } from '@ui/ui-kit.module';
import { AppRoutingEnum } from '../../app-routing.enum';

@NgModule({
  declarations: [
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    RouterModule.forChild([
      {
        path: AppRoutingEnum.Error,
        pathMatch: 'prefix',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ErrorComponent,
          },
          {
            path: ':section',
            component: ErrorComponent,
          },
        ],
      },
    ]),
    TranslateModule,
    UiKitModule,
  ],
})
export class ErrorPageModule {

}
