import { Seed } from '@models/seed';
import { CryptoCredentials } from '@models/elections/tba.model';
import { Ballot, Voting } from '@models/elections';
import { MainKey } from '@models/voting/blind-sign.model';

export namespace Portal {
  export interface Passphrase {
    passphrase: string;
    votingId: string;
  }

  export interface VotingPackage {
    seed: Seed;
    signature: string;
    credentials: CryptoCredentials;
    contractId: Voting['contractId'];
    mainKey: MainKey;
    votingId: Voting['id'];
    ballot?: Ballot;
    ballots?: Ballot[];
  }
}
