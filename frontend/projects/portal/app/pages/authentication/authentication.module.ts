import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UiKitModule } from '@ui/ui-kit.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';
import { GasNotationPipeModule } from '@cikrf/gas-utils/pipes';
import { AuthenticationComponent } from './authentication.component';

@NgModule({
  declarations: [
    AuthenticationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiKitModule,
    AuthenticationRoutingModule,
    GasNotationPipeModule,
  ],
  providers: [
    errorInterceptorProvider,
  ],
})
export class AuthenticationModule {}
