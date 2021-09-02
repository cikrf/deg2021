import { IsBoolean, IsInt, IsUUID } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';
import { DeepPartial } from '@utils/types/deep-partial.type';

export class Answer {

  @IsUUID()
  @Expose()
  id: string;

  @Expose()
  externalId: string;

  @IsInt()
  @Expose()
  num: number;

  @Expose()
  text: string;

  @Expose()
  description: string;

  @Expose()
  @IsBoolean()
  disabled: boolean;

  @Expose()
  image: string;

  @Expose()
  rejectionReason: string;

  constructor(plain: DeepPartial<Answer>) {
    Object.assign(this, plainToClass(Answer, plain));
  }

}
