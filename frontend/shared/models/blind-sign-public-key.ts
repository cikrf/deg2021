import { Expose } from 'class-transformer';

/**
 * @deprecated
 */
export class BlindSignPublicKey {
  @Expose()
  modulus: string;

  @Expose()
  publicExponent: string;

  @Expose()
  votingId: string;
}
