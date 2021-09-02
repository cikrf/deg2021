import { InjectionToken, Provider } from '@angular/core';
import { CryptoLoaderService } from './crypto-loader.service';
import { AlgorithmName } from '@modules/crypto/interfaces/algorithm.interface';

export const AlgorithmKeyToken = new InjectionToken('ALGO_KEY');
export const AlgorithmSignToken = new InjectionToken('ALGO_SIGN');

export const GostCryptoToken = new InjectionToken('GOST_CRYPTO');
export const GostEngineToken = new InjectionToken('GOST_ENGINE');

export const gostCryptoTokenProvider: Provider = {
  provide: GostCryptoToken,
  useFactory: (service: CryptoLoaderService): any => service.crypto,
  deps: [CryptoLoaderService],
};

export const gostEngineTokenProvider: Provider = {
  provide: GostEngineToken,
  useFactory: (service: CryptoLoaderService): any => service.engine,
  deps: [CryptoLoaderService],
};

export const algorithmKeyProvider: Provider = {
  provide: AlgorithmKeyToken,
  useValue: {
    keySize: 32,
    length: 256,
    mode: 'SIGN',
    name: AlgorithmName.GOST3410,
    procreator: 'CP',
    version: 2012,
  },
};

export const algorithmSignProvider: Provider = {
  provide: AlgorithmSignToken,
  useValue: {
    name: AlgorithmName.GOST3410,
    version: 2012,
    mode: 'SIGN',
    length: 256,
    procreator: 'CP',
    keySize: 32,
    namedCurve: 'S-256-A',
    hash:
      {
        name: AlgorithmName.GOST3411,
        version: 2012,
        mode: 'HASH',
        length: 256,
        procreator: 'CP',
        keySize: 32
      },
    id: 'id-tc26-gost3410-12-256'
  },
};
