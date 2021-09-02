import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContractParam, ContractParams, SignedTransaction, Transaction } from '@models/transaction';
import { Seed } from '@models/seed';
import { Vote } from '@models/vote.interface';
import { sign } from '@wavesenterprise/voting-sign-lib';
import { encrypt, encode } from '@wavesenterprise/rtk-encrypt';
import { MainKey } from '@models/voting/blind-sign.model';
import BN from 'bn.js';
import { fromPromise } from 'rxjs/internal-compatibility';
import { EncryptParams, QuestionConfig } from '@wavesenterprise/rtk-encrypt/dist/types';

interface RequiredTransactionData {
  vote: Uint8Array;
  blindSig: Uint8Array;
  operation: 'vote';
}

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {

  public encryptVote(bulletin: Array<Vote>, dimension: QuestionConfig[], mainKey: MainKey): Uint8Array {
    const params: EncryptParams = {
      bulletin,
      dimension,
      mainKey,
    };
    return encode(encrypt(params));
  }

  public createTransaction(
    seed: Seed,
    contractId: string,
    vote: Vote[],
    signature: string,
    mainKey: MainKey,
    maxMarks: number = 1,
    timestamp: number = Date.now(),
  ): Observable<Transaction | SignedTransaction> {
    const questionConfigs = this.getQuestionConfigs(vote, maxMarks);
    const params = this.convertObjectToContractParams({
      operation: 'vote',
      vote: this.encryptVote(vote, questionConfigs, mainKey),
      // @ts-ignore
      blindSig: new BN(signature, 'hex').toArrayLike(Uint8Array),
    });
    const transaction: Transaction = {
      contractId,
      timestamp,
      senderPublicKey: seed.publicKey,
      authorPublicKey: seed.publicKey,
      params,
      fee: 0,
      type: 104,
      contractVersion: 1,
    };
    return fromPromise(sign(transaction, seed));
  }

  private convertObjectToContractParams(input: RequiredTransactionData): ContractParams {
    return Object.entries(input).map(([key, value]: [string, string | Uint8Array]) => {
      const type: 'string' | 'binary' = typeof value === 'string' ? 'string' : 'binary';
      if (type !== 'string' && value instanceof Uint8Array) {
        value = 'base64:' + btoa(String.fromCharCode.apply(null, value));
      }
      return {
        key,
        value,
        type,
      } as ContractParam;
    });
  }

  private getQuestionConfigs(votes: Vote[], max: number = 1): QuestionConfig[] {
    return votes.map((vote: Vote) => {
      const config: QuestionConfig = {
        max,
        options: vote.length,
        min: 1,
      };
      return config;
    });
  }

}
