import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { KeyGenerationRoutingModule } from './key-generation-routing.module';
import { TransferBetweenAppsModule } from '@modules/transfer-between-apps/transfer-between-apps.module';
import { KeyGenerationComponent } from './key-generation/key-generation.component';
import { UiKitModule } from '@ui/ui-kit.module';
import { KeyGenerationErrorComponent } from './key-generation-error/key-generation-error.component';
import { KeyGenerationSuccessComponent } from './key-generation-success/key-generation-success.component';
import { KeyGenerationService } from './key-generation.service';
import { MockModule } from '@modules/mock/mock.module';
import { tokenInterceptorProvider } from '../../providers/token.interceptor';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';
import { BeforeKeyGenerationComponent } from './before-key-generation/before-key-generation.component';
const COMPONENTS = [
  KeyGenerationComponent,
  KeyGenerationErrorComponent,
  KeyGenerationSuccessComponent,
  BeforeKeyGenerationComponent,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    KeyGenerationRoutingModule,
    UiKitModule,
    TransferBetweenAppsModule.forApp(
      window.ENV.ANON_URL,
      window.ENV.PRODUCTION,
    ),
    MockModule,
  ],
  declarations: [
    COMPONENTS,
  ],
  exports: [
    COMPONENTS,
  ],
  providers: [
    tokenInterceptorProvider,
    errorInterceptorProvider,
    KeyGenerationService,
  ],
})
export class KeyGenerationPageModule {
}
