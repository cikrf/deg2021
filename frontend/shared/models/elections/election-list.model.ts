import { IsUUID } from 'class-validator';
import { Expose, Transform, TransformationType, Type } from 'class-transformer';
import { Voting } from './voting.model';
import { default as base58 } from '@utils/libs/base58.lib';
import { serverDateTransform } from '../../helpers/server-date.helper';

export enum ElectionType {
  Election = 'election',
  Referendum = 'referendum',
}

export class ElectionList {

  @IsUUID()
  @Expose()
  id: string;

  @Expose()
  type: ElectionType;

  @Expose()
  name: string;

  @Expose()
  externalId: string;

  @Expose()
  level: string;

  @Expose()
  @Transform(serverDateTransform)
  startDateTime: Date;

  @Expose()
  @Transform(serverDateTransform)
  endDateTime: Date;

  @Expose()
  ballotAcceptanceTimeout: number;

  @Expose()
  @Type(() => Voting)
  votings: Voting[];

}
