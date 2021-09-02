import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iif, Observable, of, ReplaySubject, throwError, zip } from 'rxjs';
import { catchError, map, mapTo, pluck, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { transformTo } from '@cikrf/gas-utils/operators';
import { arrayElementsSum } from '@utils/functions/array-elements-sum';

import { Transaction, TransactionWithBlindSignature } from '@models/transaction';
import { Vote } from '@models/vote.interface';
import { BlindSignatureService } from '@modules/crypto/blind-signature.service';
import { CryptoService } from '@modules/crypto/crypto.service';
import { Seed } from '@models/seed';
import { BlockchainService } from '@modules/blockchain/blockchain.service';
import { WindowService } from '@modules/browser-services/window.service';

import { CHECKOUT_ENDPOINTS, CHECKUP_LOCAL_STORAGE_KEY, CHECKUP_SESSION_STORAGE_KEY } from '../../projects/portal/app/constants';
import { classToPlain, plainToClass } from 'class-transformer';
import { BlindSign, BlindSignPublicKey, MainKey } from '@models/voting/blind-sign.model';
import { BlacklistService } from '../../projects/portal/app/services/blacklist.service';

interface FlowData {
  signature: string;
  blindSign: BlindSign;
  seed: Seed;
  tbaPrivate?: TbaPrivate | null;
  hash?: string;
}

function getVoteIndex(vote: Vote): number {
  return vote.findIndex(n => n === 1);
}

interface TbaPrivate {
  [key: string]: {
    seed: Seed;
    signature: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CheckupService {
  private result$ = new ReplaySubject<boolean>(1);
  private vote: Vote = this.createRandomVote();
  private password: Uint8Array = this.cryptoService.createRandom(8);
  private salt: Uint8Array = this.cryptoService.createRandom(8);
  private invoked = false;

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private blindSignatureService: BlindSignatureService,
    private blockChainService: BlockchainService,
    private windowService: WindowService,
    private errorHandler: ErrorHandler,
    private blacklistService: BlacklistService,
  ) {
  }

  public result(): Observable<boolean> {
    this.initCheckup();
    return this.result$;
  }

  /**
   * Инициализация проверки возможности голосования
   * Проверка на хеш, создание ключей и тп
   */
  private initCheckup(): void {
    if (this.invoked) {
      return;
    }
    this.invoked = true;
    const sessionStorageVariable = sessionStorage.getItem(CHECKUP_SESSION_STORAGE_KEY);
    const isHasVariableInSessionStorage = sessionStorageVariable !== null;
    const isAlreadyCheckedSuccess = isHasVariableInSessionStorage && sessionStorageVariable === 'true';
    const isAlreadyCheckedFail = isHasVariableInSessionStorage && sessionStorageVariable === 'false';

    /**
     * При наличии session storage со значением true, мы разрешаем пользователю дальше ходить
     * А при false кейсе, мы возвращаем false и не даем зайти на страницу генерации, а так же отправляем на страницу ошибки
     * При случае, когда вообще нет переменной из session storage пускаем запуск проверки checkup
     */
    if (isAlreadyCheckedSuccess) {
      return this.result$.next(true);
    }

    const seed = this.cryptoService.createSeed();

    iif(
      () => this.blacklistService.isCurrentInBlacklist() || isAlreadyCheckedFail,
      of(false),
      of(null).pipe(
        /** Получаем публичный ключ */
        switchMap(() => this.getPublicKey()),

        /** Получаем слепую подпись, на основе данных с public key */
        switchMap((publicKey: BlindSignPublicKey) => this.blindSignatureService.sign<BlindSign>(
          seed.publicKey,
          publicKey,
          (message: string) => this.sign(message),
        )),

        /** Маппим, добавляем seed, оно нужно для создание TBA hash и проверки возможности работы */
        map(([signature, blindSign]: [string, BlindSign]) => this.createTbaMeta({ blindSign, seed, signature })),

        /** Шифруем данные через transferBetweenAppsService */
        this.encryptTbaData.bind(this),

        /** Проверяем, что hash корректно работает на текущем браузере */
        tap((flowData: FlowData) => this.windowService.hash = flowData.hash || ''),

        /** Дешифруем строку из hash и убираем его */
        this.decryptAndRemoveHash.bind(this),

        /** Создание транзакции со слепой подписью */
        this.createTransactionWithBlindSignature.bind(this),

        /** Проверка данных */
        switchMap((tx: TransactionWithBlindSignature) => this.check(tx).pipe(pluck('choice'))),

        /** Сверка голосов */
        map((choice: Vote) => this.assertVotes(choice, this.vote)),
        mapTo(true),

        catchError((e: Error) => throwError(e)),
      ),
    )
      .pipe(
        catchError((e: Error) => {
          this.errorHandler.handleError(e);

          return of(false);
        }),
        tap((isSuccess: boolean) => {
          sessionStorage.setItem(CHECKUP_SESSION_STORAGE_KEY, isSuccess.toString());

          return isSuccess;
        }),
      )
      .subscribe(this.result$);
  }

  /** Получение публичных ключей */
  private getPublicKey(): Observable<BlindSignPublicKey> {
    return this.http.get(CHECKOUT_ENDPOINTS.PublicKey).pipe(
      transformTo(BlindSignPublicKey),
    );
  }

  /** Подписываем данные */
  private sign(message: string): Observable<BlindSign> {
    return this.http.get<BlindSign>(CHECKOUT_ENDPOINTS.BlindSign, {
      params: {
        message,
      },
    });
  }

  /** Сверка ответов */
  private check(transaction: TransactionWithBlindSignature): Observable<{ choice: Vote }> {
    return this.http.post<{ choice: Vote }>(CHECKOUT_ENDPOINTS.Vote, transaction);
  }

  /** Создание транзакции со слепой подписью */
  private createTransactionWithBlindSignature(
    stream: Observable<FlowData>,
  ): Observable<TransactionWithBlindSignature> {
    return stream.pipe(
      switchMap(({ blindSign, seed, signature }: FlowData) => {
        const { contractId, mainKey } = blindSign;

        return this.blockChainService.createTransaction(
          seed,
          contractId,
          [this.vote],
          signature,
          mainKey,
        ).pipe(
          map((tx: Transaction) => ({
            ... tx,
            signature,
          })),
          transformTo(TransactionWithBlindSignature),
        );
      }),
    );
  }

  private assertVotes(one: Vote, two: Vote): void {
    if (one.length === two.length) {
      if (arrayElementsSum(one) === arrayElementsSum(two)) {
        if (getVoteIndex(one) === getVoteIndex(two)) {
          return;
        }
      }
    }
    throw new Error('Browser checkup failed: Vote validation'); // todo error
  }

  private createRandomVote(): Vote {
    const randomLength = Math.floor(Math.random() * 10) + 1;
    const randomFill = Math.floor(Math.random() * randomLength);
    return new Array(randomLength).fill(null).map((v, i) => i === randomFill ? 1 : 0);
  }

  private createTbaMeta({ blindSign, seed, signature }: FlowData): void {
    const tbaPrivate: TbaPrivate = {
      [blindSign.id]: {
        seed,
        signature,
      },
    };
    localStorage.setItem(CHECKUP_LOCAL_STORAGE_KEY, JSON.stringify({
      signature,
      blindSign,
      seed,
      tbaPrivate,
    }));
  }

  private encryptTbaData(stream: Observable<void>): Observable<FlowData> {
    return stream.pipe(
      map(() => localStorage.getItem(CHECKUP_LOCAL_STORAGE_KEY)),
      tap((str: string | null) => {
        if (!str) {
          throw new Error('Not found LS item');
        }
      }),
      map((str: string) => JSON.parse(str)),
      switchMap(({ signature, blindSign, seed, tbaPrivate }: FlowData) => {
        const dataForEncryption: string = JSON.stringify({ signature, blindSign, seed, tbaPrivate });

        return fromPromise(
          this.cryptoService.encrypt(
            dataForEncryption,
            this.password,
            this.salt,
          ),
        )
          .pipe(
            map((encryptedPayload: string) => ({
              signature,
              blindSign,
              seed,
              tbaPrivate,
              hash: encryptedPayload,
            })),
          );
      }),
      tap(() => localStorage.removeItem(CHECKUP_LOCAL_STORAGE_KEY)),
    );
  }

  private decryptAndRemoveHash(stream: Observable<FlowData>): Observable<FlowData> {
    return stream.pipe(
      switchMap((flow: FlowData) => zip(
        /** Берем hash из урла и дешифруем */
        fromPromise(this.cryptoService.decrypt(
          decodeURI(this.windowService.hash),
          this.password,
          this.salt,
        )),
        /** Берем hash из внутренней переменной */
        fromPromise(this.cryptoService.decrypt(
          flow.hash || '',
          this.password,
          this.salt,
        )),
      ).pipe(
        /**
         * Ожидаем, что разные браузеры могут по разному хранить hash, поэтому сверяем дешифрованные варианты
         * Ибо внутренняя переменная не может ужаться, а hash в url - может
         */
        switchMap(([hashDecrypt, innerHashDecrypt]: [string, string]) => {
          try {
            this.windowService.hash = '';

            if (hashDecrypt !== innerHashDecrypt) {
              return throwError(flow);
            }

            return of(flow);
          } catch(e) {
            this.errorHandler.handleError(e);

            return throwError(e);
          }
        }),
      )),
    );
  }
}
