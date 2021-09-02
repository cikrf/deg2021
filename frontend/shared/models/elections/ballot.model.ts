import { IsInt, IsUUID } from 'class-validator';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { DeepPartial } from '../../utils/types/deep-partial.type';
import { Question } from './question.model';
import { Voting } from './voting.model';
import { serverDateTransform } from '../../helpers/server-date.helper';
import { Language } from './language.model';
import { VoteResponse } from '@models/transaction';

export const MARKS_ON_SINGLE_ANSWER = 1;

export class Ballot {

  @IsUUID()
  @Expose()
  public id: string;

  @Expose()
  public externalId: string;

  @Expose()
  public contractId: Voting['contractId'];

  @Expose()
  public votingId: Voting['id'];

  @Expose()
  public votingName: Voting['name'];

  @Expose()
  public name: string; // todo этого поля нет на бэкенде, но должно быть. это название бюллетеня

  @Expose()
  @IsInt()
  public maxMarks: number;

  @Expose()
  public marksType: string; // todo выяснить

  @Expose()
  @Type(() => Question)
  public questions: Question[];

  @Expose()
  @Transform(serverDateTransform)
  public plannedStartDateTime: Date;

  @Expose()
  @Type(serverDateTransform)
  public plannedEndDateTime: Date;

  @Expose()
  public languages: Language[];

  @Expose()
  public lang: Language['code'];

  @Expose()
  ballotAcceptanceTimeout: number;

  // todo внутренние штуки. понять стоит ли так делать
  public completed = false;
  public unlocked = false;
  public receipt: VoteResponse;

  public get isSingleAnswer(): boolean {
    return this.maxMarks === MARKS_ON_SINGLE_ANSWER;
  }

  public get hasLanguages(): boolean {
    return this.languages?.length > 1;
  }

  constructor(plain: DeepPartial<Ballot>) {
    Object.assign(this, plainToClass(Ballot, plain));
  }

}
