import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UiKitModule } from '@ui/ui-kit.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import '../../../typing';
import { appBaseHrefProvider } from '@cikrf/gas-utils/providers';
import { tokenInterceptorProvider } from '../../portal/app/providers/token.interceptor';
import { errorInterceptorProvider } from '@shared/interceptor/error.interceptor.provider';
import { cryptoLoaderInitializer } from '@modules/crypto/crypto-loader.initializer';
import { IsPlatformBrowserProvider } from '../../../shared/providers/is-platform';
import { CheckupService } from '@services/checkup.service';
import { CryptoModule } from '@modules/crypto/crypto.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    UiKitModule,
    HttpClientModule,
    CryptoModule,
  ],
  providers: [
    appBaseHrefProvider,
    tokenInterceptorProvider,
    errorInterceptorProvider,
    cryptoLoaderInitializer,
    IsPlatformBrowserProvider,
    CheckupService,
    UiKitModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
