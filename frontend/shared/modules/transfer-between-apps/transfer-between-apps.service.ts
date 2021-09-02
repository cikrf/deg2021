import { Inject, Injectable, Optional } from '@angular/core';
import { ApplicationUrlToken, PostDataToken, IsProductionToken } from '@modules/transfer-between-apps/transfer-between-apps.tokens';
import { APP_IS_PLATFORM_BROWSER } from '../../providers/is-platform';
import { from, Observable, of, throwError } from 'rxjs';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { map, mergeMap, pluck, switchMap, tap } from 'rxjs/operators';
import { CryptoService } from '@modules/crypto/crypto.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { WindowService } from '@modules/browser-services/window.service';

export const TRANSFER_KEY = 'transfer-post-data';
interface CryptoKey {
  password: string;
  salt: string;
  hmac?: string;
}
enum TransferMethod {
  Get = 'get',
  Post = 'post',
}
type PostPayload<E> = {
  key?: CryptoKey;
  extra?: E;
};
interface RawPostData {
  [TRANSFER_KEY]: string | undefined;
}

/**
 * Сервис для перехода на другое приложение. В отличии от обычного window.location.href = http://somesite.com мы можем передать POST данные
 * Более того сервис поможет зашифровать данные при переносе их в другое приложение, чтобы они не могли быть прочитаны сервером.
 * Для того чтобы принимать POST данные принимающе приложение должно быть SSR
 * Помимо шифрованных данных можно так же отправить Extra данные, они будут открыты серверу,
 * (по ним можно предзагрузить какие-то данные для фронта)
 * ___Использование___:
 * Импортируем модуль:
 * TransferBetweenAppsModule.forApp(
 *   http://localhost:4201, // приложение с/на которое осуществляется переход
 *   true, // true/false использовать или нет шифрование
 * );
 * Отправляющая сторона:
 * constructor(
 * transferBetweenAppsService: TransferBetweenAppsService<{ интерфейс основных данные}, { интерфейс открытых данных}>
 * ) {
 *    transferBetweenAppsService.transfer(
 *      {data: 'for enctryption'},
 *      {extra: 'open data'}
 *    );
 * }
 * Принимающая:
 * transferBetweenAppsService.extractPayload().subscribe(payload => assert(payload, {data: 'for enctryption'}));
 * transferBetweenAppsService.extractExtra().subscribe(extra => assert(payload, {extra: 'open data'}));
 */
@Injectable()
export class TransferBetweenAppsService<P = any, E = any | undefined> {

  private stateKey: StateKey<RawPostData> = makeStateKey(TRANSFER_KEY);
  private readonly rawPostData: RawPostData;
  private cache: string;

  constructor(
    @Inject(ApplicationUrlToken) private applicationUrl: string,
    @Inject(IsProductionToken) private isProduction: boolean = false,
    @Inject(APP_IS_PLATFORM_BROWSER) private isPlatformBrowser: boolean,
    private cryptoService: CryptoService,
    private transferState: TransferState,
    private windowService: WindowService,
    @Optional() @Inject(PostDataToken) rawPostData: RawPostData,
  ) {
    if (!this.isPlatformBrowser && rawPostData) {
      this.transferState.set(this.stateKey, rawPostData);
    } else if (this.isPlatformBrowser && this.transferState.hasKey(this.stateKey)) {
      this.rawPostData = this.transferState.get(this.stateKey, rawPostData);
    }
  }

  public createRequestData(
    payload?: P,
    extra?: E,
  ): Observable<[TransferMethod, string, string]> {

    if (!this.isProduction) {
      return of([
        TransferMethod.Get,
        this.getTransferUrl(
          this.packData({payload, extra}),
        ),
        '',
      ]);
    }

    if (payload) {
      return this.encrypt(payload).pipe(
        map(([encryptedData, key]: [string, CryptoKey]) => {
          return [
            TransferMethod.Post,
            this.getTransferUrl(encryptedData),
            this.packData({extra, key}),
          ];
        }),
      );
    } else if (extra) {
      return of([
        TransferMethod.Post,
        this.getTransferUrl(),
        this.packData({extra}),
      ]);
    } else {
      return of([
        TransferMethod.Get,
        this.getTransferUrl(),
        '',
      ]);
    }
  }

  public transfer(
    payload?: P,
    extra?: E,
  ): void {

    if (!this.isPlatformBrowser) {
      throw new Error('Cannot transfer data from server');
    }

    this.createRequestData(
      payload, extra,
    ).subscribe(([method, url, post]: [TransferMethod, string, string]) => {
      if (method === TransferMethod.Get) {
        this.windowService.goto(url);
      } else if (method === TransferMethod.Post) {
        this.sendWithPost(
          url,
          post,
        );
      }
    });
  }

  public extractPayload(): Observable<P | undefined> {

    if (!this.isPlatformBrowser) {
      return of(undefined);
    }

    if (!this.isProduction) {
      if (this.windowService.hash) {
        localStorage.setItem('tba-temporary', this.windowService.hash);
      }
      return of(this.windowService.hash || localStorage.getItem('tba-temporary')).pipe(
        map(hash => hash ? this.unpackData(hash) : {}),
        pluck('payload'),
      );
    }

    if (this.windowService.hash) {
      this.cache = String(this.windowService.hash);
    }

    return of(this.cache).pipe(
      switchMap((hash: string) => {
        const postData: PostPayload<E> | undefined = this.extractPostData();
        if (postData && postData.key) {
          return this.decrypt(hash, postData.key.password, postData.key.salt, postData.key.hmac);
        }
        return of(!!hash ? this.unpackData<P>(hash) : undefined);
      }),
      tap(() => this.windowService.hash = ''),
    );
  }

  public extractExtra(): Observable<E | undefined> {
    if (!this.isProduction) {
      if (this.windowService.hash) {
        localStorage.setItem('tba-temporary', this.windowService.hash);
      }
      return of(this.windowService.hash || localStorage.getItem('tba-temporary')).pipe(
        map(hash => hash ? this.unpackData(hash) : {}),
        pluck('extra'),
      );
    }
    const postData: PostPayload<E> | undefined = this.extractPostData();
    return of(postData?.extra);
  }

  private encrypt(payload: P): Observable<[string, CryptoKey]> {
    const password = this.cryptoService.createRandom(128);
    const salt = this.cryptoService.createRandom(32);
    const dataForEncryption: string = this.packData(payload);
    return fromPromise(this.cryptoService.encrypt(dataForEncryption, password, salt)).pipe(
      switchMap((encryptedData: string) => {
        return fromPromise(this.cryptoService.createHmac(
          encryptedData,
          password,
          salt,
        )).pipe(
          map((hmac: string) => {
            return [
              encryptedData,
              {
                hmac,
                password: this.cryptoService.toBase64(password),
                salt: this.cryptoService.toBase64(salt),
              },
            ] as [string, CryptoKey];
          }),
        );
      }),
    );
  }

  private decrypt(content: string, password: string, salt: string, hmac?: string): Observable<P> {
    return fromPromise(this.cryptoService.decrypt(
      content,
      this.cryptoService.fromBase64(password),
      this.cryptoService.fromBase64(salt),
      hmac,
    )).pipe(
      map((decrypted: string) => this.unpackData(decrypted) as P),
    );
  }

  private extractPostData(): PostPayload<E> | undefined {
    let rawPostData: RawPostData = {[TRANSFER_KEY]: undefined};

    if (this.isPlatformBrowser && this.transferState.hasKey(this.stateKey)) {
      rawPostData = this.transferState.get<RawPostData>(this.stateKey, rawPostData);
    }

    if (!this.isPlatformBrowser && !!this.rawPostData) {
      this.transferState.set<RawPostData>(this.stateKey, this.rawPostData);
      rawPostData = this.rawPostData;
    }

    if (rawPostData) {
      const content = rawPostData[TRANSFER_KEY];
      if (!content) {
        return undefined;
      }
      try {
        return this.unpackData(content);
      } catch (e) {
        console.warn(e);
        return undefined;
      }
    }
    return undefined;
  }

  private transferWithPost(postPayload: PostPayload<E>, hash?: string): void {
    this.sendWithPost(
      this.getTransferUrl(hash),
      this.packData(postPayload),
    );
  }

  private sendWithPost(url: string, postPayload: string): void {
    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'post';
    form.action = url;
    form.target = '_blank';
    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = TRANSFER_KEY;
    json.value = postPayload;
    form.appendChild(json);
    document.body.appendChild(form);
    form.submit();
  }

  private getTransferUrl(hash?: string): string {
    if (!hash) {
      return this.applicationUrl;
    }
    const url = new URL(this.applicationUrl);
    url.hash = encodeURIComponent(hash);
    return url.toString();
  }

  private packData<T>(payload: P | PostPayload<E> | {payload: P; extra: E}): string {
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  }

  private unpackData<T = PostPayload<E>>(pack: string): T {
    return JSON.parse(decodeURIComponent(atob(pack)));
  }
}
