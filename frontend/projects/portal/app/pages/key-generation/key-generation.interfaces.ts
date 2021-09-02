import { Voting } from '@models/elections';

export interface BlindSignRequest {
  maskedPublicKey: string;
  passphrase: string;
  votingId: Voting['id'];
}
