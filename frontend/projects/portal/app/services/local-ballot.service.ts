import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { fromPromise } from 'rxjs/internal-compatibility';
import { combineAll, first, map, mapTo, switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { REGISTRY_ENDPOINTS, TOKEN_KEY } from '../constants';
import { Token } from '../pages/key-generation/key-generation/key-generation.component';
import { CryptoService } from '@modules/crypto/crypto.service';
import { CryptoCredentials } from '@models/elections/tba.model';
import { Voting } from '@models/elections';
import { WindowService } from '@modules/browser-services/window.service';
import { Portal } from '../portal.namespace';
import Passphrase = Portal.Passphrase;
import VotingPackage = Portal.VotingPackage;

@Injectable({
  providedIn: 'root',
})
export class LocalBallotService {
  //eslint-disable-next-line @typescript-eslint/naming-convention
  public static SEPARATOR = ';;';

  private get esiaId(): number {
    return (jwtDecode(this.windowService.localStorage.getItem(TOKEN_KEY) || '') as Token)['urn:esia:sbj_id'];
  }

  constructor(
    private httpClient: HttpClient,
    private cryptoService: CryptoService,
    private windowService: WindowService,
  ) {
  }

  /** @description - Проверяет наличие данных о голосовании в localStorage */
  public has(votingId: Voting['id']): boolean {
    return Boolean(this.windowService.localStorage.getItem(this.key(votingId)));
  }

  /** @description - Записывает данные голосования в localStorage */
  public set(pack: VotingPackage): void {
    const key = [this.esiaId, pack.votingId].join(LocalBallotService.SEPARATOR);

    const encoder = new TextEncoder();
    const password = encoder.encode(pack.credentials.password);
    const salt = encoder.encode(pack.credentials.salt);

    const stringifyData = JSON.stringify({
      seed: pack.seed,
      signature: pack.signature,
      contractId: pack.contractId,
      mainKey: pack.mainKey,
    });

    fromPromise(this.cryptoService.encrypt(stringifyData, password, salt))
      .pipe(first())
      .subscribe((encryptedData) => {
        this.cryptoService.createHmac(encryptedData, password, salt).then((hmac: string) => {
          this.windowService.localStorage.setItem(key, [encryptedData, hmac].join(LocalBallotService.SEPARATOR));
        });
      });
  }

  /** @description - Собирает данные о голосовании из localStorage */
  public getForAll(votingIds: Voting['id'][]): Observable<VotingPackage[]> {
    return this.getPassphrases(votingIds)
      .pipe(
        switchMap((passphrases: Passphrase[]) =>
          passphrases.map(
            (passphrase: Passphrase) => this.decrypt(passphrase),
          ),
        ),
        combineAll(),
      );
  }

  /** @description - Удаляет данные о голосовании из localStorage */
  public clear(votingId: Voting['id']): void {
    this.windowService.window.localStorage.removeItem(this.key(votingId));
  }

  /**
   * @deprecated
   */
  public cleanUpBlindSigns(votingIds: Voting['id'][]): Observable<void> {
    votingIds.forEach(id => this.clear(id));
    return forkJoin(
      votingIds.map(
        (votingId: string) => this.httpClient.delete(REGISTRY_ENDPOINTS.CleanUpBlindSign + votingId),
      ),
    ).pipe(mapTo(undefined));
  }

  /** @description - Запрос получения кодовых фраз */
  public getPassphrases(votingIds: Voting['id'][]): Observable<Passphrase[]> {
    const params = new HttpParams().append('votingIds', votingIds.join(','));
    return this.httpClient.get<Passphrase[]>(REGISTRY_ENDPOINTS.Passphrases, {params});
  }

  /** @description - Расшифровывает данные о голосовании */
  private decrypt(passphrase: Passphrase): Observable<VotingPackage> {
    const cryptoCredentials = CryptoCredentials.getFromString(passphrase.passphrase);

    const encoder = new TextEncoder();
    const password = encoder.encode(cryptoCredentials.password);
    const salt = encoder.encode(cryptoCredentials.salt);
    const [content, hmac]: string[] =
      (this.windowService.localStorage.getItem(this.key(passphrase.votingId)) || '').split(LocalBallotService.SEPARATOR);

    return fromPromise(
      this.cryptoService.decrypt(
        content,
        password,
        salt,
        hmac,
      ),
    ).pipe(
      map(data => JSON.parse(data)),
      map((data: VotingPackage) => ({
        seed: data.seed,
        signature: data.signature,
        contractId: data.contractId,
        mainKey: data.mainKey,
        credentials: cryptoCredentials,
        votingId: passphrase.votingId,
      })),
    );
  }

  /** @description - Возвращает ключ localStorage необходимый для получения данных об голосовании */
  private key(votingId: Voting['id']): string {
    return [this.esiaId, votingId].join(LocalBallotService.SEPARATOR);
  }
}
