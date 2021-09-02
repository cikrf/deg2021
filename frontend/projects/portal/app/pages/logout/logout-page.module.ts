import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiKitModule } from '@ui/ui-kit.module';
import { RouterModule } from '@angular/router';
import { AppRoutingEnum } from '../../app-routing.enum';
import { LogoutComponent } from './logout.component';

@NgModule({
  declarations: [
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: AppRoutingEnum.Logout,
        pathMatch: 'full',
        component: LogoutComponent,
      },
    ]),
    UiKitModule,
  ],
})
export class LogoutPageModule {
}
