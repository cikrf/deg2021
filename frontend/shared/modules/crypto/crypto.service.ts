import { Inject, Injectable } from '@angular/core';
import { AlgorithmKeyToken, AlgorithmSignToken, GostCryptoToken, GostEngineToken } from './gost-crypto.providers';
import { plainToClass } from 'class-transformer';
import { Seed } from '@models/seed';
import { AlgorithmName, IAlgorithm } from '@modules/crypto/interfaces/algorithm.interface';
import { CryptoCredentials } from '@models/elections/tba.model';

export function convertKey(
  algorithm: any, // todo algorithm interface
  extractable: boolean,
  keyUsages: [string] | null,
  keyData: ArrayBuffer,
  keyType: string,
): any {
  return {
    type: keyType || (algorithm.name === AlgorithmName.GOST3410 ? 'private' : 'secret'),
    extractable: extractable || 'false',
    algorithm,
    usages: keyUsages || [],
    buffer: keyData
  };
}


export function intToBytes(x: any): any {
  const bytes = [];
  let i = 8;
  do {
    // tslint:disable-next-line:no-bitwise
    bytes[--i] = x & (255);
    // tslint:disable-next-line:no-bitwise
    x = x >> 8;
  } while (i);
  return bytes;
}

export function concatUint8Arrays(...args: any[]): Uint8Array {
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  if (args.length < 2) {
    throw new Error('Two or more Uint8Array are expected');
  }
  if (!(args.every((arg) => arg instanceof Uint8Array))) {
    throw new Error('One of arguments is not a Uint8Array');
  }
  const count = args.length;
  const sumLength = args.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(sumLength);
  let curLength = 0;
  for (let j = 0; j < count; j++) {
    result.set(args[j], curLength);
    if (j !== count - 1) {
      curLength += args[j].length;
    }
  }
  return result;
}

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  private keyAlgorithm = 'GOST R 34.11-PBKDF2';
  private derivedKeyType = 'GOST 28147';
  private encryptAlgorithm = 'GOST 28147-CFB';

  constructor(
    @Inject(GostCryptoToken) private crypto: Crypto & any,
    @Inject(GostEngineToken) private gostEngine: any,
    @Inject(AlgorithmKeyToken) private algoKey: IAlgorithm,
    @Inject(AlgorithmSignToken) private algoSign: IAlgorithm,
  ) {

  }

  public toBase64(input: Uint8Array): string {
    return this.crypto.coding.Base64.encode(input);
  }

  public fromBase64(input: string): Uint8Array {
    return this.crypto.coding.Base64.decode(input);
  }

  // Сережа попросил добавить комментов, чтобы было понятно что тут происходит, но это не так просто как кажется
  // Проще оставить ссылку на доку https://web.archive.org/web/20191226090605/http://gostcrypto.com/example-encrypt.html
  public async encrypt(
    content: string,
    password: Uint8Array,
    salt: Uint8Array,
  ): Promise<string> {
    const deriveKey = await this.getDeriveKey(password, salt, ['encrypt']);
    const data = await this.crypto.subtle.encrypt(
      this.encryptAlgorithm,
      deriveKey,
      this.crypto.coding.Chars.decode(content, 'utf8'),
    );
    return this.crypto.coding.Base64.encode(data);
  }

  public async createHmac(
    content: string,
    password: Uint8Array,
    salt: Uint8Array,
  ): Promise<string> {
    const data = this.crypto.coding.Base64.decode(content);
    const signKey = await this.getDeriveKey(
      password,
      this.streebog256(salt),
      ['sign'],
    );
    const hmac = await this.crypto.subtle.sign('GOST R 34.11-HMAC', signKey, data);
    return this.crypto.coding.Base64.encode(hmac);
  }

  // Сережа попросил добавить комментов, чтобы было понятно что тут происходит, но это не так просто как кажется
  // Проще оставить ссылку на доку https://web.archive.org/web/20191226090605/http://gostcrypto.com/example-encrypt.html
  public async decrypt(
    content: string,
    password: Uint8Array,
    salt: Uint8Array,
    hmac?: string,
  ): Promise<string> {
    let message = '';
    try {
      const deriveKey = await this.getDeriveKey(password, salt, false);
      const source = this.crypto.coding.Base64.decode(content);
      message = await this.crypto.subtle.decrypt(this.encryptAlgorithm, deriveKey, source);
      if (hmac) {
        const verifyKey = await this.getDeriveKey(
          password,
          this.streebog256(salt),
          ['verify'],
        );
        const verified = await this.crypto.subtle.verify(
          'GOST R 34.11-HMAC',
          verifyKey,
          this.crypto.coding.Base64.decode(hmac),
          source,
        );
        if (!verified) {
          throw new Error('HMAC Verify Error');
        }
      }
      message = this.crypto.coding.Chars.encode(message, 'utf8');
      return message;
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  public createRandom(length: number = 256): Uint8Array {
    const random = new Uint8Array(length);
    this.crypto.getRandomValues(random);
    return random;
  }

  public createSeed(bytes: Uint8Array = this.createRandom()): Seed {
    const seedHash = this.buildSeedHash(bytes);
    const keys = this.generateKey(seedHash);
    const publicKey = new Uint8Array(keys.publicKey);
    const privateKey = new Uint8Array(keys.privateKey);
    return plainToClass(Seed, {
      publicKey,
      privateKey,
    });
  }

  public createCredentials(): CryptoCredentials {
    return plainToClass(CryptoCredentials, {
      password: this.createRandom(64), // todo сделать длиннее?
      salt: this.createRandom(8), // todo сделать длиннее?
    });
  }

  // todo functions
  public buildSeedHash(seedBytes: Uint8Array): Uint8Array {
    const nonce = new Uint8Array(intToBytes(0));
    const seedBytesWithNonce = concatUint8Arrays(nonce, seedBytes);
    return this.streebog256(seedBytesWithNonce);
  }


  // todo functions
  public streebog256(data: Uint8Array | string): Uint8Array {
    const digest = this.gostEngine.getGostDigest({name: AlgorithmName.GOST3411});
    return new Uint8Array(digest.digest(data));
  }

  // todo functions
  public generateKey(ukm: Uint8Array): {
    publicKey: ArrayBuffer;
    privateKey: ArrayBuffer;
  } {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const GostSign = this.gostEngine.getGostSign({...this.algoSign, ukm});
    const keys = GostSign.generateKey();
    const privateKeyObject = convertKey(this.algoKey, false, null, keys.privateKey, 'private');
    const publicKeyObject = convertKey(this.algoKey, false, null, keys.publicKey, 'public');
    return {
      publicKey: this.exportKey('raw', publicKeyObject),
      privateKey: this.exportKey('raw', privateKeyObject),
    };
  }


  // todo functions
  public exportKey(format: string, key: any): ArrayBuffer {
    let encodeKey = null;
    switch (format) {
      case 'spki':
        encodeKey = this.crypto.asn1.GostSubjectPublicKeyInfo.encode(key);
        break;
      case 'pkcs8':
        encodeKey = this.crypto.asn1.GostPrivateKeyInfo.encode(key);
        break;
      case 'raw':
        encodeKey = key.buffer;
        break;
    }
    if (encodeKey) {
      return encodeKey;
    } else {
      throw new Error('Key format not supported');
    }
  }

  // Сережа попросил добавить комментов, чтобы было понятно что тут происходит, но это не так просто как кажется
  // Проще оставить ссылку на доку https://web.archive.org/web/20191226090605/http://gostcrypto.com/example-encrypt.html
  private getDeriveKeyAlgorithm(salt: Uint8Array): Partial<Pbkdf2Params> {
    return {
      name: this.keyAlgorithm,
      // hash: this.keyAlgorithm,
      salt,
      iterations: 1000,
    };
  }

  // Сережа попросил добавить комментов, чтобы было понятно что тут происходит, но это не так просто как кажется
  // Проще оставить ссылку на доку https://web.archive.org/web/20191226090605/http://gostcrypto.com/example-encrypt.html
  private async getDeriveKey(password: Uint8Array, salt: Uint8Array, usage: boolean | KeyUsage[]): Promise<CryptoKey> {
    let keyUsages: KeyUsage[];
    if (typeof usage === 'boolean') {
      keyUsages = usage ? ['encrypt', 'sign'] : ['decrypt', 'verify'];
    } else {
      keyUsages = usage;
    }
    const passwordKey = await this.getPasswordKey(password);

    return await this.crypto.subtle.deriveKey(
      this.getDeriveKeyAlgorithm(salt),
      passwordKey,
      this.derivedKeyType,
      true,
      keyUsages,
    );
  }

  // Сережа попросил добавить комментов, чтобы было понятно что тут происходит, но это не так просто как кажется
  // Проще оставить ссылку на доку https://web.archive.org/web/20191226090605/http://gostcrypto.com/example-encrypt.html
  private getPasswordKey(password: Uint8Array): Promise<CryptoKey> {
    return this.crypto.subtle.importKey(
      'raw',
      password,
      this.keyAlgorithm,
      true,
      [
        'deriveKey',
      ],
    );
  }
}
