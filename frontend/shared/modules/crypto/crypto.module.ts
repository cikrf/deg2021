import { CommonModule } from '@angular/common';
import {
  algorithmKeyProvider,
  algorithmSignProvider,
  GostCryptoToken,
  gostCryptoTokenProvider,
  gostEngineTokenProvider
} from './gost-crypto.providers';
import { NgModule } from '@angular/core';
import { CryptoService } from './crypto.service';
import { BlindSignatureService } from './blind-signature.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    gostCryptoTokenProvider,
    gostEngineTokenProvider,
    algorithmKeyProvider,
    algorithmSignProvider,
    CryptoService,
    BlindSignatureService,
  ],
})
export class CryptoModule {}
