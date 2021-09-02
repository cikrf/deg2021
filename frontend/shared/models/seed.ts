import { default as base58 } from '@utils/libs/base58.lib';
import { Transform, TransformationType } from 'class-transformer';

// todo а надо ли нам вообще Uint8Array?
export class Seed {

  @Transform((value, plain, type: TransformationType) => {
    if (plain.privateKey instanceof Uint8Array) {
      return base58.encode(plain.privateKey);
    }
    return plain.privateKey;
  })
  public privateKey: string;

  @Transform((value, plain, type: TransformationType) => {
    if (plain.privateKey instanceof Uint8Array) {
      return base58.encode(plain.publicKey);
    }
    return plain.publicKey;
  })
  public publicKey: string;

  constructor() {}

}
