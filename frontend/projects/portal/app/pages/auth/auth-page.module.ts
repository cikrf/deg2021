import { NgModule } from '@angular/core';
import { AuthServicesModule } from './auth-services.module';
import { AuthComponentsModule } from './auth-components.module';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { UiKitModule } from '@ui/ui-kit.module';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';

@NgModule({
  imports: [
    AuthServicesModule,
    AuthComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        pathMatch: 'prefix',
      },
    ]),
    UiKitModule,
  ],
  providers: [
    errorInterceptorProvider,
  ],
})
export class AuthPageModule {}
