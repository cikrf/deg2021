import { Injectable } from '@angular/core';

export function normalizeCommonJSImport<T>(
  importPromise: Promise<T>,
): Promise<T> {
  return importPromise.then((m: any) => (m.default || m) as T);
}

export function GostCryptoFactory(): Promise<any> {
  return normalizeCommonJSImport(
    // @ts-ignore
    import(/* webpackChunkName: "gost-crypto" */ 'gost-crypto'),
  );
}

export function GostEngineFactory(): Promise<any> {
  return normalizeCommonJSImport(
    // @ts-ignore
    import(/* webpackChunkName: "gost-engine" */ 'gost-crypto/lib/gostEngine'),
  );
}

@Injectable({
  providedIn: 'root',
})
export class CryptoLoaderService {

  public crypto: Crypto & any;
  public engine: any;

  async invoke(): Promise<void> {
    [this.crypto, this.engine] = await Promise.all([
      GostCryptoFactory(),
      GostEngineFactory(),
    ]);
  }
}

export function CryptoLoaderFactory(service: CryptoLoaderService): () => Promise<void> {
  return () => service.invoke();
}
