import { Type } from 'class-transformer';

export class UserDocument {
  public id: number; // 97940
  public issueDate: string; // "22.05.2010"
  public issueId: string; // "180003",
  public issuedBy: string; // "Министерством мира",
  // eslint-disable-next-line id-blacklist
  public number: string; // "081081",
  public series: string; // "0001",
  public type: string; // "RF_PASSPORT",
  public vrfStu: string; // "VERIFIED"
}

export class UserDocuments {

  @Type(() => UserDocument)
  public elements: UserDocument[];

  public size: number;
}

export class User {
  public birthDate: string; // "22.05.1990"
  public citizenship: string; // "RUS"
  public containsUpCfmCode: boolean; // false

  @Type(() => UserDocuments)
  public documents: UserDocuments;

  public firstName: string; // "Николай",
  public lastName: string; // "Пасынков",
  public middleName: string; // "Андреевич",
  public status: string; // "REGISTERED",
  public trusted: boolean; // true,
  public updatedOn: number; // 1584945583,
  public verifying: boolean; // false
  public phoneNumber: string;

  /**
   * @deprecated
   */
  public get fullName(): string {
    return ``;
  }

  /**
   * @deprecated
   */
  public get fio(): string {
    if (!this.lastName || !this.firstName || !this.middleName) {
      return '';
    }

    return [this.lastName, this.firstName, this.middleName].join(' ');
  }

  /**
   * @deprecated
   */
  public get firstNameAndMiddleName(): string {
    if (!this.lastName || !this.firstName) {
      return '';
    }

    return `${this.firstName} ${this.middleName}`;
  }
}
