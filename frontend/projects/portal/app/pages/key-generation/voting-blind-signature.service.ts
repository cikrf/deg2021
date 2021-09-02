import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { bufferCount, map, mergeAll, mergeMap, shareReplay, switchMap, tap, timeout, toArray } from 'rxjs/operators';
import { Ballot, Voting } from '@models/elections';
import { BlindSignPublicKey } from '@models/voting';
import { BlindSign } from '@models/voting/blind-sign.model';
import { BlindSignRequest } from './key-generation.interfaces';
import { KeyGenerationService } from './key-generation.service';
import { BlindSignatureService } from '@modules/crypto/blind-signature.service';
import { plainToClass } from 'class-transformer';
import { CryptoService } from '@modules/crypto/crypto.service';
import { KeyGeneration } from './key-generation.namespace';
import { Portal } from '../../portal.namespace';
import Meta = KeyGeneration.Meta;
import VotingPackage = Portal.VotingPackage;

const BLIND_SIGN_QUERY_TIMEOUT = 3000;

@Injectable()
export class VotingBlindSignatureService {

  private seedsAndCredentials: Map<Voting['id'], Meta>;

  private blindSignCollector$: Subject<BlindSignRequest> = new ReplaySubject<BlindSignRequest>();
  private blindSigns$: Observable<BlindSign[]>;

  constructor(
    private keyGenerationService: KeyGenerationService,
    private blindSignatureService: BlindSignatureService,
    private cryptoService: CryptoService,
  ) { }

  /** @description  - Возвращает массив запакованных данных необходимых для перехода в анонимную зону */
  public getForAll(votingIds: Voting['id'][]): Observable<VotingPackage[]> {
    this.blindSigns$ = this.blindSignCollector$.pipe(
      bufferCount(votingIds.length),
      tap(() => this.blindSignCollector$.complete()),
      timeout(votingIds.length * BLIND_SIGN_QUERY_TIMEOUT),
      switchMap((requests: BlindSignRequest[]) => this.keyGenerationService.getBlindSign(requests)),
      shareReplay(),
    );

    this.seedsAndCredentials = new Map<Voting['id'], Meta>(
      votingIds.map((votingId: Voting['id']) => [
        votingId,
        plainToClass(Meta, {
          votingId,
          seed: this.cryptoService.createSeed(),
          credentials: this.cryptoService.createCredentials(),
        }),
      ]),
    );


    return this.keyGenerationService.getPublicKeys(votingIds).pipe(
      switchMap((publicKeys: BlindSignPublicKey[]) => this.getBlindSigns(publicKeys)),
      mergeAll(),
      map(([signature, blindSign]: [string, BlindSign]) => this.makeVotingPackage(signature, blindSign)),
      toArray(),
    );
  }

  /** @description - получение слепых подписей */
  private getBlindSigns(publicKeys: BlindSignPublicKey[]): Observable<[string, BlindSign][]> {
    return of(publicKeys).pipe(
      mergeAll(),
      mergeMap(publicKey => this.getBlindSign(publicKey)),
      toArray(),
    );
  }

  /** @description - Запрашивает недостающие данные голосования и мапит результат в VotingPackage */
  private makeVotingPackage(signature: string, blindSign: BlindSign): VotingPackage {
    const meta: Meta = this.seedsAndCredentials.get(blindSign.id) as Meta;
    if (!meta) {
      throw new Error('Не удается найти Meta при создании TbaItems');
    }
    const {votingId} = meta;

    return {
      votingId,
      signature,
      seed: meta.seed,
      credentials: meta.credentials,
      mainKey: blindSign.mainKey,
      contractId: blindSign.contractId,
    };
  }

  /** @description - Получение слепой подписи */
  private getBlindSign(publicKey: BlindSignPublicKey): Observable<[string, BlindSign]> {
    const meta = this.seedsAndCredentials.get(publicKey.votingId);
    if (!meta) {
      throw new Error('Не удается найти Meta при создании слепой подписи');
    }
    return this.blindSignatureService.sign<BlindSign>(
      meta.seed.publicKey,
      publicKey,
      (maskedPublicKey: string) => {
        this.blindSignCollector$.next({
          maskedPublicKey,
          votingId: meta.votingId,
          passphrase: meta.credentials.passwordAndSalt,
        });
        return this.blindSigns$.pipe(
          map((blindSigns: BlindSign[]) => {
            const blindSign: BlindSign | undefined = blindSigns.find(({id}) => id === meta.votingId);
            if (!blindSign) {
              throw new Error('Не удается найти blindSign по VotingId в blindSignRequest');
            }
            return blindSign;
          }),
        );
      },
    );
  }
}
