import { Expose, plainToClass, Type } from 'class-transformer';
import { MainKey } from '@models/voting/blind-sign.model';
import { Ballot, Voting } from '@models/elections';
import { Seed } from '@models/seed';
import { DeepPartial } from '@utils/types/deep-partial.type';

export class VotingMeta {

  @Expose()
  public mainKey: MainKey;

  @Expose()
  public contractId: Voting['contractId'];

  @Expose()
  @Type(() => Ballot)
  public ballot: Ballot;

  @Expose()
  public votingId: Voting['id'];

  @Expose()
  public signature: string;

  @Expose()
  @Type(() => Seed)
  public seed: Seed;

  public get ballotId(): Ballot['id'] {
    return this.ballot.id;
  }

  constructor(plain: DeepPartial<VotingMeta>) {
    Object.assign(this, plainToClass(VotingMeta, plain));
  }

}
