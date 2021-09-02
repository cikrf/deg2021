import { Voting } from '@models/elections';
import { Seed } from '@models/seed';
import { CryptoCredentials } from '@models/elections/tba.model';

export namespace KeyGeneration {
  export class Meta {
    public votingId: Voting['id'];
    public seed: Seed;
    public credentials: CryptoCredentials;
    public maskedPublicKey?: string;
  }
}
