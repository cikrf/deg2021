import { Expose, Type } from 'class-transformer';
import { Voting } from '../elections';
import { IsUUID } from 'class-validator';
import BN from 'bn.js';

export class BlindSignPublicKey {

  @Expose()
  public modulus: string;

  @Expose()
  public publicExponent: string;

  @IsUUID()
  @Expose()
  public votingId: Voting['id'];

  @Expose()
  public contractId: string;
}

export type MainKey = string;

export class BlindSign {

  @Expose()
  public blindSign: string;

  @Expose()
  public contractId: string;

  @Expose()
  public id: Voting['id'];

  @Expose()
  public mainKey: MainKey;
}
