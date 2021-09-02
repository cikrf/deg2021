import { Vote } from './vote.interface';


interface TransactionData {
  vote: Vote[];
  blindSignature: string;
}

type ContractParamType = 'string';
type ContractParamKey = keyof TransactionData;

export class ContractParam {
  type: ContractParamType;
  key: ContractParamKey;
  value: string;
}

export type ContractParams = Array<ContractParam>;

export class Transaction {
  senderPublicKey: string;
  contractId: string;
  timestamp: number;
  params: ContractParams;
  fee: number;
  type: number;

  // todo следующие поля должны быть выпилены
  authorPublicKey: string;
  contractVersion: number;
}

export class TransactionWithBlindSignature extends Transaction {
  signature: string;
}

export class SignedTransaction extends Transaction {
  proofs: string[];
}

export class VoteResponse {
  contractId: string;
  signature: string;
  transactionId: string;
  transaction: Transaction;
  datatime: Date;
}
