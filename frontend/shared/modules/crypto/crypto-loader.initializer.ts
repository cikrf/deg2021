import { APP_INITIALIZER, Provider } from '@angular/core';
import { CryptoLoaderFactory, CryptoLoaderService } from '@modules/crypto/crypto-loader.service';

export const cryptoLoaderInitializer: Provider = {
  provide: APP_INITIALIZER,
  useFactory: CryptoLoaderFactory,
  multi: true,
  deps: [
    CryptoLoaderService,
  ],
};
