import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { cryptoLoaderInitializer } from '@modules/crypto/crypto-loader.initializer';
import { tokenInterceptorProvider } from './providers/token.interceptor';
import { appBaseHrefProvider } from '@cikrf/gas-utils/providers';
import { UiKitModule } from '@ui/ui-kit.module';
import { MockModule } from '@modules/mock/mock.module';
import { CheckupService } from '@services/checkup.service';
import { CryptoModule } from '@modules/crypto/crypto.module';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';

import '../../../typing';
import { IsPlatformBrowserProvider } from '../../../shared/providers/is-platform';

import { ErrorPageModule } from './pages/error/error-page.module';
import { LogoutPageModule } from './pages/logout/logout-page.module';

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    UiKitModule,
    MockModule,
    CryptoModule,
    ErrorPageModule,
    LogoutPageModule,
  ],
  providers: [
    appBaseHrefProvider,
    tokenInterceptorProvider,
    errorInterceptorProvider,
    cryptoLoaderInitializer,
    IsPlatformBrowserProvider,
    CheckupService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
