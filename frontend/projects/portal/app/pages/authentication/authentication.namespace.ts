import { Expose } from 'class-transformer';

export enum AuthenticationType {
  Sms = 'SMS',
  Email = 'EMAIL',
}

export enum CodeStatus {
  Sent = 'SENT',
  Verified = 'VERIFIED',
}

export enum AuthenticationStatus {
  Invalid = 'INVALID',
  Valid = 'VALID',
}

export class CodeState {

  @Expose()
  public readonly enteredIncorrectCode: boolean;

  @Expose()
  public readonly secondsToNextAttempt: number;

  @Expose()
  public readonly sentTo: string;

  @Expose()
  public readonly status: CodeStatus;

  @Expose()
  public readonly verificationType: AuthenticationType;
}

export interface AuthenticationText {
  pageHeader: string;
  confirmation: string;
  noAccessTitle: string;
  noAccess: string;
  codeNotCome: string;
}
