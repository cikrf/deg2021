import { ModuleWithProviders, NgModule } from '@angular/core';
import { TransferBetweenAppsService } from '@modules/transfer-between-apps/transfer-between-apps.service';
import { ApplicationUrlToken, IsProductionToken } from '@modules/transfer-between-apps/transfer-between-apps.tokens';
import { CryptoModule } from '@modules/crypto/crypto.module';
import { IsPlatformBrowserProvider } from '../../providers/is-platform';
import { BrowserTransferStateModule } from '@angular/platform-browser';


@NgModule({
  imports: [
    CryptoModule,
    BrowserTransferStateModule,
  ],
  providers: [
    TransferBetweenAppsService,
  ],
})
export class TransferBetweenAppsModule {

  static forApp(
    applicationUrl: string,
    production: boolean = false,
  ): ModuleWithProviders<TransferBetweenAppsModule> {
    return {
      ngModule: TransferBetweenAppsModule,
      providers: [
        IsPlatformBrowserProvider,
        {
          provide: ApplicationUrlToken,
          useValue: applicationUrl,
        },
        {
          provide: IsProductionToken,
          useValue: production,
        },
      ],
    };
  }
}
