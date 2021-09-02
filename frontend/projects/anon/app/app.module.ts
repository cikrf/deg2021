import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CryptoModule } from '@modules/crypto/crypto.module';
import { UiKitModule } from '@ui/ui-kit.module';
import { cryptoLoaderInitializer } from '@modules/crypto/crypto-loader.initializer';
import { TransferBetweenAppsModule } from '@modules/transfer-between-apps/transfer-between-apps.module';
import { IsPlatformBrowserProvider } from '@shared/providers/is-platform';
import { ModalPageModule } from './modals/modal-page.module';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';

import '../../../typing';
import { InitialComponent } from './initial.component';
import { ErrorPageComponent } from './pages/error/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    ErrorPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'deg' }),
    HttpClientModule,
    AppRoutingModule,
    CryptoModule,
    UiKitModule,
    TransferBetweenAppsModule.forApp(
      window.ENV.PORTAL_URL,
      window.ENV.PRODUCTION,
    ),
    ModalPageModule,
  ],
  providers: [
    cryptoLoaderInitializer,
    IsPlatformBrowserProvider,
    errorInterceptorProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
