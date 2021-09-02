import { IsInt, IsUUID } from 'class-validator';
import { Expose, plainToClass, Type } from 'class-transformer';
import { DeepPartial } from '@utils/types/deep-partial.type';
import { Answer } from './answer.model';

export class Question {

  private answersMap: Map<Answer['id'], Answer> = new Map<Answer['id'], Answer>();

  @IsUUID()
  @Expose()
  id: string;

  @IsInt()
  @Expose()
  num: number;

  @Expose()
  externalId: string;

  @Expose()
  shortText: string;

  @Expose()
  fullText: string;

  @Expose()
  @Type(() => Answer)
  answers: Answer[];

  // todo внутренние штуки. понять стоит ли так делать
  completed = false;

  constructor(plain: DeepPartial<Question>) {
    if (!plain) {
      return;
    }
    Object.assign(this, plainToClass(Question, plain));
    this.answers.forEach((answer: Answer) => {
      this.answersMap.set(answer.id, answer);
    });
  }

  public getAnswerById(id: Answer['id']): Answer | undefined {
    return this.answersMap.get(id);
  }
}
