/* tslint:disable:max-line-length no-bitwise */
import { Injectable } from '@angular/core';
import bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import * as jsbn from 'jsbn';
import { sha256 } from 'js-sha256';
import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { BlindSignPublicKey } from '@models/voting';
import BN from 'bn.js';
import { CryptoService } from '@modules/crypto/crypto.service';

export enum UintArrayType {
  Uint8Array = 8,
  Uint16Array = 16,
  Uint28Array = 28,
  Uint32Array = 32
}

// todo перепелить все красиво + избавиться от жирных либ: jsbn, big-integer, js-sha256

@Injectable({
  providedIn: 'root',
})
export class BlindSignatureService {

  constructor(
    private cryptoService: CryptoService,
  ) {}

  /** TODO: Точно ли нужен generic? */
  public sign<T>(
    message: string,
    publicKey: BlindSignPublicKey,
    signMethod: (message: string) => Observable<T>,
  ): Observable<[string, T]> {
    const random = this.randomByN(publicKey.modulus);
    const secret = this.applyBlindingLayer(publicKey, message, random).toString(16);
    return signMethod(secret).pipe(
      map((data: {blindSign: string} & T) => [
        this.extractBlindSign(
          data.blindSign,
          publicKey.modulus,
          random,
        ).toString(16),
        data,
      ]),
    );
  }

  private stringToBytes(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  private intToByteArray(num: number): ArrayBuffer {
    const arr = new Uint8Array([
      (num & 0xff000000) >> 24,
      (num & 0x00ff0000) >> 16,
      (num & 0x0000ff00) >> 8,
      (num & 0x000000ff),
    ]).reverse();
    return arr.buffer;
  }

  private FDH_padding(message: string, N: BigInteger, bitCount: number): BigInteger {
    if (bitCount % 256 !== 0) {
      throw new Error('Wrong bit count!!!');
    }

    const blockCount: number = bitCount / 256;
    const messageBytes: ArrayBuffer = this.stringToBytes(message);

    const buffer = new ArrayBuffer(512);
    const allBlocks = new Int8Array(buffer);

    for (let i = 0; i < blockCount - 1; i++) {
      const md = sha256.create();
      md.update(this.intToByteArray(i));
      md.update(messageBytes);
      allBlocks.set(md.digest(), i * 32);
    }

    let j = blockCount - 1;
    let res: BigInteger;

    do {
      const md = sha256.create();
      md.update(this.intToByteArray(j));
      md.update(messageBytes);
      allBlocks.set(md.digest(), 480);
      const hex = this.byteArrayToHexString(allBlocks);
      res = bigInt(hex, 16);
      j++;
    } while (N.compareTo(res) <= 0);

    return res;
  }

  private FDH2_padding(message: string, n: Buffer, bitCount: number = 4096): BN {
    if (bitCount % 256 !== 0) {
      throw new Error('Wrong bit count!!!');
    }
    if (n[0] % 0x80 === 0) {
      throw new Error('significant bit must be 1');
    }

    const messageBytes: Buffer = Buffer.from(message);

    const hashes = [];

    let iv = 0;
    const blockCount = bitCount / 256;
    const firstBlock = new BN(n.slice(0, 32));
    while (true) {
      const bytes = Buffer.from([...messageBytes, ...n, 1, iv]);
      const hash = this.cryptoService.streebog256(bytes);
      iv++;
      if (firstBlock.cmp(new BN(hash)) >= 0) {
        hashes[0] = hash;
        break;
      }
    }

    for (let i = 0; i < (blockCount - 1); i++) {
      const bytes = Buffer.from([...messageBytes, ...n, 0, iv + i]);
      const hash = this.cryptoService.streebog256(bytes);
      hashes.push(hash);
    }

    return new BN(Buffer.concat(hashes));
  }

  private byteArrayToHexString(data: Int8Array, littleEndian?: boolean, format?: boolean, uintArrayType?: UintArrayType): string {
    let result = '';
    const clazz = this.getArrayClass(data, uintArrayType);
    const v = new clazz(data.slice(0));
    if (littleEndian == null || !littleEndian) {
      v.reverse();
    }
    for (const b of v) {
      const bs = b.toString(16);
      result += (format ? ', (byte)0x' : '') + (bs.length < 2 ? '0' : '') + b.toString(16);
    }
    return result;
  }

  private getArrayClass(data: Int8Array, uintArrayType?: UintArrayType) {
    let clazz;
    switch (uintArrayType) {
      case UintArrayType.Uint32Array:
      case UintArrayType.Uint28Array:
        clazz = Uint32Array;
        break;
      case UintArrayType.Uint16Array:
        clazz = Uint16Array;
        break;
      case UintArrayType.Uint8Array:
        clazz = Uint8Array;
        break;
      default: {
        if (uintArrayType == null && data.byteLength) {
          clazz = Uint8Array;
        } else {
          throw new Error('Can\'t determine array class. Unknown data type: ' + data.constructor);
        }
      }
    }
    return clazz;
  }

  private getSignature(r: BigInteger, N: BigInteger, MaskedMessage: BigInteger): BigInteger {
    const jsbnBigInt = new jsbn.BigInteger(r.toString());
    const jsbbnN = new jsbn.BigInteger(N.toString());
    const jsbbnPaddedMessage = new jsbn.BigInteger(bigInt(MaskedMessage).toString());

    const Signature = jsbnBigInt.modInverse(jsbbnN).multiply(jsbbnPaddedMessage).mod(jsbbnN);
    return bigInt(Signature.toString());
  }

  private getMaskedMessage(r: BigInteger, e: BigInteger, N: BigInteger, PaddedMessage: BN): BigInteger {
    const jsbnBigR = new jsbn.BigInteger(r.toString());
    const jsbbnN = new jsbn.BigInteger(N.toString());
    const jsbbnE = new jsbn.BigInteger(e.toString());
    const jsbbnPaddedMessage = new jsbn.BigInteger(bigInt(PaddedMessage.toString()).toString());

    const MaskedMessage = jsbnBigR.modPow(jsbbnE, jsbbnN).multiply(jsbbnPaddedMessage).mod(jsbbnN);
    return bigInt(MaskedMessage.toString());
  }


  private randomByN(modulus: string): BigInteger {
    const n = bigInt(modulus, 16);
    return bigInt.randBetween(bigInt.zero, n.add(bigInt(-1))).mod(n);
  }

  private applyBlindingLayer(
    publicKey: BlindSignPublicKey,
    message: string,
    random: BigInteger,
  ): BigInteger {
    const n = bigInt(publicKey.modulus, 16);
    const e: BigInteger = bigInt(publicKey.publicExponent, 16);
    const paddedMessage = this.FDH2_padding(
      message,
      new BN(
        publicKey.modulus,
        'hex',
      ).toArrayLike(Buffer),
    );
    return this.getMaskedMessage(random, e, n, paddedMessage);
  }

  private extractBlindSign(blingSign: string, modulus: string, random: BigInteger): BigInteger {
    const n = bigInt(modulus, 16);
    return this.getSignature(random, n, bigInt(blingSign, 16));
  }
}
