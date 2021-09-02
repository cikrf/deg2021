import { IsInt, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export enum VotingStatus {
  New = 'NEW',
  BlockchainElectionCreate = 'BLOCKCHAIN_ELECTION_CREATE',
  VoterListExportCompleted = 'VOTER_LIST_EXPORT_COMPLETED',
  Ready = 'READY',
  Preparation = 'PREPARATION',
  InProgress = 'IN_PROCESS',
  BallotIssuingCompleted = 'BALLOT_ISSUING_COMPLETED',
  BallotAcceptanceCompleted = 'BALLOT_ACCEPTANCE_COMPLETED',
  Completed = 'COMPLETED',
  ResultCompleted = 'RESULT_COMPLETED',
  ResultFailed = 'RESULT_FAILED',
}

export class Voting {

  @IsUUID()
  @Expose()
  id: string;

  @Expose()
  type: string; // todo выяснить что за типы

  @Expose()
  name: string;

  @Expose()
  externalId: string;

  @IsInt()
  @Expose()
  districtNumber: number;

  @Expose()
  status: VotingStatus;

  @Expose()
  contractId: string;

  @Expose()
  @Type(() => Date)
  plannedStartDateTime: Date;

  @Expose()
  @Type(() => Date)
  plannedEndDateTime: Date;

  @Expose()
  @Type(() => Date)
  factStartDateTime: Date;

  @Expose()
  @Type(() => Date)
  factEndDateTime: Date;

  @Expose()
  ballotIssued: boolean;

  @Expose()
  hasActiveVotingRight: boolean;

  get canVote(): boolean {
    return this.hasActiveVotingRight &&
      (this.status === VotingStatus.InProgress || (this.status === VotingStatus.BallotIssuingCompleted && this.ballotIssued)) ||
      this.ballotIssued;
  }

}
