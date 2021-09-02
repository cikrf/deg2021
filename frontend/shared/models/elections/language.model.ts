import { Expose, plainToClass } from 'class-transformer';
import { DeepPartial } from '@utils/types/deep-partial.type';

export class Language {

  @Expose()
  public code: number;

  @Expose()
  public name: string;

  constructor(plain: DeepPartial<Language>) {
    Object.assign(this, plainToClass(Language, plain));
  }

}
