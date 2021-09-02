import { Question, Answer } from '@models/elections';

export namespace Confirm {
  export type QuestionId = Question['id'];
  export type Answers = Answer[];
}
