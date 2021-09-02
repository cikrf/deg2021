import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiKitModule } from '@ui/ui-kit.module';

import { SupportPageComponent } from './support-page.component';
import { SupportInputComponent } from './components/support-input/support-input.component';
import { GasNotationPipeModule } from '@cikrf/gas-utils/pipes';
import { tokenInterceptorProvider } from '../../providers/token.interceptor';

@NgModule({
  declarations: [
    SupportPageComponent,
    SupportInputComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SupportPageComponent,
        data: {
          title: null,
          subtitle: null,
        },
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    UiKitModule,
    HttpClientModule,
    GasNotationPipeModule,
  ],
  providers: [
    errorInterceptorProvider,
    tokenInterceptorProvider,
  ],
})
export class SupportPageModule { }
