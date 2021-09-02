import { Seed } from '@models/seed';
import { Expose, plainToClass, Transform, TransformationType, Type } from 'class-transformer';
import { DeepPartial } from '../../utils/types/deep-partial.type';
import { Ballot } from './ballot.model';
import { default as base58 } from '@utils/libs/base58.lib';
import { Voting } from '@models/elections/voting.model';
import { MainKey } from '@models/voting/blind-sign.model';

export const MARKS_ON_SINGLE_ANSWER = 1;

export class Tba {
  @Expose()
  public ballotIds: Ballot['id'][];

  constructor(plain: DeepPartial<Tba>) {
    Object.assign(this, plainToClass(Tba, plain));
  }

}

/**
 * Пока сделал отдельный ТБА для проверки возможности работы
 * Возможно нам нужна одна и та же сущность
 * Просто в Анонимке мы ждем массив BallotId, а для сверки отправляем подписи, ключи
 */
export class TbaTransfer {
  public seed: Seed;

  public signature: string;

  public ballotIds: string[];

  /** Специальная переменная для проверки работы браузера с большим hash */
  public hash?: string;
}

export class TbaPublicItem {

  @Expose()
  public mainKey: MainKey;

  @Expose()
  public votingId: Voting['id'];

  @Expose()
  public contractId: Voting['contractId'];

  @Expose()
  @Type(() => Ballot)
  public ballot: Ballot;

  constructor(plain: DeepPartial<TbaPublicItem>) {
    Object.assign(this, plainToClass(TbaPublicItem, plain));
  }
}

export class TbaPublic {

  @Expose()
  @Type(() => TbaPublicItem)
  items: TbaPublicItem[];

  @Expose()
  order: Voting['id'][];

  @Expose()
  a11ySettings?: string;

  constructor(plain: DeepPartial<TbaPublic>) {
    Object.assign(this, plainToClass(TbaPrivate, plain));
  }
}

export class TbaPrivateItem {

  @Expose()
  signature: string;

  @Expose()
  @Type(() => Seed)
  seed: Seed;

  @Expose()
  votingId: Voting['id'];

  constructor(plain: DeepPartial<TbaPrivateItem>) {
    Object.assign(this, plainToClass(TbaPrivateItem, plain));
  }
}

export class TbaPrivate {

  @Expose()
  @Type(() => TbaPrivateItem)
  items: TbaPrivateItem[];

  constructor(plain: DeepPartial<TbaPrivate>) {
    Object.assign(this, plainToClass(TbaPublic, plain));
  }
}

export class CryptoCredentials {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  static SEPARATOR = ';;';

  @Transform((value, plain, type: TransformationType) => {
    if (plain.password instanceof Uint8Array) {
      return base58.encode(plain.password);
    }
    return plain.password;
  })
  public password: string;

  @Transform((value, plain, type: TransformationType) => {
    if (plain.salt instanceof Uint8Array) {
      return base58.encode(plain.salt);
    }
    return plain.salt;
  })
  public salt: string;

  constructor(plain: DeepPartial<CryptoCredentials>) {
    Object.assign(this, plainToClass(CryptoCredentials, plain));
  }

  static getFromString(passwordAndSalt: string): CryptoCredentials {
    const [password, salt]: string[] = passwordAndSalt.split(CryptoCredentials.SEPARATOR);
    return new CryptoCredentials({
      password,
      salt,
    });
  }

  get passwordAndSalt(): string {
    return [this.password, this.salt].join(CryptoCredentials.SEPARATOR);
  }
}
